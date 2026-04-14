"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Stethoscope,
} from "lucide-react";

function RangeBar({
  value,
  refLow,
  refHigh,
  unit,
  status,
}: {
  value: number;
  refLow: number;
  refHigh: number;
  unit: string;
  status: string;
}) {
  const range = refHigh - refLow;
  const padding = range * 0.4;
  const displayMin = Math.max(0, refLow - padding);
  const displayMax = refHigh + padding;
  const displayRange = displayMax - displayMin;

  const normalStart = ((refLow - displayMin) / displayRange) * 100;
  const normalWidth = (range / displayRange) * 100;
  const markerPos = Math.min(
    100,
    Math.max(0, ((value - displayMin) / displayRange) * 100)
  );

  const statusColors: Record<string, string> = {
    normal: "#10B981",
    borderline: "#F59E0B",
    abnormal: "#EF4444",
  };

  return (
    <div className="mt-2">
      <div
        style={{
          position: "relative",
          height: 20,
          background: "#1F2D42",
          borderRadius: 4,
          overflow: "visible",
        }}
      >
        {/* Normal zone */}
        <div
          style={{
            position: "absolute",
            left: `${normalStart}%`,
            width: `${normalWidth}%`,
            height: "100%",
            background: "rgba(16, 185, 129, 0.2)",
            borderRadius: 4,
          }}
        />
        {/* Marker */}
        <div
          style={{
            position: "absolute",
            left: `${markerPos}%`,
            top: -4,
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `8px solid ${statusColors[status] || "#10B981"}`,
            }}
          />
          <div
            style={{
              width: 2,
              height: 20,
              background: statusColors[status] || "#10B981",
              marginLeft: 5,
            }}
          />
        </div>
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-1">
        <span
          style={{
            color: "#B8C5D6",
            fontSize: 10,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {refLow} {unit}
        </span>
        <span
          style={{
            color: "#B8C5D6",
            fontSize: 10,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {refHigh} {unit}
        </span>
      </div>
    </div>
  );
}

function TrendChart({ shortName }: { shortName: string }) {
  const data = getMarkerHistory(shortName);
  if (data.length < 2) return null;

  const minVal = Math.min(...data.map((d) => d.value)) - 0.5;
  const maxVal = Math.max(...data.map((d) => d.value)) + 0.5;
  const width = 280;
  const height = 80;
  const pad = 20;

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((d.value - minVal) / (maxVal - minVal)) * (height - pad * 2);
    return { x, y, value: d.value, date: d.date };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${height - pad} L ${points[0].x} ${height - pad} Z`;

  return (
    <svg width={width} height={height + 16} style={{ display: "block", margin: "8px 0" }}>
      <defs>
        <linearGradient id={`trendGrad-${shortName}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#trendGrad-${shortName})`} />
      <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth={2} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill="#7C3AED" />
          <text
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            style={{
              fontSize: 9,
              fill: "#B8C5D6",
              fontFamily: '-apple-system, system-ui, sans-serif',
            }}
          >
            {p.value}
          </text>
          <text
            x={p.x}
            y={height + 8}
            textAnchor="middle"
            style={{
              fontSize: 8,
              fill: "#B8C5D6",
              fontFamily: '-apple-system, system-ui, sans-serif',
            }}
          >
            {new Date(p.date).getFullYear()}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ResultsPage() {
  const session = BLOOD_TEST_HISTORY[0];
  const doctorNote = DOCTOR_NOTES[0];
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/smith1/blood-tests"
          className="flex items-center gap-1 mb-4"
          style={{
            color: "#B8C5D6",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <ArrowLeft size={14} />
          Blood Tests
        </Link>
        <h1
          style={{
            color: "#F5F7FA",
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Results - {new Date(session.date).toLocaleDateString("en-SE", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h1>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 14,
            marginTop: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {session.orderedBy} - {session.lab}
        </p>
      </div>

      {/* Doctor's note */}
      <div
        className="p-5 mb-6"
        style={{
          background: "rgba(124, 58, 237, 0.06)",
          borderRadius: 12,
          border: "1px solid rgba(124, 58, 237, 0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope size={18} style={{ color: "#7C3AED" }} />
          <h2
            style={{
              color: "#F5F7FA",
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Doctor&apos;s Review
          </h2>
        </div>
        <div
          className="flex items-center gap-2 mb-3"
          style={{
            color: "#B8C5D6",
            fontSize: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <span style={{ fontWeight: 500 }}>{doctorNote.author}</span>
          <span>-</span>
          <span>{doctorNote.type}</span>
          <span>-</span>
          <span>{doctorNote.date}</span>
        </div>
        <div
          style={{
            color: "#B8C5D6",
            fontSize: 13,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {doctorNote.note}
        </div>
      </div>

      {/* Results grid */}
      <h2
        style={{
          color: "#F5F7FA",
          fontSize: 18,
          fontWeight: 600,
          margin: 0,
          marginBottom: 16,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        }}
      >
        All Markers ({session.results.length})
      </h2>

      <div className="flex flex-col gap-3">
        {session.results.map((marker) => {
          const isExpanded = expandedMarker === marker.shortName;
          const history = getMarkerHistory(marker.shortName);
          const hasHistory = history.length > 1;
          const statusColors: Record<string, { bg: string; text: string; border: string }> = {
            normal: { bg: "rgba(16, 185, 129, 0.08)", text: "#10B981", border: "rgba(16, 185, 129, 0.15)" },
            borderline: { bg: "rgba(245, 158, 11, 0.08)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.15)" },
            abnormal: { bg: "rgba(239, 68, 68, 0.08)", text: "#EF4444", border: "rgba(239, 68, 68, 0.15)" },
          };
          const sc = statusColors[marker.status] || statusColors.normal;

          return (
            <div
              key={marker.shortName}
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: `1px solid ${sc.border}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                overflow: "hidden",
              }}
            >
              {/* Header row */}
              <button
                onClick={() => setExpandedMarker(isExpanded ? null : marker.shortName)}
                className="w-full flex items-center justify-between p-4"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: sc.text,
                      flexShrink: 0,
                    }}
                  />
                  <div className="text-left">
                    <div
                      style={{
                        color: "#F5F7FA",
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {marker.plainName}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 11,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {marker.name} ({marker.shortName})
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      style={{
                        color: sc.text,
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      }}
                    >
                      {marker.value}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 11,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {marker.unit}
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5"
                    style={{
                      background: sc.bg,
                      color: sc.text,
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {marker.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} style={{ color: "#B8C5D6" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "#B8C5D6" }} />
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div
                  className="px-4 pb-4"
                  style={{ borderTop: "1px solid #1F2D42" }}
                >
                  <div className="pt-4">
                    {/* Range bar */}
                    <div className="mb-3">
                      <div
                        style={{
                          color: "#B8C5D6",
                          fontSize: 12,
                          marginBottom: 4,
                          fontWeight: 500,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        Reference range: {marker.refLow} - {marker.refHigh} {marker.unit}
                      </div>
                      <RangeBar
                        value={marker.value}
                        refLow={marker.refLow}
                        refHigh={marker.refHigh}
                        unit={marker.unit}
                        status={marker.status}
                      />
                    </div>

                    {/* Trend chart */}
                    {hasHistory && (
                      <div className="mt-4">
                        <div
                          className="flex items-center gap-1 mb-2"
                          style={{
                            color: "#B8C5D6",
                            fontSize: 12,
                            fontWeight: 500,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                          }}
                        >
                          <TrendingUp size={12} />
                          Trend over time ({history.length} readings)
                        </div>
                        <TrendChart shortName={marker.shortName} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
