"use client";

import React, { useState, useRef, useEffect } from "react";
import { MESSAGES, DOCTOR_NOTES, PATIENT } from "@/lib/v2/mock-patient";

/* ================================================================
   Message Bubble
   ================================================================ */
function MessageBubble({
  text,
  from,
  time,
  isLast,
}: {
  text: string;
  from: "patient" | "doctor";
  time: string;
  isLast: boolean;
}) {
  const isPatient = from === "patient";
  const timeStr = new Date(time).toLocaleTimeString("en-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex ${isPatient ? "justify-end" : "justify-start"}`}
      style={{ marginBottom: isLast ? 0 : 4 }}
    >
      <div style={{ maxWidth: "80%" }}>
        <div
          style={{
            background: isPatient
              ? "#0A84FF"
              : "#2C2C2E",
            color: "#FFFFFF",
            borderRadius: 18,
            borderBottomRightRadius: isPatient ? 4 : 18,
            borderBottomLeftRadius: isPatient ? 18 : 4,
            padding: "10px 14px",
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.45,
          }}
        >
          {text}
        </div>
        <p
          style={{
            color: "#98989D",
            fontSize: 11,
            fontWeight: 400,
            margin: 0,
            marginTop: 4,
            textAlign: isPatient ? "right" : "left",
            paddingLeft: isPatient ? 0 : 4,
            paddingRight: isPatient ? 4 : 0,
          }}
        >
          {timeStr}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   Page Component
   ================================================================ */
export default function MessagesPage() {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 108px)" }}>
      {/* Doctor header card */}
      <div
        className="px-5 py-4"
        style={{
          background: "#1C1C1E",
          borderBottom: "1px solid #2C2C2E",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #30D158, #28A745)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600 }}>MJ</span>
          </div>
          <div className="flex-1">
            <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: 0 }}>
              Dr. Marcus Johansson
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#30D158",
                }}
              />
              <span style={{ color: "#30D158", fontSize: 12, fontWeight: 500 }}>
                Usually replies within 4 hours
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              background: showNotes ? "#0A84FF" : "#2C2C2E",
              border: "none",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={showNotes ? "#FFFFFF" : "#98989D"} strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Doctor notes panel (toggleable) */}
      {showNotes && (
        <div
          className="px-5 py-4 overflow-y-auto"
          style={{
            background: "#0A1628",
            maxHeight: 260,
            borderBottom: "1px solid #2C2C2E",
          }}
        >
          <p style={{ color: "#0A84FF", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em", marginBottom: 12 }}>
            CLINICAL NOTES
          </p>
          {DOCTOR_NOTES.map((note, i) => (
            <div
              key={note.date}
              style={{
                background: "#1C1C1E",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: i < DOCTOR_NOTES.length - 1 ? 8 : 0,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>
                  {note.type}
                </span>
                <span style={{ color: "#98989D", fontSize: 12 }}>
                  {new Date(note.date).toLocaleDateString("en-SE", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
                {note.note.length > 300 ? note.note.slice(0, 300) + "..." : note.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ background: "#000000" }}
      >
        {/* Date header */}
        <div className="flex justify-center mb-4">
          <span
            style={{
              background: "#2C2C2E",
              color: "#98989D",
              fontSize: 12,
              fontWeight: 500,
              padding: "4px 12px",
              borderRadius: 10,
            }}
          >
            March 28, 2026
          </span>
        </div>

        {/* Message bubbles */}
        <div className="flex flex-col gap-4">
          {MESSAGES.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              from={msg.from}
              time={msg.date}
              isLast={i === MESSAGES.length - 1}
            />
          ))}
        </div>

        {/* Read receipt */}
        <div className="flex justify-end mt-1">
          <span style={{ color: "#0A84FF", fontSize: 11, fontWeight: 500 }}>
            Read 14:20
          </span>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        className="px-4 py-3"
        style={{
          background: "#1C1C1E",
          borderTop: "1px solid #2C2C2E",
        }}
      >
        <div
          className="flex items-center gap-3"
          style={{
            background: "#2C2C2E",
            borderRadius: 22,
            padding: "4px 4px 4px 16px",
          }}
        >
          <input
            type="text"
            placeholder="Message Dr. Johansson..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#FFFFFF",
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
          <button
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: inputText.trim()
                ? "#0A84FF"
                : "transparent",
              border: "none",
              cursor: inputText.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={inputText.trim() ? "#FFFFFF" : "#98989D"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Safety note */}
        <p
          className="text-center mt-2"
          style={{
            color: "#98989D",
            fontSize: 11,
            fontWeight: 400,
            margin: 0,
            marginTop: 6,
          }}
        >
          For emergencies, call 112 or visit your nearest ER
        </p>
      </div>
    </div>
  );
}
