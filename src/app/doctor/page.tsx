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
  { label: "Patients", href: "/doctor" },
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: railVisible ? '240px 1fr 320px' : '240px 1fr',
          gap: 14,
          padding: 16,
          minHeight: 'calc(100dvh - 100px)',
        }}
      >
        <QueueRail
          {...queueItems}
          activePatientId={selectedId}
          onSelect={setSelectedId}
        />
        <div>
          {caseData ? (
            <CasePage data={caseData} />
          ) : (
            <div
              style={{
                padding: 32,
                color: '#8B8579',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {loadingPatients ? 'Loading patients...' : 'Select a patient from the queue.'}
            </div>
          )}
        </div>
        {railVisible && caseData && emotionalSignal && (
          <EmotionalRail
            signal={emotionalSignal}
            memberId={caseData.memberId}
            wasAutoTriggered={true}
            onDismiss={() => setRailDismissed(true)}
          />
        )}
      </div>
    </PageShell>
  );
}
