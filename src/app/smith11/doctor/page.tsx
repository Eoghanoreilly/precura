"use client";

import React, { useState } from "react";
import {
  Send,
  HeartPulse,
  Phone,
  FileText,
  ChevronRight,
  Shield,
} from "lucide-react";
import { MESSAGES, DOCTOR_NOTES, DOCTOR_VISITS } from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Doctor Profile Header                                                */
/* ------------------------------------------------------------------ */
function DoctorProfileHeader() {
  return (
    <div
      className="flex items-center gap-3"
      style={{ marginBottom: 20, padding: "0 0 16px", borderBottom: "1px solid #28282850" }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: "linear-gradient(135deg, #1DB954, #1ED760)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <HeartPulse size={24} style={{ color: "#FFFFFF" }} />
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
          Dr. Marcus Johansson
        </div>
        <div style={{ fontSize: 13, color: "#B3B3B3" }}>Your Precura physician</div>
      </div>
      <div className="flex gap-2">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "#282828",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Phone size={18} style={{ color: "#B3B3B3" }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Message Bubble                                                       */
/* ------------------------------------------------------------------ */
function MessageBubble({ msg }: { msg: (typeof MESSAGES)[0] }) {
  const isPatient = msg.from === "patient";
  const date = new Date(msg.date);
  const timeStr = date.toLocaleTimeString("en-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="flex flex-col"
      style={{
        alignItems: isPatient ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      {!isPatient && (
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              background: "#1DB95430",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeartPulse size={12} style={{ color: "#1DB954" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1DB954" }}>Dr. Johansson</span>
        </div>
      )}
      <div
        style={{
          maxWidth: "85%",
          background: isPatient ? "#1DB954" : "#282828",
          borderRadius: isPatient ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "12px 16px",
        }}
      >
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: isPatient ? "#FFFFFF" : "#FFFFFF",
            margin: 0,
          }}
        >
          {msg.text}
        </p>
      </div>
      <span style={{ fontSize: 11, color: "#B3B3B360", marginTop: 4 }}>{timeStr}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Message Input                                                        */
/* ------------------------------------------------------------------ */
function MessageInput() {
  const [text, setText] = useState("");

  return (
    <div
      className="flex items-center gap-2"
      style={{
        padding: "12px 16px",
        background: "#1E1E1E",
        borderTop: "1px solid #28282850",
      }}
    >
      <input
        type="text"
        placeholder="Message Dr. Johansson..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          background: "#282828",
          border: "none",
          borderRadius: 24,
          padding: "10px 16px",
          fontSize: 14,
          color: "#FFFFFF",
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <button
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: text.trim() ? "#1DB954" : "#282828",
          border: "none",
          cursor: text.trim() ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Send size={18} style={{ color: text.trim() ? "#FFFFFF" : "#B3B3B340" }} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Visit History                                                        */
/* ------------------------------------------------------------------ */
function VisitHistory() {
  const [showAll, setShowAll] = useState(false);
  const visitsToShow = showAll ? DOCTOR_VISITS : DOCTOR_VISITS.slice(0, 3);

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
        Visit history
      </h3>
      {visitsToShow.map((visit, i) => (
        <div
          key={i}
          className="flex gap-3"
          style={{
            padding: "12px 0",
            borderTop: i > 0 ? "1px solid #28282850" : "none",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background:
                visit.provider.includes("Precura") ? "#1DB954" : "#B3B3B340",
              flexShrink: 0,
              marginTop: 6,
            }}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                {visit.type}
              </span>
              <span style={{ fontSize: 11, color: "#B3B3B360" }}>{visit.date}</span>
            </div>
            <div style={{ fontSize: 12, color: "#B3B3B3", marginBottom: 4 }}>
              {visit.provider}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#B3B3B380",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {visit.summary.slice(0, 120)}
              {visit.summary.length > 120 ? "..." : ""}
            </p>
          </div>
        </div>
      ))}
      {DOCTOR_VISITS.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "12px 0 0",
            fontSize: 13,
            fontWeight: 600,
            color: "#1DB954",
          }}
        >
          {showAll ? "Show less" : `Show all ${DOCTOR_VISITS.length} visits`}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section Tabs                                                         */
/* ------------------------------------------------------------------ */
function DoctorTabs({
  active,
  onChange,
}: {
  active: "messages" | "history" | "notes";
  onChange: (tab: "messages" | "history" | "notes") => void;
}) {
  const tabs = [
    { id: "messages" as const, label: "Messages" },
    { id: "history" as const, label: "Visits" },
    { id: "notes" as const, label: "Notes" },
  ];

  return (
    <div className="flex gap-2" style={{ marginBottom: 20 }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              background: isActive ? "#1DB954" : "#282828",
              border: "none",
              borderRadius: 24,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? "#FFFFFF" : "#B3B3B3",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctor Notes Section                                                 */
/* ------------------------------------------------------------------ */
function DoctorNotesSection() {
  const [expandedIdx, setExpandedIdx] = useState(-1);

  return (
    <div className="flex flex-col gap-2">
      {DOCTOR_NOTES.map((note, i) => {
        const isExpanded = expandedIdx === i;
        return (
          <div key={i} style={{ background: "#1E1E1E", borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setExpandedIdx(isExpanded ? -1 : i)}
              className="flex items-center w-full"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 16,
              }}
            >
              <FileText
                size={16}
                style={{ color: "#1DB954", flexShrink: 0, marginRight: 12 }}
              />
              <div className="flex-1" style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                  {note.type}
                </div>
                <div style={{ fontSize: 12, color: "#B3B3B3" }}>
                  {note.author} / {note.date}
                </div>
              </div>
              <ChevronRight
                size={16}
                style={{
                  color: "#B3B3B340",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
            {isExpanded && (
              <div style={{ padding: "0 16px 16px" }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "#B3B3B3",
                    lineHeight: 1.7,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {note.note}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DOCTOR PAGE                                                          */
/* ------------------------------------------------------------------ */
export default function DoctorPage() {
  const [activeTab, setActiveTab] = useState<"messages" | "history" | "notes">("messages");

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div style={{ padding: "0 16px", flexShrink: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: "0 0 16px" }}>
          Doctor
        </h1>
        <DoctorProfileHeader />
        <DoctorTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "messages" ? (
        <>
          {/* Encrypted notice */}
          <div
            className="flex items-center justify-center gap-2"
            style={{
              padding: "8px 16px",
              flexShrink: 0,
            }}
          >
            <Shield size={12} style={{ color: "#B3B3B340" }} />
            <span style={{ fontSize: 11, color: "#B3B3B340" }}>
              Messages are encrypted and confidential
            </span>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ padding: "8px 16px 16px" }}
          >
            {MESSAGES.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </div>

          {/* Input */}
          <div style={{ flexShrink: 0 }}>
            <MessageInput />
          </div>
        </>
      ) : activeTab === "history" ? (
        <div className="flex-1 overflow-y-auto" style={{ padding: "0 16px 24px" }}>
          <VisitHistory />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto" style={{ padding: "0 16px 24px" }}>
          <DoctorNotesSection />
        </div>
      )}
    </div>
  );
}
