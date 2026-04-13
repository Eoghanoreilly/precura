"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Activity,
  Stethoscope,
  Dumbbell,
  LineChart,
} from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * WHAT YOU GET - Five pillars of Precura. Calm asymmetric rows, not a
 * 3-card grid, not identical icon tiles. Each row is a paper card with
 * an icon, a large title and descriptive body, plus a small inline
 * indicator note.
 */

const PILLARS = [
  {
    eyebrow: "Pillar 1 / Evidence",
    title: "Clinical risk models, not vibes.",
    body: "FINDRISC for diabetes. SCORE2 for cardiovascular risk. FRAX for bone health. The same tools used by Swedish and European clinicians, surfaced in plain English and updated automatically with every panel.",
    icon: <Activity size={22} />,
    color: C.lingon,
    bg: C.lingonBg,
    side: "Published in Lancet, EHJ, Osteoporos Int",
  },
  {
    eyebrow: "Pillar 2 / Biomarkers",
    title: "40+ blood markers tracked over time.",
    body: "Fasting glucose, HbA1c, lipid panel, ApoB, hs-CRP, Omega-3 index, vitamin D, ferritin, TSH, kidney function and more. Each one plotted across your last five years, with plain-English labels.",
    icon: <FlaskConical size={22} />,
    color: C.euc,
    bg: C.eucBg,
    side: "Sourced from Karolinska University Laboratory",
  },
  {
    eyebrow: "Pillar 3 / Doctor",
    title: "Dr. Marcus reads every single panel.",
    body: "Karolinska-trained internal medicine physician with 15 years of clinical practice. Writes a note on every result. Available by message. Not a chatbot pretending to be a doctor.",
    icon: <Stethoscope size={22} />,
    color: C.amberDeep,
    bg: C.amberBg,
    side: "Swedish medical license, Internal medicine",
  },
  {
    eyebrow: "Pillar 4 / Coaching",
    title: "A coach and a real training plan.",
    body: "Assigned to a certified personal trainer who builds a plan specific to your biomarkers. Real exercises, sets, reps, progressions. Adjusted as your results come in. Not generic \"move more\" advice.",
    icon: <Dumbbell size={22} />,
    color: C.lingonDeep,
    bg: C.lingonBg,
    side: "Coached by Swedish certified trainers",
  },
  {
    eyebrow: "Pillar 5 / Living profile",
    title: "A profile that keeps growing, for life.",
    body: "Your entire health picture in one place. Every test, every consultation, every trend line. Continuously updated. No PDFs, no chasing. It's yours. Export it any time in open formats.",
    icon: <LineChart size={22} />,
    color: C.euc,
    bg: C.eucBg,
    side: "FHIR-compatible export, cancel anytime",
  },
];

export function WhatYouGet() {
  return (
    <section
      style={{
        background: C.canvas,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 64, maxWidth: 720 }}
        >
          <div
            style={{
              ...TYPE.label,
              color: C.lingon,
              marginBottom: 20,
            }}
          >
            What's inside the membership
          </div>
          <h2 style={{ ...TYPE.displayLarge, margin: 0, marginBottom: 16 }}>
            Five pillars. One annual price.
          </h2>
          <p style={{ ...TYPE.lead, color: C.inkSoft, margin: 0 }}>
            The kind of care you'd pay three different providers for. All in
            one place, for roughly the cost of a monthly gym membership.
          </p>
        </motion.div>

        {/* Pillar rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {PILLARS.map((p, i) => (
            <PillarRow key={i} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarRow({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      style={{
        background: C.paper,
        borderRadius: 24,
        padding: 36,
        border: `1px solid ${C.inkLine}`,
        boxShadow: C.shadowCard,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 32,
        alignItems: "center",
        cursor: "default",
        transition: "all 0.3s",
      }}
      className="home18-pillar-row"
    >
      {/* Icon */}
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          background: pillar.bg,
          color: pillar.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {pillar.icon}
      </div>

      {/* Content */}
      <div>
        <div
          style={{
            ...TYPE.label,
            color: pillar.color,
            marginBottom: 8,
          }}
        >
          {pillar.eyebrow}
        </div>
        <h3
          style={{
            ...TYPE.title,
            margin: 0,
            marginBottom: 10,
          }}
        >
          {pillar.title}
        </h3>
        <p
          style={{
            ...TYPE.body,
            color: C.inkSoft,
            margin: 0,
            maxWidth: 620,
          }}
        >
          {pillar.body}
        </p>
      </div>

      {/* Side note */}
      <div
        style={{
          width: 200,
          padding: "14px 18px",
          background: C.canvas,
          borderRadius: 14,
          border: `1px solid ${C.inkLine}`,
          fontSize: 12,
          color: C.inkMuted,
          fontWeight: 500,
          lineHeight: 1.4,
          flexShrink: 0,
        }}
        className="home18-pillar-side"
      >
        {pillar.side}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home18-pillar-row) {
            grid-template-columns: auto 1fr !important;
            padding: 28px !important;
          }
          :global(.home18-pillar-side) {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
