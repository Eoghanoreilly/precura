"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Dumbbell,
  Apple,
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
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  getOrMockFindriscResult,
  getOrMockFindriscInputs,
  MOCK_SCORE_HISTORY,
} from "@/lib/mock-data";
import {
  calculateFindrisc,
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
  { key: "bmi", label: "BMI", maxPoints: 3 },
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
  { name: "HbA1c", value: 38, unit: "mmol/mol", min: 20, max: 50, refMin: 20, refMax: 42, status: "normal" as const },
  { name: "f-Glucose", value: 5.4, unit: "mmol/L", min: 3, max: 8, refMin: 3.9, refMax: 6.0, status: "borderline" as const },
  { name: "f-Insulin", value: 12, unit: "mU/L", min: 0, max: 30, refMin: 2, refMax: 25, status: "normal" as const },
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
// Score Zone Bar - the hero visual
// ---------------------------------------------------------------------------

function ScoreZoneBar({
  score,
  projectedScore,
  compact,
}: {
  score: number;
  projectedScore?: number;
  compact?: boolean;
}) {
  const barHeight = compact ? "h-3" : "h-5";
  const activeZone = getZoneForScore(score);

  return (
    <div className="w-full">
      {/* Zone bar */}
      <div className={`relative flex ${barHeight} rounded-full overflow-hidden`}>
        {ZONES.map((zone, i) => {
          const width = ((zone.max - zone.min + 1) / (MAX_SCORE + 1)) * 100;
          const isActive = zone.label === activeZone.label;
          return (
            <div
              key={i}
              style={{
                width: `${width}%`,
                background: zone.color,
                opacity: isActive ? 1 : 0.25,
                transition: "opacity 0.3s ease",
              }}
            />
          );
        })}

        {/* Current score marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${(score / MAX_SCORE) * 100}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.5s ease",
          }}
        >
          <div
            style={{
              width: compact ? 12 : 18,
              height: compact ? 12 : 18,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: `3px solid ${activeZone.color}`,
              boxShadow: "var(--shadow-md)",
            }}
          />
        </div>

        {/* Projected score marker (what-if) */}
        {projectedScore !== undefined && projectedScore !== score && (
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${(projectedScore / MAX_SCORE) * 100}%`,
              transform: "translate(-50%, -50%)",
              transition: "left 0.5s ease",
            }}
          >
            <div
              style={{
                width: compact ? 12 : 16,
                height: compact ? 12 : 16,
                borderRadius: "50%",
                background: "transparent",
                border: `2px dashed ${getZoneForScore(projectedScore).color}`,
                boxShadow: "var(--shadow-sm)",
              }}
            />
          </div>
        )}
      </div>

      {/* Zone labels */}
      {!compact && (
        <div className="flex mt-2">
          {ZONES.map((zone, i) => {
            const width = ((zone.max - zone.min + 1) / (MAX_SCORE + 1)) * 100;
            const isActive = zone.label === activeZone.label;
            return (
              <div
                key={i}
                className="text-center"
                style={{ width: `${width}%` }}
              >
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? "var(--text)" : "var(--text-faint)",
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  {zone.label}
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
  // Simple visual: a gradient bar with a marker
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
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Compared to {PEER_DATA.peerGroup.toLowerCase()}
        </span>
      </div>

      {/* Bell curve approximation bar */}
      <div className="relative mb-2">
        <div
          className="h-8 rounded-lg overflow-hidden relative"
          style={{ background: "var(--bg-elevated)" }}
        >
          {/* Gradient fill representing distribution */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `linear-gradient(90deg,
                var(--green) 0%,
                var(--green) 25%,
                var(--teal) 40%,
                var(--amber) 60%,
                var(--red) 85%,
                var(--red) 100%)`,
              opacity: 0.15,
            }}
          />
          {/* Distribution shape - SVG bell curve */}
          <svg
            viewBox="0 0 200 40"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C20,40 30,38 50,30 C70,20 80,8 100,5 C120,8 130,20 150,30 C170,38 180,40 200,40 Z"
              fill="var(--text-muted)"
              opacity="0.1"
            />
          </svg>
          {/* Average marker */}
          <div
            className="absolute top-0 h-full"
            style={{
              left: `${(PEER_DATA.averageScore / MAX_SCORE) * 100}%`,
              borderLeft: "1px dashed var(--text-faint)",
            }}
          />
          {/* User marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${(score / MAX_SCORE) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: riskColorVar(getZoneForScore(score).label === "Low" ? "low" : getZoneForScore(score).label === "Slight" ? "slightly_elevated" : getZoneForScore(score).label === "Moderate" ? "moderate" : getZoneForScore(score).label === "High" ? "high" : "very_high"),
                border: "2px solid var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Better than{" "}
          <span style={{ fontFamily: "var(--font-space-mono)", color: "var(--text)" }}>
            {percentile}%
          </span>{" "}
          of your peer group
        </span>
        <span
          className="text-[10px]"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}
        >
          avg: {PEER_DATA.averageScore}
        </span>
      </div>
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
          width: "110px",
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
          fontFamily: "var(--font-space-mono)",
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
  const range = max - min;
  const valuePct = ((value - min) / range) * 100;
  const refMinPct = ((refMin - min) / range) * 100;
  const refMaxPct = ((refMax - min) / range) * 100;
  const dotColor = status === "normal" ? "var(--green)" : "var(--amber)";

  return (
    <div className="py-3" style={{ borderBottom: "1px solid var(--divider)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
          {name}
        </span>
        <span
          className="text-xs font-bold"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: status === "normal" ? "var(--green-text)" : "var(--amber-text)",
          }}
        >
          {value} {unit}
        </span>
      </div>

      {/* Range bar */}
      <div className="relative h-2 rounded-full" style={{ background: "var(--bg-elevated)" }}>
        {/* Reference range highlight */}
        <div
          className="absolute h-full rounded-full"
          style={{
            left: `${refMinPct}%`,
            width: `${refMaxPct - refMinPct}%`,
            background: "var(--green)",
            opacity: 0.15,
          }}
        />
        {/* Value dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${valuePct}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: dotColor,
              border: "2px solid var(--bg-card)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
        </div>
      </div>

      {/* Range labels */}
      <div className="flex justify-between mt-1">
        <span
          className="text-[9px]"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}
        >
          {refMin}
        </span>
        <span
          className="text-[9px]"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}
        >
          {refMax}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart Tooltip
// ---------------------------------------------------------------------------

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-bold" style={{ fontFamily: "var(--font-space-mono)" }}>
        Score: {payload[0].value}
      </p>
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
            <ScoreZoneBar score={result.score} />

            {/* Risk level + 10yr percentage below */}
            <div className="flex items-center justify-between mt-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: riskBgVar(result.riskLevel),
                  color: riskTextVar(result.riskLevel),
                }}
              >
                {result.riskLabel}
              </span>
              <span
                className="text-sm font-bold"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text-secondary)",
                }}
              >
                {result.tenYearRisk} 10-year risk
              </span>
            </div>
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
                    fontFamily: "var(--font-space-mono)",
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
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text-faint)",
                }}
              >
                <span>{Math.max(inputs.weightKg - 10, 40)} kg</span>
                <span>{inputs.weightKg + 5} kg</span>
              </div>
            </div>

            {/* Activity toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell size={14} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    30+ min activity/day
                  </span>
                </div>
                <button
                  onClick={() => setWiActivity(!wiActivity)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{
                    background: wiActivity ? "var(--purple)" : "var(--bg-elevated)",
                    border: wiActivity ? "none" : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      background: wiActivity ? "#fff" : "var(--text-faint)",
                      left: wiActivity ? "calc(100% - 22px)" : "2px",
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Diet toggle */}
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Apple size={14} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    Daily fruit/vegetables
                  </span>
                </div>
                <button
                  onClick={() => setWiDiet(!wiDiet)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{
                    background: wiDiet ? "var(--purple)" : "var(--bg-elevated)",
                    border: wiDiet ? "none" : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      background: wiDiet ? "#fff" : "var(--text-faint)",
                      left: wiDiet ? "calc(100% - 22px)" : "2px",
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

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: "var(--text)",
                      }}
                    >
                      Score: {result.score}
                    </span>
                    <span style={{ color: "var(--text-faint)" }}>-&gt;</span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: riskColorVar(wiResult.riskLevel),
                      }}
                    >
                      {wiResult.score}
                    </span>
                    {scoreDiff !== 0 && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: "var(--font-space-mono)",
                          background: scoreDiff < 0 ? "var(--green-bg)" : "var(--red-bg)",
                          color: scoreDiff < 0 ? "var(--green-text)" : "var(--red-text)",
                        }}
                      >
                        {scoreDiff < 0 ? "" : "+"}{scoreDiff}
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

            <div className="h-44 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_SCORE_HISTORY}
                  margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--purple)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  />
                  <YAxis
                    domain={[0, MAX_SCORE]}
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
                  />
                  <ReferenceLine
                    y={7}
                    stroke="var(--green)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                  />
                  <ReferenceLine
                    y={12}
                    stroke="var(--amber)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                  />
                  <ReferenceLine
                    y={15}
                    stroke="var(--red)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                  />
                  <ReferenceLine
                    y={21}
                    stroke="var(--red)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--purple)"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    dot={{
                      r: 4,
                      fill: "var(--purple)",
                      stroke: "var(--bg-card)",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "var(--purple)",
                      stroke: "var(--bg-card)",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
                            fontFamily: "var(--font-space-mono)",
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
                            fontFamily: "var(--font-space-mono)",
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
                      style={{ fontFamily: "var(--font-space-mono)", color: "var(--text)" }}
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
                      style={{ fontFamily: "var(--font-space-mono)", color: "var(--text)" }}
                    >
                      {result.tenYearRisk}
                    </span>
                  </div>
                </div>

                {/* FINDRISC reference */}
                <div className="mt-3 text-[11px]" style={{ color: "var(--text-faint)" }}>
                  <p style={{ fontFamily: "var(--font-space-mono)" }}>
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
        {/* 9. AI ENTRY */}
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
