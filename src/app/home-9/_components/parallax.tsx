"use client";

/**
 * Parallax primitives shared across home-9.
 *
 * All sections use the same pattern:
 *  - A section ref tracks scrollYProgress for its own visible range
 *  - Multiple layers transform y at different speeds (-200..200 px)
 *  - GPU accelerated via framer-motion (translate3d under the hood)
 *  - Respects prefers-reduced-motion by collapsing all motion values to 0
 */

import React, { useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
  MotionValue,
} from "framer-motion";

/** Pair of values used to keep the typing readable below. */
type Range = [number, number];

/**
 * Standard parallax speeds used throughout the page. Pushing past +-220px tends
 * to break section framing, so we keep everything within a reasonable envelope.
 */
export const PARALLAX = {
  bgSlow: [-60, 60] as Range,
  bgMed: [-120, 120] as Range,
  mid: [-160, 160] as Range,
  fgSlow: [-40, 40] as Range,
  fgFast: [-200, 200] as Range,
};

/**
 * Internal helper: build a motion value from scrollYProgress that respects the
 * prefers-reduced-motion user setting.
 */
export function useParallaxY(
  scrollYProgress: MotionValue<number>,
  range: Range,
  reduceMotion: boolean | null
) {
  const base = useTransform(scrollYProgress, [0, 1], range);
  const flat = useTransform(scrollYProgress, [0, 1], [0, 0]);
  return reduceMotion ? flat : base;
}

/** Opacity reveal helper: fade element in while it crosses the viewport. */
export function useFadeIn(scrollYProgress: MotionValue<number>) {
  return useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.6]);
}

/** Reveal helper for big hero copy that appears then stays. */
export function useStickyFade(scrollYProgress: MotionValue<number>) {
  return useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
}

/**
 * Hook wrapping useScroll + useReducedMotion so each section consumes a simple
 * API. Returns the section's scrollYProgress (untouched) plus a boolean to
 * toggle parallax off for reduced-motion visitors.
 */
export function useSectionScroll(
  ref: React.RefObject<HTMLElement | null>,
  offset: [string, string] = ["start end", "end start"]
) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: offset as any,
  });
  return { scrollYProgress, reduceMotion: !!reduceMotion };
}

/**
 * Utility to watch viewport width so we can taper parallax down on mobile.
 * Returns a multiplier: 1 on desktop, 0.45 on narrow viewports.
 */
export function useMobileMultiplier() {
  const [mult, setMult] = useState(1);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setMult(window.innerWidth < 768 ? 0.45 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return mult;
}

/**
 * Word-by-word reveal for editorial headlines. Splits on spaces and animates
 * each word's y and opacity when the container enters the viewport.
 */
export function SplitReveal({
  text,
  delay = 0,
  style,
  className,
}: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span
      className={className}
      style={{ display: "inline-block", ...style }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span
            aria-hidden
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              delay: delay + i * 0.06,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: "inline-block", willChange: "transform" }}
          >
            {w}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
