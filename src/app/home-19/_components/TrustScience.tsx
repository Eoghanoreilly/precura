"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Server,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * TRUST + SCIENCE
 *
 * Two halves under one warm header.
 *
 * Left half is Dr. Marcus. Photo card, name, credential chips, one paragraph
 * in his own voice. He is named prominently because trust is personal: a
 * doctor with a face and a story beats a logo wall every time.
 *
 * Right half is the science. Three real, cite-able research instruments we
 * use (FINDRISC, SCORE2, FRAX) each with the actual first-author citation,
 * journal, and year. Below that, a row of four trust signals (EU-hosted,
 * GDPR, BankID, Karolinska lab).
 *
 * No left border accents. Soft paper cards on cream. Cream->deep cream
 * alternating with the rest of the page so this reads as its own moment.
 */
export function TrustScience() {
  const studies = [
    {
      tag: "FINDRISC",
      plain: "Diabetes risk in 8 questions",
      citation:
        "Lindstrom J, Tuomilehto J. The Diabetes Risk Score. Diabetes Care 2003;26(3):725-731.",
      use: "We use FINDRISC on every member onboarding to screen for type 2 diabetes risk in the next 10 years.",
    },
    {
      tag: "SCORE2",
      plain: "10-year cardiovascular risk",
      citation:
        "SCORE2 Working Group. SCORE2 risk prediction algorithms. European Heart Journal 2021;42(25):2439-2454.",
      use: "We run SCORE2 whenever we get a new lipid panel, so the cardiovascular picture updates with your actual data.",
    },
    {
      tag: "FRAX",
      plain: "10-year fracture risk",
      citation:
        "Kanis JA, et al. FRAX and the assessment of fracture probability. Osteoporosis International 2008;19(4):385-397.",
      use: "We calculate FRAX for members over 40 to monitor bone health and catch silent bone loss early.",
    },
  ];

  const trust = [
    {
      icon: Server,
      label: "EU-hosted",
      sub: "Frankfurt data centre",
    },
    {
      icon: ShieldCheck,
      label: "GDPR compliant",
      sub: "You own your data",
    },
    {
      icon: Lock,
      label: "BankID login",
      sub: "Swedish e-ID standard",
    },
    {
      icon: GraduationCap,
      label: "Karolinska lab",
      sub: "Accredited analysis",
    },
  ];

  return (
    <section
      id="science"
      style={{
        padding: "120px 32px 120px",
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
          }}
        >
          Trust and science
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
            marginBottom: 64,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              ...TYPE.displayL,
              margin: 0,
              maxWidth: 780,
            }}
          >
            A Swedish doctor.{" "}
            <span
              style={{
                color: C.coral,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Peer-reviewed models.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 380,
            }}
          >
            Precura is not a wellness app with a doctor logo bolted on. Every
            risk score we show comes from a real published paper.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            gap: 44,
            alignItems: "stretch",
          }}
          className="home19-trust-grid"
        >
          {/* LEFT: Dr. Marcus card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: C.paper,
              borderRadius: 28,
              border: `1px solid ${C.line}`,
              boxShadow: C.shadowLift,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 320,
                backgroundImage: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center 25%",
              }}
            />
            <div style={{ padding: "26px 30px 30px" }}>
              <div
                style={{
                  ...TYPE.micro,
                  color: C.coral,
                  fontWeight: 700,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Your doctor
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.018em",
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                Dr. Marcus Johansson
              </div>
              <div
                style={{
                  ...TYPE.body,
                  color: C.inkMuted,
                  marginBottom: 18,
                }}
              >
                Swedish GP, Karolinska-trained, 15+ years in primary care
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {[
                  "Karolinska Institutet",
                  "15+ years GP",
                  "Legitimerad lakare",
                  "Swedish / English",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      ...TYPE.small,
                      padding: "6px 12px",
                      borderRadius: 100,
                      background: C.creamDeep,
                      color: C.inkSoft,
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div
                style={{
                  background: C.creamSoft,
                  border: `1px solid ${C.lineSoft}`,
                  borderRadius: 18,
                  padding: "18px 20px",
                }}
              >
                <p
                  style={{
                    ...TYPE.body,
                    color: C.inkSoft,
                    margin: 0,
                    fontStyle: "italic",
                    lineHeight: 1.55,
                  }}
                >
                  &ldquo;I spent fifteen years in Swedish primary care watching
                  the same blood tests come back year after year, never
                  compared, never explained. Precura is the practice I always
                  wanted to run. Every result gets read by a human who
                  remembers you.&rdquo;
                </p>
                <div
                  style={{
                    ...TYPE.small,
                    color: C.inkMuted,
                    marginTop: 12,
                    fontWeight: 500,
                  }}
                >
                  Dr. Marcus Johansson / Medical Director, Precura
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Science stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: C.paper,
                borderRadius: 28,
                border: `1px solid ${C.line}`,
                boxShadow: C.shadow,
                padding: "28px 30px 26px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    background: C.coralSoft,
                    color: C.coralDeep,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <BookOpen size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    The models we run
                  </div>
                  <div style={{ ...TYPE.small, color: C.inkMuted }}>
                    Each one is a published, peer-reviewed instrument.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {studies.map((s, i) => (
                  <motion.div
                    key={s.tag}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      background: C.creamSoft,
                      border: `1px solid ${C.lineSoft}`,
                      borderRadius: 18,
                      padding: "18px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          ...TYPE.micro,
                          padding: "4px 10px",
                          borderRadius: 100,
                          background: C.ink,
                          color: C.paper,
                          fontWeight: 700,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {s.tag}
                      </span>
                      <span
                        style={{
                          ...TYPE.small,
                          color: C.inkSoft,
                          fontWeight: 600,
                        }}
                      >
                        {s.plain}
                      </span>
                    </div>
                    <p
                      style={{
                        ...TYPE.small,
                        color: C.inkMuted,
                        margin: 0,
                        marginBottom: 8,
                        lineHeight: 1.55,
                      }}
                    >
                      {s.use}
                    </p>
                    <div
                      style={{
                        ...TYPE.small,
                        color: C.inkFaint,
                        fontStyle: "italic",
                        lineHeight: 1.45,
                        paddingTop: 8,
                        borderTop: `1px dashed ${C.line}`,
                      }}
                    >
                      {s.citation}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trust signals strip */}
            <div
              style={{
                background: C.creamDeep,
                borderRadius: 24,
                border: `1px solid ${C.line}`,
                padding: "22px 24px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
              className="home19-trust-row"
            >
              {trust.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: C.paper,
                        border: `1px solid ${C.line}`,
                        display: "grid",
                        placeItems: "center",
                        color: C.sageDeep,
                      }}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.ink,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {t.label}
                    </div>
                    <div
                      style={{
                        ...TYPE.small,
                        color: C.inkMuted,
                      }}
                    >
                      {t.sub}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home19-trust-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          :global(.home19-trust-row) {
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
