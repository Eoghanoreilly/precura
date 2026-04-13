"use client";

/**
 * Social proof. Three testimonials in editorial stacked format.
 * Background is a slow Stockholm/archipelago layer. Quotes drift upward at
 * different speeds so they feel like they're pasted on a moving wall.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

const QUOTES = [
  {
    text:
      "My GP had told me \"everything looks fine\" for five years. The week I uploaded my history to Precura I could see the line. The same week I started a real plan.",
    name: "Anna B.",
    meta: "Stockholm / 40 / signed up Jan 2026",
    photo: IMG.anna,
    accent: C.terracotta,
  },
  {
    text:
      "I pay 2,995 kr a year and I stopped paying 1,200 kr every time I wanted a private blood panel from Werlabs. The tracking alone is worth more than that.",
    name: "Henrik S.",
    meta: "Goteborg / 52 / former Werlabs customer",
    photo: IMG.phone,
    accent: C.brass,
  },
  {
    text:
      "What I wanted was a doctor who actually read the whole chart. That is what Precura gave me. Dr. Johansson answered in 40 minutes on a Sunday.",
    name: "Sofia K.",
    meta: "Malmo / 36 / family history of CVD",
    photo: IMG.window,
    accent: C.green,
  },
];

export default function Social() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const bgY = useParallaxY(scrollYProgress, [-50, 140], reduceMotion);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  const q1Y = useParallaxY(scrollYProgress, [80, -80], reduceMotion);
  const q2Y = useParallaxY(scrollYProgress, [150, -150], reduceMotion);
  const q3Y = useParallaxY(scrollYProgress, [60, -60], reduceMotion);

  const yTransforms = [q1Y, q2Y, q3Y];

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "170vh",
        width: "100%",
        overflow: "hidden",
        background: C.cream,
        fontFamily: FONT.ui,
      }}
    >
      {/* Background layer */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          y: bgY,
          scale: bgScale,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-10%",
            backgroundImage: `url(${IMG.archipelago})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.85) contrast(1.05) brightness(1.05)",
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${C.cream} 0%, rgba(244,239,230,0.6) 50%, ${C.cream} 100%)`,
          }}
        />
      </motion.div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          padding: "clamp(80px, 10vw, 160px) clamp(24px, 6vw, 100px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "clamp(60px, 7vw, 120px)",
            maxWidth: "30ch",
          }}
        >
          <div
            style={{
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: "clamp(24px, 3vw, 40px)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: FONT.mono,
            }}
          >
            <span>/ 06</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 120,
                background: C.rule,
              }}
            />
            <span>From members</span>
          </div>
          <h2
            style={{
              fontSize: SIZE.h1,
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            <SplitReveal text="Three people" />
            <br />
            <SplitReveal
              text="we didn&rsquo;t know"
              delay={0.15}
            />
            <br />
            <SplitReveal
              text="six months ago."
              delay={0.3}
              style={{ color: C.terracotta, fontStyle: "italic" }}
            />
          </h2>
        </div>

        {/* Quotes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "clamp(32px, 3vw, 56px)",
            rowGap: "clamp(100px, 12vw, 200px)",
          }}
        >
          {QUOTES.map((q, i) => {
            const isOdd = i % 2 === 1;
            const col = i === 0 ? "1 / span 6" : i === 1 ? "7 / span 6" : "3 / span 7";
            const y = yTransforms[i];
            return (
              <motion.figure
                key={q.name}
                style={{
                  gridColumn: col,
                  y,
                  margin: 0,
                  padding: "clamp(24px, 3vw, 48px)",
                  background: isOdd ? C.ink : C.paper,
                  color: isOdd ? C.cream : C.ink,
                  position: "relative",
                  willChange: "transform",
                  maxWidth: 640,
                  marginLeft: isOdd ? "auto" : 0,
                }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1, delay: i * 0.15 }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -22,
                    left: 24,
                    background: q.accent,
                    color: C.cream,
                    padding: "6px 14px",
                    fontSize: SIZE.eyebrow,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: FONT.mono,
                    fontWeight: 600,
                  }}
                >
                  Member / Quote {i + 1}
                </div>
                <blockquote
                  style={{
                    fontSize: SIZE.h3,
                    fontWeight: 300,
                    lineHeight: 1.35,
                    margin: 0,
                    marginTop: 12,
                    letterSpacing: "-0.005em",
                  }}
                >
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: `1px solid ${isOdd ? C.ruleDark : C.rule}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundImage: `url(${q.photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: SIZE.body,
                        fontWeight: 500,
                      }}
                    >
                      {q.name}
                    </div>
                    <div
                      style={{
                        fontSize: SIZE.eyebrow,
                        fontFamily: FONT.mono,
                        letterSpacing: "0.08em",
                        opacity: 0.7,
                      }}
                    >
                      {q.meta}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
