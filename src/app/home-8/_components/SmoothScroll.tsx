"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

/**
 * Smooth scroll wrapper for home-8.
 * Lenis provides the inertial scroll signal that the horizontal-pinned
 * sections read from via useScroll. lerp 0.09 tuned to feel cinematic
 * without being sluggish.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
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
