"use client";

/**
 * WhatYouGet - 6 pillars mosaic.
 *
 * Asymmetric mosaic (not a 3-card grid) covering the five product pillars
 * the user asked us to communicate next-level:
 *
 *   1. Scientific research-backed   (big card, bottom-left)
 *   2. Biomarker-driven             (tall card, middle)
 *   3. Personal doctor              (wide card, top)
 *   4. Active coaching              (wide card, bottom-right)
 *   5. Living profile               (already has its own section)
 *   6. Secure & Swedish             (small card)
 *
 * We do NOT use hover interactivity here: the carousel section is where
 * the clickable exploration lives. This is the spec sheet, with real
 * numbers and real names.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE, IMG } from "./tokens";

export default function WhatYouGet() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      id="what"
      style={{
        background: C.cream,
        color: C.ink,
        padding: "180px 36px 160px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 40,
            marginBottom: 72,
          }}
        >
          <div style={{ maxWidth: 780 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ ...TYPE.mono, color: C.amber, marginBottom: 24 }}
            >
              05  /  What you get
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              style={{ ...TYPE.displayLarge, margin: 0, color: C.ink }}
            >
              Everything we can{" "}
              <span
                style={{
                  color: C.amberDeep,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                legally
              </span>{" "}
              build for you.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.lead,
              color: C.inkMid,
              margin: 0,
              maxWidth: 360,
            }}
          >
            Next-level means scientific research, 40+ biomarkers, a real
            Swedish GP, and a personal coach. Not a PDF and a wish.
          </motion.p>
        </div>

        {/* Mosaic */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "minmax(200px, auto)",
            gap: 20,
          }}
          className="home13-mosaic"
        >
          {/* 1. Doctor card - wide top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            style={{
              gridColumn: "span 4",
              gridRow: "span 2",
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: C.inkSoft,
              color: C.cream,
              minHeight: 440,
            }}
          >
            <img
              src={IMG.doctor}
              alt="Dr. Marcus Johansson"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.55,
                filter: "saturate(0.85)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, rgba(14,18,14,0.3) 0%, rgba(14,18,14,0.85) 100%)",
              }}
            />
            <div
              style={{
                position: "relative",
                height: "100%",
                padding: 40,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.amberSoft,
                    marginBottom: 20,
                  }}
                >
                  Pillar 01  /  Personal doctor
                </div>
                <h3
                  style={{
                    fontSize: "clamp(30px, 3.4vw, 46px)",
                    fontWeight: 500,
                    margin: 0,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: C.cream,
                    maxWidth: 560,
                  }}
                >
                  A Swedish GP who knows your 5-year trajectory.
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(245, 239, 226, 0.15)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: C.cream,
                    color: C.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  MJ
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: C.cream,
                    }}
                  >
                    Dr. Marcus Johansson
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(245, 239, 226, 0.7)",
                      marginTop: 2,
                    }}
                  >
                    Karolinska trained  /  15+ years in primary care
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Biomarkers - tall */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.22, ease: EASE }}
            style={{
              gridColumn: "span 2",
              gridRow: "span 2",
              position: "relative",
              background: C.ink,
              borderRadius: 24,
              padding: 32,
              overflow: "hidden",
              color: C.cream,
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.amberSoft,
                marginBottom: 16,
              }}
            >
              Pillar 02  /  Biomarkers
            </div>
            <h3
              style={{
                fontSize: 28,
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.02em",
                color: C.cream,
                lineHeight: 1.1,
                marginBottom: 22,
              }}
            >
              40+ markers, every draw.
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                ["HbA1c", "38"],
                ["Glucose", "5.8"],
                ["LDL", "2.9"],
                ["HDL", "1.6"],
                ["ApoB", "0.74"],
                ["hs-CRP", "0.8"],
                ["fP-insulin", "7.2"],
                ["Omega-3", "6.1"],
                ["Vit D", "48"],
                ["Ferritin", "76"],
                ["TSH", "2.1"],
                ["eGFR", "96"],
              ].map(([n, v]) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "rgba(245, 239, 226, 0.05)",
                    borderRadius: 8,
                    border: "1px solid rgba(245, 239, 226, 0.08)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(245, 239, 226, 0.7)",
                    }}
                  >
                    {n}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: C.cream,
                      fontWeight: 500,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. Research-backed science */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.28, ease: EASE }}
            style={{
              gridColumn: "span 3",
              position: "relative",
              background: C.paper,
              border: `1px solid ${C.line}`,
              borderRadius: 24,
              padding: 32,
              boxShadow: C.shadowSm,
              minHeight: 260,
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.amber,
                marginBottom: 16,
              }}
            >
              Pillar 03  /  Scientific backing
            </div>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.02em",
                color: C.ink,
                lineHeight: 1.12,
                marginBottom: 20,
              }}
            >
              Peer-reviewed risk models, not vibes.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "FINDRISC", cite: "Lindstrom & Tuomilehto, 2003" },
                { name: "SCORE2", cite: "European Heart Journal, 2021" },
                { name: "FRAX", cite: "Kanis, 2008" },
                { name: "UKPDS", cite: "Turner, Lancet, 1998" },
              ].map((m) => (
                <div
                  key={m.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: C.creamSoft,
                    borderRadius: 10,
                    border: `1px solid ${C.lineSoft}`,
                  }}
                >
                  <span style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>
                    {m.name}
                  </span>
                  <span style={{ fontSize: 11, color: C.inkMuted }}>
                    {m.cite}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 4. Active coaching */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.34, ease: EASE }}
            style={{
              gridColumn: "span 3",
              position: "relative",
              background: C.amber,
              borderRadius: 24,
              padding: 36,
              overflow: "hidden",
              color: C.ink,
              minHeight: 260,
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: "rgba(20,18,14,0.6)",
                marginBottom: 16,
              }}
            >
              Pillar 04  /  Active coaching
            </div>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.02em",
                color: C.ink,
                lineHeight: 1.12,
                marginBottom: 12,
              }}
            >
              Your training plan knows your insulin response.
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(20,18,14,0.75)",
                margin: 0,
                maxWidth: 460,
              }}
            >
              An assigned coach builds a strength + zone-2 programme from your
              metabolic markers. Real exercises. Real weights. Updated every
              time your blood is re-read.
            </p>
            <div
              style={{
                marginTop: 22,
                padding: "12px 18px",
                background: "rgba(14,18,14,0.12)",
                borderRadius: 100,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontSize: 12,
                color: "rgba(20,18,14,0.8)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.ink,
                }}
              />
              Week 12  /  Metabolic focus
            </div>
          </motion.div>

          {/* 5. Secure / Swedish */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            style={{
              gridColumn: "span 3",
              position: "relative",
              background: C.sageWash,
              borderRadius: 24,
              padding: 32,
              overflow: "hidden",
              color: C.sageDeep,
              minHeight: 220,
              border: `1px solid ${C.sageSoft}`,
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.sage,
                marginBottom: 14,
              }}
            >
              Pillar 05  /  Built in Sweden
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.02em",
                color: C.sageDeep,
                lineHeight: 1.14,
                marginBottom: 16,
              }}
            >
              BankID, 1177 import, FHIR export.
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: C.sageDeep,
                margin: 0,
                maxWidth: 380,
                opacity: 0.85,
              }}
            >
              Signed in with BankID. Imports your 1177 history with consent.
              Everything stored on Swedish servers. FHIR-compliant export so
              your data is never locked in.
            </p>
          </motion.div>

          {/* 6. AI assistant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.46, ease: EASE }}
            style={{
              gridColumn: "span 3",
              position: "relative",
              background: C.paper,
              border: `1px solid ${C.line}`,
              borderRadius: 24,
              padding: 32,
              boxShadow: C.shadowSm,
              minHeight: 220,
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.amber,
                marginBottom: 14,
              }}
            >
              Pillar 06  /  AI assistant
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.02em",
                color: C.ink,
                lineHeight: 1.14,
                marginBottom: 16,
              }}
            >
              Ask your own data anything.
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 10,
              }}
            >
              <div
                style={{
                  alignSelf: "flex-end",
                  padding: "10px 14px",
                  background: C.ink,
                  color: C.cream,
                  borderRadius: 14,
                  borderBottomRightRadius: 4,
                  fontSize: 13,
                  maxWidth: "80%",
                }}
              >
                Why is my glucose rising?
              </div>
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  background: C.creamSoft,
                  color: C.inkSoft,
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  fontSize: 13,
                  maxWidth: "90%",
                  border: `1px solid ${C.lineSoft}`,
                }}
              >
                Over 5 years it&apos;s risen 0.8 mmol/L. Slowly, but in one
                direction. Combined with your mother&apos;s T2D...
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-mosaic) {
            grid-template-columns: 1fr !important;
          }
          :global(.home13-mosaic > *) {
            grid-column: auto !important;
            grid-row: auto !important;
            min-height: 260px;
          }
        }
      `}</style>
    </section>
  );
}
