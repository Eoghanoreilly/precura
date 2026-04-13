"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Server,
  IdCard,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * TRUST / SCIENCE
 * ---------------
 * Dr. Marcus Johansson named prominently with a real portrait, set against
 * the three peer-reviewed risk models Precura uses (FINDRISC, SCORE2, FRAX)
 * with full citations. Closes with a compact row of four institutional trust
 * signals.
 *
 * Layout: left column is the doctor card with portrait and credentials, right
 * column is a stacked list of citation cards. Trust signal row spans full
 * width at the bottom.
 */

const CITATIONS = [
  {
    name: "FINDRISC",
    purpose: "Type 2 diabetes 10-year risk",
    authors: "Lindstrom J, Tuomilehto J",
    year: "2003",
    journal: "Diabetes Care",
    volume: "26(3)",
    pages: "725 / 731",
    note: "Validated across 10+ European cohorts, used in Swedish primary care.",
    color: C.lingon,
    bg: C.lingonBg,
  },
  {
    name: "SCORE2",
    purpose: "Cardiovascular disease 10-year risk",
    authors: "SCORE2 Working Group and ESC Cardiovascular Risk Collaboration",
    year: "2021",
    journal: "European Heart Journal",
    volume: "42(25)",
    pages: "2439 / 2454",
    note: "European Society of Cardiology endorsed, region-specific calibration for Sweden.",
    color: C.amberDeep,
    bg: C.amberBg,
  },
  {
    name: "FRAX",
    purpose: "Major osteoporotic fracture 10-year risk",
    authors: "Kanis JA, Johnell O, Oden A, Johansson H, McCloskey E",
    year: "2008",
    journal: "Osteoporosis International",
    volume: "19(4)",
    pages: "385 / 397",
    note: "WHO Collaborating Centre tool, Swedish reference data built in.",
    color: C.euc,
    bg: C.eucBg,
  },
];

const TRUST_SIGNALS = [
  {
    icon: <Server size={18} />,
    label: "EU-hosted",
    sub: "Data never leaves Europe",
  },
  {
    icon: <ShieldCheck size={18} />,
    label: "GDPR compliant",
    sub: "Patient data by design",
  },
  {
    icon: <IdCard size={18} />,
    label: "BankID login",
    sub: "Swedish identity standard",
  },
  {
    icon: <GraduationCap size={18} />,
    label: "Karolinska affiliated",
    sub: "Clinically supervised",
  },
];

export function TrustScience() {
  return (
    <section
      style={{
        background: C.canvas,
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
          style={{ marginBottom: 64, maxWidth: 780 }}
        >
          <div
            style={{
              ...TYPE.label,
              color: C.lingon,
              marginBottom: 20,
            }}
          >
            Science and trust
          </div>
          <h2
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              marginBottom: 16,
            }}
          >
            A real Swedish doctor.{" "}
            <span style={{ color: C.inkMuted }}>
              Real peer-reviewed models.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 640,
            }}
          >
            Precura is built on tools you can look up in the medical literature
            and a clinician whose credentials you can verify. No black boxes,
            no "proprietary AI scoring."
          </p>
        </motion.div>

        {/* Main two-column */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 48,
            alignItems: "flex-start",
            marginBottom: 72,
          }}
          className="home18-trust-grid"
        >
          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: C.paper,
              borderRadius: 28,
              overflow: "hidden",
              border: `1px solid ${C.inkLine}`,
              boxShadow: C.shadowLift,
            }}
          >
            {/* Portrait */}
            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                background: C.canvas,
              }}
            >
              <img
                src={IMG.doctor}
                alt="Dr. Marcus Johansson, Swedish GP"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  bottom: 22,
                  right: 24,
                  color: C.paper,
                }}
              >
                <div
                  style={{
                    ...TYPE.label,
                    color: "rgba(255,255,255,0.78)",
                    marginBottom: 6,
                  }}
                >
                  Medical director
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Dr. Marcus Johansson
                </div>
              </div>
              {/* Small license chip */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: 100,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.ink,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.euc,
                  }}
                />
                Swedish medical license
              </div>
            </div>

            {/* Credentials */}
            <div style={{ padding: 32 }}>
              <div
                style={{
                  ...TYPE.label,
                  color: C.inkMuted,
                  marginBottom: 12,
                }}
              >
                Credentials
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                <CredLine
                  title="Karolinska Institutet"
                  sub="Doctor of Medicine, 2008"
                />
                <CredLine
                  title="Swedish Board of Internal Medicine"
                  sub="Specialist certification, 2014"
                />
                <CredLine
                  title="15+ years in primary care"
                  sub="General practice, Stockholm region"
                />
                <CredLine
                  title="Clinical focus"
                  sub="Metabolic health, preventive medicine, early detection"
                />
              </div>

              <blockquote
                style={{
                  margin: 0,
                  padding: "20px 22px",
                  background: C.cream,
                  borderRadius: 16,
                  border: `1px solid ${C.inkLine}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: C.inkSoft,
                    fontStyle: "italic",
                  }}
                >
                  "I have spent fifteen years watching patients drift toward
                  disease one normal test at a time. Precura is the first
                  place I can actually act on the drift."
                </p>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  Dr. Marcus Johansson
                </div>
              </blockquote>
            </div>
          </motion.div>

          {/* Citations */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {CITATIONS.map((c, i) => (
              <motion.article
                key={c.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.12 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: C.paper,
                  borderRadius: 22,
                  padding: 28,
                  border: `1px solid ${C.inkLine}`,
                  boxShadow: C.shadowCard,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: c.bg,
                      color: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: C.ink,
                        letterSpacing: "-0.01em",
                        marginBottom: 2,
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.inkMuted,
                        fontWeight: 500,
                      }}
                    >
                      {c.purpose}
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: C.inkSoft,
                  }}
                >
                  {c.note}
                </p>

                <div
                  style={{
                    padding: "12px 16px",
                    background: C.canvas,
                    borderRadius: 12,
                    border: `1px solid ${C.inkLine}`,
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: C.inkMuted,
                  }}
                >
                  <span style={{ color: C.ink, fontWeight: 600 }}>
                    {c.authors}
                  </span>{" "}
                  ({c.year}).{" "}
                  <span style={{ fontStyle: "italic" }}>{c.journal}</span>,{" "}
                  {c.volume}, {c.pages}.
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Trust signals row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            padding: 24,
            background: C.paper,
            borderRadius: 22,
            border: `1px solid ${C.inkLine}`,
            boxShadow: C.shadowCard,
          }}
          className="home18-trust-signals"
        >
          {TRUST_SIGNALS.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "4px 8px",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: C.canvas,
                  border: `1px solid ${C.inkLine}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.ink,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.ink,
                    lineHeight: 1.2,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.inkMuted,
                    lineHeight: 1.3,
                    marginTop: 2,
                  }}
                >
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home18-trust-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.home18-trust-signals) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          :global(.home18-trust-signals) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function CredLine({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: C.lingon,
          flexShrink: 0,
          marginTop: 8,
        }}
      />
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.inkMuted,
            lineHeight: 1.4,
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
