"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Minus,
  FileText,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Mini sparkline for a single marker across sessions
function MarkerSparkline({ shortName }: { shortName: string }) {
  const data = getMarkerHistory(shortName);
  if (data.length < 2) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05;
  const w = 80;
  const h = 24;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const last = values[values.length - 1];
  const lastX = w;
  const lastY = h - ((last - min) / (max - min)) * h;

  const trending = last > values[values.length - 2];
  const color = trending ? "var(--amber)" : DOC_COLOR;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
    </svg>
  );
}

// Range bar showing where the value sits in the reference range
function RangeBar({ value, refLow, refHigh, status }: { value: number; refLow: number; refHigh: number; status: string }) {
  const rangeSpan = refHigh - refLow;
  const displayLow = refLow - rangeSpan * 0.2;
  const displayHigh = refHigh + rangeSpan * 0.2;
  const totalSpan = displayHigh - displayLow;
  const position = Math.max(0, Math.min(100, ((value - displayLow) / totalSpan) * 100));
  const greenStart = ((refLow - displayLow) / totalSpan) * 100;
  const greenEnd = ((refHigh - displayLow) / totalSpan) * 100;

  const dotColor =
    status === "normal" ? "var(--green)" : status === "borderline" ? "var(--amber)" : "var(--red)";

  return (
    <div style={{ position: "relative", height: 20, marginTop: 4 }}>
      {/* Full bar background */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          right: 0,
          height: 4,
          borderRadius: 2,
          background: "var(--bg-elevated)",
        }}
      />
      {/* Green (normal) zone */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: `${greenStart}%`,
          width: `${greenEnd - greenStart}%`,
          height: 4,
          borderRadius: 2,
          background: "var(--green)",
          opacity: 0.25,
        }}
      />
      {/* Value marker */}
      <div
        style={{
          position: "absolute",
          top: 3,
          left: `${position}%`,
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `7px solid ${dotColor}`,
        }}
      />
    </div>
  );
}

export default function BloodResultsPage() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState(0);
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);

  const session = BLOOD_TEST_HISTORY[selectedSession];
  const doctorNote = selectedSession === 0 ? DOCTOR_NOTES[0] : null;
  const normalCount = session.results.filter((r) => r.status === "normal").length;
  const borderlineCount = session.results.filter((r) => r.status === "borderline").length;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
          padding: "12px 20px",
        }}
      >
        <div style={{ maxWidth: 448, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/smith2")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Blood test results</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Reviewed by Dr. Johansson</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Session selector */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 16,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {BLOOD_TEST_HISTORY.map((s, i) => (
            <button
              key={i}
              onClick={() => { setSelectedSession(i); setExpandedMarker(null); }}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap" as const,
                border: "1px solid",
                cursor: "pointer",
                flexShrink: 0,
                ...(i === selectedSession
                  ? { background: DOC_COLOR, color: "#ffffff", borderColor: DOC_COLOR }
                  : { background: "var(--bg-card)", color: "var(--text-secondary)", borderColor: "var(--border)" }),
              }}
            >
              {formatDate(s.date)}
            </button>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* DOCTOR'S REVIEW (if latest session)                               */}
        {/* Shows BEFORE the raw data - interpretation first                  */}
        {/* ----------------------------------------------------------------- */}
        {doctorNote && (
          <div
            className="animate-fade-in"
            style={{
              background: `linear-gradient(135deg, ${DOC_BG} 0%, #ecfdf5 100%)`,
              borderRadius: 16,
              padding: "16px",
              marginBottom: 16,
              border: `1px solid ${DOC_BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img
                src={DOC_AVATAR}
                alt=""
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `2px solid ${DOC_COLOR}` }}
              />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Johansson's review</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatDate(doctorNote.date)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: 10, padding: "12px" }}>
              {doctorNote.note
                .split("\n")
                .filter(Boolean)
                .slice(0, 2)
                .map((para, i) => (
                  <p key={i} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
                    {para}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* Summary strip */}
        <div
          className="animate-fade-in stagger-1"
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              background: "var(--green-bg)",
              textAlign: "center" as const,
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--green-text)" }}>{normalCount}</p>
            <p style={{ fontSize: 11, color: "var(--green-text)" }}>Normal</p>
          </div>
          {borderlineCount > 0 && (
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 12,
                background: "var(--amber-bg)",
                textAlign: "center" as const,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 700, color: "var(--amber-text)" }}>{borderlineCount}</p>
              <p style={{ fontSize: 11, color: "var(--amber-text)" }}>Borderline</p>
            </div>
          )}
          <div
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              background: "var(--bg-elevated)",
              textAlign: "center" as const,
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{session.results.length}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Markers</p>
          </div>
        </div>

        {/* Lab info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            padding: "0 2px",
          }}
        >
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Ordered by {session.orderedBy}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {session.lab}
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* INDIVIDUAL MARKERS                                                */}
        {/* ----------------------------------------------------------------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {session.results.map((marker) => {
            const isExpanded = expandedMarker === marker.shortName;
            const history = getMarkerHistory(marker.shortName);
            const hasTrend = history.length > 1;
            const trending =
              hasTrend && history[history.length - 1].value > history[history.length - 2].value;

            return (
              <div
                key={marker.shortName}
                className="animate-fade-in stagger-2"
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedMarker(isExpanded ? null : marker.shortName)}
                  style={{
                    width: "100%",
                    textAlign: "left" as const,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {/* Status dot */}
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        marker.status === "normal"
                          ? "var(--green)"
                          : marker.status === "borderline"
                          ? "var(--amber)"
                          : "var(--red)",
                    }}
                  />

                  {/* Name and value */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                        {marker.plainName}
                      </span>
                      {trending && <TrendingUp size={12} style={{ color: "var(--amber)" }} />}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {marker.name} ({marker.shortName})
                    </span>
                  </div>

                  {/* Value */}
                  <div style={{ textAlign: "right" as const }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color:
                          marker.status === "normal"
                            ? "var(--text)"
                            : marker.status === "borderline"
                            ? "var(--amber-text)"
                            : "var(--red-text)",
                      }}
                    >
                      {marker.value}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 3 }}>
                      {marker.unit}
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={14} style={{ color: "var(--text-faint)" }} />
                  ) : (
                    <ChevronDown size={14} style={{ color: "var(--text-faint)" }} />
                  )}
                </button>

                {isExpanded && (
                  <div style={{ padding: "0 14px 14px" }}>
                    {/* Range bar */}
                    <div style={{ marginBottom: 10 }}>
                      <RangeBar
                        value={marker.value}
                        refLow={marker.refLow}
                        refHigh={marker.refHigh}
                        status={marker.status}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                          Low: {marker.refLow}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                          High: {marker.refHigh}
                        </span>
                      </div>
                    </div>

                    {/* History sparkline */}
                    {hasTrend && (
                      <div
                        style={{
                          background: "var(--bg-elevated)",
                          borderRadius: 10,
                          padding: "10px 12px",
                          marginBottom: 8,
                        }}
                      >
                        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                          History ({history.length} tests)
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <MarkerSparkline shortName={marker.shortName} />
                          <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <p style={{ fontSize: 10, color: "var(--text-faint)" }}>First</p>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                                {history[0].value}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" as const }}>
                              <p style={{ fontSize: 10, color: "var(--text-faint)" }}>Latest</p>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: trending ? "var(--amber-text)" : "var(--text)",
                                }}
                              >
                                {history[history.length - 1].value}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status label */}
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        background:
                          marker.status === "normal"
                            ? "var(--green-bg)"
                            : marker.status === "borderline"
                            ? "var(--amber-bg)"
                            : "var(--red-bg)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color:
                            marker.status === "normal"
                              ? "var(--green-text)"
                              : marker.status === "borderline"
                              ? "var(--amber-text)"
                              : "var(--red-text)",
                        }}
                      >
                        {marker.status === "normal"
                          ? "Within normal reference range"
                          : marker.status === "borderline"
                          ? "Near the edge of normal range - Dr. Johansson is monitoring this"
                          : "Outside normal range - Dr. Johansson has noted this"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
