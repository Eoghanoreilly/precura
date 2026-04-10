"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Sun,
  Footprints,
  BookOpen,
  ChevronRight,
  Flame,
  Clock,
  Star,
} from "lucide-react";
import {
  TRAINING_PLAN,
  PATIENT,
} from "@/lib/v2/mock-patient";

// ============================================================================
// TODAY'S FOCUS - Daily task view with lesson content and workout detail
// One day of the guided journey. Micro-tasks. Progressive disclosure.
// ============================================================================

const GREEN = "#2d7a3a";
const GREEN_LIGHT = "#e8f5e9";

interface Task {
  id: string;
  label: string;
  detail: string;
  type: "workout" | "supplement" | "habit" | "learn";
  done: boolean;
  duration?: string;
  expandedContent?: React.ReactNode;
}

function TaskIcon({ type }: { type: Task["type"] }) {
  const iconProps = { size: 16 };
  switch (type) {
    case "workout":
      return <Dumbbell {...iconProps} />;
    case "supplement":
      return <Sun {...iconProps} />;
    case "habit":
      return <Footprints {...iconProps} />;
    case "learn":
      return <BookOpen {...iconProps} />;
  }
}

function typeLabel(type: Task["type"]) {
  switch (type) {
    case "workout": return "Workout";
    case "supplement": return "Supplement";
    case "habit": return "Daily habit";
    case "learn": return "Lesson";
  }
}

function typeColor(type: Task["type"]) {
  switch (type) {
    case "workout": return { bg: "#e3f2fd", text: "#1565c0" };
    case "supplement": return { bg: "#fff8e1", text: "#e65100" };
    case "habit": return { bg: GREEN_LIGHT, text: GREEN };
    case "learn": return { bg: "#ede7f6", text: "#5e35b1" };
  }
}

// Get today's workout from training plan (Wednesday = Lower Body + Core)
const todayWorkout = TRAINING_PLAN.weeklySchedule[1]; // Wednesday

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      label: `${todayWorkout.day} workout: ${todayWorkout.name}`,
      detail: todayWorkout.exercises.map((e) => e.name).join(", "),
      type: "workout",
      done: false,
      duration: "~35 min",
    },
    {
      id: "t2",
      label: "Take your Vitamin D supplement",
      detail: "2000 IU D3, as recommended by Dr. Johansson",
      type: "supplement",
      done: true,
      duration: "1 min",
    },
    {
      id: "t3",
      label: "Post-dinner walk (20 min)",
      detail: "Helps your body regulate blood sugar (fasting glucose) after eating",
      type: "habit",
      done: false,
      duration: "20 min",
    },
    {
      id: "t4",
      label: "Daily lesson: Why insulin sensitivity matters",
      detail: "3-min read about how exercise changes your cells",
      type: "learn",
      done: false,
      duration: "3 min read",
    },
  ]);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lessonRead, setLessonRead] = useState(false);

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const allDone = updated.every((t) => t.done);
      if (allDone) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
      return updated;
    });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <Link
          href="/smith8"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--bg-elevated)",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Today&apos;s Focus
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Wednesday, Week 10
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Progress header */}
        <div style={{ padding: "20px 0 8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              {completedCount} of {totalCount} tasks done
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: GREEN,
                fontWeight: 600,
              }}
            >
              <Flame size={14} />
              Day 28
            </div>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "#eee",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${GREEN}, #4caf50)`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Celebration banner */}
        {showCelebration && (
          <div
            className="animate-scale-in"
            style={{
              marginTop: 16,
              background: `linear-gradient(135deg, ${GREEN_LIGHT}, #fff)`,
              borderRadius: 20,
              border: `2px solid ${GREEN}`,
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <Star size={36} color={GREEN} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: GREEN }}>
              Perfect day!
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
              All tasks complete. Your streak continues. Every day like this
              is lowering your diabetes risk.
            </div>
          </div>
        )}

        {/* Task cards */}
        <div style={{ marginTop: 16 }}>
          {tasks.map((task, idx) => {
            const tc = typeColor(task.type);
            const isExpanded = expandedTask === task.id;

            return (
              <div
                key={task.id}
                className={`animate-fade-in stagger-${idx + 1}`}
                style={{
                  marginBottom: 12,
                  background: "var(--bg-card)",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                  opacity: task.done ? 0.7 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                {/* Main task row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "16px",
                  }}
                >
                  {/* Check circle */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: task.done ? "none" : "2px solid var(--border)",
                      background: task.done ? GREEN : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginTop: 1,
                    }}
                  >
                    {task.done && <CheckCircle2 size={16} color="#fff" />}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: tc.bg,
                          color: tc.text,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        <TaskIcon type={task.type} />
                        {typeLabel(task.type)}
                      </div>
                      {task.duration && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 11,
                            color: "var(--text-muted)",
                          }}
                        >
                          <Clock size={10} />
                          {task.duration}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: 15,
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
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginTop: 3,
                        lineHeight: 1.4,
                      }}
                    >
                      {task.detail}
                    </div>

                    {/* Expand button */}
                    {(task.type === "workout" || task.type === "learn") && (
                      <button
                        onClick={() =>
                          setExpandedTask(isExpanded ? null : task.id)
                        }
                        style={{
                          marginTop: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          color: GREEN,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isExpanded ? "Show less" : task.type === "workout" ? "View exercises" : "Read lesson"}
                        <ChevronRight
                          size={14}
                          style={{
                            transform: isExpanded ? "rotate(90deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && task.type === "workout" && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: "0 16px 16px 56px",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--bg-elevated)",
                        borderRadius: 12,
                        padding: "12px 14px",
                      }}
                    >
                      {todayWorkout.exercises.map((ex, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 0",
                            borderBottom:
                              i < todayWorkout.exercises.length - 1
                                ? "1px solid var(--divider)"
                                : "none",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "var(--text)",
                              }}
                            >
                              {ex.name}
                            </div>
                            {ex.notes && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                  marginTop: 1,
                                }}
                              >
                                {ex.notes}
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: "var(--text-secondary)",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ex.sets} x {ex.reps} {ex.unit}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Medical note */}
                    <div
                      style={{
                        marginTop: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: "#fff8e1",
                        fontSize: 12,
                        color: "#e65100",
                        lineHeight: 1.5,
                      }}
                    >
                      Medical note: Core strengthening included for your back history.
                      Avoid loaded spinal flexion. Keep core engaged throughout.
                    </div>
                  </div>
                )}

                {isExpanded && task.type === "learn" && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: "0 16px 16px 56px",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--bg-elevated)",
                        borderRadius: 12,
                        padding: "16px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--text)",
                          margin: "0 0 10px",
                        }}
                      >
                        Why muscles are your best medicine
                      </h4>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          margin: "0 0 12px",
                        }}
                      >
                        When you exercise, your muscles pull glucose (blood sugar) directly
                        from your bloodstream. The remarkable thing? They do this{" "}
                        <strong>without needing insulin</strong>. This process is called
                        &quot;non-insulin-mediated glucose uptake.&quot;
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          margin: "0 0 12px",
                        }}
                      >
                        For you, Anna, this is especially relevant. Your fasting glucose
                        (blood sugar when you wake up) has been gradually rising from 5.0
                        to 5.8 mmol/L over the past five years. Your mother was diagnosed
                        with type 2 diabetes at 58. The good news? Research shows that
                        regular resistance training can improve insulin sensitivity by
                        up to 25% in 12 weeks.
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          margin: "0 0 12px",
                        }}
                      >
                        Every squat, every lunge, every plank hold in your program is
                        building more &quot;glucose sinks&quot; in your body. The more
                        muscle tissue you have, the more places your blood sugar can go
                        without your pancreas working overtime.
                      </p>
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: GREEN_LIGHT,
                          fontSize: 13,
                          color: GREEN,
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        Your takeaway: The squats and lunges in today&apos;s workout aren&apos;t
                        just about leg strength. They&apos;re directly helping your body
                        handle blood sugar better, right now and for years to come.
                      </div>

                      {!lessonRead && (
                        <button
                          onClick={() => {
                            setLessonRead(true);
                            toggleTask("t4");
                          }}
                          style={{
                            marginTop: 12,
                            padding: "10px 20px",
                            background: GREEN,
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <CheckCircle2 size={16} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Week overview */}
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            Week 10 overview
          </div>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const isToday = i === 2; // Wednesday
            const isPast = i < 2;
            const workoutDay = i === 0 || i === 2 || i === 4;

            return (
              <div
                key={day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: i < 6 ? "1px solid var(--divider)" : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    fontSize: 13,
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? GREEN : "var(--text-secondary)",
                  }}
                >
                  {day}
                </div>
                <div style={{ flex: 1 }}>
                  {workoutDay && (
                    <div
                      style={{
                        fontSize: 13,
                        color: isPast
                          ? "var(--text-muted)"
                          : isToday
                          ? "var(--text)"
                          : "var(--text-secondary)",
                        fontWeight: isToday ? 600 : 400,
                        textDecoration: isPast ? "line-through" : "none",
                      }}
                    >
                      {i === 0
                        ? "Upper Body"
                        : i === 2
                        ? "Lower Body + Core"
                        : "Full Body + Cardio"}
                    </div>
                  )}
                  {!workoutDay && (
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      Active recovery / walk
                    </div>
                  )}
                </div>
                <div>
                  {isPast && workoutDay && (
                    <CheckCircle2 size={16} color={GREEN} />
                  )}
                  {isToday && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: GREEN,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: GREEN_LIGHT,
                      }}
                    >
                      Today
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivation / context */}
        <div
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: GREEN_LIGHT,
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>
            You have completed {TRAINING_PLAN.totalCompleted} of{" "}
            {TRAINING_PLAN.totalWeeks * 3} planned sessions
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            2 weeks left in your initial training program.
            Your 6-month blood test is in September.
          </div>
        </div>
      </div>
    </div>
  );
}
