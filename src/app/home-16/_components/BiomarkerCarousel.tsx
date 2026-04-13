"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, SYSTEM_FONT, RADIUS } from "./tokens";

/**
 * BIOMARKER CAROUSEL
 *
 * Interactive clickable panel. Left column: biomarker list (click to select).
 * Right column: large detail card for the selected marker, with its trend,
 * plain-English meaning, and "what Precura would do" action.
 */

type Marker = {
  key: string;
  name: string;
  plain: string;
  unit: string;
  latest: number;
  ref: [number, number];
  status: "normal" | "borderline" | "watch";
  trend: { year: number; value: number }[];
  meaning: string;
  action: string;
};

const MARKERS: Marker[] = [
  {
    key: "glucose",
    name: "Fasting glucose",
    plain: "Blood sugar first thing in the morning",
    unit: "mmol/L",
    latest: 5.8,
    ref: [3.9, 6.0],
    status: "borderline",
    trend: [
      { year: 2021, value: 5.0 },
      { year: 2022, value: 5.1 },
      { year: 2023, value: 5.2 },
      { year: 2024, value: 5.4 },
      { year: 2025, value: 5.5 },
      { year: 2026, value: 5.8 },
    ],
    meaning:
      "Still inside normal range but the trend over five years is clearly upward. With a mother who has Type 2, this is a pattern we treat as an early warning.",
    action:
      "Retest in 6 months. After-dinner walks and a metabolic training block from your coach. Flag for Dr. Marcus if it climbs past 6.1.",
  },
  {
    key: "hba1c",
    name: "HbA1c",
    plain: "Average blood sugar over 3 months",
    unit: "mmol/mol",
    latest: 38,
    ref: [20, 42],
    status: "normal",
    trend: [
      { year: 2022, value: 35 },
      { year: 2023, value: 36 },
      { year: 2024, value: 36 },
      { year: 2025, value: 37 },
      { year: 2026, value: 38 },
    ],
    meaning:
      "Normal, but within 4 points of the prediabetic threshold (42). With a rising glucose trend, this is the number we watch most closely.",
    action:
      "Paired with glucose on every panel. Dr. Marcus adds a note if the trend continues.",
  },
  {
    key: "ldl",
    name: "LDL cholesterol",
    plain: "The cholesterol we want lower",
    unit: "mmol/L",
    latest: 2.9,
    ref: [0, 3.0],
    status: "normal",
    trend: [
      { year: 2022, value: 2.7 },
      { year: 2023, value: 2.8 },
      { year: 2024, value: 2.7 },
      { year: 2025, value: 2.8 },
      { year: 2026, value: 2.9 },
    ],
    meaning:
      "Normal and stable. With a father who had a heart attack at 65, we track this together with ApoB and hs-CRP for a fuller cardiovascular picture.",
    action:
      "Keep as-is. Next panel includes ApoB so we can confirm particle count is matching the LDL reading.",
  },
  {
    key: "vitd",
    name: "Vitamin D",
    plain: "The Swedish winter vitamin",
    unit: "nmol/L",
    latest: 48,
    ref: [50, 125],
    status: "borderline",
    trend: [
      { year: 2023, value: 55 },
      { year: 2024, value: 52 },
      { year: 2025, value: 49 },
      { year: 2026, value: 48 },
    ],
    meaning:
      "Slightly below optimal, which is common in Sweden through October to March. Dr. Marcus already recommended supplementation.",
    action:
      "D3 2000 IU daily through winter. Retest at the next annual panel.",
  },
  {
    key: "tc",
    name: "Total cholesterol",
    plain: "All cholesterol added together",
    unit: "mmol/L",
    latest: 5.1,
    ref: [3.0, 5.0],
    status: "borderline",
    trend: [
      { year: 2021, value: 4.6 },
      { year: 2022, value: 4.8 },
      { year: 2023, value: 4.9 },
      { year: 2024, value: 5.0 },
      { year: 2025, value: 5.0 },
      { year: 2026, value: 5.1 },
    ],
    meaning:
      "Marginally above the upper reference. Your HDL (good cholesterol) is healthy at 1.6 which softens the concern, but the trend is gentle and upward.",
    action:
      "Dietary note from the coach. Retest paired with ApoB on the next panel.",
  },
  {
    key: "hdl",
    name: "HDL cholesterol",
    plain: "The cholesterol we want higher",
    unit: "mmol/L",
    latest: 1.6,
    ref: [1.2, 2.5],
    status: "normal",
    trend: [
      { year: 2022, value: 1.5 },
      { year: 2023, value: 1.5 },
      { year: 2024, value: 1.6 },
      { year: 2025, value: 1.6 },
      { year: 2026, value: 1.6 },
    ],
    meaning:
      "Healthy. HDL helps remove cholesterol from the bloodstream and a value above 1.5 is considered protective for women.",
    action: "No action. Keep tracking.",
  },
];

// ---------------------------------------------------------------------------

function statusColor(s: Marker["status"]) {
  if (s === "normal") return COLORS.sage;
  if (s === "borderline") return COLORS.amber;
  return COLORS.watch;
}

function statusBg(s: Marker["status"]) {
  if (s === "normal") return COLORS.sageSoft;
  if (s === "borderline") return COLORS.amberSoft;
  return COLORS.coralTint;
}

function statusLabel(s: Marker["status"]) {
  if (s === "normal") return "Normal";
  if (s === "borderline") return "Borderline";
  return "Watch";
}

// ---------------------------------------------------------------------------

function TrendChart({ marker }: { marker: Marker }) {
  const w = 620;
  const h = 200;
  const pad = 36;
  const values = marker.trend.map((p) => p.value);
  const minV = Math.min(...values, marker.ref[0]) * 0.95;
  const maxV = Math.max(...values, marker.ref[1]) * 1.05;

  const points = marker.trend.map((p, i) => ({
    x: pad + (i / (marker.trend.length - 1)) * (w - pad * 2),
    y: h - pad - ((p.value - minV) / (maxV - minV)) * (h - pad * 2),
    year: p.year,
    value: p.value,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

  // Reference zone
  const refTopY =
    h - pad - ((marker.ref[1] - minV) / (maxV - minV)) * (h - pad * 2);
  const refBottomY =
    h - pad - ((marker.ref[0] - minV) / (maxV - minV)) * (h - pad * 2);

  const sc = statusColor(marker.status);

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="bcStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.sage} />
          <stop offset="100%" stopColor={sc} />
        </linearGradient>
        <linearGradient id="bcFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sc} stopOpacity={0.18} />
          <stop offset="100%" stopColor={sc} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Normal zone band */}
      <rect
        x={pad}
        y={refTopY}
        width={w - pad * 2}
        height={refBottomY - refTopY}
        fill={COLORS.sageSoft}
        opacity={0.6}
      />
      <text
        x={w - pad}
        y={refTopY - 4}
        textAnchor="end"
        fontSize={10}
        fill={COLORS.inkMuted}
        fontFamily={SYSTEM_FONT}
      >
        Normal range
      </text>

      <path d={areaD} fill="url(#bcFill)" />
      <path
        d={pathD}
        fill="none"
        stroke="url(#bcStroke)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 6 : 4}
              fill={isLast ? sc : COLORS.bgPaper}
              stroke={isLast ? sc : COLORS.sage}
              strokeWidth={2}
            />
            <text
              x={p.x}
              y={h - 10}
              textAnchor="middle"
              fontSize={11}
              fill={COLORS.inkMuted}
              fontFamily={SYSTEM_FONT}
              fontWeight={isLast ? 600 : 500}
            >
              {p.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------

export function BiomarkerCarousel() {
  const [active, setActive] = useState("glucose");
  const marker = MARKERS.find((m) => m.key === active)!;

  return (
    <section
      style={{
        background: COLORS.bgSoft,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                background: COLORS.coralTint,
                color: COLORS.coralDeep,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Try it yourself
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.028em",
              }}
            >
              Click a biomarker to see how{" "}
              <span style={{ color: COLORS.coral }}>Precura would read it.</span>
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: COLORS.inkMuted,
              maxWidth: 340,
            }}
          >
            Live demo with real panel data from Anna&apos;s 5-year history. Each
            marker shows trend, meaning and the exact next action.
          </p>
        </motion.div>

        <div
          className="home16-bc-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(240px, 300px) 1fr",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {/* Left list */}
          <div
            style={{
              background: COLORS.bgPaper,
              borderRadius: RADIUS.cardLarge,
              border: `1px solid ${COLORS.line}`,
              boxShadow: COLORS.shadowSoft,
              padding: "14px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {MARKERS.map((m) => {
              const isActive = m.key === active;
              const sc = statusColor(m.status);
              const sbg = statusBg(m.status);
              return (
                <button
                  key={m.key}
                  onClick={() => setActive(m.key)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: isActive ? COLORS.bgCream : "transparent",
                    border: `1px solid ${
                      isActive ? COLORS.line : "transparent"
                    }`,
                    borderRadius: RADIUS.chip,
                    padding: "12px 14px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: sc,
                      boxShadow: `0 0 0 3px ${sbg}`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        color: COLORS.ink,
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 1,
                      }}
                    >
                      {m.name}
                    </span>
                    <span
                      style={{
                        display: "block",
                        color: COLORS.inkMuted,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {m.latest} {m.unit}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right detail */}
          <div
            style={{
              background: COLORS.bgPaper,
              borderRadius: RADIUS.cardLarge,
              border: `1px solid ${COLORS.line}`,
              boxShadow: COLORS.shadowSoft,
              padding: "34px 36px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={marker.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 26,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: COLORS.ink,
                      }}
                    >
                      {marker.name}
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 14,
                        color: COLORS.inkMuted,
                        fontWeight: 500,
                      }}
                    >
                      {marker.plain}
                    </p>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: statusBg(marker.status),
                      color: statusColor(marker.status),
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {statusLabel(marker.status)}
                  </span>
                </div>

                {/* Value */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    margin: "18px 0 6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: COLORS.ink,
                    }}
                  >
                    {marker.latest}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: COLORS.inkMuted,
                    }}
                  >
                    {marker.unit}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: COLORS.inkMuted,
                      marginLeft: 8,
                    }}
                  >
                    Normal: {marker.ref[0]} to {marker.ref[1]} {marker.unit}
                  </span>
                </div>

                {/* Chart */}
                <div style={{ margin: "16px 0 22px" }}>
                  <TrendChart marker={marker} />
                </div>

                {/* Meaning and action */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                  className="home16-bc-meaning"
                >
                  <div
                    style={{
                      background: COLORS.bgCream,
                      borderRadius: RADIUS.chip,
                      padding: "16px 18px",
                      border: `1px solid ${COLORS.line}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: COLORS.inkMuted,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      What it means
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        color: COLORS.inkSoft,
                        lineHeight: 1.5,
                      }}
                    >
                      {marker.meaning}
                    </p>
                  </div>
                  <div
                    style={{
                      background: COLORS.coralTint,
                      borderRadius: RADIUS.chip,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: COLORS.coralDeep,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      What Precura would do
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        color: COLORS.ink,
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      {marker.action}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-bc-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home16-bc-meaning) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
