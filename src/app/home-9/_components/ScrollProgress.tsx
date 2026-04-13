"use client";

/**
 * Fixed top scroll progress bar + numeric readout. Thin, editorial detail
 * that completes the long-form reading experience.
 */

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { C, FONT, SIZE } from "./tokens";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = useTransform(smooth, [0, 1], [0, 1]);
  const percent = useTransform(smooth, (v) => `${Math.round(v * 100)}`);

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: C.terracotta,
          transformOrigin: "0% 0%",
          scaleX,
          zIndex: 100,
          pointerEvents: "none",
        }}
        aria-hidden
      />
      <div
        style={{
          position: "fixed",
          right: "clamp(20px, 2.5vw, 36px)",
          bottom: "clamp(20px, 2.5vw, 36px)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: FONT.mono,
          fontSize: SIZE.eyebrow,
          letterSpacing: "0.18em",
          color: C.ink,
          background: "rgba(244, 239, 230, 0.92)",
          backdropFilter: "blur(10px)",
          padding: "10px 14px",
          border: `1px solid ${C.rule}`,
          zIndex: 100,
          pointerEvents: "none",
          mixBlendMode: "normal",
        }}
        aria-hidden
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.terracotta,
            display: "inline-block",
          }}
        />
        <motion.span>{percent}</motion.span>
        <span style={{ opacity: 0.5 }}>/ 100</span>
      </div>
    </>
  );
}
