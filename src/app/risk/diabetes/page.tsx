"use client";

import { useState, useEffect, useCallback } from "react";
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
  Info,
  ChevronRight,
  Sparkles,
  Lock,
  TestTube,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
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
// Helpers
// ---------------------------------------------------------------------------

function riskColorVar(level: FindriscResult["riskLevel"]): string {
  const c = getRiskColor(level);
  return `var(--${c})`;
}

function riskBgVar(level: FindriscResult["riskLevel"]): string {
  const c = getRiskColor(level);
  return `var(--${c}-bg)`;
}

function riskTextVar(level: FindriscResult["riskLevel"]): string {
  const c = getRiskColor(level);
  return `var(--${c}-text)`;
}

function formatFactorValue(
  key: string,
  val: number | boolean | string
): string {
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (key === "bmi") return `${val}`;
  if (key === "waist") return `${val} cm`;
  if (key === "age") return `${val} yrs`;
  if (key === "family") {
    if (val === "parent_sibling_child") return "Parent / sibling / child";
    if (val === "grandparent_aunt_uncle_cousin")
      return "Grandparent / aunt / uncle / cousin";
    return "None";
  }
  return String(val);
}

const MODIFIABLE_KEYS = ["bmi", "waist", "activity", "diet"] as const;
const NON_MODIFIABLE_KEYS = [
  "age",
  "family",
  "glucose",
  "bloodPressure",
] as const;

// ---------------------------------------------------------------------------
// Score Gauge Component
// ---------------------------------------------------------------------------

function ScoreGauge({ score }: { score: number }) {
  // Zone boundaries on a 0-26 scale
  const zones = [
    { end: 6, color: "var(--green)" },
    { end: 11, color: "var(--teal)" },
    { end: 14, color: "var(--amber)" },
    { end: 20, color: "var(--risk-elevated)" },
    { end: 26, color: "var(--red)" },
  ];

  const pct = (score / MAX_SCORE) * 100;

  return (
    <div className="relative mt-4 mb-2">
      {/* Track */}
      <div
        className="flex h-3 rounded-full overflow-hidden"
        style={{ background: "var(--bg-elevated)" }}
      >
        {zones.map((zone, i) => {
          const prev = i === 0 ? 0 : zones[i - 1].end;
          const width = ((zone.end - prev) / MAX_SCORE) * 100;
          return (
            <div
              key={i}
              style={{
                width: `${width}%`,
                background: zone.color,
                opacity: 0.35,
              }}
            />
          );
        })}
      </div>

      {/* Marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `${pct}%`, marginLeft: "-6px" }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: "#fff",
            boxShadow: "0 0 0 3px var(--bg-card), 0 0 6px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Labels */}
      <div
        className="flex justify-between mt-2 text-[10px]"
        style={{
          fontFamily: "var(--font-space-mono)",
          color: "var(--text-muted)",
        }}
      >
        <span>0</span>
        <span>7</span>
        <span>12</span>
        <span>15</span>
        <span>21</span>
        <span>26</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Factor Row Component
// ---------------------------------------------------------------------------

function FactorRow({
  label,
  value,
  points,
  maxPoints,
  modifiable,
}: {
  label: string;
  value: string;
  points: number;
  maxPoints: number;
  modifiable?: boolean;
}) {
  const barPct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  const barColor =
    points === 0
      ? "var(--green)"
      : points <= 2
        ? "var(--amber)"
        : "var(--red)";

  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid var(--divider)" }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
            {label}
          </p>
          {modifiable && (
            <Sparkles size={12} style={{ color: "var(--purple)", flexShrink: 0 }} />
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {value}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {/* Mini bar */}
        <div
          className="w-16 h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-elevated)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${barPct}%`,
              background: barColor,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <span
          className="text-xs font-bold w-6 text-right"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: points === 0 ? "var(--green-text)" : "var(--text-secondary)",
          }}
        >
          {points}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom Tooltip for Recharts
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
      }}
    >
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p
        className="font-bold"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
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

  // What-if state
  const [wiWeight, setWiWeight] = useState<number>(0);
  const [wiActivity, setWiActivity] = useState<boolean>(false);
  const [wiDiet, setWiDiet] = useState<boolean>(false);
  const [wiResult, setWiResult] = useState<FindriscResult | null>(null);

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

  // Recalculate what-if whenever sliders change
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

  // Max points per factor (for bar sizing)
  const maxPointsMap: Record<string, number> = {
    age: 4,
    bmi: 3,
    waist: 4,
    activity: 2,
    diet: 1,
    bloodPressure: 2,
    glucose: 5,
    family: 5,
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

  return (
    <div
      className="min-h-dvh pb-10"
      style={{ background: "var(--bg)" }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* BACK NAV */}
      {/* ------------------------------------------------------------------ */}
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
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Diabetes Risk
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            FINDRISC Assessment
          </p>
        </div>
      </header>

      <main className="px-5 max-w-xl mx-auto">
        {/* ---------------------------------------------------------------- */}
        {/* SCORE OVERVIEW */}
        {/* ---------------------------------------------------------------- */}
        <section className="animate-fade-in stagger-1 mt-6" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-end gap-1 mb-1">
              <span
                className="text-5xl font-bold leading-none"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text)",
                }}
              >
                {result.score}
              </span>
              <span
                className="text-lg font-medium mb-1"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text-faint)",
                }}
              >
                /{MAX_SCORE}
              </span>
            </div>

            {/* Risk badge + 10yr risk */}
            <div className="flex items-center gap-2 mt-2 mb-1">
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: riskBgVar(result.riskLevel),
                  color: riskTextVar(result.riskLevel),
                }}
              >
                {result.riskLabel}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text-secondary)",
                }}
              >
                {result.tenYearRisk} 10-year risk
              </span>
            </div>

            {/* Gauge */}
            <ScoreGauge score={result.score} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FACTOR BREAKDOWN */}
        {/* ---------------------------------------------------------------- */}
        <section className="animate-fade-in stagger-2 mt-6" style={{ opacity: 0 }}>
          {/* Modifiable */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} style={{ color: "var(--purple)" }} />
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--purple-text)" }}
              >
                Modifiable factors
              </p>
            </div>
            <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
              These are within your control
            </p>

            {MODIFIABLE_KEYS.map((key) => {
              const factor = result.breakdown[key];
              return (
                <FactorRow
                  key={key}
                  label={factor.label}
                  value={formatFactorValue(key, factor.value)}
                  points={factor.points}
                  maxPoints={maxPointsMap[key]}
                  modifiable
                />
              );
            })}
          </div>

          {/* Non-modifiable */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} style={{ color: "var(--text-muted)" }} />
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Non-modifiable factors
              </p>
            </div>
            <p className="text-[11px] mb-3" style={{ color: "var(--text-faint)" }}>
              Cannot be changed, but good to know
            </p>

            {NON_MODIFIABLE_KEYS.map((key) => {
              const factor = result.breakdown[key];
              return (
                <FactorRow
                  key={key}
                  label={factor.label}
                  value={formatFactorValue(key, factor.value)}
                  points={factor.points}
                  maxPoints={maxPointsMap[key]}
                />
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* WHAT-IF SECTION */}
        {/* ---------------------------------------------------------------- */}
        <section className="animate-fade-in stagger-3 mt-6" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "var(--purple-text)" }}
            >
              What if you changed...
            </p>
            <p className="text-[11px] mb-5" style={{ color: "var(--text-muted)" }}>
              Adjust the sliders below to see how lifestyle changes could affect your score
            </p>

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
                max={inputs.weightKg + 10}
                step={1}
                value={wiWeight}
                onChange={(e) => setWiWeight(Number(e.target.value))}
                className="w-full accent-purple-500"
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
                <span>{inputs.weightKg + 10} kg</span>
              </div>
            </div>

            {/* Physical activity toggle */}
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell size={14} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    Physical activity (30+ min/day)
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
                    Daily fruit and vegetables
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

            {/* Result */}
            {wiResult && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Your score would change
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: "var(--text)",
                      }}
                    >
                      {result.score}
                    </span>
                    <span style={{ color: "var(--text-faint)" }}>-&gt;</span>
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: riskColorVar(wiResult.riskLevel),
                      }}
                    >
                      {wiResult.score}
                    </span>
                  </div>
                </div>
                {scoreDiff !== 0 && (
                  <div
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      background: scoreDiff < 0 ? "var(--green-bg)" : "var(--red-bg)",
                      color: scoreDiff < 0 ? "var(--green-text)" : "var(--red-text)",
                    }}
                  >
                    {scoreDiff < 0 ? (
                      <TrendingDown size={14} />
                    ) : (
                      <TrendingUp size={14} />
                    )}
                    {scoreDiff > 0 ? "+" : ""}
                    {scoreDiff}
                  </div>
                )}
                {scoreDiff === 0 && (
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      background: "var(--bg-elevated)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-space-mono)",
                    }}
                  >
                    No change
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* TREND CHART */}
        {/* ---------------------------------------------------------------- */}
        <section className="animate-fade-in stagger-4 mt-6" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Score Trend
            </p>
            <p className="text-[11px] mb-4" style={{ color: "var(--text-faint)" }}>
              Your FINDRISC score over time
            </p>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={MOCK_SCORE_HISTORY}
                  margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                >
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
                    strokeOpacity={0.4}
                  />
                  <ReferenceLine
                    y={12}
                    stroke="var(--amber)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                  />
                  <ReferenceLine
                    y={15}
                    stroke="var(--risk-elevated)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                  />
                  <ReferenceLine
                    y={21}
                    stroke="var(--red)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--purple)"
                    strokeWidth={2}
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
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* METHODOLOGY */}
        {/* ---------------------------------------------------------------- */}
        <section className="animate-fade-in stagger-5 mt-6" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} style={{ color: "var(--text-muted)" }} />
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Methodology
              </p>
            </div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
              This assessment uses the Finnish Diabetes Risk Score (FINDRISC), a
              validated clinical tool developed to estimate the probability of
              developing Type 2 diabetes within the next 10 years.
            </p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              It is the same screening instrument used by doctors and public
              health systems across Europe. The score is based on eight
              easily-measured risk factors and has been validated in multiple
              large-scale population studies.
            </p>
            <p
              className="text-[11px]"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "var(--text-faint)",
              }}
            >
              Lindstrom & Tuomilehto, Diabetes Care 2003
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CTA */}
        {/* ---------------------------------------------------------------- */}
        <section className="animate-fade-in stagger-6 mt-6" style={{ opacity: 0 }}>
          <Link
            href="/blood-tests"
            className="flex items-center justify-between w-full p-4 rounded-2xl"
            style={{
              background: "var(--purple)",
              color: "#fff",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <TestTube size={18} style={{ color: "#fff" }} />
              </div>
              <div>
                <p className="text-sm font-semibold">Want more precise data?</p>
                <p className="text-xs" style={{ opacity: 0.7 }}>
                  Order targeted blood tests to refine your risk
                </p>
              </div>
            </div>
            <ChevronRight size={18} style={{ opacity: 0.7 }} />
          </Link>
        </section>
      </main>
    </div>
  );
}
