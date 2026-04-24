"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  RailNav,
} from "@/components/layout";
import { useDoctorData } from "./useDoctorData";
import { createClient } from "@/lib/supabase/client";
import { QueueRail, type QueueItem } from "@/components/doctor/queue/QueueRail";
import { CasePage } from "@/components/doctor/case/CasePage";
import { EmotionalRail } from "@/components/doctor/emotional/EmotionalRail";
import { useCaseRollup } from "@/lib/doctor/caseRollup";
import { DoctorMobileDrawer } from "@/components/doctor/DoctorMobileDrawer";

const NAV_ITEMS = [
  { label: "Home", href: "/doctor" },
  { label: "Patients", href: "/doctor/patients" },
  { label: "Settings", href: "/doctor/settings" },
];

type PatientRollup = {
  id: string;
  name: string;
  latestPanelAt: string | null;
  latestReviewStatus: 'pending' | 'acknowledged_no_note' | 'acknowledged_with_note' | 'deferred' | null;
  flagCount: number;
  deferReason: string | null;
  emotionalSignalTriggered: boolean;
};

function daysSince(iso: string | null): string {
  if (!iso) return '-';
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  return `${days}d`;
}

function buildContext(p: PatientRollup): string {
  if (p.latestReviewStatus === 'deferred' && p.deferReason) return `Deferred - ${p.deferReason.slice(0, 40)}`;
  if (p.flagCount > 0) return `${p.flagCount} flag${p.flagCount === 1 ? '' : 's'}`;
  if (p.latestReviewStatus === 'acknowledged_no_note' || p.latestReviewStatus === 'acknowledged_with_note') return 'No action needed';
  if (p.latestPanelAt == null) return 'No panels yet';
  return 'No flags';
}

function buildQueueItems(
  patients: PatientRollup[],
): { pending: QueueItem[]; awaitingNote: QueueItem[]; recentlyReviewed: QueueItem[] } {
  const pending: QueueItem[] = [];
  const awaitingNote: QueueItem[] = [];
  const recentlyReviewed: QueueItem[] = [];

  for (const p of patients) {
    const item: QueueItem = {
      id: p.id,
      name: p.name,
      daysLabel: daysSince(p.latestPanelAt),
      contextLine: buildContext(p),
      isSelected: false,
      emotionalDot: p.emotionalSignalTriggered,
      onClick: () => {},
    };
    if (p.latestReviewStatus === 'pending') {
      pending.push(item);
    } else if (p.latestReviewStatus === 'deferred') {
      awaitingNote.push(item);
    } else if (
      p.latestReviewStatus === 'acknowledged_no_note' ||
      p.latestReviewStatus === 'acknowledged_with_note'
    ) {
      recentlyReviewed.push(item);
    } else {
      awaitingNote.push(item);
    }
  }

  return { pending, awaitingNote, recentlyReviewed };
}

const WORRY_WORDS = [
  'scared', 'worried', 'afraid', 'anxious', "can't sleep", 'cant sleep', 'dying', 'something serious',
];

async function fetchPatientRollups(
  supabase: ReturnType<typeof createClient>,
  doctorId: string,
): Promise<PatientRollup[]> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .neq('id', doctorId);

  const rollups: PatientRollup[] = [];
  for (const prof of profiles ?? []) {
    const { data: panels } = await supabase
      .from('panels')
      .select('id, created_at, review_status, defer_reason, biomarkers(value,ref_range_low,ref_range_high)')
      .eq('user_id', prof.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const latest = panels?.[0] as
      | {
          id: string;
          created_at: string;
          review_status: string;
          defer_reason: string | null;
          biomarkers?: Array<{ value: number; ref_range_low: number | null; ref_range_high: number | null }>;
        }
      | undefined;

    const flagCount = (latest?.biomarkers ?? []).filter((b) => {
      if (b.ref_range_high !== null && b.value > b.ref_range_high) return true;
      if (b.ref_range_low !== null && b.value < b.ref_range_low) return true;
      return false;
    }).length;

    const { data: recentMsgs } = await supabase
      .from('chat_messages')
      .select('content, created_at, chat_sessions!inner(user_id)')
      .eq('chat_sessions.user_id', prof.id)
      .eq('role', 'user')
      .gte('created_at', new Date(Date.now() - 7 * 86_400_000).toISOString());

    let nightCount = 0;
    let hasWorry = false;
    for (const m of (recentMsgs ?? []) as Array<{ content: string; created_at: string }>) {
      const h = new Date(m.created_at).getHours();
      if (h >= 22 || h < 6) nightCount += 1;
      const body = m.content.toLowerCase();
      for (const w of WORRY_WORDS) {
        if (body.includes(w)) hasWorry = true;
      }
    }
    const msgCount = (recentMsgs ?? []).length;
    const emotionalSignalTriggered = msgCount >= 3 && (nightCount > 0 || hasWorry);

    rollups.push({
      id: prof.id as string,
      name: prof.display_name as string,
      latestPanelAt: latest?.created_at ?? null,
      latestReviewStatus: (latest?.review_status as PatientRollup['latestReviewStatus']) ?? null,
      flagCount,
      deferReason: latest?.defer_reason ?? null,
      emotionalSignalTriggered,
    });
  }
  return rollups;
}

function rollupsSortKey(r: PatientRollup): number {
  // Lower = higher priority (shown first)
  if (r.latestReviewStatus === 'pending') {
    if (r.emotionalSignalTriggered) return 0;
    if (r.flagCount > 0) return 1;
    return 2;
  }
  if (r.latestReviewStatus === 'deferred') return 3;
  if (r.latestReviewStatus == null) return 4;
  return 5; // acknowledged
}

export default function DoctorHomePage() {
  const data = useDoctorData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [railDismissed, setRailDismissed] = useState(false);
  const [patients, setPatients] = useState<PatientRollup[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);
  const [queueOpen, setQueueOpen] = useState(true); // mobile: visible by default

  const displayName = data.doctor?.display_name || "Doctor";
  const initials = displayName
    .split(/\s+/)
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const { data: caseData, emotionalSignal, loading: caseLoading, error: caseError } = useCaseRollup(selectedId, displayName);

  useEffect(() => {
    if (!data.doctor?.id) return;
    let alive = true;
    const doctorId = data.doctor.id;
    (async () => {
      setLoadingPatients(true);
      setPatientsError(null);
      try {
        const supabase = createClient();
        const rollups = await fetchPatientRollups(supabase, doctorId);
        if (alive) {
          setPatients(rollups);
          setLoadingPatients(false);
        }
      } catch (e) {
        if (alive) {
          setPatientsError((e as Error).message);
          setLoadingPatients(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [data.doctor?.id]);

  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => {
      const k = rollupsSortKey(a) - rollupsSortKey(b);
      if (k !== 0) return k;
      const aT = a.latestPanelAt ? new Date(a.latestPanelAt).getTime() : 0;
      const bT = b.latestPanelAt ? new Date(b.latestPanelAt).getTime() : 0;
      return aT - bT; // older first within tier
    });
  }, [patients]);

  // Auto-select the top patient once, on first load
  useEffect(() => {
    if (hasAutoSelected) return;
    if (sortedPatients.length === 0) return;
    if (selectedId) { setHasAutoSelected(true); return; }
    setSelectedId(sortedPatients[0].id);
    setHasAutoSelected(true);
  }, [sortedPatients, selectedId, hasAutoSelected]);

  // Reset rail-dismissed when switching patients
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRailDismissed(false);
  }, [selectedId]);

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor" />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: displayName, initials, memberSince: "Clinician" }}
          doctor={{
            name: "Precura clinic",
            initials: "P",
            title: `${patients.length} patient${patients.length === 1 ? '' : 's'}`,
          }}
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/doctor" />,
      ]}
    />
  );

  const queueItems = buildQueueItems(sortedPatients);
  const railVisible = Boolean(emotionalSignal?.triggered) && !railDismissed;

  // Case area content resolves to one of: error, loading, empty-no-patients, case
  const caseContent = (() => {
    if (patientsError) {
      return (
        <EmptyState
          title="Couldn't load patients"
          body={patientsError}
          tone="error"
        />
      );
    }
    if (loadingPatients) {
      return <EmptyState title="Loading patients..." body="One moment." tone="neutral" />;
    }
    if (sortedPatients.length === 0) {
      return (
        <EmptyState
          title="No patients on file"
          body="Seed data may not have loaded. Check the Supabase profiles table or run the seed migration."
          tone="neutral"
        />
      );
    }
    if (!selectedId) {
      return (
        <EmptyState
          title="Pick a patient"
          body="Open the patient list to start a review."
          tone="neutral"
        />
      );
    }
    if (caseError) {
      return (
        <EmptyState
          title="Couldn't load this patient's case"
          body={caseError}
          tone="error"
        />
      );
    }
    if (caseLoading || !caseData) {
      return <EmptyState title="Loading case page..." body={`Fetching panels, chat, and pre-read for ${findName(sortedPatients, selectedId)}`} tone="neutral" />;
    }
    return <CasePage data={caseData} />;
  })();

  return (
    <PageShell
      sideRail={sideRail}
      userInitials={initials}
      activeHref="/doctor"
      mobileDrawer={(open, onClose) => (
        <DoctorMobileDrawer open={open} onClose={onClose} activeHref="/doctor" />
      )}
    >
      {/* Mobile queue toggle button - only visible below laptop breakpoint */}
      <div className="dh-mobile-queue-btn">
        <button type="button" onClick={() => setQueueOpen((o) => !o)} className="dh-queue-toggle">
          {queueOpen ? 'Hide patient list' : 'Show patient list'}
          {queueItems.pending.length > 0 && (
            <span className="dh-queue-badge">{queueItems.pending.length}</span>
          )}
        </button>
      </div>

      <div className={`dh-layout${railVisible ? ' has-rail' : ''}`}>
        {/* Queue rail */}
        <div className={`dh-queue${queueOpen ? ' open' : ''}`}>
          <QueueRail
            {...queueItems}
            activePatientId={selectedId}
            onSelect={(id) => { setSelectedId(id); setQueueOpen(false); }}
          />
        </div>

        {/* Case area */}
        <div className="dh-case">
          {caseContent}
        </div>

        {/* Emotional rail */}
        {railVisible && caseData && emotionalSignal && (
          <div className="dh-emotional">
            <EmotionalRail
              signal={emotionalSignal}
              memberId={caseData.memberId}
              wasAutoTriggered={true}
              onDismiss={() => setRailDismissed(true)}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        /* Mobile queue toggle button */
        .dh-mobile-queue-btn {
          display: flex;
          padding: 10px 16px 0;
        }
        .dh-queue-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #FDFBF6;
          border: 1px solid #E0D9C8;
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: #1C1A17;
          cursor: pointer;
        }
        .dh-queue-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 9px;
          background: #9C3F25;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
        }

        /* Base layout - mobile first (single column) */
        .dh-layout {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 12px 16px 20px;
          min-height: calc(100dvh - 140px);
        }
        .dh-queue {
          display: none;
        }
        .dh-queue.open {
          display: block;
        }
        .dh-case {
          flex: 1;
          min-width: 0;
        }
        .dh-empty {
          padding: 32px;
          color: #8B8579;
          font-family: var(--font-sans);
        }

        /* Laptop (>= 1024px): queue tray + case */
        @media (min-width: 1024px) {
          .dh-mobile-queue-btn {
            display: none;
          }
          .dh-layout {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            grid-template-rows: auto;
            gap: 20px;
            padding: 20px;
            align-items: start;
          }
          .dh-queue {
            display: block;
            grid-row: 1 / -1;
            grid-column: 1;
            max-height: calc(100dvh - 40px);
            position: sticky;
            top: 20px;
          }
          .dh-queue.open {
            display: block;
          }
          .dh-case {
            grid-column: 2;
          }
          .dh-emotional {
            grid-column: 2;
          }
        }

        /* Desktop (>= 1280px): add 3rd column for emotional rail, wider gap */
        @media (min-width: 1280px) {
          .dh-layout {
            grid-template-columns: 280px minmax(0, 1fr);
            gap: 24px;
            padding: 24px;
          }
          .dh-layout.has-rail {
            grid-template-columns: 280px minmax(0, 1fr) 360px;
          }
          .dh-layout.has-rail .dh-case {
            grid-column: 2;
          }
          .dh-layout.has-rail .dh-emotional {
            grid-column: 3;
            grid-row: 1;
            position: sticky;
            top: 24px;
            max-height: calc(100dvh - 48px);
          }
        }

        /* Widescreen (>= 1600px): slightly more room + cap */
        @media (min-width: 1600px) {
          .dh-layout {
            grid-template-columns: 300px minmax(0, 1fr);
            gap: 28px;
            padding: 28px clamp(28px, 4vw, 64px);
          }
          .dh-layout.has-rail {
            grid-template-columns: 300px minmax(0, 1fr) 380px;
          }
        }

        /* Ultra-wide cap */
        @media (min-width: 1920px) {
          .dh-layout {
            max-width: 1920px;
            margin: 0 auto;
          }
        }
      `}</style>
    </PageShell>
  );
}

function findName(list: PatientRollup[], id: string): string {
  return list.find((p) => p.id === id)?.name ?? 'patient';
}

function EmptyState({ title, body, tone }: { title: string; body: string; tone: 'neutral' | 'error' }) {
  const bg = tone === 'error' ? '#FCEFE7' : '#FDFBF6';
  const border = tone === 'error' ? '#EFB59B' : '#E0D9C8';
  const titleColor = tone === 'error' ? '#9C3F25' : '#1C1A17';

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 14,
      padding: '36px 28px',
      fontFamily: 'var(--font-sans)',
      textAlign: 'center',
      minHeight: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: titleColor, letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: 13, color: '#615C52', maxWidth: 420, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}
