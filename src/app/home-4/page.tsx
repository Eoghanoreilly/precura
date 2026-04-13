"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Circle,
  Heart,
  Activity,
  Brain,
  HelpCircle,
  Sparkles,
} from "lucide-react";

// Local design tokens. Kept inline per sprint rules.
const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO_STACK =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

// Warm Scandinavian pharmacy palette. Not blue, not clinical green.
const COLORS = {
  bg: "#FBF8F3",           // Ivory cream
  bgAlt: "#F5EFE4",        // Warm sand
  bgDark: "#2D4A3C",       // Deep forest
  ink: "#1C2A22",          // Near black with green
  inkMuted: "#5A6B60",     // Muted forest
  inkFaint: "#8C9A91",     // Faint
  line: "#E6DDCC",         // Cream border
  lineDark: "#D6CAB3",     // Stronger cream border
  accent: "#C05E3C",       // Terracotta
  accentSoft: "#F2D9CA",   // Soft terracotta
  accentInk: "#7A2E14",    // Deep terracotta
  amber: "#D4A84B",        // Warm amber
  amberSoft: "#F7EACB",    // Soft amber
  green: "#5F8D6C",        // Sage
  greenSoft: "#DCE8DC",    // Soft sage
  red: "#B44A3A",          // Brick red
  redSoft: "#F3D6CF",      // Soft brick
};

// ---------------------------------------------------------------------------
// Quiz data model
// ---------------------------------------------------------------------------

type AgeRange = "25-34" | "35-44" | "45-54" | "55-64";
type FamilyHistory = "none" | "extended" | "immediate";
type TestingHabit = "never" | "rarely" | "annual" | "tracking";
type WorryArea = "diabetes" | "heart" | "cognitive" | "unknown";

type Answers = {
  age?: AgeRange;
  family?: FamilyHistory;
  testing?: TestingHabit;
  worry?: WorryArea;
};

type QuestionId = "age" | "family" | "testing" | "worry";

const QUESTIONS: {
  id: QuestionId;
  step: number;
  label: string;
  headline: string;
  subline: string;
  options: { value: string; label: string; meta?: string }[];
}[] = [
  {
    id: "age",
    step: 1,
    label: "About you",
    headline: "How old are you?",
    subline:
      "Risk windows are different at 30 than at 60. This helps us frame the picture.",
    options: [
      { value: "25-34", label: "25 to 34" },
      { value: "35-44", label: "35 to 44" },
      { value: "45-54", label: "45 to 54" },
      { value: "55-64", label: "55 to 64" },
    ],
  },
  {
    id: "family",
    step: 2,
    label: "Your history",
    headline: "Any family history of diabetes or heart disease?",
    subline:
      "Your parents and siblings carry a lot of your story. Nothing here is a diagnosis.",
    options: [
      {
        value: "none",
        label: "None that I know of",
        meta: "No close relatives affected",
      },
      {
        value: "extended",
        label: "Extended family",
        meta: "A grandparent, aunt or uncle",
      },
      {
        value: "immediate",
        label: "A parent or sibling",
        meta: "Immediate family",
      },
    ],
  },
  {
    id: "testing",
    step: 3,
    label: "Your habits",
    headline: "How often do you get blood tests?",
    subline:
      "Most Swedes only get tested when something already feels wrong. That is usually too late.",
    options: [
      { value: "never", label: "Almost never" },
      { value: "rarely", label: "Once every few years" },
      { value: "annual", label: "About once a year" },
      { value: "tracking", label: "I track them already" },
    ],
  },
  {
    id: "worry",
    step: 4,
    label: "What matters",
    headline: "What worries you most about your health?",
    subline: "There is no wrong answer. This just tells us what to watch first.",
    options: [
      { value: "diabetes", label: "Diabetes / blood sugar" },
      { value: "heart", label: "Heart and circulation" },
      { value: "cognitive", label: "Brain and memory" },
      { value: "unknown", label: "Not knowing what I cannot see" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Personalization logic
// ---------------------------------------------------------------------------

type Preview = {
  headline: string;
  bodyLine: string;
  primaryWatch: {
    name: string;
    plainName: string;
    trendCopy: string;
    points: number[];
    zone: "watch" | "caution" | "act";
  };
  secondaryWatch: {
    name: string;
    plainName: string;
    note: string;
  };
  tenYearCopy: string;
  ctaLabel: string;
  signature: string;
};

function buildPreview(answers: Required<Answers>): Preview {
  const isOlder = answers.age === "45-54" || answers.age === "55-64";
  const isYoung = answers.age === "25-34";

  const familyWeight =
    answers.family === "immediate" ? 2 : answers.family === "extended" ? 1 : 0;
  const testingWeight =
    answers.testing === "never" ? 2 : answers.testing === "rarely" ? 1 : 0;

  const score = (isOlder ? 2 : isYoung ? 0 : 1) + familyWeight + testingWeight;

  let zone: "watch" | "caution" | "act" = "watch";
  if (score >= 4) zone = "act";
  else if (score >= 2) zone = "caution";

  // Primary watch depends on what they said worries them, with an override
  // for immediate family history (which always pulls it to the matching area).
  let focus: WorryArea = answers.worry;
  if (answers.family === "immediate") {
    // Swedish family history of T2D is a strong signal; we nudge glucose.
    focus = "diabetes";
  }

  const glucoseTrajectory = [5.0, 5.1, 5.2, 5.4, 5.6, 5.8];
  const ldlTrajectory = [2.8, 2.9, 3.0, 3.1, 3.2, 3.3];
  const bpTrajectory = [118, 120, 123, 126, 128, 131];
  const omegaTrajectory = [7.2, 6.8, 6.4, 6.1, 5.9, 5.7];

  let primaryWatch: Preview["primaryWatch"];
  let secondaryWatch: Preview["secondaryWatch"];
  let tenYearCopy = "";
  let bodyLine = "";

  if (focus === "diabetes") {
    primaryWatch = {
      name: "fP-Glucose",
      plainName: "Fasting blood sugar",
      trendCopy:
        "A quiet drift upward. Still inside lab range, but the slope is what tells the story.",
      points: glucoseTrajectory,
      zone,
    };
    secondaryWatch = {
      name: "HbA1c",
      plainName: "3 month blood sugar average",
      note: "Pairs with fasting glucose to confirm the direction.",
    };
    tenYearCopy =
      answers.family === "immediate"
        ? "With immediate family history, 10 year diabetes risk lands in the caution band for most people in your group."
        : "10 year diabetes risk sits in the low to moderate band for your profile.";
    bodyLine =
      answers.family === "immediate"
        ? "You carry a family signal. That does not mean destiny. It means you get a head start if we catch the drift early."
        : "Your worry is a good instinct. The slope of fasting glucose over 5 years is the single most useful line to watch.";
  } else if (focus === "heart") {
    primaryWatch = {
      name: "LDL-C",
      plainName: "LDL cholesterol",
      trendCopy:
        "A gentle rise. LDL is the single strongest lever you have for 10 year cardiovascular risk.",
      points: ldlTrajectory,
      zone,
    };
    secondaryWatch = {
      name: "Systolic BP",
      plainName: "Top blood pressure number",
      note: "Blood pressure tends to climb quietly with LDL. We watch them together.",
    };
    tenYearCopy = isOlder
      ? "SCORE2 tends to find real signal in this age range. 10 year cardiovascular risk is worth quantifying."
      : "SCORE2 gives you a 10 year cardiovascular estimate. At your age it is usually low, but the trajectory matters.";
    bodyLine =
      "Heart risk is mostly a story about LDL and blood pressure over time. Single tests lie. Trends tell the truth.";
  } else if (focus === "cognitive") {
    primaryWatch = {
      name: "Omega-3 Index",
      plainName: "Long chain omega-3 in red blood cells",
      trendCopy:
        "Drifting below the protective band. This one is quiet but it compounds over decades.",
      points: omegaTrajectory,
      zone,
    };
    secondaryWatch = {
      name: "HbA1c",
      plainName: "3 month blood sugar average",
      note: "Brain health shares wiring with blood sugar. We watch both.",
    };
    tenYearCopy =
      "There is no validated 10 year dementia score yet, but the upstream markers are well studied and trackable.";
    bodyLine =
      "The upstream markers for cognitive decline are mostly metabolic. Boring, measurable, and very trackable.";
  } else {
    // unknown / not knowing
    primaryWatch = {
      name: "fP-Glucose",
      plainName: "Fasting blood sugar",
      trendCopy:
        "The most common marker we see drift without anyone noticing. A good first thread to pull.",
      points: glucoseTrajectory,
      zone,
    };
    secondaryWatch = {
      name: "LDL-C",
      plainName: "LDL cholesterol",
      note: "Paired with blood sugar, these two explain most preventable risk in Sweden.",
    };
    tenYearCopy =
      "Your 10 year picture sits in the watchable range. That is exactly where the most impact can be had.";
    bodyLine =
      "Not knowing is the honest answer most people should give. Precura is built for that exact feeling.";
  }

  const ctaLabel =
    zone === "act"
      ? "Get your full risk profile"
      : zone === "caution"
      ? "See your full trajectory"
      : "Start tracking with Precura";

  const signature =
    zone === "act"
      ? "Worth acting on"
      : zone === "caution"
      ? "Worth watching"
      : "Worth tracking";

  return {
    headline: "Here is what we would watch for someone like you",
    bodyLine,
    primaryWatch,
    secondaryWatch,
    tenYearCopy,
    ctaLabel,
    signature,
  };
}

// ---------------------------------------------------------------------------
// Quiz UI
// ---------------------------------------------------------------------------

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "transparent",
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: "100%",
          background: COLORS.accent,
        }}
      />
    </div>
  );
}

function StepDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current - 1;
        return (
          <div
            key={i}
            style={{
              width: active ? 22 : 6,
              height: 6,
              borderRadius: 4,
              background: done || active ? COLORS.accent : COLORS.lineDark,
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        );
      })}
    </div>
  );
}

function QuestionCard({
  question,
  selected,
  onSelect,
  onBack,
  canBack,
}: {
  question: (typeof QUESTIONS)[number];
  selected: string | undefined;
  onSelect: (value: string) => void;
  onBack: () => void;
  canBack: boolean;
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        maxWidth: 640,
      }}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.accent,
              fontWeight: 600,
            }}
          >
            {String(question.step).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.inkFaint,
              fontWeight: 500,
            }}
          >
            {question.label}
          </span>
        </div>
        <StepDots current={question.step} total={QUESTIONS.length} />
      </div>

      <h2
        style={{
          fontFamily: FONT_STACK,
          fontSize: "clamp(30px, 5vw, 46px)",
          fontWeight: 500,
          color: COLORS.ink,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {question.headline}
      </h2>
      <p
        style={{
          fontFamily: FONT_STACK,
          fontSize: 17,
          color: COLORS.inkMuted,
          lineHeight: 1.55,
          marginBottom: 40,
          maxWidth: 520,
        }}
      >
        {question.subline}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.15 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.985 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 26px",
                borderRadius: 18,
                background: isSelected ? COLORS.accentSoft : "#FFFFFF",
                border: `1px solid ${
                  isSelected ? COLORS.accent : COLORS.line
                }`,
                boxShadow: isSelected
                  ? `0 8px 24px ${COLORS.accentSoft}`
                  : "0 1px 2px rgba(28, 42, 34, 0.04)",
                cursor: "pointer",
                fontFamily: FONT_STACK,
                textAlign: "left",
                width: "100%",
                transition:
                  "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <div className="flex flex-col">
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: COLORS.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {opt.label}
                </span>
                {opt.meta && (
                  <span
                    style={{
                      fontSize: 13,
                      color: COLORS.inkFaint,
                      marginTop: 3,
                    }}
                  >
                    {opt.meta}
                  </span>
                )}
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 50,
                  background: isSelected ? COLORS.accent : "transparent",
                  border: `1.5px solid ${
                    isSelected ? COLORS.accent : COLORS.lineDark
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginLeft: 16,
                  transition: "all 0.3s ease",
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Check size={15} strokeWidth={3} color="#FFFFFF" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {canBack && (
        <div className="mt-8">
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              padding: "6px 2px",
              color: COLORS.inkMuted,
              fontSize: 14,
              fontFamily: FONT_STACK,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Trajectory sparkline (hand drawn feel)
// ---------------------------------------------------------------------------

function Trajectory({
  points,
  zone,
}: {
  points: number[];
  zone: "watch" | "caution" | "act";
}) {
  const w = 420;
  const h = 140;
  const pad = 20;

  const min = Math.min(...points) - 0.25;
  const max = Math.max(...points) + 0.25;

  const coords = points.map((v, i) => ({
    x: pad + (i / (points.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / (max - min)) * (h - pad * 2),
  }));

  const path = coords
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const areaPath =
    coords
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ") + ` L ${coords[coords.length - 1].x} ${h - pad} L ${coords[0].x} ${h - pad} Z`;

  const last = coords[coords.length - 1];

  const stroke =
    zone === "act" ? COLORS.red : zone === "caution" ? COLORS.accent : COLORS.green;
  const fill =
    zone === "act"
      ? COLORS.redSoft
      : zone === "caution"
      ? COLORS.accentSoft
      : COLORS.greenSoft;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.8" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid ticks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={pad}
          x2={w - pad}
          y1={pad + (i * (h - pad * 2)) / 4}
          y2={pad + (i * (h - pad * 2)) / 4}
          stroke={COLORS.line}
          strokeWidth={1}
          strokeDasharray="2 4"
          opacity={0.6}
        />
      ))}

      <motion.path
        d={areaPath}
        fill="url(#areaFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      {coords.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === coords.length - 1 ? 5 : 2.5}
          fill={i === coords.length - 1 ? stroke : "#FFFFFF"}
          stroke={stroke}
          strokeWidth={i === coords.length - 1 ? 0 : 1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
        />
      ))}

      {/* Year labels */}
      {["2021", "2022", "2023", "2024", "2025", "2026"].map((yr, i) => (
        <text
          key={yr}
          x={coords[i].x}
          y={h - 4}
          textAnchor="middle"
          style={{
            fontFamily: MONO_STACK,
            fontSize: 9,
            fill: COLORS.inkFaint,
            letterSpacing: "0.05em",
          }}
        >
          {yr}
        </text>
      ))}

      {/* Current marker label */}
      <text
        x={last.x - 6}
        y={last.y - 10}
        textAnchor="end"
        style={{
          fontFamily: MONO_STACK,
          fontSize: 10,
          fill: stroke,
          fontWeight: 600,
        }}
      >
        now
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Preview (post quiz) panel
// ---------------------------------------------------------------------------

function PreviewPanel({
  answers,
  onRestart,
}: {
  answers: Required<Answers>;
  onRestart: () => void;
}) {
  const preview = useMemo(() => buildPreview(answers), [answers]);

  const zoneBg =
    preview.primaryWatch.zone === "act"
      ? COLORS.redSoft
      : preview.primaryWatch.zone === "caution"
      ? COLORS.amberSoft
      : COLORS.greenSoft;
  const zoneInk =
    preview.primaryWatch.zone === "act"
      ? COLORS.red
      : preview.primaryWatch.zone === "caution"
      ? "#8A5A00"
      : "#2F5C3C";

  const worryIcon =
    answers.worry === "diabetes" ? (
      <Activity size={16} />
    ) : answers.worry === "heart" ? (
      <Heart size={16} />
    ) : answers.worry === "cognitive" ? (
      <Brain size={16} />
    ) : (
      <HelpCircle size={16} />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        maxWidth: 1040,
        fontFamily: FONT_STACK,
      }}
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={14} color={COLORS.accent} />
        <span
          style={{
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: COLORS.accent,
            fontWeight: 600,
          }}
        >
          Based on your answers
        </span>
      </div>

      <h2
        style={{
          fontSize: "clamp(32px, 5.2vw, 54px)",
          fontWeight: 500,
          color: COLORS.ink,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
          marginBottom: 24,
          maxWidth: 820,
        }}
      >
        {preview.headline}
      </h2>
      <p
        style={{
          fontSize: 20,
          color: COLORS.inkMuted,
          lineHeight: 1.55,
          maxWidth: 680,
          marginBottom: 48,
        }}
      >
        {preview.bodyLine}
      </p>

      {/* Main card - the "dossier" */}
      <div
        style={{
          borderRadius: 28,
          background: "#FFFFFF",
          border: `1px solid ${COLORS.line}`,
          boxShadow: "0 24px 60px rgba(28, 42, 34, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Dossier header strip */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "18px 28px",
            borderBottom: `1px solid ${COLORS.line}`,
            background: COLORS.bgAlt,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.accent,
                border: `1px solid ${COLORS.line}`,
              }}
            >
              {worryIcon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: COLORS.inkFaint,
                }}
              >
                Profile
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: COLORS.ink,
                }}
              >
                Age {answers.age} / {profileLabel(answers)}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 50,
              background: zoneBg,
              color: zoneInk,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {preview.signature}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 0,
          }}
          className="md:grid-cols-2"
        >
          {/* Left: trajectory */}
          <div
            style={{
              padding: "32px 28px",
              borderRight: `1px solid ${COLORS.line}`,
            }}
            className="border-b md:border-b-0"
          >
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.inkFaint,
                marginBottom: 6,
              }}
            >
              Primary watch
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: COLORS.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                {preview.primaryWatch.plainName}
              </h3>
            </div>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 12,
                color: COLORS.inkFaint,
                marginBottom: 16,
              }}
            >
              {preview.primaryWatch.name}
            </div>
            <div style={{ margin: "8px -4px 16px" }}>
              <Trajectory
                points={preview.primaryWatch.points}
                zone={preview.primaryWatch.zone}
              />
            </div>
            <p
              style={{
                fontSize: 15,
                color: COLORS.inkMuted,
                lineHeight: 1.55,
              }}
            >
              {preview.primaryWatch.trendCopy}
            </p>
          </div>

          {/* Right: secondary + 10 year */}
          <div style={{ padding: "32px 28px" }}>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.inkFaint,
                marginBottom: 6,
              }}
            >
              Pair with
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: COLORS.ink,
                letterSpacing: "-0.02em",
                marginBottom: 2,
              }}
            >
              {preview.secondaryWatch.plainName}
            </h3>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 12,
                color: COLORS.inkFaint,
                marginBottom: 12,
              }}
            >
              {preview.secondaryWatch.name}
            </div>
            <p
              style={{
                fontSize: 14,
                color: COLORS.inkMuted,
                lineHeight: 1.55,
                marginBottom: 28,
                paddingBottom: 28,
                borderBottom: `1px dashed ${COLORS.lineDark}`,
              }}
            >
              {preview.secondaryWatch.note}
            </p>

            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.inkFaint,
                marginBottom: 6,
              }}
            >
              10 year outlook
            </div>
            <p
              style={{
                fontSize: 15,
                color: COLORS.ink,
                lineHeight: 1.55,
                marginBottom: 20,
              }}
            >
              {preview.tenYearCopy}
            </p>

            <div
              style={{
                fontSize: 12,
                color: COLORS.inkFaint,
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              Mock preview. Your real profile uses validated models: FINDRISC
              for diabetes, SCORE2 for cardiovascular, FRAX for bone.
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div
          style={{
            padding: "26px 28px",
            borderTop: `1px solid ${COLORS.line}`,
            background: COLORS.bgAlt,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: COLORS.ink,
                marginBottom: 2,
              }}
            >
              Ready to see the real version?
            </div>
            <div style={{ fontSize: 13, color: COLORS.inkMuted }}>
              Upload a blood test, answer a few questions, keep the result.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onRestart}
              style={{
                padding: "14px 22px",
                background: "transparent",
                color: COLORS.ink,
                border: `1px solid ${COLORS.lineDark}`,
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: FONT_STACK,
              }}
            >
              Answer again
            </button>
            <button
              style={{
                padding: "14px 26px",
                background: COLORS.accent,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT_STACK,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: `0 10px 24px ${COLORS.accentSoft}`,
              }}
            >
              {preview.ctaLabel}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function profileLabel(answers: Required<Answers>) {
  const worryMap: Record<WorryArea, string> = {
    diabetes: "focused on blood sugar",
    heart: "focused on heart",
    cognitive: "focused on brain",
    unknown: "wants the full picture",
  };
  return worryMap[answers.worry];
}

// ---------------------------------------------------------------------------
// How it works section
// ---------------------------------------------------------------------------

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pull 5 years of blood work",
      body:
        "From Werlabs, 1177, or your own PDFs. We parse the numbers you already paid for and never looked at again.",
    },
    {
      number: "02",
      title: "Run validated risk models",
      body:
        "FINDRISC for diabetes. SCORE2 for cardiovascular. FRAX for bone. No hand-wavy AI scores. The same models your GP uses.",
    },
    {
      number: "03",
      title: "See the trajectory in plain Swedish",
      body:
        "A doctor's note on every result. No jargon. No fear mongering. Just the lines you should be watching and why.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px 100px",
        background: COLORS.bg,
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6">
          <div style={{ maxWidth: 560 }}>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLORS.accent,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              How it works
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4.5vw, 46px)",
                fontWeight: 500,
                color: COLORS.ink,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              Your data, connected.
              <br />
              For the first time.
            </h2>
          </div>
          <div
            style={{
              maxWidth: 380,
              fontSize: 16,
              color: COLORS.inkMuted,
              lineHeight: 1.55,
            }}
          >
            Around half the Swedes who develop type 2 diabetes go undiagnosed
            for years. The data existed. No doctor saw the full picture.
            Precura connects the dots.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 16,
          }}
          className="md:grid-cols-3"
        >
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: "#FFFFFF",
                borderRadius: 22,
                padding: "32px 28px",
                border: `1px solid ${COLORS.line}`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 13,
                  color: COLORS.accent,
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                {step.number}
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: COLORS.ink,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: COLORS.inkMuted,
                  lineHeight: 1.55,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Anna story section (the lead example, calm & editorial)
// ---------------------------------------------------------------------------

function AnnaStory() {
  return (
    <section
      style={{
        padding: "100px 24px",
        background: COLORS.bgDark,
        color: "#FFFFFF",
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 48,
            alignItems: "center",
          }}
          className="md:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLORS.amber,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              The story we keep seeing
            </div>
            <h2
              style={{
                fontSize: "clamp(30px, 4.3vw, 44px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                marginBottom: 24,
              }}
            >
              Anna, 40. Fasting glucose went from 5.0 to 5.8 over 5 years.
              Every test said normal.
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.6,
                marginBottom: 20,
                maxWidth: 540,
              }}
            >
              Her mother was diagnosed with type 2 diabetes at 58. Her father
              had a heart attack at 65. None of that made it into any single
              blood test. Nobody connected the 5 year slope.
            </p>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.6,
                maxWidth: 540,
              }}
            >
              Anna is not sick. She is exactly the person a predictive health
              platform is built for. That is what Precura looks at, and what
              your profile will look like too.
            </p>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 22,
              padding: "28px 24px",
              color: COLORS.ink,
              boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div
                  style={{
                    fontFamily: MONO_STACK,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: COLORS.inkFaint,
                  }}
                >
                  Anna Bergstrom
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: COLORS.ink,
                  }}
                >
                  Fasting glucose, 2021-2026
                </div>
              </div>
              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 50,
                  background: COLORS.accentSoft,
                  color: COLORS.accentInk,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                +0.8 mmol/L
              </div>
            </div>
            <Trajectory points={[5.0, 5.1, 5.2, 5.4, 5.6, 5.8]} zone="caution" />
            <div
              style={{
                marginTop: 18,
                padding: "14px 16px",
                background: COLORS.bgAlt,
                borderRadius: 14,
                fontSize: 13,
                color: COLORS.inkMuted,
                lineHeight: 1.5,
              }}
            >
              Every test alone: <strong style={{ color: COLORS.ink }}>normal</strong>.
              The slope: a warning.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing section
// ---------------------------------------------------------------------------

function Pricing() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: COLORS.bg,
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="text-center mb-16">
          <div
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: COLORS.accent,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Pricing
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 4.5vw, 44px)",
              fontWeight: 500,
              color: COLORS.ink,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            One price. Everything included.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: COLORS.inkMuted,
              lineHeight: 1.55,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            No tiers. No upsells in the journey. Built for the person who has
            been meaning to take this seriously.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 28,
            border: `1px solid ${COLORS.line}`,
            padding: "40px 36px",
            boxShadow: "0 24px 60px rgba(28, 42, 34, 0.06)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
            <div>
              <div
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: COLORS.inkFaint,
                  marginBottom: 6,
                }}
              >
                Precura annual
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  style={{
                    fontSize: 52,
                    fontWeight: 500,
                    color: COLORS.ink,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  1 490 kr
                </span>
                <span
                  style={{
                    fontSize: 15,
                    color: COLORS.inkMuted,
                  }}
                >
                  / year
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: COLORS.inkMuted,
                  maxWidth: 380,
                  lineHeight: 1.55,
                }}
              >
                Roughly the cost of 3 cinema tickets. Less than most Swedes
                spend on coffee in a month.
              </p>
            </div>

            <button
              style={{
                padding: "16px 28px",
                background: COLORS.ink,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT_STACK,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                alignSelf: "flex-start",
              }}
            >
              Start with Precura
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              borderTop: `1px solid ${COLORS.line}`,
              paddingTop: 28,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: 16,
            }}
            className="sm:grid-cols-2"
          >
            {[
              "2 blood tests per year (FINDRISC, SCORE2, FRAX panel)",
              "Full 10 year risk profile in plain Swedish",
              "Doctor reviewed results with a written note",
              "Training plan tuned to your risk markers",
              "Free secure messaging with a licensed GP",
              "Cancel anytime. Your data stays exportable.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3"
                style={{
                  fontSize: 14,
                  color: COLORS.ink,
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 50,
                    background: COLORS.greenSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Check size={11} color={COLORS.green} strokeWidth={3} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer
      style={{
        padding: "60px 24px 48px",
        background: COLORS.bgAlt,
        borderTop: `1px solid ${COLORS.line}`,
        fontFamily: FONT_STACK,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 32,
          alignItems: "flex-start",
        }}
        className="md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]"
      >
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.ink,
              letterSpacing: "-0.01em",
              marginBottom: 10,
            }}
          >
            Precura
          </div>
          <p
            style={{
              fontSize: 13,
              color: COLORS.inkMuted,
              lineHeight: 1.55,
              maxWidth: 300,
            }}
          >
            Predictive health, built in Sweden. Not a diagnosis. Not a
            replacement for your doctor. A way to actually see your trajectory.
          </p>
        </div>

        {[
          { title: "Product", items: ["How it works", "Pricing", "FAQ"] },
          { title: "Company", items: ["About", "Medical team", "Careers"] },
          { title: "Legal", items: ["Privacy", "Terms", "Data export"] },
        ].map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLORS.inkFaint,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              {col.title}
            </div>
            <div className="flex flex-col gap-2">
              {col.items.map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: 14,
                    color: COLORS.ink,
                    textDecoration: "none",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1120,
          margin: "48px auto 0",
          paddingTop: 24,
          borderTop: `1px solid ${COLORS.line}`,
          fontSize: 12,
          color: COLORS.inkFaint,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>Precura AB / Stockholm, Sweden</span>
        <span>CE marked medical device Class I / In development</span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Home4Page() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const currentQuestion = QUESTIONS[stepIndex];

  const handleSelect = (value: string) => {
    const next: Answers = { ...answers };
    if (currentQuestion.id === "age") next.age = value as AgeRange;
    if (currentQuestion.id === "family") next.family = value as FamilyHistory;
    if (currentQuestion.id === "testing") next.testing = value as TestingHabit;
    if (currentQuestion.id === "worry") next.worry = value as WorryArea;
    setAnswers(next);

    // Auto-advance with a gentle delay so the selection animation is visible.
    setTimeout(() => {
      if (stepIndex < QUESTIONS.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        setDone(true);
      }
    }, 420);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
    setDone(false);
  };

  const selectedValue =
    currentQuestion.id === "age"
      ? answers.age
      : currentQuestion.id === "family"
      ? answers.family
      : currentQuestion.id === "testing"
      ? answers.testing
      : answers.worry;

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        fontFamily: FONT_STACK,
        color: COLORS.ink,
      }}
    >
      <ProgressBar
        current={done ? QUESTIONS.length : stepIndex + (selectedValue ? 1 : 0)}
        total={QUESTIONS.length}
      />

      {/* Top nav */}
      <nav
        style={{
          position: "relative",
          padding: "22px 24px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1120,
          margin: "0 auto",
          fontFamily: FONT_STACK,
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: COLORS.ink,
            letterSpacing: "-0.01em",
          }}
        >
          Precura
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#how"
            style={{
              fontSize: 13,
              color: COLORS.inkMuted,
              textDecoration: "none",
            }}
          >
            How it works
          </a>
          <a
            href="#pricing"
            style={{
              fontSize: 13,
              color: COLORS.inkMuted,
              textDecoration: "none",
            }}
          >
            Pricing
          </a>
          <a
            href="#"
            style={{
              fontSize: 13,
              color: COLORS.ink,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Log in
          </a>
        </div>
      </nav>

      {/* Hero / Quiz */}
      <section
        style={{
          padding: "80px 24px 120px",
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Quiz intro line above the card (pre-first question only) */}
        {!done && stepIndex === 0 && !selectedValue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              top: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: 640,
              width: "100%",
              padding: "0 24px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: MONO_STACK,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: COLORS.inkFaint,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Precura / 4 quick questions / 45 seconds
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!done ? (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selected={selectedValue}
              onSelect={handleSelect}
              onBack={handleBack}
              canBack={stepIndex > 0}
            />
          ) : (
            <PreviewPanel
              key="preview"
              answers={answers as Required<Answers>}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </section>

      {/* Indicator strip when quiz is done */}
      {done && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 24px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: COLORS.inkFaint,
              fontSize: 13,
              fontFamily: FONT_STACK,
            }}
          >
            <Circle size={6} fill={COLORS.inkFaint} />
            Keep scrolling to see how it works
            <Circle size={6} fill={COLORS.inkFaint} />
          </div>
        </div>
      )}

      <div id="how">
        <HowItWorks />
      </div>
      <AnnaStory />
      <div id="pricing">
        <Pricing />
      </div>

      <Footer />
    </div>
  );
}
