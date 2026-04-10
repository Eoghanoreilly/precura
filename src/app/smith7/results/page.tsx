"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, TestTube, TrendingUp, TrendingDown, Minus,
  ChevronRight, Link2, FileText, MessageCircle,
  Calendar, Eye,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, DOCTOR_NOTES,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Helpers
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ============================================================================
// Range bar visualization
// ============================================================================

function RangeBar({ value, refLow, refHigh, unit }: { value: number; refLow: number; refHigh: number; unit: string }) {
  // Calculate position within a visual range
  const range = refHigh - refLow;
  const padding = range * 0.5;
  const visualMin = refLow - padding;
  const visualMax = refHigh + padding;
  const visualRange = visualMax - visualMin;

  const normalStart = ((refLow - visualMin) / visualRange) * 100;
  const normalWidth = ((refHigh - refLow) / visualRange) * 100;
  const markerPos = Math.max(2, Math.min(98, ((value - visualMin) / visualRange) * 100));

  return (
    <div style={{ position: "relative", height: 20, marginTop: 8 }}>
      {/* Background */}
      <div style={{
        position: "absolute",
        top: 6,
        left: 0,
        right: 0,
        height: 8,
        borderRadius: 4,
        background: "var(--bg-elevated)",
      }} />

      {/* Normal zone */}
      <div style={{
        position: "absolute",
        top: 6,
        left: `${normalStart}%`,
        width: `${normalWidth}%`,
        height: 8,
        borderRadius: 4,
        background: "var(--green-bg)",
        border: "1px solid var(--green)",
        opacity: 0.6,
      }} />

      {/* Marker */}
      <div style={{
        position: "absolute",
        left: `${markerPos}%`,
        top: 0,
        transform: "translateX(-50%)",
      }}>
        <div style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `7px solid ${
            value > refHigh ? "var(--red)" : value >= refHigh * 0.9 || value <= refLow * 1.1 ? "var(--amber)" : "var(--green)"
          }`,
        }} />
      </div>

      {/* Labels */}
      <div style={{
        position: "absolute",
        top: 16,
        left: `${normalStart}%`,
        fontSize: 8,
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
        transform: "translateX(-50%)",
      }}>
        {refLow}
      </div>
      <div style={{
        position: "absolute",
        top: 16,
        left: `${normalStart + normalWidth}%`,
        fontSize: 8,
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
        transform: "translateX(-50%)",
      }}>
        {refHigh}
      </div>
    </div>
  );
}

// ============================================================================
// Mini sparkline
// ============================================================================

function MiniSparkline({ shortName, color }: { shortName: string; color: string }) {
  const data = getMarkerHistory(shortName);
  if (data.length < 2) return null;

  const w = 60;
  const h = 20;
  const vals = data.map(d => d.value);
  const min = Math.min(...vals) * 0.98;
  const max = Math.max(...vals) * 1.02;
  const range = max - min || 1;

  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const last = vals[vals.length - 1];
  const lx = w;
  const ly = h - ((last - min) / range) * h;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`mini-${shortName}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
        fill={`url(#mini-${shortName})`}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lx} cy={ly} r={3} fill={color} />
    </svg>
  );
}

// ============================================================================
// Result card
// ============================================================================

function ResultCard({ result, sessionDate }: {
  result: { name: string; shortName: string; plainName: string; value: number; unit: string; refLow: number; refHigh: number; status: string };
  sessionDate: string;
}) {
  const history = getMarkerHistory(result.shortName);
  const prev = history.length >= 2 ? history[history.length - 2].value : null;
  const change = prev !== null ? result.value - prev : null;

  const statusColor = result.status === "abnormal" ? "var(--red)" :
    result.status === "borderline" ? "var(--amber)" : "var(--green)";
  const statusBg = result.status === "abnormal" ? "var(--red-bg)" :
    result.status === "borderline" ? "var(--amber-bg)" : "var(--green-bg)";
  const statusText = result.status === "abnormal" ? "var(--red-text)" :
    result.status === "borderline" ? "var(--amber-text)" : "var(--green-text)";

  return (
    <Link
      href={`/smith7/marker/${encodeURIComponent(result.shortName)}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={{
        padding: "14px 16px",
        borderRadius: 14,
        background: "var(--bg-card)",
        border: `1px solid ${result.status !== "normal" ? statusColor : "var(--border)"}`,
        boxShadow: result.status !== "normal" ? `0 0 0 2px ${statusBg}` : "var(--shadow-sm)",
        transition: "all 0.2s ease",
      }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
              {result.plainName}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
              {result.shortName}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Sparkline */}
            <MiniSparkline shortName={result.shortName} color={statusColor} />

            {/* Value */}
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "#0f5959",
                letterSpacing: "-0.02em",
              }}>
                {result.value}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{result.unit}</div>
            </div>
          </div>
        </div>

        {/* Range bar */}
        <RangeBar value={result.value} refLow={result.refLow} refHigh={result.refHigh} unit={result.unit} />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 10,
              background: statusBg,
              color: statusText,
            }}>
              {result.status === "borderline" ? "Watch" : result.status === "abnormal" ? "Needs attention" : "Normal"}
            </span>

            {change !== null && change !== 0 && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: change > 0 ? "var(--amber-text)" : "var(--green-text)",
              }}>
                {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {change > 0 ? "+" : ""}{change.toFixed(1)} from last
              </span>
            )}
          </div>

          <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// Doctor's note
// ============================================================================

function DoctorNote() {
  const note = DOCTOR_NOTES[0]; // Most recent
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      borderRadius: 16,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0f5959, #1a7a7a)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
          }}>
            MJ
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{note.author}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{note.type} - {formatDate(note.date)}</div>
          </div>
        </div>

        <p style={{
          fontSize: 13,
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          margin: 0,
          maxHeight: expanded ? "none" : 100,
          overflow: "hidden",
          position: "relative",
        }}>
          {note.note}
          {!expanded && (
            <span style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              background: "linear-gradient(transparent, var(--bg-card))",
            }} />
          )}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: 8,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "none",
            color: "#0f5959",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {expanded ? "Show less" : "Read full note"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function ResultsPage() {
  const latestSession = BLOOD_TEST_HISTORY[0];
  const borderline = latestSession.results.filter(r => r.status === "borderline");
  const abnormal = latestSession.results.filter(r => r.status === "abnormal");
  const normal = latestSession.results.filter(r => r.status === "normal");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(248,249,250,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/smith7" style={{ color: "var(--text-muted)", display: "flex" }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f5959", margin: 0 }}>
                Blood test results
              </h1>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                {formatDate(latestSession.date)} - {latestSession.orderedBy}
              </p>
            </div>
          </div>
          <Link href="/smith7/history" style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 12px",
            borderRadius: 8,
            background: "#e0f7f5",
            color: "#0f5959",
            fontSize: 11,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            <Calendar size={12} />
            All tests
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px 80px" }}>

        {/* Summary bar */}
        <div className="animate-fade-in" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginBottom: 16,
        }}>
          <div style={{
            padding: "12px",
            borderRadius: 12,
            background: "var(--green-bg)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--green-text)", fontFamily: "var(--font-mono)" }}>
              {normal.length}
            </div>
            <div style={{ fontSize: 10, color: "var(--green-text)", fontWeight: 600 }}>Normal</div>
          </div>
          <div style={{
            padding: "12px",
            borderRadius: 12,
            background: "var(--amber-bg)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--amber-text)", fontFamily: "var(--font-mono)" }}>
              {borderline.length}
            </div>
            <div style={{ fontSize: 10, color: "var(--amber-text)", fontWeight: 600 }}>Watch</div>
          </div>
          <div style={{
            padding: "12px",
            borderRadius: 12,
            background: abnormal.length > 0 ? "var(--red-bg)" : "var(--bg-elevated)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: abnormal.length > 0 ? "var(--red-text)" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {abnormal.length}
            </div>
            <div style={{ fontSize: 10, color: abnormal.length > 0 ? "var(--red-text)" : "var(--text-muted)", fontWeight: 600 }}>Attention</div>
          </div>
        </div>

        {/* Doctor's note */}
        <div className="animate-fade-in stagger-1" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 8px" }}>
            Doctor&apos;s review
          </h2>
          <DoctorNote />
        </div>

        {/* Needs attention */}
        {borderline.length > 0 && (
          <div className="animate-fade-in stagger-2" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--amber-text)", margin: "0 0 8px" }}>
              Needs watching ({borderline.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {borderline.map((r, i) => (
                <ResultCard key={i} result={r} sessionDate={latestSession.date} />
              ))}
            </div>
          </div>
        )}

        {/* Normal results */}
        <div className="animate-fade-in stagger-3" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--green-text)", margin: "0 0 8px" }}>
            Normal ({normal.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {normal.map((r, i) => (
              <ResultCard key={i} result={r} sessionDate={latestSession.date} />
            ))}
          </div>
        </div>

        {/* Timeline context */}
        <div className="animate-fade-in stagger-4" style={{
          padding: "16px 18px",
          borderRadius: 16,
          background: "#e0f7f5",
          border: "1.5px solid #0f5959",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Link2 size={14} style={{ color: "#0f5959" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f5959", textTransform: "uppercase" }}>
              Timeline context
            </span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#0f5959", margin: 0 }}>
            This is blood test session 6 of 6 in Anna&apos;s timeline, spanning 5 years.
            Precura ordered a comprehensive 10-marker panel - her vardcentral typically tested 3-4 markers.
            The additional markers (insulin, Vitamin D, TSH, full lipid panel) provide a more complete
            metabolic picture.
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/smith7" style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "14px 16px",
            borderRadius: 14,
            background: "#0f5959",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            <ArrowLeft size={14} />
            Timeline
          </Link>
          <Link href="/smith7/risk" style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "14px 16px",
            borderRadius: 14,
            border: "1.5px solid #0f5959",
            background: "transparent",
            color: "#0f5959",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            Risk models
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
