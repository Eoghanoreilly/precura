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
import { LivingProfileLink } from "@/components/member/LivingProfileLink";
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
      <NoteFromDoctor preview={NOTE_PREVIEW} noteDate={NOTE_DATE} />
      {glucose && <GlucoseHero {...glucose} />}
      <WhatMoved markers={changes} />
      <RiskTrajectory
        history={RISK_HISTORY}
        projection={RISK_PROJECTION}
        currentLabel="17%"
        modelName="Type 2 diabetes (FINDRISC)"
        riskLabel="Moderate risk, trending up"
      />
      <PanelSummary {...summary} />
      <NextStep
        eyebrow="Next step"
        title="Book a 15-minute call with Dr. Tomas to walk through the panel."
        action="Schedule a call"
      />
      <LivingProfileLink years={5} />
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
        currentLabel="17%"
        modelName="Type 2 diabetes (FINDRISC)"
        riskLabel="Moderate risk, holding steady"
      />
      <PanelSummary {...summary} />
      <NextStep
        eyebrow="Next panel"
        title="Your Q2 kit ships 26 July. Nothing to do until then."
        subtle
      />
      <LivingProfileLink years={5} />
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
      />
      <NextStep
        eyebrow="Your kit"
        title="Blood kit ships 15 April. Track it here when it's on the move."
        action="Track my kit"
      />
      <GhostCard
        title="Your 10-year forecast"
        subtitle="Appears after your first panel"
      />
      <GhostCard
        title="Your panel"
        subtitle="Your first panel results will land here"
      />
      <LivingProfileLink years={0} />
    </>
  );
}

function GhostCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        margin: "0 20px 18px",
        padding: "28px 22px",
        background: "rgba(255,255,255,0.4)",
        border: "1px dashed #E0D9C8",
        borderRadius: 22,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#8B8579",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#8B8579",
          fontStyle: "italic",
        }}
      >
        {subtitle}
      </div>
    </div>
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
