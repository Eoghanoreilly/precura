"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, TIERS } from "./tokens";

/**
 * PRICING
 * -------
 * Three tiers, pulled from tokens.TIERS (single source of truth). Middle
 * tier (Member) is visually highlighted with a deeper paper surface, a
 * lingon border outline, a "Most popular" ribbon, and a scaled-up hover.
 * Each tier has its own CTA. Annual billing, cancel anytime language.
 */

export function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        background: C.cream,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 56, textAlign: "center" }}
        >
          <div
            style={{
              ...TYPE.label,
              color: C.lingon,
              marginBottom: 20,
            }}
          >
            Membership pricing
          </div>
          <h2
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              marginBottom: 16,
            }}
          >
            One annual price.{" "}
            <span style={{ color: C.inkMuted }}>Cancel any time.</span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: "0 auto",
              maxWidth: 620,
            }}
          >
            No contracts, no add-ons, no surprise fees. Pick the tier that
            fits the depth of care you want. Upgrade or step down any time.
          </p>
        </motion.div>

        {/* Billing toggle-style indicator (static display) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: 4,
              background: C.paper,
              border: `1px solid ${C.inkLine}`,
              borderRadius: 100,
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                padding: "9px 20px",
                borderRadius: 100,
                background: C.ink,
                color: C.paper,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Annual
            </div>
            <div
              style={{
                padding: "9px 20px",
                borderRadius: 100,
                color: C.inkMuted,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Monthly (coming soon)
            </div>
          </div>
        </motion.div>

        {/* Tier grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "stretch",
          }}
          className="home18-pricing-grid"
        >
          {TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        {/* Fine print */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 12,
            color: C.inkMuted,
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}
        >
          All prices in Swedish kronor (SEK), VAT included. Billed annually
          on the day you confirm your first panel. Cancel from your account
          at any time, a pro-rated refund is issued on unused panels.
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home18-pricing-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function TierCard({
  tier,
  index,
}: {
  tier: (typeof TIERS)[number];
  index: number;
}) {
  const popular = tier.id === "member";
  const monthly = Math.round(tier.priceAnnual / 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.9,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      style={{
        position: "relative",
        background: popular ? C.paper : C.paper,
        borderRadius: 28,
        padding: popular ? 40 : 36,
        border: popular
          ? `2px solid ${C.lingon}`
          : `1px solid ${C.inkLine}`,
        boxShadow: popular
          ? `0 20px 60px rgba(184,50,44,0.15), ${C.shadowCard}`
          : C.shadowCard,
        display: "flex",
        flexDirection: "column",
        transform: popular ? "translateY(-12px)" : "none",
        transition: "all 0.3s",
      }}
    >
      {popular && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 16px",
            background: `linear-gradient(180deg, ${C.lingon} 0%, ${C.lingonDeep} 100%)`,
            color: C.paper,
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            boxShadow: `0 4px 14px ${C.lingonSoft}`,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={11} />
          Most popular
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            ...TYPE.label,
            color: popular ? C.lingon : C.inkMuted,
            marginBottom: 10,
          }}
        >
          {tier.name}
        </div>
        <div
          style={{
            fontSize: 15,
            color: C.inkSoft,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          {tier.tagline}
        </div>

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
              fontSize: popular ? 56 : 48,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {tier.priceAnnual.toLocaleString("sv-SE")}
          </span>
          <span
            style={{
              fontSize: 16,
              color: C.inkMuted,
              fontWeight: 500,
            }}
          >
            kr / year
          </span>
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          About {monthly.toLocaleString("sv-SE")} kr / month
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: C.inkLine,
          marginBottom: 24,
        }}
      />

      {/* Perks */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {tier.perks.map((perk, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              fontSize: 14,
              lineHeight: 1.45,
              color: C.ink,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: popular ? C.lingon : C.eucBg,
                color: popular ? C.paper : C.euc,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              <Check size={12} strokeWidth={3} />
            </div>
            {perk}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        style={{
          width: "100%",
          padding: "16px 20px",
          borderRadius: 14,
          background: popular
            ? `linear-gradient(180deg, ${C.lingon} 0%, ${C.lingonDeep} 100%)`
            : C.paper,
          color: popular ? C.paper : C.ink,
          border: popular ? "none" : `1.5px solid ${C.ink}`,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          boxShadow: popular ? `0 4px 16px ${C.lingonSoft}` : "none",
        }}
      >
        {tier.id === "starter" && "Start with Starter"}
        {tier.id === "member" && "Start as a Member"}
        {tier.id === "plus" && "Go Plus"}
      </motion.button>

      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          fontSize: 12,
          color: C.inkMuted,
        }}
      >
        Cancel anytime
      </div>
    </motion.div>
  );
}
