"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * FAQ - An animated accordion. Spring-open, fade-in body. Editorial,
 * type-driven, no chrome. Six answers with real content.
 */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      id="faq"
      style={{
        background: C.page,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div ref={headRef} style={{ marginBottom: 96 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 24,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 26,
                height: 1,
                background: C.inkMuted,
                display: "inline-block",
              }}
            />
            Ch. 10 / Questions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              color: C.ink,
            }}
          >
            Six honest{" "}
            <span style={{ color: C.sage, fontStyle: "italic" }}>
              answers.
            </span>
          </motion.h2>
        </div>

        <div
          style={{
            borderTop: `1px solid ${C.inkHairlineStrong}`,
          }}
        >
          {qa.map((row, i) => {
            const isOpen = open === i;
            return (
              <div
                key={row.q}
                style={{
                  borderBottom: `1px solid ${C.inkHairlineStrong}`,
                }}
              >
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.05 * i, ease: EASE }}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "32px 0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: SYSTEM_FONT,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 40,
                    color: C.ink,
                  }}
                >
                  <div style={{ display: "flex", gap: 28, flex: 1 }}>
                    <div
                      style={{
                        ...TYPE.mono,
                        color: C.inkMuted,
                        flexShrink: 0,
                        paddingTop: 8,
                        width: 36,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(20px, 2vw, 26px)",
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                        color: C.ink,
                        fontWeight: 500,
                      }}
                    >
                      {row.q}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{
                      flexShrink: 0,
                      paddingTop: 8,
                      color: C.ink,
                    }}
                    aria-hidden
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <line
                        x1="10"
                        y1="3"
                        x2="10"
                        y2="17"
                        stroke={C.ink}
                        strokeWidth="1.25"
                      />
                      <line
                        x1="3"
                        y1="10"
                        x2="17"
                        y2="10"
                        stroke={C.ink}
                        strokeWidth="1.25"
                      />
                    </svg>
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.55,
                        ease: EASE,
                      }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "0 60px 40px 64px",
                        }}
                      >
                        <p
                          style={{
                            ...TYPE.body,
                            color: C.inkMuted,
                            margin: 0,
                            maxWidth: 680,
                            lineHeight: 1.65,
                          }}
                        >
                          {row.a}
                        </p>
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

const qa = [
  {
    q: "Is a Precura risk report a medical diagnosis?",
    a: "No. Precura is a predictive and preventive health service. The risk models we run are the same peer-reviewed tools (FINDRISC, SCORE2, FRAX) that Swedish primary care uses for screening. A risk score is not a diagnosis and cannot replace a formal clinical diagnosis, which must come from a physician making a clinical judgment. What Precura does is make it much more likely that the right conversations happen early. If we see anything that warrants a formal workup, Dr. Johansson will say so in writing.",
  },
  {
    q: "How is Precura different from Werlabs or a 1177 check-up?",
    a: "Werlabs sells blood panels as a commodity: you send blood, you get numbers. 1177 is the Swedish public health record, so everything there is the same paperwork your GP already sees. Precura is neither of those. It is a membership: 40+ markers on two to four panels per year, trajectory tracking over years rather than snapshots, clinical risk models run every time, a named Swedish doctor who writes you plain-Swedish notes, a personal coach who builds real training plans around your panel, and a living profile that updates the day anything new comes in. The panel is the cheapest part. The reading of it is what you are paying for.",
  },
  {
    q: "Do I get a real doctor, or an AI pretending?",
    a: "A real Swedish doctor. Dr. Marcus Johansson is our medical lead, Karolinska Institute trained, 15+ years in Swedish primary care. He personally signs off on every risk report and is reachable by secure messaging for the full 12 months of your membership. We use AI for certain interpretive features (like chat with your own data context) but clinical reviews, notes and escalations are human work, end to end. If you cannot reach a named doctor, it is not a Precura product.",
  },
  {
    q: "How does the coaching actually work? Is my coach a real person?",
    a: "Yes. When you join the annual membership you are assigned a certified strength and metabolic coach (currently Lina Stenberg and her team). Your coach reads your blood panel, asks five or six practical questions about your week, and then writes you a training plan with actual exercises, sets, reps and load progressions. You get a weekly check-in, the plan adapts after every new panel, and nutrition guidance is aligned with your specific markers, not a template. We do not do generic 'exercise more' advice.",
  },
  {
    q: "Which biomarkers do you actually test?",
    a: "The full Precura panel is 40+ markers: fasting glucose, HbA1c, fP-insulin, LDL-C, HDL-C, triglycerides, ApoB, Lp(a) on platinum, hs-CRP, full liver (ALT, AST, GGT, ALP, bilirubin, albumin), full kidney (creatinine, eGFR, cystatin C, urea), thyroid (TSH, fT4 and fT3 on request), 25-OH-D, vitamin B12, folate, ferritin, transferrin, iron, electrolytes, full blood count with differential, Omega-3 index, homocysteine and hormones where indicated. The Platinum tier adds continuous glucose pilot programs and advanced cardiac markers.",
  },
  {
    q: "Where does my data live? Is it safe?",
    a: "All clinical data is stored inside the EU on servers audited to ISO 27001. Precura complies with GDPR Article 9 (special category data), and we use BankID for authentication, the same system Swedish adults already use for banking and 1177. You can export your full record as FHIR at any time. You can delete your account, and your data, at any time. Precura complements the Swedish 1177 record; it does not replace it and we do not sell or share your data under any circumstances.",
  },
];
