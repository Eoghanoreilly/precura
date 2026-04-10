"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Footprints,
  Sun,
  TestTube,
  Check,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  PATIENT,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// HOW TO BEND THE CURVE
// Everything that can change Anna's trajectory
// ============================================================================

const plan = TRAINING_PLAN;

// The three intervention pillars
const pillars = [
  {
    id: "training",
    title: "Structured training",
    subtitle: "3x per week strength and metabolic conditioning",
    icon: <Dumbbell size={20} />,
    color: "#5c6bc0",
    bg: "#e8eaf6",
    evidence:
      "Resistance training improves insulin sensitivity by 20-40%. Combined with metabolic conditioning, it directly targets your glucose trajectory.",
    status: `Week ${plan.currentWeek} of ${plan.totalWeeks}`,
    progress: Math.round((plan.currentWeek / plan.totalWeeks) * 100),
    actions: [
      {
        label: plan.weeklySchedule[0].day + ": " + plan.weeklySchedule[0].name,
        detail: plan.weeklySchedule[0].exercises
          .map((e) => e.name)
          .join(", "),
      },
      {
        label: plan.weeklySchedule[1].day + ": " + plan.weeklySchedule[1].name,
        detail: plan.weeklySchedule[1].exercises
          .map((e) => e.name)
          .join(", "),
      },
      {
        label: plan.weeklySchedule[2].day + ": " + plan.weeklySchedule[2].name,
        detail: plan.weeklySchedule[2].exercises
          .map((e) => e.name)
          .join(", "),
      },
    ],
  },
  {
    id: "daily",
    title: "Daily movement",
    subtitle: "Post-meal walks and daily step target",
    icon: <Footprints size={20} />,
    color: "#2e7d32",
    bg: "#e8f5e9",
    evidence:
      "A 15-20 minute walk after meals reduces blood sugar spikes by up to 30%. This is the single easiest change with the highest impact on glucose regulation.",
    status: "Build the habit",
    progress: null,
    actions: [
      {
        label: "Walk 15-20 minutes after dinner",
        detail: "Lowers blood sugar when it matters most",
      },
      {
        label: "Aim for 8,000+ steps daily",
        detail: "Improves insulin sensitivity independent of structured exercise",
      },
    ],
  },
  {
    id: "supplements",
    title: "Vitamin D supplementation",
    subtitle: "Your level is below optimal (48 nmol/L, target >50)",
    icon: <Sun size={20} />,
    color: "#e65100",
    bg: "#fff8e1",
    evidence:
      "Low Vitamin D is linked to impaired insulin secretion and increased diabetes risk. Especially important in Sweden where sun exposure is limited 6+ months a year.",
    status: "Start now",
    progress: null,
    actions: [
      {
        label: "Vitamin D3 2000 IU daily",
        detail: "Recommended by Dr. Johansson",
      },
      {
        label: "Retest in September 2026",
        detail: "Target: 75-100 nmol/L",
      },
    ],
  },
];

export default function BendPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link
          href="/smith10"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#f1f3f5",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} color="#555770" />
        </Link>
        <span
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#1a1a2e",
          }}
        >
          How to bend the curve
        </span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Header */}
        <div style={{ padding: "24px 0 4px" }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
              margin: "0 0 8px",
            }}
          >
            The trajectory isn&apos;t fixed.
            <br />
            <span style={{ color: "#2e7d32" }}>
              Here&apos;s what bends it.
            </span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#555770",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Clinical evidence shows lifestyle intervention can reduce type 2
            diabetes risk by 58% in people with your profile. These three things
            have the biggest effect on your glucose trajectory.
          </p>
        </div>

        {/* Mini trajectory preview */}
        <div
          style={{
            margin: "20px 0",
            padding: "14px 18px",
            background: "#f0fdf4",
            borderRadius: 14,
            border: "1px solid #bbdefb",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: "#2e7d32", fontWeight: 600, margin: "0 0 2px" }}>
              Your goal
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 2px" }}>
              Glucose from 5.8 down to 5.4 by September
            </p>
            <p style={{ fontSize: 12, color: "#555770", margin: 0 }}>
              That would be the first time it goes down instead of up
            </p>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "3px solid #2e7d32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#2e7d32",
              }}
            >
              5.4
            </span>
          </div>
        </div>

        {/* Pillars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              {/* Pillar header */}
              <div
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: pillar.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: pillar.color,
                    flexShrink: 0,
                  }}
                >
                  {pillar.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1a1a2e",
                      margin: "0 0 2px",
                    }}
                  >
                    {pillar.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#8b8da3",
                      margin: 0,
                    }}
                  >
                    {pillar.subtitle}
                  </p>
                </div>
                {pillar.progress !== null && (
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: pillar.color,
                        margin: "0 0 2px",
                      }}
                    >
                      {pillar.status}
                    </p>
                    <div
                      style={{
                        width: 60,
                        height: 4,
                        borderRadius: 2,
                        background: "#f1f3f5",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pillar.progress}%`,
                          borderRadius: 2,
                          background: pillar.color,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Evidence */}
              <div
                style={{
                  padding: "0 18px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: "#555770",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {pillar.evidence}
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  borderTop: "1px solid #f0f0f0",
                  padding: "8px 0",
                }}
              >
                {pillar.actions.map((action, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 18px",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `2px solid ${pillar.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                        opacity: 0.5,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1a1a2e",
                          margin: "0 0 1px",
                        }}
                      >
                        {action.label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#8b8da3",
                          margin: 0,
                        }}
                      >
                        {action.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Training plan detail */}
        <div style={{ margin: "28px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8b8da3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            This week&apos;s training
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {plan.weeklySchedule.map((day, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 18px",
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1a1a2e",
                        margin: 0,
                      }}
                    >
                      {day.day}: {day.name}
                    </p>
                  </div>
                  {i < plan.completedThisWeek && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 8px",
                        background: "#e8f5e9",
                        borderRadius: 6,
                      }}
                    >
                      <Check size={12} color="#2e7d32" strokeWidth={3} />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#2e7d32",
                        }}
                      >
                        Done
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                  }}
                >
                  {day.exercises.map((ex, j) => (
                    <div
                      key={j}
                      style={{
                        padding: "6px 10px",
                        background: "#f8f9fa",
                        borderRadius: 8,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1a1a2e",
                          margin: "0 0 1px",
                        }}
                      >
                        {ex.name}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#8b8da3",
                          margin: 0,
                        }}
                      >
                        {ex.sets}x{ex.reps}{" "}
                        {ex.weight ? `@ ${ex.weight}${ex.unit}` : ex.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Medical considerations */}
          <div
            style={{
              margin: "12px 0 0",
              padding: "12px 16px",
              background: "#f8f9fa",
              borderRadius: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#8b8da3",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                margin: "0 0 6px",
              }}
            >
              Medical considerations
            </p>
            {plan.medicalConsiderations.map((note, i) => (
              <p
                key={i}
                style={{
                  fontSize: 12,
                  color: "#555770",
                  margin: i === 0 ? 0 : "4px 0 0",
                  lineHeight: 1.4,
                }}
              >
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* Next blood test */}
        <div
          style={{
            margin: "28px 0 0",
            padding: "20px",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <TestTube
            size={24}
            color="var(--accent)"
            style={{ marginBottom: 8 }}
          />
          <p
            style={{
              fontSize: 12,
              color: "#8b8da3",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 4px",
            }}
          >
            Next checkpoint blood test
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a2e",
              margin: "0 0 4px",
            }}
          >
            September 15, 2026
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#555770",
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            6 months of training and lifestyle changes, then we measure. This is
            how we know if the curve is bending.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Clock size={14} color="#8b8da3" />
            <span style={{ fontSize: 13, color: "#8b8da3" }}>
              ~5 months from now
            </span>
          </div>
        </div>

        {/* Bottom nav */}
        <div
          style={{
            display: "flex",
            gap: 10,
            margin: "24px 0 0",
          }}
        >
          <Link
            href="/smith10/drivers"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "14px",
              background: "#f1f3f5",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              color: "#555770",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} />
            Risk factors
          </Link>
          <Link
            href="/smith10/checkpoint"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "14px",
              background: "#1a1a2e",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Latest results
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
