"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * HOW IT WORKS - Vertical flow with three chapters. Banned: numbered
 * circles. Instead, each step is a wide content row with a real photo on
 * one side and a detailed card on the other, plus a thin connecting rail
 * running down the center so it reads as a flow.
 */
export function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        background: C.paper,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 80,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <div
              style={{
                ...TYPE.label,
                color: C.lingon,
                marginBottom: 20,
              }}
            >
              How it works
            </div>
            <h2 style={{ ...TYPE.displayLarge, margin: 0, marginBottom: 16 }}>
              Three chapters, one membership.
            </h2>
            <p style={{ ...TYPE.lead, color: C.inkSoft, margin: 0, maxWidth: 560 }}>
              Book your first panel today. Your profile lives and updates with
              every result. No PDFs, no chasing your GP.
            </p>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {/* Connecting rail */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: 24,
              bottom: 24,
              width: 2,
              background: `linear-gradient(180deg, ${C.lingon} 0%, ${C.amberDeep} 50%, ${C.euc} 100%)`,
              transform: "translateX(-50%)",
              borderRadius: 2,
            }}
            className="home18-rail"
          />

          <StepRow
            index={1}
            align="left"
            eyebrow="Chapter 1 / Book"
            title="Book a panel at a clinic near you."
            body="Pick a clinic, choose a date, and you're done. 20 minutes at the lab, covered by your membership, nothing to pay at the visit."
            bullets={[
              "More than 80 partner clinics across Sweden",
              "Next-day slots in most cities",
              "Your membership starts the day you confirm",
            ]}
            image={IMG.clinic}
            imageCaption="Cityakuten / Stockholm / Sveavagen 42"
            color={C.lingon}
          />

          <StepRow
            index={2}
            align="right"
            eyebrow="Chapter 2 / Understand"
            title="Dr. Marcus reads it. You see it in plain English."
            body="Every result goes through Dr. Marcus Johansson before you see it. Then you get a living profile - trends across years, risk models calculated, specific next steps."
            bullets={[
              "40+ biomarkers translated to plain Swedish and English",
              "FINDRISC, SCORE2, FRAX risk models updated automatically",
              "A written note from Dr. Marcus on every panel",
            ]}
            image={IMG.doctor}
            imageCaption="Dr. Marcus Johansson / Karolinska trained"
            color={C.amberDeep}
          />

          <StepRow
            index={3}
            align="left"
            eyebrow="Chapter 3 / Act"
            title="A coach, a plan, and a profile that keeps updating."
            body="You're assigned a coach. Together with Dr. Marcus, they build a training plan specific to your results. Not generic advice. A real prescription."
            bullets={[
              "Exercise prescription built around your risks",
              "Retest every six months, profile updates automatically",
              "Message your coach or doctor any time",
            ]}
            image={IMG.training}
            imageCaption="Coached by a certified trainer in Stockholm"
            color={C.euc}
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home18-rail) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Step row
// =============================================================================
function StepRow({
  index,
  align,
  eyebrow,
  title,
  body,
  bullets,
  image,
  imageCaption,
  color,
}: {
  index: number;
  align: "left" | "right";
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  imageCaption: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        marginBottom: 96,
        alignItems: "center",
      }}
      className="home18-step-grid"
    >
      {/* Content */}
      <div
        style={{
          order: align === "left" ? 1 : 2,
          paddingRight: align === "left" ? 20 : 0,
          paddingLeft: align === "right" ? 20 : 0,
        }}
        className={`home18-step-content home18-step-${align}`}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              border: `1px solid ${color}30`,
            }}
          >
            0{index}
          </div>
          <div
            style={{
              ...TYPE.label,
              color: color,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <h3
          style={{
            ...TYPE.displayMedium,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            ...TYPE.lead,
            color: C.inkSoft,
            margin: "0 0 24px",
          }}
        >
          {body}
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                ...TYPE.body,
                color: C.ink,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `${color}15`,
                  color: color,
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                +
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Image */}
      <div
        style={{
          order: align === "left" ? 2 : 1,
        }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "5/4",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: C.shadowCard,
            background: C.canvas,
          }}
        >
          <img
            src={image}
            alt={imageCaption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              padding: "8px 14px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 500,
              color: C.ink,
            }}
          >
            {imageCaption}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home18-step-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.home18-step-content) {
            order: 1 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
