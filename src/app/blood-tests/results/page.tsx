"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  CalendarClock,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import {
  MOCK_BLOOD_RESULTS,
  BloodTestResult,
} from "@/lib/blood-test-data";

// -- Helpers ------------------------------------------------------------------

function getStatusConfig(status: "normal" | "borderline" | "abnormal") {
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

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

// -- Range Bar ----------------------------------------------------------------

function RangeBar({
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
  const range = high - low;
  const pad = range * 0.35;
  const vLow = Math.max(0, low - pad);
  const vHigh = high + pad;
  const total = vHigh - vLow;

  const refStart = ((low - vLow) / total) * 100;
  const refWidth = ((high - low) / total) * 100;

  const clamped = Math.max(vLow, Math.min(vHigh, value));
  const dotPos = ((clamped - vLow) / total) * 100;

  const cfg = getStatusConfig(status);

  return (
    <div style={{ marginTop: 12, marginBottom: 4 }}>
      {/* Bar */}
      <div
        style={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          background: "var(--bg-elevated)",
          overflow: "visible",
        }}
      >
        {/* Left amber/red zone (below ref) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${refStart}%`,
            height: "100%",
            borderRadius: "999px 0 0 999px",
            background: "var(--amber-bg)",
          }}
        />

        {/* Green reference zone */}
        <div
          style={{
            position: "absolute",
            left: `${refStart}%`,
            top: 0,
            width: `${refWidth}%`,
            height: "100%",
            background: "var(--green-bg)",
            borderTop: "1.5px solid var(--green)",
            borderBottom: "1.5px solid var(--green)",
          }}
        />

        {/* Right amber/red zone (above ref) */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: `${100 - refStart - refWidth}%`,
            height: "100%",
            borderRadius: "0 999px 999px 0",
            background: "var(--amber-bg)",
          }}
        />

        {/* Dot marker */}
        <div
          style={{
            position: "absolute",
            left: `${dotPos}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: cfg.dot,
            border: "2.5px solid var(--bg-card)",
            boxShadow:
              status === "borderline"
                ? `0 0 0 3px ${cfg.bg}, 0 0 8px ${cfg.dot}40`
                : `0 0 0 3px ${cfg.bg}`,
            zIndex: 2,
          }}
        />
      </div>

      {/* Labels beneath bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: 6,
          fontFamily: "var(--font-space-mono)",
          fontSize: 11,
          color: "var(--text-faint)",
        }}
      >
        <span>{low}</span>
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 12,
            fontWeight: 600,
            color: cfg.text,
          }}
        >
          {value}
        </span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// -- Mini Trend ---------------------------------------------------------------

function MiniTrend({
  points,
  labels,
  unit,
}: {
  points: number[];
  labels: string[];
  unit: string;
}) {
  const min = Math.min(...points) - 0.2;
  const max = Math.max(...points) + 0.2;
  const range = max - min;
  const w = 100;
  const h = 36;

  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - ((p - min) / range) * h,
  }));

  const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");

  return (
    <div
      style={{
        marginTop: 10,
        padding: "10px 14px",
        borderRadius: 12,
        background: "var(--amber-bg)",
        border: "1px solid var(--amber)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <TrendingUp size={13} style={{ color: "var(--amber-text)" }} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--amber-text)",
            letterSpacing: "0.02em",
          }}
        >
          Trending upward
        </span>
      </div>
      <svg
        viewBox={`-4 -4 ${w + 8} ${h + 8}`}
        style={{ width: "100%", height: 44, display: "block" }}
      >
        <path
          d={pathD}
          fill="none"
          stroke="var(--amber)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={3.5}
            fill="var(--amber)"
            stroke="var(--bg-card)"
            strokeWidth={2}
          />
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          fontFamily: "var(--font-space-mono)",
          fontSize: 10,
          color: "var(--amber-text)",
        }}
      >
        {labels.map((l, i) => (
          <span key={i}>
            {l}
            <br />
            <span style={{ fontWeight: 600 }}>
              {points[i]} {unit}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// -- Biomarker Card -----------------------------------------------------------

function BiomarkerCard({
  result,
  showTrend,
}: {
  result: BloodTestResult;
  showTrend?: boolean;
}) {
  const cfg = getStatusConfig(result.status);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "16px 16px 14px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Top row: name + status badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          {result.testName}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            background: cfg.bg,
            color: cfg.text,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Value */}
      <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 5 }}>
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 26,
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1,
          }}
        >
          {result.value}
        </span>
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          {result.unit}
        </span>
      </div>

      {/* Range bar */}
      <RangeBar
        value={result.value}
        low={result.refRangeLow}
        high={result.refRangeHigh}
        status={result.status}
      />

      {/* Interpretation */}
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          color: "var(--text-secondary)",
          marginTop: 8,
        }}
      >
        {truncate(result.interpretation, 120)}
      </p>

      {/* Mini trend for borderline f-Glucose */}
      {showTrend && (
        <MiniTrend
          points={[5.2, 5.5, 5.8]}
          labels={["Sep 2025", "Dec 2025", "Mar 2026"]}
          unit="mmol/L"
        />
      )}

      {/* Ask about this */}
      <Link
        href="/chat"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          marginTop: 12,
          fontSize: 12,
          fontWeight: 600,
          color: "var(--teal-text)",
          textDecoration: "none",
        }}
      >
        <MessageCircle size={13} />
        Ask about this
        <ChevronRight size={13} />
      </Link>
    </div>
  );
}

// -- Page ---------------------------------------------------------------------

export default function BloodTestResultsPage() {
  const router = useRouter();

  // Compute counts from actual data
  const normalCount = MOCK_BLOOD_RESULTS.filter((r) => r.status === "normal").length;
  const borderlineCount = MOCK_BLOOD_RESULTS.filter((r) => r.status === "borderline").length;
  const abnormalCount = MOCK_BLOOD_RESULTS.filter((r) => r.status === "abnormal").length;

  // Group results: borderline first, then normal
  const borderlineResults = MOCK_BLOOD_RESULTS.filter((r) => r.status === "borderline");
  const normalResults = MOCK_BLOOD_RESULTS.filter((r) => r.status === "normal");
  const abnormalResults = MOCK_BLOOD_RESULTS.filter((r) => r.status === "abnormal");

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* ---- Header ---- */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-elevated)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: 0 }}>
            Blood Test Results
          </p>
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 12,
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Mar 27, 2026
          </p>
        </div>
      </header>

      {/* ---- Content ---- */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px 40px",
          maxWidth: 448,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ---- Quick Summary Strip ---- */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {/* Normal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--green-bg)",
                border: "2px solid var(--green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-space-mono)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--green-text)",
              }}
            >
              {normalCount}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--green-text)" }}>
              Normal
            </span>
          </div>

          {/* Borderline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--amber-bg)",
                border: "2px solid var(--amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-space-mono)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--amber-text)",
              }}
            >
              {borderlineCount}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber-text)" }}>
              Borderline
            </span>
          </div>

          {/* Abnormal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--teal-bg)",
                border: "2px solid var(--teal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-space-mono)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--teal-text)",
              }}
            >
              {abnormalCount}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--teal-text)" }}>
              Abnormal
            </span>
          </div>
        </div>

        {/* ---- Worth Watching (borderline) ---- */}
        {borderlineResults.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--amber-text)",
                marginBottom: 10,
              }}
            >
              Worth watching
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {borderlineResults.map((r) => (
                <BiomarkerCard
                  key={r.shortName}
                  result={r}
                  showTrend={r.shortName === "f-Glucose"}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---- Abnormal ---- */}
        {abnormalResults.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--red-text)",
                marginBottom: 10,
              }}
            >
              Talk to a doctor
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {abnormalResults.map((r) => (
                <BiomarkerCard key={r.shortName} result={r} />
              ))}
            </div>
          </section>
        )}

        {/* ---- All Clear (normal) ---- */}
        {normalResults.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--green-text)",
                marginBottom: 10,
              }}
            >
              All clear
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {normalResults.map((r) => (
                <BiomarkerCard key={r.shortName} result={r} />
              ))}
            </div>
          </section>
        )}

        {/* ---- Next Steps ---- */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            Next steps
          </p>

          {/* Retest */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid var(--divider)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--teal-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CalendarClock size={15} style={{ color: "var(--teal-text)" }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0 }}>
                Recommended retest in 6 months
              </p>
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  margin: 0,
                  marginTop: 1,
                }}
              >
                Sep 27, 2026
              </p>
            </div>
          </div>

          {/* Specialist */}
          <Link
            href="/consultations"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid var(--divider)",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--amber-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Stethoscope size={15} style={{ color: "var(--amber-text)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0 }}>
                Discuss borderline results with a specialist
              </p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
          </Link>

          {/* Chat */}
          <Link
            href="/chat"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--teal-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MessageCircle size={15} style={{ color: "var(--teal-text)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0 }}>
                Ask Precura about your results
              </p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
          </Link>
        </section>
      </main>
    </div>
  );
}
