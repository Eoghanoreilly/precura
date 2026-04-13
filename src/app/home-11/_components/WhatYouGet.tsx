"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * WHAT YOU GET - Not a card grid.
 *
 * An editorial index: five pillars as rows in a typed, indexed list.
 * Each row expands subtly on hover and carries a small diagram on the
 * right side. This is the "five pillars" consolidation.
 */
export function WhatYouGet() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      id="what"
      style={{
        background: C.page,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Head */}
        <div
          ref={headRef}
          style={{
            marginBottom: 96,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 820 }}>
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
              Ch. 05 / The five pillars
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
              Everything the NHS annual physical{" "}
              <span style={{ color: C.sage, fontStyle: "italic" }}>
                never quite was.
              </span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.body,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 320,
              textAlign: "right",
            }}
          >
            Predictive science, biomarker depth, a real clinician, a real
            coach, one living profile. Not a clever app. A system.
          </motion.p>
        </div>

        {/* Five-row index */}
        <div
          style={{
            borderTop: `1px solid ${C.inkHairlineStrong}`,
          }}
        >
          {pillars.map((p, i) => (
            <PillarRow key={p.title} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    num: "01",
    kicker: "Scientific research",
    title: "Peer-reviewed risk models, run every test.",
    body:
      "FINDRISC (Lindstrom and Tuomilehto, Diabetes Care 2003). SCORE2 (European Heart Journal 2021). FRAX (Kanis, Osteoporosis International 2008). Stockholm Diabetes Prevention Programme (BMC Medicine 2024). UKPDS, DPP, the PURE study. Your numbers run through the same math Swedish primary care is supposed to be running, and they run every single time.",
    stat: "4 clinical models",
    statSub: "peer-reviewed, referenced",
    kind: "science",
  },
  {
    num: "02",
    kicker: "Biomarker depth",
    title: "Forty+ markers, five years of slope.",
    body:
      "Fasting glucose, HbA1c, fP-insulin, LDL-C, ApoB, HDL, triglycerides, hs-CRP, Omega-3 index, 25-OH-D, ferritin, TSH, creatinine, eGFR, ALT, GGT, Lp(a). Not a commodity panel. A full metabolic, lipid, liver, kidney, thyroid and inflammation picture, viewed as trajectories.",
    stat: "40+ biomarkers",
    statSub: "per draw, trended over years",
    kind: "markers",
  },
  {
    num: "03",
    kicker: "Personal doctor",
    title: "A real Swedish clinician, not a chatbot.",
    body:
      "Dr. Marcus Johansson, Karolinska Institute, 15 years in Swedish primary care. He reviews every panel, writes a plain-Swedish note, and answers your secure messages for the full year. Escalations go through him. This is a named doctor-patient relationship, not a triage queue.",
    stat: "1 named clinician",
    statSub: "signs every report",
    kind: "doctor",
  },
  {
    num: "04",
    kicker: "Active coaching",
    title: "A personal coach writes your training plan.",
    body:
      "Because health is not a passive monitor. A certified strength and metabolic coach designs a training block around your current aerobic capacity, strength baseline and mobility, then progresses it with every new blood panel. Real exercises. Real sets. Real reps. Weekly check-ins.",
    stat: "1 coach / 1 plan",
    statSub: "progressed every block",
    kind: "coach",
  },
  {
    num: "05",
    kicker: "Living profile",
    title: "A twin of your body, always on.",
    body:
      "Every new data point updates everything downstream. AI chat carries your full history. Your doctor and coach see the same surface you do. FHIR export any time, EU hosted, GDPR compliant, BankID login. Your record, read properly, for the first time.",
    stat: "Always on",
    statSub: "FHIR export, BankID, EU hosted",
    kind: "profile",
  },
];

function PillarRow({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.05 * index, ease: EASE }}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 1fr 200px",
        gap: 48,
        padding: "48px 0",
        borderBottom: `1px solid ${C.inkHairlineStrong}`,
        alignItems: "flex-start",
      }}
      className="home11-pillar"
    >
      {/* Number */}
      <div
        style={{
          ...TYPE.mono,
          color: C.sage,
          paddingTop: 8,
        }}
      >
        {pillar.num}
      </div>

      {/* Kicker + title */}
      <div>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 10,
          }}
        >
          {pillar.kicker}
        </div>
        <h3
          style={{
            ...TYPE.title,
            margin: 0,
            color: C.ink,
            maxWidth: 440,
          }}
        >
          {pillar.title}
        </h3>
      </div>

      {/* Body */}
      <p
        style={{
          ...TYPE.body,
          color: C.inkMuted,
          margin: 0,
          maxWidth: 460,
        }}
      >
        {pillar.body}
      </p>

      {/* Stat */}
      <div
        style={{
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: C.ink,
            letterSpacing: "-0.015em",
            marginBottom: 6,
          }}
        >
          {pillar.stat}
        </div>
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>{pillar.statSub}</div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-pillar) {
            grid-template-columns: 60px 1fr !important;
            gap: 24px !important;
          }
          :global(.home11-pillar > *:nth-child(3)),
          :global(.home11-pillar > *:nth-child(4)) {
            grid-column: 2 !important;
            text-align: left !important;
            margin-top: 16px;
          }
        }
      `}</style>
    </motion.div>
  );
}
