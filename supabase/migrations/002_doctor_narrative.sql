-- supabase/migrations/002_doctor_narrative.sql
-- Foundation for doctor-portal narrative v1:
-- review state machine, panel-open audit, emotional-rail audit, cached LLM pre-reads

-- Enum for review state
create type panel_review_status as enum (
  'pending',
  'acknowledged_no_note',
  'acknowledged_with_note',
  'deferred'
);

-- Panels review fields
alter table panels add column if not exists review_status panel_review_status not null default 'pending';
alter table panels add column if not exists reviewed_at timestamptz;
alter table panels add column if not exists reviewed_by uuid references profiles(id) on delete set null;
alter table panels add column if not exists defer_reason text;

create index if not exists panels_review_status_idx on panels(review_status);

-- Profiles demo flag
alter table profiles add column if not exists demo boolean not null default false;

-- Panel views audit
create table if not exists panel_views (
  id uuid primary key default gen_random_uuid(),
  panel_id uuid not null references panels(id) on delete cascade,
  viewer_id uuid not null references profiles(id) on delete cascade,
  opened_at timestamptz not null default now()
);

create index if not exists panel_views_panel_id_idx on panel_views(panel_id);

alter table panel_views enable row level security;

create policy "panel_views_read_mutual" on panel_views
  for select
  using (
    exists (
      select 1 from panels p
      where p.id = panel_id
        and (p.user_id = auth.uid() or exists (
          select 1 from profiles pr where pr.id = auth.uid() and pr.role in ('doctor','both')
        ))
    )
  );

create policy "panel_views_insert_self" on panel_views
  for insert
  with check (viewer_id = auth.uid());

-- Emotional rail toggles
create table if not exists emotional_rail_toggles (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references profiles(id) on delete cascade,
  member_id uuid not null references profiles(id) on delete cascade,
  action text not null check (action in ('opened','dismissed')),
  was_auto_triggered boolean not null default false,
  at timestamptz not null default now()
);

create index if not exists emo_toggles_member_idx on emotional_rail_toggles(member_id, at desc);

alter table emotional_rail_toggles enable row level security;

create policy "emo_toggles_doctor_read" on emotional_rail_toggles
  for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('doctor','both'))
  );

create policy "emo_toggles_doctor_insert" on emotional_rail_toggles
  for insert
  with check (
    doctor_id = auth.uid()
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('doctor','both'))
  );

-- Precura pre-reads (cached LLM output)
create table if not exists precura_pre_reads (
  id uuid primary key default gen_random_uuid(),
  panel_id uuid not null unique references panels(id) on delete cascade,
  narrative text not null,
  facts_json jsonb not null,
  generated_at timestamptz not null default now(),
  model text not null default 'claude-haiku-4-5'
);

alter table precura_pre_reads enable row level security;

create policy "pre_reads_read_mutual" on precura_pre_reads
  for select
  using (
    exists (
      select 1 from panels p
      where p.id = panel_id
        and (p.user_id = auth.uid() or exists (
          select 1 from profiles pr where pr.id = auth.uid() and pr.role in ('doctor','both')
        ))
    )
  );

-- pre_reads writes only via service role; no user-role insert policy
