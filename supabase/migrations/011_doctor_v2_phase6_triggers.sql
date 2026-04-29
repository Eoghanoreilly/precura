-- supabase/migrations/011_doctor_v2_phase6_triggers.sql
-- Doctor portal v2 Phase 6 - remaining trigger RPCs

-- =====================================================================
-- 1) open_case_for_chat: called after a substantive member chat message
-- =====================================================================

create or replace function public.open_case_for_chat(p_user_id uuid, p_message text, p_message_id uuid default null)
returns uuid
language plpgsql
security definer
as $$
declare
  v_case_id uuid;
  v_owner_id uuid;
  v_priority case_priority;
  v_emotional boolean;
  v_word_count int;
  v_clean text;
begin
  -- Substantive check: >5 words, not pure emoji. Caller can also pre-filter; we double-check.
  v_clean := regexp_replace(p_message, '[\p{So}\p{Cn}\s]+', ' ', 'g');
  v_word_count := array_length(regexp_split_to_array(trim(v_clean), '\s+'), 1);
  if v_word_count is null or v_word_count <= 5 then
    return null;
  end if;

  -- Emotional signal heuristic at the SQL layer (very conservative; the TS evaluator does the real work elsewhere)
  v_emotional := lower(p_message) ~ '(scared|worried|afraid|anxious|cant sleep|can''t sleep|dying|something serious)';
  v_priority := case when v_emotional then 'urgent'::case_priority else 'normal'::case_priority end;

  -- Reuse an existing open consultation case if one exists, otherwise open a new one
  select c.id into v_case_id
    from public.cases c
    where c.patient_id = p_user_id
      and c.category = 'consultation'
      and c.status in ('new', 'in_progress', 'awaiting_member')
    order by c.opened_at desc
    limit 1;
  if not found then
    -- Pick first doctor as owner
    select id into v_owner_id from public.profiles where role in ('doctor', 'both') order by created_at asc limit 1;
    insert into public.cases (patient_id, title, category, status, priority, owner_doctor_id)
      values (p_user_id, 'Member chat conversation', 'consultation', 'new', v_priority, v_owner_id)
      returning id into v_case_id;
    insert into public.case_events (case_id, kind, payload)
      values (v_case_id, 'status_changed', jsonb_build_object('from', null, 'to', 'new', 'reason', 'auto_chat_substantive'));
  end if;

  -- Spawn a reply_message task only if there isn't already one OPEN for this case
  if not exists (select 1 from public.tasks where case_id = v_case_id and kind = 'reply_message' and status in ('open', 'in_progress')) then
    insert into public.tasks (case_id, kind, title, due_at, priority, status, source, trigger_event_ref)
      values (
        v_case_id,
        'reply_message',
        'Reply to member',
        now() + (case when v_emotional then interval '24 hours' else interval '48 hours' end),
        v_priority,
        'open',
        'auto',
        jsonb_build_object('kind', 'chat_substantive', 'message_id', p_message_id, 'word_count', v_word_count, 'emotional', v_emotional)
      );
  end if;

  return v_case_id;
end;
$$;

grant execute on function public.open_case_for_chat(uuid, text, uuid) to authenticated;

-- =====================================================================
-- 2) handle_lab_return_for_panel: mark open order_test tasks done when a new panel arrives
-- =====================================================================

create or replace function public.handle_lab_return_for_panel(p_panel_id uuid)
returns int
language plpgsql
security definer
as $$
declare
  v_panel record;
  v_closed int := 0;
  r record;
begin
  select * into v_panel from public.panels where id = p_panel_id;
  if not found then
    raise exception 'panel % not found', p_panel_id;
  end if;
  for r in
    select t.id, t.case_id from public.tasks t
      join public.cases c on c.id = t.case_id
      where c.patient_id = v_panel.user_id
        and t.kind = 'order_test'
        and t.status in ('open', 'in_progress')
  loop
    update public.tasks set status = 'done', done_at = now() where id = r.id;
    insert into public.case_events (case_id, kind, payload)
      values (r.case_id, 'task_completed', jsonb_build_object('task_id', r.id, 'kind', 'order_test', 'reason', 'lab_return', 'panel_id', p_panel_id));
    v_closed := v_closed + 1;
  end loop;
  return v_closed;
end;
$$;

grant execute on function public.handle_lab_return_for_panel(uuid) to authenticated;

-- =====================================================================
-- 3) open_case_for_intake_completion: stub for the onboarding work-in-flight
-- =====================================================================

create or replace function public.open_case_for_intake_completion(p_user_id uuid, p_intake_summary text default null)
returns uuid
language plpgsql
security definer
as $$
declare
  v_case_id uuid;
  v_owner_id uuid;
begin
  -- Idempotency: only one onboarding case per patient
  select id into v_case_id from public.cases
    where patient_id = p_user_id and category = 'onboarding'
    order by opened_at desc limit 1;
  if found then
    return v_case_id;
  end if;
  select id into v_owner_id from public.profiles where role in ('doctor', 'both') order by created_at asc limit 1;
  insert into public.cases (patient_id, title, category, status, priority, owner_doctor_id, summary)
    values (p_user_id, 'Onboarding workup', 'onboarding', 'new', 'normal', v_owner_id, p_intake_summary)
    returning id into v_case_id;
  insert into public.tasks (case_id, kind, title, due_at, priority, status, source, trigger_event_ref)
    values (v_case_id, 'schedule_consult', 'Schedule welcome consult', now() + interval '48 hours', 'normal', 'open', 'auto', jsonb_build_object('kind', 'intake_completed'));
  insert into public.tasks (case_id, kind, title, due_at, priority, status, source, trigger_event_ref)
    values (v_case_id, 'review_intake', 'Review intake form', now() + interval '48 hours', 'normal', 'open', 'auto', jsonb_build_object('kind', 'intake_completed'));
  insert into public.case_events (case_id, kind, payload)
    values (v_case_id, 'status_changed', jsonb_build_object('from', null, 'to', 'new', 'reason', 'auto_intake_completed'));
  return v_case_id;
end;
$$;

grant execute on function public.open_case_for_intake_completion(uuid, text) to authenticated;

-- =====================================================================
-- 4) fire_followup_checks: scans for cases whose followup_at has come due
--    Called by a daily cron job. Opens a new follow-up case per fired case.
-- =====================================================================

create or replace function public.fire_followup_checks()
returns int
language plpgsql
security definer
as $$
declare
  v_count int := 0;
  r record;
  v_new_case_id uuid;
begin
  for r in
    select c.id, c.patient_id, c.category, c.title, c.followup_at, c.owner_doctor_id
      from public.cases c
      where c.followup_at is not null
        and c.followup_at <= now()
        and not exists (
          select 1 from public.cases child
          where child.patient_id = c.patient_id
            and child.category = c.category
            and child.created_at >= c.followup_at - interval '1 day'
        )
  loop
    insert into public.cases (patient_id, title, category, status, priority, owner_doctor_id)
      values (r.patient_id, 'Follow-up: ' || r.title, r.category, 'new', 'normal', r.owner_doctor_id)
      returning id into v_new_case_id;
    insert into public.tasks (case_id, kind, title, due_at, priority, status, source, trigger_event_ref)
      values (v_new_case_id, 'followup_check', 'Check on member follow-up', now() + interval '7 days', 'normal', 'open', 'auto', jsonb_build_object('kind', 'followup_fired', 'parent_case_id', r.id));
    insert into public.case_events (case_id, kind, payload)
      values (r.id, 'followup_fired', jsonb_build_object('child_case_id', v_new_case_id));
    insert into public.case_events (case_id, kind, payload)
      values (v_new_case_id, 'status_changed', jsonb_build_object('from', null, 'to', 'new', 'reason', 'auto_followup_fired', 'parent_case_id', r.id));
    -- Clear followup_at on parent so we don't fire it again next run
    update public.cases set followup_at = null where id = r.id;
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- =====================================================================
-- 5) fire_inactive_checkins: scans for patients with no activity in 90+ days
-- =====================================================================

create or replace function public.fire_inactive_checkins()
returns int
language plpgsql
security definer
as $$
declare
  v_count int := 0;
  v_owner_id uuid;
  r record;
  v_new_case_id uuid;
begin
  select id into v_owner_id from public.profiles where role in ('doctor', 'both') order by created_at asc limit 1;
  for r in
    select p.id, p.display_name from public.profiles p
      where (p.role = 'patient' or p.role = 'both')
        and not exists (
          select 1 from public.panels x where x.user_id = p.id and x.created_at > now() - interval '90 days'
        )
        and not exists (
          select 1 from public.chat_messages cm
          join public.chat_sessions cs on cs.id = cm.session_id
          where cs.user_id = p.id and cm.role = 'user' and cm.created_at > now() - interval '90 days'
        )
        and not exists (
          select 1 from public.cases c where c.patient_id = p.id and c.status in ('new', 'in_progress', 'replied', 'awaiting_member')
        )
        -- avoid duplicate fires within 30 days
        and not exists (
          select 1 from public.cases c2 where c2.patient_id = p.id and c2.title like 'Inactive check-in%' and c2.created_at > now() - interval '30 days'
        )
  loop
    insert into public.cases (patient_id, title, category, status, priority, owner_doctor_id)
      values (r.id, 'Inactive check-in', 'consultation', 'new', 'low', v_owner_id)
      returning id into v_new_case_id;
    insert into public.tasks (case_id, kind, title, due_at, priority, status, source, trigger_event_ref)
      values (v_new_case_id, 'checkin_outreach', 'Reach out to inactive member', now() + interval '14 days', 'low', 'open', 'auto', jsonb_build_object('kind', 'inactive_90d'));
    insert into public.case_events (case_id, kind, payload)
      values (v_new_case_id, 'status_changed', jsonb_build_object('from', null, 'to', 'new', 'reason', 'auto_inactive_90d'));
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- pg_cron extension may not be available; if it is, we schedule the daily jobs.
-- If pg_cron is not installed, these statements will fail; the migration itself does NOT fail because we wrap in DO block with exception handling.

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    -- Schedule daily at 02:00 UTC
    perform cron.schedule('precura_followup_checks', '0 2 * * *', 'SELECT public.fire_followup_checks();');
    perform cron.schedule('precura_inactive_checkins', '0 2 * * *', 'SELECT public.fire_inactive_checkins();');
  else
    raise notice 'pg_cron not installed; daily jobs not scheduled. Call fire_followup_checks() and fire_inactive_checkins() from external scheduler.';
  end if;
end $$;
