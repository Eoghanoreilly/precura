"use client";

/**
 * LivingProfile - "Not a report. A living profile."
 *
 * Borrowed title from home-10, but the treatment here is different. We show
 * the concept literally: a composition with three side-by-side "profile
 * cards" (same person, three moments in time) pulsing. The text pulls the
 * reader in: this is not a PDF, this is a continuously updating health twin.
 *
 * Layout: headline left, three stacked "profile frames" right, each with a
 * mini stat line that updates. A pulse ring behind the middle one.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

const frames = [
  {
    when: "Jan 2026",
    glucose: "5.6",
    ldl: "3.1",
    status: "Baseline",
    color: C.signalCaution,
  },
  {
    when: "Jul 2026",
    glucose: "5.4",
    ldl: "2.9",
    status: "Watch",
    color: C.signalCaution,
    pulse: true,
  },
  {
    when: "Jan 2027",
    glucose: "5.2",
    ldl: "2.7",
    status: "Trending down",
    color: C.signalGood,
  },
];

export default function LivingProfile() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      style={{
        background: C.paper,
        color: C.ink,
        padding: "180px 36px",
        fontFamily: SYSTEM_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
        className="home13-living-grid"
      >
        {/* Left: typography */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ ...TYPE.mono, color: C.amber, marginBottom: 24 }}
          >
            04  /  The profile
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.displayLarge,
              color: C.ink,
              margin: 0,
              maxWidth: 600,
            }}
          >
            Not a report.
            <br />
            <span
              style={{
                color: C.amberDeep,
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              A living profile.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            style={{
              ...TYPE.lead,
              color: C.inkMid,
              marginTop: 32,
              maxWidth: 520,
            }}
          >
            Most health services hand you a static PDF and wish you luck.
            Precura builds a health twin that keeps learning. Every retest,
            every note from your doctor, every training block: all of it
            feeds back into one evolving profile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.35, ease: EASE }}
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 460,
            }}
          >
            {[
              "Continuously updated with every draw",
              "Doctor-reviewed history travels with you",
              "FHIR-compliant export, your data, your call",
              "Informs your training and nutrition week by week",
            ].map((line) => (
              <div
                key={line}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  color: C.inkSoft,
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.amber,
                    marginTop: 9,
                    flexShrink: 0,
                  }}
                />
                {line}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: three stacked profile frames */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Pulse ring behind middle */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(183,107,59,0.12) 0%, rgba(183,107,59,0) 70%)",
              pointerEvents: "none",
            }}
          />

          {frames.map((f, i) => (
            <motion.div
              key={f.when}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.2 + i * 0.18,
                ease: EASE,
              }}
              style={{
                position: "relative",
                padding: "22px 28px",
                background: C.creamSoft,
                border: `1px solid ${
                  f.pulse ? C.amber : C.line
                }`,
                borderRadius: 18,
                boxShadow: f.pulse ? C.shadowMd : C.shadowSm,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 20,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ ...TYPE.mono, color: C.inkMuted }}>
                  Anna B.
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    color: C.ink,
                    marginTop: 2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.when}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  justifyContent: "center",
                }}
              >
                <Stat label="Glucose" value={f.glucose} unit="mmol/L" />
                <Stat label="LDL" value={f.ldl} unit="mmol/L" />
              </div>

              <div
                style={{
                  ...TYPE.mono,
                  color: f.color,
                  padding: "6px 12px",
                  borderRadius: 100,
                  background:
                    f.color === C.signalGood
                      ? "rgba(78, 142, 92, 0.14)"
                      : "rgba(199, 144, 37, 0.14)",
                }}
              >
                {f.status}
              </div>

              {f.pulse && (
                <motion.div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: -6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.amber,
                    transform: "translateY(-50%)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(183,107,59,0.5)",
                      "0 0 0 14px rgba(183,107,59,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-living-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: C.inkMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 500,
          color: C.ink,
          letterSpacing: "-0.015em",
          marginTop: 2,
        }}
      >
        {value}
        <span
          style={{ fontSize: 10, color: C.inkMuted, marginLeft: 3 }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
