"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * PERK CAROUSEL - a clickable interactive section, distinct from the
 * hero grid. Large editorial image on the left changes when you click
 * a perk on the right. Warm Airbnb feel with real photography.
 */

type Slide = {
  tag: string;
  title: string;
  detail: string;
  image: string;
  meta: { label: string; value: string }[];
};

const SLIDES: Slide[] = [
  {
    tag: "Lab day",
    title: "Walk into any Swedish lab. Done in 12 minutes.",
    detail:
      "Your blood draw is covered. Pick a Werlabs, Unilabs or 1177 partner lab near you. Results arrive in your profile in about 48 hours.",
    image: IMG.cLab,
    meta: [
      { label: "Labs available", value: "180+ across Sweden" },
      { label: "Turnaround", value: "About 48 hours" },
      { label: "Cost per draw", value: "Included" },
    ],
  },
  {
    tag: "The morning after",
    title: "Your profile updates while you have coffee.",
    detail:
      "We drop the new numbers into your living profile, rerun your risk models, and send Dr. Marcus a summary for review. You usually have his note by lunch.",
    image: IMG.cMorning,
    meta: [
      { label: "Data flow", value: "Lab to profile, automatic" },
      { label: "Doctor review", value: "Same day" },
      { label: "Notification", value: "Gentle, not pushy" },
    ],
  },
  {
    tag: "Your walk",
    title: "The 20 minute walk your coach prescribed.",
    detail:
      "Post-meal walks are the fastest way to flatten a glucose curve. Your coach builds it into your plan and checks in to see how it's going.",
    image: IMG.cWalk,
    meta: [
      { label: "Prescribed", value: "20 min after dinner" },
      { label: "Tracked", value: "Optional, never required" },
      { label: "Coach", value: "Real human, monthly check-in" },
    ],
  },
  {
    tag: "Dinner",
    title: "The meals your vitamin D is begging for.",
    detail:
      "Your low vitamin D showed up in last month's draw. Your coach sent you a short list of Nordic foods and a specific supplement. No generic 'eat vegetables'.",
    image: IMG.cMeal,
    meta: [
      { label: "Based on", value: "Your actual markers" },
      { label: "Specific", value: "Foods, brands, doses" },
      { label: "Updated", value: "Every new test" },
    ],
  },
  {
    tag: "A question",
    title: "Ask the AI. It already knows your story.",
    detail:
      "Why is my HbA1c creeping up if my glucose is fine? The AI has your five years of data and answers in plain Swedish or English. Every answer links back to Dr. Marcus if you want a human opinion.",
    image: IMG.cNotebook,
    meta: [
      { label: "Trained on", value: "Only your own data" },
      { label: "Handoff", value: "One tap to the doctor" },
      { label: "Language", value: "Swedish or English" },
    ],
  },
];

export function PerkCarousel() {
  const [active, setActive] = useState(0);
  const current = SLIDES[active];

  return (
    <section
      style={{
        background: C.ink,
        color: C.creamSoft,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
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
            gridTemplateColumns: "1.3fr 1fr",
            gap: 56,
            alignItems: "flex-end",
            marginBottom: 48,
          }}
          className="home20-carousel-header"
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.peach,
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Membership, in moments
            </div>
            <h2
              style={{
                ...TYPE.displayL,
                margin: 0,
                color: C.creamSoft,
              }}
            >
              A week inside Precura.
            </h2>
          </div>
          <p
            style={{
              ...TYPE.lead,
              color: "rgba(246,241,232,0.7)",
              margin: 0,
              maxWidth: 400,
            }}
          >
            Tap through the moments. Every one of these is included in a
            regular Member subscription.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: 40,
            alignItems: "stretch",
            minHeight: 560,
          }}
          className="home20-carousel-body"
        >
          {/* Large image panel */}
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: C.inkSoft,
              minHeight: 480,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${current.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </AnimatePresence>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(22,21,18,0.12) 0%, transparent 40%, rgba(22,21,18,0.85) 100%)",
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                style={{
                  position: "absolute",
                  left: 32,
                  right: 32,
                  bottom: 32,
                }}
              >
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.peach,
                    marginBottom: 8,
                  }}
                >
                  {current.tag.toUpperCase()}
                </div>
                <div
                  style={{
                    ...TYPE.displayM,
                    color: C.creamSoft,
                    margin: 0,
                    maxWidth: 540,
                    marginBottom: 14,
                  }}
                >
                  {current.title}
                </div>
                <p
                  style={{
                    ...TYPE.body,
                    color: "rgba(246,241,232,0.78)",
                    margin: 0,
                    maxWidth: 540,
                  }}
                >
                  {current.detail}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Clickable perks list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {SLIDES.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    textAlign: "left",
                    padding: "20px 22px",
                    background: isActive ? "rgba(246,241,232,0.08)" : "transparent",
                    border: `1px solid ${
                      isActive ? "rgba(246,241,232,0.2)" : "rgba(246,241,232,0.08)"
                    }`,
                    borderRadius: 18,
                    cursor: "pointer",
                    fontFamily: SYSTEM_FONT,
                    color: C.creamSoft,
                    transition: "all 0.4s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        ...TYPE.mono,
                        color: isActive ? C.peach : "rgba(246,241,232,0.5)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} / {s.tag.toUpperCase()}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          ...TYPE.tiny,
                          color: C.peach,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Showing
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      color: isActive ? C.creamSoft : "rgba(246,241,232,0.65)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      transition: "color 0.4s",
                    }}
                  >
                    {s.title}
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        display: "flex",
                        gap: 18,
                        marginTop: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {s.meta.map((m, j) => (
                        <div key={j} style={{ minWidth: 0 }}>
                          <div
                            style={{
                              ...TYPE.tiny,
                              color: "rgba(246,241,232,0.5)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: 1,
                            }}
                          >
                            {m.label}
                          </div>
                          <div
                            style={{
                              ...TYPE.small,
                              color: C.creamSoft,
                              fontWeight: 500,
                            }}
                          >
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-carousel-header) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          :global(.home20-carousel-body) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
