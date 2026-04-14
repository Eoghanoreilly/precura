"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PATIENT, TRAINING_PLAN } from "@/lib/v2/mock-patient";

/* =====================================================================
   JOURNEY MAP - Vertical Duolingo-style path
   Anna is at Week 10, Stage 7 of 10
   ===================================================================== */

interface Stage {
  num: number;
  title: string;
  subtitle: string;
  status: "done" | "current" | "locked";
  icon: string;
  weekRange: string;
  completedDate?: string;
}

const STAGES: Stage[] = [
  {
    num: 1,
    title: "Risk Assessment",
    subtitle: "FINDRISC screening, family history, lifestyle review",
    status: "done",
    icon: "clipboard",
    weekRange: "Week 1",
    completedDate: "Jan 20",
  },
  {
    num: 2,
    title: "Understanding Results",
    subtitle: "Your risk profile explained in plain language",
    status: "done",
    icon: "lightbulb",
    weekRange: "Week 1",
    completedDate: "Jan 22",
  },
  {
    num: 3,
    title: "First Blood Test",
    subtitle: "Comprehensive panel at Karolinska lab",
    status: "done",
    icon: "droplet",
    weekRange: "Week 2",
    completedDate: "Jan 27",
  },
  {
    num: 4,
    title: "Results + Review",
    subtitle: "Doctor review of your blood work and health data",
    status: "done",
    icon: "stethoscope",
    weekRange: "Week 2-3",
    completedDate: "Feb 3",
  },
  {
    num: 5,
    title: "Starting Training",
    subtitle: "Your first 4 weeks of personalized exercise",
    status: "done",
    icon: "dumbbell",
    weekRange: "Weeks 1-4",
    completedDate: "Feb 17",
  },
  {
    num: 6,
    title: "Building Habits",
    subtitle: "Consistency, post-meal walks, routine forming",
    status: "done",
    icon: "repeat",
    weekRange: "Weeks 5-8",
    completedDate: "Mar 17",
  },
  {
    num: 7,
    title: "Deepening Practice",
    subtitle: "Progressive overload, nutrition tweaks, marker tracking",
    status: "current",
    icon: "trending-up",
    weekRange: "Weeks 9-12",
  },
  {
    num: 8,
    title: "6-Month Check-In",
    subtitle: "Second blood test, compare with baseline",
    status: "locked",
    icon: "calendar",
    weekRange: "Month 6",
  },
  {
    num: 9,
    title: "Measuring Progress",
    subtitle: "Full before/after analysis, updated risk scores",
    status: "locked",
    icon: "bar-chart",
    weekRange: "Month 7",
  },
  {
    num: 10,
    title: "Year Review",
    subtitle: "Annual review with Dr. Johansson, plan next year",
    status: "locked",
    icon: "award",
    weekRange: "Month 12",
  },
];

function StageIcon({ icon, status }: { icon: string; status: string }) {
  const color = status === "done" ? "#FFFFFF" : status === "current" ? "#FFFFFF" : "#D4C5E0";
  const size = 22;

  const icons: Record<string, React.ReactNode> = {
    clipboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
    lightbulb: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
      </svg>
    ),
    droplet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
    stethoscope: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 0012 0V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
        <path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
    dumbbell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11M6 12h12" />
        <path d="M17.5 17.5h-11" />
        <rect x="2" y="8" width="4" height="8" rx="1" />
        <rect x="18" y="8" width="4" height="8" rx="1" />
      </svg>
    ),
    repeat: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
    "trending-up": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    "bar-chart": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
    award: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  };

  return <>{icons[icon] || icons.clipboard}</>;
}

function Checkmark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7L6 10L11 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4C5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export default function JourneyMapPage() {
  const router = useRouter();
  const [expandedDone, setExpandedDone] = useState<number | null>(null);

  const completedCount = STAGES.filter((s) => s.status === "done").length;
  const currentStage = STAGES.find((s) => s.status === "current");

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Greeting card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "24px 20px",
          marginBottom: 24,
        }}
      >
        <p style={{ color: "#8B7B95", fontSize: 14, fontWeight: 500, margin: 0 }}>
          Week {TRAINING_PLAN.currentWeek} of your journey
        </p>
        <h1 style={{ color: "#3D2645", fontSize: 24, fontWeight: 700, margin: "6px 0 10px", letterSpacing: -0.3 }}>
          Hi, {PATIENT.firstName}
        </h1>
        <p style={{ color: "#8B7B95", fontSize: 15, margin: 0, lineHeight: 1.5 }}>
          You've completed {completedCount} of 10 stages. You're in{" "}
          <span style={{ color: "#B794F6", fontWeight: 600 }}>{currentStage?.title}</span>{" "}
          right now.
        </p>

        {/* Mini progress bar */}
        <div style={{ marginTop: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ color: "#8B7B95", fontSize: 12, fontWeight: 500 }}>Journey progress</span>
            <span style={{ color: "#B794F6", fontSize: 12, fontWeight: 600 }}>{completedCount * 10}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#F3EAFF" }}>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "linear-gradient(90deg, #B794F6, #9F7AEA)",
                width: `${completedCount * 10}%`,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Today's focus card */}
      <div
        onClick={() => router.push("/smith8/stage")}
        style={{
          background: "linear-gradient(135deg, #B794F6, #9F7AEA)",
          borderRadius: 20,
          padding: "20px",
          marginBottom: 32,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(183,148,246,0.3)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Today's focus
            </p>
            <p style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700, margin: "6px 0 4px" }}>
              Wednesday Lower Body
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>
              4 exercises / ~35 min
            </p>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Journey path - vertical Duolingo style */}
      <h2 style={{ color: "#3D2645", fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: -0.2 }}>
        Your Journey
      </h2>

      <div style={{ position: "relative", paddingLeft: 28 }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#EFE6F8",
            borderRadius: 2,
          }}
        />
        {/* Filled portion of line */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 0,
            width: 3,
            borderRadius: 2,
            background: "linear-gradient(180deg, #B794F6, #9F7AEA)",
            height: `${((completedCount + 0.5) / STAGES.length) * 100}%`,
            transition: "height 0.6s ease",
          }}
        />

        {STAGES.map((stage, idx) => {
          const isDone = stage.status === "done";
          const isCurrent = stage.status === "current";
          const isLocked = stage.status === "locked";
          const isExpanded = expandedDone === stage.num;

          return (
            <div
              key={stage.num}
              style={{
                position: "relative",
                marginBottom: idx === STAGES.length - 1 ? 0 : 8,
              }}
            >
              {/* Node circle on the line */}
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  top: 18,
                  width: isCurrent ? 40 : 40,
                  height: isCurrent ? 40 : 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: isDone ? 28 : isCurrent ? 36 : 28,
                    height: isDone ? 28 : isCurrent ? 36 : 28,
                    borderRadius: "50%",
                    background: isDone
                      ? "#B794F6"
                      : isCurrent
                      ? "linear-gradient(135deg, #B794F6, #9F7AEA)"
                      : "#F3EAFF",
                    border: isCurrent ? "3px solid #B794F6" : "none",
                    boxShadow: isCurrent
                      ? "0 0 0 6px rgba(183,148,246,0.2), 0 2px 8px rgba(183,148,246,0.3)"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isDone ? (
                    <Checkmark />
                  ) : isLocked ? (
                    <LockIcon />
                  ) : (
                    <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>{stage.num}</span>
                  )}
                </div>
              </div>

              {/* Stage card */}
              <div
                onClick={() => {
                  if (isCurrent) router.push("/smith8/stage");
                  else if (isDone) setExpandedDone(isExpanded ? null : stage.num);
                }}
                style={{
                  marginLeft: 24,
                  background: isCurrent ? "#FFFFFF" : isDone ? "#FFFFFF" : "#FDFBFF",
                  borderRadius: 20,
                  border: isCurrent
                    ? "2px solid #B794F6"
                    : "1px solid #EFE6F8",
                  boxShadow: isCurrent
                    ? "0 4px 12px rgba(183,148,246,0.15)"
                    : "0 2px 6px rgba(183,148,246,0.08)",
                  padding: "16px 18px",
                  cursor: isLocked ? "default" : "pointer",
                  opacity: isLocked ? 0.55 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                <div className="flex items-start justify-between">
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <span
                        style={{
                          color: isCurrent ? "#B794F6" : isDone ? "#81C995" : "#D4C5E0",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {stage.weekRange}
                      </span>
                      {isDone && (
                        <span
                          style={{
                            background: "#E8F8EC",
                            color: "#81C995",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 8,
                          }}
                        >
                          Complete
                        </span>
                      )}
                      {isCurrent && (
                        <span
                          style={{
                            background: "#F3EAFF",
                            color: "#B794F6",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 8,
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        color: isLocked ? "#D4C5E0" : "#3D2645",
                        fontSize: 16,
                        fontWeight: 600,
                        margin: "2px 0 4px",
                      }}
                    >
                      {stage.title}
                    </h3>
                    <p
                      style={{
                        color: isLocked ? "#D4C5E0" : "#8B7B95",
                        fontSize: 13,
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {stage.subtitle}
                    </p>

                    {/* Expanded done details */}
                    {isDone && isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #EFE6F8" }}>
                        <p style={{ color: "#81C995", fontSize: 13, fontWeight: 500, margin: 0 }}>
                          Completed {stage.completedDate}
                        </p>
                      </div>
                    )}

                    {/* Current stage CTA */}
                    {isCurrent && (
                      <div
                        style={{
                          marginTop: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#B794F6",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        View current tasks
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="#B794F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Right side icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      background: isDone
                        ? "#E8F8EC"
                        : isCurrent
                        ? "linear-gradient(135deg, #B794F6, #9F7AEA)"
                        : "#F3EAFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {isDone ? (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 9L7.5 12.5L14 5.5" stroke="#81C995" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <StageIcon icon={stage.icon} status={stage.status} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links at bottom */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ color: "#3D2645", fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: -0.2 }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Training Plan", desc: "Week 10 of 12", path: "/smith8/training", emoji: "💪" },
            { label: "Blood Results", desc: "Mar 27, 2026", path: "/smith8/results", emoji: "🩸" },
            { label: "Messages", desc: "Dr. Johansson", path: "/smith8/messages", emoji: "💬" },
            { label: "Stage Details", desc: "Deepening Practice", path: "/smith8/stage", emoji: "📋" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => router.push(item.path)}
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                border: "1px solid #EFE6F8",
                boxShadow: "0 2px 6px rgba(183,148,246,0.08)",
                padding: "16px",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.emoji}</div>
              <p style={{ color: "#3D2645", fontSize: 15, fontWeight: 600, margin: "0 0 2px" }}>
                {item.label}
              </p>
              <p style={{ color: "#8B7B95", fontSize: 12, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
