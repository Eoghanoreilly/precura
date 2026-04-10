"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import {
  PATIENT,
  RISK_ASSESSMENTS,
  FAMILY_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// THE TRAJECTORY - The chart that changes everything
// ============================================================================

// Glucose data points (real)
const glucoseHistory = [
  { year: 2021, value: 5.0 },
  { year: 2022, value: 5.1 },
  { year: 2023, value: 5.2 },
  { year: 2024, value: 5.4 },
  { year: 2025, value: 5.5 },
  { year: 2026, value: 5.8 },
];

// Projected "if nothing changes" - continues the accelerating trend
const projectedWorst = [
  { year: 2026, value: 5.8 },
  { year: 2027, value: 6.05 },
  { year: 2028, value: 6.3 },
  { year: 2029, value: 6.55 },
  { year: 2030, value: 6.8 },
  { year: 2031, value: 7.05 },
];

// Projected "with intervention" - lifestyle changes bend the curve
const projectedBest = [
  { year: 2026, value: 5.8 },
  { year: 2027, value: 5.6 },
  { year: 2028, value: 5.4 },
  { year: 2029, value: 5.3 },
  { year: 2030, value: 5.2 },
  { year: 2031, value: 5.1 },
];

// Chart dimensions
const CHART = {
  width: 680,
  height: 380,
  padTop: 40,
  padBottom: 50,
  padLeft: 52,
  padRight: 30,
  yearStart: 2021,
  yearEnd: 2031,
  valueMin: 4.5,
  valueMax: 7.5,
};

function yearToX(year: number): number {
  const ratio = (year - CHART.yearStart) / (CHART.yearEnd - CHART.yearStart);
  return CHART.padLeft + ratio * (CHART.width - CHART.padLeft - CHART.padRight);
}

function valueToY(val: number): number {
  const ratio = (val - CHART.valueMin) / (CHART.valueMax - CHART.valueMin);
  return CHART.height - CHART.padBottom - ratio * (CHART.height - CHART.padTop - CHART.padBottom);
}

function pointsToPath(points: { year: number; value: number }[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${yearToX(p.year)} ${valueToY(p.value)}`)
    .join(" ");
}

// Smooth bezier path for curves
function pointsToCurve(points: { year: number; value: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${yearToX(points[0].year)} ${valueToY(points[0].value)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (yearToX(prev.year) + yearToX(curr.year)) / 2;
    d += ` C ${cpx} ${valueToY(prev.value)}, ${cpx} ${valueToY(curr.value)}, ${yearToX(curr.year)} ${valueToY(curr.value)}`;
  }
  return d;
}

// Reference lines
const THRESHOLDS = [
  { value: 6.1, label: "Impaired fasting glucose", color: "#e65100" },
  { value: 7.0, label: "Diabetes diagnosis", color: "#c62828" },
];

export default function Smith10Page() {
  const [animProgress, setAnimProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    value: number;
    x: number;
    y: number;
  } | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;
    function tick(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimProgress(eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, []);

  // Clip the paths based on animation progress
  const totalPathLength = CHART.width - CHART.padLeft - CHART.padRight;
  const clipWidth = CHART.padLeft + animProgress * totalPathLength + CHART.padRight;

  // Years for the x-axis
  const years = [];
  for (let y = CHART.yearStart; y <= CHART.yearEnd; y++) years.push(y);

  // Y axis ticks
  const yTicks = [5.0, 5.5, 6.0, 6.5, 7.0];

  // Mother's diagnosis context
  const motherDx = FAMILY_HISTORY.find(
    (f) => f.relative === "Mother" && f.condition.includes("Diabetes")
  );
  const yearsUntilMotherAge = motherDx
    ? motherDx.ageAtDiagnosis - PATIENT.age
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "#c41c1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#1a1a2e",
              letterSpacing: "-0.3px",
            }}
          >
            Precura
          </span>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#f1f3f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={16} color="#555770" />
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {/* Header */}
        <div style={{ padding: "28px 0 8px" }}>
          <p
            style={{
              fontSize: 13,
              color: "#8b8da3",
              fontWeight: 500,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Your glucose trajectory
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            5.0 to 5.8 in five years.
            <br />
            <span style={{ color: "#c41c1c" }}>Where is this heading?</span>
          </h1>
        </div>

        {/* THE CHART */}
        <div
          style={{
            margin: "20px 0 0",
            background: "#fafafa",
            borderRadius: 16,
            border: "1px solid #eee",
            padding: "20px 12px 12px 0",
            overflow: "hidden",
          }}
        >
          <svg
            ref={chartRef}
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              overflow: "visible",
            }}
          >
            <defs>
              {/* Clip for animation */}
              <clipPath id="chart-clip">
                <rect x={0} y={0} width={clipWidth} height={CHART.height} />
              </clipPath>

              {/* Red gradient for "no change" projection */}
              <linearGradient
                id="danger-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#c41c1c" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#c41c1c" stopOpacity={0.3} />
              </linearGradient>

              {/* Green gradient for "with intervention" projection */}
              <linearGradient
                id="hope-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2e7d32" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2e7d32" stopOpacity={0.3} />
              </linearGradient>

              {/* Area fill under danger path */}
              <linearGradient
                id="danger-area"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#c41c1c" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#c41c1c" stopOpacity={0} />
              </linearGradient>

              {/* Area fill under hope path */}
              <linearGradient
                id="hope-area"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2e7d32" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#2e7d32" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Danger zone backgrounds */}
            {/* Impaired fasting glucose zone */}
            <rect
              x={CHART.padLeft}
              y={valueToY(7.0)}
              width={CHART.width - CHART.padLeft - CHART.padRight}
              height={valueToY(6.1) - valueToY(7.0)}
              fill="#fff3e0"
              opacity={0.5}
            />
            {/* Diabetes zone */}
            <rect
              x={CHART.padLeft}
              y={valueToY(CHART.valueMax)}
              width={CHART.width - CHART.padLeft - CHART.padRight}
              height={valueToY(7.0) - valueToY(CHART.valueMax)}
              fill="#ffebee"
              opacity={0.4}
            />

            {/* Grid lines */}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={CHART.padLeft}
                  y1={valueToY(tick)}
                  x2={CHART.width - CHART.padRight}
                  y2={valueToY(tick)}
                  stroke="#e8e8e8"
                  strokeWidth={1}
                  strokeDasharray={tick === 5.0 ? "0" : "4 3"}
                />
                <text
                  x={CHART.padLeft - 10}
                  y={valueToY(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="#999"
                  fontSize={11}
                  fontWeight={500}
                  fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Year axis labels */}
            {years.map((year) => (
              <text
                key={year}
                x={yearToX(year)}
                y={CHART.height - CHART.padBottom + 24}
                textAnchor="middle"
                fill={year === 2026 ? "#1a1a2e" : "#bbb"}
                fontSize={11}
                fontWeight={year === 2026 ? 700 : 400}
                fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
              >
                {year}
              </text>
            ))}

            {/* Vertical "now" line at 2026 */}
            <line
              x1={yearToX(2026)}
              y1={CHART.padTop}
              x2={yearToX(2026)}
              y2={CHART.height - CHART.padBottom}
              stroke="#1a1a2e"
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.3}
            />
            <text
              x={yearToX(2026)}
              y={CHART.padTop - 10}
              textAnchor="middle"
              fill="#1a1a2e"
              fontSize={10}
              fontWeight={700}
              fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
              letterSpacing="0.5"
            >
              NOW
            </text>

            {/* Threshold reference lines */}
            {THRESHOLDS.map((t) => (
              <g key={t.value}>
                <line
                  x1={CHART.padLeft}
                  y1={valueToY(t.value)}
                  x2={CHART.width - CHART.padRight}
                  y2={valueToY(t.value)}
                  stroke={t.color}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  opacity={0.6}
                />
                <text
                  x={CHART.width - CHART.padRight + 4}
                  y={valueToY(t.value)}
                  dominantBaseline="middle"
                  fill={t.color}
                  fontSize={9}
                  fontWeight={600}
                  fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                >
                  {t.value.toFixed(1)}
                </text>
              </g>
            ))}
            {/* Threshold labels on left */}
            <text
              x={CHART.padLeft + 6}
              y={valueToY(6.1) - 7}
              fill="#e65100"
              fontSize={9}
              fontWeight={600}
              fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
              opacity={0.8}
            >
              Impaired fasting glucose
            </text>
            <text
              x={CHART.padLeft + 6}
              y={valueToY(7.0) - 7}
              fill="#c62828"
              fontSize={9}
              fontWeight={600}
              fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
              opacity={0.8}
            >
              Diabetes diagnosis
            </text>

            {/* Animated content group */}
            <g clipPath="url(#chart-clip)">
              {/* Area fills for projected paths */}
              {/* Danger area */}
              <path
                d={
                  pointsToCurve(projectedWorst) +
                  ` L ${yearToX(2031)} ${CHART.height - CHART.padBottom} L ${yearToX(2026)} ${CHART.height - CHART.padBottom} Z`
                }
                fill="url(#danger-area)"
              />
              {/* Hope area */}
              <path
                d={
                  pointsToCurve(projectedBest) +
                  ` L ${yearToX(2031)} ${CHART.height - CHART.padBottom} L ${yearToX(2026)} ${CHART.height - CHART.padBottom} Z`
                }
                fill="url(#hope-area)"
              />

              {/* Projected "if nothing changes" line */}
              <path
                d={pointsToCurve(projectedWorst)}
                fill="none"
                stroke="url(#danger-gradient)"
                strokeWidth={2.5}
                strokeDasharray="6 4"
              />

              {/* Projected "with intervention" line */}
              <path
                d={pointsToCurve(projectedBest)}
                fill="none"
                stroke="url(#hope-gradient)"
                strokeWidth={2.5}
                strokeDasharray="6 4"
              />

              {/* Historical line - THE TRAJECTORY */}
              <path
                d={pointsToCurve(glucoseHistory)}
                fill="none"
                stroke="#c41c1c"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points on historical line */}
              {glucoseHistory.map((p, i) => (
                <g key={p.year}>
                  <circle
                    cx={yearToX(p.year)}
                    cy={valueToY(p.value)}
                    r={i === glucoseHistory.length - 1 ? 6 : 3.5}
                    fill={i === glucoseHistory.length - 1 ? "#c41c1c" : "#fff"}
                    stroke="#c41c1c"
                    strokeWidth={i === glucoseHistory.length - 1 ? 0 : 2}
                  />
                  {/* Latest point: pulsing ring */}
                  {i === glucoseHistory.length - 1 && (
                    <circle
                      cx={yearToX(p.year)}
                      cy={valueToY(p.value)}
                      r={10}
                      fill="none"
                      stroke="#c41c1c"
                      strokeWidth={1.5}
                      opacity={0.3}
                    >
                      <animate
                        attributeName="r"
                        from="6"
                        to="16"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.4"
                        to="0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {/* Value label on latest point */}
                  {i === glucoseHistory.length - 1 && (
                    <text
                      x={yearToX(p.year) + 14}
                      y={valueToY(p.value) - 2}
                      fill="#c41c1c"
                      fontSize={13}
                      fontWeight={800}
                      fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                    >
                      {p.value.toFixed(1)}
                    </text>
                  )}
                </g>
              ))}

              {/* Endpoint labels for projections */}
              {/* Danger endpoint */}
              <g>
                <circle
                  cx={yearToX(2031)}
                  cy={valueToY(7.05)}
                  r={3}
                  fill="#c41c1c"
                  opacity={0.4}
                />
                <text
                  x={yearToX(2031) - 4}
                  y={valueToY(7.05) - 10}
                  textAnchor="end"
                  fill="#c41c1c"
                  fontSize={10}
                  fontWeight={700}
                  fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                  opacity={0.7}
                >
                  7.0 if nothing changes
                </text>
              </g>

              {/* Hope endpoint */}
              <g>
                <circle
                  cx={yearToX(2031)}
                  cy={valueToY(5.1)}
                  r={3}
                  fill="#2e7d32"
                  opacity={0.4}
                />
                <text
                  x={yearToX(2031) - 4}
                  y={valueToY(5.1) + 16}
                  textAnchor="end"
                  fill="#2e7d32"
                  fontSize={10}
                  fontWeight={700}
                  fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                  opacity={0.7}
                >
                  5.1 with lifestyle changes
                </text>
              </g>
            </g>

            {/* Interactive hover areas over data points */}
            {glucoseHistory.map((p) => (
              <rect
                key={`hover-${p.year}`}
                x={yearToX(p.year) - 20}
                y={valueToY(p.value) - 20}
                width={40}
                height={40}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setHoveredPoint({
                    year: p.year,
                    value: p.value,
                    x: yearToX(p.year),
                    y: valueToY(p.value),
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Tooltip */}
            {hoveredPoint && (
              <g>
                <rect
                  x={hoveredPoint.x - 40}
                  y={hoveredPoint.y - 36}
                  width={80}
                  height={24}
                  rx={6}
                  fill="#1a1a2e"
                />
                <text
                  x={hoveredPoint.x}
                  y={hoveredPoint.y - 20}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={11}
                  fontWeight={600}
                  fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                >
                  {hoveredPoint.value.toFixed(1)} mmol/L
                </text>
              </g>
            )}
          </svg>

          {/* Chart legend */}
          <div
            style={{
              display: "flex",
              gap: 20,
              padding: "12px 16px 4px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: "#c41c1c",
                }}
              />
              <span
                style={{ fontSize: 11, color: "#666", fontWeight: 500 }}
              >
                Your glucose (fasting blood sugar)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 2,
                  borderRadius: 2,
                  background: "#c41c1c",
                  opacity: 0.4,
                  borderTop: "2px dashed #c41c1c",
                }}
              />
              <span style={{ fontSize: 11, color: "#666" }}>If nothing changes</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 2,
                  borderRadius: 2,
                  background: "#2e7d32",
                  opacity: 0.4,
                  borderTop: "2px dashed #2e7d32",
                }}
              />
              <span style={{ fontSize: 11, color: "#666" }}>With lifestyle changes</span>
            </div>
          </div>
        </div>

        {/* Key insight */}
        <div
          style={{
            margin: "20px 0 0",
            padding: "16px 20px",
            background: "#fff5f5",
            borderRadius: 14,
            border: "1px solid #fecaca",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <AlertTriangle
              size={18}
              color="#c41c1c"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  margin: "0 0 4px",
                }}
              >
                Your blood sugar has risen every single year since 2021
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#555770",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Each reading was called &quot;normal&quot; on its own. But the
                pattern is clear: 5.0, 5.1, 5.2, 5.4, 5.5, 5.8. At this
                rate, you could reach 6.1 (impaired fasting glucose) by 2028.
                {yearsUntilMotherAge && (
                  <>
                    {" "}
                    Your mother was diagnosed with type 2 diabetes at {motherDx?.ageAtDiagnosis} - that&apos;s{" "}
                    {yearsUntilMotherAge} years from your current age.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Doctor's take */}
        <div
          style={{
            margin: "16px 0 0",
            padding: "16px 20px",
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={14} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", margin: 0 }}>
                Dr. Marcus Johansson
              </p>
              <p style={{ fontSize: 11, color: "#8b8da3", margin: 0 }}>
                Precura medical team
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#555770",
              margin: 0,
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            &quot;Each individual reading was reported as normal. But this is exactly
            the pattern Precura is built to catch - a slow, steady rise that no single
            test reveals. The good news: lifestyle changes at this stage are highly
            effective. Your training plan is designed to target this.&quot;
          </p>
        </div>

        {/* Navigation cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            margin: "24px 0 0",
          }}
        >
          <NavCard
            href="/smith10/drivers"
            title="What's driving this"
            subtitle="Risk factors you can change, and ones you can't"
            icon={<TrendingUp size={18} color="#e65100" />}
            accent="#fff8e1"
          />
          <NavCard
            href="/smith10/bend"
            title="How to bend the curve"
            subtitle="Your training plan, lifestyle targets, and next blood test"
            icon={<ArrowRight size={18} color="#2e7d32" />}
            accent="#e8f5e9"
          />
          <NavCard
            href="/smith10/checkpoint"
            title="Your latest checkpoint"
            subtitle="Blood test results from March 2026"
            icon={<Calendar size={18} color="var(--accent)" />}
            accent="var(--accent-light)"
          />
        </div>

        {/* Next checkpoint */}
        <div
          style={{
            margin: "24px 0 0",
            padding: "16px 20px",
            background: "#f8f9fa",
            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "#8b8da3",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 4px",
            }}
          >
            Next checkpoint
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1a1a2e",
              margin: "0 0 4px",
            }}
          >
            September 2026
          </p>
          <p style={{ fontSize: 13, color: "#555770", margin: 0 }}>
            Blood test booked - we&apos;ll measure if the curve is bending
          </p>
        </div>

        {/* Bottom info */}
        <p
          style={{
            fontSize: 11,
            color: "#b8bac6",
            textAlign: "center",
            margin: "24px 0 0",
            lineHeight: 1.5,
          }}
        >
          Data from 6 fasting glucose tests (2021-2026). Projections based on
          historical trend and clinical literature on lifestyle intervention
          efficacy. Not a diagnosis.
        </p>
      </div>
    </div>
  );
}

// Navigation card component
function NavCard({
  href,
  title,
  subtitle,
  icon,
  accent,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid var(--border)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#1a1a2e",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "#8b8da3",
            margin: "2px 0 0",
          }}
        >
          {subtitle}
        </p>
      </div>
      <ArrowRight size={16} color="#b8bac6" />
    </Link>
  );
}
