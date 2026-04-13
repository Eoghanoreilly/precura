"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  Sparkles,
  Clock,
  FileText,
} from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS } from "./tokens";

/**
 * NOT A REPORT. A LIVING PROFILE.
 *
 * Contrast section. Left column: what you DON'T get (static PDF).
 * Right column: what you DO get (living profile, always on).
 * Warm cream backdrop. No unicode arrows.
 */
export function LivingProfile() {
  const staticRow = [
    "One-off PDF, never updated",
    "Numbers without context",
    "No trend across years",
    "No doctor signature on what it means",
    "You search Google for what to do",
  ];

  const livingRow = [
    {
      icon: Clock,
      label: "Updated every test, every message",
    },
    {
      icon: TrendingDown,
      label: "Every marker plotted across every test you&apos;ve ever taken",
    },
    {
      icon: Sparkles,
      label: "Validated risk models refreshed after each panel",
    },
    {
      icon: FileText,
      label: "Plain-English note from Dr. Marcus on every panel",
    },
  ];

  return (
    <section
      id="living-profile"
      style={{
        background: COLORS.bgSoft,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 140px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 820, marginBottom: 60 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: COLORS.coralTint,
              color: COLORS.coralDeep,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Why it feels different
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4.8vw, 58px)",
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
            }}
          >
            Not a report.{" "}
            <span style={{ color: COLORS.coral, fontStyle: "italic" }}>
              A living profile.
            </span>
          </h2>
          <p
            style={{
              margin: "22px 0 0",
              fontSize: 19,
              lineHeight: 1.6,
              color: COLORS.inkSoft,
              maxWidth: 700,
            }}
          >
            A regular blood test gives you a PDF. Precura gives you a health
            twin that evolves every time you test, every time your doctor
            writes, every time a marker moves.
          </p>
        </motion.div>

        <div
          className="home16-living-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 28,
          }}
        >
          {/* Static PDF column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            style={{
              background: COLORS.bgPaper,
              borderRadius: RADIUS.cardLarge,
              border: `1px solid ${COLORS.line}`,
              padding: "34px 32px",
              boxShadow: COLORS.shadowSoft,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.inkMuted,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              The old way
            </div>
            <h3
              style={{
                margin: "0 0 20px",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: COLORS.inkSoft,
              }}
            >
              A static PDF from a lab
            </h3>

            {/* Mock PDF preview */}
            <div
              style={{
                background: COLORS.bgSoft,
                borderRadius: RADIUS.chip,
                padding: "18px 20px",
                marginBottom: 24,
                opacity: 0.7,
                border: `1px solid ${COLORS.lineSoft}`,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: "60%",
                  background: COLORS.line,
                  borderRadius: 4,
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  height: 4,
                  width: "80%",
                  background: COLORS.lineSoft,
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 4,
                  width: "70%",
                  background: COLORS.lineSoft,
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 4,
                  width: "50%",
                  background: COLORS.lineSoft,
                  borderRadius: 4,
                }}
              />
            </div>

            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {staticRow.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontSize: 15,
                    color: COLORS.inkMuted,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      border: `1.5px solid ${COLORS.line}`,
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Living profile column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              background: `linear-gradient(135deg, ${COLORS.coral} 0%, ${COLORS.coralDeep} 100%)`,
              borderRadius: RADIUS.cardLarge,
              padding: "34px 32px",
              color: "#FFFFFF",
              boxShadow: "0 20px 60px rgba(232,90,79,0.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.82)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              The Precura way
            </div>
            <h3
              style={{
                margin: "0 0 20px",
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              A health twin
              <br />
              that grows with you
            </h3>

            {/* Mock profile preview */}
            <div
              style={{
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                borderRadius: RADIUS.chip,
                padding: "16px 18px",
                marginBottom: 22,
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: 0.9,
                  }}
                >
                  Anna&apos;s living profile
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.22)",
                  }}
                >
                  Updated 2h ago
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { label: "Glucose", value: "5.8" },
                  { label: "HbA1c", value: "38" },
                  { label: "LDL", value: "2.9" },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "8px 10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.75,
                        fontWeight: 500,
                      }}
                    >
                      {m.label}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {livingRow.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      fontSize: 15,
                      color: "#FFFFFF",
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <Icon size={13} style={{ color: "#FFFFFF" }} />
                    </span>
                    <span
                      dangerouslySetInnerHTML={{ __html: item.label }}
                    />
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-living-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
