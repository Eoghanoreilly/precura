"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FAQ
 * ---
 * Six real questions a skeptical Swede would ask. Animated accordion,
 * a single question open at a time. Left side: section header + trust
 * anchor. Right side: the accordion. Matches the asymmetric 2-column
 * rhythm of HowItWorks and AnnaStory.
 */

const QUESTIONS = [
  {
    q: "Can Precura diagnose me with a condition?",
    a: "No, and we're very clear about that. Precura is not a replacement for a clinical diagnosis. We give you your numbers, interpret them in plain language, and apply validated risk models like FINDRISC and SCORE2. If your results suggest something your primary care doctor should act on, Dr. Marcus Johansson writes a note telling you exactly what to do next and who to see. Think of Precura as the layer above your care, not a substitute for it.",
  },
  {
    q: "How is this different from Werlabs or a one-off blood test?",
    a: "Werlabs sells you a test. Precura is a membership. You get the panel, yes, but you also get a doctor who reads every result, a coach who builds a plan from those results, a profile that stores and trends your data over time, and the three major risk models applied automatically. A single test tells you where you are on one day. Precura tells you where you're going across years.",
  },
  {
    q: "Is Dr. Marcus a real person who actually reads my results?",
    a: "Yes. Dr. Marcus Johansson is a Karolinska-trained internal medicine physician with 15+ years in Swedish primary care, with a valid Swedish medical license. Every single panel passes through him before it reaches you, and every panel comes back with a written note. He is reachable by message on the Member tier and up. He is not a chatbot and Precura does not use a language model to write his notes.",
  },
  {
    q: "Who are the coaches, and what does a plan actually look like?",
    a: "Our coaches are certified personal trainers based in Sweden. On joining, you're assigned one based on your goals and your nearest city. They build a real training plan: specific exercises, sets, reps, loads, progressions, rest days. Reviewed by Dr. Marcus before it reaches you so it's appropriate for your risk profile. No generic step-count nudges.",
  },
  {
    q: "Where does my data live, and who can see it?",
    a: "Your data is hosted in the EU on GDPR-compliant infrastructure and never leaves Europe. Only you, Dr. Marcus, and your assigned coach can access it, and only the parts relevant to them. You log in with BankID, the Swedish identity standard. You can export your full history in open, portable FHIR format any time. If you cancel, you can take your data with you or ask us to delete it.",
  },
  {
    q: "How do I cancel, and what happens if I do?",
    a: "Cancel from your profile page in three clicks. No phone calls, no retention scripts. If you cancel before using a panel that's already paid for, we issue a pro-rated refund on the unused panels. You keep access to your past results, your doctor's notes, and your training history for 12 months after cancellation, or you can export and wipe everything immediately.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{
        background: C.paper,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: 80,
            alignItems: "flex-start",
          }}
          className="home18-faq-grid"
        >
          {/* Left - header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "sticky", top: 120 }}
            className="home18-faq-sticky"
          >
            <div
              style={{
                ...TYPE.label,
                color: C.lingon,
                marginBottom: 20,
              }}
            >
              Frequently asked
            </div>
            <h2
              style={{
                ...TYPE.displayLarge,
                margin: 0,
                marginBottom: 20,
              }}
            >
              The things a{" "}
              <span style={{ color: C.inkMuted }}>
                skeptical Swede would ask.
              </span>
            </h2>
            <p
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: "0 0 32px",
                maxWidth: 440,
              }}
            >
              If you have a question that isn't here, write to Dr. Marcus
              directly before signing up. Yes, really.
            </p>

            <div
              style={{
                padding: 24,
                background: C.cream,
                borderRadius: 20,
                border: `1px solid ${C.inkLine}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${C.euc}, ${C.eucSoft})`,
                    color: C.paper,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  MJ
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.ink,
                      lineHeight: 1.2,
                    }}
                  >
                    Dr. Marcus Johansson
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.inkMuted,
                      lineHeight: 1.3,
                      marginTop: 2,
                    }}
                  >
                    Medical director
                  </div>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: C.inkSoft,
                  fontStyle: "italic",
                }}
              >
                "If you're unsure whether Precura is right for you, message
                me. I'd rather have an honest no than a confused yes."
              </p>
            </div>
          </motion.div>

          {/* Right - accordion */}
          <div>
            {QUESTIONS.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.06 * i }}
                  style={{
                    borderBottom: `1px solid ${C.inkLine}`,
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "28px 0",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      gap: 24,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: C.ink,
                        letterSpacing: "-0.015em",
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: isOpen ? C.ink : C.canvas,
                        color: isOpen ? C.paper : C.ink,
                        flexShrink: 0,
                        border: `1px solid ${isOpen ? C.ink : C.inkLine}`,
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.25 },
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            ...TYPE.body,
                            color: C.inkSoft,
                            margin: 0,
                            paddingBottom: 28,
                            paddingRight: 56,
                            maxWidth: 680,
                          }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home18-faq-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          :global(.home18-faq-sticky) {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
