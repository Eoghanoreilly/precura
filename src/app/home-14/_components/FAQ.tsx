"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FAQ - Editorial "letters page". Items read like printed Q&A,
 * with large numerical markers and spring-based expand/collapse.
 */
export function FAQ() {
  const items = [
    {
      q: "How is this different from Werlabs or a private vardcentral?",
      a: "Werlabs gives you one snapshot, this quarter. A private GP gives you their clinical opinion on that one visit. Precura pulls your whole five-year history from 1177, runs validated risk models (FINDRISC, SCORE2, FRAX, SDPP), ties them to a personal doctor and a coach, and keeps updating every 90 days. You get the trajectory, not the dot.",
    },
    {
      q: "Is my data safe, and where does it live?",
      a: "All data is stored on Swedish servers, under GDPR and Patientdatalagen. We never sell data, ever. You can export the whole record as a FHIR bundle with one click, and delete your account permanently at any time from your profile.",
    },
    {
      q: "Does Precura replace my own vardcentral?",
      a: "No, and we deliberately do not want to. Precura is preventive. We catch slopes years before they become diagnoses, and we refer you to your GP or a specialist if anything crosses a clinical threshold. If you want, we send our doctor note directly to your own GP.",
    },
    {
      q: "Which biomarkers are in the panel?",
      a: "Annual and Precura+ include 40+ markers: HbA1c (long-term blood sugar), fasting glucose, fasting insulin, ApoB, LDL, HDL, triglycerides, hs-CRP (inflammation), Omega-3 index, liver panel (ALT, AST, GGT), kidney (creatinine, eGFR), thyroid (TSH, T3, T4), Vitamin D, B12, ferritin, and more. Essentials covers 12 core markers.",
    },
    {
      q: "Who actually reviews the results?",
      a: "Every result is reviewed by a Swedish licensed doctor before you see it. Our medical lead is Dr. Marcus Johansson, an internal medicine physician trained at Karolinska Institutet with 15+ years in primary care. You get a plain-English note on every result, flagging anything that needs attention.",
    },
    {
      q: "Can I cancel?",
      a: "Yes, any time, with one click from your profile. If you prepaid for a year we refund the unused months pro-rata, no questions asked.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      style={{
        position: "relative",
        background: C.paperSoft,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 10</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Letters & answers
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Q&amp;A / 6 questions
          </div>
        </div>

        <h2 style={{ ...TYPE.chapter, margin: 0, marginBottom: 80 }}>
          The real{" "}
          <span style={{ fontStyle: "italic", fontWeight: 500 }}>
            questions.
          </span>
        </h2>

        <div
          style={{
            borderTop: `2px solid ${C.ink}`,
          }}
        >
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  borderBottom: `1px solid ${C.rule}`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    all: "unset",
                    display: "grid",
                    gridTemplateColumns: "52px 1fr auto",
                    gap: 20,
                    width: "100%",
                    padding: "28px 0",
                    cursor: "pointer",
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.rust,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Q.{String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(19px, 2vw, 26px)",
                      fontWeight: isOpen ? 600 : 500,
                      color: C.ink,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.25,
                    }}
                  >
                    {it.q}
                  </div>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      position: "relative",
                      alignSelf: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: 1,
                        background: C.ink,
                      }}
                    />
                    <motion.div
                      animate={{ rotate: isOpen ? 0 : 90 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        width: 1,
                        background: C.ink,
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.35, delay: 0.1 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "52px 1fr 24px",
                          gap: 20,
                          paddingBottom: 32,
                        }}
                      >
                        <div />
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: C.inkSoft,
                            maxWidth: 760,
                          }}
                        >
                          {it.a}
                        </p>
                        <div />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
