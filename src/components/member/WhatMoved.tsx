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
 * WhatMoved - rewritten from a metric grid to editorial prose.
 *
 * Previous version was a 1/2/3-column grid of identical tiles
 * (name, value, delta). Adversarial review flagged this as exactly
 * the SaaS dashboard pattern the product was supposed to reject.
 *
 * New version composes one sentence per marker: "Your total cholesterol
 * came in at 5.1, just over the normal line." Same data, brand voice.
 * Values are bolded and tinted by status color so the data still pops;
 * the surrounding prose is the voice of the product speaking to Anna.
 */
export function WhatMoved({ markers }: { markers: MarkerChange[] }) {
  if (markers.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{
        margin: "0 20px 18px",
        padding: "22px 24px 20px",
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
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Also moved in this panel
      </div>

      <div
        style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: C.inkSoft,
          letterSpacing: "-0.005em",
        }}
      >
        {markers.map((m, i) => (
          <MarkerSentence key={m.name} marker={m} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

// ============================================================================
// MarkerSentence - builds one prose sentence per marker.
// ============================================================================

function MarkerSentence({
  marker,
  index,
}: {
  marker: MarkerChange;
  index: number;
}) {
  const delta = Number(
    (marker.currentValue - marker.previousValue).toFixed(2)
  );
  const deltaDir =
    delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const color =
    marker.status === "normal"
      ? C.good
      : marker.status === "borderline"
      ? C.caution
      : C.risk;

  // Prose templates per status + direction
  const trailing = buildTrailing(marker, deltaDir);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "8px 0",
        borderTop: index === 0 ? "none" : `1px solid ${C.lineSoft}`,
      }}
    >
      {/* Status dot */}
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          marginTop: 10,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        Your{" "}
        <span style={{ color: C.ink, fontWeight: 500 }}>
          {marker.plainName.toLowerCase()}
        </span>{" "}
        came in at{" "}
        <span
          style={{
            ...DISPLAY_NUM,
            fontSize: 16,
            color: color,
          }}
        >
          {marker.currentValue}
        </span>
        <span style={{ color: C.inkMuted }}> {marker.unit}</span>
        {trailing}
      </div>
    </motion.div>
  );
}

function buildTrailing(
  marker: MarkerChange,
  deltaDir: "up" | "down" | "flat"
): React.ReactNode {
  // Each case returns a short clause after the value.
  // Borderline = over/near the line. Abnormal = out of range.
  // Normal = in range but moved.

  const delta = Math.abs(
    Number((marker.currentValue - marker.previousValue).toFixed(2))
  );

  if (marker.status === "abnormal") {
    return (
      <>
        , outside the normal range.{" "}
        <em
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: C.inkMuted,
          }}
        >
          Dr. Tomas will flag this in his next note.
        </em>
      </>
    );
  }

  if (marker.status === "borderline") {
    if (deltaDir === "up") {
      return (
        <>
          , a touch over the line.{" "}
          <em
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: C.inkMuted,
            }}
          >
            Worth keeping an eye on.
          </em>
        </>
      );
    }
    return (
      <>
        , right at the edge of normal.{" "}
        <em
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: C.inkMuted,
          }}
        >
          Holding steady.
        </em>
      </>
    );
  }

  // Normal but moved
  if (deltaDir === "down") {
    return (
      <>
        , down {delta} from last time.{" "}
        <em
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: C.inkMuted,
          }}
        >
          Moving the right way.
        </em>
      </>
    );
  }
  if (deltaDir === "up") {
    return (
      <>
        , up {delta} from last time, still in range.
      </>
    );
  }
  return <>, unchanged.</>;
}
