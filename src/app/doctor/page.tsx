"use client";

import React, { useState, useEffect } from "react";
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

export default function DoctorHomePage() {
  const data = useDoctorData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [railDismissed, setRailDismissed] = useState(false);
  const [patients, setPatients] = useState<PatientRollup[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [queueOpen, setQueueOpen] = useState(false);

  const displayName = data.doctor?.display_name || "Doctor";
  const initials = displayName
    .split(/\s+/)
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const { data: caseData, emotionalSignal } = useCaseRollup(selectedId, displayName);

  useEffect(() => {
    if (!data.doctor?.id) return;
    let alive = true;
    const doctorId = data.doctor.id;
    (async () => {
      setLoadingPatients(true);
      const supabase = createClient();
      const rollups = await fetchPatientRollups(supabase, doctorId);
      if (alive) {
        setPatients(rollups);
        setLoadingPatients(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [data.doctor?.id]);

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
            title: `${patients.length} patients`,
          }}
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/doctor" />,
      ]}
    />
  );

  const queueItems = buildQueueItems(patients);
  const railVisible = Boolean(emotionalSignal?.triggered) && !railDismissed;

  return (
    <PageShell sideRail={sideRail} userInitials={initials} activeHref="/doctor">
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
        {/* Queue rail - hidden on mobile unless toggled, visible on laptop+ */}
        <div className={`dh-queue${queueOpen ? ' open' : ''}`}>
          <QueueRail
            {...queueItems}
            activePatientId={selectedId}
            onSelect={(id) => { setSelectedId(id); setQueueOpen(false); }}
          />
        </div>

        {/* Case / empty state */}
        <div className="dh-case">
          {caseData ? (
            <CasePage data={caseData} />
          ) : (
            <div className="dh-empty">
              {loadingPatients ? 'Loading patients...' : 'Select a patient from the queue.'}
            </div>
          )}
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
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #9C3F25;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
        }

        /* Base layout - mobile first (single column) */
        .dh-layout {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 12px 16px 16px;
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
        .dh-emotional {
          /* On mobile emotional rail flows inline below case */
        }
        .dh-empty {
          padding: 32px;
          color: #8B8579;
          font-family: var(--font-sans);
        }

        /* Laptop (>= 1024px): queue sidebar + case */
        @media (min-width: 1024px) {
          .dh-mobile-queue-btn {
            display: none;
          }
          .dh-layout {
            display: grid;
            grid-template-columns: 220px minmax(0, 1fr);
            grid-template-rows: auto;
            gap: 14px;
            padding: 16px;
            align-items: start;
          }
          .dh-queue {
            display: block;
            grid-row: 1 / -1;
            grid-column: 1;
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

        /* Desktop (>= 1280px): add 3rd column for emotional rail */
        @media (min-width: 1280px) {
          .dh-layout {
            grid-template-columns: 240px minmax(0, 1fr);
          }
          .dh-layout.has-rail {
            grid-template-columns: 240px minmax(0, 1fr) 320px;
          }
          .dh-layout.has-rail .dh-case {
            grid-column: 2;
          }
          .dh-layout.has-rail .dh-emotional {
            grid-column: 3;
            grid-row: 1;
          }
        }

        /* Widescreen cap */
        @media (min-width: 1920px) {
          .dh-layout {
            max-width: 1800px;
          }
        }
      `}</style>
    </PageShell>
  );
}
