"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * FINAL CTA - Confident closing line on deep ink background with
 * butter accent. Large italic second half of headline, single primary
 * CTA, subtle trust disclaimer underneath, small kit stamp as a
 * visual echo of the hero welcome kit.
 */
export function FinalCTA() {
  return (
    <section
      id="cta"
      style={{
        background: C.ink,
        color: C.canvasSoft,
        padding: "160px 32px",
        fontFamily: SYSTEM_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Warm radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "120%",
          background:
            "radial-gradient(closest-side, rgba(233,181,71,0.16), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(closest-side, rgba(201,87,58,0.14), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 960,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Top stamp echo */}
        <motion.div
          initial={{ opacity: 0, y: 12, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            background: "rgba(251,247,240,0.06)",
            border: "1.5px dashed rgba(233,181,71,0.5)",
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.butter,
            marginBottom: 36,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.butter,
            }}
          />
          Accepting new members / Sweden
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(44px, 6vw, 88px)",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            fontWeight: 600,
            color: C.canvasSoft,
            margin: 0,
            marginBottom: 28,
          }}
        >
          You have one body.{" "}
          <span
            style={{
              color: C.butter,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Watch the trend, not the snapshot.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            color: "rgba(251,247,240,0.72)",
            margin: 0,
            marginBottom: 48,
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Your welcome kit ships within 72 hours of signup. A Swedish doctor
          reads your first panel. Your living profile stays with you for as
          long as you want it to.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          <Link
            href="#pricing"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "18px 36px",
              background: C.butter,
              color: C.ink,
              borderRadius: 18,
              textDecoration: "none",
              boxShadow: C.shadowLift,
              minWidth: 300,
            }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                marginBottom: 2,
              }}
            >
              Start your membership
            </span>
            <span
              style={{
                fontSize: 13,
                color: "rgba(28,26,23,0.66)",
                fontWeight: 500,
              }}
            >
              2,995 SEK / year / Cancel anytime
            </span>
          </Link>
          <Link
            href="#faq"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "17px 26px",
              background: "transparent",
              color: C.canvasSoft,
              border: "1px solid rgba(251,247,240,0.22)",
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Read the FAQ first
          </Link>
        </motion.div>

        {/* Disclaimer row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            display: "flex",
            gap: 28,
            justifyContent: "center",
            flexWrap: "wrap",
            fontSize: 12,
            color: "rgba(251,247,240,0.5)",
            paddingTop: 32,
            borderTop: "1px solid rgba(251,247,240,0.08)",
            maxWidth: 780,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 680, lineHeight: 1.6 }}>
            Precura is a predictive health service, not a substitute for
            medical care. We do not diagnose or treat disease. If you have
            urgent symptoms, contact 1177 or your vardcentral. Members with
            findings needing clinical follow-up are referred to Swedish
            primary care.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
