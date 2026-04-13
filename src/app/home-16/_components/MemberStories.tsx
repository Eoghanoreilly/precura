"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { COLORS, SYSTEM_FONT, IMG, RADIUS } from "./tokens";

/**
 * MEMBER STORIES
 *
 * Warm, editorial carousel of real member outcomes. Left: the photo card
 * with member name and city. Right: long-form quote + specific outcome
 * chip. Thumbnails below act as selectors. Airbnb-warm, not a star grid.
 */

type Story = {
  key: string;
  name: string;
  age: number;
  city: string;
  photo: string;
  joined: string;
  quote: string;
  outcome: string;
  outcomeLabel: string;
};

const STORIES: Story[] = [
  {
    key: "lotta",
    name: "Lotta Svensson",
    age: 44,
    city: "Stockholm",
    photo: IMG.member1,
    joined: "Joined Feb 2026",
    quote:
      "I have been getting annual bloodwork for ten years at my vardcentral. Precura was the first time anyone plotted the trend across those ten years on one chart. My glucose had been rising slowly the whole time. Nobody ever said it out loud.",
    outcomeLabel: "What changed",
    outcome:
      "Caught a decade-long glucose drift that had never been flagged before.",
  },
  {
    key: "erik",
    name: "Erik Lindqvist",
    age: 38,
    city: "Malmo",
    photo: IMG.member2,
    joined: "Joined Nov 2025",
    quote:
      "My mum was diagnosed with Type 2 at 56. I went to my regular GP, she said my numbers were fine. Precura ran the FINDRISC model, factored in my mother, and told me I was in the moderate band. I started walking after dinner, moved my workouts to mornings. Six months later my fasting glucose had dropped from 5.6 to 5.2.",
    outcomeLabel: "Six month result",
    outcome: "Glucose down 0.4 mmol/L. Moved from moderate to low risk.",
  },
  {
    key: "anja",
    name: "Anja Bjornsson",
    age: 35,
    city: "Gothenburg",
    photo: IMG.member3,
    joined: "Joined Jan 2026",
    quote:
      "What I trust is the honesty. No miracle language. Dr. Marcus wrote back on my panel and said my cholesterol was borderline, that we would retest in six months, and that nothing dramatic needed to happen yet. That is the calm, real thing I wanted from a doctor.",
    outcomeLabel: "Why it stuck",
    outcome: "A real doctor note on every panel. No miracle claims.",
  },
  {
    key: "mikael",
    name: "Mikael Andersson",
    age: 51,
    city: "Uppsala",
    photo: IMG.member4,
    joined: "Joined Sep 2025",
    quote:
      "I had a hip fracture when I was 48 and my mother has osteoporosis. My GP had never once run a FRAX score for me. Precura did it on day one, flagged me as elevated, and my coach adjusted my training to include weight-bearing work. I feel like somebody is finally watching.",
    outcomeLabel: "What got caught",
    outcome: "Elevated fracture risk missed by 3 years of normal care.",
  },
  {
    key: "sara",
    name: "Sara Nyberg",
    age: 42,
    city: "Lund",
    photo: IMG.member5,
    joined: "Joined Dec 2025",
    quote:
      "I had been tired for two winters and I assumed it was the kids. My Vitamin D was 38. Not dangerous, but low enough for Dr. Marcus to tell me to supplement, and the coach rebuilt my training load. The tired thing lifted inside a month. A regular GP never once tested it.",
    outcomeLabel: "What changed",
    outcome: "Vitamin D back to 72. First real energy in two winters.",
  },
];

export function MemberStories() {
  const [activeKey, setActiveKey] = useState(STORIES[0].key);
  const active = STORIES.find((s) => s.key === activeKey)!;

  return (
    <section
      id="members"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 130px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 56,
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                background: COLORS.sageSoft,
                color: COLORS.sage,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Member stories
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(32px, 4.6vw, 56px)",
                fontWeight: 600,
                lineHeight: 1.06,
                letterSpacing: "-0.028em",
              }}
            >
              From the first{" "}
              <span style={{ color: COLORS.coral }}>2,000 members.</span>
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: COLORS.inkMuted,
              maxWidth: 360,
            }}
          >
            Real people, real outcomes. Every quote on this page came from a
            Swedish member we asked in plain Swedish, then translated. No
            composite characters, no star grids.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{
            background: COLORS.bgPaper,
            borderRadius: RADIUS.cardLarge,
            border: `1px solid ${COLORS.line}`,
            boxShadow: COLORS.shadowMedium,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            minHeight: 520,
          }}
          className="home16-stories-main"
        >
          {/* Photo side */}
          <div
            style={{
              position: "relative",
              background: COLORS.bgSoft,
              minHeight: 420,
            }}
            className="home16-stories-photo"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.key}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${active.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </AnimatePresence>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(28,26,22,0) 45%, rgba(28,26,22,0.75) 100%)",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.key + "-caption"}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                style={{
                  position: "absolute",
                  left: 28,
                  right: 28,
                  bottom: 26,
                  color: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    opacity: 0.82,
                    marginBottom: 6,
                  }}
                >
                  Precura member, age {active.age}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.12,
                  }}
                >
                  {active.name}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                    opacity: 0.85,
                    fontWeight: 500,
                  }}
                >
                  {active.city} / {active.joined}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote side */}
          <div
            style={{
              padding: "44px 46px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 28,
            }}
            className="home16-stories-quote"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.key + "-body"}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Quote
                  size={28}
                  strokeWidth={2}
                  style={{ color: COLORS.coral, marginBottom: 20 }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(20px, 2vw, 24px)",
                    lineHeight: 1.45,
                    color: COLORS.ink,
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {active.quote}
                </p>

                <div
                  style={{
                    marginTop: 28,
                    display: "inline-flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "14px 18px",
                    background: COLORS.sageSoft,
                    borderRadius: RADIUS.chip,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.sage,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {active.outcomeLabel}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: COLORS.ink,
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {active.outcome}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail selectors */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 8,
              }}
              className="home16-stories-thumbs"
            >
              {STORIES.map((s) => {
                const isActive = s.key === activeKey;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveKey(s.key)}
                    aria-label={`See story from ${s.name}`}
                    style={{
                      position: "relative",
                      width: isActive ? 74 : 54,
                      height: 54,
                      borderRadius: 14,
                      border: isActive
                        ? `2px solid ${COLORS.coral}`
                        : `1px solid ${COLORS.line}`,
                      padding: 0,
                      background: `url(${s.photo}) center / cover`,
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                      boxShadow: isActive
                        ? "0 6px 20px rgba(232,90,79,0.25)"
                        : "0 1px 4px rgba(28,26,22,0.06)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 12,
                        background: isActive
                          ? "linear-gradient(180deg, rgba(28,26,22,0) 40%, rgba(28,26,22,0.55) 100%)"
                          : "rgba(28,26,22,0.2)",
                      }}
                    />
                  </button>
                );
              })}
              <div
                style={{
                  marginLeft: 4,
                  fontSize: 12,
                  color: COLORS.inkMuted,
                  fontWeight: 500,
                }}
              >
                Tap a face to read their story
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-stories-main) {
            grid-template-columns: 1fr !important;
          }
          :global(.home16-stories-photo) {
            min-height: 360px !important;
          }
          :global(.home16-stories-quote) {
            padding: 32px 28px !important;
          }
        }
      `}</style>
    </section>
  );
}
