"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors, fontStack } from "./tokens";

/**
 * Short vertical strip used to bridge horizontal-pinned sections.
 * Runs a mono-type ticker of a concept cue so the reader feels the
 * horizontal motion is deliberate rather than accidental.
 */
export default function TransitionStrip({
  label,
  caption,
  bg = colors.parchment,
  fg = colors.ink,
}: {
  label: string;
  caption: string;
  bg?: string;
  fg?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const rule = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      style={{
        background: bg,
        color: fg,
        padding: "60px 40px",
        fontFamily: fontStack.display,
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${fg === colors.ivory ? colors.inkMid : colors.inkLine}`,
        borderBottom: `1px solid ${fg === colors.ivory ? colors.inkMid : colors.inkLine}`,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "32px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: fg === colors.ivory ? colors.inkFaint : colors.inkMuted,
          }}
        >
          {label}
        </div>

        <div style={{ position: "relative", height: "1px", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: fg === colors.ivory ? colors.inkMid : colors.inkLine,
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: rule,
              background: colors.amber,
            }}
          />
        </div>

        <motion.div
          style={{
            x,
            fontSize: "clamp(16px, 1.4vw, 20px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: fg,
          }}
        >
          {caption}
        </motion.div>
      </div>
    </section>
  );
}
