"use client";

import Link from "next/link";
import {
  PATIENT,
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  Dumbbell,
  ChevronRight,
  Flame,
  Calendar,
  TrendingUp,
  Heart,
  Droplet,
  Activity,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowUpRight,
  Target,
  Zap,
  Award,
} from "lucide-react";

// Figure out which workout is "today" (next uncompleted)
const plan = TRAINING_PLAN;
const todayIndex = plan.completedThisWeek; // 2 done, so index 2 = Friday
const todayWorkout = plan.weeklySchedule[todayIndex] || plan.weeklySchedule[0];
const latestGlucose = BLOOD_TEST_HISTORY[0].results.find(
  (r) => r.shortName === "f-Glucose"
);
const glucoseHistory = getMarkerHistory("f-Glucose");
const latestBio = BIOMETRICS_HISTORY[0];
const weekProgress = plan.completedThisWeek;
const weekTotal = plan.weeklySchedule.length;

// Streak calculation: 28 total sessions done across 10 weeks = good consistency
const streakWeeks = 10;

export default function Smith4Home() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top bar */}
      <header
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "var(--bg)",
          zIndex: 40,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #FF6B35, #FF8F65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text)",
                letterSpacing: "-0.3px",
              }}
            >
              Precura
            </span>
          </div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35, #FF8F65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {PATIENT.firstName[0]}
        </div>
      </header>

      <main style={{ padding: "20px 20px 100px", maxWidth: 480, margin: "0 auto" }}>
        {/* Greeting + streak */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
              marginBottom: 4,
            }}
          >
            Hey, {PATIENT.firstName}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            Week {plan.currentWeek} of {plan.totalWeeks} / {plan.totalCompleted}{" "}
            sessions done
          </p>
        </div>

        {/* Week progress pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {plan.weeklySchedule.map((session, i) => {
            const isDone = i < weekProgress;
            const isToday = i === weekProgress;
            return (
              <div
                key={session.day}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 12,
                  textAlign: "center",
                  background: isDone
                    ? "linear-gradient(135deg, #FF6B35, #FF8F65)"
                    : isToday
                    ? "#FFF3ED"
                    : "var(--bg-elevated)",
                  border: isToday ? "2px solid #FF6B35" : "2px solid transparent",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDone ? "#fff" : isToday ? "#FF6B35" : "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 2,
                  }}
                >
                  {session.day.slice(0, 3)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDone ? "rgba(255,255,255,0.9)" : isToday ? "#FF6B35" : "var(--text-secondary)",
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} style={{ margin: "0 auto" }} />
                  ) : isToday ? (
                    "Today"
                  ) : (
                    <Circle size={14} style={{ margin: "0 auto", opacity: 0.4 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TODAY'S WORKOUT - Hero card */}
        <Link href="/smith4/session" style={{ textDecoration: "none" }}>
          <div
            className="animate-fade-in"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #E8522A 100%)",
              borderRadius: 20,
              padding: "24px 22px",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Decorative circle */}
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                right: 40,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Today's Workout
              </div>
              <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
            </div>

            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
                letterSpacing: "-0.3px",
              }}
            >
              {todayWorkout.name}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 20,
              }}
            >
              {todayWorkout.exercises.length} exercises / ~45 min
            </p>

            {/* Exercise preview */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {todayWorkout.exercises.map((ex) => (
                <div
                  key={ex.name}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 500,
                  }}
                >
                  {ex.name}
                </div>
              ))}
            </div>

            {/* Health context banner */}
            <div
              style={{
                marginTop: 18,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Target size={16} color="rgba(255,255,255,0.9)" />
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  lineHeight: 1.35,
                }}
              >
                Targets insulin sensitivity. Your fasting glucose:{" "}
                {latestGlucose?.value} - let's bring that down.
              </span>
            </div>
          </div>
        </Link>

        {/* Quick stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              padding: "14px 12px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <Flame size={18} color="#FF6B35" style={{ margin: "0 auto 6px" }} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              {plan.totalCompleted}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Sessions
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              padding: "14px 12px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <Zap size={18} color="#FF6B35" style={{ margin: "0 auto 6px" }} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              {streakWeeks}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Week streak
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              padding: "14px 12px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <Calendar size={18} color="#FF6B35" style={{ margin: "0 auto 6px" }} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              {plan.totalWeeks - plan.currentWeek + 1}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Weeks left
            </div>
          </div>
        </div>

        {/* Program progress card */}
        <Link href="/smith4/program" style={{ textDecoration: "none" }}>
          <div
            className="animate-fade-in stagger-1 card-hover"
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "18px 18px 16px",
              marginBottom: 12,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#FFF3ED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Dumbbell size={18} color="#FF6B35" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {plan.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    By {plan.createdBy.split(",")[0]}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 8,
                background: "var(--bg-elevated)",
                borderRadius: 4,
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(plan.currentWeek / plan.totalWeeks) * 100}%`,
                  background: "linear-gradient(90deg, #FF6B35, #FF8F65)",
                  borderRadius: 4,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              <span>
                Week {plan.currentWeek}/{plan.totalWeeks}
              </span>
              <span>
                {Math.round((plan.currentWeek / plan.totalWeeks) * 100)}% complete
              </span>
            </div>
          </div>
        </Link>

        {/* Health Impact card */}
        <Link href="/smith4/impact" style={{ textDecoration: "none" }}>
          <div
            className="animate-fade-in stagger-2 card-hover"
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "18px",
              marginBottom: 12,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--teal-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Activity size={18} color="var(--teal)" />
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Health Impact
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>

            {/* Mini markers */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <MarkerMini
                icon={<Droplet size={14} color="var(--amber-text)" />}
                label="Blood sugar (fasting)"
                value={`${latestGlucose?.value} ${latestGlucose?.unit}`}
                trend="up"
                trendColor="var(--amber-text)"
              />
              <MarkerMini
                icon={<Heart size={14} color="var(--green-text)" />}
                label="Blood pressure"
                value={latestBio.bloodPressure}
                trend="stable"
                trendColor="var(--green-text)"
              />
              <MarkerMini
                icon={<TrendingUp size={14} color="var(--amber-text)" />}
                label="Diabetes risk"
                value={RISK_ASSESSMENTS.diabetes.riskLabel}
                trend="up"
                trendColor="var(--amber-text)"
              />
            </div>
          </div>
        </Link>

        {/* Blood Test Results card */}
        <Link href="/smith4/results" style={{ textDecoration: "none" }}>
          <div
            className="animate-fade-in stagger-3 card-hover"
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "18px",
              marginBottom: 12,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--purple-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Droplet size={18} color="var(--purple)" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Latest Blood Test
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    {new Date(BLOOD_TEST_HISTORY[0].date).toLocaleDateString("en-SE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    / Your training progress report
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </div>
        </Link>

        {/* Training history card */}
        <Link href="/smith4/history" style={{ textDecoration: "none" }}>
          <div
            className="animate-fade-in stagger-4 card-hover"
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "18px",
              marginBottom: 12,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#FFF3ED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Clock size={18} color="#FF6B35" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Training History
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    {plan.totalCompleted} sessions completed
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </div>
        </Link>

        {/* Medical consideration note */}
        <div
          className="animate-fade-in stagger-5"
          style={{
            background: "var(--amber-bg)",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 12,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle
            size={18}
            color="var(--amber-text)"
            style={{ marginTop: 1, flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--amber-text)",
                marginBottom: 3,
              }}
            >
              Today's note from your trainer
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.45,
              }}
            >
              {plan.medicalConsiderations[2]}
            </div>
          </div>
        </div>

        {/* Credibility footer */}
        <div
          className="animate-fade-in stagger-6"
          style={{
            textAlign: "center",
            padding: "20px 0 0",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Program designed by{" "}
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              {plan.createdBy}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Reviewed by{" "}
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              {plan.reviewedBy}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function MarkerMini({
  icon,
  label,
  value,
  trend,
  trendColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  trendColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon}
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          {value}
        </span>
        {trend === "up" && (
          <ArrowUpRight size={13} color={trendColor} strokeWidth={2.5} />
        )}
        {trend === "stable" && (
          <span style={{ fontSize: 11, color: trendColor, fontWeight: 600 }}>
            Stable
          </span>
        )}
      </div>
    </div>
  );
}
