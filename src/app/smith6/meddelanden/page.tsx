"use client";

import React from "react";
import {
  MESSAGES,
  DOCTOR_NOTES,
  PATIENT,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Reusable building blocks                                            */
/* ------------------------------------------------------------------ */

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #D1E9F6",
        borderRadius: 4,
        boxShadow: "0 1px 2px rgba(13,58,111,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, marginBottom: subtitle ? 4 : 16 }}>{title}</h2>
      {subtitle && <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 16px" }}>{subtitle}</p>}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Message bubble                                                      */
/* ------------------------------------------------------------------ */

function MessageBubble({ msg }: { msg: typeof MESSAGES[number] }) {
  const isDoctor = msg.from === "doctor";
  const date = new Date(msg.date);
  const timeStr = date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("sv-SE");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 4,
          background: isDoctor ? "#D1E9F6" : "#EDF2F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0D3A6F",
          fontWeight: 600,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {isDoctor ? "MJ" : "AB"}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
          <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 600 }}>
            {isDoctor ? "Dr. Marcus Johansson" : PATIENT.name}
          </span>
          <span style={{ color: "#4B7BA7", fontSize: 14 }}>
            {dateStr}, {timeStr}
          </span>
        </div>
        <div
          style={{
            background: isDoctor ? "#F0F9FF" : "#EDF2F7",
            border: `1px solid ${isDoctor ? "#D1E9F6" : "#D1E9F6"}`,
            borderRadius: 4,
            padding: 16,
          }}
        >
          <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            {msg.text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MeddelandenPage() {
  return (
    <>
      <h1 style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Meddelanden (Messages)
      </h1>
      <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 32px" }}>
        Secure messages with your Precura doctor. All communication is encrypted and stored in your health record.
      </p>

      {/* Message thread */}
      <Section title="Conversation with Dr. Johansson" subtitle="Regarding blood test results, March 2026">
        <Card style={{ padding: 24 }}>
          {MESSAGES.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Reply box (placeholder) */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid #D1E9F6",
            }}
          >
            <div
              style={{
                background: "#EDF2F7",
                border: "1px solid #D1E9F6",
                borderRadius: 4,
                padding: 16,
                minHeight: 80,
                color: "#4B7BA7",
                fontSize: 16,
              }}
            >
              Write a message to Dr. Johansson...
            </div>
            <div className="flex justify-end" style={{ marginTop: 12 }}>
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "#0891B2",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  minHeight: 48,
                }}
              >
                Send message
              </button>
            </div>
          </div>
        </Card>
      </Section>

      {/* Doctor notes */}
      <Section title="Doctor's notes (journalanteckningar)" subtitle="Clinical notes from your Precura consultations">
        {DOCTOR_NOTES.map((note, i) => (
          <Card key={i} style={{ padding: 24, marginBottom: i < DOCTOR_NOTES.length - 1 ? 16 : 0 }}>
            <div className="flex items-start justify-between flex-wrap gap-2" style={{ marginBottom: 16 }}>
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    background: "#D1E9F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0D3A6F",
                    fontWeight: 600,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  MJ
                </div>
                <div>
                  <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: 0 }}>
                    {note.author}
                  </p>
                  <p style={{ color: "#4B7BA7", fontSize: 16, margin: "2px 0 0" }}>
                    {note.type}
                  </p>
                </div>
              </div>
              <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>
                {new Date(note.date).toLocaleDateString("sv-SE")}
              </span>
            </div>

            {/* Render note paragraphs */}
            {note.note.split("\n\n").map((paragraph, pi) => (
              <p
                key={pi}
                style={{
                  color: "#0D3A6F",
                  fontSize: 16,
                  lineHeight: 1.7,
                  margin: pi === 0 ? 0 : "16px 0 0",
                }}
              >
                {paragraph}
              </p>
            ))}
          </Card>
        ))}
      </Section>

      {/* Contact information */}
      <Section title="Contact information">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "Your Precura doctor", value: "Dr. Marcus Johansson" },
                { label: "Response time", value: "Within 24 hours on weekdays" },
                { label: "Emergency", value: "Call 112 or visit your nearest emergency room" },
                { label: "1177 Vardguiden", value: "Call 1177 for medical advice (24/7)" },
                { label: "Primary care center", value: PATIENT.vardcentral },
              ].map((row, i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 500, width: "40%" }}>{row.label}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>
    </>
  );
}
