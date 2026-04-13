"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS } from "./tokens";

/**
 * PROBLEM - Single bold statement + three supporting stats.
 * Short, punchy, warm. No scroll pinning, just a fade-in on view.
 */
export function ProblemSection() {
  const stats = [
    {
      value: "~50%",
      label: "of Swedes with Type 2 diabetes go undiagnosed for years",
    },
    {
      value: "10 min",
      label: "average consultation with a Swedish GP before a referral",
    },
    {
      value: "1x/year",
      label: "is the most bloodwork most people ever see in one chart",
    },
  ];

  return (
    <section
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "80px 32px 100px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: COLORS.coralTint,
              color: COLORS.coralDeep,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <AlertCircle size={13} />
            The problem
          </span>
        </motion.div>

        {/* Statement */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            margin: "18px 0 32px",
            fontSize: "clamp(32px, 4.6vw, 56px)",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            maxWidth: 900,
          }}
        >
          Your bloodwork told the story.{" "}
          <span style={{ color: COLORS.inkMuted }}>
            Nobody read it across five years.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            margin: "0 0 48px",
            fontSize: 19,
            lineHeight: 1.6,
            color: COLORS.inkSoft,
            maxWidth: 700,
          }}
        >
          Most tests come back &quot;within normal range.&quot; That word,
          normal, hides the trend. The number that rose. The family risk nobody
          joined to the chart. Precura is the layer that reads it all at once.
        </motion.p>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
          }}
          className="home16-stats-row"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              style={{
                background: COLORS.bgPaper,
                borderRadius: RADIUS.card,
                padding: "28px 26px",
                border: `1px solid ${COLORS.line}`,
                boxShadow: COLORS.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  color: COLORS.coral,
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: COLORS.inkSoft,
                  lineHeight: 1.45,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          :global(.home16-stats-row) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
