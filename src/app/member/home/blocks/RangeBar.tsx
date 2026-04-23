"use client";

import React from "react";
import { C } from "@/components/member/tokens";

// ============================================================================
// Range bar for flagged markers
// ============================================================================

export function RangeBar({
  value,
  refLow,
  refHigh,
  color,
}: {
  value: number;
  refLow: number | null;
  refHigh: number | null;
  color: string;
}) {
  const low = refLow ?? 0;
  const high = refHigh ?? value * 2;
  const scaleMax = Math.max(high * 1.5, value * 1.3);
  const greenLeftPct = (low / scaleMax) * 100;
  const greenWidthPct = ((high - low) / scaleMax) * 100;
  const dotPct = Math.min(Math.max((value / scaleMax) * 100, 3), 97);

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: 28,
          background: C.stone,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Green normal zone */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${greenLeftPct}%`,
            width: `${greenWidthPct}%`,
            background:
              "linear-gradient(90deg, rgba(78,142,92,0.22), rgba(78,142,92,0.12))",
            borderRadius: 14,
          }}
        />
        {/* Value dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${dotPct}%`,
            transform: "translate(-50%, -50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: color,
            border: "3px solid white",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.08)",
            zIndex: 1,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: C.inkFaint,
          marginTop: 6,
          padding: "0 2px",
        }}
      >
        <span>{low} {refLow !== null ? "" : ""}</span>
        <span style={{ color: C.good, fontWeight: 600 }}>
          {low} - {high} normal
        </span>
        <span>{Math.round(scaleMax)}</span>
      </div>
    </div>
  );
}
