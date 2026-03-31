"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  ChevronDown,
  ChevronUp,
  Video,
  Clock,
  FileText,
  CheckCheck,
} from "lucide-react";
import { PATIENT, MESSAGES, DOCTOR_NOTES } from "@/lib/v2/mock-patient";

function formatMessageTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatMessageDate(dateStr: string): string {
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
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function DoctorPage() {
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const [expandedNote, setExpandedNote] = useState<number | null>(null);

  const memberSinceDate = new Date(PATIENT.memberSince);
  const memberSinceLabel = memberSinceDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 py-4 flex items-center gap-3"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <button
          onClick={() => router.push("/v2/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            My Doctor
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-5 py-6">
          {/* Doctor Card */}
          <div
            className="rounded-2xl p-5 mb-5 animate-fade-in"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                MJ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
                  Dr. Marcus Johansson
                </p>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  General Practitioner & Preventive Medicine
                </p>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  Your Precura physician since {memberSinceLabel}
                </p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  Specializing in metabolic health and diabetes prevention. 12 years clinical experience.
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div
            className="rounded-2xl px-4 py-3 mb-6 flex items-center gap-3 animate-fade-in stagger-1"
            style={{
              background: "var(--green-bg)",
              border: "1px solid #c8e6c9",
            }}
          >
            <CheckCheck size={16} style={{ color: "var(--green-text)" }} />
            <p className="text-xs font-medium" style={{ color: "var(--green-text)" }}>
              Dr. Johansson reviewed your blood results on Mar 28
            </p>
          </div>

          {/* Message Thread */}
          <div className="mb-6 animate-fade-in stagger-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Messages
            </p>

            {/* Date header */}
            <div className="flex justify-center mb-4">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-muted)",
                }}
              >
                {formatMessageDate(MESSAGES[0].date)}
              </span>
            </div>

            <div className="space-y-3">
              {MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%]"
                    style={{ minWidth: "120px" }}
                  >
                    {msg.from === "doctor" && (
                      <p
                        className="text-xs font-medium mb-1 ml-1"
                        style={{ color: "var(--accent)" }}
                      >
                        Dr. Johansson
                      </p>
                    )}
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={
                        msg.from === "patient"
                          ? {
                              background: "var(--accent)",
                              color: "#ffffff",
                              borderBottomRightRadius: "6px",
                            }
                          : {
                              background: "var(--bg-card)",
                              color: "var(--text)",
                              border: "1px solid var(--border)",
                              borderBottomLeftRadius: "6px",
                            }
                      }
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        msg.from === "patient" ? "text-right mr-1" : "ml-1"
                      }`}
                      style={{ color: "var(--text-faint)" }}
                    >
                      {formatMessageTime(msg.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div
            className="rounded-2xl p-4 mb-6 animate-fade-in stagger-3"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-end gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Message Dr. Johansson..."
                rows={2}
                className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "16px",
                }}
              />
              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: messageText.trim()
                    ? "var(--accent)"
                    : "var(--bg-elevated)",
                  cursor: messageText.trim() ? "pointer" : "default",
                }}
              >
                <Send
                  size={16}
                  style={{
                    color: messageText.trim() ? "#ffffff" : "var(--text-faint)",
                  }}
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 ml-1">
              <Clock size={12} style={{ color: "var(--text-faint)" }} />
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Dr. Johansson typically responds within 24 hours
              </p>
            </div>
          </div>

          {/* Previous Consultations */}
          <div className="mb-6 animate-fade-in stagger-4">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Previous Consultations
            </p>

            <div className="space-y-3">
              {DOCTOR_NOTES.map((note, idx) => {
                const isExpanded = expandedNote === idx;
                const previewText = note.note.split("\n")[0].slice(0, 120) + "...";

                return (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <button
                      onClick={() =>
                        setExpandedNote(isExpanded ? null : idx)
                      }
                      className="w-full text-left px-4 py-3.5 flex items-start gap-3"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "var(--purple-bg)" }}
                      >
                        <FileText size={16} style={{ color: "var(--purple)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {note.type}
                          </p>
                          {isExpanded ? (
                            <ChevronUp size={16} style={{ color: "var(--text-muted)" }} />
                          ) : (
                            <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {formatNoteDate(note.date)} - {note.author}
                        </p>
                        {!isExpanded && (
                          <p
                            className="text-xs mt-2 leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {previewText}
                          </p>
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div
                        className="px-4 pb-4 animate-fade-in"
                        style={{ borderTop: "1px solid var(--divider)" }}
                      >
                        <div className="pt-3">
                          {note.note.split("\n").map((paragraph, pIdx) => (
                            <p
                              key={pIdx}
                              className="text-sm leading-relaxed mb-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {paragraph}
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

          {/* Book a Call */}
          <div
            className="rounded-2xl p-5 mb-8 animate-fade-in stagger-5"
            style={{
              background: "var(--accent-light)",
              border: "1px solid var(--accent)",
              borderColor: "rgba(92, 107, 192, 0.25)",
            }}
          >
            <div className="flex items-start gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent)", opacity: 0.9 }}
              >
                <Video size={20} style={{ color: "#ffffff" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Book a Video Call
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Need a longer conversation? Schedule a video consultation with Dr. Johansson.
                </p>
                <p className="text-xs mt-1.5" style={{ color: "var(--accent)" }}>
                  Included in your membership
                </p>
                <button
                  onClick={() => router.push("/v2/doctor")}
                  className="mt-3 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: "var(--accent)",
                    color: "#ffffff",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  Schedule a call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
