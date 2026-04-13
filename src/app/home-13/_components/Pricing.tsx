"use client";

/**
 * Pricing - three tiers, Starter / Annual / Full.
 *
 * Middle (Annual) is the featured one. Layout uses a table-like row below
 * the cards comparing what's included in each tier. Sprinkles of real
 * copy ("Dr. Marcus J. doctor review") so this doesn't read as a template.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

const tiers = [
  {
    name: "Starter",
    price: "995",
    period: "one-off",
    tagline: "A first panel + a clear risk read",
    cta: "Book a draw",
    highlighted: false,
    features: [
      "14-marker blood panel",
      "FINDRISC + SCORE2 + FRAX",
      "Plain-English written report",
      "One follow-up question included",
    ],
  },
  {
    name: "Annual",
    price: "2,995",
    period: "per year",
    tagline: "Full living profile with doctor + coach",
    cta: "Join for a year",
    highlighted: true,
    features: [
      "40+ markers, every 6 months",
      "All 6 clinical risk models",
      "Dr. Marcus Johansson as your GP",
      "Unlimited messaging for 12 months",
      "Training plan + assigned coach",
      "BankID + 1177 import + FHIR export",
    ],
  },
  {
    name: "Full",
    price: "4,995",
    period: "per year",
    tagline: "For high-risk or complex profiles",
    cta: "Talk to us",
    highlighted: false,
    features: [
      "Everything in Annual",
      "Quarterly retests (4 a year)",
      "Private dietitian consultation",
      "60-min annual doctor video call",
      "Priority message response",
    ],
  },
];

export default function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      id="pricing"
      style={{
        background: C.cream,
        color: C.ink,
        padding: "180px 36px 160px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 60,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ ...TYPE.mono, color: C.amber, marginBottom: 24 }}
            >
              09  /  Pricing
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.08, ease: EASE }}
              style={{ ...TYPE.displayLarge, color: C.ink, margin: 0 }}
            >
              Three ways in.{" "}
              <span
                style={{
                  color: C.amberDeep,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                No small print.
              </span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.18, ease: EASE }}
            style={{
              ...TYPE.body,
              color: C.inkMid,
              maxWidth: 320,
              margin: 0,
            }}
          >
            All prices in SEK, VAT included. Cancel any time with one tap.
            Data export in FHIR format is always free.
          </motion.p>
        </div>

        {/* Tier cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "stretch",
          }}
          className="home13-pricing-grid"
        >
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.2 + i * 0.1,
                ease: EASE,
              }}
              style={{
                background: t.highlighted ? C.ink : C.paper,
                color: t.highlighted ? C.cream : C.ink,
                border: `1px solid ${t.highlighted ? C.ink : C.line}`,
                borderRadius: 24,
                padding: "40px 36px",
                boxShadow: t.highlighted ? C.shadowLg : C.shadowSm,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transform: t.highlighted ? "scale(1.02)" : "scale(1)",
              }}
            >
              {t.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: 22,
                    right: 22,
                    padding: "5px 12px",
                    background: C.amber,
                    color: C.ink,
                    borderRadius: 100,
                    ...TYPE.mono,
                  }}
                >
                  Recommended
                </div>
              )}
              <div
                style={{
                  ...TYPE.mono,
                  color: t.highlighted ? C.amberSoft : C.amber,
                  marginBottom: 18,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 500,
                    color: t.highlighted ? C.cream : C.ink,
                    letterSpacing: "-0.035em",
                    lineHeight: 0.95,
                  }}
                >
                  {t.price}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: t.highlighted
                      ? "rgba(245,239,226,0.65)"
                      : C.inkMuted,
                  }}
                >
                  SEK  /  {t.period}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: t.highlighted
                    ? "rgba(245,239,226,0.75)"
                    : C.inkMid,
                  marginBottom: 28,
                }}
              >
                {t.tagline}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 32,
                  flex: 1,
                }}
              >
                {t.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: t.highlighted
                        ? "rgba(245,239,226,0.85)"
                        : C.inkSoft,
                      lineHeight: 1.5,
                    }}
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      style={{
                        color: t.highlighted ? C.amberSoft : C.amber,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    />
                    {f}
                  </div>
                ))}
              </div>

              <button
                style={{
                  padding: "14px 20px",
                  borderRadius: 100,
                  background: t.highlighted ? C.amber : C.ink,
                  color: t.highlighted ? C.ink : C.cream,
                  border: "none",
                  fontFamily: SYSTEM_FONT,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {t.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-pricing-grid) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
