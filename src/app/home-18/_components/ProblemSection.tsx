"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * PROBLEM - Brief, punchy section. Large statement on cream canvas,
 * followed by three supporting stats with understated chart-ish
 * visualizations that don't compete with the hero.
 */
export function ProblemSection() {
  return (
    <section
      style={{
        background: C.paper,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.label,
            color: C.lingon,
            marginBottom: 20,
          }}
        >
          The problem
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.displayLarge,
            margin: 0,
            marginBottom: 24,
            maxWidth: 920,
          }}
        >
          Roughly half of Swedes with type 2 diabetes don't know they have it.{" "}
          <span style={{ color: C.inkMuted }}>
            The data existed for years. Nobody connected the dots.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.lead,
            color: C.inkSoft,
            maxWidth: 680,
            margin: "0 0 64px",
          }}
        >
          Annual bloodwork, scattered across providers. A single GP visit a
          year. No trend lines, no risk models, no one watching the slow drift
          toward disease. Precura is the layer that watches.
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
          }}
          className="home18-problem-grid"
        >
          <StatCard
            figure="50%"
            label="of Swedish T2D cases"
            sub="go undiagnosed for years"
            color={C.lingon}
            delay={0}
          />
          <StatCard
            figure="1 per year"
            label="average GP visit"
            sub="zero trend analysis in between"
            color={C.amberDeep}
            delay={0.1}
          />
          <StatCard
            figure="40+"
            label="biomarkers Precura tracks"
            sub="across every panel"
            color={C.euc}
            delay={0.2}
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          :global(.home18-problem-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function StatCard({
  figure,
  label,
  sub,
  color,
  delay,
}: {
  figure: string;
  label: string;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.cream,
        borderRadius: 24,
        padding: "32px 28px",
        border: `1px solid ${C.inkLine}`,
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 700,
          color,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {figure}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: C.ink,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...TYPE.small,
          color: C.inkMuted,
        }}
      >
        {sub}
      </div>
    </motion.div>
  );
}
