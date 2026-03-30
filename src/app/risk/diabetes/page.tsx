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
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBullet } from "@nivo/bullet";
import type { LineCustomSvgLayer, DefaultSeries } from "@nivo/line";
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
// Nivo shared theme
// ---------------------------------------------------------------------------

const nivoTheme = {
  fontFamily: "var(--font-dm-sans)",
  fontSize: 11,
  textColor: "var(--text-muted)",
  grid: { line: { stroke: "var(--divider)", strokeWidth: 1 } },
  axis: {
    ticks: {
      text: {
        fontFamily: "var(--font-space-mono)",
        fontSize: 10,
        fill: "var(--text-muted)",
      },
    },
  },
  tooltip: {
    container: {
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      boxShadow: "var(--shadow-md)",
      padding: "8px 12px",
      fontFamily: "var(--font-dm-sans)",
      fontSize: 12,
    },
  },
};

// ---------------------------------------------------------------------------
// Bell curve data generator for peer comparison
// ---------------------------------------------------------------------------

function generateBellCurve(
  mean: number,
  stdDev: number,
  numPoints: number,
  xMin: number,
  xMax: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / (numPoints - 1);
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    points.push({ x: Math.round(x * 10) / 10, y });
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
}: {
  score: number;
  projectedScore?: number;
  compact?: boolean;
}) {
  const activeZone = getZoneForScore(score);
  const barHeight = compact ? 28 : 50;

  const bulletData = [
    {
      id: "risk",
      ranges: [7, 12, 15, 21, MAX_SCORE + 1],
      measures: [score],
      markers: projectedScore !== undefined && projectedScore !== score
        ? [projectedScore]
        : [],
    },
  ];

  return (
    <div className="w-full">
      <div style={{ height: barHeight }}>
        <ResponsiveBullet
          data={bulletData}
          layout="horizontal"
          spacing={0}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          minValue={0}
          maxValue={MAX_SCORE + 1}
          rangeColors={[
            "var(--green)",
            "var(--teal)",
            "var(--amber)",
            "var(--red)",
            "var(--red)",
          ]}
          measureColors={[activeZone.color]}
          measureSize={0.4}
          markerColors={[
            projectedScore !== undefined
              ? getZoneForScore(projectedScore).color
              : "var(--text-faint)",
          ]}
          markerSize={0.8}
          axisPosition="after"
          titlePosition="before"
          titleAlign="start"
          titleOffsetX={0}
          titleOffsetY={0}
          isInteractive={false}
          animate={true}
          theme={{
            ...nivoTheme,
            axis: {
              ...nivoTheme.axis,
              ticks: {
                ...nivoTheme.axis.ticks,
                line: { stroke: "transparent" },
                text: { ...nivoTheme.axis.ticks.text, fill: "transparent" },
              },
            },
          }}
        />
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

  // Generate a gaussian bell curve: 50 points, mean=avg, stddev=4, range 0..26
  const bellPoints = generateBellCurve(avg, 4, 50, 0, MAX_SCORE);
  const bellData = [
    {
      id: "distribution",
      data: bellPoints.map((p) => ({ x: String(p.x), y: p.y })),
    },
  ];

  // Custom layer: draws vertical annotation lines for Average and You
  const AnnotationLayer: LineCustomSvgLayer<DefaultSeries> = ({
    innerWidth,
    innerHeight,
    xScale,
  }) => {
    const scale = xScale as unknown as (v: number) => number;
    const avgX = scale(avg);
    const youX = scale(score);

    return (
      <g>
        {/* Average vertical line */}
        <line
          x1={avgX}
          y1={0}
          x2={avgX}
          y2={innerHeight}
          stroke="var(--text-faint)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text
          x={avgX}
          y={-8}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={10}
          fontWeight={600}
          fontFamily="var(--font-dm-sans)"
        >
          Average
        </text>

        {/* You vertical line */}
        <line
          x1={youX}
          y1={0}
          x2={youX}
          y2={innerHeight}
          stroke={userColor}
          strokeWidth={2}
        />
        <circle
          cx={youX}
          cy={
            // place dot on the bell curve at the user's score
            (() => {
              const exponent = -0.5 * Math.pow((score - avg) / 4, 2);
              const yVal =
                (1 / (4 * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
              const maxY = bellPoints.reduce(
                (m, p) => Math.max(m, p.y),
                0
              );
              return innerHeight - (yVal / maxY) * innerHeight;
            })()
          }
          r={5}
          fill={userColor}
          stroke="var(--bg-card)"
          strokeWidth={2}
        />
        <text
          x={youX}
          y={-8}
          textAnchor="middle"
          fill={userColor}
          fontSize={10}
          fontWeight={700}
          fontFamily="var(--font-dm-sans)"
        >
          You
        </text>
      </g>
    );
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

      {/* Nivo bell curve */}
      <div style={{ height: 140 }}>
        <ResponsiveLine
          data={bellData}
          xScale={{ type: "linear", min: 0, max: MAX_SCORE }}
          yScale={{ type: "linear", min: 0, max: "auto" }}
          curve="natural"
          enableArea={true}
          areaOpacity={0.15}
          colors={["var(--teal)"]}
          lineWidth={2}
          enablePoints={false}
          enableGridX={false}
          enableGridY={false}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 6,
            tickValues: [0, 5, 10, 15, 20, 25],
          }}
          axisLeft={null}
          isInteractive={false}
          margin={{ top: 24, right: 16, bottom: 28, left: 16 }}
          layers={[
            "grid",
            "axes",
            "areas",
            "lines",
            AnnotationLayer,
          ]}
          theme={nivoTheme}
          defs={[
            {
              id: "bellGradient",
              type: "linearGradient",
              colors: [
                { offset: 0, color: "var(--teal)", opacity: 0.3 },
                { offset: 100, color: "var(--teal)", opacity: 0.02 },
              ],
            },
          ]}
          fill={[{ match: { id: "distribution" }, id: "bellGradient" }]}
        />
      </div>

      <p
        className="text-xs mt-2"
        style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
      >
        Your score is better than{" "}
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
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
  const statusColor =
    status === "normal" ? "var(--green)" : "var(--amber)";

  const bulletData = [
    {
      id: name,
      ranges: [refMin, refMax, max],
      measures: [value],
      markers: [refMin, refMax],
    },
  ];

  return (
    <div className="py-3" style={{ borderBottom: "1px solid var(--divider)" }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
          {name}
        </span>
        <span
          className="text-xs font-bold"
          style={{
            fontFamily: "var(--font-space-mono)",
            color:
              status === "normal"
                ? "var(--green-text)"
                : "var(--amber-text)",
          }}
        >
          {value} {unit}
        </span>
      </div>

      <div style={{ height: 36 }}>
        <ResponsiveBullet
          data={bulletData}
          layout="horizontal"
          spacing={0}
          margin={{ top: 4, right: 0, bottom: 16, left: 0 }}
          minValue={min}
          maxValue={max}
          rangeColors={[
            "var(--bg-elevated)",
            status === "normal" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
            "var(--bg-elevated)",
          ]}
          measureColors={[statusColor]}
          measureSize={0.35}
          markerColors={["var(--text-faint)", "var(--text-faint)"]}
          markerSize={0.6}
          axisPosition="after"
          titlePosition="before"
          titleAlign="start"
          titleOffsetX={0}
          titleOffsetY={0}
          isInteractive={false}
          animate={true}
          theme={{
            ...nivoTheme,
            axis: {
              ...nivoTheme.axis,
              ticks: {
                ...nivoTheme.axis.ticks,
                text: {
                  ...nivoTheme.axis.ticks.text,
                  fontSize: 9,
                  fill: "var(--text-faint)",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nivo Trend Chart Tooltip
// ---------------------------------------------------------------------------

function TrendTooltip({ point }: { point: { data: { x: string | number; y: string | number } } }) {
  const scoreVal = Number(point.data.y);
  const zone = getZoneForScore(scoreVal);
  return (
    <div
      className="px-3.5 py-2.5 rounded-xl text-xs"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        boxShadow: "var(--shadow-lg, var(--shadow-md))",
        minWidth: 120,
      }}
    >
      <p
        className="mb-1"
        style={{
          color: "var(--text-muted)",
          fontSize: 10,
          fontFamily: "var(--font-space-mono)",
        }}
      >
        {String(point.data.x)}
      </p>
      <p
        className="font-bold text-sm"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {scoreVal} / {MAX_SCORE}
      </p>
      <p
        className="mt-1 text-[10px] font-semibold"
        style={{ color: zone.color }}
      >
        {zone.label} risk ({zone.risk})
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
            <h2
              className="text-base font-bold mb-1"
              style={{ color: "var(--text)" }}
            >
              Your Risk Level
            </h2>
            <p
              className="text-xs mb-4"
              style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}
            >
              Based on your health profile, here is where you fall on the diabetes risk scale.
            </p>

            <ScoreZoneBar score={result.score} />

            {/* Risk level badge */}
            <div className="mt-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: riskBgVar(result.riskLevel),
                  color: riskTextVar(result.riskLevel),
                }}
              >
                {result.riskLabel}
              </span>
            </div>

            {/* Human-readable risk explanation */}
            <p
              className="text-xs mt-3"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Your current risk level is{" "}
              <strong style={{ color: "var(--text)" }}>{result.riskLabel}</strong>.
              This means roughly{" "}
              <span style={{ fontFamily: "var(--font-space-mono)", fontWeight: 600 }}>
                {activeZone.risk === "~1%" ? "1 in 100" : activeZone.risk === "~4%" ? "4 in 100" : activeZone.risk === "~17%" ? "17 in 100" : activeZone.risk === "~33%" ? "33 in 100" : "50 in 100"}
              </span>{" "}
              people with a similar profile develop Type 2 diabetes within 10 years.
            </p>

            {/* De-emphasized raw score */}
            <p
              className="text-[10px] mt-2"
              style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}
            >
              Score {result.score} out of {MAX_SCORE}
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
                            fontFamily: "var(--font-space-mono)",
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
                    style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}
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

            <div style={{ height: 200, marginTop: 12 }}>
              <ResponsiveLine
                data={[{
                  id: "score",
                  data: MOCK_SCORE_HISTORY.map((d) => ({ x: d.date, y: d.score })),
                }]}
                curve="natural"
                margin={{ top: 10, right: 16, bottom: 28, left: 36 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: 0, max: MAX_SCORE }}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                useMesh={true}
                colors={["var(--purple)"]}
                lineWidth={2.5}
                enableArea={true}
                areaOpacity={0.12}
                areaBaselineValue={0}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 8,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 8,
                  tickValues: [0, 7, 12, 15, 21, 26],
                }}
                markers={[
                  { axis: "y", value: 7, lineStyle: { stroke: "var(--green)", strokeDasharray: "4 4", strokeWidth: 1, opacity: 0.3 } },
                  { axis: "y", value: 12, lineStyle: { stroke: "var(--amber)", strokeDasharray: "4 4", strokeWidth: 1, opacity: 0.3 } },
                  { axis: "y", value: 15, lineStyle: { stroke: "var(--red)", strokeDasharray: "4 4", strokeWidth: 1, opacity: 0.3 } },
                ]}
                theme={{
                  ...nivoTheme,
                  crosshair: { line: { stroke: "var(--border)", strokeDasharray: "4 4" } },
                }}
                tooltip={({ point }) => (
                  <div style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "6px 10px",
                    boxShadow: "var(--shadow-md)",
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 11,
                  }}>
                    <span style={{ color: "var(--text)" }}>{String(point.data.x)}</span>
                    <br />
                    <span style={{ color: "var(--purple)", fontWeight: 700 }}>Score: {String(point.data.y)}/{MAX_SCORE}</span>
                  </div>
                )}
              />
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
