"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PROBLEM - The 50% thesis. Big typographic stat, calm Airbnb voice.
 * No chart, no icons, just a number and a short story.
 */
export function ProblemSection() {
  return (
    <section
      style={{
        padding: "120px 32px 110px",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...TYPE.label,
            color: C.coral,
            marginBottom: 18,
          }}
        >
          The problem
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.displayL,
            margin: 0,
            color: C.ink,
            maxWidth: 900,
          }}
        >
          About{" "}
          <span
            style={{
              color: C.coral,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            half the Swedes
          </span>{" "}
          living with type 2 diabetes do not know they have it yet.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            marginTop: 56,
          }}
          className="home19-problem-grid"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
            }}
          >
            The same is true for high blood pressure, early kidney trouble,
            silent hypothyroidism and a dozen other quiet conditions. By the
            time someone finally sees a doctor, the easy window has already
            closed.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
            }}
          >
            Not because the data was missing. The data existed. Nobody was
            paid to look at it over time, see the slope, and explain what it
            meant in the patient&apos;s own language. Precura is built to do
            exactly that, as a membership.
          </motion.p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            marginTop: 72,
            paddingTop: 40,
            borderTop: `1px solid ${C.line}`,
          }}
          className="home19-stats-grid"
        >
          {[
            { value: "50%", label: "of Swedish T2D undiagnosed" },
            { value: "5 yrs", label: "average lag from data to diagnosis" },
            { value: "40+", label: "biomarkers tracked per member" },
            { value: "4x", label: "blood panels a year on Plus" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  ...TYPE.small,
                  color: C.inkMuted,
                  marginTop: 8,
                  maxWidth: 180,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 840px) {
          :global(.home19-problem-grid) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          :global(.home19-stats-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
