"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Send, Paperclip, FileText, User,
  Clock, CheckCheck,
} from "lucide-react";
import {
  PATIENT, MESSAGES, DOCTOR_NOTES,
} from "@/lib/v2/mock-patient";

const HEALTHCARE_BLUE = "#1862a5";
const HEALTHCARE_BLUE_LIGHT = "#e8f0fb";
const HEALTHCARE_BLUE_DARK = "#0f4c81";
const WARM_BG = "#f7f8fa";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_SECONDARY = "#4a5568";
const TEXT_MUTED = "#718096";
const BORDER_COLOR = "#e2e8f0";

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatFullDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Smith6Meddelanden() {
  const [messageText, setMessageText] = useState("");
  const [activeView, setActiveView] = useState<"messages" | "notes">("messages");

  // Group messages by date
  const messagesByDate: Record<string, typeof MESSAGES> = {};
  MESSAGES.forEach((msg) => {
    const dateKey = msg.date.split("T")[0];
    if (!messagesByDate[dateKey]) messagesByDate[dateKey] = [];
    messagesByDate[dateKey].push(msg);
  });

  return (
    <div style={{ background: WARM_BG, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: HEALTHCARE_BLUE,
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/smith6"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={22} />
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Meddelanden</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Dr. Marcus Johansson - Din Precura-lakare
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={22} color="white" />
          </div>
        </div>

        {/* View toggle */}
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 20px 12px",
            display: "flex",
            gap: 0,
          }}
        >
          <button
            onClick={() => setActiveView("messages")}
            style={{
              flex: 1,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              borderRadius: "8px 0 0 8px",
              background:
                activeView === "messages"
                  ? "white"
                  : "rgba(255,255,255,0.15)",
              color:
                activeView === "messages" ? HEALTHCARE_BLUE : "white",
              transition: "all 0.2s",
            }}
          >
            Meddelanden
          </button>
          <button
            onClick={() => setActiveView("notes")}
            style={{
              flex: 1,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              borderRadius: "0 8px 8px 0",
              background:
                activeView === "notes"
                  ? "white"
                  : "rgba(255,255,255,0.15)",
              color:
                activeView === "notes" ? HEALTHCARE_BLUE : "white",
              transition: "all 0.2s",
            }}
          >
            Lakaranteckningar
          </button>
        </div>
      </header>

      {activeView === "messages" ? (
        <>
          {/* Message thread */}
          <div
            style={{
              flex: 1,
              maxWidth: 960,
              margin: "0 auto",
              width: "100%",
              padding: "20px 20px 0",
            }}
          >
            {/* Doctor info card */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: HEALTHCARE_BLUE_LIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <User size={26} color={HEALTHCARE_BLUE} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                  }}
                >
                  Dr. Marcus Johansson
                </div>
                <div style={{ fontSize: 14, color: TEXT_SECONDARY }}>
                  Allmanmedicin - Din Precura-lakare
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#16a34a",
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#16a34a",
                    }}
                  />
                  Svarar normalt inom 24 timmar
                </div>
              </div>
            </div>

            {/* Messages */}
            {Object.entries(messagesByDate).map(([dateKey, msgs]) => (
              <div key={dateKey}>
                <div
                  style={{
                    textAlign: "center" as const,
                    padding: "12px 0",
                    fontSize: 13,
                    fontWeight: 600,
                    color: TEXT_MUTED,
                  }}
                >
                  {formatFullDate(dateKey)}
                </div>

                {msgs.map((msg) => {
                  const isDoctor = msg.from === "doctor";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: isDoctor ? "flex-start" : "flex-end",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                        }}
                      >
                        {isDoctor && (
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: HEALTHCARE_BLUE,
                              marginBottom: 4,
                              paddingLeft: 4,
                            }}
                          >
                            Dr. Johansson
                          </div>
                        )}
                        <div
                          style={{
                            padding: "14px 18px",
                            borderRadius: isDoctor
                              ? "4px 16px 16px 16px"
                              : "16px 4px 16px 16px",
                            background: isDoctor
                              ? CARD_BG
                              : HEALTHCARE_BLUE,
                            color: isDoctor ? TEXT_PRIMARY : "white",
                            border: isDoctor
                              ? `1px solid ${BORDER_COLOR}`
                              : "none",
                            fontSize: 15,
                            lineHeight: 1.6,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                          }}
                        >
                          {msg.text}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            justifyContent: isDoctor ? "flex-start" : "flex-end",
                            padding: "4px 6px 0",
                          }}
                        >
                          <span
                            style={{ fontSize: 12, color: TEXT_MUTED }}
                          >
                            {formatTime(msg.date)}
                          </span>
                          {!isDoctor && (
                            <CheckCheck size={14} color={HEALTHCARE_BLUE} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Message input */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              background: CARD_BG,
              borderTop: `1px solid ${BORDER_COLOR}`,
              padding: "12px 20px",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div
              style={{
                maxWidth: 960,
                margin: "0 auto",
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <button
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: `1px solid ${BORDER_COLOR}`,
                  background: "#f8fafc",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Paperclip size={20} color={TEXT_MUTED} />
              </button>
              <div
                style={{
                  flex: 1,
                  position: "relative",
                }}
              >
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Skriv ett meddelande till din lakare..."
                  rows={1}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 22,
                    border: `1px solid ${BORDER_COLOR}`,
                    background: "#f8fafc",
                    fontSize: 15,
                    color: TEXT_PRIMARY,
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.4,
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <button
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background: messageText.trim()
                    ? HEALTHCARE_BLUE
                    : "#e2e8f0",
                  cursor: messageText.trim() ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <Send
                  size={20}
                  color={messageText.trim() ? "white" : TEXT_MUTED}
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Doctor notes view */
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "20px 20px 80px",
            width: "100%",
          }}
        >
          <div
            style={{
              background: HEALTHCARE_BLUE_LIGHT,
              border: `1px solid ${HEALTHCARE_BLUE}33`,
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 20,
              fontSize: 15,
              color: HEALTHCARE_BLUE_DARK,
              lineHeight: 1.5,
            }}
          >
            Lakaranteckningar ar formella journalnoteringar fran dina
            Precura-konsultationer. De ar en del av din journal.
          </div>

          {DOCTOR_NOTES.map((note, i) => (
            <div
              key={note.date}
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {note.type}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                    {formatDate(note.date)} - {note.author}
                  </div>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: HEALTHCARE_BLUE_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={20} color={HEALTHCARE_BLUE} />
                </div>
              </div>

              <div
                style={{
                  fontSize: 15,
                  color: TEXT_SECONDARY,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {note.note}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
