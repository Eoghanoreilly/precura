"use client";

/**
 * Machine Briefing concept.
 *
 * The morning memo IS the page. Precura reads overnight and writes Tomas a
 * short editorial brief: what matters today, who moved, who has gone quiet,
 * who is waiting on him. A short action list sits below the prose for the
 * first few taps, then the page fades into the day. No grid. No queue. No
 * dashboard. Just a confident, specific, data-grounded read.
 */

import React from "react";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  NextPanelHint,
  RailNav,
  EditorialColumn,
  Hero,
  Button,
  NarrativeCard,
} from "@/components/layout";
import { MOCK_PATIENTS, POPULATION_STATS, type MockPatient } from "@/app/doctor/concepts/mockPatients";

// ---------------------------------------------------------------------------
// Derivation helpers. Everything in the prose below must be traceable to data.
// ---------------------------------------------------------------------------

const SEVERITY_WEIGHT: Record<string, number> = { mild: 1, moderate: 2, severe: 3 };

function severityScore(p: MockPatient): number {
  return p.flaggedMarkers.reduce((acc, m) => acc + (SEVERITY_WEIGHT[m.severity] ?? 0), 0);
}

function pendingReviews(): MockPatient[] {
  return MOCK_PATIENTS.filter((p) => p.status === "pending_review");
}

function sharpestPending(): MockPatient | undefined {
  return [...pendingReviews()].sort((a, b) => severityScore(b) - severityScore(a))[0];
}

function awaitingLong(): MockPatient | undefined {
  return MOCK_PATIENTS
    .filter((p) => p.status === "awaiting_patient" && p.daysSinceLastAction >= 60)
    .sort((a, b) => b.daysSinceLastAction - a.daysSinceLastAction)[0];
}

function staleSince(): MockPatient | undefined {
  return MOCK_PATIENTS
    .filter((p) => p.status === "stale")
    .sort((a, b) => b.daysSinceLastAction - a.daysSinceLastAction)[0];
}

function activeWithUnread(): MockPatient | undefined {
  return MOCK_PATIENTS
    .filter((p) => p.status === "active" && p.unreadMessages > 0)
    .sort((a, b) => b.unreadMessages - a.unreadMessages)[0];
}

function newMember(): MockPatient | undefined {
  return MOCK_PATIENTS.find((p) => p.status === "new_member");
}

function monthName(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { month: "long" });
}

function weeksSince(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DoctorBriefingPage() {
  const anna = sharpestPending();
  const erik = pendingReviews().find((p) => p.id !== anna?.id);
  const mikael = awaitingLong();
  const kristina = staleSince();
  const eoghan = activeWithUnread();
  const sofia = newMember();

  const pendingCount = POPULATION_STATS.pendingReview;
  const today = new Date("2026-04-23").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor/concepts/briefing" />}
      sections={[
        <IdentityCard
          key="id"
          user={{
            name: "Dr. Tomas Kurakovas",
            initials: "TK",
            memberSince: "Licensed doctor",
          }}
          doctor={{
            name: "Precura",
            initials: "PR",
            title: "Overnight digest ready",
          }}
        />,
        <NextPanelHint
          key="np"
          eyebrow="This morning"
          headline={`${pendingCount} panels to review`}
          subtext={`${POPULATION_STATS.unreadMessages} unread from patients`}
        />,
        <RailNav
          key="nav"
          activeHref="/doctor/concepts/briefing"
          items={[
            { label: "Patients", href: "/doctor/patients" },
            { label: "Panels", href: "/doctor/panels" },
            { label: "Notes", href: "/doctor/notes" },
            { label: "Settings", href: "/doctor/settings" },
          ]}
        />,
      ]}
    />
  );

  // -------------------------------------------------------------------------
  // Briefing prose. Composed from the mock data, not templated.
  // -------------------------------------------------------------------------

  const headline =
    pendingCount >= 2
      ? `${pendingCount} panels to read before your 10am.`
      : `${pendingCount} panel to read before your 10am.`;

  const briefing = (
    <>
      <p>
        Good morning, Tomas. {today}. Precura has pre-read every panel, message, and
        long silence overnight. The shortlist is below; the rest of the roster is quiet.
      </p>
      {anna && (
        <p>
          {anna.name.split(" ")[0]}&apos;s fourth panel came in late yesterday and it is
          the one worth opening first. LDL has climbed from 3.6 to 4.1 mmol/L since last
          autumn, and her HbA1c has nudged into the pre-diabetic band at 44. It is not a
          red flag on its own, but the trajectory is consistent across two years and she
          has not heard from you since November. A lipid-focused follow-up in three months
          feels right.
        </p>
      )}
      {erik && (
        <p>
          {erik.name.split(" ")[0]} joined in March and his first panel is clean apart
          from the expected Nordic winter vitamin D and a ferritin of 18. He has sent
          a short message too. A welcoming first note, supplementation, and an iron
          retest in eight weeks would close the loop.
        </p>
      )}
      {mikael && (
        <p>
          {mikael.name.split(" ")[0]} {mikael.name.split(" ")[1]} still has not ordered
          the retest you asked for after his February panel. That was {weeksSince(mikael.lastPatientActivity)}{" "}
          weeks ago. His LDL was mild, so there is no urgency, but a short nudge today
          is cheaper than losing him to silence.
        </p>
      )}
      {kristina && (
        <p>
          {kristina.name.split(" ")[0]} has been quiet since {monthName(kristina.lastPatientActivity)}.
          Her October panel showed a borderline TSH you said you would re-check at the
          annual mark. That mark is now. If she does not respond to a check-in within
          thirty days, she is at risk of falling off care.
        </p>
      )}
      {eoghan && (
        <p>
          {eoghan.name.split(" ")[0]} replied to your note on training during travel and
          is waiting on an answer. Markers all in range; this one is a conversation, not
          a panel read.
        </p>
      )}
      {sofia && (
        <p>
          One new member joined yesterday, {sofia.name.split(" ")[0]}. No panels, no
          questionnaire yet. A short welcome and a link to the ordering flow will do.
        </p>
      )}
      <p>
        That is the whole morning. Nothing urgent, nothing slipping. Coffee first.
      </p>
    </>
  );

  // -------------------------------------------------------------------------
  // Action rows
  // -------------------------------------------------------------------------

  const primaryActions: Array<{
    patient: MockPatient;
    context: string;
    cta: string;
  }> = [];

  if (anna) {
    primaryActions.push({
      patient: anna,
      context: "LDL up to 4.1, HbA1c at 44. Panel from yesterday.",
      cta: "Begin review",
    });
  }
  if (erik) {
    primaryActions.push({
      patient: erik,
      context: "First panel. Low vitamin D and ferritin of 18.",
      cta: "Begin review",
    });
  }
  if (mikael) {
    primaryActions.push({
      patient: mikael,
      context: `Retest you asked for in February, still not ordered.`,
      cta: "Send nudge",
    });
  }
  if (eoghan) {
    primaryActions.push({
      patient: eoghan,
      context: `${eoghan.unreadMessages} unread about training during travel.`,
      cta: "Reply",
    });
  }

  const laterActions: Array<{
    patient: MockPatient;
    context: string;
    cta: string;
  }> = [];

  if (kristina) {
    laterActions.push({
      patient: kristina,
      context: `Quiet since ${monthName(kristina.lastPatientActivity)}. Annual TSH check-in.`,
      cta: "Send check-in",
    });
  }
  if (sofia) {
    laterActions.push({
      patient: sofia,
      context: "Joined yesterday. No panels yet.",
      cta: "Send welcome",
    });
  }

  return (
    <PageShell
      sideRail={sideRail}
      userInitials="TK"
      activeHref="/doctor/concepts/briefing"
      logoHref="/doctor/concepts/briefing"
    >
      <EditorialColumn variant="reading">
        <Hero
          tone="warm"
          eyebrow={
            <em
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--sage-deep)",
                fontStyle: "italic",
              }}
            >
              Morning briefing
            </em>
          }
          display={headline}
          body={briefing}
          sig={
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "var(--ink-muted)",
              }}
            >
              Pre-read by Precura, 06:14 CET
            </span>
          }
        />

        <section className="section">
          <h2 className="section-title">Top of the list</h2>
          <p className="section-kicker">
            Four threads to close before lunch. The rest can wait.
          </p>
          <ul className="action-list">
            {primaryActions.map(({ patient, context, cta }) => (
              <li key={patient.id} className="action-row">
                <div className="avatar">{patient.initials}</div>
                <div className="action-body">
                  <div className="action-name">
                    {patient.name}
                    <span className="action-meta">
                      {patient.age}, {patient.sex === "F" ? "female" : "male"}
                    </span>
                  </div>
                  <div className="action-context">{context}</div>
                </div>
                <div className="action-cta">
                  <Button tone="sage">{cta}</Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {laterActions.length > 0 && (
          <section className="section quieter">
            <h2 className="section-title muted">Later today</h2>
            <p className="section-kicker">
              Not urgent. Queue a minute of attention when you have one.
            </p>
            <div className="later-grid">
              {laterActions.map(({ patient, context, cta }) => (
                <NarrativeCard key={patient.id} tone="default">
                  <div className="later-row">
                    <div className="avatar quiet">{patient.initials}</div>
                    <div className="later-body">
                      <div className="later-name">{patient.name}</div>
                      <div className="later-context">{context}</div>
                    </div>
                  </div>
                  <div className="later-cta">
                    <Button tone="secondary">{cta}</Button>
                  </div>
                </NarrativeCard>
              ))}
            </div>
          </section>
        )}

        <p className="postscript">
          <em>Pattern summary:</em> Roster of {POPULATION_STATS.total}. {POPULATION_STATS.active}{" "}
          active thread, {POPULATION_STATS.awaitingPatient} waiting on patient,{" "}
          {POPULATION_STATS.stale} gone quiet, {POPULATION_STATS.newMembers} joined this week.
          Precura will re-read the full roster tonight.
        </p>
      </EditorialColumn>

      <style jsx>{`
        .section {
          margin: var(--sp-9) 0 var(--sp-8);
        }
        .section.quieter {
          margin-top: var(--sp-10);
          padding-top: var(--sp-8);
          border-top: 1px solid var(--line-soft);
        }
        .section-title {
          font-size: var(--text-section);
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.01em;
          margin: 0 0 var(--sp-2);
        }
        .section-title.muted {
          color: var(--ink-muted);
          font-weight: 500;
        }
        .section-kicker {
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--ink-muted);
          font-size: var(--text-meta);
          margin: 0 0 var(--sp-6);
          letter-spacing: 0.002em;
        }
        .action-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .action-row {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: var(--sp-5);
          align-items: center;
          padding: var(--sp-5) 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .action-row:last-child {
          border-bottom: none;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          box-shadow: var(--shadow-soft);
          flex-shrink: 0;
        }
        .avatar.quiet {
          background: var(--stone-soft);
          box-shadow: none;
          width: 36px;
          height: 36px;
          font-size: 13px;
        }
        .action-body {
          min-width: 0;
        }
        .action-name {
          font-size: var(--text-body);
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.008em;
          margin-bottom: 2px;
          display: flex;
          align-items: baseline;
          gap: var(--sp-2);
          flex-wrap: wrap;
        }
        .action-meta {
          font-size: var(--text-meta);
          font-weight: 400;
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
        }
        .action-context {
          font-size: var(--text-meta);
          color: var(--ink-soft);
          line-height: var(--line-height-dense);
        }
        .action-cta {
          flex-shrink: 0;
        }

        .later-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--sp-4);
        }
        @container main-col (min-width: 680px) {
          .later-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .later-row {
          display: flex;
          gap: var(--sp-3);
          align-items: center;
          margin-bottom: var(--sp-4);
        }
        .later-body {
          min-width: 0;
        }
        .later-name {
          font-size: var(--text-body);
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.008em;
        }
        .later-context {
          font-size: var(--text-meta);
          color: var(--ink-muted);
          line-height: var(--line-height-dense);
          margin-top: 2px;
        }
        .later-cta {
          margin-top: var(--sp-2);
        }

        .postscript {
          margin-top: var(--sp-10);
          padding-top: var(--sp-6);
          border-top: 1px solid var(--line-soft);
          font-size: var(--text-meta);
          color: var(--ink-faint);
          line-height: var(--line-height-body);
          font-family: var(--font-serif);
        }
        .postscript em {
          color: var(--sage-deep);
          font-style: italic;
          margin-right: var(--sp-1);
        }

        @media (max-width: 600px) {
          .action-row {
            grid-template-columns: 40px 1fr;
            grid-template-areas:
              "avatar body"
              "avatar body"
              "cta cta";
            row-gap: var(--sp-3);
          }
          .action-row .avatar {
            grid-area: avatar;
          }
          .action-row .action-body {
            grid-area: body;
          }
          .action-row .action-cta {
            grid-area: cta;
          }
        }
      `}</style>
    </PageShell>
  );
}
