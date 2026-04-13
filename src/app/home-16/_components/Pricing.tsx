"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS, TIERS } from "./tokens";

/**
 * PRICING
 *
 * Three annual tiers. Middle tier (Member) is visually highlighted:
 * it sits on a coral panel, lifts a few pixels, and shows a "Most popular"
 * ribbon. Each tier has its own CTA. Airbnb-warm: cards are rounded,
 * shadows are soft, copy is plain.
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 130px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            textAlign: "center",
            maxWidth: 760,
            margin: "0 auto 60px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: COLORS.coralTint,
              color: COLORS.coralDeep,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Pricing
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4.8vw, 58px)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.028em",
            }}
          >
            One annual price.{" "}
            <span style={{ color: COLORS.coral }}>Cancel anytime.</span>
          </h2>
          <p
            style={{
              margin: "22px auto 0",
              fontSize: 18,
              lineHeight: 1.55,
              color: COLORS.inkSoft,
              maxWidth: 620,
            }}
          >
            Every tier includes a real Swedish doctor and your living health
            profile. Choose how much bloodwork and coaching you want on top.
          </p>
        </motion.div>

        {/* Tiers grid */}
        <div
          className="home16-pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "relative",
                background: tier.featured ? COLORS.ink : COLORS.bgPaper,
                color: tier.featured ? "#FFFFFF" : COLORS.ink,
                borderRadius: RADIUS.cardLarge,
                border: tier.featured
                  ? `1px solid ${COLORS.ink}`
                  : `1px solid ${COLORS.line}`,
                boxShadow: tier.featured
                  ? "0 24px 70px rgba(28,26,22,0.22)"
                  : COLORS.shadowSoft,
                padding: "40px 34px 36px",
                transform: tier.featured ? "translateY(-8px)" : "none",
                display: "flex",
                flexDirection: "column",
              }}
              className="home16-pricing-card"
            >
              {tier.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "7px 14px",
                    borderRadius: 999,
                    background: COLORS.coral,
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 8px 22px rgba(232,90,79,0.35)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Sparkles size={12} /> Most popular
                </div>
              )}

              {/* Name */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: tier.featured
                    ? "rgba(255,255,255,0.7)"
                    : COLORS.inkMuted,
                  marginBottom: 8,
                }}
              >
                {tier.name}
              </div>

              {/* Tagline */}
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  letterSpacing: "-0.008em",
                  color: tier.featured
                    ? "rgba(255,255,255,0.92)"
                    : COLORS.inkSoft,
                  marginBottom: 24,
                  minHeight: 46,
                }}
              >
                {tier.tagline}
              </div>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  color: tier.featured ? "#FFFFFF" : COLORS.ink,
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 700,
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                  }}
                >
                  {tier.price.toLocaleString("sv-SE")}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: tier.featured
                      ? "rgba(255,255,255,0.72)"
                      : COLORS.inkMuted,
                  }}
                >
                  SEK/year
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: tier.featured
                    ? "rgba(255,255,255,0.66)"
                    : COLORS.inkMuted,
                  marginTop: 4,
                  marginBottom: 28,
                }}
              >
                About {tier.perMonth.toLocaleString("sv-SE")} SEK/month. Cancel
                anytime.
              </div>

              {/* CTA */}
              <a
                href="#start"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "14px 20px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  background: tier.featured
                    ? COLORS.coral
                    : COLORS.bgPaper,
                  color: tier.featured ? "#FFFFFF" : COLORS.ink,
                  border: tier.featured
                    ? "1px solid transparent"
                    : `1px solid ${COLORS.ink}`,
                  boxShadow: tier.featured
                    ? "0 8px 24px rgba(232,90,79,0.32)"
                    : "none",
                  marginBottom: 28,
                }}
              >
                {tier.cta}
              </a>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  width: "100%",
                  background: tier.featured
                    ? "rgba(255,255,255,0.14)"
                    : COLORS.lineSoft,
                  marginBottom: 22,
                }}
              />

              {/* Includes */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: tier.featured
                    ? "rgba(255,255,255,0.66)"
                    : COLORS.inkMuted,
                  marginBottom: 14,
                }}
              >
                What is included
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                }}
              >
                {tier.includes.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      fontSize: 14,
                      lineHeight: 1.45,
                      color: tier.featured
                        ? "rgba(255,255,255,0.92)"
                        : COLORS.inkSoft,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        background: tier.featured
                          ? "rgba(255,255,255,0.18)"
                          : COLORS.coralTint,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <Check
                        size={12}
                        strokeWidth={3}
                        style={{
                          color: tier.featured ? "#FFFFFF" : COLORS.coral,
                        }}
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom microcopy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            textAlign: "center",
            marginTop: 42,
            fontSize: 13,
            color: COLORS.inkMuted,
            lineHeight: 1.6,
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          All panels drawn at Karolinska-accredited labs. All doctors are
          Swedish-licensed. Your data is stored in the EU. Prices include VAT.
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home16-pricing-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.home16-pricing-card) {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
