"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
  Star,
  Calendar,
  MapPin,
  Heart,
  Dumbbell,
  MessageCircle,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";
import {
  PATIENT,
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  MESSAGES,
} from "@/lib/v2/mock-patient";

// ============================================================================
// SMITH 8 - GUIDED HEALTH JOURNEY
// Philosophy: Progressive disclosure. One thing at a time. A coached program.
// Showing Anna at Week 10 of her ~16-week journey.
// ============================================================================

const GREEN = "#2d7a3a";
const GREEN_LIGHT = "#e8f5e9";
const GREEN_BG = "#f0fdf4";

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  status: "done" | "current" | "locked";
  icon: React.ReactNode;
  weekRange: string;
  summary?: string;
  achievement?: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: "Risk Assessment",
    subtitle: "FINDRISC screening and health questionnaires",
    status: "done",
    icon: <MapPin size={18} />,
    weekRange: "Week 1",
    summary: "Completed FINDRISC (score: 12/26, moderate risk), PHQ-9, GAD-7, and AUDIT-C screenings.",
    achievement: "Baseline established",
  },
  {
    id: 2,
    title: "Understanding Your Results",
    subtitle: "What your screening scores mean for you",
    status: "done",
    icon: <Sparkles size={18} />,
    weekRange: "Week 2",
    summary: "Learned about your moderate diabetes risk, how family history plays a role, and which factors you can change.",
    achievement: "Knowledge unlocked",
  },
  {
    id: 3,
    title: "Your First Blood Test",
    subtitle: "Ordering, booking, and getting blood drawn",
    status: "done",
    icon: <Heart size={18} />,
    weekRange: "Week 3",
    summary: "Comprehensive blood panel ordered by Dr. Johansson. Blood drawn at Karolinska University Laboratory.",
    achievement: "First test complete",
  },
  {
    id: 4,
    title: "Blood Test Results + Doctor Review",
    subtitle: "Dr. Johansson reviewed your results personally",
    status: "done",
    icon: <MessageCircle size={18} />,
    weekRange: "Week 4",
    summary: "Fasting glucose 5.8 mmol/L (borderline), HbA1c (long-term blood sugar) 38 mmol/mol (normal). Doctor flagged the 5-year rising trend.",
    achievement: "Full picture revealed",
  },
  {
    id: 5,
    title: "Starting Your Training Plan",
    subtitle: "Your personalized Metabolic Health Program begins",
    status: "done",
    icon: <Dumbbell size={18} />,
    weekRange: "Weeks 5-6",
    summary: "Started 3x/week training: upper body, lower body + core, full body + cardio. Designed for insulin sensitivity.",
    achievement: "First 6 workouts done",
  },
  {
    id: 6,
    title: "Building Habits",
    subtitle: "Making exercise and nutrition stick",
    status: "done",
    icon: <Flame size={18} />,
    weekRange: "Weeks 7-8",
    summary: "Completed 12 more sessions. Added post-dinner walks for blood sugar regulation. Started Vitamin D supplementation.",
    achievement: "Habit streak: 4 weeks",
  },
  {
    id: 7,
    title: "Deepening Your Practice",
    subtitle: "Weeks 9-12 of your training program",
    status: "current",
    icon: <TrendingUp size={18} />,
    weekRange: "Weeks 9-12 (you are here)",
    summary: "Week 10 of 12. 28 sessions completed. Focus: increasing intensity, refining form, building consistency for the long term.",
  },
  {
    id: 8,
    title: "Your 6-Month Check-In",
    subtitle: "Second blood test to measure your progress",
    status: "locked",
    icon: <Calendar size={18} />,
    weekRange: "September 2026",
  },
  {
    id: 9,
    title: "Measuring Progress",
    subtitle: "Compare your before and after numbers",
    status: "locked",
    icon: <TrendingUp size={18} />,
    weekRange: "After blood test",
  },
  {
    id: 10,
    title: "Your Year In Review",
    subtitle: "A full picture of how far you have come",
    status: "locked",
    icon: <Award size={18} />,
    weekRange: "January 2027",
  },
];

// Today's micro-tasks for Week 10
const TODAY_TASKS = [
  {
    id: "t1",
    label: "Wednesday workout: Lower Body + Core",
    detail: "Squats, lunges, glute bridges, dead bugs",
    type: "workout" as const,
    done: false,
  },
  {
    id: "t2",
    label: "Take your Vitamin D supplement",
    detail: "2000 IU D3, as recommended by Dr. Johansson",
    type: "supplement" as const,
    done: true,
  },
  {
    id: "t3",
    label: "Post-dinner walk (20 min)",
    detail: "Helps your body regulate blood sugar after eating",
    type: "habit" as const,
    done: false,
  },
  {
    id: "t4",
    label: "Daily lesson: Why insulin sensitivity matters",
    detail: "3-min read about how exercise changes your cells",
    type: "learn" as const,
    done: false,
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Smith8Home() {
  const [tasks, setTasks] = useState(TODAY_TASKS);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completedTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const todayProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const allDone = updated.every((t) => t.done);
      if (allDone && !showCelebration) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
      return updated;
    });
  };

  const completedStages = STAGES.filter((s) => s.status === "done").length;
  const currentStage = STAGES.find((s) => s.status === "current");

  if (!mounted) return null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            P
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Precura</span>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: GREEN_LIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: GREEN,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          AB
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Greeting + streak */}
        <div style={{ padding: "24px 0 4px" }}>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
            Week 10 of your health journey
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Good morning, {PATIENT.firstName}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              fontSize: 14,
              color: GREEN,
              fontWeight: 600,
            }}
          >
            <Flame size={16} />
            <span>28-day streak</span>
            <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: 4 }}>
              / {TRAINING_PLAN.totalCompleted} workouts completed
            </span>
          </div>
        </div>

        {/* Today's focus card */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              padding: "16px 20px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                TODAY'S FOCUS
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 2 }}>
                {completedTasks} of {totalTasks} tasks done
              </div>
            </div>
            <Link
              href="/smith8/today"
              style={{
                fontSize: 13,
                color: GREEN,
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {/* Progress bar */}
          <div style={{ padding: "0 20px 16px" }}>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "#eee",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${todayProgress}%`,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${GREEN}, #4caf50)`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* Task list */}
          <div style={{ padding: "0 12px 12px" }}>
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "10px 8px",
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: 12,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-elevated)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: task.done ? "none" : "2px solid var(--border)",
                    background: task.done ? GREEN : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                    transition: "all 0.2s",
                  }}
                >
                  {task.done && <CheckCircle2 size={14} color="#fff" />}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: task.done ? "var(--text-muted)" : "var(--text)",
                      textDecoration: task.done ? "line-through" : "none",
                      lineHeight: 1.3,
                    }}
                  >
                    {task.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    {task.detail}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All-day celebration overlay */}
        {showCelebration && (
          <div
            className="animate-scale-in"
            style={{
              marginTop: 16,
              background: `linear-gradient(135deg, ${GREEN_LIGHT}, #fff)`,
              borderRadius: 20,
              border: `2px solid ${GREEN}`,
              padding: "20px",
              textAlign: "center",
            }}
          >
            <Star size={32} color={GREEN} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>
              All tasks complete!
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              Another step forward on your health journey.
            </div>
          </div>
        )}

        {/* Current stage card */}
        {currentStage && (
          <Link
            href="/smith8/stage?id=7"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                marginTop: 20,
                background: `linear-gradient(135deg, ${GREEN}, #3a9748)`,
                borderRadius: 20,
                padding: "20px",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(45,122,58,0.25)",
              }}
              className="animate-fade-in stagger-1"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    opacity: 0.8,
                  }}
                >
                  Current Stage
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Stage {currentStage.id} of {STAGES.length}
                </div>
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  margin: "12px 0 4px",
                  lineHeight: 1.2,
                }}
              >
                {currentStage.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  opacity: 0.85,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {currentStage.summary}
              </p>

              {/* Stage progress within */}
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    opacity: 0.8,
                    marginBottom: 6,
                  }}
                >
                  <span>Week 10 of 12</span>
                  <span>{TRAINING_PLAN.completedThisWeek}/3 workouts this week</span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "50%",
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.8)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 14,
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: 0.9,
                }}
              >
                Continue your stage <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        )}

        {/* Journey map preview */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
          className="animate-fade-in stagger-2"
        >
          <div
            style={{
              padding: "16px 20px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
              Your Journey
            </div>
            <Link
              href="/smith8/journey"
              style={{
                fontSize: 13,
                color: GREEN,
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Full map <ChevronRight size={14} />
            </Link>
          </div>

          {/* Mini journey path */}
          <div style={{ padding: "0 20px 16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                position: "relative",
              }}
            >
              {STAGES.map((stage, idx) => (
                <div
                  key={stage.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: idx < STAGES.length - 1 ? 1 : "none",
                  }}
                >
                  {/* Node */}
                  <div
                    style={{
                      width: stage.status === "current" ? 28 : 20,
                      height: stage.status === "current" ? 28 : 20,
                      borderRadius: "50%",
                      background:
                        stage.status === "done"
                          ? GREEN
                          : stage.status === "current"
                          ? GREEN
                          : "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border:
                        stage.status === "current"
                          ? `3px solid ${GREEN_LIGHT}`
                          : "none",
                      boxShadow:
                        stage.status === "current"
                          ? `0 0 0 2px ${GREEN}`
                          : "none",
                      transition: "all 0.3s",
                      zIndex: 2,
                    }}
                  >
                    {stage.status === "done" ? (
                      <CheckCircle2 size={12} color="#fff" />
                    ) : stage.status === "current" ? (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#fff",
                        }}
                      />
                    ) : (
                      <Lock size={10} color="#aaa" />
                    )}
                  </div>

                  {/* Connector line */}
                  {idx < STAGES.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 3,
                        background:
                          stage.status === "done" ? GREEN : "#e0e0e0",
                        minWidth: 4,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Labels for start, current, end */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              <span>Start</span>
              <span style={{ color: GREEN, fontWeight: 600 }}>You are here</span>
              <span>Year review</span>
            </div>
          </div>
        </div>

        {/* This week's insight */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-3"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Sparkles size={16} color={GREEN} />
            <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 0.5 }}>
              This week's lesson
            </span>
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 8px",
              lineHeight: 1.3,
            }}
          >
            Why your muscles are your best medicine
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Muscle tissue absorbs glucose from your blood without needing insulin. The more muscle you build,
            the better your body handles blood sugar. This is especially important for you, given your fasting
            glucose trend (5.0 to 5.8 over 5 years) and your family history of type 2 diabetes.
          </p>
          <Link
            href="/smith8/today"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 12,
              fontSize: 13,
              fontWeight: 600,
              color: GREEN,
              textDecoration: "none",
            }}
          >
            Read the full lesson <ChevronRight size={14} />
          </Link>
        </div>

        {/* Recent achievements */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-4"
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
            Recent achievements
          </div>
          {STAGES.filter((s) => s.status === "done")
            .slice(-3)
            .reverse()
            .map((stage) => (
              <div
                key={stage.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--divider)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: GREEN_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: GREEN,
                    flexShrink: 0,
                  }}
                >
                  {stage.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    Stage {stage.id}: {stage.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {stage.achievement}
                  </div>
                </div>
                <CheckCircle2 size={18} color={GREEN} />
              </div>
            ))}
        </div>

        {/* Doctor message preview */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-5"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
                color: "#1565c0",
              }}
            >
              MJ
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Dr. Marcus Johansson
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Your Precura doctor
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              background: "var(--bg-elevated)",
              borderRadius: 14,
              padding: "12px 14px",
            }}
          >
            &quot;Your concern is completely understandable given your family history.
            Beyond the training plan, I'd suggest getting your daily steps up -
            even a 20-minute walk after dinner helps blood sugar regulation...&quot;
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 8,
            }}
          >
            {formatDate(MESSAGES[MESSAGES.length - 1].date.split("T")[0])}
          </div>
        </div>

        {/* Coming up next */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
          className="animate-fade-in stagger-6"
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            Coming up next
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
            After you finish Stage 7
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: "var(--bg-elevated)",
              borderRadius: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
                flexShrink: 0,
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
                Stage 8: Your 6-Month Check-In
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Second blood test scheduled for {formatDate(PATIENT.nextBloodTest)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
