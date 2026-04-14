"use client";

import Link from "next/link";
import {
  PATIENT,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Dr. Johansson's Prescription
// Training plan prescribed through the doctor. Medical framing.
// Real exercises with sets, reps, weights. Not a step counter.
// ============================================================================

export default function PrescriptionPage() {
  const plan = TRAINING_PLAN;
  const progressPct = Math.round(
    (plan.totalCompleted / (plan.totalWeeks * plan.weeklySchedule.length)) * 100
  );
  const thisWeekPct = Math.round(
    (plan.completedThisWeek / plan.weeklySchedule.length) * 100
  );

  return (
    <div
      style={{
        background: "#F5F1E8",
        color: "#2C2416",
        minHeight: "100dvh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#F5F1E8",
          borderBottom: "1px solid #E8DFD3",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "14px 20px",
          }}
        >
          <Link
            href="/smith2"
            style={{
              textDecoration: "none",
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            &lsaquo; Home
          </Link>
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 16,
              fontWeight: 700,
              color: "#2C2416",
            }}
          >
            Precura
          </span>
          <div style={{ width: 40 }} />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {/* Page title */}
        <div style={{ paddingTop: 24, paddingBottom: 4 }}>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 24,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Dr. Johansson's Prescription
          </h1>
          <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 4 }}>
            Your personalized training program
          </p>
        </div>

        {/* ================================================================
            PROGRAM OVERVIEW
            ================================================================ */}
        <div
          style={{
            background: "#FBF9F6",
            border: "1px solid #E8DFD3",
            borderRadius: 8,
            padding: "20px",
            marginTop: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 4,
            }}
          >
            {plan.name}
          </h2>
          <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginBottom: 16 }}>
            {plan.goal}
          </p>

          {/* Credits */}
          <div className="flex flex-col" style={{ gap: 6, marginBottom: 16 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 12, color: "#6B5D52" }}>Written by:</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2C2416" }}>{plan.createdBy}</span>
            </div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 12, color: "#6B5D52" }}>Reviewed by:</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2C2416" }}>{plan.reviewedBy}</span>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 8 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#2C2416" }}>
                Week {plan.currentWeek} of {plan.totalWeeks}
              </span>
              <span style={{ fontSize: 12, color: "#6B5D52" }}>
                {plan.totalCompleted} sessions completed
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "#E8DFD3",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "#7FA876",
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* This week */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 12, color: "#6B5D52" }}>This week</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#7FA876" }}>
              {plan.completedThisWeek} of {plan.weeklySchedule.length} sessions done
            </span>
          </div>
        </div>

        {/* ================================================================
            WEEKLY SCHEDULE - The actual workouts
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            This week's sessions
          </h2>

          {plan.weeklySchedule.map((day, dayIndex) => {
            const isCompleted = dayIndex < plan.completedThisWeek;
            const isNext = dayIndex === plan.completedThisWeek;

            return (
              <div
                key={day.day}
                style={{
                  background: "#FBF9F6",
                  border: isNext ? "2px solid #C97D5C" : "1px solid #E8DFD3",
                  borderRadius: 8,
                  padding: "18px 20px",
                  marginBottom: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  opacity: isCompleted ? 0.65 : 1,
                }}
              >
                {/* Day header */}
                <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                  <div>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#2C2416", margin: 0 }}>
                        {day.day}
                      </p>
                      {isCompleted && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: "#E8F5E9",
                            color: "#7FA876",
                            padding: "2px 6px",
                            borderRadius: 3,
                          }}
                        >
                          DONE
                        </span>
                      )}
                      {isNext && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: "#FFF3E0",
                            color: "#C97D5C",
                            padding: "2px 6px",
                            borderRadius: 3,
                          }}
                        >
                          UP NEXT
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                      {day.name}
                    </p>
                  </div>
                  <p style={{ fontSize: 12, color: "#6B5D52", margin: 0 }}>
                    {day.exercises.length} exercises
                  </p>
                </div>

                {/* Exercises */}
                <div className="flex flex-col" style={{ gap: 0 }}>
                  {day.exercises.map((ex, exIndex) => (
                    <div key={exIndex}>
                      {exIndex > 0 && (
                        <div
                          style={{
                            borderTop: "1px solid #E8DFD3",
                            margin: "10px 0",
                          }}
                        />
                      )}
                      <div className="flex items-start justify-between">
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                            {ex.name}
                          </p>
                          {ex.notes && (
                            <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2, fontStyle: "italic" }}>
                              {ex.notes}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: "right" as const, flexShrink: 0, marginLeft: 12 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                            {ex.sets} x {ex.reps}
                            {ex.weight ? ` @ ${ex.weight}${ex.unit === "kg" ? "kg" : ""}` : ""}
                          </p>
                          <p style={{ fontSize: 11, color: "#6B5D52", margin: 0, marginTop: 1 }}>
                            {ex.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================
            MEDICAL CONSIDERATIONS
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Medical considerations
          </h2>

          <div
            style={{
              background: "#FBF9F6",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginBottom: 12 }}>
              Dr. Johansson has reviewed this program with your medical history in mind
            </p>

            <div className="flex flex-col" style={{ gap: 10 }}>
              {plan.medicalConsiderations.map((consideration, i) => (
                <div key={i} className="flex items-start" style={{ gap: 10 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#C97D5C",
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: "#2C2416", margin: 0 }}>
                    {consideration}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            WHY THIS PROGRAM
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              background: "#FBF9F6",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FBF9F6",
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                MJ
              </div>
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#2C2416",
                  margin: 0,
                }}
              >
                Why this program
              </p>
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#2C2416", margin: 0 }}>
              Your training plan targets the specific risk factors we identified in your assessment.
              With a moderate diabetes risk and glucose trending upward, resistance training combined
              with structured cardio is one of the most effective interventions. Studies show that
              3 sessions per week of mixed resistance and aerobic training can improve insulin
              sensitivity by 20-30% within 12 weeks. Combined with post-meal walks, this gives
              your body the best chance of reversing the glucose trend.
            </p>

            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid #E8DFD3",
              }}
            >
              <Link
                href="/smith2/messages"
                style={{
                  color: "#C97D5C",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Ask Dr. Johansson about your program &rsaquo;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom nav back */}
        <div style={{ marginTop: 32, textAlign: "center" as const }}>
          <Link
            href="/smith2"
            style={{
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            &lsaquo; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
