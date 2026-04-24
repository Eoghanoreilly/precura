"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MobileDrawer } from "@/components/member/MobileDrawer";

export interface PageShellProps {
  sideRail: React.ReactNode;
  /** Override the default MobileDrawer. Can be a ReactNode or a render function receiving (open, onClose). */
  mobileDrawer?: React.ReactNode | ((open: boolean, onClose: () => void) => React.ReactNode);
  userInitials: string;
  logoHref?: string;
  activeHref?: string;
  children: React.ReactNode;
}

/**
 * PageShell - the responsive frame every site page renders inside.
 *
 * <1024px: sticky top bar (hamburger / wordmark / avatar), mobile drawer for sideRail, full-width main.
 * >=1024px: CSS grid rail + main. Sticky sideRail. Scrollable main with container-type: inline-size for SubGrid queries.
 *
 * Widths and paddings come from CSS custom properties defined in globals.css.
 */
export function PageShell({
  sideRail,
  mobileDrawer,
  userInitials,
  logoHref = "/member",
  activeHref,
  children,
}: PageShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="shell-root">
      {/* Mobile top bar */}
      <header className="shell-topbar">
        <button
          className="shell-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
        <Link href={logoHref} className="shell-wordmark">
          Precura
        </Link>
        <Link href="/member/profile" aria-label="Profile" className="shell-avatar">
          {userInitials}
        </Link>
      </header>

      {/* Mobile drawer (can be overridden per-context via node or render function) */}
      {mobileDrawer == null
        ? <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activeHref={activeHref} />
        : typeof mobileDrawer === "function"
          ? mobileDrawer(drawerOpen, () => setDrawerOpen(false))
          : mobileDrawer
      }

      {/* Layout */}
      <div className="shell-layout">
        <aside className="shell-rail">{sideRail}</aside>
        <main className="shell-main">{children}</main>
      </div>

      <style jsx global>{`
        .shell-root {
          min-height: 100dvh;
          background: var(--canvas);
          color: var(--ink);
          font-family: var(--font-sans);
          letter-spacing: -0.005em;
        }

        /* --- Mobile top bar (< 1024px) --- */
        .shell-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--sp-3) var(--sp-5);
          border-bottom: 1px solid var(--line-soft);
          position: sticky;
          top: 0;
          background: var(--canvas);
          z-index: 20;
          gap: var(--sp-3);
        }
        .shell-hamburger {
          background: none;
          border: none;
          padding: var(--sp-1);
          cursor: pointer;
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .shell-wordmark {
          color: var(--ink);
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.028em;
          text-decoration: none;
        }
        .shell-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: var(--shadow-soft);
        }

        /* --- Layout (default mobile) --- */
        .shell-layout {
          display: block;
          min-height: calc(100dvh - 66px);
        }
        .shell-rail {
          display: none;
        }
        .shell-main {
          container-type: inline-size;
          container-name: main-col;
          width: 100%;
          padding: var(--sp-6) var(--sp-5) var(--sp-10);
          box-sizing: border-box;
        }

        @media (min-width: 520px) {
          .shell-main {
            padding: var(--sp-7) var(--sp-7) var(--sp-11);
          }
        }

        /* --- Desktop (>= 1024px) --- */
        @media (min-width: 1024px) {
          .shell-topbar { display: none; }
          .shell-layout {
            display: grid;
            grid-template-columns: var(--rail-width-laptop) minmax(0, 1fr);
            align-items: start;
            min-height: 100dvh;
          }
          .shell-rail {
            display: block;
            position: sticky;
            top: 0;
            align-self: start;
            max-height: 100dvh;
            overflow-y: auto;
            border-right: 1px solid var(--line-soft);
          }
          .shell-main {
            padding: var(--sp-8) clamp(24px, 4vw, 56px) var(--sp-11);
          }
        }

        /* --- Wide desktop (>= 1280px) --- */
        @media (min-width: 1280px) {
          .shell-layout {
            grid-template-columns: var(--rail-width-desktop) minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="11" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="16" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
