"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
  BloodMarker,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mini sparkline per marker
// ---------------------------------------------------------------------------

function MarkerSparkline({ shortName }: { shortName: string }) {
  const data = getMarkerHistory(shortName);
  if (data.length < 2) return null;

  const w = 80;
  const h = 28;
  const pad = 3;
  const minVal = Math.min(...data.map((d) => d.value)) * 0.95;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.05;

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((d.value - minVal) / (maxVal - minVal)) * (h - pad * 2),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const last = points[points.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={pathD} fill="none" stroke="#FF385C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2.5} fill="#FF385C" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Range bar visualization
// ---------------------------------------------------------------------------

function RangeBar({ marker }: { marker: BloodMarker }) {
  const totalRange = marker.refHigh * 1.4;
  const normalStart = (marker.refLow / totalRange) * 100;
  const normalEnd = (marker.refHigh / totalRange) * 100;
  const valuePos = Math.min(Math.max((marker.value / totalRange) * 100, 2), 98);

  return (
    <div style={{ position: "relative", height: 20, marginTop: 8 }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 0,
          right: 0,
          height: 8,
          borderRadius: 4,
          background: "#F7F7F7",
        }}
      />
      {/* Normal range */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: `${normalStart}%`,
          width: `${normalEnd - normalStart}%`,
          height: 8,
          borderRadius: 4,
          background: "rgba(0,138,5,0.15)",
        }}
      />
      {/* Value marker */}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: `${valuePos}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `6px solid ${marker.status === "borderline" ? "#E07912" : marker.status === "abnormal" ? "#C13515" : "#008A05"}`,
          }}
        />
        <div
          style={{
            width: 2,
            height: 8,
            background: marker.status === "borderline" ? "#E07912" : marker.status === "abnormal" ? "#C13515" : "#008A05",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marker row (expandable)
// ---------------------------------------------------------------------------

function MarkerRow({ marker }: { marker: BloodMarker }) {
  const [expanded, setExpanded] = useState(false);
  const history = getMarkerHistory(marker.shortName);

  const statusColor =
    marker.status === "normal" ? "#008A05" :
    marker.status === "borderline" ? "#E07912" :
    "#C13515";

  const statusBg =
    marker.status === "normal" ? "#F0FFF4" :
    marker.status === "borderline" ? "#FFF7ED" :
    "#FFF5F5";

  const StatusIcon = marker.status === "normal" ? CheckCircle : AlertTriangle;

  return (
    <div
      style={{
        borderBottom: "1px solid #EBEBEB",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-4 px-5"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <StatusIcon size={16} style={{ color: statusColor, flexShrink: 0 }} />
          <div className="min-w-0">
            <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>
              {marker.plainName}
            </p>
            <p style={{ color: "#717171", fontSize: 11 }}>{marker.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p style={{ color: "#222222", fontSize: 15, fontWeight: 600 }}>
              {marker.value} <span style={{ color: "#717171", fontSize: 11, fontWeight: 400 }}>{marker.unit}</span>
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "1px 6px",
                borderRadius: 50,
                background: statusBg,
                color: statusColor,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {marker.status}
            </span>
          </div>
          {expanded ? (
            <ChevronUp size={16} style={{ color: "#717171" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "#717171" }} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4">
          <RangeBar marker={marker} />

          <div className="flex items-center justify-between mt-3">
            <span style={{ color: "#717171", fontSize: 11 }}>
              Ref: {marker.refLow} - {marker.refHigh} {marker.unit}
            </span>
            <MarkerSparkline shortName={marker.shortName} />
          </div>

          {history.length > 1 && (
            <div className="mt-3">
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500, marginBottom: 4 }}>History</p>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 50,
                      background: "#F7F7F7",
                      color: "#222222",
                      fontSize: 11,
                    }}
                  >
                    {new Date(h.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}: {h.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function BloodTestsPage() {
  const [selectedSessionIdx, setSelectedSessionIdx] = useState(0);
  const session = BLOOD_TEST_HISTORY[selectedSessionIdx];
  const doctorNote = DOCTOR_NOTES.find(
    (n) => n.type === "Blood test review"
  );

  return (
    <div>
      {/* Back nav */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link
          href="/smith12"
          style={{
            width: 32,
            height: 32,
            borderRadius: 50,
            border: "1px solid #EBEBEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} style={{ color: "#222222" }} />
        </Link>
        <p style={{ color: "#222222", fontSize: 18, fontWeight: 600 }}>Blood work</p>
      </div>

      {/* Session selector - horizontal scroll */}
      <div
        className="flex gap-2 px-5 pb-3 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {BLOOD_TEST_HISTORY.map((s, i) => (
          <button
            key={s.date}
            onClick={() => setSelectedSessionIdx(i)}
            className="shrink-0"
            style={{
              padding: "8px 14px",
              borderRadius: 50,
              border: i === selectedSessionIdx ? "2px solid #222222" : "1px solid #EBEBEB",
              background: i === selectedSessionIdx ? "#222222" : "#FFFFFF",
              color: i === selectedSessionIdx ? "#FFFFFF" : "#717171",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {new Date(s.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
          </button>
        ))}
      </div>

      {/* Session info */}
      <div className="px-5 mb-3">
        <div
          className="flex items-center gap-3 p-4"
          style={{
            borderRadius: 12,
            background: "#F7F7F7",
          }}
        >
          <Calendar size={16} style={{ color: "#717171" }} />
          <div>
            <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>
              {new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p style={{ color: "#717171", fontSize: 12 }}>
              Ordered by {session.orderedBy} - {session.lab}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor's note (for latest) */}
      {selectedSessionIdx === 0 && doctorNote && (
        <div className="mx-5 mb-3">
          <div
            className="p-4"
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #FFF5F7 0%, #FFF0E6 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: "#FF385C" }} />
              <p style={{ color: "#222222", fontSize: 13, fontWeight: 600 }}>
                Doctor&apos;s review
              </p>
            </div>
            <p style={{ color: "#717171", fontSize: 13, lineHeight: 1.6 }}>
              {doctorNote.note.split("\n")[0].slice(0, 200)}...
            </p>
          </div>
        </div>
      )}

      {/* Results summary */}
      <div className="px-5 mb-2">
        <div className="flex items-center gap-4">
          <span style={{ color: "#222222", fontSize: 14, fontWeight: 600 }}>
            {session.results.length} markers tested
          </span>
          <div className="flex items-center gap-1">
            <CheckCircle size={12} style={{ color: "#008A05" }} />
            <span style={{ color: "#008A05", fontSize: 12 }}>
              {session.results.filter((r) => r.status === "normal").length} normal
            </span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle size={12} style={{ color: "#E07912" }} />
            <span style={{ color: "#E07912", fontSize: 12 }}>
              {session.results.filter((r) => r.status === "borderline").length} borderline
            </span>
          </div>
        </div>
      </div>

      {/* Marker rows */}
      <div
        className="mx-5 mb-6"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
          border: "1px solid #EBEBEB",
        }}
      >
        {/* Borderline first, then normal */}
        {[
          ...session.results.filter((r) => r.status === "borderline" || r.status === "abnormal"),
          ...session.results.filter((r) => r.status === "normal"),
        ].map((marker) => (
          <MarkerRow key={marker.shortName} marker={marker} />
        ))}
      </div>
    </div>
  );
}
