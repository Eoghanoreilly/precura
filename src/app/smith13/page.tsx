"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PATIENT,
  RISK_ASSESSMENTS,
  BLOOD_TEST_HISTORY,
  BIOMETRICS_HISTORY,
  TRAINING_PLAN,
  SCREENING_SCORES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* ================================================================
   Activity Ring - SVG concentric circle with stroke animation
   ================================================================ */
function ActivityRing({
  radius,
  stroke,
  progress,
  color,
  label,
  value,
  delay,
}: {
  radius: number;
  stroke: number;
  progress: number;
  color: string;
  label: string;
  value: string;
  delay: number;
}) {
  const [animProgress, setAnimProgress] = useState(0);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimProgress(progress), delay);
    return () => clearTimeout(timer);
  }, [progress, delay]);

  return (
    <g>
      {/* Background track */}
      <circle
        cx="110"
        cy="110"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        opacity={0.2}
      />
      {/* Progress arc */}
      <circle
        cx="110"
        cy="110"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 110 110)"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
    </g>
  );
}

/* ================================================================
   Mini Sparkline SVG
   ================================================================ */
function Sparkline({
  data,
  color,
  width = 80,
  height = 28,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const lastPoint = points[points.length - 1].split(",");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={`url(#spark-${color.replace("#", "")})`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r={3}
        fill={color}
      />
    </svg>
  );
}

/* ================================================================
   Gradient Card
   ================================================================ */
function GradientCard({
  gradient,
  children,
  href,
}: {
  gradient: string;
  children: React.ReactNode;
  href?: string;
}) {
  const card = (
    <div
      className="relative overflow-hidden"
      style={{
        background: gradient,
        borderRadius: 22,
        padding: "20px 20px 18px",
        minHeight: 140,
      }}
    >
      {children}
    </div>
  );
  if (href) {
    return <Link href={href} style={{ textDecoration: "none", display: "block" }}>{card}</Link>;
  }
  return card;
}

/* ================================================================
   Page Component
   ================================================================ */
export default function SummaryPage() {
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const latestBio = BIOMETRICS_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const cholesterolHistory = getMarkerHistory("TC");
  const latestGlucose = latestBlood.results.find((r) => r.shortName === "f-Glucose");
  const latestHbA1c = latestBlood.results.find((r) => r.shortName === "HbA1c");
  const latestCholesterol = latestBlood.results.find((r) => r.shortName === "TC");

  // Ring data: Metabolic (diabetes risk inverted), Cardiovascular, Lifestyle (training)
  const metabolicScore = 62; // 100 - moderate risk
  const cardioScore = 78; // low-moderate = good
  const lifestyleScore = Math.round(
    (TRAINING_PLAN.completedThisWeek / TRAINING_PLAN.weeklySchedule.length) * 100
  );

  return (
    <div className="px-5 pb-8">
      {/* Greeting */}
      <div className="mb-6 mt-2">
        <p
          style={{
            color: "#98989D",
            fontSize: 15,
            fontWeight: 400,
            margin: 0,
            marginBottom: 2,
          }}
        >
          Wednesday, April 9
        </p>
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Hi, {PATIENT.firstName}
        </p>
      </div>

      {/* ================================
          Activity Rings Section
          ================================ */}
      <div
        style={{
          background: "#1C1C1E",
          borderRadius: 22,
          padding: "24px 20px",
          marginBottom: 16,
        }}
      >
        <div className="flex items-center gap-5">
          {/* Rings SVG */}
          <div style={{ width: 140, height: 140, flexShrink: 0 }}>
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ width: 140, height: 140 }}>
              <ActivityRing
                radius={95}
                stroke={16}
                progress={metabolicScore}
                color="#FF2D55"
                label="Metabolic"
                value={`${metabolicScore}%`}
                delay={100}
              />
              <ActivityRing
                radius={75}
                stroke={16}
                progress={cardioScore}
                color="#30D158"
                label="Cardio"
                value={`${cardioScore}%`}
                delay={300}
              />
              <ActivityRing
                radius={55}
                stroke={16}
                progress={lifestyleScore}
                color="#0A84FF"
                label="Lifestyle"
                value={`${lifestyleScore}%`}
                delay={500}
              />
            </svg>
          </div>

          {/* Ring labels */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF2D55" }} />
                <span style={{ color: "#98989D", fontSize: 13, fontWeight: 500 }}>METABOLIC</span>
              </div>
              <span style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>{metabolicScore}%</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#30D158" }} />
                <span style={{ color: "#98989D", fontSize: 13, fontWeight: 500 }}>CARDIO</span>
              </div>
              <span style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>{cardioScore}%</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0A84FF" }} />
                <span style={{ color: "#98989D", fontSize: 13, fontWeight: 500 }}>LIFESTYLE</span>
              </div>
              <span style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>{lifestyleScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================
          Glucose Alert Card
          ================================ */}
      <GradientCard
        gradient="linear-gradient(135deg, #1C1C1E 0%, #2C1520 100%)"
        href="/smith13/blood-tests"
      >
        <div className="flex items-start justify-between">
          <div>
            <p style={{ color: "#FF2D55", fontSize: 13, fontWeight: 600, margin: 0, marginBottom: 4, letterSpacing: "0.02em" }}>
              NEEDS ATTENTION
            </p>
            <p style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700, margin: 0, marginBottom: 2 }}>
              Blood Sugar (Fasting)
            </p>
            <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginBottom: 12 }}>
              Trending up over 5 years
            </p>
          </div>
          <Sparkline
            data={glucoseHistory.map((g) => g.value)}
            color="#FF2D55"
            width={70}
            height={32}
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span style={{ color: "#FFFFFF", fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {latestGlucose?.value}
          </span>
          <span style={{ color: "#98989D", fontSize: 15, fontWeight: 400 }}>
            {latestGlucose?.unit}
          </span>
          <span
            style={{
              color: "#FF2D55",
              fontSize: 13,
              fontWeight: 600,
              marginLeft: 8,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(255, 45, 85, 0.15)",
            }}
          >
            +0.8 since 2021
          </span>
        </div>
      </GradientCard>

      {/* ================================
          Two-column stat cards
          ================================ */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* HbA1c */}
        <div
          style={{
            background: "#1C1C1E",
            borderRadius: 16,
            padding: "16px 16px 14px",
          }}
        >
          <p style={{ color: "#98989D", fontSize: 13, fontWeight: 500, margin: 0, marginBottom: 8 }}>
            HbA1c (Long-term Sugar)
          </p>
          <div className="flex items-baseline gap-1">
            <span style={{ color: "#FFFFFF", fontSize: 28, fontWeight: 700 }}>
              {latestHbA1c?.value}
            </span>
            <span style={{ color: "#98989D", fontSize: 13 }}>{latestHbA1c?.unit}</span>
          </div>
          <p style={{ color: "#30D158", fontSize: 12, fontWeight: 500, margin: 0, marginTop: 4 }}>
            Normal range
          </p>
        </div>

        {/* Cholesterol */}
        <div
          style={{
            background: "#1C1C1E",
            borderRadius: 16,
            padding: "16px 16px 14px",
          }}
        >
          <p style={{ color: "#98989D", fontSize: 13, fontWeight: 500, margin: 0, marginBottom: 8 }}>
            Total Cholesterol
          </p>
          <div className="flex items-baseline gap-1">
            <span style={{ color: "#FFFFFF", fontSize: 28, fontWeight: 700 }}>
              {latestCholesterol?.value}
            </span>
            <span style={{ color: "#98989D", fontSize: 13 }}>{latestCholesterol?.unit}</span>
          </div>
          <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
            <Sparkline
              data={cholesterolHistory.map((c) => c.value)}
              color="#FFD60A"
              width={48}
              height={16}
            />
            <span style={{ color: "#FFD60A", fontSize: 12, fontWeight: 500 }}>Borderline</span>
          </div>
        </div>

        {/* Blood Pressure */}
        <div
          style={{
            background: "#1C1C1E",
            borderRadius: 16,
            padding: "16px 16px 14px",
          }}
        >
          <p style={{ color: "#98989D", fontSize: 13, fontWeight: 500, margin: 0, marginBottom: 8 }}>
            Blood Pressure
          </p>
          <div className="flex items-baseline gap-1">
            <span style={{ color: "#FFFFFF", fontSize: 28, fontWeight: 700 }}>
              {latestBio.bloodPressure.split("/")[0]}
            </span>
            <span style={{ color: "#98989D", fontSize: 15 }}>
              /{latestBio.bloodPressure.split("/")[1]}
            </span>
          </div>
          <p style={{ color: "#30D158", fontSize: 12, fontWeight: 500, margin: 0, marginTop: 4 }}>
            Controlled
          </p>
        </div>

        {/* BMI */}
        <div
          style={{
            background: "#1C1C1E",
            borderRadius: 16,
            padding: "16px 16px 14px",
          }}
        >
          <p style={{ color: "#98989D", fontSize: 13, fontWeight: 500, margin: 0, marginBottom: 8 }}>
            BMI
          </p>
          <div className="flex items-baseline gap-1">
            <span style={{ color: "#FFFFFF", fontSize: 28, fontWeight: 700 }}>
              {latestBio.bmi}
            </span>
          </div>
          <p style={{ color: "#FF9F0A", fontSize: 12, fontWeight: 500, margin: 0, marginTop: 4 }}>
            Overweight ({latestBio.weight} kg)
          </p>
        </div>
      </div>

      {/* ================================
          Risk Assessment Cards
          ================================ */}
      <div className="mt-6 mb-4">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Risk Assessment
        </p>
      </div>

      {/* Diabetes risk */}
      <GradientCard
        gradient="linear-gradient(135deg, #2C1520 0%, #1C1C1E 100%)"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p style={{ color: "#FF2D55", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em" }}>
              DIABETES
            </p>
            <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: 0, marginTop: 2 }}>
              {RISK_ASSESSMENTS.diabetes.riskLabel}
            </p>
          </div>
          <div
            style={{
              background: "rgba(255, 45, 85, 0.15)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <span style={{ color: "#FF2D55", fontSize: 13, fontWeight: 600 }}>
              {RISK_ASSESSMENTS.diabetes.tenYearRisk}
            </span>
            <span style={{ color: "#98989D", fontSize: 11, marginLeft: 4 }}>10yr</span>
          </div>
        </div>
        {/* Risk bar */}
        <div style={{ position: "relative", height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #30D158 0%, #FFD60A 40%, #FF9F0A 65%, #FF453A 100%)",
            borderRadius: 3,
          }} />
          <div
            style={{
              position: "absolute",
              top: -3,
              left: "42%",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFFFFF",
              boxShadow: "0 0 8px rgba(255,159,10,0.6)",
            }}
          />
        </div>
        <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
          Glucose rising 5.0 to 5.8 over 5 years. Family history: mother with type 2 diabetes at 58.
        </p>
      </GradientCard>

      {/* Cardiovascular */}
      <div className="mt-3">
        <GradientCard gradient="linear-gradient(135deg, #0D2818 0%, #1C1C1E 100%)">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p style={{ color: "#30D158", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em" }}>
                CARDIOVASCULAR
              </p>
              <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: 0, marginTop: 2 }}>
                {RISK_ASSESSMENTS.cardiovascular.riskLabel}
              </p>
            </div>
            <div
              style={{
                background: "rgba(48, 209, 88, 0.15)",
                borderRadius: 8,
                padding: "4px 10px",
              }}
            >
              <span style={{ color: "#30D158", fontSize: 13, fontWeight: 600 }}>
                {RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
              </span>
              <span style={{ color: "#98989D", fontSize: 11, marginLeft: 4 }}>10yr</span>
            </div>
          </div>
          <div style={{ position: "relative", height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #30D158 0%, #FFD60A 40%, #FF9F0A 65%, #FF453A 100%)",
              borderRadius: 3,
            }} />
            <div
              style={{
                position: "absolute",
                top: -3,
                left: "18%",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#FFFFFF",
                boxShadow: "0 0 8px rgba(48,209,88,0.6)",
              }}
            />
          </div>
          <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
            BP controlled on medication. Father had heart attack at 65. Good HDL cholesterol.
          </p>
        </GradientCard>
      </div>

      {/* ================================
          Training Progress
          ================================ */}
      <div className="mt-6 mb-4">
        <div className="flex items-center justify-between">
          <p
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Training
          </p>
          <Link href="/smith13/training" style={{ textDecoration: "none" }}>
            <span style={{ color: "#0A84FF", fontSize: 15, fontWeight: 500 }}>See All</span>
          </Link>
        </div>
      </div>

      <GradientCard
        gradient="linear-gradient(135deg, #0A1628 0%, #1C1C1E 100%)"
        href="/smith13/training"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{ color: "#0A84FF", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em" }}>
              METABOLIC HEALTH PROGRAM
            </p>
            <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: 0, marginTop: 2 }}>
              Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
            </p>
          </div>
          <div
            style={{
              background: "rgba(10, 132, 255, 0.15)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <span style={{ color: "#0A84FF", fontSize: 15, fontWeight: 700 }}>
              {TRAINING_PLAN.completedThisWeek}
            </span>
            <span style={{ color: "#98989D", fontSize: 13 }}>
              /{TRAINING_PLAN.weeklySchedule.length}
            </span>
          </div>
        </div>

        {/* Weekly progress dots */}
        <div className="flex items-center gap-3 mb-4">
          {TRAINING_PLAN.weeklySchedule.map((day, i) => {
            const completed = i < TRAINING_PLAN.completedThisWeek;
            return (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: completed
                      ? "linear-gradient(135deg, #0A84FF, #409CFF)"
                      : "#2C2C2E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {completed ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10L8.5 13.5L15 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ color: "#98989D", fontSize: 12, fontWeight: 600 }}>
                      {day.day.slice(0, 3)}
                    </span>
                  )}
                </div>
                <span style={{ color: completed ? "#0A84FF" : "#98989D", fontSize: 11, fontWeight: 500 }}>
                  {day.day.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Overall progress bar */}
        <div style={{ marginBottom: 4 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ color: "#98989D", fontSize: 12 }}>Overall progress</span>
            <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>
              {TRAINING_PLAN.totalCompleted} sessions
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "#2C2C2E" }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                width: `${Math.round((TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100)}%`,
                background: "linear-gradient(90deg, #0A84FF, #409CFF)",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </GradientCard>

      {/* ================================
          Metabolic Syndrome Tracker
          ================================ */}
      <div className="mt-6 mb-4">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Metabolic Syndrome
        </p>
        <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginTop: 2 }}>
          {RISK_ASSESSMENTS.metabolicSyndrome.metCount} of 5 criteria met (3 needed for diagnosis)
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-3"
            style={{
              background: "#1C1C1E",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: c.met ? "rgba(255, 69, 58, 0.15)" : "rgba(48, 209, 88, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {c.met ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3L11 11M11 3L3 11" stroke="#FF453A" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7L6 10L11 4" stroke="#30D158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 500, margin: 0 }}>
                {c.value}
              </p>
              <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0, marginTop: 1 }}>
                {c.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================================
          FINDRISC Score
          ================================ */}
      <div
        className="mt-6"
        style={{
          background: "#1C1C1E",
          borderRadius: 22,
          padding: "20px",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ color: "#98989D", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em" }}>
              FINDRISC SCORE
            </p>
            <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginTop: 2 }}>
              Diabetes risk screening
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span style={{ color: "#FFFFFF", fontSize: 34, fontWeight: 700 }}>
              {SCREENING_SCORES.findrisc.score}
            </span>
            <span style={{ color: "#98989D", fontSize: 15 }}>
              /{SCREENING_SCORES.findrisc.maxScore}
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ position: "relative", height: 8, borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #30D158 0%, #FFD60A 35%, #FF9F0A 60%, #FF453A 85%, #8B0000 100%)",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -2,
              left: `${(SCREENING_SCORES.findrisc.score / SCREENING_SCORES.findrisc.maxScore) * 100}%`,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFFFFF",
              boxShadow: "0 0 6px rgba(255,159,10,0.5)",
              transform: "translateX(-6px)",
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span style={{ color: "#30D158", fontSize: 11 }}>Low</span>
          <span style={{ color: "#FF9F0A", fontSize: 11, fontWeight: 600 }}>Moderate</span>
          <span style={{ color: "#FF453A", fontSize: 11 }}>High</span>
        </div>
      </div>

      {/* ================================
          Next Steps
          ================================ */}
      <div className="mt-6 mb-4">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Your Plan
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { text: "Next blood test", detail: "September 15, 2026", color: "#FF2D55" },
          { text: "Friday workout", detail: "Full Body + Cardio", color: "#0A84FF" },
          { text: "Vitamin D supplement", detail: "2000 IU daily (Dr. Johansson)", color: "#FFD60A" },
          { text: "Post-dinner walk", detail: "20 min - helps blood sugar regulation", color: "#30D158" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-4"
            style={{
              background: "#1C1C1E",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                width: 4,
                height: 36,
                borderRadius: 2,
                background: item.color,
                flexShrink: 0,
              }}
            />
            <div>
              <p style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, margin: 0 }}>
                {item.text}
              </p>
              <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginTop: 1 }}>
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Membership footer */}
      <div
        className="mt-8 text-center"
        style={{ paddingBottom: 20 }}
      >
        <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0 }}>
          Precura Annual - {PATIENT.membershipPrice.toLocaleString()} SEK/year
        </p>
        <p style={{ color: "#98989D", fontSize: 11, fontWeight: 400, margin: 0, marginTop: 4 }}>
          Member since {new Date(PATIENT.memberSince).toLocaleDateString("en-SE", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
