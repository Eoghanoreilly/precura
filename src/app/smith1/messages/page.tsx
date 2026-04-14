"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MESSAGES,
  DOCTOR_NOTES,
  PATIENT,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  Send,
  Stethoscope,
  FileText,
  Clock,
} from "lucide-react";

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/smith1"
          className="flex items-center gap-1 mb-4"
          style={{
            color: "#B8C5D6",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <h1
          style={{
            color: "#F5F7FA",
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Dr. Marcus Johansson
        </h1>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 14,
            marginTop: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Your Precura physician - typically responds within 24 hours
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1" style={{ background: "#141F2E", borderRadius: 10 }}>
        {[
          { key: "chat" as const, label: "Messages", icon: Send },
          { key: "notes" as const, label: "Clinical Notes", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3"
              style={{
                background: activeTab === tab.key ? "#7C3AED" : "transparent",
                color: activeTab === tab.key ? "#FFFFFF" : "#B8C5D6",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: "pointer",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      {activeTab === "chat" && (
        <div>
          {/* Message thread */}
          <div
            className="p-4 mb-4 flex flex-col gap-4"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              minHeight: 400,
            }}
          >
            {MESSAGES.map((msg) => {
              const isDoctor = msg.from === "doctor";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isDoctor ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className="max-w-[80%] p-3"
                    style={{
                      background: isDoctor
                        ? "rgba(124, 58, 237, 0.08)"
                        : "rgba(255,255,255,0.04)",
                      borderRadius: isDoctor
                        ? "12px 12px 12px 4px"
                        : "12px 12px 4px 12px",
                      border: isDoctor
                        ? "1px solid rgba(124, 58, 237, 0.15)"
                        : "1px solid #1F2D42",
                    }}
                  >
                    {isDoctor && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Stethoscope size={12} style={{ color: "#7C3AED" }} />
                        <span
                          style={{
                            color: "#7C3AED",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                          }}
                        >
                          Dr. Johansson
                        </span>
                      </div>
                    )}
                    <p
                      style={{
                        color: "#F5F7FA",
                        fontSize: 13,
                        lineHeight: 1.6,
                        margin: 0,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {msg.text}
                    </p>
                    <div
                      className="mt-2 flex items-center gap-1"
                      style={{
                        color: "#B8C5D6",
                        fontSize: 10,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      <Clock size={10} />
                      {new Date(msg.date).toLocaleString("en-SE", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input */}
          <div
            className="flex items-end gap-2 p-3"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
            }}
          >
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message to Dr. Johansson..."
              rows={2}
              className="flex-1 p-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1F2D42",
                borderRadius: 8,
                color: "#F5F7FA",
                fontSize: 13,
                resize: "none",
                outline: "none",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            />
            <button
              className="flex items-center justify-center p-2.5"
              style={{
                background: "#7C3AED",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <Send size={16} style={{ color: "#FFFFFF" }} />
            </button>
          </div>
        </div>
      )}

      {/* Clinical Notes */}
      {activeTab === "notes" && (
        <div className="flex flex-col gap-4">
          {DOCTOR_NOTES.map((note, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope size={16} style={{ color: "#7C3AED" }} />
                <div>
                  <span
                    style={{
                      color: "#F5F7FA",
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    {note.type}
                  </span>
                  <div
                    style={{
                      color: "#B8C5D6",
                      fontSize: 12,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {note.author} - {note.date}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: "#B8C5D6",
                  fontSize: 13,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
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
