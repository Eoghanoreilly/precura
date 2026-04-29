import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchInboxTasks } from '@/lib/doctor/v2/inboxQueries';
import { Layout3Col } from '@/components/doctor/v2/Layout3Col';
import { NavRail } from '@/components/doctor/v2/NavRail';
import { InboxColumn } from '@/components/doctor/v2/InboxColumn';
import { CaseWorkspace } from '@/components/doctor/v2/CaseWorkspace';

export const dynamic = 'force-dynamic';

export default async function DoctorHomePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/doctor/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, role')
    .eq('id', user.id)
    .single();
  if (!profile || (profile.role !== 'doctor' && profile.role !== 'both')) {
    redirect('/member');
  }

  const doctorName = profile.display_name as string;
  const doctorInitials = (doctorName || 'D')
    .split(/\s+/)
    .map((s: string) => s[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Patient count for the nav rail (doctor is N-1 of total profiles)
  const { count: profileCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const patientCount = Math.max(0, (profileCount ?? 0) - 1);

  // Server-side fetch of inbox tasks
  const tasks = await fetchInboxTasks(supabase, profile.id as string);

  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Layout3Col
      nav={<NavRail doctorName={doctorName} doctorInitials={doctorInitials} patientCount={patientCount} activeHref="/doctor" />}
      inbox={<InboxColumn tasks={tasks} todayLabel={todayLabel} />}
      workspace={<CaseWorkspace doctorName={doctorName} />}
      mobile={
        <div>
          <header style={{ padding: '12px 18px', borderBottom: '1px solid var(--line-soft, #EEE9DB)', background: 'var(--paper, #fff)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink, #1C1A17)', fontSize: 18, letterSpacing: '-0.025em' }}>Precura</span>
            <span style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--butter-soft, #F6DDA0), var(--terracotta-soft, #EFB59B))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ink, #1C1A17)', fontFamily: 'var(--font-sans)' }}>{doctorInitials}</span>
          </header>
          <InboxColumn tasks={tasks} todayLabel={todayLabel} />
        </div>
      }
    />
  );
}
