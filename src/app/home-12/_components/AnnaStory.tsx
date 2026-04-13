"use client";

/**
 * ANNA'S STORY - a deep dive into a single real patient. Clean 12-column
 * split with the glucose chart on the right and a narrative block on
 * the left. Below: a family-history timeline and two data callouts.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlucoseChart } from "./GlucoseChart";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

export function AnnaStory() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      id="story"
      style={{
        background: C.paperSoft,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
        fontFamily: FONT,
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
        {/* Header */}
        <div style={{ gridColumn: "span 12", marginBottom: 64 }}>
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.inkMuted,
              marginBottom: 20,
            }}
          >
            02 / A real patient
          </div>
          <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink, maxWidth: 900 }}>
            Anna Bergstrom, 40.{" "}
            <span style={{ color: C.accent, fontStyle: "italic" }}>
              Five years of normal.
            </span>
          </h2>
        </div>

        {/* Left narrative + facts */}
        <div
          style={{
            gridColumn: "span 5",
          }}
          className="home12-anna-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.0, delay: 0.2, ease: EASE.out }}
          >
            <p
              style={{
                ...TYPE.lead,
                color: C.inkMid,
                margin: 0,
                marginBottom: 28,
                maxWidth: 520,
              }}
            >
              Anna lives in Sodermalm. She runs twice a week, sleeps well,
              takes 5mg of Enalapril for mild hypertension, and has been
              getting annual bloodwork since 2021.
            </p>
            <p
              style={{
                ...TYPE.body,
                color: C.inkSoft,
                margin: 0,
                marginBottom: 28,
                maxWidth: 520,
              }}
            >
              Every single test was inside the reference range. Every single
              doctor told her she was fine. And over five years, without
              anyone connecting the dots, her fasting glucose drifted from
              5.0 to 5.8 mmol/L. Her mother was diagnosed with type 2
              diabetes at 58. Her father had a heart attack at 65.
            </p>
            <p
              style={{
                ...TYPE.body,
                color: C.inkSoft,
                margin: 0,
                maxWidth: 520,
              }}
            >
              Precura caught the slope. Not the number.
            </p>
          </motion.div>

          {/* Fact strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, delay: 0.4, ease: EASE.out }}
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <FactTile
              label="FINDRISC score"
              value="12 / 26"
              sub="Moderate risk. ~17% 10-year T2D risk"
            />
            <FactTile
              label="Family history"
              value="Mother + father"
              sub="T2D at 58, MI at 65"
            />
            <FactTile
              label="Glucose slope"
              value="+0.16 /yr"
              sub="Linear rise 2021 to 2026"
            />
            <FactTile
              label="HbA1c"
              value="38 mmol/mol"
              sub="Normal, approaching pre-diabetic"
            />
          </motion.div>
        </div>

        {/* Right chart */}
        <div
          style={{
            gridColumn: "span 7",
            display: "flex",
            alignItems: "center",
          }}
          className="home12-anna-right"
        >
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE.out }}
            style={{
              background: C.paperElev,
              border: `1px solid ${C.line}`,
              borderRadius: 20,
              padding: 32,
              boxShadow: C.shadowSm,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPE.eyebrow,
                    color: C.inkMuted,
                    marginBottom: 6,
                  }}
                >
                  Anna Bergstrom / Fasting glucose / mmol/L
                </div>
                <div
                  style={{
                    ...TYPE.h3,
                    color: C.ink,
                    margin: 0,
                  }}
                >
                  The five year slope
                </div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 100,
                  background: C.accentTint,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.accent,
                  }}
                />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: C.accentDeep,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  +16% / 5 yrs
                </span>
              </div>
            </div>
            <GlucoseChart />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-anna-left) {
            grid-column: span 12 !important;
          }
          :global(.home12-anna-right) {
            grid-column: span 12 !important;
            margin-top: 48px;
          }
        }
      `}</style>
    </section>
  );
}

function FactTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      style={{
        padding: "20px 22px",
        background: C.paperElev,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
      }}
    >
      <div
        style={{
          ...TYPE.eyebrow,
          color: C.inkMuted,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 500,
          color: C.ink,
          letterSpacing: "-0.015em",
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          ...TYPE.caption,
          color: C.inkMuted,
        }}
      >
        {sub}
      </div>
    </div>
  );
}
