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
  Package,
  Video,
  Sparkles,
} from "lucide-react";
import {
  MOCK_BLOOD_RESULTS,
  MOCK_RESULTS_SUMMARY,
  BloodTestResult,
} from "@/lib/blood-test-data";

// -- Plain English name map ---------------------------------------------------

const PLAIN_NAMES: Record<string, string> = {
  HbA1c: "HbA1c (long-term blood sugar)",
  "f-Glucose": "Fasting Glucose (blood sugar)",
  "f-Insulin": "Fasting Insulin",
  TC: "Total Cholesterol",
  HDL: "HDL (good cholesterol)",
  LDL: "LDL (bad cholesterol)",
  TG: "Triglycerides (blood fats)",
};

function displayName(shortName: string, testName: string): string {
  return PLAIN_NAMES[shortName] || testName;
}

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

        {/* Triangle marker */}
        <div
          style={{
            position: "absolute",
            left: `${dotPos}%`,
            top: -6,
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `8px solid ${cfg.dot}`,
              filter: status === "borderline" ? `drop-shadow(0 1px 3px ${cfg.dot}60)` : "none",
            }}
          />
        </div>
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

  const pathD = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`)
    .join(" ");

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
          {displayName(result.shortName, result.testName)}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            background: cfg.bg,
            color: cfg.text,
            flexShrink: 0,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          marginTop: 6,
          display: "flex",
          alignItems: "baseline",
          gap: 5,
        }}
      >
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

// -- Stat Card ----------------------------------------------------------------

function StatCard({
  count,
  label,
  accentColor,
  bgColor,
  textColor,
}: {
  count: number;
  label: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: bgColor,
        borderRadius: 14,
        padding: "14px 12px",
        border: `1px solid var(--border)`,
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: 28,
          fontWeight: 700,
          color: textColor,
          lineHeight: 1,
        }}
      >
        {count}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: textColor,
          opacity: 0.85,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// -- Page ---------------------------------------------------------------------

export default function BloodTestResultsPage() {
  const router = useRouter();

  // Compute counts from actual data
  const normalCount = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "normal"
  ).length;
  const borderlineCount = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "borderline"
  ).length;
  const abnormalCount = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "abnormal"
  ).length;

  // Group results: borderline first, then normal
  const borderlineResults = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "borderline"
  );
  const normalResults = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "normal"
  );
  const abnormalResults = MOCK_BLOOD_RESULTS.filter(
    (r) => r.status === "abnormal"
  );

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
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              margin: 0,
            }}
          >
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
        {/* ---- Intro line ---- */}
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            margin: "0 0 20px 0",
          }}
        >
          Your latest blood test results have been analysed by our team and
          reviewed by Dr. Johansson.
        </p>

        {/* ---- Stat Cards ---- */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <StatCard
            count={normalCount}
            label="Normal"
            accentColor="var(--green)"
            bgColor="var(--green-bg)"
            textColor="var(--green-text)"
          />
          <StatCard
            count={borderlineCount}
            label="Borderline"
            accentColor="var(--amber)"
            bgColor="var(--amber-bg)"
            textColor="var(--amber-text)"
          />
          <StatCard
            count={abnormalCount}
            label="Abnormal"
            accentColor="var(--red)"
            bgColor="var(--red-bg)"
            textColor="var(--red-text)"
          />
        </div>

        {/* ---- Doctor's Note ---- */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "var(--shadow-sm)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
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
              <Stethoscope size={16} style={{ color: "var(--teal)" }} />
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Dr. Johansson's Review
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              margin: "0 0 14px 0",
            }}
          >
            Overall your results are reassuring. Your fasting glucose is
            trending slightly upward over the past 6 months - I'd recommend
            monitoring this at your next test in September. Your cholesterol is
            marginally above range but your HDL is healthy which is a positive
            sign. No immediate action needed, but maintaining regular activity
            will help both markers. Happy to discuss further if you'd like.
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            Dr. Marcus Johansson, MD
          </p>
        </section>

        {/* ---- Next Steps ---- */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "var(--shadow-sm)",
            marginBottom: 28,
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
              <CalendarClock
                size={15}
                style={{ color: "var(--teal-text)" }}
              />
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
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
              <Stethoscope
                size={15}
                style={{ color: "var(--amber-text)" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Discuss borderline results with a specialist
              </p>
            </div>
            <ChevronRight
              size={16}
              style={{ color: "var(--text-faint)", flexShrink: 0 }}
            />
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
              <MessageCircle
                size={15}
                style={{ color: "var(--teal-text)" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Ask Precura about your results
              </p>
            </div>
            <ChevronRight
              size={16}
              style={{ color: "var(--text-faint)", flexShrink: 0 }}
            />
          </Link>
        </section>

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {normalResults.map((r) => (
                <BiomarkerCard key={r.shortName} result={r} />
              ))}
            </div>
          </section>
        )}

        {/* ---- Care Packages (upsell) ---- */}
        <section style={{ marginBottom: 0 }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Continue your health journey
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 16,
            }}
          >
            Packages designed around your results
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Card 1: Blood Test + Consultation */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "20px 18px",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "var(--teal-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Video size={16} style={{ color: "var(--teal)" }} />
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Blood Test + Consultation
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  margin: "0 0 14px 0",
                }}
              >
                Get tested and discuss your results with Dr. Johansson in a
                30-minute video call.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  1,195 SEK
                </span>
                <Link
                  href="/book"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRadius: 12,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "none",
                  }}
                >
                  Book now
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: Complete Health Package */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "20px 18px",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "var(--purple-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} style={{ color: "var(--purple)" }} />
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Complete Health Package
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  margin: "0 0 14px 0",
                }}
              >
                Blood test, doctor consultation, and a personalized 4-week
                activity plan designed around your health profile.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  1,895 SEK
                </span>
                <Link
                  href="/book"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRadius: 12,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "none",
                  }}
                >
                  Book now
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
