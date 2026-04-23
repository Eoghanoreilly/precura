"use client";

import React from "react";
import { C, DOCTOR } from "@/components/member/tokens";

// ============================================================================
// Doctor progress track - Dr. Tomas review state tracker
// ============================================================================

const CARD_STYLE: React.CSSProperties = {
  background: "white",
  border: `1px solid ${C.lineCard}`,
  borderRadius: 18,
  boxShadow: C.shadowSoft,
};

const DOC_AVATAR_SM: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: C.canvasSoft,
  fontSize: 12,
  fontWeight: 700,
  flexShrink: 0,
};

export function DoctorProgressTrack() {
  return (
    <div style={{ ...CARD_STYLE, padding: 22, marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={DOC_AVATAR_SM}>{DOCTOR.initials}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
            {DOCTOR.name}
          </div>
          <div style={{ fontSize: 12, color: C.inkFaint }}>
            Reviewing your panel
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          margin: "20px 0",
        }}
      >
        {/* Done: Panel received */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: C.good,
              flexShrink: 0,
            }}
          />
          Panel received
        </div>
        <div
          style={{
            width: 40,
            height: 2,
            background: C.good,
          }}
        />
        {/* Active: Doctor review */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: `2px solid ${C.terracotta}`,
              background: "white",
              flexShrink: 0,
              boxShadow: "0 0 0 3px rgba(201,87,58,0.15)",
            }}
          />
          Doctor review
        </div>
        <div style={{ width: 40, height: 2, background: C.stone }} />
        {/* Pending: Notes ready */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: `2px solid ${C.sageSoft}`,
              background: "white",
              flexShrink: 0,
            }}
          />
          Notes ready
        </div>
      </div>
    </div>
  );
}
