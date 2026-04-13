"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

/**
 * Smooth scroll wrapper for home-7.
 * Uses ReactLenis at root to give the whole theater-mode page a single
 * inertial scroll signal. Sticky sections and useScroll will read from it.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
