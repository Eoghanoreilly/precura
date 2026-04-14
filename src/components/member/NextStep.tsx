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
        background: subtle ? C.stoneSoft : C.terracottaTint,
        border: `1px solid ${subtle ? C.stone : C.terracottaSoft}`,
        borderRadius: 22,
        boxShadow: C.shadowSoft,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: subtle ? C.inkMuted : C.terracottaDeep,
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
            background: C.ink,
            color: C.canvasSoft,
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            letterSpacing: "-0.005em",
            cursor: "pointer",
            boxShadow: "0 8px 18px -8px rgba(28,26,23,0.32)",
          }}
        >
          {action}
        </button>
      )}
    </motion.section>
  );
}
