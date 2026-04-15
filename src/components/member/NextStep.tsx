"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

export function NextStep({
  eyebrow,
  title,
  action,
  subtle = false,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  /**
   * subtle = calm/neutral state (between-panels, no urgency).
   * Renders in stone/ink neutral tones, no terracotta.
   * Non-subtle is reserved for onboarding asks (new-member kit tracking, etc).
   */
  subtle?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      style={{
        margin: "0 20px 18px",
        padding: "22px 22px 22px",
        background: subtle ? C.stoneSoft : C.butterTint,
        border: `1px solid ${subtle ? C.stone : C.butterSoft}`,
        borderRadius: 22,
        boxShadow: C.shadowSoft,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.inkMuted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          marginBottom: action ? 18 : 0,
        }}
      >
        {title}
      </div>
      {action && (
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "13px 22px",
            background: C.terracotta,
            color: C.canvasSoft,
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            letterSpacing: "-0.005em",
            cursor: "pointer",
            boxShadow:
              "0 10px 22px -10px rgba(201,87,58,0.45), 0 2px 6px rgba(201,87,58,0.18)",
          }}
        >
          {action}
        </button>
      )}
    </motion.section>
  );
}
