"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "./tokens";

// ============================================================================
// GlucoseHero - the single marker that matters on panel-results-day.
// Promoted out of WhatMoved so the page answers Anna's "is this good or bad?"
// question in one glance. Full-width card, bigger number, sparkline, verdict.
// ============================================================================

export interface GlucoseHeroProps {
  currentValue: number;
  previousValue: number;
  unit: string;
  refLow: number;
  refHigh: number;
  /** 5-year history as { year, value } for the sparkline. */
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

  const verdictColor =
    verdictTone === "attention"
      ? C.caution
      : verdictTone === "good"
      ? C.good
      : C.inkSoft;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      style={{
        margin: "0 20px 18px",
        padding: "26px 24px 22px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Eyebrow - terracotta = doctor flagged this */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.terracotta,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        The one Dr. Tomas flagged
      </div>

      {/* Plain-English marker name */}
      <div
        style={{
          fontSize: 14,
          color: C.inkMuted,
          marginBottom: 12,
          letterSpacing: "-0.005em",
        }}
      >
        Fasting glucose / blood sugar before eating
      </div>

      {/* Big number + delta row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              ...DISPLAY_NUM,
              fontSize: "clamp(44px, 11vw, 60px)",
              color: C.ink,
              letterSpacing: "-0.032em",
              lineHeight: 1,
            }}
          >
            {currentValue}
          </span>
          <span
            style={{
              fontSize: 16,
              color: C.inkFaint,
              marginLeft: 2,
            }}
          >
            {unit}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.caution,
              letterSpacing: "-0.005em",
            }}
          >
            {deltaLabel} since last panel
          </span>
          <span
            style={{
              fontSize: 12,
              color: C.inkFaint,
              marginTop: 2,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            from {previousValue} {unit}
          </span>
        </div>
      </div>

      {/* Range bar - shows where currentValue sits in ref range */}
      <RangeBar
        value={currentValue}
        refLow={refLow}
        refHigh={refHigh}
      />

      {/* 5-year sparkline */}
      <GlucoseSparkline history={history} refHigh={refHigh} />

      {/* Plain-English verdict */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: verdictColor,
          letterSpacing: "-0.005em",
          marginTop: 4,
          fontStyle: "italic",
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {verdict}
      </div>
    </motion.section>
  );
}

// ============================================================================
// RangeBar - horizontal bar showing refLow / refHigh with a marker for value
// ============================================================================

function RangeBar({
  value,
  refLow,
  refHigh,
}: {
  value: number;
  refLow: number;
  refHigh: number;
}) {
  // Extend the visual range a bit beyond ref bounds so marker isn't at the edge
  const pad = (refHigh - refLow) * 0.2;
  const min = refLow - pad;
  const max = refHigh + pad;
  const pct = ((value - min) / (max - min)) * 100;
  const normalLowPct = ((refLow - min) / (max - min)) * 100;
  const normalHighPct = ((refHigh - min) / (max - min)) * 100;

  const inRange = value >= refLow && value <= refHigh;
  const nearTop = value > refHigh - (refHigh - refLow) * 0.15 && value <= refHigh;
  const markerColor = !inRange
    ? C.risk
    : nearTop
    ? C.caution
    : C.good;

  return (
    <div style={{ margin: "4px 0 20px" }}>
      <div
        style={{
          position: "relative",
          height: 8,
          background: C.stoneSoft,
          borderRadius: 4,
        }}
      >
        {/* Normal range highlighted */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${normalLowPct}%`,
            width: `${normalHighPct - normalLowPct}%`,
            background: C.sageTint,
            border: `1px solid ${C.sageSoft}`,
            borderRadius: 4,
          }}
        />
        {/* Value marker */}
        <div
          style={{
            position: "absolute",
            top: -3,
            left: `${pct}%`,
            width: 14,
            height: 14,
            background: markerColor,
            border: `2px solid ${C.paper}`,
            borderRadius: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 2px 6px rgba(28,26,23,0.25)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 10,
          color: C.inkFaint,
          fontFamily:
            '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          letterSpacing: "0.02em",
        }}
      >
        <span>{refLow}</span>
        <span style={{ color: C.inkMuted, fontWeight: 600 }}>
          normal range
        </span>
        <span>{refHigh}</span>
      </div>
    </div>
  );
}

// ============================================================================
// GlucoseSparkline - inline SVG 5-year trend.
// ============================================================================

function GlucoseSparkline({
  history,
  refHigh,
}: {
  history: { year: string; value: number }[];
  refHigh: number;
}) {
  if (history.length < 2) return null;

  const w = 560;
  const h = 72;
  const pad = 6;

  const allValues = history.map((p) => p.value).concat([refHigh + 0.4]);
  const min = Math.min(...allValues) - 0.2;
  const max = Math.max(...allValues) + 0.2;

  const points = history.map((p, i) => {
    const x = pad + (i / (history.length - 1)) * (w - pad * 2);
    const y = h - pad - ((p.value - min) / (max - min)) * (h - pad * 2);
    return { x, y, year: p.year, value: p.value };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x.toFixed(1)} ${h - pad} L ${points[0].x.toFixed(
      1
    )} ${h - pad} Z`;

  // Reference line for refHigh (6.0 = top of normal)
  const refY = h - pad - ((refHigh - min) / (max - min)) * (h - pad * 2);

  const lastPoint = points[points.length - 1];

  return (
    <div style={{ margin: "8px 0 14px" }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="glucose-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9573A" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C9573A" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Normal-range top reference line */}
        <line
          x1={pad}
          y1={refY}
          x2={w - pad}
          y2={refY}
          stroke={C.sage}
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        <text
          x={w - pad}
          y={refY - 4}
          textAnchor="end"
          fontSize="10"
          fill={C.sageDeep}
          fontFamily={SYSTEM_FONT}
        >
          top of normal
        </text>

        {/* Area + line */}
        <path d={areaD} fill="url(#glucose-grad)" />
        <path
          d={pathD}
          fill="none"
          stroke={C.terracotta}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Year dots */}
        {points.map((p, i) => (
          <circle
            key={p.year}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? C.terracotta : C.paper}
            stroke={C.terracotta}
            strokeWidth="2"
          />
        ))}

        {/* Year labels */}
        {points.map((p, i) => {
          if (i === 0 || i === points.length - 1) {
            return (
              <text
                key={`l-${p.year}`}
                x={p.x}
                y={h - pad + 14}
                textAnchor={i === 0 ? "start" : "end"}
                fontSize="10"
                fill={C.inkFaint}
                fontFamily={SYSTEM_FONT}
              >
                {p.year}
              </text>
            );
          }
          return null;
        })}

        {/* Current value label above the last point */}
        <text
          x={lastPoint.x}
          y={lastPoint.y - 10}
          textAnchor="end"
          fontSize="11"
          fontWeight="600"
          fill={C.terracotta}
          fontFamily={SYSTEM_FONT}
        >
          {lastPoint.value}
        </text>
      </svg>
    </div>
  );
}
