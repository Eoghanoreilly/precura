"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE } from "./tokens";

/**
 * HOW IT WORKS - Vertical editorial timeline.
 *
 * Three numbered chapters stacked vertically. Each step has:
 *   - a mono number (Step 01, 02, 03)
 *   - a chapter-sized title
 *   - a two-column body with rich detail
 *   - a content block on the right with real editorial "figure" treatment
 *
 * An animated vertical progress rule runs down the left edge of the
 * column as the reader scrolls.
 */
export function HowItWorks() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section
      id="how"
      ref={wrapRef}
      style={{
        position: "relative",
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "160px 48px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 03</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>The method</div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Three steps / Vertical read
          </div>
        </div>

        {/* Section lead */}
        <div
          style={{
            marginBottom: 100,
            maxWidth: 960,
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...TYPE.chapter, margin: 0 }}
          >
            Blood in,{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>
              clarity out.
            </span>
          </motion.h2>
        </div>

        {/* Vertical timeline with progress rule */}
        <div
          style={{
            position: "relative",
            paddingLeft: 80,
          }}
          className="how14-wrap"
        >
          {/* Background rule */}
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 0,
              bottom: 0,
              width: 1,
              background: C.rule,
            }}
          />
          {/* Filled progress rule */}
          <motion.div
            style={{
              position: "absolute",
              left: 29,
              top: 0,
              width: 3,
              height: "100%",
              background: C.ink,
              transformOrigin: "top center",
              scaleY: lineScale,
            }}
          />

          {STEPS.map((step, i) => (
            <Step key={i} step={step} index={i} total={STEPS.length} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.how14-wrap) {
            padding-left: 48px !important;
          }
          :global(.how14-panel) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.how14-figure) {
            min-height: 340px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Step data
// =============================================================================
const STEPS = [
  {
    num: "Step 01",
    title: "Book a blood test in your city.",
    body:
      "You pick a clinic in Stockholm, Goteborg, Malmo, Uppsala or Lund. We bring a 40+ marker panel including HbA1c (long-term blood sugar), fasting glucose, fasting insulin, ApoB, LDL, HDL, triglycerides, hs-CRP (inflammation), Omega-3 index, Vitamin D, TSH, creatinine, eGFR and ferritin. Ten minutes, no fasting gymnastics, results in 48 hours. 995 SEK for the first panel.",
    metric: "40+",
    metricLabel: "Markers per draw",
    figureKind: "markers" as const,
  },
  {
    num: "Step 02",
    title: "We run validated clinical risk models.",
    body:
      "Your results flow into FINDRISC for type 2 diabetes, SCORE2 for cardiovascular risk, FRAX for fracture risk, and SDPP for longitudinal diabetes prediction. These are the exact models Swedish GPs learn in medical school. Precura runs them all, together, every quarter, and tracks the delta between visits.",
    metric: "5",
    metricLabel: "Cited risk models",
    figureKind: "models" as const,
  },
  {
    num: "Step 03",
    title: "A Swedish doctor writes your review.",
    body:
      "Dr. Marcus Johansson, our medical lead, personally signs off on every result. You get his written note, a ranked list of the levers you can pull, and a secure chat where you can ask questions for the next twelve months. Your personal coach then designs a training and nutrition plan around the specific markers that need moving.",
    metric: "48h",
    metricLabel: "Draw to written review",
    figureKind: "doctor" as const,
  },
];

type StepData = (typeof STEPS)[number];

function Step({
  step,
  index,
  total,
}: {
  step: StepData;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        marginBottom: index === total - 1 ? 0 : 140,
      }}
    >
      {/* Step bullet */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={
          inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: -62,
          top: 18,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: C.paper,
          border: `3px solid ${C.ink}`,
          zIndex: 2,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Step number */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              ...TYPE.mono,
              color: C.rust,
              fontSize: 12,
            }}
          >
            {step.num}
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            {index + 1} of {total}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "clamp(36px, 5vw, 72px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 48,
            maxWidth: 900,
          }}
        >
          {step.title}
        </h3>

        {/* Body + figure */}
        <div
          className="how14-panel"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: C.inkSoft,
                maxWidth: 540,
              }}
            >
              {step.body}
            </p>

            <div
              style={{
                marginTop: 40,
                display: "inline-flex",
                alignItems: "baseline",
                gap: 18,
                paddingTop: 20,
                borderTop: `2px solid ${C.ink}`,
                paddingRight: 40,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.035em",
                  lineHeight: 0.9,
                }}
              >
                {step.metric}
              </div>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkMuted,
                  maxWidth: 140,
                }}
              >
                {step.metricLabel}
              </div>
            </div>
          </div>

          {/* Right figure */}
          <div
            className="how14-figure"
            style={{
              background: C.white,
              border: `1px solid ${C.ink}`,
              padding: 28,
              minHeight: 420,
              position: "relative",
            }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 18,
              }}
            >
              Figure {String(index + 3).padStart(2, "0")} / {step.num}
            </div>
            {step.figureKind === "markers" && <MarkersFigure />}
            {step.figureKind === "models" && <ModelsFigure />}
            {step.figureKind === "doctor" && <DoctorFigure />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// Figures
// =============================================================================
function MarkersFigure() {
  const markers = [
    { n: "HbA1c", v: "38", u: "mmol/mol", s: "normal" },
    { n: "Glucose (fasting)", v: "5.8", u: "mmol/L", s: "border" },
    { n: "ApoB", v: "0.90", u: "g/L", s: "normal" },
    { n: "LDL", v: "2.9", u: "mmol/L", s: "normal" },
    { n: "HDL", v: "1.6", u: "mmol/L", s: "normal" },
    { n: "Triglycerides", v: "1.3", u: "mmol/L", s: "normal" },
    { n: "hs-CRP", v: "1.4", u: "mg/L", s: "normal" },
    { n: "Insulin (fasting)", v: "12", u: "mU/L", s: "normal" },
    { n: "Omega-3 index", v: "6.1", u: "%", s: "border" },
    { n: "Vitamin D", v: "48", u: "nmol/L", s: "border" },
    { n: "Ferritin", v: "65", u: "ug/L", s: "normal" },
    { n: "TSH", v: "2.1", u: "mIU/L", s: "normal" },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 18,
          color: C.ink,
          fontWeight: 500,
          marginBottom: 14,
          letterSpacing: "-0.01em",
        }}
      >
        Anna B / 27 March 2026
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {markers.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "10px 0",
              borderBottom: `1px solid ${C.ruleSoft}`,
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.inkMuted,
                fontWeight: 500,
              }}
            >
              {m.n}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: m.s === "border" ? C.rust : C.ink,
                }}
              >
                {m.v}
              </span>
              <span style={{ fontFamily: MONO_FONT, fontSize: 10, color: C.inkFaint }}>
                {m.u}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: `1px solid ${C.rule}`,
          ...TYPE.mono,
          color: C.inkMuted,
        }}
      >
        +28 additional markers tracked
      </div>
    </div>
  );
}

function ModelsFigure() {
  const models = [
    {
      name: "FINDRISC",
      full: "Finnish Diabetes Risk Score",
      cite: "Lindstrom & Tuomilehto, 2003",
      score: 12,
      max: 26,
      level: "Moderate",
      result: "~17% 10-year risk",
      fill: 0.46,
      color: C.rust,
    },
    {
      name: "SCORE2",
      full: "ESC cardiovascular risk",
      cite: "SCORE2 working group, 2021",
      score: 3,
      max: 100,
      level: "Low-mod.",
      result: "~3% 10-year risk",
      fill: 0.28,
      color: C.inkMuted,
    },
    {
      name: "FRAX",
      full: "Fracture Risk Assessment Tool",
      cite: "Kanis et al., 2008",
      score: 2,
      max: 100,
      level: "Low",
      result: "<5% 10-year risk",
      fill: 0.12,
      color: C.sage,
    },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 18,
          color: C.ink,
          fontWeight: 500,
          marginBottom: 20,
          letterSpacing: "-0.01em",
        }}
      >
        Three models, one trajectory
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {models.map((m, i) => (
          <div
            key={i}
            style={{
              paddingBottom: 18,
              borderBottom: `1px solid ${C.ruleSoft}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  color: C.ink,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  ...TYPE.mono,
                  color: m.color,
                }}
              >
                {m.level}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.inkMuted,
                marginBottom: 4,
              }}
            >
              {m.full}
            </div>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              {m.cite.toUpperCase()}
            </div>

            {/* Fill bar */}
            <div
              style={{
                position: "relative",
                height: 4,
                background: C.ruleSoft,
                marginBottom: 8,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: m.fill }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: m.color,
                  transformOrigin: "left center",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.inkSoft,
              }}
            >
              {m.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorFigure() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: C.ink,
            color: C.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: "-0.01em",
          }}
        >
          MJ
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.01em",
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
            Medical lead / Leg. lakare / Karolinska
          </div>
        </div>
        <div style={{ ...TYPE.mono, color: C.inkFaint }}>28.03.26</div>
      </div>

      <div
        style={{
          padding: "18px 20px",
          background: C.paperSoft,
          fontSize: 14,
          lineHeight: 1.65,
          color: C.inkSoft,
          borderLeft: `2px solid ${C.ink}`,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 8 }}>
          Panel review
        </div>
        <p style={{ margin: 0 }}>
          Hi Anna, thanks for sending this through. Your fasting glucose at
          5.8 is in the upper normal range, not diabetic, but worth watching.
          Looking at your five-year history it has gradually risen from 5.0 in
          2021. Combined with your mother's T2D at 58, I would like us to keep
          a close eye on this.
        </p>
        <p style={{ margin: "14px 0 0" }}>
          The good news is lifestyle changes make a real difference here. Your
          coach is building a training plan around this. Let us retest in six
          months and I will flag anything before then.
        </p>
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingTop: 16,
          borderTop: `1px solid ${C.ruleSoft}`,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>Reply in chat</div>
        <div style={{ ...TYPE.mono, color: C.ink }}>Read receipt / 9:14</div>
      </div>
    </div>
  );
}
