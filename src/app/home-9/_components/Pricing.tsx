"use client";

/**
 * Pricing tiers.
 *
 * Background: soft birch forest, parallaxing slowly.
 * Foreground: three tier columns with differing y transforms to feel like
 * a musical chord rather than a static grid.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  features: string[];
  cta: string;
  accent: string;
  badge?: string;
  dark?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Single panel",
    price: "995",
    cadence: "SEK / one time",
    pitch: "One comprehensive blood test + a risk profile based on your answers.",
    features: [
      "35 marker blood panel",
      "FINDRISC, SCORE2, FRAX scores",
      "Plain English interpretation",
      "Lab: Karolinska University",
      "No subscription",
    ],
    cta: "Start with one test",
    accent: C.brass,
  },
  {
    name: "Annual membership",
    price: "2,995",
    cadence: "SEK / year",
    pitch:
      "The full picture. Two blood panels, the doctor thread, the AI chat, training plan.",
    features: [
      "Two 35 marker panels per year",
      "Living risk profile, updated every test",
      "Doctor messaging (4 hr response)",
      "AI chat grounded in your chart",
      "Personalised training program",
      "Priority retest window",
    ],
    cta: "Join Precura",
    accent: C.terracotta,
    badge: "Most common",
    dark: true,
  },
  {
    name: "Family plan",
    price: "4,995",
    cadence: "SEK / year",
    pitch:
      "Everything in the annual plan, for up to four people in the same household. Shared family history.",
    features: [
      "Up to 4 members, individual profiles",
      "Shared family history view",
      "Paediatric screening tools",
      "Family doctor thread",
      "Quarterly family review",
    ],
    cta: "Start a family plan",
    accent: C.green,
  },
];

export default function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const bgY = useParallaxY(scrollYProgress, [-40, 140], reduceMotion);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.22]);

  // Each tier drifts at a slightly different rate
  const tier1Y = useParallaxY(scrollYProgress, [80, -80], reduceMotion);
  const tier2Y = useParallaxY(scrollYProgress, [30, -30], reduceMotion);
  const tier3Y = useParallaxY(scrollYProgress, [60, -60], reduceMotion);
  const yTransforms = [tier1Y, tier2Y, tier3Y];

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "160vh",
        width: "100%",
        overflow: "hidden",
        background: C.paper,
        fontFamily: FONT.ui,
      }}
    >
      {/* Background */}
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
            backgroundImage: `url(${IMG.birch})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.5) contrast(1.05) brightness(1.1)",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${C.paper} 0%, rgba(250,247,240,0.4) 40%, rgba(250,247,240,0.5) 60%, ${C.paper} 100%)`,
          }}
        />
      </motion.div>

      <div
        style={{
          position: "relative",
          padding: "clamp(80px, 10vw, 160px) clamp(24px, 4vw, 80px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: "22ch",
            marginBottom: "clamp(60px, 8vw, 120px)",
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
            <span>/ 07</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 120,
                background: C.rule,
              }}
            />
            <span>Pricing</span>
          </div>
          <h2
            style={{
              fontSize: SIZE.display,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            <SplitReveal text="Simple." />
            <br />
            <SplitReveal text="Transparent." delay={0.15} />
            <br />
            <SplitReveal
              text="Cheaper than"
              delay={0.3}
              style={{ color: C.terracotta, fontStyle: "italic" }}
            />
            <br />
            <SplitReveal text="one private visit." delay={0.45} />
          </h2>
        </div>

        {/* Tiers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(20px, 2vw, 36px)",
            alignItems: "stretch",
          }}
        >
          {TIERS.map((t, i) => {
            const y = yTransforms[i];
            return (
              <motion.div
                key={t.name}
                style={{
                  y,
                  willChange: "transform",
                  background: t.dark ? C.ink : C.paper,
                  color: t.dark ? C.cream : C.ink,
                  border: t.dark ? "none" : `1px solid ${C.rule}`,
                  padding: "clamp(32px, 3vw, 48px)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 1,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {t.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: 24,
                      background: t.accent,
                      color: C.cream,
                      padding: "6px 14px",
                      fontSize: SIZE.eyebrow,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontFamily: FONT.mono,
                      fontWeight: 600,
                    }}
                  >
                    {t.badge}
                  </div>
                )}
                <div
                  style={{
                    fontSize: SIZE.eyebrow,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: t.dark ? C.textLightSoft : C.textMuted,
                    fontFamily: FONT.mono,
                  }}
                >
                  Tier 0{i + 1}
                </div>
                <h3
                  style={{
                    fontSize: SIZE.h3,
                    fontWeight: 400,
                    margin: 0,
                    marginTop: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.name}
                </h3>
                <div
                  style={{
                    marginTop: "clamp(24px, 3vw, 40px)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(52px, 6vw, 96px)",
                      fontWeight: 200,
                      letterSpacing: "-0.03em",
                      lineHeight: 0.85,
                    }}
                  >
                    {t.price}
                  </span>
                  <span
                    style={{
                      fontSize: SIZE.small,
                      fontFamily: FONT.mono,
                      letterSpacing: "0.08em",
                      color: t.dark ? C.textLightSoft : C.textMuted,
                      textTransform: "uppercase",
                    }}
                  >
                    {t.cadence}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: SIZE.body,
                    lineHeight: 1.55,
                    color: t.dark ? C.textLightSoft : C.textSecondary,
                    marginTop: "clamp(20px, 2vw, 32px)",
                    fontWeight: 300,
                    maxWidth: "30ch",
                  }}
                >
                  {t.pitch}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "clamp(24px, 3vw, 40px) 0 0",
                    borderTop: `1px solid ${t.dark ? C.ruleDark : C.rule}`,
                    flex: 1,
                  }}
                >
                  {t.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        padding: "12px 0",
                        borderBottom: `1px solid ${t.dark ? C.ruleDark : C.rule}`,
                        fontSize: SIZE.small,
                        color: t.dark ? C.textLightSoft : C.textSecondary,
                        display: "flex",
                        gap: 12,
                        alignItems: "baseline",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT.mono,
                          fontSize: SIZE.eyebrow,
                          color: t.accent,
                        }}
                      >
                        +
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    marginTop: "clamp(24px, 3vw, 40px)",
                    background: t.dark ? C.cream : C.ink,
                    color: t.dark ? C.ink : C.cream,
                    border: "none",
                    padding: "16px 24px",
                    fontSize: SIZE.small,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: FONT.ui,
                    width: "100%",
                    borderRadius: 2,
                  }}
                >
                  {t.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "clamp(40px, 5vw, 72px)",
            fontSize: SIZE.small,
            color: C.textMuted,
            fontFamily: FONT.mono,
            letterSpacing: "0.06em",
            maxWidth: "60ch",
          }}
        >
          All tiers include GDPR compliant Swedish data handling, encrypted FHIR
          export, and cancellation by email at any time. VAT included.
        </div>
      </div>
    </section>
  );
}
