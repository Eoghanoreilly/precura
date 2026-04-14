"use client";

import React from "react";
import { C } from "./tokens";

/**
 * Responsive shell for all /member pages.
 *
 * Breakpoints follow the project-wide convention in CLAUDE.md:
 * - mobile (<640px): full width, up to 430px
 * - tablet (640-1023px): 560px max
 * - desktop (>=1024px): 720px max
 *
 * The cream canvas is the soft inner column; the darker canvasDeep behind it
 * (provided by layout.tsx) fills the rest of the viewport on wider screens.
 */
export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="member-shell">
      {children}
      <style jsx>{`
        .member-shell {
          width: 100%;
          max-width: 430px;
          min-height: 100dvh;
          background: ${C.canvas};
          box-shadow: 0 0 40px rgba(28, 26, 23, 0.06);
        }
        @media (min-width: 640px) {
          .member-shell {
            max-width: 560px;
          }
        }
        @media (min-width: 1024px) {
          .member-shell {
            max-width: 720px;
            box-shadow: 0 0 80px rgba(28, 26, 23, 0.08);
          }
        }
      `}</style>
    </div>
  );
}
