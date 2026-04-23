"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MemberShell } from "@/components/member/MemberShell";
import { USE_REAL_DATA } from "@/components/member/data";
import { determineState } from "./home/determineState";
import { groupBiomarkersBySystem } from "./home/categoryMap";
import { buildSidebar } from "./home/buildSidebar";
import { useHomeData } from "./home/useHomeData";
import { LoadingView } from "./home/LoadingView";
import { StateA } from "./home/StateA";
import { StateB } from "./home/StateB";
import { StateC } from "./home/StateC";
import { StateD } from "./home/StateD";
import { StateE } from "./home/StateE";
import { StateF } from "./home/StateF";
import { StateG } from "./home/StateG";
import { MockDemoView } from "./home/MockDemoView";

// ============================================================================
// Adaptive home router - fetches data, derives state, delegates to State<X>.
// All rendering lives in home/State*.tsx. Each state is fleshed out in its
// own follow-up task (Tasks 14-20).
// ============================================================================

function AdaptiveHomeView() {
  const { user, panels, annotations, markerHistories, loading } = useHomeData();

  const state = useMemo(
    () => determineState(panels, annotations),
    [panels, annotations]
  );
  const systems = useMemo(
    () => (panels.length === 0 ? [] : groupBiomarkersBySystem(panels[0].biomarkers)),
    [panels]
  );
  const sidebar = useMemo(() => buildSidebar(user, panels), [user, panels]);

  if (loading) return <LoadingView sidebar={sidebar} />;

  const latestDoctorAnnotation =
    annotations.find(
      (a) => a.author?.role === "doctor" || a.author?.role === "both"
    ) ?? null;

  const userInitials = (user?.display_name || "M")[0].toUpperCase();
  const userName = user?.display_name?.split(" ")[0] || "there";

  const commonProps = {
    panels,
    annotations,
    userName,
    markerHistories,
    systems,
    latestDoctorAnnotation,
  };

  const content = (() => {
    switch (state) {
      case "A": return <StateA {...commonProps} />;
      case "B": return <StateB {...commonProps} />;
      case "C": return <StateC {...commonProps} />;
      case "D": return <StateD {...commonProps} />;
      case "E": return <StateE {...commonProps} />;
      case "F": return <StateF {...commonProps} />;
      case "G": return <StateG {...commonProps} />;
    }
  })();

  return (
    <MemberShell sidebar={sidebar} userInitials={userInitials}>
      {content}
    </MemberShell>
  );
}

// ============================================================================
// Page entry point
// ============================================================================

function MemberHomeContent() {
  const params = useSearchParams();
  if (!USE_REAL_DATA || params.get("state")) return <MockDemoView />;
  return <AdaptiveHomeView />;
}

export default function MemberHomePage() {
  return (
    <Suspense
      fallback={<div style={{ minHeight: "100dvh", background: "var(--canvas)" }} />}
    >
      <MemberHomeContent />
    </Suspense>
  );
}
