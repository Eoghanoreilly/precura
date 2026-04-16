-- Precura v0 schema
-- Two trusted users, mutual read access, personal write access

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text not null,
  role text not null default 'patient' check (role in ('patient', 'doctor', 'both')),
  created_at timestamptz default now()
);

-- Blood test panels
create table public.panels (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  panel_date date not null,
  lab_name text,
  panel_type text,
  notes text,
  created_at timestamptz default now()
);

-- Individual biomarker results within a panel
create table public.biomarkers (
  id uuid default gen_random_uuid() primary key,
  panel_id uuid references public.panels on delete cascade not null,
  short_name text not null,
  name_swe text,
  name_eng text,
  plain_name text,
  value numeric not null,
  unit text not null,
  ref_range_low numeric,
  ref_range_high numeric,
  status text not null default 'normal' check (status in ('normal', 'borderline', 'abnormal')),
  created_at timestamptz default now()
);

-- Clinical annotations (doctor or patient notes on panels/biomarkers)
create table public.annotations (
  id uuid default gen_random_uuid() primary key,
  target_type text not null check (target_type in ('panel', 'biomarker')),
  target_id uuid not null,
  author_id uuid references public.profiles on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

-- Chat sessions
create table public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  title text,
  created_at timestamptz default now()
);

-- Chat messages
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  tokens_in integer,
  tokens_out integer,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_panels_user_date on public.panels (user_id, panel_date desc);
create index idx_biomarkers_panel on public.biomarkers (panel_id);
create index idx_biomarkers_short_name on public.biomarkers (short_name);
create index idx_annotations_target on public.annotations (target_type, target_id);
create index idx_chat_sessions_user on public.chat_sessions (user_id, created_at desc);
create index idx_chat_messages_session on public.chat_messages (session_id, created_at);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.panels enable row level security;
alter table public.biomarkers enable row level security;
alter table public.annotations enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- RLS: all authenticated users can read everything (2-user setup, mutual trust)
create policy "read_all" on public.profiles for select to authenticated using (true);
create policy "read_all" on public.panels for select to authenticated using (true);
create policy "read_all" on public.biomarkers for select to authenticated using (true);
create policy "read_all" on public.annotations for select to authenticated using (true);
create policy "read_all" on public.chat_sessions for select to authenticated using (true);
create policy "read_all" on public.chat_messages for select to authenticated using (true);

-- RLS: users insert their own data
create policy "insert_own" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "insert_own" on public.panels for insert to authenticated
  with check (user_id = auth.uid());
create policy "insert_own_biomarkers" on public.biomarkers for insert to authenticated
  with check (panel_id in (select id from public.panels where user_id = auth.uid()));
create policy "insert_any_annotation" on public.annotations for insert to authenticated
  with check (author_id = auth.uid());
create policy "insert_own_session" on public.chat_sessions for insert to authenticated
  with check (user_id = auth.uid());
create policy "insert_own_messages" on public.chat_messages for insert to authenticated
  with check (session_id in (select id from public.chat_sessions where user_id = auth.uid()));

-- RLS: users update/delete their own annotations only
create policy "update_own_annotation" on public.annotations for update to authenticated
  using (author_id = auth.uid());
create policy "delete_own_annotation" on public.annotations for delete to authenticated
  using (author_id = auth.uid());

-- RLS: users update their own profile
create policy "update_own_profile" on public.profiles for update to authenticated
  using (id = auth.uid());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
