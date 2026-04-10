"use client";

import React from "react";
import {
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Droplets,
  Activity,
  Shield,
  Sun,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  TRAINING_PLAN,
  MESSAGES,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

type TabId = "home" | "blood" | "training" | "messages" | "profile";

export default function HomePage({
  onNavigate,
}: {
  onNavigate: (tab: TabId) => void;
}) {
  const latestBio = BIOMETRICS_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1];
  const lastMsg = MESSAGES[MESSAGES.length - 1];

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
      {/* Greeting chip */}
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#002110",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Hi, {PATIENT.firstName}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#4F6354",
            marginTop: 4,
          }}
        >
          Your health at a glance
        </p>
      </div>

      {/* Priority alert card - Material 3 colored container */}
      <div
        style={{
          background: "#FFF3E0",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "#FFE0B2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={20} style={{ color: "#E65100" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#BF360C",
              margin: 0,
            }}
          >
            Blood sugar trending up
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#6D4C41",
              marginTop: 2,
              lineHeight: 1.4,
            }}
          >
            Fasting glucose rose from 5.0 to {latestGlucose.value} over 5 years. Your doctor has a note for you.
          </p>
        </div>
      </div>

      {/* Risk overview - Material 3 surface container */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#002110",
              margin: 0,
            }}
          >
            Risk overview
          </h2>
          <button
            onClick={() => onNavigate("blood")}
            style={{
              background: "transparent",
              border: "none",
              color: "#006D3E",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            Details
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Diabetes risk */}
          <RiskRow
            icon={<Droplets size={18} style={{ color: "#E65100" }} />}
            label="Diabetes"
            sublabel="Type 2 risk"
            level="Moderate"
            levelColor="#E65100"
            pillBg="#FFF3E0"
            trend="rising"
          />
          {/* CVD risk */}
          <RiskRow
            icon={<Activity size={18} style={{ color: "#006D3E" }} />}
            label="Heart health"
            sublabel="Cardiovascular"
            level="Low-moderate"
            levelColor="#2E7D32"
            pillBg="#E8F5E9"
            trend="stable"
          />
          {/* Bone health */}
          <RiskRow
            icon={<Shield size={18} style={{ color: "#006D3E" }} />}
            label="Bone health"
            sublabel="Osteoporosis"
            level="Low risk"
            levelColor="#2E7D32"
            pillBg="#E8F5E9"
            trend="stable"
          />
        </div>
      </div>

      {/* Key markers - horizontal scroll chips */}
      <div>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#002110",
            margin: "0 0 8px",
          }}
        >
          Key markers
        </h2>
        <div className="flex gap-3 overflow-x-auto" style={{ paddingBottom: 4 }}>
          <MarkerChip
            label="Blood sugar (fasting)"
            value={`${latestGlucose.value}`}
            unit="mmol/L"
            status="borderline"
          />
          <MarkerChip
            label="Long-term blood sugar"
            value="38"
            unit="mmol/mol"
            status="normal"
          />
          <MarkerChip
            label="Total cholesterol"
            value="5.1"
            unit="mmol/L"
            status="borderline"
          />
          <MarkerChip
            label="Vitamin D"
            value="48"
            unit="nmol/L"
            status="borderline"
          />
        </div>
      </div>

      {/* Blood sugar trend - mini sparkline card */}
      <button
        onClick={() => onNavigate("blood")}
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
              Blood sugar (fasting) trend
            </p>
            <p style={{ fontSize: 13, color: "#4F6354", margin: "2px 0 0" }}>
              5 years of data
            </p>
          </div>
          <TrendingUp size={20} style={{ color: "#E65100" }} />
        </div>

        {/* CSS sparkline */}
        <div className="flex items-end gap-1" style={{ height: 48 }}>
          {glucoseHistory.map((point, i) => {
            const min = 4.8;
            const max = 6.2;
            const pct = ((point.value - min) / (max - min)) * 100;
            const isLast = i === glucoseHistory.length - 1;
            return (
              <div
                key={point.date}
                className="flex flex-col items-center"
                style={{ flex: 1 }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 40,
                    height: `${Math.max(pct, 10)}%`,
                    background: isLast ? "#E65100" : "#006D3E",
                    borderRadius: "6px 6px 2px 2px",
                    opacity: isLast ? 1 : 0.5 + (i / glucoseHistory.length) * 0.5,
                    transition: "height 0.3s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: "#4F6354",
                    marginTop: 4,
                  }}
                >
                  {point.value}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between" style={{ marginTop: 2 }}>
          <span style={{ fontSize: 10, color: "#6F796F" }}>2021</span>
          <span style={{ fontSize: 10, color: "#6F796F" }}>2026</span>
        </div>
      </button>

      {/* Training progress card */}
      <button
        onClick={() => onNavigate("training")}
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: 0 }}>
            Training this week
          </h2>
          <ChevronRight size={18} style={{ color: "#006D3E" }} />
        </div>
        <p style={{ fontSize: 14, color: "#4F6354", margin: "0 0 12px" }}>
          {TRAINING_PLAN.name} - Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
        </p>

        {/* Progress dots */}
        <div className="flex gap-3">
          {TRAINING_PLAN.weeklySchedule.map((day, i) => {
            const completed = i < TRAINING_PLAN.completedThisWeek;
            return (
              <div
                key={day.day}
                className="flex items-center gap-2"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: completed ? "#95F7B5" : "#DAE8DE",
                }}
              >
                {completed ? (
                  <CheckCircle2 size={16} style={{ color: "#002110" }} />
                ) : (
                  <Clock size={16} style={{ color: "#4F6354" }} />
                )}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: completed ? "#002110" : "#4F6354", margin: 0 }}>
                    {day.day.slice(0, 3)}
                  </p>
                  <p style={{ fontSize: 11, color: completed ? "#002110" : "#6F796F", margin: 0 }}>
                    {day.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </button>

      {/* Recent message preview */}
      <button
        onClick={() => onNavigate("messages")}
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: 0 }}>
            Doctor message
          </h2>
          <span
            style={{
              fontSize: 11,
              color: "#006D3E",
              background: "#95F7B5",
              padding: "2px 10px",
              borderRadius: 50,
              fontWeight: 500,
            }}
          >
            New
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#4F6354", margin: 0, lineHeight: 1.5 }}>
          {lastMsg.text.slice(0, 120)}...
        </p>
        <p style={{ fontSize: 12, color: "#6F796F", marginTop: 6 }}>
          Dr. Johansson - {new Date(lastMsg.date).toLocaleDateString("sv-SE")}
        </p>
      </button>

      {/* Biometrics snapshot */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Your numbers
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <BioStat label="Weight" value={`${latestBio.weight}`} unit="kg" />
          <BioStat label="BMI" value={`${latestBio.bmi}`} unit="" />
          <BioStat label="Waist" value={`${latestBio.waist}`} unit="cm" />
          <BioStat label="Blood pressure" value={latestBio.bloodPressure} unit="" />
        </div>
      </div>

      {/* Screening scores */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Screening scores
        </h2>
        <div className="flex flex-col gap-2">
          <ScreeningRow
            label="FINDRISC (diabetes risk)"
            score={SCREENING_SCORES.findrisc.score}
            max={SCREENING_SCORES.findrisc.maxScore}
            level="Moderate"
            color="#E65100"
          />
          <ScreeningRow
            label="SCORE2 (heart risk)"
            score={SCREENING_SCORES.score2.riskPercent}
            max={20}
            level="Low-moderate"
            color="#2E7D32"
          />
          <ScreeningRow
            label="PHQ-9 (mood)"
            score={SCREENING_SCORES.phq9.score}
            max={SCREENING_SCORES.phq9.maxScore}
            level="Minimal"
            color="#006D3E"
          />
          <ScreeningRow
            label="GAD-7 (anxiety)"
            score={SCREENING_SCORES.gad7.score}
            max={SCREENING_SCORES.gad7.maxScore}
            level="Minimal"
            color="#006D3E"
          />
        </div>
      </div>

      {/* Next blood test card */}
      <div
        style={{
          background: "#95F7B5",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: "#006D3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sun size={24} style={{ color: "#FFFFFF" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
            Next blood test
          </p>
          <p style={{ fontSize: 22, fontWeight: 600, color: "#002110", margin: "2px 0 0" }}>
            September 15
          </p>
          <p style={{ fontSize: 13, color: "#002110", margin: "2px 0 0", opacity: 0.7 }}>
            Comprehensive panel ordered by Dr. Johansson
          </p>
        </div>
      </div>

      {/* FAB - order blood test */}
      <div
        style={{
          position: "fixed",
          bottom: 96,
          right: "max(16px, calc(50% - 215px + 16px))",
          zIndex: 60,
        }}
      >
        <button
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#006D3E",
            border: "none",
            boxShadow: "0 4px 8px rgba(0,109,62,0.3), 0 1px 3px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Plus size={24} style={{ color: "#FFFFFF" }} />
        </button>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function RiskRow({
  icon,
  label,
  sublabel,
  level,
  levelColor,
  pillBg,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  level: string;
  levelColor: string;
  pillBg: string;
  trend: "rising" | "stable" | "falling";
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: "#FAFDFB",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: pillBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: 12, color: "#6F796F", margin: 0 }}>
          {sublabel}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: levelColor,
            background: pillBg,
            padding: "3px 10px",
            borderRadius: 50,
          }}
        >
          {level}
        </span>
        {trend === "rising" && (
          <TrendingUp size={14} style={{ color: "#E65100" }} />
        )}
      </div>
    </div>
  );
}

function MarkerChip({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string;
  unit: string;
  status: "normal" | "borderline" | "abnormal";
}) {
  const borderColor =
    status === "borderline"
      ? "#E65100"
      : status === "abnormal"
        ? "#BA1A1A"
        : "#006D3E";
  const bgColor =
    status === "borderline"
      ? "#FFF3E0"
      : status === "abnormal"
        ? "#FFDAD6"
        : "#ECF5EF";
  return (
    <div
      style={{
        minWidth: 140,
        padding: "12px 14px",
        borderRadius: 16,
        background: bgColor,
        border: `1px solid ${borderColor}33`,
        flexShrink: 0,
      }}
    >
      <p style={{ fontSize: 12, color: "#4F6354", margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: 22, fontWeight: 600, color: "#002110", margin: "4px 0 0" }}>
        {value}
        <span style={{ fontSize: 13, fontWeight: 400, color: "#6F796F", marginLeft: 4 }}>
          {unit}
        </span>
      </p>
    </div>
  );
}

function BioStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: "#FAFDFB",
      }}
    >
      <p style={{ fontSize: 12, color: "#6F796F", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 600, color: "#002110", margin: "2px 0 0" }}>
        {value}
        {unit && (
          <span style={{ fontSize: 13, fontWeight: 400, color: "#6F796F", marginLeft: 3 }}>
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function ScreeningRow({
  label,
  score,
  max,
  level,
  color,
}: {
  label: string;
  score: number;
  max: number;
  level: string;
  color: string;
}) {
  const pct = (score / max) * 100;
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: "#FAFDFB",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 13, color: "#002110", margin: 0, fontWeight: 500 }}>
          {label}
        </p>
        <span style={{ fontSize: 12, color, fontWeight: 500 }}>
          {level}
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 50,
          background: "#DAE8DE",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 50,
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <div className="flex justify-between" style={{ marginTop: 4 }}>
        <span style={{ fontSize: 11, color: "#6F796F" }}>
          {score}/{max}
        </span>
      </div>
    </div>
  );
}
