"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
} from "@/lib/v2/mock-patient";
import { TopBar } from "@/components/member/TopBar";
import { StatusHeadline } from "@/components/member/StatusHeadline";
import { NoteFromDoctor } from "@/components/member/NoteFromDoctor";
import { WhatMoved, MarkerChange } from "@/components/member/WhatMoved";
import { RiskTrajectory } from "@/components/member/RiskTrajectory";
import { PanelSummary, Category } from "@/components/member/PanelSummary";
import { NextStep } from "@/components/member/NextStep";
import { LivingProfileLink } from "@/components/member/LivingProfileLink";
import { MemberShell } from "@/components/member/MemberShell";

// ============================================================================
// Data derivation for Anna on panel-results-day
// ============================================================================

function buildMarkerChanges(): MarkerChange[] {
  // Latest panel is index 0, previous panel is index 1.
  const latest = BLOOD_TEST_HISTORY[0];
  const previous = BLOOD_TEST_HISTORY[1];
  if (!latest || !previous) return [];

  // Pick the markers that exist in both and show the ones that moved.
  const changes: MarkerChange[] = [];
  for (const m of latest.results) {
    const prev = previous.results.find((p) => p.shortName === m.shortName);
    if (!prev) continue;
    if (prev.value === m.value) continue;
    changes.push({
      name: m.shortName,
      plainName: m.plainName,
      unit: m.unit,
      previousValue: prev.value,
      currentValue: m.value,
      status: m.status,
    });
  }
  // Sort: borderline/abnormal first, then by biggest relative change.
  changes.sort((a, b) => {
    const sevA = a.status === "normal" ? 0 : 1;
    const sevB = b.status === "normal" ? 0 : 1;
    if (sevA !== sevB) return sevB - sevA;
    const changeA = Math.abs(a.currentValue - a.previousValue) / a.previousValue;
    const changeB = Math.abs(b.currentValue - b.previousValue) / b.previousValue;
    return changeB - changeA;
  });
  return changes.slice(0, 4);
}

function buildPanelSummary(): {
  total: number;
  flagged: number;
  inRange: number;
  panelDate: string;
  categories: Category[];
} {
  const latest = BLOOD_TEST_HISTORY[0];
  const total = latest.results.length;
  const flagged = latest.results.filter((m) => m.status !== "normal").length;
  const inRange = total - flagged;

  const metabolicMarkers = ["HbA1c", "f-Glucose", "f-Insulin"];
  const cardioMarkers = ["TC", "HDL", "LDL", "TG"];
  const thyroidMarkers = ["TSH"];
  const nutritionMarkers = ["Vit D"];
  const kidneyMarkers = ["Crea"];

  function categoryStats(shortNames: string[]): Category | null {
    const picked = latest.results.filter((m) => shortNames.includes(m.shortName));
    if (picked.length === 0) return null;
    return {
      name: "",
      markerCount: picked.length,
      flaggedCount: picked.filter((m) => m.status !== "normal").length,
    };
  }

  const categories: Category[] = [];
  const metabolic = categoryStats(metabolicMarkers);
  if (metabolic) categories.push({ ...metabolic, name: "Metabolic / blood sugar" });
  const cardio = categoryStats(cardioMarkers);
  if (cardio) categories.push({ ...cardio, name: "Cardiovascular" });
  const thyroid = categoryStats(thyroidMarkers);
  if (thyroid) categories.push({ ...thyroid, name: "Thyroid" });
  const nutrition = categoryStats(nutritionMarkers);
  if (nutrition) categories.push({ ...nutrition, name: "Nutrition" });
  const kidney = categoryStats(kidneyMarkers);
  if (kidney) categories.push({ ...kidney, name: "Kidney function" });

  return {
    total,
    flagged,
    inRange,
    panelDate: formatDate(latest.date),
    categories,
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// FINDRISC risk projection data. History is modeled from Anna's glucose drift;
// projection is the RISK_ASSESSMENTS.diabetes.tenYearRisk trajectory extrapolated.
// These numbers are consistent with mock patient worsening trend, not fabricated
// clinical claims.
const RISK_HISTORY = [
  { year: "2022", value: 10 },
  { year: "2023", value: 12 },
  { year: "2024", value: 14 },
  { year: "2025", value: 15 },
  { year: "2026", value: 17 },
];

const RISK_PROJECTION = [
  { year: "2026", value: 17 },
  { year: "2027", value: 19 },
  { year: "2028", value: 20 },
  { year: "2029", value: 21 },
  { year: "2030", value: 22 },
  { year: "2031", value: 23 },
];

// ============================================================================
// State: panel-results-day (Anna, primary)
// ============================================================================

function PanelResultsDayView() {
  const changes = buildMarkerChanges();
  const summary = buildPanelSummary();

  return (
    <>
      <TopBar userInitials="A" />
      <StatusHeadline
        text="Your fasting glucose moved. Dr. Tomas wants to walk you through it."
        tone="attention"
      />
      <NoteFromDoctor
        preview="Your fasting glucose at 5.8 is in the upper normal range, not diabetic, but worth watching. Looking at your Precura history, it's been gradually rising from 5.0 in 2021. Combined with your family history, I'd recommend we keep a close eye on this."
        noteDate="28 Mar 2026"
      />
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
      <TopBar userInitials="A" />
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
      <TopBar userInitials="E" />
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
      <GhostCard title="Your 10-year forecast" subtitle="Appears after your first panel" />
      <GhostCard title="Your panel" subtitle="Your first panel results will land here" />
      <LivingProfileLink years={0} />
    </>
  );
}

function GhostCard({ title, subtitle }: { title: string; subtitle: string }) {
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

  let view: React.ReactNode;
  if (state === "between-panels") view = <BetweenPanelsView />;
  else if (state === "new-member") view = <NewMemberView />;
  else view = <PanelResultsDayView />;

  return <MemberShell>{view}</MemberShell>;
}

export default function MemberHomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh" }} />}>
      <MemberHomeContent />
    </Suspense>
  );
}
