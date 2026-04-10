"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

export default function TrainingPage() {
  const router = useRouter();
  const [expandedDay, setExpandedDay] = useState<number>(0);

  const progressPercent = Math.round(
    (TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100
  );
  const weeklyProgress = Math.round(
    (TRAINING_PLAN.completedThisWeek / TRAINING_PLAN.weeklySchedule.length) * 100
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
          padding: "12px 20px",
        }}
      >
        <div style={{ maxWidth: 448, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/smith2")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Training plan</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Reviewed by Dr. Johansson</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* ----------------------------------------------------------------- */}
        {/* PROGRAM OVERVIEW                                                  */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in"
          style={{
            background: `linear-gradient(135deg, ${DOC_BG} 0%, #ecfdf5 100%)`,
            borderRadius: 18,
            padding: "18px",
            marginBottom: 16,
            border: `1px solid ${DOC_BORDER}`,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Dumbbell size={22} style={{ color: DOC_COLOR }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                {TRAINING_PLAN.name}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Created by {TRAINING_PLAN.createdBy}
              </p>
            </div>
          </div>

          {/* Doctor review badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 10,
              padding: "10px 12px",
              marginBottom: 14,
            }}
          >
            <img
              src={DOC_AVATAR}
              alt=""
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: `2px solid ${DOC_COLOR}` }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                Reviewed by Dr. Johansson
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Approved with medical considerations below
              </p>
            </div>
            <CheckCircle size={16} style={{ color: DOC_COLOR }} />
          </div>

          {/* Goal */}
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {TRAINING_PLAN.goal}
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* PROGRESS                                                          */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in stagger-1"
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 16,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Program progress</p>
            <span style={{ fontSize: 13, fontWeight: 600, color: DOC_COLOR }}>
              Week {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks}
            </span>
          </div>

          {/* Overall progress bar */}
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "var(--bg-elevated)",
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${DOC_COLOR}, #2dd4bf)`,
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div style={{ textAlign: "center" as const }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
                {TRAINING_PLAN.totalCompleted}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Total sessions</p>
            </div>
            <div style={{ textAlign: "center" as const }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: DOC_COLOR, letterSpacing: "-0.02em" }}>
                {TRAINING_PLAN.completedThisWeek}/3
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>This week</p>
            </div>
            <div style={{ textAlign: "center" as const }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
                {progressPercent}%
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Complete</p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* MEDICAL CONSIDERATIONS                                            */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in stagger-2"
          style={{
            background: DOC_BG,
            borderRadius: 14,
            padding: "14px",
            marginBottom: 16,
            border: `1px solid ${DOC_BORDER}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Shield size={14} style={{ color: DOC_COLOR }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: DOC_COLOR, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Doctor's medical notes for training
            </p>
          </div>
          {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: i < TRAINING_PLAN.medicalConsiderations.length - 1 ? 8 : 0,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: DOC_COLOR,
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {note}
              </p>
            </div>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* WEEKLY SCHEDULE                                                   */}
        {/* ----------------------------------------------------------------- */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 10,
            paddingLeft: 2,
          }}
        >
          Weekly schedule
        </p>

        {TRAINING_PLAN.weeklySchedule.map((day, dayIdx) => {
          const isExpanded = expandedDay === dayIdx;
          const isCompleted = dayIdx < TRAINING_PLAN.completedThisWeek;

          return (
            <div
              key={dayIdx}
              className="animate-fade-in stagger-3"
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                marginBottom: 10,
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpandedDay(isExpanded ? -1 : dayIdx)}
                style={{
                  width: "100%",
                  textAlign: "left" as const,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isCompleted ? (
                  <CheckCircle size={20} style={{ color: DOC_COLOR, flexShrink: 0 }} />
                ) : (
                  <Circle size={20} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{day.day}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {day.name} - {day.exercises.length} exercises
                  </p>
                </div>
                {isCompleted && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: DOC_COLOR,
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: DOC_BG,
                    }}
                  >
                    Done
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: "var(--text-faint)" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "var(--text-faint)" }} />
                )}
              </button>

              {isExpanded && (
                <div style={{ padding: "0 16px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {day.exercises.map((ex, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: "var(--bg-elevated)",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                            {ex.name}
                          </p>
                          {ex.notes && (
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                              {ex.notes}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: "right" as const, flexShrink: 0, marginLeft: 12 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: DOC_COLOR }}>
                            {ex.sets} x {ex.reps}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {ex.weight ? `${ex.weight} ${ex.unit}` : ex.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
