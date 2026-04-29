-- supabase/migrations/006_doctor_v2_supporting.sql

create type case_link_relation as enum ('follows', 'precedes', 'relates_to', 'duplicates');

create table public.case_links (
  id uuid default gen_random_uuid() primary key,
  from_case_id uuid references public.cases(id) on delete cascade not null,
  to_case_id uuid references public.cases(id) on delete cascade not null,
  relation case_link_relation not null,
  created_at timestamptz not null default now()
);
create index idx_case_links_from on public.case_links (from_case_id);
create index idx_case_links_to on public.case_links (to_case_id);

create type case_event_kind as enum (
  'status_changed',
  'opened_by_doctor',
  'note_posted',
  'task_completed',
  'order_placed',
  'referral_sent',
  'member_acted',
  'followup_fired',
  'linked',
  'commented'
);

create table public.case_events (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references public.cases(id) on delete cascade not null,
  kind case_event_kind not null,
  payload jsonb not null default '{}',
  actor_id uuid references public.profiles(id) on delete set null,
  occurred_at timestamptz not null default now()
);
create index idx_case_events_case_time on public.case_events (case_id, occurred_at desc);

create table public.patient_summaries (
  patient_id uuid primary key references public.profiles(id) on delete cascade,
  summary text not null,
  generated_at timestamptz not null default now(),
  inputs_hash text not null
);

create type billing_billed_against as enum ('membership', 'out_of_pocket');

create table public.billing_items (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references public.profiles(id) on delete cascade not null,
  case_id uuid references public.cases(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  code text not null,
  qty numeric not null default 1,
  unit text not null default 'item',
  sek_amount numeric,
  billed_against billing_billed_against not null default 'membership',
  occurred_at timestamptz not null default now()
);
create index idx_billing_patient_time on public.billing_items (patient_id, occurred_at desc);
create index idx_billing_code on public.billing_items (code);

alter table public.case_links enable row level security;
alter table public.case_events enable row level security;
alter table public.patient_summaries enable row level security;
alter table public.billing_items enable row level security;
