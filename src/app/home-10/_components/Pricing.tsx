"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PRICING - Technique: Scroll-revealed tier cards that "rise" into view
 * with staggered delay plus an interactive annual/monthly toggle that
 * morphs prices between modes. Middle card has a live scale-up on hover.
 */
export function Pricing() {
  const [cadence, setCadence] = useState<"annual" | "monthly">("annual");
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  const bgShift = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const tiers = [
    {
      name: "Essentials",
      subtitle: "For the curious",
      annual: 995,
      monthly: 99,
      features: [
        "One comprehensive blood test",
        "FINDRISC diabetes risk score",
        "Plain-English results",
        "Secure 1177 import",
        "Email delivery",
      ],
      cta: "Start with Essentials",
      highlighted: false,
    },
    {
      name: "Annual",
      subtitle: "Most members",
      annual: 2995,
      monthly: 299,
      features: [
        "Everything in Essentials",
        "All three risk models (FINDRISC, SCORE2, FRAX)",
        "Two blood tests per year",
        "Doctor's written review of every result",
        "AI chat with your data",
        "Full biomarker trajectory view",
      ],
      cta: "Join Annual",
      highlighted: true,
    },
    {
      name: "Precura+",
      subtitle: "For families and the serious",
      annual: 4995,
      monthly: 499,
      features: [
        "Everything in Annual",
        "Four blood tests per year (quarterly)",
        "Up to two free doctor consultations",
        "Personal training plan",
        "Priority doctor messaging",
        "Bring a partner at 50% off",
      ],
      cta: "Join Precura+",
      highlighted: false,
    },
  ];

  return (
    <section
      id="pricing"
      ref={ref}
      style={{
        position: "relative",
        background: C.cream,
        padding: "160px 32px 160px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        overflow: "hidden",
      }}
    >
      {/* Parallax background type */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          y: bgShift,
          opacity: 0.04,
          fontSize: "clamp(180px, 26vw, 420px)",
          fontWeight: 500,
          letterSpacing: "-0.06em",
          color: C.ink,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        Precura
      </motion.div>

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
          07 / PRICING
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 60,
          }}
        >
          <h2
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              maxWidth: 780,
            }}
          >
            Three ways in.{" "}
            <span style={{ color: C.sage, fontStyle: "italic" }}>
              Priced in kronor.
            </span>
          </h2>

          {/* Cadence toggle */}
          <div
            style={{
              display: "inline-flex",
              padding: 4,
              background: C.paper,
              border: `1px solid ${C.line}`,
              borderRadius: 100,
              position: "relative",
            }}
          >
            <motion.div
              animate={{ x: cadence === "annual" ? 0 : 122 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 32,
              }}
              style={{
                position: "absolute",
                top: 4,
                left: 4,
                width: 118,
                height: 40,
                background: C.ink,
                borderRadius: 100,
              }}
            />
            <button
              onClick={() => setCadence("annual")}
              style={{
                position: "relative",
                zIndex: 1,
                padding: "10px 24px",
                width: 118,
                background: "transparent",
                border: "none",
                color: cadence === "annual" ? C.cream : C.inkSoft,
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "color 0.4s",
              }}
            >
              Annual
            </button>
            <button
              onClick={() => setCadence("monthly")}
              style={{
                position: "relative",
                zIndex: 1,
                padding: "10px 24px",
                width: 118,
                background: "transparent",
                border: "none",
                color: cadence === "monthly" ? C.cream : C.inkSoft,
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "color 0.4s",
              }}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Tier cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "stretch",
          }}
          className="home10-pricing-grid"
        >
          {tiers.map((t, i) => {
            const price = cadence === "annual" ? t.annual : t.monthly;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                style={{
                  position: "relative",
                  padding: 36,
                  background: t.highlighted ? C.ink : C.paper,
                  color: t.highlighted ? C.cream : C.ink,
                  borderRadius: 28,
                  border: t.highlighted
                    ? "1px solid rgba(245,239,228,0.1)"
                    : `1px solid ${C.line}`,
                  boxShadow: t.highlighted ? C.shadowLift : C.shadow,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {t.highlighted && (
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                      ...TYPE.mono,
                      color: C.amber,
                      padding: "4px 10px",
                      border: `1px solid ${C.amber}`,
                      borderRadius: 100,
                    }}
                  >
                    MOST CHOSEN
                  </div>
                )}

                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    marginBottom: 4,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    ...TYPE.small,
                    color: t.highlighted ? C.creamDeep : C.inkMuted,
                    marginBottom: 28,
                  }}
                >
                  {t.subtitle}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 28,
                  }}
                >
                  <motion.div
                    key={`${t.name}-${cadence}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      fontSize: 60,
                      fontWeight: 500,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {price.toLocaleString("sv-SE")}
                  </motion.div>
                  <div
                    style={{
                      fontSize: 16,
                      color: t.highlighted ? C.creamDeep : C.inkMuted,
                    }}
                  >
                    SEK / {cadence === "annual" ? "year" : "mo"}
                  </div>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 32,
                    flex: 1,
                  }}
                >
                  {t.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        ...TYPE.small,
                        color: t.highlighted ? C.creamDeep : C.inkSoft,
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 50,
                          background: t.highlighted
                            ? "rgba(224,107,45,0.2)"
                            : "rgba(107,143,113,0.15)",
                          flexShrink: 0,
                          marginTop: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 50,
                            background: t.highlighted ? C.amber : C.sageDeep,
                          }}
                        />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboarding"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px 24px",
                    background: t.highlighted ? C.amber : C.ink,
                    color: t.highlighted ? C.ink : C.cream,
                    borderRadius: 100,
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p
          style={{
            ...TYPE.small,
            color: C.inkMuted,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          All prices include VAT. Cancel anytime. Blood draw at any Swedish
          lab included in the price.
        </p>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-pricing-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
