"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Dumbbell, TrendingUp, ChevronRight, ChevronDown, ChevronUp,
  Link2, Calendar, Heart, Target, CheckCircle2, Circle,
  AlertTriangle, Droplets, Activity,
} from "lucide-react";
import {
  PATIENT, TRAINING_PLAN, BIOMETRICS_HISTORY, RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Helpers
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ============================================================================
// Progress ring
// ============================================================================

function ProgressRing({ current, total, size, color }: { current: number; total: number; size: number; color: string }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / total, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--bg-elevated)" strokeWidth={6}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

// ============================================================================
// Workout day card
// ============================================================================

function WorkoutDayCard({ day, expanded, onToggle }: {
  day: typeof TRAINING_PLAN.weeklySchedule[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      borderRadius: 14,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--green-bg)",
          color: "var(--green)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Dumbbell size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{day.day}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{day.name}</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {day.exercises.length} exercises
        </div>
        {expanded ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
      </button>

      {expanded && (
        <div style={{
          padding: "0 16px 16px",
          borderTop: "1px solid var(--divider)",
          animation: "fadeIn 0.2s ease",
        }}>
          {day.exercises.map((ex, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{ex.name}</span>
                {ex.notes && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{ex.notes}</div>
                )}
              </div>
              <span style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "#0f5959",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>
                {ex.sets} x {ex.reps} {ex.unit}
                {ex.weight ? ` @ ${ex.weight}${ex.unit === "kg" ? "" : "kg"}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function TrackingPage() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const weekProgress = (TRAINING_PLAN.completedThisWeek / TRAINING_PLAN.weeklySchedule.length) * 100;
  const totalProgress = (TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100;

  const glucoseData = getMarkerHistory("f-Glucose");
  const latestGluc = glucoseData.length > 0 ? glucoseData[glucoseData.length - 1].value : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(248,249,250,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <Link href="/smith7" style={{ color: "var(--text-muted)", display: "flex" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f5959", margin: 0 }}>
              Training plan
            </h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
              {TRAINING_PLAN.name}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px 80px" }}>

        {/* Progress hero */}
        <div className="animate-fade-in" style={{
          borderRadius: 20,
          background: "linear-gradient(135deg, #0f5959, #1a7a7a)",
          padding: "24px 20px",
          color: "#fff",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Progress ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <ProgressRing current={TRAINING_PLAN.currentWeek} total={TRAINING_PLAN.totalWeeks} size={80} color="rgba(255,255,255,0.9)" />
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {TRAINING_PLAN.currentWeek}
                </span>
                <span style={{ fontSize: 9, opacity: 0.7 }}>of {TRAINING_PLAN.totalWeeks}</span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
                Week {TRAINING_PLAN.currentWeek}
              </h2>
              <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 10px" }}>
                {TRAINING_PLAN.totalCompleted} sessions completed total
              </p>

              {/* This week progress */}
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {TRAINING_PLAN.weeklySchedule.map((_, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i < TRAINING_PLAN.completedThisWeek ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 10, opacity: 0.7 }}>
                {TRAINING_PLAN.completedThisWeek}/{TRAINING_PLAN.weeklySchedule.length} this week
              </span>
            </div>
          </div>
        </div>

        {/* Why this plan exists - timeline connection */}
        <div className="animate-fade-in stagger-1" style={{
          padding: "16px 18px",
          borderRadius: 16,
          background: "#e0f7f5",
          border: "1.5px solid #0f5959",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Link2 size={14} style={{ color: "#0f5959" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f5959", textTransform: "uppercase" }}>
              Connected to your health timeline
            </span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#0f5959", margin: "0 0 10px" }}>
            This training plan was designed specifically for Anna&apos;s metabolic health profile.
            It targets the modifiable risk factors identified in her health timeline.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { icon: <Droplets size={12} />, text: `Fasting glucose at ${latestGluc} mmol/L - exercise improves insulin sensitivity` },
              { icon: <Heart size={12} />, text: "Blood pressure on Enalapril - avoid heavy overhead pressing" },
              { icon: <Activity size={12} />, text: "Lower back history - core strengthening included, no loaded spinal flexion" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: "#0f5959", flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <span style={{ fontSize: 11, color: "#0f5959", lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan details */}
        <div className="animate-fade-in stagger-2" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
            {TRAINING_PLAN.name}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 10px" }}>
            Created by {TRAINING_PLAN.createdBy}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
            Goal: {TRAINING_PLAN.goal}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              padding: "6px 12px",
              borderRadius: 10,
              background: "var(--bg-elevated)",
              fontSize: 11,
              color: "var(--text-secondary)",
            }}>
              <strong>{TRAINING_PLAN.weeklySchedule.length}x</strong> per week
            </div>
            <div style={{
              padding: "6px 12px",
              borderRadius: 10,
              background: "var(--bg-elevated)",
              fontSize: 11,
              color: "var(--text-secondary)",
            }}>
              Started {formatDate(TRAINING_PLAN.startDate)}
            </div>
            <div style={{
              padding: "6px 12px",
              borderRadius: 10,
              background: "var(--bg-elevated)",
              fontSize: 11,
              color: "var(--text-secondary)",
            }}>
              Reviewed by Dr. Johansson
            </div>
          </div>
        </div>

        {/* Weekly schedule */}
        <div className="animate-fade-in stagger-3">
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 8px" }}>
            Weekly schedule
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {TRAINING_PLAN.weeklySchedule.map((day) => (
              <WorkoutDayCard
                key={day.day}
                day={day}
                expanded={expandedDay === day.day}
                onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              />
            ))}
          </div>
        </div>

        {/* Medical considerations */}
        <div className="animate-fade-in stagger-4" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <AlertTriangle size={14} style={{ color: "var(--amber)" }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              Medical considerations
            </h3>
          </div>
          {TRAINING_PLAN.medicalConsiderations.map((mc, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <span style={{ color: "var(--amber)", fontSize: 13, flexShrink: 0 }}>*</span>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)", margin: 0 }}>
                {mc}
              </p>
            </div>
          ))}
        </div>

        {/* Impact on risk factors */}
        <div className="animate-fade-in stagger-5" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 10px" }}>
            Expected impact on risk factors
          </h3>
          {[
            { factor: "Insulin sensitivity", impact: "Training 3x/week can improve by 20-40%", color: "var(--green)" },
            { factor: "Blood pressure", impact: "Regular exercise can reduce by 5-8 mmHg systolic", color: "var(--green)" },
            { factor: "Weight management", impact: "Supports maintaining 78kg or gradual reduction", color: "var(--green)" },
            { factor: "Metabolic syndrome", impact: "May prevent meeting the 3rd criteria threshold", color: "var(--amber)" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: item.color,
                flexShrink: 0,
                marginTop: 6,
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{item.factor}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{item.impact}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <Link href="/smith7" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px 20px",
          borderRadius: 14,
          background: "#0f5959",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}>
          <ArrowLeft size={16} />
          Back to Health Timeline
        </Link>
      </div>
    </div>
  );
}
