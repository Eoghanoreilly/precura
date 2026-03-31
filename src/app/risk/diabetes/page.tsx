"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Dumbbell,
  Scale,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  TestTube,
  MessageCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import {
  getOrMockFindriscResult,
  getOrMockFindriscInputs,
  MOCK_SCORE_HISTORY,
} from "@/lib/mock-data";
import {
  FindriscResult,
  FindriscInputs,
  getRiskColor,
  MAX_SCORE,
  whatIf,
} from "@/lib/findrisc";
import { getUser } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ZONES = [
  { min: 0, max: 6, label: "Low", color: "var(--green)", risk: "~1%" },
  { min: 7, max: 11, label: "Slight", color: "var(--teal)", risk: "~4%" },
  { min: 12, max: 14, label: "Moderate", color: "var(--amber)", risk: "~17%" },
  { min: 15, max: 20, label: "High", color: "var(--red)", risk: "~33%" },
  { min: 21, max: 26, label: "Very High", color: "var(--red)", risk: "~50%" },
];

const MODIFIABLE_FACTORS = [
  { key: "bmi", label: "BMI (body mass index)", maxPoints: 3 },
  { key: "waist", label: "Waist", maxPoints: 4 },
  { key: "activity", label: "Physical activity", maxPoints: 2 },
  { key: "diet", label: "Daily fruit/veg", maxPoints: 1 },
] as const;

const FIXED_FACTORS = [
  { key: "age", label: "Age", maxPoints: 4 },
  { key: "family", label: "Family history", maxPoints: 5 },
  { key: "glucose", label: "Blood glucose history", maxPoints: 5 },
  { key: "bloodPressure", label: "BP medication", maxPoints: 2 },
] as const;

const BLOOD_MARKERS = [
  { name: "HbA1c (long-term blood sugar)", value: 38, unit: "mmol/mol", min: 20, max: 50, refMin: 20, refMax: 42, status: "normal" as const },
  { name: "Fasting Glucose (blood sugar)", value: 5.4, unit: "mmol/L", min: 3, max: 8, refMin: 3.9, refMax: 6.0, status: "borderline" as const },
  { name: "Fasting Insulin", value: 12, unit: "mU/L", min: 0, max: 30, refMin: 2, refMax: 25, status: "normal" as const },
];

const PEER_DATA = {
  percentile: 42,
  averageScore: 8,
  peerGroup: "Women aged 35-45 in Sweden",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function riskColorVar(level: FindriscResult["riskLevel"]): string {
  return `var(--${getRiskColor(level)})`;
}

function riskBgVar(level: FindriscResult["riskLevel"]): string {
  return `var(--${getRiskColor(level)}-bg)`;
}

function riskTextVar(level: FindriscResult["riskLevel"]): string {
  return `var(--${getRiskColor(level)}-text)`;
}

function getZoneForScore(score: number) {
  return ZONES.find((z) => score >= z.min && score <= z.max) || ZONES[0];
}

// ---------------------------------------------------------------------------
// ECharts bell curve data generator
// ---------------------------------------------------------------------------

function generateBellCurve(mean: number, stdDev: number, max: number): [number, number][] {
  const points: [number, number][] = [];
  for (let x = 0; x <= max; x += 0.5) {
    const y = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    points.push([x, y]);
  }
  return points;
}

// ---------------------------------------------------------------------------
// Score Zone Bar - the hero visual
// ---------------------------------------------------------------------------

function ScoreZoneBar({
  score,
  projectedScore,
  compact,
  triangleMarker,
}: {
  score: number;
  projectedScore?: number;
  compact?: boolean;
  triangleMarker?: boolean;
}) {
  const activeZone = getZoneForScore(score);
  const total = MAX_SCORE;
  const scorePct = (score / total) * 100;
  const projectedPct =
    projectedScore !== undefined ? (projectedScore / total) * 100 : null;
  const zoneColors = ["#4caf50", "#26a69a", "#ff9800", "#ef5350", "#c62828"];
  const zoneWidths = ["27%", "19%", "12%", "23%", "19%"];
  const zoneLabels = ["Low", "Slight", "Mod", "High", "V.High"];
  const dotBorderColor =
    activeZone.label === "Low" ? "#4caf50"
    : activeZone.label === "Slight" ? "#26a69a"
    : activeZone.label === "Moderate" ? "#ff9800"
    : activeZone.label === "High" ? "#ef5350"
    : "#c62828";

  return (
    <div className="w-full">
      {/* Zone bar */}
      <div style={{ display: "flex", height: 20, borderRadius: 10, overflow: "hidden", position: "relative" }}>
        {zoneColors.map((color, i) => (
          <div key={i} style={{ width: zoneWidths[i], background: color }} />
        ))}

        {/* Score dot marker */}
        <div
          style={{
            position: "absolute",
            left: `${scorePct}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            border: `3px solid ${dotBorderColor}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            transition: "left 0.4s ease",
            zIndex: 2,
          }}
        />

        {/* Projected score dot marker */}
        {projectedPct !== null && projectedScore !== score && (() => {
          const projZone = getZoneForScore(projectedScore!);
          const projDotColor =
            projZone.label === "Low" ? "#4caf50"
            : projZone.label === "Slight" ? "#26a69a"
            : projZone.label === "Moderate" ? "#ff9800"
            : projZone.label === "High" ? "#ef5350"
            : "#c62828";
          return (
            <div
              style={{
                position: "absolute",
                left: `${projectedPct}%`,
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#fff",
                border: `3px solid ${projDotColor}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "left 0.4s ease",
                opacity: 0.7,
                zIndex: 1,
              }}
            />
          );
        })()}
      </div>

      {/* Triangle marker below bar */}
      {triangleMarker && (
        <div style={{ position: "relative", height: 12 }}>
          <div
            style={{
              position: "absolute",
              left: `${scorePct}%`,
              top: 2,
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderBottom: `9px solid ${dotBorderColor}`,
              transition: "left 0.4s ease",
            }}
          />
        </div>
      )}

      {/* Zone labels */}
      {!compact && !triangleMarker && (
        <div className="flex mt-2">
          {zoneLabels.map((label, i) => {
            const isActive = i === ZONES.findIndex((z) => z.label === activeZone.label);
            return (
              <div
                key={i}
                className="text-center"
                style={{ width: zoneWidths[i] }}
              >
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? "var(--text)" : "var(--text-faint)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Peer Comparison Bell Curve
// ---------------------------------------------------------------------------

function PeerComparison({ score }: { score: number }) {
  const percentile = PEER_DATA.percentile;
  const zone = getZoneForScore(score);
  const userRiskLevel =
    zone.label === "Low"
      ? "low"
      : zone.label === "Slight"
        ? "slightly_elevated"
        : zone.label === "Moderate"
          ? "moderate"
          : zone.label === "High"
            ? "high"
            : "very_high";
  const userColor = riskColorVar(userRiskLevel as FindriscResult["riskLevel"]);
  const avg = PEER_DATA.averageScore;

  const userY = Math.exp(-0.5 * Math.pow((score - avg) / 4, 2));

  const bellCurveOption = {
    grid: { top: 36, right: 20, bottom: 12, left: 20 },
    xAxis: {
      type: "value" as const,
      min: 0,
      max: MAX_SCORE,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
    },
    yAxis: { type: "value" as const, show: false },
    tooltip: { show: false },
    series: [
      {
        type: "line" as const,
        smooth: 0.6,
        symbol: "none",
        sampling: "lttb" as const,
        lineStyle: {
          width: 2.5,
          color: {
            type: "linear" as const,
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: "#4caf50" },
              { offset: 0.27, color: "#26a69a" },
              { offset: 0.46, color: "#ff9800" },
              { offset: 0.7, color: "#ef5350" },
              { offset: 1, color: "#c62828" },
            ],
          },
        },
        areaStyle: {
          color: {
            type: "linear" as const,
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: "rgba(76,175,80,0.15)" },
              { offset: 0.27, color: "rgba(38,166,154,0.12)" },
              { offset: 0.46, color: "rgba(255,152,0,0.10)" },
              { offset: 0.7, color: "rgba(239,83,80,0.08)" },
              { offset: 1, color: "rgba(198,40,40,0.05)" },
            ],
          },
        },
        data: generateBellCurve(avg, 4, MAX_SCORE),
        markLine: {
          silent: true,
          symbol: "none",
          data: [
            {
              xAxis: avg,
              lineStyle: { color: "#9e9e9e", width: 1.5, type: "dashed" as const },
              label: { formatter: "Avg (age 35-45)", position: "insideEndTop" as const, fontSize: 10, fontWeight: 600, color: "#9e9e9e", padding: [0, 0, 0, 4] },
            },
          ],
        },
        markPoint: {
          symbol: "circle",
          symbolSize: 16,
          data: [
            {
              coord: [score, userY],
              itemStyle: {
                color: userColor,
                borderColor: "#fff",
                borderWidth: 3,
                shadowColor: "rgba(0,0,0,0.2)",
                shadowBlur: 8,
              },
              label: { show: true, formatter: "You", position: "top" as const, distance: 10, fontSize: 11, fontWeight: 700, color: userColor },
            },
          ],
          animation: true,
          animationDuration: 600,
          animationEasing: "elasticOut" as const,
        },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: "cubicOut" as const,
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users size={14} style={{ color: "var(--text-muted)" }} />
        <span
          className="text-[11px] font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Peer comparison
        </span>
      </div>

      {/* ECharts bell curve */}
      <ReactECharts
        option={bellCurveOption}
        notMerge={true}
        style={{ height: "140px" }}
      />

      <p
        className="text-xs mt-2"
        style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
      >
        Your score is better than{" "}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--text)",
            fontWeight: 600,
          }}
        >
          {percentile}%
        </span>{" "}
        of {PEER_DATA.peerGroup.toLowerCase()}.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Factor Bar
// ---------------------------------------------------------------------------

function FactorBar({
  label,
  points,
  maxPoints,
  modifiable,
  onClick,
}: {
  label: string;
  points: number;
  maxPoints: number;
  modifiable?: boolean;
  onClick?: () => void;
}) {
  const fillPct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  const barColor =
    points === 0
      ? "var(--green)"
      : points <= maxPoints * 0.5
        ? "var(--amber)"
        : "var(--red)";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2.5"
      style={{
        borderBottom: "1px solid var(--divider)",
        cursor: onClick ? "pointer" : "default",
        background: "transparent",
        border: "none",
        borderBlockEnd: "1px solid var(--divider)",
        padding: "10px 0",
        textAlign: "left",
      }}
    >
      <span
        className="text-xs font-medium flex-shrink-0"
        style={{
          color: modifiable ? "var(--text)" : "var(--text-secondary)",
          width: "150px",
        }}
      >
        {label}
      </span>

      {/* Bar track */}
      <div className="flex-1 relative">
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-elevated)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${fillPct}%`,
              background: barColor,
              transition: "width 0.4s ease",
              minWidth: points > 0 ? "8px" : "0",
            }}
          />
        </div>
        {/* Capacity ticks */}
        <div className="absolute inset-0 flex items-center">
          {Array.from({ length: maxPoints }).map((_, i) => (
            <div
              key={i}
              className="h-2.5"
              style={{
                position: "absolute",
                left: `${((i + 1) / maxPoints) * 100}%`,
                width: "1px",
                background: "var(--divider)",
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      </div>

      <span
        className="text-xs font-bold w-8 text-right flex-shrink-0"
        style={{
          fontFamily: "var(--font-mono)",
          color: points === 0 ? "var(--green-text)" : "var(--text-secondary)",
        }}
      >
        {points}/{maxPoints}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Blood Marker Range Bar
// ---------------------------------------------------------------------------

function BloodMarkerBar({
  name,
  value,
  unit,
  min,
  max,
  refMin,
  refMax,
  status,
}: {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  refMin: number;
  refMax: number;
  status: "normal" | "borderline";
}) {
  const statusColor =
    status === "normal" ? "var(--green)" : "var(--amber)";
  const range = max - min;
  const refMinPct = ((refMin - min) / range) * 100;
  const refMaxPct = ((refMax - min) / range) * 100;
  const valuePct = ((value - min) / range) * 100;

  return (
    <div className="py-3" style={{ borderBottom: "1px solid var(--divider)" }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
          {name}
        </span>
        <span
          className="text-xs font-bold"
          style={{
            fontFamily: "var(--font-mono)",
            color:
              status === "normal"
                ? "var(--green-text)"
                : "var(--amber-text)",
          }}
        >
          {value} {unit}
        </span>
      </div>

      {/* Range bar with green zone + triangle marker */}
      <div style={{ position: "relative", height: 12, borderRadius: 6, background: "#f5f5f5" }}>
        {/* Reference range highlight */}
        <div
          style={{
            position: "absolute",
            left: `${refMinPct}%`,
            width: `${refMaxPct - refMinPct}%`,
            height: "100%",
            borderRadius: 6,
            background: "rgba(76,175,80,0.15)",
            border: "1px solid rgba(76,175,80,0.3)",
          }}
        />
        {/* Triangle value marker */}
        <div style={{ position: "absolute", left: `${valuePct}%`, top: -7, transform: "translateX(-50%)" }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `8px solid ${statusColor}`,
            }}
          />
        </div>
      </div>

      {/* Min/max labels */}
      <div
        className="flex justify-between mt-1"
        style={{
          fontSize: 9,
          fontFamily: "var(--font-mono)",
          color: "var(--text-faint)",
        }}
      >
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function DiabetesRiskPage() {
  const router = useRouter();
  const [result, setResult] = useState<FindriscResult | null>(null);
  const [inputs, setInputs] = useState<FindriscInputs | null>(null);
  const [loading, setLoading] = useState(true);
  const [rawDataOpen, setRawDataOpen] = useState(false);

  // What-if state
  const [wiWeight, setWiWeight] = useState<number>(0);
  const [wiActivity, setWiActivity] = useState<boolean>(false);
  const [wiDiet, setWiDiet] = useState<boolean>(false);
  const [wiResult, setWiResult] = useState<FindriscResult | null>(null);

  const whatIfRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const loadedInputs = getOrMockFindriscInputs();
    const loadedResult = getOrMockFindriscResult();
    setInputs(loadedInputs);
    setResult(loadedResult);
    setWiWeight(loadedInputs.weightKg);
    setWiActivity(loadedInputs.physicalActivity);
    setWiDiet(loadedInputs.dailyFruitVeg);
    setLoading(false);
  }, [router]);

  // Recalculate what-if
  const recalcWhatIf = useCallback(() => {
    if (!inputs) return;
    const newResult = whatIf(inputs, {
      weightKg: wiWeight,
      physicalActivity: wiActivity,
      dailyFruitVeg: wiDiet,
    });
    setWiResult(newResult);
  }, [inputs, wiWeight, wiActivity, wiDiet]);

  useEffect(() => {
    recalcWhatIf();
  }, [recalcWhatIf]);

  const scrollToWhatIf = () => {
    whatIfRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading || !result || !inputs) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <Activity size={24} className="animate-pulse-slow" style={{ color: "var(--purple)" }} />
      </div>
    );
  }

  const scoreDiff = wiResult ? wiResult.score - result.score : 0;
  const activeZone = getZoneForScore(result.score);

  return (
    <div className="min-h-dvh pb-10" style={{ background: "var(--bg)" }}>
      {/* ================================================================== */}
      {/* 1. BACK NAVIGATION */}
      {/* ================================================================== */}
      <header
        className="animate-fade-in sticky top-0 z-10 flex items-center gap-3 px-5 py-4"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </Link>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Diabetes Risk
        </p>
      </header>

      <main className="px-5 max-w-md mx-auto">
        {/* ================================================================== */}
        {/* 2. VISUAL SCORE ZONE - the hero */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-1 mt-6" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Risk level name - prominent */}
            <p
              className="text-xs mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Your Risk Level
            </p>
            <h2
              className="text-xl font-bold mb-4"
              style={{
                color: activeZone.label === "Low" ? "#4caf50"
                  : activeZone.label === "Slight" ? "#26a69a"
                  : activeZone.label === "Moderate" ? "#ff9800"
                  : activeZone.label === "High" ? "#ef5350"
                  : "#c62828",
              }}
            >
              {result.riskLabel}
            </h2>

            {/* Zone bar with triangle marker */}
            <ScoreZoneBar score={result.score} triangleMarker />

            {/* Probability text below zone bar */}
            <p
              className="text-xs mt-3"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              ~{activeZone.risk === "~1%" ? "1" : activeZone.risk === "~4%" ? "4" : activeZone.risk === "~17%" ? "17" : activeZone.risk === "~33%" ? "33" : "50"}% chance of developing Type 2 diabetes in 10 years
            </p>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. PEER COMPARISON */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-2 mt-4" style={{ opacity: 0 }}>
          <PeerComparison score={result.score} />
        </section>

        {/* ================================================================== */}
        {/* 4. FACTOR BREAKDOWN */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-2 mt-5" style={{ opacity: 0 }}>
          {/* Modifiable */}
          <div
            className="rounded-2xl p-5 mb-3"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--green)" }}
              />
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--green-text)" }}
              >
                Things you can change
              </span>
            </div>

            {MODIFIABLE_FACTORS.filter(
              (f) => result.breakdown[f.key].points > 0
            ).map((f) => (
              <FactorBar
                key={f.key}
                label={f.label}
                points={result.breakdown[f.key].points}
                maxPoints={f.maxPoints}
                modifiable
                onClick={scrollToWhatIf}
              />
            ))}
            {MODIFIABLE_FACTORS.every(
              (f) => result.breakdown[f.key].points === 0
            ) && (
              <p className="text-xs py-2" style={{ color: "var(--green-text)" }}>
                All lifestyle factors looking good
              </p>
            )}
          </div>

          {/* Fixed */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Lock size={12} style={{ color: "var(--text-faint)" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Fixed factors
              </span>
            </div>

            {FIXED_FACTORS.filter(
              (f) => result.breakdown[f.key].points > 0
            ).map((f) => (
              <FactorBar
                key={f.key}
                label={f.label}
                points={result.breakdown[f.key].points}
                maxPoints={f.maxPoints}
              />
            ))}
            {FIXED_FACTORS.every(
              (f) => result.breakdown[f.key].points === 0
            ) && (
              <p className="text-xs py-2" style={{ color: "var(--text-muted)" }}>
                No fixed risk factors
              </p>
            )}
          </div>
        </section>

        {/* ================================================================== */}
        {/* 5. WHAT-IF EXPLORER */}
        {/* ================================================================== */}
        <section
          ref={whatIfRef}
          className="animate-fade-in stagger-3 mt-5"
          style={{ opacity: 0 }}
        >
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} style={{ color: "var(--purple)" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--purple-text)" }}
              >
                What if you changed...
              </span>
            </div>

            {/* Weight slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale size={14} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    Weight
                  </span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: wiWeight !== inputs.weightKg ? "var(--purple)" : "var(--text-secondary)",
                  }}
                >
                  {wiWeight} kg
                </span>
              </div>
              <input
                type="range"
                min={Math.max(inputs.weightKg - 10, 40)}
                max={inputs.weightKg + 5}
                step={1}
                value={wiWeight}
                onChange={(e) => setWiWeight(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--purple)" }}
              />
              <div
                className="flex justify-between text-[10px] mt-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-faint)",
                }}
              >
                <span>{Math.max(inputs.weightKg - 10, 40)} kg</span>
                <span>{inputs.weightKg + 5} kg</span>
              </div>
            </div>

            {/* Lifestyle improvements toggle (combines activity + diet) */}
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell size={14} style={{ color: "var(--text-secondary)" }} />
                  <div>
                    <span className="text-sm font-medium block" style={{ color: "var(--text)" }}>
                      Lifestyle improvements
                    </span>
                    <span className="text-[11px] block mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Regular activity + balanced diet
                    </span>
                    <span className="text-[10px] block" style={{ color: "var(--text-faint)" }}>
                      At least 30 min movement daily and regular fruit/veg intake
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { setWiActivity(!wiActivity); setWiDiet(!wiDiet); }}
                  className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{
                    background: (wiActivity && wiDiet) ? "var(--purple)" : "var(--bg-elevated)",
                    border: (wiActivity && wiDiet) ? "none" : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      background: (wiActivity && wiDiet) ? "#fff" : "var(--text-faint)",
                      left: (wiActivity && wiDiet) ? "calc(100% - 22px)" : "2px",
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mb-4" style={{ background: "var(--divider)" }} />

            {/* Mini score bar with both markers */}
            {wiResult && (
              <>
                <ScoreZoneBar
                  score={result.score}
                  projectedScore={wiResult.score}
                  compact
                />

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: riskBgVar(result.riskLevel),
                          color: riskTextVar(result.riskLevel),
                        }}
                      >
                        {getZoneForScore(result.score).label}
                      </span>
                      <span style={{ color: "var(--text-faint)", fontSize: 12 }}>-&gt;</span>
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: scoreDiff !== 0 ? (scoreDiff < 0 ? "var(--green-bg)" : "var(--red-bg)") : riskBgVar(wiResult.riskLevel),
                          color: scoreDiff !== 0 ? (scoreDiff < 0 ? "var(--green-text)" : "var(--red-text)") : riskTextVar(wiResult.riskLevel),
                        }}
                      >
                        {getZoneForScore(wiResult.score).label}
                      </span>
                      {scoreDiff !== 0 && (
                        <span
                          className="text-[10px] font-bold"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: scoreDiff < 0 ? "var(--green-text)" : "var(--red-text)",
                          }}
                        >
                          {scoreDiff < 0 ? "" : "+"}{scoreDiff} pts
                        </span>
                      )}
                    </div>
                    {scoreDiff < 0 && (
                      <TrendingDown size={16} style={{ color: "var(--green)" }} />
                    )}
                    {scoreDiff > 0 && (
                      <TrendingUp size={16} style={{ color: "var(--red)" }} />
                    )}
                  </div>
                  <p
                    className="text-[10px] mt-1.5"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)" }}
                  >
                    Score {result.score} -&gt; {wiResult.score} out of {MAX_SCORE}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ================================================================== */}
        {/* 6. RELATED BLOOD MARKERS */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-4 mt-5" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TestTube size={14} style={{ color: "var(--blue)" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--blue-text)" }}
              >
                Related blood markers
              </span>
            </div>

            {BLOOD_MARKERS.map((marker) => (
              <BloodMarkerBar key={marker.name} {...marker} />
            ))}

            <Link
              href="/blood-tests"
              className="flex items-center gap-1.5 mt-3 text-xs font-medium"
              style={{ color: "var(--accent)" }}
            >
              Order blood tests
              <ExternalLink size={12} />
            </Link>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 7. TREND CHART */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-4 mt-5" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Score over time
            </span>

            <ReactECharts
              notMerge={true}
              style={{ height: "220px", marginTop: 12 }}
              opts={{ renderer: "svg" }}
              option={{
                grid: { top: 24, right: 16, bottom: 32, left: 44 },
                xAxis: {
                  type: "category",
                  data: MOCK_SCORE_HISTORY.map((d) => d.date),
                  axisLabel: { fontSize: 10, fontFamily: "var(--font-mono)", color: "#8b8da3" },
                  axisLine: { show: false },
                  axisTick: { show: false },
                },
                yAxis: {
                  type: "value",
                  min: 0,
                  max: MAX_SCORE,
                  axisLabel: { fontSize: 10, fontFamily: "var(--font-mono)", color: "#8b8da3" },
                  splitLine: { show: false },
                  axisLine: { show: false },
                  axisTick: { show: false },
                },
                series: [
                  {
                    type: "line",
                    smooth: 0.3,
                    data: MOCK_SCORE_HISTORY.map((d) => d.score),
                    lineStyle: {
                      width: 3,
                      color: {
                        type: "linear" as const,
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                          { offset: 0, color: "#4caf50" },
                          { offset: 1, color: "#ff9800" },
                        ],
                      },
                    },
                    areaStyle: { opacity: 0 },
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: (params: { dataIndex: number }) => {
                      const val = MOCK_SCORE_HISTORY[params.dataIndex]?.score ?? 0;
                      const z = getZoneForScore(val);
                      const c = z.label === "Low" ? "#4caf50" : z.label === "Slight" ? "#26a69a" : z.label === "Moderate" ? "#ff9800" : z.label === "High" ? "#ef5350" : "#c62828";
                      return { color: "#fff", borderColor: c, borderWidth: 3, shadowColor: "rgba(0,0,0,0.15)", shadowBlur: 4 };
                    },
                    emphasis: {
                      itemStyle: { borderWidth: 3, shadowBlur: 8 },
                    },
                    markArea: {
                      silent: true,
                      data: [
                        [{ yAxis: 0, itemStyle: { color: "rgba(76,175,80,0.06)" } }, { yAxis: 7 }],
                        [{ yAxis: 7, itemStyle: { color: "rgba(38,166,154,0.06)" } }, { yAxis: 12 }],
                        [{ yAxis: 12, itemStyle: { color: "rgba(255,152,0,0.08)" } }, { yAxis: 15 }],
                        [{ yAxis: 15, itemStyle: { color: "rgba(239,83,80,0.06)" } }, { yAxis: MAX_SCORE }],
                      ],
                    },
                  },
                ],
                tooltip: {
                  trigger: "axis" as const,
                  backgroundColor: "#fff",
                  borderColor: "#e6e8ed",
                  borderRadius: 12,
                  padding: [10, 14],
                  textStyle: { fontFamily: "var(--font-mono)", fontSize: 12, color: "#1a1a2e" },
                  axisPointer: { type: "line" as const, lineStyle: { color: "#e6e8ed", type: "dashed" as const } },
                  formatter: (params: Array<{ name: string; value: number }>) => {
                    const p = params[0];
                    if (!p) return "";
                    const scoreVal = p.value;
                    const z = getZoneForScore(scoreVal);
                    return `<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">${p.name}</div><div style="font-weight:bold;font-size:14px">${scoreVal} / ${MAX_SCORE}</div><div style="font-size:10px;font-weight:600;color:${z.color};margin-top:2px">${z.label} risk (${z.risk})</div>`;
                  },
                },
                animation: true,
              }}
            />
          </div>
        </section>

        {/* ================================================================== */}
        {/* 8. EXPANDABLE RAW DATA */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-5 mt-5" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <button
              onClick={() => setRawDataOpen(!rawDataOpen)}
              className="w-full flex items-center justify-between p-5"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                View detailed data
              </span>
              {rawDataOpen ? (
                <ChevronUp size={16} style={{ color: "var(--text-muted)" }} />
              ) : (
                <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
              )}
            </button>

            {rawDataOpen && (
              <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--divider)" }}>
                {/* Factor table */}
                <table className="w-full mt-4">
                  <thead>
                    <tr>
                      <th
                        className="text-left text-[10px] font-semibold uppercase pb-2"
                        style={{ color: "var(--text-faint)" }}
                      >
                        Factor
                      </th>
                      <th
                        className="text-right text-[10px] font-semibold uppercase pb-2"
                        style={{ color: "var(--text-faint)" }}
                      >
                        Value
                      </th>
                      <th
                        className="text-right text-[10px] font-semibold uppercase pb-2"
                        style={{ color: "var(--text-faint)" }}
                      >
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.breakdown).map(([key, factor]) => (
                      <tr
                        key={key}
                        style={{ borderBottom: "1px solid var(--divider)" }}
                      >
                        <td
                          className="text-xs py-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {factor.label}
                        </td>
                        <td
                          className="text-xs py-2 text-right"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {typeof factor.value === "boolean"
                            ? factor.value
                              ? "Yes"
                              : "No"
                            : String(factor.value)}
                        </td>
                        <td
                          className="text-xs py-2 text-right font-bold"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: factor.points > 0 ? "var(--text)" : "var(--text-faint)",
                          }}
                        >
                          {factor.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div
                  className="mt-4 p-3 rounded-lg"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--text-muted)" }}>Total score</span>
                    <span
                      className="font-bold"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
                    >
                      {result.score} / {MAX_SCORE}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--text-muted)" }}>Risk category</span>
                    <span className="font-medium" style={{ color: riskColorVar(result.riskLevel) }}>
                      {result.riskLabel}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>10-year probability</span>
                    <span
                      className="font-bold"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
                    >
                      {result.tenYearRisk}
                    </span>
                  </div>
                </div>

                {/* FINDRISC reference */}
                <div className="mt-3 text-[11px]" style={{ color: "var(--text-faint)" }}>
                  <p style={{ fontFamily: "var(--font-mono)" }}>
                    FINDRISC - Finnish Diabetes Risk Score
                  </p>
                  <a
                    href="https://doi.org/10.2337/diacare.26.3.725"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1"
                    style={{ color: "var(--accent)" }}
                  >
                    Lindstrom & Tuomilehto, Diabetes Care 2003
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================== */}
        {/* 9. CARE PACKAGE UPSELL */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-5 mt-5" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--accent-light)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="text-sm font-semibold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              Want expert guidance?
            </p>
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Get your blood tested and discuss results with Dr. Johansson, plus
              receive a personalized activity plan.
            </p>
            <Link
              href="/blood-tests"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
              style={{
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Complete Health Package - 1,895 SEK
              <ExternalLink size={12} />
            </Link>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 10. AI ENTRY */}
        {/* ================================================================== */}
        <section className="animate-fade-in stagger-5 mt-5" style={{ opacity: 0 }}>
          <Link
            href="/chat"
            className="flex items-center gap-3 w-full p-4 rounded-2xl"
            style={{
              background: "var(--purple)",
              color: "#fff",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <MessageCircle size={18} style={{ color: "#fff" }} />
            </div>
            <span className="text-sm font-semibold">
              Ask about your diabetes risk
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
