"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * HOW IT WORKS - Vertical flow, 3 steps. Alternating layout.
 * Each step has a warm illustration card + label + title + copy.
 * NOT 3 numbered circles. NOT a horizontal grid. Vertical rhythm.
 */
export function HowItWorks() {
  const steps = [
    {
      num: "Step 01",
      title: "Kit arrives in 3 days.",
      body: "We ship your welcome kit to your door: a blood sample collection box, your membership card, and a printed welcome note from Dr. Tomas. You drop the sample at any Swedish Post office. Labs within 48 hours.",
      pillImage: (
        <BoxIllustration />
      ),
      accent: C.terracottaTint,
    },
    {
      num: "Step 02",
      title: "Your profile goes live.",
      body: "Once results land, we pull your 1177 history and build your living profile. Three validated risk models (FINDRISC, SCORE2, FRAX) plus 22 biomarkers. Dr. Tomas writes you a personal note. Everything in plain English.",
      pillImage: <ProfileIllustration />,
      accent: C.sageTint,
    },
    {
      num: "Step 03",
      title: "You get a team, not a PDF.",
      body: "Your coach builds a training plan around your numbers. Your doctor answers messages in 24 hours. Every 3 months we retest. Every test updates your trajectory. Not a one-off report, a year-long relationship.",
      pillImage: <TeamIllustration />,
      accent: C.butterTint,
    },
  ];

  return (
    <section
      id="how"
      style={{
        background: C.canvasSoft,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Section header */}
        <div
          style={{
            marginBottom: 80,
            maxWidth: 720,
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
            How your membership starts
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
            From BankID sign-in to your first doctor&apos;s note,{" "}
            <span style={{ color: C.terracotta, fontStyle: "italic", fontWeight: 500 }}>
              about eight days.
            </span>
          </motion.h2>
        </div>

        {/* Vertical steps */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Vertical line connector */}
          <div
            style={{
              position: "absolute",
              top: 40,
              bottom: 40,
              left: "50%",
              width: 1,
              background: `repeating-linear-gradient(to bottom, ${C.lineCard} 0 4px, transparent 4px 10px)`,
              zIndex: 0,
            }}
            className="home17-how-connector"
          />

          {steps.map((step, i) => {
            const rightAligned = i % 2 === 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 40,
                  alignItems: "center",
                  zIndex: 1,
                }}
                className="home17-how-row"
              >
                {/* Illustration side */}
                <div
                  style={{
                    order: rightAligned ? 2 : 1,
                    background: step.accent,
                    borderRadius: 24,
                    padding: 32,
                    minHeight: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${C.lineCard}`,
                    boxShadow: C.shadowSoft,
                  }}
                >
                  {step.pillImage}
                </div>

                {/* Copy side */}
                <div
                  style={{
                    order: rightAligned ? 1 : 2,
                    padding: rightAligned ? "0 24px 0 0" : "0 0 0 24px",
                  }}
                  className="home17-how-copy"
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: C.terracotta,
                      marginBottom: 10,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontSize: "clamp(26px, 2.6vw, 34px)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      fontWeight: 600,
                      color: C.ink,
                      margin: 0,
                      marginBottom: 14,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: C.inkMuted,
                      margin: 0,
                      maxWidth: 440,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home17-how-connector) {
            display: none !important;
          }
          :global(.home17-how-row) {
            grid-template-columns: 1fr !important;
          }
          :global(.home17-how-row > div:first-child) {
            order: 1 !important;
          }
          :global(.home17-how-row > div:last-child) {
            order: 2 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Illustrations - CSS/SVG, no images, warm and editorial
// =============================================================================
function BoxIllustration() {
  return (
    <div style={{ position: "relative", width: 220, height: 180 }}>
      {/* Box base */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) rotateX(18deg)",
          width: 180,
          height: 108,
          background: C.terracotta,
          borderRadius: 12,
          boxShadow: "0 12px 30px rgba(201,87,58,0.24)",
        }}
      />
      {/* Lid */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%) rotate(-6deg)",
          width: 184,
          height: 22,
          background: C.terracottaDeep,
          borderRadius: 4,
        }}
      />
      {/* Stamp */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          padding: "4px 10px",
          background: C.canvasSoft,
          borderRadius: 4,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.terracotta,
          transform: "rotate(6deg)",
          border: `1.5px dashed ${C.terracotta}`,
        }}
      >
        Precura
      </div>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          fontWeight: 600,
          color: C.canvasSoft,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Welcome Kit / 01
      </div>
    </div>
  );
}

function ProfileIllustration() {
  return (
    <div
      style={{
        width: 260,
        background: C.paper,
        borderRadius: 16,
        padding: 20,
        boxShadow: C.shadowSoft,
        border: `1px solid ${C.lineCard}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.inkFaint,
          }}
        >
          Living profile
        </div>
        <div
          style={{
            padding: "2px 8px",
            background: C.sageTint,
            color: C.sageDeep,
            borderRadius: 100,
            fontSize: 9,
            fontWeight: 600,
          }}
        >
          LIVE
        </div>
      </div>
      {[
        { label: "Diabetes", val: 58, color: C.caution, tag: "Moderate" },
        { label: "Heart", val: 28, color: C.butter, tag: "Low-mod" },
        { label: "Bone", val: 15, color: C.good, tag: "Low" },
      ].map((r, i) => (
        <div key={i} style={{ marginBottom: i === 2 ? 0 : 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
              fontSize: 12,
              color: C.inkSoft,
            }}
          >
            <span style={{ fontWeight: 500 }}>{r.label}</span>
            <span style={{ color: r.color, fontWeight: 600 }}>{r.tag}</span>
          </div>
          <div
            style={{
              height: 5,
              background: C.canvasDeep,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${r.val}%`,
                height: "100%",
                background: r.color,
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamIllustration() {
  const people = [
    { initials: "MJ", role: "Doctor", bg: C.sageDeep },
    { initials: "LK", role: "Coach", bg: C.terracotta },
    { initials: "PC", role: "Chat", bg: C.ink },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        {people.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: p.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.canvasSoft,
                fontSize: 16,
                fontWeight: 700,
                boxShadow: C.shadowSoft,
              }}
            >
              {p.initials}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.inkMuted,
                letterSpacing: "0.04em",
              }}
            >
              {p.role}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 16px",
          background: C.paper,
          borderRadius: 100,
          boxShadow: C.shadowSoft,
          border: `1px solid ${C.lineCard}`,
          fontSize: 12,
          color: C.inkSoft,
          fontWeight: 500,
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.good,
          }}
        />
        All on one thread
      </div>
    </div>
  );
}
