"use client";

import { useState } from "react";
import {
  PATIENT,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  BLOOD_TEST_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const todayIndex = 0; // Monday - Upper Body
const todayWorkout = TRAINING_PLAN.weeklySchedule[todayIndex];
const glucoseHistory = getMarkerHistory("f-Glucose");
const latestGlucose = glucoseHistory[glucoseHistory.length - 1];
const latestSession = BLOOD_TEST_HISTORY[0];
const hba1c = latestSession.results.find((r) => r.shortName === "HbA1c");

export default function TodayPage() {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});
  const [workoutStarted, setWorkoutStarted] = useState(false);

  function toggleSet(exerciseIndex: number, setIndex: number) {
    const key = `${exerciseIndex}`;
    setCompletedSets((prev) => {
      const current = prev[key] || Array(todayWorkout.exercises[exerciseIndex].sets).fill(false);
      const updated = [...current];
      updated[setIndex] = !updated[setIndex];
      return { ...prev, [key]: updated };
    });
  }

  const totalSets = todayWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const doneSets = Object.values(completedSets).reduce(
    (sum, arr) => sum + arr.filter(Boolean).length,
    0
  );
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px" }}>
      {/* Header */}
      <div style={{ paddingTop: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "14px", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
            </p>
            <h1 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "28px", margin: "4px 0 0", lineHeight: 1.1 }}>
              Hey {PATIENT.firstName}
            </h1>
          </div>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #FA6847, #FF9A56)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: "18px",
          }}>
            {PATIENT.firstName[0]}
          </div>
        </div>
      </div>

      {/* Health context pill */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "16px 20px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: "rgba(250,104,71,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FA6847" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "15px", margin: 0, lineHeight: 1.3 }}>
            Today targets insulin sensitivity
          </p>
          <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "2px 0 0" }}>
            Blood sugar (fasting): {latestGlucose.value} mmol/L &middot; Trend: rising
          </p>
        </div>
      </div>

      {/* Today's workout card */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "0",
        marginBottom: "16px",
        boxShadow: "0 4px 12px rgba(250,104,71,0.15)",
        overflow: "hidden",
      }}>
        {/* Workout header */}
        <div style={{
          background: "linear-gradient(135deg, #FA6847, #FF6B4A)",
          padding: "24px 20px 20px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background circles */}
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ position: "absolute", bottom: "-10px", left: "30%", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "13px", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {todayWorkout.day}
                </p>
                <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "26px", margin: "4px 0 0", lineHeight: 1.1 }}>
                  {todayWorkout.name}
                </h2>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "8px 12px",
                backdropFilter: "blur(8px)",
              }}>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: "14px", margin: 0 }}>
                  {todayWorkout.exercises.length} exercises
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "6px 12px" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{totalSets} sets</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "6px 12px" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>~35 min</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "6px 12px" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>Strength</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar (visible after start) */}
        {workoutStarted && (
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px" }}>Progress</span>
              <span style={{ color: "#FA6847", fontWeight: 800, fontSize: "14px" }}>{doneSets}/{totalSets} sets</span>
            </div>
            <div style={{ height: "8px", borderRadius: "4px", background: "#FFE8E0" }}>
              <div style={{
                height: "8px",
                borderRadius: "4px",
                background: "linear-gradient(90deg, #FA6847, #FF9A56)",
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}

        {/* Exercise list */}
        <div style={{ padding: "16px 20px 20px" }}>
          {todayWorkout.exercises.map((exercise, exIdx) => {
            const sets = completedSets[`${exIdx}`] || Array(exercise.sets).fill(false);
            const exerciseDone = sets.every(Boolean);
            const isExpanded = expandedExercise === exIdx;

            return (
              <div
                key={exIdx}
                style={{
                  marginBottom: exIdx < todayWorkout.exercises.length - 1 ? "12px" : 0,
                  borderRadius: "16px",
                  border: exerciseDone ? "2px solid #47B881" : "2px solid #FFD4C4",
                  background: exerciseDone ? "rgba(71,184,129,0.05)" : "#fff",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Exercise header */}
                <button
                  onClick={() => {
                    if (workoutStarted) setExpandedExercise(isExpanded ? null : exIdx);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "none",
                    border: "none",
                    cursor: workoutStarted ? "pointer" : "default",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    background: exerciseDone ? "#47B881" : "rgba(250,104,71,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.3s ease",
                  }}>
                    {exerciseDone ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ color: "#FA6847", fontWeight: 900, fontSize: "15px" }}>{exIdx + 1}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      color: exerciseDone ? "#47B881" : "#5A1A1A",
                      fontWeight: 800,
                      fontSize: "15px",
                      margin: 0,
                      textDecoration: exerciseDone ? "line-through" : "none",
                    }}>
                      {exercise.name}
                    </p>
                    <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "2px 0 0" }}>
                      {exercise.sets} x {exercise.reps} {exercise.unit}
                      {exercise.weight ? ` @ ${exercise.weight}${exercise.unit === "kg" ? "kg" : "kg"}` : ""}
                    </p>
                  </div>
                  {workoutStarted && (
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
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>

                {/* Set tracking (expanded) */}
                {workoutStarted && isExpanded && (
                  <div style={{ padding: "0 16px 14px", borderTop: "1px solid #FFE8E0" }}>
                    {exercise.notes && (
                      <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "12px 0 10px", fontStyle: "italic" }}>
                        {exercise.notes}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "8px", marginTop: exercise.notes ? "0" : "12px" }}>
                      {Array.from({ length: exercise.sets }, (_, setIdx) => (
                        <button
                          key={setIdx}
                          onClick={() => toggleSet(exIdx, setIdx)}
                          style={{
                            flex: 1,
                            height: "44px",
                            borderRadius: "12px",
                            border: sets[setIdx] ? "2px solid #47B881" : "2px solid #FFD4C4",
                            background: sets[setIdx] ? "#47B881" : "#FFFBF9",
                            color: sets[setIdx] ? "#fff" : "#5A1A1A",
                            fontWeight: 800,
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {sets[setIdx] ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            `Set ${setIdx + 1}`
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* START / Continue button */}
        <div style={{ padding: "0 20px 20px" }}>
          <button
            onClick={() => {
              setWorkoutStarted(true);
              if (!workoutStarted) setExpandedExercise(0);
            }}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "16px",
              border: "none",
              background: progress >= 100 ? "#47B881" : "linear-gradient(135deg, #FA6847, #FF6B4A)",
              color: "#fff",
              fontWeight: 900,
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(250,104,71,0.3)",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
            }}
          >
            {progress >= 100 ? "WORKOUT COMPLETE" : workoutStarted ? "CONTINUE WORKOUT" : "START WORKOUT"}
          </button>
        </div>
      </div>

      {/* Weekly streak */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: 0 }}>This Week</h3>
          <span style={{ color: "#FA6847", fontWeight: 800, fontSize: "14px" }}>
            {TRAINING_PLAN.completedThisWeek}/3 done
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {TRAINING_PLAN.weeklySchedule.map((session, idx) => {
            const isDone = idx < TRAINING_PLAN.completedThisWeek;
            const isToday = idx === TRAINING_PLAN.completedThisWeek;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  borderRadius: "14px",
                  padding: "12px 8px",
                  textAlign: "center",
                  background: isDone ? "#47B881" : isToday ? "rgba(250,104,71,0.1)" : "#FFE8E0",
                  border: isToday ? "2px solid #FA6847" : "2px solid transparent",
                }}
              >
                <p style={{
                  color: isDone ? "#fff" : isToday ? "#FA6847" : "#A0674A",
                  fontWeight: 800,
                  fontSize: "11px",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  {session.day.slice(0, 3)}
                </p>
                <p style={{
                  color: isDone ? "#fff" : isToday ? "#5A1A1A" : "#A0674A",
                  fontWeight: 700,
                  fontSize: "11px",
                  margin: "4px 0 0",
                }}>
                  {isDone ? "Done" : isToday ? "Today" : session.name.split(" ")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why you train card */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 12px" }}>
          Why You Train
        </h3>
        <div style={{
          background: "rgba(250,104,71,0.06)",
          borderRadius: "14px",
          padding: "14px 16px",
          marginBottom: "12px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px" }}>
              Diabetes risk (type 2)
            </span>
            <span style={{
              color: "#FF9A56",
              fontWeight: 800,
              fontSize: "12px",
              background: "rgba(255,154,86,0.15)",
              padding: "3px 10px",
              borderRadius: "8px",
            }}>
              {RISK_ASSESSMENTS.diabetes.riskLabel}
            </span>
          </div>
          <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
            Blood sugar (fasting) has risen from 5.0 to {latestGlucose.value} over 5 years. Your mum was diagnosed at 58. Training improves insulin sensitivity - the single biggest thing you can do.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{
            flex: 1,
            background: "rgba(71,184,129,0.08)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          }}>
            <p style={{ color: "#47B881", fontWeight: 900, fontSize: "20px", margin: 0 }}>
              {latestGlucose.value}
            </p>
            <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "11px", margin: "2px 0 0" }}>
              Glucose
            </p>
          </div>
          <div style={{
            flex: 1,
            background: "rgba(71,184,129,0.08)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          }}>
            <p style={{ color: "#47B881", fontWeight: 900, fontSize: "20px", margin: 0 }}>
              {hba1c?.value}
            </p>
            <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "11px", margin: "2px 0 0" }}>
              HbA1c
            </p>
          </div>
          <div style={{
            flex: 1,
            background: "rgba(250,104,71,0.08)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          }}>
            <p style={{ color: "#FA6847", fontWeight: 900, fontSize: "20px", margin: 0 }}>
              {TRAINING_PLAN.totalCompleted}
            </p>
            <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "11px", margin: "2px 0 0" }}>
              Workouts
            </p>
          </div>
        </div>
      </div>

      {/* Medical notes */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "24px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 12px" }}>
          Trainer Notes
        </h3>
        {TRAINING_PLAN.medicalConsiderations.map((note, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              marginBottom: idx < TRAINING_PLAN.medicalConsiderations.length - 1 ? "10px" : 0,
            }}
          >
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "3px",
              background: "#FA6847",
              marginTop: "7px",
              flexShrink: 0,
            }} />
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
