"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { PanelGroup, Panel, PanelResizeHandle, type ImperativePanelHandle } from "react-resizable-panels";

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

function buildQueueItems(patients: PatientRollup[]): { pending: QueueItem[]; awaitingNote: QueueItem[]; recentlyReviewed: QueueItem[] } {
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
    if (p.latestReviewStatus === 'pending') pending.push(item);
    else if (p.latestReviewStatus === 'deferred') awaitingNote.push(item);
    else if (p.latestReviewStatus === 'acknowledged_no_note' || p.latestReviewStatus === 'acknowledged_with_note') recentlyReviewed.push(item);
    else awaitingNote.push(item);
  }
  return { pending, awaitingNote, recentlyReviewed };
}

const WORRY_WORDS = ['scared','worried','afraid','anxious',"can't sleep",'cant sleep','dying','something serious'];

async function fetchPatientRollups(supabase: ReturnType<typeof createClient>, doctorId: string): Promise<PatientRollup[]> {
  const { data: profiles } = await supabase.from('profiles').select('id, display_name').neq('id', doctorId);
  const rollups: PatientRollup[] = [];
  for (const prof of profiles ?? []) {
    const { data: panels } = await supabase
      .from('panels')
      .select('id, created_at, review_status, defer_reason, biomarkers(value,ref_range_low,ref_range_high)')
      .eq('user_id', prof.id)
      .order('created_at', { ascending: false })
      .limit(1);
    const latest = panels?.[0] as { id: string; created_at: string; review_status: string; defer_reason: string | null; biomarkers?: Array<{ value: number; ref_range_low: number | null; ref_range_high: number | null }> } | undefined;
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
      const b = m.content.toLowerCase();
      for (const w of WORRY_WORDS) if (b.includes(w)) hasWorry = true;
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
  if (r.latestReviewStatus === 'pending') {
    if (r.emotionalSignalTriggered) return 0;
    if (r.flagCount > 0) return 1;
    return 2;
  }
  if (r.latestReviewStatus === 'deferred') return 3;
  if (r.latestReviewStatus == null) return 4;
  return 5;
}

export default function DoctorHomePage() {
  const data = useDoctorData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [railDismissed, setRailDismissed] = useState(false);
  const [patients, setPatients] = useState<PatientRollup[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);
  const [queueOpen, setQueueOpen] = useState(true);

  // Collapse state for the resizable panels (desktop)
  const [queueCollapsed, setQueueCollapsed] = useState(false);
  const queuePanelRef = useRef<ImperativePanelHandle>(null);
  const railPanelRef = useRef<ImperativePanelHandle>(null);

  const displayName = data.doctor?.display_name || "Doctor";
  const initials = displayName.split(/\s+/).map((s: string) => s[0]).join('').slice(0, 2).toUpperCase();

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
        if (alive) { setPatients(rollups); setLoadingPatients(false); }
      } catch (e) {
        if (alive) { setPatientsError((e as Error).message); setLoadingPatients(false); }
      }
    })();
    return () => { alive = false; };
  }, [data.doctor?.id]);

  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => {
      const k = rollupsSortKey(a) - rollupsSortKey(b);
      if (k !== 0) return k;
      const aT = a.latestPanelAt ? new Date(a.latestPanelAt).getTime() : 0;
      const bT = b.latestPanelAt ? new Date(b.latestPanelAt).getTime() : 0;
      return aT - bT;
    });
  }, [patients]);

  useEffect(() => {
    if (hasAutoSelected) return;
    if (sortedPatients.length === 0) return;
    if (selectedId) { setHasAutoSelected(true); return; }
    setSelectedId(sortedPatients[0].id);
    setHasAutoSelected(true);
  }, [sortedPatients, selectedId, hasAutoSelected]);

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
          doctor={{ name: "Precura clinic", initials: "P", title: `${patients.length} patient${patients.length === 1 ? '' : 's'}` }}
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/doctor" />,
      ]}
    />
  );

  const queueItems = buildQueueItems(sortedPatients);
  const railVisible = Boolean(emotionalSignal?.triggered) && !railDismissed;

  const caseContent = (() => {
    if (patientsError) return <EmptyState title="Couldn't load patients" body={patientsError} tone="error" />;
    if (loadingPatients) return <EmptyState title="Loading patients..." body="One moment." tone="neutral" />;
    if (sortedPatients.length === 0) return <EmptyState title="No patients on file" body="Seed data may not have loaded. Check the Supabase profiles table or run the seed migration." tone="neutral" />;
    if (!selectedId) return <EmptyState title="Pick a patient" body="Open the patient list to start a review." tone="neutral" />;
    if (caseError) return <EmptyState title="Couldn't load this patient's case" body={caseError} tone="error" />;
    if (caseLoading || !caseData) return <EmptyState title="Loading case page..." body={`Fetching panels, chat, and pre-read for ${findName(sortedPatients, selectedId)}`} tone="neutral" />;
    return <CasePage data={caseData} />;
  })();

  const queueNode = (
    <QueueRail
      {...queueItems}
      activePatientId={selectedId}
      onSelect={(id) => { setSelectedId(id); setQueueOpen(false); }}
    />
  );
  const railNode = railVisible && caseData && emotionalSignal ? (
    <EmotionalRail
      signal={emotionalSignal}
      memberId={caseData.memberId}
      wasAutoTriggered
      onDismiss={() => setRailDismissed(true)}
    />
  ) : null;

  return (
    <PageShell
      sideRail={sideRail}
      userInitials={initials}
      activeHref="/doctor"
      mobileDrawer={(open, onClose) => (<DoctorMobileDrawer open={open} onClose={onClose} activeHref="/doctor" />)}
    >
      {/* MOBILE layout (below 1024px) */}
      <div className="dh-mobile-root">
        <div className="dh-mobile-queue-btn">
          <button type="button" onClick={() => setQueueOpen((o) => !o)} className="dh-queue-toggle">
            {queueOpen ? 'Hide patient list' : 'Show patient list'}
            {queueItems.pending.length > 0 && <span className="dh-queue-badge">{queueItems.pending.length}</span>}
          </button>
          {railVisible === false && emotionalSignal?.triggered && railDismissed && (
            <button type="button" onClick={() => setRailDismissed(false)} className="dh-show-rail-btn">
              Show emotional context
            </button>
          )}
        </div>
        <div className="dh-mobile-stack">
          {queueOpen && <div className="dh-mobile-queue">{queueNode}</div>}
          <div className="dh-mobile-case">{caseContent}</div>
          {railNode && <div className="dh-mobile-rail">{railNode}</div>}
        </div>
      </div>

      {/* DESKTOP layout (>=1024px) - resizable panels */}
      <div className="dh-desktop-root">
        {emotionalSignal?.triggered && railDismissed && (
          <div className="dh-reopen-strip">
            <button type="button" onClick={() => setRailDismissed(false)} className="dh-reopen-btn">
              Show emotional context for {caseData?.memberName ?? 'this patient'}
            </button>
          </div>
        )}
        <PanelGroup direction="horizontal" autoSaveId="doctor-v1-layout" className="dh-panelgroup">
          <Panel
            ref={queuePanelRef}
            id="queue"
            order={1}
            defaultSize={22}
            minSize={14}
            maxSize={34}
            collapsible
            collapsedSize={3}
            onCollapse={() => setQueueCollapsed(true)}
            onExpand={() => setQueueCollapsed(false)}
          >
            {queueCollapsed ? (
              <CollapsedStub
                side="left"
                label="Patient list"
                badge={queueItems.pending.length > 0 ? String(queueItems.pending.length) : undefined}
                onClick={() => queuePanelRef.current?.expand()}
              />
            ) : (
              <div className="dh-pane">
                <PaneHeader
                  title="Patient list"
                  subtitle={`${sortedPatients.length} patient${sortedPatients.length === 1 ? '' : 's'}`}
                  onCollapse={() => queuePanelRef.current?.collapse()}
                />
                <div className="dh-pane-body">
                  {queueNode}
                </div>
              </div>
            )}
          </Panel>
          <PanelResizeHandle className="dh-handle">
            <HandleUI />
          </PanelResizeHandle>
          <Panel id="case" order={2} minSize={30}>
            <div className="dh-case-pane">{caseContent}</div>
          </Panel>
          {railVisible && railNode && (
            <>
              <PanelResizeHandle className="dh-handle">
                <HandleUI />
              </PanelResizeHandle>
              <Panel
                ref={railPanelRef}
                id="rail"
                order={3}
                defaultSize={26}
                minSize={16}
                maxSize={40}
                collapsible
                collapsedSize={3}
              >
                {railNode}
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      <style jsx>{`
        /* === MOBILE root (default, below 1024) === */
        .dh-desktop-root { display: none; }
        .dh-mobile-root { display: block; }

        .dh-mobile-queue-btn {
          display: flex;
          gap: 8px;
          padding: 10px 16px 0;
          flex-wrap: wrap;
        }
        .dh-queue-toggle,
        .dh-show-rail-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #FDFBF6;
          border: 1px solid #E0D9C8;
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: #1C1A17;
          cursor: pointer;
        }
        .dh-show-rail-btn {
          background: #FCEFE7;
          border-color: #EFB59B;
          color: #9C3F25;
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
        .dh-mobile-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 12px 16px 20px;
          min-height: calc(100dvh - 180px);
        }

        /* === DESKTOP root (>=1024) === */
        @media (min-width: 1024px) {
          .dh-mobile-root { display: none; }
          .dh-desktop-root {
            display: flex;
            flex-direction: column;
            height: calc(100dvh - 32px);
            padding: 16px;
            gap: 10px;
            box-sizing: border-box;
          }
          .dh-reopen-strip {
            display: flex;
            justify-content: center;
          }
          .dh-reopen-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 14px;
            background: #FCEFE7;
            border: 1px solid #EFB59B;
            border-radius: 999px;
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 600;
            color: #9C3F25;
            cursor: pointer;
          }
          .dh-panelgroup {
            flex: 1;
            min-height: 0;
            width: 100%;
          }
          .dh-pane {
            height: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
          }
          .dh-pane-body {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
          }
          .dh-pane-body > :global(aside),
          .dh-pane-body > :global(div) {
            height: 100%;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }
          .dh-case-pane {
            height: 100%;
            overflow-y: auto;
            padding: 0 8px;
            min-height: 0;
          }
        }

        @media (min-width: 1280px) {
          .dh-desktop-root {
            padding: 20px 24px;
            height: calc(100dvh - 40px);
          }
        }

        @media (min-width: 1600px) {
          .dh-desktop-root {
            padding: 24px clamp(24px, 4vw, 56px);
            height: 100dvh;
          }
        }

        @media (min-width: 1920px) {
          .dh-desktop-root {
            max-width: 1920px;
            margin: 0 auto;
          }
        }
      `}</style>

      <style jsx global>{`
        /* Panel resize handle styling */
        .dh-handle {
          width: 8px;
          background: transparent;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: col-resize;
          flex-shrink: 0;
        }
        .dh-handle:hover .dh-handle-grip,
        .dh-handle[data-panel-resize-handle-active] .dh-handle-grip {
          background: var(--sage-deep, #445A4A);
          opacity: 1;
        }
        .dh-handle-grip {
          width: 3px;
          height: 60px;
          border-radius: 2px;
          background: var(--line-card, #E0D9C8);
          opacity: 0.8;
          transition: background 0.15s ease, opacity 0.15s ease;
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
      background: bg, border: `1px solid ${border}`, borderRadius: 14,
      padding: '36px 28px', fontFamily: 'var(--font-sans)', textAlign: 'center',
      minHeight: 240, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: titleColor, letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: 13, color: '#615C52', maxWidth: 420, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function HandleUI() {
  return <div className="dh-handle-grip" />;
}

function PaneHeader({
  title, subtitle, onCollapse,
}: { title: string; subtitle: string; onCollapse: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 14px', borderBottom: '1px solid #EEE9DB',
      background: '#FDFBF6', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#615C52', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#8B8579', marginTop: 2 }}>{subtitle}</div>
      </div>
      <button
        type="button"
        onClick={onCollapse}
        aria-label={`Collapse ${title}`}
        style={{
          background: '#FFFFFF', border: '1px solid #E0D9C8', borderRadius: 6,
          padding: '4px 6px', cursor: 'pointer', color: '#615C52',
          display: 'inline-flex', alignItems: 'center',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9.5 3L5.5 7L9.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function CollapsedStub({
  side, label, badge, onClick,
}: { side: 'left' | 'right'; label: string; badge?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Expand ${label}`}
      style={{
        height: '100%',
        width: '100%',
        background: '#FDFBF6',
        border: '1px solid #E0D9C8',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '12px 0',
        gap: 10,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d={side === 'left' ? 'M4.5 3L8.5 7L4.5 11' : 'M9.5 3L5.5 7L9.5 11'}
          stroke="#615C52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <div style={{
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        fontSize: 10,
        fontWeight: 700,
        color: '#615C52',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
      }}>{label}</div>
      {badge && (
        <div style={{
          background: '#9C3F25', color: '#fff', fontSize: 10, fontWeight: 700,
          borderRadius: 9, padding: '2px 6px', minWidth: 18, textAlign: 'center',
        }}>{badge}</div>
      )}
    </button>
  );
}
