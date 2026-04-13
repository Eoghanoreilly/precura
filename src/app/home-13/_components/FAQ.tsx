"use client";

/**
 * FAQ - 6 real questions, accordion style. Each expands with a
 * layout animation. One open at a time.
 */

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

const items = [
  {
    q: "Is this a replacement for my regular GP at Vardcentralen?",
    a: "No. Precura sits alongside your Vardcentral. We look at your trajectory over years, not at urgent care. If something serious comes up, Dr. Johansson will always point you to a physical appointment. Think of us as your long-term health memory.",
  },
  {
    q: "How is this different from Werlabs or Kry?",
    a: "Werlabs hands you a static PDF once a year. Kry handles acute visits. Precura runs six validated risk models on your full history, assigns you a specific Swedish GP, gives you a personal coach, and updates everything every six months. It is built around your trajectory, not around a single test or a single visit.",
  },
  {
    q: "Who reviews my results? Is it actually a real doctor?",
    a: "Yes. Dr. Marcus Johansson, our medical lead, is a Karolinska-trained Leg. lakare with 15+ years in primary care. He personally reviews and signs off every panel. Not an algorithm. A human doctor whose name is on the report.",
  },
  {
    q: "What happens to my data? Is it private?",
    a: "Your data stays in Sweden on servers run by a GDPR-compliant Swedish provider. Signed in with BankID. Imported from 1177 only with your explicit consent, and you can revoke it any time. FHIR export is always free so your data is never locked inside Precura.",
  },
  {
    q: "Is there a commitment if I join the Annual plan?",
    a: "No minimum term. Cancel any time inside the app, no email back-and-forth. If you paid for a year up front, we refund the unused months pro-rata. The blood you have already drawn and the profile you have already built is yours to keep.",
  },
  {
    q: "What does the training plan actually look like?",
    a: "Real workouts, not step counts. Exercises, sets, reps, weights, rest periods, built into a weekly structure by a human exercise physiologist. It updates automatically when your next panel comes in, because training to lower fasting insulin looks different than training for cardiovascular output.",
  },
];

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      style={{
        background: C.creamSoft,
        color: C.ink,
        padding: "160px 36px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 80,
        }}
        className="home13-faq-grid"
      >
        <div style={{ position: "sticky", top: 120, alignSelf: "flex-start" }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ ...TYPE.mono, color: C.amber, marginBottom: 24 }}
          >
            10  /  FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            style={{ ...TYPE.displayLarge, color: C.ink, margin: 0 }}
          >
            Six honest{" "}
            <span
              style={{
                color: C.amberDeep,
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              answers.
            </span>
          </motion.h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.15 + i * 0.06,
                  ease: EASE,
                }}
                style={{
                  background: C.paper,
                  border: `1px solid ${C.line}`,
                  borderRadius: 18,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    padding: "22px 28px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontFamily: SYSTEM_FONT,
                    fontSize: 17,
                    fontWeight: 500,
                    color: C.ink,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {it.q}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: isOpen ? C.ink : C.creamSoft,
                      color: isOpen ? C.cream : C.ink,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "0 28px 26px",
                          color: C.inkMid,
                          fontSize: 15,
                          lineHeight: 1.6,
                          maxWidth: 640,
                        }}
                      >
                        {it.a}
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
          :global(.home13-faq-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
