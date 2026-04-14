"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MESSAGES, DOCTOR_NOTES, DOCTOR_VISITS } from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  Send,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Message Bubble
// ---------------------------------------------------------------------------

function MessageBubble({
  from,
  text,
  date,
}: {
  from: "patient" | "doctor";
  text: string;
  date: string;
}) {
  const isDoctor = from === "doctor";
  const d = new Date(date);
  const timeStr = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex ${isDoctor ? "justify-start" : "justify-end"} mb-3`}
    >
      <div style={{ maxWidth: "85%" }}>
        {isDoctor && (
          <div className="flex items-center gap-2 mb-1">
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 50,
                background: "linear-gradient(135deg, #667EEA, #764BA2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 9,
                fontWeight: 600,
              }}
            >
              MJ
            </div>
            <span style={{ color: "#717171", fontSize: 11 }}>Dr. Johansson</span>
          </div>
        )}
        <div
          className="px-4 py-3"
          style={{
            borderRadius: isDoctor ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
            background: isDoctor ? "#F7F7F7" : "#FF385C",
            color: isDoctor ? "#222222" : "#FFFFFF",
          }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{text}</p>
        </div>
        <p
          style={{
            fontSize: 10,
            color: "#717171",
            marginTop: 4,
            textAlign: isDoctor ? "left" : "right",
          }}
        >
          {timeStr}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Doctor Notes Section
// ---------------------------------------------------------------------------

function DoctorNotesSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mx-5 mb-4"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
        style={{
          background: "#F7F7F7",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: "#FF385C" }} />
          <span style={{ color: "#222222", fontSize: 14, fontWeight: 600 }}>
            Doctor&apos;s notes ({DOCTOR_NOTES.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={16} style={{ color: "#717171" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#717171" }} />
        )}
      </button>

      {expanded && (
        <div className="p-5">
          {DOCTOR_NOTES.map((note, i) => (
            <div
              key={i}
              className={i < DOCTOR_NOTES.length - 1 ? "mb-4 pb-4" : ""}
              style={{
                borderBottom: i < DOCTOR_NOTES.length - 1 ? "1px solid #EBEBEB" : "none",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#222222", fontSize: 13, fontWeight: 600 }}>
                  {note.type}
                </span>
                <span style={{ color: "#717171", fontSize: 11 }}>
                  {new Date(note.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p style={{ color: "#717171", fontSize: 12, marginBottom: 4 }}>
                {note.author}
              </p>
              <p style={{ color: "#222222", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {note.note}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visit History
// ---------------------------------------------------------------------------

function VisitHistorySection() {
  const [showAll, setShowAll] = useState(false);
  const visitsToShow = showAll ? DOCTOR_VISITS : DOCTOR_VISITS.slice(0, 3);

  return (
    <div
      className="mx-5 mb-4"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} style={{ color: "#717171" }} />
          <span style={{ color: "#222222", fontSize: 14, fontWeight: 600 }}>
            Visit history
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {visitsToShow.map((visit, i) => (
            <div
              key={i}
              className="flex gap-3"
            >
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 50,
                    background: i === 0 ? "#FF385C" : "#EBEBEB",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                {i < visitsToShow.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: "#EBEBEB", marginTop: 4 }} />
                )}
              </div>

              <div className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: "#222222", fontSize: 13, fontWeight: 500 }}>
                    {visit.type}
                  </span>
                  <span
                    style={{
                      padding: "1px 6px",
                      borderRadius: 50,
                      background: "#F7F7F7",
                      color: "#717171",
                      fontSize: 10,
                    }}
                  >
                    {new Date(visit.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                  </span>
                </div>
                <p style={{ color: "#717171", fontSize: 11, marginBottom: 2 }}>{visit.provider}</p>
                <p style={{ color: "#717171", fontSize: 12, lineHeight: 1.5 }}>
                  {visit.summary.length > 100 ? visit.summary.slice(0, 100) + "..." : visit.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {DOCTOR_VISITS.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              width: "100%",
              padding: "10px 0",
              border: "none",
              background: "transparent",
              color: "#FF385C",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              marginTop: 8,
            }}
          >
            {showAll ? "Show less" : `Show all ${DOCTOR_VISITS.length} visits`}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100dvh - 80px)" }}>
      {/* Back nav */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link
          href="/smith12"
          style={{
            width: 32,
            height: 32,
            borderRadius: 50,
            border: "1px solid #EBEBEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} style={{ color: "#222222" }} />
        </Link>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 50,
              background: "linear-gradient(135deg, #667EEA, #764BA2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            MJ
          </div>
          <div>
            <p style={{ color: "#222222", fontSize: 15, fontWeight: 600 }}>Dr. Marcus Johansson</p>
            <p style={{ color: "#717171", fontSize: 11 }}>Precura physician</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4">
        {/* Date separator */}
        <div className="flex items-center justify-center mb-4">
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 50,
              background: "#F7F7F7",
              color: "#717171",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {new Date(MESSAGES[0].date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {MESSAGES.map((msg) => (
          <MessageBubble key={msg.id} from={msg.from} text={msg.text} date={msg.date} />
        ))}
      </div>

      {/* Input */}
      <div className="px-5 py-3" style={{ borderTop: "1px solid #EBEBEB" }}>
        <div
          className="flex items-center gap-2"
          style={{
            padding: "8px 8px 8px 16px",
            borderRadius: 50,
            border: "1px solid #EBEBEB",
            background: "#F7F7F7",
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message Dr. Johansson..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 14,
              color: "#222222",
              fontFamily: "inherit",
            }}
          />
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 50,
              background: newMessage.trim() ? "#FF385C" : "#EBEBEB",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: newMessage.trim() ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            <Send size={16} style={{ color: newMessage.trim() ? "#FFFFFF" : "#717171" }} />
          </button>
        </div>
      </div>

      {/* Doctor notes + visit history below chat */}
      <div className="pt-4">
        <DoctorNotesSection />
        <VisitHistorySection />
      </div>
    </div>
  );
}
