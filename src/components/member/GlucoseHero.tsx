"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "./tokens";

// ============================================================================
// GlucoseHero - the single marker that matters on panel-results-day.
//
// Pass 3 rebuild: the v2 card was tasteful but quiet - small number, small
// range bar, verdict italic-grey at the bottom. Anna could not answer
// "is this good or bad?" in 30 seconds.
//
// This version commits to being a verdict card:
// - Number and italic-serif verdict side by side in the hero row
// - A full-bleed zoned bar below (green/butter/amber/risk segments) with
//   the value pinned at its actual position in the ref range
// - Sparkline at the bottom for trajectory context
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

  // Zone position: classify where currentValue sits in the normal band.
  // 0-85% of range = good, 85-100% = approaching, >100% = over, far over = risk.
  const zone = classifyZone(currentValue, refLow, refHigh);
  const zoneColor =
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
        padding: "26px 26px 22px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 24,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
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

      {/* Plain-English marker name */}
      <div
        style={{
          fontSize: 14,
          color: C.inkMuted,
          marginBottom: 20,
          letterSpacing: "-0.005em",
        }}
      >
        Fasting glucose / blood sugar before eating
      </div>

      {/* Hero row: big number on the left, italic-serif verdict on the right */}
      <div
        className="glucose-hero-row"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 22,
          marginBottom: 22,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                ...DISPLAY_NUM,
                fontSize: "clamp(52px, 11vw, 68px)",
                color: C.ink,
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
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
              fontSize: 12,
              fontWeight: 600,
              color: zoneColor,
              marginTop: 6,
              letterSpacing: "-0.005em",
            }}
          >
            {deltaLabel} since last panel
            <span
              style={{
                color: C.inkFaint,
                fontWeight: 400,
                marginLeft: 6,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              from {previousValue}
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            paddingTop: 4,
          }}
        >
          <div
            style={{
              fontSize: "clamp(16px, 2.4vw, 20px)",
              lineHeight: 1.35,
              color: C.ink,
              letterSpacing: "-0.01em",
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 500,
            }}
          >
            {verdict}
          </div>
        </div>
      </div>

      {/* Full-bleed zone bar */}
      <ZoneBar
        value={currentValue}
        refLow={refLow}
        refHigh={refHigh}
      />

      {/* Sparkline */}
      <GlucoseSparkline history={history} refHigh={refHigh} />

      <style jsx>{`
        @media (max-width: 520px) {
          :global(.glucose-hero-row) {
            flex-direction: column !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

// ============================================================================
// classifyZone - helper
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
// ZoneBar - full-width 4-segment bar with triangle marker above value position
// ============================================================================

function ZoneBar({
  value,
  refLow,
  refHigh,
}: {
  value: number;
  refLow: number;
  refHigh: number;
}) {
  const range = refHigh - refLow;
  // Visual bar spans: refLow-ish on left, up to refHigh + 20% on right
  const visMin = refLow - range * 0.1;
  const visMax = refHigh + range * 0.2;
  const visRange = visMax - visMin;

  // Zone boundary positions as % of visual bar
  const good_end = ((refLow + range * 0.85 - visMin) / visRange) * 100;
  const approach_end = ((refHigh - visMin) / visRange) * 100;
  const over_end = ((refHigh + range * 0.1 - visMin) / visRange) * 100;

  // Marker position
  const markerPct = ((value - visMin) / visRange) * 100;
  const clamped = Math.max(2, Math.min(98, markerPct));

  return (
    <div style={{ margin: "4px 0 22px" }}>
      {/* Marker row - triangle pointing down + value label */}
      <div
        style={{
          position: "relative",
          height: 22,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${clamped}%`,
            top: 0,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              ...DISPLAY_NUM,
              fontSize: 12,
              color: C.ink,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `7px solid ${C.ink}`,
              marginTop: 3,
            }}
          />
        </div>
      </div>

      {/* The bar itself */}
      <div
        style={{
          position: "relative",
          height: 14,
          borderRadius: 7,
          overflow: "hidden",
          display: "flex",
          border: `1px solid ${C.lineCard}`,
          boxShadow: "inset 0 1px 2px rgba(28,26,23,0.06)",
        }}
      >
        {/* Good zone */}
        <div
          style={{
            width: `${good_end}%`,
            background: `linear-gradient(90deg, ${C.sageSoft}, ${C.sage})`,
          }}
        />
        {/* Approaching zone */}
        <div
          style={{
            width: `${approach_end - good_end}%`,
            background: `linear-gradient(90deg, ${C.sage}, ${C.butter})`,
          }}
        />
        {/* Over zone */}
        <div
          style={{
            width: `${over_end - approach_end}%`,
            background: `linear-gradient(90deg, ${C.butter}, ${C.caution})`,
          }}
        />
        {/* Risk zone */}
        <div
          style={{
            width: `${100 - over_end}%`,
            background: `linear-gradient(90deg, ${C.caution}, ${C.risk})`,
          }}
        />
      </div>

      {/* Bar labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          fontSize: 10,
          color: C.inkFaint,
          fontFamily:
            '"SF Mono", SFMono-Regular, ui-monospace, monospace',
          letterSpacing: "0.02em",
        }}
      >
        <span>{refLow} low</span>
        <span
          style={{
            color: C.inkMuted,
            fontFamily: SYSTEM_FONT,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: 9,
          }}
        >
          normal range
        </span>
        <span>{refHigh} high</span>
      </div>
    </div>
  );
}

// ============================================================================
// GlucoseSparkline - inline SVG 5-year trend (same as before, smaller)
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
  const h = 60;
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
    .map((p, i) =>
      `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    )
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x.toFixed(1)} ${h - pad} L ${points[0].x.toFixed(1)} ${h - pad} Z`;

  const refY = h - pad - ((refHigh - min) / (max - min)) * (h - pad * 2);

  return (
    <div
      style={{
        marginTop: 4,
        paddingTop: 14,
        borderTop: `1px solid ${C.lineSoft}`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.inkFaint,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Your 5-year trend
      </div>
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

        <path d={areaD} fill="url(#glucose-grad)" />
        <path
          d={pathD}
          fill="none"
          stroke={C.terracotta}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

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

        {points.map((p, i) => {
          if (i === 0 || i === points.length - 1) {
            return (
              <text
                key={`l-${p.year}`}
                x={p.x}
                y={h - pad + 12}
                textAnchor={i === 0 ? "start" : "end"}
                fontSize="9"
                fill={C.inkFaint}
                fontFamily={SYSTEM_FONT}
              >
                {p.year}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
