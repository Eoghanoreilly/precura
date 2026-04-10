"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Dumbbell, ChevronDown, CheckCircle,
  AlertTriangle, Clock, Target, Activity, Shield,
  Calendar,
} from "lucide-react";
import {
  TRAINING_PLAN, RISK_ASSESSMENTS,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function TrainingPage() {
  const [expandedDay, setExpandedDay] = useState<string | null>(TRAINING_PLAN.weeklySchedule[0].day);
  const plan = TRAINING_PLAN;
  const progressPercent = (plan.currentWeek / plan.totalWeeks) * 100;
  const thisWeekPercent = (plan.completedThisWeek / 3) * 100;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248, 249, 250, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Link href="/smith9" style={{
            width: 36, height: 36, borderRadius: 12,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{plan.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Week {plan.currentWeek} of {plan.totalWeeks}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Program Overview */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
          padding: 24, marginBottom: 16, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, #3730a3, #6366f1, #818cf8)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Dumbbell size={18} style={{ color: "#3730a3" }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{plan.name}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Created by</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{plan.createdBy}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Reviewed by</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{plan.reviewedBy}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Started</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{formatDate(plan.startDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Goal</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{plan.goal}</div>
            </div>
          </div>

          {/* Progress stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{
              textAlign: "center", padding: "12px 0", borderRadius: 12,
              background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#3730a3" }}>{plan.currentWeek}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>of {plan.totalWeeks} weeks</div>
            </div>
            <div style={{
              textAlign: "center", padding: "12px 0", borderRadius: 12,
              background: "var(--green-bg)",
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--green-text)" }}>{plan.totalCompleted}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>sessions done</div>
            </div>
            <div style={{
              textAlign: "center", padding: "12px 0", borderRadius: 12,
              background: "var(--amber-bg)",
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--amber-text)" }}>{plan.completedThisWeek}/3</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>this week</div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Program progress</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#3730a3" }}>{Math.round(progressPercent)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--bg-elevated)" }}>
              <div style={{
                height: 8, borderRadius: 4,
                background: "linear-gradient(90deg, #3730a3, #6366f1)",
                width: `${progressPercent}%`,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            Weekly Schedule
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {plan.weeklySchedule.map((day) => {
              const isExpanded = expandedDay === day.day;
              const totalSets = day.exercises.reduce((sum, e) => sum + e.sets, 0);

              return (
                <div key={day.day} style={{
                  background: "var(--bg-card)", borderRadius: 16,
                  border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}>
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    style={{
                      width: "100%", background: "none", border: "none",
                      padding: "16px 18px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 14,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Dumbbell size={18} style={{ color: "#3730a3" }} />
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{day.day}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {day.name} - {day.exercises.length} exercises, {totalSets} sets
                      </div>
                    </div>
                    <ChevronDown size={16} style={{
                      color: "var(--text-muted)",
                      transform: isExpanded ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }} />
                  </button>

                  {isExpanded && (
                    <div style={{
                      padding: "0 18px 18px",
                      borderTop: "1px solid var(--divider)",
                    }}>
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                        {day.exercises.map((exercise, idx) => (
                          <div key={idx} style={{
                            display: "flex", alignItems: "flex-start", gap: 12,
                            padding: "12px 14px", borderRadius: 12,
                            background: "var(--bg-elevated)",
                          }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8,
                              background: "#3730a3", display: "flex",
                              alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
                            }}>
                              {idx + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                                {exercise.name}
                              </div>
                              <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                                  {exercise.sets} sets x {exercise.reps} {exercise.unit}
                                </span>
                                {exercise.weight && (
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#3730a3" }}>
                                    {exercise.weight} {exercise.unit === "kg" ? "kg" : "kg"}
                                  </span>
                                )}
                              </div>
                              {exercise.notes && (
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>
                                  {exercise.notes}
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
        </div>

        {/* Medical Considerations */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 20px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Shield size={15} style={{ color: "var(--amber-text)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Medical Considerations</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {plan.medicalConsiderations.map((note, i) => (
              <div key={i} style={{
                display: "flex", gap: 10,
                padding: "10px 14px", borderRadius: 10,
                background: "var(--amber-bg)",
              }}>
                <AlertTriangle size={14} style={{ color: "var(--amber-text)", flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: "var(--amber-text)", lineHeight: 1.5, margin: 0 }}>
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Training Impact on Risk */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Target size={15} style={{ color: "#3730a3" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Training Impact on Your Risk Factors</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                factor: "Insulin Sensitivity (Diabetes Risk)",
                impact: "high",
                desc: "Resistance training and post-meal walks directly improve how your body uses insulin. This targets your primary risk factor.",
              },
              {
                factor: "Blood Pressure",
                impact: "medium",
                desc: "Regular exercise helps maintain blood pressure control alongside your Enalapril medication.",
              },
              {
                factor: "Body Composition",
                impact: "medium",
                desc: "Strength training increases lean muscle mass, which improves metabolism and helps with weight management.",
              },
              {
                factor: "Cardiovascular Fitness",
                impact: "medium",
                desc: "The walk intervals and full-body cardio days strengthen your heart, reducing your cardiovascular risk.",
              },
              {
                factor: "Core Stability (Back Health)",
                impact: "high",
                desc: "Core-focused exercises address your history of lower back strain and prevent recurrence.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "12px 14px", borderRadius: 12,
                background: "var(--bg-elevated)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.factor}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 8px",
                    borderRadius: 5,
                    background: item.impact === "high" ? "var(--green-bg)" : "var(--blue-bg)",
                    color: item.impact === "high" ? "var(--green-text)" : "var(--blue-text)",
                    textTransform: "uppercase",
                  }}>
                    {item.impact} impact
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
