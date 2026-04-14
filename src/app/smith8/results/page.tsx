"use client";

import React, { useState } from "react";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* =====================================================================
   BLOOD RESULTS - Latest test + trends
   All medical terms include plain English
   ===================================================================== */

function TrendSparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05;
  const range = max - min || 1;
  const h = 40;
  const w = 100;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return `${x},${y}`;
  });
  const lastPoint = points[points.length - 1].split(",");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={`url(#grad-${color.replace("#", "")})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill={color} />
    </svg>
  );
}

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
  const displayMin = refLow * 0.7;
  const displayMax = refHigh * 1.3;
  const totalRange = displayMax - displayMin;

  const greenStart = ((refLow - displayMin) / totalRange) * 100;
  const greenWidth = ((refHigh - refLow) / totalRange) * 100;
  const markerPos = Math.max(2, Math.min(98, ((value - displayMin) / totalRange) * 100));

  const statusColor =
    status === "normal" ? "#81C995" : status === "borderline" ? "#F4D47C" : "#E8A3A3";

  return (
    <div style={{ position: "relative", height: 20, marginTop: 8 }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 7,
          left: 0,
          right: 0,
          height: 6,
          borderRadius: 3,
          background: "#F3EAFF",
        }}
      />
      {/* Green zone */}
      <div
        style={{
          position: "absolute",
          top: 7,
          left: `${greenStart}%`,
          width: `${greenWidth}%`,
          height: 6,
          borderRadius: 3,
          background: "rgba(129,201,149,0.3)",
        }}
      />
      {/* Marker */}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: `${markerPos}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `8px solid ${statusColor}`,
          }}
        />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [selectedSession, setSelectedSession] = useState(0);
  const latest = BLOOD_TEST_HISTORY[selectedSession];
  const latestNote = DOCTOR_NOTES[0];

  const statusColors: Record<string, { bg: string; text: string }> = {
    normal: { bg: "#E8F8EC", text: "#81C995" },
    borderline: { bg: "#FFF8E6", text: "#D4A843" },
    abnormal: { bg: "#FDE8E8", text: "#E8A3A3" },
  };

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Header */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "24px 20px",
          marginBottom: 20,
        }}
      >
        <h1 style={{ color: "#3D2645", fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.3 }}>
          Blood Test Results
        </h1>
        <p style={{ color: "#8B7B95", fontSize: 14, margin: 0 }}>
          {latest.lab}
        </p>

        {/* Session tabs */}
        <div
          className="flex gap-2"
          style={{
            marginTop: 16,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {BLOOD_TEST_HISTORY.slice(0, 4).map((session, i) => {
            const isActive = i === selectedSession;
            const date = new Date(session.date);
            return (
              <button
                key={session.date}
                onClick={() => setSelectedSession(i)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  border: isActive ? "2px solid #B794F6" : "1px solid #EFE6F8",
                  background: isActive ? "#F3EAFF" : "#FDFBFF",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    color: isActive ? "#B794F6" : "#8B7B95",
                    fontSize: 13,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor's note (only for latest) */}
      {selectedSession === 0 && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            border: "1px solid #EFE6F8",
            boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
            padding: "20px",
            marginBottom: 20,
          }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "#F3EAFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B794F6",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              MJ
            </div>
            <div>
              <p style={{ color: "#3D2645", fontSize: 14, fontWeight: 600, margin: 0 }}>
                {latestNote.author}
              </p>
              <p style={{ color: "#8B7B95", fontSize: 12, margin: 0 }}>
                {latestNote.type} - {latestNote.date}
              </p>
            </div>
          </div>
          <p style={{ color: "#8B7B95", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Your fasting glucose (blood sugar) continues its slow upward trend at 5.8.
            Still in normal range, but combined with your family history of diabetes, we want
            to stay ahead of this. HbA1c (long-term blood sugar) at 38 is fine. Vitamin D is
            slightly low at 48 - please start D3 supplements. Cholesterol is borderline.
            Next test: September 2026.
          </p>
        </div>
      )}

      {/* Results summary */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: 0 }}>
            Results
          </h2>
          <span style={{ color: "#8B7B95", fontSize: 13 }}>
            {latest.results.length} markers
          </span>
        </div>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: "0 0 16px" }}>
          Ordered by {latest.orderedBy}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {latest.results.map((marker) => {
            const sc = statusColors[marker.status];
            const history = getMarkerHistory(marker.shortName);
            const trendColor =
              marker.status === "normal"
                ? "#81C995"
                : marker.status === "borderline"
                ? "#F4D47C"
                : "#E8A3A3";

            return (
              <div
                key={marker.shortName}
                style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  border: "1px solid #EFE6F8",
                  background: "#FDFBFF",
                  marginBottom: 8,
                }}
              >
                <div className="flex items-start justify-between">
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#8B7B95", fontSize: 12, margin: "0 0 2px" }}>
                      {marker.plainName}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span style={{ color: "#3D2645", fontSize: 22, fontWeight: 700 }}>
                        {marker.value}
                      </span>
                      <span style={{ color: "#8B7B95", fontSize: 12 }}>{marker.unit}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.text,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 6,
                          textTransform: "capitalize",
                        }}
                      >
                        {marker.status}
                      </span>
                      <span style={{ color: "#8B7B95", fontSize: 11 }}>
                        Ref: {marker.refLow}-{marker.refHigh} {marker.unit}
                      </span>
                    </div>

                    {/* Range bar */}
                    <RangeBar
                      value={marker.value}
                      refLow={marker.refLow}
                      refHigh={marker.refHigh}
                      status={marker.status}
                    />
                  </div>

                  {/* Trend sparkline */}
                  {history.length >= 2 && (
                    <div style={{ marginLeft: 12, flexShrink: 0, alignSelf: "center" }}>
                      <TrendSparkline values={history.map((h) => h.value)} color={trendColor} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend highlights */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#3D2645", fontSize: 17, fontWeight: 700, margin: "0 0 14px" }}>
          5-Year Trends
        </h2>
        <p style={{ color: "#8B7B95", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 }}>
          Precura tracks your markers across all tests, even those from your regular doctor.
          This is what first alerted us to your rising glucose pattern.
        </p>

        {[
          {
            name: "Blood sugar (fasting)",
            shortName: "f-Glucose",
            insight: "Rising steadily from 5.0 to 5.8 over 5 years. Each test was individually 'normal' but the trend tells the real story.",
            status: "borderline",
          },
          {
            name: "Long-term blood sugar (HbA1c)",
            shortName: "HbA1c",
            insight: "Gradually rising from 35 to 38. Still well within normal (under 42), but tracking the same direction as fasting glucose.",
            status: "normal",
          },
          {
            name: "Total cholesterol",
            shortName: "TC",
            insight: "Crept from 4.6 to 5.1 over 5 years. Now just above the recommended 5.0 threshold.",
            status: "borderline",
          },
        ].map((item) => {
          const history = getMarkerHistory(item.shortName);
          const trendColor =
            item.status === "normal" ? "#81C995" : item.status === "borderline" ? "#F4D47C" : "#E8A3A3";

          return (
            <div
              key={item.shortName}
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "#FDFBFF",
                border: "1px solid #EFE6F8",
                marginBottom: 10,
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <p style={{ color: "#3D2645", fontSize: 14, fontWeight: 600, margin: 0 }}>
                  {item.name}
                </p>
                <TrendSparkline values={history.map((h) => h.value)} color={trendColor} />
              </div>
              <p style={{ color: "#8B7B95", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                {item.insight}
              </p>
              <div className="flex gap-1 flex-wrap" style={{ marginTop: 8 }}>
                {history.map((h) => (
                  <span
                    key={h.date}
                    style={{
                      background: "#F3EAFF",
                      color: "#8B7B95",
                      fontSize: 10,
                      fontWeight: 500,
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    {new Date(h.date).getFullYear()}: {h.value}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
