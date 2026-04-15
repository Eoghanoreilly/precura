"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "./tokens";

// ============================================================================
// GlucoseHero - pass 4 rebuild
//
// Previous versions stacked eyebrow / name / number / verdict / zonebar /
// sparkline as separate strips. Adversarial review: "four stacked rows
// pretending to be a composition."
//
// This version is a two-element composition:
//   Element 1 (top): huge number + italic-serif verdict side by side
//   Element 2 (bottom): a FULL trend chart with green/amber/risk zone bands
//                        behind the line, labeled years, and a large "today"
//                        dot that sits visually in whichever zone her value
//                        has drifted into.
//
// The chart with zone bands replaces the separate zone bar from the previous
// version - it communicates position AND drift in ONE visual, which is what
// the agent actually asked for. The number and verdict are the verbal half
// of the same answer.
// ============================================================================

export interface GlucoseHeroProps {
  currentValue: number;
  previousValue: number;
  unit: string;
  refLow: number;
  refHigh: number;
  /** 5-year history as { year, value }. */
  history: { year: string; value: number }[];
  /** Plain-English verdict line, e.g. "Still in range, still drifting." */
  verdict: string;
  verdictTone: "attention" | "neutral" | "good";
}

export function GlucoseHero({
  currentValue,
  previousValue,
  unit,
  refLow,
  refHigh,
  history,
  verdict,
  verdictTone,
}: GlucoseHeroProps) {
  const delta = Number((currentValue - previousValue).toFixed(2));
  const deltaLabel =
    delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "no change";

  const zone = classifyZone(currentValue, refLow, refHigh);
  const deltaColor =
    zone === "good"
      ? C.good
      : zone === "approaching"
      ? C.butter
      : zone === "over"
      ? C.caution
      : C.risk;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      style={{
        margin: "0 20px 18px",
        padding: "26px 28px 26px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 24,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.terracotta,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        The one Dr. Tomas flagged
      </div>
      <div
        style={{
          fontSize: 14,
          color: C.inkMuted,
          marginBottom: 18,
          letterSpacing: "-0.005em",
        }}
      >
        Fasting glucose / blood sugar before eating
      </div>

      {/* Hero row: HUGE number (left) + italic-serif verdict (right) */}
      <div className="glucose-hero-row">
        <div className="glucose-hero-number">
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
          >
            <span
              style={{
                ...DISPLAY_NUM,
                fontSize: "clamp(72px, 12vw, 112px)",
                color: C.ink,
                letterSpacing: "-0.04em",
                lineHeight: 0.88,
              }}
            >
              {currentValue}
            </span>
            <span
              style={{
                fontSize: 14,
                color: C.inkFaint,
                letterSpacing: "-0.005em",
                marginTop: 8,
              }}
            >
              {unit}
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: deltaColor,
              marginTop: 10,
              letterSpacing: "-0.005em",
            }}
          >
            {deltaLabel} since last panel
            <span
              style={{
                color: C.inkFaint,
                fontWeight: 400,
                marginLeft: 8,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              from {previousValue}
            </span>
          </div>
        </div>
        <div className="glucose-hero-verdict">
          <div
            style={{
              fontSize: "clamp(19px, 2.6vw, 24px)",
              lineHeight: 1.3,
              color: C.ink,
              letterSpacing: "-0.012em",
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 500,
            }}
          >
            {verdict}
          </div>
        </div>
      </div>

      {/* 5-year trend chart with zone bands - replaces the old separate bar */}
      <GlucoseTrendChart
        history={history}
        refLow={refLow}
        refHigh={refHigh}
        currentValue={currentValue}
      />

      <style jsx>{`
        .glucose-hero-row {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          margin-bottom: 20px;
        }
        .glucose-hero-number {
          flex-shrink: 0;
        }
        .glucose-hero-verdict {
          flex: 1;
          min-width: 0;
          padding-top: 6px;
        }
        @media (max-width: 640px) {
          .glucose-hero-row {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .glucose-hero-verdict {
            padding-top: 0 !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

// ============================================================================
// classifyZone
// ============================================================================

type Zone = "good" | "approaching" | "over" | "risk";

function classifyZone(
  value: number,
  refLow: number,
  refHigh: number
): Zone {
  const range = refHigh - refLow;
  const approachingLine = refLow + range * 0.85;
  const overLine = refHigh;
  const riskLine = refHigh + range * 0.2;
  if (value < approachingLine) return "good";
  if (value < overLine) return "approaching";
  if (value < riskLine) return "over";
  return "risk";
}

// ============================================================================
// GlucoseTrendChart - the hero visualization.
// Full-width SVG chart with zone bands in the background, the trend line on
// top, labeled year ticks, and a large emphasized "today" dot.
// ============================================================================

function GlucoseTrendChart({
  history,
  refLow,
  refHigh,
  currentValue,
}: {
  history: { year: string; value: number }[];
  refLow: number;
  refHigh: number;
  currentValue: number;
}) {
  if (history.length < 2) return null;

  const w = 800;
  const h = 240;
  const padT = 18;
  const padR = 28;
  const padB = 42;
  const padL = 46;

  // Y-axis range - wide enough to show zones AND the data
  const range = refHigh - refLow;
  const yMin = refLow - range * 0.3;
  const yMax = refHigh + range * 0.3;
  const yRange = yMax - yMin;

  // Zone boundary y-coordinates
  const yRisk = padT;
  const yOver = padT + ((yMax - (refHigh + range * 0.1)) / yRange) * (h - padT - padB);
  const yApproach = padT + ((yMax - refHigh) / yRange) * (h - padT - padB);
  const yGood = padT + ((yMax - (refLow + range * 0.85)) / yRange) * (h - padT - padB);
  const yBottom = h - padB;

  // Data point positions
  const points = history.map((p, i) => {
    const x = padL + (i / (history.length - 1)) * (w - padL - padR);
    const y = padT + ((yMax - p.value) / yRange) * (h - padT - padB);
    return { x, y, year: p.year, value: p.value };
  });

  const pathD = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    )
    .join(" ");

  const lastPoint = points[points.length - 1];
  const lastZone = classifyZone(currentValue, refLow, refHigh);
  const lastDotColor =
    lastZone === "good"
      ? C.good
      : lastZone === "approaching"
      ? C.butter
      : lastZone === "over"
      ? C.caution
      : C.risk;

  // Y-axis tick values
  const yTicks = [refLow, refLow + range * 0.5, refHigh];

  return (
    <div
      style={{
        marginTop: 4,
        paddingTop: 18,
        borderTop: `1px solid ${C.lineSoft}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: C.inkMuted,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Your 5-year trend
        </div>
        <div
          style={{
            fontSize: 11,
            color: C.inkFaint,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: "italic",
          }}
        >
          zones show risk progression
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="glucose-line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9573A" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#C9573A" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Zone bands - pushed opacity up so they read as bands, not noise */}
        <rect
          x={padL}
          y={yGood}
          width={w - padL - padR}
          height={yBottom - yGood}
          fill="rgba(78,142,92,0.22)"
        />
        <rect
          x={padL}
          y={yApproach}
          width={w - padL - padR}
          height={yGood - yApproach}
          fill="rgba(233,181,71,0.28)"
        />
        <rect
          x={padL}
          y={yOver}
          width={w - padL - padR}
          height={yApproach - yOver}
          fill="rgba(208,132,23,0.30)"
        />
        <rect
          x={padL}
          y={yRisk}
          width={w - padL - padR}
          height={yOver - yRisk}
          fill="rgba(196,71,42,0.28)"
        />

        {/* Normal-range top reference line (6.0) */}
        <line
          x1={padL}
          y1={yApproach}
          x2={w - padR}
          y2={yApproach}
          stroke={C.risk}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.55"
        />

        {/* Y-axis tick labels */}
        {yTicks.map((v) => {
          const y = padT + ((yMax - v) / yRange) * (h - padT - padB);
          return (
            <text
              key={v}
              x={padL - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="11"
              fill={C.inkFaint}
              fontFamily={SYSTEM_FONT}
            >
              {v}
            </text>
          );
        })}
        <text
          x={padL - 8}
          y={yApproach - 6}
          textAnchor="end"
          fontSize="10"
          fill={C.risk}
          fontFamily={SYSTEM_FONT}
          fontWeight="600"
          letterSpacing="0.04em"
        >
          top of normal
        </text>

        {/* Area under line */}
        <path
          d={
            pathD +
            ` L ${lastPoint.x.toFixed(1)} ${yBottom} L ${points[0].x.toFixed(1)} ${yBottom} Z`
          }
          fill="url(#glucose-line-grad)"
        />

        {/* Trend line */}
        <path
          d={pathD}
          fill="none"
          stroke={C.terracotta}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* No per-year history dots - just the line and the endpoint. */}

        {/* Emphasized "today" dot on the last point with a labeled callout */}
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={12}
          fill={lastDotColor}
          stroke={C.paper}
          strokeWidth="4"
        />

        {/* Leader line from dot to callout */}
        <line
          x1={lastPoint.x - 14}
          y1={lastPoint.y}
          x2={lastPoint.x - 62}
          y2={lastPoint.y}
          stroke={C.ink}
          strokeWidth="1"
          opacity="0.35"
        />

        {/* Callout pill: "Today 5.8" anchored left of the endpoint */}
        <g
          transform={`translate(${(lastPoint.x - 130).toFixed(1)}, ${(lastPoint.y - 13).toFixed(1)})`}
        >
          <rect
            x="0"
            y="0"
            width="66"
            height="26"
            rx="13"
            fill={C.ink}
          />
          <text
            x="12"
            y="17"
            fontSize="11"
            fontWeight="600"
            fill={C.canvasSoft}
            fontFamily={SYSTEM_FONT}
            letterSpacing="0.02em"
          >
            Today
          </text>
          <text
            x="42"
            y="17"
            fontSize="12"
            fontWeight="700"
            fill={C.canvasSoft}
            fontFamily='"SF Mono", SFMono-Regular, ui-monospace, monospace'
          >
            {currentValue}
          </text>
        </g>

        {/* X-axis year labels */}
        {points.map((p, i) => {
          const step = Math.max(1, Math.floor(points.length / 6));
          if (i % step !== 0 && i !== points.length - 1) return null;
          return (
            <text
              key={`yr-${p.year}`}
              x={p.x}
              y={yBottom + 16}
              textAnchor={
                i === 0
                  ? "start"
                  : i === points.length - 1
                  ? "end"
                  : "middle"
              }
              fontSize="10"
              fill={C.inkFaint}
              fontFamily={SYSTEM_FONT}
            >
              {p.year}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
