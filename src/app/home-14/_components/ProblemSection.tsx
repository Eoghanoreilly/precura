"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PROBLEM - Editorial chapter opening.
 *
 * A chapter header ("Ch. 01 / The missed years"), a large pullquote-style
 * statement, and a classic magazine two-column body with a drop cap on
 * the opening paragraph. On the right, a spec-sheet data block with the
 * key statistic set very large.
 */
export function ProblemSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="method"
      style={{
        position: "relative",
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Chapter header row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.rule}`,
            paddingBottom: 20,
            marginBottom: 80,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 01</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              The missed years
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Essay / 4 min read
          </div>
        </div>

        <div
          className="p14-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Left: pullquote + body */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                ...TYPE.chapter,
                margin: 0,
                marginBottom: 48,
                maxWidth: 800,
              }}
            >
              Roughly half of Swedes with{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: C.rust,
                }}
              >
                type 2 diabetes
              </span>{" "}
              do not know they have it.
            </motion.h2>

            {/* Two-column body with drop cap */}
            <div
              className="p14-body"
              style={{
                columnCount: 2,
                columnGap: 40,
                columnRuleColor: C.rule,
                fontSize: 15,
                lineHeight: 1.7,
                color: C.inkSoft,
                maxWidth: 760,
              }}
            >
              <p style={{ margin: 0 }}>
                <span
                  style={{
                    float: "left",
                    fontSize: 78,
                    lineHeight: 0.82,
                    fontWeight: 700,
                    color: C.ink,
                    paddingRight: 8,
                    paddingTop: 6,
                    letterSpacing: "-0.04em",
                  }}
                >
                  T
                </span>
                he data existed, in chunks. One line on a 1177 printout in
                2021. Another on a Cityakuten result in 2023. A third, filed
                quietly, in 2025. Every single reading was technically normal.
                Every single clinician who signed it off was correct.
              </p>
              <p>
                And yet, across five years, a slope had formed. A slope that
                nobody in the system was paid to see, and that the patient, by
                definition, could not see on her own. This is the thesis of
                Precura: the absence of a dot-connector in Swedish primary
                care.
              </p>
              <p>
                Our country has some of the richest longitudinal health data on
                the planet. The missing layer is the one that reads it end to
                end, runs it through a validated risk model, and writes the
                answer back in plain language.
              </p>
            </div>
          </div>

          {/* Right: big statistic block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              borderTop: `2px solid ${C.ink}`,
              borderBottom: `1px solid ${C.rule}`,
              paddingTop: 24,
              paddingBottom: 32,
            }}
          >
            <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 18 }}>
              Figure 01 / SBU 2023
            </div>
            <div
              style={{
                fontSize: "clamp(100px, 14vw, 200px)",
                lineHeight: 0.82,
                letterSpacing: "-0.06em",
                color: C.ink,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              1 in 2
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: C.inkSoft,
                lineHeight: 1.6,
              }}
            >
              Of the estimated 500,000 adults in Sweden living with type 2
              diabetes, roughly half walk around without a diagnosis, often for
              seven to ten years.
            </p>

            <div
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: `1px solid ${C.rule}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {[
                { v: "5y", l: "Median delay" },
                { v: "500k", l: "Affected adults" },
                { v: "93%", l: "Preventable" },
                { v: "40+", l: "Markers we track" },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.inkMuted,
                      marginTop: 6,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.p14-grid) {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          :global(.p14-body) {
            column-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
