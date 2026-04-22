"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";

// ============================================================================
// MockDemoView - demo fallback for USE_REAL_DATA = false or ?state= query.
// Matches the legacy behaviour: hard-coded Anna sidebar + placeholder banner.
// Kept intact so Task 14+ can evolve the real states without touching demo mode.
// ============================================================================

export function MockDemoView() {
  const params = useSearchParams();
  const mockState = params.get("state") ?? "panel-results-day";

  const sidebar: MemberSidebarProps = {
    user: {
      name: "Anna Bergstrom",
      initials: "A",
      memberSince: "Member since Jan 2026",
    },
    doctor: {
      name: DOCTOR.name,
      initials: DOCTOR.initials,
      title: DOCTOR.title,
    },
    nextPanel: {
      eyebrow: "Next panel",
      headline: "26 July 2026",
      subtext: "Kit ships 19 July",
    },
    activeHref: "/member",
  };

  return (
    <MemberShell sidebar={sidebar} userInitials="A">
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <p
          style={{
            fontSize: 14,
            color: C.inkFaint,
            padding: "20px 0",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Demo mode (Anna). State: {mockState}
        </p>
      </div>
      <style jsx global>{`
        html,
        body {
          background: ${C.stone};
          overflow-x: hidden;
        }
      `}</style>
    </MemberShell>
  );
}
