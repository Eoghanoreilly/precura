"use client";

/**
 * Precura / home-3
 * Cinematic, scroll-pinned landing page.
 *
 * Each stage is a full viewport. Scroll is pinned inside each stage and scrubbed
 * through progress-driven transforms. Typography stays minimal: a single sentence
 * lands per stage. Imagery is full-bleed via Unsplash. Smooth scroll by Lenis,
 * transforms via framer-motion.
 *
 * SSR notes:
 *  - The whole tree is `"use client"`; framer-motion transforms run in the browser.
 *  - We render a minimal placeholder on first mount to avoid hydration mismatch
 *    from `window.innerWidth` checks.
 *  - Hooks (useScroll / useTransform) are called at the top of each stage
 *    component (never inside callbacks or maps).
 */

import { useRef, useEffect, useState, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import SmoothScroll from "./_components/SmoothScroll";

// ---------------------------------------------------------------------------
// Design tokens (inline, no CSS vars)
// ---------------------------------------------------------------------------

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO_STACK =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

const C = {
  ink: "#0E0E10",
  paper: "#F5F1EA",
  dim: "rgba(14, 14, 16, 0.55)",
  faint: "rgba(14, 14, 16, 0.35)",
  line: "rgba(14, 14, 16, 0.12)",
  warm: "#E8DCC4",
  sand: "#D9C9A8",
  amber: "#C77E42",
  deep: "#0B1A2B",
  teal: "#2C6E6A",
  forest: "#14322A",
  frostText: "rgba(245, 241, 234, 0.92)",
  frostDim: "rgba(245, 241, 234, 0.6)",
};

// ---------------------------------------------------------------------------
// Imagery (Unsplash)
// ---------------------------------------------------------------------------

const IMG = {
  // Stage 1: Swedish lake at dawn, mist
  hero:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=85&auto=format&fit=crop",
  // Stage 2: lab / vials warm tone
  lab:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=2400&q=85&auto=format&fit=crop",
  // Stage 3: Swedish woman portrait, quiet
  anna:
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=2400&q=85&auto=format&fit=crop",
  // Stage 4: warm lifestyle interior
  life:
    "https://images.unsplash.com/photo-1434596922112-19c563067271?w=2400&q=85&auto=format&fit=crop",
  // Stage 5: Swedish forest path
  forest:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2400&q=85&auto=format&fit=crop",
};

// ---------------------------------------------------------------------------
// Pinned stage container
// ---------------------------------------------------------------------------

function PinContainer({
  scrollHeight = 2,
  background,
  children,
  sectionRef,
}: {
  scrollHeight?: number;
  background: string;
  children: ReactNode;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${scrollHeight * 100}vh`,
        background,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared micro-components
// ---------------------------------------------------------------------------

function ScrollCue({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        color: C.frostDim,
        fontFamily: MONO_STACK,
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        pointerEvents: "none",
      }}
    >
      <span>Scroll</span>
      <motion.div
        style={{
          width: 1,
          height: 42,
          background:
            "linear-gradient(180deg, rgba(245,241,234,0.7), rgba(245,241,234,0))",
        }}
        animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function Chapter({
  index,
  label,
  opacity,
}: {
  index: string;
  label: string;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 40,
        left: 40,
        fontFamily: MONO_STACK,
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: C.frostDim,
        opacity,
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <span>{index}</span>
      <span
        style={{
          width: 24,
          height: 1,
          background: "rgba(245, 241, 234, 0.35)",
        }}
      />
      <span>{label}</span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// STAGE 1 / Hero
// ---------------------------------------------------------------------------

function StageHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const vignette = useTransform(scrollYProgress, [0, 1], [0.55, 0.75]);
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.7, 0.95],
    [0, 1, 1, 0]
  );
  const headlineY = useTransform(scrollYProgress, [0.05, 0.25], [24, 0]);
  const chipOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 1, 0]);

  return (
    <PinContainer scrollHeight={1.6} background={C.deep} sectionRef={ref}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: heroScale,
          y: heroY,
          filter: "saturate(0.92) brightness(0.82)",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(11, 26, 43, 0.85) 0%, rgba(11, 26, 43, 0.2) 50%, rgba(11, 26, 43, 0.5) 100%)",
          opacity: vignette,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(11, 26, 43, 0.5) 0%, rgba(11, 26, 43, 0) 25%, rgba(11, 26, 43, 0) 65%, rgba(11, 26, 43, 0.75) 100%)",
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          color: C.frostText,
          fontFamily: FONT_STACK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 50,
              background: C.amber,
              boxShadow: "0 0 16px rgba(199, 126, 66, 0.8)",
            }}
          />
          <span
            style={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              fontSize: 17,
            }}
          >
            Precura
          </span>
        </div>
        <motion.div
          style={{
            opacity: chipOpacity,
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.frostDim,
          }}
        >
          Sweden / 2026
        </motion.div>
      </div>

      {/* Headline */}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: headlineOpacity,
          y: headlineY,
          textAlign: "center",
          width: "min(900px, 88vw)",
          fontFamily: FONT_STACK,
          color: C.frostText,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.amber,
            marginBottom: 24,
          }}
        >
          Predictive health
        </p>
        <h1
          style={{
            fontSize: "clamp(40px, 6.2vw, 88px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Your body has been
          <br />
          telling a story.
        </h1>
        <p
          style={{
            marginTop: 28,
            fontSize: "clamp(15px, 1.25vw, 18px)",
            lineHeight: 1.55,
            color: C.frostDim,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: 400,
          }}
        >
          Precura reads it, five years before your doctor will.
        </p>
      </motion.div>

      <ScrollCue opacity={cueOpacity} />
    </PinContainer>
  );
}

// ---------------------------------------------------------------------------
// STAGE 2 / The quiet drift
// ---------------------------------------------------------------------------

const READINGS = [
  { year: 2021, value: 5.0 },
  { year: 2022, value: 5.2 },
  { year: 2023, value: 5.4 },
  { year: 2024, value: 5.6 },
  { year: 2025, value: 5.8 },
];

function DriftDot({
  index,
  total,
  progress,
  year,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  year: number;
}) {
  const pct = index / (total - 1);
  const start = 0.05 + pct * 0.8 - 0.04;
  const end = 0.05 + pct * 0.8;
  const opacity = useTransform(progress, [start, end], [0.3, 1]);
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: `${pct * 100}%`,
        transform: "translateX(-50%)",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 50,
          background: C.warm,
          marginTop: 12,
          boxShadow: "0 0 18px rgba(232, 220, 196, 0.4)",
        }}
      />
      <span
        style={{
          fontFamily: MONO_STACK,
          fontSize: 11,
          color: C.frostDim,
          letterSpacing: "0.08em",
        }}
      >
        {year}
      </span>
    </motion.div>
  );
}

function StageDrift() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0.8]
  );
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const bgBlur = useTransform(scrollYProgress, [0, 0.5, 1], [10, 2, 0]);
  const bgFilter = useTransform(bgBlur, (v) => `blur(${v}px) saturate(0.85)`);

  const glucose = useTransform(scrollYProgress, [0.05, 0.85], [5.0, 5.8]);
  const glucoseRounded = useTransform(glucose, (v) => v.toFixed(1));

  const year = useTransform(scrollYProgress, [0.05, 0.85], [2021, 2025]);
  const yearRounded = useTransform(year, (v) => Math.round(v).toString());

  const chartOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.85, 1],
    [0, 1, 1, 0.4]
  );
  const chartY = useTransform(scrollYProgress, [0.1, 0.3], [20, 0]);

  const sentenceOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.62, 0.88, 1],
    [0, 1, 1, 0]
  );
  const sentenceY = useTransform(scrollYProgress, [0.5, 0.7], [20, 0]);

  const chapterOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0, 1, 1, 0.5]
  );

  return (
    <PinContainer scrollHeight={3} background={C.forest} sectionRef={ref}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.lab})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: bgOpacity,
          scale: bgScale,
          filter: bgFilter,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(20, 50, 42, 0.85) 0%, rgba(20, 50, 42, 0.65) 50%, rgba(11, 26, 43, 0.95) 100%)",
        }}
      />

      <Chapter index="01" label="The drift" opacity={chapterOpacity} />

      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -62%)",
          opacity: chartOpacity,
          y: chartY,
          color: C.frostText,
          fontFamily: FONT_STACK,
          textAlign: "center",
          width: "min(760px, 90vw)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.frostDim,
            marginBottom: 16,
          }}
        >
          Fasting glucose / Anna B.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <motion.span
            style={{
              fontSize: "clamp(80px, 12vw, 176px)",
              fontWeight: 300,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              fontFamily: MONO_STACK,
              color: C.frostText,
            }}
          >
            {glucoseRounded}
          </motion.span>
          <span
            style={{
              fontSize: "clamp(18px, 1.6vw, 24px)",
              color: C.frostDim,
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            mmol/L
          </span>
        </div>

        {/* Timeline */}
        <div
          style={{
            position: "relative",
            height: 64,
            width: "100%",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(245,241,234,0.3), rgba(199, 126, 66, 0.6))",
            }}
          />
          {READINGS.map((r, i) => (
            <DriftDot
              key={r.year}
              index={i}
              total={READINGS.length}
              progress={scrollYProgress}
              year={r.year}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: C.frostDim,
          }}
        >
          Year <motion.span>{yearRounded}</motion.span> / technically normal
        </div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "14%",
          transform: "translateX(-50%)",
          opacity: sentenceOpacity,
          y: sentenceY,
          width: "min(720px, 88vw)",
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: C.frostText,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "clamp(22px, 2.6vw, 36px)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            margin: 0,
            color: C.frostText,
          }}
        >
          Each test came back fine. Nobody saw the line moving.
        </p>
      </motion.div>
    </PinContainer>
  );
}

// ---------------------------------------------------------------------------
// STAGE 3 / The connection
// ---------------------------------------------------------------------------

function StageConnect() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imgX = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.04]);
  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.85, 1],
    [0, 1, 1, 0.9]
  );

  const panelX = useTransform(scrollYProgress, [0.1, 0.4], ["8%", "0%"]);
  const panelOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.9, 1],
    [0, 1, 1, 0.95]
  );

  const linePath = useTransform(scrollYProgress, [0.3, 0.75], [0, 1]);

  const risk = useTransform(scrollYProgress, [0.3, 0.85], [12, 38]);
  const riskRounded = useTransform(risk, (v) => Math.round(v).toString());

  const sentenceOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.72, 0.92, 1],
    [0, 1, 1, 0.6]
  );
  const sentenceY = useTransform(scrollYProgress, [0.55, 0.72], [18, 0]);

  const chapterOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0, 1, 1, 0.5]
  );

  return (
    <PinContainer scrollHeight={2.8} background={C.paper} sectionRef={ref}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.anna})`,
          backgroundSize: "cover",
          backgroundPosition: "30% center",
          opacity: imgOpacity,
          scale: imgScale,
          x: imgX,
          filter: "saturate(0.95)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(14,14,16,0.15) 0%, rgba(14,14,16,0) 40%, rgba(245, 241, 234, 0.2) 60%, rgba(245, 241, 234, 0.92) 100%)",
        }}
      />

      <Chapter index="02" label="Precura" opacity={chapterOpacity} />

      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          right: "8%",
          transform: "translateY(-50%)",
          width: "min(460px, 44vw)",
          x: panelX,
          opacity: panelOpacity,
          fontFamily: FONT_STACK,
          color: C.ink,
        }}
      >
        <div
          style={{
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.amber,
            marginBottom: 18,
          }}
        >
          10-year prediction
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <motion.span
            style={{
              fontSize: "clamp(90px, 11vw, 156px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              fontWeight: 300,
              fontFamily: MONO_STACK,
              color: C.ink,
            }}
          >
            {riskRounded}
          </motion.span>
          <span
            style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              color: C.dim,
              fontWeight: 300,
            }}
          >
            %
          </span>
        </div>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: C.dim,
            margin: "0 0 26px 0",
            maxWidth: 380,
          }}
        >
          Type 2 diabetes. Modelled from 5 years of labs, family history, and
          lifestyle.
        </p>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: 120,
            borderRadius: 14,
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${C.line}`,
            padding: 18,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: MONO_STACK,
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.faint,
              marginBottom: 8,
            }}
          >
            Your trajectory
          </div>
          <svg
            viewBox="0 0 400 60"
            width="100%"
            height="60"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="h3Line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2C6E6A" />
                <stop offset="60%" stopColor="#C77E42" />
                <stop offset="100%" stopColor="#B33A1D" />
              </linearGradient>
              <linearGradient id="h3Fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(199, 126, 66, 0.22)" />
                <stop offset="100%" stopColor="rgba(199, 126, 66, 0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 48 C 60 46, 120 42, 180 34 S 300 12, 400 6"
              fill="none"
              stroke="url(#h3Line)"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ pathLength: linePath }}
            />
            <motion.path
              d="M 0 48 C 60 46, 120 42, 180 34 S 300 12, 400 6 L 400 60 L 0 60 Z"
              fill="url(#h3Fill)"
              style={{ opacity: linePath }}
            />
          </svg>
        </div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: 40,
          bottom: "14%",
          width: "min(520px, 50vw)",
          opacity: sentenceOpacity,
          y: sentenceY,
          fontFamily: FONT_STACK,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "clamp(22px, 2.4vw, 32px)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            margin: 0,
            color: "#F5F1EA",
            textShadow: "0 2px 24px rgba(11,26,43,0.6)",
          }}
        >
          We connect the dots, so you see the curve before it becomes a
          diagnosis.
        </p>
      </motion.div>
    </PinContainer>
  );
}

// ---------------------------------------------------------------------------
// STAGE 4 / Product reveal
// ---------------------------------------------------------------------------

function StageReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bgSize = useTransform(scrollYProgress, [0, 1], ["110%", "94%"]);
  const bgFilter = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "blur(20px) brightness(0.5)",
      "blur(8px) brightness(0.45)",
      "blur(4px) brightness(0.55)",
    ]
  );

  const cardScale = useTransform(
    scrollYProgress,
    [0.05, 0.4, 0.95],
    [0.88, 1, 1.02]
  );
  const cardY = useTransform(scrollYProgress, [0.05, 0.4], [60, 0]);
  const cardOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.92, 1],
    [0, 1, 1, 0.85]
  );

  const row1 = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const row1y = useTransform(scrollYProgress, [0.35, 0.45], [14, 0]);
  const row2 = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const row2y = useTransform(scrollYProgress, [0.45, 0.55], [14, 0]);
  const row3 = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const row3y = useTransform(scrollYProgress, [0.55, 0.65], [14, 0]);

  const sentenceOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.82, 0.95, 1],
    [0, 1, 1, 0.8]
  );
  const sentenceY = useTransform(scrollYProgress, [0.7, 0.82], [18, 0]);

  const chapterOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0, 1, 1, 0.5]
  );

  return (
    <PinContainer scrollHeight={2.4} background={C.ink} sectionRef={ref}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.life})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: bgSize,
          filter: bgFilter,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 60% at 50% 50%, rgba(14,14,16,0.2) 0%, rgba(14,14,16,0.85) 70%, rgba(14,14,16,0.95) 100%)",
        }}
      />

      <Chapter index="03" label="Your plan" opacity={chapterOpacity} />

      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          scale: cardScale,
          y: cardY,
          opacity: cardOpacity,
          width: "min(560px, 92vw)",
          borderRadius: 28,
          background: "rgba(245, 241, 234, 0.96)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow:
            "0 40px 120px rgba(0, 0, 0, 0.55), 0 2px 0 rgba(255,255,255,0.08) inset",
          padding: "32px 32px 28px 32px",
          fontFamily: FONT_STACK,
          color: C.ink,
          border: `1px solid rgba(255,255,255,0.08)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.faint,
                marginBottom: 6,
              }}
            >
              Precura / dashboard
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Hej, Anna
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              background: `linear-gradient(135deg, ${C.amber}, #8E4A1D)`,
              boxShadow: "0 4px 16px rgba(199, 126, 66, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F5F1EA",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: FONT_STACK,
            }}
          >
            AB
          </div>
        </div>

        <motion.div
          style={{
            opacity: row1,
            y: row1y,
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.7)",
            border: `1px solid ${C.line}`,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.faint,
              }}
            >
              Diabetes risk
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                marginTop: 2,
              }}
            >
              Elevated / 38% in 10y
            </div>
          </div>
          <div
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              color: C.amber,
              fontWeight: 600,
            }}
          >
            +6.0
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: row2,
            y: row2y,
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.7)",
            border: `1px solid ${C.line}`,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.faint,
              }}
            >
              Recommended
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                marginTop: 2,
              }}
            >
              HbA1c retest, after-dinner walks
            </div>
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 50,
              background: C.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F5F1EA",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            /
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: row3,
            y: row3y,
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(44, 110, 106, 0.14)",
            border: `1px solid rgba(44, 110, 106, 0.25)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.teal,
              }}
            >
              Your doctor
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                marginTop: 2,
                color: C.ink,
              }}
            >
              Dr. Johansson reviewed this Tuesday
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "10%",
          transform: "translateX(-50%)",
          width: "min(720px, 88vw)",
          textAlign: "center",
          opacity: sentenceOpacity,
          y: sentenceY,
          fontFamily: FONT_STACK,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "clamp(18px, 1.8vw, 24px)",
            lineHeight: 1.4,
            color: C.frostDim,
            letterSpacing: "-0.01em",
            margin: 0,
            fontWeight: 400,
          }}
        >
          One view. Your labs, your family, your plan. Quiet enough to trust.
        </p>
      </motion.div>
    </PinContainer>
  );
}

// ---------------------------------------------------------------------------
// STAGE 5 / The close
// ---------------------------------------------------------------------------

function StageClose() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.4], [0.6, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [40, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: C.forest,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.forest})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: bgScale,
          opacity: bgOpacity,
          filter: "saturate(0.9) brightness(0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 60% at 50% 50%, rgba(20,50,42,0.55) 0%, rgba(11,26,43,0.85) 70%, rgba(11,26,43,0.95) 100%)",
        }}
      />
      <motion.div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px 80px 40px",
          y: contentY,
          opacity: contentOpacity,
          fontFamily: FONT_STACK,
          color: C.frostText,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.amber,
            marginBottom: 28,
          }}
        >
          Now in Sweden
        </div>
        <h2
          style={{
            fontSize: "clamp(44px, 6.5vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            fontWeight: 500,
            margin: 0,
            maxWidth: 900,
          }}
        >
          Read the story
          <br />
          your body is telling.
        </h2>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 28px",
              borderRadius: 50,
              background: C.paper,
              color: C.ink,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              boxShadow: "0 20px 60px rgba(245, 241, 234, 0.15)",
              fontFamily: FONT_STACK,
            }}
          >
            Start your reading
            <span
              style={{
                fontFamily: MONO_STACK,
                fontSize: 13,
                color: C.amber,
                fontWeight: 500,
              }}
            >
              795 kr/yr
            </span>
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "18px 24px",
              borderRadius: 50,
              background: "transparent",
              color: C.frostText,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              border: "1px solid rgba(245, 241, 234, 0.3)",
              fontFamily: FONT_STACK,
            }}
          >
            How it works
          </motion.a>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            right: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.frostDim,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span>Precura / Stockholm</span>
          <span>FINDRISC / SCORE2 / FRAX</span>
          <span>Reviewed by Swedish doctors</span>
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Global scroll progress bar
// ---------------------------------------------------------------------------

function GlobalProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: C.amber,
        transformOrigin: "0%",
        scaleX,
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Mobile fallback
// ---------------------------------------------------------------------------

function MobileFallback() {
  const stages = [
    {
      img: IMG.hero,
      eyebrow: "Predictive health",
      title: "Your body has been telling a story.",
      body: "Precura reads it, five years before your doctor will.",
      bg: C.deep,
    },
    {
      img: IMG.lab,
      eyebrow: "01 / the drift",
      title: "5.0 / 5.2 / 5.4 / 5.6 / 5.8 mmol/L",
      body:
        "Anna's glucose climbed for five years. Each test came back fine. Nobody saw the line moving.",
      bg: C.forest,
    },
    {
      img: IMG.anna,
      eyebrow: "02 / precura",
      title: "38% / 10-year diabetes risk",
      body:
        "We connect the dots, so you see the curve before it becomes a diagnosis.",
      bg: C.teal,
    },
    {
      img: IMG.life,
      eyebrow: "03 / your plan",
      title: "One view. Your labs, your family, your plan.",
      body: "Quiet enough to trust. Reviewed by your doctor.",
      bg: C.ink,
    },
  ];

  return (
    <div style={{ background: C.forest }}>
      {stages.map((s, i) => (
        <section
          key={i}
          style={{
            position: "relative",
            minHeight: "100vh",
            overflow: "hidden",
            background: s.bg,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${s.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.55) saturate(0.9)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(11,26,43,0.4) 0%, rgba(11,26,43,0) 30%, rgba(11,26,43,0.85) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              minHeight: "100vh",
              padding: "80px 28px 60px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              color: C.frostText,
              fontFamily: FONT_STACK,
            }}
          >
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.amber,
                marginBottom: 16,
              }}
            >
              {s.eyebrow}
            </div>
            <h2
              style={{
                fontSize: 32,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                fontWeight: 500,
                margin: "0 0 16px 0",
              }}
            >
              {s.title}
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.55,
                color: C.frostDim,
                margin: 0,
              }}
            >
              {s.body}
            </p>
          </div>
        </section>
      ))}
      <section
        style={{
          padding: "60px 28px 80px",
          background: C.forest,
          color: C.frostText,
          fontFamily: FONT_STACK,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: 28,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: "0 0 28px 0",
            fontWeight: 500,
          }}
        >
          Read the story your body is telling.
        </h3>
        <a
          href="#"
          style={{
            display: "inline-block",
            padding: "16px 24px",
            borderRadius: 50,
            background: C.paper,
            color: C.ink,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Start your reading / 795 kr/yr
        </a>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function HomeThree() {
  // Single source of truth: null = not yet mounted, boolean = mobile or not.
  // This avoids two separate setState calls in the mount effect.
  const [layout, setLayout] = useState<"pending" | "desktop" | "mobile">(
    "pending"
  );

  useEffect(() => {
    const check = () =>
      setLayout(window.innerWidth < 768 ? "mobile" : "desktop");
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    Object.values(IMG).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  if (layout === "pending") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.deep,
          color: C.frostText,
          fontFamily: FONT_STACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          letterSpacing: "-0.01em",
        }}
      >
        <span style={{ opacity: 0.7 }}>Precura</span>
      </div>
    );
  }

  if (layout === "mobile") {
    return (
      <SmoothScroll>
        <MobileFallback />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <div
        style={{
          background: C.deep,
          color: C.ink,
          fontFamily: FONT_STACK,
          overflow: "hidden",
        }}
      >
        <GlobalProgress />
        <StageHero />
        <StageDrift />
        <StageConnect />
        <StageReveal />
        <StageClose />
      </div>
    </SmoothScroll>
  );
}
