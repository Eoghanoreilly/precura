"use client";

import React, { useState } from "react";
import {
  Send,
  HeartPulse,
  Clock,
  FileText,
} from "lucide-react";
import { MESSAGES, DOCTOR_NOTES, PATIENT } from "@/lib/v2/mock-patient";

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-SE", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 144px)" }}>
      {/* Doctor header */}
      <div
        style={{
          padding: "12px 16px",
          background: "#ECF5EF",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 50,
            background: "#006D3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HeartPulse size={22} style={{ color: "#FFFFFF" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: 0 }}>
            Dr. Marcus Johansson
          </p>
          <p style={{ fontSize: 13, color: "#4F6354", margin: 0 }}>
            Precura physician
          </p>
        </div>
        <button
          onClick={() => setShowNotes(!showNotes)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: showNotes ? "#006D3E" : "#DAE8DE",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FileText size={18} style={{ color: showNotes ? "#FFFFFF" : "#006D3E" }} />
        </button>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div
          style={{
            padding: 16,
            background: "#95F7B5",
            flexShrink: 0,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#002110", margin: "0 0 8px" }}>
            Clinical notes
          </h3>
          {DOCTOR_NOTES.map((note) => (
            <div key={note.date} style={{ marginBottom: 12 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#002110" }}>
                  {note.type}
                </span>
                <span style={{ fontSize: 11, color: "#002110", opacity: 0.6 }}>
                  {note.date}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#002110", lineHeight: 1.5, margin: 0 }}>
                {note.note.slice(0, 200)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-3"
        style={{ padding: "16px 16px 8px" }}
      >
        {/* Date separator */}
        <div className="flex items-center justify-center" style={{ margin: "4px 0" }}>
          <span
            style={{
              fontSize: 12,
              color: "#6F796F",
              background: "#ECF5EF",
              padding: "4px 14px",
              borderRadius: 50,
            }}
          >
            {formatDate(MESSAGES[0].date)}
          </span>
        </div>

        {MESSAGES.map((msg) => {
          const isPatient = msg.from === "patient";
          return (
            <div
              key={msg.id}
              className="flex flex-col"
              style={{
                alignItems: isPatient ? "flex-end" : "flex-start",
                maxWidth: "85%",
                alignSelf: isPatient ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 20,
                  borderBottomRightRadius: isPatient ? 4 : 20,
                  borderBottomLeftRadius: isPatient ? 20 : 4,
                  background: isPatient ? "#006D3E" : "#ECF5EF",
                  color: isPatient ? "#FFFFFF" : "#002110",
                }}
              >
                <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                  {msg.text}
                </p>
              </div>
              <div className="flex items-center gap-1" style={{ marginTop: 4, padding: "0 4px" }}>
                <Clock size={10} style={{ color: "#6F796F" }} />
                <span style={{ fontSize: 11, color: "#6F796F" }}>
                  {formatTime(msg.date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area - Material 3 outlined text field */}
      <div
        style={{
          padding: "12px 16px",
          background: "#FAFDFB",
          borderTop: "1px solid #C0C9BF",
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{
            padding: "10px 16px",
            borderRadius: 28,
            border: "1px solid #C0C9BF",
            background: "#ECF5EF",
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 14,
              color: "#002110",
              fontFamily: "inherit",
            }}
          />
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              background: newMessage.trim() ? "#006D3E" : "#DAE8DE",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: newMessage.trim() ? "pointer" : "default",
              transition: "background 0.2s ease",
            }}
          >
            <Send size={18} style={{ color: newMessage.trim() ? "#FFFFFF" : "#6F796F" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
