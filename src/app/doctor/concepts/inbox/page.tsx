"use client";

/**
 * INBOX - doctor's home as a single unified stream.
 *
 * Thesis: a doctor's day is an inbox. Every pending thing (new panel, patient
 * reply, stale nudge, overdue check-in, new member welcome) becomes one typed
 * row. Dense typographic rhythm, paper cards on warm canvas, keyboard-first.
 * Superhuman's efficiency meets Precura's editorial warmth. No kanban, no
 * queues, no dashboards. Just the next thing, and the next.
 */

import React, { useMemo, useState } from "react";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  NextPanelHint,
  RailNav,
  EditorialColumn,
} from "@/components/layout";
import { MOCK_PATIENTS, POPULATION_STATS, type MockPatient } from "@/app/doctor/concepts/mockPatients";

// ============================================================================
// Item model
// ============================================================================

type ItemType = "review" | "reply" | "nudge" | "checkin" | "welcome";

interface InboxItem {
  id: string;
  type: ItemType;
  patient: MockPatient;
  title: string;
  preview: string;
  ageLabel: string;
  ageDays: number;
  unread: boolean;
}

// ============================================================================
// Synthesise inbox items from mock patients.
// Each patient can generate multiple items.
// ============================================================================

function ageLabelFromDays(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function buildInboxItems(patients: MockPatient[]): InboxItem[] {
  const items: InboxItem[] = [];

  for (const p of patients) {
    // Pending panel review
    if (p.status === "pending_review" && !p.latestPanelReviewed) {
      const flagged = p.flaggedMarkers
        .map((f) => `${f.marker} ${f.direction === "high" ? "up" : "down"}`)
        .join(", ");
      items.push({
        id: `${p.id}-review`,
        type: "review",
        patient: p,
        title: p.panelsCount === 1 ? "First panel ready for review" : "New panel ready for review",
        preview: flagged ? `Flagged: ${flagged}.` : "All markers in range. Quick sign-off.",
        ageLabel: ageLabelFromDays(p.daysSinceLastAction),
        ageDays: p.daysSinceLastAction,
        unread: true,
      });
    }

    // Unread patient messages
    if (p.unreadMessages > 0) {
      items.push({
        id: `${p.id}-reply`,
        type: "reply",
        patient: p,
        title:
          p.unreadMessages === 1
            ? "New message"
            : `${p.unreadMessages} new messages`,
        preview: p.summary,
        ageLabel: ageLabelFromDays(p.daysSinceLastAction),
        ageDays: p.daysSinceLastAction,
        unread: true,
      });
    }

    // Stale follow-up nudge
    if (p.status === "stale") {
      items.push({
        id: `${p.id}-nudge`,
        type: "nudge",
        patient: p,
        title: "Stale patient, annual check-in",
        preview: p.suggestedAction,
        ageLabel: ageLabelFromDays(p.daysSinceLastAction),
        ageDays: p.daysSinceLastAction,
        unread: true,
      });
    }

    // Overdue check-in (awaiting patient, passed threshold)
    if (p.status === "awaiting_patient" && p.daysSinceLastAction >= 60) {
      items.push({
        id: `${p.id}-checkin`,
        type: "checkin",
        patient: p,
        title: "Retest overdue, waiting on patient",
        preview: p.suggestedAction,
        ageLabel: ageLabelFromDays(p.daysSinceLastAction),
        ageDays: p.daysSinceLastAction,
        unread: false,
      });
    }

    // New member welcome
    if (p.status === "new_member") {
      items.push({
        id: `${p.id}-welcome`,
        type: "welcome",
        patient: p,
        title: "New member, send welcome",
        preview: p.suggestedAction,
        ageLabel: ageLabelFromDays(p.daysSinceLastAction),
        ageDays: p.daysSinceLastAction,
        unread: true,
      });
    }
  }

  // Sort newest first
  items.sort((a, b) => a.ageDays - b.ageDays);
  return items;
}

// ============================================================================
// Filter definitions
// ============================================================================

type FilterKey = "all" | "reviews" | "messages" | "nudges" | "stale";

const FILTER_DEFS: { key: FilterKey; label: string; match: (i: InboxItem) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "reviews", label: "Reviews", match: (i) => i.type === "review" },
  { key: "messages", label: "Messages", match: (i) => i.type === "reply" || i.type === "welcome" },
  { key: "nudges", label: "Nudges", match: (i) => i.type === "nudge" || i.type === "checkin" },
  { key: "stale", label: "Stale", match: (i) => i.ageDays >= 30 },
];

// ============================================================================
// Inline icon glyphs, 14px, stroke currentColor
// ============================================================================

function TypeIcon({ type }: { type: ItemType }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (type) {
    case "review":
      return (
        <svg {...common}>
          <rect x="3" y="2.5" width="10" height="11" rx="1.5" />
          <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" />
        </svg>
      );
    case "reply":
      return (
        <svg {...common}>
          <path d="M2.5 4.5a1.5 1.5 0 0 1 1.5-1.5h8a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H6l-3 2.5v-9z" />
        </svg>
      );
    case "nudge":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 5v3.5L10 10" />
        </svg>
      );
    case "checkin":
      return (
        <svg {...common}>
          <path d="M3 4.5h10M3 8h10M3 11.5h6" />
          <path d="M11 11l1.25 1.25L14 10.5" stroke="currentColor" />
        </svg>
      );
    case "welcome":
      return (
        <svg {...common}>
          <path d="M2.5 7L8 2.5 13.5 7M4 6.5v6.5h8V6.5" />
        </svg>
      );
  }
}

// ============================================================================
// The page
// ============================================================================

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => buildInboxItems(MOCK_PATIENTS), []);
  const filterCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = {
      all: 0,
      reviews: 0,
      messages: 0,
      nudges: 0,
      stale: 0,
    };
    for (const f of FILTER_DEFS) {
      counts[f.key] = items.filter(f.match).length;
    }
    return counts;
  }, [items]);

  const visibleItems = useMemo(() => {
    const def = FILTER_DEFS.find((f) => f.key === activeFilter);
    if (!def) return items;
    return items.filter(def.match);
  }, [items, activeFilter]);

  // Default selection to first visible item
  const currentSelectedId =
    selectedId && visibleItems.some((i) => i.id === selectedId)
      ? selectedId
      : visibleItems[0]?.id ?? null;

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor" />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: "Dr. Tomas Kurakovas", initials: "TK", memberSince: "Attending" }}
          doctor={{ name: "Precura Clinic", initials: "PC", title: "Stockholm" }}
        />,
        <NextPanelHint
          key="hint"
          eyebrow="This morning"
          headline={`${filterCounts.all} items in your inbox`}
          subtext={`${filterCounts.reviews} panels to review, ${filterCounts.messages} replies waiting.`}
        />,
        <RailNav
          key="nav"
          activeHref="/doctor/concepts/inbox"
          items={[
            { label: "Inbox", href: "/doctor/concepts/inbox" },
            { label: "Patients", href: "/doctor/patients" },
            { label: "Reviewed", href: "/doctor/archive" },
            { label: "Library", href: "/doctor/library" },
            { label: "Settings", href: "/doctor/settings" },
          ]}
        />,
      ]}
    />
  );

  return (
    <PageShell
      sideRail={sideRail}
      userInitials="TK"
      logoHref="/doctor"
      activeHref="/doctor/concepts/inbox"
    >
      <EditorialColumn variant="reading">
        {/* Header */}
        <header className="inbox-header">
          <div className="inbox-head-row">
            <div>
              <div className="inbox-eyebrow">Friday, 18 April</div>
              <h1 className="inbox-title">
                Inbox{" "}
                <span className="inbox-title-soft">
                  for <em>Dr. Tomas</em>
                </span>
              </h1>
            </div>
            <div className="inbox-shortcuts" aria-hidden="true">
              <span className="kbd">j</span>
              <span className="kbd">k</span>
              <span className="kbd-label">move</span>
              <span className="kbd kbd-wide">Enter</span>
              <span className="kbd-label">open</span>
              <span className="kbd">e</span>
              <span className="kbd-label">archive</span>
            </div>
          </div>

          {/* Filter tabs */}
          <nav className="inbox-filters" aria-label="Inbox filters">
            {FILTER_DEFS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`filter-pill ${activeFilter === f.key ? "active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                <span className="filter-label">{f.label}</span>
                <span className="filter-count">{filterCounts[f.key]}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Inbox stream */}
        <section className="inbox-stream">
          {visibleItems.length === 0 ? (
            <div className="inbox-empty">
              <div className="inbox-empty-serif">Nothing here.</div>
              <div className="inbox-empty-sub">
                Every item in this filter is processed. Try another tab.
              </div>
            </div>
          ) : (
            <ul className="inbox-list">
              {visibleItems.map((item) => {
                const isSelected = item.id === currentSelectedId;
                return (
                  <li
                    key={item.id}
                    className={`inbox-row ${isSelected ? "selected" : ""}`}
                  >
                    <button
                      type="button"
                      className="inbox-row-btn"
                      onClick={() => setSelectedId(item.id)}
                    >
                      <span className={`unread-dot ${item.unread ? "on" : ""}`} aria-hidden="true" />
                      <span className={`type-icon type-${item.type}`}>
                        <TypeIcon type={item.type} />
                      </span>
                      <span className="avatar" aria-hidden="true">
                        {item.patient.initials}
                      </span>
                      <span className="row-patient">
                        {item.patient.name}
                        <span className="row-meta">
                          {item.patient.age} / {item.patient.sex}
                        </span>
                      </span>
                      <span className="row-content">
                        <span className="row-title">{item.title}</span>
                        <span className="row-preview">{item.preview}</span>
                      </span>
                      <span className="row-age">{item.ageLabel}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="inbox-footline">
            <span>{POPULATION_STATS.total} patients in your panel.</span>
            <span className="foot-italic">
              Read top to bottom. Archive as you go.
            </span>
          </div>
        </section>
      </EditorialColumn>

      <style jsx>{`
        /* ---------- Header ---------- */
        .inbox-header {
          padding-bottom: var(--sp-5);
          border-bottom: 1px solid var(--line-soft);
          margin-bottom: var(--sp-6);
        }
        .inbox-head-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--sp-6);
          flex-wrap: wrap;
        }
        .inbox-eyebrow {
          font-size: var(--text-eyebrow);
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--ink-muted);
          letter-spacing: 0.01em;
          margin-bottom: var(--sp-2);
        }
        .inbox-title {
          font-size: var(--text-title);
          font-weight: 600;
          letter-spacing: -0.022em;
          color: var(--ink);
          margin: 0;
          line-height: var(--line-height-title);
        }
        .inbox-title-soft {
          color: var(--ink-muted);
          font-weight: 400;
        }
        .inbox-title-soft em {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--ink-soft);
          font-weight: 500;
        }

        /* ---------- Keyboard hints ---------- */
        .inbox-shortcuts {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          flex-wrap: wrap;
          padding: var(--sp-2) var(--sp-3);
          background: var(--canvas-soft);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
        }
        .kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: var(--paper);
          border: 1px solid var(--line-card);
          border-bottom-width: 2px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--ink-soft);
          letter-spacing: 0;
        }
        .kbd-wide { min-width: 36px; }
        .kbd-label {
          font-size: 10px;
          color: var(--ink-faint);
          font-family: var(--font-sans);
          letter-spacing: 0.02em;
          padding-right: var(--sp-2);
        }
        .kbd-label:last-child { padding-right: 0; }

        /* ---------- Filter tabs ---------- */
        .inbox-filters {
          display: flex;
          gap: var(--sp-2);
          margin-top: var(--sp-5);
          flex-wrap: wrap;
        }
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: 6px 12px;
          background: transparent;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          color: var(--ink-muted);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          letter-spacing: -0.005em;
        }
        .filter-pill:hover {
          background: var(--sage-tint);
          color: var(--ink-soft);
          border-color: var(--sage-soft);
        }
        .filter-pill.active {
          background: var(--sage-tint);
          color: var(--sage-deep);
          border-color: var(--sage-soft);
          font-weight: 600;
        }
        .filter-label {
          font-size: var(--text-meta);
        }
        .filter-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: var(--canvas);
          border-radius: var(--radius-pill);
          font-size: 10px;
          font-weight: 600;
          color: var(--ink-muted);
          font-family: var(--font-mono);
        }
        .filter-pill.active .filter-count {
          background: var(--sage-deep);
          color: var(--canvas-soft);
        }

        /* ---------- Stream ---------- */
        .inbox-stream {
          padding-bottom: var(--sp-8);
        }
        .inbox-list {
          list-style: none;
          padding: 0;
          margin: 0;
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }
        .inbox-row {
          border-bottom: 1px solid var(--line-soft);
        }
        .inbox-row:last-child { border-bottom: 0; }
        .inbox-row.selected {
          background: var(--canvas-warm);
        }
        .inbox-row.selected .row-title {
          color: var(--ink);
        }
        .inbox-row-btn {
          display: grid;
          grid-template-columns: 10px 22px 32px minmax(140px, 170px) minmax(0, 1fr) auto;
          align-items: center;
          gap: var(--sp-3);
          width: 100%;
          padding: 14px 18px;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          transition: background 0.15s ease;
        }
        .inbox-row-btn:hover {
          background: var(--stone-soft);
        }
        .inbox-row.selected .inbox-row-btn:hover {
          background: var(--canvas-warm);
        }

        /* Unread dot */
        .unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: transparent;
          justify-self: center;
        }
        .unread-dot.on {
          background: var(--terracotta);
          box-shadow: 0 0 0 2px var(--terracotta-tint);
        }

        /* Type icon */
        .type-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          color: var(--ink-muted);
        }
        .type-icon.type-review {
          background: var(--butter-tint);
          color: #8a6a15;
        }
        .type-icon.type-reply {
          background: var(--sage-tint);
          color: var(--sage-deep);
        }
        .type-icon.type-nudge {
          background: var(--terracotta-tint);
          color: var(--terracotta-deep);
        }
        .type-icon.type-checkin {
          background: var(--stone-soft);
          color: var(--ink-soft);
        }
        .type-icon.type-welcome {
          background: var(--canvas-warm);
          color: var(--terracotta);
        }

        /* Avatar */
        .avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
          color: var(--ink);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.01em;
          box-shadow: var(--shadow-soft);
        }

        /* Patient name column */
        .row-patient {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          font-size: var(--text-dense);
          color: var(--ink);
          font-weight: 600;
          letter-spacing: -0.008em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .row-meta {
          font-size: 10px;
          font-weight: 400;
          color: var(--ink-faint);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: var(--font-mono);
        }

        /* Title + preview */
        .row-content {
          display: flex;
          align-items: baseline;
          gap: var(--sp-3);
          min-width: 0;
          overflow: hidden;
        }
        .row-title {
          flex-shrink: 0;
          font-size: var(--text-dense);
          font-weight: 500;
          color: var(--ink-soft);
          letter-spacing: -0.008em;
          max-width: 52%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .row-preview {
          flex: 1;
          min-width: 0;
          font-size: var(--text-meta);
          color: var(--ink-muted);
          letter-spacing: -0.005em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: var(--font-serif);
          font-style: italic;
        }

        .row-age {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
          letter-spacing: 0;
          padding-left: var(--sp-3);
          white-space: nowrap;
        }

        /* ---------- Empty state ---------- */
        .inbox-empty {
          padding: var(--sp-9) var(--sp-6);
          text-align: center;
          background: var(--paper);
          border: 1px dashed var(--line-card);
          border-radius: var(--radius-card);
        }
        .inbox-empty-serif {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-title);
          color: var(--ink-soft);
          margin-bottom: var(--sp-2);
        }
        .inbox-empty-sub {
          font-size: var(--text-meta);
          color: var(--ink-muted);
        }

        /* ---------- Footer line ---------- */
        .inbox-footline {
          display: flex;
          justify-content: space-between;
          gap: var(--sp-4);
          margin-top: var(--sp-5);
          padding: 0 var(--sp-2);
          font-size: var(--text-micro);
          color: var(--ink-faint);
          flex-wrap: wrap;
        }
        .foot-italic {
          font-family: var(--font-serif);
          font-style: italic;
        }

        /* ---------- Compact (mobile / narrow) ---------- */
        @media (max-width: 760px) {
          .inbox-row-btn {
            grid-template-columns: 8px 22px 30px minmax(0, 1fr) auto;
            gap: var(--sp-2);
            padding: 12px 14px;
          }
          .inbox-row-btn > .row-content {
            display: none;
          }
          .row-patient {
            font-size: var(--text-meta);
          }
          .row-age {
            padding-left: var(--sp-2);
          }
          .inbox-shortcuts {
            display: none;
          }
        }
      `}</style>
    </PageShell>
  );
}
