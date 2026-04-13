"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FINAL CTA
 * ---------
 * Confident closing statement. Warm cream-deep canvas, a large statement,
 * two CTAs (primary lingon + secondary outline), and a required medical
 * disclaimer beneath. Echoes the hero clarity promise, not the hero widget.
 */
export function FinalCTA() {
  return (
    <section
      style={{
        position: "relative",
        background: C.creamDeep,
        padding: "140px 32px 140px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        overflow: "hidden",
      }}
    >
      {/* Warm wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -220,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: 720,
          background:
            "radial-gradient(ellipse at center, rgba(184,50,44,0.10), rgba(184,50,44,0) 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -280,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 640,
          background:
            "radial-gradient(ellipse at center, rgba(62,107,84,0.08), rgba(62,107,84,0) 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 920,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 100,
            background: C.paper,
            border: `1px solid ${C.inkLine}`,
            boxShadow: C.shadow,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.euc,
              boxShadow: `0 0 0 4px ${C.eucBg}`,
            }}
          />
          <span style={{ ...TYPE.small, color: C.inkSoft, fontWeight: 500 }}>
            2,148 members / 80+ clinics / cancel anytime
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.displayHuge,
            margin: "0 0 24px",
            color: C.ink,
          }}
        >
          Catch the drift{" "}
          <span style={{ color: C.lingon }}>
            before it catches you.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TYPE.lead,
            color: C.inkSoft,
            margin: "0 auto 44px",
            maxWidth: 620,
          }}
        >
          Twenty minutes at a clinic near you. A real Swedish doctor on your
          results. A coach in your corner. A profile that keeps growing for
          the rest of your life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 28px",
              borderRadius: 14,
              background: `linear-gradient(180deg, ${C.lingon} 0%, ${C.lingonDeep} 100%)`,
              color: C.paper,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              boxShadow: `0 10px 24px ${C.lingonSoft}`,
            }}
          >
            Start your membership
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 28px",
              borderRadius: 14,
              background: C.paper,
              color: C.ink,
              border: `1.5px solid ${C.ink}`,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              boxShadow: C.shadow,
            }}
          >
            Talk to Dr. Marcus first
          </motion.button>
        </motion.div>

        {/* Reassurance row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginBottom: 40,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <ShieldCheck size={14} color={C.euc} />
          <span>
            No charge until you confirm your first panel. Cancel in three
            clicks.
          </span>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "20px 24px",
            background: C.paper,
            borderRadius: 16,
            border: `1px solid ${C.inkLine}`,
            fontSize: 12,
            lineHeight: 1.55,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.inkSoft,
              marginBottom: 8,
            }}
          >
            Medical disclaimer
          </div>
          Precura is a preventive health membership service. Our blood
          panels, risk scores, and doctor notes are designed to complement,
          not replace, care from your primary care physician. If you are
          experiencing an urgent medical symptom, call 112 or contact 1177
          Vardguiden immediately. Precura does not diagnose, treat, or cure
          any disease.
        </motion.div>
      </div>
    </section>
  );
}
