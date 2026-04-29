import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchPatientsDirectory } from '@/lib/doctor/v2/patientsDirectoryQueries';
import { DirectoryHeader } from '@/components/doctor/v2/directory/DirectoryHeader';
import { DirectoryTable } from '@/components/doctor/v2/directory/DirectoryTable';
import type { PatientState } from '@/lib/doctor/caseStateDerivation';

export const dynamic = 'force-dynamic';

const ALL_STATES: PatientState[] = ['Awaiting you', 'Attention', 'Awaiting member', 'Onboarding', 'Routine', 'Stable', 'Stale 90d'];

export default async function DoctorPatientsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/doctor/login');
  const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).single();
  if (!profile || (profile.role !== 'doctor' && profile.role !== 'both')) redirect('/member');

  const rows = await fetchPatientsDirectory(supabase, profile.id as string);

  const totalCount = rows.length;
  const attentionCount = rows.filter((r) => r.state === 'Awaiting you' || r.state === 'Attention').length;
  const counts: Record<'all' | PatientState, number> = { all: totalCount, ...Object.fromEntries(ALL_STATES.map((s) => [s, 0])) } as Record<'all' | PatientState, number>;
  for (const r of rows) counts[r.state] = (counts[r.state] ?? 0) + 1;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--paper, #fff)' }}>
      <DirectoryHeader totalCount={totalCount} attentionCount={attentionCount} counts={counts} />
      <DirectoryTable rows={rows} />
    </div>
  );
}
