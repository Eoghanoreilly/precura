"use client";

/**
 * WHAT YOU GET - 6 features matching the 5 pillars. Not a 3-card icon
 * grid (explicitly banned). This is a disciplined 12-column asymmetric
 * layout with text rows on the left and bespoke data visuals on the
 * right, split into two side-by-side columns.
 *
 * The six features map to the 5 pillars:
 *  1. Your risk profile (next-level science + biomarkers)
 *  2. Biomarker trajectories (biomarkers)
 *  3. Dr. Marcus (personal doctor's touch)
 *  4. Your coach + training plan (active coaching)
 *  5. AI chat (next-level)
 *  6. Quarterly retests (living profile)
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

export function WhatYouGet() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const features = [
    {
      num: "I",
      title: "Your 10-year risk profile",
      body:
        "Three validated models run on every panel. FINDRISC, SCORE2, FRAX. Not generic risk calculators. The same peer-reviewed algorithms used in Swedish primary care, against your full 5-year history.",
      tag: "Science",
    },
    {
      num: "II",
      title: "Biomarker trajectories, not snapshots",
      body:
        "40+ markers including HbA1c, fasting glucose, LDL-C, ApoB, HDL, triglycerides, hs-CRP, fP-insulin, Omega-3 index, vitamin D, ferritin, TSH and eGFR. Every one plotted over time, never a single number in isolation.",
      tag: "Biomarkers",
    },
    {
      num: "III",
      title: "Dr. Marcus Johansson, personally",
      body:
        "A real Swedish GP, Karolinska Institute trained, 15+ years in primary care. He writes the note on your panel, signs off on every risk report, and is one message away for 12 months.",
      tag: "Doctor",
    },
    {
      num: "IV",
      title: "A personal coach and a real training plan",
      body:
        "An assigned coach builds a progressive training programme from your metabolic profile. Real exercises, real sets, real weights. Designed against your actual markers, not a marketing persona.",
      tag: "Coaching",
    },
    {
      num: "V",
      title: "AI chat with full context",
      body:
        "Ask any question about your own data. The model sees every lab, every note, every check-in, every research paper attached to your file. Dr. Marcus reviews anything clinical before it reaches you.",
      tag: "Chat",
    },
    {
      num: "VI",
      title: "Quarterly retests, annual reset",
      body:
        "Your membership includes four blood draws per year. The profile updates with every one. You see the slope, not just the snapshot, and your care team adapts with it.",
      tag: "Cadence",
    },
  ];

  return (
    <section
      ref={ref}
      id="what"
      style={{
        background: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
            marginBottom: 96,
          }}
        >
          <div style={{ gridColumn: "span 7" }} className="home12-wyg-head">
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 20,
              }}
            >
              05 / What you get
            </div>
            <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink }}>
              Six things.{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                Working on one person. You.
              </span>
            </h2>
          </div>
          <p
            style={{
              ...TYPE.body,
              color: C.inkSoft,
              gridColumn: "9 / span 4",
              alignSelf: "end",
              margin: 0,
            }}
            className="home12-wyg-sub"
          >
            We took the five things a private GP, a longevity clinic and a
            certified trainer would do for you separately, and built them
            into one subscription.
          </p>
        </div>

        {/* The feature rows */}
        <div
          style={{
            borderTop: `1px solid ${C.line}`,
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{
                duration: 0.9,
                delay: 0.08 * i,
                ease: EASE.out,
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: GRID.columnGap,
                padding: "40px 0",
                borderBottom: `1px solid ${C.line}`,
                alignItems: "baseline",
              }}
              className="home12-wyg-row"
            >
              <div
                style={{
                  gridColumn: "span 1",
                  fontFamily: MONO,
                  fontSize: 12,
                  color: C.accent,
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                {f.num}
              </div>
              <h3
                style={{
                  gridColumn: "span 5",
                  ...TYPE.h3,
                  margin: 0,
                  color: C.ink,
                }}
                className="home12-wyg-title"
              >
                {f.title}
              </h3>
              <p
                style={{
                  gridColumn: "span 5",
                  ...TYPE.body,
                  color: C.inkSoft,
                  margin: 0,
                }}
                className="home12-wyg-body"
              >
                {f.body}
              </p>
              <div
                style={{
                  gridColumn: "span 1",
                  textAlign: "right",
                  ...TYPE.eyebrow,
                  color: C.inkMuted,
                }}
                className="home12-wyg-tag"
              >
                {f.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-wyg-head),
          :global(.home12-wyg-sub) {
            grid-column: span 12 !important;
          }
          :global(.home12-wyg-row) {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          :global(.home12-wyg-title),
          :global(.home12-wyg-body) {
            grid-column: span 1 !important;
          }
          :global(.home12-wyg-tag) {
            grid-column: span 1 !important;
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
}
