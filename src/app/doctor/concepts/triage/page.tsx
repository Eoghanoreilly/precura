"use client";

// ============================================================================
// Triage queue: the doctor's day is a ranked list of work, not a dashboard.
// Urgency-first. Each row earns its place in the order: pending reviews by
// panel age, then patient replies, then awaiting patients growing stale, then
// inactive outreach. One click enters the patient's file. No columns, no
// charts, no KPI strip. A hospital-handover list rendered with Stripe-Press
// editorial polish: paper card, serif italic date stamps, sage ledger ticks,
// terracotta only where an action is overdue.
// ============================================================================

import React, { useMemo } from "react";
import Link from "next/link";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  RailNav,
} from "@/components/layout";
import { MOCK_PATIENTS, POPULATION_STATS } from "@/app/doctor/concepts/mockPatients";
import type { MockPatient, PatientStatus } from "@/app/doctor/concepts/mockPatients";

// ---------------------------------------------------------------------------
// Queue reasons - the "why this is in the queue" one-liner per row.
// Each patient gets a primary reason (drives sort) plus a plain-English gloss.
// ---------------------------------------------------------------------------

type QueueReasonKind =
  | "panel_unreviewed"   // pending_review: blood panel sitting without a note
  | "patient_replied"    // unread message from patient
  | "retest_overdue"     // awaiting_patient, nudged but no movement
  | "outreach_due"       // stale patient falling out of care
  | "welcome_due";       // brand-new member, no panel yet

interface QueueEntry {
  patient: MockPatient;
  rank: number;
  reasonKind: QueueReasonKind;
  reasonLine: string;
  timeLabel: string;          // e.g. "2 days waiting", "just now"
  timeSerif: string;          // italic timestamp like "filed Mon 21 Apr"
  accent: "terracotta" | "butter" | "sage" | "neutral";
  statusTag: string;
}

// ---------------------------------------------------------------------------
// Ranking + enrichment
// ---------------------------------------------------------------------------

const STATUS_WEIGHT: Record<PatientStatus, number> = {
  pending_review: 0,
  active: 100,
  awaiting_patient: 200,
  stale: 300,
  new_member: 400,
};

function classifyEntry(p: MockPatient): QueueEntry {
  if (p.status === "pending_review") {
    return {
      patient: p,
      rank: STATUS_WEIGHT.pending_review + p.daysSinceLastAction,
      reasonKind: "panel_unreviewed",
      reasonLine: panelReasonLine(p),
      timeLabel: daysLabel(p.daysSinceLastAction, "waiting for your note"),
      timeSerif: filedOn(p.latestPanelDate),
      accent: "terracotta",
      statusTag: "Panel unreviewed",
    };
  }
  if (p.unreadMessages > 0) {
    return {
      patient: p,
      rank: STATUS_WEIGHT.active + p.daysSinceLastAction,
      reasonKind: "patient_replied",
      reasonLine: messageReasonLine(p),
      timeLabel:
        p.unreadMessages === 1
          ? "1 message waiting"
          : `${p.unreadMessages} messages waiting`,
      timeSerif: sinceSerif(p.lastPatientActivity),
      accent: "butter",
      statusTag: "Patient replied",
    };
  }
  if (p.status === "awaiting_patient") {
    return {
      patient: p,
      rank: STATUS_WEIGHT.awaiting_patient + (1000 - p.daysSinceLastAction),
      reasonKind: "retest_overdue",
      reasonLine: `Retest requested ${weeksLabel(p.daysSinceLastAction)} ago. No follow-up panel yet.`,
      timeLabel: `${weeksLabel(p.daysSinceLastAction)} silent`,
      timeSerif: sinceSerif(p.lastPatientActivity),
      accent: "neutral",
      statusTag: "Awaiting patient",
    };
  }
  if (p.status === "stale") {
    return {
      patient: p,
      rank: STATUS_WEIGHT.stale + (2000 - p.daysSinceLastAction),
      reasonKind: "outreach_due",
      reasonLine: `Last seen ${monthsLabel(p.daysSinceLastAction)} ago. At risk of falling out of care.`,
      timeLabel: `${monthsLabel(p.daysSinceLastAction)} dormant`,
      timeSerif: sinceSerif(p.lastPatientActivity),
      accent: "sage",
      statusTag: "Check-in due",
    };
  }
  // new_member
  return {
    patient: p,
    rank: STATUS_WEIGHT.new_member + p.daysSinceLastAction,
    reasonKind: "welcome_due",
    reasonLine: "Joined recently. Needs a first note and a nudge toward the onboarding questionnaire.",
    timeLabel: daysLabel(p.daysSinceLastAction, "since joining"),
    timeSerif: joinedSerif(p.memberSince),
    accent: "neutral",
    statusTag: "New member",
  };
}

function rankEntries(entries: QueueEntry[]): QueueEntry[] {
  return [...entries].sort((a, b) => a.rank - b.rank);
}

// ---------------------------------------------------------------------------
// Plain-English time helpers. No em dashes, no arrows, hyphens only.
// ---------------------------------------------------------------------------

function daysLabel(days: number, suffix: string): string {
  if (days <= 0) return `just in - ${suffix}`;
  if (days === 1) return `1 day ${suffix}`;
  return `${days} days ${suffix}`;
}

function weeksLabel(days: number): string {
  if (days < 7) return `${days} days`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "1 week" : `${weeks} weeks`;
}

function monthsLabel(days: number): string {
  if (days < 30) return weeksLabel(days);
  const months = Math.round(days / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

function filedOn(iso: string | null): string {
  if (!iso) return "";
  return `filed ${fmtShort(iso)}`;
}

function sinceSerif(iso: string): string {
  return `last contact ${fmtShort(iso)}`;
}

function joinedSerif(iso: string): string {
  return `joined ${fmtShort(iso)}`;
}

function fmtShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function panelReasonLine(p: MockPatient): string {
  if (p.flaggedMarkers.length === 0) {
    return `New panel in. ${p.panelsCount === 1 ? "First panel." : `${p.panelsCount}th panel.`} Awaiting your note.`;
  }
  const first = p.flaggedMarkers[0];
  const rest = p.flaggedMarkers.length - 1;
  const tail =
    rest > 0 ? ` and ${rest} other flag${rest === 1 ? "" : "s"}` : "";
  return `${first.marker} ${first.direction} at ${first.value} ${first.unit}${tail}.`;
}

function messageReasonLine(p: MockPatient): string {
  if (p.summary) return p.summary;
  return "Patient replied to your last note.";
}

// ---------------------------------------------------------------------------
// Headline generator - 4-8 editorial words summarising the day's work.
// ---------------------------------------------------------------------------

function dayHeadline(entries: QueueEntry[]): string {
  const panels = entries.filter((e) => e.reasonKind === "panel_unreviewed").length;
  const msgs = entries.filter((e) => e.reasonKind === "patient_replied").length;
  if (panels === 0 && msgs === 0) return "A quiet morning on the list.";
  const panelClause =
    panels === 0
      ? ""
      : panels === 1
        ? "One panel to review."
        : `${spellNumber(panels)} panels to review.`;
  const msgClause =
    msgs === 0
      ? ""
      : msgs === 1
        ? "One message waiting."
        : `${spellNumber(msgs)} messages waiting.`;
  return [panelClause, msgClause].filter(Boolean).join(" ");
}

function spellNumber(n: number): string {
  const map = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return map[n] ?? String(n);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DoctorTriagePage() {
  const ranked = useMemo(
    () => rankEntries(MOCK_PATIENTS.map(classifyEntry)),
    []
  );
  const headline = useMemo(() => dayHeadline(ranked), [ranked]);
  const todayLabel = useMemo(() => todaySerif(), []);

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor/concepts/triage" />}
      sections={[
        <IdentityCard
          key="identity"
          user={{
            name: "Dr. Tomas Kurakovas",
            initials: "TK",
            memberSince: "On call since 2024",
          }}
          doctor={{
            name: "Your patients",
            initials: "PC",
            title: "Precura panel",
          }}
        />,
        <RailNav
          key="nav"
          activeHref="/doctor/concepts/triage"
          items={[
            { label: "Patients", href: "/doctor/concepts/triage" },
            { label: "Panels", href: "/doctor/concepts/triage#panels" },
            { label: "Notes", href: "/doctor/concepts/triage#notes" },
            { label: "Settings", href: "/doctor/concepts/triage#settings" },
          ]}
        />,
      ]}
    />
  );

  return (
    <PageShell
      sideRail={sideRail}
      mobileDrawer={<DoctorMobileDrawer />}
      userInitials="TK"
      logoHref="/doctor/concepts/triage"
      activeHref="/doctor/concepts/triage"
    >
      <div className="triage-page">
        <header className="triage-head">
          <div className="triage-eyebrow">
            <span className="triage-eyebrow-date">{todayLabel}</span>
            <span className="triage-eyebrow-sep" aria-hidden="true" />
            <span className="triage-eyebrow-label">Today&rsquo;s queue</span>
          </div>
          <h1 className="triage-headline">{headline}</h1>
          <p className="triage-sub">
            A ranked handover, not a dashboard. Top of the list is where you
            start. Each row opens that patient&rsquo;s file.
          </p>
          <dl className="triage-meter" aria-label="Queue composition">
            <MeterItem
              value={POPULATION_STATS.pendingReview}
              label="panels"
              sub="awaiting your note"
              tone="terracotta"
            />
            <MeterItem
              value={POPULATION_STATS.unreadMessages}
              label="messages"
              sub="from patients"
              tone="butter"
            />
            <MeterItem
              value={POPULATION_STATS.awaitingPatient}
              label="retests"
              sub="silent past 8 weeks"
              tone="neutral"
            />
            <MeterItem
              value={POPULATION_STATS.stale + POPULATION_STATS.newMembers}
              label="outreach"
              sub="stale or newly joined"
              tone="sage"
            />
          </dl>
        </header>

        <ol className="triage-list">
          {ranked.map((entry, i) => (
            <QueueRow key={entry.patient.id} entry={entry} index={i} />
          ))}
        </ol>

        <footer className="triage-foot">
          <span className="triage-foot-serif">End of list.</span>{" "}
          {POPULATION_STATS.total} patients on your panel. Precura summary
          updates when a new result lands.
        </footer>
      </div>

      <TriageStyles />
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Queue row
// ---------------------------------------------------------------------------

function QueueRow({ entry, index }: { entry: QueueEntry; index: number }) {
  const { patient } = entry;
  const href = `/doctor/concepts/triage?patient=${patient.id}`;
  return (
    <li className={`qrow qrow-accent-${entry.accent}`}>
      <Link href={href} className="qrow-link" aria-label={`Open ${patient.name}`}>
        <div className="qrow-rank" aria-hidden="true">
          <span className="qrow-rank-num">{String(index + 1).padStart(2, "0")}</span>
          <span className="qrow-rank-tick" />
        </div>

        <div className="qrow-body">
          <div className="qrow-top">
            <div className="qrow-identity">
              <div className={`qrow-avatar avatar-${entry.accent}`}>
                {patient.initials}
              </div>
              <div className="qrow-identity-text">
                <div className="qrow-name">
                  {patient.name}
                  <span className="qrow-name-meta">
                    , {patient.age} {patient.sex === "F" ? "yr, female" : "yr, male"}
                  </span>
                </div>
                <div className="qrow-status">
                  <span className={`qrow-tag qrow-tag-${entry.accent}`}>
                    {entry.statusTag}
                  </span>
                  <span className="qrow-time">{entry.timeLabel}</span>
                </div>
              </div>
            </div>
            <div className="qrow-time-right">
              <span className="qrow-time-serif">{entry.timeSerif}</span>
            </div>
          </div>

          <p className="qrow-reason">{entry.reasonLine}</p>

          {patient.flaggedMarkers.length > 0 && (
            <ul className="qrow-flags">
              {patient.flaggedMarkers.map((f) => (
                <li key={f.marker} className={`qrow-flag qrow-flag-${f.severity}`}>
                  <span className="qrow-flag-marker">{f.marker}</span>
                  <span className="qrow-flag-value">
                    {f.value} {f.unit}
                  </span>
                  <span className="qrow-flag-dir" aria-hidden="true">
                    {f.direction === "high" ? "high" : "low"}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="qrow-cta-row">
            <span className="qrow-cta-label">{ctaForKind(entry.reasonKind)}</span>
            <span className="qrow-cta-chev" aria-hidden="true">open file</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

function ctaForKind(k: QueueReasonKind): string {
  switch (k) {
    case "panel_unreviewed":
      return "Review panel and leave a note";
    case "patient_replied":
      return "Read thread and reply";
    case "retest_overdue":
      return "Send a gentle retest nudge";
    case "outreach_due":
      return "Annual check-in message";
    case "welcome_due":
      return "Welcome note and onboarding nudge";
  }
}

// ---------------------------------------------------------------------------
// Meter item
// ---------------------------------------------------------------------------

function MeterItem({
  value,
  label,
  sub,
  tone,
}: {
  value: number;
  label: string;
  sub: string;
  tone: "terracotta" | "butter" | "sage" | "neutral";
}) {
  return (
    <div className={`meter meter-${tone}`}>
      <dt className="meter-label">
        <span className="meter-value">{value}</span>
        <span className="meter-name">{label}</span>
      </dt>
      <dd className="meter-sub">{sub}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile drawer specific to the doctor concept (overrides the member default).
// Kept intentionally minimal; this is a concept page, not the production route.
// ---------------------------------------------------------------------------

function DoctorMobileDrawer() {
  return <div aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Today label ("Friday, 18 April")
// ---------------------------------------------------------------------------

function todaySerif(): string {
  const d = new Date();
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ---------------------------------------------------------------------------
// Styles - kept in one place so the queue reads as a deliberate single object.
// ---------------------------------------------------------------------------

function TriageStyles() {
  return (
    <style jsx global>{`
      .triage-page {
        max-width: 880px;
        margin: 0 auto;
        padding-bottom: var(--sp-11);
      }

      /* --- Header block --- */
      .triage-head {
        padding: var(--sp-3) 0 var(--sp-8);
      }
      .triage-eyebrow {
        display: flex;
        align-items: center;
        gap: var(--sp-3);
        margin-bottom: var(--sp-5);
      }
      .triage-eyebrow-date {
        font-family: var(--font-serif);
        font-style: italic;
        font-size: var(--text-eyebrow);
        color: var(--terracotta);
        letter-spacing: -0.005em;
      }
      .triage-eyebrow-sep {
        width: 28px;
        height: 1px;
        background: var(--line);
      }
      .triage-eyebrow-label {
        font-size: var(--text-micro);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--ink-faint);
        font-weight: 600;
      }
      .triage-headline {
        font-family: var(--font-sans);
        font-size: var(--text-display);
        font-weight: 500;
        letter-spacing: -0.036em;
        line-height: var(--line-height-display);
        color: var(--ink);
        margin: 0 0 var(--sp-4);
        max-width: 720px;
      }
      .triage-sub {
        font-size: var(--text-body);
        line-height: var(--line-height-body);
        color: var(--ink-muted);
        max-width: 560px;
        margin: 0 0 var(--sp-7);
      }

      /* --- Meter strip --- */
      .triage-meter {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        margin: 0;
        padding: 0;
      }
      @media (max-width: 720px) {
        .triage-meter {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .meter {
        padding: var(--sp-5) var(--sp-4) var(--sp-5) 0;
        border-right: 1px solid var(--line-soft);
        position: relative;
      }
      .meter:last-child {
        border-right: none;
      }
      @media (max-width: 720px) {
        .meter:nth-child(2) {
          border-right: none;
        }
        .meter:nth-child(1),
        .meter:nth-child(2) {
          border-bottom: 1px solid var(--line-soft);
        }
      }
      .meter::before {
        content: "";
        position: absolute;
        left: 0;
        top: var(--sp-5);
        bottom: var(--sp-5);
        width: 3px;
        border-radius: 2px;
        background: var(--line);
      }
      .meter-terracotta::before { background: var(--terracotta); }
      .meter-butter::before { background: var(--butter); }
      .meter-sage::before { background: var(--sage); }
      .meter-neutral::before { background: var(--line-card); }

      .meter dt,
      .meter dd {
        margin: 0;
        padding-left: var(--sp-4);
      }
      .meter-label {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .meter-value {
        font-size: 28px;
        font-weight: 500;
        letter-spacing: -0.02em;
        color: var(--ink);
      }
      .meter-name {
        font-size: var(--text-meta);
        color: var(--ink-muted);
        font-weight: 500;
      }
      .meter-sub {
        font-family: var(--font-serif);
        font-style: italic;
        font-size: var(--text-meta);
        color: var(--ink-faint);
        margin-top: 2px;
      }

      /* --- The list itself --- */
      .triage-list {
        list-style: none;
        margin: var(--sp-7) 0 0;
        padding: 0;
      }
      .qrow {
        border-bottom: 1px solid var(--line-soft);
      }
      .qrow:first-child {
        border-top: 1px solid var(--line);
      }
      .qrow:last-child {
        border-bottom: 1px solid var(--line);
      }
      .qrow-link {
        display: grid;
        grid-template-columns: 64px 1fr;
        gap: var(--sp-5);
        padding: var(--sp-6) var(--sp-3) var(--sp-6) var(--sp-2);
        text-decoration: none;
        color: inherit;
        position: relative;
        transition: background 0.2s ease;
      }
      .qrow-link:hover {
        background: var(--canvas-soft);
      }
      .qrow-link:hover .qrow-cta-chev {
        color: var(--terracotta);
      }

      /* --- Rank column --- */
      .qrow-rank {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-top: 4px;
      }
      .qrow-rank-num {
        font-family: var(--font-mono);
        font-size: var(--text-meta);
        color: var(--ink-faint);
        letter-spacing: 0.04em;
        font-weight: 500;
      }
      .qrow-rank-tick {
        margin-top: var(--sp-3);
        width: 18px;
        height: 1px;
        background: var(--line-card);
      }
      .qrow-accent-terracotta .qrow-rank-num { color: var(--terracotta); font-weight: 700; }
      .qrow-accent-terracotta .qrow-rank-tick { background: var(--terracotta); height: 2px; }
      .qrow-accent-butter .qrow-rank-tick { background: var(--butter); }
      .qrow-accent-sage .qrow-rank-tick { background: var(--sage); }

      /* --- Body --- */
      .qrow-body {
        min-width: 0;
      }
      .qrow-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--sp-5);
      }
      .qrow-identity {
        display: flex;
        align-items: center;
        gap: var(--sp-4);
        min-width: 0;
      }
      .qrow-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: var(--ink);
        box-shadow: var(--shadow-soft);
      }
      .avatar-terracotta {
        background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
      }
      .avatar-butter {
        background: linear-gradient(135deg, var(--butter-tint) 0%, var(--butter-soft) 100%);
      }
      .avatar-sage {
        background: linear-gradient(135deg, var(--sage-tint) 0%, var(--sage-soft) 100%);
        color: var(--sage-deep);
      }
      .avatar-neutral {
        background: linear-gradient(135deg, var(--stone-soft) 0%, var(--stone) 100%);
        color: var(--ink-soft);
      }
      .qrow-identity-text {
        min-width: 0;
      }
      .qrow-name {
        font-size: var(--text-section);
        font-weight: 600;
        color: var(--ink);
        letter-spacing: -0.012em;
        line-height: 1.25;
      }
      .qrow-name-meta {
        font-weight: 400;
        color: var(--ink-muted);
        font-size: var(--text-dense);
        letter-spacing: -0.004em;
      }
      .qrow-status {
        display: flex;
        align-items: center;
        gap: var(--sp-3);
        margin-top: 4px;
        flex-wrap: wrap;
      }
      .qrow-tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: var(--radius-pill);
        font-size: var(--text-micro);
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
      .qrow-tag-terracotta {
        background: var(--terracotta-tint);
        color: var(--terracotta-deep);
      }
      .qrow-tag-butter {
        background: var(--butter-tint);
        color: #8a5a0f;
      }
      .qrow-tag-sage {
        background: var(--sage-tint);
        color: var(--sage-deep);
      }
      .qrow-tag-neutral {
        background: var(--stone-soft);
        color: var(--ink-muted);
      }
      .qrow-time {
        font-size: var(--text-meta);
        color: var(--ink-muted);
        letter-spacing: -0.005em;
      }
      .qrow-time-right {
        flex-shrink: 0;
        text-align: right;
      }
      .qrow-time-serif {
        font-family: var(--font-serif);
        font-style: italic;
        font-size: var(--text-meta);
        color: var(--ink-faint);
      }
      @media (max-width: 640px) {
        .qrow-time-right { display: none; }
      }

      .qrow-reason {
        font-size: var(--text-body);
        line-height: 1.5;
        color: var(--ink-soft);
        margin: var(--sp-4) 0 0;
        letter-spacing: -0.005em;
      }

      /* --- Flagged markers inline strip --- */
      .qrow-flags {
        list-style: none;
        margin: var(--sp-4) 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--sp-2);
      }
      .qrow-flag {
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        padding: 4px 10px;
        border-radius: var(--radius-tight);
        background: var(--paper);
        border: 1px solid var(--line-card);
        font-size: var(--text-meta);
        color: var(--ink-soft);
      }
      .qrow-flag-marker {
        font-weight: 600;
        color: var(--ink);
      }
      .qrow-flag-value {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--ink-muted);
      }
      .qrow-flag-dir {
        font-family: var(--font-serif);
        font-style: italic;
        font-size: 11px;
        color: var(--ink-faint);
      }
      .qrow-flag-moderate {
        border-color: #e6c3b3;
        background: var(--terracotta-tint);
      }
      .qrow-flag-moderate .qrow-flag-dir {
        color: var(--terracotta-deep);
      }
      .qrow-flag-severe {
        border-color: var(--terracotta-soft);
        background: var(--terracotta-tint);
      }

      .qrow-cta-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--sp-4);
        margin-top: var(--sp-5);
        padding-top: var(--sp-4);
        border-top: 1px dashed var(--line-soft);
      }
      .qrow-cta-label {
        font-size: var(--text-meta);
        color: var(--ink-muted);
        letter-spacing: -0.005em;
      }
      .qrow-cta-chev {
        font-family: var(--font-serif);
        font-style: italic;
        font-size: var(--text-meta);
        color: var(--ink-faint);
        letter-spacing: -0.005em;
        transition: color 0.2s ease;
      }

      /* --- Footer --- */
      .triage-foot {
        margin-top: var(--sp-8);
        padding-top: var(--sp-5);
        font-size: var(--text-meta);
        color: var(--ink-faint);
        letter-spacing: -0.005em;
      }
      .triage-foot-serif {
        font-family: var(--font-serif);
        font-style: italic;
        color: var(--ink-muted);
      }
    `}</style>
  );
}
