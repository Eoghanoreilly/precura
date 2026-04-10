"use client";

import React from "react";
import {
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Activity,
  Shield,
  Heart,
  Flame,
  HeartPulse,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  BIOMETRICS_HISTORY,
  TRAINING_PLAN,
  MESSAGES,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Mini Sparkline - pure CSS + inline divs                            */
/* ------------------------------------------------------------------ */
function Sparkline({
  values,
  color = "#1DB954",
  warning = false,
}: {
  values: number[];
  color?: string;
  warning?: boolean;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const dotColor = warning ? "#FFA42B" : color;

  return (
    <div className="flex items-end gap-0.5" style={{ height: 32, width: 80 }}>
      {values.map((v, i) => {
        const h = ((v - min) / range) * 28 + 4;
        const isLast = i === values.length - 1;
        return (
          <div
            key={i}
            style={{
              width: isLast ? 4 : 2,
              height: h,
              borderRadius: 2,
              background: isLast ? dotColor : `${dotColor}40`,
              transition: "height 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Glucose Trend Card - the hero card                                  */
/* ------------------------------------------------------------------ */
function GlucoseTrendHero() {
  const history = getMarkerHistory("f-Glucose");
  const latest = getLatestMarker("f-Glucose");
  if (!latest) return null;

  const pct = ((latest.value - latest.refLow) / (latest.refHigh - latest.refLow)) * 100;

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 20, marginBottom: 16 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: "#FFA42B20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={18} style={{ color: "#FFA42B" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#B3B3B3", fontWeight: 500 }}>Needs attention</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>Blood sugar trend</div>
          </div>
        </div>
        <Sparkline values={history.map((h) => h.value)} warning />
      </div>

      {/* Large number */}
      <div className="flex items-baseline gap-2" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: "#FFA42B", lineHeight: 1 }}>
          {latest.value}
        </span>
        <span style={{ fontSize: 15, color: "#B3B3B3", fontWeight: 500 }}>{latest.unit}</span>
      </div>

      {/* Range bar */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "#282828",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Green zone */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "80%",
              background: "linear-gradient(90deg, #1DB95430, #1DB95460)",
              borderRadius: 3,
            }}
          />
          {/* Marker */}
          <div
            style={{
              position: "absolute",
              left: `${Math.min(pct, 98)}%`,
              top: -2,
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "#FFA42B",
              border: "2px solid #1E1E1E",
            }}
          />
        </div>
        <div className="flex justify-between" style={{ marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "#B3B3B380" }}>{latest.refLow}</span>
          <span style={{ fontSize: 11, color: "#B3B3B380" }}>{latest.refHigh}</span>
        </div>
      </div>

      <p style={{ fontSize: 14, color: "#B3B3B3", lineHeight: 1.5, marginTop: 8 }}>
        Up from 5.0 five years ago. Your doctor is tracking this.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Risk Carousel Card                                                  */
/* ------------------------------------------------------------------ */
function RiskCard({
  title,
  risk,
  tenYear,
  trend,
  color,
  icon: Icon,
}: {
  title: string;
  risk: string;
  tenYear: string;
  trend: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div
      style={{
        minWidth: 200,
        background: "#1E1E1E",
        borderRadius: 8,
        padding: 16,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 8 }}>{risk}</div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, color: "#B3B3B3" }}>10-year: {tenYear}</span>
        <span
          style={{
            fontSize: 11,
            color: trend === "worsening" ? "#FFA42B" : trend === "stable" ? "#B3B3B3" : "#1DB954",
            fontWeight: 600,
          }}
        >
          {trend === "worsening" ? "Rising" : trend === "stable" ? "Stable" : "Improving"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Blood Marker Mini Card                                              */
/* ------------------------------------------------------------------ */
function MarkerMiniCard({
  shortName,
  plainName,
  value,
  unit,
  status,
}: {
  shortName: string;
  plainName: string;
  value: number;
  unit: string;
  status: string;
}) {
  const history = getMarkerHistory(shortName);
  const col =
    status === "borderline" ? "#FFA42B" : status === "abnormal" ? "#F15E6C" : "#1DB954";

  return (
    <div
      style={{
        minWidth: 160,
        background: "#1E1E1E",
        borderRadius: 8,
        padding: 14,
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: 12, color: "#B3B3B3", marginBottom: 6, fontWeight: 500 }}>
        {plainName}
      </div>
      <div className="flex items-baseline gap-1.5" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: col }}>{value}</span>
        <span style={{ fontSize: 12, color: "#B3B3B380" }}>{unit}</span>
      </div>
      <Sparkline
        values={history.map((h) => h.value)}
        color={col}
        warning={status === "borderline"}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Training Progress Card                                              */
/* ------------------------------------------------------------------ */
function TrainingProgressCard() {
  const plan = TRAINING_PLAN;
  const progressPct = (plan.currentWeek / plan.totalWeeks) * 100;
  const weeklyPct = (plan.completedThisWeek / plan.weeklySchedule.length) * 100;

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 20 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: "#1DB95420",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flame size={18} style={{ color: "#1DB954" }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
              {plan.name}
            </div>
            <div style={{ fontSize: 13, color: "#B3B3B3" }}>
              Week {plan.currentWeek} of {plan.totalWeeks}
            </div>
          </div>
        </div>
      </div>

      {/* Program progress */}
      <div style={{ marginBottom: 14 }}>
        <div className="flex justify-between" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#B3B3B3" }}>Program progress</span>
          <span style={{ fontSize: 12, color: "#1DB954", fontWeight: 600 }}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "#282828" }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #1DB954, #1ED760)",
            }}
          />
        </div>
      </div>

      {/* This week */}
      <div className="flex gap-3">
        {plan.weeklySchedule.map((day, i) => {
          const done = i < plan.completedThisWeek;
          return (
            <div
              key={day.day}
              className="flex-1"
              style={{
                background: done ? "#1DB95418" : "#28282870",
                borderRadius: 8,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: done ? "#1DB954" : "#B3B3B380",
                  marginBottom: 4,
                }}
              >
                {day.day.slice(0, 3)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: done ? "#FFFFFF" : "#B3B3B350",
                }}
              >
                {done ? "Done" : day.name.split(" ")[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quick Action Chips                                                   */
/* ------------------------------------------------------------------ */
function QuickAction({
  label,
  icon: Icon,
  color,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2"
      style={{
        background: `${color}18`,
        border: "none",
        borderRadius: 24,
        padding: "10px 16px",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Icon size={16} style={{ color }} />
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section Header                                                       */
/* ------------------------------------------------------------------ */
function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#B3B3B3" }}>{action}</span>
          <ChevronRight size={14} style={{ color: "#B3B3B3" }} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctor Message Preview                                               */
/* ------------------------------------------------------------------ */
function DoctorMessagePreview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const lastMsg = MESSAGES[MESSAGES.length - 1];
  const isDoctor = lastMsg.from === "doctor";

  return (
    <button
      onClick={() => onNavigate("doctor")}
      style={{
        width: "100%",
        background: "#1E1E1E",
        borderRadius: 8,
        padding: 16,
        border: "none",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: "linear-gradient(135deg, #1DB954, #1ED760)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HeartPulse size={20} style={{ color: "#FFFFFF" }} />
        </div>
        <div className="flex-1" style={{ minWidth: 0 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
              Dr. Johansson
            </span>
            <span style={{ fontSize: 12, color: "#B3B3B380" }}>Mar 28</span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#B3B3B3",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lastMsg.text.slice(0, 80)}...
          </p>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Metabolic Syndrome Status                                            */
/* ------------------------------------------------------------------ */
function MetabolicSyndromeCard() {
  const ms = RISK_ASSESSMENTS.metabolicSyndrome;

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 20 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
        <Shield size={18} style={{ color: "#FFA42B" }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
          Metabolic syndrome check
        </span>
      </div>
      <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#FFA42B",
            lineHeight: 1,
          }}
        >
          {ms.metCount}
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 600 }}>
            of {ms.threshold} criteria met
          </div>
          <div style={{ fontSize: 12, color: "#B3B3B3" }}>
            {ms.threshold} needed for diagnosis
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {ms.criteria.map((c) => (
          <div key={c.name} className="flex items-center gap-2">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: c.met ? "#FFA42B" : "#282828",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: c.met ? "#FFFFFF" : "#B3B3B370",
                fontWeight: c.met ? 600 : 400,
              }}
            >
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Next Test Card                                                       */
/* ------------------------------------------------------------------ */
function NextTestCard() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1DB954, #17a34a)",
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF90", marginBottom: 4 }}>
            Next blood test
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>Sep 15, 2026</div>
          <div style={{ fontSize: 13, color: "#FFFFFF80", marginTop: 4 }}>
            Comprehensive panel ordered by Dr. Johansson
          </div>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: "#FFFFFF20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowUpRight size={24} style={{ color: "#FFFFFF" }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Biometrics Row                                                       */
/* ------------------------------------------------------------------ */
function BiometricsRow() {
  const latest = BIOMETRICS_HISTORY[0];
  const items = [
    { label: "Weight", value: `${latest.weight}`, unit: "kg" },
    { label: "BMI", value: `${latest.bmi}`, unit: "" },
    { label: "Waist", value: `${latest.waist}`, unit: "cm" },
    { label: "BP", value: latest.bloodPressure, unit: "" },
  ];

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex-1"
          style={{
            background: "#1E1E1E",
            borderRadius: 8,
            padding: "12px 8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 11, color: "#B3B3B3", marginBottom: 4, fontWeight: 500 }}>
            {item.label}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
            {item.value}
            {item.unit && (
              <span style={{ fontSize: 11, fontWeight: 500, color: "#B3B3B380" }}>
                {" "}
                {item.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HOME PAGE                                                            */
/* ------------------------------------------------------------------ */
export default function HomePage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const latestResults = BLOOD_TEST_HISTORY[0].results;

  return (
    <div style={{ padding: "0 16px 24px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#B3B3B3", fontWeight: 500, marginBottom: 2 }}>
          Good morning
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
          Hi, {PATIENT.firstName}
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto" style={{ marginBottom: 24, paddingBottom: 4 }}>
        <QuickAction
          label="Message doctor"
          icon={MessageCircle}
          color="#1DB954"
          onClick={() => onNavigate("doctor")}
        />
        <QuickAction
          label="Today's workout"
          icon={Flame}
          color="#FFA42B"
          onClick={() => onNavigate("training")}
        />
        <QuickAction
          label="Blood results"
          icon={Activity}
          color="#1ED760"
          onClick={() => onNavigate("blood")}
        />
      </div>

      {/* For You */}
      <SectionHeader title="For you" />
      <GlucoseTrendHero />

      {/* Doctor Message */}
      <div style={{ marginBottom: 24 }}>
        <DoctorMessagePreview onNavigate={onNavigate} />
      </div>

      {/* Risk Overview */}
      <SectionHeader title="Your risk profile" action="Details" onAction={() => onNavigate("blood")} />
      <div className="flex gap-3 overflow-x-auto" style={{ marginBottom: 24, paddingBottom: 4 }}>
        <RiskCard
          title="Diabetes"
          risk={RISK_ASSESSMENTS.diabetes.riskLabel}
          tenYear={RISK_ASSESSMENTS.diabetes.tenYearRisk}
          trend={RISK_ASSESSMENTS.diabetes.trend}
          color="#FFA42B"
          icon={AlertTriangle}
        />
        <RiskCard
          title="Heart"
          risk={RISK_ASSESSMENTS.cardiovascular.riskLabel}
          tenYear={RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
          trend={RISK_ASSESSMENTS.cardiovascular.trend}
          color="#1DB954"
          icon={Heart}
        />
        <RiskCard
          title="Bone health"
          risk={RISK_ASSESSMENTS.bone.riskLabel}
          tenYear={RISK_ASSESSMENTS.bone.tenYearRisk}
          trend={RISK_ASSESSMENTS.bone.trend}
          color="#1DB954"
          icon={Shield}
        />
      </div>

      {/* Blood Markers Carousel */}
      <SectionHeader title="Latest blood work" action="All results" onAction={() => onNavigate("blood")} />
      <div className="flex gap-3 overflow-x-auto" style={{ marginBottom: 24, paddingBottom: 4 }}>
        {latestResults
          .filter((r) => ["f-Glucose", "HbA1c", "TC", "HDL", "Vit D"].includes(r.shortName))
          .map((marker) => (
            <MarkerMiniCard
              key={marker.shortName}
              shortName={marker.shortName}
              plainName={marker.plainName}
              value={marker.value}
              unit={marker.unit}
              status={marker.status}
            />
          ))}
      </div>

      {/* Training */}
      <SectionHeader title="Your training" action="Full plan" onAction={() => onNavigate("training")} />
      <div style={{ marginBottom: 24 }}>
        <TrainingProgressCard />
      </div>

      {/* Biometrics */}
      <SectionHeader title="Your body" />
      <div style={{ marginBottom: 24 }}>
        <BiometricsRow />
      </div>

      {/* Metabolic Syndrome */}
      <div style={{ marginBottom: 24 }}>
        <MetabolicSyndromeCard />
      </div>

      {/* Next Test */}
      <div style={{ marginBottom: 24 }}>
        <NextTestCard />
      </div>

      {/* Membership */}
      <div
        style={{
          background: "#1E1E1E",
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 12, color: "#B3B3B3", marginBottom: 4 }}>Precura Annual</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
              {PATIENT.membershipPrice.toLocaleString()} SEK/year
            </div>
          </div>
          <div
            style={{
              background: "#1DB95418",
              borderRadius: 24,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: "#1DB954",
            }}
          >
            Active
          </div>
        </div>
      </div>
    </div>
  );
}
