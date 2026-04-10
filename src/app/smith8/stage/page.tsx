"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  TrendingUp,
  Calendar,
  Heart,
  Sparkles,
  MessageCircle,
  Clock,
  Target,
  Award,
  BarChart3,
} from "lucide-react";
import {
  PATIENT,
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  MESSAGES,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// STAGE DETAIL - Deep view of current stage (Stage 7: Deepening Your Practice)
// Shows training progress, blood marker context, upcoming milestones
// ============================================================================

const GREEN = "#2d7a3a";
const GREEN_LIGHT = "#e8f5e9";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Mini sparkline
function Sparkline({ data, color }: { data: { value: number }[]; color: string }) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals) * 0.97;
  const max = Math.max(...vals) * 1.03;
  const w = 100;
  const h = 32;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const last = vals[vals.length - 1];
  const lx = w;
  const ly = h - ((last - min) / (max - min)) * h;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lx} cy={ly} r={3.5} fill="#fff" stroke={color} strokeWidth={2} />
    </svg>
  );
}

function StageContent() {
  const searchParams = useSearchParams();
  const stageId = parseInt(searchParams.get("id") || "7", 10);

  const glucoseHistory = getMarkerHistory("f-Glucose");
  const hba1cHistory = getMarkerHistory("HbA1c");
  const latestGlucose = BLOOD_TEST_HISTORY[0].results.find((r) => r.shortName === "f-Glucose");
  const latestHba1c = BLOOD_TEST_HISTORY[0].results.find((r) => r.shortName === "HbA1c");

  const sessionsCompleted = TRAINING_PLAN.totalCompleted;
  const sessionsTotal = TRAINING_PLAN.totalWeeks * 3;
  const sessionsProgress = Math.round((sessionsCompleted / sessionsTotal) * 100);

  const weekProgress = Math.round(
    (TRAINING_PLAN.completedThisWeek / 3) * 100
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <Link
          href="/smith8"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--bg-elevated)",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Stage 7: Deepening Your Practice
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Weeks 9-12 / You are in week 10
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Stage hero */}
        <div
          style={{
            marginTop: 20,
            background: `linear-gradient(135deg, ${GREEN}, #3a9748)`,
            borderRadius: 20,
            padding: "24px 20px",
            color: "#fff",
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              opacity: 0.8,
              marginBottom: 10,
            }}
          >
            <TrendingUp size={14} />
            Current Stage
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            Deepening Your Practice
          </h1>
          <p
            style={{
              fontSize: 14,
              opacity: 0.85,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            You are in the home stretch of your initial 12-week program.
            Focus now is on increasing intensity, perfecting form, and
            building the habits that will last a lifetime.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {sessionsCompleted}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                sessions done
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {sessionsTotal - sessionsCompleted}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                sessions left
              </div>
            </div>
          </div>
        </div>

        {/* This week's training */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-1"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
              This week&apos;s training
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: GREEN,
              }}
            >
              {TRAINING_PLAN.completedThisWeek}/3 done
            </div>
          </div>

          {/* Week progress bar */}
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "#eee",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${weekProgress}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${GREEN}, #4caf50)`,
              }}
            />
          </div>

          {TRAINING_PLAN.weeklySchedule.map((workout, idx) => {
            const isDone = idx < TRAINING_PLAN.completedThisWeek;
            const isNext = idx === TRAINING_PLAN.completedThisWeek;

            return (
              <div
                key={workout.day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom:
                    idx < TRAINING_PLAN.weeklySchedule.length - 1
                      ? "1px solid var(--divider)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isDone
                      ? GREEN_LIGHT
                      : isNext
                      ? "#e3f2fd"
                      : "var(--bg-elevated)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} color={GREEN} />
                  ) : (
                    <Dumbbell
                      size={16}
                      color={isNext ? "#1565c0" : "var(--text-muted)"}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isDone ? "var(--text-muted)" : "var(--text)",
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {workout.day}: {workout.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {workout.exercises.length} exercises
                  </div>
                </div>
                {isNext && (
                  <Link
                    href="/smith8/today"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1565c0",
                      background: "#e3f2fd",
                      padding: "4px 10px",
                      borderRadius: 8,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Next up <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Why this matters - context from blood tests */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-2"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <BarChart3 size={16} color={GREEN} />
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Why this training matters
            </span>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              margin: "0 0 16px",
            }}
          >
            Your training program is specifically designed to address what your blood tests
            and risk assessment showed. Here are the numbers you are working to change:
          </p>

          {/* Glucose trend */}
          <div
            style={{
              padding: "14px",
              background: "var(--bg-elevated)",
              borderRadius: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>
                  Fasting glucose (blood sugar, fasting)
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
                    {latestGlucose?.value}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {latestGlucose?.unit}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--amber-text)",
                    background: "var(--amber-bg)",
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontWeight: 500,
                    marginTop: 4,
                  }}
                >
                  Borderline - rising over 5 years
                </div>
              </div>
              <Sparkline
                data={glucoseHistory.map((h) => ({ value: h.value }))}
                color="#e65100"
              />
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              Was 5.0 in 2021, now 5.8. Your training helps muscles absorb glucose
              without insulin. Goal: stabilize or reverse this trend by September.
            </div>
          </div>

          {/* HbA1c */}
          <div
            style={{
              padding: "14px",
              background: "var(--bg-elevated)",
              borderRadius: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>
                  HbA1c (long-term blood sugar)
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
                    {latestHba1c?.value}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {latestHba1c?.unit}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--green-text)",
                    background: "var(--green-bg)",
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontWeight: 500,
                    marginTop: 4,
                  }}
                >
                  Normal - but approaching pre-diabetic (42+)
                </div>
              </div>
              <Sparkline
                data={hba1cHistory.map((h) => ({ value: h.value }))}
                color={GREEN}
              />
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              This reflects your average blood sugar over 3 months. Currently 38 of
              a max-normal 42. Exercise and diet are the main levers you have.
            </div>
          </div>

          {/* Risk summary */}
          <div
            style={{
              padding: "14px",
              background: GREEN_LIGHT,
              borderRadius: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Target size={16} color={GREEN} />
              <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>
                Your target for September
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Stabilize fasting glucose at or below 5.8 mmol/L. Keep HbA1c (long-term
              blood sugar) under 42 mmol/mol. Maintain training consistency of 3x/week.
              These are realistic goals based on your current trajectory.
            </div>
          </div>
        </div>

        {/* Doctor's note */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-3"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
                color: "#1565c0",
              }}
            >
              MJ
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Dr. Marcus Johansson
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Note from your last review
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              background: "var(--bg-elevated)",
              borderRadius: 14,
              padding: "14px",
            }}
          >
            &quot;Your metabolic trajectory is concerning given strong family history of type 2
            diabetes (mother diagnosed at 58) and cardiovascular disease (father, heart
            attack at 65). Currently meeting 2 of 5 metabolic syndrome criteria with waist
            circumference approaching the third. Continue current training plan targeting
            metabolic health. Retest comprehensive panel in 6 months.&quot;
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            {formatDate(DOCTOR_NOTES[0].date)}
          </div>
        </div>

        {/* Milestones ahead */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-4"
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            Milestones ahead
          </div>

          {[
            {
              icon: <Dumbbell size={16} />,
              label: "Complete 12-week program",
              detail: "2 weeks remaining / 8 sessions left",
              iconBg: "#e3f2fd",
              iconColor: "#1565c0",
            },
            {
              icon: <Calendar size={16} />,
              label: "6-month blood test",
              detail: `Scheduled for ${formatDate(PATIENT.nextBloodTest)}`,
              iconBg: GREEN_LIGHT,
              iconColor: GREEN,
            },
            {
              icon: <TrendingUp size={16} />,
              label: "Before vs. after comparison",
              detail: "Compare all markers side-by-side",
              iconBg: "#ede7f6",
              iconColor: "#5e35b1",
            },
            {
              icon: <Award size={16} />,
              label: "Year in review",
              detail: "January 2027 - your complete health story",
              iconBg: "#fff8e1",
              iconColor: "#e65100",
            },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < 3 ? "1px solid var(--divider)" : "none",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: m.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: m.iconColor,
                  flexShrink: 0,
                }}
              >
                {m.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {m.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <Link
            href="/smith8/today"
            style={{
              background: GREEN,
              color: "#fff",
              borderRadius: 14,
              padding: "16px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            <Dumbbell size={20} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Today&apos;s tasks
            </div>
          </Link>
          <Link
            href="/smith8/journey"
            style={{
              background: "var(--bg-card)",
              color: "var(--text)",
              borderRadius: 14,
              padding: "16px",
              textDecoration: "none",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <Award size={20} style={{ marginBottom: 6, color: GREEN }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Full journey
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StagePage() {
  return (
    <Suspense
      fallback={
        <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--text-muted)" }}>Loading...</div>
        </div>
      }
    >
      <StageContent />
    </Suspense>
  );
}
