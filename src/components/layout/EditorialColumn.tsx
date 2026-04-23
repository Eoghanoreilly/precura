"use client";

import React from "react";

export interface EditorialColumnProps {
  variant?: "reading" | "narrow" | "wide";
  children: React.ReactNode;
}

/**
 * EditorialColumn - centered main-column wrapper with fluid gutters.
 *
 * Reading variant (default): column grows from 720 (tablet) -> 880 (laptop)
 * -> 1040 (desktop) -> 1160 (large). Narrow variant (chat): 720 everywhere.
 * Wide variant: 1280 max.
 *
 * Column width changes by viewport, but SubGrid inside collapses by container width.
 */
export function EditorialColumn({ variant = "reading", children }: EditorialColumnProps) {
  return (
    <div className={`edcol edcol-${variant}`}>
      {children}
      <style jsx>{`
        .edcol {
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .edcol-reading { max-width: 100%; }
        .edcol-narrow  { max-width: var(--col-narrow); }
        .edcol-wide    { max-width: var(--col-wide); }

        @media (min-width: 768px) {
          .edcol-reading { max-width: var(--col-reading-tablet); }
        }
        @media (min-width: 1024px) {
          .edcol-reading { max-width: var(--col-reading-laptop); }
        }
        @media (min-width: 1280px) {
          .edcol-reading { max-width: var(--col-reading-desktop); }
        }
        @media (min-width: 1600px) {
          .edcol-reading { max-width: var(--col-reading-large); }
        }
      `}</style>
    </div>
  );
}
