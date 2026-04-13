"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * BIOMARKER CAROUSEL - User-requested clickable carousel.
 *
 * Not an auto-sliding billboard. Eight biomarker deep-dives. Left rail lists
 * all eight with ticks. Click one, the right side cross-fades to show
 * its name, plain-English meaning, reference band, Anna's current value,
 * the five-year trajectory, and which risk model it feeds into.
 *
 * Users can use arrow keys once focused, click a marker in the rail,
 * or click the prev/next affordances beneath the card.
 */
export function BiomarkerCarousel() {
  const [active, setActive] = useState(0);
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  const go = (n: number) => {
    const next = (n + markers.length) % markers.length;
    setActive(next);
  };

  return (
    <section
      id="markers"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(active - 1);
        if (e.key === "ArrowRight") go(active + 1);
      }}
      tabIndex={0}
      style={{
        background: C.paper,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        outline: "none",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ marginBottom: 88, maxWidth: 900 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
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
                background: C.inkMuted,
                display: "inline-block",
              }}
            />
            Ch. 06 / The biomarkers / interactive
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              color: C.ink,
            }}
          >
            Eight biomarkers we read carefully.{" "}
            <span style={{ color: C.sage, fontStyle: "italic" }}>
              Click through them.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.lead,
              color: C.inkMuted,
              margin: "28px 0 0",
              maxWidth: 640,
            }}
          >
            A preview of the forty-plus markers in a full Precura panel. Every
            entry shows what it is, what it means, and how we watch it over
            years.
          </motion.p>
        </div>

        <div
          className="home11-carousel"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 56,
            alignItems: "flex-start",
            border: `1px solid ${C.inkHairlineStrong}`,
            borderRadius: 6,
            background: C.page,
            overflow: "hidden",
          }}
        >
          {/* Left: rail */}
          <div
            style={{
              padding: "28px 0",
              borderRight: `1px solid ${C.inkHairlineStrong}`,
              background: C.paperDeep,
              minHeight: 560,
            }}
            className="home11-carousel-rail"
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                padding: "0 28px 20px",
                borderBottom: `1px solid ${C.inkHairline}`,
              }}
            >
              Index / 08 markers
            </div>
            {markers.map((m, i) => (
              <button
                key={m.short}
                onClick={() => setActive(i)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 28px",
                  border: "none",
                  borderBottom:
                    i === markers.length - 1
                      ? "none"
                      : `1px solid ${C.inkHairline}`,
                  background: i === active ? C.page : "transparent",
                  cursor: "pointer",
                  fontFamily: SYSTEM_FONT,
                  color: i === active ? C.ink : C.inkMuted,
                  transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
                  position: "relative",
                }}
              >
                {/* Tick marker */}
                {i === active && (
                  <motion.div
                    layoutId="carousel-tick"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: C.sage,
                    }}
                  />
                )}
                <div
                  style={{
                    ...TYPE.mono,
                    color: i === active ? C.sage : C.inkFaint,
                    marginBottom: 4,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: i === active ? C.ink : C.inkMuted,
                  }}
                >
                  {m.short}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: i === active ? C.inkMuted : C.inkFaint,
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {m.plain}
                </div>
              </button>
            ))}
          </div>

          {/* Right: active marker panel */}
          <div
            style={{
              padding: "48px 56px 44px",
              position: "relative",
              minHeight: 560,
            }}
            className="home11-carousel-panel"
          >
            <AnimatePresence mode="wait">
              <MarkerPanel key={active} marker={markers[active]} />
            </AnimatePresence>

            {/* Prev / next */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 40,
                paddingTop: 24,
                borderTop: `1px solid ${C.inkHairlineStrong}`,
              }}
            >
              <div style={{ ...TYPE.mono, color: C.inkMuted }}>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(markers.length).padStart(2, "0")}
              </div>
              <div style={{ display: "flex", gap: 32 }}>
                <button
                  onClick={() => go(active - 1)}
                  style={navBtn}
                  aria-label="Previous marker"
                >
                  / Previous
                </button>
                <button
                  onClick={() => go(active + 1)}
                  style={navBtn}
                  aria-label="Next marker"
                >
                  Next /
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home11-carousel) {
            grid-template-columns: 1fr !important;
          }
          :global(.home11-carousel-rail) {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            min-height: auto !important;
            padding: 16px 0 !important;
            border-right: none !important;
            border-bottom: 1px solid ${C.inkHairlineStrong} !important;
          }
          :global(.home11-carousel-panel) {
            padding: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

const navBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: C.ink,
  fontFamily: SYSTEM_FONT,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: "-0.005em",
  cursor: "pointer",
  padding: 0,
};

const markers = [
  {
    short: "Fasting glucose",
    plain: "Sugar in your blood after a night without food",
    unit: "mmol/L",
    anna: 5.8,
    range: { lo: 4.0, hi: 5.6, min: 3.8, max: 7.2 },
    trend: [5.0, 5.1, 5.2, 5.4, 5.5, 5.8],
    feeds: "FINDRISC / diabetes",
    why:
      "The single clearest early signal of impaired glucose handling. A rising fasting glucose long before diabetes is one of the best early warnings primary care repeatedly misses, because each value looks normal in isolation.",
  },
  {
    short: "HbA1c",
    plain: "Long-term blood sugar, averaged over ~3 months",
    unit: "mmol/mol",
    anna: 38,
    range: { lo: 20, hi: 42, min: 16, max: 70 },
    trend: [32, 33, 34, 36, 37, 38],
    feeds: "FINDRISC / diabetes",
    why:
      "Where fasting glucose is a snapshot, HbA1c is the running average. It cannot hide a good-morning reading. Rising HbA1c with rising fasting glucose is a harder signal to argue with.",
  },
  {
    short: "LDL-C",
    plain: "Low density cholesterol, the main one doctors worry about",
    unit: "mmol/L",
    anna: 2.9,
    range: { lo: 0, hi: 3.0, min: 0, max: 6 },
    trend: [3.2, 3.1, 3.0, 2.95, 2.92, 2.9],
    feeds: "SCORE2 / cardiovascular",
    why:
      "LDL particles are the ones that accumulate in artery walls over decades. We track the number, but we also track ApoB, which is often a better proxy than LDL alone.",
  },
  {
    short: "ApoB",
    plain: "Count of atherogenic particles",
    unit: "g/L",
    anna: 0.92,
    range: { lo: 0, hi: 1.0, min: 0, max: 1.8 },
    trend: [1.05, 1.02, 0.98, 0.95, 0.93, 0.92],
    feeds: "SCORE2 / cardiovascular",
    why:
      "Every atherogenic particle carries one ApoB molecule, so ApoB counts the actual number of particles crashing into your artery walls. A better cardiovascular risk signal than LDL in many cases.",
  },
  {
    short: "hs-CRP",
    plain: "Inflammation in your blood, high-sensitivity",
    unit: "mg/L",
    anna: 1.1,
    range: { lo: 0, hi: 1.0, min: 0, max: 10 },
    trend: [0.8, 0.9, 0.95, 1.05, 1.15, 1.1],
    feeds: "SCORE2 / cardiovascular",
    why:
      "Chronic low-grade inflammation is a quiet companion of metabolic drift. We watch hs-CRP alongside glucose and ApoB because the three together tell a fuller story than any one alone.",
  },
  {
    short: "fP-insulin",
    plain: "Fasting insulin, early signal of insulin resistance",
    unit: "pmol/L",
    anna: 58,
    range: { lo: 15, hi: 50, min: 10, max: 200 },
    trend: [40, 44, 48, 52, 55, 58],
    feeds: "Custom / insulin resistance",
    why:
      "A body with rising insulin resistance compensates with more insulin, long before glucose moves. Watching fP-insulin is how you catch the metabolic story a full decade earlier.",
  },
  {
    short: "25-OH-D",
    plain: "Vitamin D, bone and immune signalling",
    unit: "nmol/L",
    anna: 48,
    range: { lo: 75, hi: 150, min: 20, max: 180 },
    trend: [42, 44, 46, 47, 48, 48],
    feeds: "FRAX / bone",
    why:
      "Swedish winters guarantee a vitamin D trough for most adults. We flag the trough and track supplementation so the correction is visible, not assumed.",
  },
  {
    short: "TSH",
    plain: "Thyroid signal, governs metabolism speed",
    unit: "mIU/L",
    anna: 2.1,
    range: { lo: 0.4, hi: 4.0, min: 0, max: 10 },
    trend: [1.8, 1.9, 2.0, 2.1, 2.1, 2.1],
    feeds: "Thyroid / systemic",
    why:
      "Thyroid drift mimics fatigue, weight change, low mood. Catching a subclinical hypothyroid pattern early means you rule out the right thing first and save six confused GP visits.",
  },
];

function MarkerPanel({ marker }: { marker: (typeof markers)[number] }) {
  const W = 540;
  const H = 180;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const { trend, range } = marker;
  const xFor = (i: number) =>
    padL + ((W - padL - padR) / (trend.length - 1)) * i;
  const yFor = (v: number) =>
    padT +
    (H - padT - padB) *
      (1 - (v - range.min) / (range.max - range.min));

  const path = trend
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              ...TYPE.mono,
              color: C.sage,
              marginBottom: 10,
            }}
          >
            Feeds {marker.feeds}
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 500,
              color: C.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {marker.short}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.inkMuted,
              marginTop: 8,
              maxWidth: 420,
            }}
          >
            {marker.plain}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 300,
              color: C.ink,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {marker.anna}
            <span
              style={{
                fontSize: 16,
                color: C.inkMuted,
                marginLeft: 8,
                fontWeight: 400,
                letterSpacing: 0,
              }}
            >
              {marker.unit}
            </span>
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginTop: 6,
            }}
          >
            Anna / March 2026
          </div>
        </div>
      </div>

      <p
        style={{
          ...TYPE.body,
          color: C.inkMuted,
          margin: "0 0 28px",
          maxWidth: 720,
        }}
      >
        {marker.why}
      </p>

      <div
        style={{
          border: `1px solid ${C.inkHairline}`,
          borderRadius: 4,
          padding: 16,
          background: C.paperDeep,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            ...TYPE.mono,
            color: C.inkMuted,
          }}
        >
          <span>Six year trajectory</span>
          <span>
            Reference {marker.range.lo} to {marker.range.hi} {marker.unit}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Reference band */}
          <rect
            x={padL}
            y={yFor(range.hi)}
            width={W - padL - padR}
            height={yFor(range.lo) - yFor(range.hi)}
            fill={C.sageWash}
            opacity={0.6}
          />
          {[range.min, (range.max + range.min) / 2, range.max].map((v) => (
            <g key={v}>
              <line
                x1={padL}
                x2={W - padR}
                y1={yFor(v)}
                y2={yFor(v)}
                stroke={C.inkHairline}
                strokeWidth={1}
              />
              <text
                x={padL - 8}
                y={yFor(v) + 4}
                fontSize={10}
                fill={C.inkMuted}
                textAnchor="end"
                fontFamily="ui-monospace, Menlo, monospace"
              >
                {v}
              </text>
            </g>
          ))}

          <motion.path
            key={`path-${marker.short}`}
            d={path}
            fill="none"
            stroke={C.ink}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
          {trend.map((v, i) => (
            <circle
              key={`pt-${i}`}
              cx={xFor(i)}
              cy={yFor(v)}
              r={3}
              fill={i === trend.length - 1 ? C.sage : C.ink}
            />
          ))}
          {["2021", "2022", "2023", "2024", "2025", "2026"].map((y, i) => (
            <text
              key={y}
              x={xFor(i)}
              y={H - 10}
              fontSize={10}
              fill={C.inkMuted}
              textAnchor="middle"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              {y}
            </text>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}
