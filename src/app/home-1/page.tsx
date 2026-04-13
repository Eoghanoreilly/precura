"use client";

/**
 * home-1 / The Data Story
 *
 * A scroll-scrubbed data narrative: Anna Bergstrom's 5-year glucose story,
 * plotted live as the visitor scrolls through the hero. No centered headline
 * with a button. The chart IS the argument.
 *
 * Inspiration: Stripe /numbers, Pudding, Bloomberg interactive.
 */

import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import {
  BLOOD_TEST_HISTORY,
  FAMILY_HISTORY,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ---------------------------------------------------------------------------
// Palette (inline, no CSS vars)
// ---------------------------------------------------------------------------

const C = {
  // warm, paper-like base
  paper: "#F6F1E8",
  paperDeep: "#EFE7D6",
  ink: "#1A1613",
  inkSoft: "#5A524A",
  inkFaint: "#8B8278",
  rule: "#D9CFBC",
  // signal colors (accent is an oxidized oxblood, very un-AI)
  ox: "#8A2B17",
  oxSoft: "#C24A2E",
  amber: "#C8811A",
  sage: "#4E7A47",
  sageSoft: "#93B085",
  // zones
  zoneNormal: "rgba(147, 176, 133, 0.16)",
  zoneBorder: "rgba(200, 129, 26, 0.18)",
  zoneRisk: "rgba(138, 43, 23, 0.20)",
};

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const FONT_MONO =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

// ---------------------------------------------------------------------------
// Data prep (real patient data, computed once)
// ---------------------------------------------------------------------------

type Point = {
  date: string;
  year: number;
  label: string;
  value: number;
  status: "normal" | "borderline";
};

function prepGlucose(): Point[] {
  const raw = getMarkerHistory("f-Glucose");
  return raw.map((r) => {
    const d = new Date(r.date);
    const year = d.getFullYear();
    return {
      date: r.date,
      year,
      label: String(year),
      value: r.value,
      status: r.value >= 5.6 ? "borderline" : "normal",
    };
  });
}

// ---------------------------------------------------------------------------
// Scroll-scrubbed glucose chart
// ---------------------------------------------------------------------------

type HeroChartProps = {
  progress: MotionValue<number>;
};

function HeroChart({ progress }: HeroChartProps) {
  const data = useMemo(() => prepGlucose(), []);

  // Chart geometry
  const W = 1200;
  const H = 620;
  const padL = 110;
  const padR = 140;
  const padT = 100;
  const padB = 120;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Y axis: 4.6 -> 6.2 mmol/L
  const yMin = 4.6;
  const yMax = 6.2;
  const threshold = 6.0; // clinical borderline

  const xOf = (i: number) => padL + (i / (data.length - 1)) * plotW;
  const yOf = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  // Points
  const points = data.map((d, i) => ({ ...d, x: xOf(i), y: yOf(d.value) }));

  // Build the full path
  const fullPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Progress-driven visibility: each point appears across a slice of scroll
  // Progress runs 0 -> 1 across the entire pinned hero
  // Segments:
  //   0.00 - 0.10  axes + first point land
  //   0.10 - 0.55  line plots across years
  //   0.55 - 0.70  threshold + annotations appear
  //   0.70 - 0.85  family history bubbles connect
  //   0.85 - 1.00  final reveal

  // Line draw progress 0..1
  const lineDraw = useTransform(progress, [0.08, 0.58], [0, 1]);
  const lineDrawSpring = useSpring(lineDraw, { stiffness: 80, damping: 20 });

  // Axis fade-in
  const axisOpacity = useTransform(progress, [0.0, 0.08], [0, 1]);

  // Title fade-out as we plot
  const titleOpacity = useTransform(progress, [0.0, 0.12, 0.22], [1, 1, 0]);
  const titleY = useTransform(progress, [0.0, 0.22], [0, -40]);

  // Per-point opacity (6 fixed hook calls - stable across renders)
  const p0 = useTransform(progress, [0.10, 0.14], [0, 1]);
  const p1 = useTransform(progress, [0.175, 0.215], [0, 1]);
  const p2 = useTransform(progress, [0.25, 0.29], [0, 1]);
  const p3 = useTransform(progress, [0.325, 0.365], [0, 1]);
  const p4 = useTransform(progress, [0.4, 0.44], [0, 1]);
  const p5 = useTransform(progress, [0.48, 0.56], [0, 1]);
  const pointOps: MotionValue<number>[] = [p0, p1, p2, p3, p4, p5];

  // Per-annotation slide
  const ann1Op = useTransform(progress, [0.12, 0.18], [0, 1]);
  const ann1Y = useTransform(progress, [0.12, 0.18], [12, 0]);
  const ann2Op = useTransform(progress, [0.28, 0.34], [0, 1]);
  const ann2Y = useTransform(progress, [0.28, 0.34], [12, 0]);
  const ann3Op = useTransform(progress, [0.44, 0.50], [0, 1]);
  const ann3Y = useTransform(progress, [0.44, 0.50], [12, 0]);
  const ann4Op = useTransform(progress, [0.56, 0.62], [0, 1]);
  const ann4Y = useTransform(progress, [0.56, 0.62], [12, 0]);

  // Threshold line
  const threshOp = useTransform(progress, [0.60, 0.68], [0, 1]);
  const threshDash = useTransform(progress, [0.60, 0.72], [0, 1]);

  // Background zone tint (sage -> amber)
  const zoneTint = useTransform(progress, [0.2, 0.7], [0, 1]);
  const zoneBg = useTransform(
    zoneTint,
    [0, 1],
    ["rgba(147, 176, 133, 0.10)", "rgba(200, 129, 26, 0.18)"]
  );

  // Family history bubbles
  const famOp = useTransform(progress, [0.70, 0.80], [0, 1]);
  const famY = useTransform(progress, [0.70, 0.80], [20, 0]);

  // Connector lines from point to family bubble
  const connOp = useTransform(progress, [0.76, 0.84], [0, 1]);

  // Final reveal
  const revealOp = useTransform(progress, [0.86, 0.96], [0, 1]);
  const revealY = useTransform(progress, [0.86, 0.96], [24, 0]);

  // X-axis year labels (always visible from axis onward)
  const labelOp = useTransform(progress, [0.04, 0.12], [0, 1]);

  // Final point pulse
  const lastPointScale = useTransform(progress, [0.56, 0.66], [1, 1.35]);

  // For stroke-dash line animation we compute an approximate length
  const approxLen = 2600;
  const dashOffset = useTransform(lineDrawSpring, [0, 1], [approxLen, 0]);

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", maxHeight: "82vh" }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.sage} />
          <stop offset="40%" stopColor={C.sage} />
          <stop offset="70%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.ox} />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.ox} stopOpacity="0.14" />
          <stop offset="100%" stopColor={C.ox} stopOpacity="0" />
        </linearGradient>
        <filter id="paper" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      {/* Plot background zones - tint shifts */}
      <motion.rect
        x={padL}
        y={padT}
        width={plotW}
        height={plotH}
        fill={zoneBg}
        rx={2}
      />

      {/* Horizontal gridlines */}
      <motion.g style={{ opacity: axisOpacity }}>
        {[4.8, 5.0, 5.2, 5.4, 5.6, 5.8, 6.0].map((v) => (
          <g key={v}>
            <line
              x1={padL}
              y1={yOf(v)}
              x2={padL + plotW}
              y2={yOf(v)}
              stroke={C.rule}
              strokeWidth={1}
              strokeDasharray="2 6"
              opacity={v === 6.0 ? 0 : 0.6}
            />
            <text
              x={padL - 14}
              y={yOf(v) + 4}
              fontFamily={FONT_MONO}
              fontSize={13}
              fill={C.inkFaint}
              textAnchor="end"
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        <text
          x={padL - 14}
          y={padT - 30}
          fontFamily={FONT_MONO}
          fontSize={11}
          fill={C.inkFaint}
          textAnchor="end"
          letterSpacing="0.08em"
        >
          mmol/L
        </text>
      </motion.g>

      {/* Threshold line (appears late) */}
      <motion.g style={{ opacity: threshOp }}>
        <motion.line
          x1={padL}
          y1={yOf(threshold)}
          x2={padL + plotW}
          y2={yOf(threshold)}
          stroke={C.ox}
          strokeWidth={1.4}
          strokeDasharray="6 6"
          style={{ pathLength: threshDash }}
        />
        <text
          x={padL + plotW + 14}
          y={yOf(threshold) - 6}
          fontFamily={FONT_MONO}
          fontSize={11}
          fill={C.ox}
          letterSpacing="0.05em"
        >
          CLINICAL BORDERLINE
        </text>
        <text
          x={padL + plotW + 14}
          y={yOf(threshold) + 10}
          fontFamily={FONT}
          fontSize={12}
          fill={C.inkSoft}
        >
          6.0 mmol/L
        </text>
      </motion.g>

      {/* Reference: diabetic threshold note (static text, low key) */}
      <motion.text
        x={padL + plotW + 14}
        y={padT + 30}
        fontFamily={FONT_MONO}
        fontSize={10}
        fill={C.inkFaint}
        letterSpacing="0.05em"
        style={{ opacity: axisOpacity }}
      >
        REF: T2D / 7.0+
      </motion.text>

      {/* Title overlaid inside the plot (fades out as chart fills) */}
      <motion.g style={{ opacity: titleOpacity, y: titleY }}>
        <text
          x={padL + 10}
          y={padT + 54}
          fontFamily={FONT}
          fontSize={44}
          fontWeight={600}
          fill={C.ink}
          letterSpacing="-0.02em"
        >
          Anna, 40. Stockholm.
        </text>
        <text
          x={padL + 10}
          y={padT + 92}
          fontFamily={FONT}
          fontSize={18}
          fill={C.inkSoft}
        >
          Five years of fasting glucose, plotted honestly.
        </text>
      </motion.g>

      {/* Area under curve (draws with line) */}
      <motion.path
        d={`${fullPath} L ${points[points.length - 1].x} ${padT + plotH} L ${points[0].x} ${padT + plotH} Z`}
        fill="url(#areaGrad)"
        style={{ opacity: lineDrawSpring }}
      />

      {/* The line itself - animated via stroke-dasharray */}
      <motion.path
        d={fullPath}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: approxLen,
          strokeDashoffset: dashOffset,
        }}
      />

      {/* Points */}
      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        return (
          <motion.g key={p.date} style={{ opacity: pointOps[i] }}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 7 : 5}
              fill={C.paper}
              stroke={isLast ? C.ox : p.status === "borderline" ? C.amber : C.sage}
              strokeWidth={2.6}
            />
            {isLast && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={7}
                fill="none"
                stroke={C.ox}
                strokeWidth={1.2}
                style={{ scale: lastPointScale, transformOrigin: `${p.x}px ${p.y}px`, opacity: 0.45 }}
              />
            )}
            {/* Year label below */}
            <motion.text
              x={p.x}
              y={padT + plotH + 32}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={12}
              fill={C.inkSoft}
              letterSpacing="0.08em"
              style={{ opacity: labelOp }}
            >
              {p.label}
            </motion.text>
            {/* Value above point (small) */}
            <motion.text
              x={p.x}
              y={p.y - 16}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={12}
              fontWeight={600}
              fill={isLast ? C.ox : C.inkSoft}
            >
              {p.value.toFixed(1)}
            </motion.text>
          </motion.g>
        );
      })}

      {/* Annotation: 2021 */}
      <motion.g style={{ opacity: ann1Op, y: ann1Y }}>
        <rect
          x={points[0].x - 8}
          y={points[0].y + 24}
          width={220}
          height={54}
          rx={4}
          fill={C.paper}
          stroke={C.rule}
          strokeWidth={1}
        />
        <text
          x={points[0].x + 4}
          y={points[0].y + 44}
          fontFamily={FONT_MONO}
          fontSize={10}
          fill={C.sage}
          letterSpacing="0.1em"
        >
          2021 / NORMAL
        </text>
        <text
          x={points[0].x + 4}
          y={points[0].y + 64}
          fontFamily={FONT}
          fontSize={13}
          fill={C.ink}
        >
          Dr. says: no concerns.
        </text>
      </motion.g>

      {/* Annotation: 2023 mid */}
      <motion.g style={{ opacity: ann2Op, y: ann2Y }}>
        <rect
          x={points[2].x - 110}
          y={points[2].y - 92}
          width={220}
          height={54}
          rx={4}
          fill={C.paper}
          stroke={C.rule}
          strokeWidth={1}
        />
        <text
          x={points[2].x - 98}
          y={points[2].y - 72}
          fontFamily={FONT_MONO}
          fontSize={10}
          fill={C.sage}
          letterSpacing="0.1em"
        >
          2023 / STILL NORMAL
        </text>
        <text
          x={points[2].x - 98}
          y={points[2].y - 52}
          fontFamily={FONT}
          fontSize={13}
          fill={C.ink}
        >
          Dr. says: nothing flagged.
        </text>
      </motion.g>

      {/* Annotation: 2025 */}
      <motion.g style={{ opacity: ann3Op, y: ann3Y }}>
        <rect
          x={points[4].x - 110}
          y={points[4].y - 92}
          width={230}
          height={54}
          rx={4}
          fill={C.paper}
          stroke={C.rule}
          strokeWidth={1}
        />
        <text
          x={points[4].x - 98}
          y={points[4].y - 72}
          fontFamily={FONT_MONO}
          fontSize={10}
          fill={C.amber}
          letterSpacing="0.1em"
        >
          2025 / STILL NORMAL
        </text>
        <text
          x={points[4].x - 98}
          y={points[4].y - 52}
          fontFamily={FONT}
          fontSize={13}
          fill={C.ink}
        >
          New GP. Sees only this year.
        </text>
      </motion.g>

      {/* Annotation: 2026 - the pivot */}
      <motion.g style={{ opacity: ann4Op, y: ann4Y }}>
        <rect
          x={points[5].x - 250}
          y={points[5].y + 22}
          width={260}
          height={72}
          rx={4}
          fill={C.paper}
          stroke={C.ox}
          strokeWidth={1.4}
        />
        <text
          x={points[5].x - 238}
          y={points[5].y + 44}
          fontFamily={FONT_MONO}
          fontSize={10}
          fill={C.ox}
          letterSpacing="0.1em"
        >
          2026 / TECHNICALLY NORMAL
        </text>
        <text
          x={points[5].x - 238}
          y={points[5].y + 64}
          fontFamily={FONT}
          fontSize={14}
          fontWeight={600}
          fill={C.ink}
        >
          5.8 mmol/L. But the trend.
        </text>
        <text
          x={points[5].x - 238}
          y={points[5].y + 82}
          fontFamily={FONT}
          fontSize={12}
          fill={C.inkSoft}
        >
          +16% in five years. No one said a word.
        </text>
      </motion.g>

      {/* Family history bubbles (right side) */}
      <motion.g style={{ opacity: famOp, y: famY }}>
        {/* Mother */}
        <line
          x1={points[5].x}
          y1={points[5].y}
          x2={padL + plotW - 10}
          y2={padT + 40}
          stroke={C.ox}
          strokeWidth={1}
          strokeDasharray="3 4"
          opacity={0.35}
          style={{ pointerEvents: "none" }}
        />
        <rect
          x={padL + plotW - 220}
          y={padT + 10}
          width={220}
          height={56}
          rx={4}
          fill={C.paperDeep}
          stroke={C.ox}
          strokeWidth={1}
        />
        <text
          x={padL + plotW - 206}
          y={padT + 30}
          fontFamily={FONT_MONO}
          fontSize={10}
          fill={C.ox}
          letterSpacing="0.1em"
        >
          MOTHER / T2D AT 58
        </text>
        <text
          x={padL + plotW - 206}
          y={padT + 50}
          fontFamily={FONT}
          fontSize={13}
          fill={C.ink}
        >
          (not in Anna&apos;s file)
        </text>
      </motion.g>

      <motion.g style={{ opacity: connOp }}>
        {/* Father */}
        <rect
          x={padL + plotW - 220}
          y={padT + 78}
          width={220}
          height={56}
          rx={4}
          fill={C.paperDeep}
          stroke={C.ox}
          strokeWidth={1}
        />
        <text
          x={padL + plotW - 206}
          y={padT + 98}
          fontFamily={FONT_MONO}
          fontSize={10}
          fill={C.ox}
          letterSpacing="0.1em"
        >
          FATHER / MI AT 65
        </text>
        <text
          x={padL + plotW - 206}
          y={padT + 118}
          fontFamily={FONT}
          fontSize={13}
          fill={C.ink}
        >
          (not in Anna&apos;s file)
        </text>
      </motion.g>

      {/* Final reveal: verdict */}
      <motion.g style={{ opacity: revealOp, y: revealY }}>
        <text
          x={padL + 10}
          y={padT + plotH + 90}
          fontFamily={FONT}
          fontSize={32}
          fontWeight={600}
          fill={C.ink}
          letterSpacing="-0.02em"
        >
          Nobody saw this.
        </text>
        <text
          x={padL + 340}
          y={padT + plotH + 90}
          fontFamily={FONT}
          fontSize={32}
          fontWeight={600}
          fill={C.ox}
          letterSpacing="-0.02em"
          fontStyle="italic"
        >
          Until now.
        </text>
      </motion.g>
    </motion.svg>
  );
}

// ---------------------------------------------------------------------------
// Mobile scroll chart (same data, simpler)
// ---------------------------------------------------------------------------

function MobileChart() {
  const data = useMemo(() => prepGlucose(), []);
  const W = 360;
  const H = 300;
  const padL = 48;
  const padR = 20;
  const padT = 40;
  const padB = 54;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMin = 4.6;
  const yMax = 6.2;
  const xOf = (i: number) => padL + (i / (data.length - 1)) * plotW;
  const yOf = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  const pts = data.map((d, i) => ({ ...d, x: xOf(i), y: yOf(d.value) }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="mLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.sage} />
          <stop offset="60%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.ox} />
        </linearGradient>
      </defs>
      <rect
        x={padL}
        y={padT}
        width={plotW}
        height={plotH}
        fill="rgba(200, 129, 26, 0.08)"
      />
      {[5.0, 5.4, 5.8].map((v) => (
        <g key={v}>
          <line
            x1={padL}
            y1={yOf(v)}
            x2={padL + plotW}
            y2={yOf(v)}
            stroke={C.rule}
            strokeDasharray="2 4"
          />
          <text
            x={padL - 8}
            y={yOf(v) + 3}
            fontFamily={FONT_MONO}
            fontSize={9}
            fill={C.inkFaint}
            textAnchor="end"
          >
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(6.0)}
        x2={padL + plotW}
        y2={yOf(6.0)}
        stroke={C.ox}
        strokeDasharray="4 4"
      />
      <path d={path} fill="none" stroke="url(#mLineGrad)" strokeWidth={2.4} strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={p.date}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === pts.length - 1 ? 4.5 : 3}
            fill={C.paper}
            stroke={i === pts.length - 1 ? C.ox : C.sage}
            strokeWidth={2}
          />
          <text
            x={p.x}
            y={padT + plotH + 18}
            textAnchor="middle"
            fontFamily={FONT_MONO}
            fontSize={9}
            fill={C.inkSoft}
          >
            {p.year}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomeOne() {
  const heroRef = useRef<HTMLElement | null>(null);

  // The pinned hero container is tall (3x viewport). The inner sticky slot
  // holds the chart, and scroll progress drives the animation.
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const diabetesRisk = RISK_ASSESSMENTS.diabetes.tenYearRisk;

  return (
    <div
      style={{
        fontFamily: FONT,
        background: C.paper,
        color: C.ink,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
        overflowX: "hidden",
      }}
    >
      {/* ==================================================================
          NAV
          ================================================================== */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "18px 32px",
          background: "rgba(246, 241, 232, 0.78)",
          backdropFilter: "saturate(120%) blur(12px)",
          WebkitBackdropFilter: "saturate(120%) blur(12px)",
          borderBottom: `1px solid ${C.rule}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <circle cx="11" cy="11" r="9" fill="none" stroke={C.ink} strokeWidth="1.6" />
            <path d="M4 14 L8 10 L12 12 L18 6" fill="none" stroke={C.ox} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Precura
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: C.inkFaint,
              letterSpacing: "0.1em",
              marginLeft: 10,
              paddingLeft: 10,
              borderLeft: `1px solid ${C.rule}`,
            }}
          >
            SE / BETA
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <a
            href="#story"
            style={{
              fontSize: 14,
              color: C.inkSoft,
              textDecoration: "none",
            }}
          >
            The story
          </a>
          <a
            href="#method"
            style={{
              fontSize: 14,
              color: C.inkSoft,
              textDecoration: "none",
            }}
          >
            Method
          </a>
          <a
            href="#pricing"
            style={{
              fontSize: 14,
              color: C.inkSoft,
              textDecoration: "none",
            }}
          >
            Pricing
          </a>
          <a
            href="/v2/login"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: C.paper,
              background: C.ink,
              padding: "9px 16px",
              borderRadius: 2,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* ==================================================================
          HERO / DATA STORY (pinned, scroll-scrubbed)
          ================================================================== */}
      <section
        id="story"
        ref={heroRef}
        style={{
          position: "relative",
          height: "320vh", // gives us scroll runway for the scrub
        }}
      >
        {/* Side margin notes (editorial) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: C.inkFaint,
            letterSpacing: "0.14em",
          }}
        >
          CHAPTER 01 / A QUIET EMERGENCY
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 24,
            right: 32,
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: C.inkFaint,
            letterSpacing: "0.14em",
          }}
        >
          SCROLL / TO READ THE FILE
        </div>

        {/* Sticky inner frame holds the chart */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 24px 24px",
          }}
        >
          {/* Desktop chart */}
          <div
            className="precura-desktop-chart"
            style={{
              width: "100%",
              maxWidth: 1200,
            }}
          >
            <HeroChart progress={heroProgress} />
          </div>

          {/* Mobile fallback (static with caption) */}
          <div
            className="precura-mobile-chart"
            style={{
              display: "none",
              width: "100%",
              maxWidth: 420,
              background: C.paper,
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              ANNA, 40 / FASTING GLUCOSE / 2021-2026
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Her test was &ldquo;normal&rdquo;
              <br />
              <span style={{ color: C.ox, fontStyle: "italic" }}>
                every single year.
              </span>
            </h2>
            <MobileChart />
            <p
              style={{
                marginTop: 20,
                fontSize: 15,
                lineHeight: 1.55,
                color: C.inkSoft,
              }}
            >
              5.0 to 5.8 mmol/L over five years. Always &ldquo;within range.&rdquo;
              Always a different doctor. Nobody saw the trend.
            </p>
            <p
              style={{
                marginTop: 16,
                fontSize: 18,
                fontWeight: 600,
                color: C.ink,
              }}
            >
              Until now.
            </p>
          </div>
        </div>

        {/* Responsive swap without tailwind color utilities */}
        <style>{`
          @media (max-width: 900px) {
            .precura-desktop-chart { display: none !important; }
            .precura-mobile-chart { display: block !important; }
          }
        `}</style>
      </section>

      {/* ==================================================================
          POST-HERO THESIS
          ================================================================== */}
      <section
        style={{
          padding: "140px 32px 120px",
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: C.inkFaint,
            letterSpacing: "0.14em",
            marginBottom: 28,
          }}
        >
          CHAPTER 02 / THE DATA EXISTED
        </div>

        <h2
          style={{
            fontSize: "clamp(34px, 5.2vw, 64px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 920,
            marginBottom: 36,
          }}
        >
          Half of Swedes who develop Type 2 diabetes go undiagnosed for years.
          Not because the data was missing. Because nobody was reading it as one
          story.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 0,
            marginTop: 60,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          {[
            {
              n: "50%",
              k: "of future Type 2 diabetics",
              v: "are undiagnosed right now",
            },
            {
              n: "90%",
              k: "visit primary care",
              v: "at least once every 5 years",
            },
            {
              n: "6+",
              k: "years of blood work",
              v: "sitting in 1177 unread as a trend",
            },
            {
              n: "1",
              k: "pattern",
              v: "no single doctor ever saw",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: "36px 24px 32px",
                borderRight: i < 3 ? `1px solid ${C.rule}` : "none",
                borderBottom: `1px solid ${C.rule}`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: C.inkFaint,
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                0{i + 1}
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: i === 0 ? C.ox : C.ink,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  color: C.ink,
                  fontWeight: 500,
                }}
              >
                {s.k}
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: C.inkSoft,
                  lineHeight: 1.5,
                }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================
          METHOD / WHAT PRECURA ACTUALLY DOES
          ================================================================== */}
      <section
        id="method"
        style={{
          background: C.paperDeep,
          padding: "140px 32px",
          borderTop: `1px solid ${C.rule}`,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: C.inkFaint,
              letterSpacing: "0.14em",
              marginBottom: 28,
            }}
          >
            CHAPTER 03 / THE METHOD
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 80,
              alignItems: "start",
            }}
            className="method-grid"
          >
            <div>
              <h3
                style={{
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: 36,
                }}
              >
                We import your whole history. Then we run it through the same
                risk models your doctor should be running.
              </h3>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: C.inkSoft,
                  maxWidth: 560,
                }}
              >
                Not a wellness score. Not a vibe. FINDRISC for diabetes. SCORE2
                for cardiovascular. FRAX for bone. The same clinical instruments
                used in Swedish hospitals, applied to the story nobody read.
              </p>
            </div>

            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                counterReset: "steps",
              }}
            >
              {[
                {
                  t: "Sign in with BankID",
                  d: "Takes 20 seconds. Everything stays in Sweden, under Swedish law.",
                },
                {
                  t: "We pull your 1177 file",
                  d: "Blood work, prescriptions, visit notes, family history. Nothing is forgotten.",
                },
                {
                  t: "Validated models run",
                  d: "FINDRISC, SCORE2, FRAX. Exactly what a good GP with time would do.",
                },
                {
                  t: "You see your 10-year picture",
                  d: "In plain English. With what moves the needle, and what does not.",
                },
              ].map((s, i) => (
                <li
                  key={i}
                  style={{
                    padding: "24px 0",
                    borderTop: `1px solid ${C.rule}`,
                    display: "grid",
                    gridTemplateColumns: "52px 1fr",
                    gap: 20,
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      color: C.ox,
                      letterSpacing: "0.08em",
                    }}
                  >
                    0{i + 1}.
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: C.ink,
                        marginBottom: 6,
                      }}
                    >
                      {s.t}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: C.inkSoft,
                      }}
                    >
                      {s.d}
                    </div>
                  </div>
                </li>
              ))}
              <li
                style={{
                  padding: "24px 0 0",
                  borderTop: `1px solid ${C.rule}`,
                }}
              />
            </ol>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .method-grid {
                grid-template-columns: 1fr !important;
                gap: 48px !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ==================================================================
          ANNA'S OUTPUT / WHAT YOU ACTUALLY GET
          ================================================================== */}
      <section
        style={{
          padding: "140px 32px 120px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: C.inkFaint,
            letterSpacing: "0.14em",
            marginBottom: 28,
          }}
        >
          CHAPTER 04 / IF YOU WERE ANNA
        </div>

        <h2
          style={{
            fontSize: "clamp(32px, 4.6vw, 56px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            maxWidth: 960,
            marginBottom: 72,
          }}
        >
          This is what your account would show, starting tonight.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {/* Panel 1 - diabetes risk */}
          <div
            style={{
              background: C.paper,
              border: `1px solid ${C.rule}`,
              padding: 32,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.1em",
                marginBottom: 18,
              }}
            >
              01 / DIABETES / 10-YEAR
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: C.ox,
              }}
            >
              {diabetesRisk}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                color: C.inkSoft,
                lineHeight: 1.55,
              }}
            >
              Moderate and rising. Driven by family history and a five-year
              glucose trend that no single appointment would surface.
            </div>
            <div
              style={{
                marginTop: "auto",
                paddingTop: 24,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {["Family history", "Glucose trend", "BMI", "BP"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    letterSpacing: "0.05em",
                    color: C.inkSoft,
                    padding: "4px 10px",
                    border: `1px solid ${C.rule}`,
                    background: C.paperDeep,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Panel 2 - your trend */}
          <div
            style={{
              background: C.paper,
              border: `1px solid ${C.rule}`,
              padding: 32,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.1em",
                marginBottom: 18,
              }}
            >
              02 / FIVE-YEAR TREND
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
                color: C.ink,
              }}
            >
              Every blood test you&apos;ve ever taken, plotted as one honest
              line.
            </div>
            <div style={{ marginTop: 20, flex: 1, display: "flex", alignItems: "center" }}>
              <MobileChart />
            </div>
          </div>

          {/* Panel 3 - doctor note */}
          <div
            style={{
              background: C.paper,
              border: `1px solid ${C.rule}`,
              padding: 32,
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.1em",
                marginBottom: 18,
              }}
            >
              03 / REAL DOCTOR / TWO HOURS
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
                color: C.ink,
                marginBottom: 20,
              }}
            >
              A note from a licensed Swedish physician on every result.
            </div>
            <blockquote
              style={{
                margin: 0,
                padding: "18px 20px",
                background: C.paperDeep,
                fontSize: 14,
                lineHeight: 1.6,
                color: C.ink,
                fontStyle: "italic",
                borderRadius: 2,
              }}
            >
              &ldquo;Anna, your glucose at 5.8 is in the upper normal range. But
              it has risen from 5.0 in 2021. Combined with your mother&apos;s
              history, I want us to watch this closely. Here is what we will
              do.&rdquo;
            </blockquote>
            <div
              style={{
                marginTop: "auto",
                paddingTop: 20,
                fontFamily: FONT_MONO,
                fontSize: 10,
                letterSpacing: "0.08em",
                color: C.inkFaint,
              }}
            >
              DR. MARCUS JOHANSSON / 2026-03-28
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          QUIET PROOF BAND
          ================================================================== */}
      <section
        style={{
          borderTop: `1px solid ${C.rule}`,
          padding: "90px 32px",
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 60,
          alignItems: "center",
        }}
        className="proof-grid"
      >
        <div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: C.inkFaint,
              letterSpacing: "0.14em",
              marginBottom: 20,
            }}
          >
            WHO BUILT THIS
          </div>
          <p
            style={{
              fontSize: 22,
              fontWeight: 500,
              lineHeight: 1.4,
              color: C.ink,
              letterSpacing: "-0.01em",
            }}
          >
            A Swedish physician, a software engineer, and a quiet conviction
            that predictive care should not be a luxury.
          </p>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop"
            alt="Doctor reviewing patient history"
            style={{
              width: "100%",
              height: 340,
              objectFit: "cover",
              borderRadius: 2,
              filter: "saturate(0.85) contrast(1.02)",
            }}
          />
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: C.inkFaint,
              letterSpacing: "0.08em",
            }}
          >
            STOCKHOLM / 2026
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .proof-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>

      {/* ==================================================================
          PRICING / CTA (editorial, not a card)
          ================================================================== */}
      <section
        id="pricing"
        style={{
          background: C.ink,
          color: C.paper,
          padding: "120px 32px 100px",
          borderTop: `1px solid ${C.ink}`,
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: "rgba(246, 241, 232, 0.5)",
              letterSpacing: "0.14em",
              marginBottom: 28,
            }}
          >
            CHAPTER 05 / SEE YOUR STORY
          </div>

          <h2
            style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              maxWidth: 960,
              marginBottom: 60,
            }}
          >
            You&apos;ve already been tested.
            <br />
            <span style={{ color: C.oxSoft, fontStyle: "italic" }}>
              Let&apos;s read it together.
            </span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
              gap: 60,
              alignItems: "end",
              borderTop: `1px solid rgba(246, 241, 232, 0.18)`,
              paddingTop: 40,
            }}
            className="pricing-grid"
          >
            <div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  color: "rgba(246, 241, 232, 0.5)",
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                }}
              >
                PRECURA ANNUAL / INCL. VAT
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 96,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                  }}
                >
                  2 995
                </div>
                <div style={{ fontSize: 20, color: "rgba(246, 241, 232, 0.6)" }}>
                  SEK / year
                </div>
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 14,
                  color: "rgba(246, 241, 232, 0.6)",
                  maxWidth: 480,
                  lineHeight: 1.55,
                }}
              >
                Includes two full blood panels, 10-year risk modelling across
                diabetes, cardiovascular and bone, and a licensed Swedish
                physician reviewing every result.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <a
                href="/v2/login"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "20px 28px",
                  background: C.paper,
                  color: C.ink,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  borderRadius: 2,
                  transition: "transform 160ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(0)";
                }}
              >
                Start with BankID
              </a>
              <a
                href="#story"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "20px 28px",
                  background: "transparent",
                  color: C.paper,
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  borderRadius: 2,
                  border: `1px solid rgba(246, 241, 232, 0.3)`,
                }}
              >
                Re-read Anna&apos;s story
              </a>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  color: "rgba(246, 241, 232, 0.4)",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                }}
              >
                ICHECK / GDPR / 1177-COMPLIANT
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .pricing-grid {
                grid-template-columns: 1fr !important;
                gap: 40px !important;
                align-items: start !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ==================================================================
          FOOTER
          ================================================================== */}
      <footer
        style={{
          background: C.ink,
          color: "rgba(246, 241, 232, 0.5)",
          padding: "40px 32px 60px",
          borderTop: `1px solid rgba(246, 241, 232, 0.12)`,
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: "0.08em",
          }}
        >
          <div>PRECURA AB / STOCKHOLM / EST. 2026</div>
          <div style={{ display: "flex", gap: 28 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              INTEGRITY
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              DATA
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              CONTACT
            </a>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1120,
            margin: "40px auto 0",
            paddingTop: 20,
            borderTop: `1px solid rgba(246, 241, 232, 0.08)`,
            fontSize: 11,
            color: "rgba(246, 241, 232, 0.35)",
            lineHeight: 1.6,
          }}
        >
          Anna Bergstrom is a composite patient built on real Swedish clinical
          data patterns. Her glucose trajectory, family history, and blood work
          are illustrative of a pattern we encountered repeatedly while building
          Precura. All data shown here is non-identifying. Blood test sessions
          from {BLOOD_TEST_HISTORY.length}. Family history points:{" "}
          {FAMILY_HISTORY.length}.
        </div>
      </footer>
    </div>
  );
}
