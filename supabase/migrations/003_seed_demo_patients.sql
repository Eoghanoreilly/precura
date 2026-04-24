-- supabase/migrations/003_seed_demo_patients.sql
-- 5 demo personas for doctor portal narrative v1.
-- These profiles have no corresponding auth.users row.
-- We bypass the FK with session_replication_role = replica so inserts
-- skip FK checks for this session. Rows are read-only for Tomas via
-- the existing mutual-read RLS policies. demo=true marks them for filter.
--
-- Schema adjustments vs draft (real column names from 001_initial_schema.sql):
--   panels:     no uploaded_at -> use created_at
--   biomarkers: name -> short_name, ref_low -> ref_range_low, ref_high -> ref_range_high
--   chat_sessions: no started_at -> use created_at

set session_replication_role = replica;

insert into profiles (id, email, display_name, role, demo, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'sofia.demo@precura.se', 'Sofia Lundqvist',  'patient', true, now() - interval '190 days'),
  ('22222222-2222-2222-2222-222222222222', 'anna.demo@precura.se',  'Anna Lindstrom',   'patient', true, now() - interval '100 days'),
  ('33333333-3333-3333-3333-333333333333', 'david.demo@precura.se', 'David Karlsson',   'patient', true, now() - interval '240 days'),
  ('44444444-4444-4444-4444-444444444444', 'olivia.demo@precura.se','Olivia Svensson',  'patient', true, now() - interval '60 days'),
  ('55555555-5555-5555-5555-555555555555', 'carl.demo@precura.se',  'Carl Johansson',   'patient', true, now() - interval '120 days')
on conflict (id) do update set
  demo         = excluded.demo,
  display_name = excluded.display_name,
  role         = excluded.role;

-- -----------------------------------------------------------------------
-- Sofia: 3 panels, all markers in range. Steady-state control patient.
-- -----------------------------------------------------------------------
do $$
declare
  sofia_p1 uuid := gen_random_uuid();
  sofia_p2 uuid := gen_random_uuid();
  sofia_p3 uuid := gen_random_uuid();
begin
  insert into panels (id, user_id, panel_date, created_at, review_status)
  values
    (sofia_p1, '11111111-1111-1111-1111-111111111111', (now() - interval '180 days')::date, now() - interval '180 days', 'acknowledged_no_note'),
    (sofia_p2, '11111111-1111-1111-1111-111111111111', (now() - interval '90 days')::date,  now() - interval '90 days',  'acknowledged_no_note'),
    (sofia_p3, '11111111-1111-1111-1111-111111111111', (now() - interval '30 days')::date,  now() - interval '30 days',  'acknowledged_no_note')
  on conflict (id) do nothing;

  insert into biomarkers (panel_id, short_name, value, unit, ref_range_low, ref_range_high) values
    (sofia_p3, 'P-ALAT',        22,  'U/L',    null, 50),
    (sofia_p3, 'S-TSH',          2.1, 'mIU/L',  0.4,  4.0),
    (sofia_p3, 'fP-Glukos',      5.0, 'mmol/L', 4.0,  6.0),
    (sofia_p3, 'S-Kreatinin',   72,  'umol/L', 60,   110),
    (sofia_p3, 'S-Ferritin',    85,  'ug/L',   30,   150)
  on conflict do nothing;
end $$;

-- -----------------------------------------------------------------------
-- Anna: 2 panels, ferritin below range and falling. P-ALAT above range.
-- 6 chat messages in last 12 days with escalating worry language.
-- Auto-trigger for emotional rail.
-- -----------------------------------------------------------------------
do $$
declare
  anna_p1     uuid := gen_random_uuid();
  anna_p2     uuid := gen_random_uuid();
  anna_session uuid := gen_random_uuid();
  doctor_id   uuid;
begin
  select id into doctor_id
    from profiles
   where role in ('doctor', 'both') and demo = false
   limit 1;

  insert into panels (id, user_id, panel_date, created_at, review_status)
  values
    (anna_p1, '22222222-2222-2222-2222-222222222222', (now() - interval '80 days')::date, now() - interval '80 days', 'acknowledged_with_note'),
    (anna_p2, '22222222-2222-2222-2222-222222222222', (now() - interval '6 days')::date,  now() - interval '6 days',  'pending')
  on conflict (id) do nothing;

  insert into biomarkers (panel_id, short_name, value, unit, ref_range_low, ref_range_high) values
    (anna_p1, 'S-Ferritin', 22, 'ug/L', 30, 150),
    (anna_p1, 'P-ALAT',     62, 'U/L',  null, 50),
    (anna_p2, 'S-Ferritin', 11, 'ug/L', 30, 150),
    (anna_p2, 'P-ALAT',     58, 'U/L',  null, 50)
  on conflict do nothing;

  if doctor_id is not null then
    insert into annotations (author_id, target_id, target_type, body, created_at) values (
      doctor_id,
      anna_p1,
      'panel',
      'Watch ferritin, recheck March.',
      now() - interval '78 days'
    ) on conflict do nothing;
  end if;

  insert into chat_sessions (id, user_id, created_at)
  values (anna_session, '22222222-2222-2222-2222-222222222222', now() - interval '12 days')
  on conflict (id) do nothing;

  insert into chat_messages (session_id, role, content, created_at) values
    (anna_session, 'user', 'I read that low iron can mean something serious.',         now() - interval '12 days' - interval '2 hours'),
    (anna_session, 'user', 'Should I be worried about ferritin under 30?',             now() - interval '9 days'  - interval '2 hours'),
    (anna_session, 'user', 'I feel exhausted even after 9 hours of sleep.',            now() - interval '6 days'  - interval '4 hours'),
    (anna_session, 'user', 'Is my iron low enough to explain how tired I feel?',       now() - interval '4 days'  - interval '1 hour'),
    (anna_session, 'user', 'I keep checking my heart rate, I can''t sleep.',           now() - interval '2 days'  - interval '21 hours'),
    (anna_session, 'user', 'Scared it might be my thyroid acting up.',                 now() - interval '1 day'   - interval '2 hours')
  on conflict do nothing;
end $$;

-- -----------------------------------------------------------------------
-- David: 4 panels, triglycerides rising within range (drift pattern).
-- Cholesterol just above range on latest. Doctor note on p3.
-- -----------------------------------------------------------------------
do $$
declare
  david_p1  uuid := gen_random_uuid();
  david_p2  uuid := gen_random_uuid();
  david_p3  uuid := gen_random_uuid();
  david_p4  uuid := gen_random_uuid();
  doctor_id uuid;
begin
  select id into doctor_id
    from profiles
   where role in ('doctor', 'both') and demo = false
   limit 1;

  insert into panels (id, user_id, panel_date, created_at, review_status)
  values
    (david_p1, '33333333-3333-3333-3333-333333333333', (now() - interval '220 days')::date, now() - interval '220 days', 'acknowledged_no_note'),
    (david_p2, '33333333-3333-3333-3333-333333333333', (now() - interval '160 days')::date, now() - interval '160 days', 'acknowledged_no_note'),
    (david_p3, '33333333-3333-3333-3333-333333333333', (now() - interval '95 days')::date,  now() - interval '95 days',  'acknowledged_with_note'),
    (david_p4, '33333333-3333-3333-3333-333333333333', (now() - interval '10 days')::date,  now() - interval '10 days',  'pending')
  on conflict (id) do nothing;

  insert into biomarkers (panel_id, short_name, value, unit, ref_range_low, ref_range_high) values
    (david_p2, 'fP-Triglycerid', 1.4, 'mmol/L', null, 2.3),
    (david_p3, 'fP-Triglycerid', 1.7, 'mmol/L', null, 2.3),
    (david_p4, 'fP-Triglycerid', 2.0, 'mmol/L', null, 2.3),
    (david_p4, 'P-Kolesterol',   5.1, 'mmol/L', null, 5.0)
  on conflict do nothing;

  if doctor_id is not null then
    insert into annotations (author_id, target_id, target_type, body, created_at) values (
      doctor_id,
      david_p3,
      'panel',
      'Triglycerides trending up, still in range. Consider dietary check-in.',
      now() - interval '45 days'
    ) on conflict do nothing;
  end if;
end $$;

-- -----------------------------------------------------------------------
-- Olivia: single panel 32d ago, no doctor note, 2 flags.
-- Oldest pending review - urgency signal for stale-review state.
-- -----------------------------------------------------------------------
do $$
declare
  olivia_p1 uuid := gen_random_uuid();
begin
  insert into panels (id, user_id, panel_date, created_at, review_status)
  values
    (olivia_p1, '44444444-4444-4444-4444-444444444444', (now() - interval '32 days')::date, now() - interval '32 days', 'pending')
  on conflict (id) do nothing;

  insert into biomarkers (panel_id, short_name, value, unit, ref_range_low, ref_range_high) values
    (olivia_p1, 'S-TSH',          4.8, 'mIU/L', 0.4, 4.0),
    (olivia_p1, '25-OH-Vitamin D', 42, 'nmol/L', 75, 150)
  on conflict do nothing;
end $$;

-- -----------------------------------------------------------------------
-- Carl: 3 panels all in range. 18 neutral chat messages (health curiosity,
-- no anxiety language). High chat volume control vs Anna's worry pattern.
-- -----------------------------------------------------------------------
do $$
declare
  carl_p1     uuid := gen_random_uuid();
  carl_p2     uuid := gen_random_uuid();
  carl_p3     uuid := gen_random_uuid();
  carl_session uuid := gen_random_uuid();
begin
  insert into panels (id, user_id, panel_date, created_at, review_status)
  values
    (carl_p1, '55555555-5555-5555-5555-555555555555', (now() - interval '110 days')::date, now() - interval '110 days', 'acknowledged_no_note'),
    (carl_p2, '55555555-5555-5555-5555-555555555555', (now() - interval '55 days')::date,  now() - interval '55 days',  'acknowledged_no_note'),
    (carl_p3, '55555555-5555-5555-5555-555555555555', (now() - interval '25 days')::date,  now() - interval '25 days',  'acknowledged_no_note')
  on conflict (id) do nothing;

  insert into biomarkers (panel_id, short_name, value, unit, ref_range_low, ref_range_high) values
    (carl_p3, 'P-ALAT',    28,  'U/L',   null, 50),
    (carl_p3, 'S-TSH',      1.9, 'mIU/L', 0.4,  4.0),
    (carl_p3, 'S-Ferritin', 110, 'ug/L',  30,   150)
  on conflict do nothing;

  insert into chat_sessions (id, user_id, created_at)
  values (carl_session, '55555555-5555-5555-5555-555555555555', now() - interval '16 days')
  on conflict (id) do nothing;

  insert into chat_messages (session_id, role, content, created_at) values
    (carl_session, 'user', 'Is creatine safe to take daily?',                   now() - interval '15 days'),
    (carl_session, 'user', 'Best time of day to train fasted?',                 now() - interval '14 days'),
    (carl_session, 'user', 'How much protein for maintenance?',                 now() - interval '13 days'),
    (carl_session, 'user', 'Thoughts on magnesium glycinate?',                  now() - interval '12 days'),
    (carl_session, 'user', 'Resting heart rate of 48 normal for athletes?',     now() - interval '11 days'),
    (carl_session, 'user', 'Should I cycle carbs?',                             now() - interval '10 days'),
    (carl_session, 'user', 'Does zinc interfere with iron?',                    now() - interval '9 days'),
    (carl_session, 'user', 'Vitamin D from sun vs supplement?',                 now() - interval '8 days'),
    (carl_session, 'user', 'Optimal sleep temperature for recovery?',           now() - interval '7 days'),
    (carl_session, 'user', 'Caffeine timing for endurance training?',           now() - interval '6 days'),
    (carl_session, 'user', 'Protein vs amino acid supplements?',                now() - interval '5 days'),
    (carl_session, 'user', 'HRV training recommendations?',                     now() - interval '4 days'),
    (carl_session, 'user', 'Best type of creatine?',                            now() - interval '3 days'),
    (carl_session, 'user', 'How much sodium for endurance?',                    now() - interval '2 days'),
    (carl_session, 'user', 'Is cold plunge worth it?',                          now() - interval '1 day' - interval '22 hours'),
    (carl_session, 'user', 'Any way to improve HRV naturally?',                 now() - interval '1 day' - interval '14 hours'),
    (carl_session, 'user', 'Zone 2 training benefits?',                         now() - interval '20 hours'),
    (carl_session, 'user', 'Electrolyte balance for ultra training?',           now() - interval '8 hours')
  on conflict do nothing;
end $$;

set session_replication_role = default;
