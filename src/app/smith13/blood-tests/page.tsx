"use client";

import React, { useState } from "react";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* ================================================================
   Trend Chart - clean line chart, Apple Health style
   ================================================================ */
function TrendChart({
  data,
  refLow,
  refHigh,
  color,
  unit,
  height = 120,
}: {
  data: { date: string; value: number }[];
  refLow: number;
  refHigh: number;
  color: string;
  unit: string;
  height?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  if (data.length < 2) return null;

  const width = 340;
  const padding = { top: 20, right: 16, bottom: 30, left: 0 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = [...data.map((d) => d.value), refLow, refHigh];
  const minVal = Math.min(...allValues) * 0.92;
  const maxVal = Math.max(...allValues) * 1.08;
  const range = maxVal - minVal || 1;

  const toX = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH;

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");

  // Gradient fill area
  const areaPoints = [
    `${toX(0)},${toY(data[0].value)}`,
    ...data.map((d, i) => `${toX(i)},${toY(d.value)}`),
    `${toX(data.length - 1)},${padding.top + chartH}`,
    `${toX(0)},${padding.top + chartH}`,
  ].join(" ");

  const refHighY = toY(refHigh);
  const refLowY = toY(refLow);

  const gradientId = `trend-grad-${color.replace("#", "")}`;
  const areaGradId = `area-grad-${color.replace("#", "")}`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
        <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Normal range band */}
      <rect
        x={padding.left}
        y={refHighY}
        width={chartW}
        height={refLowY - refHighY}
        fill="#30D158"
        opacity={0.06}
      />
      <line
        x1={padding.left}
        y1={refHighY}
        x2={padding.left + chartW}
        y2={refHighY}
        stroke="#30D158"
        strokeWidth={0.5}
        strokeDasharray="4,4"
        opacity={0.3}
      />
      <line
        x1={padding.left}
        y1={refLowY}
        x2={padding.left + chartW}
        y2={refLowY}
        stroke="#30D158"
        strokeWidth={0.5}
        strokeDasharray="4,4"
        opacity={0.3}
      />

      {/* Area fill */}
      <polygon points={areaPoints} fill={`url(#${areaGradId})`} />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((d, i) => (
        <g key={d.date}>
          <circle
            cx={toX(i)}
            cy={toY(d.value)}
            r={hovered === i ? 6 : (i === data.length - 1 ? 5 : 0)}
            fill={color}
            opacity={hovered === i || i === data.length - 1 ? 1 : 0}
          />
          {i === data.length - 1 && (
            <circle
              cx={toX(i)}
              cy={toY(d.value)}
              r={8}
              fill={color}
              opacity={0.2}
            />
          )}
          {/* Hover target */}
          <rect
            x={toX(i) - 20}
            y={0}
            width={40}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          />
        </g>
      ))}

      {/* Tooltip */}
      {hovered !== null && (
        <g>
          <rect
            x={Math.min(toX(hovered), width - 70) - 4}
            y={toY(data[hovered].value) - 28}
            width={68}
            height={22}
            rx={6}
            fill="#2C2C2E"
          />
          <text
            x={Math.min(toX(hovered), width - 70) + 30}
            y={toY(data[hovered].value) - 14}
            textAnchor="middle"
            style={{ fontSize: 11, fontWeight: 600, fill: "#FFFFFF", fontFamily: "inherit" }}
          >
            {data[hovered].value} {unit}
          </text>
        </g>
      )}

      {/* X axis labels */}
      {data.map((d, i) => (
        <text
          key={d.date}
          x={toX(i)}
          y={height - 4}
          textAnchor="middle"
          style={{
            fontSize: 10,
            fill: "#98989D",
            fontFamily: "inherit",
          }}
        >
          {new Date(d.date).getFullYear().toString().slice(2)}
        </text>
      ))}
    </svg>
  );
}

/* ================================================================
   Range Bar - horizontal bar showing value within reference range
   ================================================================ */
function RangeBar({
  value,
  refLow,
  refHigh,
  status,
}: {
  value: number;
  refLow: number;
  refHigh: number;
  status: string;
}) {
  const min = refLow * 0.7;
  const max = refHigh * 1.3;
  const range = max - min;
  const position = Math.max(0, Math.min(100, ((value - min) / range) * 100));
  const greenStart = ((refLow - min) / range) * 100;
  const greenEnd = ((refHigh - min) / range) * 100;

  const statusColor =
    status === "abnormal" ? "#FF453A" : status === "borderline" ? "#FFD60A" : "#30D158";

  return (
    <div style={{ position: "relative", height: 20, marginTop: 8 }}>
      {/* Track */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          right: 0,
          height: 4,
          borderRadius: 2,
          background: "#2C2C2E",
        }}
      />
      {/* Normal zone */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: `${greenStart}%`,
          width: `${greenEnd - greenStart}%`,
          height: 4,
          borderRadius: 2,
          background: "rgba(48, 209, 88, 0.3)",
        }}
      />
      {/* Marker */}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: `${position}%`,
          transform: "translateX(-6px)",
        }}
      >
        <svg width="12" height="16" viewBox="0 0 12 16">
          <path d="M6 0L12 8L6 16L0 8Z" fill={statusColor} />
        </svg>
      </div>
    </div>
  );
}

/* ================================================================
   Page Component
   ================================================================ */
export default function BloodTestsPage() {
  const [selectedSession, setSelectedSession] = useState(0);
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);
  const session = BLOOD_TEST_HISTORY[selectedSession];
  const latestNote = DOCTOR_NOTES[0];

  return (
    <div className="px-5 pb-8">
      {/* Header */}
      <div className="mb-5 mt-2">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Blood Work
        </p>
        <p style={{ color: "#98989D", fontSize: 15, fontWeight: 400, margin: 0, marginTop: 2 }}>
          {BLOOD_TEST_HISTORY.length} tests over 5 years
        </p>
      </div>

      {/* Session selector pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {BLOOD_TEST_HISTORY.map((s, i) => {
          const isActive = i === selectedSession;
          const dateStr = new Date(s.date).toLocaleDateString("en-SE", {
            month: "short",
            year: "numeric",
          });
          return (
            <button
              key={s.date}
              onClick={() => setSelectedSession(i)}
              style={{
                background: isActive ? "#FFFFFF" : "#1C1C1E",
                color: isActive ? "#000000" : "#98989D",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                padding: "6px 14px",
                borderRadius: 50,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {dateStr}
            </button>
          );
        })}
      </div>

      {/* Doctor's note */}
      {selectedSession === 0 && latestNote && (
        <div
          style={{
            background: "linear-gradient(135deg, #0A1628 0%, #1C1C1E 100%)",
            borderRadius: 16,
            padding: "16px 18px",
            marginBottom: 16,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0A84FF, #409CFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L12 22M2 12L22 12" />
              </svg>
            </div>
            <span style={{ color: "#0A84FF", fontSize: 13, fontWeight: 600 }}>
              Dr. Johansson&apos;s Review
            </span>
          </div>
          <p style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 400, margin: 0, lineHeight: 1.6 }}>
            Your glucose continues to rise slowly. Still within normal range, but the 5-year trend needs attention. I recommend we retest in September and continue your training program.
          </p>
        </div>
      )}

      {/* Key glucose trend chart */}
      <div
        style={{
          background: "#1C1C1E",
          borderRadius: 22,
          padding: "20px 16px 12px",
          marginBottom: 16,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <p style={{ color: "#98989D", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em" }}>
              BLOOD SUGAR (FASTING)
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span style={{ color: "#FFFFFF", fontSize: 34, fontWeight: 700 }}>5.8</span>
              <span style={{ color: "#98989D", fontSize: 15 }}>mmol/L</span>
            </div>
          </div>
          <div
            style={{
              background: "rgba(255, 45, 85, 0.15)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <span style={{ color: "#FF2D55", fontSize: 13, fontWeight: 600 }}>Borderline</span>
          </div>
        </div>
        <TrendChart
          data={getMarkerHistory("f-Glucose")}
          refLow={3.9}
          refHigh={6.0}
          color="#FF2D55"
          unit="mmol/L"
        />
        <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0, marginTop: 4, textAlign: "center" }}>
          5-year trend - normal range shaded green
        </p>
      </div>

      {/* HbA1c trend chart */}
      <div
        style={{
          background: "#1C1C1E",
          borderRadius: 22,
          padding: "20px 16px 12px",
          marginBottom: 16,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <p style={{ color: "#98989D", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.06em" }}>
              HbA1c (LONG-TERM BLOOD SUGAR)
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span style={{ color: "#FFFFFF", fontSize: 34, fontWeight: 700 }}>38</span>
              <span style={{ color: "#98989D", fontSize: 15 }}>mmol/mol</span>
            </div>
          </div>
          <div
            style={{
              background: "rgba(48, 209, 88, 0.15)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <span style={{ color: "#30D158", fontSize: 13, fontWeight: 600 }}>Normal</span>
          </div>
        </div>
        <TrendChart
          data={getMarkerHistory("HbA1c")}
          refLow={20}
          refHigh={42}
          color="#30D158"
          unit="mmol/mol"
        />
      </div>

      {/* All markers for selected session */}
      <div className="mb-4">
        <p
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          All Results
        </p>
        <p style={{ color: "#98989D", fontSize: 13, fontWeight: 400, margin: 0, marginTop: 2 }}>
          {new Date(session.date).toLocaleDateString("en-SE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} - {session.orderedBy}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {session.results.map((marker) => {
          const isExpanded = expandedMarker === marker.shortName;
          const history = getMarkerHistory(marker.shortName);
          const statusColor =
            marker.status === "abnormal"
              ? "#FF453A"
              : marker.status === "borderline"
              ? "#FFD60A"
              : "#30D158";

          return (
            <div
              key={marker.shortName}
              style={{
                background: "#1C1C1E",
                borderRadius: 16,
                padding: "14px 16px",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onClick={() =>
                setExpandedMarker(isExpanded ? null : marker.shortName)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, margin: 0 }}>
                    {marker.plainName}
                  </p>
                  <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0, marginTop: 1 }}>
                    {marker.name} - Ref: {marker.refLow}-{marker.refHigh} {marker.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>
                      {marker.value}
                    </span>
                    <span style={{ color: "#98989D", fontSize: 12, marginLeft: 4 }}>
                      {marker.unit}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusColor,
                    }}
                  />
                </div>
              </div>

              {/* Range bar */}
              <RangeBar
                value={marker.value}
                refLow={marker.refLow}
                refHigh={marker.refHigh}
                status={marker.status}
              />

              {/* Expanded: trend chart */}
              {isExpanded && history.length > 1 && (
                <div style={{ marginTop: 12 }}>
                  <TrendChart
                    data={history}
                    refLow={marker.refLow}
                    refHigh={marker.refHigh}
                    color={statusColor}
                    unit={marker.unit}
                    height={100}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lab info */}
      <div
        className="mt-6 text-center"
        style={{ paddingBottom: 12 }}
      >
        <p style={{ color: "#98989D", fontSize: 12, fontWeight: 400, margin: 0 }}>
          {session.lab}
        </p>
        <p style={{ color: "#98989D", fontSize: 11, fontWeight: 400, margin: 0, marginTop: 2 }}>
          Ordered by {session.orderedBy}
        </p>
      </div>
    </div>
  );
}
