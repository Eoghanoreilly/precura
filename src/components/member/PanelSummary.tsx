"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "./tokens";

export interface Category {
  name: string;
  markerCount: number;
  flaggedCount: number;
}

/**
 * PanelSummary - pass 4 rewrite
 *
 * Previous version was a three-column numerical grid ("10 / 3 / 7") with
 * tiny labels. Adversarial review flagged it as "the most generic block
 * on the page - exactly the Function Health grid you said you were
 * rejecting, just compressed to three cells."
 *
 * New version is editorial prose: one sentence framing the rollup, with
 * the counts embedded inline as display-tabular numbers tinted by status.
 * "See the breakdown" expands the category list underneath.
 */
export function PanelSummary({
  total,
  flagged,
  inRange,
  panelDate,
  categories,
}: {
  total: number;
  flagged: number;
  inRange: number;
  panelDate: string;
  categories: Category[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
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
        Your panel, {panelDate}
      </div>

      {/* Editorial sentence with inline tabular numbers */}
      <div
        style={{
          fontSize: 17,
          lineHeight: 1.5,
          color: C.inkSoft,
          letterSpacing: "-0.005em",
          marginBottom: 16,
        }}
      >
        Of the{" "}
        <InlineNumber value={total} color={C.ink} />{" "}
        markers in this panel,{" "}
        <InlineNumber value={flagged} color={C.caution} />{" "}
        {flagged === 1 ? "needs" : "need"} attention and{" "}
        <InlineNumber value={inRange} color={C.good} />{" "}
        {inRange === 1 ? "is" : "are"} in range.
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 600,
          color: C.inkSoft,
          cursor: "pointer",
          letterSpacing: "-0.005em",
          textDecoration: "underline",
          textDecorationColor: C.stone,
          textUnderlineOffset: 4,
        }}
      >
        {expanded ? "Hide breakdown" : "See the breakdown"}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", marginTop: 14 }}
          >
            {categories.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderTop: `1px solid ${C.lineSoft}`,
                  fontSize: 13,
                }}
              >
                <span style={{ color: C.inkSoft, fontWeight: 500 }}>
                  {c.name}
                </span>
                <span style={{ color: C.inkMuted }}>
                  {c.markerCount} markers
                  {c.flaggedCount > 0 && (
                    <span
                      style={{
                        color: C.caution,
                        marginLeft: 8,
                        fontWeight: 600,
                      }}
                    >
                      / {c.flaggedCount} flagged
                    </span>
                  )}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function InlineNumber({
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
