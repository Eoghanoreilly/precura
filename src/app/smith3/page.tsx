"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Activity,
  Heart,
  Brain,
  Dumbbell,
  Droplet,
  Shield,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Zap,
  Info,
  Sparkles,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  BIOMETRICS_HISTORY,
  TRAINING_PLAN,
  FAMILY_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// SCORING ENGINE
// ============================================================================

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Metabolic sub-score (0-100)
 * Inputs: glucose trend, HbA1c, BMI, FINDRISC, insulin, metabolic syndrome criteria
 */
function computeMetabolicScore(): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];

  // Fasting glucose: 5.8 mmol/L, ref 3.9-6.0
  // Perfect = 4.5, threshold = 6.0, danger = 7.0
  const glucose = 5.8;
  const glucoseScore = clamp(100 - ((glucose - 4.5) / (7.0 - 4.5)) * 100, 0, 100);
  factors.push({
    name: "Blood sugar (fasting)",
    value: `${glucose} mmol/L`,
    score: Math.round(glucoseScore),
    trend: "worsening" as const,
    detail: "Risen from 5.0 to 5.8 over 5 years. Approaching pre-diabetic range (6.1+).",
    changeable: true,
  });

  // HbA1c: 38 mmol/mol, ref 20-42, pre-diabetic starts at 42
  const hba1c = 38;
  const hba1cScore = clamp(100 - ((hba1c - 28) / (48 - 28)) * 100, 0, 100);
  factors.push({
    name: "HbA1c (long-term blood sugar)",
    value: `${hba1c} mmol/mol`,
    score: Math.round(hba1cScore),
    trend: "worsening" as const,
    detail: "Normal range, but risen from 35 to 38 over 4 years. Pre-diabetic threshold is 42.",
    changeable: true,
  });

  // BMI: 27.6, ideal = 22, overweight starts 25, obese 30
  const bmi = 27.6;
  const bmiScore = clamp(100 - ((bmi - 20) / (35 - 20)) * 100, 0, 100);
  factors.push({
    name: "BMI (body mass index)",
    value: `${bmi}`,
    score: Math.round(bmiScore),
    trend: "worsening" as const,
    detail: "Risen from 26.2 to 27.6 over 5 years. Overweight category. Target: below 25.",
    changeable: true,
  });

  // FINDRISC: 12/26 moderate
  const findrisc = 12;
  const findriscScore = clamp(100 - (findrisc / 26) * 100, 0, 100);
  factors.push({
    name: "FINDRISC (diabetes risk tool)",
    value: `${findrisc}/26`,
    score: Math.round(findriscScore),
    trend: "stable" as const,
    detail: "Moderate risk. Family history of diabetes is a key driver that can't be changed.",
    changeable: false,
  });

  // Metabolic syndrome: 2/5 criteria met
  const metSynScore = clamp(100 - (2 / 5) * 120, 0, 100);
  factors.push({
    name: "Metabolic syndrome criteria",
    value: "2 of 5 met",
    score: Math.round(metSynScore),
    trend: "worsening" as const,
    detail: "Blood pressure (on medication) and fasting glucose both flagged. Waist circumference is close to the third threshold.",
    changeable: true,
  });

  const weights = [0.3, 0.25, 0.2, 0.15, 0.1];
  const scores = [glucoseScore, hba1cScore, bmiScore, findriscScore, metSynScore];
  const total = scores.reduce((sum, s, i) => sum + s * weights[i], 0);

  return { score: Math.round(total), factors };
}

/**
 * Cardiovascular sub-score (0-100)
 * Inputs: SCORE2, blood pressure, cholesterol panel, family history
 */
function computeCardiovascularScore(): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];

  // SCORE2: 3% 10-year risk (low-moderate for age 40)
  const score2 = 3;
  const score2Score = clamp(100 - (score2 / 10) * 100, 0, 100);
  factors.push({
    name: "SCORE2 (heart risk calculator)",
    value: `${score2}% 10-year risk`,
    score: Math.round(score2Score),
    trend: "stable" as const,
    detail: "Low-moderate cardiovascular risk for age and sex. Father had a heart attack at 65.",
    changeable: false,
  });

  // Blood pressure: 132/82 on medication
  // Ideal: 120/80, hypertensive: 140/90
  const sysBP = 132;
  const bpScore = clamp(100 - ((sysBP - 110) / (160 - 110)) * 100, 0, 100);
  factors.push({
    name: "Blood pressure",
    value: "132/82 mmHg",
    score: Math.round(bpScore),
    trend: "improving" as const,
    detail: "Controlled with Enalapril 5mg. Was 142/88 before medication. Now stable around 132/82.",
    changeable: true,
  });

  // Total cholesterol: 5.1, ideal <5.0
  const tc = 5.1;
  const tcScore = clamp(100 - ((tc - 3.5) / (7.0 - 3.5)) * 100, 0, 100);
  factors.push({
    name: "Total cholesterol",
    value: `${tc} mmol/L`,
    score: Math.round(tcScore),
    trend: "worsening" as const,
    detail: "Marginally above recommended (5.0). Risen from 4.6 to 5.1 over 5 years.",
    changeable: true,
  });

  // HDL: 1.6 (good!) - higher is better
  const hdl = 1.6;
  const hdlScore = clamp(((hdl - 0.8) / (2.5 - 0.8)) * 100, 0, 100);
  factors.push({
    name: "HDL (good cholesterol)",
    value: `${hdl} mmol/L`,
    score: Math.round(hdlScore),
    trend: "stable" as const,
    detail: "Healthy level. Good cholesterol helps protect against heart disease.",
    changeable: false,
  });

  // LDL: 2.9, ideal <2.6
  const ldl = 2.9;
  const ldlScore = clamp(100 - ((ldl - 1.0) / (5.0 - 1.0)) * 100, 0, 100);
  factors.push({
    name: "LDL (bad cholesterol)",
    value: `${ldl} mmol/L`,
    score: Math.round(ldlScore),
    trend: "stable" as const,
    detail: "Slightly above ideal (2.6) but within normal range (3.0).",
    changeable: true,
  });

  const weights = [0.25, 0.25, 0.2, 0.15, 0.15];
  const scores = [score2Score, bpScore, tcScore, hdlScore, ldlScore];
  const total = scores.reduce((sum, s, i) => sum + s * weights[i], 0);

  return { score: Math.round(total), factors };
}

/**
 * Lifestyle sub-score (0-100)
 * Inputs: training compliance, PHQ-9, GAD-7, vitamin D, weight trend
 */
function computeLifestyleScore(): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];

  // Training: 28/30 sessions (10 weeks * 3/week target)
  const targetSessions = TRAINING_PLAN.currentWeek * 3;
  const compliance = TRAINING_PLAN.totalCompleted / targetSessions;
  const trainingScore = clamp(compliance * 100, 0, 100);
  factors.push({
    name: "Training compliance",
    value: `${TRAINING_PLAN.totalCompleted} of ${targetSessions} sessions`,
    score: Math.round(trainingScore),
    trend: "improving" as const,
    detail: `Week ${TRAINING_PLAN.currentWeek} of ${TRAINING_PLAN.totalWeeks}. ${TRAINING_PLAN.completedThisWeek} of 3 done this week.`,
    changeable: true,
  });

  // PHQ-9: 4/27 minimal depression
  const phq9 = 4;
  const phq9Score = clamp(100 - (phq9 / 27) * 100, 0, 100);
  factors.push({
    name: "PHQ-9 (mood screening)",
    value: `${phq9}/27 - Minimal`,
    score: Math.round(phq9Score),
    trend: "stable" as const,
    detail: "No signs of depression. Minimal score.",
    changeable: true,
  });

  // GAD-7: 3/21 minimal anxiety
  const gad7 = 3;
  const gad7Score = clamp(100 - (gad7 / 21) * 100, 0, 100);
  factors.push({
    name: "GAD-7 (anxiety screening)",
    value: `${gad7}/21 - Minimal`,
    score: Math.round(gad7Score),
    trend: "stable" as const,
    detail: "No signs of anxiety. Minimal score.",
    changeable: true,
  });

  // Vitamin D: 48 nmol/L, ideal >75, deficient <50
  const vitD = 48;
  const vitDScore = clamp(((vitD - 20) / (100 - 20)) * 100, 0, 100);
  factors.push({
    name: "Vitamin D",
    value: `${vitD} nmol/L`,
    score: Math.round(vitDScore),
    trend: "worsening" as const,
    detail: "Below recommended level (50+). Supplementation recommended, especially in Swedish winters.",
    changeable: true,
  });

  // AUDIT-C: 3/12 low risk
  const auditC = 3;
  const auditCScore = clamp(100 - (auditC / 12) * 100, 0, 100);
  factors.push({
    name: "AUDIT-C (alcohol screening)",
    value: `${auditC}/12 - Low risk`,
    score: Math.round(auditCScore),
    trend: "stable" as const,
    detail: "Low risk alcohol use.",
    changeable: true,
  });

  const weights = [0.3, 0.2, 0.2, 0.15, 0.15];
  const scores = [trainingScore, phq9Score, gad7Score, vitDScore, auditCScore];
  const total = scores.reduce((sum, s, i) => sum + s * weights[i], 0);

  return { score: Math.round(total), factors };
}

function computeOverallScore() {
  const metabolic = computeMetabolicScore();
  const cardiovascular = computeCardiovascularScore();
  const lifestyle = computeLifestyleScore();

  // Weights: metabolic most important (diabetes is the key risk), then CV, then lifestyle
  const overall = Math.round(
    metabolic.score * 0.4 + cardiovascular.score * 0.35 + lifestyle.score * 0.25
  );

  return { overall, metabolic, cardiovascular, lifestyle };
}

// ============================================================================
// TYPES
// ============================================================================

interface Factor {
  name: string;
  value: string;
  score: number;
  trend: "improving" | "worsening" | "stable";
  detail: string;
  changeable: boolean;
}

interface SubScore {
  score: number;
  factors: Factor[];
}

// ============================================================================
// SCORE HISTORY (mock - derived from blood test dates)
// ============================================================================

const SCORE_HISTORY = [
  { date: "Apr 2021", score: 76 },
  { date: "Mar 2022", score: 73 },
  { date: "Mar 2023", score: 71 },
  { date: "Mar 2024", score: 69 },
  { date: "Mar 2025", score: 67 },
  { date: "Mar 2026", score: 65 },
];

// ============================================================================
// ANIMATED NUMBER COMPONENT
// ============================================================================

function AnimatedScore({
  target,
  duration = 1200,
  size = "large",
}: {
  target: number;
  duration?: number;
  size?: "large" | "medium" | "small";
}) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration]);

  const fontSize =
    size === "large" ? "8rem" : size === "medium" ? "3rem" : "1.75rem";
  const lineHeight =
    size === "large" ? "1" : size === "medium" ? "1.1" : "1.2";

  return (
    <span
      style={{
        fontSize,
        lineHeight,
        fontWeight: 700,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
        letterSpacing: "-0.04em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {current}
    </span>
  );
}

// ============================================================================
// SCORE COLOR HELPERS
// ============================================================================

function scoreColor(score: number): string {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--amber)";
  return "var(--red)";
}

function scoreColorBg(score: number): string {
  if (score >= 75) return "var(--green-bg)";
  if (score >= 50) return "var(--amber-bg)";
  return "var(--red-bg)";
}

function scoreColorText(score: number): string {
  if (score >= 75) return "var(--green-text)";
  if (score >= 50) return "var(--amber-text)";
  return "var(--red-text)";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 50) return "Needs attention";
  return "Act now";
}

function trendIcon(trend: "improving" | "worsening" | "stable") {
  if (trend === "improving") return <TrendingUp size={14} />;
  if (trend === "worsening") return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

function trendColor(trend: "improving" | "worsening" | "stable"): string {
  if (trend === "improving") return "var(--green-text)";
  if (trend === "worsening") return "var(--red-text)";
  return "var(--text-muted)";
}

// ============================================================================
// RING COMPONENT (like Apple Watch)
// ============================================================================

function ScoreRing({
  score,
  size,
  strokeWidth = 6,
  color,
  bgOpacity = 0.12,
}: {
  score: number;
  size: number;
  strokeWidth?: number;
  color: string;
  bgOpacity?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - animatedScore / 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={bgOpacity}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
    </svg>
  );
}

// ============================================================================
// TREND CHART (mini sparkline area)
// ============================================================================

function TrendChart({ data }: { data: { date: string; score: number }[] }) {
  const width = 320;
  const height = 100;
  const padding = { top: 10, right: 10, bottom: 24, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minScore = Math.min(...data.map((d) => d.score)) - 5;
  const maxScore = Math.max(...data.map((d) => d.score)) + 5;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d.score - minScore) / (maxScore - minScore)) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const gradientId = "trendGrad";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: 320, height: "auto" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity={0.25} />
          <stop offset="100%" stopColor="var(--amber)" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke="var(--amber)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Endpoint dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill="var(--amber)" />
      {/* Labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={points[i].x}
          y={height - 4}
          textAnchor="middle"
          style={{
            fontSize: 9,
            fill: "var(--text-muted)",
            fontFamily: "-apple-system, system-ui, sans-serif",
          }}
        >
          {d.date.replace("20", "'")}
        </text>
      ))}
      {/* Score labels on points */}
      {data.map((d, i) => (
        <text
          key={`s-${i}`}
          x={points[i].x}
          y={points[i].y - 8}
          textAnchor="middle"
          style={{
            fontSize: 10,
            fontWeight: 600,
            fill: i === data.length - 1 ? "var(--amber-text)" : "var(--text-muted)",
            fontFamily: "-apple-system, system-ui, sans-serif",
          }}
        >
          {d.score}
        </text>
      ))}
    </svg>
  );
}

// ============================================================================
// SUB-SCORE CARD
// ============================================================================

function SubScoreCard({
  title,
  icon,
  color,
  score,
  trend,
  factors,
  expanded,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  score: number;
  trend: "improving" | "worsening" | "stable";
  factors: Factor[];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Ring */}
        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <ScoreRing score={score} size={52} strokeWidth={5} color={color} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </div>
        </div>

        {/* Title and score */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              color: "var(--text)",
              fontSize: 15,
              fontFamily: "-apple-system, system-ui, sans-serif",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 2,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 22,
                color,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "-apple-system, system-ui, sans-serif",
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "-apple-system, system-ui, sans-serif",
              }}
            >
              /100
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginLeft: 8,
                color: trendColor(trend),
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {trendIcon(trend)}
              <span style={{ textTransform: "capitalize" }}>{trend}</span>
            </div>
          </div>
        </div>

        {/* Expand chevron */}
        <ChevronRight
          size={18}
          style={{
            color: "var(--text-muted)",
            transition: "transform 0.2s",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Expanded factors */}
      {expanded && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid var(--divider)",
          }}
        >
          <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {factors.map((f, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text)",
                        fontFamily: "-apple-system, system-ui, sans-serif",
                      }}
                    >
                      {f.name}
                    </span>
                    {!f.changeable && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "1px 6px",
                          borderRadius: 6,
                          background: "var(--bg-elevated)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Fixed
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: scoreColorText(f.score),
                        fontFamily: "-apple-system, system-ui, sans-serif",
                      }}
                    >
                      {f.value}
                    </span>
                    <div style={{ color: trendColor(f.trend), display: "flex" }}>
                      {trendIcon(f.trend)}
                    </div>
                  </div>
                </div>
                {/* Score bar */}
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: "var(--bg-elevated)",
                    overflow: "hidden",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${f.score}%`,
                      borderRadius: 3,
                      background: scoreColor(f.score),
                      transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    margin: 0,
                    fontFamily: "-apple-system, system-ui, sans-serif",
                  }}
                >
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ACTION CARD
// ============================================================================

function ActionCard({
  icon,
  title,
  subtitle,
  impact,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  impact: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--text)",
            fontFamily: "-apple-system, system-ui, sans-serif",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "-apple-system, system-ui, sans-serif",
            marginTop: 1,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color,
          padding: "3px 8px",
          borderRadius: 8,
          background: `${color}14`,
          whiteSpace: "nowrap",
          fontFamily: "-apple-system, system-ui, sans-serif",
        }}
      >
        {impact}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function Smith3Page() {
  const scores = computeOverallScore();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const overallTrend: "improving" | "worsening" | "stable" = "worsening";
  const scoreDelta = SCORE_HISTORY[SCORE_HISTORY.length - 1].score - SCORE_HISTORY[SCORE_HISTORY.length - 2].score;

  const metabolicTrend: "improving" | "worsening" | "stable" = "worsening";
  const cvTrend: "improving" | "worsening" | "stable" = "stable";
  const lifestyleTrend: "improving" | "worsening" | "stable" = "improving";

  // Top 3 actions sorted by potential impact
  const topActions = [
    {
      icon: <Dumbbell size={18} />,
      title: "Keep up the training",
      subtitle: "2 of 3 sessions this week. One more to hit your target.",
      impact: "+3 pts",
      color: "var(--green)",
    },
    {
      icon: <Droplet size={18} />,
      title: "Start Vitamin D supplement",
      subtitle: "Your level is 48 - below the 50 threshold. D3 2000 IU daily.",
      impact: "+2 pts",
      color: "var(--blue)",
    },
    {
      icon: <Activity size={18} />,
      title: "Add a post-dinner walk",
      subtitle: "20 minutes after your evening meal helps blood sugar regulation.",
      impact: "+2 pts",
      color: "var(--teal)",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
            {PATIENT.firstName}'s Health
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Precura
          </div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          AB
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 100px" }}>
        {/* ================================================================
            HERO: THE NUMBER
            ================================================================ */}
        <section
          style={{
            textAlign: "center",
            padding: "36px 0 28px",
          }}
        >
          {/* Triple ring background */}
          <div
            style={{
              position: "relative",
              width: 220,
              height: 220,
              margin: "0 auto 20px",
            }}
          >
            {/* Outer ring - Metabolic */}
            <div style={{ position: "absolute", inset: 0 }}>
              <ScoreRing
                score={scores.metabolic.score}
                size={220}
                strokeWidth={10}
                color="var(--amber)"
                bgOpacity={0.08}
              />
            </div>
            {/* Middle ring - Cardiovascular */}
            <div style={{ position: "absolute", inset: 22 }}>
              <ScoreRing
                score={scores.cardiovascular.score}
                size={176}
                strokeWidth={10}
                color="var(--teal)"
                bgOpacity={0.08}
              />
            </div>
            {/* Inner ring - Lifestyle */}
            <div style={{ position: "absolute", inset: 44 }}>
              <ScoreRing
                score={scores.lifestyle.score}
                size={132}
                strokeWidth={10}
                color="var(--green)"
                bgOpacity={0.08}
              />
            </div>
            {/* Center number */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ color: scoreColor(scores.overall) }}>
                <AnimatedScore target={scores.overall} size="small" />
              </div>
            </div>
          </div>

          {/* Score label */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: scoreColorText(scores.overall),
              marginBottom: 4,
            }}
          >
            {scoreLabel(scores.overall)}
          </div>

          {/* Trend badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 20,
              background: scoreColorBg(scores.overall),
              color: scoreColorText(scores.overall),
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {trendIcon(overallTrend)}
            <span>{scoreDelta} pts since last test</span>
          </div>

          {/* Ring legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Metabolic", color: "var(--amber)", score: scores.metabolic.score },
              { label: "Cardiovascular", color: "var(--teal)", score: scores.cardiovascular.score },
              { label: "Lifestyle", color: "var(--green)", score: scores.lifestyle.score },
            ].map((ring) => (
              <div
                key={ring.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: ring.color,
                  }}
                />
                <span>{ring.label}</span>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{ring.score}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            TREND LINE
            ================================================================ */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "18px 18px 14px",
            marginBottom: 20,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              Score trend
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              5 year history
            </div>
          </div>
          <TrendChart data={SCORE_HISTORY} />
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: "10px 0 0",
              textAlign: "center",
            }}
          >
            Your score has gradually declined as blood sugar and weight have crept up.
            The good news: training is reversing the lifestyle component.
          </p>
        </section>

        {/* ================================================================
            SUB-SCORE BREAKDOWNS
            ================================================================ */}
        <section style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 12,
              padding: "0 4px",
            }}
          >
            What makes up your score
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SubScoreCard
              title="Metabolic health"
              icon={<Activity size={20} />}
              color="var(--amber)"
              score={scores.metabolic.score}
              trend={metabolicTrend}
              factors={scores.metabolic.factors}
              expanded={expandedCard === "metabolic"}
              onToggle={() => setExpandedCard(expandedCard === "metabolic" ? null : "metabolic")}
            />
            <SubScoreCard
              title="Cardiovascular health"
              icon={<Heart size={20} />}
              color="var(--teal)"
              score={scores.cardiovascular.score}
              trend={cvTrend}
              factors={scores.cardiovascular.factors}
              expanded={expandedCard === "cardiovascular"}
              onToggle={() => setExpandedCard(expandedCard === "cardiovascular" ? null : "cardiovascular")}
            />
            <SubScoreCard
              title="Lifestyle and wellbeing"
              icon={<Brain size={20} />}
              color="var(--green)"
              score={scores.lifestyle.score}
              trend={lifestyleTrend}
              factors={scores.lifestyle.factors}
              expanded={expandedCard === "lifestyle"}
              onToggle={() => setExpandedCard(expandedCard === "lifestyle" ? null : "lifestyle")}
            />
          </div>
        </section>

        {/* ================================================================
            TOP ACTIONS
            ================================================================ */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              padding: "0 4px",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              How to improve
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--green-text)",
                padding: "3px 10px",
                borderRadius: 10,
                background: "var(--green-bg)",
              }}
            >
              +7 pts possible
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topActions.map((action, i) => (
              <ActionCard key={i} {...action} />
            ))}
          </div>
        </section>

        {/* ================================================================
            QUICK STATS GRID
            ================================================================ */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 12,
              padding: "0 4px",
            }}
          >
            Key numbers
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                label: "Blood sugar (fasting)",
                value: "5.8",
                unit: "mmol/L",
                status: "borderline" as const,
                icon: <Droplet size={16} />,
              },
              {
                label: "HbA1c (long-term sugar)",
                value: "38",
                unit: "mmol/mol",
                status: "normal" as const,
                icon: <Activity size={16} />,
              },
              {
                label: "Blood pressure",
                value: "132/82",
                unit: "mmHg",
                status: "borderline" as const,
                icon: <Heart size={16} />,
              },
              {
                label: "Total cholesterol",
                value: "5.1",
                unit: "mmol/L",
                status: "borderline" as const,
                icon: <Shield size={16} />,
              },
              {
                label: "BMI",
                value: "27.6",
                unit: "",
                status: "borderline" as const,
                icon: <Zap size={16} />,
              },
              {
                label: "Training progress",
                value: `${TRAINING_PLAN.totalCompleted}`,
                unit: "sessions",
                status: "normal" as const,
                icon: <Dumbbell size={16} />,
              },
            ].map((stat, i) => {
              const statusColor =
                stat.status === "normal" ? "var(--green)" : stat.status === "borderline" ? "var(--amber)" : "var(--red)";
              return (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: "14px 14px 12px",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ color: statusColor }}>{stat.icon}</div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        lineHeight: 1.3,
                        fontFamily: "-apple-system, system-ui, sans-serif",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "var(--text)",
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "-apple-system, system-ui, sans-serif",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{stat.unit}</span>
                  </div>
                  {/* Tiny status indicator */}
                  <div
                    style={{
                      marginTop: 6,
                      height: 3,
                      borderRadius: 2,
                      background: `${statusColor}22`,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: stat.status === "normal" ? "85%" : stat.status === "borderline" ? "60%" : "35%",
                        borderRadius: 2,
                        background: statusColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            FAMILY HISTORY CALLOUT
            ================================================================ */}
        <section
          style={{
            background: "var(--amber-bg)",
            border: "1px solid #f9e0b0",
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} style={{ color: "var(--amber-text)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber-text)" }}>
              Family history affects your score
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--amber-text)", lineHeight: 1.6, opacity: 0.85 }}>
            Mother with type 2 diabetes (diagnosed at 58), father with heart attack (at 65).
            These are fixed risk factors, but lifestyle changes can offset much of the risk.
            Your training plan is specifically designed for this.
          </div>
        </section>

        {/* ================================================================
            NEXT STEPS
            ================================================================ */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: 20,
            boxShadow: "var(--shadow-sm)",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Calendar size={16} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              Next up
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--green)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                  Friday training session
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Full Body + Cardio - 1 session left this week
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--blue)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                  Next blood test
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  September 15, 2026 - Score update in ~5 months
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--amber)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                  Training plan ends in 2 weeks
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Week 10 of 12. Renewal consultation coming up.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SCORE METHODOLOGY (collapsed)
            ================================================================ */}
        <details
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <summary
            style={{
              padding: "14px 18px",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              listStyle: "none",
            }}
          >
            <Info size={14} style={{ color: "var(--text-muted)" }} />
            How is my score calculated?
          </summary>
          <div
            style={{
              padding: "0 18px 18px",
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: "0 0 10px" }}>
              Your Precura health score combines clinical data from blood tests, screening tools,
              and biometrics into three sub-scores:
            </p>
            <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
              <li>
                <strong style={{ color: "var(--text-secondary)" }}>Metabolic (40%)</strong> - Fasting glucose,
                HbA1c (long-term blood sugar), BMI, FINDRISC diabetes screening, metabolic syndrome criteria
              </li>
              <li>
                <strong style={{ color: "var(--text-secondary)" }}>Cardiovascular (35%)</strong> - SCORE2
                heart risk, blood pressure, total/HDL/LDL cholesterol, family history
              </li>
              <li>
                <strong style={{ color: "var(--text-secondary)" }}>Lifestyle (25%)</strong> - Training
                compliance, PHQ-9 (mood), GAD-7 (anxiety), Vitamin D, AUDIT-C (alcohol)
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Each factor is scored 0-100 based on where your value sits relative to clinical thresholds.
              The sub-scores are weighted and combined into your overall score. Your score updates
              each time new data comes in - from blood tests, training sessions, or screenings.
            </p>
          </div>
        </details>
      </main>
    </div>
  );
}
