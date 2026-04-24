"use client";

import React from "react";

export type SparklineProps = {
  values: number[];
  color: string;
  height?: number;
  width?: number;
  ariaLabel?: string;
};

export function Sparkline({ values, color, height = 44, width, ariaLabel }: SparklineProps) {
  if (values.length < 2) return null;

  const w = width ?? (values.length === 2 ? 90 : 120);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - 8 - ((v - min) / range) * (height - 16);
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const polygon = `${polyline} ${w},${height} 0,${height}`;
  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" role="img" aria-label={ariaLabel ?? "trend"}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={polygon} fill={`url(#${gradId})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 3.5 : 3} fill={color} opacity={i === points.length - 1 ? 1 : 0.5 + i * 0.1} />
      ))}
    </svg>
  );
}
