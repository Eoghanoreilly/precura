"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * HOW IT WORKS - Vertical 3-step timeline. NOT three numbered circles
 * in a row. Left column has a thin vertical rule with "step 01/02/03"
 * markers, right column has the copy and a small visual for each step.
 *
 * Warm, editorial, non-techy.
 */
export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Book your first blood draw",
      body:
        "Pick a lab near you or order a home kit. We take a comprehensive panel, 40+ markers, including ApoB, hs-CRP, Omega-3, fasting insulin and the basics.",
      chip: "25 minutes. At a Karolinska lab or at home.",
      visual: "lab",
    },
    {
      num: "02",
      title: "Your doctor writes your profile",
      body:
        "Dr. Marcus reads every panel before you do. He writes a note in plain Swedish, flags trends, runs the risk models (FINDRISC, SCORE2, FRAX) and books a 20 minute video review on your calendar.",
      chip: "Within 72 hours of results.",
      visual: "doctor",
    },
    {
      num: "03",
      title: "You get your coach and keep going",
      body:
        "A certified coach builds a training plan that respects your data. You retest on a cadence that makes sense for you. Your profile keeps learning. You see the slope, not just the number.",
      chip: "Then two to four retests a year.",
      visual: "coach",
    },
  ];

  return (
    <section
      id="how"
      style={{
        padding: "120px 32px 120px",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...TYPE.label,
            color: C.coral,
            marginBottom: 16,
          }}
        >
          How it works
        </div>
        <h2
          style={{
            ...TYPE.displayL,
            margin: 0,
            marginBottom: 14,
            maxWidth: 820,
          }}
        >
          Three steps.{" "}
          <span
            style={{
              color: C.coral,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            No clinical jargon.
          </span>
        </h2>
        <p
          style={{
            ...TYPE.lead,
            color: C.inkMuted,
            maxWidth: 700,
            margin: 0,
            marginBottom: 72,
          }}
        >
          You can be onboarded, reviewed and on a plan inside the first week
          of your membership.
        </p>

        <div style={{ position: "relative" }}>
          {/* Vertical rail */}
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 18,
              bottom: 18,
              width: 2,
              background: C.line,
            }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 20,
                marginBottom: i === steps.length - 1 ? 0 : 56,
              }}
            >
              {/* Dot + number */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: i === 0 ? C.coral : C.paper,
                    color: i === 0 ? C.paper : C.ink,
                    border: `1px solid ${i === 0 ? C.coral : C.line}`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "-0.005em",
                    boxShadow:
                      i === 0
                        ? "0 6px 18px rgba(226,90,76,0.28)"
                        : C.shadow,
                    marginLeft: -1,
                    zIndex: 2,
                  }}
                >
                  {s.num}
                </div>
              </div>

              {/* Content card */}
              <div
                style={{
                  background: C.paper,
                  borderRadius: 22,
                  border: `1px solid ${C.line}`,
                  padding: "24px 26px 22px",
                  boxShadow: C.shadow,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: "-0.01em",
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </div>
                <p
                  style={{
                    ...TYPE.body,
                    color: C.inkSoft,
                    margin: 0,
                    marginBottom: 16,
                  }}
                >
                  {s.body}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 100,
                    background: C.creamSoft,
                    border: `1px solid ${C.lineSoft}`,
                    ...TYPE.small,
                    color: C.inkMuted,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.sage,
                    }}
                  />
                  {s.chip}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
