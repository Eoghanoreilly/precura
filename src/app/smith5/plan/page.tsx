"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Dumbbell,
  FlaskConical,
  Footprints,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Heart,
  Shield,
  Pill,
  Sun,
} from "lucide-react";
import {
  PATIENT,
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
} from "@/lib/v2/mock-patient";

const PURPLE = {
  deep: "#4a148c",
  primary: "#6a1b9a",
  mid: "#8e24aa",
  light: "#ce93d8",
  pale: "#f3e5f5",
  wash: "#faf5ff",
  accent: "#7c4dff",
};

// The prevention plan - tying training, testing, and habits to pattern-breaking
const PREVENTION_PILLARS = [
  {
    id: "training",
    name: "Strength + Movement",
    icon: Dumbbell,
    color: "#2e7d32",
    bgColor: "#e8f5e9",
    whyItBreaks: "Strength training directly improves how your body uses insulin. Each session makes your muscles better at absorbing blood sugar. This is the single most powerful tool against the diabetes pattern.",
    status: "Week 10 of 12",
    progress: 83,
    details: TRAINING_PLAN.weeklySchedule,
    medicalNotes: TRAINING_PLAN.medicalConsiderations,
  },
  {
    id: "testing",
    name: "Blood Monitoring",
    icon: FlaskConical,
    color: "#1565c0",
    bgColor: "#e3f2fd",
    whyItBreaks: "Your grandmother and mother never tracked their blood sugar regularly. By the time they were diagnosed, the damage was done. Regular testing catches the trend early - while you can still change it.",
    status: "Next test: Sep 2026",
    progress: 50,
    schedule: [
      { test: "Comprehensive blood panel", frequency: "Every 6 months", next: "September 2026", why: "Track glucose trend, HbA1c, cholesterol" },
      { test: "HbA1c (long-term blood sugar)", frequency: "Every 6 months", next: "September 2026", why: "Shows 3-month average - the most reliable diabetes indicator" },
      { test: "Blood pressure check", frequency: "Monthly (self)", next: "Ongoing", why: "Hypertension runs in both sides of your family" },
    ],
  },
  {
    id: "habits",
    name: "Daily Habits",
    icon: Footprints,
    color: "#e65100",
    bgColor: "#fff3e0",
    whyItBreaks: "The small daily choices compound. A 20-minute walk after dinner lowers blood sugar for hours. Consistent sleep regulates hormones. These aren't dramatic - they're steady. Like a river changing its course.",
    status: "Building habits",
    progress: 60,
    habits: [
      { name: "Post-dinner walk (20 min)", why: "Lowers blood sugar by 20-30% after meals", frequency: "Daily", impact: "high" as const },
      { name: "Vitamin D3 supplement", why: "Low vitamin D linked to insulin resistance. You are at 48, target is 50+", frequency: "Daily (2000 IU)", impact: "medium" as const },
      { name: "10,000 steps", why: "Overall daily movement keeps metabolism active", frequency: "Daily target", impact: "medium" as const },
      { name: "7-8 hours sleep", why: "Poor sleep increases insulin resistance by up to 30%", frequency: "Nightly", impact: "high" as const },
    ],
  },
  {
    id: "medication",
    name: "Medical Support",
    icon: Pill,
    color: "#00695c",
    bgColor: "#e0f2f1",
    whyItBreaks: "Your blood pressure medication (Enalapril) is already breaking one pattern - your father wasn't treated until age 50. Your early treatment is a significant head start.",
    status: "On track",
    progress: 90,
    medications: [
      { name: "Enalapril 5mg", purpose: "Blood pressure control", frequency: "Once daily", patternLink: "Father's hypertension wasn't treated until 50. You started at 37." },
      { name: "Vitamin D3 2000 IU", purpose: "Supplement (recommended by Dr. Johansson)", frequency: "Once daily", patternLink: "Supports insulin sensitivity" },
    ],
  },
];

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof PREVENTION_PILLARS)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${300 + index * 150}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            padding: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: pillar.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <pillar.icon size={22} style={{ color: pillar.color }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
                {pillar.name}
              </div>
              <ChevronDown
                size={18}
                style={{
                  color: "var(--text-muted)",
                  transform: expanded ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: pillar.color, fontWeight: 600, marginTop: 2 }}>
              {pillar.status}
            </div>
            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: 4,
                borderRadius: 2,
                background: "#f0f0f0",
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pillar.progress}%`,
                  height: "100%",
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${pillar.color}, ${pillar.color}88)`,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: 16,
              background: "#fafafa",
            }}
          >
            {/* Why it breaks the pattern */}
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${PURPLE.pale}, #fff)`,
                border: `1px solid ${PURPLE.light}`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: PURPLE.deep,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                How this breaks the pattern
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {pillar.whyItBreaks}
              </div>
            </div>

            {/* Training details */}
            {pillar.id === "training" && pillar.details && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>
                  This week's sessions
                </div>
                {pillar.details.map((day, i) => (
                  <div
                    key={day.day}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "white",
                      border: "1px solid #eee",
                      marginBottom: i < pillar.details!.length - 1 ? 8 : 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                          {day.day} - {day.name}
                        </div>
                      </div>
                      {i < (TRAINING_PLAN.completedThisWeek ?? 0) ? (
                        <CheckCircle2 size={18} style={{ color: "#4caf50" }} />
                      ) : (
                        <Circle size={18} style={{ color: "#e0e0e0" }} />
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {day.exercises.map((ex) => (
                        <div
                          key={ex.name}
                          style={{
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{ex.name}</span>
                          <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                            {ex.sets}x{ex.reps} {ex.weight ? `@ ${ex.weight}${ex.unit}` : ex.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Medical considerations */}
                {pillar.medicalNotes && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                      Medical considerations
                    </div>
                    {pillar.medicalNotes.map((note) => (
                      <div
                        key={note}
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          lineHeight: 1.4,
                          padding: "4px 0",
                          paddingLeft: 10,
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: "var(--text-muted)",
                          }}
                        >
                          -
                        </span>
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Testing schedule */}
            {pillar.id === "testing" && pillar.schedule && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pillar.schedule.map((test) => (
                  <div
                    key={test.test}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "white",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
                      {test.test}
                    </div>
                    <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                      <div style={{ fontSize: 11, color: "#1565c0" }}>
                        <Calendar size={10} style={{ display: "inline", marginRight: 3 }} />
                        {test.frequency}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        Next: {test.next}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      {test.why}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily habits */}
            {pillar.id === "habits" && pillar.habits && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pillar.habits.map((habit) => (
                  <div
                    key={habit.name}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "white",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                        {habit.name}
                      </div>
                      <div
                        style={{
                          padding: "2px 8px",
                          borderRadius: 8,
                          fontSize: 9,
                          fontWeight: 600,
                          background: habit.impact === "high" ? "#fff3e0" : "#f5f5f5",
                          color: habit.impact === "high" ? "#e65100" : "var(--text-muted)",
                        }}
                      >
                        {habit.impact} impact
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 4 }}>
                      {habit.why}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {habit.frequency}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medications */}
            {pillar.id === "medication" && pillar.medications && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pillar.medications.map((med) => (
                  <div
                    key={med.name}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: "white",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
                      {med.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 2 }}>
                      {med.purpose} - {med.frequency}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: PURPLE.primary,
                        fontStyle: "italic",
                        marginTop: 6,
                        paddingTop: 6,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      Pattern link: {med.patternLink}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WeeklyOverview() {
  const totalSessions = 3;
  const completed = TRAINING_PLAN.completedThisWeek;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "200ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, #e8f5e9, #f1f8e9)`,
          borderRadius: 16,
          padding: 16,
          border: "1px solid #c8e6c9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2e7d32" }}>
              This week
            </div>
            <div style={{ fontSize: 12, color: "#33691e" }}>
              Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#2e7d32" }}>
              {completed}/{totalSessions}
            </div>
            <div style={{ fontSize: 10, color: "#558b2f" }}>sessions done</div>
          </div>
        </div>

        {/* Session dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {TRAINING_PLAN.weeklySchedule.map((day, i) => (
            <div
              key={day.day}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 10,
                background: i < completed ? "#4caf50" : "rgba(255,255,255,0.7)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: i < completed ? "white" : "#558b2f",
                }}
              >
                {day.day.slice(0, 3)}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: i < completed ? "rgba(255,255,255,0.8)" : "#689f38",
                  marginTop: 1,
                }}
              >
                {day.name}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "#33691e",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {TRAINING_PLAN.totalCompleted} total sessions completed since January
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ background: PURPLE.wash, minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/smith5"
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            Your Prevention Plan
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            The tools to break the pattern
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Hero */}
        <div
          className="animate-fade-in"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            Your plan to
            <br />
            <span style={{ color: "#2e7d32" }}>change the outcome</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Every pillar is designed around one goal: making sure your health story
            ends differently than your family's.
          </div>
        </div>

        {/* Weekly overview */}
        <WeeklyOverview />

        {/* Doctor attribution */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "250ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 12,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Shield size={16} style={{ color: PURPLE.primary, flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Training plan by <strong>{TRAINING_PLAN.createdBy}</strong>, reviewed by{" "}
              <strong>{TRAINING_PLAN.reviewedBy}</strong>. Designed for your metabolic health goals.
            </div>
          </div>
        </div>

        {/* Prevention pillars */}
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Four pillars of prevention
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PREVENTION_PILLARS.map((pillar, i) => (
              <PillarCard key={pillar.id} pillar={pillar} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "1000ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 24,
          }}
        >
          <Link href="/smith5/progress" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${PURPLE.primary}, ${PURPLE.accent})`,
                borderRadius: 14,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "white",
                boxShadow: `0 4px 16px rgba(106, 27, 154, 0.3)`,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  See your progress
                </div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  How your numbers compare to family trajectory
                </div>
              </div>
              <ChevronRight size={20} style={{ opacity: 0.7 }} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
