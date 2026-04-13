"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * LIVING PROFILE - "Not a report. A living profile."
 * Large dark-cream statement section with a big visual mock of a live
 * Precura profile. The mock is composed of real markers and a gradient
 * zone bar + sparklines. Contrasts the hero's airy booking widget.
 */
export function LivingProfile() {
  return (
    <section
      style={{
        background: C.ink,
        color: C.paper,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: 800,
            marginBottom: 64,
          }}
        >
          <div
            style={{
              ...TYPE.label,
              color: C.lingon,
              marginBottom: 20,
            }}
          >
            Your profile, not a PDF
          </div>
          <h2
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              marginBottom: 20,
              color: C.paper,
            }}
          >
            Not a report.{" "}
            <span style={{ color: C.lingon, fontStyle: "italic" }}>
              A living profile.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: "rgba(255,255,255,0.72)",
              margin: 0,
              maxWidth: 620,
            }}
          >
            Every test updates the same place. Zone bars tell you where you
            sit. Trendlines show you the direction of travel. A doctor's note
            tells you what to do about it.
          </p>
        </motion.div>

        {/* Profile mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: C.paper,
            color: C.ink,
            borderRadius: 28,
            padding: 40,
            boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          }}
        >
          {/* Profile header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: `1px solid ${C.inkHair}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `linear-gradient(145deg, ${C.lingon}, ${C.lingonDeep})`,
                  color: C.paper,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                AB
              </div>
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Anna Bergstrom
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: C.inkMuted,
                  }}
                >
                  Member since Jan 2026 / Last panel 27 Mar 2026
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "8px 14px",
                background: C.eucBg,
                color: C.euc,
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.euc,
                }}
              />
              Profile live
            </div>
          </div>

          {/* Risk row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              marginBottom: 32,
            }}
            className="home18-risk-grid"
          >
            <RiskTile
              model="FINDRISC"
              label="Diabetes (type 2)"
              value="17%"
              note="10-year risk / moderate"
              position={0.55}
              color={C.amberDeep}
            />
            <RiskTile
              model="SCORE2"
              label="Cardiovascular"
              value="3%"
              note="10-year risk / low-moderate"
              position={0.28}
              color={C.amberDeep}
            />
            <RiskTile
              model="FRAX"
              label="Bone health"
              value="4%"
              note="10-year risk / low"
              position={0.15}
              color={C.euc}
            />
          </div>

          {/* Biomarker row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr",
              gap: 20,
            }}
            className="home18-marker-grid"
          >
            {/* Biomarker list */}
            <div
              style={{
                background: C.canvas,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${C.inkLine}`,
              }}
            >
              <div
                style={{
                  ...TYPE.label,
                  color: C.inkMuted,
                  marginBottom: 16,
                }}
              >
                Key biomarkers / latest panel
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <MarkerRow
                  name="Fasting glucose"
                  value="5.8"
                  unit="mmol/L"
                  status="borderline"
                />
                <MarkerRow
                  name="HbA1c (long-term sugar)"
                  value="38"
                  unit="mmol/mol"
                  status="normal"
                />
                <MarkerRow
                  name="Total cholesterol"
                  value="5.1"
                  unit="mmol/L"
                  status="borderline"
                />
                <MarkerRow
                  name="HDL (good cholesterol)"
                  value="1.6"
                  unit="mmol/L"
                  status="normal"
                />
                <MarkerRow
                  name="LDL (bad cholesterol)"
                  value="2.9"
                  unit="mmol/L"
                  status="normal"
                />
                <MarkerRow
                  name="Vitamin D"
                  value="48"
                  unit="nmol/L"
                  status="borderline"
                />
              </div>
            </div>

            {/* Doctor note */}
            <div
              style={{
                background: C.cream,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${C.inkLine}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  ...TYPE.label,
                  color: C.inkMuted,
                  marginBottom: 12,
                }}
              >
                Doctor note / 27 Mar
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(145deg, ${C.euc}, ${C.eucSoft})`,
                    color: C.paper,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  MJ
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Dr. Marcus Johansson
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.inkMuted,
                    }}
                  >
                    Internal medicine
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: C.inkSoft,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                "Your glucose has crept up for five years. Time to act. Start
                20-minute walks after dinner, 2000 IU vitamin D daily. I'll
                retest you in six months."
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          :global(.home18-risk-grid),
          :global(.home18-marker-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function RiskTile({
  model,
  label,
  value,
  note,
  position,
  color,
}: {
  model: string;
  label: string;
  value: string;
  note: string;
  position: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: C.canvas,
        borderRadius: 18,
        padding: 24,
        border: `1px solid ${C.inkLine}`,
      }}
    >
      <div
        style={{
          ...TYPE.label,
          color: C.inkMuted,
          marginBottom: 8,
        }}
      >
        {model}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: C.ink,
          marginBottom: 14,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: color,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: C.inkMuted,
          marginBottom: 14,
        }}
      >
        {note}
      </div>
      {/* zone bar */}
      <div
        style={{
          position: "relative",
          height: 6,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.good} 0%, ${C.amber} 55%, ${C.risk} 100%)`,
          opacity: 0.55,
        }}
      >
        <motion.div
          initial={{ left: "0%" }}
          whileInView={{ left: `${position * 100}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: -3,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: C.paper,
            border: `2px solid ${C.ink}`,
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </div>
  );
}

function MarkerRow({
  name,
  value,
  unit,
  status,
}: {
  name: string;
  value: string;
  unit: string;
  status: "normal" | "borderline" | "abnormal";
}) {
  const color =
    status === "normal"
      ? C.euc
      : status === "borderline"
        ? C.amberDeep
        : C.risk;
  const label =
    status === "normal"
      ? "Normal"
      : status === "borderline"
        ? "Borderline"
        : "Abnormal";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: C.ink,
          fontWeight: 500,
          flex: 1,
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600 }}>{value}</span>
        <span style={{ fontSize: 11, color: C.inkMuted }}>{unit}</span>
      </div>
      <div
        style={{
          padding: "3px 9px",
          borderRadius: 100,
          background: `${color}15`,
          color,
          fontSize: 11,
          fontWeight: 600,
          minWidth: 72,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}
