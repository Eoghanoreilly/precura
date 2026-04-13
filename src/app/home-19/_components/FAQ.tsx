"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FAQ
 *
 * Animated accordion. Six questions covering the predictable first-visit
 * worries: is this a diagnosis, how is it different from Werlabs, is the
 * doctor real, what's the coaching actually like, how is my data handled,
 * and how do I cancel.
 *
 * Paper card, single column, no borders on the left. Each item expands on
 * click with a soft height+opacity animation. A rotating plus icon doubles
 * as an X when open.
 */
type FAQItem = {
  q: string;
  a: React.ReactNode;
};

const ITEMS: FAQItem[] = [
  {
    q: "Is Precura a medical diagnosis service?",
    a: (
      <>
        No. Precura is a preventive health membership. Dr. Marcus is a
        licensed Swedish GP and can flag things that need further care, but
        Precura does not replace your vardcentral or emergency services. If
        something needs a formal diagnosis, Marcus will refer you into the
        public system and help you navigate it.
      </>
    ),
  },
  {
    q: "How is this different from Werlabs or Medisera?",
    a: (
      <>
        Werlabs and Medisera are lab ordering services. You pay, you get a
        PDF, you go on with your life. Precura is a year-round membership
        with a dedicated doctor who reads every panel, writes a note, runs
        the risk models, and actually knows your history. Lab testing is
        just one ingredient of what we do.
      </>
    ),
  },
  {
    q: "Is Dr. Marcus a real doctor I can actually talk to?",
    a: (
      <>
        Yes. Dr. Marcus Johansson is a real, practicing Swedish GP,
        Karolinska-trained with over fifteen years in primary care. Members
        get a twenty minute video review with him after each major panel,
        plus a secure in-app message thread with typical replies in hours,
        not days.
      </>
    ),
  },
  {
    q: "What does the coaching actually look like?",
    a: (
      <>
        Every member is assigned a human, certified strength and
        conditioning coach. Your coach writes a real training plan with
        real sets, reps and weights, informed by your blood work and
        reviewed by Dr. Marcus. It is not chatbot advice and it is not
        {" "}&ldquo;get 10k steps a day&rdquo;. You message your coach, log
        sessions, and the plan evolves with your data.
      </>
    ),
  },
  {
    q: "How is my health data handled?",
    a: (
      <>
        Your data is stored in an EU data centre (Frankfurt), encrypted at
        rest, and accessed only by your doctor and coach. Precura is GDPR
        compliant and you own your health file. You can export a full copy
        at any time in FHIR format, and if you cancel your data is deleted
        on request within 30 days.
      </>
    ),
  },
  {
    q: "How do I cancel?",
    a: (
      <>
        One button in the app. Memberships are annual but you can cancel
        any month. You keep full access to everything you have already
        paid for until the year runs out. No phone calls, no retention
        emails, no friction. We believe you should stay because you want
        to, not because cancelling is painful.
      </>
    ),
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{
        padding: "120px 32px 120px",
        background: C.creamDeep,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...TYPE.label,
            color: C.coral,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Frequently asked
        </div>
        <h2
          style={{
            ...TYPE.displayL,
            margin: 0,
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          The things{" "}
          <span
            style={{
              color: C.coral,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            everyone asks
          </span>{" "}
          first.
        </h2>
        <p
          style={{
            ...TYPE.lead,
            color: C.inkMuted,
            margin: 0,
            textAlign: "center",
            marginBottom: 56,
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Direct answers. No small print. If your question isn&apos;t here,
          you can message Dr. Marcus directly after joining.
        </p>

        <div
          style={{
            background: C.paper,
            borderRadius: 28,
            border: `1px solid ${C.line}`,
            boxShadow: C.shadow,
            overflow: "hidden",
          }}
        >
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                style={{
                  borderBottom:
                    i === ITEMS.length - 1
                      ? "none"
                      : `1px solid ${C.lineSoft}`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: "26px 30px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(17px, 1.4vw, 19px)",
                      fontWeight: 600,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: isOpen ? C.ink : C.creamSoft,
                      color: isOpen ? C.paper : C.ink,
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${isOpen ? C.ink : C.line}`,
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={16} strokeWidth={2.4} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.42,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "0 80px 30px 30px",
                          ...TYPE.body,
                          color: C.inkSoft,
                          lineHeight: 1.6,
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
        </div>

        {/* Small footer note */}
        <div
          style={{
            marginTop: 28,
            textAlign: "center",
            ...TYPE.small,
            color: C.inkMuted,
          }}
        >
          Still not sure? You can{" "}
          <a
            href="#final"
            style={{
              color: C.coral,
              textDecoration: "none",
              fontWeight: 600,
              borderBottom: `1px solid ${C.coralSoft}`,
            }}
          >
            book a free 15 minute call
          </a>{" "}
          with the Precura team before joining.
        </div>
      </div>
    </section>
  );
}
