"use client";

import React from "react";
import { motion } from "framer-motion";
import { COLORS, SYSTEM_FONT, IMG, RADIUS } from "./tokens";

/**
 * ANNA'S STORY
 *
 * Two-column editorial layout. Photo left, story right.
 * Inline mini chart of glucose over 5 years.
 */
export function AnnaStory() {
  const trend = [
    { year: 2021, value: 5.0 },
    { year: 2022, value: 5.1 },
    { year: 2023, value: 5.2 },
    { year: 2024, value: 5.4 },
    { year: 2025, value: 5.5 },
    { year: 2026, value: 5.8 },
  ];

  const w = 480;
  const h = 140;
  const pad = 24;
  const minV = 4.8;
  const maxV = 6.0;
  const points = trend.map((p, i) => ({
    x: pad + (i / (trend.length - 1)) * (w - pad * 2),
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

  return (
    <section
      style={{
        background: COLORS.bgSoft,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "100px 32px 120px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="home16-anna-grid"
      >
        {/* Photo card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            borderRadius: RADIUS.cardLarge,
            overflow: "hidden",
            backgroundImage: `url(${IMG.annaCoffee})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: COLORS.shadowLift,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              bottom: 24,
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.85,
                marginBottom: 6,
              }}
            >
              Member story
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Anna Bergstrom, 40
            </div>
            <div
              style={{
                fontSize: 14,
                opacity: 0.85,
                marginTop: 4,
              }}
            >
              Stockholm, joined January 2026
            </div>
          </div>
        </motion.div>

        {/* Story + chart */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                background: COLORS.sageSoft,
                color: COLORS.sage,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              How we found it
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Each test was &quot;normal.&quot;
            <br />
            <span style={{ color: COLORS.coral }}>
              Together, they were a warning.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              margin: "0 0 24px",
              fontSize: 17,
              lineHeight: 1.6,
              color: COLORS.inkSoft,
              maxWidth: 600,
            }}
          >
            Anna&apos;s mother was diagnosed with Type 2 at 58. Her father had a
            heart attack at 65. Over five years her fasting glucose rose from
            5.0 to 5.8 mmol/L. Each test came back &quot;within normal range.&quot;
            Precura stitched the five tests into one chart, connected the
            family risk, and flagged it.
          </motion.p>

          {/* Inline chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              background: COLORS.bgPaper,
              borderRadius: RADIUS.card,
              border: `1px solid ${COLORS.line}`,
              padding: "22px 24px",
              boxShadow: COLORS.shadowSoft,
              maxWidth: 560,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLORS.inkMuted,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Fasting glucose, 2021 to 2026
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: COLORS.ink,
                    marginTop: 4,
                  }}
                >
                  +0.8 mmol/L
                </div>
              </div>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: COLORS.amberSoft,
                  color: COLORS.amber,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Trending up
              </div>
            </div>
            <svg
              width="100%"
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              style={{ display: "block" }}
            >
              <defs>
                <linearGradient id="annaStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.sage} />
                  <stop offset="100%" stopColor={COLORS.coral} />
                </linearGradient>
                <linearGradient id="annaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.coral} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={COLORS.coral} stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Reference line at 6.0 (upper normal) */}
              <line
                x1={pad}
                x2={w - pad}
                y1={h - pad - ((6.0 - minV) / (maxV - minV)) * (h - pad * 2)}
                y2={h - pad - ((6.0 - minV) / (maxV - minV)) * (h - pad * 2)}
                stroke={COLORS.inkFaint}
                strokeDasharray="3 4"
                strokeWidth={1}
              />
              <text
                x={w - pad}
                y={h - pad - ((6.0 - minV) / (maxV - minV)) * (h - pad * 2) - 4}
                textAnchor="end"
                fontSize={10}
                fill={COLORS.inkFaint}
                fontFamily={SYSTEM_FONT}
              >
                Upper normal 6.0
              </text>
              <path d={areaD} fill="url(#annaFill)" />
              <path
                d={pathD}
                fill="none"
                stroke="url(#annaStroke)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    fill={
                      i === points.length - 1 ? COLORS.coral : COLORS.bgPaper
                    }
                    stroke={
                      i === points.length - 1 ? COLORS.coral : COLORS.sage
                    }
                    strokeWidth={2}
                  />
                  <text
                    x={p.x}
                    y={h - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fill={COLORS.inkMuted}
                    fontFamily={SYSTEM_FONT}
                  >
                    {p.year}
                  </text>
                </g>
              ))}
            </svg>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
