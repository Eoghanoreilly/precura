"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PRICING - three tiers. Annual billing, cancel anytime.
 * Middle tier is highlighted as the default. Each tier has its own CTA.
 * Warm paper cards on cream. No left borders, no gradient blobs.
 */

type Tier = {
  name: string;
  price: number;
  tagline: string;
  includes: string[];
  cta: string;
  highlight?: boolean;
  note?: string;
  chip?: string;
};

const TIERS: Tier[] = [
  {
    name: "Essential",
    price: 995,
    tagline: "The baseline profile. Two tests a year.",
    includes: [
      "Your living profile, forever",
      "Two blood panels a year (22 markers)",
      "FINDRISC, SCORE2 and FRAX models",
      "Doctor note on every panel",
      "AI chat with your own data",
      "1177 and FHIR export",
    ],
    cta: "Start Essential",
  },
  {
    name: "Member",
    price: 2995,
    tagline: "Everything. The one most people pick.",
    includes: [
      "Everything in Essential",
      "Four blood panels a year",
      "Assigned human coach, monthly check-ins",
      "Personal doctor (Dr. Marcus), 24h reply",
      "Training plan built on your bloodwork",
      "Priority lab booking across Sweden",
    ],
    cta: "Start membership",
    highlight: true,
    chip: "Most popular",
    note: "Cancel anytime. Your data stays yours.",
  },
  {
    name: "Family",
    price: 4995,
    tagline: "Two adults, one shared profile canvas.",
    includes: [
      "Everything in Member, for two adults",
      "Shared family history timeline",
      "Joint monthly check-in with your coach",
      "Twin doctor notes on every panel",
      "Couples goals and shared coaching",
      "Priority referrals for both of you",
    ],
    cta: "Start Family",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        background: C.creamWarm,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 56,
            alignItems: "flex-end",
            marginBottom: 56,
          }}
          className="home20-pricing-header"
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.terra,
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Membership
            </div>
            <h2 style={{ ...TYPE.displayL, margin: 0, maxWidth: 760 }}>
              One price a year. Cancel anytime. Your data comes with you.
            </h2>
          </div>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 440,
            }}
          >
            Billed annually in SEK. No hidden lab fees, no upsells for
            critical markers, no paywall on your own history.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
            alignItems: "stretch",
          }}
          className="home20-pricing-grid"
        >
          {TIERS.map((t, i) => (
            <TierCard key={i} tier={t} index={i} />
          ))}
        </div>

        {/* Bottom reassurance row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: 44,
            padding: "22px 28px",
            background: C.paper,
            borderRadius: 18,
            border: `1px solid ${C.lineFaint}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
          className="home20-pricing-reassure"
        >
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <Reassure k="Billed" v="Annually, in SEK" />
            <Reassure k="Cancel" v="Anytime, keep your data" />
            <Reassure k="Refund" v="Full, first 30 days" />
          </div>
          <div
            style={{
              ...TYPE.small,
              color: C.inkMuted,
              maxWidth: 360,
            }}
          >
            Precura is a health subscription, not medical insurance. It does
            not replace emergency care.
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-pricing-header) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          :global(.home20-pricing-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home20-pricing-reassure) {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const isHighlight = !!tier.highlight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: "relative",
        background: isHighlight ? C.ink : C.paper,
        color: isHighlight ? C.creamSoft : C.ink,
        borderRadius: 26,
        padding: isHighlight ? "40px 36px 36px" : "34px 32px 32px",
        border: `1px solid ${isHighlight ? C.ink : C.lineFaint}`,
        boxShadow: isHighlight ? C.shadowLift : C.shadowSoft,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        transform: isHighlight ? "translateY(-10px)" : "none",
      }}
    >
      {/* Highlight chip */}
      {tier.chip && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: 32,
            padding: "6px 14px",
            background: C.terra,
            color: C.creamSoft,
            borderRadius: 100,
            ...TYPE.tiny,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            boxShadow: "0 6px 18px rgba(211,88,56,0.35)",
          }}
        >
          {tier.chip}
        </div>
      )}

      <div>
        <div
          style={{
            ...TYPE.mono,
            color: isHighlight ? C.peach : C.terra,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          {tier.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: "clamp(38px, 4vw, 54px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: isHighlight ? C.creamSoft : C.ink,
            }}
          >
            {tier.price.toLocaleString("sv-SE")}
          </div>
          <div
            style={{
              ...TYPE.small,
              color: isHighlight ? "rgba(246,241,232,0.65)" : C.inkMuted,
              fontWeight: 500,
            }}
          >
            SEK / year
          </div>
        </div>
        <p
          style={{
            ...TYPE.body,
            color: isHighlight ? "rgba(246,241,232,0.75)" : C.inkMuted,
            margin: 0,
            maxWidth: 300,
          }}
        >
          {tier.tagline}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: isHighlight ? "rgba(246,241,232,0.14)" : C.lineFaint,
        }}
      />

      {/* Includes */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 11,
          flex: 1,
        }}
      >
        {tier.includes.map((inc, i) => (
          <li
            key={i}
            style={{
              ...TYPE.small,
              color: isHighlight ? "rgba(246,241,232,0.88)" : C.inkSoft,
              display: "flex",
              gap: 11,
              alignItems: "flex-start",
              lineHeight: 1.5,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              style={{ marginTop: 4, flexShrink: 0 }}
            >
              <path
                d="M2.5 7.5l3 3 6-7"
                stroke={isHighlight ? C.peach : C.terra}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            {inc}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="#"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "16px 22px",
          background: isHighlight ? C.terra : C.ink,
          color: C.creamSoft,
          borderRadius: 100,
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          boxShadow: isHighlight ? "0 12px 32px rgba(211,88,56,0.40)" : "none",
        }}
      >
        {tier.cta}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {tier.note && (
        <div
          style={{
            ...TYPE.tiny,
            color: isHighlight ? "rgba(246,241,232,0.6)" : C.inkFaint,
            textAlign: "center",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          {tier.note}
        </div>
      )}
    </motion.div>
  );
}

function Reassure({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div
        style={{
          ...TYPE.tiny,
          color: C.inkFaint,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 2,
        }}
      >
        {k}
      </div>
      <div
        style={{
          ...TYPE.small,
          color: C.ink,
          fontWeight: 600,
        }}
      >
        {v}
      </div>
    </div>
  );
}
