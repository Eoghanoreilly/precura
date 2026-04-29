-- supabase/migrations/007_doctor_v2_profile_additions.sql
-- Add membership tier to profiles and case_id reference to annotations

create type membership_tier as enum ('standard', 'plus', 'paused');

alter table public.profiles
  add column if not exists tier membership_tier not null default 'standard',
  add column if not exists tier_started_at timestamptz,
  add column if not exists consult_minutes_used_this_year integer not null default 0,
  add column if not exists panels_reviewed_this_year integer not null default 0;

alter table public.annotations
  add column if not exists case_id uuid references public.cases(id) on delete set null;

create index if not exists idx_annotations_case on public.annotations (case_id);
