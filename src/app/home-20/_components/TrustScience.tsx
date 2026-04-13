"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, MapPin, GraduationCap } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * TRUST AND SCIENCE - Dr. Marcus Johansson portrait with credentials,
 * three validated clinical models with full citations, and a row of
 * trust signals (EU-hosted, GDPR, BankID, Karolinska).
 *
 * Warm editorial layout, two-column. Left: the doctor. Right: the science.
 */

const MODELS = [
  {
    name: "FINDRISC",
    subtitle: "Type 2 diabetes risk, 10-year",
    desc:
      "The Finnish Diabetes Risk Score. A validated, non-invasive screen that has been adopted across Nordic primary care for two decades.",
    citation:
      "Lindstrom & Tuomilehto. Diabetes Care 26(3):725-731, 2003.",
    tag: "Lindstrom 2003",
  },
  {
    name: "SCORE2",
    subtitle: "Cardiovascular risk, 10-year",
    desc:
      "The European Society of Cardiology's current model, recalibrated for low-risk regions including Sweden. Replaces the original SCORE.",
    citation:
      "SCORE2 Working Group. European Heart Journal 42(25):2439-2454, 2021.",
    tag: "ESC 2021",
  },
  {
    name: "FRAX",
    subtitle: "Fragility fracture risk, 10-year",
    desc:
      "The WHO fracture risk assessment tool. Calibrated per country, uses bone density plus clinical risk factors.",
    citation:
      "Kanis et al. Osteoporosis International 19(4):385-397, 2008.",
    tag: "WHO 2008",
  },
];

const TRUST_SIGNALS = [
  { icon: MapPin, label: "EU-hosted", sub: "Servers in Stockholm" },
  { icon: Lock, label: "GDPR compliant", sub: "You own your data" },
  { icon: ShieldCheck, label: "BankID login", sub: "Swedish ID verification" },
  { icon: GraduationCap, label: "Karolinska-trained", sub: "Our clinical lead" },
];

export function TrustScience() {
  return (
    <section
      id="science"
      style={{
        background: C.creamSoft,
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
            marginBottom: 64,
          }}
          className="home20-trust-header"
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
              Science and trust
            </div>
            <h2 style={{ ...TYPE.displayL, margin: 0, maxWidth: 720 }}>
              A Swedish doctor and three models that already run in Nordic
              clinics.
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
            We did not invent a risk score. We use the ones primary care
            uses, and a human doctor reviews every profile.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 56,
            alignItems: "flex-start",
          }}
          className="home20-trust-body"
        >
          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: C.paper,
              border: `1px solid ${C.lineFaint}`,
              boxShadow: C.shadowLift,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 5",
                backgroundImage: `url(${IMG.drMarcus})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(22,21,18,0.78) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  right: 28,
                  bottom: 26,
                  color: C.creamSoft,
                }}
              >
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.terraSoft,
                    marginBottom: 6,
                  }}
                >
                  CLINICAL LEAD
                </div>
                <div
                  style={{
                    ...TYPE.h3,
                    color: C.creamSoft,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  Dr. Marcus Johansson
                </div>
                <div
                  style={{
                    ...TYPE.small,
                    color: C.creamDeep,
                  }}
                >
                  Swedish GP / Karolinska-trained
                </div>
              </div>
            </div>

            <div style={{ padding: "26px 28px 28px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                  marginBottom: 22,
                }}
              >
                <DoctorStat k="Years in primary care" v="15+" />
                <DoctorStat k="Specialisation" v="Internal medicine" />
                <DoctorStat k="Language" v="Swedish / English" />
                <DoctorStat k="Patient load" v="Capped monthly" />
              </div>
              <p
                style={{
                  ...TYPE.small,
                  color: C.inkMuted,
                  margin: 0,
                  lineHeight: 1.6,
                  paddingTop: 16,
                  borderTop: `1px solid ${C.lineFaint}`,
                }}
              >
                "I trained at Karolinska and spent fifteen years in Swedish
                primary care. Every Precura member gets my plain-English
                note on every blood panel. If something looks off, you hear
                from me directly."
              </p>
            </div>
          </motion.div>

          {/* Three models + trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 36,
              }}
            >
              {MODELS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "24px 26px",
                    background: C.paper,
                    borderRadius: 20,
                    border: `1px solid ${C.lineFaint}`,
                    boxShadow: C.shadowSoft,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 18,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          ...TYPE.h3,
                          margin: 0,
                          marginBottom: 4,
                          fontSize: 22,
                        }}
                      >
                        {m.name}
                      </div>
                      <div
                        style={{
                          ...TYPE.small,
                          color: C.terra,
                          fontWeight: 500,
                        }}
                      >
                        {m.subtitle}
                      </div>
                    </div>
                    <span
                      style={{
                        ...TYPE.tiny,
                        padding: "5px 11px",
                        borderRadius: 100,
                        background: C.sageHaze,
                        color: C.sageDeep,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      ...TYPE.small,
                      color: C.inkMuted,
                      margin: 0,
                      marginBottom: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {m.desc}
                  </p>
                  <div
                    style={{
                      ...TYPE.tiny,
                      color: C.inkFaint,
                      fontStyle: "italic",
                      paddingTop: 12,
                      borderTop: `1px solid ${C.lineFaint}`,
                    }}
                  >
                    {m.citation}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust signals row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
              }}
              className="home20-trust-signals"
            >
              {TRUST_SIGNALS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    style={{
                      padding: "18px 20px",
                      background: C.creamWarm,
                      borderRadius: 16,
                      border: `1px solid ${C.lineFaint}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: C.sageHaze,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={C.sageDeep} strokeWidth={1.8} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          ...TYPE.small,
                          color: C.ink,
                          fontWeight: 600,
                          marginBottom: 1,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          ...TYPE.tiny,
                          color: C.inkMuted,
                          textTransform: "none",
                          letterSpacing: 0,
                        }}
                      >
                        {s.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-trust-header) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          :global(.home20-trust-body) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 520px) {
          :global(.home20-trust-signals) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function DoctorStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div
        style={{
          ...TYPE.tiny,
          color: C.inkFaint,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 4,
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
