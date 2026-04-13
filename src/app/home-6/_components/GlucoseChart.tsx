"use client";

/**
 * GlucoseChart - Anna's real 5-year fasting glucose trajectory.
 *
 * Scroll-scrubbed: the line draws in as the section scrolls into view,
 * then the year markers and annotations fade in sequentially. This is
 * intentionally a hand-tuned SVG (no chart library) so we control every
 * pixel of the motion.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DATA = [
  { year: 2021, value: 5.0, label: "First test" },
  { year: 2022, value: 5.1 },
  { year: 2023, value: 5.2 },
  { year: 2024, value: 5.4 },
  { year: 2025, value: 5.5 },
  { year: 2026, value: 5.8, label: "Today" },
];

const WIDTH = 860;
const HEIGHT = 360;
const PAD = { top: 48, right: 72, bottom: 56, left: 72 };
const MIN_Y = 4.6;
const MAX_Y = 6.2;
const REF_HIGH = 6.0; // upper normal

const COLORS = {
  ink: "#0E0E10",
  muted: "#6B6B76",
  amber: "#C77A45",
  amberDeep: "#8A3E1C",
  green: "#3A5A47",
  cream: "#F6F3EE",
  tint: "#ECE7DE",
  line: "#D9D3C8",
};

function xForIndex(i: number) {
  const range = WIDTH - PAD.left - PAD.right;
  return PAD.left + (i / (DATA.length - 1)) * range;
}
function yForValue(v: number) {
  const range = HEIGHT - PAD.top - PAD.bottom;
  const pct = (v - MIN_Y) / (MAX_Y - MIN_Y);
  return HEIGHT - PAD.bottom - pct * range;
}

const pathD = DATA.map((d, i) => {
  const x = xForIndex(i);
  const y = yForValue(d.value);
  if (i === 0) return `M ${x} ${y}`;
  // Smooth curve
  const prevX = xForIndex(i - 1);
  const cx1 = prevX + (x - prevX) * 0.5;
  const cx2 = prevX + (x - prevX) * 0.5;
  const prevY = yForValue(DATA[i - 1].value);
  return `C ${cx1} ${prevY}, ${cx2} ${y}, ${x} ${y}`;
}).join(" ");

const areaD =
  pathD +
  ` L ${xForIndex(DATA.length - 1)} ${HEIGHT - PAD.bottom}` +
  ` L ${xForIndex(0)} ${HEIGHT - PAD.bottom} Z`;

export default function GlucoseChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: WIDTH,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <linearGradient id="g6-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.amber} stopOpacity="0.28" />
            <stop offset="100%" stopColor={COLORS.amber} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="g6-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.green} />
            <stop offset="50%" stopColor={COLORS.amber} />
            <stop offset="100%" stopColor={COLORS.amberDeep} />
          </linearGradient>
        </defs>

        {/* Upper normal reference */}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={yForValue(REF_HIGH)}
          y2={yForValue(REF_HIGH)}
          stroke={COLORS.line}
          strokeDasharray="4 6"
          strokeWidth={1}
        />
        <text
          x={WIDTH - PAD.right + 6}
          y={yForValue(REF_HIGH) + 4}
          fill={COLORS.muted}
          fontSize={11}
          fontFamily='-apple-system, "SF Pro Text", sans-serif'
        >
          6.0 upper normal
        </text>

        {/* Y-axis baseline */}
        <line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top - 6}
          y2={HEIGHT - PAD.bottom}
          stroke={COLORS.line}
          strokeWidth={1}
        />

        {/* Gridlines */}
        {[5.0, 5.4, 5.8].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={yForValue(v)}
              y2={yForValue(v)}
              stroke={COLORS.line}
              strokeOpacity={0.5}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={yForValue(v) + 4}
              textAnchor="end"
              fontSize={11}
              fill={COLORS.muted}
              fontFamily='"SF Mono", ui-monospace, Menlo, monospace'
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Filled area under the line */}
        <motion.path
          d={areaD}
          fill="url(#g6-area)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        />

        {/* The trajectory line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#g6-line)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* Year labels + points */}
        {DATA.map((d, i) => {
          const x = xForIndex(i);
          const y = yForValue(d.value);
          const isLast = i === DATA.length - 1;
          return (
            <g key={d.year}>
              <motion.circle
                cx={x}
                cy={y}
                r={isLast ? 7 : 4}
                fill={isLast ? COLORS.amberDeep : COLORS.amber}
                stroke={COLORS.cream}
                strokeWidth={isLast ? 3 : 2}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 2.0 + i * 0.08, duration: 0.4 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
              <motion.text
                x={x}
                y={HEIGHT - PAD.bottom + 22}
                textAnchor="middle"
                fontSize={11}
                fill={COLORS.muted}
                fontFamily='"SF Mono", ui-monospace, Menlo, monospace'
                initial={{ opacity: 0, y: HEIGHT - PAD.bottom + 30 }}
                animate={inView ? { opacity: 1, y: HEIGHT - PAD.bottom + 22 } : {}}
                transition={{ delay: 2.1 + i * 0.08, duration: 0.4 }}
              >
                {d.year}
              </motion.text>
              <motion.text
                x={x}
                y={y - 14}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill={COLORS.ink}
                fontFamily='"SF Mono", ui-monospace, Menlo, monospace'
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.3 + i * 0.08, duration: 0.4 }}
              >
                {d.value.toFixed(1)}
              </motion.text>
              {d.label && (
                <motion.text
                  x={isLast ? x : x}
                  y={isLast ? y - 32 : HEIGHT - PAD.bottom + 38}
                  textAnchor={isLast ? "middle" : "middle"}
                  fontSize={10}
                  fill={isLast ? COLORS.amberDeep : COLORS.muted}
                  fontFamily='-apple-system, "SF Pro Text", sans-serif'
                  fontWeight={isLast ? 600 : 400}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.8 + i * 0.05, duration: 0.4 }}
                >
                  {d.label}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* "Nobody flagged it" callout pointing to the 2023 midpoint */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 3.1, duration: 0.8 }}
        >
          <line
            x1={xForIndex(2)}
            y1={yForValue(5.2) - 60}
            x2={xForIndex(2)}
            y2={yForValue(5.2) - 18}
            stroke={COLORS.muted}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={xForIndex(2)}
            y={yForValue(5.2) - 72}
            textAnchor="middle"
            fontSize={11}
            fill={COLORS.muted}
            fontFamily='-apple-system, "SF Pro Text", sans-serif'
            fontStyle="italic"
          >
            every test: technically normal
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
