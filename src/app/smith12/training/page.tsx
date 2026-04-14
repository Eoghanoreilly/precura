"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Dumbbell,
  Clock,
  AlertCircle,
  Trophy,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Progress Ring
// ---------------------------------------------------------------------------

function ProgressRing({ progress, size = 80 }: { progress: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F7F7F7"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#FF385C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Exercise Row
// ---------------------------------------------------------------------------

function ExerciseRow({
  exercise,
  index,
  isCompleted,
}: {
  exercise: (typeof TRAINING_PLAN.weeklySchedule)[0]["exercises"][0];
  index: number;
  isCompleted: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{
        borderBottom: "1px solid #EBEBEB",
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 50,
          background: isCompleted ? "#008A05" : "#F7F7F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isCompleted ? (
          <CheckCircle size={14} style={{ color: "#FFFFFF" }} />
        ) : (
          <span style={{ color: "#717171", fontSize: 12, fontWeight: 600 }}>{index + 1}</span>
        )}
      </div>

      <div className="flex-1">
        <p style={{ color: "#222222", fontSize: 14, fontWeight: 500, textDecoration: isCompleted ? "line-through" : "none" }}>
          {exercise.name}
        </p>
        <p style={{ color: "#717171", fontSize: 12 }}>
          {exercise.sets} sets x {exercise.reps} {exercise.unit}
          {exercise.weight ? ` @ ${exercise.weight}${exercise.unit === "kg" ? "kg" : "kg"}` : ""}
        </p>
        {exercise.notes && (
          <p style={{ color: "#717171", fontSize: 11, fontStyle: "italic" }}>{exercise.notes}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workout Day Card
// ---------------------------------------------------------------------------

function WorkoutDayCard({
  day,
  dayIndex,
  isDone,
}: {
  day: (typeof TRAINING_PLAN.weeklySchedule)[0];
  dayIndex: number;
  isDone: boolean;
}) {
  const [expanded, setExpanded] = useState(dayIndex === TRAINING_PLAN.completedThisWeek);

  return (
    <div
      className="mx-5 mb-3"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
        border: isDone ? "1px solid rgba(0,138,5,0.2)" : "none",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
        style={{
          background: isDone ? "rgba(0,138,5,0.04)" : "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: isDone
                ? "linear-gradient(135deg, #E6FFED, #F0FFF4)"
                : "linear-gradient(135deg, #FFE4E9, #FFF0E6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDone ? (
              <CheckCircle size={18} style={{ color: "#008A05" }} />
            ) : (
              <Dumbbell size={18} style={{ color: "#FF385C" }} />
            )}
          </div>
          <div>
            <p style={{ color: "#222222", fontSize: 15, fontWeight: 600 }}>
              {day.day} - {day.name}
            </p>
            <p style={{ color: "#717171", fontSize: 12 }}>
              {day.exercises.length} exercises
              {isDone && " - Completed"}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} style={{ color: "#717171" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#717171" }} />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {day.exercises.map((ex, i) => (
            <ExerciseRow key={i} exercise={ex} index={i} isCompleted={isDone} />
          ))}

          {!isDone && (
            <button
              style={{
                width: "100%",
                marginTop: 12,
                padding: "12px 0",
                borderRadius: 24,
                background: "#FF385C",
                color: "#FFFFFF",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Start workout
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function TrainingPage() {
  const plan = TRAINING_PLAN;
  const overallProgress = Math.round((plan.currentWeek / plan.totalWeeks) * 100);
  const weekProgress = Math.round((plan.completedThisWeek / plan.weeklySchedule.length) * 100);

  return (
    <div>
      {/* Back nav */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link
          href="/smith12"
          style={{
            width: 32,
            height: 32,
            borderRadius: 50,
            border: "1px solid #EBEBEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} style={{ color: "#222222" }} />
        </Link>
        <p style={{ color: "#222222", fontSize: 18, fontWeight: 600 }}>Training</p>
      </div>

      {/* Hero card */}
      <div
        className="mx-5 mb-4"
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "linear-gradient(135deg, #FF385C 0%, #E31C5F 50%, #BD1550 100%)",
          boxShadow: "0 8px 28px rgba(255, 56, 92, 0.25)",
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>
                {plan.name}
              </p>
              <p style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>
                Week {plan.currentWeek} of {plan.totalWeeks}
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <ProgressRing progress={overallProgress} size={64} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(0deg)",
                }}
              >
                <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>
                  {overallProgress}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div
              className="flex-1 p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 10,
                backdropFilter: "blur(10px)",
              }}
            >
              <p style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>{plan.totalCompleted}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Sessions done</p>
            </div>
            <div
              className="flex-1 p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 10,
                backdropFilter: "blur(10px)",
              }}
            >
              <p style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>
                {plan.completedThisWeek}/{plan.weeklySchedule.length}
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>This week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Creator info */}
      <div className="mx-5 mb-4">
        <div
          className="flex items-center gap-3 p-3"
          style={{
            borderRadius: 12,
            background: "#F7F7F7",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 50,
              background: "linear-gradient(135deg, #FF385C, #E31C5F)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            EO
          </div>
          <div>
            <p style={{ color: "#222222", fontSize: 13, fontWeight: 500 }}>{plan.createdBy}</p>
            <p style={{ color: "#717171", fontSize: 11 }}>Reviewed by {plan.reviewedBy}</p>
          </div>
        </div>
      </div>

      {/* Goal */}
      <div className="mx-5 mb-4">
        <div
          className="p-4"
          style={{
            borderRadius: 12,
            background: "linear-gradient(135deg, #FFF5F7, #FFF0E6)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} style={{ color: "#FF385C" }} />
            <p style={{ color: "#222222", fontSize: 13, fontWeight: 600 }}>Program goal</p>
          </div>
          <p style={{ color: "#717171", fontSize: 13, lineHeight: 1.5 }}>{plan.goal}</p>
        </div>
      </div>

      {/* Medical considerations */}
      <div className="mx-5 mb-4">
        <p style={{ color: "#222222", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Medical considerations
        </p>
        <div className="flex flex-col gap-2">
          {plan.medicalConsiderations.map((note, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertCircle size={14} style={{ color: "#E07912", marginTop: 2, flexShrink: 0 }} />
              <p style={{ color: "#717171", fontSize: 12, lineHeight: 1.5 }}>{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* This week's workouts */}
      <div className="mb-2">
        <p className="px-5" style={{ color: "#222222", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          This week
        </p>

        {plan.weeklySchedule.map((day, i) => (
          <WorkoutDayCard
            key={day.day}
            day={day}
            dayIndex={i}
            isDone={i < plan.completedThisWeek}
          />
        ))}
      </div>
    </div>
  );
}
