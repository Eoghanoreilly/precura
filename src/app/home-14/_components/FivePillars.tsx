"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE } from "./tokens";

/**
 * FIVE PILLARS - Editorial "department" layout.
 *
 * Instead of a 3-card grid we use an irregular editorial column set:
 *   - A 1-column label strip down the side.
 *   - A main asymmetric column of five feature blocks that alternate
 *     between large and medium sizes.
 *   - Each block has a department number, an editorial title, a body,
 *     and a small visual artifact.
 *
 * The five pillars:
 *   01 Scientific research-backed
 *   02 Biomarker-driven
 *   03 Personal doctor
 *   04 Active coaching
 *   05 Living profile
 */
export function FivePillars() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
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
            <div style={{ ...TYPE.mono, color: C.rust }}>Ch. 04</div>
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Five pillars / Departments
            </div>
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            Essays / 5 features
          </div>
        </div>

        {/* Section opener */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.chapter,
            margin: 0,
            marginBottom: 16,
            maxWidth: 1100,
          }}
        >
          What you get for the
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 500 }}>
            price of a dinner out.
          </span>
        </motion.h2>
        <p
          style={{
            ...TYPE.deck,
            color: C.inkMuted,
            margin: 0,
            marginBottom: 80,
            maxWidth: 640,
          }}
        >
          Precura is built on five pillars. Each one is staffed by real
          humans, backed by real research, and printed into every profile.
        </p>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
          {PILLARS.map((p, i) => (
            <Pillar key={i} data={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Pillar row
// =============================================================================
type PillarData = (typeof PILLARS)[number];

const PILLARS = [
  {
    num: "01",
    eyebrow: "Dept / Research",
    title: "Built on the studies your GP cites.",
    body:
      "We run only models and markers with a peer-reviewed evidence base. FINDRISC (Lindstrom & Tuomilehto, 2003). SCORE2 (European Society of Cardiology, 2021). FRAX (Kanis et al., 2008). SDPP for longitudinal diabetes prediction (Carlsson, 2024). UKPDS for complication risk (Turner, 1998). DPP for lifestyle reversibility (Knowler, 2002). No astrology, no wellness guesswork.",
    artifact: "studies",
  },
  {
    num: "02",
    eyebrow: "Dept / Biomarkers",
    title: "Forty-plus markers, not a single snapshot.",
    body:
      "Fasting glucose and HbA1c (long-term blood sugar) for metabolic health. ApoB, LDL, HDL and triglycerides for lipid transport. hs-CRP for low-grade inflammation. Fasting insulin for early insulin resistance. Omega-3 index for cell membrane health. TSH for thyroid. Creatinine and eGFR for kidneys. Vitamin D, ferritin, B12 for nutritional status. Every marker comes with a plain-English name and a reference range.",
    artifact: "markers",
  },
  {
    num: "03",
    eyebrow: "Dept / Doctor",
    title: "A Swedish doctor reads every panel.",
    body:
      "Dr. Marcus Johansson, our medical lead, is a Karolinska-trained internal medicine physician with fifteen-plus years in primary care. He writes your review in Swedish or English, he signs off on your risk summary, and he is available to you by secure chat for the full twelve months of your membership. Not a chatbot. A human doctor.",
    artifact: "doctor",
  },
  {
    num: "04",
    eyebrow: "Dept / Coaching",
    title: "An assigned coach builds a plan around your metabolism.",
    body:
      "Health is not a passive thing. Your coach reads your panel, your training history and your constraints, then prescribes real exercise (sets, reps, loads, intervals) and nutrition aligned with the markers that need moving. Your plan changes every time your blood does. There is no generic 'eat better, move more' copy in the entire platform.",
    artifact: "coach",
  },
  {
    num: "05",
    eyebrow: "Dept / Profile",
    title: "A living record that updates with you.",
    body:
      "Your Precura profile is not a PDF. It is a continuously evolving health twin that absorbs every new blood draw, every doctor's note, every training block, every family history update. Export the whole thing as a FHIR bundle at any time. Take it to your vardcentral. Take it to a cardiologist. It is yours forever.",
    artifact: "profile",
  },
];

function Pillar({ data, index }: { data: PillarData; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // Alternating layout: even indexes put copy left, artifact right
  const reversed = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="pillar14-row"
      style={{
        display: "grid",
        gridTemplateColumns: reversed ? "1fr 1.2fr" : "1.2fr 1fr",
        gap: 60,
        alignItems: "start",
        paddingTop: 60,
        borderTop: `1px solid ${C.rule}`,
      }}
    >
      {/* Copy block */}
      <div style={{ order: reversed ? 2 : 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.035em",
              lineHeight: 0.9,
            }}
          >
            {data.num}
          </div>
          <div style={{ ...TYPE.mono, color: C.rust }}>{data.eyebrow}</div>
        </div>
        <h3
          style={{
            fontSize: "clamp(28px, 3.6vw, 48px)",
            lineHeight: 1,
            letterSpacing: "-0.028em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 24,
            maxWidth: 600,
          }}
        >
          {data.title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: C.inkSoft,
            maxWidth: 560,
          }}
        >
          {data.body}
        </p>
      </div>

      {/* Artifact block */}
      <div
        style={{
          order: reversed ? 1 : 2,
          position: "relative",
          background: C.white,
          border: `1px solid ${C.ink}`,
          padding: 24,
          minHeight: 360,
        }}
      >
        {data.artifact === "studies" && <StudiesArtifact />}
        {data.artifact === "markers" && <MarkersArtifact />}
        {data.artifact === "doctor" && <DoctorArtifact />}
        {data.artifact === "coach" && <CoachArtifact />}
        {data.artifact === "profile" && <ProfileArtifactMini />}
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.pillar14-row) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          :global(.pillar14-row > *) {
            order: initial !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

// =============================================================================
// Artifact 1: Studies bibliography
// =============================================================================
function StudiesArtifact() {
  const studies = [
    {
      t: "FINDRISC",
      a: "Lindstrom & Tuomilehto",
      y: "2003",
      j: "Diabetes Care",
    },
    {
      t: "SCORE2",
      a: "ESC Working Group",
      y: "2021",
      j: "European Heart Journal",
    },
    { t: "FRAX", a: "Kanis et al.", y: "2008", j: "Osteoporos Int" },
    { t: "SDPP", a: "Carlsson et al.", y: "2024", j: "Diabetologia" },
    { t: "UKPDS", a: "Turner", y: "1998", j: "The Lancet" },
    { t: "DPP", a: "Knowler et al.", y: "2002", j: "NEJM" },
  ];
  return (
    <div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        Bibliography / Selected
      </div>
      {studies.map((s, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 12,
            padding: "10px 0",
            borderBottom:
              i < studies.length - 1
                ? `1px solid ${C.ruleSoft}`
                : "1px solid transparent",
            alignItems: "baseline",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.005em",
            }}
          >
            {s.t}
          </div>
          <div style={{ fontSize: 12, color: C.inkMuted, fontStyle: "italic" }}>
            {s.a}
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              color: C.inkFaint,
              letterSpacing: "0.1em",
            }}
          >
            {s.j} / {s.y}
          </div>
        </div>
      ))}
      <div
        style={{
          marginTop: 14,
          ...TYPE.mono,
          color: C.inkFaint,
        }}
      >
        +14 additional citations
      </div>
    </div>
  );
}

// =============================================================================
// Artifact 2: Markers list
// =============================================================================
function MarkersArtifact() {
  const groups = [
    {
      head: "Metabolic",
      items: ["HbA1c", "f-Glucose", "f-Insulin", "Triglycerides"],
    },
    {
      head: "Lipid",
      items: ["ApoB", "LDL", "HDL", "Non-HDL"],
    },
    {
      head: "Inflammation",
      items: ["hs-CRP", "Omega-3"],
    },
    {
      head: "Organ",
      items: ["ALT", "GGT", "Creatinine", "eGFR"],
    },
    {
      head: "Nutrition",
      items: ["Vitamin D", "Ferritin", "B12", "TSH"],
    },
  ];
  return (
    <div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        Panel / 40+ markers
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {groups.map((g, i) => (
          <div key={i}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.ink,
                borderBottom: `1px solid ${C.ink}`,
                paddingBottom: 4,
                marginBottom: 8,
                letterSpacing: "-0.005em",
              }}
            >
              {g.head}
            </div>
            {g.items.map((it, j) => (
              <div
                key={j}
                style={{
                  fontSize: 12,
                  color: C.inkMuted,
                  lineHeight: 1.8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{it}</span>
                <span
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 9,
                    color: C.inkFaint,
                  }}
                >
                  *
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Artifact 3: Doctor profile card
// =============================================================================
function DoctorArtifact() {
  return (
    <div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
        Medical lead
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingBottom: 18,
          borderBottom: `1px solid ${C.rule}`,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            background: C.ink,
            color: C.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          MJ
        </div>
        <div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Dr. Marcus
            <br />
            Johansson
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.inkMuted,
              marginTop: 6,
            }}
          >
            Leg. lakare / Internal medicine
          </div>
        </div>
      </div>

      <dl
        style={{
          margin: 0,
          fontSize: 12,
          color: C.inkMuted,
          lineHeight: 1.7,
        }}
      >
        {[
          ["Education", "Karolinska Institutet, 2008"],
          ["Training", "Internal medicine / metabolic"],
          ["Experience", "15+ years primary care"],
          ["Languages", "Swedish / English"],
          ["License", "Socialstyrelsen #14837"],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr",
              gap: 12,
              padding: "5px 0",
              borderBottom: `1px solid ${C.ruleSoft}`,
            }}
          >
            <dt
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {k}
            </dt>
            <dd
              style={{
                margin: 0,
                color: C.ink,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// =============================================================================
// Artifact 4: Training plan excerpt
// =============================================================================
function CoachArtifact() {
  const week = [
    { d: "Mon", name: "Zone 2 cycle", detail: "45 min, HR 125-135" },
    { d: "Tue", name: "Full body lift", detail: "3 x 8 back squat @ 55kg" },
    { d: "Wed", name: "Rest", detail: "Walk 6,000 steps" },
    { d: "Thu", name: "Zone 2 cycle", detail: "50 min, HR 125-135" },
    { d: "Fri", name: "Upper push", detail: "4 x 6 bench @ 40kg" },
    { d: "Sat", name: "Long walk", detail: "90 min outdoor" },
    { d: "Sun", name: "Yoga", detail: "40 min, mobility focus" },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          Training / Week 14
        </div>
        <div style={{ ...TYPE.mono, color: C.rust }}>Coach Lina</div>
      </div>
      <div>
        {week.map((w, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "42px 1fr auto",
              gap: 14,
              padding: "10px 0",
              borderBottom:
                i < week.length - 1
                  ? `1px solid ${C.ruleSoft}`
                  : "1px solid transparent",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                color: C.inkFaint,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {w.d}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.ink,
                letterSpacing: "-0.005em",
              }}
            >
              {w.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.inkMuted,
                textAlign: "right",
              }}
            >
              {w.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Artifact 5: Profile mini
// =============================================================================
function ProfileArtifactMini() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          Profile / Change log
        </div>
        <div style={{ ...TYPE.mono, color: C.sage }}>Live</div>
      </div>
      {[
        { d: "27.03.26", e: "Blood panel #6 imported", t: "Precura" },
        { d: "15.01.26", e: "FINDRISC model re-run", t: "Engine" },
        { d: "10.01.26", e: "Doctor note signed", t: "Marcus J." },
        { d: "08.01.26", e: "Training plan adjusted", t: "Coach Lina" },
        { d: "05.01.26", e: "1177 history imported", t: "System" },
        { d: "04.01.26", e: "Membership started", t: "You" },
      ].map((l, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "70px 1fr auto",
            gap: 12,
            padding: "10px 0",
            borderBottom: `1px solid ${C.ruleSoft}`,
            alignItems: "baseline",
          }}
        >
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              color: C.inkFaint,
              letterSpacing: "0.08em",
            }}
          >
            {l.d}
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.ink,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {l.e}
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 10,
              color: C.rust,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {l.t}
          </div>
        </div>
      ))}
    </div>
  );
}
