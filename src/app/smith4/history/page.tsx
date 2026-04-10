"use client";

import Link from "next/link";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  Dumbbell,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const plan = TRAINING_PLAN;

// Generate mock session history data
// 28 completed sessions across 10 weeks, 3 per week (missed 2 sessions total in weeks 3 and 7)
interface SessionRecord {
  id: number;
  week: number;
  date: string;
  name: string;
  day: string;
  exercises: number;
  duration: number; // minutes
  completed: boolean;
}

const sessionHistory: SessionRecord[] = [];
let sessionId = 1;
const startDate = new Date("2026-01-20"); // Plan start date

for (let week = 1; week <= plan.currentWeek; week++) {
  const weekSessions =
    week === plan.currentWeek
      ? plan.weeklySchedule.slice(0, plan.completedThisWeek)
      : plan.weeklySchedule;

  weekSessions.forEach((session, idx) => {
    // Skip one session in week 3 (Wednesday) and week 7 (Friday)
    if (
      (week === 3 && idx === 1) ||
      (week === 7 && idx === 2)
    ) {
      return;
    }

    const sessionDate = new Date(startDate);
    sessionDate.setDate(
      startDate.getDate() + (week - 1) * 7 + [0, 2, 4][idx]
    );

    sessionHistory.push({
      id: sessionId++,
      week,
      date: sessionDate.toISOString().split("T")[0],
      name: session.name,
      day: session.day,
      exercises: session.exercises.length,
      duration: 35 + Math.floor(Math.random() * 20), // 35-55 min
      completed: true,
    });
  });
}

// Reverse for most recent first
const reversedHistory = [...sessionHistory].reverse();

// Group by week
const weekGroups: { week: number; sessions: SessionRecord[] }[] = [];
for (let w = plan.currentWeek; w >= 1; w--) {
  const sessions = reversedHistory.filter((s) => s.week === w);
  if (sessions.length > 0) {
    weekGroups.push({ week: w, sessions });
  }
}

// Stats
const totalMinutes = sessionHistory.reduce((acc, s) => acc + s.duration, 0);
const avgDuration = Math.round(totalMinutes / sessionHistory.length);
const perfectWeeks = weekGroups.filter(
  (g) => g.sessions.length === plan.weeklySchedule.length
).length;

export default function HistoryPage() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(
    plan.currentWeek
  );

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
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          Training History
        </span>
      </header>

      <main style={{ padding: "20px 20px 80px", maxWidth: 480, margin: "0 auto" }}>
        {/* Stats overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <StatCard
            icon={<Flame size={20} color="#FF6B35" />}
            value={plan.totalCompleted.toString()}
            label="Sessions completed"
            highlight
          />
          <StatCard
            icon={<Clock size={20} color="var(--teal)" />}
            value={`${Math.round(totalMinutes / 60)}h`}
            label="Total training time"
          />
          <StatCard
            icon={<Zap size={20} color="#FF6B35" />}
            value={`${avgDuration}m`}
            label="Avg session length"
          />
          <StatCard
            icon={<Award size={20} color="var(--green)" />}
            value={perfectWeeks.toString()}
            label="Perfect weeks (3/3)"
          />
        </div>

        {/* Activity heatmap - simple week-by-week grid */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 12,
            }}
          >
            Consistency
          </h2>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "16px",
              border: "1px solid var(--border)",
            }}
          >
            {/* Days header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px repeat(7, 1fr)",
                gap: 4,
                marginBottom: 6,
              }}
            >
              <div />
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Week rows */}
            {Array.from({ length: plan.currentWeek }).map((_, weekIdx) => {
              const weekNum = weekIdx + 1;
              const weekSessions = sessionHistory.filter(
                (s) => s.week === weekNum
              );
              // Monday=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
              const activeDays: number[] = weekSessions.map((s) => {
                if (s.day === "Monday") return 0;
                if (s.day === "Wednesday") return 2;
                if (s.day === "Friday") return 4;
                return -1;
              });

              return (
                <div
                  key={weekNum}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px repeat(7, 1fr)",
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color:
                        weekNum === plan.currentWeek
                          ? "#FF6B35"
                          : "var(--text-muted)",
                      fontWeight:
                        weekNum === plan.currentWeek ? 700 : 400,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    W{weekNum}
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const isActive = activeDays.includes(dayIdx);
                    const isTrainingDay =
                      dayIdx === 0 || dayIdx === 2 || dayIdx === 4;
                    const isCurrent = weekNum === plan.currentWeek;
                    const isFutureInCurrentWeek =
                      isCurrent &&
                      dayIdx >
                        [0, 2, 4][plan.completedThisWeek - 1] + (plan.completedThisWeek > 0 ? 0 : -1);

                    return (
                      <div
                        key={dayIdx}
                        style={{
                          aspectRatio: "1",
                          borderRadius: 4,
                          background: isActive
                            ? "linear-gradient(135deg, #FF6B35, #FF8F65)"
                            : isTrainingDay && !isCurrent
                            ? "var(--red-bg)"
                            : "var(--bg-elevated)",
                          opacity:
                            isActive
                              ? 1
                              : isTrainingDay && !isCurrent
                              ? 0.5
                              : 0.3,
                          maxWidth: 28,
                          margin: "0 auto",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: "var(--text-muted)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #FF6B35, #FF8F65)",
                  }}
                />
                Completed
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: "var(--text-muted)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "var(--red-bg)",
                    opacity: 0.5,
                  }}
                />
                Missed
              </div>
            </div>
          </div>
        </div>

        {/* Session log by week */}
        <div>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 12,
            }}
          >
            Session log
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weekGroups.map((group) => {
              const isExpanded = expandedWeek === group.week;
              const isPerfect =
                group.sessions.length === plan.weeklySchedule.length;
              const isCurrent = group.week === plan.currentWeek;

              return (
                <div
                  key={group.week}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 16,
                    border: isCurrent
                      ? "2px solid #FF6B35"
                      : "1px solid var(--border)",
                    overflow: "hidden",
                  }}
                >
                  {/* Week header */}
                  <button
                    onClick={() =>
                      setExpandedWeek(isExpanded ? null : group.week)
                    }
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isCurrent
                            ? "#FFF3ED"
                            : isPerfect
                            ? "var(--green-bg)"
                            : "var(--bg-elevated)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: isCurrent
                            ? "#FF6B35"
                            : isPerfect
                            ? "var(--green-text)"
                            : "var(--text-muted)",
                        }}
                      >
                        {group.week}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--text)",
                          }}
                        >
                          Week {group.week}
                          {isCurrent ? " (Current)" : ""}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                          }}
                        >
                          {group.sessions.length}/
                          {plan.weeklySchedule.length} sessions
                          {isPerfect ? " - Perfect week!" : ""}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {/* Session dots */}
                      <div
                        style={{
                          display: "flex",
                          gap: 3,
                        }}
                      >
                        {Array.from({
                          length: plan.weeklySchedule.length,
                        }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background:
                                i < group.sessions.length
                                  ? isPerfect
                                    ? "var(--green)"
                                    : "#FF6B35"
                                  : "var(--border)",
                            }}
                          />
                        ))}
                      </div>
                      {isExpanded ? (
                        <ChevronUp
                          size={16}
                          color="var(--text-muted)"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          color="var(--text-muted)"
                        />
                      )}
                    </div>
                  </button>

                  {/* Expanded sessions */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 16px 14px",
                        borderTop: "1px solid var(--divider)",
                      }}
                    >
                      {group.sessions.map((session) => (
                        <div
                          key={session.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 0",
                            borderBottom:
                              "1px solid var(--divider)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <CheckCircle2
                              size={18}
                              color="var(--green)"
                            />
                            <div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "var(--text)",
                                }}
                              >
                                {session.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {session.day} /{" "}
                                {new Date(
                                  session.date
                                ).toLocaleDateString("en-SE", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-secondary)",
                              }}
                            >
                              {session.duration}m
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                              }}
                            >
                              {session.exercises} exercises
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  highlight,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? "#FFF3ED" : "var(--bg-card)",
        borderRadius: 16,
        padding: "16px 14px",
        border: highlight
          ? "1px solid rgba(255,107,53,0.15)"
          : "1px solid var(--border)",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>
        {icon}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: highlight ? "#FF6B35" : "var(--text)",
          marginBottom: 2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}
