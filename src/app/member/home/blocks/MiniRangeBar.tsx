"use client";

import React from "react";
import type { Biomarker } from "@/lib/data/types";
import { C } from "@/components/member/tokens";

// ============================================================================
// Mini range bar - compact inline version for system tiles and lists
// ============================================================================

export function MiniRangeBar({ marker }: { marker: Biomarker }) {
  const low = marker.ref_range_low ?? 0;
  const high = marker.ref_range_high ?? marker.value * 2;
  const scaleMax = high * 1.5;
  const greenLeft = (low / scaleMax) * 100;
  const greenRight = 100 - (high / scaleMax) * 100;
  const dotPos = Math.min(Math.max((marker.value / scaleMax) * 100, 2), 98);
  const dotColor = marker.status === "normal" ? C.good : marker.status === "borderline" ? C.caution : C.risk;

  return (
    <div style={{ position: "relative", height: 6, background: C.stone, borderRadius: 3, width: "100%" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${greenLeft}%`, right: `${greenRight}%`, background: `rgba(78,142,92,0.18)`, borderRadius: 3 }} />
      <div style={{ position: "absolute", top: "50%", left: `${dotPos}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: dotColor, border: "2px solid white", boxShadow: `0 1px 3px rgba(0,0,0,0.15)` }} />
    </div>
  );
}
