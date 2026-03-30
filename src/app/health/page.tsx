"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  TestTube,
  Heart,
  Bone,
  ChevronRight,
  Lock,
  Clock,
  Dumbbell,
  Package,
  ArrowRight,
  Ruler,
  Weight,
  CircleDot,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import {
  getOrMockFindriscResult,
  getOrMockFindriscInputs,
  MOCK_NARRATIVE_TIMELINE,
} from "@/lib/mock-data";
import { MOCK_BLOOD_RESULTS } from "@/lib/blood-test-data";
import {
  FindriscResult,
  FindriscInputs,
  getRiskColor,
  MAX_SCORE,
} from "@/lib/findrisc";
import { getUserPhase } from "@/lib/user-state";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

function computeBmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

function bmiCategory(bmi: number): { label: string; concern: boolean } {
  if (bmi < 18.5) return { label: "Underweight", concern: true };
  if (bmi < 25) return { label: "Normal", concern: false };
  if (bmi < 30) return { label: "Overweight", concern: true };
  return { label: "Obese", concern: true };
}

function waistConcern(waist: number, sex: "male" | "female"): boolean {
  if (sex === "male") return waist >= 94;
  return waist >= 80;
}

export default function HealthPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<FindriscResult | null>(null);
  const [inputs, setInputs] = useState<FindriscInputs | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setResult(getOrMockFindriscResult());
    setInputs(getOrMockFindriscInputs());
    setMounted(true);
  }, [router]);

  if (!mounted || !result || !inputs) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="skeleton w-10 h-10 rounded-full" />
      </div>
    );
  }

  const color = getRiskColor(result.riskLevel);
  const phase = getUserPhase();
  const hasBlood = phase === "results_ready" || phase === "results_reviewed";
  const normalCount = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "normal"
  ).length;
  const borderlineCount = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "borderline"
  ).length;
  const totalTests = MOCK_BLOOD_RESULTS.length;
  const bmi = computeBmi(inputs.heightCm, inputs.weightKg);
  const bmiInfo = bmiCategory(bmi);
  const waistBad = waistConcern(inputs.waistCm, inputs.sex);
  const pct = result.score / MAX_SCORE;

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <Header />
      <main className="flex-1 px-5 py-5 pb-28 max-w-md mx-auto w-full">
        {/* ---- Header ---- */}
        <h1
          className="text-xl font-bold tracking-tight mb-0.5"
          style={{ color: "var(--text)" }}
        >
          Your Health
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Everything in one place
        </p>

        {/* ---- 1. Health Score Overview ---- */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Health overview
          </p>

          {/* Diabetes risk zone bar */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `var(--${color}-bg)` }}
            >
              <Activity size={16} style={{ color: `var(--${color})` }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                Diabetes Risk -{" "}
                <span style={{ color: `var(--${color}-text)` }}>
                  {result.riskLabel}
                </span>
              </p>
              {/* Zone bar */}
              <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${Math.max(pct * 100, 8)}%`,
                    background: `var(--${color})`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Blood test summary */}
          {hasBlood && (
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--teal-bg)" }}
              >
                <TestTube size={16} style={{ color: "var(--teal)" }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Blood Tests -{" "}
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: "var(--teal-text)",
                    }}
                  >
                    {normalCount}/{totalTests} normal
                  </span>
                </p>
                {borderlineCount > 0 && (
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--amber-text)" }}
                  >
                    {borderlineCount} borderline marker{borderlineCount > 1 ? "s" : ""} to watch
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Status sentence */}
          <div
            className="rounded-xl px-3 py-2.5 mt-1"
            style={{ background: "var(--bg-elevated)" }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {hasBlood
                ? `Your overall picture is reassuring. Diabetes risk is ${result.riskLabel.toLowerCase()} and ${normalCount} of ${totalTests} blood markers are in normal range.`
                : `Your diabetes risk assessment is complete (${result.riskLabel.toLowerCase()}). Add blood tests for a fuller picture.`}
            </p>
          </div>
        </div>

        {/* ---- 2. Your Body ---- */}
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--text-muted)" }}
        >
          Your body
        </p>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <StatCard
            label="Height"
            value={`${inputs.heightCm}`}
            unit="cm"
            concern={false}
          />
          <StatCard
            label="Weight"
            value={`${inputs.weightKg}`}
            unit="kg"
            concern={false}
          />
          <StatCard
            label="BMI"
            value={`${bmi}`}
            unit={bmiInfo.label}
            concern={bmiInfo.concern}
          />
          <StatCard
            label="Waist"
            value={`${inputs.waistCm}`}
            unit="cm"
            concern={waistBad}
          />
        </div>

        {/* ---- 3. Blood Markers ---- */}
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--text-muted)" }}
        >
          Blood markers
        </p>
        {hasBlood ? (
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {MOCK_BLOOD_RESULTS.map((r, i) => (
              <BloodMarkerRow
                key={r.shortName}
                name={r.testName}
                shortName={r.shortName}
                value={r.value}
                unit={r.unit}
                low={r.refRangeLow}
                high={r.refRangeHigh}
                status={r.status}
                isLast={i === MOCK_BLOOD_RESULTS.length - 1}
              />
            ))}
            <Link href="/blood-tests/results">
              <div
                className="flex items-center justify-center gap-1.5 py-3"
                style={{
                  borderTop: "1px solid var(--divider)",
                  color: "var(--accent)",
                }}
              >
                <span className="text-xs font-semibold">View full results</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        ) : (
          <Link href="/blood-tests">
            <div
              className="card-hover rounded-2xl p-5 mb-6 flex flex-col items-center text-center gap-2"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "var(--teal-bg)" }}
              >
                <TestTube size={20} style={{ color: "var(--teal)" }} />
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                Get your first blood test
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Blood markers give a much clearer picture of your metabolic
                health
              </p>
              <span
                className="mt-1 text-xs font-semibold flex items-center gap-1"
                style={{ color: "var(--accent)" }}
              >
                Order a test <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        )}

        {/* ---- 4. Health Modules ---- */}
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--text-muted)" }}
        >
          Health modules
        </p>
        <div className="flex flex-col gap-2.5 mb-6">
          {/* Diabetes */}
          <Link href="/risk/diabetes">
            <div
              className="card-hover flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `var(--${color}-bg)` }}
              >
                <Activity size={20} style={{ color: `var(--${color})` }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Diabetes Risk
                </p>
                <p
                  className="text-xs"
                  style={{ color: `var(--${color}-text)` }}
                >
                  {result.riskLabel} - score{" "}
                  <span style={{ fontFamily: "var(--font-space-mono)" }}>
                    {result.score}/{MAX_SCORE}
                  </span>
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "var(--text-faint)" }}
              />
            </div>
          </Link>

          {/* Heart - coming soon */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0.45,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-elevated)" }}
            >
              <Heart size={20} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Heart Health
              </p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Coming soon
              </p>
            </div>
            <Lock size={14} style={{ color: "var(--text-faint)" }} />
          </div>

          {/* Bone - coming soon */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0.45,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-elevated)" }}
            >
              <Bone size={20} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Bone Health
              </p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Coming soon
              </p>
            </div>
            <Lock size={14} style={{ color: "var(--text-faint)" }} />
          </div>
        </div>

        {/* ---- 5. Activity & Training ---- */}
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--text-muted)" }}
        >
          Activity & training
        </p>
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "var(--purple-bg)" }}
            >
              <Dumbbell size={18} style={{ color: "var(--purple)" }} />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                Physical activity matters
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Physical activity is one of the biggest factors in your health
                outlook.
              </p>
            </div>
          </div>

          {/* Current status from questionnaire */}
          <div
            className="rounded-xl px-3 py-2.5 mb-3 flex items-center gap-2"
            style={{
              background: inputs.physicalActivity
                ? "var(--green-bg)"
                : "var(--amber-bg)",
            }}
          >
            {inputs.physicalActivity ? (
              <CheckCircle2
                size={14}
                style={{ color: "var(--green)" }}
              />
            ) : (
              <AlertCircle
                size={14}
                style={{ color: "var(--amber)" }}
              />
            )}
            <p
              className="text-xs font-medium"
              style={{
                color: inputs.physicalActivity
                  ? "var(--green-text)"
                  : "var(--amber-text)",
              }}
            >
              {inputs.physicalActivity
                ? "Meeting 30-min daily activity target"
                : "Not meeting 30-min daily activity target"}
            </p>
          </div>

          <Link href="/consultations">
            <div
              className="card-hover flex items-center justify-center gap-1.5 py-2.5 rounded-xl"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
              }}
            >
              <span className="text-xs font-semibold">
                Get a personalized training plan
              </span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>

        {/* ---- 6. Timeline ---- */}
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--text-muted)" }}
        >
          Timeline
        </p>
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {MOCK_NARRATIVE_TIMELINE.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom:
                  i < MOCK_NARRATIVE_TIMELINE.length - 1
                    ? "1px solid var(--divider)"
                    : "none",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--bg-elevated)" }}
              >
                <Clock
                  size={11}
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
              <p
                className="flex-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {entry.text}
              </p>
              <span
                className="text-[10px] shrink-0"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text-faint)",
                }}
              >
                {entry.date}
              </span>
            </div>
          ))}
        </div>

        {/* ---- 7. Care Packages ---- */}
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--text-muted)" }}
        >
          Care packages
        </p>
        <div className="flex flex-col gap-3 mb-4">
          {/* Blood Test + Consultation */}
          <Link href="/blood-tests">
            <div
              className="card-hover rounded-2xl p-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} style={{ color: "var(--accent)" }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Blood Test + Consultation
                </p>
              </div>
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Get a comprehensive blood panel analyzed at a certified lab,
                followed by a personal consultation to review your results and
                build an action plan.
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "var(--accent)",
                  }}
                >
                  1,195 SEK
                </span>
                <span
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: "var(--accent)" }}
                >
                  Learn more <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* Complete Health Package */}
          <Link href="/blood-tests">
            <div
              className="card-hover rounded-2xl p-4"
              style={{
                background: "var(--accent-light)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} style={{ color: "var(--accent)" }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Complete Health Package
                </p>
              </div>
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Everything in the Blood Test + Consultation package, plus a
                personalized 4-week training plan designed around your health
                data and fitness level.
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "var(--accent)",
                  }}
                >
                  1,895 SEK
                </span>
                <span
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: "var(--accent)" }}
                >
                  Learn more <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

/* ---- Stat Card (body metrics) ---- */
function StatCard({
  label,
  value,
  unit,
  concern,
}: {
  label: string;
  value: string;
  unit: string;
  concern: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-3.5"
      style={{
        background: "var(--bg-card)",
        border: concern
          ? "1px solid var(--amber)"
          : "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      <p
        className="text-lg font-bold"
        style={{
          fontFamily: "var(--font-space-mono)",
          color: "var(--text)",
        }}
      >
        {value}
      </p>
      <div className="flex items-center gap-1 mt-0.5">
        {concern && (
          <AlertCircle size={10} style={{ color: "var(--amber)" }} />
        )}
        <span
          className="text-[10px]"
          style={{
            color: concern ? "var(--amber-text)" : "var(--text-faint)",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ---- Blood Marker Row ---- */
function BloodMarkerRow({
  name,
  shortName,
  value,
  unit,
  low,
  high,
  status,
  isLast,
}: {
  name: string;
  shortName: string;
  value: number;
  unit: string;
  low: number;
  high: number;
  status: "normal" | "borderline" | "abnormal";
  isLast: boolean;
}) {
  // Compute position within the reference range for the mini bar
  const range = high - low;
  const clampedVal = Math.min(Math.max(value, low - range * 0.2), high + range * 0.2);
  const totalSpan = range * 1.4; // display range with 20% padding each side
  const barStart = low - range * 0.2;
  const position = ((clampedVal - barStart) / totalSpan) * 100;

  const dotColor =
    status === "normal"
      ? "var(--green)"
      : status === "borderline"
        ? "var(--amber)"
        : "var(--red)";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--divider)",
      }}
    >
      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: dotColor }}
      />

      {/* Name and value */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold truncate"
          style={{ color: "var(--text)" }}
        >
          {name}
        </p>
        <p
          className="text-[10px]"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "var(--text-muted)",
          }}
        >
          {value} {unit}
        </p>
      </div>

      {/* Mini range bar */}
      <div className="w-16 shrink-0">
        <div
          className="relative w-full h-1.5 rounded-full overflow-visible"
          style={{ background: "var(--bg-elevated)" }}
        >
          {/* Normal range highlight */}
          <div
            className="absolute inset-y-0 rounded-full"
            style={{
              left: `${((low - barStart) / totalSpan) * 100}%`,
              width: `${(range / totalSpan) * 100}%`,
              background: "var(--green-bg)",
              border: "0.5px solid var(--green)",
              opacity: 0.5,
            }}
          />
          {/* Current value dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              left: `${position}%`,
              marginLeft: "-4px",
              background: dotColor,
              boxShadow: `0 0 4px ${dotColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
