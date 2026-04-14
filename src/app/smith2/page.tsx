"use client";

import Link from "next/link";
import {
  PATIENT,
  DOCTOR_NOTES,
  MESSAGES,
  BLOOD_TEST_HISTORY,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Home - "Your Doctor, Always"
// The doctor's latest note is the hero. Everything flows from the relationship.
// ============================================================================

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function SmithTwoHome() {
  const latestNote = DOCTOR_NOTES[0];
  const latestMessage = MESSAGES[MESSAGES.length - 1];
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1];
  const previousGlucose = glucoseHistory[glucoseHistory.length - 2];

  // Parse doctor note into paragraphs for display
  const noteParagraphs = latestNote.note.split("\n\n");

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
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 20,
              fontWeight: 700,
              color: "#2C2416",
              letterSpacing: "-0.3px",
            }}
          >
            Precura
          </span>
          <div
            className="flex items-center"
            style={{ gap: 8 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#C97D5C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FBF9F6",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {PATIENT.firstName[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {/* Greeting */}
        <div style={{ paddingTop: 28, paddingBottom: 4 }}>
          <p
            style={{
              color: "#6B5D52",
              fontSize: 14,
              margin: 0,
              marginBottom: 2,
            }}
          >
            {getGreeting()}, {PATIENT.firstName}
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 26,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.3px",
            }}
          >
            Your Doctor, Always
          </h1>
        </div>

        {/* ================================================================
            HERO: Doctor's Latest Note
            This IS the app. The doctor's thinking, visible to the patient.
            ================================================================ */}
        <div
          style={{
            background: "#FBF9F6",
            border: "1px solid #E8DFD3",
            borderRadius: 8,
            padding: "24px 20px",
            marginTop: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Doctor identity */}
          <div className="flex items-center" style={{ gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FBF9F6",
                fontSize: 15,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              MJ
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#2C2416",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Dr. Marcus Johansson
              </p>
              <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 1 }}>
                {latestNote.type} - {formatDate(latestNote.date)}
              </p>
            </div>
          </div>

          {/* Note content - the actual clinical thinking */}
          <div style={{ marginBottom: 16 }}>
            {noteParagraphs.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "#2C2416",
                  margin: 0,
                  marginBottom: i < noteParagraphs.length - 1 ? 14 : 0,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Action from the note */}
          <div
            style={{
              borderTop: "1px solid #E8DFD3",
              paddingTop: 14,
              marginTop: 16,
            }}
          >
            <Link
              href="/smith2/assessment"
              className="flex items-center justify-between"
              style={{
                textDecoration: "none",
                color: "#C97D5C",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <span>View Dr. Johansson's full assessment</span>
              <span style={{ fontSize: 18 }}>&rsaquo;</span>
            </Link>
          </div>
        </div>

        {/* ================================================================
            GLUCOSE SPOTLIGHT
            The one number that matters most right now, in context.
            ================================================================ */}
        <div
          style={{
            background: "#FBF9F6",
            border: "1px solid #E8DFD3",
            borderRadius: 8,
            padding: "20px",
            marginTop: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.5px", fontWeight: 600 }}>
                Key marker
              </p>
              <p style={{ fontSize: 14, color: "#2C2416", margin: 0, fontWeight: 600 }}>
                Fasting Glucose (blood sugar)
              </p>
            </div>
            <div
              style={{
                background: "#FFF3E0",
                color: "#E8A856",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 4,
              }}
            >
              WATCH
            </div>
          </div>

          {/* Trend visualization - simple inline sparkline */}
          <div className="flex items-end" style={{ gap: 16, marginTop: 16, marginBottom: 8 }}>
            <div>
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#2C2416",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {latestGlucose?.value}
              </p>
              <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                mmol/L
              </p>
            </div>

            {/* Mini trend line */}
            <div className="flex items-end" style={{ gap: 3, flex: 1, height: 48 }}>
              {glucoseHistory.map((point, i) => {
                const minVal = 4.8;
                const maxVal = 6.2;
                const heightPct = ((point.value - minVal) / (maxVal - minVal)) * 100;
                const isLast = i === glucoseHistory.length - 1;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ flex: 1 }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 28,
                        height: `${Math.max(heightPct, 10)}%`,
                        minHeight: 6,
                        background: isLast ? "#E8A856" : "#E8DFD3",
                        borderRadius: 3,
                        transition: "height 0.3s ease",
                      }}
                    />
                    <p style={{ fontSize: 10, color: isLast ? "#E8A856" : "#6B5D52", margin: 0, marginTop: 4 }}>
                      {point.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, lineHeight: 1.5 }}>
            Rising from {glucoseHistory[0]?.value} to {latestGlucose?.value} over 5 years.
            Still within normal range (3.9-6.0) but trending toward the upper limit.
            {previousGlucose && ` Up ${(latestGlucose.value - previousGlucose.value).toFixed(1)} since last test.`}
          </p>

          <Link
            href="/smith2/assessment"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 13,
              color: "#C97D5C",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            See all blood markers &rsaquo;
          </Link>
        </div>

        {/* ================================================================
            LATEST MESSAGE - Quick peek at the conversation
            ================================================================ */}
        <div
          style={{
            background: "#FBF9F6",
            border: "1px solid #E8DFD3",
            borderRadius: 8,
            padding: "20px",
            marginTop: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <p
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 16,
                fontWeight: 700,
                color: "#2C2416",
                margin: 0,
              }}
            >
              Messages
            </p>
            <p style={{ fontSize: 12, color: "#6B5D52", margin: 0 }}>
              {formatDate(latestMessage.date.split("T")[0])}
            </p>
          </div>

          <div className="flex items-start" style={{ gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: latestMessage.from === "doctor"
                  ? "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)"
                  : "#C97D5C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FBF9F6",
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {latestMessage.from === "doctor" ? "MJ" : PATIENT.firstName[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#6B5D52", margin: 0, marginBottom: 3 }}>
                {latestMessage.from === "doctor" ? "Dr. Johansson" : "You"}
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "#2C2416",
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                }}
              >
                {latestMessage.text}
              </p>
            </div>
          </div>

          <Link
            href="/smith2/messages"
            className="flex items-center justify-between"
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid #E8DFD3",
              textDecoration: "none",
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>Message Dr. Johansson</span>
            <span style={{ fontSize: 18 }}>&rsaquo;</span>
          </Link>
        </div>

        {/* ================================================================
            NAVIGATION THROUGH THE DOCTOR
            Not tabs. Contextual links that frame everything as the doctor's work.
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <p
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Your care
          </p>

          {/* Assessment card */}
          <Link
            href="/smith2/assessment"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#FBF9F6",
                border: "1px solid #E8DFD3",
                borderRadius: 8,
                padding: "18px 20px",
                marginBottom: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                    Dr. Johansson's assessment
                  </p>
                  <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 3 }}>
                    Blood markers, risk factors, health trajectory
                  </p>
                </div>
                <div className="flex items-center" style={{ gap: 8 }}>
                  {/* Risk badges */}
                  <div
                    style={{
                      background: "#FFF3E0",
                      color: "#E8A856",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {RISK_ASSESSMENTS.diabetes.riskLabel}
                  </div>
                  <span style={{ color: "#6B5D52", fontSize: 18 }}>&rsaquo;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Prescription (training) card */}
          <Link
            href="/smith2/prescription"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#FBF9F6",
                border: "1px solid #E8DFD3",
                borderRadius: 8,
                padding: "18px 20px",
                marginBottom: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                    Dr. Johansson's prescription
                  </p>
                  <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 3 }}>
                    {TRAINING_PLAN.name} - week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
                  </p>
                </div>
                <div className="flex items-center" style={{ gap: 8 }}>
                  <div
                    style={{
                      background: "#E8F5E9",
                      color: "#7FA876",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {TRAINING_PLAN.completedThisWeek}/{TRAINING_PLAN.weeklySchedule.length} this week
                  </div>
                  <span style={{ color: "#6B5D52", fontSize: 18 }}>&rsaquo;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* History card */}
          <Link
            href="/smith2/history"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#FBF9F6",
                border: "1px solid #E8DFD3",
                borderRadius: 8,
                padding: "18px 20px",
                marginBottom: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                    Your health history
                  </p>
                  <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 3 }}>
                    {BLOOD_TEST_HISTORY.length} blood tests, {8} visits over 5 years
                  </p>
                </div>
                <span style={{ color: "#6B5D52", fontSize: 18 }}>&rsaquo;</span>
              </div>
            </div>
          </Link>
        </div>

        {/* ================================================================
            NEXT STEPS - What the doctor has planned
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <p
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Coming up
          </p>

          <div
            style={{
              background: "#FBF9F6",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex flex-col" style={{ gap: 16 }}>
              {/* Next blood test */}
              <div className="flex items-start" style={{ gap: 14 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#F5F1E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 16 }}>&#128300;</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                    Next blood test
                  </p>
                  <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                    September 2026 - ordered by Dr. Johansson to recheck glucose trend
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E8DFD3" }} />

              {/* Vitamin D */}
              <div className="flex items-start" style={{ gap: 14 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#F5F1E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 16 }}>&#9728;&#65039;</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                    Vitamin D supplement
                  </p>
                  <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                    Dr. Johansson recommends D3 2000 IU daily - your level is slightly low (48, target is 50+)
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E8DFD3" }} />

              {/* Training plan ending */}
              <div className="flex items-start" style={{ gap: 14 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#F5F1E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 16 }}>&#127947;&#65039;</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                    Training plan review
                  </p>
                  <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                    {TRAINING_PLAN.totalWeeks - TRAINING_PLAN.currentWeek} weeks remaining -
                    Dr. Johansson will review progress and update your program
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            MEMBERSHIP FOOTER
            ================================================================ */}
        <div
          style={{
            marginTop: 32,
            padding: "16px 0",
            textAlign: "center" as const,
          }}
        >
          <p style={{ fontSize: 12, color: "#6B5D52", margin: 0 }}>
            Precura member since {formatDate(PATIENT.memberSince)}
          </p>
          <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2 }}>
            Annual plan - {PATIENT.membershipPrice.toLocaleString()} SEK/year
          </p>
        </div>
      </div>
    </div>
  );
}
