"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE } from "./tokens";

/**
 * LIVING PROFILE - "Not a report. A living profile."
 * Inspired by the spread from home-10 but treated as an editorial
 * mid-magazine double-page with a headline, deck, body and a sample
 * "profile card" rendered as print.
 */
export function LivingProfile() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      style={{
        position: "relative",
        background: C.paperSoft,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Chapter header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.rule}`,
            paddingBottom: 20,
            marginBottom: 80,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 05</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>The artifact</div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Feature / Double spread
          </div>
        </div>

        <div
          className="lp14-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Left: headline + body */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                ...TYPE.chapter,
                margin: 0,
                marginBottom: 40,
              }}
            >
              Not a report.
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 500 }}>
                A living profile.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 1.1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                ...TYPE.deck,
                margin: 0,
                marginBottom: 28,
                color: C.inkSoft,
                maxWidth: 520,
              }}
            >
              Every other health service hands you a static PDF and sends you
              home. Precura builds something alive: a health twin that updates
              with each draw, each doctor's note, each training block, each
              year.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 1.1,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.65,
                color: C.inkMuted,
                maxWidth: 520,
              }}
            >
              We stitch your 1177 history, your blood panels, your risk scores,
              your family history, your training logs, and your doctor's notes
              into one continuously updating record. You arrive to each
              appointment with context, not a stack of paper.
            </motion.p>

            {/* Sub-feature list */}
            <div
              style={{
                marginTop: 48,
                paddingTop: 32,
                borderTop: `2px solid ${C.ink}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                maxWidth: 540,
              }}
            >
              {[
                { k: "Updates", v: "Every 90 days" },
                { k: "Export", v: "FHIR bundle, one click" },
                { k: "Retention", v: "Yours forever" },
                { k: "Location", v: "Swedish servers" },
              ].map((item, i) => (
                <div key={i}>
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.inkMuted,
                      marginBottom: 4,
                    }}
                  >
                    {item.k}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the living profile artifact */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProfileArtifact />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.lp14-grid) {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Profile artifact - print-style dossier card
// =============================================================================
function ProfileArtifact() {
  return (
    <div
      style={{
        position: "relative",
        background: C.white,
        border: `1px solid ${C.ink}`,
        padding: 36,
        boxShadow: C.shadowLift,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: 18,
          borderBottom: `2px solid ${C.ink}`,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 8,
            }}
          >
            Precura / Profile dossier
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Bergstrom, Anna
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: C.inkFaint,
              marginTop: 6,
            }}
          >
            Age 40 / Stockholm / Since Jan 2026
          </div>
        </div>
        <div
          style={{
            ...TYPE.mono,
            color: C.rust,
            padding: "6px 10px",
            border: `1px solid ${C.rust}`,
            whiteSpace: "nowrap",
          }}
        >
          Live / v12
        </div>
      </div>

      {/* Three stat columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {[
          { k: "Diabetes", v: "17%", s: "FINDRISC", c: C.rust },
          { k: "Cardiovascular", v: "3%", s: "SCORE2", c: C.inkMuted },
          { k: "Bone", v: "<5%", s: "FRAX", c: C.sage },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              padding: 14,
              background: C.paperSoft,
              border: `1px solid ${C.ruleSoft}`,
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 4,
              }}
            >
              {r.s}
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.ink,
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              {r.k}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: r.c,
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
              }}
            >
              {r.v}
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.inkMuted,
                marginTop: 4,
              }}
            >
              10-year risk
            </div>
          </div>
        ))}
      </div>

      {/* Timeline strip */}
      <div
        style={{
          padding: "16px 0",
          borderTop: `1px solid ${C.rule}`,
          borderBottom: `1px solid ${C.rule}`,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 14,
          }}
        >
          Trajectory / Fasting glucose
        </div>
        <svg viewBox="0 0 400 60" style={{ width: "100%", height: 60 }}>
          <defs>
            <linearGradient id="lpLine" x1="0" x2="1">
              <stop offset="0" stopColor={C.sage} />
              <stop offset="1" stopColor={C.rust} />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="30"
            x2="400"
            y2="30"
            stroke={C.ruleSoft}
            strokeDasharray="2 3"
          />
          <path
            d="M 0 46 L 80 42 L 160 38 L 240 28 L 320 22 L 400 10"
            fill="none"
            stroke="url(#lpLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {[
            { x: 0, y: 46 },
            { x: 80, y: 42 },
            { x: 160, y: 38 },
            { x: 240, y: 28 },
            { x: 320, y: 22 },
            { x: 400, y: 10 },
          ].map((p, i) => (
            <circle
              key={i}
              cx={p.x === 0 ? 4 : p.x === 400 ? 396 : p.x}
              cy={p.y}
              r={3}
              fill={C.white}
              stroke={C.ink}
              strokeWidth={1.5}
            />
          ))}
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          {["2021", "2022", "2023", "2024", "2025", "2026"].map((y) => (
            <div
              key={y}
              style={{
                ...TYPE.mono,
                color: C.inkFaint,
                fontSize: 9,
              }}
            >
              {y}
            </div>
          ))}
        </div>
      </div>

      {/* Signal rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          {
            k: "Training",
            v: "Zone 2 cardio, 3x week",
            s: "Coach Lina",
          },
          {
            k: "Nutrition",
            v: "Carb-forward to fiber-forward",
            s: "Marker-aligned",
          },
          {
            k: "Doctor",
            v: "Retest flagged for October",
            s: "Marcus J.",
          },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "10px 0",
              borderBottom:
                i < 2 ? `1px solid ${C.ruleSoft}` : "1px solid transparent",
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkMuted,
                  marginBottom: 2,
                }}
              >
                {row.k}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: C.ink,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                }}
              >
                {row.v}
              </div>
            </div>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {row.s}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
