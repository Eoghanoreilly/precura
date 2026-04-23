"use client";

// ---------------------------------------------------------------------------
// Workbench Database
// ---------------------------------------------------------------------------
// Thesis: a doctor running a roster of hundreds of patients does not need
// an editorial feed. She needs a SPREADSHEET. This page treats the panel
// population as a database - paper rows on canvas, sage hairlines between,
// sortable columns in serif italic, filter chips at the top, and terracotta
// used SPARINGLY as a left-edge indicator for "needs review". Power-user
// affordances (sort, filter, severity flag clusters, relative time stamps,
// unread counts) in a warm editorial shell so it still feels Precura, not
// Excel. On narrow screens the table collapses gracefully into a card list.
// ---------------------------------------------------------------------------

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
  type PatientFlag,
} from "@/app/doctor/concepts/mockPatients";

// ---------------------------------------------------------------------------
// Navigation and shell config
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: "Home", href: "/doctor" },
  { label: "Workbench", href: "/doctor/concepts/workbench" },
  { label: "Panels", href: "/doctor/panels" },
  { label: "Messages", href: "/doctor/messages" },
  { label: "Settings", href: "/doctor/settings" },
];

const DOCTOR_SELF = {
  name: "Dr. Tomas Kurakovas",
  initials: "TK",
  title: "Licensed doctor",
};

const CLINIC = {
  name: "Precura clinic",
  initials: "PC",
  memberSince: "Reviewing since 2024",
};

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

type FilterKey = "all" | PatientStatus;

const FILTER_CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending_review", label: "Pending review" },
  { key: "awaiting_patient", label: "Awaiting patient" },
  { key: "active", label: "Active" },
  { key: "stale", label: "Stale" },
  { key: "new_member", label: "New members" },
];

// Sort order when "default" (urgency) is selected. Lower number = higher up.
const STATUS_URGENCY: Record<PatientStatus, number> = {
  pending_review: 0,
  active: 1,
  awaiting_patient: 2,
  new_member: 3,
  stale: 4,
};

type SortKey = "urgency" | "daysQuiet" | "lastPanel";
type SortDir = "asc" | "desc";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusLabel(s: PatientStatus): string {
  switch (s) {
    case "pending_review":
      return "Pending review";
    case "awaiting_patient":
      return "Awaiting patient";
    case "active":
      return "Active";
    case "stale":
      return "Stale";
    case "new_member":
      return "New member";
  }
}

function statusTone(s: PatientStatus): "terracotta" | "butter" | "sage" | "neutral" | "mute" {
  switch (s) {
    case "pending_review":
      return "terracotta";
    case "awaiting_patient":
      return "butter";
    case "active":
      return "sage";
    case "new_member":
      return "neutral";
    case "stale":
      return "mute";
  }
}

function relativeDate(iso: string | null): string {
  if (!iso) return "No panel yet";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} wk ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} mo ago`;
  return `${Math.floor(diff / 365)} yr ago`;
}

function shortDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-SE", { day: "numeric", month: "short" });
}

function daysQuietLabel(n: number): string {
  if (n === 0) return "Today";
  if (n === 1) return "1 day";
  return `${n} days`;
}

function severityDot(sev: PatientFlag["severity"]): string {
  switch (sev) {
    case "mild":
      return "var(--butter)";
    case "moderate":
      return "var(--terracotta-soft)";
    case "severe":
      return "var(--terracotta)";
  }
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function WorkbenchPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("urgency");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const filtered =
      filter === "all"
        ? [...MOCK_PATIENTS]
        : MOCK_PATIENTS.filter((p) => p.status === filter);

    const sorted = filtered.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "urgency") {
        cmp = STATUS_URGENCY[a.status] - STATUS_URGENCY[b.status];
        if (cmp === 0) cmp = b.flaggedMarkers.length - a.flaggedMarkers.length;
        if (cmp === 0) cmp = b.unreadMessages - a.unreadMessages;
      } else if (sortKey === "daysQuiet") {
        cmp = a.daysSinceLastAction - b.daysSinceLastAction;
      } else if (sortKey === "lastPanel") {
        const ta = a.latestPanelDate ? new Date(a.latestPanelDate).getTime() : 0;
        const tb = b.latestPanelDate ? new Date(b.latestPanelDate).getTime() : 0;
        cmp = tb - ta;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [filter, sortKey, sortDir]);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: MOCK_PATIENTS.length,
      pending_review: 0,
      awaiting_patient: 0,
      active: 0,
      stale: 0,
      new_member: 0,
    };
    for (const p of MOCK_PATIENTS) c[p.status] += 1;
    return c;
  }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor" />}
      sections={[
        <IdentityCard
          key="id"
          user={{
            name: CLINIC.name,
            initials: CLINIC.initials,
            memberSince: CLINIC.memberSince,
          }}
          doctor={{
            name: DOCTOR_SELF.name,
            initials: DOCTOR_SELF.initials,
            title: DOCTOR_SELF.title,
          }}
        />,
        <NextPanelHint
          key="np"
          eyebrow="Roster"
          headline={`${MOCK_PATIENTS.length} patients`}
          subtext="Sorted by urgency today"
        />,
        <RailNav
          key="nav"
          items={NAV_ITEMS}
          activeHref="/doctor/concepts/workbench"
        />,
      ]}
    />
  );

  return (
    <PageShell
      sideRail={sideRail}
      userInitials={DOCTOR_SELF.initials}
      activeHref="/doctor/concepts/workbench"
      logoHref="/doctor"
    >
      <EditorialColumn variant="wide">
        {/* Header */}
        <header className="wb-header">
          <div className="wb-header-left">
            <div className="wb-eyebrow">Workbench</div>
            <h1 className="wb-title">
              Patient roster <em>/ today</em>
            </h1>
            <p className="wb-sub">
              {rows.length} {rows.length === 1 ? "patient" : "patients"} shown,
              sorted by {sortKey === "urgency" ? "urgency" : sortKey === "daysQuiet" ? "days quiet" : "latest panel"}.
            </p>
          </div>
          <div className="wb-header-right">
            <div className="wb-metric">
              <span className="wb-metric-num">{counts.pending_review}</span>
              <span className="wb-metric-label">pending</span>
            </div>
            <div className="wb-metric">
              <span className="wb-metric-num">{counts.stale}</span>
              <span className="wb-metric-label">stale</span>
            </div>
            <div className="wb-metric">
              <span className="wb-metric-num">
                {MOCK_PATIENTS.reduce((a, p) => a + p.unreadMessages, 0)}
              </span>
              <span className="wb-metric-label">unread</span>
            </div>
          </div>
        </header>

        {/* Filter chips */}
        <div className="wb-chips" role="tablist" aria-label="Filter patients by status">
          {FILTER_CHIPS.map((chip) => {
            const active = chip.key === filter;
            return (
              <button
                key={chip.key}
                type="button"
                role="tab"
                aria-selected={active}
                className={active ? "wb-chip active" : "wb-chip"}
                onClick={() => setFilter(chip.key)}
              >
                <span>{chip.label}</span>
                <span className="wb-chip-count">{counts[chip.key]}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="wb-table-wrap" role="region" aria-label="Patient roster table">
          <div className="wb-table-head" role="row">
            <div className="wb-th wb-col-patient" role="columnheader">
              Patient
            </div>
            <div className="wb-th wb-col-status" role="columnheader">
              Status
            </div>
            <div className="wb-th wb-col-flags" role="columnheader">
              Flagged markers
            </div>
            <div
              className={`wb-th wb-col-panel wb-th-sort ${sortKey === "lastPanel" ? "active" : ""}`}
              role="columnheader"
              onClick={() => toggleSort("lastPanel")}
            >
              <span>Last panel</span>
              <SortCaret active={sortKey === "lastPanel"} dir={sortDir} />
            </div>
            <div
              className={`wb-th wb-col-quiet wb-th-sort ${sortKey === "daysQuiet" ? "active" : ""}`}
              role="columnheader"
              onClick={() => toggleSort("daysQuiet")}
            >
              <span>Days quiet</span>
              <SortCaret active={sortKey === "daysQuiet"} dir={sortDir} />
            </div>
            <div className="wb-th wb-col-unread" role="columnheader">
              Unread
            </div>
            <div className="wb-th wb-col-action" role="columnheader">
              Next action
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="wb-empty">
              No patients match this filter. Try another status.
            </div>
          ) : (
            rows.map((p) => <PatientRow key={p.id} patient={p} />)
          )}
        </div>

        <p className="wb-foot">
          Click any row to open that patient&rsquo;s file. Column headers in
          serif italic are sortable.
        </p>
      </EditorialColumn>

      <style jsx>{`
        /* ---------------- Header ---------------- */
        .wb-header {
          display: flex;
          flex-direction: column;
          gap: var(--sp-5);
          padding-bottom: var(--sp-6);
          border-bottom: 1px solid var(--line-soft);
        }
        @media (min-width: 720px) {
          .wb-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }
        .wb-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .wb-title {
          font-family: var(--font-serif);
          font-size: clamp(28px, 3.6vw, 40px);
          line-height: 1.1;
          color: var(--ink);
          letter-spacing: -0.01em;
          margin: 0 0 8px 0;
          font-weight: 400;
        }
        .wb-title em {
          color: var(--ink-faint);
          font-style: italic;
          font-weight: 400;
        }
        .wb-sub {
          color: var(--ink-muted);
          font-size: 14px;
          margin: 0;
          font-style: italic;
          font-family: var(--font-serif);
        }
        .wb-header-right {
          display: flex;
          gap: var(--sp-6);
        }
        .wb-metric {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .wb-metric-num {
          font-family: var(--font-serif);
          font-size: 28px;
          font-weight: 400;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .wb-metric-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        /* ---------------- Chips ---------------- */
        .wb-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: var(--sp-6) 0 var(--sp-5) 0;
        }
        .wb-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid var(--line-card);
          background: var(--paper);
          color: var(--ink-muted);
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-sans);
          letter-spacing: -0.005em;
          cursor: pointer;
          transition: all 0.16s ease;
        }
        .wb-chip:hover {
          border-color: var(--ink-faint);
          color: var(--ink);
        }
        .wb-chip.active {
          background: var(--ink);
          color: var(--canvas);
          border-color: var(--ink);
        }
        .wb-chip-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: var(--canvas-soft);
          color: var(--ink-muted);
          font-size: 11px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .wb-chip.active .wb-chip-count {
          background: rgba(251, 247, 240, 0.18);
          color: var(--canvas);
        }

        /* ---------------- Table (desktop) ---------------- */
        .wb-table-wrap {
          border: 1px solid var(--line-card);
          border-radius: var(--radius-card);
          background: var(--paper);
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }
        .wb-table-head {
          display: grid;
          grid-template-columns:
            minmax(220px, 2.1fr)
            minmax(140px, 1fr)
            minmax(160px, 1.4fr)
            minmax(90px, 0.9fr)
            minmax(90px, 0.9fr)
            minmax(60px, 0.6fr)
            minmax(180px, 1.6fr);
          gap: var(--sp-4);
          padding: 14px var(--sp-5);
          background: var(--canvas-soft);
          border-bottom: 1px solid var(--line-card);
        }
        .wb-th {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: 13px;
          color: var(--ink-faint);
          letter-spacing: -0.002em;
          display: flex;
          align-items: center;
          gap: 6px;
          user-select: none;
        }
        .wb-th-sort {
          cursor: pointer;
          transition: color 0.14s ease;
        }
        .wb-th-sort:hover {
          color: var(--ink);
        }
        .wb-th-sort.active {
          color: var(--ink);
        }

        /* Hide the table head below the card-list breakpoint */
        @media (max-width: 899px) {
          .wb-table-head {
            display: none;
          }
          .wb-table-wrap {
            border: none;
            background: transparent;
            box-shadow: none;
          }
        }

        /* ---------------- Empty ---------------- */
        .wb-empty {
          padding: var(--sp-10) var(--sp-6);
          text-align: center;
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 15px;
        }

        /* ---------------- Footer ---------------- */
        .wb-foot {
          margin-top: var(--sp-5);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 12px;
          color: var(--ink-faint);
          text-align: right;
        }
      `}</style>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// PatientRow
// ---------------------------------------------------------------------------

function PatientRow({ patient }: { patient: MockPatient }) {
  const needsReview = patient.status === "pending_review";
  const tone = statusTone(patient.status);

  return (
    <Link
      href={`/doctor/patient/${patient.id}`}
      className={`wb-row ${needsReview ? "wb-row-urgent" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        // Stub - the real route does not exist yet.
        // eslint-disable-next-line no-console
        console.log("Open patient file:", patient.id, patient.name);
      }}
    >
      {/* Patient */}
      <div className="wb-cell wb-col-patient">
        <div className="wb-patient">
          <div className={`wb-avatar wb-avatar-${patient.sex.toLowerCase()}`}>
            {patient.initials}
          </div>
          <div className="wb-patient-meta">
            <div className="wb-patient-name">{patient.name}</div>
            <div className="wb-patient-sub">
              {patient.age} / {patient.sex} / {patient.panelsCount}{" "}
              {patient.panelsCount === 1 ? "panel" : "panels"}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="wb-cell wb-col-status">
        <StatusPill tone={tone} label={statusLabel(patient.status)} />
      </div>

      {/* Flagged markers */}
      <div className="wb-cell wb-col-flags">
        <FlagCluster flags={patient.flaggedMarkers} />
      </div>

      {/* Last panel */}
      <div className="wb-cell wb-col-panel">
        <div className="wb-rel">
          <span className="wb-rel-main">{relativeDate(patient.latestPanelDate)}</span>
          {patient.latestPanelDate && (
            <span className="wb-rel-sub">{shortDate(patient.latestPanelDate)}</span>
          )}
        </div>
      </div>

      {/* Days quiet */}
      <div className="wb-cell wb-col-quiet">
        <DaysQuiet days={patient.daysSinceLastAction} />
      </div>

      {/* Unread */}
      <div className="wb-cell wb-col-unread">
        {patient.unreadMessages > 0 ? (
          <span className="wb-unread">{patient.unreadMessages}</span>
        ) : (
          <span className="wb-unread-empty">0</span>
        )}
      </div>

      {/* Next action */}
      <div className="wb-cell wb-col-action">
        <div className="wb-action">{patient.suggestedAction}</div>
      </div>

      <style jsx>{`
        .wb-row {
          display: grid;
          grid-template-columns:
            minmax(220px, 2.1fr)
            minmax(140px, 1fr)
            minmax(160px, 1.4fr)
            minmax(90px, 0.9fr)
            minmax(90px, 0.9fr)
            minmax(60px, 0.6fr)
            minmax(180px, 1.6fr);
          gap: var(--sp-4);
          align-items: center;
          padding: var(--sp-4) var(--sp-5);
          min-height: 56px;
          position: relative;
          text-decoration: none;
          color: inherit;
          background: var(--paper);
          border-bottom: 1px solid var(--sage-tint);
          transition: background 0.12s ease;
          cursor: pointer;
        }
        .wb-row:last-child {
          border-bottom: none;
        }
        .wb-row:hover {
          background: var(--canvas-soft);
        }
        .wb-row-urgent::before {
          content: "";
          position: absolute;
          left: 0;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: var(--terracotta);
          border-radius: 2px;
        }

        .wb-cell {
          min-width: 0;
        }

        .wb-patient {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .wb-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.005em;
          flex-shrink: 0;
          box-shadow: var(--shadow-soft);
          font-family: var(--font-sans);
        }
        .wb-avatar-f {
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
        }
        .wb-avatar-m {
          background: linear-gradient(135deg, var(--sage-soft) 0%, var(--sage) 100%);
          color: var(--ink);
        }
        .wb-patient-meta {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .wb-patient-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.005em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wb-patient-sub {
          font-size: 11px;
          color: var(--ink-faint);
          font-variant-numeric: tabular-nums;
        }

        .wb-rel {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .wb-rel-main {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-soft);
          font-variant-numeric: tabular-nums;
        }
        .wb-rel-sub {
          font-size: 11px;
          color: var(--ink-faint);
          font-variant-numeric: tabular-nums;
        }

        .wb-unread {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 999px;
          background: var(--terracotta);
          color: var(--canvas);
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          box-shadow: 0 1px 4px rgba(201, 87, 58, 0.28);
        }
        .wb-unread-empty {
          font-size: 12px;
          color: var(--ink-faint);
          font-variant-numeric: tabular-nums;
        }

        .wb-action {
          font-size: 13px;
          color: var(--ink-muted);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.005em;
        }

        /* ---------------- Mobile / card mode ---------------- */
        @media (max-width: 899px) {
          .wb-row {
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
              "avatar   name    status"
              "avatar   sub     unread"
              "flags    flags   flags"
              "meta     meta    meta"
              "action   action  action";
            gap: 10px 14px;
            min-height: 0;
            padding: var(--sp-5);
            margin-bottom: var(--sp-3);
            border: 1px solid var(--line-card);
            border-radius: 14px;
            box-shadow: var(--shadow-soft);
          }
          .wb-row:last-child {
            border-bottom: 1px solid var(--line-card);
          }
          .wb-row-urgent::before {
            top: 12px;
            bottom: 12px;
            left: -1px;
            width: 3px;
          }
          .wb-col-patient {
            grid-area: avatar;
            display: contents;
          }
          .wb-patient {
            display: contents;
          }
          .wb-avatar {
            grid-area: avatar;
          }
          .wb-patient-meta {
            display: contents;
          }
          .wb-patient-name {
            grid-area: name;
            align-self: end;
          }
          .wb-patient-sub {
            grid-area: sub;
            align-self: start;
          }
          .wb-col-status {
            grid-area: status;
            justify-self: end;
            align-self: start;
          }
          .wb-col-flags {
            grid-area: flags;
          }
          .wb-col-panel,
          .wb-col-quiet {
            grid-area: meta;
          }
          .wb-col-panel {
            display: none;
          }
          .wb-col-unread {
            grid-area: unread;
            justify-self: end;
            align-self: end;
          }
          .wb-col-action {
            grid-area: action;
            padding-top: 8px;
            border-top: 1px dashed var(--line-soft);
            margin-top: 2px;
          }
          .wb-col-quiet {
            padding-top: 6px;
          }
        }
      `}</style>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Small subcomponents
// ---------------------------------------------------------------------------

function StatusPill({
  tone,
  label,
}: {
  tone: "terracotta" | "butter" | "sage" | "neutral" | "mute";
  label: string;
}) {
  return (
    <span className={`pill pill-${tone}`}>
      <span className="pill-dot" />
      {label}
      <style jsx>{`
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 10px 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.005em;
          border: 1px solid transparent;
          font-family: var(--font-sans);
          white-space: nowrap;
        }
        .pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pill-terracotta {
          background: var(--terracotta-tint);
          color: var(--terracotta-deep);
          border-color: rgba(201, 87, 58, 0.18);
        }
        .pill-terracotta .pill-dot {
          background: var(--terracotta);
        }
        .pill-butter {
          background: var(--butter-tint);
          color: #8a6c19;
          border-color: rgba(233, 181, 71, 0.22);
        }
        .pill-butter .pill-dot {
          background: var(--butter);
        }
        .pill-sage {
          background: var(--sage-tint);
          color: var(--sage-deep);
          border-color: rgba(114, 140, 118, 0.22);
        }
        .pill-sage .pill-dot {
          background: var(--sage);
        }
        .pill-neutral {
          background: var(--canvas-soft);
          color: var(--ink-soft);
          border-color: var(--line-card);
        }
        .pill-neutral .pill-dot {
          background: var(--ink-muted);
        }
        .pill-mute {
          background: transparent;
          color: var(--ink-faint);
          border-color: var(--line-card);
        }
        .pill-mute .pill-dot {
          background: var(--ink-faint);
        }
      `}</style>
    </span>
  );
}

function FlagCluster({ flags }: { flags: PatientFlag[] }) {
  if (flags.length === 0) {
    return (
      <span className="flag-none">
        In range
        <style jsx>{`
          .flag-none {
            font-size: 12px;
            color: var(--sage-deep);
            font-family: var(--font-serif);
            font-style: italic;
            letter-spacing: -0.002em;
          }
        `}</style>
      </span>
    );
  }
  return (
    <div className="fc">
      {flags.slice(0, 3).map((f, i) => (
        <span key={i} className="fc-chip" title={`${f.marker} ${f.value} ${f.unit}`}>
          <span
            className="fc-dot"
            style={{ background: severityDot(f.severity) }}
          />
          <span className="fc-name">{f.marker}</span>
          <span className="fc-dir">{f.direction === "high" ? "hi" : "lo"}</span>
        </span>
      ))}
      {flags.length > 3 && <span className="fc-more">+{flags.length - 3}</span>}
      <style jsx>{`
        .fc {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
        }
        .fc-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px 3px 6px;
          border-radius: 6px;
          background: var(--canvas-soft);
          border: 1px solid var(--line-soft);
          font-size: 11px;
          font-weight: 500;
          color: var(--ink-soft);
          letter-spacing: -0.002em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .fc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .fc-name {
          color: var(--ink);
        }
        .fc-dir {
          color: var(--ink-faint);
          font-variant: small-caps;
          letter-spacing: 0.04em;
        }
        .fc-more {
          font-size: 11px;
          color: var(--ink-faint);
          font-weight: 500;
          padding: 3px 6px;
        }
      `}</style>
    </div>
  );
}

function DaysQuiet({ days }: { days: number }) {
  const tone = days >= 90 ? "warn" : days >= 30 ? "soft" : "normal";
  return (
    <span className={`dq dq-${tone}`}>
      {daysQuietLabel(days)}
      <style jsx>{`
        .dq {
          font-size: 13px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.005em;
        }
        .dq-normal {
          color: var(--ink-soft);
        }
        .dq-soft {
          color: var(--ink-muted);
        }
        .dq-warn {
          color: var(--terracotta-deep);
          font-weight: 600;
        }
      `}</style>
    </span>
  );
}

function SortCaret({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`caret ${active ? "on" : ""} ${dir}`} aria-hidden="true">
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
        <path
          d="M4 0L8 5H0L4 0Z"
          fill={active && dir === "asc" ? "currentColor" : "currentColor"}
          opacity={active && dir === "asc" ? 1 : 0.28}
        />
        <path
          d="M4 10L0 5H8L4 10Z"
          fill={active && dir === "desc" ? "currentColor" : "currentColor"}
          opacity={active && dir === "desc" ? 1 : 0.28}
        />
      </svg>
      <style jsx>{`
        .caret {
          display: inline-flex;
          align-items: center;
          line-height: 0;
        }
      `}</style>
    </span>
  );
}
