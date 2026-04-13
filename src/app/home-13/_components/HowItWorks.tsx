"use client";

/**
 * HowItWorks - VERTICAL 5-step rail.
 *
 * The user explicitly said home-8's sideways flow is "so annoying". This
 * version takes the same content idea (blood in, clarity out) but runs it
 * vertically with a left-side progress rail, a number, and an illustrative
 * card on the right. Each step is a full row, not a sticky-horizontal
 * panel.
 *
 * Five steps, not three: blood test -> risk engine -> doctor review ->
 * coach plan -> 6-month retest. This is the full Precura loop.
 */

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

const steps = [
  {
    num: "01",
    label: "Blood draw",
    title: "Book a panel in your city.",
    body: "14-panel fasting draw in Stockholm, Goteborg, Malmo, Uppsala or Lund. HbA1c, fasting glucose, full lipid panel, liver, kidney, thyroid, vitamin D. 10 minutes at the clinic. Results in 48 hours.",
    metric: "40+ markers",
    sub: "from one draw",
    visual: "blood" as const,
  },
  {
    num: "02",
    label: "Risk engine",
    title: "Six clinical models run on your data.",
    body: "FINDRISC for diabetes, SCORE2 for cardiovascular, FRAX for bone health, SDPP, UKPDS and DPP for long-term trajectories. All validated in peer-reviewed research. All read together.",
    metric: "6 models",
    sub: "peer-reviewed",
    visual: "engine" as const,
  },
  {
    num: "03",
    label: "Doctor review",
    title: "A Swedish GP signs your report.",
    body: "Dr. Marcus Johansson, our medical lead, personally writes your review. You get his note, a ranked list of levers you can pull, and an in-app message thread with him for the next 12 months.",
    metric: "Dr. Marcus J.",
    sub: "Karolinska-trained",
    visual: "doctor" as const,
  },
  {
    num: "04",
    label: "Coaching",
    title: "A plan built for your metabolism.",
    body: "An assigned personal coach turns your panel into a training and nutrition plan. Real exercises, sets, reps, weights. Not generic 'move more' advice. Your plan updates every time your blood is read.",
    metric: "Weekly",
    sub: "coach check-ins",
    visual: "coach" as const,
  },
  {
    num: "05",
    label: "Retest",
    title: "We re-read you every six months.",
    body: "Precura is a subscription to your own trajectory. A retest is included, your training plan adapts to your current markers, and if anything trends outside a safe corridor, your doctor hears about it first.",
    metric: "6 months",
    sub: "included cadence",
    visual: "cycle" as const,
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.2", "end 0.8"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      id="how"
      style={{
        position: "relative",
        background: C.cream,
        color: C.ink,
        padding: "180px 36px 160px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 96,
            maxWidth: 900,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.amber,
              marginBottom: 24,
            }}
          >
            03  /  How it works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.08, ease: EASE }}
            style={{
              ...TYPE.displayLarge,
              color: C.ink,
              margin: 0,
            }}
          >
            Blood in.{" "}
            <span
              style={{
                color: C.amberDeep,
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Clarity out.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.16, ease: EASE }}
            style={{
              ...TYPE.lead,
              color: C.inkMid,
              marginTop: 24,
              maxWidth: 620,
            }}
          >
            Five steps, vertically laid out so you can actually read them.
            One draw, six models, a real GP, a real coach, and a living
            profile that never stops learning.
          </motion.p>
        </div>

        {/* Vertical step list with left rail */}
        <div
          style={{
            position: "relative",
            paddingLeft: 80,
          }}
          className="home13-how-body"
        >
          {/* Background rail */}
          <div
            style={{
              position: "absolute",
              left: 29,
              top: 24,
              bottom: 24,
              width: 1,
              background: C.line,
            }}
          />
          {/* Progress rail */}
          <motion.div
            style={{
              position: "absolute",
              left: 29,
              top: 24,
              width: 1,
              height: railHeight,
              background: C.amber,
              transformOrigin: "top",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 72,
            }}
          >
            {steps.map((s, i) => (
              <Step key={s.num} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-how-body) {
            padding-left: 52px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Step({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
        alignItems: "center",
      }}
      className="home13-step-row"
    >
      {/* Bullet on the rail */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        style={{
          position: "absolute",
          left: -60,
          top: 6,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: C.cream,
          border: `1.5px solid ${C.amber}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.amber,
          }}
        />
      </motion.div>

      {/* Left: copy */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          style={{
            ...TYPE.mono,
            color: C.amberDeep,
            marginBottom: 14,
          }}
        >
          Step {step.num}  /  {step.label}
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
          style={{
            ...TYPE.displayMedium,
            color: C.ink,
            margin: 0,
          }}
        >
          {step.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          style={{
            ...TYPE.body,
            color: C.inkMid,
            marginTop: 20,
            maxWidth: 520,
          }}
        >
          {step.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
          style={{
            marginTop: 28,
            display: "inline-flex",
            alignItems: "baseline",
            gap: 14,
            padding: "14px 22px",
            background: C.paper,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: C.ink,
              letterSpacing: "-0.01em",
            }}
          >
            {step.metric}
          </span>
          <span style={{ ...TYPE.small, color: C.inkMuted }}>{step.sub}</span>
        </motion.div>
      </div>

      {/* Right: bespoke visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
        style={{
          minHeight: 320,
          background: C.paper,
          border: `1px solid ${C.line}`,
          borderRadius: 22,
          padding: 28,
          boxShadow: C.shadowSm,
        }}
      >
        {step.visual === "blood" && <BloodVisual />}
        {step.visual === "engine" && <EngineVisual />}
        {step.visual === "doctor" && <DoctorVisual />}
        {step.visual === "coach" && <CoachVisual />}
        {step.visual === "cycle" && <CycleVisual />}
      </motion.div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-step-row) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step visuals. Each a small bespoke data composition.
// ---------------------------------------------------------------------------

function BloodVisual() {
  const markers = [
    { n: "HbA1c", v: "38", u: "mmol/mol", s: "normal" },
    { n: "Fast glucose", v: "5.8", u: "mmol/L", s: "caution" },
    { n: "LDL", v: "2.9", u: "mmol/L", s: "normal" },
    { n: "HDL", v: "1.6", u: "mmol/L", s: "normal" },
    { n: "ApoB", v: "0.74", u: "g/L", s: "normal" },
    { n: "Vit D", v: "48", u: "nmol/L", s: "caution" },
    { n: "TSH", v: "2.1", u: "mIU/L", s: "normal" },
    { n: "Ferritin", v: "76", u: "ug/L", s: "normal" },
  ];
  return (
    <div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        Panel  /  14 markers shown
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {markers.map((m) => (
          <div
            key={m.n}
            style={{
              padding: "12px 14px",
              background: C.creamSoft,
              border: `1px solid ${C.lineSoft}`,
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: C.inkMuted }}>{m.n}</div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: C.ink,
                  marginTop: 2,
                }}
              >
                {m.v}
                <span style={{ fontSize: 10, color: C.inkMuted, marginLeft: 3 }}>
                  {m.u}
                </span>
              </div>
            </div>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: m.s === "normal" ? C.signalGood : C.signalCaution,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EngineVisual() {
  const models = [
    { name: "FINDRISC", full: "Finnish Diabetes Risk", score: 65, color: C.signalCaution, sub: "Moderate" },
    { name: "SCORE2", full: "ESC Cardiovascular", score: 28, color: C.signalGood, sub: "Low-mod" },
    { name: "FRAX", full: "Fracture Risk", score: 12, color: C.signalGood, sub: "Low" },
    { name: "SDPP", full: "Stockholm Diabetes", score: 55, color: C.signalCaution, sub: "Moderate" },
    { name: "UKPDS", full: "CVD in Diabetes", score: 22, color: C.signalGood, sub: "Low" },
    { name: "DPP", full: "Diabetes Prevention", score: 48, color: C.signalCaution, sub: "Watch" },
  ];
  return (
    <div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        Engine  /  6 validated models
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {models.map((m, i) => (
          <div
            key={m.name}
            style={{
              padding: "12px 16px",
              background: C.creamSoft,
              border: `1px solid ${C.lineSoft}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>
                {m.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.inkMuted,
                }}
              >
                {m.full}  /  {m.sub}
              </div>
            </div>
            <div
              style={{
                height: 4,
                background: C.lineSoft,
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${m.score}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  delay: 0.1 + i * 0.08,
                  ease: EASE,
                }}
                style={{
                  height: "100%",
                  background: m.color,
                  borderRadius: 100,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorVisual() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: C.sage,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 500,
          }}
        >
          MJ
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>
            Dr. Marcus Johansson
          </div>
          <div style={{ fontSize: 11, color: C.inkMuted }}>
            Medical lead  /  Leg. lakare
          </div>
        </div>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
          }}
        >
          28 MAR
        </div>
      </div>
      <div
        style={{
          padding: "18px 20px",
          background: C.creamSoft,
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 12,
          fontSize: 14,
          lineHeight: 1.6,
          color: C.inkSoft,
        }}
      >
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 8,
          }}
        >
          Panel review
        </div>
        <p style={{ margin: 0 }}>
          Hi Anna. Your fasting glucose at 5.8 is high normal, not diabetic,
          but worth watching. Combined with the 5-year trend and your
          mother&apos;s T2D, I&apos;d like us to keep a close eye here. Lifestyle
          changes matter.
        </p>
        <p style={{ margin: "10px 0 0" }}>
          Let&apos;s retest in 6 months and I&apos;ll flag anything before then.
        </p>
      </div>
    </div>
  );
}

function CoachVisual() {
  const plan = [
    { day: "Mon", workout: "Lower body + Zone 2", vol: "45 min" },
    { day: "Tue", workout: "Zone 2 walk", vol: "35 min" },
    { day: "Wed", workout: "Upper body + intervals", vol: "45 min" },
    { day: "Thu", workout: "Rest / mobility", vol: "20 min" },
    { day: "Fri", workout: "Full body strength", vol: "50 min" },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: C.amberDeep,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 500,
          }}
        >
          EL
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>
            Coach Emma Lindqvist
          </div>
          <div style={{ fontSize: 11, color: C.inkMuted }}>
            Exercise physiologist  /  MSc
          </div>
        </div>
      </div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 12 }}>
        Week 12  /  Metabolic focus
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {plan.map((p) => (
          <div
            key={p.day}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              background: C.creamSoft,
              border: `1px solid ${C.lineSoft}`,
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 11, color: C.inkMuted, width: 40 }}>
              {p.day}
            </span>
            <span style={{ fontSize: 13, color: C.ink, flex: 1 }}>
              {p.workout}
            </span>
            <span style={{ fontSize: 11, color: C.inkMuted }}>{p.vol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CycleVisual() {
  return (
    <div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        12-month cycle
      </div>
      <svg viewBox="0 0 300 260" style={{ width: "100%", height: 280 }}>
        <defs>
          <linearGradient id="hw-cyc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.sage} />
            <stop offset="100%" stopColor={C.amber} />
          </linearGradient>
        </defs>
        <motion.circle
          cx="150"
          cy="130"
          r="100"
          fill="none"
          stroke="url(#hw-cyc)"
          strokeWidth="1.4"
          strokeDasharray="3 5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        />
        {[
          { angle: -90, label: "MONTH 0", sub: "Blood draw" },
          { angle: -18, label: "MONTH 1", sub: "Doctor review" },
          { angle: 54, label: "MONTH 3", sub: "Coach check" },
          { angle: 126, label: "MONTH 6", sub: "Retest" },
          { angle: 198, label: "MONTH 9", sub: "Adapt plan" },
          { angle: 270, label: "MONTH 12", sub: "Annual reset" },
        ].map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const cx = 150 + Math.cos(rad) * 100;
          const cy = 130 + Math.sin(rad) * 100;
          const lx = 150 + Math.cos(rad) * 122;
          const ly = 130 + Math.sin(rad) * 122;
          const anchor =
            Math.cos(rad) < -0.15 ? "end" : Math.cos(rad) > 0.15 ? "start" : "middle";
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.3 + i * 0.1,
                ease: EASE,
              }}
            >
              <circle cx={cx} cy={cy} r="4" fill={C.amber} />
              <text
                x={lx}
                y={ly - 4}
                textAnchor={anchor}
                fontSize="8"
                fontFamily='"SF Mono", Menlo, monospace'
                fill={C.inkMuted}
                style={{ letterSpacing: "0.08em" }}
              >
                {p.label}
              </text>
              <text
                x={lx}
                y={ly + 7}
                textAnchor={anchor}
                fontSize="10"
                fontFamily={SYSTEM_FONT}
                fill={C.ink}
                fontWeight="500"
              >
                {p.sub}
              </text>
            </motion.g>
          );
        })}
        <text
          x="150"
          y="126"
          textAnchor="middle"
          fontSize="10"
          fontFamily='"SF Mono", Menlo, monospace'
          fill={C.inkMuted}
          style={{ letterSpacing: "0.12em" }}
        >
          WATCHED
        </text>
        <text
          x="150"
          y="146"
          textAnchor="middle"
          fontSize="20"
          fontFamily={SYSTEM_FONT}
          fill={C.ink}
          fontWeight="500"
          style={{ letterSpacing: "-0.01em" }}
        >
          12 months
        </text>
      </svg>
    </div>
  );
}
