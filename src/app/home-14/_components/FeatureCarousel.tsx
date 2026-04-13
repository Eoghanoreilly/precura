"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE, IMG } from "./tokens";

/**
 * FEATURE CAROUSEL - a clickable editorial carousel styled like a
 * magazine "Inside this issue" spread. The reader picks a feature from
 * the vertical index on the left, and the main photo + caption + body
 * cross-fade on the right.
 *
 * Six features:
 *   - The blood draw
 *   - The risk engine
 *   - The doctor note
 *   - The coach plan
 *   - The living profile
 *   - The quarterly retest
 */
export function FeatureCarousel() {
  const features = [
    {
      num: "I",
      title: "The blood draw",
      summary:
        "Ten minutes in a partner clinic in Stockholm, Goteborg, Malmo, Uppsala or Lund. One arm. Forty-plus markers. No fasting gymnastics.",
      image: IMG.lab,
      tag: "Logistics",
      meta: "995 SEK / 10 min",
    },
    {
      num: "II",
      title: "The risk engine",
      summary:
        "Your blood feeds FINDRISC, SCORE2, FRAX, SDPP, UKPDS and DPP. We compute an integrated ten-year trajectory, not a single score, and flag the levers you can pull.",
      image: IMG.spread2,
      tag: "Models",
      meta: "6 validated models",
    },
    {
      num: "III",
      title: "The doctor note",
      summary:
        "Dr. Marcus Johansson reviews every panel personally. He writes in Swedish or English, signs your summary, and answers your chat for the full year.",
      image: IMG.doctor,
      tag: "Doctor",
      meta: "Human / Named",
    },
    {
      num: "IV",
      title: "The coach plan",
      summary:
        "A certified coach builds a training and nutrition block around your metabolism. Real sets, reps and loads. Adjusted every time your blood changes.",
      image: IMG.spread3,
      tag: "Coaching",
      meta: "Marker-aligned",
    },
    {
      num: "V",
      title: "The living profile",
      summary:
        "A continuously updating health twin. Import, export, annotate, share with your own GP. Not a static PDF, not a black box dashboard, yours forever.",
      image: IMG.spread4,
      tag: "Artifact",
      meta: "FHIR export",
    },
    {
      num: "VI",
      title: "The quarterly retest",
      summary:
        "Every 90 days you draw again. Your profile updates, your models re-run, your coach adjusts, your doctor flags anything unusual. You see the slope, not the snapshot.",
      image: IMG.spread5,
      tag: "Cadence",
      meta: "4x per year",
    },
  ];

  const [active, setActive] = useState(0);
  const current = features[active];

  return (
    <section
      style={{
        position: "relative",
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Chapter header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.rule}`,
            paddingBottom: 20,
            marginBottom: 80,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 06</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Inside this issue
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Click to browse / 06 features
          </div>
        </div>

        {/* Opener */}
        <div
          className="fc14-opener"
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 48,
            marginBottom: 64,
            alignItems: "end",
          }}
        >
          <h2
            style={{
              ...TYPE.chapter,
              margin: 0,
              maxWidth: 820,
            }}
          >
            Pick a feature.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>
              Read the story.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.deck,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 380,
            }}
          >
            Each pillar of Precura, photographed and captioned like the
            department pages of a quarterly magazine. Tap any line to read
            more.
          </p>
        </div>

        {/* Carousel layout */}
        <div
          className="fc14-body"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 56,
            minHeight: 620,
          }}
        >
          {/* Index list */}
          <nav
            aria-label="Feature carousel"
            style={{
              borderTop: `2px solid ${C.ink}`,
            }}
          >
            {features.map((f, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    all: "unset",
                    display: "grid",
                    gridTemplateColumns: "40px 1fr auto",
                    gap: 16,
                    width: "100%",
                    padding: "22px 0",
                    borderBottom: `1px solid ${C.rule}`,
                    cursor: "pointer",
                    alignItems: "baseline",
                    color: isActive ? C.ink : C.inkMuted,
                    transition: "color 0.4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      color: isActive ? C.rust : C.inkFaint,
                      fontWeight: 600,
                    }}
                  >
                    {f.num}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(19px, 2vw, 26px)",
                      letterSpacing: "-0.015em",
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 10,
                      color: isActive ? C.ink : C.inkFaint,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {f.tag}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Main photo + caption */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Photo frame */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: 440,
                overflow: "hidden",
                background: C.paperDeep,
                border: `1px solid ${C.ink}`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${current.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(18%) contrast(1.02)",
                  }}
                />
              </AnimatePresence>

              {/* Big numeral watermark */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  fontFamily: MONO_FONT,
                  fontSize: 12,
                  color: C.paper,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  background: "rgba(20,18,14,0.58)",
                  padding: "6px 10px",
                  mixBlendMode: "normal",
                }}
              >
                {current.tag}
              </div>

              {/* Corner meta */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px 24px",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(20,18,14,0.82) 100%)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    color: C.paper,
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {current.title}
                </div>
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 10,
                    color: C.paper,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {current.meta}
                </div>
              </div>
            </div>

            {/* Caption block below */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: `1px solid ${C.rule}`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        ...TYPE.mono,
                        color: C.inkMuted,
                      }}
                    >
                      Feature {current.num} / of VI
                    </div>
                    <div style={{ ...TYPE.mono, color: C.rust }}>
                      {current.tag}
                    </div>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: C.ink,
                      letterSpacing: "-0.005em",
                      maxWidth: 620,
                    }}
                  >
                    {current.summary}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot controls */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: `1px solid ${C.rule}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                {features.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Feature ${i + 1}`}
                    onClick={() => setActive(i)}
                    style={{
                      all: "unset",
                      width: i === active ? 36 : 10,
                      height: 4,
                      background: i === active ? C.ink : C.rule,
                      cursor: "pointer",
                      transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkFaint,
                }}
              >
                {String(active + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.fc14-opener),
          :global(.fc14-body) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
