"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  TRAINING_PLAN,
  MESSAGES,
  DOCTOR_NOTES,
  FAMILY_HISTORY,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  Droplets,
  Shield,
  Dumbbell,
  MessageSquare,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Category Pills
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: "all", label: "For you", icon: Star },
  { id: "blood", label: "Blood Work", icon: Droplets },
  { id: "risks", label: "Risks", icon: Shield },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "doctor", label: "Doctor", icon: MessageSquare },
  { id: "timeline", label: "Timeline", icon: Clock },
];

function CategoryPills({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 px-5 py-3 overflow-x-auto"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        borderBottom: "1px solid #EBEBEB",
      }}
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="flex items-center gap-1.5 shrink-0"
            style={{
              padding: "8px 16px",
              borderRadius: 50,
              border: isActive ? "2px solid #222222" : "1px solid #EBEBEB",
              background: isActive ? "#222222" : "#FFFFFF",
              color: isActive ? "#FFFFFF" : "#717171",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            <Icon size={14} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Glucose Sparkline (inline SVG)
// ---------------------------------------------------------------------------

function GlucoseSparkline() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;

  const w = 200;
  const h = 48;
  const pad = 4;
  const minVal = Math.min(...data.map((d) => d.value)) - 0.3;
  const maxVal = Math.max(...data.map((d) => d.value)) + 0.3;

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((d.value - minVal) / (maxVal - minVal)) * (h - pad * 2),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const last = points[points.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sparkGrad12" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#008A05" />
          <stop offset="100%" stopColor="#FF385C" />
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke="url(#sparkGrad12)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={4} fill="#FF385C" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Card Components
// ---------------------------------------------------------------------------

function HealthScoreCard() {
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1];
  const firstGlucose = glucoseHistory[0];

  return (
    <div
      className="mx-5 mb-4"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #FF385C 0%, #E31C5F 50%, #BD1550 100%)",
        boxShadow: "0 8px 28px rgba(255, 56, 92, 0.25)",
      }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
              Welcome back, {PATIENT.firstName}
            </p>
            <h2 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Your health snapshot
            </h2>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 50,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={24} style={{ color: "#FFFFFF" }} />
          </div>
        </div>

        <div className="flex gap-3">
          <div
            className="flex-1 p-3"
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              backdropFilter: "blur(10px)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 500, marginBottom: 2 }}>
              Glucose trend
            </p>
            <p style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>
              {firstGlucose.value} / {latestGlucose.value}
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
              mmol/L over 5 years
            </p>
          </div>
          <div
            className="flex-1 p-3"
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              backdropFilter: "blur(10px)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 500, marginBottom: 2 }}>
              Diabetes risk
            </p>
            <p style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>
              {RISK_ASSESSMENTS.diabetes.tenYearRisk}
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
              10-year estimate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BloodWorkCard() {
  const latest = BLOOD_TEST_HISTORY[0];
  const borderline = latest.results.filter((r) => r.status === "borderline");
  const normal = latest.results.filter((r) => r.status === "normal");

  return (
    <Link href="/smith12/blood-tests" style={{ textDecoration: "none" }}>
      <div
        className="mx-5 mb-4"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Card header with gradient */}
        <div
          className="p-5 pb-4"
          style={{
            background: "linear-gradient(135deg, #F0FFF4 0%, #E6F7FF 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <Droplets size={16} style={{ color: "#FF385C" }} />
              </div>
              <div>
                <p style={{ color: "#222222", fontSize: 16, fontWeight: 600 }}>Blood Work</p>
                <p style={{ color: "#717171", fontSize: 12 }}>
                  Last test: {new Date(latest.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: "#717171" }} />
          </div>

          <GlucoseSparkline />
        </div>

        {/* Results summary */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} style={{ color: "#008A05" }} />
              <span style={{ color: "#222222", fontSize: 13, fontWeight: 500 }}>
                {normal.length} normal
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={14} style={{ color: "#E07912" }} />
              <span style={{ color: "#222222", fontSize: 13, fontWeight: 500 }}>
                {borderline.length} borderline
              </span>
            </div>
          </div>

          {borderline.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {borderline.map((m) => (
                <span
                  key={m.shortName}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 50,
                    background: "#FFF7ED",
                    color: "#E07912",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {m.plainName}: {m.value} {m.unit}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function RiskCard({
  title,
  riskLevel,
  riskLabel,
  trend,
  tenYearRisk,
  summary,
  href,
  gradientFrom,
  gradientTo,
}: {
  title: string;
  riskLevel: string;
  riskLabel: string;
  trend: string;
  tenYearRisk: string;
  summary: string;
  href: string;
  gradientFrom: string;
  gradientTo: string;
}) {
  const riskColor =
    riskLevel === "low" ? "#008A05" :
    riskLevel === "moderate" ? "#E07912" :
    riskLevel === "low_moderate" ? "#E07912" :
    "#C13515";

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          className="p-4"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p style={{ color: "#222222", fontSize: 15, fontWeight: 600 }}>{title}</p>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 50,
                background: "rgba(255,255,255,0.8)",
                color: riskColor,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {riskLabel}
            </span>
          </div>
          <p style={{ color: "#222222", fontSize: 28, fontWeight: 700 }}>{tenYearRisk}</p>
          <p style={{ color: "#717171", fontSize: 11 }}>10-year risk estimate</p>
        </div>
        <div className="px-4 py-3">
          <p style={{ color: "#717171", fontSize: 13, lineHeight: 1.5 }}>
            {summary.length > 120 ? summary.slice(0, 120) + "..." : summary}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} style={{ color: trend === "worsening" ? "#C13515" : "#008A05" }} />
            <span style={{ color: trend === "worsening" ? "#C13515" : "#008A05", fontSize: 12, fontWeight: 500 }}>
              {trend === "worsening" ? "Trending up" : trend === "stable" ? "Stable" : "Approaching threshold"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DoctorCard() {
  const lastMsg = MESSAGES[MESSAGES.length - 1];
  const doctorNote = DOCTOR_NOTES[0];

  return (
    <Link href="/smith12/messages" style={{ textDecoration: "none" }}>
      <div
        className="mx-5 mb-4"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 50,
                background: "linear-gradient(135deg, #667EEA, #764BA2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              MJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p style={{ color: "#222222", fontSize: 15, fontWeight: 600 }}>Dr. Marcus Johansson</p>
                <span style={{ color: "#717171", fontSize: 11 }}>
                  {new Date(lastMsg.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p
                style={{
                  color: "#717171",
                  fontSize: 13,
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {lastMsg.text}
              </p>
            </div>
          </div>
        </div>

        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #EBEBEB" }}
        >
          <span style={{ color: "#FF385C", fontSize: 13, fontWeight: 600 }}>
            Continue conversation
          </span>
          <ChevronRight size={16} style={{ color: "#FF385C" }} />
        </div>
      </div>
    </Link>
  );
}

function TrainingCard() {
  const plan = TRAINING_PLAN;
  const progress = Math.round((plan.completedThisWeek / plan.weeklySchedule.length) * 100);
  const overallProgress = Math.round((plan.currentWeek / plan.totalWeeks) * 100);

  return (
    <Link href="/smith12/training" style={{ textDecoration: "none" }}>
      <div
        className="mx-5 mb-4"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          className="p-5"
          style={{
            background: "linear-gradient(135deg, #FFF5F5 0%, #FFF0E6 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <Dumbbell size={16} style={{ color: "#FF385C" }} />
              </div>
              <div>
                <p style={{ color: "#222222", fontSize: 16, fontWeight: 600 }}>{plan.name}</p>
                <p style={{ color: "#717171", fontSize: 12 }}>Week {plan.currentWeek} of {plan.totalWeeks}</p>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: "#717171" }} />
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 12 }}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>Program progress</span>
              <span style={{ color: "#222222", fontSize: 11, fontWeight: 600 }}>{overallProgress}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.06)" }}>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  width: `${overallProgress}%`,
                  background: "linear-gradient(90deg, #FF385C, #E31C5F)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* This week */}
          <div className="flex gap-2">
            {plan.weeklySchedule.map((day, i) => {
              const done = i < plan.completedThisWeek;
              return (
                <div
                  key={day.day}
                  className="flex-1 p-2 text-center"
                  style={{
                    borderRadius: 10,
                    background: done ? "rgba(0,138,5,0.08)" : "rgba(0,0,0,0.03)",
                    border: done ? "1px solid rgba(0,138,5,0.2)" : "1px solid transparent",
                  }}
                >
                  <p style={{ color: done ? "#008A05" : "#717171", fontSize: 10, fontWeight: 600, marginBottom: 2 }}>
                    {day.day.slice(0, 3)}
                  </p>
                  <p style={{ color: done ? "#008A05" : "#222222", fontSize: 11, fontWeight: 500 }}>
                    {day.name.split(" ")[0]}
                  </p>
                  {done && <CheckCircle size={12} style={{ color: "#008A05", marginTop: 2 }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FamilyHistoryCard() {
  return (
    <div
      className="mx-5 mb-4"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={16} style={{ color: "#FF385C" }} />
          <p style={{ color: "#222222", fontSize: 16, fontWeight: 600 }}>Family history</p>
        </div>

        <div className="flex flex-col gap-3">
          {FAMILY_HISTORY.map((fh, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 50,
                  background: "#F7F7F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 14,
                }}
              >
                {fh.relative === "Mother" ? "M" : fh.relative === "Father" ? "F" : fh.relative.includes("mother") ? "GM" : "GF"}
              </div>
              <div>
                <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>{fh.relative}</p>
                <p style={{ color: "#717171", fontSize: 12 }}>
                  {fh.condition} (age {fh.ageAtDiagnosis})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NextStepsCard() {
  const steps = [
    { label: "Next blood test", value: new Date(PATIENT.nextBloodTest).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), icon: Droplets },
    { label: "Vitamin D supplement", value: "Start 2000 IU daily", icon: Heart },
    { label: "After-dinner walks", value: "20 min post-meal", icon: Activity },
  ];

  return (
    <div
      className="mx-5 mb-4"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div className="p-5">
        <p style={{ color: "#222222", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Your action items
        </p>
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3"
                style={{
                  borderRadius: 12,
                  background: "#F7F7F7",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #FFE4E9, #FFF0E6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} style={{ color: "#FF385C" }} />
                </div>
                <div className="flex-1">
                  <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>{step.label}</p>
                  <p style={{ color: "#717171", fontSize: 12 }}>{step.value}</p>
                </div>
                <ChevronRight size={16} style={{ color: "#717171" }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function Smith12Page() {
  const [activeCategory, setActiveCategory] = useState("all");

  const showBlood = activeCategory === "all" || activeCategory === "blood";
  const showRisks = activeCategory === "all" || activeCategory === "risks";
  const showTraining = activeCategory === "all" || activeCategory === "training";
  const showDoctor = activeCategory === "all" || activeCategory === "doctor";
  const showTimeline = activeCategory === "all" || activeCategory === "timeline";

  return (
    <div>
      <CategoryPills active={activeCategory} onChange={setActiveCategory} />

      <div className="pt-4">
        {/* Hero card - always visible */}
        {activeCategory === "all" && <HealthScoreCard />}

        {/* Blood work */}
        {showBlood && <BloodWorkCard />}

        {/* Risk models */}
        {showRisks && (
          <div className="mx-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p style={{ color: "#222222", fontSize: 18, fontWeight: 600 }}>Risk assessments</p>
              <Link href="/smith12/risk" style={{ color: "#FF385C", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <RiskCard
                title="Diabetes (type 2)"
                riskLevel={RISK_ASSESSMENTS.diabetes.riskLevel}
                riskLabel={RISK_ASSESSMENTS.diabetes.riskLabel}
                trend={RISK_ASSESSMENTS.diabetes.trend}
                tenYearRisk={RISK_ASSESSMENTS.diabetes.tenYearRisk}
                summary={RISK_ASSESSMENTS.diabetes.summary}
                href="/smith12/risk"
                gradientFrom="#FFF7ED"
                gradientTo="#FFF0E6"
              />
              <RiskCard
                title="Cardiovascular"
                riskLevel={RISK_ASSESSMENTS.cardiovascular.riskLevel}
                riskLabel={RISK_ASSESSMENTS.cardiovascular.riskLabel}
                trend={RISK_ASSESSMENTS.cardiovascular.trend}
                tenYearRisk={RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
                summary={RISK_ASSESSMENTS.cardiovascular.summary}
                href="/smith12/risk"
                gradientFrom="#EFF6FF"
                gradientTo="#E6F7FF"
              />
              <RiskCard
                title="Bone health"
                riskLevel={RISK_ASSESSMENTS.bone.riskLevel}
                riskLabel={RISK_ASSESSMENTS.bone.riskLabel}
                trend={RISK_ASSESSMENTS.bone.trend}
                tenYearRisk={RISK_ASSESSMENTS.bone.tenYearRisk}
                summary={RISK_ASSESSMENTS.bone.summary}
                href="/smith12/risk"
                gradientFrom="#F0FFF4"
                gradientTo="#E6FFED"
              />
            </div>
          </div>
        )}

        {/* Doctor */}
        {showDoctor && <DoctorCard />}

        {/* Training */}
        {showTraining && <TrainingCard />}

        {/* Timeline / family history */}
        {showTimeline && <FamilyHistoryCard />}

        {/* Action items - always visible */}
        {activeCategory === "all" && <NextStepsCard />}

        {/* Membership footer */}
        {activeCategory === "all" && (
          <div className="mx-5 mb-8 text-center py-6">
            <p style={{ color: "#717171", fontSize: 13 }}>
              Precura Annual Member since {new Date(PATIENT.memberSince).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
            <p style={{ color: "#717171", fontSize: 12, marginTop: 4 }}>
              Next blood test: {new Date(PATIENT.nextBloodTest).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
