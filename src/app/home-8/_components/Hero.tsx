"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * HERO - cinematic scroll-linked opening.
 * Massive display type, a live drawing glucose chart, scroll-triggered motion,
 * plus a quiet line of mono telemetry running top-right like a film leader.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Type pushes up and fades as you scroll away from hero
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const chartScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Live animated year counter for the telemetry strip
  const year = useMotionValue(2021);
  const glucose = useMotionValue(5.0);
  const [yearText, setYearText] = useState("2021");
  const [glucoseText, setGlucoseText] = useState("5.0");

  useEffect(() => {
    const y = animate(year, 2026, {
      duration: 5,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    });
    const g = animate(glucose, 5.8, {
      duration: 5,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    });
    const unsubY = year.on("change", (v) => setYearText(String(Math.round(v))));
    const unsubG = glucose.on("change", (v) => setGlucoseText(v.toFixed(1)));
    return () => {
      y.stop();
      g.stop();
      unsubY();
      unsubG();
    };
  }, [year, glucose]);

  // Draw the glucose line on mount
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${colors.ivory} 0%, ${colors.cream} 100%)`,
        fontFamily: fontStack.display,
        color: colors.ink,
      }}
    >
      {/* Film leader top strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: fontStack.mono,
          fontSize: "11px",
          color: colors.inkMuted,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: colors.amber,
              boxShadow: `0 0 12px ${colors.amber}`,
            }}
          />
          <span>PRECURA / PRE + CURA</span>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          <span>SE.STOCKHOLM</span>
          <span>REC {yearText}</span>
          <span>GLUCOSE {glucoseText} mmol/L</span>
        </div>
      </div>

      {/* Subtle grain / dot grid */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${colors.inkFaint}22 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          y: bgY,
          opacity: 0.6,
        }}
      />

      {/* Big display headline */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 5,
          padding: "120px 40px 40px",
          maxWidth: "1440px",
          margin: "0 auto",
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easing.out, delay: 0.2 }}
          style={{
            fontFamily: fontStack.mono,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: colors.inkMuted,
            marginBottom: "32px",
          }}
        >
          A predictive health platform / launching Sverige 2026
        </motion.div>

        <h1
          style={{
            fontSize: "clamp(60px, 12vw, 184px)",
            lineHeight: 0.88,
            fontWeight: 500,
            letterSpacing: "-0.04em",
            margin: 0,
            color: colors.ink,
          }}
        >
          {"See what's".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easing.out, delay: 0.3 + i * 0.02 }}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {ch}
            </motion.span>
          ))}
          <br />
          {"coming.".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easing.out, delay: 0.55 + i * 0.02 }}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                fontStyle: "italic",
                fontWeight: 400,
                color: colors.amberDeep,
              }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easing.out, delay: 1 }}
          style={{
            fontSize: "clamp(16px, 1.6vw, 22px)",
            lineHeight: 1.55,
            maxWidth: "620px",
            color: colors.inkSoft,
            marginTop: "40px",
            fontWeight: 400,
          }}
        >
          We run your blood work, your family history, and your lifestyle through
          the same clinical risk models a Swedish GP would use. Then we show you
          the decade ahead, in plain Swedish.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easing.out, delay: 1.2 }}
          style={{ display: "flex", gap: "16px", marginTop: "40px", flexWrap: "wrap" }}
        >
          <a
            href="#cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "18px 32px",
              background: colors.ink,
              color: colors.ivory,
              borderRadius: "100px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Start with a blood test / 995 SEK
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: colors.amber,
              }}
            />
          </a>
          <a
            href="#how"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "18px 32px",
              background: "transparent",
              color: colors.ink,
              border: `1px solid ${colors.inkLine}`,
              borderRadius: "100px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            See how it works
          </a>
        </motion.div>
      </motion.div>

      {/* Live drawing chart in bottom-right */}
      <motion.div
        style={{
          position: "absolute",
          right: 40,
          bottom: 80,
          width: "min(540px, 42vw)",
          pointerEvents: "none",
          scale: chartScale,
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.inkMuted,
            marginBottom: "12px",
          }}
        >
          Anna / fasting glucose / mmol/L
        </div>
        <svg viewBox="0 0 540 200" style={{ width: "100%", display: "block" }}>
          <defs>
            <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={colors.forestSoft} />
              <stop offset="60%" stopColor={colors.amber} />
              <stop offset="100%" stopColor={colors.rust} />
            </linearGradient>
            <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.amber} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colors.amber} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Ref line 6.0 */}
          <line
            x1="0"
            y1="50"
            x2="540"
            y2="50"
            stroke={colors.inkLine}
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <text
            x="540"
            y="45"
            textAnchor="end"
            fontSize="9"
            fontFamily={fontStack.mono}
            fill={colors.inkMuted}
          >
            6.0 pre-diabetic threshold
          </text>
          {/* Area under line */}
          <motion.path
            d="M 0 160 L 90 155 L 180 145 L 270 135 L 360 125 L 450 95 L 540 70 L 540 200 L 0 200 Z"
            fill="url(#heroFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: drawn ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 1.6 }}
          />
          {/* Line path */}
          <motion.path
            d="M 0 160 L 90 155 L 180 145 L 270 135 L 360 125 L 450 95 L 540 70"
            fill="none"
            stroke="url(#heroLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: drawn ? 1 : 0 }}
            transition={{ duration: 2.2, delay: 1.4, ease: easing.out }}
          />
          {/* End dot */}
          <motion.circle
            cx="540"
            cy="70"
            r="6"
            fill={colors.rust}
            initial={{ scale: 0 }}
            animate={{ scale: drawn ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 3.6 }}
          />
          <motion.circle
            cx="540"
            cy="70"
            r="12"
            fill="none"
            stroke={colors.rust}
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: drawn ? [1, 1.5, 1] : 0, opacity: drawn ? [0.6, 0, 0.6] : 0 }}
            transition={{ duration: 2, delay: 3.8, repeat: Infinity }}
          />
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: fontStack.mono,
            fontSize: "10px",
            color: colors.inkMuted,
            marginTop: "8px",
            letterSpacing: "0.1em",
          }}
        >
          <span>2021 / 5.0</span>
          <span>2022 / 5.1</span>
          <span>2023 / 5.2</span>
          <span>2024 / 5.4</span>
          <span>2025 / 5.5</span>
          <span style={{ color: colors.rust }}>2026 / 5.8</span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "32px",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          fontFamily: fontStack.mono,
          fontSize: "10px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.inkMuted,
        }}
      >
        <span>scroll / 11 chapters</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "24px",
            background: colors.ink,
            transformOrigin: "top",
          }}
        />
      </motion.div>
    </section>
  );
}
