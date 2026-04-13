"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * HOW IT WORKS - Technique: 3D isometric scene via react-three-fiber.
 * Three floating objects (vial, processor, profile card) animate with
 * gentle rotation and respond to mouse position. Each object corresponds
 * to a step on the right. Falls back to a flat SVG on SSR/mobile.
 */

// Dynamic import so Three.js never runs in SSR
const ThreeScene = dynamic(() => import("./HowItWorksScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: C.creamSoft,
        borderRadius: 28,
      }}
    />
  ),
});

export function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        position: "relative",
        background: C.creamSoft,
        padding: "160px 32px 180px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        overflow: "hidden",
      }}
    >
      {/* Background dot grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.line} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
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
          03 / HOW IT WORKS
        </div>

        <h2
          style={{
            ...TYPE.displayLarge,
            margin: 0,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          Three steps.{" "}
          <span style={{ color: C.sage, fontStyle: "italic" }}>
            One trajectory.
          </span>
        </h2>
        <p
          style={{
            ...TYPE.lead,
            color: C.inkSoft,
            maxWidth: 620,
            margin: 0,
            marginBottom: 80,
          }}
        >
          From vein to insight in about two weeks. You do one thing. We do the
          rest, and a Swedish doctor reviews every result.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="home10-how-grid"
        >
          {/* 3D scene */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1 / 1",
              maxHeight: 560,
              borderRadius: 28,
              overflow: "hidden",
              background: `linear-gradient(165deg, ${C.cream} 0%, ${C.creamDeep} 100%)`,
              border: `1px solid ${C.line}`,
              boxShadow: C.shadowLift,
            }}
          >
            <Suspense fallback={<div style={{ width: "100%", height: "100%" }} />}>
              <ThreeScene />
            </Suspense>

            {/* Overlay label */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                ...TYPE.mono,
                color: C.inkMuted,
                padding: "8px 14px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: 100,
                border: `1px solid ${C.line}`,
              }}
            >
              DRAG TO ROTATE
            </div>
          </div>

          {/* Steps */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {[
              {
                num: "01",
                title: "One blood test",
                body: "Book a draw at any Swedish lab, or order an at-home kit. We cover 24 biomarkers including HbA1c, lipid panel, liver, kidney and Vitamin D.",
                chip: "22 markers",
              },
              {
                num: "02",
                title: "Three validated risk models",
                body: "FINDRISC for diabetes, SCORE2 for cardiovascular, FRAX for bone. We run them on your current values plus your multi-year trajectory.",
                chip: "FINDRISC / SCORE2 / FRAX",
              },
              {
                num: "03",
                title: "Your profile, reviewed by a doctor",
                body: "A Swedish doctor reviews every result, writes a plain-English note, and flags anything worth discussing in a consultation.",
                chip: "Dr. review included",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: "flex",
                  gap: 24,
                  padding: "28px 28px 28px 0",
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.inkMuted,
                    minWidth: 42,
                    paddingTop: 4,
                  }}
                >
                  {s.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      margin: 0,
                      marginBottom: 10,
                      color: C.ink,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...TYPE.body,
                      color: C.inkSoft,
                      margin: 0,
                      marginBottom: 14,
                    }}
                  >
                    {s.body}
                  </p>
                  <span
                    style={{
                      ...TYPE.mono,
                      color: C.sageDeep,
                      padding: "6px 12px",
                      background: "rgba(107,143,113,0.12)",
                      borderRadius: 100,
                    }}
                  >
                    {s.chip}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-how-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
