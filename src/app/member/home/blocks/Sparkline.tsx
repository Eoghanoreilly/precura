"use client";

import React from "react";

// ============================================================================
// Sparkline SVG generator
// ============================================================================

export function Sparkline({
  points,
  color,
  width = 80,
  height = 28,
}: {
  points: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (points.length < 2)
    return <div style={{ width, height, background: "transparent" }} />;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const pad = 4;

  const pts = points.map((p, i) => [
    (i / (points.length - 1)) * (width - 10) + 5,
    height - ((p - min) / range) * (height - pad * 2) - pad,
  ]);

  const d = "M" + pts.map((p) => p[0] + "," + p[1]).join("L");
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ width, height, display: "block" }}
    >
      <rect
        x="0"
        y={Math.round(height * 0.2)}
        width={width}
        height={Math.round(height * 0.5)}
        rx="2"
        fill="rgba(78,142,92,0.06)"
      />
      <path
        d={d}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="3.5"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}
