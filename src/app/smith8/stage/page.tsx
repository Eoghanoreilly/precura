"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* =====================================================================
   STAGE 7: DEEPENING PRACTICE (Weeks 9-12)
   Current active stage - daily tasks, weekly goals, health markers
   ===================================================================== */

interface DailyTask {
  id: string;
  label: string;
  description: string;
  type: "exercise" | "habit" | "track" | "learn";
  completed: boolean;
}

const TODAY_TASKS: DailyTask[] = [
  {
    id: "t1",
    label: "Lower Body + Core Workout",
    description: "4 exercises: squats, lunges, glute bridges, dead bugs",
    type: "exercise",
    completed: false,
  },
  {
    id: "t2",
    label: "Post-dinner walk",
    description: "20 min walk after your evening meal - helps blood sugar regulation",
    type: "habit",
    completed: false,
  },
  {
    id: "t3",
    label: "Log today's weight",
    description: "Quick morning weigh-in for your weekly trend",
    type: "track",
    completed: true,
  },
  {
    id: "t4",
    label: "Take Vitamin D3",
    description: "2000 IU daily - your level was slightly low (48, target is 50+)",
    type: "habit",
    completed: true,
  },
];

const WEEK_GOALS = [
  { label: "Complete 3 training sessions", progress: 2, total: 3 },
  { label: "Post-meal walks (5 of 7 days)", progress: 4, total: 5 },
  { label: "Log weight 3 times", progress: 2, total: 3 },
  { label: "Take Vitamin D daily", progress: 6, total: 7 },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  exercise: { bg: "#F3EAFF", text: "#B794F6", icon: "dumbbell" },
  habit: { bg: "#E8F8EC", text: "#81C995", icon: "repeat" },
  track: { bg: "#FFF8E6", text: "#F4D47C", icon: "chart" },
  learn: { bg: "#EDE9FE", text: "#9F7AEA", icon: "book" },
};

function TaskIcon({ type }: { type: string }) {
  const color = TYPE_COLORS[type]?.text || "#B794F6";
  if (type === "exercise") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11M6 12h12M17.5 17.5h-11" />
        <rect x="2" y="8" width="4" height="8" rx="1" />
        <rect x="18" y="8" width="4" height="8" rx="1" />
      </svg>
    );
  }
  if (type === "habit") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    );
  }
  if (type === "track") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const lastPoint = points[points.length - 1].split(",");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="3" fill={color} />
    </svg>
  );
}

export default function StageDetailPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState(TODAY_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedToday = tasks.filter((t) => t.completed).length;
  const totalToday = tasks.length;

  const glucoseHistory = getMarkerHistory("f-Glucose");
  const hba1cHistory = getMarkerHistory("HbA1c");
  const latestBio = BIOMETRICS_HISTORY[0];

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Stage header */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "24px 20px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <span
            style={{
              background: "#F3EAFF",
              color: "#B794F6",
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Stage 7 of 10
          </span>
          <span style={{ color: "#8B7B95", fontSize: 12 }}>Weeks 9-12</span>
        </div>
        <h1 style={{ color: "#3D2645", fontSize: 22, fontWeight: 700, margin: "4px 0 8px", letterSpacing: -0.3 }}>
          Deepening Practice
        </h1>
        <p style={{ color: "#8B7B95", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          You've built the foundation. Now we increase intensity, fine-tune nutrition, and start seeing how your markers respond to the work you've put in.
        </p>

        {/* Stage progress */}
        <div style={{ marginTop: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ color: "#8B7B95", fontSize: 12, fontWeight: 500 }}>Week 10 of 12</span>
            <span style={{ color: "#B794F6", fontSize: 12, fontWeight: 600 }}>~75%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#F3EAFF" }}>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "linear-gradient(90deg, #B794F6, #9F7AEA)",
                width: "75%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Today's tasks */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: 0 }}>
            Today's Tasks
          </h2>
          <span
            style={{
              color: completedToday === totalToday ? "#81C995" : "#B794F6",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {completedToday}/{totalToday}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((task) => {
            const typeStyle = TYPE_COLORS[task.type];
            return (
              <div
                key={task.id}
                onClick={() => {
                  if (task.type === "exercise" && !task.completed) {
                    router.push("/smith8/training");
                  } else {
                    toggleTask(task.id);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: task.completed ? "#FDFBFF" : "#FFFFFF",
                  border: task.completed ? "1px solid #EFE6F8" : "1px solid #EFE6F8",
                  cursor: "pointer",
                  opacity: task.completed ? 0.7 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    border: task.completed ? "none" : `2px solid ${typeStyle.text}`,
                    background: task.completed ? "#81C995" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {task.completed && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: task.completed ? "#8B7B95" : "#3D2645",
                      fontSize: 15,
                      fontWeight: 600,
                      margin: "0 0 3px",
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.label}
                  </p>
                  <p style={{ color: "#8B7B95", fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                    {task.description}
                  </p>
                </div>

                {/* Type icon */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: typeStyle.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <TaskIcon type={task.type} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly goals */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>
          This Week's Goals
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {WEEK_GOALS.map((goal) => {
            const pct = Math.round((goal.progress / goal.total) * 100);
            const isComplete = goal.progress >= goal.total;

            return (
              <div key={goal.label}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span style={{ color: "#3D2645", fontSize: 14, fontWeight: 500 }}>
                    {goal.label}
                  </span>
                  <span
                    style={{
                      color: isComplete ? "#81C995" : "#B794F6",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {goal.progress}/{goal.total}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#F3EAFF" }}>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: isComplete
                        ? "#81C995"
                        : "linear-gradient(90deg, #B794F6, #9F7AEA)",
                      width: `${pct}%`,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health markers snapshot */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: 0 }}>
            Health Markers
          </h2>
          <button
            onClick={() => router.push("/smith8/results")}
            style={{
              background: "none",
              border: "none",
              color: "#B794F6",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            View all
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Glucose sparkline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: 14,
              background: "#FDFBFF",
              border: "1px solid #EFE6F8",
            }}
          >
            <div>
              <p style={{ color: "#8B7B95", fontSize: 12, margin: "0 0 2px" }}>Blood sugar (fasting)</p>
              <div className="flex items-baseline gap-1.5">
                <span style={{ color: "#3D2645", fontSize: 20, fontWeight: 700 }}>5.8</span>
                <span style={{ color: "#8B7B95", fontSize: 12 }}>mmol/L</span>
              </div>
              <span style={{ color: "#F4D47C", fontSize: 11, fontWeight: 600 }}>Borderline</span>
            </div>
            <MiniSparkline values={glucoseHistory.map((h) => h.value)} color="#F4D47C" />
          </div>

          {/* HbA1c sparkline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: 14,
              background: "#FDFBFF",
              border: "1px solid #EFE6F8",
            }}
          >
            <div>
              <p style={{ color: "#8B7B95", fontSize: 12, margin: "0 0 2px" }}>Long-term blood sugar (HbA1c)</p>
              <div className="flex items-baseline gap-1.5">
                <span style={{ color: "#3D2645", fontSize: 20, fontWeight: 700 }}>38</span>
                <span style={{ color: "#8B7B95", fontSize: 12 }}>mmol/mol</span>
              </div>
              <span style={{ color: "#81C995", fontSize: 11, fontWeight: 600 }}>Normal</span>
            </div>
            <MiniSparkline values={hba1cHistory.map((h) => h.value)} color="#81C995" />
          </div>

          {/* Weight */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: 14,
              background: "#FDFBFF",
              border: "1px solid #EFE6F8",
            }}
          >
            <div>
              <p style={{ color: "#8B7B95", fontSize: 12, margin: "0 0 2px" }}>Weight</p>
              <div className="flex items-baseline gap-1.5">
                <span style={{ color: "#3D2645", fontSize: 20, fontWeight: 700 }}>{latestBio.weight}</span>
                <span style={{ color: "#8B7B95", fontSize: 12 }}>kg</span>
              </div>
              <span style={{ color: "#8B7B95", fontSize: 11 }}>BMI {latestBio.bmi}</span>
            </div>
            <MiniSparkline
              values={BIOMETRICS_HISTORY.slice().reverse().map((b) => b.weight)}
              color="#B794F6"
            />
          </div>
        </div>
      </div>

      {/* Risk summary */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>
          Your Risk Profile
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              label: "Diabetes risk",
              level: RISK_ASSESSMENTS.diabetes.riskLabel,
              color: "#F4D47C",
              trend: "Glucose rising slowly",
              trendDir: "up",
            },
            {
              label: "Cardiovascular risk",
              level: RISK_ASSESSMENTS.cardiovascular.riskLabel,
              color: "#81C995",
              trend: "Stable, BP controlled",
              trendDir: "flat",
            },
            {
              label: "Bone health risk",
              level: RISK_ASSESSMENTS.bone.riskLabel,
              color: "#81C995",
              trend: "Low risk, Vitamin D improving",
              trendDir: "flat",
            },
          ].map((risk) => (
            <div
              key={risk.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 14,
                background: "#FDFBFF",
                border: "1px solid #EFE6F8",
              }}
            >
              <div>
                <p style={{ color: "#8B7B95", fontSize: 12, margin: "0 0 2px" }}>{risk.label}</p>
                <p style={{ color: "#3D2645", fontSize: 15, fontWeight: 600, margin: "0 0 2px" }}>
                  {risk.level}
                </p>
                <p style={{ color: "#8B7B95", fontSize: 12, margin: 0 }}>{risk.trend}</p>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: risk.color,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Milestone upcoming */}
      <div
        style={{
          background: "linear-gradient(135deg, #F3EAFF, #FDFBFF)",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          padding: "20px",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
        <p style={{ color: "#3D2645", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>
          Next milestone in 2 weeks
        </p>
        <p style={{ color: "#8B7B95", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          Complete Stage 7 and unlock your 6-month check-in. A new blood test will show how your body has responded to training.
        </p>
      </div>

      {/* Doctor note */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
        }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "#F3EAFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B794F6",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            MJ
          </div>
          <div>
            <p style={{ color: "#3D2645", fontSize: 14, fontWeight: 600, margin: 0 }}>
              Dr. Marcus Johansson
            </p>
            <p style={{ color: "#8B7B95", fontSize: 12, margin: 0 }}>Latest note - Mar 28</p>
          </div>
        </div>
        <p style={{ color: "#8B7B95", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          "Your training adherence is strong. The key focus for the next 2 weeks is maintaining consistency and continuing post-meal walks. We'll retest in September to measure progress."
        </p>
        <button
          onClick={() => router.push("/smith8/messages")}
          style={{
            marginTop: 14,
            background: "#F3EAFF",
            border: "none",
            borderRadius: 12,
            padding: "10px 16px",
            color: "#B794F6",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            width: "100%",
          }}
        >
          Message Dr. Johansson
        </button>
      </div>
    </div>
  );
}
