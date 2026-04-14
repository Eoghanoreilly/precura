"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PATIENT,
  FAMILY_HISTORY,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// The Trajectory Chart - pure SVG
// ============================================================================

function TrajectoryChart() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    year: number;
    value: number;
    type: string;
  } | null>(null);

  // Chart dimensions
  const W = 720;
  const H = 420;
  const PAD = { top: 32, right: 40, bottom: 56, left: 56 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Data
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const realData = glucoseHistory.map((d) => ({
    year: new Date(d.date).getFullYear(),
    value: d.value,
  }));

  // Projected futures
  const lastReal = realData[realData.length - 1];
  const noChangeProjection = [
    { year: lastReal.year, value: lastReal.value },
    { year: 2027, value: 6.0 },
    { year: 2028, value: 6.2 },
    { year: 2029, value: 6.5 },
    { year: 2030, value: 6.8 },
    { year: 2031, value: 7.0 },
  ];

  const interventionProjection = [
    { year: lastReal.year, value: lastReal.value },
    { year: 2027, value: 5.6 },
    { year: 2028, value: 5.4 },
    { year: 2029, value: 5.3 },
    { year: 2030, value: 5.2 },
    { year: 2031, value: 5.2 },
  ];

  // Axes
  const xMin = 2021;
  const xMax = 2031;
  const yMin = 4.0;
  const yMax = 8.0;

  const toX = (year: number) =>
    PAD.left + ((year - xMin) / (xMax - xMin)) * plotW;
  const toY = (val: number) =>
    PAD.top + ((yMax - val) / (yMax - yMin)) * plotH;

  // Reference lines
  const impaired = 6.1;
  const diabetic = 7.0;

  // Build SVG paths
  const buildPath = (points: { year: number; value: number }[]) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.year)} ${toY(p.value)}`)
      .join(" ");

  const realPath = buildPath(realData);
  const noChangePath = buildPath(noChangeProjection);
  const interventionPath = buildPath(interventionProjection);

  // Mother's diagnosis marker
  const motherDiabetes = FAMILY_HISTORY.find(
    (f) => f.relative === "Mother" && f.condition.includes("Diabetes")
  );
  const motherAge = motherDiabetes?.ageAtDiagnosis || 58;
  const annaBirthYear = new Date(PATIENT.dateOfBirth).getFullYear();
  const motherDxYear = annaBirthYear + motherAge; // 1985 + 58 = 2043

  // Year labels on x-axis
  const xYears = [2021, 2023, 2025, 2026, 2028, 2031];
  // Y labels
  const yValues = [4.0, 5.0, 6.0, 7.0, 8.0];

  // Hover hit targets for real data points
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const my = ((e.clientY - rect.top) / rect.height) * H;

    let closest: typeof hoveredPoint = null;
    let closestDist = 20;

    const checkPoints = (
      points: { year: number; value: number }[],
      type: string
    ) => {
      points.forEach((p) => {
        const px = toX(p.year);
        const py = toY(p.value);
        const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
        if (dist < closestDist) {
          closestDist = dist;
          closest = { x: px, y: py, year: p.year, value: p.value, type };
        }
      });
    };

    checkPoints(realData, "real");
    checkPoints(noChangeProjection.slice(1), "projected");
    checkPoints(interventionProjection.slice(1), "intervention");

    setHoveredPoint(closest);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredPoint(null)}
    >
      {/* Background */}
      <rect width={W} height={H} fill="#FEFFFE" />

      {/* "NOW" divider - vertical line at 2026 */}
      <line
        x1={toX(2026)}
        y1={PAD.top}
        x2={toX(2026)}
        y2={PAD.top + plotH}
        stroke="#E0E0E0"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text
        x={toX(2026)}
        y={PAD.top - 12}
        textAnchor="middle"
        style={{
          fontSize: 10,
          fill: "#8A8A8A",
          fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          fontWeight: 500,
          letterSpacing: "0.05em",
        }}
      >
        NOW
      </text>

      {/* Projected zone background - subtle */}
      <rect
        x={toX(2026)}
        y={PAD.top}
        width={toX(2031) - toX(2026)}
        height={plotH}
        fill="#FAFAFA"
      />

      {/* Reference lines */}
      <line
        x1={PAD.left}
        y1={toY(impaired)}
        x2={PAD.left + plotW}
        y2={toY(impaired)}
        stroke="#E0E0E0"
        strokeWidth={0.75}
      />
      <text
        x={PAD.left + plotW + 4}
        y={toY(impaired) + 3}
        style={{
          fontSize: 9,
          fill: "#8A8A8A",
          fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
        }}
      >
        6.1
      </text>

      <line
        x1={PAD.left}
        y1={toY(diabetic)}
        x2={PAD.left + plotW}
        y2={toY(diabetic)}
        stroke="#CC0000"
        strokeWidth={0.75}
        opacity={0.3}
      />
      <text
        x={PAD.left + plotW + 4}
        y={toY(diabetic) + 3}
        style={{
          fontSize: 9,
          fill: "#CC0000",
          fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
        }}
      >
        7.0
      </text>

      {/* Label for reference lines */}
      <text
        x={PAD.left + 4}
        y={toY(impaired) - 6}
        style={{
          fontSize: 9,
          fill: "#8A8A8A",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        Impaired fasting glucose
      </text>
      <text
        x={PAD.left + 4}
        y={toY(diabetic) - 6}
        style={{
          fontSize: 9,
          fill: "#CC0000",
          opacity: 0.6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        Diabetes threshold
      </text>

      {/* Intervention projection - dashed green */}
      <path
        d={interventionPath}
        fill="none"
        stroke="#00B341"
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.7}
      />

      {/* No-change projection - dashed red */}
      <path
        d={noChangePath}
        fill="none"
        stroke="#CC0000"
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.7}
      />

      {/* Real data line - solid red */}
      <path
        d={realPath}
        fill="none"
        stroke="#CC0000"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Real data points */}
      {realData.map((d) => (
        <circle
          key={`real-${d.year}`}
          cx={toX(d.year)}
          cy={toY(d.value)}
          r={3}
          fill="#CC0000"
          stroke="#FEFFFE"
          strokeWidth={1.5}
        />
      ))}

      {/* End markers for projections */}
      <circle
        cx={toX(2031)}
        cy={toY(7.0)}
        r={4}
        fill="none"
        stroke="#CC0000"
        strokeWidth={1.5}
        strokeDasharray="2 2"
      />
      <circle
        cx={toX(2031)}
        cy={toY(5.2)}
        r={4}
        fill="none"
        stroke="#00B341"
        strokeWidth={1.5}
        strokeDasharray="2 2"
      />

      {/* Projection labels */}
      <text
        x={toX(2031) - 4}
        y={toY(7.0) - 10}
        textAnchor="end"
        style={{
          fontSize: 11,
          fill: "#CC0000",
          fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          fontWeight: 600,
        }}
      >
        7.0
      </text>
      <text
        x={toX(2031) - 4}
        y={toY(5.2) + 18}
        textAnchor="end"
        style={{
          fontSize: 11,
          fill: "#00B341",
          fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          fontWeight: 600,
        }}
      >
        5.2
      </text>

      {/* X axis labels */}
      {xYears.map((year) => (
        <text
          key={year}
          x={toX(year)}
          y={PAD.top + plotH + 24}
          textAnchor="middle"
          style={{
            fontSize: 11,
            fill: year === 2026 ? "#0F0F0F" : "#8A8A8A",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
            fontWeight: year === 2026 ? 600 : 400,
          }}
        >
          {year}
        </text>
      ))}

      {/* Y axis labels */}
      {yValues.map((val) => (
        <text
          key={val}
          x={PAD.left - 12}
          y={toY(val) + 4}
          textAnchor="end"
          style={{
            fontSize: 11,
            fill: "#8A8A8A",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          {val.toFixed(1)}
        </text>
      ))}

      {/* Y axis unit */}
      <text
        x={PAD.left - 12}
        y={PAD.top - 12}
        textAnchor="end"
        style={{
          fontSize: 9,
          fill: "#8A8A8A",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        mmol/L
      </text>

      {/* Mother annotation */}
      <text
        x={PAD.left + plotW}
        y={PAD.top + plotH + 44}
        textAnchor="end"
        style={{
          fontSize: 10,
          fill: "#8A8A8A",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        Mother diagnosed with type 2 diabetes at age {motherAge} ({motherDxYear})
      </text>

      {/* Hover tooltip */}
      {hoveredPoint && (
        <>
          <circle
            cx={hoveredPoint.x}
            cy={hoveredPoint.y}
            r={6}
            fill={
              hoveredPoint.type === "intervention"
                ? "#00B341"
                : hoveredPoint.type === "projected"
                ? "#CC0000"
                : "#CC0000"
            }
            opacity={0.2}
          />
          <rect
            x={hoveredPoint.x - 36}
            y={hoveredPoint.y - 32}
            width={72}
            height={22}
            rx={2}
            fill="#0F0F0F"
          />
          <text
            x={hoveredPoint.x}
            y={hoveredPoint.y - 17}
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#FFFFFF",
              fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
              fontWeight: 600,
            }}
          >
            {hoveredPoint.value.toFixed(1)} / {hoveredPoint.year}
          </text>
        </>
      )}

      {/* Legend */}
      <line x1={PAD.left} y1={PAD.top + plotH + 38} x2={PAD.left + 16} y2={PAD.top + plotH + 38} stroke="#CC0000" strokeWidth={2} />
      <text
        x={PAD.left + 22}
        y={PAD.top + plotH + 42}
        style={{
          fontSize: 10,
          fill: "#8A8A8A",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        Your glucose
      </text>

      <line x1={PAD.left + 100} y1={PAD.top + plotH + 38} x2={PAD.left + 116} y2={PAD.top + plotH + 38} stroke="#CC0000" strokeWidth={2} strokeDasharray="4 3" />
      <text
        x={PAD.left + 122}
        y={PAD.top + plotH + 42}
        style={{
          fontSize: 10,
          fill: "#8A8A8A",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        No change
      </text>

      <line x1={PAD.left + 200} y1={PAD.top + plotH + 38} x2={PAD.left + 216} y2={PAD.top + plotH + 38} stroke="#00B341" strokeWidth={2} strokeDasharray="4 3" />
      <text
        x={PAD.left + 222}
        y={PAD.top + plotH + 42}
        style={{
          fontSize: 10,
          fill: "#8A8A8A",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        With intervention
      </text>
    </svg>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function TrajectoryPage() {
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latest = glucoseHistory[glucoseHistory.length - 1];
  const earliest = glucoseHistory[0];
  const delta = (latest.value - earliest.value).toFixed(1);
  const years =
    new Date(latest.date).getFullYear() - new Date(earliest.date).getFullYear();

  return (
    <div
      className="mx-auto px-4"
      style={{
        maxWidth: 720,
        paddingTop: 48,
        paddingBottom: 120,
      }}
    >
      {/* Header - tiny */}
      <header className="flex items-center justify-between" style={{ marginBottom: 64 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0F0F0F",
            letterSpacing: "-0.01em",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Precura
        </span>
        <span
          style={{
            fontSize: 12,
            color: "#8A8A8A",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          {PATIENT.firstName} {PATIENT.name.split(" ")[1]}
        </span>
      </header>

      {/* The number */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: "#CC0000",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          {latest.value}
        </span>
        <span
          style={{
            fontSize: 16,
            color: "#8A8A8A",
            marginLeft: 8,
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          mmol/L
        </span>
      </div>

      {/* The statement */}
      <p
        style={{
          fontSize: 18,
          color: "#0F0F0F",
          lineHeight: 1.6,
          margin: 0,
          marginBottom: 48,
          maxWidth: 480,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        Your fasting glucose (blood sugar) has risen +{delta} over {years} years.
        Nobody told you. This is where it leads.
      </p>

      {/* The chart */}
      <div
        style={{
          border: "1px solid #F0F0F0",
          borderRadius: 2,
          padding: 16,
          marginBottom: 48,
          boxShadow: "0 0.5px 2px rgba(0,0,0,0.05)",
          background: "#FFFFFF",
        }}
      >
        <TrajectoryChart />
      </div>

      {/* The context - sparse */}
      <div
        className="flex flex-col gap-6"
        style={{ marginBottom: 56 }}
      >
        <div className="flex justify-between items-baseline" style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: 12 }}>
          <span style={{
            fontSize: 13,
            color: "#8A8A8A",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}>
            10-year diabetes risk
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#0F0F0F",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}>
            {RISK_ASSESSMENTS.diabetes.tenYearRisk}
          </span>
        </div>

        <div className="flex justify-between items-baseline" style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: 12 }}>
          <span style={{
            fontSize: 13,
            color: "#8A8A8A",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}>
            Family history
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#0F0F0F",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}>
            Mother, type 2 diabetes at 58
          </span>
        </div>

        <div className="flex justify-between items-baseline" style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: 12 }}>
          <span style={{
            fontSize: 13,
            color: "#8A8A8A",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}>
            Trend
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#CC0000",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}>
            +{delta} in {years} years
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span style={{
            fontSize: 13,
            color: "#8A8A8A",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}>
            Status
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#0F0F0F",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}>
            Not diabetic. Not yet.
          </span>
        </div>
      </div>

      {/* The call to action */}
      <Link href="/smith10/plan" style={{ textDecoration: "none" }}>
        <div
          style={{
            background: "#0F0F0F",
            color: "#FEFFFE",
            padding: "16px 24px",
            borderRadius: 2,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.02em",
            cursor: "pointer",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          See what changes this
        </div>
      </Link>
    </div>
  );
}
