"use client";

/**
 * FAQ - animated accordion. Quiet motion, hairline separators, no
 * overdone plus/minus icon glue. Six real questions.
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { C, FONT, TYPE, GRID, EASE } from "./tokens";

const QUESTIONS = [
  {
    q: "Am I being diagnosed with something?",
    a: "No. Precura gives you a risk trajectory, not a clinical diagnosis. We run validated research models against your biomarkers and family history to show where you are likely to be in 10 years. If anything is clinically urgent, Dr. Marcus refers you to your vardcentral or specialist, with the data ready to share.",
  },
  {
    q: "How is this different from Werlabs or Kry?",
    a: "Werlabs sells you blood tests at a good price but does not stitch multiple tests together, does not run clinical risk models, does not assign a coach, and does not keep a living profile over years. Kry is focused on acute primary care video calls. Precura is a standing subscription to a preventive team that reads your trajectory, not a single moment.",
  },
  {
    q: "Is Dr. Marcus really the one reading my results?",
    a: "Yes. Dr. Marcus Johansson personally writes every note on every Annual member panel, up to our current capacity. As we grow we are adding more vetted Swedish GPs in the same mould. The medical team is always named, always licensed, and always reachable.",
  },
  {
    q: "What does the coach actually do?",
    a: "Your coach reads your metabolic profile before they meet you, builds a 12-week progressive training plan from your actual markers, and adjusts it every four weeks based on your new data. Real sets, real reps, real weights, real nutrition prescriptions aligned with your biomarker goals. Not generic 'exercise more' advice.",
  },
  {
    q: "Which biomarkers do you actually measure?",
    a: "40+ on a standard panel. Metabolic: HbA1c, fasting glucose, fP-insulin. Lipids: LDL-C, ApoB, HDL, triglycerides. Inflammation: hs-CRP. Organ: liver, kidney (creatinine, eGFR), thyroid (TSH, T4). Nutritional: Omega-3 index, vitamin D (25-OH-D), ferritin, B12. Plus a full CBC. Concierge adds 40 more, including fasting insulin, advanced lipoproteins and hormones.",
  },
  {
    q: "Where does my data live, and can I get it out?",
    a: "All personal data is hosted on Frankfurt and Stockholm servers, inside the EU. No US sub-processors touch your records. GDPR applies in full. You can export everything to FHIR or delete your account in one click from your profile.",
  },
];

export function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      id="faq"
      style={{
        background: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        borderTop: `1px solid ${C.line}`,
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
        <div
          style={{ gridColumn: "span 4" }}
          className="home12-faq-head"
        >
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.inkMuted,
              marginBottom: 20,
            }}
          >
            10 / FAQ
          </div>
          <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink }}>
            Honest answers.
          </h2>
          <p
            style={{
              ...TYPE.body,
              color: C.inkSoft,
              marginTop: 24,
              marginBottom: 0,
              maxWidth: 340,
            }}
          >
            If your question isn't here, message the team. Dr. Marcus or
            one of our coaches will come back to you personally within
            48 hours.
          </p>
        </div>

        {/* Accordion */}
        <div
          style={{ gridColumn: "6 / span 7" }}
          className="home12-faq-list"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              borderTop: `1px solid ${C.line}`,
            }}
          >
            {QUESTIONS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      padding: "24px 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: FONT,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 19,
                        fontWeight: 500,
                        color: C.ink,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: EASE.out }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginLeft: 16,
                      }}
                    >
                      <Plus size={20} color={C.ink} strokeWidth={1.6} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: EASE.out,
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            ...TYPE.body,
                            color: C.inkSoft,
                            margin: 0,
                            padding: "0 48px 28px 4px",
                            maxWidth: 720,
                          }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-faq-head),
          :global(.home12-faq-list) {
            grid-column: span 12 !important;
          }
          :global(.home12-faq-list) {
            margin-top: 32px;
          }
        }
      `}</style>
    </section>
  );
}
