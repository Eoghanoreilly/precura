"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * ANNA'S STORY - editorial two-column with a portrait, a narrative timeline,
 * and a small glucose trajectory chart inline. Warm, human, no cinematic.
 */

const GLUCOSE = [
  { year: "2021", val: 5.0, age: 35 },
  { year: "2022", val: 5.2, age: 36 },
  { year: "2023", val: 5.4, age: 37 },
  { year: "2024", val: 5.6, age: 38 },
  { year: "2025", val: 5.8, age: 39 },
];

export function AnnaStory() {
  return (
    <section
      style={{
        background: C.cream,
        padding: "140px 32px 140px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.95fr 1.05fr",
          gap: 72,
          alignItems: "center",
        }}
        className="home20-anna-grid"
      >
        {/* Portrait + caption */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative" }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "4 / 5",
              backgroundImage: `url(${IMG.annaPortrait})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: C.shadowLift,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(22,21,18,0.75) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 24,
                color: C.creamSoft,
              }}
            >
              <div
                style={{
                  ...TYPE.mono,
                  color: C.terraSoft,
                  marginBottom: 6,
                }}
              >
                PRECURA MEMBER / AGE 40
              </div>
              <div
                style={{
                  ...TYPE.h3,
                  color: C.creamSoft,
                  margin: 0,
                }}
              >
                Anna Bergstrom
              </div>
              <div
                style={{
                  ...TYPE.small,
                  color: C.creamDeep,
                  marginTop: 2,
                }}
              >
                Product lead, Stockholm
              </div>
            </div>
          </div>

          {/* Floating chart card */}
          <div
            style={{
              position: "absolute",
              right: -24,
              bottom: -36,
              width: 280,
              background: C.paper,
              borderRadius: 18,
              padding: "18px 20px 16px",
              border: `1px solid ${C.lineFaint}`,
              boxShadow: C.shadowLift,
            }}
            className="home20-anna-chart"
          >
            <div
              style={{
                ...TYPE.tiny,
                color: C.inkMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Fasting glucose
            </div>
            <div
              style={{
                ...TYPE.h3,
                margin: 0,
                fontWeight: 600,
                color: C.ink,
              }}
            >
              5.0 &rsaquo; 5.8
            </div>
            <div
              style={{
                ...TYPE.small,
                color: C.terra,
                fontWeight: 500,
                marginBottom: 10,
              }}
            >
              over 5 years / mmol/L
            </div>
            <GlucoseSpark />
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              ...TYPE.mono,
              color: C.terra,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            A real member story
          </div>
          <h2
            style={{
              ...TYPE.displayL,
              margin: 0,
              marginBottom: 28,
            }}
          >
            Anna is 40. Her glucose has been climbing for five years. Nobody
            told her.
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              marginBottom: 20,
              maxWidth: 560,
            }}
          >
            Her mother was diagnosed with Type 2 diabetes at 58. Anna gets
            annual bloodwork at different clinics, pays out of pocket, and
            every clinician tells her the single reading is fine.
          </p>
          <p
            style={{
              ...TYPE.body,
              color: C.inkMuted,
              maxWidth: 560,
              marginBottom: 32,
            }}
          >
            Each of her glucose readings is in range, so no one flags it.
            But on one chart, the five year slope is obvious. When Anna
            joined Precura in January, Dr. Marcus wrote her a plain-English
            note the same week: we need to retest in six months and talk
            about vitamin D.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 14,
              maxWidth: 560,
            }}
          >
            {[
              { k: "FINDRISC diabetes score", v: "12 / 26 - moderate" },
              { k: "Family history", v: "Mother T2D at 58" },
              { k: "Vitamin D", v: "Low (38 nmol/L)" },
              { k: "Blood pressure", v: "Mild - on Enalapril" },
            ].map((it, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 16px",
                  background: C.paper,
                  border: `1px solid ${C.lineFaint}`,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    ...TYPE.tiny,
                    color: C.inkFaint,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  {it.k}
                </div>
                <div
                  style={{
                    ...TYPE.small,
                    color: C.ink,
                    fontWeight: 600,
                  }}
                >
                  {it.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 80px !important;
          }
          :global(.home20-anna-chart) {
            right: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

function GlucoseSpark() {
  const w = 240;
  const h = 52;
  const pad = 6;
  const min = 4.8;
  const max = 6.0;

  const points = GLUCOSE.map((g, i) => ({
    x: pad + (i / (GLUCOSE.length - 1)) * (w - pad * 2),
    y: h - pad - ((g.val - min) / (max - min)) * (h - pad * 2),
  }));

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const area =
    d + ` L ${points[points.length - 1].x.toFixed(1)} ${h} L ${points[0].x.toFixed(1)} ${h} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="annaSpark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.sage} />
          <stop offset="100%" stopColor={C.terra} />
        </linearGradient>
        <linearGradient id="annaSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.terra} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.terra} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#annaSparkFill)" />
      <path
        d={d}
        fill="none"
        stroke="url(#annaSpark)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="4"
        fill={C.terra}
      />
    </svg>
  );
}
