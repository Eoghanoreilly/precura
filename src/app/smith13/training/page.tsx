"use client";

import React, { useState } from "react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

/* ================================================================
   Progress Ring (smaller, for inline use)
   ================================================================ */
function ProgressRing({
  progress,
  size,
  strokeWidth,
  color,
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={0.2}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
    </svg>
  );
}

/* ================================================================
   Workout Day Card
   ================================================================ */
function WorkoutCard({
  day,
  isCompleted,
  isToday,
  onToggle,
}: {
  day: (typeof TRAINING_PLAN.weeklySchedule)[0];
  isCompleted: boolean;
  isToday: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const dayColors: Record<string, string> = {
    Monday: "#FF2D55",
    Wednesday: "#30D158",
    Friday: "#0A84FF",
  };
  const color = dayColors[day.day] || "#0A84FF";

  return (
    <div
      style={{
        background: isToday
          ? `linear-gradient(135deg, ${color}15 0%, #1C1C1E 100%)`
          : "#1C1C1E",
        borderRadius: 22,
        padding: "20px",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: isCompleted
                ? `linear-gradient(135deg, ${color}, ${color}CC)`
                : "#2C2C2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isCompleted ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M5 11L9.5 15.5L17 7"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span style={{ color: color, fontSize: 15, fontWeight: 700 }}>
                {day.day.slice(0, 3)}
              </span>
            )}
          </div>
          <div>
            <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: 0 }}>
              {day.name}
            </p>
            <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginTop: 2 }}>
              {day.day} - {day.exercises.length} exercises
            </p>
          </div>
        </div>

        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M5 8L10 13L15 8"
            stroke="#98989D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Today badge */}
      {isToday && !isCompleted && (
        <div
          className="mt-3"
          style={{
            background: `${color}20`,
            borderRadius: 8,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ color: color, fontSize: 13, fontWeight: 600 }}>
            Today&apos;s workout
          </span>
        </div>
      )}

      {/* Exercise list */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-2">
          {day.exercises.map((ex, i) => (
            <div
              key={`${ex.name}-${i}`}
              className="flex items-center justify-between"
              style={{
                background: "#2C2C2E",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: color, fontSize: 12, fontWeight: 700 }}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 500, margin: 0 }}>
                    {ex.name}
                  </p>
                  {ex.notes && (
                    <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0, marginTop: 1 }}>
                      {ex.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right" style={{ flexShrink: 0 }}>
                <p style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600, margin: 0 }}>
                  {ex.sets} x {ex.reps}
                </p>
                <p style={{ color: "#98989D", fontSize: 11, fontWeight: 400, margin: 0 }}>
                  {ex.weight ? `${ex.weight} ${ex.unit}` : ex.unit}
                </p>
              </div>
            </div>
          ))}

          {/* Complete button */}
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                marginTop: 4,
                fontFamily: "inherit",
                letterSpacing: "0.01em",
              }}
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Page Component
   ================================================================ */
export default function TrainingPage() {
  const [completed, setCompleted] = useState<Set<number>>(
    new Set(
      Array.from({ length: TRAINING_PLAN.completedThisWeek }, (_, i) => i)
    )
  );

  const overallProgress = Math.round(
    (TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100
  );
  const weekProgress = Math.round(
    (completed.size / TRAINING_PLAN.weeklySchedule.length) * 100
  );

  // Wednesday = index 1 of schedule (Mon=0, Wed=1, Fri=2)
  const todayIndex = 1;

  return (
    <div className="px-5 pb-8">
      {/* Header */}
      <div className="mb-5 mt-2">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Training
        </p>
        <p style={{ color: "#98989D", fontSize: 15, fontWeight: 400, margin: 0, marginTop: 2 }}>
          {TRAINING_PLAN.name}
        </p>
      </div>

      {/* Program overview card */}
      <div
        style={{
          background: "#1C1C1E",
          borderRadius: 22,
          padding: "20px",
          marginBottom: 16,
        }}
      >
        <div className="flex items-center gap-5">
          {/* Progress ring */}
          <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
            <ProgressRing progress={overallProgress} size={80} strokeWidth={8} color="#0A84FF" />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
                {TRAINING_PLAN.currentWeek}
              </span>
              <span style={{ color: "#98989D", fontSize: 10, fontWeight: 500 }}>
                of {TRAINING_PLAN.totalWeeks}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: 0 }}>
              Week {TRAINING_PLAN.currentWeek}
            </p>
            <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginTop: 4, lineHeight: 1.4 }}>
              {TRAINING_PLAN.goal}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-around mt-5 pt-4"
          style={{ borderTop: "1px solid #2C2C2E" }}
        >
          <div className="text-center">
            <p style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, margin: 0 }}>
              {TRAINING_PLAN.totalCompleted}
            </p>
            <p style={{ color: "#98989D", fontSize: 11, fontWeight: 500, margin: 0, marginTop: 2 }}>
              SESSIONS
            </p>
          </div>
          <div style={{ width: 1, height: 32, background: "#2C2C2E" }} />
          <div className="text-center">
            <p style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, margin: 0 }}>
              {completed.size}/{TRAINING_PLAN.weeklySchedule.length}
            </p>
            <p style={{ color: "#98989D", fontSize: 11, fontWeight: 500, margin: 0, marginTop: 2 }}>
              THIS WEEK
            </p>
          </div>
          <div style={{ width: 1, height: 32, background: "#2C2C2E" }} />
          <div className="text-center">
            <p style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, margin: 0 }}>
              {overallProgress}%
            </p>
            <p style={{ color: "#98989D", fontSize: 11, fontWeight: 500, margin: 0, marginTop: 2 }}>
              COMPLETE
            </p>
          </div>
        </div>
      </div>

      {/* This week header */}
      <div className="flex items-center justify-between mb-4">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          This Week
        </p>
        <div className="flex items-center gap-2">
          <ProgressRing progress={weekProgress} size={28} strokeWidth={3} color="#0A84FF" />
          <span style={{ color: "#98989D", fontSize: 13, fontWeight: 500 }}>
            {completed.size}/{TRAINING_PLAN.weeklySchedule.length}
          </span>
        </div>
      </div>

      {/* Workout cards */}
      <div className="flex flex-col gap-3">
        {TRAINING_PLAN.weeklySchedule.map((day, i) => (
          <WorkoutCard
            key={day.day}
            day={day}
            isCompleted={completed.has(i)}
            isToday={i === todayIndex}
            onToggle={() => {
              const next = new Set(completed);
              if (next.has(i)) next.delete(i);
              else next.add(i);
              setCompleted(next);
            }}
          />
        ))}
      </div>

      {/* Medical considerations */}
      <div className="mt-6">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 17,
            fontWeight: 600,
            margin: 0,
            marginBottom: 12,
          }}
        >
          Medical Considerations
        </p>
        <div className="flex flex-col gap-2">
          {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
            <div
              key={i}
              className="flex items-start gap-3"
              style={{
                background: "#1C1C1E",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255, 159, 10, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1V6M5 8V8.5"
                    stroke="#FF9F0A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer info */}
      <div
        className="mt-6"
        style={{
          background: "#1C1C1E",
          borderRadius: 16,
          padding: "16px 18px",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0A84FF, #409CFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>EO</span>
          </div>
          <div>
            <p style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, margin: 0 }}>
              {TRAINING_PLAN.createdBy}
            </p>
            <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0, marginTop: 1 }}>
              Reviewed by {TRAINING_PLAN.reviewedBy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
