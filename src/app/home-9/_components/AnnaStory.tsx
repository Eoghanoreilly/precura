"use client";

/**
 * Anna's Story.
 *
 * Three layers:
 *  - Layer 1 (slow): Portrait photo of Anna translating slowly upward
 *  - Layer 2 (mid): An inline SVG glucose chart plotted from real mock data,
 *    drifting down at a different rate so the chart crosses the photo
 *  - Layer 3 (foreground): Her words pulled from mock data, appearing word
 *    by word as the reader scrolls through
 *
 * The emotional beat: same woman, same data, five years. Nobody saw the line.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import {
  useSectionScroll,
  useParallaxY,
  SplitReveal,
} from "./parallax";

// Real glucose values pulled from Anna's mock-patient history.
const GLUCOSE_POINTS = [
  { year: "2021", value: 5.0 },
  { year: "2022", value: 5.1 },
  { year: "2023", value: 5.2 },
  { year: "2024", value: 5.4 },
  { year: "2025", value: 5.5 },
  { year: "2026", value: 5.8 },
];

export default function AnnaStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);

  const photoY = useParallaxY(scrollYProgress, [-30, 120], reduceMotion);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const photoOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.55, 1],
    [0, 0.65, 0.4, 0.1]
  );
  const chartY = useParallaxY(scrollYProgress, [180, -180], reduceMotion);
  const chartOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0.4]
  );
  const copyY = useParallaxY(scrollYProgress, [60, -60], reduceMotion);

  // Chart geometry
  const chartW = 900;
  const chartH = 320;
  const padX = 60;
  const padY = 60;
  const minV = 4.6;
  const maxV = 6.2;
  const xStep = (chartW - padX * 2) / (GLUCOSE_POINTS.length - 1);
  const pts = GLUCOSE_POINTS.map((p, i) => {
    const x = padX + i * xStep;
    const y = padY + (1 - (p.value - minV) / (maxV - minV)) * (chartH - padY * 2);
    return { ...p, x, y };
  });
  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${chartH - padY} L ${pts[0].x} ${chartH - padY} Z`;

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "200vh",
        width: "100%",
        overflow: "hidden",
        background: C.cream,
        color: C.ink,
        fontFamily: FONT.ui,
      }}
    >
      {/* Layer 1: portrait photo */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          y: photoY,
          scale: photoScale,
          opacity: photoOpacity,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "0%",
            width: "56%",
            height: "70%",
            backgroundImage: `url(${IMG.anna})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.25) contrast(0.95)",
            mixBlendMode: "multiply",
          }}
        />
      </motion.div>

      {/* Layer 2: oversized chart */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "20%",
          left: "-8%",
          right: "10%",
          y: chartY,
          opacity: chartOpacity,
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          style={{ width: "100%", height: "auto" }}
        >
          <defs>
            <linearGradient id="glucoseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.terracotta} stopOpacity="0.25" />
              <stop offset="100%" stopColor={C.terracotta} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="glucoseLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.green} />
              <stop offset="60%" stopColor={C.amber} />
              <stop offset="100%" stopColor={C.terracotta} />
            </linearGradient>
          </defs>
          {/* Threshold line (normal upper bound 6.0) */}
          <line
            x1={padX}
            x2={chartW - padX}
            y1={padY + (1 - (6.0 - minV) / (maxV - minV)) * (chartH - padY * 2)}
            y2={padY + (1 - (6.0 - minV) / (maxV - minV)) * (chartH - padY * 2)}
            stroke={C.ink}
            strokeWidth={1}
            strokeDasharray="4 6"
            opacity={0.25}
          />
          <text
            x={chartW - padX}
            y={padY + (1 - (6.0 - minV) / (maxV - minV)) * (chartH - padY * 2) - 8}
            textAnchor="end"
            fontSize={12}
            fontFamily={FONT.mono}
            fill={C.ink}
            opacity={0.5}
          >
            6.0 normal ceiling
          </text>
          {/* Fill */}
          <motion.path
            d={areaD}
            fill="url(#glucoseFill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.4 }}
          />
          {/* Line */}
          <motion.path
            d={pathD}
            stroke="url(#glucoseLine)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Points */}
          {pts.map((p, i) => (
            <motion.g
              key={p.year}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
            >
              <circle cx={p.x} cy={p.y} r={6} fill={C.cream} stroke={C.ink} strokeWidth={1.5} />
              <text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fontSize={13}
                fontFamily={FONT.mono}
                fill={C.ink}
                fontWeight={500}
              >
                {p.value.toFixed(1)}
              </text>
              <text
                x={p.x}
                y={chartH - padY + 22}
                textAnchor="middle"
                fontSize={11}
                fontFamily={FONT.mono}
                fill={C.ink}
                opacity={0.55}
              >
                {p.year}
              </text>
            </motion.g>
          ))}
        </svg>
      </motion.div>

      {/* Layer 3: foreground copy */}
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 100px) clamp(24px, 6vw, 100px)",
          maxWidth: 1600,
          margin: "0 auto",
          zIndex: 5,
        }}
      >
        <motion.div style={{ y: copyY, maxWidth: "52ch" }}>
          <div
            style={{
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: "clamp(24px, 3vw, 40px)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: FONT.mono,
            }}
          >
            <span>/ 02</span>
            <span style={{ height: 1, flex: 1, maxWidth: 100, background: C.rule }} />
            <span>A real case</span>
          </div>

          <h2
            style={{
              fontSize: SIZE.h1,
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: 0,
              color: C.ink,
            }}
          >
            <SplitReveal text="Meet Anna." />
            <br />
            <SplitReveal text="She is 40." delay={0.15} />
            <br />
            <SplitReveal
              text="Her glucose is"
              delay={0.3}
            />{" "}
            <SplitReveal
              text="quietly rising."
              delay={0.4}
              style={{ color: C.terracotta, fontStyle: "italic" }}
            />
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{
              marginTop: "clamp(32px, 4vw, 56px)",
              display: "grid",
              gridTemplateColumns: "min-content 1fr",
              gap: "clamp(24px, 2vw, 40px) clamp(16px, 2vw, 32px)",
              alignItems: "baseline",
            }}
          >
            {[
              {
                k: "2021",
                v: "Fasting glucose 5.0 mmol/L. Doctor says \"all normal\". Anna trusts it.",
              },
              {
                k: "2023",
                v: "5.2 mmol/L. A new doctor, a new visit. The word \"normal\" again.",
              },
              {
                k: "2024",
                v: "Mother is diagnosed with type 2 diabetes at 58. Anna starts to wonder.",
              },
              {
                k: "2026",
                v: "5.8 mmol/L. Technically still normal. Six months from pre-diabetes.",
              },
            ].map((row) => (
              <React.Fragment key={row.k}>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: SIZE.small,
                    color: C.terracotta,
                    letterSpacing: "0.06em",
                    borderTop: `1px solid ${C.ink}`,
                    paddingTop: 10,
                    width: "6ch",
                  }}
                >
                  {row.k}
                </div>
                <div
                  style={{
                    fontSize: SIZE.lead,
                    color: C.textSecondary,
                    lineHeight: 1.55,
                    fontWeight: 300,
                    borderTop: `1px solid ${C.rule}`,
                    paddingTop: 10,
                  }}
                >
                  {row.v}
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, delay: 0.9 }}
            style={{
              marginTop: "clamp(40px, 5vw, 72px)",
              maxWidth: "48ch",
              position: "relative",
              paddingTop: 28,
              borderTop: `1px solid ${C.rule}`,
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: -1,
                left: 0,
                width: 56,
                height: 2,
                background: C.terracotta,
              }}
            />
            <p
              style={{
                fontSize: SIZE.lead,
                color: C.inkSoft,
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              &ldquo;Every result was technically fine. But nobody ever stacked
              them up on one page. That&rsquo;s what Precura did the first week
              I signed up.&rdquo;
            </p>
            <div
              style={{
                fontSize: SIZE.small,
                color: C.textMuted,
                marginTop: 14,
                letterSpacing: "0.06em",
                fontFamily: FONT.mono,
              }}
            >
              Anna Bergstrom / Stockholm / Feb 2026
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
