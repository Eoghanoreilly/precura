"use client";

import React from "react";
import type { Annotation } from "@/lib/data/types";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import { formatShortDate } from "../categoryMap";

// ============================================================================
// Doctor letter component
// ============================================================================

const SERIF_FONT = 'Georgia, "Times New Roman", serif';

const DOC_AVATAR: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: C.canvasSoft,
  fontSize: 14,
  fontWeight: 700,
  flexShrink: 0,
};

const DOC_AVATAR_SM: React.CSSProperties = {
  ...DOC_AVATAR,
  width: 38,
  height: 38,
  fontSize: 12,
};

export function DoctorLetter({
  annotation,
  compact,
}: {
  annotation: Annotation;
  compact?: boolean;
}) {
  const isCompact = compact || false;
  return (
    <div
      style={{
        padding: isCompact ? "22px 26px" : "28px 32px",
        background: "#FAFAF5",
        borderRadius: 22,
        border: `1px solid ${C.lineCard}`,
        boxShadow: `0 1px 2px rgba(28,26,23,0.03), 0 8px 24px rgba(28,26,23,0.06)`,
        marginBottom: 20,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: isCompact ? 14 : 20,
        }}
      >
        <div style={isCompact ? DOC_AVATAR_SM : DOC_AVATAR}>
          {DOCTOR.initials}
        </div>
        <div>
          <div
            style={{
              fontSize: isCompact ? 14 : 15,
              fontWeight: 600,
              color: C.ink,
            }}
          >
            {isCompact ? `Dr. ${DOCTOR.firstName}` : DOCTOR.name}
          </div>
          <div style={{ fontSize: 13, color: C.inkFaint }}>
            {isCompact
              ? formatShortDate(annotation.created_at)
              : `Licensed GP / Written ${formatShortDate(annotation.created_at)}`}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: isCompact ? 15 : 16,
          color: C.inkSoft,
          lineHeight: 1.75,
          fontFamily: SERIF_FONT,
        }}
      >
        {annotation.body.split("\n").map((paragraph, i) => (
          <p key={i} style={{ marginBottom: i === annotation.body.split("\n").length - 1 ? 0 : 14 }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
