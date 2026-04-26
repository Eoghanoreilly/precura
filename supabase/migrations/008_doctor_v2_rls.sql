-- supabase/migrations/008_doctor_v2_rls.sql
-- RLS policies for doctor portal v2 tables
-- All write paths go through service role; user-role policies are read-only.
-- Members must NOT read tasks/cases/case_events/case_links/billing_items.

-- Helper: is current user a doctor?
create or replace function public.is_doctor()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('doctor', 'both')
  );
$$;

-- Doctors can read cases
create policy "doctors_read_cases" on public.cases
  for select using (public.is_doctor());

-- Doctors can read tasks
create policy "doctors_read_tasks" on public.tasks
  for select using (public.is_doctor());

-- Doctors can read case links
create policy "doctors_read_case_links" on public.case_links
  for select using (public.is_doctor());

-- Doctors can read case events
create policy "doctors_read_case_events" on public.case_events
  for select using (public.is_doctor());

-- Doctors can read billing items
create policy "doctors_read_billing" on public.billing_items
  for select using (public.is_doctor());

-- Doctors can read all patient summaries
create policy "doctors_read_summaries" on public.patient_summaries
  for select using (public.is_doctor());

-- Members can read their own patient summary
create policy "members_read_own_summary" on public.patient_summaries
  for select using (patient_id = auth.uid());

-- No insert/update/delete policies for user roles. All writes via service role.

-- Explicit RESTRICTIVE deny policies for role=patient on doctor-internal tables.
-- Defense-in-depth: even if a future positive policy is added that grants broader
-- access, these RESTRICTIVE policies still prevent patient reads.

create policy "deny_patient_read_cases" on public.cases
  as restrictive for select to authenticated
  using (not exists (select 1 from public.profiles where id = auth.uid() and role = 'patient'));

create policy "deny_patient_read_tasks" on public.tasks
  as restrictive for select to authenticated
  using (not exists (select 1 from public.profiles where id = auth.uid() and role = 'patient'));

create policy "deny_patient_read_case_links" on public.case_links
  as restrictive for select to authenticated
  using (not exists (select 1 from public.profiles where id = auth.uid() and role = 'patient'));

create policy "deny_patient_read_case_events" on public.case_events
  as restrictive for select to authenticated
  using (not exists (select 1 from public.profiles where id = auth.uid() and role = 'patient'));

create policy "deny_patient_read_billing" on public.billing_items
  as restrictive for select to authenticated
  using (not exists (select 1 from public.profiles where id = auth.uid() and role = 'patient'));
