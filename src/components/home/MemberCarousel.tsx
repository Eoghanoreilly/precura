"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, IMG } from "./tokens";

/**
 * MEMBER CAROUSEL - Clickable interactive carousel showing "inside a
 * member's membership" - what they get, what they've logged, how their
 * profile has changed. Shows 4 different members, click to switch.
 */
export function MemberCarousel() {
  const members = [
    {
      name: "Anna B.",
      age: 40,
      city: "Stockholm",
      image: IMG.testimonial1,
      focus: "Diabetes prevention",
      focusColor: C.terracotta,
      highlight: {
        marker: "Fasting glucose",
        before: "5.8 mmol/L",
        after: "5.4 mmol/L",
        delta: "dropped in 6 months",
      },
      since: "January 2026",
      activities: [
        "4 blood panels in 12 months",
        "12 messages with Dr. Tomas",
        "3x/week strength plan",
        "Added Vit D 2000 IU",
      ],
    },
    {
      name: "Erik L.",
      age: 38,
      city: "Malmo",
      image: IMG.testimonial2,
      focus: "Heart risk, family history",
      focusColor: C.caution,
      highlight: {
        marker: "LDL cholesterol",
        before: "3.4 mmol/L",
        after: "2.7 mmol/L",
        delta: "after dietary changes",
      },
      since: "September 2025",
      activities: [
        "2 blood panels so far",
        "Started Omega-3 supplementation",
        "Weekly Z2 cardio plan",
        "Doctor referral to cardiology",
      ],
    },
    {
      name: "Lotta S.",
      age: 44,
      city: "Gothenburg",
      image: IMG.testimonial3,
      focus: "Energy + thyroid",
      focusColor: C.sageDeep,
      highlight: {
        marker: "TSH",
        before: "4.1 mIU/L",
        after: "2.3 mIU/L",
        delta: "after med adjustment",
      },
      since: "March 2025",
      activities: [
        "4 panels, full thyroid profile",
        "Dr. Tomas adjusted medication",
        "Restorative training plan",
        "Sleep tracking added",
      ],
    },
    {
      name: "Johan K.",
      age: 51,
      city: "Uppsala",
      image: IMG.testimonial4,
      focus: "Bone + body composition",
      focusColor: C.butter,
      highlight: {
        marker: "FRAX bone risk",
        before: "Low-moderate",
        after: "Low",
        delta: "with training + Vit D",
      },
      since: "November 2024",
      activities: [
        "5 panels over 15 months",
        "DEXA scan referral",
        "Weighted loading plan",
        "Vitamin K2 + D added",
      ],
    },
  ];

  const [active, setActive] = useState(0);
  const current = members[active];

  return (
    <section
      style={{
        background: C.canvas,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 56,
            maxWidth: 760,
          }}
        >
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
            Inside four memberships
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            style={{
              fontSize: "clamp(36px, 4.4vw, 60px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
            }}
          >
            Click any member to see{" "}
            <span
              style={{
                color: C.terracotta,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              their year.
            </span>
          </motion.h2>
        </div>

        {/* Thumbnail row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
          className="home17-member-thumbs"
        >
          {members.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                position: "relative",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: "transparent",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  borderRadius: 18,
                  overflow: "hidden",
                  border:
                    active === i
                      ? `2px solid ${C.terracotta}`
                      : `1px solid ${C.lineCard}`,
                  boxShadow: active === i ? C.shadowLift : C.shadowSoft,
                  transition: "all 0.3s ease",
                  transform: active === i ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${m.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: active === i ? "none" : "brightness(0.88)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(28,26,23,0.78) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    right: 14,
                    color: C.canvasSoft,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.name} / {m.age}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(251,247,240,0.7)",
                      marginTop: 2,
                    }}
                  >
                    {m.city}
                  </div>
                </div>
                {active === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: "4px 10px",
                      background: C.terracotta,
                      color: C.canvasSoft,
                      borderRadius: 100,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Viewing
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div
          style={{
            position: "relative",
            background: C.paper,
            borderRadius: 28,
            border: `1px solid ${C.lineCard}`,
            padding: 48,
            boxShadow: C.shadowCard,
            minHeight: 380,
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 48,
              }}
              className="home17-member-detail"
            >
              {/* Column 1 - Focus + year */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.inkFaint,
                    marginBottom: 8,
                  }}
                >
                  Member focus
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: C.ink,
                    lineHeight: 1.1,
                    marginBottom: 20,
                  }}
                >
                  {current.focus}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "6px 12px",
                    background: C.terracottaTint,
                    color: C.terracottaDeep,
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    marginBottom: 28,
                  }}
                >
                  Member since {current.since}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: C.inkMuted,
                    lineHeight: 1.5,
                  }}
                >
                  Each membership is personalised around one primary focus
                  area, identified from the baseline panel and 1177 history.
                </div>
              </div>

              {/* Column 2 - Highlight data */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.inkFaint,
                    marginBottom: 12,
                  }}
                >
                  Their year
                </div>
                <div
                  style={{
                    background: C.canvasSoft,
                    border: `1px solid ${C.lineSoft}`,
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: C.inkMuted,
                      marginBottom: 10,
                    }}
                  >
                    {current.highlight.marker}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 14,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        color: C.inkFaint,
                        textDecoration: "line-through",
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      {current.highlight.before}
                    </span>
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: C.ink,
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      {current.highlight.after}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.good,
                      fontWeight: 600,
                    }}
                  >
                    / {current.highlight.delta}
                  </div>
                </div>
              </div>

              {/* Column 3 - Activity log */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.inkFaint,
                    marginBottom: 12,
                  }}
                >
                  Inside their membership
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {current.activities.map((a, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14,
                        color: C.inkSoft,
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          marginTop: 8,
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: C.terracotta,
                          flexShrink: 0,
                        }}
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home17-member-thumbs) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          :global(.home17-member-detail) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
