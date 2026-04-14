"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TRAINING_PLAN,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  Dumbbell,
  CheckCircle,
  Circle,
  Clock,
  Target,
  Stethoscope,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function TrainingPage() {
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const plan = TRAINING_PLAN;

  // Progress percentage
  const totalSessions = plan.totalWeeks * 3;
  const progressPct = Math.round((plan.totalCompleted / totalSessions) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/smith1"
          className="flex items-center gap-1 mb-4"
          style={{
            color: "#B8C5D6",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <h1
          style={{
            color: "#F5F7FA",
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          {plan.name}
        </h1>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 14,
            marginTop: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Created by {plan.createdBy}
        </p>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} style={{ color: "#7C3AED" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Progress
            </span>
          </div>
          <div
            style={{
              color: "#F5F7FA",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Week {plan.currentWeek}/{plan.totalWeeks}
          </div>
          <div
            className="mt-2"
            style={{
              height: 4,
              background: "#1F2D42",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "#7C3AED",
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} style={{ color: "#10B981" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              This Week
            </span>
          </div>
          <div
            style={{
              color: "#10B981",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            {plan.completedThisWeek}/3
          </div>
          <span
            style={{
              color: "#B8C5D6",
              fontSize: 12,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            sessions done
          </span>
        </div>

        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell size={14} style={{ color: "#7C3AED" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Total Sessions
            </span>
          </div>
          <div
            style={{
              color: "#F5F7FA",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            {plan.totalCompleted}
          </div>
          <span
            style={{
              color: "#B8C5D6",
              fontSize: 12,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            completed since Jan 2026
          </span>
        </div>
      </div>

      {/* Goal */}
      <div
        className="p-4 mb-6"
        style={{
          background: "rgba(124, 58, 237, 0.06)",
          borderRadius: 12,
          border: "1px solid rgba(124, 58, 237, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Target size={14} style={{ color: "#7C3AED" }} />
          <span
            style={{
              color: "#F5F7FA",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            Program Goal
          </span>
        </div>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 13,
            lineHeight: 1.5,
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {plan.goal}
        </p>
      </div>

      {/* Weekly schedule */}
      <h2
        style={{
          color: "#F5F7FA",
          fontSize: 18,
          fontWeight: 600,
          margin: 0,
          marginBottom: 16,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        }}
      >
        Weekly Schedule
      </h2>

      <div className="flex flex-col gap-3 mb-6">
        {plan.weeklySchedule.map((day, dayIndex) => {
          const isExpanded = expandedDay === dayIndex;
          const isDone = dayIndex < plan.completedThisWeek;

          return (
            <div
              key={day.day}
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: isDone
                  ? "1px solid rgba(16, 185, 129, 0.2)"
                  : "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpandedDay(isExpanded ? -1 : dayIndex)}
                className="w-full p-4 flex items-center justify-between"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle size={20} style={{ color: "#10B981" }} />
                  ) : (
                    <Circle size={20} style={{ color: "#1F2D42" }} />
                  )}
                  <div className="text-left">
                    <div
                      style={{
                        color: isDone ? "#10B981" : "#F5F7FA",
                        fontSize: 15,
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      }}
                    >
                      {day.day} - {day.name}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {day.exercises.length} exercises
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} style={{ color: "#B8C5D6" }} />
                ) : (
                  <ChevronDown size={18} style={{ color: "#B8C5D6" }} />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4" style={{ borderTop: "1px solid #1F2D42" }}>
                  <div className="flex flex-col gap-2 pt-3">
                    {day.exercises.map((ex, exIndex) => (
                      <div
                        key={exIndex}
                        className="flex items-center justify-between p-3"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: 8,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: "#F5F7FA",
                              fontSize: 14,
                              fontWeight: 500,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                            }}
                          >
                            {ex.name}
                          </div>
                          {ex.notes && (
                            <div
                              style={{
                                color: "#B8C5D6",
                                fontSize: 11,
                                marginTop: 2,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                              }}
                            >
                              {ex.notes}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div
                            style={{
                              color: "#F5F7FA",
                              fontSize: 13,
                              fontWeight: 600,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                            }}
                          >
                            {ex.sets} x {ex.reps} {ex.unit}
                          </div>
                          {ex.weight && (
                            <div
                              style={{
                                color: "#7C3AED",
                                fontSize: 11,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                              }}
                            >
                              {ex.weight} kg
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Medical considerations */}
      <div
        className="p-5 mb-6"
        style={{
          background: "#141F2E",
          borderRadius: 12,
          border: "1px solid #1F2D42",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope size={16} style={{ color: "#7C3AED" }} />
          <h3
            style={{
              color: "#F5F7FA",
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Medical Considerations
          </h3>
          <span
            style={{
              color: "#B8C5D6",
              fontSize: 11,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            Reviewed by {plan.reviewedBy}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {plan.medicalConsiderations.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2"
              style={{
                background: "rgba(245, 158, 11, 0.04)",
                borderRadius: 6,
              }}
            >
              <AlertTriangle
                size={12}
                style={{ color: "#F59E0B", marginTop: 3, flexShrink: 0 }}
              />
              <span
                style={{
                  color: "#B8C5D6",
                  fontSize: 12,
                  lineHeight: 1.5,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
