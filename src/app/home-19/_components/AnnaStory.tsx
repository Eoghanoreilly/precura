"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * ANNA'S STORY - A warm, 2-column editorial section.
 * Left: portrait + caption. Right: her 5-year glucose ramp told as a
 * mini story with an inline SVG trend chart.
 *
 * Not a data dashboard. Just a slow story.
 */
export function AnnaStory() {
  // 5-year glucose values (from mock-patient, roughly)
  const years = [
    { year: "2021", val: 5.0 },
    { year: "2022", val: 5.1 },
    { year: "2023", val: 5.2 },
    { year: "2024", val: 5.4 },
    { year: "2025", val: 5.5 },
    { year: "2026", val: 5.8 },
  ];

  // SVG geometry
  const W = 520;
  const H = 180;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const minVal = 4.8;
  const maxVal = 6.2;

  const points = years.map((y, i) => ({
    x: padL + (i / (years.length - 1)) * (W - padL - padR),
    y:
      padT +
      (1 - (y.val - minVal) / (maxVal - minVal)) * (H - padT - padB),
    year: y.year,
    val: y.val,
  }));
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD =
    `M ${points[0].x} ${H - padB} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x} ${H - padB} Z`;

  return (
    <section
      style={{
        padding: "110px 32px 120px",
        background: C.creamDeep,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 72,
          alignItems: "center",
        }}
        className="home19-anna-grid"
      >
        {/* Left: portrait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: C.shadowLift,
            border: `1px solid ${C.line}`,
            background: C.paper,
          }}
        >
          <div
            style={{
              height: 520,
              backgroundImage: `url(${IMG.anna})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />
          <div style={{ padding: "18px 22px 22px" }}>
            <div
              style={{
                ...TYPE.micro,
                color: C.coral,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              PRECURA MEMBER
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.ink,
                letterSpacing: "-0.012em",
              }}
            >
              Anna Bergstrom, 40
            </div>
            <div style={{ ...TYPE.small, color: C.inkMuted, marginTop: 2 }}>
              Stockholm. Mother diagnosed with type 2 at 58.
            </div>
          </div>
        </motion.div>

        {/* Right: story + chart */}
        <div>
          <div
            style={{
              ...TYPE.label,
              color: C.coral,
              marginBottom: 16,
            }}
          >
            Anna&apos;s story
          </div>
          <h2
            style={{
              ...TYPE.displayL,
              margin: 0,
              color: C.ink,
              marginBottom: 22,
            }}
          >
            Five years of blood tests.{" "}
            <span
              style={{
                color: C.coral,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Nobody connected them.
            </span>
          </h2>

          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              marginTop: 0,
              marginBottom: 22,
            }}
          >
            Every year Anna got a routine blood draw from her vardcentral.
            Every year the number was technically in range. But across five
            years her fasting glucose crept from 5.0 to 5.8, and her mother
            got a T2D diagnosis in the middle of that window.
          </p>

          {/* Inline trend chart */}
          <div
            style={{
              background: C.paper,
              borderRadius: 22,
              border: `1px solid ${C.line}`,
              padding: "20px 22px 14px",
              boxShadow: C.shadow,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.ink,
                    letterSpacing: "-0.005em",
                  }}
                >
                  Fasting glucose
                </div>
                <div style={{ ...TYPE.small, color: C.inkMuted }}>
                  Blood sugar before breakfast, mmol/L
                </div>
              </div>
              <div
                style={{
                  ...TYPE.micro,
                  padding: "4px 10px",
                  borderRadius: 100,
                  background: C.coralSoft,
                  color: C.coralDeep,
                  fontWeight: 700,
                }}
              >
                +0.8 over 5 years
              </div>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              height={H}
              style={{ display: "block" }}
            >
              <defs>
                <linearGradient id="annaLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.signalGood} />
                  <stop offset="60%" stopColor={C.signalCaution} />
                  <stop offset="100%" stopColor={C.coral} />
                </linearGradient>
                <linearGradient id="annaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.coral} stopOpacity="0.16" />
                  <stop offset="100%" stopColor={C.coral} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Zone bands */}
              <rect
                x={padL}
                y={padT}
                width={W - padL - padR}
                height={((H - padT - padB) * (6.0 - 5.6)) / (maxVal - minVal)}
                fill={C.amberSoft}
                opacity="0.5"
              />

              {/* Y-axis labels */}
              {[5.0, 5.4, 5.8, 6.2].map((v) => {
                const y =
                  padT +
                  (1 - (v - minVal) / (maxVal - minVal)) *
                    (H - padT - padB);
                return (
                  <g key={v}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={W - padR}
                      y2={y}
                      stroke={C.lineSoft}
                      strokeDasharray="2 4"
                    />
                    <text
                      x={padL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill={C.inkFaint}
                      fontFamily={SYSTEM_FONT}
                    >
                      {v.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Area */}
              <motion.path
                d={areaD}
                fill="url(#annaAreaGrad)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />
              {/* Line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#annaLineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Points */}
              {points.map((p, i) => {
                const isLast = i === points.length - 1;
                return (
                  <motion.circle
                    key={p.year}
                    cx={p.x}
                    cy={p.y}
                    r={isLast ? 6 : 3.5}
                    fill={isLast ? C.coral : C.paper}
                    stroke={isLast ? C.paper : C.coral}
                    strokeWidth="2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 1 + i * 0.08 }}
                  />
                );
              })}

              {/* X labels */}
              {points.map((p) => (
                <text
                  key={p.year}
                  x={p.x}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill={C.inkMuted}
                  fontFamily={SYSTEM_FONT}
                >
                  {p.year}
                </text>
              ))}
            </svg>
          </div>

          <p
            style={{
              ...TYPE.body,
              color: C.inkMuted,
              margin: 0,
            }}
          >
            Precura is built for the next ten years of that line. We watch the
            slope, not just the number. The earlier we catch the drift, the
            cheaper and more pleasant the fix.
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 940px) {
          :global(.home19-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
