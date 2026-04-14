"use client";

import React, { useState } from "react";
import {
  BLOOD_TEST_HISTORY,
  getMarkerHistory,
  type BloodTestSession,
  type BloodMarker,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Reusable building blocks                                            */
/* ------------------------------------------------------------------ */

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #D1E9F6",
        borderRadius: 4,
        boxShadow: "0 1px 2px rgba(13,58,111,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: BloodMarker["status"] }) {
  const config = {
    normal: { bg: "#F0FDF4", color: "#059669", label: "Normal" },
    borderline: { bg: "#FEF3C7", color: "#F59E0B", label: "Borderline" },
    abnormal: { bg: "#FEE2E2", color: "#EF4444", label: "Abnormal" },
  };
  const c = config[status];
  return (
    <span
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: c.color,
        background: c.bg,
        padding: "2px 10px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Range bar: shows where a value falls in the reference range         */
/* ------------------------------------------------------------------ */

function RangeBar({ marker }: { marker: BloodMarker }) {
  // Display range is 20% below refLow to 20% above refHigh
  const spread = marker.refHigh - marker.refLow || 1;
  const displayLow = marker.refLow - spread * 0.2;
  const displayHigh = marker.refHigh + spread * 0.2;
  const totalRange = displayHigh - displayLow;

  const refLowPct = ((marker.refLow - displayLow) / totalRange) * 100;
  const refWidthPct = (spread / totalRange) * 100;
  const valuePct = Math.max(0, Math.min(100, ((marker.value - displayLow) / totalRange) * 100));

  return (
    <div style={{ position: "relative", height: 24, marginTop: 8 }}>
      {/* Background track */}
      <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 8, background: "#EDF2F7", borderRadius: 4 }} />
      {/* Normal range (green zone) */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: `${refLowPct}%`,
          width: `${refWidthPct}%`,
          height: 8,
          background: "#D1FAE5",
          borderRadius: 4,
        }}
      />
      {/* Value marker (triangle) */}
      <div
        style={{
          position: "absolute",
          left: `${valuePct}%`,
          top: 0,
          transform: "translateX(-6px)",
        }}
      >
        <svg width={12} height={10} viewBox="0 0 12 10">
          <polygon
            points="6,10 0,0 12,0"
            fill={marker.status === "normal" ? "#059669" : marker.status === "borderline" ? "#F59E0B" : "#EF4444"}
          />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline for trend view                                            */
/* ------------------------------------------------------------------ */

function TrendSparkline({ shortName }: { shortName: string }) {
  const history = getMarkerHistory(shortName);
  if (history.length < 2) return <span style={{ color: "#4B7BA7", fontSize: 14 }}>Single reading</span>;

  const values = history.map((h) => h.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 120;
  const height = 32;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - 4 - ((v - min) / range) * (height - 8);
    return `${x},${y}`;
  });

  const isRising = values[values.length - 1] > values[0];
  const color = isRising ? "#EF4444" : "#0891B2";

  return (
    <div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={width}
          cy={height - 4 - ((values[values.length - 1] - min) / range) * (height - 8)}
          r={3}
          fill={color}
        />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ color: "#4B7BA7", fontSize: 12 }}>{history[0].date.slice(0, 7)}</span>
        <span style={{ color: "#4B7BA7", fontSize: 12 }}>{history[history.length - 1].date.slice(0, 7)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Session detail table                                                */
/* ------------------------------------------------------------------ */

function SessionDetail({ session }: { session: BloodTestSession }) {
  return (
    <Card style={{ padding: 0, marginBottom: 24 }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #D1E9F6" }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: 0 }}>
              {new Date(session.date).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
            </h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "4px 0 0" }}>
              Ordered by {session.orderedBy} / {session.lab}
            </p>
          </div>
          <span style={{ color: "#4B7BA7", fontSize: 16 }}>
            {session.results.length} markers tested
          </span>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Marker</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Result</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Reference</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center", minWidth: 140 }}>Range</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {session.results.map((marker, i) => (
            <tr key={i} style={{ borderBottom: i < session.results.length - 1 ? "1px solid #D1E9F6" : "none" }}>
              <td style={{ padding: "14px 24px" }}>
                <p style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 500, margin: 0 }}>{marker.plainName}</p>
                <p style={{ color: "#4B7BA7", fontSize: 14, margin: "2px 0 0" }}>{marker.name}</p>
              </td>
              <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 700, textAlign: "right" }}>
                {marker.value} {marker.unit}
              </td>
              <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, textAlign: "right" }}>
                {marker.refLow}-{marker.refHigh}
              </td>
              <td style={{ padding: "14px 24px" }}>
                <RangeBar marker={marker} />
              </td>
              <td style={{ padding: "14px 24px", textAlign: "right" }}>
                <StatusBadge status={marker.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Trend view: one row per unique marker across all sessions           */
/* ------------------------------------------------------------------ */

function TrendView() {
  // Collect all unique markers
  const allShortNames = new Set<string>();
  const markerNames: Record<string, { name: string; plainName: string; unit: string }> = {};
  BLOOD_TEST_HISTORY.forEach((s) =>
    s.results.forEach((r) => {
      allShortNames.add(r.shortName);
      markerNames[r.shortName] = { name: r.name, plainName: r.plainName, unit: r.unit };
    })
  );

  const markers = Array.from(allShortNames);

  return (
    <Card style={{ padding: 0 }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #D1E9F6" }}>
        <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: 0 }}>
          All markers over time
        </h3>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Marker</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Latest</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center", minWidth: 140 }}>Trend</th>
            <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Readings</th>
          </tr>
        </thead>
        <tbody>
          {markers.map((shortName, i) => {
            const history = getMarkerHistory(shortName);
            const latest = history[history.length - 1];
            const info = markerNames[shortName];
            // Find the latest session's marker for status
            const latestSession = BLOOD_TEST_HISTORY.find((s) =>
              s.results.some((r) => r.shortName === shortName)
            );
            const latestMarker = latestSession?.results.find((r) => r.shortName === shortName);

            return (
              <tr key={shortName} style={{ borderBottom: i < markers.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                <td style={{ padding: "14px 24px" }}>
                  <p style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 500, margin: 0 }}>{info.plainName}</p>
                  <p style={{ color: "#4B7BA7", fontSize: 14, margin: "2px 0 0" }}>{info.name}</p>
                </td>
                <td style={{ padding: "14px 24px", textAlign: "right" }}>
                  <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 700 }}>
                    {latest.value} {info.unit}
                  </span>
                  {latestMarker && (
                    <div style={{ marginTop: 4 }}>
                      <StatusBadge status={latestMarker.status} />
                    </div>
                  )}
                </td>
                <td style={{ padding: "14px 24px", textAlign: "center" }}>
                  <TrendSparkline shortName={shortName} />
                </td>
                <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, textAlign: "right" }}>
                  {history.length}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProvresultatPage() {
  const [view, setView] = useState<"sessions" | "trends">("sessions");

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700, margin: 0 }}>
          Provresultat (Test results)
        </h1>
        <div className="flex" style={{ gap: 0 }}>
          {(["sessions", "trends"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "10px 20px",
                fontSize: 16,
                fontWeight: view === v ? 600 : 400,
                color: view === v ? "#FFFFFF" : "#0D3A6F",
                background: view === v ? "#0891B2" : "#FFFFFF",
                border: "1px solid #D1E9F6",
                borderRadius: v === "sessions" ? "4px 0 0 4px" : "0 4px 4px 0",
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: 48,
              }}
            >
              {v === "sessions" ? "By date" : "Trends"}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 24px" }}>
        {BLOOD_TEST_HISTORY.length} test sessions from {BLOOD_TEST_HISTORY[BLOOD_TEST_HISTORY.length - 1].date.slice(0, 4)} to {BLOOD_TEST_HISTORY[0].date.slice(0, 4)}.
        All results from Karolinska University Laboratory.
      </p>

      {view === "sessions" ? (
        <>
          {BLOOD_TEST_HISTORY.map((session, i) => (
            <SessionDetail key={i} session={session} />
          ))}
        </>
      ) : (
        <TrendView />
      )}
    </>
  );
}
