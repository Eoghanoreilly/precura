"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "./tokens";

export interface MarkerChange {
  name: string;
  plainName: string;
  unit: string;
  previousValue: number;
  currentValue: number;
  status: "normal" | "borderline" | "abnormal";
}

/**
 * WhatMoved - pass 6 rewrite as a single prose paragraph.
 *
 * Previous version was a row-per-marker with colored dots and inline deltas -
 * adversarial review called it "a list masquerading as prose". This version
 * is one paragraph that names each marker inside a flowing sentence, with
 * the values inlined as small tabular-display spans. No bullets, no dots,
 * no hairlines. Reads like a letter, not a dashboard.
 *
 * Also folds in the panel summary counts that used to live in a separate
 * PanelSummary card ("of your X markers, Y need attention and Z are in
 * range") because that card was the same "traffic-light score in a trench
 * coat" problem.
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

  // Group markers by status so we can write natural clauses.
  const borderlineUp: MarkerChange[] = [];
  const normalMoved: MarkerChange[] = [];

  for (const m of markers) {
    if (m.status === "borderline") borderlineUp.push(m);
    else normalMoved.push(m);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{
        margin: "0 20px 18px",
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
        Of the{" "}
        <InlineValue value={panelTotal} color={C.ink} />{" "}
        markers in this panel,{" "}
        <InlineValue value={panelFlagged} color={C.caution} />{" "}
        {panelFlagged === 1 ? "needs" : "need"} attention and{" "}
        <InlineValue value={panelInRange} color={C.good} />{" "}
        {panelInRange === 1 ? "sits" : "sit"} comfortably in range.{" "}
        <BorderlineClause markers={borderlineUp} />
        <NormalClause markers={normalMoved} />
        Everything else held.
      </p>
    </motion.section>
  );
}

// ============================================================================
// InlineValue - shared tabular display numeral inline in a sentence
// ============================================================================

function InlineValue({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <span
      style={{
        ...DISPLAY_NUM,
        fontSize: 20,
        color: color,
        verticalAlign: "baseline",
      }}
    >
      {value}
    </span>
  );
}

function InlineMarker({
  name,
  value,
  unit,
  color,
}: {
  name: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <>
      <span style={{ color: C.ink, fontWeight: 500 }}>{name}</span>{" "}
      <span
        style={{
          ...DISPLAY_NUM,
          fontSize: 17,
          color: color,
        }}
      >
        {value}
      </span>{" "}
      <span style={{ color: C.inkFaint, fontSize: "0.85em" }}>{unit}</span>
    </>
  );
}

// ============================================================================
// Clause builders - each returns a React fragment to splice into the paragraph
// ============================================================================

function BorderlineClause({ markers }: { markers: MarkerChange[] }) {
  if (markers.length === 0) return null;

  if (markers.length === 1) {
    const m = markers[0];
    return (
      <>
        Your{" "}
        <InlineMarker
          name={m.plainName.toLowerCase()}
          value={m.currentValue}
          unit={m.unit}
          color={C.caution}
        />{" "}
        ticked up a touch,{" "}
        <em
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: C.inkMuted,
          }}
        >
          just over the line and worth watching.
        </em>{" "}
      </>
    );
  }

  return (
    <>
      {markers.map((m, i) => (
        <React.Fragment key={m.name}>
          {i === 0 ? "Your " : i === markers.length - 1 ? " and your " : ", your "}
          <InlineMarker
            name={m.plainName.toLowerCase()}
            value={m.currentValue}
            unit={m.unit}
            color={C.caution}
          />
        </React.Fragment>
      ))}
      {" "}both ticked up a touch,{" "}
      <em
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          color: C.inkMuted,
        }}
      >
        just over the line and worth watching.
      </em>{" "}
    </>
  );
}

function NormalClause({ markers }: { markers: MarkerChange[] }) {
  if (markers.length === 0) return null;

  return (
    <>
      {markers.map((m, i) => (
        <React.Fragment key={m.name}>
          {i === 0
            ? "Your "
            : i === markers.length - 1
            ? " and your "
            : ", your "}
          <InlineMarker
            name={m.plainName.toLowerCase()}
            value={m.currentValue}
            unit={m.unit}
            color={C.good}
          />
        </React.Fragment>
      ))}
      {" "}crept up a hair but held well inside normal.{" "}
    </>
  );
}
