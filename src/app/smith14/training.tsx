"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Flame,
  Target,
  Heart,
  AlertCircle,
  Play,
} from "lucide-react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

export default function TrainingPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );

  const totalSessions =
    TRAINING_PLAN.currentWeek * TRAINING_PLAN.weeklySchedule.length;
  const completionRate = Math.round(
    (TRAINING_PLAN.totalCompleted / totalSessions) * 100
  );

  const day = TRAINING_PLAN.weeklySchedule[selectedDay];

  const toggleExercise = (name: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: "#002110", margin: 0 }}>
          Training
        </h1>
        <p style={{ fontSize: 14, color: "#4F6354", marginTop: 4 }}>
          {TRAINING_PLAN.name}
        </p>
      </div>

      {/* Progress ring card */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 20,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Circular progress */}
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#DAE8DE"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#006D3E"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionRate / 100)}`}
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 600, color: "#002110" }}>
              {completionRate}%
            </span>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: 0 }}>
            Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
          </p>
          <p style={{ fontSize: 14, color: "#4F6354", margin: "4px 0 0" }}>
            {TRAINING_PLAN.totalCompleted} sessions completed
          </p>
          <p style={{ fontSize: 14, color: "#4F6354", margin: "2px 0 0" }}>
            {TRAINING_PLAN.completedThisWeek}/{TRAINING_PLAN.weeklySchedule.length} this week
          </p>
        </div>
      </div>

      {/* Day selector - Material 3 chips */}
      <div className="flex gap-2">
        {TRAINING_PLAN.weeklySchedule.map((d, i) => {
          const isSelected = selectedDay === i;
          const isComplete = i < TRAINING_PLAN.completedThisWeek;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(i)}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 12,
                background: isSelected ? "#006D3E" : isComplete ? "#95F7B5" : "#ECF5EF",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isSelected ? "#FFFFFF" : "#002110",
                  margin: 0,
                }}
              >
                {d.day.slice(0, 3)}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: isSelected ? "#95F7B5" : "#4F6354",
                  margin: "2px 0 0",
                }}
              >
                {d.name}
              </p>
              {isComplete && !isSelected && (
                <CheckCircle2
                  size={14}
                  style={{ color: "#006D3E", marginTop: 4 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Workout details */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: "#002110", margin: 0 }}>
              {day.name}
            </h2>
            <p style={{ fontSize: 13, color: "#4F6354", margin: "2px 0 0" }}>
              {day.day} - {day.exercises.length} exercises
            </p>
          </div>
          <button
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "#006D3E",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,109,62,0.25)",
            }}
          >
            <Play size={20} style={{ color: "#FFFFFF", marginLeft: 2 }} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {day.exercises.map((exercise) => {
            const isChecked = completedExercises.has(exercise.name);
            return (
              <button
                key={exercise.name}
                onClick={() => toggleExercise(exercise.name)}
                className="flex items-center gap-3"
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: isChecked ? "#95F7B5" : "#FAFDFB",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.2s ease",
                }}
              >
                {isChecked ? (
                  <CheckCircle2 size={20} style={{ color: "#006D3E", flexShrink: 0 }} />
                ) : (
                  <Circle size={20} style={{ color: "#C0C9BF", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: isChecked ? "#002110" : "#002110",
                      margin: 0,
                      textDecoration: isChecked ? "line-through" : "none",
                      opacity: isChecked ? 0.7 : 1,
                    }}
                  >
                    {exercise.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#6F796F", margin: "2px 0 0" }}>
                    {exercise.sets} x {exercise.reps} {exercise.unit}
                    {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                  </p>
                </div>
                {exercise.notes && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#4F6354",
                      background: "#DAE8DE",
                      padding: "2px 8px",
                      borderRadius: 50,
                      flexShrink: 0,
                    }}
                  >
                    {exercise.notes}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal card */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <Target size={18} style={{ color: "#006D3E" }} />
          <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: 0 }}>
            Program goal
          </h2>
        </div>
        <p style={{ fontSize: 14, color: "#002110", lineHeight: 1.5, margin: 0 }}>
          {TRAINING_PLAN.goal}
        </p>
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 12, color: "#4F6354", margin: 0 }}>
            Created by {TRAINING_PLAN.createdBy}
          </p>
          <p style={{ fontSize: 12, color: "#4F6354", margin: "2px 0 0" }}>
            Reviewed by {TRAINING_PLAN.reviewedBy}
          </p>
        </div>
      </div>

      {/* Medical considerations */}
      <div
        style={{
          background: "#FFF3E0",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <AlertCircle size={18} style={{ color: "#E65100" }} />
          <h2 style={{ fontSize: 16, fontWeight: 500, color: "#BF360C", margin: 0 }}>
            Medical notes
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "#FFF8E1",
              }}
            >
              <Heart size={14} style={{ color: "#E65100", marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "#4E342E", margin: 0, lineHeight: 1.4 }}>
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly stats */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          This week
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "#FAFDFB",
              textAlign: "center",
            }}
          >
            <Flame size={20} style={{ color: "#E65100", margin: "0 auto" }} />
            <p style={{ fontSize: 20, fontWeight: 600, color: "#002110", margin: "4px 0 0" }}>
              {TRAINING_PLAN.completedThisWeek}
            </p>
            <p style={{ fontSize: 11, color: "#6F796F", margin: 0 }}>
              Workouts
            </p>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "#FAFDFB",
              textAlign: "center",
            }}
          >
            <Target size={20} style={{ color: "#006D3E", margin: "0 auto" }} />
            <p style={{ fontSize: 20, fontWeight: 600, color: "#002110", margin: "4px 0 0" }}>
              {TRAINING_PLAN.totalCompleted}
            </p>
            <p style={{ fontSize: 11, color: "#6F796F", margin: 0 }}>
              Total
            </p>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "#FAFDFB",
              textAlign: "center",
            }}
          >
            <CheckCircle2 size={20} style={{ color: "#006D3E", margin: "0 auto" }} />
            <p style={{ fontSize: 20, fontWeight: 600, color: "#002110", margin: "4px 0 0" }}>
              {completionRate}%
            </p>
            <p style={{ fontSize: 11, color: "#6F796F", margin: 0 }}>
              Rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
