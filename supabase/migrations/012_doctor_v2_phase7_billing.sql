-- supabase/migrations/012_doctor_v2_phase7_billing.sql
-- Phase 7 - billing emission RPCs that handle tier-allowance logic + counter increments

-- =====================================================================
-- emit_billing_for_action: orchestrates billing emission with tier logic
-- =====================================================================

create or replace function public.emit_billing_for_action(
  p_patient_id uuid,
  p_case_id uuid,
  p_task_id uuid,
  p_action_code text,
  p_qty numeric default 1,
  p_unit text default 'item',
  p_external_sek numeric default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_billing_id uuid;
  v_tier membership_tier;
  v_consult_used int;
  v_panels_used int;
  v_membership_qty numeric;
  v_oop_qty numeric;
  v_oop_sek numeric;
begin
  select tier, consult_minutes_used_this_year, panels_reviewed_this_year
    into v_tier, v_consult_used, v_panels_used
    from public.profiles where id = p_patient_id;

  -- Branch on action code; defaults to membership-included
  if p_action_code = 'PANEL_REVIEWED_WITH_NOTE' then
    insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
      values (p_patient_id, p_case_id, p_task_id, p_action_code, p_qty, p_unit, null, 'membership')
      returning id into v_billing_id;
    update public.profiles set panels_reviewed_this_year = panels_reviewed_this_year + p_qty::int where id = p_patient_id;

  elsif p_action_code = 'CONSULT_MINUTES' then
    -- Plus tier: 60 min/year included; over -> 12 SEK/min out_of_pocket
    if v_tier = 'plus' then
      v_membership_qty := least(p_qty, greatest(0, 60 - v_consult_used));
      v_oop_qty := p_qty - v_membership_qty;
    else
      v_membership_qty := 0;
      v_oop_qty := p_qty;
    end if;
    if v_membership_qty > 0 then
      insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
        values (p_patient_id, p_case_id, p_task_id, p_action_code, v_membership_qty, 'min', null, 'membership')
        returning id into v_billing_id;
    end if;
    if v_oop_qty > 0 then
      v_oop_sek := v_oop_qty * 12;
      insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
        values (p_patient_id, p_case_id, p_task_id, p_action_code, v_oop_qty, 'min', v_oop_sek, 'out_of_pocket')
        returning id into v_billing_id;
    end if;
    update public.profiles
      set consult_minutes_used_this_year = consult_minutes_used_this_year + p_qty::int
      where id = p_patient_id;

  elsif p_action_code = 'PANEL_ORDERED' then
    -- The membership "order placed" line is included; the lab cost is out_of_pocket
    insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
      values (p_patient_id, p_case_id, p_task_id, p_action_code, p_qty, p_unit, null, 'membership')
      returning id into v_billing_id;
    if p_external_sek is not null and p_external_sek > 0 then
      insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
        values (p_patient_id, p_case_id, p_task_id, 'PANEL_LAB_COST', 1, 'item', p_external_sek, 'out_of_pocket')
        returning id into v_billing_id;
    end if;

  elsif p_action_code = 'TRAINING_PLAN_CREATED' then
    insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
      values (p_patient_id, p_case_id, p_task_id, p_action_code, p_qty, 'item', coalesce(p_external_sek, 1490), 'out_of_pocket')
      returning id into v_billing_id;

  else
    -- ASYNC_MESSAGE_THREAD, REFERRAL_SENT, custom: included in membership
    insert into public.billing_items (patient_id, case_id, task_id, code, qty, unit, sek_amount, billed_against)
      values (p_patient_id, p_case_id, p_task_id, p_action_code, p_qty, p_unit, null, 'membership')
      returning id into v_billing_id;
  end if;
  return v_billing_id;
end;
$$;

grant execute on function public.emit_billing_for_action(uuid, uuid, uuid, text, numeric, text, numeric) to authenticated;

-- =====================================================================
-- aggregate_async_threads: scans chat sessions for member-side activity
-- in the last 24h and emits one ASYNC_MESSAGE_THREAD per active member-day pair.
-- Idempotent via a uniqueness check on (patient_id, code, date(occurred_at)).
-- =====================================================================

create or replace function public.aggregate_async_threads()
returns int
language plpgsql
security definer
as $$
declare
  v_count int := 0;
  r record;
begin
  for r in
    select cs.user_id as patient_id, count(distinct cm.id) as msg_count
      from public.chat_sessions cs
      join public.chat_messages cm on cm.session_id = cs.id
      where cm.role = 'user'
        and cm.created_at >= now() - interval '24 hours'
      group by cs.user_id
  loop
    -- Idempotency: skip if already emitted today
    if not exists (
      select 1 from public.billing_items
        where patient_id = r.patient_id
          and code = 'ASYNC_MESSAGE_THREAD'
          and date(occurred_at) = current_date
    ) then
      insert into public.billing_items (patient_id, code, qty, unit, billed_against)
        values (r.patient_id, 'ASYNC_MESSAGE_THREAD', 1, 'item', 'membership');
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end;
$$;

-- =====================================================================
-- reset_annual_counters: zeros yearly counters at jan 1 (call once a year)
-- =====================================================================

create or replace function public.reset_annual_counters()
returns int
language plpgsql
security definer
as $$
begin
  update public.profiles set consult_minutes_used_this_year = 0, panels_reviewed_this_year = 0;
  return 1;
end;
$$;
