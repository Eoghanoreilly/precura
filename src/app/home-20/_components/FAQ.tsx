"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FAQ - six questions, animated accordion. Warm paper cards on cream.
 * Only one open at a time. No left borders.
 */

type Q = {
  q: string;
  a: string;
};

const ITEMS: Q[] = [
  {
    q: "Does Precura diagnose medical conditions?",
    a: "No. Precura is a predictive health subscription, not a diagnostic service. Dr. Marcus writes plain-English notes and can flag anything that needs attention, but a formal diagnosis still happens in primary care. When needed, we help you book a referral through the Swedish system.",
  },
  {
    q: "How is this different from Werlabs or a regular blood test?",
    a: "Werlabs gives you a one-off lab report. Precura builds a five-year trajectory, runs it through validated risk models, gets a Swedish GP to write you a personal note, and keeps updating the same profile every quarter. It is the slope, not the snapshot, plus a real human reading it.",
  },
  {
    q: "Is Dr. Marcus an actual doctor or a chatbot?",
    a: "Dr. Marcus Johansson is a real Swedish GP, Karolinska-trained, with 15+ years in primary care. He personally reviews every member profile and writes the notes. The AI chat is a separate tool, clearly labeled as AI, that answers questions from your own data without replacing the doctor.",
  },
  {
    q: "What does the coach actually do?",
    a: "Your assigned coach is a human, not a chatbot. They review your latest panel, build a training plan with real exercises, sets and reps based on your bloodwork, and check in with you once a month. They translate Dr. Marcus's clinical notes into specific, doable actions. Not generic 'exercise more' advice.",
  },
  {
    q: "Where is my data stored and who can see it?",
    a: "Your health data is stored on EU servers in Stockholm, GDPR compliant, encrypted at rest and in transit. Only you, Dr. Marcus and your assigned coach can see it. We do not sell data, we do not train AI models on your data, and you can export a full FHIR copy or delete everything with one click at any time.",
  },
  {
    q: "Can I cancel, and what happens to my profile if I do?",
    a: "Yes, cancel any time from your profile settings. There is a full refund in the first 30 days. If you cancel later, your profile freezes on the last test and you can export everything as FHIR. Rejoin any time and your full history is still there. Your data is yours, always.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section
      style={{
        background: C.cream,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 48,
            alignItems: "flex-end",
            marginBottom: 56,
          }}
          className="home20-faq-header"
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.terra,
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Common questions
            </div>
            <h2 style={{ ...TYPE.displayL, margin: 0 }}>
              The things people actually ask us.
            </h2>
          </div>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 420,
            }}
          >
            We wrote these with Dr. Marcus. If you have a question that is
            not here, you can message us before you sign up.
          </p>
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: isOpen ? C.paper : "rgba(255,255,255,0.62)",
                  borderRadius: 20,
                  border: `1px solid ${isOpen ? C.line : C.lineFaint}`,
                  boxShadow: isOpen ? C.shadowSoft : "none",
                  transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "24px 28px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: SYSTEM_FONT,
                    color: C.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                  }}
                >
                  <span
                    style={{
                      ...TYPE.h3,
                      fontSize: 19,
                      fontWeight: 600,
                      margin: 0,
                      color: C.ink,
                    }}
                  >
                    {item.q}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 50,
                      border: `1px solid ${isOpen ? C.terra : C.line}`,
                      background: isOpen ? C.terra : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.4s",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{
                        transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                      }}
                    >
                      <path
                        d="M7 1.5v11M1.5 7h11"
                        stroke={isOpen ? C.cream : C.inkSoft}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
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
                        opacity: { duration: 0.3 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "0 28px 28px 28px",
                          borderTop: `1px solid ${C.lineFaint}`,
                          marginTop: 0,
                          paddingTop: 20,
                        }}
                      >
                        <p
                          style={{
                            ...TYPE.body,
                            color: C.inkSoft,
                            margin: 0,
                            maxWidth: 720,
                            lineHeight: 1.65,
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

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home20-faq-header) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
