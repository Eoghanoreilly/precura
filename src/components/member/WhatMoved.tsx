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

export function WhatMoved({ markers }: { markers: MarkerChange[] }) {
  if (markers.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{
        padding: "8px 0 14px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          padding: "0 20px 12px",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: 0,
          }}
        >
          What moved
        </h2>
        <span
          style={{
            fontSize: 11,
            color: C.inkFaint,
            fontWeight: 500,
          }}
        >
          Since last panel
        </span>
      </div>

      <div
        className="member-whatmoved-row"
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "4px 20px 14px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          flexWrap: "nowrap",
        }}
      >
        {markers.map((m, i) => {
          const delta = Number((m.currentValue - m.previousValue).toFixed(2));
          const deltaLabel =
            delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "no change";
          const isGood = m.status === "normal";
          const isWatch = m.status === "borderline";
          const dotColor = isGood ? C.good : isWatch ? C.caution : C.risk;
          const deltaColor = isGood ? C.good : isWatch ? C.caution : C.risk;

          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.06 }}
              style={{
                flexShrink: 0,
                width: 172,
                padding: "16px 16px 14px",
                background: C.paper,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 18,
                boxShadow: C.shadowSoft,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: dotColor,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.inkMuted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {m.name}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.inkFaint,
                  marginBottom: 10,
                  lineHeight: 1.3,
                  minHeight: 28,
                }}
              >
                {m.plainName}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: C.ink,
                    letterSpacing: "-0.015em",
                    fontFamily: '"SF Mono", ui-monospace, monospace',
                    lineHeight: 1,
                  }}
                >
                  {m.currentValue}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: C.inkFaint,
                    marginLeft: 2,
                  }}
                >
                  {m.unit}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: deltaColor,
                  letterSpacing: "-0.005em",
                }}
              >
                {deltaLabel} from {m.previousValue}
              </div>
            </motion.div>
          );
        })}
      </div>
      <style jsx>{`
        @media (min-width: 640px) {
          :global(.member-whatmoved-row) {
            flex-wrap: wrap !important;
            overflow-x: visible !important;
          }
          :global(.member-whatmoved-row) > * {
            flex: 1 1 calc(50% - 8px) !important;
            min-width: 0 !important;
            width: auto !important;
          }
        }
      `}</style>
    </motion.section>
  );
}
