"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileQueueOpen, setMobileQueueOpen] = useState(true);

  const navPanelRef = useRef<ImperativePanelHandle>(null);
  const queuePanelRef = useRef<ImperativePanelHandle>(null);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [queueCollapsed, setQueueCollapsed] = useState(false);

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

  const queueItems = buildQueueItems(sortedPatients);
  const railVisible = Boolean(emotionalSignal?.triggered) && !railDismissed;

  const caseContent = (() => {
    if (patientsError) return <EmptyState title="Couldn't load patients" body={patientsError} tone="error" />;
    if (loadingPatients) return <EmptyState title="Loading patients..." body="One moment." tone="neutral" />;
    if (sortedPatients.length === 0) return <EmptyState title="No patients on file" body="Seed data may not have loaded." tone="neutral" />;
    if (!selectedId) return <EmptyState title="Pick a patient" body="Open the patient list to start a review." tone="neutral" />;
    if (caseError) return <EmptyState title="Couldn't load this patient's case" body={caseError} tone="error" />;
    if (caseLoading || !caseData) return <EmptyState title="Loading case page..." body={`Fetching panels, chat, and pre-read for ${findName(sortedPatients, selectedId)}`} tone="neutral" />;
    return <CasePage data={caseData} />;
  })();

  // === MOBILE layout (<1024px) ===
  const mobileLayout = (
    <div className="doc-mobile">
      <header className="doc-topbar">
        <button className="doc-hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="3" y="6" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="3" y="11" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="3" y="16" width="16" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <Link href="/doctor" className="doc-wordmark">Precura</Link>
        <div className="doc-avatar">{initials}</div>
      </header>
      <DoctorMobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activeHref="/doctor" />
      <div className="doc-mobile-toggles">
        <button type="button" onClick={() => setMobileQueueOpen((o) => !o)} className="doc-toggle">
          {mobileQueueOpen ? 'Hide patient list' : 'Show patient list'}
          {queueItems.pending.length > 0 && <span className="doc-badge">{queueItems.pending.length}</span>}
        </button>
        {emotionalSignal?.triggered && railDismissed && (
          <button type="button" onClick={() => setRailDismissed(false)} className="doc-toggle warm">
            Show emotional context
          </button>
        )}
      </div>
      <div className="doc-mobile-stack">
        {mobileQueueOpen && (
          <div className="doc-mobile-queue">
            <QueueRail {...queueItems} activePatientId={selectedId} onSelect={(id) => { setSelectedId(id); setMobileQueueOpen(false); }} />
          </div>
        )}
        <div className="doc-mobile-case">{caseContent}</div>
        {railVisible && caseData && emotionalSignal && (
          <div className="doc-mobile-rail">
            <EmotionalRail signal={emotionalSignal} memberId={caseData.memberId} wasAutoTriggered onDismiss={() => setRailDismissed(true)} />
          </div>
        )}
      </div>
    </div>
  );

  // === DESKTOP layout (>=1024px): 4-column grid, all touching ===
  const desktopLayout = (
    <div className="doc-desktop">
      {emotionalSignal?.triggered && railDismissed && (
        <div className="doc-reopen">
          <button type="button" onClick={() => setRailDismissed(false)} className="doc-reopen-btn">
            Show emotional context for {caseData?.memberName ?? 'this patient'}
          </button>
        </div>
      )}
      <PanelGroup direction="horizontal" autoSaveId="doctor-v2-layout" className="doc-panels">
        {/* Column 1: Nav */}
        <Panel
          ref={navPanelRef}
          id="nav"
          order={1}
          defaultSize={16}
          minSize={10}
          maxSize={24}
          collapsible
          collapsedSize={3}
          onCollapse={() => setNavCollapsed(true)}
          onExpand={() => setNavCollapsed(false)}
        >
          {navCollapsed ? (
            <ColStub side="left" label="Nav" onClick={() => navPanelRef.current?.expand()} />
          ) : (
            <section className="col col-nav">
              <div className="col-top">
                <Link href="/doctor" className="col-wordmark">Precura</Link>
                <button className="col-mini-btn" aria-label="Collapse nav" onClick={() => navPanelRef.current?.collapse()}>
                  <ChevronLeft />
                </button>
              </div>
              <div className="col-ident">
                <div className="ident-row">
                  <div className="ident-avatar user">{initials}</div>
                  <div className="ident-text">
                    <div className="ident-name">{displayName}</div>
                    <div className="ident-meta">Clinician</div>
                  </div>
                </div>
                <div className="ident-hr" />
                <div className="ident-row doc">
                  <div className="ident-avatar doc">P</div>
                  <div className="ident-text">
                    <div className="ident-name">Precura clinic</div>
                    <div className="ident-meta sage">{patients.length} patient{patients.length === 1 ? '' : 's'}</div>
                  </div>
                </div>
              </div>
              <nav className="col-nav-items">
                {NAV_ITEMS.map((it) => {
                  const active = it.href === '/doctor';
                  return (
                    <Link key={it.label} href={it.href} className={active ? "col-nav-item active" : "col-nav-item"}>
                      <span className="col-nav-indicator" />
                      {it.label}
                    </Link>
                  );
                })}
              </nav>
            </section>
          )}
        </Panel>

        <PanelResizeHandle className="doc-seam"><SeamUI /></PanelResizeHandle>

        {/* Column 2: Queue */}
        <Panel
          ref={queuePanelRef}
          id="queue"
          order={2}
          defaultSize={20}
          minSize={12}
          maxSize={30}
          collapsible
          collapsedSize={3}
          onCollapse={() => setQueueCollapsed(true)}
          onExpand={() => setQueueCollapsed(false)}
        >
          {queueCollapsed ? (
            <ColStub
              side="left"
              label="Patient list"
              badge={queueItems.pending.length > 0 ? String(queueItems.pending.length) : undefined}
              onClick={() => queuePanelRef.current?.expand()}
            />
          ) : (
            <section className="col col-queue">
              <div className="col-top">
                <div className="col-header-text">
                  <div className="col-eyebrow">Patient list</div>
                  <div className="col-title">{sortedPatients.length} patient{sortedPatients.length === 1 ? '' : 's'}</div>
                </div>
                <button className="col-mini-btn" aria-label="Collapse patient list" onClick={() => queuePanelRef.current?.collapse()}>
                  <ChevronLeft />
                </button>
              </div>
              <div className="col-body hide-scrollbar">
                <QueueRail
                  {...queueItems}
                  activePatientId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                />
              </div>
            </section>
          )}
        </Panel>

        <PanelResizeHandle className="doc-seam"><SeamUI /></PanelResizeHandle>

        {/* Column 3: Case (main) */}
        <Panel id="case" order={3} minSize={30}>
          <section className="col col-case">
            <div className="col-body hide-scrollbar">
              {caseContent}
            </div>
          </section>
        </Panel>

        {/* Column 4: Emotional rail (conditional) */}
        {railVisible && caseData && emotionalSignal && (
          <>
            <PanelResizeHandle className="doc-seam"><SeamUI /></PanelResizeHandle>
            <Panel id="rail" order={4} defaultSize={24} minSize={14} maxSize={36}>
              <section className="col col-rail">
                <div className="col-body hide-scrollbar">
                  <EmotionalRail
                    signal={emotionalSignal}
                    memberId={caseData.memberId}
                    wasAutoTriggered
                    onDismiss={() => setRailDismissed(true)}
                  />
                </div>
              </section>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );

  return (
    <>
      <div className="doc-root-mobile">{mobileLayout}</div>
      <div className="doc-root-desktop">{desktopLayout}</div>

      <style jsx>{`
        /* Default: mobile, hide desktop */
        .doc-root-desktop { display: none; }
        .doc-root-mobile { display: block; min-height: 100dvh; background: var(--canvas); }

        @media (min-width: 1024px) {
          .doc-root-mobile { display: none; }
          .doc-root-desktop { display: block; }
        }

        /* === Mobile topbar/stack === */
        .doc-mobile { display: flex; flex-direction: column; min-height: 100dvh; }
        .doc-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-bottom: 1px solid var(--line-soft);
          background: var(--canvas); position: sticky; top: 0; z-index: 20;
        }
        .doc-hamburger {
          background: none; border: none; cursor: pointer; color: var(--ink);
          display: inline-flex; padding: 4px;
        }
        .doc-wordmark {
          color: var(--ink); font-size: 20px; font-weight: 600;
          letter-spacing: -0.028em; text-decoration: none; font-family: var(--font-sans);
        }
        .doc-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--butter-soft, #F6DDA0) 0%, var(--terracotta-soft, #EFB59B) 100%);
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: var(--ink);
          font-family: var(--font-sans);
        }
        .doc-mobile-toggles {
          display: flex; gap: 8px; padding: 10px 16px 0; flex-wrap: wrap;
        }
        .doc-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px; background: #FDFBF6; border: 1px solid #E0D9C8;
          border-radius: 8px; font-family: var(--font-sans); font-size: 13px;
          font-weight: 600; color: #1C1A17; cursor: pointer;
        }
        .doc-toggle.warm { background: #FCEFE7; border-color: #EFB59B; color: #9C3F25; }
        .doc-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
          background: #9C3F25; color: #fff; font-size: 10px; font-weight: 700;
        }
        .doc-mobile-stack {
          display: flex; flex-direction: column; gap: 14px;
          padding: 12px 16px 20px; flex: 1;
        }

        /* === Desktop layout === */
        .doc-desktop {
          height: 100dvh; display: flex; flex-direction: column;
          background: var(--canvas); overflow: hidden;
        }
        .doc-reopen {
          display: flex; justify-content: center;
          padding: 8px 12px; border-bottom: 1px solid var(--line-soft);
          background: var(--canvas);
        }
        .doc-reopen-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; background: #FCEFE7; border: 1px solid #EFB59B;
          border-radius: 999px; font-family: var(--font-sans); font-size: 12px;
          font-weight: 600; color: #9C3F25; cursor: pointer;
        }
        .doc-panels { flex: 1; min-height: 0; }

        /* Columns - all touching, no card shadows */
        .col {
          height: 100%; display: flex; flex-direction: column;
          min-height: 0; min-width: 0; overflow: hidden;
          font-family: var(--font-sans);
        }
        .col-nav { background: var(--paper, #FFFFFF); }
        .col-queue { background: var(--canvas-soft, #FDFBF6); }
        .col-case { background: var(--canvas, #FBF7F0); }
        .col-rail { background: #FEFBF5; }

        .col-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 14px 16px; border-bottom: 1px solid var(--line-soft);
          flex-shrink: 0; gap: 8px;
        }
        .col-header-text { min-width: 0; }
        .col-eyebrow {
          font-size: 10px; font-weight: 700; color: var(--ink-muted, #615C52);
          text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 2px;
        }
        .col-title { font-size: 15px; font-weight: 600; color: var(--ink, #1C1A17); letter-spacing: -0.01em; }
        .col-mini-btn {
          background: transparent; border: 1px solid var(--line-card, #E0D9C8);
          border-radius: 6px; padding: 4px 6px; cursor: pointer;
          color: var(--ink-muted, #615C52); display: inline-flex; align-items: center;
          flex-shrink: 0;
        }
        .col-mini-btn:hover { background: var(--canvas-soft, #FDFBF6); }
        .col-body { flex: 1; min-height: 0; overflow-y: auto; }

        .col-wordmark {
          color: var(--ink, #1C1A17); font-size: 20px; font-weight: 600;
          letter-spacing: -0.028em; text-decoration: none;
        }
        .col-ident {
          padding: 14px 16px; border-bottom: 1px solid var(--line-soft, #EEE9DB);
        }
        .ident-row {
          display: flex; align-items: center; gap: 10px; padding: 6px 0;
        }
        .ident-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: var(--ink, #1C1A17);
          flex-shrink: 0;
        }
        .ident-avatar.user {
          background: linear-gradient(135deg, var(--butter-soft, #F6DDA0) 0%, var(--terracotta-soft, #EFB59B) 100%);
        }
        .ident-avatar.doc {
          background: linear-gradient(135deg, var(--sage, #728C76) 0%, var(--sage-deep, #445A4A) 100%);
          color: var(--canvas-soft, #FDFBF6);
        }
        .ident-text { min-width: 0; flex: 1; }
        .ident-name { font-size: 13px; font-weight: 600; color: var(--ink, #1C1A17); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ident-meta { font-size: 11px; color: var(--ink-faint, #8B8579); }
        .ident-meta.sage { color: var(--sage-deep, #445A4A); }
        .ident-hr { height: 1px; background: var(--line-soft, #EEE9DB); margin: 4px 0; }

        .col-nav-items { display: flex; flex-direction: column; padding: 8px 10px; }
        .col-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 6px; font-size: 14px; font-weight: 500;
          color: var(--ink-muted, #615C52); text-decoration: none;
          letter-spacing: -0.008em;
        }
        .col-nav-item.active { font-weight: 700; color: var(--ink, #1C1A17); }
        .col-nav-indicator {
          width: 3px; height: 18px; background: transparent; border-radius: 2px; flex-shrink: 0;
        }
        .col-nav-item.active .col-nav-indicator {
          background: var(--terracotta, #C9573A);
          box-shadow: 0 2px 6px rgba(201, 87, 58, 0.35);
        }

        /* Hide scrollbars but keep scroll */
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>

      <style jsx global>{`
        .doc-seam {
          width: 1px;
          background: var(--line-soft, #EEE9DB);
          position: relative;
          flex-shrink: 0;
          cursor: col-resize;
          transition: background 0.15s ease;
        }
        .doc-seam::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          left: -3px; right: -3px;
          cursor: col-resize;
        }
        .doc-seam:hover,
        .doc-seam[data-panel-resize-handle-active] {
          background: var(--sage-deep, #445A4A);
        }
        /* Remove the card styling from child rails since they now live inside naked columns */
        .col-queue > .col-body > :global(aside),
        .col-rail > .col-body > :global(aside),
        .col-queue > .col-body > :global(div[style]) {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: transparent !important;
        }
      `}</style>
    </>
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
      margin: 24, background: bg, border: `1px solid ${border}`, borderRadius: 14,
      padding: '36px 28px', fontFamily: 'var(--font-sans)', textAlign: 'center',
      minHeight: 240, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: titleColor, letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: 13, color: '#615C52', maxWidth: 420, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function SeamUI() {
  return <span style={{ display: 'block', width: '100%', height: '100%' }} />;
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 3L5.5 7L9.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.5 3L8.5 7L4.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ColStub({ side, label, badge, onClick }: { side: 'left' | 'right'; label: string; badge?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Expand ${label}`}
      style={{
        height: '100%', width: '100%', background: 'transparent', border: 'none',
        borderRight: '1px solid var(--line-soft, #EEE9DB)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', padding: '12px 0', gap: 10, cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <span style={{ color: 'var(--ink-muted, #615C52)' }}>
        {side === 'left' ? <ChevronRight /> : <ChevronLeft />}
      </span>
      <div style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontSize: 10, fontWeight: 700, color: 'var(--ink-muted, #615C52)',
        textTransform: 'uppercase', letterSpacing: '0.14em',
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
