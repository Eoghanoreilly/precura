"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Clock,
  Flame,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Play,
} from "lucide-react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Weekly calendar strip                                               */
/* ------------------------------------------------------------------ */
function WeekStrip() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const workoutDays = TRAINING_PLAN.weeklySchedule.map((w) =>
    w.day.slice(0, 3)
  );
  const completedDays = TRAINING_PLAN.weeklySchedule
    .slice(0, TRAINING_PLAN.completedThisWeek)
    .map((w) => w.day.slice(0, 3));
  // Today is Wednesday (index 2)
  const todayIdx = 2;

  return (
    <div className="flex gap-1" style={{ marginBottom: 20 }}>
      {days.map((day, i) => {
        const isWorkout = workoutDays.includes(day);
        const isDone = completedDays.includes(day);
        const isToday = i === todayIdx;

        return (
          <div
            key={day}
            className="flex-1 flex flex-col items-center gap-1"
            style={{
              padding: "10px 0",
              borderRadius: 8,
              background: isToday ? "#282828" : "transparent",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: isToday ? "#FFFFFF" : "#B3B3B360",
                textTransform: "uppercase",
              }}
            >
              {day}
            </span>
            {isWorkout ? (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: isDone
                    ? "#1DB954"
                    : isToday
                      ? "#1DB95440"
                      : "#28282880",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isDone ? (
                  <CheckCircle size={14} style={{ color: "#FFFFFF" }} />
                ) : (
                  <Flame size={12} style={{ color: isToday ? "#1DB954" : "#B3B3B340" }} />
                )}
              </div>
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    background: "#B3B3B320",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats Row                                                           */
/* ------------------------------------------------------------------ */
function StatsRow() {
  const plan = TRAINING_PLAN;

  return (
    <div className="flex gap-3" style={{ marginBottom: 24 }}>
      <div
        className="flex-1"
        style={{
          background: "#1E1E1E",
          borderRadius: 8,
          padding: 14,
          textAlign: "center",
        }}
      >
        <Trophy size={18} style={{ color: "#1DB954", margin: "0 auto 6px", display: "block" }} />
        <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
          {plan.totalCompleted}
        </div>
        <div style={{ fontSize: 11, color: "#B3B3B3" }}>Sessions done</div>
      </div>
      <div
        className="flex-1"
        style={{
          background: "#1E1E1E",
          borderRadius: 8,
          padding: 14,
          textAlign: "center",
        }}
      >
        <Flame size={18} style={{ color: "#FFA42B", margin: "0 auto 6px", display: "block" }} />
        <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
          {plan.completedThisWeek}/{plan.weeklySchedule.length}
        </div>
        <div style={{ fontSize: 11, color: "#B3B3B3" }}>This week</div>
      </div>
      <div
        className="flex-1"
        style={{
          background: "#1E1E1E",
          borderRadius: 8,
          padding: 14,
          textAlign: "center",
        }}
      >
        <Clock size={18} style={{ color: "#B3B3B3", margin: "0 auto 6px", display: "block" }} />
        <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
          {plan.totalWeeks - plan.currentWeek}
        </div>
        <div style={{ fontSize: 11, color: "#B3B3B3" }}>Weeks left</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Workout Day Card                                                     */
/* ------------------------------------------------------------------ */
function WorkoutDayCard({
  day,
  dayIndex,
}: {
  day: (typeof TRAINING_PLAN.weeklySchedule)[0];
  dayIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDone = dayIndex < TRAINING_PLAN.completedThisWeek;
  const isNext = dayIndex === TRAINING_PLAN.completedThisWeek;

  return (
    <div
      style={{
        background: "#1E1E1E",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center w-full"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: isDone ? "#1DB954" : isNext ? "#1DB95430" : "#282828",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginRight: 12,
          }}
        >
          {isDone ? (
            <CheckCircle size={20} style={{ color: "#FFFFFF" }} />
          ) : isNext ? (
            <Play size={18} style={{ color: "#1DB954" }} fill="#1DB954" />
          ) : (
            <Flame size={18} style={{ color: "#B3B3B340" }} />
          )}
        </div>
        <div className="flex-1" style={{ textAlign: "left" }}>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: isDone ? "#B3B3B3" : "#FFFFFF",
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {day.name}
            </span>
            {isNext && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#1DB954",
                  background: "#1DB95418",
                  borderRadius: 24,
                  padding: "2px 8px",
                  textTransform: "uppercase",
                }}
              >
                Next up
              </span>
            )}
          </div>
          <span style={{ fontSize: 13, color: "#B3B3B3" }}>
            {day.day} / {day.exercises.length} exercises
          </span>
        </div>
        <ChevronRight
          size={18}
          style={{
            color: "#B3B3B340",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          {day.exercises.map((ex, i) => (
            <div
              key={i}
              className="flex items-center"
              style={{
                padding: "12px 0",
                borderTop: i > 0 ? "1px solid #28282850" : "none",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: "#282828",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginRight: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#B3B3B3",
                }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                  {ex.name}
                </div>
                {ex.notes && (
                  <div style={{ fontSize: 12, color: "#B3B3B360", marginTop: 2 }}>
                    {ex.notes}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1DB954" }}>
                  {ex.sets} x {ex.reps}
                  {ex.unit !== "reps" ? ` ${ex.unit}` : ""}
                </div>
                {ex.weight && (
                  <div style={{ fontSize: 11, color: "#B3B3B3" }}>{ex.weight} kg</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Medical Considerations                                               */
/* ------------------------------------------------------------------ */
function MedicalConsiderations() {
  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        <AlertTriangle size={16} style={{ color: "#FFA42B" }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
          Medical considerations
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
          <div key={i} className="flex gap-2">
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                background: "#FFA42B60",
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <span style={{ fontSize: 13, color: "#B3B3B3", lineHeight: 1.5 }}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TRAINING PAGE                                                        */
/* ------------------------------------------------------------------ */
export default function TrainingPage() {
  const plan = TRAINING_PLAN;
  const progressPct = (plan.currentWeek / plan.totalWeeks) * 100;

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: "0 0 2px" }}>
        Training
      </h1>
      <p style={{ fontSize: 14, color: "#B3B3B3", margin: "0 0 20px" }}>
        {plan.name}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: 6 }}>
        <div className="flex justify-between" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#B3B3B3" }}>
            Week {plan.currentWeek} of {plan.totalWeeks}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1DB954" }}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "#282828" }}>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #1DB954, #1ED760)",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#B3B3B360", marginBottom: 20 }}>
        Created by {plan.createdBy} / Reviewed by {plan.reviewedBy}
      </div>

      {/* Week Calendar */}
      <WeekStrip />

      {/* Stats */}
      <StatsRow />

      {/* Workout Days */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
        This week&apos;s workouts
      </h2>
      {plan.weeklySchedule.map((day, i) => (
        <WorkoutDayCard key={day.day} day={day} dayIndex={i} />
      ))}

      {/* Medical */}
      <div style={{ marginTop: 16 }}>
        <MedicalConsiderations />
      </div>

      {/* Goal */}
      <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 8 }}>
          Program goal
        </div>
        <p style={{ fontSize: 13, color: "#B3B3B3", lineHeight: 1.6, margin: 0 }}>
          {plan.goal}
        </p>
      </div>
    </div>
  );
}
