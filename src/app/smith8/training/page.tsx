"use client";

import React, { useState } from "react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

/* =====================================================================
   TRAINING PLAN - Week 10 of 12
   Real exercises with sets, reps, weights
   ===================================================================== */

export default function TrainingPage() {
  const plan = TRAINING_PLAN;
  const [activeDay, setActiveDay] = useState(1); // 0=Mon, 1=Wed, 2=Fri
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  const currentSession = plan.weeklySchedule[activeDay];
  const sessionId = `${currentSession.day}-${currentSession.name}`;

  const toggleExercise = (exerciseName: string) => {
    const key = `${sessionId}-${exerciseName}`;
    setCompletedExercises((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isExerciseDone = (name: string) => completedExercises[`${sessionId}-${name}`] || false;
  const doneCount = currentSession.exercises.filter((e) => isExerciseDone(e.name)).length;
  const allDone = doneCount === currentSession.exercises.length;

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Plan header */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "24px 20px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <span
            style={{
              background: "#F3EAFF",
              color: "#B794F6",
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Week {plan.currentWeek} of {plan.totalWeeks}
          </span>
        </div>
        <h1 style={{ color: "#3D2645", fontSize: 22, fontWeight: 700, margin: "4px 0 6px", letterSpacing: -0.3 }}>
          {plan.name}
        </h1>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: "0 0 4px", lineHeight: 1.4 }}>
          By {plan.createdBy}
        </p>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: 0 }}>
          Reviewed by {plan.reviewedBy}
        </p>

        {/* Session completion */}
        <div style={{ marginTop: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ color: "#8B7B95", fontSize: 12, fontWeight: 500 }}>
              Sessions this week
            </span>
            <span style={{ color: "#B794F6", fontSize: 12, fontWeight: 600 }}>
              {plan.completedThisWeek}/3
            </span>
          </div>
          <div className="flex gap-2">
            {plan.weeklySchedule.map((s, i) => {
              const isDayDone = i < plan.completedThisWeek;
              return (
                <div
                  key={s.day}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: isDayDone
                      ? "#81C995"
                      : i === plan.completedThisWeek
                      ? "linear-gradient(90deg, #B794F6, #9F7AEA)"
                      : "#F3EAFF",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Overall stats */}
        <div className="flex gap-3" style={{ marginTop: 16 }}>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              borderRadius: 14,
              background: "#FDFBFF",
              border: "1px solid #EFE6F8",
            }}
          >
            <p style={{ color: "#B794F6", fontSize: 20, fontWeight: 700, margin: 0 }}>
              {plan.totalCompleted}
            </p>
            <p style={{ color: "#8B7B95", fontSize: 11, margin: 0 }}>
              Sessions done
            </p>
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              borderRadius: 14,
              background: "#FDFBFF",
              border: "1px solid #EFE6F8",
            }}
          >
            <p style={{ color: "#81C995", fontSize: 20, fontWeight: 700, margin: 0 }}>93%</p>
            <p style={{ color: "#8B7B95", fontSize: 11, margin: 0 }}>
              Adherence
            </p>
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              borderRadius: 14,
              background: "#FDFBFF",
              border: "1px solid #EFE6F8",
            }}
          >
            <p style={{ color: "#3D2645", fontSize: 20, fontWeight: 700, margin: 0 }}>2</p>
            <p style={{ color: "#8B7B95", fontSize: 11, margin: 0 }}>
              Weeks left
            </p>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        {plan.weeklySchedule.map((s, i) => {
          const isActive = i === activeDay;
          const isDayDone = i < plan.completedThisWeek;
          return (
            <button
              key={s.day}
              onClick={() => setActiveDay(i)}
              style={{
                flex: 1,
                padding: "12px 8px",
                borderRadius: 14,
                border: isActive ? "2px solid #B794F6" : "1px solid #EFE6F8",
                background: isActive ? "#FFFFFF" : "#FDFBFF",
                boxShadow: isActive ? "0 2px 8px rgba(183,148,246,0.15)" : "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: isActive ? "#B794F6" : "#8B7B95",
                  fontSize: 12,
                  fontWeight: 600,
                  margin: "0 0 2px",
                }}
              >
                {s.day}
              </p>
              <p
                style={{
                  color: isActive ? "#3D2645" : "#8B7B95",
                  fontSize: 11,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {s.name}
              </p>
              {isDayDone && (
                <div style={{ marginTop: 4, display: "flex", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke="#81C995" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: 0 }}>
            {currentSession.name}
          </h2>
          <span style={{ color: "#8B7B95", fontSize: 13 }}>
            {doneCount}/{currentSession.exercises.length} exercises
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentSession.exercises.map((exercise, idx) => {
            const done = isExerciseDone(exercise.name);

            return (
              <div
                key={exercise.name}
                onClick={() => toggleExercise(exercise.name)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: done ? "#F9FDF9" : "#FDFBFF",
                  border: done ? "1px solid #D1F0D8" : "1px solid #EFE6F8",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Number / check */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    background: done ? "#81C995" : "#F3EAFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ color: "#B794F6", fontSize: 13, fontWeight: 700 }}>
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Exercise details */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: done ? "#8B7B95" : "#3D2645",
                      fontSize: 15,
                      fontWeight: 600,
                      margin: "0 0 4px",
                      textDecoration: done ? "line-through" : "none",
                    }}
                  >
                    {exercise.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      style={{
                        background: "#F3EAFF",
                        color: "#B794F6",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {exercise.sets} x {exercise.reps} {exercise.unit}
                    </span>
                    {exercise.weight && (
                      <span
                        style={{
                          background: "#FFF8E6",
                          color: "#D4A843",
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {exercise.weight} {exercise.unit === "kg" ? "kg" : "kg"}
                      </span>
                    )}
                  </div>
                  {exercise.notes && (
                    <p style={{ color: "#8B7B95", fontSize: 12, margin: "4px 0 0", fontStyle: "italic" }}>
                      {exercise.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Complete session button */}
        {allDone && (
          <div
            style={{
              marginTop: 16,
              padding: "14px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #81C995, #6BBF82)",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(129,201,149,0.3)",
            }}
          >
            <p style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 700, margin: 0 }}>
              Session Complete!
            </p>
          </div>
        )}
      </div>

      {/* Medical considerations */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: "0 0 14px" }}>
          Medical Notes
        </h2>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: "0 0 12px" }}>
          Your training plan accounts for your health profile:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {plan.medicalConsiderations.map((note, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                background: "#FDFBFF",
                border: "1px solid #EFE6F8",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#B794F6",
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <p style={{ color: "#8B7B95", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
