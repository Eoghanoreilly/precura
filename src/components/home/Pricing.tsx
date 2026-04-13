"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * PRICING - Three annual tiers, Member highlighted as most popular.
 * Warm cream canvas, terracotta accent, sage checks on the included list.
 * Middle tier elevated with dark ink background, butter pill label on top.
 * Starter and Plus sit on paper cards with warm borders.
 */
export function Pricing() {
  const tiers = [
    {
      id: "starter",
      name: "Starter",
      blurb: "Try Precura for a year.",
      priceDisplay: "995",
      unit: "SEK / year",
      cadence: "Billed annually / cancel anytime",
      highlight: false,
      bg: C.paper,
      ink: C.ink,
      sub: C.inkMuted,
      accent: C.terracotta,
      border: true,
      ctaLabel: "Start with Starter",
      ctaBg: "transparent",
      ctaColor: C.ink,
      ctaBorder: `1px solid ${C.lineCard}`,
      features: [
        { text: "1 blood panel per year", included: true },
        { text: "Baseline living profile", included: true },
        { text: "AI chat with your data", included: true },
        { text: "Doctor-reviewed first note", included: true },
        { text: "Ongoing messaging with Dr. Marcus", included: false },
        { text: "Personal coach + training plan", included: false },
      ],
    },
    {
      id: "member",
      name: "Member",
      blurb: "The full Precura experience.",
      priceDisplay: "2,995",
      unit: "SEK / year",
      cadence: "Billed annually / cancel anytime",
      highlight: true,
      bg: C.ink,
      ink: C.canvasSoft,
      sub: "rgba(251,247,240,0.68)",
      accent: C.butter,
      border: false,
      ctaLabel: "Become a Member",
      ctaBg: C.butter,
      ctaColor: C.ink,
      ctaBorder: "1px solid transparent",
      features: [
        { text: "4 blood panels per year", included: true },
        { text: "Full living profile + 5-year arcs", included: true },
        { text: "Unlimited AI chat with your data", included: true },
        { text: "Messaging with Dr. Marcus (24h reply)", included: true },
        { text: "Personal coach + training plan", included: true },
        { text: "Quarterly trajectory reviews", included: true },
      ],
    },
    {
      id: "plus",
      name: "Plus",
      blurb: "Maximum data density.",
      priceDisplay: "4,995",
      unit: "SEK / year",
      cadence: "Billed annually / cancel anytime",
      highlight: false,
      bg: C.paper,
      ink: C.ink,
      sub: C.inkMuted,
      accent: C.terracotta,
      border: true,
      ctaLabel: "Go Plus",
      ctaBg: "transparent",
      ctaColor: C.ink,
      ctaBorder: `1px solid ${C.lineCard}`,
      features: [
        { text: "4 blood panels per year", included: true },
        { text: "Priority doctor access (12h reply)", included: true },
        { text: "Extended coaching + nutrition calls", included: true },
        { text: "Living profile + advanced biomarkers", included: true },
        { text: "Quarterly video review with Dr. Marcus", included: true },
        { text: "Partner discount on Apple Watch SE", included: true },
      ],
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        background: C.canvas,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
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
            marginBottom: 72,
          }}
          className="home17-pricing-header"
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
              Annual memberships
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
              Three ways to join.{" "}
              <span
                style={{
                  color: C.terracotta,
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                All annual.
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
            Every tier includes the living profile and Dr. Marcus review.
            Panels, priority and coaching scale with the plan. Cancel any time.
          </motion.p>
        </div>

        {/* Tier cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.08fr 1fr",
            gap: 20,
            alignItems: "stretch",
          }}
          className="home17-pricing-grid"
        >
          {tiers.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "relative",
                background: t.bg,
                color: t.ink,
                borderRadius: 28,
                padding: t.highlight ? "44px 36px 36px 36px" : "36px 32px",
                border: t.border
                  ? `1px solid ${C.lineCard}`
                  : "1px solid transparent",
                boxShadow: t.highlight ? C.shadowLift : C.shadowCard,
                display: "flex",
                flexDirection: "column",
                transform: t.highlight ? "translateY(-10px)" : "none",
              }}
            >
              {/* Most popular badge */}
              {t.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "7px 16px",
                    background: C.butter,
                    color: C.ink,
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    boxShadow: C.shadowSoft,
                    whiteSpace: "nowrap",
                  }}
                >
                  Most popular / 83% choose this
                </div>
              )}

              {/* Name + blurb */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: t.accent,
                  marginBottom: 12,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.35,
                  color: t.ink,
                  marginBottom: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {t.blurb}
              </div>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(48px, 5.4vw, 64px)",
                    fontWeight: 600,
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                    color: t.ink,
                  }}
                >
                  {t.priceDisplay}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: t.sub,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {t.unit}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: t.sub,
                  marginBottom: 28,
                  fontFamily: '"SF Mono", ui-monospace, monospace',
                  letterSpacing: "0.02em",
                }}
              >
                {t.cadence}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: t.highlight
                    ? "rgba(251,247,240,0.12)"
                    : C.lineSoft,
                  marginBottom: 24,
                }}
              />

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 32,
                  flex: 1,
                }}
              >
                {t.features.map((f, fi) => (
                  <li
                    key={fi}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      fontSize: 14,
                      lineHeight: 1.45,
                      color: f.included ? t.ink : t.sub,
                      opacity: f.included ? 1 : 0.55,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: f.included
                          ? t.highlight
                            ? C.butter
                            : C.sageTint
                          : "transparent",
                        border: f.included
                          ? "none"
                          : `1px solid ${
                              t.highlight
                                ? "rgba(251,247,240,0.25)"
                                : C.lineCard
                            }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                      }}
                    >
                      {f.included ? (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M1.5 5.2 L4 7.5 L8.5 2.5"
                            stroke={t.highlight ? C.ink : C.sageDeep}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="8"
                          height="2"
                          viewBox="0 0 8 2"
                          fill="none"
                        >
                          <rect
                            width="8"
                            height="2"
                            rx="1"
                            fill={
                              t.highlight
                                ? "rgba(251,247,240,0.35)"
                                : C.inkFaint
                            }
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      style={{
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="#cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "15px 22px",
                  background: t.ctaBg,
                  color: t.ctaColor,
                  border: t.ctaBorder,
                  borderRadius: 14,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  width: "100%",
                  boxShadow: t.highlight ? C.shadowSoft : "none",
                }}
              >
                {t.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footnote row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: `1px solid ${C.lineSoft}`,
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          {[
            "Swedish-licensed clinic",
            "GDPR / EU data residency",
            "30-day full refund",
            "Invoice or Klarna checkout",
          ].map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.good,
                }}
              />
              {f}
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home17-pricing-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home17-pricing-grid > div) {
            transform: none !important;
          }
          :global(.home17-pricing-header) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
