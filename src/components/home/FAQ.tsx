"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * FAQ - Animated accordion with 6 real questions. Editorial left-column
 * label, right column of expandable rows. Warm divider lines, no card
 * shells. Plus icon rotates to X on open.
 */
export function FAQ() {
  const questions = [
    {
      q: "Is Precura a replacement for my GP?",
      a: "No. Precura is a predictive health service, not a diagnostic clinic. We do not diagnose or treat medical conditions. If Dr. Tomas spots something that needs investigation, he refers you to your regular vardcentral or a specialist. Think of us as the layer that catches trajectories early, not the people who treat disease.",
    },
    {
      q: "How is this different from Werlabs or a normal blood test?",
      a: "Werlabs gives you a snapshot. Precura gives you a trajectory. We pull your 1177 history, connect it to every new panel, and show the 5-year arc. Every result is reviewed by the same licensed doctor (Dr. Tomas Kurakovas). And when your numbers change, your training plan changes. A one-off panel cannot do that.",
    },
    {
      q: "Is Dr. Tomas a real doctor I actually talk to?",
      a: "Yes. Dr. Tomas Kurakovas is a Karolinska-trained GP with over 15 years in primary care, licensed by Socialstyrelsen. He personally reviews every new member's baseline panel, writes the first note, and replies to messages within 24 hours (12 hours on Plus). You see his face, you see his handwriting, you can book a call.",
    },
    {
      q: "Is the coaching real coaching or just an AI bot?",
      a: "Real coaching. Your Member plan includes a certified human coach who builds a training plan around your actual blood markers, checks in every week, and adjusts the plan based on your numbers. The AI chat is separate, and it is there for quick questions about your data. The plan itself is written by a person.",
    },
    {
      q: "Where does my health data live? Is it safe?",
      a: "Your data is stored in the EU on GDPR-compliant infrastructure, encrypted at rest and in transit. We never sell, rent, or share your data with advertisers, insurers, or employers. You own it. You can export everything as a FHIR bundle or delete your account at any time from your profile. Precura complies with GDPR and Swedish patientdatalagen.",
    },
    {
      q: "Can I cancel, and what happens to my panels if I do?",
      a: "Cancel anytime in one tap from your profile. You keep access through the end of your annual period and get a 30-day full refund if you cancel within your first month. Your historical data stays yours forever. If you rejoin later, your living profile is still there waiting for you.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{
        background: C.canvasDeep,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.8fr 1.4fr",
          gap: 72,
          alignItems: "flex-start",
        }}
        className="home17-faq-grid"
      >
        {/* Left - label and headline */}
        <div style={{ position: "sticky", top: 100 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.terracotta,
              marginBottom: 16,
            }}
          >
            Questions, answered plainly
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "clamp(36px, 4.4vw, 58px)",
              lineHeight: 1.02,
              letterSpacing: "-0.032em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              marginBottom: 24,
            }}
          >
            The six things{" "}
            <span
              style={{
                color: C.terracotta,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              most people ask first.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 320,
            }}
          >
            If something is missing, write to hello@precura.se. A real human
            will reply, usually within a few hours.
          </motion.p>
        </div>

        {/* Right - accordion */}
        <div>
          {questions.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  borderBottom: `1px solid ${C.lineCard}`,
                  borderTop: i === 0 ? `1px solid ${C.lineCard}` : "none",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    padding: "28px 4px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    color: C.ink,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(18px, 1.9vw, 22px)",
                      fontWeight: 600,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.3,
                      color: isOpen ? C.terracotta : C.ink,
                      transition: "color 0.25s ease",
                      paddingRight: 12,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: isOpen ? C.terracotta : C.paper,
                      border: `1px solid ${
                        isOpen ? C.terracotta : C.lineCard
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.25s ease, border-color 0.25s ease",
                      boxShadow: C.shadowSoft,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <path
                        d="M7 1 V13 M1 7 H13"
                        stroke={isOpen ? C.canvasSoft : C.ink}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
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
                          padding: "0 60px 32px 4px",
                          fontSize: 16,
                          lineHeight: 1.65,
                          color: C.inkMuted,
                          maxWidth: 640,
                        }}
                      >
                        {item.a}
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
        @media (max-width: 900px) {
          :global(.home17-faq-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          :global(.home17-faq-grid > div:first-child) {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
