"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PATIENT,
  MESSAGES,
  DOCTOR_NOTES,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Messages with Dr. Johansson
// Personal, clinical conversation. Not a chatbot. A real doctor.
// ============================================================================

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-SE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMessageDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");

  // Group messages by date
  const messagesByDate = MESSAGES.reduce<Record<string, typeof MESSAGES>>((acc, msg) => {
    const date = msg.date.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div
      style={{
        background: "#F5F1E8",
        color: "#2C2416",
        minHeight: "100dvh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#FBF9F6",
          borderBottom: "1px solid #E8DFD3",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "12px 20px",
          }}
        >
          <Link
            href="/smith2"
            style={{
              textDecoration: "none",
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            &lsaquo; Home
          </Link>
          <div className="flex flex-col items-center">
            <span
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 15,
                fontWeight: 700,
                color: "#2C2416",
              }}
            >
              Dr. Marcus Johansson
            </span>
            <span style={{ fontSize: 11, color: "#6B5D52" }}>
              Your Precura doctor
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FBF9F6",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            MJ
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          maxWidth: 640,
          margin: "0 auto",
          width: "100%",
          padding: "0 20px",
          overflowY: "auto",
        }}
      >
        {/* Response time notice */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "16px 0 8px",
          }}
        >
          <p style={{ fontSize: 12, color: "#6B5D52", margin: 0 }}>
            Dr. Johansson typically responds within a few hours during business days
          </p>
        </div>

        {/* Messages grouped by date */}
        {Object.entries(messagesByDate).map(([date, msgs]) => (
          <div key={date}>
            {/* Date header */}
            <div
              style={{
                textAlign: "center" as const,
                padding: "16px 0 12px",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#6B5D52",
                  background: "#F5F1E8",
                  padding: "4px 12px",
                  borderRadius: 12,
                }}
              >
                {formatMessageDate(date)}
              </span>
            </div>

            {/* Individual messages */}
            {msgs.map((msg) => {
              const isDoctor = msg.from === "doctor";
              return (
                <div
                  key={msg.id}
                  className="flex"
                  style={{
                    justifyContent: isDoctor ? "flex-start" : "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isDoctor ? "flex-start" : "flex-end",
                    }}
                  >
                    {/* Avatar + name for doctor messages */}
                    {isDoctor && (
                      <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FBF9F6",
                            fontSize: 9,
                            fontWeight: 600,
                          }}
                        >
                          MJ
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B5D52" }}>
                          Dr. Johansson
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      style={{
                        background: isDoctor ? "#FBF9F6" : "#C97D5C",
                        color: isDoctor ? "#2C2416" : "#FBF9F6",
                        border: isDoctor ? "1px solid #E8DFD3" : "none",
                        borderRadius: isDoctor
                          ? "4px 16px 16px 16px"
                          : "16px 4px 16px 16px",
                        padding: "12px 16px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.55,
                          margin: 0,
                        }}
                      >
                        {msg.text}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6B5D52",
                        marginTop: 3,
                        padding: isDoctor ? "0 0 0 2px" : "0 2px 0 0",
                      }}
                    >
                      {formatTime(msg.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Space at bottom for input */}
        <div style={{ height: 100 }} />
      </div>

      {/* Message input - fixed at bottom */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#FBF9F6",
          borderTop: "1px solid #E8DFD3",
          padding: "12px 0",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="flex items-end"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 20px",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message Dr. Johansson..."
              rows={1}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: 14,
                color: "#2C2416",
                background: "#F5F1E8",
                border: "1px solid #E8DFD3",
                borderRadius: 20,
                resize: "none",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                outline: "none",
              }}
            />
          </div>
          <button
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: newMessage.trim() ? "#C97D5C" : "#E8DFD3",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: newMessage.trim() ? "pointer" : "default",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={newMessage.trim() ? "#FBF9F6" : "#6B5D52"}
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
    </div>
  );
}
