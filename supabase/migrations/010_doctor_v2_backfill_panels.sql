-- supabase/migrations/010_doctor_v2_backfill_panels.sql
-- One-time backfill from existing panels.review_status into cases + tasks.
-- Idempotent via cases.migrated_from_panel_id unique index.

do $$
declare
  r record;
  v_case_id uuid;
  v_owner_id uuid;
  v_flag_count int;
  v_priority case_priority;
  v_status case_status;
  v_closed_at timestamptz;
  v_on_hold_reason text;
begin
  select id into v_owner_id from public.profiles
    where role in ('doctor', 'both')
    order by created_at asc
    limit 1;

  for r in
    select p.id, p.user_id, p.panel_date, p.created_at, p.review_status, p.reviewed_at, p.defer_reason
      from public.panels p
      where not exists (select 1 from public.cases where migrated_from_panel_id = p.id)
  loop
    select count(*) into v_flag_count from public.biomarkers
      where panel_id = r.id
        and ((ref_range_high is not null and value > ref_range_high)
          or (ref_range_low is not null and value < ref_range_low));
    v_priority := case when v_flag_count > 0 then 'urgent'::case_priority else 'normal'::case_priority end;

    -- Map legacy review_status to v2 case_status
    if r.review_status = 'pending' then
      v_status := 'new';
      v_closed_at := null;
      v_on_hold_reason := null;
    elsif r.review_status in ('acknowledged_no_note', 'acknowledged_with_note') then
      v_status := 'closed';
      v_closed_at := coalesce(r.reviewed_at, now());
      v_on_hold_reason := null;
    elsif r.review_status = 'deferred' then
      v_status := 'on_hold';
      v_closed_at := null;
      v_on_hold_reason := coalesce(r.defer_reason, 'deferred (legacy)');
    else
      v_status := 'new';
      v_closed_at := null;
      v_on_hold_reason := null;
    end if;

    insert into public.cases (
      patient_id, title, category, status, priority, owner_doctor_id,
      opened_at, closed_at, closed_reason, on_hold_reason, migrated_from_panel_id
    ) values (
      r.user_id,
      'Panel review - ' || to_char(r.panel_date, 'Mon YYYY'),
      'panel_review',
      v_status,
      v_priority,
      v_owner_id,
      r.created_at,
      v_closed_at,
      case when v_status = 'closed' then 'auto_migrated_from_v1' else null end,
      v_on_hold_reason,
      r.id
    ) returning id into v_case_id;

    -- Only spawn a task if the case is not already terminal
    if v_status in ('new', 'in_progress') then
      insert into public.tasks (
        case_id, kind, title, due_at, priority, status, source, trigger_event_ref
      ) values (
        v_case_id,
        'review_panel',
        'Review panel',
        r.created_at + interval '72 hours',
        v_priority,
        'open',
        'auto',
        jsonb_build_object('kind', 'panel_uploaded', 'panel_id', r.id, 'migrated', true)
      );
    end if;

    -- Backfill annotations: link annotations on this panel to the new case
    update public.annotations
      set case_id = v_case_id
      where target_type = 'panel' and target_id = r.id and case_id is null;

  end loop;
end $$;
