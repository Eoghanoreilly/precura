"use client";

import React from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MemberSidebar, type MemberSidebarProps } from "./MemberSidebar";

/**
 * MemberShell - BACKWARDS-COMPAT SHIM.
 *
 * Wraps PageShell + MemberSidebar so existing /member/* pages (panels, discuss,
 * messages, profile, training) keep working unchanged while the home page
 * migrates to direct PageShell usage. Delete this shim when the last caller
 * is migrated to PageShell (tracked in later specs).
 */
export interface MemberShellProps {
  sidebar: MemberSidebarProps;
  userInitials: string;
  children: React.ReactNode;
}

export function MemberShell({ sidebar, userInitials, children }: MemberShellProps) {
  return (
    <PageShell
      userInitials={userInitials}
      logoHref="/member"
      activeHref={sidebar.activeHref}
      sideRail={<MemberSidebar {...sidebar} />}
    >
      {children}
    </PageShell>
  );
}
