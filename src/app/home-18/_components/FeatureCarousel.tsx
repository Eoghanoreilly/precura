"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Dumbbell,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * FEATURE CAROUSEL - interactive clickable feature showcase. Five tabs on
 * the left (vertical), each reveals a mock screen on the right. Click tabs
 * to swap between them with a smooth cross-fade + slide.
 *
 * Tabs:
 *   1. AI chat with your data
 *   2. Blood test results
 *   3. Training plan
 *   4. Doctor messaging
 *   5. Retest scheduler
 */

const TABS = [
  {
    id: "chat",
    name: "AI chat",
    sub: "Ask your data anything",
    icon: <Sparkles size={18} />,
  },
  {
    id: "results",
    name: "Blood results",
    sub: "Plain-English + trends",
    icon: <FileText size={18} />,
  },
  {
    id: "training",
    name: "Training plan",
    sub: "Real exercises, progressions",
    icon: <Dumbbell size={18} />,
  },
  {
    id: "doctor",
    name: "Doctor messaging",
    sub: "Direct line to Dr. Marcus",
    icon: <MessageSquare size={18} />,
  },
  {
    id: "retest",
    name: "Retest scheduler",
    sub: "Automated cadence",
    icon: <CalendarCheck size={18} />,
  },
];

export function FeatureCarousel() {
  const [active, setActive] = useState<string>("chat");

  return (
    <section
      style={{
        background: C.paper,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 56, maxWidth: 800 }}>
          <div
            style={{
              ...TYPE.label,
              color: C.lingon,
              marginBottom: 20,
            }}
          >
            Take a look inside
          </div>
          <h2
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Tap anything.{" "}
            <span style={{ color: C.inkMuted }}>See the whole product.</span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 620,
            }}
          >
            Click through the five core features of your Precura membership.
            No sign-up, no video, just the real thing.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 40,
            alignItems: "flex-start",
          }}
          className="home18-carousel-grid"
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 20px",
                    borderRadius: 16,
                    background: isActive ? C.ink : C.canvas,
                    color: isActive ? C.paper : C.ink,
                    border: `1px solid ${isActive ? C.ink : C.inkLine}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: isActive ? C.shadowLift : "none",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: isActive
                        ? "rgba(255,255,255,0.12)"
                        : C.paper,
                      color: isActive ? C.lingon : C.ink,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        marginBottom: 2,
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: isActive
                          ? "rgba(255,255,255,0.65)"
                          : C.inkMuted,
                      }}
                    >
                      {t.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview panel */}
          <div
            style={{
              position: "relative",
              background: C.canvas,
              borderRadius: 24,
              padding: 32,
              border: `1px solid ${C.inkLine}`,
              minHeight: 520,
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {active === "chat" && <ChatPreview />}
                {active === "results" && <ResultsPreview />}
                {active === "training" && <TrainingPreview />}
                {active === "doctor" && <DoctorPreview />}
                {active === "retest" && <RetestPreview />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home18-carousel-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Preview components
// =============================================================================
function ChatPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <PreviewHeader title="Your AI chat" sub="Trained on your entire history" />

      <Message
        side="user"
        text="Why is my glucose climbing every year?"
      />
      <Message
        side="ai"
        text="Over five years your fasting glucose went from 5.0 to 5.8 mmol/L. The rise is gradual but consistent. Combined with your mother's T2D diagnosis at 58, your FINDRISC score puts you at 17%, which is moderate risk. Dr. Marcus recommends after-dinner walks and quarterly retests."
      />
      <Message
        side="user"
        text="Show me my HbA1c trend"
      />
      <Message
        side="ai"
        text="Your HbA1c is stable at 38 mmol/mol (upper normal: 42). It hasn't moved meaningfully in three years. The drift is happening on the fasting glucose side, not the long-term marker yet. That's good news, you have time to turn this around."
      />
    </div>
  );
}

function ResultsPreview() {
  const markers = [
    { name: "Fasting glucose", value: "5.8", unit: "mmol/L", status: "borderline", pos: 0.72 },
    { name: "Total cholesterol", value: "5.1", unit: "mmol/L", status: "borderline", pos: 0.68 },
    { name: "LDL (bad cholesterol)", value: "2.9", unit: "mmol/L", status: "normal", pos: 0.42 },
    { name: "HDL (good cholesterol)", value: "1.6", unit: "mmol/L", status: "normal", pos: 0.55 },
    { name: "Vitamin D", value: "48", unit: "nmol/L", status: "borderline", pos: 0.32 },
  ];
  return (
    <div>
      <PreviewHeader title="Panel / 27 Mar 2026" sub="10 markers / Dr. Marcus note below" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {markers.map((m) => {
          const color =
            m.status === "normal"
              ? C.euc
              : m.status === "borderline"
                ? C.amberDeep
                : C.risk;
          return (
            <div
              key={m.name}
              style={{
                background: C.paper,
                borderRadius: 14,
                padding: "14px 18px",
                border: `1px solid ${C.inkLine}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {m.name}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: C.ink,
                    }}
                  >
                    {m.value}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: C.inkMuted,
                      marginLeft: 4,
                    }}
                  >
                    {m.unit}
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 5,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${C.good} 0%, ${C.amber} 60%, ${C.risk} 100%)`,
                  opacity: 0.45,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -3,
                    left: `${m.pos * 100}%`,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: C.paper,
                    border: `2px solid ${color}`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrainingPreview() {
  const days = [
    { day: "Mon", block: "Lower body", status: "done" },
    { day: "Tue", block: "Zone 2", status: "done" },
    { day: "Wed", block: "Upper body", status: "done" },
    { day: "Thu", block: "Rest", status: "rest" },
    { day: "Fri", block: "Full body", status: "today" },
    { day: "Sat", block: "Zone 2", status: "planned" },
    { day: "Sun", block: "Rest", status: "rest" },
  ];
  return (
    <div>
      <PreviewHeader title="Metabolic Foundation / Week 4 of 12" sub="Built by your coach, reviewed by Dr. Marcus" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {days.map((d) => {
          const color =
            d.status === "done"
              ? C.euc
              : d.status === "today"
                ? C.lingon
                : C.inkMuted;
          const bg =
            d.status === "done"
              ? C.eucBg
              : d.status === "today"
                ? C.lingonBg
                : C.canvas;
          return (
            <div
              key={d.day}
              style={{
                background: bg,
                border: `1px solid ${color}30`,
                borderRadius: 12,
                padding: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color,
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {d.day}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.ink,
                }}
              >
                {d.block}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          background: C.paper,
          borderRadius: 14,
          padding: "16px 20px",
          border: `1px solid ${C.inkLine}`,
        }}
      >
        <div
          style={{
            ...TYPE.label,
            color: C.inkMuted,
            marginBottom: 10,
          }}
        >
          Today / Full body
        </div>
        {[
          { name: "Goblet squat", sets: "3 x 10", weight: "12 kg" },
          { name: "Kettlebell RDL", sets: "3 x 10", weight: "16 kg" },
          { name: "Push-up (knee)", sets: "3 x 8", weight: "bodyweight" },
          { name: "Farmer carry", sets: "3 x 30m", weight: "2 x 12 kg" },
        ].map((ex, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: i < 3 ? `1px solid ${C.inkLine}` : "none",
              fontSize: 13,
            }}
          >
            <span style={{ color: C.ink, fontWeight: 500 }}>{ex.name}</span>
            <span style={{ color: C.inkMuted }}>
              {ex.sets} / {ex.weight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorPreview() {
  return (
    <div>
      <PreviewHeader
        title="Dr. Marcus Johansson"
        sub="Karolinska / Internal medicine"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Message
          side="ai"
          text="Anna, I reviewed your March panel. Fasting glucose is at 5.8, which is upper normal. I'd like to act now rather than wait. Two things: start 2000 IU vitamin D daily, and add 20-minute walks after dinner. We'll retest in six months."
        />
        <Message
          side="user"
          text="Is walking enough? I've never been a runner."
        />
        <Message
          side="ai"
          text="For you, post-dinner walking is exactly right. It hits glucose where it matters most. We'll add light strength training after the next panel. Your coach will build the plan. No pressure to run."
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 12,
            color: C.inkMuted,
            marginTop: 8,
          }}
        >
          <span>Dr. Marcus typically replies within 24 hours</span>
        </div>
      </div>
    </div>
  );
}

function RetestPreview() {
  const retests = [
    { date: "15 Sep 2026", label: "Full panel / Stockholm", status: "scheduled" },
    { date: "15 Mar 2027", label: "Full panel / Stockholm", status: "auto" },
    { date: "15 Sep 2027", label: "Full panel / Stockholm", status: "auto" },
  ];
  return (
    <div>
      <PreviewHeader title="Retest cadence" sub="Automated scheduling, always yours to change" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {retests.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              background: C.paper,
              borderRadius: 14,
              border: `1px solid ${C.inkLine}`,
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.label,
                  color: C.inkMuted,
                  marginBottom: 4,
                }}
              >
                {r.status === "scheduled" ? "Next up" : "Automatic"}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: C.ink,
                }}
              >
                {r.date}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.inkMuted,
                  marginTop: 2,
                }}
              >
                {r.label}
              </div>
            </div>
            <div
              style={{
                padding: "6px 12px",
                background: r.status === "scheduled" ? C.lingonBg : C.canvas,
                color: r.status === "scheduled" ? C.lingonDeep : C.inkMuted,
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {r.status === "scheduled" ? "Confirmed" : "Auto"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      style={{
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: `1px solid ${C.inkLine}`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: C.ink,
          marginBottom: 4,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: C.inkMuted,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function Message({ side, text }: { side: "user" | "ai"; text: string }) {
  const isUser = side === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "85%",
          padding: "12px 16px",
          background: isUser ? C.ink : C.paper,
          color: isUser ? C.paper : C.ink,
          borderRadius: 16,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          fontSize: 14,
          lineHeight: 1.5,
          border: isUser ? "none" : `1px solid ${C.inkLine}`,
          boxShadow: isUser ? "none" : C.shadowCard,
        }}
      >
        {text}
      </div>
    </div>
  );
}
