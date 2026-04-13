"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, IMG } from "./tokens";

/**
 * WHAT YOU GET - The 5 pillars elaborated, each as a warm product card
 * with imagery, label, detail list. Asymmetric layout - hero card on the
 * left (science), four supporting cards on the right.
 *
 * Explicit subscription framing: each card says what you get as a member.
 */
export function WhatYouGet() {
  return (
    <section
      id="whatyouget"
      style={{
        background: C.canvas,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 60,
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.terracotta,
                marginBottom: 16,
              }}
            >
              Five pillars, one membership
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
              style={{
                fontSize: "clamp(36px, 4.4vw, 60px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                fontWeight: 600,
                color: C.ink,
                margin: 0,
                maxWidth: 820,
              }}
            >
              What&apos;s inside the kit,{" "}
              <span
                style={{
                  color: C.terracotta,
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                in detail.
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 14,
              color: C.inkMuted,
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            Everything in every membership tier. Plus and Starter differ only
            in panel frequency and doctor priority.
          </motion.div>
        </div>

        {/* Mosaic */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gridAutoRows: "minmax(260px, auto)",
            gap: 20,
          }}
          className="home17-pillars-grid"
        >
          {/* HERO card - Scientific research */}
          <Card
            span={{ col: 1, row: 2 }}
            bg={C.ink}
            textColor={C.canvasSoft}
            subtleColor="rgba(251,247,240,0.62)"
            eyebrowColor={C.butter}
            eyebrow="01 / SCIENCE"
            title="Validated clinical risk models."
            body="Your profile runs on the same models Swedish GPs trust: FINDRISC, SCORE2, FRAX. Plus UKPDS, SDPP and DPP as secondary checks."
            bullets={[
              "FINDRISC (Lindstrom & Tuomilehto, 2003)",
              "SCORE2 (Working Group, 2021)",
              "FRAX (Kanis, 2008)",
              "SDPP (Carlsson, 2024)",
            ]}
            image={null}
            extra={
              <div
                style={{
                  marginTop: 32,
                  padding: 20,
                  background: "rgba(251,247,240,0.05)",
                  borderRadius: 14,
                  border: "1px solid rgba(251,247,240,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: C.butter,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Your profile
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(251,247,240,0.4)",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    3 models
                  </span>
                </div>
                {[
                  { label: "Diabetes / FINDRISC", val: "12/26" },
                  { label: "Heart / SCORE2", val: "3%" },
                  { label: "Bone / FRAX", val: "4%" },
                ].map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom:
                        i === 2 ? "none" : "1px solid rgba(251,247,240,0.08)",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "rgba(251,247,240,0.75)" }}>
                      {r.label}
                    </span>
                    <span
                      style={{
                        color: C.canvasSoft,
                        fontWeight: 600,
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>
            }
          />

          {/* Biomarkers card - photo */}
          <Card
            bg={C.paper}
            textColor={C.ink}
            subtleColor={C.inkMuted}
            eyebrowColor={C.terracotta}
            eyebrow="02 / BIOMARKERS"
            title="40+ markers tracked."
            body="Not just cholesterol. HbA1c, ApoB, Omega-3, Vitamin D, TSH, hs-CRP, fP-insulin, eGFR - the full metabolic picture."
            image={IMG.lab}
            border
          />

          {/* Doctor card - photo */}
          <Card
            bg={C.paper}
            textColor={C.ink}
            subtleColor={C.inkMuted}
            eyebrowColor={C.terracotta}
            eyebrow="03 / DOCTOR"
            title="Your personal GP."
            body="Dr. Marcus Johansson, Karolinska-trained, 15 years primary care. Messages answered within 24 hours. He knows your story."
            image={IMG.doctor}
            border
          />

          {/* Coaching card */}
          <Card
            bg={C.terracotta}
            textColor={C.canvasSoft}
            subtleColor="rgba(251,247,240,0.78)"
            eyebrowColor="rgba(251,247,240,0.72)"
            eyebrow="04 / COACHING"
            title="Active coaching plan."
            body="A certified coach builds your training around your numbers. Real exercises, not generic 'move more'. Weekly check-ins."
            image={null}
          />

          {/* Living profile */}
          <Card
            bg={C.sageTint}
            textColor={C.ink}
            subtleColor={C.inkMuted}
            eyebrowColor={C.sageDeep}
            eyebrow="05 / LIVING PROFILE"
            title="Updates with every test."
            body="Four panels a year. Your trajectory is visible, not just the latest number. 10-year projections update too."
            image={null}
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home17-pillars-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
          :global(.home17-pillars-grid > :first-child) {
            grid-column: 1 / -1 !important;
            grid-row: auto !important;
          }
        }
        @media (max-width: 640px) {
          :global(.home17-pillars-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function Card({
  span,
  bg,
  textColor,
  subtleColor,
  eyebrowColor,
  eyebrow,
  title,
  body,
  bullets,
  image,
  extra,
  border,
}: {
  span?: { col?: number; row?: number };
  bg: string;
  textColor: string;
  subtleColor: string;
  eyebrowColor: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  image?: string | null;
  extra?: React.ReactNode;
  border?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: span?.col ? `span ${span.col}` : undefined,
        gridRow: span?.row ? `span ${span.row}` : undefined,
        background: bg,
        borderRadius: 24,
        overflow: "hidden",
        border: border ? `1px solid ${C.lineCard}` : "1px solid transparent",
        boxShadow: border ? C.shadowCard : C.shadowSoft,
        display: "flex",
        flexDirection: "column",
        minHeight: 280,
      }}
    >
      {image && (
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 10",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: eyebrowColor,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
        <h3
          style={{
            fontSize: 22,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            fontWeight: 600,
            color: textColor,
            margin: 0,
            marginBottom: 12,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: subtleColor,
            margin: 0,
          }}
        >
          {body}
        </p>
        {bullets && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "16px 0 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  fontSize: 12,
                  color: subtleColor,
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.02em",
                }}
              >
                / {b}
              </li>
            ))}
          </ul>
        )}
        {extra}
      </div>
    </motion.div>
  );
}
