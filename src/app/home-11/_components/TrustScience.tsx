"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG, EASE } from "./tokens";

/**
 * TRUST & SCIENCE - Dr. Marcus Johansson named, real citations listed as
 * an editorial bibliography, Swedish heritage signals.
 */
export function TrustScience() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      id="science"
      style={{
        background: C.inkPanel,
        color: C.page,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div ref={headRef} style={{ marginBottom: 96, maxWidth: 900 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: "rgba(250,250,247,0.6)",
              marginBottom: 24,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 26,
                height: 1,
                background: "rgba(250,250,247,0.4)",
                display: "inline-block",
              }}
            />
            Ch. 07 / Trust and science
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              color: C.page,
            }}
          >
            Built in Stockholm, signed by a named clinician,{" "}
            <span
              style={{
                color: "#B7C9B9",
                fontStyle: "italic",
              }}
            >
              grounded in published research.
            </span>
          </motion.h2>
        </div>

        <div
          className="home11-trust-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{
              position: "relative",
              border: "1px solid rgba(250,250,247,0.18)",
              borderRadius: 6,
              padding: 32,
              background: "rgba(250,250,247,0.04)",
            }}
          >
            {/* Portrait */}
            <div
              style={{
                aspectRatio: "3 / 4",
                borderRadius: 4,
                overflow: "hidden",
                marginBottom: 24,
                background: "rgba(250,250,247,0.08)",
              }}
            >
              <img
                src={IMG.doctor}
                alt="Dr. Marcus Johansson"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "saturate(0.85) contrast(0.96) brightness(0.92)",
                }}
              />
            </div>
            <div
              style={{
                ...TYPE.mono,
                color: "#B7C9B9",
                marginBottom: 10,
              }}
            >
              Medical lead / Leg. lakare
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: C.page,
                marginBottom: 14,
              }}
            >
              Dr. Marcus Johansson
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(250,250,247,0.7)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Swedish GP, Karolinska Institute trained. 15+ years in Swedish
              primary care, 7 of them as Medical Director of a Stockholm
              clinic with 18,000 patients. Signs every Precura risk report in
              person. Reviews flagged trajectories within 48 hours. Available
              for secure messaging for 12 months after your first panel.
            </p>

            <div
              style={{
                marginTop: 28,
                paddingTop: 22,
                borderTop: "1px solid rgba(250,250,247,0.16)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPE.mono,
                    color: "rgba(250,250,247,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Reviews
                </div>
                <div style={{ fontSize: 16, color: C.page, fontWeight: 500 }}>
                  Every panel
                </div>
              </div>
              <div>
                <div
                  style={{
                    ...TYPE.mono,
                    color: "rgba(250,250,247,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Response time
                </div>
                <div style={{ fontSize: 16, color: C.page, fontWeight: 500 }}>
                  48 hours
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bibliography */}
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: "rgba(250,250,247,0.5)",
                marginBottom: 24,
              }}
            >
              Selected references
            </div>
            <div
              style={{
                borderTop: "1px solid rgba(250,250,247,0.16)",
              }}
            >
              {refs.map((r, i) => (
                <RefRow key={r.short} row={r} index={i} />
              ))}
            </div>

            {/* Heritage strip */}
            <div
              style={{
                marginTop: 60,
                padding: 28,
                border: "1px solid rgba(250,250,247,0.16)",
                borderRadius: 6,
                background: "rgba(250,250,247,0.03)",
              }}
            >
              <div
                style={{
                  ...TYPE.mono,
                  color: "#B7C9B9",
                  marginBottom: 16,
                }}
              >
                Built in Sweden
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                }}
                className="home11-heritage"
              >
                {heritage.map((h) => (
                  <div key={h.title}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: C.page,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {h.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(250,250,247,0.62)",
                        lineHeight: 1.5,
                        marginTop: 4,
                      }}
                    >
                      {h.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-trust-grid) {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
          :global(.home11-heritage) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const refs = [
  {
    short: "FINDRISC",
    long: "Finnish Diabetes Risk Score",
    cite:
      "Lindstrom J, Tuomilehto J. Diabetes Care, 2003, 26(3):725-731.",
    use: "Predicts 10-year risk of Type 2 diabetes from 8 non-invasive variables.",
  },
  {
    short: "SCORE2",
    long: "European cardiovascular risk model",
    cite:
      "SCORE2 Working Group. European Heart Journal, 2021, 42(25):2439-2454.",
    use: "Replaces SCORE. Predicts 10-year cardiovascular mortality and morbidity.",
  },
  {
    short: "FRAX",
    long: "Fracture Risk Assessment Tool",
    cite:
      "Kanis JA et al. Osteoporosis International, 2008, 19(4):385-397.",
    use: "Predicts 10-year hip and major osteoporotic fracture probability.",
  },
  {
    short: "SDPP",
    long: "Stockholm Diabetes Prevention Programme",
    cite:
      "Carlsson A et al. BMC Medicine, 2024.",
    use: "Swedish longitudinal cohort on lifestyle intervention effects.",
  },
  {
    short: "UKPDS",
    long: "UK Prospective Diabetes Study",
    cite: "Turner R et al. The Lancet, 1998.",
    use: "Landmark 20-year trial on glycemic control and complications.",
  },
  {
    short: "DPP",
    long: "Diabetes Prevention Program",
    cite: "Knowler WC et al. NEJM, 2002.",
    use: "Demonstrated 58% reduction in diabetes onset from lifestyle intervention.",
  },
];

const heritage = [
  {
    title: "EU hosted / Swedish servers",
    note: "All clinical data stored inside the EU, audited to ISO 27001.",
  },
  {
    title: "GDPR compliant",
    note: "Article 9 special category data handled with the strictest framework.",
  },
  {
    title: "BankID login",
    note: "The same sign-in Swedish adults already use for their bank and 1177.",
  },
  {
    title: "Complements 1177",
    note: "Designed to sit alongside the Swedish public record, not replace it.",
  },
];

function RefRow({
  row,
  index,
}: {
  row: (typeof refs)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: 0.05 * index, ease: EASE }}
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr",
        gap: 32,
        padding: "20px 0",
        borderBottom: "1px solid rgba(250,250,247,0.12)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: C.page,
            letterSpacing: "-0.01em",
          }}
        >
          {row.short}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 15,
            color: "rgba(250,250,247,0.85)",
            marginBottom: 4,
            letterSpacing: "-0.005em",
          }}
        >
          {row.long}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(250,250,247,0.55)",
            fontFamily: "ui-monospace, Menlo, monospace",
            marginBottom: 8,
          }}
        >
          {row.cite}
        </div>
        <div style={{ fontSize: 13, color: "rgba(250,250,247,0.62)" }}>
          {row.use}
        </div>
      </div>
    </motion.div>
  );
}
