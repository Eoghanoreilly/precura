"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * ANNA'S STORY - "meet a real member" storytelling energy applied to a
 * health narrative. Large portrait on the left, a tight narrative on the
 * right with a small inline chart showing the 5-year glucose drift.
 */
export function AnnaStory() {
  const glucoseYears = [
    { year: "2021", value: 5.0 },
    { year: "2022", value: 5.1 },
    { year: "2023", value: 5.2 },
    { year: "2024", value: 5.4 },
    { year: "2025", value: 5.5 },
    { year: "2026", value: 5.8 },
  ];
  const minVal = 4.5;
  const maxVal = 6.2;

  return (
    <section
      style={{
        background: C.canvas,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="home18-anna-grid"
        >
          {/* Portrait column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              borderRadius: 28,
              overflow: "hidden",
              aspectRatio: "4/5",
              background: C.inkHair,
              boxShadow: C.shadowLift,
            }}
          >
            <img
              src={IMG.annaMorning}
              alt="Anna, a Precura member"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Gradient foot */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.75) 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Caption */}
            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: 28,
                right: 28,
                color: C.paper,
              }}
            >
              <div
                style={{
                  ...TYPE.label,
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: 6,
                }}
              >
                Member / Stockholm / age 40
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Anna Bergstrom
              </div>
            </div>
          </motion.div>

          {/* Story column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              style={{
                ...TYPE.label,
                color: C.lingon,
                marginBottom: 20,
              }}
            >
              A story we heard too often
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              style={{
                ...TYPE.displayMedium,
                margin: 0,
                marginBottom: 24,
              }}
            >
              Her glucose went from{" "}
              <span style={{ color: C.lingon }}>5.0 to 5.8</span> across five
              years. Nobody called.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: "0 0 32px",
                maxWidth: 580,
              }}
            >
              Each test came back "technically normal." Her mother was
              diagnosed with type 2 diabetes at 58. The drift kept drifting.
              Precura looks at years of data together, not one dot at a time.
            </motion.p>

            {/* Inline trend chart card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                background: C.paper,
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${C.inkLine}`,
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
                      ...TYPE.label,
                      color: C.inkMuted,
                      marginBottom: 4,
                    }}
                  >
                    Fasting glucose / mmol/L
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: C.ink,
                    }}
                  >
                    Five-year trajectory
                  </div>
                </div>
                <div
                  style={{
                    padding: "5px 10px",
                    background: C.lingonBg,
                    color: C.lingonDeep,
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Drift detected
                </div>
              </div>

              {/* Chart */}
              <svg viewBox="0 0 500 160" width="100%" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="annaGradientH18" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={C.good} />
                    <stop offset="100%" stopColor={C.lingon} />
                  </linearGradient>
                  <linearGradient id="annaFillH18" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.lingon} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={C.lingon} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Zone bands */}
                <rect
                  x={0}
                  y={0}
                  width={500}
                  height={40}
                  fill={C.lingon}
                  fillOpacity={0.06}
                />
                <rect
                  x={0}
                  y={40}
                  width={500}
                  height={50}
                  fill={C.amberDeep}
                  fillOpacity={0.05}
                />
                <rect
                  x={0}
                  y={90}
                  width={500}
                  height={70}
                  fill={C.euc}
                  fillOpacity={0.05}
                />

                {/* Gridlines */}
                {[40, 90, 130].map((y) => (
                  <line
                    key={y}
                    x1={0}
                    x2={500}
                    y1={y}
                    y2={y}
                    stroke={C.inkHair}
                    strokeDasharray="2 4"
                  />
                ))}

                {/* Area */}
                {(() => {
                  const w = 500;
                  const h = 160;
                  const points = glucoseYears.map((d, i) => ({
                    x: 30 + (i / (glucoseYears.length - 1)) * (w - 60),
                    y:
                      h -
                      20 -
                      ((d.value - minVal) / (maxVal - minVal)) * (h - 40),
                    v: d.value,
                    label: d.year,
                  }));
                  const pathD = points
                    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                    .join(" ");
                  const areaD =
                    pathD +
                    ` L ${points[points.length - 1].x} ${h - 20}` +
                    ` L ${points[0].x} ${h - 20} Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#annaFillH18)" />
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke="url(#annaGradientH18)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 1.8,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                      {points.map((p, i) => (
                        <g key={i}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={4}
                            fill={C.paper}
                            stroke={
                              i === points.length - 1 ? C.lingon : C.inkFaint
                            }
                            strokeWidth={2}
                          />
                          <text
                            x={p.x}
                            y={h - 4}
                            textAnchor="middle"
                            fontSize={10}
                            fill={C.inkMuted}
                            fontFamily="inherit"
                          >
                            {p.label}
                          </text>
                        </g>
                      ))}
                      {/* Callout on last point */}
                      <g>
                        <text
                          x={points[points.length - 1].x - 6}
                          y={points[points.length - 1].y - 12}
                          textAnchor="end"
                          fontSize={13}
                          fontWeight={600}
                          fill={C.lingon}
                          fontFamily="inherit"
                        >
                          5.8
                        </text>
                      </g>
                      <g>
                        <text
                          x={points[0].x + 6}
                          y={points[0].y - 12}
                          textAnchor="start"
                          fontSize={13}
                          fontWeight={600}
                          fill={C.good}
                          fontFamily="inherit"
                        >
                          5.0
                        </text>
                      </g>
                    </>
                  );
                })()}
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home18-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
