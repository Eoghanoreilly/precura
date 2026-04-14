"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

export interface Category {
  name: string;
  markerCount: number;
  flaggedCount: number;
}

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
        padding: "22px 22px 18px",
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
          marginBottom: 12,
        }}
      >
        Your panel, {panelDate}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 18,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.022em",
              lineHeight: 1,
            }}
          >
            {total}
          </div>
          <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 3 }}>
            markers
          </div>
        </div>
        <div
          style={{
            width: 1,
            alignSelf: "stretch",
            background: C.lineSoft,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: C.caution,
              letterSpacing: "-0.015em",
              lineHeight: 1,
            }}
          >
            {flagged}
          </div>
          <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 3 }}>
            need attention
          </div>
        </div>
        <div
          style={{
            width: 1,
            alignSelf: "stretch",
            background: C.lineSoft,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: C.good,
              letterSpacing: "-0.015em",
              lineHeight: 1,
            }}
          >
            {inRange}
          </div>
          <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 3 }}>
            in range
          </div>
        </div>
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
        {expanded ? "Hide breakdown" : "See by category"}
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
