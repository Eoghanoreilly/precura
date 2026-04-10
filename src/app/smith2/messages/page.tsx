"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Clock,
  Phone,
  Video,
  CheckCheck,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PATIENT,
  MESSAGES,
  DOCTOR_NOTES,
} from "@/lib/v2/mock-patient";

const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatNoteDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function MessagesPage() {
  const router = useRouter();
  const [msgText, setMsgText] = useState("");
  const [expandedNote, setExpandedNote] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Sticky header with doctor info */}
      <div
        className="sticky top-0 z-10 px-5 py-3"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/smith2")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-elevated)" }}
          >
            <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <img
            src={DOC_AVATAR}
            alt=""
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${DOC_COLOR}`,
            }}
          />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              Dr. Marcus Johansson
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Typically responds within 24h
              </p>
            </div>
          </div>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: DOC_BG }}
          >
            <Phone size={16} style={{ color: DOC_COLOR }} />
          </button>
        </div>
      </div>

      {/* Scrollable messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ padding: "16px 16px 0" }}
      >
        <div style={{ maxWidth: 448, margin: "0 auto" }}>

          {/* Consultation context banner */}
          <div
            style={{
              background: DOC_BG,
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${DOC_BORDER}`,
            }}
          >
            <CheckCheck size={14} style={{ color: DOC_COLOR }} />
            <p style={{ fontSize: 12, color: DOC_COLOR, fontWeight: 500 }}>
              Dr. Johansson reviewed your blood test results on 28 Mar
            </p>
          </div>

          {/* Date separator */}
          <div className="flex justify-center mb-4">
            <span
              style={{
                fontSize: 12,
                padding: "3px 12px",
                borderRadius: 20,
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              {formatDate(MESSAGES[0].date)}
            </span>
          </div>

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MESSAGES.map((msg) => {
              const isPatient = msg.from === "patient";
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isPatient ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 8,
                  }}
                >
                  {!isPatient && (
                    <img
                      src={DOC_AVATAR}
                      alt=""
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        marginBottom: 18,
                      }}
                    />
                  )}
                  <div style={{ maxWidth: "80%", minWidth: 100 }}>
                    {!isPatient && (
                      <p style={{ fontSize: 11, fontWeight: 600, color: DOC_COLOR, marginBottom: 3, marginLeft: 2 }}>
                        Dr. Johansson
                      </p>
                    )}
                    <div
                      style={{
                        borderRadius: 18,
                        padding: "12px 16px",
                        ...(isPatient
                          ? {
                              background: DOC_COLOR,
                              color: "#ffffff",
                              borderBottomRightRadius: 6,
                            }
                          : {
                              background: "var(--bg-card)",
                              color: "var(--text)",
                              border: "1px solid var(--border)",
                              borderBottomLeftRadius: 6,
                              boxShadow: "var(--shadow-sm)",
                            }),
                      }}
                    >
                      <p style={{ fontSize: 14, lineHeight: 1.55 }}>{msg.text}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                        justifyContent: isPatient ? "flex-end" : "flex-start",
                        paddingLeft: isPatient ? 0 : 2,
                        paddingRight: isPatient ? 2 : 0,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                        {formatTime(msg.date)}
                      </span>
                      {isPatient && (
                        <CheckCheck size={12} style={{ color: DOC_COLOR }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Doctor notes section below messages */}
          <div style={{ marginTop: 32, marginBottom: 20 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Clinical notes
            </p>

            {DOCTOR_NOTES.map((note, idx) => {
              const isExpanded = expandedNote === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 14,
                    marginBottom: 10,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setExpandedNote(isExpanded ? null : idx)}
                    style={{
                      width: "100%",
                      textAlign: "left" as const,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: DOC_BG,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={14} style={{ color: DOC_COLOR }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                        {note.type}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {formatNoteDate(note.date)} - {note.author}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} style={{ color: "var(--text-faint)" }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: "var(--text-faint)" }} />
                    )}
                  </button>
                  {isExpanded && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <div
                        style={{
                          background: "var(--bg-elevated)",
                          borderRadius: 10,
                          padding: "12px 14px",
                        }}
                      >
                        {note.note.split("\n").filter(Boolean).map((para, i) => (
                          <p
                            key={i}
                            style={{
                              fontSize: 13,
                              color: "var(--text-secondary)",
                              lineHeight: 1.6,
                              marginBottom: i < note.note.split("\n").filter(Boolean).length - 1 ? 10 : 0,
                            }}
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message input - fixed at bottom */}
      <div
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--divider)",
          padding: "12px 16px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ maxWidth: 448, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Message Dr. Johansson..."
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                borderRadius: 20,
                padding: "10px 16px",
                fontSize: 14,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                minHeight: 40,
                maxHeight: 100,
              }}
            />
            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: msgText.trim() ? DOC_COLOR : "var(--bg-elevated)",
                border: "none",
                cursor: msgText.trim() ? "pointer" : "default",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
            >
              <Send
                size={16}
                style={{ color: msgText.trim() ? "#ffffff" : "var(--text-faint)" }}
              />
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              paddingLeft: 4,
            }}
          >
            <Clock size={11} style={{ color: "var(--text-faint)" }} />
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
              Messages are reviewed by Dr. Johansson personally
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
