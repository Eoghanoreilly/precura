"use client";

import React from "react";
import { C, SYSTEM_FONT } from "./tokens";
import { TopBar } from "./TopBar";
import { MemberSidebar, type MemberSidebarProps } from "./MemberSidebar";

/**
 * Responsive shell for all /member pages.
 *
 * - <640px: 430px max column, TopBar at top, no sidebar.
 * - 640-1023px: 640px max column, TopBar at top, no sidebar.
 * - >=1024px: 1160px grid, sticky left sidebar (280px), main content (right).
 *   TopBar hidden because the sidebar contains the logo.
 *
 * Pages pass sidebar props so content-specific details (next panel, active nav)
 * can vary per page/state.
 */

export interface MemberShellProps {
  sidebar: MemberSidebarProps;
  userInitials: string;
  children: React.ReactNode;
}

export function MemberShell({
  sidebar,
  userInitials,
  children,
}: MemberShellProps) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.stone,
        fontFamily: SYSTEM_FONT,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="member-shell">
        <div className="member-shell-topbar">
          <TopBar userInitials={userInitials} />
        </div>

        <div className="member-shell-grid">
          <MemberSidebar {...sidebar} />
          <main className="member-shell-main">{children}</main>
        </div>
      </div>

      <style jsx global>{`
        .member-shell {
          width: 100%;
          max-width: 430px;
          min-height: 100dvh;
          background: ${C.canvasDeep};
          box-shadow: 0 0 60px rgba(28, 26, 23, 0.1);
        }
        .member-shell-grid {
          display: block;
        }
        .member-sidebar {
          display: none;
        }
        @media (min-width: 640px) {
          .member-shell {
            max-width: 640px;
          }
        }
        @media (min-width: 1024px) {
          .member-shell {
            max-width: 1160px;
            box-shadow: 0 0 80px rgba(28, 26, 23, 0.08);
          }
          .member-shell-topbar {
            display: none;
          }
          .member-shell-grid {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 0;
            align-items: start;
          }
          .member-sidebar {
            display: block;
            position: sticky;
            top: 0;
            align-self: start;
            max-height: 100dvh;
            overflow-y: auto;
            padding: 28px 28px 28px 28px;
            border-right: 1px solid ${C.lineSoft};
          }
          .member-sidebar-inner {
            max-width: 236px;
          }
          .member-shell-main {
            padding-top: 12px;
          }
        }
      `}</style>
    </div>
  );
}
