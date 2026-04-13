"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FINAL CTA - confident closing. Warm cream background, editorial
 * headline, primary terra CTA, quiet secondary, medical disclaimer.
 */

export function FinalCTA() {
  return (
    <section
      style={{
        background: C.creamDeep,
        padding: "160px 32px 140px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.mono,
            color: C.terra,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          Start today
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.displayXL,
            margin: 0,
            marginBottom: 22,
            maxWidth: 960,
            marginInline: "auto",
          }}
        >
          You have been one chart away from your own health all along.{" "}
          <span style={{ color: C.terra, fontStyle: "italic", fontWeight: 600 }}>
            Let us build it.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.lead,
            color: C.inkSoft,
            margin: 0,
            marginBottom: 44,
            maxWidth: 640,
            marginInline: "auto",
          }}
        >
          A Swedish doctor, a real coach, four blood panels a year, and a
          profile that actually remembers you. Join 2,000+ Swedish members
          who stopped guessing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 26,
          }}
        >
          <Link
            href="#pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 32px",
              background: C.terra,
              color: C.creamSoft,
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              boxShadow: "0 14px 36px rgba(211,88,56,0.35)",
            }}
          >
            Start membership
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M3 9h12M10 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href="#science"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "18px 28px",
              background: "transparent",
              color: C.ink,
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              border: `1px solid ${C.line}`,
            }}
          >
            Read the science
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            flexWrap: "wrap",
            ...TYPE.small,
            color: C.inkMuted,
            marginBottom: 42,
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Dot />
            Reviewed by Dr. Marcus Johansson
          </span>
          <Sep />
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Dot />
            Cancel anytime
          </span>
          <Sep />
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Dot />
            Full refund in first 30 days
          </span>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            ...TYPE.tiny,
            color: C.inkFaint,
            textTransform: "none",
            letterSpacing: 0,
            lineHeight: 1.6,
            maxWidth: 560,
            marginInline: "auto",
            paddingTop: 28,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          Precura is a predictive health subscription, not a medical
          insurance or emergency service. Risk models are decision-support
          tools, not diagnoses. If you have acute symptoms, call 112 in
          Sweden or contact 1177 Vardguiden.
        </motion.div>
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: 50,
        background: C.sage,
      }}
    />
  );
}

function Sep() {
  return (
    <span
      style={{
        width: 1,
        height: 12,
        background: C.line,
      }}
    />
  );
}
