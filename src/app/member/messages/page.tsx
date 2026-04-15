"use client";

import React from "react";
import { motion } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import { buildSidebar, rebrandDoctor } from "@/components/member/data";
import { MESSAGES, DOCTOR_NOTES } from "@/lib/v2/mock-patient";

// ============================================================================
// /member/messages - your conversation with Dr. Tomas.
// Two zones:
//   1. Pinned clinical notes (the DOCTOR_NOTES array) as editorial cards
//   2. Chronological message thread (the MESSAGES array) as warm paper
//      letters, alternating sender alignment left/right
// ============================================================================

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const PATIENT_FIRST = "Anna";
const PATIENT_INITIALS = "A";

export default function MessagesPage() {
  return (
    <MemberShell sidebar={buildSidebar("/member/messages")} userInitials="A">
      <div
        style={{
          padding: "36px 28px 40px",
          fontFamily: SYSTEM_FONT,
          maxWidth: 780,
        }}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.terracotta,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Your conversation
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.028em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              marginBottom: 10,
            }}
          >
            Notes and messages{" "}
            <span
              style={{
                color: C.inkMuted,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 500,
              }}
            >
              from Dr. Tomas.
            </span>
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: C.inkMuted,
              margin: 0,
              marginBottom: 36,
              maxWidth: 560,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            Every clinical note and every message between you two,
            in one place. Dr. Tomas replies within 24 hours (12 hours
            on Member Plus).
          </p>
        </motion.div>

        {/* Pinned clinical notes */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.inkMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            On file
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {DOCTOR_NOTES.map((note, i) => (
              <ClinicalNoteCard
                key={note.date}
                date={note.date}
                type={note.type}
                body={rebrandDoctor(note.note)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Chat thread */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.inkMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Messages
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginBottom: 28,
            }}
          >
            {MESSAGES.map((m, i) => (
              <MessageBubble
                key={m.id}
                from={m.from}
                date={m.date}
                text={rebrandDoctor(m.text)}
                index={i}
              />
            ))}
          </div>

          {/* Compose stub */}
          <ComposeStub />
        </div>
      </div>
    </MemberShell>
  );
}

// ============================================================================
// ClinicalNoteCard - featured clinical note from DOCTOR_NOTES
// ============================================================================

function ClinicalNoteCard({
  date,
  type,
  body,
  index,
}: {
  date: string;
  type: string;
  body: string;
  index: number;
}) {
  // Show just the first paragraph as the preview, rest after a divider.
  const paragraphs = body.split(/\n\n/).filter((p) => p.trim().length > 0);
  const first = paragraphs[0] ?? body;
  const rest = paragraphs.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.06 }}
      style={{
        padding: "22px 26px 22px",
        background: C.canvasSoft,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
      }}
    >
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
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.canvasSoft,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(68,90,74,0.28)",
          }}
        >
          {DOCTOR.initials}
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.terracotta,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            {type}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.ink,
            }}
          >
            {DOCTOR.name}
            <span
              style={{
                color: C.inkFaint,
                fontWeight: 400,
                marginLeft: 8,
                fontFamily: '"SF Mono", ui-monospace, monospace',
                fontSize: 11,
              }}
            >
              {formatNoteDate(date)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 15,
          lineHeight: 1.65,
          color: C.inkSoft,
          letterSpacing: "-0.005em",
        }}
      >
        <p style={{ margin: 0, marginBottom: rest.length > 0 ? 14 : 0 }}>
          {first}
        </p>
        {rest.map((p, i) => (
          <p
            key={i}
            style={{
              margin: 0,
              marginTop: 12,
            }}
          >
            {p}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MessageBubble - single chat message. Patient right-aligned, doctor left.
// ============================================================================

function MessageBubble({
  from,
  date,
  text,
  index,
}: {
  from: "patient" | "doctor";
  date: string;
  text: string;
  index: number;
}) {
  const isDoctor = from === "doctor";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        flexDirection: isDoctor ? "row" : "row-reverse",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: isDoctor
            ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`
            : `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isDoctor ? C.canvasSoft : C.ink,
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: C.shadowSoft,
        }}
      >
        {isDoctor ? DOCTOR.initials : PATIENT_INITIALS}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          maxWidth: 520,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 6,
            justifyContent: isDoctor ? "flex-start" : "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.005em",
            }}
          >
            {isDoctor ? DOCTOR.name : PATIENT_FIRST}
          </span>
          <span
            style={{
              fontSize: 10,
              color: C.inkFaint,
              fontFamily: '"SF Mono", ui-monospace, monospace',
              letterSpacing: "0.02em",
            }}
          >
            {formatTime(date)}
          </span>
        </div>
        <div
          style={{
            padding: "14px 18px",
            background: isDoctor ? C.canvasSoft : C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 16,
            borderTopLeftRadius: isDoctor ? 4 : 16,
            borderTopRightRadius: isDoctor ? 16 : 4,
            fontSize: 14,
            lineHeight: 1.6,
            color: C.inkSoft,
            letterSpacing: "-0.005em",
            boxShadow: C.shadowSoft,
          }}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// ComposeStub - visual-only send input
// ============================================================================

function ComposeStub() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      style={{
        padding: "14px 18px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 100,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: C.shadowSoft,
      }}
    >
      <input
        type="text"
        placeholder="Write to Dr. Tomas..."
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 14,
          fontFamily: SYSTEM_FONT,
          color: C.ink,
          letterSpacing: "-0.005em",
        }}
      />
      <button
        style={{
          padding: "9px 18px",
          background: C.terracotta,
          color: C.canvasSoft,
          border: "none",
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
          letterSpacing: "-0.005em",
          cursor: "pointer",
          boxShadow:
            "0 6px 14px -6px rgba(201,87,58,0.4), 0 2px 4px rgba(201,87,58,0.18)",
        }}
      >
        Send
      </button>
    </motion.div>
  );
}
