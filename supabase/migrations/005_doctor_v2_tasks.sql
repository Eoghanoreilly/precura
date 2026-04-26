-- supabase/migrations/005_doctor_v2_tasks.sql
-- Doctor portal v2 - tasks table
-- See spec: 2026-04-25-doctor-portal-v2-design.md

create type task_kind as enum (
  'review_panel',
  'reply_message',
  'write_note',
  'order_test',
  'send_referral',
  'schedule_consult',
  'consult_prep',
  'write_training_plan',
  'followup_check',
  'checkin_outreach',
  'review_intake',
  'custom'
);

create type task_status as enum (
  'open',
  'in_progress',
  'done',
  'skipped',
  'blocked'
);

create type task_source as enum ('auto', 'doctor');

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references public.cases(id) on delete cascade not null,
  kind task_kind not null,
  title text not null,
  due_at timestamptz,
  priority case_priority not null default 'normal',
  status task_status not null default 'open',
  assignee_doctor_id uuid references public.profiles(id) on delete set null,
  source task_source not null default 'auto',
  trigger_event_ref jsonb,
  created_at timestamptz not null default now(),
  done_at timestamptz
);

create index idx_tasks_case on public.tasks (case_id);
create index idx_tasks_status_due on public.tasks (status, due_at);
create index idx_tasks_assignee_status on public.tasks (assignee_doctor_id, status);

alter table public.tasks enable row level security;
