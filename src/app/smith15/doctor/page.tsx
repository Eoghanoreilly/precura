"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Send } from "lucide-react";
import { MESSAGES, PATIENT } from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />;
}

function formatMessageTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatMessageDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DoctorMessagesPage() {
  const [draft, setDraft] = useState("");

  // Group messages by date
  const messagesByDate: Record<string, typeof MESSAGES> = {};
  MESSAGES.forEach((msg) => {
    const dateKey = msg.date.split("T")[0];
    if (!messagesByDate[dateKey]) messagesByDate[dateKey] = [];
    messagesByDate[dateKey].push(msg);
  });

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <Link
          href="/smith15"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Health Overview
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>Messages</span>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 4,
        }}
      >
        Messages
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        Dr. Marcus Johansson / Precura
      </p>

      <Divider />

      {/* Messages */}
      <div>
        {Object.entries(messagesByDate).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-3">
              <span style={{ fontSize: 11, color: "#9B9A97" }}>
                {formatMessageDate(msgs[0].date)}
              </span>
            </div>

            {msgs.map((msg) => {
              const isPatient = msg.from === "patient";
              return (
                <div key={msg.id} style={{ marginBottom: 16 }}>
                  {/* Sender line */}
                  <div
                    className="flex items-center gap-2 mb-1"
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: isPatient ? "#E9E9E7" : "#2383E2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 500,
                        color: isPatient ? "#37352F" : "#FFFFFF",
                      }}
                    >
                      {isPatient ? "A" : "M"}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#37352F",
                      }}
                    >
                      {isPatient ? PATIENT.firstName : "Dr. Johansson"}
                    </span>
                    <span style={{ fontSize: 11, color: "#9B9A97" }}>
                      {formatMessageTime(msg.date)}
                    </span>
                  </div>

                  {/* Message body */}
                  <div style={{ paddingLeft: 28 }}>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#37352F",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Divider />

      {/* Compose */}
      <div
        className="flex items-end gap-2"
        style={{
          border: "1px solid #E9E9E7",
          borderRadius: 6,
          padding: "8px 10px",
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message..."
          rows={2}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: FONT,
            fontSize: 14,
            color: "#37352F",
            background: "transparent",
            lineHeight: 1.5,
          }}
        />
        <button
          style={{
            background: draft.trim() ? "#2383E2" : "#F1F1EF",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: draft.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: draft.trim() ? "#FFFFFF" : "#9B9A97",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FONT,
          }}
        >
          <Send size={13} />
          Send
        </button>
      </div>

      <div style={{ fontSize: 11, color: "#9B9A97", marginTop: 8 }}>
        Messages are typically answered within 24 hours during business days.
      </div>

      <Divider />

      <Link
        href="/smith15/doctor/notes"
        className="flex items-center gap-1.5"
        style={{ fontSize: 14, color: "#2383E2", textDecoration: "none" }}
      >
        View clinical notes
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
