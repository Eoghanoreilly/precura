"use client";

// ============================================================================
// Doctor concept: Kanban Pipeline
// ----------------------------------------------------------------------------
// Thesis: a doctor scaling to hundreds of patients thinks in STATES, not a
// ranked to-do list. Every patient is somewhere in a lifecycle: a panel just
// arrived, you are in active dialogue, you sent a note and they have not
// acted, they have gone quiet, they just joined. The page is a 5-column
// board: "New panel in" -> "Active care" -> "Awaiting patient" ->
// "Needs check-in" -> "Newly joined". Work flows left to right as Tomas
// resolves cards. Columns keep the warm paper-on-canvas feel; cards are
// dense but human (name, age/sex, one-sentence situation, the single next
// move, flagged-marker pills). Responsive: 5-up wide, 3-up laptop, snap
// scroll on tablet / mobile.
// ============================================================================

import React from "react";
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
  POPULATION_STATS,
  type MockPatient,
  type PatientFlag,
  type PatientStatus,
} from "@/app/doctor/concepts/mockPatients";

// ---------------------------------------------------------------------------
// Column definitions. Order is the doctor's mental flow: freshly-arrived work
// on the left, long-dormant or net-new on the right.
// ---------------------------------------------------------------------------

type ColumnDef = {
  status: PatientStatus;
  label: string;        // serif italic column title
  hint: string;         // small helper text beneath the label
  accent: string;       // CSS color token for the dot/header bar
  accentSoft: string;   // CSS color token for the subtle column wash
};

const COLUMNS: ColumnDef[] = [
  {
    status: "pending_review",
    label: "New panel in",
    hint: "Needs your note",
    accent: "var(--terracotta)",
    accentSoft: "var(--terracotta-tint)",
  },
  {
    status: "active",
    label: "Active care",
    hint: "In dialogue",
    accent: "var(--sage-deep)",
    accentSoft: "var(--sage-tint)",
  },
  {
    status: "awaiting_patient",
    label: "Awaiting patient",
    hint: "Ball in their court",
    accent: "var(--butter)",
    accentSoft: "var(--butter-tint)",
  },
  {
    status: "stale",
    label: "Needs check-in",
    hint: "Quiet for 90+ days",
    accent: "var(--ink-muted)",
    accentSoft: "var(--stone-soft)",
  },
  {
    status: "new_member",
    label: "Newly joined",
    hint: "No panels yet",
    accent: "var(--sage)",
    accentSoft: "var(--sage-tint)",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DoctorPipelinePage() {
  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor/concepts/pipeline" />}
      sections={[
        <IdentityCard
          key="id"
          user={{
            name: "Dr. Tomas Kurakovas",
            initials: "TK",
            memberSince: "Your patients",
          }}
          doctor={{
            name: "Precura Care",
            initials: "P",
            title: "Licensed in Sweden",
          }}
        />,
        <NextPanelHint
          key="np"
          eyebrow="This morning"
          headline={`${POPULATION_STATS.pendingReview} waiting on you`}
          subtext={`${POPULATION_STATS.awaitingPatient} waiting on patients, ${POPULATION_STATS.stale} gone quiet`}
        />,
        <RailNav
          key="nav"
          activeHref="/doctor/concepts/pipeline"
          items={[
            { label: "Patients", href: "/doctor/concepts/pipeline" },
            { label: "Panels", href: "/doctor/concepts/panels" },
            { label: "Notes", href: "/doctor/concepts/notes" },
            { label: "Settings", href: "/doctor/concepts/settings" },
          ]}
        />,
      ]}
    />
  );

  // Group patients by status once.
  const grouped = COLUMNS.map((col) => ({
    column: col,
    patients: MOCK_PATIENTS.filter((p) => p.status === col.status),
  }));

  return (
    <PageShell
      sideRail={sideRail}
      mobileDrawer={<></>}
      userInitials="TK"
      activeHref="/doctor/concepts/pipeline"
      logoHref="/doctor/concepts/pipeline"
    >
      <EditorialColumn variant="wide">
        {/* Quiet header: eyebrow + title, no hero card so the board breathes */}
        <header className="pipe-header">
          <div className="pipe-eyebrow">
            <em>Thursday morning</em>
          </div>
          <h1 className="pipe-title">Your patients</h1>
          <p className="pipe-lede">
            Cards move left to right as work lands. Tap any patient to open
            their file.
          </p>
        </header>

        {/* The board */}
        <div className="pipe-board" role="list">
          {grouped.map(({ column, patients }) => (
            <Column
              key={column.status}
              column={column}
              patients={patients}
            />
          ))}
        </div>

        {/* Quiet footer caption */}
        <p className="pipe-footnote">
          {POPULATION_STATS.total} patients in total.{" "}
          {POPULATION_STATS.unreadMessages} unread messages across all files.
        </p>
      </EditorialColumn>

      <style jsx>{`
        .pipe-header {
          margin-bottom: var(--sp-7);
          padding: 0 var(--sp-1);
        }
        .pipe-eyebrow {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--sage-deep);
          font-size: var(--text-eyebrow);
          letter-spacing: 0.02em;
          margin-bottom: var(--sp-3);
        }
        .pipe-title {
          font-size: var(--text-title);
          font-weight: 500;
          letter-spacing: -0.024em;
          color: var(--ink);
          margin: 0 0 var(--sp-2);
        }
        .pipe-lede {
          font-size: var(--text-dense);
          color: var(--ink-muted);
          margin: 0;
          max-width: 560px;
          line-height: var(--line-height-body);
        }

        /* Responsive board.
           - base (mobile / small tablet): horizontal scroll with scroll-snap,
             columns are a fixed comfortable width.
           - >=900px: laptop, 3 columns visible; still scrolls to reach the
             last two.
           - >=1440px: wide desktop, all 5 columns fit side by side. */
        .pipe-board {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 78%;
          gap: var(--sp-5);
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: var(--sp-4);
          margin: 0 calc(-1 * var(--sp-2));
          padding-left: var(--sp-2);
          padding-right: var(--sp-2);
          scrollbar-gutter: stable;
        }
        .pipe-board :global(.pipe-col) {
          scroll-snap-align: start;
        }

        @media (min-width: 600px) {
          .pipe-board {
            grid-auto-columns: 52%;
          }
        }
        @media (min-width: 900px) {
          .pipe-board {
            grid-auto-columns: 32%;
            gap: var(--sp-4);
          }
        }
        @media (min-width: 1200px) {
          .pipe-board {
            grid-auto-columns: 1fr;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            grid-auto-flow: row;
            overflow-x: visible;
            scroll-snap-type: none;
            gap: var(--sp-4);
          }
        }
        @media (min-width: 1440px) {
          .pipe-board {
            gap: var(--sp-5);
          }
        }

        .pipe-footnote {
          margin-top: var(--sp-6);
          font-size: var(--text-meta);
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
          letter-spacing: 0.005em;
        }
      `}</style>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------

function Column({
  column,
  patients,
}: {
  column: ColumnDef;
  patients: MockPatient[];
}) {
  return (
    <section
      className="pipe-col"
      role="listitem"
      aria-label={`${column.label}, ${patients.length} patient${patients.length === 1 ? "" : "s"}`}
    >
      <header className="pipe-col-head">
        <div className="pipe-col-title-row">
          <span
            className="pipe-col-dot"
            style={{ background: column.accent }}
            aria-hidden="true"
          />
          <h2 className="pipe-col-label">{column.label}</h2>
          <span className="pipe-col-count">{patients.length}</span>
        </div>
        <p className="pipe-col-hint">{column.hint}</p>
      </header>

      <div className="pipe-col-body">
        {patients.length === 0 ? (
          <EmptyCell />
        ) : (
          patients.map((p) => <PatientCard key={p.id} patient={p} />)
        )}
      </div>

      <style jsx>{`
        .pipe-col {
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: ${column.accentSoft};
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          padding: var(--sp-4) var(--sp-3) var(--sp-3);
        }

        .pipe-col-head {
          padding: 0 var(--sp-2) var(--sp-3);
          border-bottom: 1px dashed var(--line);
          margin-bottom: var(--sp-3);
        }

        .pipe-col-title-row {
          display: flex;
          align-items: baseline;
          gap: var(--sp-2);
        }

        .pipe-col-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          transform: translateY(-1px);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }

        .pipe-col-label {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 500;
          font-size: var(--text-section);
          color: var(--ink);
          letter-spacing: 0.003em;
          margin: 0;
          flex: 1;
          min-width: 0;
        }

        .pipe-col-count {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          font-size: var(--text-meta);
          font-weight: 600;
          color: var(--ink-muted);
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
          padding: 2px 10px;
          letter-spacing: -0.005em;
        }

        .pipe-col-hint {
          font-size: var(--text-micro);
          color: var(--ink-muted);
          margin: var(--sp-1) 0 0;
          letter-spacing: -0.002em;
        }

        .pipe-col-body {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
          flex: 1;
          min-height: 80px;
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PatientCard
// ---------------------------------------------------------------------------

function PatientCard({ patient }: { patient: MockPatient }) {
  const firstSentence = splitFirstSentence(patient.summary);

  return (
    <a
      href={`/doctor/patients/${patient.id}`}
      className="pcard"
      aria-label={`Open file for ${patient.name}`}
    >
      <div className="pcard-top">
        <div className="pcard-avatar" aria-hidden="true">
          {patient.initials}
        </div>
        <div className="pcard-nameblock">
          <div className="pcard-name">{patient.name}</div>
          <div className="pcard-meta">
            <span>
              {patient.age} / {patient.sex}
            </span>
            <span className="pcard-dot-sep">&middot;</span>
            <span>{ageTagline(patient)}</span>
          </div>
        </div>
        {patient.unreadMessages > 0 && (
          <span
            className="pcard-unread"
            aria-label={`${patient.unreadMessages} unread message${patient.unreadMessages === 1 ? "" : "s"}`}
          >
            {patient.unreadMessages}
          </span>
        )}
      </div>

      <p className="pcard-summary">{firstSentence}</p>

      {patient.flaggedMarkers.length > 0 && (
        <div className="pcard-pills" aria-label="Flagged markers">
          {patient.flaggedMarkers.slice(0, 3).map((flag, i) => (
            <FlagPill key={`${flag.marker}-${i}`} flag={flag} />
          ))}
          {patient.flaggedMarkers.length > 3 && (
            <span className="pcard-pill-more">
              +{patient.flaggedMarkers.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="pcard-action">
        <span className="pcard-action-label">Next:</span>{" "}
        <span className="pcard-action-text">{patient.suggestedAction}</span>
      </div>

      <style jsx>{`
        .pcard {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
          background: var(--paper);
          border: 1px solid var(--line-card);
          border-radius: var(--radius);
          padding: var(--sp-4);
          text-decoration: none;
          color: var(--ink);
          font-family: var(--font-sans);
          box-shadow: var(--shadow-soft);
          transition: transform 0.18s ease, box-shadow 0.22s ease,
            border-color 0.2s ease;
        }
        .pcard:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-card);
          border-color: var(--line-card);
        }

        .pcard-top {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }

        .pcard-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            var(--butter-soft) 0%,
            var(--terracotta-soft) 100%
          );
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.01em;
          flex-shrink: 0;
          box-shadow: var(--shadow-soft);
        }

        .pcard-nameblock {
          flex: 1;
          min-width: 0;
        }

        .pcard-name {
          font-size: var(--text-dense);
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pcard-meta {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .pcard-dot-sep {
          color: var(--ink-faint);
        }

        .pcard-unread {
          flex-shrink: 0;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: var(--radius-pill);
          background: var(--terracotta);
          color: var(--canvas-soft);
          font-size: var(--text-micro);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: -0.01em;
          box-shadow: 0 1px 3px rgba(201, 87, 58, 0.35);
        }

        .pcard-summary {
          font-size: var(--text-meta);
          line-height: 1.5;
          color: var(--ink-soft);
          margin: 0;
          letter-spacing: -0.004em;
        }

        .pcard-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .pcard-pill-more {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background: var(--stone-soft);
          color: var(--ink-muted);
          font-size: var(--text-micro);
          font-weight: 600;
          letter-spacing: -0.005em;
        }

        .pcard-action {
          border-top: 1px dashed var(--line-soft);
          padding-top: var(--sp-3);
          font-size: var(--text-micro);
          line-height: 1.5;
          color: var(--ink-muted);
          letter-spacing: -0.002em;
        }

        .pcard-action-label {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--sage-deep);
          margin-right: 4px;
        }

        .pcard-action-text {
          color: var(--ink-soft);
        }
      `}</style>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Flag pill
// ---------------------------------------------------------------------------

function FlagPill({ flag }: { flag: PatientFlag }) {
  const tone =
    flag.severity === "severe"
      ? "severe"
      : flag.severity === "moderate"
      ? "moderate"
      : "mild";
  const arrow = flag.direction === "high" ? "hi" : "lo";

  return (
    <span className={`flag-pill flag-${tone}`}>
      <span className="flag-marker">{flag.marker}</span>
      <span className="flag-arrow">{arrow === "hi" ? "up" : "low"}</span>

      <style jsx>{`
        .flag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px 2px 7px;
          border-radius: var(--radius-pill);
          font-size: var(--text-micro);
          line-height: 1;
          font-family: var(--font-sans);
          letter-spacing: -0.003em;
          border: 1px solid transparent;
        }
        .flag-mild {
          background: var(--butter-tint);
          color: #8A5E13;
          border-color: #E9CE95;
        }
        .flag-moderate {
          background: var(--terracotta-tint);
          color: var(--terracotta-deep);
          border-color: #EFC6AE;
        }
        .flag-severe {
          background: #F8DFD5;
          color: var(--terracotta-deep);
          border-color: var(--terracotta-soft);
        }
        .flag-marker {
          font-weight: 700;
          font-size: var(--text-micro);
          letter-spacing: -0.005em;
        }
        .flag-arrow {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.75;
          padding-top: 1px;
        }
      `}</style>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Empty cell
// ---------------------------------------------------------------------------

function EmptyCell() {
  return (
    <div className="empty">
      Nothing here.
      <style jsx>{`
        .empty {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--ink-faint);
          padding: var(--sp-5) var(--sp-2);
          text-align: center;
          border: 1px dashed var(--line-soft);
          border-radius: var(--radius);
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function splitFirstSentence(text: string): string {
  // Grab the first sentence (ending in . ! or ?). Fallback to 120 chars.
  const match = text.match(/^[^.!?]+[.!?]/);
  if (match) return match[0].trim();
  return text.length > 120 ? `${text.slice(0, 120).trim()}...` : text;
}

function ageTagline(p: MockPatient): string {
  if (p.status === "new_member") return "Joined yesterday";
  if (p.daysSinceLastAction === 0) return "Active today";
  if (p.daysSinceLastAction === 1) return "Active yesterday";
  if (p.daysSinceLastAction < 7) return `${p.daysSinceLastAction} days ago`;
  if (p.daysSinceLastAction < 30) {
    const weeks = Math.round(p.daysSinceLastAction / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  const months = Math.round(p.daysSinceLastAction / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
