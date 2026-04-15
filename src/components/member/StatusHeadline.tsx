"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

export type StatusTone = "attention" | "neutral" | "good";

export function StatusHeadline({
  text,
  tone = "neutral",
}: {
  text: string;
  tone?: StatusTone;
}) {
  const accentColor =
    tone === "attention" ? C.terracotta : tone === "good" ? C.sage : C.ink;

  // Split on the first period + space so we can accent the second clause.
  const firstPeriod = text.indexOf(". ");
  const firstClause =
    firstPeriod >= 0 ? text.slice(0, firstPeriod + 1) : text;
  const secondClause =
    firstPeriod >= 0 ? text.slice(firstPeriod + 2) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      style={{
        padding: "0 0 18px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <h1
        style={{
          fontSize: "clamp(26px, 7.2vw, 32px)",
          lineHeight: 1.18,
          letterSpacing: "-0.028em",
          fontWeight: 600,
          color: C.ink,
          margin: 0,
        }}
      >
        {firstClause}{" "}
        {secondClause && (
          <span
            style={{
              color: accentColor,
              fontWeight: 500,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            {secondClause}
          </span>
        )}
      </h1>
    </motion.div>
  );
}
