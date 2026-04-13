"use client";

/**
 * TRUST AND SCIENCE - Dr. Marcus named and sourced. Real citations.
 * Swedish trust signals. Two-column layout: a tall portrait-style
 * card for the doctor on the left, a clean citations and trust grid
 * on the right.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { C, FONT, MONO, TYPE, GRID, EASE, IMG } from "./tokens";

export function TrustScience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      id="science"
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
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: GRID.columnGap,
        }}
      >
        {/* Header */}
        <div style={{ gridColumn: "span 12", marginBottom: 72 }}>
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.inkMuted,
              marginBottom: 20,
            }}
          >
            07 / Trust and science
          </div>
          <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink, maxWidth: 900 }}>
            A Swedish clinician reads every panel.{" "}
            <span style={{ color: C.accent, fontStyle: "italic" }}>
              Every risk model is peer-reviewed.
            </span>
          </h2>
        </div>

        {/* Doctor portrait card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE.out }}
          style={{
            gridColumn: "span 5",
            background: C.paperElev,
            border: `1px solid ${C.line}`,
            borderRadius: 22,
            padding: 0,
            overflow: "hidden",
            boxShadow: C.shadowSm,
            display: "flex",
            flexDirection: "column",
          }}
          className="home12-trust-doctor"
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 3",
              background: C.paperSoft,
              overflow: "hidden",
            }}
          >
            <img
              src={IMG.doctor}
              alt="Dr. Marcus Johansson"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(10%) contrast(1.02)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(13,16,20,0) 50%, rgba(13,16,20,0.75) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                color: C.paper,
              }}
            >
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: "rgba(250, 250, 247, 0.8)",
                  marginBottom: 6,
                }}
              >
                Precura medical lead
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: C.paper,
                  lineHeight: 1.08,
                }}
              >
                Dr. Marcus Johansson
              </div>
            </div>
          </div>

          <div style={{ padding: 32 }}>
            <p
              style={{
                ...TYPE.body,
                color: C.inkSoft,
                margin: 0,
                marginBottom: 18,
              }}
            >
              Leg. lakare, Swedish general practitioner. Trained at the
              Karolinska Institute in Stockholm, 15+ years in primary care,
              previously at Cityakuten Vardcentral and Sodersjukhuset.
              Marcus personally reads every Precura panel, writes your
              note, and is reachable for 12 months after your first draw.
            </p>
            <blockquote
              style={{
                margin: 0,
                padding: "18px 22px",
                background: C.paper,
                border: `1px solid ${C.line}`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: C.inkMuted,
                  marginBottom: 10,
                }}
              >
                Why I joined Precura
              </div>
              <p
                style={{
                  ...TYPE.body,
                  color: C.inkMid,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                "In primary care I get 15 minutes and one blood test. I
                wanted to build something where I could actually watch a
                patient's trajectory over years, and catch the drift while
                it is still reversible."
              </p>
            </blockquote>
          </div>
        </motion.div>

        {/* Right - citations + trust chips */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 1.0, delay: 0.2, ease: EASE.out }}
          style={{
            gridColumn: "7 / span 6",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
          className="home12-trust-right"
        >
          <div>
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 14,
              }}
            >
              Peer-reviewed sources
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {CITATIONS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 16,
                    padding: "16px 0",
                    borderTop: `1px solid ${C.line}`,
                    borderBottom:
                      i === CITATIONS.length - 1
                        ? `1px solid ${C.line}`
                        : "none",
                    alignItems: "baseline",
                  }}
                  className="home12-trust-cite"
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: C.accent,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {c.name}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontSize: 15,
                        fontWeight: 500,
                        color: C.ink,
                        marginBottom: 2,
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        ...TYPE.caption,
                        color: C.inkMuted,
                      }}
                    >
                      {c.ref}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 14,
              }}
            >
              Trust, data and regulation
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="home12-trust-chips"
            >
              {TRUST_CHIPS.map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 16px",
                    background: C.paperElev,
                    border: `1px solid ${C.line}`,
                    borderRadius: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.8}
                    color={C.sage}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontSize: 14,
                        fontWeight: 500,
                        color: C.ink,
                        marginBottom: 2,
                      }}
                    >
                      {t.title}
                    </div>
                    <div
                      style={{
                        ...TYPE.caption,
                        color: C.inkMuted,
                      }}
                    >
                      {t.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-trust-doctor) {
            grid-column: span 12 !important;
          }
          :global(.home12-trust-right) {
            grid-column: span 12 !important;
          }
        }
        @media (max-width: 720px) {
          :global(.home12-trust-chips) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const CITATIONS = [
  {
    name: "FINDRISC",
    title: "Finnish Diabetes Risk Score",
    ref: "Lindstrom J, Tuomilehto J. Diabetes Care 2003;26(3):725-731",
  },
  {
    name: "SCORE2",
    title: "European Society of Cardiology risk model, 2021 recalibration",
    ref: "SCORE2 Working Group. Eur Heart J 2021;42(25):2439-2454",
  },
  {
    name: "FRAX",
    title: "WHO fracture risk assessment tool",
    ref: "Kanis JA et al. Osteoporosis International 2008;19(4):385-397",
  },
  {
    name: "SDPP",
    title: "Stockholm Diabetes Prevention Programme",
    ref: "Carlsson S et al. BMC Medicine 2024",
  },
  {
    name: "UKPDS",
    title: "UK Prospective Diabetes Study long-term outcomes",
    ref: "Turner R et al. The Lancet 1998;352(9131):837-853",
  },
  {
    name: "DPP",
    title: "US Diabetes Prevention Program, lifestyle vs metformin",
    ref: "Knowler WC et al. NEJM 2002;346(6):393-403",
  },
];

const TRUST_CHIPS = [
  {
    title: "BankID sign-in",
    body: "Every session is gated by Swedish BankID.",
  },
  {
    title: "EU hosted",
    body: "Frankfurt and Stockholm. No US sub-processors.",
  },
  {
    title: "GDPR compliant",
    body: "You can export or delete your profile at any time.",
  },
  {
    title: "1177 complement",
    body: "Precura complements your vardcentral, it does not replace it.",
  },
];
