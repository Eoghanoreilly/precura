"use client";

import React from "react";
import Link from "next/link";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  TRAINING_PLAN,
  MESSAGES,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";
import {
  Droplets,
  TrendingUp,
  Calendar,
  MessageSquare,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Dumbbell,
  Shield,
} from "lucide-react";

function GlucoseSparkline() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;

  const minVal = Math.min(...data.map((d) => d.value)) - 0.3;
  const maxVal = Math.max(...data.map((d) => d.value)) + 0.3;
  const width = 200;
  const height = 48;
  const padding = 4;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((d.value - minVal) / (maxVal - minVal)) * (height - padding * 2);
    return { x, y, value: d.value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke="url(#sparkGrad)" strokeWidth={2} />
      <circle cx={last.x} cy={last.y} r={4} fill="#F59E0B" />
      <text
        x={last.x - 8}
        y={last.y - 8}
        style={{
          fontSize: 10,
          fill: "#F59E0B",
          fontFamily: '-apple-system, system-ui, sans-serif',
          fontWeight: 600,
        }}
      >
        {last.value}
      </text>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    normal: { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" },
    borderline: { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" },
    abnormal: { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444" },
  };
  const c = colors[status] || colors.normal;
  return (
    <span
      className="px-2 py-0.5"
      style={{
        background: c.bg,
        color: c.text,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const latestSession = BLOOD_TEST_HISTORY[0];
  const glucose = getLatestMarker("f-Glucose");
  const hba1c = getLatestMarker("HbA1c");
  const lastMessage = MESSAGES[MESSAGES.length - 1];
  const daysToNextTest = Math.ceil(
    (new Date(PATIENT.nextBloodTest).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const borderlineCount = latestSession.results.filter(
    (r) => r.status === "borderline"
  ).length;
  const abnormalCount = latestSession.results.filter(
    (r) => r.status === "abnormal"
  ).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1
          style={{
            color: "#F5F7FA",
            fontSize: 28,
            fontWeight: 700,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            margin: 0,
          }}
        >
          Welcome back, {PATIENT.firstName}
        </h1>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 14,
            marginTop: 4,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Your health dashboard - Last updated{" "}
          {new Date(latestSession.date).toLocaleDateString("en-SE", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Priority alert */}
      {borderlineCount > 0 && (
        <div
          className="flex items-start gap-3 p-4 mb-6"
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: 12,
          }}
        >
          <AlertTriangle size={18} style={{ color: "#F59E0B", marginTop: 2, flexShrink: 0 }} />
          <div>
            <div
              style={{
                color: "#F59E0B",
                fontSize: 14,
                fontWeight: 600,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {borderlineCount} marker{borderlineCount > 1 ? "s" : ""} need attention
            </div>
            <div
              style={{
                color: "#B8C5D6",
                fontSize: 13,
                marginTop: 2,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Your fasting glucose (blood sugar) has been rising steadily over 5 years.
              Dr. Johansson has reviewed your results and left a note.
            </div>
          </div>
        </div>
      )}

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Next blood test */}
        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} style={{ color: "#7C3AED" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontWeight: 500,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Next Blood Test
            </span>
          </div>
          <div
            style={{
              color: "#F5F7FA",
              fontSize: 22,
              fontWeight: 700,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            {daysToNextTest > 0 ? `${daysToNextTest} days` : "Due now"}
          </div>
          <div
            style={{
              color: "#B8C5D6",
              fontSize: 12,
              marginTop: 2,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            September 15, 2026
          </div>
        </div>

        {/* Glucose */}
        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Droplets size={16} style={{ color: "#F59E0B" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontWeight: 500,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Fasting Glucose (blood sugar)
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span
              style={{
                color: "#F59E0B",
                fontSize: 22,
                fontWeight: 700,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              }}
            >
              {glucose?.value}
            </span>
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                marginBottom: 3,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {glucose?.unit}
            </span>
          </div>
          <div
            className="flex items-center gap-1 mt-1"
            style={{ color: "#F59E0B", fontSize: 12 }}
          >
            <TrendingUp size={12} />
            <span
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              +0.8 over 5 years
            </span>
          </div>
        </div>

        {/* Diabetes risk */}
        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} style={{ color: "#F59E0B" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontWeight: 500,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Diabetes Risk (10-year)
            </span>
          </div>
          <div
            style={{
              color: "#F59E0B",
              fontSize: 22,
              fontWeight: 700,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            {RISK_ASSESSMENTS.diabetes.tenYearRisk}
          </div>
          <div
            style={{
              color: "#B8C5D6",
              fontSize: 12,
              marginTop: 2,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            Moderate risk, worsening trend
          </div>
        </div>

        {/* Training */}
        <div
          className="p-4"
          style={{
            background: "#141F2E",
            borderRadius: 12,
            border: "1px solid #1F2D42",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell size={16} style={{ color: "#10B981" }} />
            <span
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                fontWeight: 500,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Training Plan
            </span>
          </div>
          <div
            style={{
              color: "#F5F7FA",
              fontSize: 22,
              fontWeight: 700,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Week {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks}
          </div>
          <div
            style={{
              color: "#10B981",
              fontSize: 12,
              marginTop: 2,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            {TRAINING_PLAN.completedThisWeek}/3 sessions this week
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Glucose trend card */}
          <Link href="/smith1/results" style={{ textDecoration: "none" }}>
            <div
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    style={{
                      color: "#F5F7FA",
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    Glucose Trend (blood sugar over time)
                  </h2>
                  <p
                    style={{
                      color: "#B8C5D6",
                      fontSize: 13,
                      margin: 0,
                      marginTop: 2,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    5 years of fasting glucose readings
                  </p>
                </div>
                <ChevronRight size={18} style={{ color: "#B8C5D6" }} />
              </div>
              <GlucoseSparkline />
            </div>
          </Link>

          {/* Latest blood test summary */}
          <Link href="/smith1/results" style={{ textDecoration: "none" }}>
            <div
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    style={{
                      color: "#F5F7FA",
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    Latest Blood Test
                  </h2>
                  <p
                    style={{
                      color: "#B8C5D6",
                      fontSize: 13,
                      margin: 0,
                      marginTop: 2,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {new Date(latestSession.date).toLocaleDateString("en-SE", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    - {latestSession.orderedBy}
                  </p>
                </div>
                <ChevronRight size={18} style={{ color: "#B8C5D6" }} />
              </div>

              <div className="flex flex-col gap-2">
                {latestSession.results.slice(0, 5).map((r) => (
                  <div
                    key={r.shortName}
                    className="flex items-center justify-between py-2 px-3"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "#F5F7FA",
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        {r.plainName}
                      </span>
                      <span
                        style={{
                          color: "#B8C5D6",
                          fontSize: 11,
                          marginLeft: 6,
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        ({r.shortName})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          color: "#F5F7FA",
                          fontSize: 14,
                          fontWeight: 600,
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                        }}
                      >
                        {r.value} {r.unit}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>

              {latestSession.results.length > 5 && (
                <div
                  className="mt-3 text-center"
                  style={{
                    color: "#7C3AED",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  View all {latestSession.results.length} markers
                </div>
              )}
            </div>
          </Link>

          {/* Risk overview */}
          <Link href="/smith1/risk" style={{ textDecoration: "none" }}>
            <div
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  style={{
                    color: "#F5F7FA",
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  }}
                >
                  Risk Overview
                </h2>
                <ChevronRight size={18} style={{ color: "#B8C5D6" }} />
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "Diabetes (type 2)",
                    risk: RISK_ASSESSMENTS.diabetes.tenYearRisk,
                    level: RISK_ASSESSMENTS.diabetes.riskLevel,
                    trend: RISK_ASSESSMENTS.diabetes.trend,
                    color: "#F59E0B",
                    pct: 45,
                  },
                  {
                    label: "Cardiovascular (heart/stroke)",
                    risk: RISK_ASSESSMENTS.cardiovascular.tenYearRisk,
                    level: RISK_ASSESSMENTS.cardiovascular.riskLevel,
                    trend: RISK_ASSESSMENTS.cardiovascular.trend,
                    color: "#10B981",
                    pct: 20,
                  },
                  {
                    label: "Bone health",
                    risk: RISK_ASSESSMENTS.bone.tenYearRisk,
                    level: RISK_ASSESSMENTS.bone.riskLevel,
                    trend: RISK_ASSESSMENTS.bone.trend,
                    color: "#10B981",
                    pct: 10,
                  },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        style={{
                          color: "#F5F7FA",
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        {r.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            color: r.color,
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                          }}
                        >
                          {r.risk}
                        </span>
                        {r.trend === "worsening" && (
                          <TrendingUp
                            size={12}
                            style={{ color: "#F59E0B" }}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "#1F2D42",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${r.pct}%`,
                          height: "100%",
                          background: r.color,
                          borderRadius: 2,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* Right column - 1/3 */}
        <div className="flex flex-col gap-6">
          {/* Doctor message preview */}
          <Link href="/smith1/messages" style={{ textDecoration: "none" }}>
            <div
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} style={{ color: "#7C3AED" }} />
                  <h3
                    style={{
                      color: "#F5F7FA",
                      fontSize: 14,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    Dr. Johansson
                  </h3>
                </div>
                <ChevronRight size={16} style={{ color: "#B8C5D6" }} />
              </div>
              <p
                style={{
                  color: "#B8C5D6",
                  fontSize: 13,
                  margin: 0,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {lastMessage.text}
              </p>
              <div
                className="mt-2"
                style={{
                  color: "#7C3AED",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {new Date(lastMessage.date).toLocaleDateString("en-SE", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </Link>

          {/* Training this week */}
          <Link href="/smith1/training" style={{ textDecoration: "none" }}>
            <div
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell size={16} style={{ color: "#10B981" }} />
                  <h3
                    style={{
                      color: "#F5F7FA",
                      fontSize: 14,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    This Week
                  </h3>
                </div>
                <ChevronRight size={16} style={{ color: "#B8C5D6" }} />
              </div>

              <div className="flex flex-col gap-2">
                {TRAINING_PLAN.weeklySchedule.map((day, i) => {
                  const done = i < TRAINING_PLAN.completedThisWeek;
                  return (
                    <div
                      key={day.day}
                      className="flex items-center justify-between py-2 px-3"
                      style={{
                        background: done
                          ? "rgba(16, 185, 129, 0.08)"
                          : "rgba(255,255,255,0.02)",
                        borderRadius: 8,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: done ? "#10B981" : "#F5F7FA",
                            fontSize: 13,
                            fontWeight: 500,
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                          }}
                        >
                          {day.day}
                        </span>
                        <span
                          style={{
                            color: "#B8C5D6",
                            fontSize: 11,
                            marginLeft: 6,
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                          }}
                        >
                          {day.name}
                        </span>
                      </div>
                      {done && (
                        <CheckCircle size={16} style={{ color: "#10B981" }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-3"
                style={{
                  color: "#B8C5D6",
                  fontSize: 12,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {TRAINING_PLAN.totalCompleted} total sessions completed
              </div>
            </div>
          </Link>

          {/* Quick actions */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <h3
              style={{
                color: "#F5F7FA",
                fontSize: 14,
                fontWeight: 600,
                margin: 0,
                marginBottom: 12,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              }}
            >
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              {[
                {
                  href: "/smith1/blood-tests",
                  label: "Order Blood Test",
                  icon: Droplets,
                  color: "#7C3AED",
                },
                {
                  href: "/smith1/messages",
                  label: "Message Doctor",
                  icon: MessageSquare,
                  color: "#7C3AED",
                },
                {
                  href: "/smith1/chat",
                  label: "Ask Health Assistant",
                  icon: Shield,
                  color: "#7C3AED",
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 px-3 py-2.5"
                    style={{
                      background: "rgba(124, 58, 237, 0.08)",
                      borderRadius: 8,
                      textDecoration: "none",
                      color: "#F5F7FA",
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    <Icon size={16} style={{ color: action.color }} />
                    <span>{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
