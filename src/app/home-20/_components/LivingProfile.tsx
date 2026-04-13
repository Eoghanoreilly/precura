"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * LIVING PROFILE - "Not a report. A living profile."
 *
 * A wide editorial section showing what the living profile IS: one canvas
 * with 22 biomarkers, risk scores, and a doctor note area. No hard 3D,
 * no cinematic - just warm cards, real numbers, warm ink.
 */

const MARKERS = [
  { name: "Fasting glucose", val: "5.8", unit: "mmol/L", status: "caution", trend: [5.0, 5.2, 5.4, 5.6, 5.8] },
  { name: "HbA1c", val: "38", unit: "mmol/mol", status: "ok", trend: [34, 35, 36, 37, 38] },
  { name: "LDL cholesterol", val: "2.9", unit: "mmol/L", status: "ok", trend: [3.1, 3.0, 3.0, 2.9, 2.9] },
  { name: "HDL", val: "1.6", unit: "mmol/L", status: "good", trend: [1.5, 1.5, 1.6, 1.6, 1.6] },
  { name: "Triglycerides", val: "1.1", unit: "mmol/L", status: "ok", trend: [1.2, 1.2, 1.1, 1.1, 1.1] },
  { name: "Vitamin D", val: "38", unit: "nmol/L", status: "low", trend: [45, 42, 40, 39, 38] },
  { name: "hs-CRP", val: "0.9", unit: "mg/L", status: "ok", trend: [1.0, 1.0, 0.9, 0.9, 0.9] },
  { name: "TSH", val: "2.1", unit: "mIU/L", status: "good", trend: [2.0, 2.0, 2.1, 2.1, 2.1] },
];

export function LivingProfile() {
  return (
    <section
      style={{
        background: C.cream,
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
            marginBottom: 56,
          }}
          className="home20-lp-header"
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
              Your profile
            </div>
            <h2 style={{ ...TYPE.displayL, margin: 0 }}>
              Not a report.{" "}
              <span style={{ color: C.terra, fontStyle: "italic", fontWeight: 600 }}>
                A living profile.
              </span>
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
            Reports go in folders. Your Precura profile updates every time
            you test. Twenty-two markers, three risk models, one canvas.
          </p>
        </motion.div>

        {/* Mock living profile window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            borderRadius: 28,
            background: C.paper,
            border: `1px solid ${C.lineFaint}`,
            boxShadow: C.shadowLift,
            overflow: "hidden",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 20px",
              borderBottom: `1px solid ${C.lineFaint}`,
              background: C.creamSoft,
            }}
          >
            <span
              style={{ width: 10, height: 10, borderRadius: 50, background: "#F0A072" }}
            />
            <span
              style={{ width: 10, height: 10, borderRadius: 50, background: "#F0D175" }}
            />
            <span
              style={{ width: 10, height: 10, borderRadius: 50, background: "#A8C490" }}
            />
            <div
              style={{
                marginLeft: 14,
                ...TYPE.mono,
                color: C.inkMuted,
              }}
            >
              precura.se / anna / profile
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr",
              gap: 0,
            }}
            className="home20-lp-body"
          >
            {/* LEFT - Risk summary */}
            <div
              style={{
                padding: 32,
                borderRight: `1px solid ${C.lineFaint}`,
                background: C.creamSoft,
              }}
              className="home20-lp-left"
            >
              <div
                style={{
                  ...TYPE.tiny,
                  color: C.inkFaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Member
              </div>
              <div
                style={{
                  ...TYPE.h3,
                  fontWeight: 600,
                  color: C.ink,
                  marginBottom: 2,
                }}
              >
                Anna Bergstrom
              </div>
              <div
                style={{
                  ...TYPE.small,
                  color: C.inkMuted,
                  marginBottom: 28,
                }}
              >
                Age 40 / Stockholm / Since Jan 2026
              </div>

              <div
                style={{
                  ...TYPE.tiny,
                  color: C.inkFaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                10-year risk
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Diabetes (FINDRISC)", val: "17%", risk: "moderate", color: C.terra, pos: 0.58 },
                  { label: "Cardiovascular (SCORE2)", val: "3%", risk: "low", color: C.sage, pos: 0.22 },
                  { label: "Bone fracture (FRAX)", val: "4%", risk: "low", color: C.sage, pos: 0.15 },
                ].map((r, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ ...TYPE.small, color: C.inkSoft, fontWeight: 500 }}>
                        {r.label}
                      </div>
                      <div
                        style={{
                          ...TYPE.small,
                          fontWeight: 600,
                          color: r.color,
                        }}
                      >
                        {r.val}
                      </div>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        height: 6,
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${C.sage} 0%, ${C.butter} 50%, ${C.terra} 100%)`,
                        opacity: 0.5,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: `${r.pos * 100}%`,
                          top: -3,
                          width: 12,
                          height: 12,
                          borderRadius: 50,
                          background: C.paper,
                          border: `2px solid ${r.color}`,
                          transform: "translateX(-50%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 32,
                  padding: 16,
                  background: C.paper,
                  borderRadius: 14,
                  border: `1px solid ${C.lineFaint}`,
                }}
              >
                <div
                  style={{
                    ...TYPE.tiny,
                    color: C.terra,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  Note from Dr. Marcus
                </div>
                <p
                  style={{
                    ...TYPE.small,
                    color: C.inkSoft,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  "Your glucose trend warrants attention. Let's retest in six
                  months and talk about vitamin D supplementation at your next
                  call."
                </p>
              </div>
            </div>

            {/* RIGHT - Marker grid */}
            <div style={{ padding: 32 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    ...TYPE.tiny,
                    color: C.inkFaint,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  22 biomarkers / showing 8
                </div>
                <div
                  style={{
                    ...TYPE.tiny,
                    color: C.sageDeep,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Updated 12 Mar 2026
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
                className="home20-lp-markers"
              >
                {MARKERS.map((m, i) => (
                  <MarkerCell key={i} m={m} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-lp-header) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          :global(.home20-lp-body) {
            grid-template-columns: 1fr !important;
          }
          :global(.home20-lp-left) {
            border-right: none !important;
            border-bottom: 1px solid ${C.lineFaint};
          }
        }
        @media (max-width: 640px) {
          :global(.home20-lp-markers) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function MarkerCell({
  m,
}: {
  m: { name: string; val: string; unit: string; status: string; trend: number[] };
}) {
  const color =
    m.status === "caution" || m.status === "low"
      ? C.terra
      : m.status === "good"
      ? C.sage
      : C.inkSoft;

  const w = 80;
  const h = 28;
  const pad = 3;
  const min = Math.min(...m.trend) * 0.96;
  const max = Math.max(...m.trend) * 1.04;
  const pts = m.trend.map((v, i) => ({
    x: pad + (i / (m.trend.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2),
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  return (
    <div
      style={{
        padding: "14px 16px",
        background: C.creamSoft,
        borderRadius: 14,
        border: `1px solid ${C.lineFaint}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            ...TYPE.tiny,
            color: C.inkMuted,
            fontWeight: 500,
            letterSpacing: "0",
            textTransform: "none",
          }}
        >
          {m.name}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color,
            letterSpacing: "-0.01em",
          }}
        >
          {m.val}{" "}
          <span
            style={{
              fontSize: 11,
              color: C.inkFaint,
              fontWeight: 400,
            }}
          >
            {m.unit}
          </span>
        </div>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.4" fill={color} />
      </svg>
    </div>
  );
}
