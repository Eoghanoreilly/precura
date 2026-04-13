"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FAQ - Technique: Physics-based spring accordion. The expand/collapse
 * uses a spring tween so the motion feels weighted, not linear. Plus a
 * rotating icon and a fading number stamp on the left that reveals as
 * the item expands.
 */
export function FAQ() {
  const items = [
    {
      q: "How is Precura different from Werlabs or a private GP?",
      a: "Werlabs and most private labs give you a single snapshot: 'here are your numbers this quarter'. We go further. We pull your five-year blood test history from 1177, run validated risk models (FINDRISC for diabetes, SCORE2 for heart, FRAX for bone), and a Swedish doctor reviews every result. You get a trajectory, not just a reading.",
    },
    {
      q: "Is my data safe? Where does it live?",
      a: "All data is stored in Sweden on GDPR-compliant infrastructure. We are a Swedish company, bound by Patientdatalagen. We never sell data, and you can export everything as a FHIR bundle or delete your account with one click at any time.",
    },
    {
      q: "Does Precura replace my doctor?",
      a: "No, and we explicitly don't want to. Precura is preventive. We catch the slope years before it becomes a diagnosis and we'll always refer you to your GP or a specialist if anything crosses a clinical threshold. We send our doctor's note to your GP if you want.",
    },
    {
      q: "What blood markers do you test?",
      a: "The Annual and Precura+ plans include 22 markers: HbA1c, fasting glucose, fasting insulin, full lipid panel (TC, HDL, LDL, triglycerides), liver panel (ALT, AST, GGT), kidney (creatinine, eGFR), inflammation (CRP), thyroid (TSH), Vitamin D, Vitamin B12, ferritin, and more. Essentials covers 12 core markers.",
    },
    {
      q: "Who reviews the results?",
      a: "Every result is reviewed by a Swedish licensed doctor before you see it. Our lead clinician is Dr. Marcus Johansson, an internal medicine physician from Karolinska with 14 years in primary care. You get a plain-English note alongside each result, flagging anything that needs attention.",
    },
    {
      q: "Can I cancel?",
      a: "Yes, any time, with one click from your profile. If you prepaid for a year, we refund the unused months on a pro-rated basis, no questions asked.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      style={{
        background: C.creamSoft,
        padding: "160px 32px 160px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.amber,
                padding: "6px 12px",
                border: `1px solid ${C.amber}`,
                borderRadius: 100,
                display: "inline-block",
                marginBottom: 20,
              }}
            >
              08 / QUESTIONS
            </div>
            <h2
              style={{
                ...TYPE.displayLarge,
                margin: 0,
              }}
            >
              The real{" "}
              <span style={{ color: C.amber, fontStyle: "italic" }}>
                questions
              </span>
              .
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  borderTop: i === 0 ? `1px solid ${C.line}` : "none",
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    padding: "28px 0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: SYSTEM_FONT,
                    color: C.ink,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span
                      style={{
                        ...TYPE.mono,
                        color: isOpen ? C.amber : C.inkMuted,
                        minWidth: 24,
                        transition: "color 0.5s",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(20px, 2vw, 26px)",
                        fontWeight: 500,
                        letterSpacing: "-0.015em",
                        lineHeight: 1.25,
                        color: C.ink,
                      }}
                    >
                      {item.q}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 50,
                      background: isOpen ? C.amber : C.paper,
                      border: `1px solid ${isOpen ? C.amber : C.line}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.5s, border 0.5s",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M9 2V16M2 9H16"
                        stroke={isOpen ? C.ink : C.inkSoft}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        },
                        opacity: { duration: 0.3 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          paddingLeft: 44,
                          paddingBottom: 28,
                          paddingRight: 44,
                        }}
                      >
                        <p
                          style={{
                            ...TYPE.body,
                            color: C.inkSoft,
                            margin: 0,
                            maxWidth: 720,
                          }}
                        >
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
