"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, DOCTOR } from "./tokens";

export function NoteFromDoctor({
  preview,
  noteDate,
  primaryAction,
}: {
  preview: string;
  noteDate: string;
  /**
   * Optional primary action rendered as a button at the bottom of the card.
   * Used on panel-results-day to surface the "Book a call with Dr. Tomas"
   * resolution right next to the note that created the expectation.
   */
  primaryAction?: { label: string; onClick?: () => void };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25 }}
      style={{
        margin: "16px 20px 22px",
        padding: "22px 22px 18px",
        background: C.canvasSoft,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
        position: "relative",
      }}
    >
      {/* Header row: avatar + eyebrow + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.canvasSoft,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(68,90,74,0.28)",
          }}
        >
          {DOCTOR.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.terracotta,
              marginBottom: 3,
            }}
          >
            A note from your doctor
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.005em",
            }}
          >
            {DOCTOR.name}
          </div>
        </div>
      </div>

      {/* Italic pull-quote */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: "italic",
          fontSize: 16,
          lineHeight: 1.55,
          color: C.inkSoft,
          marginBottom: 16,
        }}
      >
        &ldquo;{preview}&rdquo;
      </div>

      {/* Primary action (e.g. "Schedule a call") - resolves the note's ask */}
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 22px",
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
            marginBottom: 16,
          }}
        >
          {primaryAction.label}
        </button>
      )}

      {/* Footer: date + read full */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 14,
          borderTop: `1px solid ${C.lineSoft}`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: C.inkFaint,
            letterSpacing: "0.02em",
            fontFamily: '"SF Mono", ui-monospace, monospace',
          }}
        >
          {noteDate}
        </span>
        <Link
          href="/member/messages"
          style={{
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            color: C.terracotta,
            letterSpacing: "-0.005em",
            textDecoration: "none",
          }}
        >
          Read full note
        </Link>
      </div>
    </motion.div>
  );
}
