-- supabase/migrations/004_doctor_v2_cases.sql
-- Doctor portal v2 - cases table + sequence
-- See spec: 2026-04-25-doctor-portal-v2-design.md

create sequence if not exists cases_seq start with 2000;

create type case_category as enum (
  'panel_review',
  'consultation',
  'coaching',
  'treatment_followup',
  'onboarding',
  'referral_followup'
);

create type case_status as enum (
  'new',
  'in_progress',
  'replied',
  'awaiting_member',
  'on_hold',
  'closed'
);

create type case_priority as enum ('urgent', 'normal', 'low');

create table public.cases (
  id uuid default gen_random_uuid() primary key,
  case_id_short text unique not null default ('CASE-' || nextval('cases_seq')::text),
  patient_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category case_category not null,
  status case_status not null default 'new',
  priority case_priority not null default 'normal',
  owner_doctor_id uuid references public.profiles(id) on delete set null,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_reason text,
  followup_at timestamptz,
  on_hold_reason text,
  summary text,
  summary_generated_at timestamptz,
  tags text[] not null default '{}',
  migrated_from_panel_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cases_on_hold_requires_reason check ((status <> 'on_hold') or (on_hold_reason is not null))
);

create index idx_cases_patient_status on public.cases (patient_id, status);
create index idx_cases_status_opened on public.cases (status, opened_at desc);
create index idx_cases_category on public.cases (category);
create unique index idx_cases_migrated_from_panel on public.cases (migrated_from_panel_id) where migrated_from_panel_id is not null;

alter table public.cases enable row level security;
