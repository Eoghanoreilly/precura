"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StatusHeadline } from "@/components/member/StatusHeadline";
import { NoteFromDoctor } from "@/components/member/NoteFromDoctor";
import { GlucoseHero } from "@/components/member/GlucoseHero";
import { WhatMoved } from "@/components/member/WhatMoved";
import { RiskTrajectory } from "@/components/member/RiskTrajectory";
import { PanelSummary } from "@/components/member/PanelSummary";
import { NextStep } from "@/components/member/NextStep";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { DOCTOR } from "@/components/member/tokens";
import {
  buildMarkerChanges,
  buildPanelSummary,
  buildGlucoseHero,
  RISK_HISTORY,
  RISK_PROJECTION,
  NOTE_PREVIEW,
  NOTE_DATE,
  STATUS_TEXT,
} from "@/components/member/data";

// ============================================================================
// Sidebar presets per user state
// ============================================================================

const ANNA_USER = {
  name: "Anna Bergstrom",
  initials: "A",
  memberSince: "Member since Jan 2026",
};

const ERIK_USER = {
  name: "Erik Lindqvist",
  initials: "E",
  memberSince: "Member since Apr 2026",
};

const TOMAS = {
  name: DOCTOR.name,
  initials: DOCTOR.initials,
  title: DOCTOR.title,
};

const SIDEBAR_PANEL_RESULTS: MemberSidebarProps = {
  user: ANNA_USER,
  doctor: TOMAS,
  nextPanel: {
    eyebrow: "Next panel",
    headline: "26 July 2026",
    subtext: "Kit ships 19 July",
  },
};

const SIDEBAR_BETWEEN_PANELS: MemberSidebarProps = {
  user: ANNA_USER,
  doctor: TOMAS,
  nextPanel: {
    eyebrow: "Next panel",
    headline: "26 July 2026",
    subtext: "In 47 days",
  },
};

const SIDEBAR_NEW_MEMBER: MemberSidebarProps = {
  user: ERIK_USER,
  doctor: TOMAS,
  nextPanel: {
    eyebrow: "Your kit",
    headline: "Ships 15 April",
    subtext: "Track it here",
  },
};

// ============================================================================
// State: panel-results-day (Anna, primary)
// ============================================================================

function PanelResultsDayView() {
  const changes = buildMarkerChanges();
  const summary = buildPanelSummary();
  const glucose = buildGlucoseHero();

  return (
    <>
      <StatusHeadline text={STATUS_TEXT} tone="attention" />
      <NoteFromDoctor
        preview={NOTE_PREVIEW}
        noteDate={NOTE_DATE}
        primaryAction={{ label: "Schedule a 15-min call" }}
      />
      {glucose && <GlucoseHero {...glucose} />}

      {/* 2-up row at desktop: supporting markers beside panel summary.
          Collapses to single column below 1024px. */}
      <div className="member-pair-row">
        <WhatMoved markers={changes} />
        <PanelSummary {...summary} />
      </div>

      <RiskTrajectory
        history={RISK_HISTORY}
        projection={RISK_PROJECTION}
        modelName="Type 2 diabetes (FINDRISC)"
        caption="You're sitting at the high end of moderate, around 17%. If the glucose trend continues at its current slope, the model projects you cross into higher-risk territory inside 5 years. That's the line Dr. Tomas wants to flatten."
      />

      <style jsx global>{`
        .member-pair-row {
          display: block;
        }
        @media (min-width: 1024px) {
          .member-pair-row {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 16px;
            margin: 0 20px 18px;
          }
          .member-pair-row > section {
            margin-left: 0 !important;
            margin-right: 0 !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// State: between-panels (Anna, secondary)
// ============================================================================

function BetweenPanelsView() {
  const summary = buildPanelSummary();
  return (
    <>
      <StatusHeadline
        text="Steady quarter. Next panel in 47 days."
        tone="neutral"
      />
      <NoteFromDoctor
        preview="Your fasting glucose has stabilised since the March panel. The new training rhythm is working. Keep the daily walks going and let's check again at the next panel."
        noteDate="12 May 2026"
      />
      <RiskTrajectory
        history={RISK_HISTORY}
        projection={RISK_PROJECTION}
        modelName="Type 2 diabetes (FINDRISC)"
        caption="Your forecast has held steady at around 17% since the last panel. The lifestyle changes are doing real work here."
      />
      <PanelSummary {...summary} />
      <NextStep
        eyebrow="Next panel"
        title="Your Q2 kit ships 26 July. Nothing to do until then."
        subtle
      />
    </>
  );
}

// ============================================================================
// State: new-member-day-1 (Erik, secondary)
// ============================================================================

function NewMemberView() {
  return (
    <>
      <StatusHeadline
        text="Welcome, Erik. Your first kit ships tomorrow."
        tone="good"
      />
      <NoteFromDoctor
        preview="Welcome to Precura. I'm Tomas, the doctor who'll review your panels and write your notes. Your first kit is on its way. When the results come back, I'll walk you through every marker and what it means for you."
        noteDate="14 Apr 2026"
        primaryAction={{ label: "Track my kit" }}
      />
      <WhileYouWait />
    </>
  );
}

// ============================================================================
// WhileYouWait - new-member editorial section
// ============================================================================

function WhileYouWait() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{
        margin: "0 20px 28px",
        padding: "26px 28px 28px",
        background: "rgba(255,255,255,0.5)",
        border: `1px dashed #D0C9B8`,
        borderRadius: 22,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#8B8579",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        While you wait
      </div>
      <div
        style={{
          fontSize: "clamp(16px, 1.9vw, 19px)",
          lineHeight: 1.65,
          color: "#615C52",
          fontStyle: "italic",
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: "-0.005em",
        }}
      >
        When your kit arrives, you&apos;ll draw a small sample at home and drop
        it at any Swedish Post office. We forward it to our lab in Stockholm
        and run a panel of 22 markers. Dr. Tomas writes you a personal note
        within 48 hours of the results landing. From that moment on, this
        page becomes your living profile: a 10-year risk forecast, every
        marker that moved since your last panel, and a five-year story that
        starts with your first result.
      </div>
    </motion.section>
  );
}

// ============================================================================
// Page shell with Suspense for useSearchParams
// ============================================================================

function MemberHomeContent() {
  const params = useSearchParams();
  const state = params.get("state") ?? "panel-results-day";

  if (state === "between-panels") {
    return (
      <MemberShell sidebar={SIDEBAR_BETWEEN_PANELS} userInitials="A">
        <BetweenPanelsView />
      </MemberShell>
    );
  }
  if (state === "new-member") {
    return (
      <MemberShell sidebar={SIDEBAR_NEW_MEMBER} userInitials="E">
        <NewMemberView />
      </MemberShell>
    );
  }
  return (
    <MemberShell sidebar={SIDEBAR_PANEL_RESULTS} userInitials="A">
      <PanelResultsDayView />
    </MemberShell>
  );
}

export default function MemberHomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh" }} />}>
      <MemberHomeContent />
    </Suspense>
  );
}
