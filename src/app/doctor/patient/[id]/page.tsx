import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchPatientProfile } from '@/lib/doctor/v2/patientProfileQueries';
import { ensurePatientSummary } from '@/lib/doctor/v2/patientSummary';
import { PatientBanner } from '@/components/doctor/v2/profile/PatientBanner';
import { PatientMetaStrip } from '@/components/doctor/v2/profile/PatientMetaStrip';
import { PatientTabs } from '@/components/doctor/v2/profile/PatientTabs';
import { PrecuraSummaryHero } from '@/components/doctor/v2/profile/PrecuraSummaryHero';
import { OverviewActiveCases } from '@/components/doctor/v2/profile/OverviewActiveCases';
import { OverviewRecentPanels } from '@/components/doctor/v2/profile/OverviewRecentPanels';
import { OverviewMessages } from '@/components/doctor/v2/profile/OverviewMessages';
import { OverviewNotes } from '@/components/doctor/v2/profile/OverviewNotes';
import { OverviewCarePlan } from '@/components/doctor/v2/profile/OverviewCarePlan';
import { OverviewIntakeSnapshot } from '@/components/doctor/v2/profile/OverviewIntakeSnapshot';
import { QuickActionsRail } from '@/components/doctor/v2/profile/QuickActionsRail';
import { EmptyState } from '@/components/doctor/v2/EmptyState';

export const dynamic = 'force-dynamic';

export default async function PatientProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const { tab = 'overview' } = await searchParams;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/doctor/login');
  const { data: profileRow } = await supabase.from('profiles').select('id, display_name, role').eq('id', user.id).single();
  if (!profileRow || (profileRow.role !== 'doctor' && profileRow.role !== 'both')) redirect('/member');

  const data = await fetchPatientProfile(supabase, id);
  if (!data) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--canvas, #FBF7F0)', padding: 24 }}>
        <Link href="/doctor" style={{ fontSize: 13, color: 'var(--sage-deep, #445A4A)' }}>Back to inbox</Link>
        <EmptyState title="Patient not found" body={`No profile matches ${id}.`} tone="error" />
      </div>
    );
  }

  // Lazy-regenerate summary on open if older than TTL or no summary yet
  let summaryBody = data.summary.body;
  let summaryGenerated = data.summary.generated_at;
  try {
    const { data: panels } = await supabase
      .from('panels')
      .select('id, panel_date, biomarkers(short_name, value, unit, ref_range_low, ref_range_high, status)')
      .eq('user_id', id)
      .order('panel_date', { ascending: true });
    const result = await ensurePatientSummary(supabase, id, {
      patientName: data.patient.display_name,
      joinedAt: data.patient.created_at,
      panels: (panels ?? []).map((p) => {
        const r = p as { id: string; panel_date: string; biomarkers?: Array<{ short_name: string; value: number; unit: string; ref_range_low: number | null; ref_range_high: number | null; status: string }> };
        return { id: r.id, panel_date: r.panel_date, biomarkers: r.biomarkers ?? [] };
      }),
      recentMessages: data.recentMessages,
      recentNotes: data.recentNotes.map((n) => ({ body: n.body, created_at: n.created_at })),
      activeCases: data.activeCases.map((c) => ({ title: c.title, status: c.status, opened_at: c.opened_at })),
      membershipUse: data.membershipUse,
    });
    summaryBody = result.summary;
    summaryGenerated = result.generated_at;
  } catch {
    // Fall back to whatever's stored; render UI even if regeneration failed.
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--paper, #fff)', fontFamily: 'var(--font-sans)' }}>
      {/* Breadcrumb toolbar */}
      <div style={{ padding: '10px 28px', borderBottom: '1px solid var(--line-soft, #EEE9DB)', display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>
        <Link href="/doctor" style={{ color: 'var(--sage-deep, #445A4A)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Inbox</Link>
        <span aria-hidden>/</span>
        <Link href="/doctor/patients" style={{ color: 'var(--sage-deep, #445A4A)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Patients</Link>
        <span aria-hidden>/</span>
        <span style={{ color: 'var(--ink, #1C1A17)', fontWeight: 600 }}>{data.patient.display_name}</span>
        <span style={{ marginLeft: 'auto', fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, monospace", letterSpacing: '0.02em' }}>PT-{data.patient.id.slice(0, 8).toUpperCase()}</span>
      </div>

      <PatientBanner data={data} />
      <PatientMetaStrip data={data} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', borderTop: '1px solid var(--line-soft, #EEE9DB)' }}>
        <div style={{ borderRight: '1px solid var(--line-soft, #EEE9DB)' }}>
          <PatientTabs
            activeTab={tab}
            patientId={data.patient.id}
            counts={{
              cases: data.activeCases.length + data.closedCasesCount,
              panels: data.recentPanels.length,
              notes: data.recentNotes.length,
            }}
          />
          <div style={{ padding: '24px 28px' }}>
            {tab === 'overview' ? (
              <>
                <PrecuraSummaryHero
                  patientId={data.patient.id}
                  body={summaryBody}
                  generatedAt={summaryGenerated}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
                  <OverviewActiveCases activeCases={data.activeCases} />
                  <OverviewRecentPanels panels={data.recentPanels} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  <OverviewMessages messages={data.recentMessages} />
                  <OverviewNotes notes={data.recentNotes} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  <OverviewCarePlan />
                  <OverviewIntakeSnapshot />
                </div>
              </>
            ) : (
              <EmptyState
                title={`${tab[0].toUpperCase()}${tab.slice(1)} tab`}
                body="This tab is populated in a later phase."
                tone="neutral"
              />
            )}
          </div>
        </div>
        <QuickActionsRail data={data} />
      </div>
    </div>
  );
}
