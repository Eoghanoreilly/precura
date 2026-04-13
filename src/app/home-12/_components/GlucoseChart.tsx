"use client";

/**
 * GlucoseChart - cool-palette refit of the chart used in home-6, tuned
 * for home-12's Split Classical aesthetic. Anna's real 5-year fasting
 * glucose trajectory, hand-drawn SVG, scroll-triggered draw and fade.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, FONT, MONO } from "./tokens";

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
const PAD = { top: 48, right: 80, bottom: 56, left: 72 };
const MIN_Y = 4.6;
const MAX_Y = 6.2;
const REF_HIGH = 6.0;

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

export function GlucoseChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: WIDTH,
        position: "relative",
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <linearGradient id="h12-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="h12-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.sage} />
            <stop offset="55%" stopColor={C.accent} />
            <stop offset="100%" stopColor={C.accentDeep} />
          </linearGradient>
        </defs>

        {/* Upper normal reference */}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={yForValue(REF_HIGH)}
          y2={yForValue(REF_HIGH)}
          stroke={C.lineStrong}
          strokeDasharray="4 6"
          strokeWidth={1}
        />
        <text
          x={WIDTH - PAD.right + 8}
          y={yForValue(REF_HIGH) + 4}
          fill={C.inkMuted}
          fontSize={11}
          fontFamily={FONT}
        >
          6.0 upper normal
        </text>

        {/* Gridlines */}
        {[5.0, 5.4, 5.8].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={yForValue(v)}
              y2={yForValue(v)}
              stroke={C.line}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 12}
              y={yForValue(v) + 4}
              textAnchor="end"
              fontSize={11}
              fill={C.inkMuted}
              fontFamily={MONO}
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Area under the line */}
        <motion.path
          d={areaD}
          fill="url(#h12-area)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        />

        {/* Trajectory line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#h12-line)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* Points */}
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
                fill={isLast ? C.accentDeep : C.accent}
                stroke={C.paperElev}
                strokeWidth={isLast ? 3 : 2}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
                }
                transition={{ delay: 2.0 + i * 0.08, duration: 0.4 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
              <motion.text
                x={x}
                y={HEIGHT - PAD.bottom + 22}
                textAnchor="middle"
                fontSize={11}
                fill={C.inkMuted}
                fontFamily={MONO}
                initial={{ opacity: 0, y: HEIGHT - PAD.bottom + 30 }}
                animate={
                  inView
                    ? { opacity: 1, y: HEIGHT - PAD.bottom + 22 }
                    : { opacity: 0 }
                }
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
                fill={C.ink}
                fontFamily={MONO}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.3 + i * 0.08, duration: 0.4 }}
              >
                {d.value.toFixed(1)}
              </motion.text>
              {d.label && (
                <motion.text
                  x={x}
                  y={isLast ? y - 32 : HEIGHT - PAD.bottom + 38}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isLast ? C.accentDeep : C.inkMuted}
                  fontFamily={FONT}
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

        {/* Callout */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 3.1, duration: 0.8 }}
        >
          <line
            x1={xForIndex(2)}
            y1={yForValue(5.2) - 60}
            x2={xForIndex(2)}
            y2={yForValue(5.2) - 18}
            stroke={C.inkMuted}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={xForIndex(2)}
            y={yForValue(5.2) - 72}
            textAnchor="middle"
            fontSize={11}
            fill={C.inkMuted}
            fontFamily={FONT}
            fontStyle="italic"
          >
            every test: technically normal
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
