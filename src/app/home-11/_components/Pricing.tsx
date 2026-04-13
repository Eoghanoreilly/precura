"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * PRICING - Three tiers. Editorial index layout, not marketing cards.
 * Middle tier is highlighted subtly (not a "popular" badge, just weight).
 */
export function Pricing() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      id="pricing"
      style={{
        background: C.paper,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ marginBottom: 96, maxWidth: 900 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 24,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 26,
                height: 1,
                background: C.inkMuted,
                display: "inline-block",
              }}
            />
            Ch. 09 / Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              color: C.ink,
            }}
          >
            Start with one panel.{" "}
            <span style={{ color: C.sage, fontStyle: "italic" }}>
              Or begin the membership.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.body,
              color: C.inkMuted,
              margin: "28px 0 0",
              maxWidth: 640,
            }}
          >
            Swedish pricing, no hidden fees. The first panel counts toward
            your annual membership if you upgrade within 30 days.
          </motion.p>
        </div>

        <div
          className="home11-pricing"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {tiers.map((t, i) => (
            <TierCard key={t.name} tier={t} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          style={{
            marginTop: 40,
            ...TYPE.mono,
            color: C.inkMuted,
            textAlign: "center",
          }}
        >
          Prices shown in SEK / incl. 25 % VAT / payment via Stripe, Swish, Klarna
        </motion.p>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-pricing) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const tiers = [
  {
    name: "First panel",
    price: "995",
    cadence: "SEK / once",
    tag: "Start here",
    includes: [
      "One comprehensive panel (40+ markers)",
      "Full risk engine (FINDRISC, SCORE2, FRAX)",
      "Plain-Swedish doctor note from Dr. Johansson",
      "Living profile for 30 days",
      "One AI chat conversation",
      "Upgrade credit: 995 SEK off annual",
    ],
    excluded: [
      "No coach",
      "No ongoing doctor messaging",
    ],
    highlight: false,
    cta: "Book one panel",
  },
  {
    name: "Annual",
    price: "2,995",
    cadence: "SEK / year",
    tag: "Most members",
    includes: [
      "Two full panels per year",
      "Full risk engine + trajectory tracking",
      "Dr. Johansson: every panel + 12 months of secure messaging",
      "Certified coach: adaptive training plan, weekly check-ins",
      "Living profile with full history",
      "Unlimited AI chat with context",
      "FHIR export, BankID login",
    ],
    excluded: [],
    highlight: true,
    cta: "Begin the year",
  },
  {
    name: "Platinum",
    price: "4,995",
    cadence: "SEK / year",
    tag: "Advanced",
    includes: [
      "Four full panels per year",
      "Priority Dr. Johansson review within 24 hours",
      "Advanced markers (Lp(a), fP-insulin, Omega-3 index, continuous glucose pilot)",
      "Weekly coach sessions + nutrition block",
      "Two in-person consults per year in Stockholm",
      "Annual specialist referral included",
    ],
    excluded: [],
    highlight: false,
    cta: "Join platinum",
  },
];

function TierCard({
  tier,
  index,
}: {
  tier: (typeof tiers)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.1 * index, ease: EASE }}
      style={{
        background: tier.highlight ? C.ink : C.page,
        color: tier.highlight ? C.page : C.ink,
        border: tier.highlight
          ? `1px solid ${C.ink}`
          : `1px solid ${C.inkHairlineStrong}`,
        borderRadius: 6,
        padding: 36,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          ...TYPE.mono,
          color: tier.highlight ? "#B7C9B9" : C.inkMuted,
          marginBottom: 16,
        }}
      >
        {tier.tag}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: tier.highlight ? C.page : C.ink,
          letterSpacing: "-0.02em",
          marginBottom: 28,
        }}
      >
        {tier.name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: tier.highlight ? C.page : C.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {tier.price}
        </div>
        <div
          style={{
            fontSize: 13,
            color: tier.highlight ? "rgba(250,250,247,0.7)" : C.inkMuted,
          }}
        >
          {tier.cadence}
        </div>
      </div>

      <div
        style={{
          borderTop: tier.highlight
            ? "1px solid rgba(250,250,247,0.16)"
            : `1px solid ${C.inkHairline}`,
          margin: "32px 0 24px",
        }}
      />

      <div style={{ flex: 1 }}>
        {tier.includes.map((line) => (
          <div
            key={line}
            style={{
              display: "flex",
              gap: 14,
              padding: "10px 0",
              fontSize: 14,
              color: tier.highlight
                ? "rgba(250,250,247,0.85)"
                : C.inkSoft,
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: tier.highlight ? "#B7C9B9" : C.sage,
                marginTop: 8,
                flexShrink: 0,
              }}
            />
            <span>{line}</span>
          </div>
        ))}
        {tier.excluded.map((line) => (
          <div
            key={line}
            style={{
              display: "flex",
              gap: 14,
              padding: "10px 0",
              fontSize: 14,
              color: tier.highlight
                ? "rgba(250,250,247,0.4)"
                : C.inkFaint,
              lineHeight: 1.5,
              textDecoration: "line-through",
              textDecorationColor: tier.highlight
                ? "rgba(250,250,247,0.3)"
                : C.inkFaint,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "transparent",
                border: `1px solid ${
                  tier.highlight ? "rgba(250,250,247,0.3)" : C.inkFaint
                }`,
                marginTop: 8,
                flexShrink: 0,
              }}
            />
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
        }}
      >
        <a
          href="#"
          style={{
            display: "inline-block",
            color: tier.highlight ? C.page : C.ink,
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            borderBottom: `1px solid ${
              tier.highlight ? C.page : C.ink
            }`,
            paddingBottom: 4,
          }}
        >
          {tier.cta}
        </a>
      </div>
    </motion.div>
  );
}
