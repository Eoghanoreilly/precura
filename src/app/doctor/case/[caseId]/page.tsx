import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { CaseWorkspace } from '@/components/doctor/v2/CaseWorkspace';

export const dynamic = 'force-dynamic';

export default async function DoctorCaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
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

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas, #FBF7F0)' }}>
      <header
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--line-soft, #EEE9DB)',
          background: 'var(--paper, #fff)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <Link
          href="/doctor"
          style={{
            color: 'var(--sage-deep, #445A4A)',
            fontSize: 13,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Back to inbox
        </Link>
      </header>
      <CaseWorkspace doctorName={doctorName} caseShortIdOverride={caseId} />
    </div>
  );
}
