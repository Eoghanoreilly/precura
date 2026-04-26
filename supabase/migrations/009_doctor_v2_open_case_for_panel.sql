-- supabase/migrations/009_doctor_v2_open_case_for_panel.sql
-- Auto-create a panel_review case + review_panel task when a panel uploads.
-- Idempotent: returns existing case if one already exists for this panel.

create or replace function public.open_case_for_panel(p_panel_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_panel record;
  v_case_id uuid;
  v_owner_id uuid;
  v_flag_count int;
  v_priority case_priority;
  v_month_label text;
  v_title text;
begin
  -- Lock the panel row so concurrent RPC calls for the same panel serialize.
  -- Without this, two concurrent calls could pass the idempotency checks before
  -- either commits, with one failing on the unique-index constraint.
  select * into v_panel from public.panels where id = p_panel_id for update;
  if not found then
    raise exception 'panel % not found', p_panel_id;
  end if;

  -- Idempotency path 1: if a case already references this panel via migrated_from_panel_id, return it
  select id into v_case_id from public.cases
    where migrated_from_panel_id = p_panel_id
    limit 1;
  if found then
    return v_case_id;
  end if;

  -- Idempotency path 2: reuse an existing open panel_review case for this patient with no migrated link
  -- (covers cases where the trigger fires twice, or an explicit case predates the panel)
  select c.id into v_case_id
    from public.cases c
    where c.patient_id = v_panel.user_id
      and c.category = 'panel_review'
      and c.status in ('new', 'in_progress')
    order by c.opened_at desc
    limit 1;
  if found then
    -- Link the panel to the existing case via migrated_from_panel_id for future idempotency
    update public.cases set migrated_from_panel_id = p_panel_id where id = v_case_id and migrated_from_panel_id is null;
    return v_case_id;
  end if;

  -- Determine flag count from biomarkers (may be 0 if biomarkers inserted later)
  select count(*) into v_flag_count from public.biomarkers
    where panel_id = p_panel_id
      and ((ref_range_high is not null and value > ref_range_high)
        or (ref_range_low is not null and value < ref_range_low));
  v_priority := case when v_flag_count > 0 then 'urgent'::case_priority else 'normal'::case_priority end;

  -- Pick the single GP as owner (any user with role doctor or both)
  select id into v_owner_id from public.profiles
    where role in ('doctor', 'both')
    order by created_at asc
    limit 1;

  v_month_label := to_char(v_panel.panel_date, 'Mon YYYY');
  v_title := 'Panel review - ' || v_month_label;

  -- Idempotency path 3: fresh insert
  insert into public.cases (
    patient_id, title, category, status, priority, owner_doctor_id, migrated_from_panel_id
  ) values (
    v_panel.user_id, v_title, 'panel_review', 'new', v_priority, v_owner_id, p_panel_id
  ) returning id into v_case_id;

  insert into public.tasks (
    case_id, kind, title, due_at, priority, status, source, trigger_event_ref
  ) values (
    v_case_id,
    'review_panel',
    'Review panel',
    v_panel.created_at + interval '72 hours',
    v_priority,
    'open',
    'auto',
    jsonb_build_object('kind', 'panel_uploaded', 'panel_id', p_panel_id)
  );

  insert into public.case_events (case_id, kind, payload)
    values (v_case_id, 'status_changed', jsonb_build_object('from', null, 'to', 'new', 'reason', 'auto_panel_uploaded'));

  return v_case_id;
end;
$$;

grant execute on function public.open_case_for_panel(uuid) to authenticated;
