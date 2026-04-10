"use client";

import React, { useState } from "react";
import { MESSAGES, DOCTOR_NOTES } from "@/lib/v2/mock-patient";

/* =====================================================================
   MESSAGES - iMessage-style doctor conversation
   ===================================================================== */

export default function MessagesPage() {
  const [messageText, setMessageText] = useState("");

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Doctor header */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 20,
            background: "linear-gradient(135deg, #B794F6, #9F7AEA)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 20,
            margin: "0 auto 12px",
          }}
        >
          MJ
        </div>
        <h1 style={{ color: "#3D2645", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
          Dr. Marcus Johansson
        </h1>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: "0 0 4px" }}>
          Your Precura physician
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#81C995" }} />
          <span style={{ color: "#81C995", fontSize: 12, fontWeight: 500 }}>
            Typically responds within a few hours
          </span>
        </div>
      </div>

      {/* Conversation */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MESSAGES.map((msg) => {
            const isDoctor = msg.from === "doctor";
            const time = new Date(msg.date);
            const timeStr = time.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isDoctor ? "flex-start" : "flex-end",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: 18,
                    borderTopLeftRadius: isDoctor ? 6 : 18,
                    borderTopRightRadius: isDoctor ? 18 : 6,
                    background: isDoctor ? "#FDFBFF" : "linear-gradient(135deg, #B794F6, #9F7AEA)",
                    border: isDoctor ? "1px solid #EFE6F8" : "none",
                  }}
                >
                  {isDoctor && (
                    <p style={{ color: "#B794F6", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>
                      Dr. Johansson
                    </p>
                  )}
                  <p
                    style={{
                      color: isDoctor ? "#3D2645" : "#FFFFFF",
                      fontSize: 14,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
                <span
                  style={{
                    color: "#8B7B95",
                    fontSize: 11,
                    marginTop: 4,
                    paddingLeft: isDoctor ? 4 : 0,
                    paddingRight: isDoctor ? 0 : 4,
                  }}
                >
                  {timeStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message input */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "14px 16px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-end gap-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message to Dr. Johansson..."
            rows={2}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              lineHeight: 1.5,
              color: "#3D2645",
              fontFamily: "inherit",
              background: "transparent",
            }}
          />
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: messageText.trim()
                ? "linear-gradient(135deg, #B794F6, #9F7AEA)"
                : "#F3EAFF",
              border: "none",
              cursor: messageText.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={messageText.trim() ? "#FFFFFF" : "#D4C5E0"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Recent doctor notes */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>
          Clinical Notes
        </h2>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: "0 0 14px" }}>
          Notes from your Precura consultations. These are part of your medical record.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DOCTOR_NOTES.map((note) => (
            <div
              key={note.date}
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "#FDFBFF",
                border: "1px solid #EFE6F8",
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <div>
                  <p style={{ color: "#3D2645", fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {note.type}
                  </p>
                  <p style={{ color: "#8B7B95", fontSize: 12, margin: 0 }}>
                    {note.author} - {note.date}
                  </p>
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#F3EAFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B794F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
              </div>
              <p
                style={{
                  color: "#8B7B95",
                  fontSize: 13,
                  margin: 0,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {note.note.length > 300
                  ? note.note.substring(0, 300) + "..."
                  : note.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
