"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, IMG } from "./tokens";

/**
 * ANNA'S STORY - Editorial portrait + a real trajectory chart.
 * Left: warm portrait photograph, tall. Right: headline + body + the
 * 5-year glucose trend that nobody noticed.
 */
export function AnnaSection() {
  // Real data from Anna's blood tests over 5 years
  const glucoseData = [
    { year: "2022", value: 5.0 },
    { year: "2023", value: 5.2 },
    { year: "2024", value: 5.4 },
    { year: "2025", value: 5.5 },
    { year: "2026", value: 5.8 },
  ];

  return (
    <section
      style={{
        background: C.canvas,
        padding: "120px 32px",
        fontFamily: SYSTEM_FONT,
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
            color: C.terracotta,
            marginBottom: 16,
          }}
        >
          The person we built this for
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 64,
            alignItems: "stretch",
          }}
          className="home17-anna-grid"
        >
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              minHeight: 540,
              background: C.stoneSoft,
              boxShadow: C.shadowCard,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${IMG.annaPortrait})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.85) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: 28,
                right: 28,
                color: C.canvasSoft,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.butter,
                  marginBottom: 10,
                }}
              >
                Anna Bergstrom / 40 / Stockholm
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                &ldquo;Every test said I was normal.&rdquo;
              </div>
            </div>
          </motion.div>

          {/* Story + Chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              style={{
                fontSize: "clamp(34px, 4vw, 54px)",
                lineHeight: 1.05,
                letterSpacing: "-0.028em",
                fontWeight: 600,
                color: C.ink,
                margin: 0,
              }}
            >
              Five blood tests.
              <br />
              Five &ldquo;normal&rdquo; results.
              <br />
              <span style={{ color: C.terracotta, fontStyle: "italic", fontWeight: 500 }}>
                One rising trend nobody saw.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: C.inkMuted,
                margin: 0,
                maxWidth: 540,
              }}
            >
              Anna&apos;s mother was diagnosed with type 2 diabetes at 58. Her
              father had a heart attack at 65. For five years, Anna&apos;s
              fasting glucose climbed from 5.0 to 5.8 mmol/L. Each test was
              technically within range. No one on her six-minute GP visits
              connected the dots.
            </motion.p>

            {/* The chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                background: C.paper,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 20,
                padding: 28,
                boxShadow: C.shadowCard,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: C.inkFaint,
                      marginBottom: 4,
                    }}
                  >
                    Fasting glucose / 5 years
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    +16% / approaching pre-diabetic
                  </div>
                </div>
                <div
                  style={{
                    padding: "4px 10px",
                    background: C.terracottaTint,
                    color: C.terracottaDeep,
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Trend: rising
                </div>
              </div>

              <GlucoseChart data={glucoseData} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                  paddingTop: 16,
                  borderTop: `1px solid ${C.lineSoft}`,
                  fontSize: 12,
                  color: C.inkMuted,
                  fontFamily: '"SF Mono", ui-monospace, monospace',
                  letterSpacing: "0.04em",
                }}
              >
                <span>Normal range: 3.9 to 6.0 mmol/L</span>
                <span>FINDRISC: 12/26</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home17-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

function GlucoseChart({ data }: { data: { year: string; value: number }[] }) {
  const w = 560;
  const h = 200;
  const padL = 44;
  const padR = 24;
  const padT = 24;
  const padB = 36;

  const minV = 4.8;
  const maxV = 6.1;

  const xFor = (i: number) =>
    padL + (i / (data.length - 1)) * (w - padL - padR);
  const yFor = (v: number) =>
    padT + (1 - (v - minV) / (maxV - minV)) * (h - padT - padB);

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.value)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${xFor(data.length - 1)} ${h - padB} L ${xFor(0)} ${h - padB} Z`;

  const yTicks = [5.0, 5.5, 6.0];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="h17glucoseArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.terracotta} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.terracotta} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="h17glucoseLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.good} />
          <stop offset="60%" stopColor={C.caution} />
          <stop offset="100%" stopColor={C.terracotta} />
        </linearGradient>
      </defs>

      {/* Y-axis labels + grid lines */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={padL}
            x2={w - padR}
            y1={yFor(tick)}
            y2={yFor(tick)}
            stroke={C.lineSoft}
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <text
            x={padL - 10}
            y={yFor(tick) + 4}
            textAnchor="end"
            fontSize={11}
            fill={C.inkFaint}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {tick.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Reference zone for "high-normal" */}
      <rect
        x={padL}
        y={yFor(6.0)}
        width={w - padL - padR}
        height={yFor(5.5) - yFor(6.0)}
        fill={C.butterTint}
        opacity={0.5}
      />

      {/* Area fill */}
      <path d={areaD} fill="url(#h17glucoseArea)" />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#h17glucoseLine)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {data.map((d, i) => (
        <g key={i}>
          <circle
            cx={xFor(i)}
            cy={yFor(d.value)}
            r={i === data.length - 1 ? 6 : 4}
            fill={i === data.length - 1 ? C.terracotta : C.paper}
            stroke={
              i === data.length - 1 ? C.terracotta : C.inkSoft
            }
            strokeWidth={2}
          />
          {i === data.length - 1 && (
            <circle
              cx={xFor(i)}
              cy={yFor(d.value)}
              r={11}
              fill="none"
              stroke={C.terracotta}
              strokeOpacity={0.35}
              strokeWidth={2}
            />
          )}
          <text
            x={xFor(i)}
            y={h - padB + 18}
            textAnchor="middle"
            fontSize={11}
            fill={C.inkMuted}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {d.year}
          </text>
        </g>
      ))}
    </svg>
  );
}
