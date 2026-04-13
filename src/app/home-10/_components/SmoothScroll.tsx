"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Base smooth scroll for the whole page. One instance, mounted once.
 * Lenis syncs ScrollTrigger and framer-motion's useScroll so everything
 * stays in lockstep as the user scrolls through the mixed-media page.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
