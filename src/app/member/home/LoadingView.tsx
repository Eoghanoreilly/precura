"use client";

import React from "react";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { C, SYSTEM_FONT } from "@/components/member/tokens";

// ============================================================================
// LoadingView - shown while AdaptiveHomeView fetches data from Supabase.
// Matches the legacy spinner/copy so the first paint does not shift.
// ============================================================================

export function LoadingView({ sidebar }: { sidebar: MemberSidebarProps }) {
  return (
    <MemberShell sidebar={sidebar} userInitials=".">
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <div
          style={{
            width: 24,
            height: 24,
            border: `2.5px solid ${C.stone}`,
            borderTopColor: C.terracotta,
            borderRadius: "50%",
            margin: "0 auto 12px",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: 14,
            color: C.inkFaint,
            fontFamily: SYSTEM_FONT,
          }}
        >
          Loading your health data...
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </MemberShell>
  );
}
