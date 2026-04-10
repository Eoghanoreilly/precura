"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  BLOOD_TEST_HISTORY,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Timer,
  Target,
  Info,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipForward,
  AlertTriangle,
} from "lucide-react";

const plan = TRAINING_PLAN;
const todayIndex = plan.completedThisWeek;
const todayWorkout = plan.weeklySchedule[todayIndex] || plan.weeklySchedule[0];
const latestGlucose = BLOOD_TEST_HISTORY[0].results.find(
  (r) => r.shortName === "f-Glucose"
);

export default function SessionPage() {
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set()
  );
  const [expandedExercise, setExpandedExercise] = useState<number | null>(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  const toggleComplete = (idx: number) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allDone = completedExercises.size === todayWorkout.exercises.length;
  const progress =
    (completedExercises.size / todayWorkout.exercises.length) * 100;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <header
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          background: "var(--bg)",
          zIndex: 40,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/smith4"
          style={{
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={22} />
        </Link>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            {todayWorkout.day} - {todayWorkout.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Week {plan.currentWeek} / {plan.name}
          </div>
        </div>
      </header>

      <main style={{ padding: "16px 20px 100px", maxWidth: 480, margin: "0 auto" }}>
        {/* Session progress */}
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {completedExercises.size} / {todayWorkout.exercises.length}{" "}
              exercises done
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: allDone ? "var(--green-text)" : "#FF6B35",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "var(--bg-elevated)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: allDone
                  ? "var(--green)"
                  : "linear-gradient(90deg, #FF6B35, #FF8F65)",
                borderRadius: 3,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Health context */}
        <div
          style={{
            background: "#FFF3ED",
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Target size={16} color="#FF6B35" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: "#FF6B35" }}>Session goal:</strong> Improve
            insulin sensitivity. Your blood sugar (fasting) is{" "}
            {latestGlucose?.value} {latestGlucose?.unit} - resistance training
            helps your muscles absorb glucose.
          </span>
        </div>

        {/* Start / Pause button */}
        {!sessionStarted ? (
          <button
            onClick={() => setSessionStarted(true)}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #FF6B35, #E8522A)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <Play size={20} fill="#fff" />
            Start Session
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <button
              onClick={() => setSessionStarted(false)}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 14,
                background: "var(--bg-elevated)",
                color: "var(--text-secondary)",
                fontSize: 14,
                fontWeight: 700,
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Pause size={16} />
              Pause
            </button>
            <button
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 14,
                background: allDone
                  ? "linear-gradient(135deg, var(--green), #2e7d32)"
                  : "var(--bg-elevated)",
                color: allDone ? "#fff" : "var(--text-muted)",
                fontSize: 14,
                fontWeight: 700,
                border: allDone ? "none" : "1px solid var(--border)",
                cursor: allDone ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <CheckCircle2 size={16} />
              Finish
            </button>
          </div>
        )}

        {/* Exercise list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {todayWorkout.exercises.map((exercise, idx) => {
            const isDone = completedExercises.has(idx);
            const isExpanded = expandedExercise === idx;

            return (
              <div
                key={exercise.name}
                className="animate-fade-in"
                style={{
                  background: isDone ? "var(--green-bg)" : "var(--bg-card)",
                  borderRadius: 16,
                  border: `1px solid ${
                    isDone ? "var(--green)" : "var(--border)"
                  }`,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  opacity: isDone ? 0.85 : 1,
                }}
              >
                {/* Exercise header */}
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setExpandedExercise(isExpanded ? null : idx)
                  }
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(idx);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2
                        size={24}
                        color="var(--green)"
                        fill="var(--green)"
                        stroke="#fff"
                      />
                    ) : (
                      <Circle size={24} color="var(--border)" />
                    )}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: isDone
                          ? "var(--green-text)"
                          : "var(--text)",
                        textDecoration: isDone ? "line-through" : "none",
                      }}
                    >
                      {exercise.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {exercise.sets} sets x {exercise.reps}{" "}
                      {exercise.unit}
                      {exercise.weight
                        ? ` @ ${exercise.weight}kg`
                        : ""}
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp
                      size={18}
                      color="var(--text-muted)"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      color="var(--text-muted)"
                    />
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "0 16px 14px",
                      borderTop: `1px solid ${
                        isDone
                          ? "rgba(46,125,50,0.15)"
                          : "var(--divider)"
                      }`,
                    }}
                  >
                    {/* Set tracking */}
                    <div style={{ padding: "14px 0 8px" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: 10,
                        }}
                      >
                        Sets
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        {Array.from({ length: exercise.sets }).map(
                          (_, setIdx) => (
                            <div
                              key={setIdx}
                              style={{
                                flex: 1,
                                padding: "10px 0",
                                background: isDone
                                  ? "rgba(46,125,50,0.12)"
                                  : "var(--bg-elevated)",
                                borderRadius: 10,
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  marginBottom: 2,
                                }}
                              >
                                Set {setIdx + 1}
                              </div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: "var(--text)",
                                }}
                              >
                                {exercise.reps}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {exercise.unit}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {exercise.notes && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          padding: "10px 12px",
                          background: "#FFF8E1",
                          borderRadius: 10,
                          marginTop: 6,
                        }}
                      >
                        <Info
                          size={14}
                          color="var(--amber-text)"
                          style={{ marginTop: 1, flexShrink: 0 }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                            lineHeight: 1.4,
                          }}
                        >
                          {exercise.notes}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Medical considerations */}
        <div
          style={{
            marginTop: 24,
            padding: "14px 16px",
            background: "var(--amber-bg)",
            borderRadius: 14,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle
            size={16}
            color="var(--amber-text)"
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--amber-text)",
                marginBottom: 6,
              }}
            >
              Medical considerations
            </div>
            {plan.medicalConsiderations.map((note, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.45,
                  marginBottom: i < plan.medicalConsiderations.length - 1 ? 6 : 0,
                  paddingLeft: 8,
                }}
              >
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Post-workout tip */}
        <div
          style={{
            marginTop: 14,
            padding: "14px 16px",
            background: "var(--teal-bg)",
            borderRadius: 14,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <Target
            size={16}
            color="var(--teal-text)"
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--teal-text)",
                marginBottom: 3,
              }}
            >
              Post-workout tip
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.45,
              }}
            >
              A 20-minute walk after your session helps shuttle glucose from your
              blood into your muscles. Even a slow walk makes a measurable
              difference for insulin sensitivity.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
