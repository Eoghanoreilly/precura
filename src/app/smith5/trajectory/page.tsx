"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  PATIENT,
  FAMILY_HISTORY,
  BLOOD_TEST_HISTORY,
  BIOMETRICS_HISTORY,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const PURPLE = {
  deep: "#4a148c",
  primary: "#6a1b9a",
  mid: "#8e24aa",
  light: "#ce93d8",
  pale: "#f3e5f5",
  wash: "#faf5ff",
  accent: "#7c4dff",
};

// Anna's trajectory compared to family at same ages
const AGE_COMPARISONS = [
  {
    marker: "Blood sugar (fasting glucose)",
    unit: "mmol/L",
    annaAge: 40,
    annaValue: 5.8,
    annaStatus: "borderline" as const,
    family: [
      {
        who: "Mum at 40",
        value: "Unknown - probably similar",
        note: "No routine testing in 2007. She likely had no idea her blood sugar was rising.",
      },
      {
        who: "Mum at diagnosis (58)",
        value: "~7.0+",
        note: "Diagnosed with Type 2 Diabetes. HbA1c was 52 mmol/mol.",
      },
    ],
    insight:
      "Your 5.8 at age 40 is in the upper normal range. If the trend of +0.16/year continues, you could reach 7.0 around age 47-48 - over 10 years earlier than your mum.",
    trend: "worsening" as const,
  },
  {
    marker: "Blood pressure",
    unit: "mmHg",
    annaAge: 40,
    annaValue: "132/82",
    annaStatus: "controlled" as const,
    family: [
      {
        who: "Pappa at 50",
        value: "Diagnosed with hypertension",
        note: "First diagnosed 10 years older than you. But he didn't start medication until then.",
      },
      {
        who: "Mormor at 55",
        value: "Started BP medication",
        note: "High blood pressure runs on both sides.",
      },
    ],
    insight:
      "You were diagnosed with mild hypertension at 37 and started treatment early. Your pappa wasn't treated until 50. Your early action is a significant advantage.",
    trend: "managed" as const,
  },
  {
    marker: "Weight / BMI",
    unit: "kg/m2",
    annaAge: 40,
    annaValue: "27.6",
    annaStatus: "borderline" as const,
    family: [
      {
        who: "Mum before diagnosis",
        value: "BMI likely 30+",
        note: "Was overweight for years before diabetes diagnosis. No records available.",
      },
    ],
    insight:
      "Your BMI of 27.6 is overweight but well below the obesity threshold (30). Keeping it here or bringing it down is one of the most impactful things you can do.",
    trend: "stable" as const,
  },
  {
    marker: "Cholesterol (total)",
    unit: "mmol/L",
    annaAge: 40,
    annaValue: "5.1",
    annaStatus: "borderline" as const,
    family: [
      {
        who: "Farfar at 60",
        value: "Very high (exact unknown)",
        note: "Started statins at 60. Had stroke at 71.",
      },
      {
        who: "Pappa before heart attack",
        value: "On statins",
        note: "Was already on cholesterol medication when the heart attack happened at 65.",
      },
    ],
    insight:
      "Your cholesterol is marginally high at 5.1 but your good cholesterol (HDL) is healthy at 1.6. Your grandfather's was reportedly much worse. Monitoring and lifestyle changes should keep this in check.",
    trend: "stable" as const,
  },
];

function GlucoseTrajectoryChart() {
  const glucoseHistory = getMarkerHistory("f-Glucose");

  const width = 340;
  const height = 200;
  const pad = { top: 20, right: 20, bottom: 40, left: 44 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  // Age range: 35 to 62 (grandmother's diagnosis age)
  const minAge = 35;
  const maxAge = 62;
  const ageRange = maxAge - minAge;

  // Glucose range: 4.5 to 8.0
  const minG = 4.5;
  const maxG = 8.0;
  const gRange = maxG - minG;

  const toX = (age: number) => pad.left + ((age - minAge) / ageRange) * chartW;
  const toY = (val: number) => pad.top + (1 - (val - minG) / gRange) * chartH;

  // Anna's actual data points (age-based)
  const annaPoints = glucoseHistory.map((d) => {
    const year = new Date(d.date).getFullYear();
    const age = PATIENT.age - (2026 - year);
    return { age, value: d.value, x: toX(age), y: toY(d.value) };
  });

  // Projected if trend continues (slope: ~0.16/year)
  const slope = 0.16;
  const lastVal = glucoseHistory[glucoseHistory.length - 1].value;
  const projectedPoints = [];
  for (let futureAge = PATIENT.age + 1; futureAge <= maxAge; futureAge++) {
    const projVal = lastVal + slope * (futureAge - PATIENT.age);
    if (projVal <= maxG) {
      projectedPoints.push({ age: futureAge, value: projVal, x: toX(futureAge), y: toY(projVal) });
    }
  }

  // Threshold lines
  const preDiabeticY = toY(6.1); // pre-diabetic starts
  const diabeticY = toY(7.0); // diabetic threshold

  // Family diagnosis markers
  const motherAge = 58;
  const grandmotherAge = 62;

  const annaPath = annaPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const projPath =
    projectedPoints.length > 0
      ? `M ${annaPoints[annaPoints.length - 1].x} ${annaPoints[annaPoints.length - 1].y} ` +
        projectedPoints.map((p) => `L ${p.x} ${p.y}`).join(" ")
      : "";

  // "Changed" path (what if Anna halts the rise)
  const changedPoints = [];
  for (let age = PATIENT.age; age <= maxAge; age++) {
    // Gradual improvement: drops 0.05/year then stabilizes at 5.2
    const targetVal = Math.max(5.2, lastVal - 0.05 * (age - PATIENT.age));
    changedPoints.push({ age, value: targetVal, x: toX(age), y: toY(targetVal) });
  }
  const changedPath = changedPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "16px 8px 16px 0",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ paddingLeft: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
          Blood sugar trajectory
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Your path vs. what could happen vs. what you can change
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        {/* Zone backgrounds */}
        <rect
          x={pad.left}
          y={pad.top}
          width={chartW}
          height={diabeticY - pad.top}
          fill="#ffebee"
          opacity={0.25}
        />
        <rect
          x={pad.left}
          y={diabeticY}
          width={chartW}
          height={preDiabeticY - diabeticY}
          fill="#fff3e0"
          opacity={0.25}
        />
        <rect
          x={pad.left}
          y={preDiabeticY}
          width={chartW}
          height={pad.top + chartH - preDiabeticY}
          fill="#e8f5e9"
          opacity={0.2}
        />

        {/* Threshold lines */}
        <line
          x1={pad.left}
          y1={diabeticY}
          x2={pad.left + chartW}
          y2={diabeticY}
          stroke="#c62828"
          strokeWidth={1}
          strokeDasharray="6 4"
          opacity={0.4}
        />
        <text x={pad.left - 4} y={diabeticY + 3} fontSize={8} fill="#c62828" textAnchor="end" fontWeight={500}>
          7.0
        </text>
        <text x={pad.left + chartW + 2} y={diabeticY + 3} fontSize={7} fill="#c62828">
          diabetes
        </text>

        <line
          x1={pad.left}
          y1={preDiabeticY}
          x2={pad.left + chartW}
          y2={preDiabeticY}
          stroke="#e65100"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.4}
        />
        <text x={pad.left - 4} y={preDiabeticY + 3} fontSize={8} fill="#e65100" textAnchor="end" fontWeight={500}>
          6.1
        </text>
        <text x={pad.left + chartW + 2} y={preDiabeticY + 3} fontSize={7} fill="#e65100">
          pre-diabetes
        </text>

        {/* Family diagnosis age markers */}
        <line
          x1={toX(motherAge)}
          y1={pad.top}
          x2={toX(motherAge)}
          y2={pad.top + chartH}
          stroke={PURPLE.light}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.6}
        />
        <text x={toX(motherAge)} y={pad.top - 6} fontSize={8} fill={PURPLE.primary} textAnchor="middle" fontWeight={500}>
          Mum: 58
        </text>

        <line
          x1={toX(grandmotherAge)}
          y1={pad.top}
          x2={toX(grandmotherAge)}
          y2={pad.top + chartH}
          stroke={PURPLE.light}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.4}
        />
        <text x={toX(grandmotherAge)} y={pad.top - 6} fontSize={8} fill={PURPLE.light} textAnchor="middle" fontWeight={500}>
          Mormor: 62
        </text>

        {/* "Changed" future path (green) */}
        <path
          d={changedPath}
          fill="none"
          stroke="#4caf50"
          strokeWidth={1.5}
          strokeDasharray="6 3"
          opacity={0.6}
        />

        {/* Projected path (red dashed) */}
        {projPath && (
          <path
            d={projPath}
            fill="none"
            stroke="#ef5350"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            opacity={0.5}
          />
        )}

        {/* Actual data line */}
        <path
          d={annaPath}
          fill="none"
          stroke={PURPLE.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {annaPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="white" stroke={PURPLE.primary} strokeWidth={2} />
            {i === annaPoints.length - 1 && (
              <>
                <circle cx={p.x} cy={p.y} r={6} fill={PURPLE.primary} opacity={0.15} />
                <text x={p.x + 8} y={p.y + 4} fontSize={9} fill={PURPLE.deep} fontWeight={700}>
                  {p.value} (you)
                </text>
              </>
            )}
          </g>
        ))}

        {/* X axis - ages */}
        {[35, 40, 45, 50, 55, 60].map((age) => (
          <text
            key={age}
            x={toX(age)}
            y={height - 8}
            fontSize={9}
            fill="var(--text-muted)"
            textAnchor="middle"
          >
            {age}
          </text>
        ))}
        <text
          x={pad.left + chartW / 2}
          y={height}
          fontSize={9}
          fill="var(--text-muted)"
          textAnchor="middle"
        >
          age
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, paddingLeft: 16, paddingTop: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 2, background: PURPLE.primary, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Your data</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 16,
              height: 2,
              background: "#ef5350",
              borderRadius: 1,
              backgroundImage: "repeating-linear-gradient(90deg, #ef5350 0, #ef5350 4px, transparent 4px, transparent 8px)",
            }}
          />
          <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>If nothing changes</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 16,
              height: 2,
              background: "#4caf50",
              borderRadius: 1,
              backgroundImage: "repeating-linear-gradient(90deg, #4caf50 0, #4caf50 4px, transparent 4px, transparent 8px)",
            }}
          />
          <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>With prevention plan</span>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({
  comparison,
  index,
}: {
  comparison: (typeof AGE_COMPARISONS)[0];
  index: number;
}) {
  const statusColor =
    comparison.trend === "worsening"
      ? { bg: "#fff3e0", border: "#ffe0b2", text: "#e65100" }
      : comparison.trend === "managed"
        ? { bg: "#e8f5e9", border: "#c8e6c9", text: "#2e7d32" }
        : { bg: "#e3f2fd", border: "#bbdefb", text: "#1565c0" };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${400 + index * 120}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            {comparison.marker}
          </div>
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 600,
              background: statusColor.bg,
              color: statusColor.text,
              border: `1px solid ${statusColor.border}`,
            }}
          >
            {comparison.trend}
          </div>
        </div>

        {/* Your value */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 14,
            padding: "10px 14px",
            background: PURPLE.pale,
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: PURPLE.mid }}>
            You at {comparison.annaAge}:
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: PURPLE.deep }}>
            {comparison.annaValue}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{comparison.unit}</div>
        </div>

        {/* Family comparisons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {comparison.family.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "#fafafa",
                border: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <Clock size={12} style={{ color: "var(--text-muted)" }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{f.who}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{f.value}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4, paddingLeft: 18 }}>
                {f.note}
              </div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            background: comparison.trend === "managed" ? "#f1f8e9" : "#fff8e1",
            border: `1px solid ${comparison.trend === "managed" ? "#dcedc8" : "#ffe082"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            {comparison.trend === "managed" ? (
              <CheckCircle2 size={14} style={{ color: "#558b2f", marginTop: 1, flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={14} style={{ color: "#e65100", marginTop: 1, flexShrink: 0 }} />
            )}
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {comparison.insight}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineBar() {
  // Visual: age bar from 40 to 65
  const annaAge = PATIENT.age;
  const motherDiag = 58;
  const fatherDiag = 65;
  const grandmaDiag = 62;
  const grandpaDiag = 71;

  const minAge = 38;
  const maxAge = 72;
  const range = maxAge - minAge;

  const toPercent = (age: number) => ((age - minAge) / range) * 100;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "200ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          Where you are on the family timeline
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
          Your age now compared to when family members were diagnosed
        </div>

        {/* The bar */}
        <div style={{ position: "relative", height: 60, marginBottom: 20 }}>
          {/* Background bar */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 0,
              right: 0,
              height: 12,
              borderRadius: 6,
              background: "linear-gradient(90deg, #e8f5e9, #fff3e0, #ffebee, #fce4ec)",
            }}
          />

          {/* Anna marker (triangle) */}
          <div
            style={{
              position: "absolute",
              left: `${toPercent(annaAge)}%`,
              top: 6,
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: PURPLE.deep,
                marginBottom: 2,
              }}
            >
              You: {annaAge}
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: `8px solid ${PURPLE.primary}`,
                margin: "0 auto",
              }}
            />
          </div>

          {/* Family markers */}
          {[
            { age: motherDiag, label: "Mum", color: "#e65100" },
            { age: grandmaDiag, label: "Mormor", color: "#bf360c" },
            { age: fatherDiag, label: "Pappa", color: "#c62828" },
            { age: grandpaDiag, label: "Farfar", color: "#880e4f" },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                position: "absolute",
                left: `${toPercent(m.age)}%`,
                top: 38,
                transform: "translateX(-50%)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: m.color,
                  margin: "0 auto 2px",
                }}
              />
              <div style={{ fontSize: 9, fontWeight: 600, color: m.color, whiteSpace: "nowrap" }}>
                {m.label}: {m.age}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: PURPLE.pale,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 12, color: PURPLE.deep, fontWeight: 500, lineHeight: 1.5 }}>
            You have <strong>18 years</strong> before the earliest family diagnosis.
            That is 18 years to change the outcome.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrajectoryPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ background: PURPLE.wash, minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/smith5"
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            Your Trajectory
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Where you are vs. where they were
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Hero */}
        <div
          className="animate-fade-in"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            At 40, you are where
            <br />
            <span style={{ color: PURPLE.primary }}>the story can change</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Every number below compares your health today to where your family members were
            at the same age - or when they were diagnosed.
          </div>
        </div>

        {/* Age timeline bar */}
        <TimelineBar />

        {/* Glucose trajectory chart */}
        <div style={{ marginTop: 16 }}>
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "300ms", opacity: 0, animationFillMode: "forwards" }}
          >
            <GlucoseTrajectoryChart />
          </div>
        </div>

        {/* Marker comparisons */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Your numbers vs. family
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AGE_COMPARISONS.map((c, i) => (
              <ComparisonCard key={c.marker} comparison={c} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "1000ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 20,
          }}
        >
          <Link href="/smith5/change" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${PURPLE.primary}, ${PURPLE.accent})`,
                borderRadius: 14,
                padding: "16px 20px",
                textAlign: "center",
                color: "white",
                boxShadow: `0 4px 16px rgba(106, 27, 154, 0.3)`,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                See what you can change
              </div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                The risk factors that are in your control
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
