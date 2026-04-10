"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  ChevronRight,
  MapPin,
  Sparkles,
  Heart,
  MessageCircle,
  Dumbbell,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PATIENT,
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
  SCREENING_SCORES,
} from "@/lib/v2/mock-patient";

// ============================================================================
// JOURNEY MAP - Full visual path of Anna's health program
// Duolingo-style vertical path with done/current/locked stages
// ============================================================================

const GREEN = "#2d7a3a";
const GREEN_LIGHT = "#e8f5e9";

interface JourneyStage {
  id: number;
  title: string;
  subtitle: string;
  status: "done" | "current" | "locked";
  icon: React.ReactNode;
  weekRange: string;
  summary?: string;
  achievement?: string;
  details?: string[];
  stat?: { label: string; value: string };
}

const JOURNEY: JourneyStage[] = [
  {
    id: 1,
    title: "Risk Assessment",
    subtitle: "FINDRISC and health screenings",
    status: "done",
    icon: <MapPin size={20} />,
    weekRange: "Week 1",
    achievement: "Baseline established",
    summary: "You completed your FINDRISC diabetes risk screening, PHQ-9 (mental health), GAD-7 (anxiety), and AUDIT-C (alcohol) questionnaires.",
    details: [
      "FINDRISC score: 12 out of 26 (moderate diabetes risk)",
      "PHQ-9 score: 4 out of 27 (minimal depression - no treatment needed)",
      "GAD-7 score: 3 out of 21 (minimal anxiety)",
      "AUDIT-C score: 3 out of 12 (low risk alcohol use)",
    ],
    stat: { label: "FINDRISC", value: `${SCREENING_SCORES.findrisc.score}/26` },
  },
  {
    id: 2,
    title: "Understanding Your Results",
    subtitle: "What the scores mean for your health",
    status: "done",
    icon: <Sparkles size={20} />,
    weekRange: "Week 2",
    achievement: "Knowledge unlocked",
    summary: "You learned what each screening score means, how your family history affects risk, and which factors are in your control.",
    details: [
      "Moderate diabetes risk means ~17% chance over 10 years",
      "Your mother was diagnosed at 58, grandmother at 62 - strong family pattern",
      "Changeable factors: activity level, weight, blood sugar management",
      "Non-changeable factors: family history, age, genetics",
    ],
    stat: { label: "10-year risk", value: "~17%" },
  },
  {
    id: 3,
    title: "Your First Blood Test",
    subtitle: "Ordering, booking, and getting drawn",
    status: "done",
    icon: <Heart size={20} />,
    weekRange: "Week 3",
    achievement: "First test complete",
    summary: "Dr. Johansson ordered a comprehensive blood panel. You visited Karolinska University Laboratory for the blood draw.",
    details: [
      "10 markers tested including HbA1c (long-term blood sugar), glucose, cholesterol panel",
      "Blood drawn at Karolinska University Laboratory",
      "Results ready within 3 business days",
    ],
    stat: { label: "Markers tested", value: "10" },
  },
  {
    id: 4,
    title: "Blood Test Results + Doctor Review",
    subtitle: "Dr. Johansson reviewed everything personally",
    status: "done",
    icon: <MessageCircle size={20} />,
    weekRange: "Week 4",
    achievement: "Full picture revealed",
    summary: "Your results came back. Most markers are healthy, but Dr. Johansson flagged two important trends.",
    details: [
      "Fasting glucose (blood sugar): 5.8 mmol/L - borderline, rising from 5.0 over 5 years",
      "HbA1c (long-term blood sugar): 38 mmol/mol - normal but approaching pre-diabetic range (42+)",
      "Total cholesterol: 5.1 mmol/L - marginally above recommended",
      "HDL (good cholesterol): 1.6 mmol/L - healthy",
      "Vitamin D: 48 nmol/L - slightly below optimal (target 50+)",
    ],
    stat: { label: "Glucose", value: "5.8 mmol/L" },
  },
  {
    id: 5,
    title: "Starting Your Training Plan",
    subtitle: "Your personalized Metabolic Health Program",
    status: "done",
    icon: <Dumbbell size={20} />,
    weekRange: "Weeks 5-6",
    achievement: "First 6 workouts done",
    summary: "Your trainer Eoghan designed a 3x/week program focused on insulin sensitivity and cardiovascular health, reviewed by Dr. Johansson.",
    details: [
      "Monday: Upper body (push-ups, rows, shoulder press, plank)",
      "Wednesday: Lower body + core (squats, lunges, glute bridges, dead bugs)",
      "Friday: Full body + cardio (walk intervals, band work, step-ups, core circuit)",
      "Medical considerations: blood pressure monitoring, back history, post-meal walks",
    ],
    stat: { label: "Sessions/week", value: "3" },
  },
  {
    id: 6,
    title: "Building Habits",
    subtitle: "Making exercise and nutrition stick",
    status: "done",
    icon: <Flame size={20} />,
    weekRange: "Weeks 7-8",
    achievement: "Habit streak: 4 weeks",
    summary: "You built consistency with 12 more sessions and added daily habits: post-dinner walks for blood sugar, Vitamin D supplementation.",
    details: [
      "12 training sessions completed in 2 weeks",
      "Started post-dinner walks (20 min) for blood sugar regulation",
      "Started Vitamin D3 supplementation (2000 IU daily)",
      "Enalapril (blood pressure medication) continued as prescribed",
    ],
    stat: { label: "Workouts", value: "18 total" },
  },
  {
    id: 7,
    title: "Deepening Your Practice",
    subtitle: "Weeks 9-12 of your training program",
    status: "current",
    icon: <TrendingUp size={20} />,
    weekRange: "Weeks 9-12 (you are here - week 10)",
    summary: "Focus is on increasing intensity, refining form, and building the consistency that sticks for life. You are 83% through your initial program.",
    details: [
      "28 total sessions completed out of 36 planned",
      "Week 10: 2 of 3 workouts done so far",
      "This week's lesson: Why muscles are your best medicine",
      "Next up: Workout #29 - Lower Body + Core",
    ],
    stat: { label: "Completed", value: `${TRAINING_PLAN.totalCompleted}/${TRAINING_PLAN.totalWeeks * 3}` },
  },
  {
    id: 8,
    title: "Your 6-Month Check-In",
    subtitle: "Second blood test to measure progress",
    status: "locked",
    icon: <Calendar size={20} />,
    weekRange: "September 2026",
    summary: "A repeat comprehensive blood panel to see how your lifestyle changes are showing up in your numbers.",
  },
  {
    id: 9,
    title: "Measuring Progress",
    subtitle: "Compare your before and after numbers",
    status: "locked",
    icon: <TrendingUp size={20} />,
    weekRange: "After blood test",
    summary: "Side-by-side comparison of every blood marker, plus biometric trends (weight, waist, blood pressure).",
  },
  {
    id: 10,
    title: "Your Year In Review",
    subtitle: "A full picture of how far you have come",
    status: "locked",
    icon: <Award size={20} />,
    weekRange: "January 2027",
    summary: "Complete review of your health journey: screening results, blood test trends, training milestones, and a plan for year two.",
  },
];

export default function JourneyMap() {
  const [expanded, setExpanded] = useState<number | null>(7); // Current stage open by default

  const doneCount = JOURNEY.filter((s) => s.status === "done").length;
  const totalCount = JOURNEY.length;
  const overallProgress = Math.round((doneCount / totalCount) * 100);

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
            Your Health Journey
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {doneCount} of {totalCount} stages completed
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Overall progress */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              Overall progress
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>
              {overallProgress}%
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "#eee",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${overallProgress}%`,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${GREEN}, #4caf50)`,
                transition: "width 0.6s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <span>Jan 2026</span>
            <span>Jan 2027</span>
          </div>
        </div>

        {/* Journey path - vertical */}
        <div style={{ marginTop: 24, position: "relative" }}>
          {JOURNEY.map((stage, idx) => {
            const isExpanded = expanded === stage.id;
            const isLast = idx === JOURNEY.length - 1;

            return (
              <div key={stage.id} style={{ position: "relative" }}>
                {/* Vertical connector line */}
                {!isLast && (
                  <div
                    style={{
                      position: "absolute",
                      left: 23,
                      top: 48,
                      bottom: 0,
                      width: 3,
                      background:
                        stage.status === "done" ? GREEN : "#e0e0e0",
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Stage row */}
                <button
                  onClick={() => {
                    if (stage.status !== "locked") {
                      setExpanded(isExpanded ? null : stage.id);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "12px 0",
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: stage.status === "locked" ? "default" : "pointer",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Node circle */}
                  <div
                    style={{
                      width: stage.status === "current" ? 48 : 40,
                      height: stage.status === "current" ? 48 : 40,
                      borderRadius: "50%",
                      background:
                        stage.status === "done"
                          ? GREEN
                          : stage.status === "current"
                          ? GREEN
                          : "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        stage.status === "locked" ? "#bbb" : "#fff",
                      flexShrink: 0,
                      border:
                        stage.status === "current"
                          ? `3px solid ${GREEN_LIGHT}`
                          : "none",
                      boxShadow:
                        stage.status === "current"
                          ? `0 0 0 3px ${GREEN}, 0 4px 12px rgba(45,122,58,0.3)`
                          : stage.status === "done"
                          ? "none"
                          : "inset 0 1px 3px rgba(0,0,0,0.06)",
                      transition: "all 0.3s",
                    }}
                  >
                    {stage.status === "done" ? (
                      <CheckCircle2 size={20} />
                    ) : stage.status === "current" ? (
                      stage.icon
                    ) : (
                      <Lock size={16} />
                    )}
                  </div>

                  {/* Stage text */}
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color:
                            stage.status === "done"
                              ? GREEN
                              : stage.status === "current"
                              ? GREEN
                              : "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Stage {stage.id}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                        }}
                      >
                        {stage.weekRange}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color:
                          stage.status === "locked"
                            ? "var(--text-muted)"
                            : "var(--text)",
                        marginTop: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {stage.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {stage.subtitle}
                    </div>
                    {stage.achievement && stage.status === "done" && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 6,
                          padding: "2px 8px",
                          borderRadius: 8,
                          background: GREEN_LIGHT,
                          fontSize: 11,
                          fontWeight: 600,
                          color: GREEN,
                        }}
                      >
                        <Award size={10} />
                        {stage.achievement}
                      </div>
                    )}
                    {stage.status === "current" && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 6,
                          padding: "3px 10px",
                          borderRadius: 8,
                          background: GREEN,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        In progress
                      </div>
                    )}
                  </div>

                  {/* Expand indicator */}
                  {stage.status !== "locked" && (
                    <div style={{ paddingTop: 8, color: "var(--text-muted)" }}>
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && stage.status !== "locked" && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginLeft: 56,
                      marginBottom: 8,
                      background: "var(--bg-card)",
                      borderRadius: 16,
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                      padding: "16px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {stage.stat && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          borderRadius: 8,
                          background: GREEN_LIGHT,
                          marginBottom: 10,
                        }}
                      >
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {stage.stat.label}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: GREEN,
                          }}
                        >
                          {stage.stat.value}
                        </span>
                      </div>
                    )}

                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        margin: "0 0 10px",
                      }}
                    >
                      {stage.summary}
                    </p>

                    {stage.details && (
                      <ul
                        style={{
                          margin: 0,
                          padding: "0 0 0 16px",
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                        }}
                      >
                        {stage.details.map((d, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}

                    {stage.status === "current" && (
                      <Link
                        href="/smith8/stage?id=7"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 12,
                          padding: "8px 16px",
                          background: GREEN,
                          color: "#fff",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Continue this stage <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
