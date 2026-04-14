"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * PROBLEM - Brief, punchy, single row of data.
 * Three stats. No fluff. Sets up Anna's story.
 */
export function ProblemStrip() {
  const stats = [
    {
      value: "1 in 2",
      label: "Swedes with type 2 diabetes are undiagnosed",
      source: "Nationella Diabetesregistret, 2024",
    },
    {
      value: "7 years",
      label: "Average delay from onset to diagnosis",
      source: "Socialstyrelsen",
    },
    {
      value: "6 mins",
      label: "Average time your GP spends reviewing a blood test",
      source: "Svensk allmanmedicin",
    },
  ];

  return (
    <section
      style={{
        background: C.canvasDeep,
        padding: "72px 32px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(22px, 2.4vw, 32px)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 44,
            maxWidth: 680,
          }}
        >
          The system is good at treatment.
          <br />
          <span style={{ color: C.terracotta }}>
            It&apos;s slow at prediction.
          </span>
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="home17-stats-grid"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
              style={{
                paddingTop: 24,
                borderTop: `1px solid ${C.lineCard}`,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(44px, 5vw, 68px)",
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  color: C.ink,
                  marginBottom: 14,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.45,
                  color: C.inkSoft,
                  marginBottom: 8,
                  maxWidth: 320,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.inkFaint,
                  fontFamily: '"SF Mono", ui-monospace, monospace',
                  letterSpacing: "0.04em",
                }}
              >
                {s.source}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home17-stats-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
