"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * PRICING - 3 tiers. First blood test / Annual / Platinum.
 */
export default function Pricing() {
  const ref = useRef<HTMLElement>(null);

  const tiers = [
    {
      name: "First blood test",
      price: "995",
      unit: "SEK",
      cadence: "one-time",
      tag: "Try it",
      highlight: false,
      features: [
        "14 blood markers from one draw",
        "Clinic in Stockholm, Goteborg, Malmo, Uppsala, Lund",
        "FINDRISC + SCORE2 + FRAX risk models",
        "Personalized risk report",
        "One written review from Dr. Johansson",
        "48 hours from blood draw to answers",
      ],
      disclaimer: "Credits 995 SEK towards annual membership if you upgrade within 30 days.",
    },
    {
      name: "Annual membership",
      price: "2,995",
      unit: "SEK",
      cadence: "per year",
      tag: "Most chosen",
      highlight: true,
      features: [
        "Everything in First blood test",
        "6-month and 12-month retests included",
        "Unlimited AI chat with your data",
        "Unlimited messaging with Dr. Johansson",
        "Personalized training plan by a certified coach",
        "Cancel anytime, data exports to FHIR",
      ],
      disclaimer: "That's 249 SEK a month. A fasting coffee subscription for your decade.",
    },
    {
      name: "Platinum",
      price: "4,995",
      unit: "SEK",
      cadence: "per year",
      tag: "For families",
      highlight: false,
      features: [
        "Everything in Annual",
        "Quarterly retests (4 per year)",
        "Priority doctor replies within 4 hours",
        "Full body health narrative report quarterly",
        "Dedicated coach 1:1 video call every 3 months",
        "Up to 2 additional family members, 50% off each",
      ],
      disclaimer: "Best value if you have a significant family history, or are managing a diagnosed condition.",
    },
  ];

  return (
    <section
      ref={ref}
      id="cta"
      style={{
        background: colors.parchment,
        padding: "160px 40px",
        fontFamily: fontStack.display,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          fontFamily: fontStack.mono,
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.inkMuted,
          display: "flex",
          gap: "24px",
        }}
      >
        <span>Ch 07</span>
        <span>Pricing</span>
      </div>

      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: easing.out }}
          style={{
            fontSize: "clamp(44px, 6vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
            color: colors.ink,
            fontWeight: 500,
            maxWidth: "880px",
          }}
        >
          One blood test to get started.{" "}
          <span style={{ color: colors.amberDeep, fontStyle: "italic", fontWeight: 400 }}>
            Then a subscription to your own body.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.15, ease: easing.out }}
          style={{
            marginTop: "32px",
            maxWidth: "640px",
            fontSize: "18px",
            lineHeight: 1.6,
            color: colors.inkSoft,
          }}
        >
          Werlabs charges 1,495 SEK for a panel and hands you a PDF. Precura
          charges 995 SEK and hands you the interpretation, the trajectory, and
          a doctor you can message.
        </motion.p>

        <div
          style={{
            marginTop: "72px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {tiers.map((t, i) => (
            <PricingCard key={i} tier={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  tier,
  index,
}: {
  tier: {
    name: string;
    price: string;
    unit: string;
    cadence: string;
    tag: string;
    highlight: boolean;
    features: string[];
    disclaimer: string;
  };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: easing.out }}
      style={{
        padding: "40px 34px",
        borderRadius: "24px",
        background: tier.highlight ? colors.ink : colors.white,
        color: tier.highlight ? colors.ivory : colors.ink,
        border: tier.highlight ? "none" : `1px solid ${colors.inkLine}`,
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <div
            style={{
              fontFamily: fontStack.mono,
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: tier.highlight ? colors.amber : colors.inkMuted,
              marginBottom: "12px",
            }}
          >
            {tier.tag}
          </div>
          <div style={{ fontSize: "22px", fontWeight: 500, letterSpacing: "-0.01em" }}>
            {tier.name}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {tier.price}
        </div>
        <div style={{ fontSize: "14px", color: tier.highlight ? colors.inkFaint : colors.inkMuted }}>
          {tier.unit} / {tier.cadence}
        </div>
      </div>

      <div
        style={{
          height: "1px",
          background: tier.highlight ? colors.inkMid : colors.inkLine,
        }}
      />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        {tier.features.map((f, i) => (
          <li
            key={i}
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              color: tier.highlight ? colors.ivory : colors.inkSoft,
              display: "flex",
              alignItems: "start",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: tier.highlight ? colors.amber : colors.amberDeep,
                flexShrink: 0,
                marginTop: "8px",
              }}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#signup"
        style={{
          padding: "18px 24px",
          borderRadius: "100px",
          background: tier.highlight ? colors.amber : colors.ink,
          color: tier.highlight ? colors.ink : colors.ivory,
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: 500,
          textAlign: "center",
          letterSpacing: "-0.01em",
          marginTop: "8px",
        }}
      >
        {tier.highlight ? "Start annual / 2,995 SEK" : tier.name === "Platinum" ? "Choose Platinum" : "Book a blood test"}
      </a>

      <div
        style={{
          fontSize: "11px",
          lineHeight: 1.5,
          color: tier.highlight ? colors.inkFaint : colors.inkMuted,
          fontStyle: "italic",
        }}
      >
        {tier.disclaimer}
      </div>
    </motion.div>
  );
}
