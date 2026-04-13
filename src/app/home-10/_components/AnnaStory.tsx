"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * ANNA'S STORY - Technique: Horizontal scroll-pinned carousel.
 * The section pins vertically for the duration of the carousel, and
 * as the user scrolls, five yearly panels slide horizontally through
 * view. Each panel mixes a portrait image with a data chip and a quote.
 *
 * This is a distinct technique from the other sections (no vertical
 * reveal or canvas effects). It feels cinematic, like flipping through
 * a longitudinal record.
 */
export function AnnaStory() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Move the track horizontally as scrollYProgress goes 0 to 1
  // 5 panels -> move by -80% of track (keeping some of first panel visible)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  const panels = [
    {
      year: "2021",
      age: 35,
      headline: "Glucose 5.0 mmol/L",
      label: "Normal",
      color: C.sage,
      image: IMG.annaWindow,
      quote:
        "Anna runs twice a week. Bloods check out. Her GP says everything looks good.",
      meta: "Routine check at Cityakuten",
    },
    {
      year: "2022",
      age: 36,
      headline: "Glucose 5.1 mmol/L",
      label: "Normal",
      color: C.sage,
      image: IMG.annaWalking,
      quote:
        "Mild hypertension diagnosed. She starts Enalapril 5mg. Bloodwork still normal.",
      meta: "132/84 on three readings",
    },
    {
      year: "2023",
      age: 37,
      headline: "Glucose 5.2 mmol/L",
      label: "Normal",
      color: C.sage,
      image: IMG.annaCoffee,
      quote:
        "Her mother is diagnosed with type 2 diabetes at 58. Anna asks her GP if she should worry. 'Your numbers are fine.'",
      meta: "Family history flagged",
    },
    {
      year: "2024",
      age: 38,
      headline: "Glucose 5.4 mmol/L",
      label: "Upper normal",
      color: C.signalCaution,
      image: IMG.annaCoffee,
      quote:
        "Weight up 2 kg. Father has a heart attack at 65. She notices she's more tired, shrugs it off.",
      meta: "LDL 2.8, HDL 1.6",
    },
    {
      year: "2025",
      age: 39,
      headline: "Glucose 5.5 mmol/L",
      label: "Upper normal",
      color: C.signalCaution,
      image: IMG.annaNight,
      quote:
        "Sleeps badly. Keeps waking at 3am. Reads about metabolic health at midnight.",
      meta: "HbA1c 37 mmol/mol",
    },
    {
      year: "2026",
      age: 40,
      headline: "Glucose 5.8 mmol/L",
      label: "Borderline",
      color: C.amber,
      image: IMG.annaPortrait,
      quote:
        "Anna joins Precura. Her 5-year trajectory finally has a name: pre-diabetic risk, moderate, mostly reversible.",
      meta: "FINDRISC 12/26, Precura member",
    },
  ];

  return (
    <section
      ref={wrapRef}
      style={{
        position: "relative",
        height: `${panels.length * 100}vh`,
        background: C.ink,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Section label */}
        <div
          style={{
            padding: "60px 48px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.amber,
                padding: "6px 12px",
                border: `1px solid ${C.amber}`,
                borderRadius: 100,
                display: "inline-block",
                marginBottom: 16,
              }}
            >
              02 / ANNA'S STORY
            </div>
            <h2
              style={{
                ...TYPE.displayMedium,
                color: C.cream,
                margin: 0,
                maxWidth: 720,
              }}
            >
              Five years, six blood tests, one missed story.
            </h2>
          </div>
          <div
            style={{
              ...TYPE.small,
              color: C.creamDeep,
              maxWidth: 360,
              marginTop: 12,
            }}
          >
            Scroll through Anna's records. Each panel is a real test, taken a
            year apart. Each was signed off as normal.
          </div>
        </div>

        {/* Horizontal track */}
        <motion.div
          style={{
            display: "flex",
            gap: 32,
            padding: "20px 48px 60px",
            x,
            flex: 1,
            alignItems: "stretch",
          }}
        >
          {panels.map((p, i) => (
            <article
              key={i}
              style={{
                flexShrink: 0,
                width: "min(640px, 80vw)",
                borderRadius: 28,
                overflow: "hidden",
                background: C.inkSoft,
                border: `1px solid rgba(245,239,228,0.1)`,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Portrait */}
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  minHeight: 320,
                  backgroundImage: `url(${p.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Year stamp */}
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 88,
                      fontWeight: 500,
                      color: C.cream,
                      letterSpacing: "-0.04em",
                      lineHeight: 0.85,
                      mixBlendMode: "difference",
                    }}
                  >
                    {p.year}
                  </span>
                </div>

                {/* Corner label */}
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    ...TYPE.mono,
                    color: C.cream,
                    padding: "8px 14px",
                    background: "rgba(12,14,11,0.5)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 100,
                    border: "1px solid rgba(245,239,228,0.2)",
                  }}
                >
                  AGE {p.age}
                </div>

                {/* Bottom gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(12,14,11,0.85) 100%)",
                  }}
                />

                {/* Data chip in bottom corner */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    right: 24,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      ...TYPE.mono,
                      color: p.color,
                      padding: "6px 12px",
                      background: "rgba(12,14,11,0.7)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      borderRadius: 100,
                      border: `1px solid ${p.color}`,
                    }}
                  >
                    {p.label.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      color: C.cream,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {p.headline}
                  </span>
                </div>
              </div>

              {/* Quote strip */}
              <div
                style={{
                  padding: "24px 28px 28px",
                  borderTop: "1px solid rgba(245,239,228,0.08)",
                  background: C.ink,
                }}
              >
                <p
                  style={{
                    ...TYPE.body,
                    color: C.cream,
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  "{p.quote}"
                </p>
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.inkFaint,
                  }}
                >
                  {p.meta}
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 48,
            right: 48,
            height: 2,
            background: "rgba(245,239,228,0.15)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: C.amber,
              scaleX: scrollYProgress,
              transformOrigin: "0% 50%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
