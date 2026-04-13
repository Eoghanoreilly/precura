"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  MapPin,
  Stethoscope,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { C, SYSTEM_FONT, TYPE, CLINICS, TIERS } from "./tokens";

/**
 * HERO - CALM CLARITY
 * -------------------
 * Conviction first, configuration second. The visitor (a worried 47-year-old
 * Swede at 11pm) reads a calm H1 that promises clarity, not a trip.
 *
 * Left: headline + plain-English subhead + trust microbar.
 * Right: a compact membership preview (not a checkout). Three tiers, one
 *   live price, one clinic hint, one "See what Precura costs" CTA. No fake
 *   quantity picker. No date picker posing as a flight booker.
 */

export function BookerHero() {
  const [tierId, setTierId] = useState<string>("member");
  const [cityOpen, setCityOpen] = useState(false);
  const [cityIdx, setCityIdx] = useState(0);

  const tier = useMemo(() => TIERS.find((t) => t.id === tierId)!, [tierId]);
  const city = CLINICS[cityIdx];
  const monthly = Math.round(tier.priceAnnual / 12);

  return (
    <section
      style={{
        position: "relative",
        background: C.cream,
        padding: "120px 32px 96px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        overflow: "hidden",
      }}
    >
      {/* Decorative warm wash in the top corners */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(184,50,44,0.08), rgba(184,50,44,0) 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -260,
          left: -160,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(62,107,84,0.07), rgba(62,107,84,0) 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
        className="booker-hero-grid"
      >
        {/* LEFT - COPY */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 100,
              background: C.paper,
              border: `1px solid ${C.inkLine}`,
              boxShadow: C.shadow,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.euc,
                boxShadow: `0 0 0 4px ${C.eucBg}`,
              }}
            />
            <span style={{ ...TYPE.small, color: C.inkSoft, fontWeight: 500 }}>
              Open for members across Sweden
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.displayHuge,
              margin: 0,
              marginBottom: 24,
            }}
          >
            Know what your{" "}
            <span style={{ color: C.lingon }}>blood is telling you</span>,
            years before it has to shout.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              maxWidth: 560,
              margin: "0 0 36px",
            }}
          >
            Precura is a Swedish health membership that turns one blood panel
            a year into a plain-English picture of your risk. A real doctor
            reads every result. A coach builds the plan that follows. No
            vardcentral queue, no ten-page PDF, no jargon.
          </motion.p>

          {/* Trust micro row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 28,
              alignItems: "center",
            }}
          >
            <TrustItem
              icon={<Users size={16} />}
              label="2,148 members"
              sub="and growing"
            />
            <TrustItem
              icon={<Stethoscope size={16} />}
              label="Dr. Marcus Johansson"
              sub="Karolinska trained"
            />
            <TrustItem
              icon={<Shield size={16} />}
              label="Cancel anytime"
              sub="no questions"
            />
          </motion.div>
        </div>

        {/* RIGHT - BOOKING WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            background: C.paper,
            borderRadius: 28,
            boxShadow: C.shadowBook,
            padding: 28,
            border: `1px solid ${C.inkLine}`,
          }}
        >
          {/* Widget header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.label,
                  color: C.lingon,
                  marginBottom: 6,
                }}
              >
                What Precura costs
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.015em",
                }}
              >
                See the tier that fits you
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                background: C.amberBg,
                borderRadius: 100,
              }}
            >
              <Star size={12} fill={C.amberDeep} stroke={C.amberDeep} />
              <span
                style={{
                  ...TYPE.micro,
                  color: C.amberDeep,
                  fontWeight: 600,
                }}
              >
                4.9 / 5
              </span>
            </div>
          </div>

          {/* Tier selector - pill group */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              padding: 4,
              background: C.canvas,
              borderRadius: 14,
              marginBottom: 14,
            }}
          >
            {TIERS.map((t) => {
              const active = t.id === tierId;
              const popular = t.id === "member";
              return (
                <button
                  key={t.id}
                  onClick={() => setTierId(t.id)}
                  style={{
                    position: "relative",
                    padding: "14px 10px 12px",
                    borderRadius: 10,
                    background: active ? C.paper : "transparent",
                    color: active ? C.ink : C.inkMuted,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: active ? C.shadow : "none",
                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    textAlign: "center" as const,
                  }}
                >
                  {popular && (
                    <span
                      style={{
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "2px 8px",
                        background: C.lingon,
                        color: C.paper,
                        borderRadius: 100,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Most popular
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: active ? C.lingon : C.inkFaint,
                    }}
                  >
                    {t.priceAnnual.toLocaleString("sv-SE")} kr
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tier tagline - one line of differentiation per tier */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${tier.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              style={{
                fontSize: 13,
                color: C.inkMuted,
                marginBottom: 14,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {tier.tagline}
            </motion.div>
          </AnimatePresence>

          {/* Nearest clinic hint - a quiet single row, not a stacked form */}
          <button
            onClick={() => setCityOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "12px 14px",
              background: C.canvas,
              borderRadius: 12,
              border: `1px solid ${C.inkLine}`,
              marginBottom: 20,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              transition: "background 0.2s",
            }}
            aria-expanded={cityOpen}
          >
            <MapPin size={16} color={C.inkMuted} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: C.inkMuted,
                  marginBottom: 1,
                }}
              >
                Your nearest clinic
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {city.city}, {city.address}
              </div>
            </div>
            <ChevronDown
              size={16}
              color={C.inkMuted}
              style={{
                transform: cityOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s",
              }}
            />
          </button>

          <AnimatePresence>
            {cityOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: C.paper,
                  border: `1px solid ${C.inkLine}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  marginTop: -12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  {CLINICS.map((c, idx) => {
                    const active = idx === cityIdx;
                    return (
                      <button
                        key={c.city}
                        onClick={() => {
                          setCityIdx(idx);
                          setCityOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "10px 12px",
                          background: active ? C.canvas : "transparent",
                          border: "none",
                          borderRadius: 10,
                          marginBottom: 2,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: C.ink,
                            }}
                          >
                            {c.city}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.inkMuted,
                            }}
                          >
                            {c.address} / {c.nextSlot}
                          </div>
                        </div>
                        {active && (
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: C.ink,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={11} color={C.paper} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price breakdown */}
          <div style={{ marginBottom: 18 }}>
            <PriceRow
              label={`${tier.name} membership`}
              sub={`${tier.panels} blood panel${tier.panels > 1 ? "s" : ""} / year`}
              value={`${tier.priceAnnual.toLocaleString("sv-SE")} kr`}
            />
            <PriceRow label="Clinic visit" sub="included" value="0 kr" faint />
            {tier.doctor && (
              <PriceRow
                label="Doctor review"
                sub="every result"
                value="0 kr"
                faint
              />
            )}
            <div
              style={{
                height: 1,
                background: C.inkHair,
                margin: "12px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPE.label,
                    color: C.inkMuted,
                    marginBottom: 2,
                  }}
                >
                  One annual price
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {tier.priceAnnual.toLocaleString("sv-SE")} kr
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Primary CTA - calm, non-theatre */}
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              width: "100%",
              padding: "18px 24px",
              borderRadius: 14,
              background: `linear-gradient(180deg, ${C.lingon} 0%, ${C.lingonDeep} 100%)`,
              color: C.paper,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              boxShadow: `0 4px 16px ${C.lingonSoft}`,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            Start with {tier.name} for {tier.priceAnnual.toLocaleString("sv-SE")} kr / year
          </motion.a>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 12,
              color: C.inkMuted,
              textAlign: "center" as const,
            }}
          >
            <Shield size={12} />
            <span>No charge today. Cancel any time in your account.</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.booker-hero-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function TrustItem({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: C.paper,
          border: `1px solid ${C.inkHair}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.ink,
          boxShadow: C.shadow,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.inkMuted,
            lineHeight: 1.2,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  sub,
  value,
  faint,
}: {
  label: string;
  sub: string;
  value: string;
  faint?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "6px 0",
      }}
    >
      <div>
        <span
          style={{
            fontSize: 14,
            color: faint ? C.inkMuted : C.ink,
            fontWeight: faint ? 400 : 500,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            color: C.inkFaint,
            marginLeft: 8,
          }}
        >
          {sub}
        </span>
      </div>
      <div
        style={{
          fontSize: 14,
          color: faint ? C.inkMuted : C.ink,
          fontWeight: faint ? 400 : 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}
