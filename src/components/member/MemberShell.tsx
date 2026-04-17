"use client";

import React, { useState } from "react";
import Link from "next/link";
import { C, SYSTEM_FONT } from "./tokens";
import { MemberSidebar, type MemberSidebarProps } from "./MemberSidebar";
import { MobileDrawer } from "./MobileDrawer";

// ============================================================================
// MemberShell - the responsive frame every /member page renders inside.
//
// Mobile (< 1024px):
//   - Full viewport width
//   - Sticky top bar with hamburger (left), logo (center), avatar (right)
//   - Drawer slides in from the left on hamburger tap
//   - Main content fills the viewport with comfortable gutters
//
// Desktop (>= 1024px):
//   - CSS grid: 280px sidebar on the left, main content area on the right
//   - Sidebar is sticky and contains the full MemberSidebar component
//   - Main content centers at max 960px within its grid cell with padding
//   - Mobile header hidden
// ============================================================================

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.canvas,
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      {/* Mobile header - hidden at >=1024px */}
      <header className="member-mobile-header">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "none",
            padding: 6,
            cursor: "pointer",
            color: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HamburgerIcon />
        </button>
        <Link
          href="/member"
          style={{
            color: C.ink,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.028em",
            textDecoration: "none",
          }}
        >
          Precura
        </Link>
        <Link
          href="/member/profile"
          aria-label="Profile"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.ink,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              boxShadow: C.shadowSoft,
            }}
          >
            {userInitials}
          </div>
        </Link>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeHref={sidebar.activeHref}
      />

      {/* Responsive layout wrapper */}
      <div className="member-layout">
        {/* Desktop sidebar - hidden below 1024px */}
        <div className="member-desktop-sidebar">
          <MemberSidebar {...sidebar} />
        </div>

        {/* Main content - always visible, centered with max-width */}
        <main className="member-main">{children}</main>
      </div>

      <style jsx global>{`
        /* Mobile header: default visible */
        .member-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid ${C.lineSoft};
          position: sticky;
          top: 0;
          background: ${C.canvas};
          z-index: 20;
          gap: 14px;
        }

        /* Layout: single column on mobile, grid on desktop */
        .member-layout {
          display: block;
          min-height: calc(100dvh - 66px);
        }

        .member-desktop-sidebar {
          display: none;
        }

        .member-main {
          width: 100%;
          max-width: 100%;
          padding: 28px 20px 56px;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .member-main {
            padding: 36px 32px 64px;
          }
        }

        @media (min-width: 1024px) {
          .member-mobile-header {
            display: none;
          }
          .member-layout {
            display: grid;
            grid-template-columns: 300px minmax(0, 1fr);
            align-items: start;
            min-height: 100dvh;
          }
          .member-desktop-sidebar {
            display: block;
            position: sticky;
            top: 0;
            align-self: start;
            max-height: 100dvh;
            overflow-y: auto;
            border-right: 1px solid ${C.lineSoft};
          }
          .member-main {
            max-width: 980px;
            margin: 0 auto;
            padding: 40px 48px 72px;
            width: 100%;
          }
        }

        @media (min-width: 1440px) {
          .member-main {
            padding: 48px 56px 80px;
          }
        }
      `}</style>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="11" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="16" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
