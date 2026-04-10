"use client";

import Link from "next/link";
import {
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Dumbbell,
  Calendar,
  Target,
  Shield,
  User,
  Stethoscope,
  AlertTriangle,
  Award,
  Flame,
} from "lucide-react";

const plan = TRAINING_PLAN;

// Generate 12-week schedule with mock completion data
const weekSchedule = Array.from({ length: plan.totalWeeks }).map((_, weekIdx) => {
  const weekNum = weekIdx + 1;
  const isCurrent = weekNum === plan.currentWeek;
  const isPast = weekNum < plan.currentWeek;
  const isFuture = weekNum > plan.currentWeek;

  // Past weeks: most are 3/3, a few are 2/3
  const sessionsCompleted = isPast
    ? weekNum === 3 || weekNum === 7
      ? 2
      : 3
    : isCurrent
    ? plan.completedThisWeek
    : 0;

  return {
    weekNum,
    isCurrent,
    isPast,
    isFuture,
    sessionsCompleted,
    totalSessions: plan.weeklySchedule.length,
  };
});

const totalSessionsPossible = plan.totalWeeks * plan.weeklySchedule.length;
const adherenceRate = Math.round(
  (plan.totalCompleted / (plan.currentWeek * plan.weeklySchedule.length)) * 100
);

export default function ProgramPage() {
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
          Your Program
        </span>
      </header>

      <main style={{ padding: "20px 20px 80px", maxWidth: 480, margin: "0 auto" }}>
        {/* Program header */}
        <div
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #E8522A 100%)",
            borderRadius: 20,
            padding: "22px 20px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Dumbbell size={20} color="#fff" />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              12-Week Program
            </span>
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 6,
              letterSpacing: "-0.3px",
            }}
          >
            {plan.name}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.45,
              marginBottom: 16,
            }}
          >
            {plan.goal}
          </p>

          {/* Progress */}
          <div
            style={{
              height: 8,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(plan.currentWeek / plan.totalWeeks) * 100}%`,
                background: "#fff",
                borderRadius: 4,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              fontWeight: 600,
            }}
          >
            <span>
              Week {plan.currentWeek} of {plan.totalWeeks}
            </span>
            <span>{adherenceRate}% adherence</span>
          </div>
        </div>

        {/* Stats row */}
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
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}
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
              Completed
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}
            >
              {adherenceRate}%
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Adherence
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 14,
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{ fontSize: 22, fontWeight: 800, color: "var(--green)" }}
            >
              {totalSessionsPossible - plan.totalCompleted -
                (plan.weeklySchedule.length - plan.completedThisWeek) -
                (plan.totalWeeks - plan.currentWeek) * plan.weeklySchedule.length >
              0
                ? 0
                : plan.totalWeeks * plan.weeklySchedule.length -
                  plan.totalCompleted}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Remaining
            </div>
          </div>
        </div>

        {/* Weekly schedule */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            Weekly Schedule
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {plan.weeklySchedule.map((session, idx) => (
              <Link
                href="/smith4/session"
                key={session.day}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card-hover"
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background:
                          idx < plan.completedThisWeek
                            ? "var(--green-bg)"
                            : idx === plan.completedThisWeek
                            ? "#FFF3ED"
                            : "var(--bg-elevated)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {idx < plan.completedThisWeek ? (
                        <CheckCircle2 size={20} color="var(--green)" />
                      ) : (
                        <Dumbbell
                          size={18}
                          color={
                            idx === plan.completedThisWeek
                              ? "#FF6B35"
                              : "var(--text-muted)"
                          }
                        />
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color:
                            idx < plan.completedThisWeek
                              ? "var(--green-text)"
                              : "var(--text)",
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
                        {session.day} / {session.exercises.length} exercises
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 12-week grid */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            12-Week Overview
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {weekSchedule.map((week) => (
              <div
                key={week.weekNum}
                style={{
                  background: week.isCurrent
                    ? "#FFF3ED"
                    : week.isPast
                    ? "var(--bg-card)"
                    : "var(--bg-elevated)",
                  borderRadius: 12,
                  padding: "10px 8px",
                  textAlign: "center",
                  border: week.isCurrent
                    ? "2px solid #FF6B35"
                    : "1px solid var(--border)",
                  opacity: week.isFuture ? 0.5 : 1,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: week.isCurrent
                      ? "#FF6B35"
                      : "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Wk {week.weekNum}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  {Array.from({ length: week.totalSessions }).map((_, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          sIdx < week.sessionsCompleted
                            ? week.sessionsCompleted === week.totalSessions
                              ? "var(--green)"
                              : "#FF6B35"
                            : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why this program */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 18,
            padding: "18px",
            border: "1px solid var(--border)",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Target size={16} color="#FF6B35" />
            Why this program
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              marginBottom: 14,
            }}
          >
            Your fasting blood sugar has been rising steadily for 5 years (from
            5.0 to 5.8). Combined with your family history of type 2 diabetes,
            you have a moderate and worsening risk. This program targets the
            factors you can change: muscle mass, insulin sensitivity, and body
            composition.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <WhyItem
              label="Resistance training improves how your muscles absorb glucose"
            />
            <WhyItem
              label="3 sessions per week is the evidence-backed minimum for metabolic benefit"
            />
            <WhyItem
              label="Progressive overload builds the lean mass that regulates blood sugar long-term"
            />
          </div>
        </div>

        {/* Team */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 18,
            padding: "18px",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            Your Team
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6B35, #FF8F65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Dumbbell size={18} color="#fff" />
              </div>
              <div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}
                >
                  {plan.createdBy}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Designed your program
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--teal-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stethoscope size={18} color="var(--teal)" />
              </div>
              <div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}
                >
                  {plan.reviewedBy}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Medically reviewed and approved
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function WhyItem({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <CheckCircle2
        size={16}
        color="var(--green)"
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.45,
        }}
      >
        {label}
      </span>
    </div>
  );
}
