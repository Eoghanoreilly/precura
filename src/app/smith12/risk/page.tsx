"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RISK_ASSESSMENTS,
  FAMILY_HISTORY,
  SCREENING_SCORES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Shield,
  Heart,
  Activity,
  Bone,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Zone Bar
// ---------------------------------------------------------------------------

function ZoneBar({
  value,
  zones,
  unit,
}: {
  value: number;
  zones: { color: string; label: string; start: number; end: number }[];
  unit?: string;
}) {
  const totalRange = zones[zones.length - 1].end;
  const valuePos = Math.min(Math.max((value / totalRange) * 100, 2), 98);

  return (
    <div style={{ position: "relative", marginTop: 12, marginBottom: 8 }}>
      <div className="flex" style={{ height: 10, borderRadius: 5, overflow: "hidden" }}>
        {zones.map((zone, i) => (
          <div
            key={i}
            style={{
              flex: zone.end - zone.start,
              background: zone.color,
            }}
          />
        ))}
      </div>
      {/* Marker */}
      <div
        style={{
          position: "absolute",
          top: -2,
          left: `${valuePos}%`,
          transform: "translateX(-50%)",
          width: 14,
          height: 14,
          borderRadius: 50,
          background: "#FFFFFF",
          border: "3px solid #222222",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
      {/* Labels */}
      <div className="flex justify-between mt-2">
        {zones.map((zone, i) => (
          <span key={i} style={{ fontSize: 9, color: "#717171", flex: zone.end - zone.start, textAlign: "center" }}>
            {zone.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Glucose trend line
// ---------------------------------------------------------------------------

function GlucoseTrendChart() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;

  const w = 340;
  const h = 140;
  const padX = 32;
  const padY = 20;

  const minVal = 4.5;
  const maxVal = 6.5;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (w - padX * 2),
    y: padY + ((maxVal - d.value) / (maxVal - minVal)) * (h - padY * 2),
    value: d.value,
    date: d.date,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${h - padY} L ${points[0].x} ${h - padY} Z`;

  // Zone bands
  const normalY = padY + ((maxVal - 6.0) / (maxVal - minVal)) * (h - padY * 2);
  const preDiabY = padY + ((maxVal - 5.6) / (maxVal - minVal)) * (h - padY * 2);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {/* Zone bands */}
      <rect x={padX} y={padY} width={w - padX * 2} height={normalY - padY} fill="#FFF5F5" rx={0} />
      <rect x={padX} y={normalY} width={w - padX * 2} height={preDiabY - normalY} fill="#FFF7ED" rx={0} />
      <rect x={padX} y={preDiabY} width={w - padX * 2} height={h - padY - preDiabY} fill="#F0FFF4" rx={0} />

      {/* Reference lines */}
      <line x1={padX} y1={normalY} x2={w - padX} y2={normalY} stroke="#EBEBEB" strokeDasharray="4,4" />
      <line x1={padX} y1={preDiabY} x2={w - padX} y2={preDiabY} stroke="#EBEBEB" strokeDasharray="4,4" />

      {/* Labels */}
      <text x={padX - 4} y={normalY + 3} textAnchor="end" fill="#717171" fontSize={9}>6.0</text>
      <text x={padX - 4} y={preDiabY + 3} textAnchor="end" fill="#717171" fontSize={9}>5.6</text>

      {/* Area fill */}
      <defs>
        <linearGradient id="areaGrad12" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF385C" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#FF385C" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad12)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#FF385C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* End dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={5} fill="#FF385C" stroke="#FFFFFF" strokeWidth={2} />

      {/* Year labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={h - 4} textAnchor="middle" fill="#717171" fontSize={9}>
          {new Date(p.date).getFullYear().toString().slice(2)}
        </text>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Factor Pill
// ---------------------------------------------------------------------------

function FactorPill({
  name,
  impact,
  changeable,
}: {
  name: string;
  impact: string;
  changeable: boolean;
}) {
  const impactColor =
    impact === "high" ? "#C13515" :
    impact === "medium" ? "#E07912" :
    impact === "low" ? "#717171" :
    "#008A05";

  const impactBg =
    impact === "high" ? "#FFF5F5" :
    impact === "medium" ? "#FFF7ED" :
    impact === "low" ? "#F7F7F7" :
    "#F0FFF4";

  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid #EBEBEB" }}
    >
      <div className="flex items-center gap-2">
        {changeable ? (
          <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FF385C" }} />
        ) : (
          <div style={{ width: 6, height: 6, borderRadius: 3, background: "#EBEBEB" }} />
        )}
        <span style={{ color: "#222222", fontSize: 13 }}>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {changeable && (
          <span style={{ color: "#FF385C", fontSize: 10, fontWeight: 500 }}>changeable</span>
        )}
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 50,
            background: impactBg,
            color: impactColor,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {impact === "positive" ? "protective" : impact}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expandable risk card
// ---------------------------------------------------------------------------

function RiskDetailCard({
  title,
  icon: Icon,
  riskLevel,
  riskLabel,
  trend,
  tenYearRisk,
  summary,
  keyFactors,
  gradientFrom,
  gradientTo,
  children,
}: {
  title: string;
  icon: React.ElementType;
  riskLevel: string;
  riskLabel: string;
  trend: string;
  tenYearRisk: string;
  summary: string;
  keyFactors: { name: string; changeable: boolean; impact: string }[];
  gradientFrom: string;
  gradientTo: string;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(title.includes("Diabetes"));

  const riskColor =
    riskLevel === "low" ? "#008A05" :
    riskLevel === "moderate" ? "#E07912" :
    riskLevel === "low_moderate" ? "#E07912" :
    "#C13515";

  const TrendIcon =
    trend === "worsening" ? TrendingUp :
    trend === "stable" ? Minus :
    AlertTriangle;

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
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={18} style={{ color: "#222222" }} />
            <p style={{ color: "#222222", fontSize: 17, fontWeight: 600 }}>{title}</p>
          </div>
          {expanded ? (
            <ChevronUp size={18} style={{ color: "#717171" }} />
          ) : (
            <ChevronDown size={18} style={{ color: "#717171" }} />
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p style={{ color: "#222222", fontSize: 32, fontWeight: 700 }}>{tenYearRisk}</p>
            <p style={{ color: "#717171", fontSize: 12 }}>10-year risk</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 50,
                background: "rgba(255,255,255,0.8)",
                color: riskColor,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {riskLabel}
            </span>
            <div className="flex items-center gap-1">
              <TrendIcon size={14} style={{ color: trend === "worsening" ? "#C13515" : trend === "stable" ? "#717171" : "#E07912" }} />
              <span style={{ color: trend === "worsening" ? "#C13515" : "#717171", fontSize: 11, fontWeight: 500 }}>
                {trend}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5">
          {children}

          <p style={{ color: "#717171", fontSize: 13, lineHeight: 1.6, marginBottom: 16, marginTop: 12 }}>
            {summary}
          </p>

          <p style={{ color: "#222222", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Key factors
          </p>
          <div>
            {keyFactors.map((f, i) => (
              <FactorPill key={i} {...f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metabolic syndrome card
// ---------------------------------------------------------------------------

function MetabolicSyndromeCard() {
  const ms = RISK_ASSESSMENTS.metabolicSyndrome;

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
          <Activity size={18} style={{ color: "#222222" }} />
          <p style={{ color: "#222222", fontSize: 17, fontWeight: 600 }}>Metabolic syndrome</p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 50,
                  background: n <= ms.metCount ? "#FF385C" : "#F7F7F7",
                  color: n <= ms.metCount ? "#FFFFFF" : "#717171",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <span style={{ color: "#717171", fontSize: 12, marginLeft: 8 }}>
            {ms.metCount} of {ms.threshold} needed for diagnosis
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {ms.criteria.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3"
              style={{
                borderRadius: 10,
                background: c.met ? "#FFF7ED" : "#F7F7F7",
              }}
            >
              {c.met ? (
                <AlertTriangle size={14} style={{ color: "#E07912", marginTop: 2, flexShrink: 0 }} />
              ) : (
                <CheckCircle size={14} style={{ color: "#008A05", marginTop: 2, flexShrink: 0 }} />
              )}
              <div>
                <p style={{ color: "#222222", fontSize: 13, fontWeight: 500 }}>{c.name}</p>
                <p style={{ color: "#717171", fontSize: 12 }}>
                  {c.value} - {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function RiskPage() {
  return (
    <div>
      {/* Back nav */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link
          href="/smith12"
          style={{
            width: 32,
            height: 32,
            borderRadius: 50,
            border: "1px solid #EBEBEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} style={{ color: "#222222" }} />
        </Link>
        <p style={{ color: "#222222", fontSize: 18, fontWeight: 600 }}>Risk assessments</p>
      </div>

      {/* FINDRISC score */}
      <div className="mx-5 mb-4">
        <div
          className="p-4"
          style={{
            borderRadius: 12,
            background: "#F7F7F7",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>FINDRISC score</p>
              <p style={{ color: "#222222", fontSize: 24, fontWeight: 700 }}>
                {SCREENING_SCORES.findrisc.score}<span style={{ color: "#717171", fontSize: 14, fontWeight: 400 }}>/{SCREENING_SCORES.findrisc.maxScore}</span>
              </p>
            </div>
            <div>
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>SCORE2</p>
              <p style={{ color: "#222222", fontSize: 24, fontWeight: 700 }}>
                {SCREENING_SCORES.score2.riskPercent}<span style={{ color: "#717171", fontSize: 14, fontWeight: 400 }}>%</span>
              </p>
            </div>
            <div>
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>PHQ-9</p>
              <p style={{ color: "#222222", fontSize: 24, fontWeight: 700 }}>
                {SCREENING_SCORES.phq9.score}<span style={{ color: "#717171", fontSize: 14, fontWeight: 400 }}>/{SCREENING_SCORES.phq9.maxScore}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diabetes - expanded by default */}
      <RiskDetailCard
        title="Diabetes (type 2)"
        icon={Shield}
        riskLevel={RISK_ASSESSMENTS.diabetes.riskLevel}
        riskLabel={RISK_ASSESSMENTS.diabetes.riskLabel}
        trend={RISK_ASSESSMENTS.diabetes.trend}
        tenYearRisk={RISK_ASSESSMENTS.diabetes.tenYearRisk}
        summary={RISK_ASSESSMENTS.diabetes.summary}
        keyFactors={RISK_ASSESSMENTS.diabetes.keyFactors}
        gradientFrom="#FFF7ED"
        gradientTo="#FFF0E6"
      >
        <GlucoseTrendChart />
      </RiskDetailCard>

      {/* Cardiovascular */}
      <RiskDetailCard
        title="Cardiovascular"
        icon={Heart}
        riskLevel={RISK_ASSESSMENTS.cardiovascular.riskLevel}
        riskLabel={RISK_ASSESSMENTS.cardiovascular.riskLabel}
        trend={RISK_ASSESSMENTS.cardiovascular.trend}
        tenYearRisk={RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
        summary={RISK_ASSESSMENTS.cardiovascular.summary}
        keyFactors={RISK_ASSESSMENTS.cardiovascular.keyFactors}
        gradientFrom="#EFF6FF"
        gradientTo="#E6F7FF"
      />

      {/* Bone health */}
      <RiskDetailCard
        title="Bone health"
        icon={Bone}
        riskLevel={RISK_ASSESSMENTS.bone.riskLevel}
        riskLabel={RISK_ASSESSMENTS.bone.riskLabel}
        trend={RISK_ASSESSMENTS.bone.trend}
        tenYearRisk={RISK_ASSESSMENTS.bone.tenYearRisk}
        summary={RISK_ASSESSMENTS.bone.summary}
        keyFactors={RISK_ASSESSMENTS.bone.keyFactors}
        gradientFrom="#F0FFF4"
        gradientTo="#E6FFED"
      />

      {/* Metabolic syndrome */}
      <MetabolicSyndromeCard />

      {/* Family history */}
      <div
        className="mx-5 mb-6"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div className="p-5">
          <p style={{ color: "#222222", fontSize: 17, fontWeight: 600, marginBottom: 12 }}>
            Family history
          </p>
          <div className="flex flex-col gap-3">
            {FAMILY_HISTORY.map((fh, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 50,
                    background: fh.condition.includes("Diabetes") ? "#FFF7ED" : "#FFF5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {fh.condition.includes("Diabetes") ? (
                    <Shield size={14} style={{ color: "#E07912" }} />
                  ) : (
                    <Heart size={14} style={{ color: "#C13515" }} />
                  )}
                </div>
                <div>
                  <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>{fh.relative}</p>
                  <p style={{ color: "#717171", fontSize: 12 }}>
                    {fh.condition}, diagnosed at {fh.ageAtDiagnosis}
                  </p>
                  <p style={{ color: "#717171", fontSize: 11 }}>{fh.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
