"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FlaskConical,
  Brain,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import {
  MOCK_BLOOD_RESULTS,
  MOCK_RESULTS_SUMMARY,
} from "@/lib/blood-test-data";

function getStatusStyle(status: "normal" | "borderline" | "abnormal") {
  switch (status) {
    case "normal":
      return {
        bg: "var(--green-bg)",
        text: "var(--green-text)",
        dot: "var(--green)",
        label: "Normal",
      };
    case "borderline":
      return {
        bg: "var(--amber-bg)",
        text: "var(--amber-text)",
        dot: "var(--amber)",
        label: "Borderline",
      };
    case "abnormal":
      return {
        bg: "var(--red-bg)",
        text: "var(--red-text)",
        dot: "var(--red)",
        label: "Abnormal",
      };
  }
}

function ReferenceBar({
  value,
  low,
  high,
  status,
}: {
  value: number;
  low: number;
  high: number;
  status: "normal" | "borderline" | "abnormal";
}) {
  // Calculate the visual range - extend beyond ref range for context
  const padding = (high - low) * 0.3;
  const visualLow = Math.max(0, low - padding);
  const visualHigh = high + padding;
  const totalRange = visualHigh - visualLow;

  // Position of the reference range within the visual range
  const refStartPct = ((low - visualLow) / totalRange) * 100;
  const refWidthPct = ((high - low) / totalRange) * 100;

  // Position of the value marker
  const clampedValue = Math.max(visualLow, Math.min(visualHigh, value));
  const valuePct = ((clampedValue - visualLow) / totalRange) * 100;

  const statusStyle = getStatusStyle(status);

  return (
    <div className="mt-3 mb-1">
      <div className="relative h-3">
        {/* Full track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--bg-elevated)" }}
        />
        {/* Reference range */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${refStartPct}%`,
            width: `${refWidthPct}%`,
            background: "var(--green-bg)",
            border: "1px solid var(--green)",
            opacity: 0.5,
          }}
        />
        {/* Value marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
          style={{
            left: `${valuePct}%`,
            transform: `translate(-50%, -50%)`,
            background: statusStyle.dot,
            boxShadow: `0 0 0 3px ${statusStyle.bg}`,
          }}
        />
      </div>
      <div
        className="flex justify-between mt-1.5 text-xs"
        style={{
          fontFamily: "var(--font-space-mono)",
          color: "var(--text-faint)",
        }}
      >
        <span>{low}</span>
        <span>ref. range</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

export default function BloodTestResultsPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => router.push("/blood-tests")}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div className="flex items-center gap-2">
          <FlaskConical size={18} style={{ color: "var(--teal)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Blood Test Results
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        {/* Title */}
        <div className="animate-fade-in">
          <h1
            className="text-xl font-bold tracking-tight mb-1"
            style={{ color: "var(--text)" }}
          >
            Blood Test Results
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "var(--text-muted)",
            }}
          >
            March 27, 2026
          </p>
        </div>

        {/* AI Summary */}
        <div
          className="animate-fade-in-up stagger-1 rounded-2xl overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            opacity: 0,
          }}
        >
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{
              background: "var(--purple-bg)",
              borderBottom: "1px solid var(--purple)",
            }}
          >
            <Brain size={14} style={{ color: "var(--purple-text)" }} />
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--purple-text)" }}
            >
              AI Summary
            </p>
          </div>
          <div className="p-4">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {MOCK_RESULTS_SUMMARY}
            </p>
          </div>
        </div>

        {/* Individual results */}
        <p
          className="text-xs font-semibold uppercase tracking-widest pt-2"
          style={{ color: "var(--text-muted)" }}
        >
          Individual results
        </p>

        {MOCK_BLOOD_RESULTS.map((result, i) => {
          const statusStyle = getStatusStyle(result.status);

          return (
            <div
              key={result.shortName}
              className={`animate-fade-in-up stagger-${Math.min(i + 2, 6)} rounded-2xl p-4`}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                opacity: 0,
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {result.testName}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {result.shortName}
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.text,
                  }}
                >
                  {statusStyle.label}
                </div>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1.5 mt-2">
                <span
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "var(--text)",
                  }}
                >
                  {result.value}
                </span>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "var(--text-muted)",
                  }}
                >
                  {result.unit}
                </span>
              </div>

              {/* Reference range bar */}
              <ReferenceBar
                value={result.value}
                low={result.refRangeLow}
                high={result.refRangeHigh}
                status={result.status}
              />

              {/* Interpretation */}
              <p
                className="text-xs leading-relaxed mt-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {result.interpretation}
              </p>
            </div>
          );
        })}

        {/* CTA */}
        <Link
          href="/consultations"
          className="flex items-center justify-between w-full p-4 rounded-xl animate-fade-in"
          style={{
            background: "var(--purple)",
            color: "white",
          }}
        >
          <div className="flex items-center gap-2">
            <Stethoscope size={18} />
            <span className="text-sm font-semibold">Discuss with a doctor</span>
          </div>
          <ChevronRight size={18} />
        </Link>

        {/* Spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}
