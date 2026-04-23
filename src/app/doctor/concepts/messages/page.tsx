"use client";

/**
 * Concept: Dual-Pane Messages
 *
 * Thesis: Dr. Tomas's work is conversational, not transactional. He remembers
 * patients by their ongoing threads, not by rows in a queue. This page
 * inverts /member/discuss - instead of one chat at a time, he sees ALL of
 * them in a single workplace. Left rail is the list of people he is
 * talking to, right pane is the open conversation plus a compact marker
 * strip for context. The sticky composer at the bottom right means replying
 * is the default action, exactly as in Gmail, Front, or Linear triage.
 * Warm editorial tokens keep it feeling like a study, not a help desk.
 */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  NextPanelHint,
  RailNav,
  EditorialColumn,
} from "@/components/layout";
import {
  MOCK_PATIENTS,
  type MockPatient,
  type PatientStatus,
} from "@/app/doctor/concepts/mockPatients";

const NAV_ITEMS = [
  { label: "Home", href: "/doctor" },
  { label: "Messages", href: "/doctor/concepts/messages" },
  { label: "Patients", href: "/doctor/concepts/pipeline" },
  { label: "Triage", href: "/doctor/concepts/triage" },
  { label: "Settings", href: "/doctor/settings" },
];

const DOCTOR = {
  name: "Dr. Tomas Kurakovas",
  initials: "TK",
  title: "Licensed doctor",
};

// ---------------------------------------------------------------------------
// Status styling
// ---------------------------------------------------------------------------

const STATUS_LABEL: Record<PatientStatus, string> = {
  pending_review: "Needs review",
  awaiting_patient: "Awaiting reply",
  active: "Active",
  stale: "Dormant",
  new_member: "New",
};

function statusPalette(status: PatientStatus): { bg: string; fg: string } {
  switch (status) {
    case "pending_review":
      return { bg: "var(--terracotta-tint)", fg: "var(--terracotta-deep)" };
    case "awaiting_patient":
      return { bg: "var(--butter-tint)", fg: "#7A5A10" };
    case "active":
      return { bg: "var(--sage-tint)", fg: "var(--sage-deep)" };
    case "stale":
      return { bg: "#F1EDE4", fg: "var(--ink-muted)" };
    case "new_member":
      return { bg: "var(--butter-tint)", fg: "#7A5A10" };
  }
}

// ---------------------------------------------------------------------------
// Conversation fabrication - strictly grounded in patient.summary
// ---------------------------------------------------------------------------

interface ConvMessage {
  author: "doctor" | "patient";
  body: string;
  timestamp: string;
}

function fabricateThread(p: MockPatient): ConvMessage[] {
  switch (p.id) {
    case "p1":
      return [
        {
          author: "doctor",
          body: `Hi Anna, I had a look at your October panel back in November and flagged that your LDL had edged up. Your new panel just landed. I want to read through it carefully before I reply properly.`,
          timestamp: "Nov 2, 2025",
        },
        {
          author: "patient",
          body: `Thank you Tomas. I have been trying to walk more but honestly the winter has been hard. Looking forward to your thoughts.`,
          timestamp: "Nov 3, 2025",
        },
        {
          author: "patient",
          body: `Uploaded the new panel this morning. A bit nervous about it, the finger-prick kit said my blood sugar reading was on the high side.`,
          timestamp: "2 days ago",
        },
      ];
    case "p2":
      return [
        {
          author: "patient",
          body: `Hi, just joined and uploaded my first panel. I am a bit tired lately and saw a few values flagged. Would appreciate your take when you get a chance.`,
          timestamp: "Today, 09:14",
        },
      ];
    case "p3":
      return [
        {
          author: "doctor",
          body: `Eoghan, your latest panel looks clean right through. Nothing needs action. I would keep the current training and check back in six months.`,
          timestamp: "3 days ago",
        },
        {
          author: "patient",
          body: `Amazing, thank you. Quick question - I am travelling for work next month, two weeks in warmer climates. Any tweaks you would suggest to the training load while I am away?`,
          timestamp: "Today, 11:02",
        },
        {
          author: "patient",
          body: `Hotels only have treadmills and some dumbbells. Happy to send you the gym setup when I arrive.`,
          timestamp: "Today, 11:03",
        },
      ];
    case "p4":
      return [
        {
          author: "doctor",
          body: `Mikael, your LDL is a touch above range but trending the right way. I would like to retest in three months to confirm before we change anything.`,
          timestamp: "Feb 13",
        },
        {
          author: "patient",
          body: `Sounds good Tomas, will book it in.`,
          timestamp: "Feb 13",
        },
      ];
    case "p5":
      return [
        {
          author: "doctor",
          body: `Kristina, your TSH was sitting slightly above range. Nothing urgent, but worth a recheck when you are next due. Let me know if anything changes in the meantime.`,
          timestamp: "Oct 17, 2025",
        },
        {
          author: "patient",
          body: `Thank you Tomas. Will do.`,
          timestamp: "Nov 4, 2025",
        },
      ];
    case "p6":
      return [
        {
          author: "patient",
          body: `Hi, just signed up. Looking forward to getting started.`,
          timestamp: "Yesterday",
        },
      ];
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeLabel(p: MockPatient): string {
  if (p.daysSinceLastAction === 0) return "Today";
  if (p.daysSinceLastAction === 1) return "Yesterday";
  if (p.daysSinceLastAction < 7) return `${p.daysSinceLastAction}d ago`;
  if (p.daysSinceLastAction < 30) return `${Math.floor(p.daysSinceLastAction / 7)}w ago`;
  if (p.daysSinceLastAction < 365) return `${Math.floor(p.daysSinceLastAction / 30)}mo ago`;
  return `${Math.floor(p.daysSinceLastAction / 365)}y ago`;
}

function sortedPatients(list: MockPatient[]): MockPatient[] {
  return [...list].sort((a, b) => a.daysSinceLastAction - b.daysSinceLastAction);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MessagesConceptPage() {
  const sorted = useMemo(() => sortedPatients(MOCK_PATIENTS), []);
  const [activeId, setActiveId] = useState<string>(sorted[0]?.id ?? "");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const active = sorted.find((p) => p.id === activeId) ?? sorted[0];
  const thread = useMemo(() => fabricateThread(active), [active]);

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor" />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: DOCTOR.name, initials: DOCTOR.initials, memberSince: "Since 2024" }}
          doctor={{
            name: "Precura clinic",
            initials: "PC",
            title: "Licensed clinical team",
          }}
        />,
        <NextPanelHint
          key="np"
          eyebrow="Today"
          headline={`${sorted.filter((p) => p.status === "pending_review").length} need a review`}
          subtext="Written replies save the day"
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/doctor/concepts/messages" />,
      ]}
    />
  );

  function handleSelect(id: string) {
    setActiveId(id);
    setMobileDetailOpen(true);
    setDraft("");
  }

  function handleSend() {
    // This concept does not persist - send clears the composer.
    setDraft("");
  }

  return (
    <PageShell sideRail={sideRail} userInitials={DOCTOR.initials} activeHref="/doctor/concepts/messages">
      <EditorialColumn variant="wide">
        <div className={`dpm ${mobileDetailOpen ? "detail-open" : ""}`}>
          {/* ---------------- Left pane: patient list ---------------- */}
          <aside className="dpm-list" aria-label="Patient conversations">
            <header className="dpm-list-head">
              <div className="dpm-eyebrow">Conversations</div>
              <h1 className="dpm-list-title">Inbox</h1>
              <div className="dpm-list-count">
                {sorted.length} patients, sorted by recent activity
              </div>
            </header>

            <ul className="dpm-rows" role="listbox" aria-label="Patients">
              {sorted.map((p) => {
                const isActive = p.id === active.id;
                const palette = statusPalette(p.status);
                return (
                  <li key={p.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      className={`dpm-row ${isActive ? "is-active" : ""}`}
                      onClick={() => handleSelect(p.id)}
                    >
                      <span className="dpm-row-indicator" aria-hidden />
                      <span className="dpm-row-avatar">
                        {p.initials}
                        {p.unreadMessages > 0 && (
                          <span className="dpm-row-unread" aria-label={`${p.unreadMessages} unread`}>
                            {p.unreadMessages}
                          </span>
                        )}
                      </span>
                      <span className="dpm-row-body">
                        <span className="dpm-row-line-1">
                          <span className="dpm-row-name">{p.name}</span>
                          <span className="dpm-row-time">{relativeLabel(p)}</span>
                        </span>
                        <span className="dpm-row-line-2">
                          <span
                            className="dpm-row-status"
                            style={{ background: palette.bg, color: palette.fg }}
                          >
                            {STATUS_LABEL[p.status]}
                          </span>
                          <span className="dpm-row-summary">{p.summary}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ---------------- Separator ---------------- */}
          <div className="dpm-sep" aria-hidden />

          {/* ---------------- Right pane: conversation + context ---------------- */}
          <section className="dpm-detail" aria-label="Conversation">
            <button
              type="button"
              className="dpm-back"
              onClick={() => setMobileDetailOpen(false)}
              aria-label="Back to list"
            >
              <span className="dpm-back-caret">/</span> Back to list
            </button>

            <PatientHeader patient={active} />

            <MarkerStrip patient={active} />

            <div className="dpm-thread-wrap">
              <Thread messages={thread} patient={active} />
            </div>

            <Composer
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
              patient={active}
            />
          </section>
        </div>
      </EditorialColumn>

      <style jsx global>{`
        .dpm {
          --list-w: 340px;
          display: grid;
          grid-template-columns: var(--list-w) 1px minmax(0, 1fr);
          gap: 0;
          background: var(--paper);
          border: 1px solid var(--line-card);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          min-height: calc(100dvh - 160px);
        }

        /* Mobile: single pane, toggle via .detail-open */
        @media (max-width: 900px) {
          .dpm { grid-template-columns: 1fr; min-height: auto; }
          .dpm-list { display: block; }
          .dpm-sep { display: none; }
          .dpm-detail { display: none; }
          .dpm.detail-open .dpm-list { display: none; }
          .dpm.detail-open .dpm-detail { display: flex; }
        }

        /* ------ List pane ------ */
        .dpm-list {
          background: var(--canvas-soft);
          border-right: 0;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        @media (min-width: 901px) {
          .dpm-list { max-height: calc(100dvh - 160px); overflow-y: auto; }
        }

        .dpm-list-head {
          padding: 24px 22px 14px;
          border-bottom: 1px solid var(--line-soft);
          background: var(--canvas-soft);
          position: sticky;
          top: 0;
          z-index: 2;
        }
        .dpm-eyebrow {
          font-size: 10px;
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .dpm-list-title {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: 26px;
          color: var(--ink);
          letter-spacing: -0.012em;
          margin: 0 0 6px;
        }
        .dpm-list-count {
          font-size: 12px;
          color: var(--ink-faint);
        }

        .dpm-rows {
          list-style: none;
          margin: 0;
          padding: 6px 0;
          flex: 1;
        }

        .dpm-row {
          all: unset;
          display: flex;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
          padding: 14px 18px 14px 16px;
          cursor: pointer;
          transition: background 160ms ease;
          position: relative;
          font-family: var(--font-sans);
        }
        .dpm-row:hover { background: rgba(114, 140, 118, 0.06); }
        .dpm-row.is-active {
          background: var(--paper);
          box-shadow: inset 0 -1px 0 var(--line-soft), inset 0 1px 0 var(--line-soft);
        }
        .dpm-row-indicator {
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 2px;
          border-radius: 2px;
          background: transparent;
        }
        .dpm-row.is-active .dpm-row-indicator {
          background: var(--terracotta);
          box-shadow: 0 2px 6px rgba(201, 87, 58, 0.35);
        }

        .dpm-row-avatar {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
          color: var(--ink);
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: -0.01em;
          box-shadow: var(--shadow-soft);
        }
        .dpm-row-unread {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: var(--terracotta);
          color: white;
          font-size: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(201, 87, 58, 0.35);
          border: 1.5px solid var(--canvas-soft);
        }

        .dpm-row-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .dpm-row-line-1 {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
        }
        .dpm-row-name {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: -0.005em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dpm-row.is-active .dpm-row-name { color: var(--ink); }
        .dpm-row-time {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 11px;
          color: var(--ink-faint);
          flex-shrink: 0;
        }
        .dpm-row-line-2 {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dpm-row-status {
          align-self: flex-start;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .dpm-row-summary {
          font-size: 12px;
          color: var(--ink-muted);
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ------ Separator ------ */
        .dpm-sep {
          background: var(--sage-soft);
          opacity: 0.55;
          width: 1px;
        }

        /* ------ Detail pane ------ */
        .dpm-detail {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          background: var(--paper);
        }
        @media (min-width: 901px) {
          .dpm-detail { max-height: calc(100dvh - 160px); }
        }

        .dpm-back {
          display: none;
          background: none;
          border: none;
          align-self: flex-start;
          padding: 14px 18px 0;
          color: var(--sage-deep);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
          cursor: pointer;
        }
        .dpm-back-caret {
          display: inline-block;
          transform: scaleX(-1);
          margin-right: 6px;
        }
        @media (max-width: 900px) {
          .dpm-back { display: block; }
        }

        /* ------ Patient header ------ */
        .dph {
          padding: 24px 28px 18px;
          border-bottom: 1px solid var(--line-soft);
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .dph-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
          color: var(--ink);
          font-size: 16px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-soft);
        }
        .dph-body {
          flex: 1;
          min-width: 0;
        }
        .dph-name {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: 26px;
          color: var(--ink);
          letter-spacing: -0.012em;
          margin: 0 0 6px;
          line-height: 1.15;
        }
        .dph-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: var(--ink-muted);
        }
        .dph-dot { color: var(--ink-faint); }
        .dph-status {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .dph-file {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--sage-deep);
          letter-spacing: -0.005em;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--sage-soft);
          background: var(--sage-tint);
          transition: background 160ms ease;
        }
        .dph-file:hover { background: var(--sage-soft); }

        /* ------ Marker strip ------ */
        .dpms {
          padding: 14px 28px 16px;
          border-bottom: 1px solid var(--line-soft);
          background: var(--canvas-soft);
        }
        .dpms-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .dpms-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dpms-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 999px;
          background: var(--terracotta-tint);
          color: var(--terracotta-deep);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.005em;
          border: 1px solid rgba(201, 87, 58, 0.18);
        }
        .dpms-chip.low {
          background: var(--butter-tint);
          color: #7A5A10;
          border-color: rgba(233, 181, 71, 0.35);
        }
        .dpms-chip.none {
          background: var(--sage-tint);
          color: var(--sage-deep);
          border-color: rgba(114, 140, 118, 0.22);
        }
        .dpms-chip-dir {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 12px;
          font-weight: 400;
        }

        /* ------ Thread ------ */
        .dpm-thread-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 20px 28px 24px;
          background: var(--paper);
          min-height: 0;
        }
        .dpmt {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 720px;
          margin: 0 auto;
        }
        .dpmt-msg {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dpmt-msg.doctor { align-items: flex-end; }
        .dpmt-msg.patient { align-items: flex-start; }
        .dpmt-attrib {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 0 6px;
        }
        .dpmt-who {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 12px;
          font-weight: 400;
        }
        .dpmt-msg.doctor .dpmt-who { color: var(--sage-deep); }
        .dpmt-msg.patient .dpmt-who { color: var(--terracotta-deep); }
        .dpmt-when {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 11px;
          color: var(--ink-faint);
        }
        .dpmt-bubble {
          max-width: 78%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          letter-spacing: -0.005em;
          color: var(--ink);
        }
        .dpmt-msg.doctor .dpmt-bubble {
          background: var(--sage-tint);
          border: 1px solid rgba(114, 140, 118, 0.2);
          border-bottom-right-radius: 6px;
        }
        .dpmt-msg.patient .dpmt-bubble {
          background: var(--canvas-soft);
          border: 1px solid var(--line-soft);
          border-bottom-left-radius: 6px;
        }
        .dpmt-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 14px;
        }

        /* ------ Composer ------ */
        .dpmc {
          border-top: 1px solid var(--line-soft);
          background: var(--canvas-soft);
          padding: 16px 28px 20px;
          position: sticky;
          bottom: 0;
        }
        .dpmc-inner {
          max-width: 720px;
          margin: 0 auto;
          background: var(--paper);
          border: 1px solid var(--line-card);
          border-radius: 16px;
          box-shadow: var(--shadow-soft);
          overflow: hidden;
        }
        .dpmc-to {
          padding: 10px 16px 0;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 12px;
          color: var(--ink-faint);
        }
        .dpmc-to b {
          font-weight: 400;
          font-style: italic;
          color: var(--ink-soft);
        }
        .dpmc-textarea {
          width: 100%;
          min-height: 72px;
          max-height: 200px;
          padding: 10px 16px 8px;
          border: none;
          background: transparent;
          resize: none;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--ink);
          letter-spacing: -0.005em;
          line-height: 1.5;
          box-sizing: border-box;
          outline: none;
        }
        .dpmc-textarea::placeholder { color: var(--ink-faint); }
        .dpmc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px 10px 16px;
          border-top: 1px solid var(--line-soft);
        }
        .dpmc-helpers {
          display: flex;
          gap: 14px;
          font-size: 11px;
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
        }
        .dpmc-send {
          background: var(--sage-deep);
          color: var(--canvas-soft);
          border: none;
          padding: 9px 18px;
          border-radius: 999px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(68, 90, 74, 0.28);
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .dpmc-send:hover:not(:disabled) {
          transform: translateY(-1px);
          background: var(--sage);
          box-shadow: 0 4px 12px rgba(68, 90, 74, 0.34);
        }
        .dpmc-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Patient header
// ---------------------------------------------------------------------------

function PatientHeader({ patient }: { patient: MockPatient }) {
  const palette = statusPalette(patient.status);
  return (
    <header className="dph">
      <div className="dph-avatar">{patient.initials}</div>
      <div className="dph-body">
        <h2 className="dph-name">{patient.name}</h2>
        <div className="dph-meta">
          <span>
            {patient.age} / {patient.sex === "F" ? "F" : "M"}
          </span>
          <span className="dph-dot">/</span>
          <span>{patient.panelsCount} panels on file</span>
          <span className="dph-dot">/</span>
          <span
            className="dph-status"
            style={{ background: palette.bg, color: palette.fg }}
          >
            {STATUS_LABEL[patient.status]}
          </span>
        </div>
      </div>
      <Link href={`/doctor/concepts/patient/${patient.id}`} className="dph-file">
        Open full file
      </Link>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Marker strip
// ---------------------------------------------------------------------------

function MarkerStrip({ patient }: { patient: MockPatient }) {
  if (patient.flaggedMarkers.length === 0) {
    return (
      <div className="dpms">
        <div className="dpms-label">Markers</div>
        <div className="dpms-row">
          <span className="dpms-chip none">
            <span>All within range</span>
          </span>
          {patient.panelsCount === 0 ? (
            <span className="dpms-chip none">
              <span>No panels on file</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div className="dpms">
      <div className="dpms-label">Flagged on latest panel</div>
      <div className="dpms-row">
        {patient.flaggedMarkers.map((m, i) => (
          <span
            key={i}
            className={`dpms-chip ${m.direction === "low" ? "low" : ""}`}
          >
            <span>{m.marker}</span>
            <span className="dpms-chip-dir">
              {m.value} {m.unit} / {m.direction === "high" ? "high" : "low"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Thread
// ---------------------------------------------------------------------------

function Thread({ messages, patient }: { messages: ConvMessage[]; patient: MockPatient }) {
  if (messages.length === 0) {
    return (
      <div className="dpmt-empty">
        No messages yet. The composer below starts the conversation.
      </div>
    );
  }
  return (
    <div className="dpmt">
      {messages.map((m, i) => (
        <div key={i} className={`dpmt-msg ${m.author}`}>
          <div className="dpmt-attrib">
            <span className="dpmt-who">
              {m.author === "doctor" ? DOCTOR.name : patient.name.split(" ")[0]}
            </span>
            <span className="dpmt-when">{m.timestamp}</span>
          </div>
          <div className="dpmt-bubble">{m.body}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composer
// ---------------------------------------------------------------------------

function Composer({
  value,
  onChange,
  onSend,
  patient,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  patient: MockPatient;
}) {
  const canSend = value.trim().length > 0;
  return (
    <div className="dpmc">
      <div className="dpmc-inner">
        <div className="dpmc-to">
          Replying to <b>{patient.name}</b>
        </div>
        <textarea
          className="dpmc-textarea"
          placeholder={`Write to ${patient.name.split(" ")[0]}...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSend) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="dpmc-toolbar">
          <div className="dpmc-helpers">
            <span>Cmd + Enter to send</span>
            <span>Signed as Dr. Tomas</span>
          </div>
          <button
            type="button"
            className="dpmc-send"
            onClick={onSend}
            disabled={!canSend}
          >
            Send reply
          </button>
        </div>
      </div>
    </div>
  );
}
