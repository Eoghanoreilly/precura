"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * HOW IT WORKS - VERTICAL 3 steps. NO numbered circles (banned).
 * Instead: tall vertical rhythm with big step labels, warm line connecting
 * them, and a detail card per step. Feels editorial / magazine-like.
 */

const STEPS = [
  {
    tag: "Step one",
    title: "Connect your history",
    desc:
      "Sign in with BankID. Pull your five-year blood test and vaccination history from 1177. Takes about 90 seconds. No paper, no forms.",
    chip: "1177 import",
    chipNote: "One-tap, Swedish healthcare records",
  },
  {
    tag: "Step two",
    title: "We run your risk profile",
    desc:
      "Validated clinical models (FINDRISC, SCORE2, FRAX) run against your data. Dr. Marcus reviews every profile personally before you see it. A plain-English note explains where you stand.",
    chip: "3 clinical models",
    chipNote: "Reviewed by a Swedish GP",
  },
  {
    tag: "Step three",
    title: "You live inside your profile",
    desc:
      "Four blood tests a year at any Swedish lab. A coach checks in monthly. The profile updates with every data point. You see the slope, not a snapshot.",
    chip: "Quarterly retests",
    chipNote: "Plus coach and doctor in your pocket",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        background: C.creamSoft,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 72 }}
        >
          <div
            style={{
              ...TYPE.mono,
              color: C.terra,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            How it works
          </div>
          <h2 style={{ ...TYPE.displayL, margin: 0, maxWidth: 720 }}>
            Three things happen. None of them involve a waiting room.
          </h2>
        </motion.div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Vertical warm line */}
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 0,
              bottom: 0,
              width: 2,
              background: `linear-gradient(180deg, ${C.terraSoft} 0%, ${C.sage} 100%)`,
              borderRadius: 2,
              opacity: 0.6,
            }}
            className="home20-vert-line"
          />

          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "relative",
                paddingLeft: 68,
                paddingBottom: i === STEPS.length - 1 ? 0 : 64,
              }}
              className="home20-step-row"
            >
              {/* Dot on the line (not a numbered circle) */}
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: 10,
                  width: 18,
                  height: 18,
                  borderRadius: 50,
                  background: C.cream,
                  border: `2px solid ${C.terra}`,
                  boxShadow: `0 0 0 6px ${C.creamSoft}`,
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 1fr",
                  gap: 36,
                  alignItems: "flex-start",
                }}
                className="home20-step-inner"
              >
                <div>
                  <div
                    style={{
                      ...TYPE.tiny,
                      color: C.terra,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: 8,
                    }}
                  >
                    {s.tag}
                  </div>
                  <h3
                    style={{
                      ...TYPE.displayM,
                      margin: 0,
                      marginBottom: 14,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...TYPE.body,
                      color: C.inkMuted,
                      margin: 0,
                      maxWidth: 480,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>

                <div
                  style={{
                    padding: "20px 22px",
                    background: C.paper,
                    borderRadius: 18,
                    border: `1px solid ${C.lineFaint}`,
                    boxShadow: C.shadowSoft,
                  }}
                >
                  <div
                    style={{
                      ...TYPE.tiny,
                      color: C.sageDeep,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 6,
                    }}
                  >
                    Included
                  </div>
                  <div
                    style={{
                      ...TYPE.h3,
                      fontSize: 20,
                      fontWeight: 600,
                      color: C.ink,
                      marginBottom: 4,
                    }}
                  >
                    {s.chip}
                  </div>
                  <div
                    style={{
                      ...TYPE.small,
                      color: C.inkMuted,
                    }}
                  >
                    {s.chipNote}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home20-step-inner) {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
