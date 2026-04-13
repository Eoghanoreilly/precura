"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE } from "./tokens";

/**
 * PRICING - Editorial "rate card" layout.
 *
 * Three vertical columns laid out like a printed rate card or
 * subscription box insert. Big price set huge, features as a list,
 * no gradients or highlight glow. The middle tier is marked as
 * "Most selected" in small mono type.
 */
export function Pricing() {
  const [cadence, setCadence] = useState<"annual" | "monthly">("annual");

  const tiers = [
    {
      name: "Essentials",
      subtitle: "For the curious",
      annual: 995,
      monthly: 99,
      features: [
        "One comprehensive blood panel",
        "12 core biomarkers",
        "FINDRISC diabetes risk score",
        "Plain-English result letter",
        "Secure 1177 import",
      ],
      cta: "Start with Essentials",
      footer: "One-off, no commitment",
      highlighted: false,
    },
    {
      name: "Annual",
      subtitle: "Most members",
      annual: 2995,
      monthly: 299,
      features: [
        "Everything in Essentials",
        "Twice-yearly blood panels",
        "40+ biomarkers per draw",
        "All five risk models",
        "Dr. Johansson personal review",
        "12-month doctor chat access",
        "Living profile with FHIR export",
      ],
      cta: "Join Annual",
      footer: "Most selected tier",
      highlighted: true,
    },
    {
      name: "Precura+",
      subtitle: "For families & the serious",
      annual: 4995,
      monthly: 499,
      features: [
        "Everything in Annual",
        "Quarterly blood panels",
        "Assigned personal coach",
        "Custom training plan",
        "Two free video consultations",
        "Priority doctor messaging",
        "Partner at 50% off",
      ],
      cta: "Join Precura+",
      footer: "Households & athletes",
      highlighted: false,
    },
  ];

  return (
    <section
      id="membership"
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
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 09</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Subscription card
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Rate card / Three tiers
          </div>
        </div>

        {/* Opener + cadence toggle */}
        <div
          className="pr14-open"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 60,
            alignItems: "end",
            marginBottom: 80,
          }}
        >
          <h2 style={{ ...TYPE.chapter, margin: 0, maxWidth: 820 }}>
            Subscribe to{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>
              your own body.
            </span>
          </h2>

          {/* Cadence toggle */}
          <div
            style={{
              display: "inline-flex",
              border: `1px solid ${C.ink}`,
              alignSelf: "end",
              justifySelf: "end",
            }}
          >
            {(["annual", "monthly"] as const).map((c) => {
              const active = c === cadence;
              return (
                <button
                  key={c}
                  onClick={() => setCadence(c)}
                  style={{
                    all: "unset",
                    padding: "10px 20px",
                    cursor: "pointer",
                    background: active ? C.ink : "transparent",
                    color: active ? C.paper : C.ink,
                    fontFamily: MONO_FONT,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    transition: "all 0.3s",
                  }}
                >
                  {c === "annual" ? "Annual billing" : "Monthly billing"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rate cards */}
        <div
          className="pr14-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            borderTop: `2px solid ${C.ink}`,
            borderBottom: `2px solid ${C.ink}`,
          }}
        >
          {tiers.map((t, i) => {
            const price = cadence === "annual" ? t.annual : t.monthly;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 1,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "relative",
                  padding: "48px 36px 40px",
                  borderRight:
                    i < tiers.length - 1 ? `1px solid ${C.rule}` : "none",
                  background: t.highlighted ? C.paperSoft : C.paper,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {t.highlighted && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: 36,
                      background: C.rust,
                      color: C.paper,
                      padding: "6px 12px",
                      fontFamily: MONO_FONT,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Most members
                  </div>
                )}

                <div
                  style={{
                    ...TYPE.mono,
                    color: C.inkMuted,
                    marginBottom: 12,
                  }}
                >
                  Tier {String(i + 1).padStart(2, "0")} / {t.subtitle}
                </div>

                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: C.ink,
                    letterSpacing: "-0.02em",
                    marginBottom: 32,
                  }}
                >
                  {t.name}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 40 }}>
                  <span
                    style={{
                      fontSize: 72,
                      fontWeight: 600,
                      color: C.ink,
                      letterSpacing: "-0.035em",
                      lineHeight: 0.9,
                    }}
                  >
                    {price}
                  </span>
                  <span
                    style={{
                      ...TYPE.mono,
                      color: C.inkMuted,
                    }}
                  >
                    SEK / {cadence === "annual" ? "year" : "month"}
                  </span>
                </div>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    flex: 1,
                  }}
                >
                  {t.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        padding: "10px 0",
                        borderBottom: `1px solid ${C.ruleSoft}`,
                        display: "grid",
                        gridTemplateColumns: "16px 1fr",
                        gap: 10,
                        fontSize: 13,
                        color: C.inkSoft,
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          color: C.ink,
                          fontWeight: 600,
                        }}
                      >
                        +
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/v2/dashboard"
                  style={{
                    display: "block",
                    marginTop: 36,
                    padding: "14px 22px",
                    background: t.highlighted ? C.ink : "transparent",
                    color: t.highlighted ? C.paper : C.ink,
                    border: `1px solid ${C.ink}`,
                    textDecoration: "none",
                    textAlign: "center",
                    fontFamily: MONO_FONT,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {t.cta}
                </Link>

                <div
                  style={{
                    marginTop: 14,
                    ...TYPE.mono,
                    color: C.inkFaint,
                    textAlign: "center",
                  }}
                >
                  {t.footer}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fine print band */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ ...TYPE.mono, color: C.inkMuted, maxWidth: 560 }}>
            All prices include VAT. Cancel anytime from your profile. Blood
            panels drawn at partner clinics in Sweden.
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Membership / Effective Apr 2026
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.pr14-open),
          :global(.pr14-cards) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.pr14-cards > *) {
            border-right: none !important;
            border-bottom: 1px solid ${C.rule} !important;
          }
        }
      `}</style>
    </section>
  );
}
