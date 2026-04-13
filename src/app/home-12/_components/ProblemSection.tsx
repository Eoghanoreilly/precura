"use client";

/**
 * PROBLEM - the "1 in 2" stat wall. Disciplined 12-column layout,
 * generous leading, section hairline separators.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const stats = [
    {
      headline: "1 in 2",
      body:
        "Swedes with type 2 diabetes are diagnosed years after their metabolism first started drifting. By then the damage to blood vessels, nerves and kidneys has already begun.",
      source: "Socialstyrelsen, 2023",
    },
    {
      headline: "5 years",
      body:
        "The average delay between the earliest detectable glucose rise and a clinical pre-diabetes diagnosis in primary care. The signal is in the data, not in any single reading.",
      source: "SDPP cohort, Stockholm",
    },
    {
      headline: "40+",
      body:
        "Biomarkers tracked across a standard Precura panel, from HbA1c to ApoB to hs-CRP to vitamin D. Your GP usually orders 6 to 10, once a year, and looks at each one alone.",
      source: "Precura panel spec",
    },
  ];

  return (
    <section
      ref={ref}
      id="problem"
      style={{
        background: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: GRID.columnGap,
        }}
      >
        {/* Section header */}
        <div
          style={{
            gridColumn: "span 12",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 40,
            marginBottom: 64,
          }}
        >
          <div style={{ maxWidth: 700 }}>
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 20,
              }}
            >
              01 / The problem
            </div>
            <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink }}>
              The data exists.{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                Nobody reads it in time.
              </span>
            </h2>
          </div>
          <p
            style={{
              ...TYPE.body,
              color: C.inkSoft,
              maxWidth: 360,
              margin: 0,
            }}
          >
            Sweden has world class labs and one of the most digitised health
            systems on earth. The bottleneck is not measurement. It is the
            fifteen minute appointment at your vardcentral.
          </p>
        </div>

        {/* Stat tiles */}
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 1.0,
              delay: 0.15 + i * 0.1,
              ease: EASE.out,
            }}
            style={{
              gridColumn: "span 4",
              paddingTop: 32,
              paddingRight: 20,
              borderTop: `1px solid ${C.line}`,
            }}
            className="home12-problem-tile"
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: "clamp(56px, 5.6vw, 88px)",
                fontWeight: 500,
                color: C.ink,
                letterSpacing: "-0.04em",
                lineHeight: 0.92,
                marginBottom: 22,
              }}
            >
              {s.headline}
            </div>
            <p
              style={{
                ...TYPE.body,
                color: C.inkSoft,
                margin: 0,
                marginBottom: 18,
              }}
            >
              {s.body}
            </p>
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
              }}
            >
              Source / {s.source}
            </div>
          </motion.div>
        ))}

        {/* Closing line under the stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.0, delay: 0.55, ease: EASE.out }}
          style={{
            gridColumn: "3 / span 8",
            marginTop: 80,
            paddingTop: 32,
            borderTop: `1px solid ${C.line}`,
            textAlign: "center",
          }}
          className="home12-problem-closing"
        >
          <p
            style={{
              ...TYPE.h3,
              color: C.ink,
              margin: 0,
              fontWeight: 400,
              fontStyle: "italic",
            }}
          >
            "Every blood test was technically normal. Nobody was looking at
            all five years on one chart."
          </p>
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.inkMuted,
              marginTop: 16,
            }}
          >
            Dr. Marcus Johansson / Precura medical lead
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-problem-tile) {
            grid-column: span 12 !important;
          }
          :global(.home12-problem-closing) {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
