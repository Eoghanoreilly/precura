"use client";

import React from "react";

export interface SubGridProps {
  columns: 2 | 3 | 4;
  gap?: "tight" | "normal" | "loose";
  children: React.ReactNode;
}

/**
 * SubGrid - responsive inline grid that collapses by CONTAINER width, not viewport.
 *
 * columns={2}: 1-up <560,  2-up >=560.
 * columns={3}: 1-up <560,  2-up 560-839, 3-up >=840.
 * columns={4}: 1-up <560,  2-up 560-839, 3-up 840-1119, 4-up >=1120.
 *
 * Requires a parent container-type: inline-size (PageShell.shell-main provides one).
 */
export function SubGrid({ columns, gap = "normal", children }: SubGridProps) {
  return (
    <div className={`subgrid cols-${columns} gap-${gap}`}>
      {children}
      <style jsx>{`
        .subgrid {
          display: grid;
          grid-template-columns: 1fr;
        }
        .gap-tight  { gap: var(--sp-2); }
        .gap-normal { gap: var(--sp-3); }
        .gap-loose  { gap: var(--sp-4); }

        @container main-col (min-width: 560px) {
          .cols-2, .cols-3, .cols-4 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @container main-col (min-width: 840px) {
          .cols-3 { grid-template-columns: repeat(3, 1fr); }
          .cols-4 { grid-template-columns: repeat(3, 1fr); }
        }
        @container main-col (min-width: 1120px) {
          .cols-4 { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </div>
  );
}
