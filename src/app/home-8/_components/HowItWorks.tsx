"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * HOW IT WORKS - horizontal-pinned 4-panel product tour.
 * Panel 1: Blood test. Panel 2: Risk model. Panel 3: Profile + doctor.
 * Panel 4: Outcome - "We reread every 6 months".
 */
export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const panels = 4;
  const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", `-${(panels - 1) * (100 / panels)}%`]);
  const x = useSpring(xRaw, { stiffness: 100, damping: 30, mass: 0.4 });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0px", "calc(100% - 80px)"]);

  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 900px)");
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) {
    return (
      <section
        id="how"
        style={{
          background: colors.ivory,
          padding: "80px 24px",
          fontFamily: fontStack.display,
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.inkMuted,
            marginBottom: "24px",
          }}
        >
          Ch 03 / How it works
        </div>
        <h2
          style={{
            fontSize: "40px",
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: "-0.02em",
            fontWeight: 500,
            color: colors.ink,
          }}
        >
          Blood in.
          <br />
          <span style={{ color: colors.amberDeep, fontStyle: "italic", fontWeight: 400 }}>
            Clarity out.
          </span>
        </h2>
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {stepsData.map((s, i) => (
            <StepMobileCard key={i} step={s} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="how"
      style={{
        position: "relative",
        height: `${panels * 100}vh`,
        background: colors.ivory,
        fontFamily: fontStack.display,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Chapter label */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            zIndex: 10,
            fontFamily: fontStack.mono,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.inkMid,
            display: "flex",
            gap: "24px",
          }}
        >
          <span>Ch 03</span>
          <span>How it works</span>
        </div>

        {/* Horizontal rail with progress bar */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "40px",
            right: "40px",
            transform: "translateY(-50%)",
            height: "1px",
            background: colors.inkLine,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "40px",
            width: progressWidth,
            height: "1px",
            background: colors.amber,
            zIndex: 2,
            pointerEvents: "none",
            transformOrigin: "left center",
          }}
        />

        {/* Panels container */}
        <motion.div
          style={{
            x,
            display: "flex",
            height: "100%",
            width: `${panels * 100}%`,
          }}
        >
          {stepsData.map((step, i) => (
            <div
              key={i}
              style={{
                width: `${100 / panels}%`,
                flexShrink: 0,
                height: "100%",
                padding: "110px 60px 60px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <StepPanel step={step} index={i} total={panels} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const stepsData = [
  {
    num: "Step 01",
    title: "Book a blood test in your city.",
    body:
      "You pick a clinic in Stockholm, Goteborg, Malmo, Uppsala or Lund. 14 panels including HbA1c, fasting glucose, full lipid panel, liver, kidney, thyroid and vitamin D. 10 minutes, no fasting gymnastics, results in 48 hours. 995 SEK.",
    metric: "14 markers",
    metricSub: "from one blood draw",
    visual: "blood",
  },
  {
    num: "Step 02",
    title: "We run validated clinical models.",
    body:
      "FINDRISC for type 2 diabetes. SCORE2 for cardiovascular risk. FRAX for bone health. We combine your blood work with your family history and basic lifestyle answers and run the same algorithms a Swedish GP would use, all at once.",
    metric: "3 models",
    metricSub: "same math used in primary care",
    visual: "model",
  },
  {
    num: "Step 03",
    title: "A doctor writes your review.",
    body:
      "Dr. Marcus Johansson, our medical lead, personally signs off on every risk report. You get his written note, a ranked list of the levers you can actually pull, and an in-app chat where you can ask him questions for the next 12 months.",
    metric: "48 hours",
    metricSub: "from blood draw to written review",
    visual: "doctor",
  },
  {
    num: "What then",
    title: "We re-read your blood every 6 months.",
    body:
      "Precura is a subscription to your own body. We watch the trajectory, not the snapshot. A yearly retest is included, your training plan adapts to your current markers, and if anything trends outside a safe corridor your doctor hears about it first.",
    metric: "6 month cadence",
    metricSub: "included in annual membership",
    visual: "cycle",
  },
];

function StepPanel({
  step,
  index,
  total,
}: {
  step: (typeof stepsData)[number];
  index: number;
  total: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.amberDeep,
            marginBottom: "24px",
          }}
        >
          {step.num} / {index + 1} of {total}
        </div>

        <h3
          style={{
            fontSize: "clamp(40px, 5vw, 84px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            margin: 0,
            fontWeight: 500,
            color: colors.ink,
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            marginTop: "32px",
            fontSize: "17px",
            lineHeight: 1.65,
            color: colors.inkSoft,
            maxWidth: "540px",
          }}
        >
          {step.body}
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "inline-flex",
            alignItems: "baseline",
            gap: "16px",
            padding: "20px 28px",
            border: `1px solid ${colors.inkLine}`,
            borderRadius: "16px",
            background: colors.cream,
          }}
        >
          <div
            style={{
              fontSize: "38px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: colors.ink,
              fontFamily: fontStack.display,
            }}
          >
            {step.metric}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: colors.inkMuted,
              maxWidth: "160px",
              lineHeight: 1.4,
            }}
          >
            {step.metricSub}
          </div>
        </div>
      </div>

      {/* Right visual */}
      <div style={{ height: "min(560px, 65vh)", position: "relative" }}>
        {step.visual === "blood" && <BloodVisual />}
        {step.visual === "model" && <ModelVisual />}
        {step.visual === "doctor" && <DoctorVisual />}
        {step.visual === "cycle" && <CycleVisual />}
      </div>
    </div>
  );
}

// Visual 1 - blood tubes with markers listed
function BloodVisual() {
  const markers = [
    { n: "HbA1c", v: "38", u: "mmol/mol", s: "normal" },
    { n: "Glucose", v: "5.8", u: "mmol/L", s: "borderline" },
    { n: "LDL chol", v: "2.9", u: "mmol/L", s: "normal" },
    { n: "HDL chol", v: "1.6", u: "mmol/L", s: "normal" },
    { n: "TG", v: "1.3", u: "mmol/L", s: "normal" },
    { n: "Vit D", v: "48", u: "nmol/L", s: "borderline" },
    { n: "TSH", v: "2.1", u: "mIU/L", s: "normal" },
    { n: "Creat", v: "68", u: "umol/L", s: "normal" },
  ];
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.inkLine}`,
        borderRadius: "22px",
        padding: "32px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: fontStack.display,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "16px",
          borderBottom: `1px solid ${colors.inkLine}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fontStack.mono,
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.inkMuted,
            }}
          >
            Precura / Blood panel
          </div>
          <div style={{ fontSize: "17px", color: colors.ink, fontWeight: 500, marginTop: "4px" }}>
            Bergstrom, Anna / 27.03.2026
          </div>
        </div>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: colors.rust,
            boxShadow: `0 0 0 6px ${colors.rust}22`,
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", flex: 1 }}>
        {markers.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.04, ease: easing.out }}
            style={{
              padding: "14px 16px",
              background: colors.cream,
              borderRadius: "12px",
              border: `1px solid ${colors.inkLine}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontFamily: fontStack.mono,
                  color: colors.inkMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {m.n}
              </div>
              <div style={{ fontSize: "22px", color: colors.ink, fontWeight: 500, marginTop: "2px" }}>
                {m.v}
                <span style={{ fontSize: "10px", color: colors.inkMuted, marginLeft: "4px" }}>
                  {m.u}
                </span>
              </div>
            </div>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: m.s === "normal" ? colors.forestSoft : colors.zoneBorderline,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Visual 2 - FINDRISC / SCORE2 / FRAX models
function ModelVisual() {
  const models = [
    {
      name: "FINDRISC",
      full: "Finnish Diabetes Risk Score",
      score: 12,
      max: 26,
      level: "Moderate",
      color: colors.zoneBorderline,
      result: "~17% 10-year T2D risk",
    },
    {
      name: "SCORE2",
      full: "ESC cardiovascular risk",
      score: 3,
      max: 100,
      level: "Low-moderate",
      color: colors.forestSoft,
      result: "~3% 10-year CVD risk",
    },
    {
      name: "FRAX",
      full: "Fracture risk assessment",
      score: 2,
      max: 100,
      level: "Low",
      color: colors.forestSoft,
      result: "<5% 10-year fracture risk",
    },
  ];
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.inkLine}`,
        borderRadius: "22px",
        padding: "32px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        fontFamily: fontStack.display,
      }}
    >
      <div
        style={{
          fontFamily: fontStack.mono,
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.inkMuted,
        }}
      >
        Risk engine / 3 validated models
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
        {models.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 * i, ease: easing.out }}
            style={{
              padding: "20px 22px",
              background: colors.cream,
              borderRadius: "14px",
              border: `1px solid ${colors.inkLine}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: colors.ink }}>
                {m.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: fontStack.mono,
                  padding: "4px 10px",
                  borderRadius: "100px",
                  background: m.color + "33",
                  color: colors.ink,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {m.level}
              </div>
            </div>
            <div style={{ fontSize: "11px", color: colors.inkMuted, marginTop: "2px" }}>{m.full}</div>

            {/* Scale bar */}
            <div
              style={{
                marginTop: "14px",
                height: "6px",
                background: colors.inkLine,
                borderRadius: "100px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(m.score / m.max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: easing.out }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.forestSoft}, ${m.color})`,
                  borderRadius: "100px",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "13px",
                color: colors.inkSoft,
              }}
            >
              {m.result}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Visual 3 - doctor note preview
function DoctorVisual() {
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.inkLine}`,
        borderRadius: "22px",
        padding: "32px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: fontStack.display,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: colors.plum,
            color: colors.ivory,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 500,
            fontSize: "15px",
          }}
        >
          MJ
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 500, color: colors.ink }}>
            Dr. Marcus Johansson
          </div>
          <div style={{ fontSize: "11px", color: colors.inkMuted }}>
            Medical lead / Leg. lakare
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: fontStack.mono,
            fontSize: "10px",
            color: colors.inkMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          28 Mar 2026
        </div>
      </div>

      <div
        style={{
          background: colors.cream,
          borderRadius: "14px",
          padding: "22px 24px",
          fontSize: "14px",
          lineHeight: 1.65,
          color: colors.inkSoft,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "10px",
            color: colors.inkMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}
        >
          Blood panel review
        </div>
        <p style={{ margin: 0 }}>
          {"Hi Anna, thanks for sending this through. Your fasting glucose at 5.8 is in the upper normal range, not diabetic, but worth watching. Looking at your Precura history it's gradually risen from 5.0 in 2021. Combined with your mother's T2D at 58, I'd like us to keep a close eye on this."}
        </p>
        <p style={{ margin: "12px 0 0" }}>
          {"The good news is lifestyle changes make a real difference here. Your training plan is designed with this in mind. Let's retest in 6 months and I'll flag anything before then."}
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            padding: "10px 14px",
            background: colors.cream,
            borderRadius: "100px",
            fontSize: "12px",
            color: colors.inkMid,
            border: `1px solid ${colors.inkLine}`,
          }}
        >
          Reply to Dr. Johansson
        </div>
        <div
          style={{
            padding: "10px 14px",
            background: colors.ink,
            color: colors.ivory,
            borderRadius: "100px",
            fontSize: "12px",
          }}
        >
          Book follow-up
        </div>
      </div>
    </div>
  );
}

// Visual 4 - 6 month cycle
function CycleVisual() {
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.inkLine}`,
        borderRadius: "22px",
        padding: "32px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: fontStack.display,
      }}
    >
      <div
        style={{
          fontFamily: fontStack.mono,
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.inkMuted,
        }}
      >
        Annual cadence
      </div>
      <div style={{ flex: 1, position: "relative", minHeight: "360px" }}>
        <svg viewBox="0 0 400 360" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="cycleLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={colors.forestSoft} />
              <stop offset="100%" stopColor={colors.amber} />
            </linearGradient>
          </defs>
          <motion.circle
            cx="200"
            cy="180"
            r="130"
            fill="none"
            stroke="url(#cycleLine)"
            strokeWidth="2"
            strokeDasharray="4 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: easing.out }}
          />
          {/* Points on circle: 6 positions */}
          {[
            { angle: -90, label: "Month 0", sub: "Blood test" },
            { angle: -30, label: "Month 1", sub: "Doctor review" },
            { angle: 30, label: "Month 2-5", sub: "Training + chat" },
            { angle: 90, label: "Month 6", sub: "Retest included" },
            { angle: 150, label: "Month 7", sub: "Trend review" },
            { angle: 210, label: "Month 12", sub: "Annual reset" },
          ].map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const cx = 200 + Math.cos(rad) * 130;
            const cy = 180 + Math.sin(rad) * 130;
            const lx = 200 + Math.cos(rad) * 168;
            const ly = 180 + Math.sin(rad) * 168;
            const anchor = Math.cos(rad) < -0.1 ? "end" : Math.cos(rad) > 0.1 ? "start" : "middle";
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12, ease: easing.out }}
              >
                <circle cx={cx} cy={cy} r="6" fill={colors.amber} />
                <text
                  x={lx}
                  y={ly - 4}
                  textAnchor={anchor}
                  fontSize="10"
                  fontFamily={fontStack.mono}
                  fill={colors.inkMuted}
                  style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {p.label}
                </text>
                <text
                  x={lx}
                  y={ly + 10}
                  textAnchor={anchor}
                  fontSize="11"
                  fontFamily={fontStack.display}
                  fill={colors.ink}
                  fontWeight="500"
                >
                  {p.sub}
                </text>
              </motion.g>
            );
          })}
          {/* Center label */}
          <text
            x="200"
            y="174"
            textAnchor="middle"
            fontSize="12"
            fontFamily={fontStack.mono}
            fill={colors.inkMuted}
            style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            You / watched
          </text>
          <text
            x="200"
            y="196"
            textAnchor="middle"
            fontSize="24"
            fontFamily={fontStack.display}
            fill={colors.ink}
            fontWeight="500"
            style={{ letterSpacing: "-0.01em" }}
          >
            12 months
          </text>
        </svg>
      </div>
    </div>
  );
}

function StepMobileCard({
  step,
}: {
  step: (typeof stepsData)[number];
  index: number;
}) {
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.inkLine}`,
        borderRadius: "18px",
        padding: "24px",
      }}
    >
      <div
        style={{
          fontFamily: fontStack.mono,
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.amberDeep,
          marginBottom: "12px",
        }}
      >
        {step.num}
      </div>
      <h3
        style={{
          fontSize: "22px",
          lineHeight: 1.1,
          margin: 0,
          fontWeight: 500,
          color: colors.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {step.title}
      </h3>
      <p style={{ fontSize: "15px", lineHeight: 1.6, color: colors.inkSoft, marginTop: "12px" }}>
        {step.body}
      </p>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
          paddingTop: "16px",
          borderTop: `1px solid ${colors.inkLine}`,
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: 500, color: colors.ink }}>{step.metric}</div>
        <div style={{ fontSize: "12px", color: colors.inkMuted }}>{step.metricSub}</div>
      </div>
    </div>
  );
}
