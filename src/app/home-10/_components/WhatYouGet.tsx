"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * WHAT YOU GET - Technique: Bespoke mosaic grid where each card uses a
 * different live, hover-reactive interaction. NOT a three-card grid.
 *
 *  - Giant feature card: live risk profile preview
 *  - Tall card: 3D tilt on mouse move
 *  - Small cards: inner gradient that follows the cursor
 *  - Long card: animated sparkline inside
 *
 * Every card reacts to the mouse differently. This is the interactive
 * playground section of the page.
 */
export function WhatYouGet() {
  return (
    <section
      style={{
        background: C.cream,
        padding: "160px 32px 160px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
            marginBottom: 60,
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                ...TYPE.mono,
                color: C.amber,
                padding: "6px 12px",
                border: `1px solid ${C.amber}`,
                borderRadius: 100,
                display: "inline-block",
                marginBottom: 20,
              }}
            >
              04 / WHAT YOU GET
            </div>
            <h2
              style={{
                ...TYPE.displayLarge,
                margin: 0,
              }}
            >
              Not a report.{" "}
              <span style={{ color: C.amber, fontStyle: "italic" }}>
                A living profile.
              </span>
            </h2>
          </div>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              maxWidth: 400,
              margin: 0,
            }}
          >
            Six things, updated every test. Hover anywhere.
          </p>
        </div>

        {/* Bespoke mosaic grid - asymmetric, not a 3 column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "minmax(180px, auto)",
            gap: 20,
          }}
          className="home10-mosaic"
        >
          {/* BIG: Risk profile preview */}
          <RiskProfileCard />

          {/* TALL: Biomarker tracking */}
          <BiomarkerCard />

          {/* MEDIUM: AI chat */}
          <AIChatCard />

          {/* WIDE: Doctor messaging */}
          <DoctorCard />

          {/* SMALL: Training */}
          <TrainingCard />

          {/* SMALL: Retests */}
          <RetestCard />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-mosaic) {
            grid-template-columns: 1fr !important;
          }
          :global(.home10-mosaic > *) {
            grid-column: auto !important;
            grid-row: auto !important;
            min-height: 260px;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// BIG: Risk Profile Card
// =============================================================================
function RiskProfileCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const glow = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(450px circle at ${x * 100}% ${
        y * 100
      }%, rgba(224,107,45,0.14), transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: "span 4",
        gridRow: "span 2",
        position: "relative",
        background: C.paper,
        borderRadius: 28,
        border: `1px solid ${C.line}`,
        boxShadow: C.shadow,
        overflow: "hidden",
        padding: 40,
        minHeight: 460,
      }}
    >
      {/* Cursor-following glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: glow,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 40,
          }}
        >
          <div>
            <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 8 }}>
              RISK PROFILE / ANNA B
            </div>
            <h3
              style={{
                fontSize: 36,
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              Your 10-year trajectory
            </h3>
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: C.sageDeep,
              padding: "6px 12px",
              background: "rgba(107,143,113,0.15)",
              borderRadius: 100,
            }}
          >
            LIVE
          </div>
        </div>

        {/* Three risk gauges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            flex: 1,
          }}
        >
          {[
            {
              label: "Diabetes",
              model: "FINDRISC",
              value: 17,
              risk: "Moderate",
              color: C.amber,
              position: 0.58,
            },
            {
              label: "Cardiovascular",
              model: "SCORE2",
              value: 3,
              risk: "Low-mod.",
              color: C.signalCaution,
              position: 0.28,
            },
            {
              label: "Bone health",
              model: "FRAX",
              value: 4,
              risk: "Low",
              color: C.sage,
              position: 0.15,
            },
          ].map((g, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 20,
                background: C.creamSoft,
                borderRadius: 18,
                border: `1px solid ${C.lineSoft}`,
              }}
            >
              <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 8 }}>
                {g.model}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: C.ink,
                  marginBottom: 14,
                }}
              >
                {g.label}
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 500,
                  color: g.color,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {g.value}%
              </div>
              <div style={{ ...TYPE.small, color: C.inkMuted, marginBottom: 18 }}>
                10-year risk
              </div>

              {/* Zone bar */}
              <div
                style={{
                  position: "relative",
                  height: 6,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${C.signalGood} 0%, ${C.signalCaution} 50%, ${C.signalRisk} 100%)`,
                  opacity: 0.6,
                }}
              >
                <motion.div
                  initial={{ left: "0%" }}
                  whileInView={{ left: `${g.position * 100}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 1.4,
                    delay: 0.3 + i * 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    position: "absolute",
                    top: -3,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.paper,
                    border: `2px solid ${C.ink}`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div
                style={{
                  ...TYPE.small,
                  color: g.color,
                  marginTop: 12,
                  fontWeight: 500,
                }}
              >
                {g.risk} risk
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// TALL: Biomarker tracking card with 3D tilt
// =============================================================================
function BiomarkerCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotY = useSpring(useTransform(mx, [0, 1], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: "span 2",
        gridRow: "span 2",
        position: "relative",
        background: C.ink,
        borderRadius: 28,
        overflow: "hidden",
        padding: 32,
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ ...TYPE.mono, color: C.inkFaint, marginBottom: 14 }}>
            BIOMARKER TRACKING
          </div>
          <h3
            style={{
              fontSize: 30,
              fontWeight: 500,
              margin: 0,
              color: C.cream,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            22 markers, every test.
          </h3>
        </div>

        {/* Mini marker list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            transform: "translateZ(30px)",
          }}
        >
          {[
            { name: "HbA1c", val: "38", unit: "mmol/mol", trend: "up" },
            { name: "LDL", val: "2.9", unit: "mmol/L", trend: "flat" },
            { name: "HDL", val: "1.6", unit: "mmol/L", trend: "flat" },
            { name: "Vit D", val: "48", unit: "nmol/L", trend: "down" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(245,239,228,0.06)",
                borderRadius: 10,
                border: "1px solid rgba(245,239,228,0.12)",
              }}
            >
              <span style={{ ...TYPE.small, color: C.creamDeep }}>{m.name}</span>
              <span style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: C.cream,
                  }}
                >
                  {m.val}
                </span>
                <span style={{ ...TYPE.mono, color: C.inkFaint }}>{m.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// MEDIUM: AI chat card
// =============================================================================
function AIChatCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: "span 3",
        position: "relative",
        background: C.paper,
        borderRadius: 28,
        border: `1px solid ${C.line}`,
        padding: 32,
        overflow: "hidden",
        boxShadow: C.shadow,
      }}
    >
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        AI CHAT
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 500,
          margin: 0,
          letterSpacing: "-0.02em",
          marginBottom: 20,
        }}
      >
        Ask your data anything.
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <motion.div
          animate={{
            opacity: 1,
            x: hovered ? 0 : 0,
          }}
          style={{
            alignSelf: "flex-end",
            maxWidth: "75%",
            padding: "10px 14px",
            background: C.ink,
            color: C.cream,
            borderRadius: 14,
            borderBottomRightRadius: 4,
            fontSize: 14,
          }}
        >
          Why is my glucose rising?
        </motion.div>
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0.8,
          }}
          style={{
            alignSelf: "flex-start",
            maxWidth: "85%",
            padding: "10px 14px",
            background: C.creamDeep,
            color: C.ink,
            borderRadius: 14,
            borderBottomLeftRadius: 4,
            fontSize: 14,
          }}
        >
          Over 5 years your fasting glucose went from 5.0 to 5.8. The rise is
          gradual and combined with family history...
        </motion.div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// WIDE: Doctor messaging
// =============================================================================
function DoctorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: "span 3",
        position: "relative",
        background: `linear-gradient(160deg, ${C.sageDeep} 0%, ${C.sage} 100%)`,
        borderRadius: 28,
        padding: 32,
        overflow: "hidden",
        color: C.cream,
      }}
    >
      <div style={{ ...TYPE.mono, color: "rgba(245,239,228,0.7)", marginBottom: 14 }}>
        DOCTOR MESSAGING
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 500,
          margin: 0,
          letterSpacing: "-0.02em",
          marginBottom: 20,
          color: C.cream,
        }}
      >
        Talk to a real Swedish doctor.
      </h3>

      <div
        style={{
          padding: 16,
          background: "rgba(12,14,11,0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: 14,
          border: "1px solid rgba(245,239,228,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: C.creamSoft,
            marginBottom: 6,
          }}
        >
          Dr. Marcus Johansson  /  Internal medicine
        </div>
        <p
          style={{
            fontSize: 14,
            margin: 0,
            lineHeight: 1.5,
            color: "rgba(245,239,228,0.85)",
          }}
        >
          "Your glucose trend warrants attention. Let's retest in 6 months and
          talk about supplementing Vitamin D."
        </p>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SMALL: Training card
// =============================================================================
function TrainingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      style={{
        gridColumn: "span 3",
        position: "relative",
        background: C.amber,
        borderRadius: 28,
        padding: 32,
        overflow: "hidden",
        color: C.ink,
      }}
    >
      <div style={{ ...TYPE.mono, color: "rgba(12,14,11,0.6)", marginBottom: 14 }}>
        TRAINING PLAN
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 500,
          margin: 0,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          color: C.ink,
        }}
      >
        A plan built for your metabolism.
      </h3>
      <p
        style={{
          ...TYPE.small,
          color: "rgba(12,14,11,0.7)",
          margin: 0,
        }}
      >
        Real exercises, sets and reps. Designed by a certified trainer and
        reviewed by your doctor. Not generic "exercise more" advice.
      </p>
    </motion.div>
  );
}

// =============================================================================
// SMALL: Retests card
// =============================================================================
function RetestCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      style={{
        gridColumn: "span 3",
        position: "relative",
        background: C.creamSoft,
        borderRadius: 28,
        padding: 32,
        overflow: "hidden",
        border: `1px solid ${C.line}`,
      }}
    >
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        QUARTERLY RETESTS
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 500,
          margin: 0,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          color: C.ink,
        }}
      >
        Four tests a year, one trajectory.
      </h3>
      <p
        style={{
          ...TYPE.small,
          color: C.inkMuted,
          margin: 0,
        }}
      >
        Your profile updates with every blood draw. You see the slope, not just
        the number.
      </p>
    </motion.div>
  );
}
