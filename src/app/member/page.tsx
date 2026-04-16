"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { StatusHeadline } from "@/components/member/StatusHeadline";
import { NoteFromDoctor } from "@/components/member/NoteFromDoctor";
import { GlucoseHero } from "@/components/member/GlucoseHero";
import { WhatMoved } from "@/components/member/WhatMoved";
import { RiskTrajectory } from "@/components/member/RiskTrajectory";
import { NextStep } from "@/components/member/NextStep";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import {
  USE_REAL_DATA,
  buildMarkerChanges,
  buildPanelSummary,
  buildGlucoseHero,
  RISK_HISTORY,
  RISK_PROJECTION,
  NOTE_PREVIEW,
  NOTE_DATE,
  STATUS_TEXT,
} from "@/components/member/data";
import { getCurrentUser, getPanels } from "@/lib/data/panels";
import type { Profile, PanelWithBiomarkers } from "@/lib/data/types";

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
// Real data view - fetches from Supabase
// ============================================================================

function RealDataView() {
  const [user, setUser] = useState<Profile | null>(null);
  const [panels, setPanels] = useState<PanelWithBiomarkers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) {
        setLoading(false);
        return;
      }
      setUser(u);
      const p = await getPanels(u.id);
      setPanels(p);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <MemberShell
        sidebar={{
          user: { name: "...", initials: ".", memberSince: "" },
          doctor: TOMAS,
          nextPanel: { eyebrow: "", headline: "", subtext: "" },
        }}
        userInitials="."
      >
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div
            style={{
              fontSize: 14,
              color: C.inkFaint,
              fontFamily: SYSTEM_FONT,
            }}
          >
            Loading...
          </div>
        </div>
      </MemberShell>
    );
  }

  const sidebar: MemberSidebarProps = {
    user: {
      name: user?.display_name || "Member",
      initials: (user?.display_name || "M")[0].toUpperCase(),
      memberSince: user?.created_at
        ? `Member since ${new Date(user.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`
        : "",
    },
    doctor: TOMAS,
    nextPanel: {
      eyebrow: panels.length > 0 ? "Latest panel" : "Get started",
      headline:
        panels.length > 0
          ? new Date(panels[0].panel_date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Add your first panel",
      subtext:
        panels.length > 0
          ? `${panels[0].biomarkers.length} markers`
          : "Upload your blood test data",
    },
  };

  const userInitials = (user?.display_name || "M")[0].toUpperCase();

  if (panels.length === 0) {
    return (
      <MemberShell sidebar={sidebar} userInitials={userInitials}>
        <EmptyState userName={user?.display_name || "there"} />
      </MemberShell>
    );
  }

  // Build data from real panels
  const latest = panels[0];
  const previous = panels[1];
  const totalMarkers = latest.biomarkers.length;
  const flagged = latest.biomarkers.filter(
    (b) => b.status !== "normal"
  ).length;

  return (
    <MemberShell sidebar={sidebar} userInitials={userInitials}>
      <StatusHeadline
        text={
          flagged > 0
            ? `${flagged} marker${flagged > 1 ? "s" : ""} to review from your latest panel.`
            : "All markers in range. Looking good."
        }
        tone={flagged > 0 ? "attention" : "good"}
      />

      {panels.length >= 2 && previous && (
        <WhatMoved
          markers={buildRealMarkerChanges(latest, previous)}
          panelTotal={totalMarkers}
          panelFlagged={flagged}
          panelInRange={totalMarkers - flagged}
        />
      )}

      <NextStep
        eyebrow="Panels"
        title={`${panels.length} panel${panels.length > 1 ? "s" : ""} on file. ${totalMarkers} markers in the latest.`}
        action="/member/panels"
      />

      <NextStep
        eyebrow="Add data"
        title="Add a new blood panel"
        action="/member/panels/new"
      />
    </MemberShell>
  );
}

function buildRealMarkerChanges(
  latest: PanelWithBiomarkers,
  previous: PanelWithBiomarkers
): import("@/components/member/WhatMoved").MarkerChange[] {
  const changes: import("@/components/member/WhatMoved").MarkerChange[] = [];

  for (const m of latest.biomarkers) {
    const prev = previous.biomarkers.find(
      (p) => p.short_name === m.short_name
    );
    if (!prev) continue;
    if (prev.value === m.value) continue;
    changes.push({
      name: m.short_name,
      plainName: m.plain_name || m.name_eng || m.short_name,
      unit: m.unit,
      previousValue: prev.value,
      currentValue: m.value,
      status: m.status,
    });
  }

  changes.sort((a, b) => {
    const sevA = a.status === "normal" ? 0 : 1;
    const sevB = b.status === "normal" ? 0 : 1;
    if (sevA !== sevB) return sevB - sevA;
    const changeA =
      Math.abs(a.currentValue - a.previousValue) / a.previousValue;
    const changeB =
      Math.abs(b.currentValue - b.previousValue) / b.previousValue;
    return changeB - changeA;
  });

  return changes.slice(0, 4);
}

// ============================================================================
// Empty state - no panels yet
// ============================================================================

function EmptyState({ userName }: { userName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.terracotta,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Welcome
      </div>
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 46px)",
          lineHeight: 1.1,
          letterSpacing: "-0.028em",
          fontWeight: 600,
          color: C.ink,
          margin: 0,
          marginBottom: 14,
        }}
      >
        Hey, {userName}.{" "}
        <span
          style={{
            color: C.inkMuted,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
          }}
        >
          Let's get your data in.
        </span>
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: C.inkMuted,
          margin: 0,
          marginBottom: 36,
          maxWidth: 560,
        }}
      >
        Add your first blood panel to get started. Once you have two or more
        panels, Precura will show you trends, changes, and what to watch.
      </p>

      <a
        href="/member/panels/new"
        style={{
          display: "inline-block",
          padding: "16px 28px",
          background: C.terracotta,
          color: C.canvasSoft,
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: SYSTEM_FONT,
          textDecoration: "none",
          letterSpacing: "-0.005em",
          boxShadow:
            "0 8px 18px -8px rgba(201,87,58,0.42), 0 2px 6px rgba(201,87,58,0.2)",
        }}
      >
        Add your first panel
      </a>
    </motion.div>
  );
}

// ============================================================================
// Mock data views (kept for demo mode when USE_REAL_DATA = false)
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

      <WhatMoved
        markers={changes}
        panelTotal={summary.total}
        panelFlagged={summary.flagged}
        panelInRange={summary.inRange}
      />

      <RiskTrajectory
        history={RISK_HISTORY}
        projection={RISK_PROJECTION}
        modelName="Type 2 diabetes (FINDRISC)"
        caption="You're sitting at the high end of moderate, around 17%. If the glucose trend continues at its current slope, the model projects you cross into higher-risk territory inside 5 years. That's the line Dr. Tomas wants to flatten."
      />
    </>
  );
}

function BetweenPanelsView() {
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
      <NextStep
        eyebrow="Next panel"
        title="Your Q2 kit ships 26 July. Nothing to do until then."
        subtle
      />
    </>
  );
}

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

function WhileYouWait() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{
        margin: "0 0 28px",
        padding: "26px 28px 28px",
        background: "rgba(255,255,255,0.5)",
        border: `1px dashed #D0C9B8`,
        borderRadius: 22,
        fontFamily: SYSTEM_FONT,
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

  // Real data mode - no mock state param, fetch from Supabase
  if (USE_REAL_DATA && !params.get("state")) {
    return <RealDataView />;
  }

  // Mock/demo mode
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
