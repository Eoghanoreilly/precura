"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * HOW IT WORKS - Vertical flow (per brief - horizontal was "annoying").
 *
 * Three stacked panels. Each panel: left column = number + prose,
 * right column = a small, distinct visual. A single hairline vertical rail
 * threads between them and fills as you scroll. Subtle, editorial.
 */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      id="how"
      style={{
        background: C.page,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Head */}
        <div ref={headRef} style={{ marginBottom: 120, maxWidth: 860 }}>
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
            Ch. 03 / How it works
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
            Three steps, twelve months,{" "}
            <span style={{ color: C.sage, fontStyle: "italic" }}>
              one trajectory.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.lead,
              color: C.inkMuted,
              margin: "32px 0 0",
              maxWidth: 640,
            }}
          >
            Blood in, clinical risk models, a living profile and two humans
            who actually call you back. Scroll once.
          </motion.p>
        </div>

        {/* Vertical stepper */}
        <div style={{ position: "relative" }}>
          {/* Hairline rail - stationary */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 40,
              top: 0,
              bottom: 0,
              width: 1,
              background: C.inkHairline,
            }}
            className="home11-rail"
          />
          {/* Hairline rail - fills with scroll, accent colour */}
          <motion.div
            aria-hidden
            className="home11-rail-fill"
            style={{
              position: "absolute",
              left: 40,
              top: 0,
              width: 1,
              height: railHeight,
              background: C.sage,
              transformOrigin: "top",
            }}
          />

          {stepsData.map((s, i) => (
            <StepRow key={i} step={s} index={i} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home11-rail) {
            left: 20px !important;
          }
          :global(.home11-rail-fill) {
            left: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

const stepsData = [
  {
    num: "01",
    title: "A single blood draw in your city.",
    body:
      "Ten minutes in a Precura clinic in Stockholm, Goteborg, Malmo, Uppsala or Lund. One needle, 40+ biomarkers. Fasting glucose, HbA1c (long-term blood sugar), ApoB and LDL (bad cholesterol), HDL (good cholesterol), triglycerides, hs-CRP (inflammation), fP-insulin, Omega-3 index, vitamin D, ferritin, thyroid, liver, kidney. One draw, the full metabolic picture.",
    meta: "40+ markers / 1 draw / results in 48h",
    visual: "lab",
  },
  {
    num: "02",
    title: "Validated clinical risk models do the reading.",
    body:
      "Your markers, your family history and your lifestyle answers run through peer-reviewed models the same day. FINDRISC for diabetes (Lindstrom and Tuomilehto, 2003). SCORE2 for cardiovascular risk (European Heart Journal, 2021). FRAX for fracture risk. Reference data from the Stockholm Diabetes Prevention Programme. This is the math Swedish primary care is supposed to run, done every time, across years.",
    meta: "4 validated models / peer-reviewed / same day",
    visual: "models",
  },
  {
    num: "03",
    title: "A doctor writes. A coach starts. Your profile wakes up.",
    body:
      "Dr. Marcus Johansson, our medical lead, personally reviews every panel and writes a plain-Swedish note. A certified coach designs a training plan around your current metabolic profile, with real exercises, sets and reps. Every new blood draw, doctor message and training check-in updates the living profile. You see the slope, not the snapshot.",
    meta: "1 clinician / 1 coach / 1 living profile",
    visual: "team",
  },
];

function StepRow({
  step,
  index,
}: {
  step: (typeof stepsData)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        paddingLeft: 96,
        paddingBottom: index === stepsData.length - 1 ? 0 : 140,
      }}
      className="home11-step"
    >
      {/* Dot on the rail */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: "absolute",
          left: 34,
          top: 8,
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: C.page,
          border: `1px solid ${C.ink}`,
        }}
        className="home11-dot"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        style={{
          position: "absolute",
          left: 40,
          top: 14,
          width: 1,
          height: 1,
          background: C.sage,
        }}
      />

      <div
        className="home11-step-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 0.9fr",
          gap: 72,
          alignItems: "flex-start",
        }}
      >
        {/* Left: text block */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 20,
            }}
          >
            Step {step.num}
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.displayMedium,
              margin: 0,
              color: C.ink,
              maxWidth: 520,
            }}
          >
            {step.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{
              ...TYPE.body,
              color: C.inkMuted,
              margin: "28px 0 0",
              maxWidth: 520,
            }}
          >
            {step.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: `1px solid ${C.inkHairline}`,
              ...TYPE.mono,
              color: C.inkMuted,
            }}
          >
            {step.meta}
          </motion.div>
        </div>

        {/* Right: visual block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          style={{
            width: "100%",
          }}
        >
          {step.visual === "lab" && <LabVisual />}
          {step.visual === "models" && <ModelsVisual />}
          {step.visual === "team" && <TeamVisual />}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home11-step) {
            padding-left: 48px !important;
          }
          :global(.home11-dot) {
            left: 14px !important;
          }
          :global(.home11-step-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Visual 1 - editorial marker list
function LabVisual() {
  const markers = [
    { name: "Fasting glucose", val: "5.8", unit: "mmol/L", s: "caution" },
    { name: "HbA1c (long-term blood sugar)", val: "38", unit: "mmol/mol", s: "good" },
    { name: "LDL-C (bad cholesterol)", val: "2.9", unit: "mmol/L", s: "good" },
    { name: "ApoB", val: "0.92", unit: "g/L", s: "good" },
    { name: "HDL (good cholesterol)", val: "1.6", unit: "mmol/L", s: "good" },
    { name: "Triglycerides", val: "1.3", unit: "mmol/L", s: "good" },
    { name: "hs-CRP (inflammation)", val: "1.1", unit: "mg/L", s: "good" },
    { name: "fP-insulin", val: "58", unit: "pmol/L", s: "caution" },
    { name: "Omega-3 index", val: "5.2", unit: "%", s: "caution" },
    { name: "25-OH-D (vitamin D)", val: "48", unit: "nmol/L", s: "caution" },
    { name: "Ferritin", val: "82", unit: "ug/L", s: "good" },
    { name: "TSH (thyroid)", val: "2.1", unit: "mIU/L", s: "good" },
  ];
  return (
    <div
      style={{
        background: C.page,
        border: `1px solid ${C.inkHairlineStrong}`,
        borderRadius: 4,
        padding: 26,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingBottom: 14,
          marginBottom: 12,
          borderBottom: `1px solid ${C.inkHairline}`,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          Precura panel / draw of 2026-03-15
        </div>
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>12 / 40</div>
      </div>
      <div>
        {markers.map((m, i) => (
          <div
            key={m.name}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 12,
              alignItems: "baseline",
              padding: "10px 0",
              borderBottom:
                i === markers.length - 1
                  ? "none"
                  : `1px solid ${C.inkHairline}`,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: C.ink,
                letterSpacing: "-0.005em",
              }}
            >
              {m.name}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color:
                  m.s === "caution" ? C.signalCaution : C.ink,
                letterSpacing: "-0.01em",
              }}
            >
              {m.val}
            </span>
            <span
              style={{
                ...TYPE.mono,
                color: C.inkFaint,
                minWidth: 64,
                textAlign: "right",
              }}
            >
              {m.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Visual 2 - three models, spare scale bars
function ModelsVisual() {
  const models = [
    {
      name: "FINDRISC",
      long: "Finnish Diabetes Risk Score",
      citation: "Lindstrom, Tuomilehto 2003",
      value: 17,
      placement: 0.58,
    },
    {
      name: "SCORE2",
      long: "ESC cardiovascular risk",
      citation: "European Heart Journal 2021",
      value: 3,
      placement: 0.24,
    },
    {
      name: "FRAX",
      long: "Fracture risk assessment",
      citation: "Kanis et al. 2008",
      value: 4,
      placement: 0.14,
    },
  ];
  return (
    <div
      style={{
        background: C.page,
        border: `1px solid ${C.inkHairlineStrong}`,
        borderRadius: 4,
        padding: 26,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          ...TYPE.mono,
          color: C.inkMuted,
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: `1px solid ${C.inkHairline}`,
        }}
      >
        Risk engine / Anna Bergstrom / 2026
      </div>
      {models.map((m, i) => (
        <div
          key={m.name}
          style={{
            padding: "18px 0",
            borderBottom:
              i === models.length - 1 ? "none" : `1px solid ${C.inkHairline}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: C.ink,
                letterSpacing: "-0.01em",
              }}
            >
              {m.name}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: C.ink,
                letterSpacing: "-0.02em",
              }}
            >
              {m.value}
              <span style={{ fontSize: 13, color: C.inkMuted }}>%</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.inkMuted,
              marginBottom: 14,
            }}
          >
            {m.long} / 10-year risk
          </div>
          {/* Scale bar */}
          <div
            style={{
              position: "relative",
              height: 2,
              background: C.inkHairlineStrong,
            }}
          >
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              whileInView={{ left: `${m.placement * 100}%`, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 1.2,
                delay: 0.4 + i * 0.15,
                ease: EASE,
              }}
              style={{
                position: "absolute",
                top: -4,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: C.page,
                border: `1.5px solid ${C.ink}`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: C.inkFaint,
              marginTop: 10,
            }}
          >
            {m.citation}
          </div>
        </div>
      ))}
    </div>
  );
}

// Visual 3 - doctor + coach names
function TeamVisual() {
  return (
    <div
      style={{
        background: C.page,
        border: `1px solid ${C.inkHairlineStrong}`,
        borderRadius: 4,
        padding: 26,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          ...TYPE.mono,
          color: C.inkMuted,
          marginBottom: 20,
        }}
      >
        Your Precura team
      </div>
      <TeamRow
        initials="MJ"
        name="Dr. Marcus Johansson"
        role="Medical lead / Leg. lakare"
        note="Reviews every panel in person. Writes the note you actually read. Available by secure message for 12 months."
      />
      <div
        style={{
          height: 1,
          background: C.inkHairline,
          margin: "22px 0",
        }}
      />
      <TeamRow
        initials="LS"
        name="Lina Stenberg"
        role="Coach / Strength & metabolic"
        note="Certified. Builds the training plan around your current markers. Real exercises, sets and reps, weekly check-ins."
      />
      <div
        style={{
          marginTop: 26,
          padding: "16px 18px",
          background: C.paperDeep,
          borderRadius: 4,
          ...TYPE.body,
          fontStyle: "italic",
          color: C.inkSoft,
          lineHeight: 1.55,
        }}
      >
        &ldquo;Hi Anna. Your fasting glucose is in the upper normal range but
        the five-year trend matters. Lina is adjusting your sessions. We
        retest in six months.&rdquo;
        <div
          style={{
            marginTop: 10,
            fontStyle: "normal",
            fontSize: 12,
            color: C.inkMuted,
            fontWeight: 500,
          }}
        >
          Dr. Johansson, 28 March 2026
        </div>
      </div>
    </div>
  );
}

function TeamRow({
  initials,
  name,
  role,
  note,
}: {
  initials: string;
  name: string;
  role: string;
  note: string;
}) {
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: C.sage,
          color: C.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          {role}
        </div>
        <div
          style={{
            fontSize: 14,
            color: C.inkMuted,
            lineHeight: 1.55,
          }}
        >
          {note}
        </div>
      </div>
    </div>
  );
}
