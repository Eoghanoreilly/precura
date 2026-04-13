"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * LIVING PROFILE - "Not a report. A living profile."
 * Tab-based showcase: click a marker to see its 5-year arc + doctor note.
 * Shows that the profile updates with each test, not a one-time PDF.
 */
export function LivingProfile() {
  const [active, setActive] = useState(0);

  const markers = [
    {
      label: "Fasting glucose",
      shortLabel: "Glucose",
      unit: "mmol/L",
      values: [5.0, 5.2, 5.4, 5.5, 5.8],
      current: 5.8,
      note: "Approaching threshold. Let's retest in 3 months and explore early intervention.",
      zone: "borderline",
    },
    {
      label: "LDL cholesterol",
      shortLabel: "LDL",
      unit: "mmol/L",
      values: [3.0, 2.9, 2.8, 2.9, 2.9],
      current: 2.9,
      note: "Stable within the target range. Good work on dietary changes last year.",
      zone: "normal",
    },
    {
      label: "Vitamin D",
      shortLabel: "Vit D",
      unit: "nmol/L",
      values: [58, 54, 52, 50, 48],
      current: 48,
      note: "Low for the Swedish winter months. Start 2000 IU daily, retest in 6 months.",
      zone: "borderline",
    },
    {
      label: "HbA1c",
      shortLabel: "HbA1c",
      unit: "mmol/mol",
      values: [35, 36, 36, 37, 38],
      current: 38,
      note: "Still within range but trending upward. This mirrors the glucose story.",
      zone: "normal",
    },
    {
      label: "Triglycerides",
      shortLabel: "Blood fats",
      unit: "mmol/L",
      values: [1.1, 1.2, 1.2, 1.2, 1.3],
      current: 1.3,
      note: "Normal, slight rise. Not concerning on its own but worth watching.",
      zone: "normal",
    },
  ];

  const current = markers[active];

  return (
    <section
      id="living"
      style={{
        background: C.ink,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.canvasSoft,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.butter,
            marginBottom: 16,
          }}
        >
          What your membership produces
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(42px, 5.2vw, 72px)",
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            fontWeight: 600,
            color: C.canvasSoft,
            margin: 0,
            marginBottom: 18,
            maxWidth: 900,
          }}
        >
          Not a report.{" "}
          <span
            style={{
              color: C.butter,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            A living profile.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "rgba(251,247,240,0.7)",
            margin: 0,
            marginBottom: 56,
            maxWidth: 640,
          }}
        >
          Every marker has a 5-year arc. Every arc has a doctor&apos;s note.
          Click a marker below to see how the profile thinks.
        </motion.p>

        {/* Marker tabs */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {markers.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                padding: "12px 18px",
                borderRadius: 100,
                background: active === i ? C.butter : "transparent",
                color: active === i ? C.ink : C.canvasSoft,
                border: `1px solid ${
                  active === i ? C.butter : "rgba(251,247,240,0.18)"
                }`,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontFamily: "inherit",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Big display card */}
        <div
          style={{
            position: "relative",
            background: "rgba(251,247,240,0.04)",
            border: "1px solid rgba(251,247,240,0.1)",
            borderRadius: 28,
            padding: 48,
            minHeight: 420,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.3fr",
                gap: 48,
                alignItems: "center",
              }}
              className="home17-living-grid"
            >
              {/* Left - big number + note */}
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.butter,
                    marginBottom: 12,
                  }}
                >
                  Latest reading
                </div>
                <div
                  style={{
                    fontSize: "clamp(80px, 9vw, 120px)",
                    fontWeight: 600,
                    letterSpacing: "-0.045em",
                    lineHeight: 0.9,
                    color: C.canvasSoft,
                    marginBottom: 6,
                  }}
                >
                  {current.current}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: "rgba(251,247,240,0.55)",
                    fontFamily:
                      '"SF Mono", SFMono-Regular, ui-monospace, monospace',
                    letterSpacing: "0.03em",
                    marginBottom: 32,
                  }}
                >
                  {current.unit} / {current.label}
                </div>

                {/* Doctor note */}
                <div
                  style={{
                    padding: "20px 22px",
                    background: "rgba(251,247,240,0.05)",
                    border: "1px solid rgba(251,247,240,0.12)",
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.canvasSoft,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      MJ
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: C.butter,
                        fontWeight: 600,
                      }}
                    >
                      Note from Dr. Marcus
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "rgba(251,247,240,0.82)",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{current.note}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right - chart */}
              <MarkerArc values={current.values} unit={current.unit} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home17-living-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

function MarkerArc({ values, unit }: { values: number[]; unit: string }) {
  const w = 600;
  const h = 260;
  const pad = 50;

  const minV = Math.min(...values) * 0.95;
  const maxV = Math.max(...values) * 1.08;

  const xFor = (i: number) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const yFor = (v: number) =>
    pad + (1 - (v - minV) / (maxV - minV)) * (h - pad * 2);

  const pathD = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`)
    .join(" ");

  const labels = ["2022", "2023", "2024", "2025", "2026"];

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <linearGradient id="h17arcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(233,181,71,0.4)" />
            <stop offset="100%" stopColor={C.butter} />
          </linearGradient>
          <linearGradient id="h17arcFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.butter} stopOpacity="0.25" />
            <stop offset="100%" stopColor={C.butter} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={pad}
          y1={h - pad}
          x2={w - pad}
          y2={h - pad}
          stroke="rgba(251,247,240,0.15)"
          strokeWidth={1}
        />

        {/* Area */}
        <path
          d={
            pathD +
            ` L ${xFor(values.length - 1)} ${h - pad} L ${xFor(0)} ${h - pad} Z`
          }
          fill="url(#h17arcFill)"
        />

        {/* Line */}
        <motion.path
          key={values.join(",")}
          d={pathD}
          fill="none"
          stroke="url(#h17arcGrad)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Points + labels */}
        {values.map((v, i) => (
          <g key={i}>
            <motion.circle
              cx={xFor(i)}
              cy={yFor(v)}
              r={i === values.length - 1 ? 8 : 5}
              fill={i === values.length - 1 ? C.butter : C.ink}
              stroke={C.butter}
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.4 + i * 0.1,
              }}
            />
            <text
              x={xFor(i)}
              y={yFor(v) - 16}
              textAnchor="middle"
              fontSize={13}
              fill={
                i === values.length - 1 ? C.butter : "rgba(251,247,240,0.7)"
              }
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontWeight={i === values.length - 1 ? 700 : 400}
            >
              {v}
            </text>
            <text
              x={xFor(i)}
              y={h - pad + 22}
              textAnchor="middle"
              fontSize={11}
              fill="rgba(251,247,240,0.5)"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
            >
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
      <div
        style={{
          fontSize: 11,
          color: "rgba(251,247,240,0.45)",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          textAlign: "center",
          marginTop: 4,
          letterSpacing: "0.05em",
        }}
      >
        5-YEAR ARC / {unit.toUpperCase()}
      </div>
    </div>
  );
}
