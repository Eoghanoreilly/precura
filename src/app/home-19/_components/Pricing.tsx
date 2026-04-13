"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PRICING
 *
 * Three annual tiers. Middle is the highlighted "most members" tier,
 * raised slightly on the y-axis and given a dark ink background so it
 * looks like the hero row in Airbnb's pricing module. Each tier has
 * its own CTA button. All prices in SEK/year.
 *
 * Tier lineup:
 *   Essential  995   / Once-a-year panel + doctor note
 *   Member     2,995 / Most members. Doctor + coach + 4x panels/yr
 *   Plus       4,995 / Same as Member plus home visits and priority
 *
 * Below the three cards: a single row of reassurance chips
 * (annual billing, cancel anytime, BankID, SEK VAT included).
 */
export function Pricing() {
  const tiers = [
    {
      id: "essential",
      name: "Essential",
      price: "995",
      period: "SEK / year",
      blurb:
        "A comprehensive annual panel with a doctor note. For people who just want the basics done properly.",
      features: [
        "1 blood panel per year (40+ markers)",
        "Dr. Marcus reviews every result",
        "Written note in plain Swedish",
        "Living health profile",
        "FINDRISC, SCORE2, FRAX scores",
      ],
      cta: "Start Essential",
      highlight: false,
    },
    {
      id: "member",
      name: "Member",
      price: "2,995",
      period: "SEK / year",
      blurb:
        "The full membership. Your own doctor, your own coach, four panels a year, AI assistant, everything.",
      features: [
        "4 blood panels per year",
        "Dedicated doctor (Dr. Marcus)",
        "Assigned human coach with real plan",
        "20 min video reviews each panel",
        "Message the doctor in the app",
        "AI that has read your file",
        "Welcome kit on day one",
      ],
      cta: "Start Member",
      highlight: true,
      badge: "Most members",
    },
    {
      id: "plus",
      name: "Plus",
      price: "4,995",
      period: "SEK / year",
      blurb:
        "Everything in Member, plus home visits, priority doctor access, and a quarterly deep-dive panel.",
      features: [
        "Everything in Member",
        "Home phlebotomy visits",
        "Priority doctor access",
        "Quarterly extended panels (60+ markers)",
        "ECG and body composition each year",
        "Family member add-on at 50%",
      ],
      cta: "Start Plus",
      highlight: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: "130px 32px 130px",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            ...TYPE.label,
            color: C.coral,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Pricing
        </div>
        <h2
          style={{
            ...TYPE.displayL,
            margin: 0,
            textAlign: "center",
            maxWidth: 820,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Three tiers.{" "}
          <span
            style={{
              color: C.coral,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Annual. Cancel anytime.
          </span>
        </h2>
        <p
          style={{
            ...TYPE.lead,
            color: C.inkMuted,
            margin: 0,
            textAlign: "center",
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 20,
            marginBottom: 64,
          }}
        >
          Pay once a year, keep the whole membership, or cancel any month and
          keep access until your current year runs out. No hidden fees.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 22,
            alignItems: "stretch",
          }}
          className="home19-pricing-grid"
        >
          {tiers.map((t, i) => {
            const isDark = t.highlight;
            const textColor = isDark ? C.paper : C.ink;
            const mutedColor = isDark ? "#CBC3AE" : C.inkMuted;
            const cardBg = isDark ? C.ink : C.paper;
            const borderColor = isDark ? C.ink : C.line;
            const shadow = isDark ? C.shadowLift : C.shadow;
            const featureDotBg = isDark ? C.coral : C.sageSoft;
            const featureDotColor = isDark ? C.paper : C.sageDeep;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: cardBg,
                  borderRadius: 28,
                  border: `1px solid ${borderColor}`,
                  boxShadow: shadow,
                  padding: "34px 32px 32px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transform: isDark ? "translateY(-8px)" : "translateY(0)",
                }}
              >
                {t.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.coral,
                      color: C.paper,
                      padding: "7px 14px",
                      borderRadius: 100,
                      ...TYPE.micro,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      boxShadow: "0 8px 20px rgba(226,90,76,0.35)",
                    }}
                  >
                    {t.badge}
                  </div>
                )}

                <div
                  style={{
                    ...TYPE.label,
                    color: isDark ? C.coral : C.coral,
                    marginBottom: 8,
                  }}
                >
                  {t.name}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(38px, 3.8vw, 52px)",
                      fontWeight: 700,
                      color: textColor,
                      letterSpacing: "-0.028em",
                      lineHeight: 1,
                    }}
                  >
                    {t.price}
                  </span>
                  <span
                    style={{
                      ...TYPE.small,
                      color: mutedColor,
                      fontWeight: 500,
                    }}
                  >
                    {t.period}
                  </span>
                </div>

                <p
                  style={{
                    ...TYPE.body,
                    color: mutedColor,
                    margin: 0,
                    marginBottom: 22,
                    lineHeight: 1.55,
                  }}
                >
                  {t.blurb}
                </p>

                <div
                  style={{
                    height: 1,
                    background: isDark ? "#343434" : C.lineSoft,
                    marginBottom: 20,
                  }}
                />

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 28,
                    flex: 1,
                  }}
                >
                  {t.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "22px 1fr",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: featureDotBg,
                          color: featureDotColor,
                          display: "grid",
                          placeItems: "center",
                          marginTop: 1,
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span
                        style={{
                          fontSize: 15,
                          color: isDark ? "#EDE5D0" : C.inkSoft,
                          lineHeight: 1.5,
                          letterSpacing: "-0.003em",
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#final"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "15px 20px",
                    borderRadius: 100,
                    background: isDark ? C.coral : C.ink,
                    color: C.paper,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: isDark
                      ? "0 8px 22px rgba(226,90,76,0.35)"
                      : "0 4px 14px rgba(26,26,26,0.18)",
                    transition: "background 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isDark
                      ? C.coralDeep
                      : C.coralDeep;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isDark
                      ? C.coral
                      : C.ink;
                  }}
                >
                  {t.cta}
                  <ArrowRight size={16} strokeWidth={2.2} />
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "18px 32px",
            marginTop: 52,
            flexWrap: "wrap",
          }}
        >
          {[
            "Annual billing",
            "Cancel anytime",
            "Sign in with BankID",
            "SEK VAT included",
            "No auto-renew without a reminder",
          ].map((item) => (
            <span
              key={item}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                ...TYPE.small,
                color: C.inkMuted,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.sage,
                }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1000px) {
          :global(.home19-pricing-grid) {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
          :global(.home19-pricing-grid > div) {
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </section>
  );
}
