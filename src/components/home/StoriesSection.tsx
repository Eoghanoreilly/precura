"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * STORIES - "Stories from the first 2,000 members"
 * Magazine-style editorial grid. Mix of quote cards and a big headline.
 * Warm, human, avoids the standard star-rating grid.
 */
export function StoriesSection() {
  const stories = [
    {
      quote:
        "I had been getting annual bloodwork for a decade. Precura was the first time anyone showed me the trend across ten years. Suddenly the rising glucose was obvious.",
      name: "Lotta S.",
      role: "44 / Stockholm",
      tag: "10 years of data, one chart",
      bg: C.paper,
      color: C.ink,
      accent: C.terracotta,
    },
    {
      quote:
        "My mum was diagnosed with type 2 at 58. My regular GP kept saying I was fine. Precura&apos;s risk model put me in the moderate band. Six months later my glucose had dropped.",
      name: "Erik L.",
      role: "38 / Malmo",
      tag: "Moderate band caught early",
      bg: C.sageTint,
      color: C.ink,
      accent: C.sageDeep,
    },
    {
      quote:
        "What I like is the honesty. No miracles. Dr. Tomas actually wrote that my cholesterol was borderline and let&apos;s retest in six months. That&apos;s what I&apos;d expect from a real clinician.",
      name: "Anja B.",
      role: "35 / Gothenburg",
      tag: "Real doctor notes",
      bg: C.terracottaTint,
      color: C.ink,
      accent: C.terracottaDeep,
    },
    {
      quote:
        "The coach built my training plan around my numbers. After 12 weeks my resting HR dropped 6 bpm. I&apos;ve never had a plan that felt this personal before.",
      name: "Johan K.",
      role: "51 / Uppsala",
      tag: "Training that knows you",
      bg: C.butterTint,
      color: C.ink,
      accent: C.terracottaDeep,
    },
  ];

  return (
    <section
      style={{
        background: C.canvas,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 48,
            alignItems: "flex-end",
            marginBottom: 56,
          }}
          className="home17-stories-header"
        >
          <div>
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
              Voices
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              style={{
                fontSize: "clamp(38px, 4.6vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.032em",
                fontWeight: 600,
                color: C.ink,
                margin: 0,
              }}
            >
              Stories from the first{" "}
              <span
                style={{
                  color: C.terracotta,
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                2,000 members.
              </span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: C.inkMuted,
              margin: 0,
              paddingBottom: 10,
            }}
          >
            Real members talking about real changes. Names shortened to
            protect their privacy.
          </motion.p>
        </div>

        {/* Story cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="home17-stories-grid"
        >
          {stories.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                background: s.bg,
                color: s.color,
                padding: 40,
                borderRadius: 24,
                border: `1px solid ${C.lineCard}`,
                boxShadow: C.shadowSoft,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Big quote mark */}
              <div
                style={{
                  fontSize: 80,
                  fontFamily: "Georgia, serif",
                  color: s.accent,
                  lineHeight: 0.6,
                  marginBottom: 16,
                  opacity: 0.35,
                }}
              >
                &ldquo;
              </div>

              <p
                style={{
                  fontSize: 19,
                  lineHeight: 1.5,
                  margin: 0,
                  marginBottom: 28,
                  color: C.ink,
                  letterSpacing: "-0.01em",
                }}
                dangerouslySetInnerHTML={{ __html: s.quote }}
              />

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 20,
                  borderTop: `1px solid ${C.lineSoft}`,
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.ink,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.inkMuted,
                      marginTop: 2,
                    }}
                  >
                    {s.role}
                  </div>
                </div>
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 600,
                    color: s.accent,
                    background: "rgba(255,255,255,0.55)",
                    border: `1px solid ${s.accent}`,
                  }}
                >
                  {s.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home17-stories-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home17-stories-header) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
