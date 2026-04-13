"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS } from "./tokens";

/**
 * FAQ
 *
 * Accordion list with one open at a time. Centered header, wide rounded
 * panel, gentle height animation. Plain-English answers, no filler.
 */

const QUESTIONS = [
  {
    q: "Is this a medical diagnosis?",
    a: "No. Precura is a health decision support product. We turn your bloodwork, family history and lifestyle into clear trends and risk estimates, and a Swedish doctor reviews them. If something looks serious we will tell you to see your regular GP or a specialist. We do not prescribe medication and we are not a medical device.",
  },
  {
    q: "How is this different from a normal lab like Werlabs?",
    a: "Werlabs sells you a blood test and gives you a PDF. We give you the interpretation, the trend across every past test, the family risk, the risk model scores and a real doctor who writes you a plain-English note on every panel. It is a relationship, not a transaction. You also get a coach and a training plan, which no lab offers.",
  },
  {
    q: "Do I get a real doctor, or is this just AI?",
    a: "You get a real doctor. Dr. Marcus Johansson is a Swedish-licensed GP, Karolinska-trained, with over fifteen years in primary care. He reviews every panel personally, leaves a signed note, and answers secure messages inside the app. The AI is there to help you search your own history and explain terms, not to replace a clinician.",
  },
  {
    q: "How does the coaching work?",
    a: "On the Member and Plus tiers you are assigned a human coach, not a chatbot. They build your training plan around your actual metabolic profile. Real exercises, real sets, real reps, real weights. When your next blood panel comes in they rebuild the plan around the markers that moved. You can message them inside the app.",
  },
  {
    q: "Is my health data safe?",
    a: "Yes. All your data is stored in EU data centres, encrypted at rest and in transit. We are GDPR compliant, and you can export your full record as FHIR JSON or delete everything with one click. We never sell, rent or share your data, and we never use it to train outside models.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Every tier is an annual membership that renews yearly, and you can cancel from inside the app in two taps. If you cancel mid-year we honour the remaining panel allowance until the membership ends. Nothing is locked behind a contract.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{
        background: COLORS.bgSoft,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 140px",
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            textAlign: "center",
            maxWidth: 720,
            margin: "0 auto 56px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: COLORS.sageSoft,
              color: COLORS.sage,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Questions
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(32px, 4.6vw, 54px)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.028em",
            }}
          >
            Answers, before you ask.
          </h2>
          <p
            style={{
              margin: "20px auto 0",
              fontSize: 17,
              lineHeight: 1.6,
              color: COLORS.inkSoft,
              maxWidth: 580,
            }}
          >
            The six things everyone has asked us since we opened in Stockholm.
            If yours is not here, message us and we will add it.
          </p>
        </motion.div>

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{
            background: COLORS.bgPaper,
            borderRadius: RADIUS.cardLarge,
            border: `1px solid ${COLORS.line}`,
            boxShadow: COLORS.shadowSoft,
            padding: "16px 8px",
          }}
        >
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                style={{
                  borderBottom:
                    i === QUESTIONS.length - 1
                      ? "none"
                      : `1px solid ${COLORS.lineSoft}`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: "24px 28px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    color: COLORS.ink,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      letterSpacing: "-0.012em",
                      color: COLORS.ink,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      background: isOpen ? COLORS.coral : COLORS.bgCream,
                      border: isOpen
                        ? "1px solid transparent"
                        : `1px solid ${COLORS.line}`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    {isOpen ? (
                      <Minus size={16} style={{ color: "#FFFFFF" }} strokeWidth={2.5} />
                    ) : (
                      <Plus size={16} style={{ color: COLORS.ink }} strokeWidth={2.5} />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "0 28px 28px",
                          fontSize: 16,
                          lineHeight: 1.65,
                          color: COLORS.inkSoft,
                          maxWidth: 760,
                        }}
                      >
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
