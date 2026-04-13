"use client";

/**
 * PRICING - three tiers laid out on the 12-column grid. Middle tier is
 * highlighted. Clear differences on coaching and doctor access. Not a
 * toggled annual/monthly tabbed thing. Just three clear choices.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  bullets: { label: string; included: boolean; detail?: string }[];
  cta: string;
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Panel",
    price: "995",
    cadence: "one-off",
    tagline: "Start with one blood draw. See your data.",
    bullets: [
      { label: "One 40-biomarker blood panel", included: true },
      { label: "Living profile for 30 days", included: true },
      { label: "FINDRISC, SCORE2, FRAX risk read", included: true },
      { label: "Plain-English doctor note", included: true },
      {
        label: "Doctor messaging access",
        included: false,
        detail: "Annual tier",
      },
      { label: "Personal coach", included: false, detail: "Annual tier" },
      { label: "Quarterly retests", included: false, detail: "Annual tier" },
    ],
    cta: "Order a panel",
  },
  {
    name: "Annual",
    price: "2,995",
    cadence: "per year",
    tagline: "The core Precura product. Doctor + coach + four retests.",
    bullets: [
      { label: "Everything in Panel", included: true },
      { label: "Four 40-marker panels per year", included: true },
      {
        label: "Dr. Marcus messaging, 12 months",
        included: true,
        detail: "Response within 48h",
      },
      {
        label: "Assigned personal coach",
        included: true,
        detail: "Progressive training plan",
      },
      { label: "AI chat with full profile context", included: true },
      { label: "Annual reset consultation", included: true },
      { label: "Unlimited profile history", included: true },
    ],
    cta: "Join Precura Annual",
    highlight: true,
  },
  {
    name: "Concierge",
    price: "4,995",
    cadence: "per year",
    tagline: "Deepest coverage. Video calls, in-home draws, priority.",
    bullets: [
      { label: "Everything in Annual", included: true },
      { label: "Home blood draw in Stockholm", included: true },
      { label: "Two 30-min video calls with Dr. Marcus", included: true },
      {
        label: "1-to-1 coaching sessions",
        included: true,
        detail: "Monthly video call",
      },
      { label: "Priority message response under 24h", included: true },
      { label: "Annual in-depth lab (80+ markers)", included: true },
      { label: "Family risk review included", included: true },
    ],
    cta: "Apply for Concierge",
  },
];

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      id="pricing"
      style={{
        background: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
            marginBottom: 72,
            alignItems: "flex-end",
          }}
        >
          <div style={{ gridColumn: "span 7" }} className="home12-pr-head">
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 20,
              }}
            >
              09 / Pricing
            </div>
            <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink }}>
              Three tiers.{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                No hidden fees.
              </span>
            </h2>
          </div>
          <p
            style={{
              gridColumn: "9 / span 4",
              ...TYPE.body,
              color: C.inkSoft,
              margin: 0,
            }}
            className="home12-pr-sub"
          >
            All prices in SEK, inclusive of VAT. Cancel any time. Blood
            draws are at partnered clinics in Stockholm, Goteborg, Malmo,
            Uppsala and Lund.
          </p>
        </div>

        {/* Tier grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
          }}
        >
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{
                duration: 1.0,
                delay: 0.1 + i * 0.1,
                ease: EASE.out,
              }}
              style={{
                gridColumn: "span 4",
                padding: 36,
                background: t.highlight ? C.graphite : C.paperElev,
                color: t.highlight ? C.paper : C.ink,
                border: `1px solid ${t.highlight ? C.graphite : C.line}`,
                borderRadius: 22,
                boxShadow: t.highlight ? C.shadowLg : C.shadowSm,
                display: "flex",
                flexDirection: "column",
                minHeight: 560,
                position: "relative",
              }}
              className="home12-pr-tier"
            >
              {t.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 24,
                    padding: "6px 14px",
                    background: C.accent,
                    color: C.paper,
                    borderRadius: 100,
                    ...TYPE.eyebrow,
                    fontSize: 10,
                  }}
                >
                  Most popular
                </div>
              )}

              <div
                style={{
                  ...TYPE.eyebrow,
                  color: t.highlight ? C.accent : C.inkMuted,
                  marginBottom: 14,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 54,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    color: t.highlight ? C.paper : C.ink,
                    lineHeight: 1,
                  }}
                >
                  {t.price}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: t.highlight ? "rgba(250, 250, 247, 0.6)" : C.inkMuted,
                    letterSpacing: "0.04em",
                  }}
                >
                  SEK / {t.cadence}
                </span>
              </div>
              <p
                style={{
                  ...TYPE.body,
                  color: t.highlight ? "rgba(250, 250, 247, 0.72)" : C.inkSoft,
                  margin: 0,
                  marginBottom: 28,
                }}
              >
                {t.tagline}
              </p>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  paddingTop: 24,
                  borderTop: `1px solid ${
                    t.highlight ? C.lineDark : C.line
                  }`,
                  marginBottom: 28,
                }}
              >
                {t.bullets.map((b, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      opacity: b.included ? 1 : 0.38,
                    }}
                  >
                    <Check
                      size={15}
                      strokeWidth={2.2}
                      color={
                        t.highlight
                          ? b.included
                            ? C.accent
                            : "rgba(250, 250, 247, 0.35)"
                          : b.included
                          ? C.sage
                          : C.inkFaint
                      }
                      style={{ marginTop: 3, flexShrink: 0 }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: FONT,
                          fontSize: 14,
                          color: t.highlight ? C.paper : C.ink,
                          lineHeight: 1.45,
                        }}
                      >
                        {b.label}
                      </div>
                      {b.detail && (
                        <div
                          style={{
                            ...TYPE.caption,
                            color: t.highlight
                              ? "rgba(250, 250, 247, 0.55)"
                              : C.inkMuted,
                            marginTop: 2,
                          }}
                        >
                          {b.detail}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: t.highlight ? C.accent : C.ink,
                  color: C.paper,
                  border: "none",
                  borderRadius: 10,
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                  transition: "transform 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {t.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-pr-head),
          :global(.home12-pr-sub) {
            grid-column: span 12 !important;
          }
          :global(.home12-pr-tier) {
            grid-column: span 12 !important;
            min-height: unset !important;
          }
        }
      `}</style>
    </section>
  );
}
