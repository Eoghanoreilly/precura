"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PROBLEM - brief, editorial. One big statistic, one short paragraph,
 * one supporting stat row. No huge charts, no heavy motion.
 */
export function ProblemSection() {
  return (
    <section
      style={{
        background: C.creamWarm,
        padding: "120px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              ...TYPE.mono,
              color: C.terra,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            The quiet problem
          </div>

          <h2
            style={{
              ...TYPE.displayL,
              margin: 0,
              maxWidth: 900,
              marginBottom: 28,
            }}
          >
            About half of Swedes with Type 2 diabetes are walking around
            undiagnosed for years. The numbers creep up, nobody connects
            the dots.
          </h2>

          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              maxWidth: 720,
              margin: 0,
              marginBottom: 48,
            }}
          >
            You visit different clinics. Your glucose is a little higher
            each time. Each doctor shrugs and says it is still within range.
            Nobody is looking at the slope across five years, because nobody
            has it on one screen.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              paddingTop: 40,
              borderTop: `1px solid ${C.line}`,
            }}
            className="home20-problem-stats"
          >
            <Stat
              value="~50%"
              label="of Swedes with Type 2 diabetes are undiagnosed"
              source="Nordic Diabetes Study 2022"
            />
            <Stat
              value="7.5y"
              label="average delay from first warning sign to diagnosis"
              source="Lancet Diabetes Endocrinol"
            />
            <Stat
              value="22"
              label="biomarkers we track, every quarter, for every member"
              source="included in your membership"
            />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home20-problem-stats) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Stat({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "clamp(44px, 5vw, 72px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: C.terra,
          marginBottom: 12,
        }}
      >
        {value}
      </div>
      <div
        style={{
          ...TYPE.body,
          color: C.ink,
          marginBottom: 6,
          maxWidth: 260,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...TYPE.tiny,
          color: C.inkFaint,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {source}
      </div>
    </div>
  );
}
