"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE, IMG } from "./tokens";

/**
 * TRUST & SCIENCE - Editorial "interview" spread.
 *
 * A full-bleed portrait of the doctor on the left, body text right,
 * with footnote citations rendered in mono type at the bottom of the
 * page like a printed academic journal.
 */
export function TrustScience() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id="science"
      ref={ref}
      style={{
        position: "relative",
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Chapter header */}
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
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 07</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Trust & science
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Interview / Departments
          </div>
        </div>

        <div
          className="ts14-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 72,
            alignItems: "start",
          }}
        >
          {/* Portrait column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                paddingBottom: 14,
                borderBottom: `1px solid ${C.rule}`,
                marginBottom: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div style={{ ...TYPE.mono, color: C.inkMuted }}>
                Portrait / Dr. Marcus Johansson
              </div>
              <div style={{ ...TYPE.mono, color: C.inkFaint }}>
                Karolinska
              </div>
            </div>

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 5",
                backgroundImage: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
                filter: "grayscale(28%) contrast(1.05)",
              }}
            />

            <div
              style={{
                paddingTop: 14,
                borderTop: `1px solid ${C.rule}`,
                marginTop: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: C.inkSoft,
                  maxWidth: 280,
                  lineHeight: 1.4,
                }}
              >
                "A slope in the data is worth a hundred normal readings."
              </div>
              <div style={{ ...TYPE.mono, color: C.inkFaint }}>p. 42</div>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 1.1,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h2
              style={{
                ...TYPE.chapter,
                margin: 0,
                marginBottom: 40,
              }}
            >
              The doctor
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 500 }}>
                reads every panel.
              </span>
            </h2>

            <div
              className="ts14-body"
              style={{
                columnCount: 2,
                columnGap: 32,
                fontSize: 15,
                lineHeight: 1.7,
                color: C.inkSoft,
                marginBottom: 48,
              }}
            >
              <p style={{ margin: 0 }}>
                <span
                  style={{
                    float: "left",
                    fontSize: 64,
                    lineHeight: 0.82,
                    fontWeight: 700,
                    color: C.ink,
                    paddingRight: 6,
                    paddingTop: 4,
                    letterSpacing: "-0.04em",
                  }}
                >
                  D
                </span>
                r. Marcus Johansson is the medical lead at Precura. He trained
                at Karolinska Institutet and has spent fifteen years in Swedish
                primary care. He personally reviews every Precura panel,
                writes the note you read, and answers your secure messages
                during the full twelve months of your membership.
              </p>
              <p>
                The risk engine behind the profile uses only models that are
                cited in medical school curricula: FINDRISC for type 2
                diabetes<sup>1</sup>, SCORE2 for cardiovascular risk<sup>2</sup>,
                FRAX for fracture risk<sup>3</sup>, and SDPP for longitudinal
                diabetes prediction<sup>4</sup>.
              </p>
              <p>
                No proprietary algorithms. No scoring systems we cannot show
                the math on. Every score you see comes with the name of the
                paper it was derived from.
              </p>
            </div>

            {/* Footnotes */}
            <div
              style={{
                paddingTop: 20,
                borderTop: `1px solid ${C.ink}`,
              }}
            >
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkMuted,
                  marginBottom: 14,
                }}
              >
                Footnotes
              </div>
              <ol
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: C.inkMuted,
                  counterReset: "fn",
                }}
              >
                {[
                  "Lindstrom J, Tuomilehto J. The Diabetes Risk Score. Diabetes Care 2003; 26(3): 725-731.",
                  "SCORE2 working group. SCORE2 risk prediction algorithms. Eur Heart J 2021; 42(25): 2439-2454.",
                  "Kanis JA et al. FRAX and the assessment of fracture probability. Osteoporos Int 2008; 19(4): 385-397.",
                  "Carlsson AC et al. SDPP: longitudinal diabetes prediction. Diabetologia 2024; 67(4): 712-724.",
                ].map((fn, i) => (
                  <li
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      gap: 10,
                      paddingBottom: 6,
                    }}
                  >
                    <span style={{ color: C.ink }}>[{i + 1}]</span>
                    <span>{fn}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.ts14-grid) {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          :global(.ts14-body) {
            column-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
