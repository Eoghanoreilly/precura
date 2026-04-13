"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * LIVING PROFILE - the "Not a report. A living profile." moment.
 * Large quote-style typography on a warmer deep-cream background,
 * plus three small updating-profile "chips" that animate in.
 *
 * Keeps the Airbnb-warm tone by using soft card shadows and no
 * dramatic reveals.
 */
export function LivingProfile() {
  const updates = [
    {
      when: "Today",
      text: "New blood panel added. Fasting glucose 5.8.",
      dot: C.coral,
    },
    {
      when: "Yesterday",
      text: "Dr. Marcus left a note on your cholesterol trend.",
      dot: C.sage,
    },
    {
      when: "Last week",
      text: "Coach Lina updated your training block to Zone 2.",
      dot: C.amber,
    },
    {
      when: "Two weeks ago",
      text: "FINDRISC score updated from 11 to 12 (moderate).",
      dot: C.coral,
    },
  ];

  return (
    <section
      style={{
        padding: "120px 32px 120px",
        background: C.creamDeep,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 64,
          alignItems: "center",
        }}
        className="home19-living-grid"
      >
        <div>
          <div
            style={{
              ...TYPE.label,
              color: C.coral,
              marginBottom: 16,
            }}
          >
            What you actually get
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            style={{
              ...TYPE.displayL,
              margin: 0,
              color: C.ink,
              marginBottom: 22,
            }}
          >
            Not a report.{" "}
            <span
              style={{
                color: C.coral,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              A living profile.
            </span>
          </motion.h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              marginBottom: 14,
              maxWidth: 520,
            }}
          >
            Most blood test providers hand you a PDF and disappear. Precura
            keeps a single health profile for you that updates every time
            you do a panel, a check-in, a workout, a doctor visit.
          </p>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 520,
            }}
          >
            It is the thing your GP would build if they had time. We made it
            their job.
          </p>
        </div>

        {/* Right: activity feed card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: C.paper,
            borderRadius: 28,
            border: `1px solid ${C.line}`,
            boxShadow: C.shadowLift,
            padding: "26px 28px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                }}
              >
                Anna&apos;s profile
              </div>
              <div style={{ ...TYPE.small, color: C.inkMuted, marginTop: 2 }}>
                Last updated just now
              </div>
            </div>
            <span
              style={{
                ...TYPE.micro,
                padding: "4px 10px",
                borderRadius: 100,
                background: C.sageSoft,
                color: C.sageDeep,
                fontWeight: 700,
              }}
            >
              LIVE
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {updates.map((u, i) => (
              <motion.div
                key={u.text}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "16px 1fr",
                  gap: 14,
                  paddingBottom: i === updates.length - 1 ? 0 : 20,
                  borderBottom:
                    i === updates.length - 1
                      ? "none"
                      : `1px solid ${C.lineSoft}`,
                  marginBottom: i === updates.length - 1 ? 0 : 20,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: u.dot,
                      marginTop: 6,
                      boxShadow: `0 0 0 4px ${u.dot}22`,
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      ...TYPE.micro,
                      color: C.inkMuted,
                      fontWeight: 700,
                      marginBottom: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    {u.when}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: C.ink,
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {u.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home19-living-grid) {
            grid-template-columns: 1fr !important;
            gap: 44px !important;
          }
        }
      `}</style>
    </section>
  );
}
