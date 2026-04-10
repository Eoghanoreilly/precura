"use client";

import { useState } from "react";
import { TRAINING_PLAN, RISK_ASSESSMENTS, getMarkerHistory } from "@/lib/v2/mock-patient";

const glucoseHistory = getMarkerHistory("f-Glucose");

export default function ProgramPage() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(TRAINING_PLAN.currentWeek);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const weeks = Array.from({ length: TRAINING_PLAN.totalWeeks }, (_, i) => i + 1);

  // Simulate completion status per week
  function weekStatus(week: number): "complete" | "current" | "future" {
    if (week < TRAINING_PLAN.currentWeek) return "complete";
    if (week === TRAINING_PLAN.currentWeek) return "current";
    return "future";
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px" }}>
      {/* Header */}
      <div style={{ paddingTop: "20px", marginBottom: "24px" }}>
        <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "14px", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          12-Week Program
        </p>
        <h1 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "28px", margin: "4px 0 0", lineHeight: 1.1 }}>
          {TRAINING_PLAN.name}
        </h1>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "14px", margin: "8px 0 0", lineHeight: 1.5 }}>
          By {TRAINING_PLAN.createdBy}
        </p>
      </div>

      {/* Overall progress card */}
      <div style={{
        background: "linear-gradient(135deg, #FA6847, #FF6B4A)",
        borderRadius: "20px",
        padding: "24px 20px",
        marginBottom: "16px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: "-15px", left: "20%", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "14px", margin: 0 }}>
                Total progress
              </p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: "42px", margin: "4px 0 0", lineHeight: 1 }}>
                {Math.round((TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100)}%
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "13px", margin: 0 }}>
                {TRAINING_PLAN.totalCompleted} workouts done
              </p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "13px", margin: "4px 0 0" }}>
                Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "16px", height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.2)" }}>
            <div style={{
              height: "8px",
              borderRadius: "4px",
              background: "#fff",
              width: `${(TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Glucose trend mini */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: 0 }}>
            Blood Sugar Trend
          </h3>
          <span style={{
            color: "#FF9A56",
            fontWeight: 800,
            fontSize: "12px",
            background: "rgba(255,154,86,0.15)",
            padding: "3px 10px",
            borderRadius: "8px",
          }}>
            Rising
          </span>
        </div>

        {/* Mini sparkline */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "60px", marginBottom: "8px" }}>
          {glucoseHistory.map((point, idx) => {
            const min = 4.5;
            const max = 6.5;
            const height = ((point.value - min) / (max - min)) * 100;
            const isLast = idx === glucoseHistory.length - 1;
            return (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <div style={{
                  width: "100%",
                  maxWidth: "32px",
                  height: `${height}%`,
                  borderRadius: "8px 8px 4px 4px",
                  background: isLast
                    ? "linear-gradient(180deg, #FA6847, #FF9A56)"
                    : point.value > 5.5
                      ? "rgba(255,154,86,0.4)"
                      : "rgba(71,184,129,0.4)",
                  transition: "height 0.4s ease",
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>
            {glucoseHistory[0].date.slice(0, 4)}
          </span>
          <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>
            5.0 / 5.8 mmol/L
          </span>
          <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>
            {glucoseHistory[glucoseHistory.length - 1].date.slice(0, 4)}
          </span>
        </div>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "12px 0 0", lineHeight: 1.5 }}>
          This program targets the muscles that drive insulin sensitivity. Your next blood test in Sep 2026 will show if training is bending the curve.
        </p>
      </div>

      {/* Week grid */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          Week by Week
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {weeks.map((week) => {
            const status = weekStatus(week);
            const isSelected = selectedWeek === week;
            return (
              <button
                key={week}
                onClick={() => { setSelectedWeek(week); setSelectedDay(null); }}
                style={{
                  padding: "12px 8px",
                  borderRadius: "14px",
                  border: isSelected ? "2px solid #FA6847" : "2px solid transparent",
                  background: status === "complete"
                    ? "#47B881"
                    : status === "current"
                      ? "rgba(250,104,71,0.12)"
                      : "#FFE8E0",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <p style={{
                  color: status === "complete" ? "#fff" : status === "current" ? "#FA6847" : "#A0674A",
                  fontWeight: 800,
                  fontSize: "12px",
                  margin: 0,
                }}>
                  W{week}
                </p>
                {status === "complete" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "4px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {status === "current" && (
                  <div style={{ width: "8px", height: "8px", borderRadius: "4px", background: "#FA6847", margin: "6px auto 0" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected week detail */}
      {selectedWeek && (
        <div style={{
          background: "#FFFBF9",
          border: "2px solid #FFD4C4",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "16px",
        }}>
          <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
            Week {selectedWeek} Schedule
          </h3>
          {TRAINING_PLAN.weeklySchedule.map((session, dayIdx) => {
            const isDaySelected = selectedDay === dayIdx;
            const isPast = selectedWeek < TRAINING_PLAN.currentWeek;
            const isCurrentWeekPastDay = selectedWeek === TRAINING_PLAN.currentWeek && dayIdx < TRAINING_PLAN.completedThisWeek;
            const done = isPast || isCurrentWeekPastDay;

            return (
              <div key={dayIdx}>
                <button
                  onClick={() => setSelectedDay(isDaySelected ? null : dayIdx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 0",
                    background: "none",
                    border: "none",
                    borderBottom: dayIdx < TRAINING_PLAN.weeklySchedule.length - 1 && !isDaySelected ? "1px solid #FFE8E0" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    background: done ? "#47B881" : "rgba(250,104,71,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {done ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ color: "#FA6847", fontWeight: 900, fontSize: "14px" }}>
                        {session.day.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "15px", margin: 0 }}>
                      {session.name}
                    </p>
                    <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "2px 0 0" }}>
                      {session.day} / {session.exercises.length} exercises
                    </p>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A0674A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isDaySelected ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded exercises */}
                {isDaySelected && (
                  <div style={{
                    padding: "4px 0 16px 48px",
                    borderBottom: dayIdx < TRAINING_PLAN.weeklySchedule.length - 1 ? "1px solid #FFE8E0" : "none",
                  }}>
                    {session.exercises.map((exercise, exIdx) => (
                      <div
                        key={exIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 0",
                        }}
                      >
                        <div style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: "rgba(250,104,71,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <span style={{ color: "#FA6847", fontWeight: 800, fontSize: "12px" }}>{exIdx + 1}</span>
                        </div>
                        <div>
                          <p style={{ color: "#5A1A1A", fontWeight: 700, fontSize: "14px", margin: 0 }}>
                            {exercise.name}
                          </p>
                          <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "1px 0 0" }}>
                            {exercise.sets} x {exercise.reps} {exercise.unit}
                            {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Program goal */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 12px" }}>
          Program Goal
        </h3>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
          {TRAINING_PLAN.goal}
        </p>
        <div style={{ marginTop: "16px", padding: "14px 16px", background: "rgba(250,104,71,0.06)", borderRadius: "14px" }}>
          <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px", margin: "0 0 6px" }}>
            Reviewed by {TRAINING_PLAN.reviewedBy}
          </p>
          <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
            Your training plan is designed around your blood work and family history. Every exercise was chosen to target metabolic health.
          </p>
        </div>
      </div>

      {/* Key risk factors */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "24px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          What Training Targets
        </h3>
        {RISK_ASSESSMENTS.diabetes.keyFactors
          .filter((f) => f.changeable)
          .map((factor, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: idx < RISK_ASSESSMENTS.diabetes.keyFactors.filter((f) => f.changeable).length - 1 ? "1px solid #FFE8E0" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: factor.impact === "high" ? "#FF5555" : factor.impact === "medium" ? "#FF9A56" : "#47B881",
                }} />
                <span style={{ color: "#5A1A1A", fontWeight: 700, fontSize: "14px" }}>
                  {factor.name}
                </span>
              </div>
              <span style={{
                color: factor.impact === "high" ? "#FF5555" : factor.impact === "medium" ? "#FF9A56" : "#47B881",
                fontWeight: 800,
                fontSize: "12px",
                background: factor.impact === "high"
                  ? "rgba(255,85,85,0.1)"
                  : factor.impact === "medium"
                    ? "rgba(255,154,86,0.1)"
                    : "rgba(71,184,129,0.1)",
                padding: "3px 10px",
                borderRadius: "8px",
                textTransform: "uppercase",
              }}>
                {factor.impact} impact
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
