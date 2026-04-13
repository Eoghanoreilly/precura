"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  BookMarked,
  Stethoscope,
  Dumbbell,
  Activity,
} from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS, IMG } from "./tokens";

/**
 * WHAT YOU GET (deeper)
 *
 * 5 pillar cards in an asymmetric grid. Each card has a clear subtitle,
 * description, and one concrete example to ground it. Airbnb-warm feel:
 * rounded corners, soft shadow, small preview visuals instead of icons alone.
 */
export function WhatYouGet() {
  return (
    <section
      id="what-you-get"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 48,
            maxWidth: 820,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: COLORS.sageSoft,
              color: COLORS.sage,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              alignSelf: "flex-start",
            }}
          >
            What you get
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4.8vw, 58px)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.028em",
            }}
          >
            Five things, in every{" "}
            <span style={{ color: COLORS.coral }}>annual membership.</span>
          </h2>
        </motion.div>

        {/* Mosaic */}
        <div
          className="home16-wyg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "minmax(220px, auto)",
            gap: 20,
          }}
        >
          {/* Card 1 - Blood tests (large, spans 4) */}
          <MosaicCard
            span={4}
            accent={COLORS.coral}
            accentSoft={COLORS.coralTint}
            icon={FlaskConical}
            eyebrow="01 / Biomarker driven"
            title="40+ biomarkers, tracked across every panel you ever take"
            body="Fasting glucose, HbA1c, LDL-C, ApoB, HDL, triglycerides, hs-CRP, fP-insulin, Omega-3 index, Vitamin D, ferritin, TSH, creatinine, eGFR and more. Every panel stacks on top of your history."
            extra={
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 18,
                }}
              >
                {[
                  "Glucose",
                  "HbA1c",
                  "LDL-C",
                  "ApoB",
                  "hs-CRP",
                  "Omega-3",
                  "Vit D",
                  "TSH",
                  "eGFR",
                ].map((m) => (
                  <span
                    key={m}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: COLORS.bgCream,
                      color: COLORS.inkSoft,
                      fontSize: 12,
                      fontWeight: 500,
                      border: `1px solid ${COLORS.line}`,
                    }}
                  >
                    {m}
                  </span>
                ))}
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: COLORS.coralTint,
                    color: COLORS.coralDeep,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  +31 more
                </span>
              </div>
            }
          />

          {/* Card 2 - Science backed (spans 2, image) */}
          <MosaicCard
            span={2}
            accent={COLORS.sage}
            accentSoft={COLORS.sageSoft}
            icon={BookMarked}
            eyebrow="02 / Science backed"
            title="Risk models used by actual cardiologists"
            body="FINDRISC, SCORE2, FRAX, SDPP. All peer-reviewed, all maintained, all yours inside the app."
            image={IMG.research}
          />

          {/* Card 3 - Doctor (spans 3) */}
          <MosaicCard
            span={3}
            accent={COLORS.coral}
            accentSoft={COLORS.coralTint}
            icon={Stethoscope}
            eyebrow="03 / Personal doctor"
            title="Dr. Marcus Johansson reviews every panel"
            body="Swedish GP, Karolinska-trained, 15+ years in primary care. Messages you with a plain-English note on every test, and answers within a day."
            extra={
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  background: COLORS.bgCream,
                  borderRadius: RADIUS.chip,
                  border: `1px solid ${COLORS.line}`,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${COLORS.coral}, ${COLORS.coralDeep})`,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  MJ
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: COLORS.inkSoft,
                      fontWeight: 500,
                      lineHeight: 1.45,
                    }}
                  >
                    &quot;Your glucose at 5.8 is in the upper normal range. Worth
                    watching. Let&apos;s retest in 6 months.&quot;
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 4 - Training (spans 3) */}
          <MosaicCard
            span={3}
            accent={COLORS.amber}
            accentSoft={COLORS.amberSoft}
            icon={Dumbbell}
            eyebrow="04 / Active coaching"
            title="A personal coach and training plan"
            body="Your coach builds a plan from your actual metabolic profile. Real exercises, sets, reps, weights. Updated every test when your markers move."
            extra={
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                }}
              >
                {[
                  { day: "Mon", block: "Upper body" },
                  { day: "Wed", block: "Lower + core" },
                  { day: "Fri", block: "Full + cardio" },
                ].map((d, i) => (
                  <div
                    key={d.day}
                    style={{
                      padding: "10px 12px",
                      borderRadius: RADIUS.chip,
                      background: i === 1 ? COLORS.amberSoft : COLORS.bgCream,
                      border: `1px solid ${
                        i === 1 ? COLORS.amberSoft : COLORS.line
                      }`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: COLORS.amber,
                        marginBottom: 2,
                      }}
                    >
                      {d.day}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.inkSoft,
                        fontWeight: 500,
                      }}
                    >
                      {d.block}
                    </div>
                  </div>
                ))}
              </div>
            }
          />

          {/* Card 5 - Living profile (spans 6) */}
          <MosaicCard
            span={6}
            accent={COLORS.sage}
            accentSoft={COLORS.sageSoft}
            icon={Activity}
            eyebrow="05 / Living profile"
            title="A health profile that updates every test, every message"
            body="Not a PDF. A continuously evolving record of who you are, what&apos;s changed and what to do about it, all in one place."
            horizontal
            extra={
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {[
                  "Risk models",
                  "Biomarker trends",
                  "Messages",
                  "Training log",
                  "Nutrition",
                  "Family history",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: COLORS.sageSoft,
                      color: COLORS.sage,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            }
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-wyg-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home16-wyg-card) {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------

interface MosaicCardProps {
  span: number;
  accent: string;
  accentSoft: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  eyebrow: string;
  title: string;
  body: string;
  extra?: React.ReactNode;
  image?: string;
  horizontal?: boolean;
}

function MosaicCard({
  span,
  accent,
  accentSoft,
  icon: Icon,
  eyebrow,
  title,
  body,
  extra,
  image,
  horizontal,
}: MosaicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="home16-wyg-card"
      style={{
        gridColumn: `span ${span}`,
        background: COLORS.bgPaper,
        borderRadius: RADIUS.cardLarge,
        border: `1px solid ${COLORS.line}`,
        boxShadow: COLORS.shadowSoft,
        padding: image ? 0 : "32px 34px",
        overflow: "hidden",
        display: horizontal ? "grid" : "block",
        gridTemplateColumns: horizontal ? "1.1fr 0.9fr" : undefined,
        gap: horizontal ? 40 : 0,
      }}
    >
      {image && (
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(28,26,22,0) 40%, rgba(28,26,22,0.65) 100%)",
            }}
          />
          <div style={{ position: "absolute", left: 18, top: 18 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 11px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                color: accent,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              <Icon size={12} style={{ color: accent }} />
              {eyebrow}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 18,
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        </div>
      )}

      {!image && (
        <div style={{ padding: horizontal ? "32px 34px" : 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: accentSoft,
              color: accent,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <Icon size={13} style={{ color: accent }} />
            {eyebrow}
          </div>
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: COLORS.ink,
              maxWidth: 560,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.6,
              color: COLORS.inkSoft,
              maxWidth: 640,
            }}
          >
            {body}
          </p>
        </div>
      )}

      {image && (
        <div style={{ padding: "24px 26px 28px" }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.55,
              color: COLORS.inkSoft,
            }}
          >
            {body}
          </p>
        </div>
      )}

      {extra && (
        <div
          style={{
            padding:
              image || horizontal
                ? "0 34px 30px 34px"
                : "0",
          }}
        >
          {extra}
        </div>
      )}
    </motion.div>
  );
}
