"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

export interface MarkerChange {
  name: string;
  plainName: string;
  unit: string;
  previousValue: number;
  currentValue: number;
  status: "normal" | "borderline" | "abnormal";
}

/**
 * WhatMoved - pure prose, one emphasis level.
 *
 * Previous versions stacked six type treatments in a single paragraph
 * (body sans, big mono, small mono, italic serif, small sans for units,
 * bold names). Collision, not emphasis.
 *
 * This version is one body-text paragraph. Values are bold in the same
 * weight and size as the rest of the text. No mono, no size jumps, no
 * italic clauses, no color changes inside the sentence. Reads as one voice.
 */
export function WhatMoved({
  markers,
  panelTotal,
  panelFlagged,
  panelInRange,
}: {
  markers: MarkerChange[];
  panelTotal: number;
  panelFlagged: number;
  panelInRange: number;
}) {
  if (markers.length === 0) return null;

  // Group: the one that needs attention (borderline/abnormal) gets its own
  // sentence with the plain-English clause. The rest get joined into a
  // single "everything else held" sentence.
  const flagged = markers.filter((m) => m.status !== "normal");
  const normal = markers.filter((m) => m.status === "normal");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{
        margin: "0 0 22px",
        padding: "22px 26px 22px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.inkMuted,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Also in this panel
      </div>

      <p
        style={{
          fontSize: "clamp(16px, 1.8vw, 19px)",
          lineHeight: 1.65,
          color: C.inkSoft,
          letterSpacing: "-0.005em",
          margin: 0,
        }}
      >
        Of your <strong style={emphasis}>{panelTotal} markers</strong>,{" "}
        <strong style={emphasis}>{panelFlagged}</strong>{" "}
        {panelFlagged === 1 ? "needs" : "need"} attention and{" "}
        <strong style={emphasis}>{panelInRange}</strong>{" "}
        {panelInRange === 1 ? "sits" : "sit"} comfortably in range.
        {flagged.length > 0 && <FlaggedSentence markers={flagged} />}
        {normal.length > 0 && <NormalSentence markers={normal} />}
      </p>
    </motion.section>
  );
}

// Single emphasis treatment: slightly darker ink, weight 600, same size.
// No mono, no color, no size change.
const emphasis: React.CSSProperties = {
  color: C.ink,
  fontWeight: 600,
};

// ============================================================================
// FlaggedSentence - one sentence for the markers that need attention
// ============================================================================

function FlaggedSentence({ markers }: { markers: MarkerChange[] }) {
  if (markers.length === 0) return null;

  if (markers.length === 1) {
    const m = markers[0];
    return (
      <>
        {" "}Your{" "}
        <strong style={emphasis}>
          {m.plainName.toLowerCase()}
        </strong>{" "}
        ticked up to{" "}
        <strong style={emphasis}>
          {m.currentValue} {m.unit}
        </strong>
        , just over the line and worth watching.
      </>
    );
  }

  return (
    <>
      {" "}Your{" "}
      {markers.map((m, i) => (
        <React.Fragment key={m.name}>
          {i > 0 && (i === markers.length - 1 ? " and " : ", ")}
          <strong style={emphasis}>{m.plainName.toLowerCase()}</strong>
        </React.Fragment>
      ))}{" "}
      all ticked up a touch, just over the line and worth watching.
    </>
  );
}

// ============================================================================
// NormalSentence - one sentence rolling up everything in range that moved
// ============================================================================

function NormalSentence({ markers }: { markers: MarkerChange[] }) {
  if (markers.length === 0) return null;

  return (
    <>
      {" "}Your{" "}
      {markers.map((m, i) => (
        <React.Fragment key={m.name}>
          {i > 0 && (i === markers.length - 1 ? " and " : ", ")}
          <strong style={emphasis}>{m.plainName.toLowerCase()}</strong>
        </React.Fragment>
      ))}{" "}
      {markers.length === 1 ? "crept up a hair but stayed" : "all crept up a hair but stayed"}{" "}
      well inside normal.
    </>
  );
}
