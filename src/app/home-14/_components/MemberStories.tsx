"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE, IMG } from "./tokens";

/**
 * MEMBER STORIES - "Stories from the first 2,000 members"
 * Editorial feature wall with five stories laid out in a staggered
 * print grid. Each story has a large portrait, a headline, and a
 * captioned body. No star ratings, no testimonial quote cards.
 */
export function MemberStories() {
  const stories = [
    {
      image: IMG.member1,
      name: "Lotta Svensson",
      role: "Account director, Stockholm",
      age: 44,
      headline: "Ten years of data, one slope.",
      body:
        "I have been getting bloodwork for a decade. Precura was the first time anyone showed me the trend across all ten years. The rising glucose was obvious once I saw it on one chart.",
      pull: "Once I saw it on one chart, it was obvious.",
      span: 6,
    },
    {
      image: IMG.member2,
      name: "Erik Lindqvist",
      role: "Teacher, Malmo",
      age: 38,
      headline: "Caught a moderate risk early.",
      body:
        "My mum was diagnosed with type 2 diabetes. I went to my regular GP, she said my numbers were fine. Precura said I was in the moderate band. I made changes. Six months later my glucose dropped.",
      pull: null,
      span: 6,
    },
    {
      image: IMG.member3,
      name: "Anja Bjornsson",
      role: "Product designer, Gothenburg",
      age: 35,
      headline: "Real doctor notes.",
      body:
        "What I like is the honesty. No miracle promises. The doctor's note on my results actually said 'your cholesterol is borderline, let us retest in six months'. That is what I would expect from a real clinician.",
      pull: null,
      span: 4,
    },
    {
      image: IMG.member4,
      name: "Johan Persson",
      role: "Engineer, Uppsala",
      age: 52,
      headline: "My coach rewrote my week.",
      body:
        "My blood work pointed at insulin resistance. The plan I got back was not generic advice. It was a specific block of Zone 2 cardio, two lifts per week, and a carb-timing change. My HbA1c moved.",
      pull: null,
      span: 4,
    },
    {
      image: IMG.member1,
      name: "Kim Nordqvist",
      role: "Architect, Lund",
      age: 41,
      headline: "It talks to my GP, not over them.",
      body:
        "The FHIR export went straight into my vardcentral's system. My own GP read the Precura note and thanked me for bringing it in. It filled a gap in the picture she already had.",
      pull: null,
      span: 4,
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        background: C.paperSoft,
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
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 08</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>Members</div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Reportage / 5 stories
          </div>
        </div>

        {/* Title */}
        <div
          className="ms14-open"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 60,
            marginBottom: 80,
            alignItems: "end",
          }}
        >
          <h2
            style={{
              ...TYPE.chapter,
              margin: 0,
              maxWidth: 900,
            }}
          >
            Stories from the first{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>
              2,000 members.
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
            Five real members, five different reasons to join. None of them
            were star ratings.
          </p>
        </div>

        {/* Feature grid: a large top block and smaller below */}
        <div
          className="ms14-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 40,
          }}
        >
          {stories.map((s, i) => {
            const isLarge = s.span === 6;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 1,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={isLarge ? "ms14-large" : "ms14-small"}
                style={{
                  gridColumn: `span ${s.span}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Photo */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: isLarge ? "16 / 11" : "4 / 3",
                    backgroundImage: `url(${s.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 30%",
                    filter: "grayscale(22%) contrast(1.03)",
                  }}
                />

                {/* Dateline + name */}
                <div
                  style={{
                    paddingTop: 12,
                    borderTop: `1px solid ${C.rule}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MONO_FONT,
                        fontSize: 10,
                        color: C.rust,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Member #{String(i + 1).padStart(4, "0")}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO_FONT,
                        fontSize: 10,
                        color: C.inkFaint,
                        letterSpacing: "0.1em",
                      }}
                    >
                      Age {s.age}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: isLarge
                        ? "clamp(26px, 2.6vw, 34px)"
                        : "clamp(20px, 1.6vw, 22px)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      fontWeight: 600,
                      color: C.ink,
                      margin: 0,
                      marginBottom: 12,
                    }}
                  >
                    {s.headline}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: isLarge ? 15 : 13,
                      lineHeight: 1.65,
                      color: C.inkSoft,
                    }}
                  >
                    {s.body}
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 12,
                      color: C.inkMuted,
                      fontStyle: "italic",
                    }}
                  >
                    {s.name} / {s.role}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom meta band */}
        <div
          style={{
            marginTop: 80,
            paddingTop: 32,
            borderTop: `2px solid ${C.ink}`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
          className="ms14-meta"
        >
          {[
            { k: "Members", v: "2,000+" },
            { k: "Avg age", v: "38" },
            { k: "Cities", v: "Stockholm / Malmo / Gothenburg / Lund" },
            { k: "Retention", v: "91% annual" },
          ].map((m, i) => (
            <div key={i}>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkMuted,
                  marginBottom: 6,
                }}
              >
                {m.k}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: C.ink,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.ms14-open),
          :global(.ms14-grid),
          :global(.ms14-meta) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          :global(.ms14-grid > *) {
            grid-column: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
