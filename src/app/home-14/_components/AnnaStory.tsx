"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE, IMG } from "./tokens";

/**
 * ANNA'S STORY - Editorial feature spread.
 *
 * Rather than a horizontal scroll, we stack five year panels vertically
 * like pages in a magazine. Each page has a year stamp, a portrait, a
 * reading value, and a quote. The glucose line is drawn progressively
 * as the reader scrolls, so the slope reveals itself.
 */
export function AnnaStory() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  const pathProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const entries = [
    {
      year: "2021",
      age: 35,
      reading: "5.0",
      label: "Normal",
      color: C.sage,
      image: IMG.anna1,
      body:
        "Anna runs twice a week. Her blood work returns normal. Her GP at Cityakuten signs the panel off with a pen and sends it to the archive.",
      meta: "Cityakuten / Annual check",
    },
    {
      year: "2023",
      age: 37,
      reading: "5.2",
      label: "Normal",
      color: C.sage,
      image: IMG.anna2,
      body:
        "Her mother is diagnosed with type 2 diabetes at 58. Anna asks her GP if she should worry. 'Your numbers are fine.' The reading is filed.",
      meta: "Family history disclosed",
    },
    {
      year: "2025",
      age: 39,
      reading: "5.5",
      label: "Upper normal",
      color: C.rust,
      image: IMG.anna3,
      body:
        "She starts waking at 3am and reading about metabolic health. Her father has a heart attack at 65. Still, the line on each individual panel is within range.",
      meta: "HbA1c 37 mmol/mol",
    },
    {
      year: "2026",
      age: 40,
      reading: "5.8",
      label: "Borderline",
      color: C.rust,
      image: IMG.anna4,
      body:
        "Anna joins Precura. Her five years of readings are stitched into one line. For the first time, the slope has a name: FINDRISC 12, moderate, mostly reversible.",
      meta: "Precura onboarding",
    },
  ];

  return (
    <section
      id="stories"
      ref={wrapRef}
      style={{
        position: "relative",
        background: C.paperSoft,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Chapter header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.rule}`,
            paddingBottom: 20,
            marginBottom: 80,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 02</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Anna Bergstrom / Feature
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Patient #0001
          </div>
        </div>

        {/* Opening pullquote */}
        <div
          className="anna14-open"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 60,
            marginBottom: 100,
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
              Words & Analysis
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.inkSoft,
                lineHeight: 1.6,
                maxWidth: 220,
              }}
            >
              A five-year record of one woman in Stockholm, told through the
              blood panels her doctors signed as normal.
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.pull,
              margin: 0,
              color: C.ink,
              maxWidth: 860,
            }}
          >
            &ldquo;Every individual test said I was fine. It took one system to
            stitch them together to say anything different.&rdquo;
          </motion.p>
        </div>

        {/* Trajectory chart in editorial treatment */}
        <TrajectoryChart pathProgress={pathProgress} />

        {/* Four-year feature grid */}
        <div
          className="anna14-grid"
          style={{
            marginTop: 100,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 56,
          }}
        >
          {entries.map((e, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Year stamp */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${C.rule}`,
                  paddingBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 600,
                    color: C.ink,
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                  }}
                >
                  {e.year}
                </div>
                <div style={{ ...TYPE.mono, color: C.inkMuted }}>
                  Age {e.age}
                </div>
              </div>

              {/* Photo */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  backgroundImage: `url(${e.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(20%) contrast(1.02)",
                }}
              />

              {/* Reading + quote */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 20,
                  paddingTop: 12,
                  borderTop: `1px solid ${C.rule}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      color: C.ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {e.reading}
                  </div>
                  <div
                    style={{
                      ...TYPE.mono,
                      color: e.color,
                      marginTop: 6,
                    }}
                  >
                    {e.label}
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: C.inkSoft,
                    }}
                  >
                    {e.body}
                  </p>
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.inkFaint,
                      marginTop: 10,
                    }}
                  >
                    {e.meta}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.anna14-open),
          :global(.anna14-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Trajectory chart - 5-year glucose with animated line draw
// =============================================================================
function TrajectoryChart({
  pathProgress,
}: {
  pathProgress: MotionValue<number>;
}) {
  // Real glucose series: 5.0 -> 5.8
  const points = [
    { year: "2021", v: 5.0 },
    { year: "2022", v: 5.1 },
    { year: "2023", v: 5.2 },
    { year: "2024", v: 5.4 },
    { year: "2025", v: 5.5 },
    { year: "2026", v: 5.8 },
  ];

  const W = 1200;
  const H = 360;
  const paddingX = 80;
  const paddingY = 60;
  const plotW = W - paddingX * 2;
  const plotH = H - paddingY * 2;

  const minV = 4.6;
  const maxV = 6.1;

  const x = (i: number) => paddingX + (i / (points.length - 1)) * plotW;
  const y = (v: number) =>
    paddingY + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.v)}`)
    .join(" ");

  const refBand = y(6.0);
  const refBandTop = y(6.0);
  const refBandBottom = y(5.6);

  return (
    <div
      style={{
        position: "relative",
        background: C.paper,
        border: `1px solid ${C.ink}`,
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <div>
          <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 6 }}>
            Figure 02 / Fasting glucose
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: C.ink,
              letterSpacing: "-0.015em",
            }}
          >
            Five years, six readings, one slope.
          </div>
        </div>
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          Source: 1177 + Precura
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* Grid */}
        {[5.0, 5.4, 5.8, 6.0].map((v, i) => (
          <g key={i}>
            <line
              x1={paddingX}
              x2={W - paddingX}
              y1={y(v)}
              y2={y(v)}
              stroke={C.rule}
              strokeWidth={0.75}
              strokeDasharray={v === 6.0 ? "0" : "2 4"}
            />
            <text
              x={paddingX - 12}
              y={y(v) + 4}
              fontSize={11}
              fontFamily={MONO_FONT}
              fill={C.inkMuted}
              textAnchor="end"
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Borderline zone */}
        <rect
          x={paddingX}
          y={refBandTop}
          width={plotW}
          height={refBandBottom - refBandTop}
          fill={C.rust}
          opacity={0.07}
        />
        <text
          x={W - paddingX - 6}
          y={refBandTop + 14}
          fontSize={10}
          fontFamily={MONO_FONT}
          fill={C.rust}
          textAnchor="end"
          letterSpacing="0.1em"
        >
          BORDERLINE BAND
        </text>

        {/* The line itself - animated via pathLength */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={C.ink}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: pathProgress }}
        />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={x(i)}
              cy={y(p.v)}
              r={6}
              fill={C.paper}
              stroke={C.ink}
              strokeWidth={2}
            />
            <text
              x={x(i)}
              y={H - paddingY + 28}
              fontSize={11}
              fontFamily="-apple-system"
              fill={C.inkMuted}
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              {p.year}
            </text>
            <text
              x={x(i)}
              y={y(p.v) - 14}
              fontSize={12}
              fontFamily="-apple-system"
              fontWeight={500}
              fill={C.ink}
              textAnchor="middle"
            >
              {p.v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Annotation for 2026 */}
        <line
          x1={x(points.length - 1)}
          x2={x(points.length - 1) + 70}
          y1={y(points[points.length - 1].v)}
          y2={y(points[points.length - 1].v) - 30}
          stroke={C.rust}
          strokeWidth={1}
        />
        <text
          x={x(points.length - 1) + 76}
          y={y(points[points.length - 1].v) - 34}
          fontSize={11}
          fontFamily={MONO_FONT}
          fill={C.rust}
          letterSpacing="0.1em"
        >
          FINDRISC ACTIVATED
        </text>
      </svg>
    </div>
  );
}
