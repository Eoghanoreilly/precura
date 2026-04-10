"use client";

import Link from "next/link";
import {
  ArrowLeft, Shield, MessageCircle, FileText,
  Clock, User, Stethoscope,
} from "lucide-react";
import {
  MESSAGES, DOCTOR_NOTES, PATIENT,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function DoctorPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248, 249, 250, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Link href="/smith9" style={{
            width: 36, height: 36, borderRadius: 12,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: "#3730a3", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Stethoscope size={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Dr. Marcus Johansson</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Your Precura physician</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Doctor's Notes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <FileText size={15} style={{ color: "#3730a3" }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
              Clinical Notes
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {DOCTOR_NOTES.map((note, i) => (
              <div key={i} className="animate-fade-in" style={{
                background: "var(--bg-card)", borderRadius: 18,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "20px 20px", position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: "linear-gradient(90deg, #3730a3, #6366f1)",
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "3px 10px",
                      borderRadius: 6, background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
                      color: "#3730a3", textTransform: "uppercase", letterSpacing: "0.04em",
                    }}>
                      {note.type}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(note.date)}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{note.author}</div>
                <p style={{
                  fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0,
                  whiteSpace: "pre-line",
                }}>
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <MessageCircle size={15} style={{ color: "#3730a3" }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
              Messages
            </h2>
          </div>

          <div style={{
            background: "var(--bg-card)", borderRadius: 18,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            padding: "20px 16px",
          }}>
            {/* Date header */}
            <div style={{
              textAlign: "center", marginBottom: 16,
            }}>
              <span style={{
                fontSize: 11, fontWeight: 500, color: "var(--text-muted)",
                background: "var(--bg-elevated)", padding: "4px 12px", borderRadius: 10,
              }}>
                {formatDate(MESSAGES[0].date.split("T")[0])}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MESSAGES.map((msg) => {
                const isDoctor = msg.from === "doctor";
                return (
                  <div key={msg.id} style={{
                    display: "flex", flexDirection: "column",
                    alignItems: isDoctor ? "flex-start" : "flex-end",
                  }}>
                    <div style={{
                      maxWidth: "85%", padding: "12px 16px", borderRadius: 16,
                      borderBottomLeftRadius: isDoctor ? 4 : 16,
                      borderBottomRightRadius: isDoctor ? 16 : 4,
                      background: isDoctor ? "var(--bg-elevated)" : "#3730a3",
                      color: isDoctor ? "var(--text)" : "#fff",
                    }}>
                      {isDoctor && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
                        }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 6,
                            background: "#3730a3", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>
                            <Stethoscope size={10} style={{ color: "#fff" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#3730a3" }}>Dr. Johansson</span>
                        </div>
                      )}
                      <p style={{
                        fontSize: 13, lineHeight: 1.7, margin: 0,
                        color: isDoctor ? "var(--text-secondary)" : "rgba(255,255,255,0.95)",
                      }}>
                        {msg.text}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 10, color: "var(--text-muted)", marginTop: 4,
                      padding: "0 4px",
                    }}>
                      {formatTime(msg.date)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input area (decorative) */}
            <div style={{
              marginTop: 16, padding: "10px 14px", borderRadius: 14,
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)", flex: 1 }}>
                Write a message...
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "#3730a3", display: "flex",
                alignItems: "center", justifyContent: "center",
                opacity: 0.5,
              }}>
                <MessageCircle size={14} style={{ color: "#fff" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
