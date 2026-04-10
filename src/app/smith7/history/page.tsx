"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, TestTube, TrendingUp, TrendingDown, Minus,
  Calendar, ChevronRight, Filter, Link2, Eye,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Helpers
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

// ============================================================================
// Marker history table - the doctor's view
// ============================================================================

function MarkerHistoryTable() {
  // Get all unique marker names across all sessions
  const allMarkers = useMemo(() => {
    const markerMap = new Map<string, { shortName: string; plainName: string; unit: string }>();
    BLOOD_TEST_HISTORY.forEach(session => {
      session.results.forEach(r => {
        if (!markerMap.has(r.shortName)) {
          markerMap.set(r.shortName, { shortName: r.shortName, plainName: r.plainName, unit: r.unit });
        }
      });
    });
    return Array.from(markerMap.values());
  }, []);

  // Sessions sorted oldest to newest for table columns
  const sessions = [...BLOOD_TEST_HISTORY].reverse();

  return (
    <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{
              position: "sticky",
              left: 0,
              zIndex: 2,
              background: "var(--bg-card)",
              padding: "12px 14px",
              textAlign: "left",
              borderBottom: "2px solid var(--border)",
              fontWeight: 700,
              color: "#0f5959",
              fontSize: 11,
              minWidth: 140,
            }}>
              Marker
            </th>
            {sessions.map((s, i) => (
              <th key={i} style={{
                padding: "12px 10px",
                textAlign: "center",
                borderBottom: "2px solid var(--border)",
                fontWeight: 600,
                color: i === sessions.length - 1 ? "#0f5959" : "var(--text-muted)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                minWidth: 70,
                background: i === sessions.length - 1 ? "#e0f7f5" : "transparent",
              }}>
                {formatShortDate(s.date)}
                {i === sessions.length - 1 && (
                  <div style={{ fontSize: 8, color: "#0f5959", fontWeight: 700, marginTop: 2 }}>LATEST</div>
                )}
              </th>
            ))}
            <th style={{
              padding: "12px 10px",
              textAlign: "center",
              borderBottom: "2px solid var(--border)",
              fontWeight: 600,
              color: "var(--text-muted)",
              fontSize: 10,
              minWidth: 60,
            }}>
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {allMarkers.map((marker, mi) => {
            const history = getMarkerHistory(marker.shortName);
            const trend = history.length >= 2
              ? history[history.length - 1].value - history[0].value
              : 0;

            return (
              <tr key={mi} style={{ borderBottom: "1px solid var(--divider)" }}>
                <td style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  background: "var(--bg-card)",
                  padding: "10px 14px",
                  borderRight: "1px solid var(--divider)",
                }}>
                  <Link
                    href={`/smith7/marker/${encodeURIComponent(marker.shortName)}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 12 }}>
                      {marker.plainName}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {marker.shortName} ({marker.unit})
                    </div>
                  </Link>
                </td>

                {sessions.map((session, si) => {
                  const result = session.results.find(r => r.shortName === marker.shortName);
                  const isLatest = si === sessions.length - 1;

                  if (!result) {
                    return (
                      <td key={si} style={{
                        padding: "10px",
                        textAlign: "center",
                        color: "var(--text-faint)",
                        fontSize: 11,
                        background: isLatest ? "#e0f7f5" : "transparent",
                      }}>
                        -
                      </td>
                    );
                  }

                  const statusColor = result.status === "abnormal" ? "var(--red-text)" :
                    result.status === "borderline" ? "var(--amber-text)" : "var(--text)";
                  const statusBg = result.status === "abnormal" ? "var(--red-bg)" :
                    result.status === "borderline" ? "var(--amber-bg)" : "transparent";

                  return (
                    <td key={si} style={{
                      padding: "10px",
                      textAlign: "center",
                      background: isLatest ? "#e0f7f5" : "transparent",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: isLatest ? 700 : 500,
                        fontSize: 12,
                        color: statusColor,
                        padding: result.status !== "normal" ? "1px 6px" : "1px 0",
                        borderRadius: 4,
                        background: statusBg,
                      }}>
                        {result.value}
                      </span>
                    </td>
                  );
                })}

                {/* Trend */}
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {history.length >= 2 ? (
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      color: trend > 0.1 ? "var(--amber-text)" : trend < -0.1 ? "var(--green-text)" : "var(--text-muted)",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                    }}>
                      {trend > 0.1 ? <TrendingUp size={11} /> : trend < -0.1 ? <TrendingDown size={11} /> : <Minus size={11} />}
                      {trend > 0 ? "+" : ""}{trend.toFixed(1)}
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-faint)", fontSize: 11 }}>-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Biometrics history table
// ============================================================================

function BiometricsTable() {
  const sorted = [...BIOMETRICS_HISTORY].reverse();

  return (
    <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {["Date", "Weight", "BMI", "Waist", "Blood pressure"].map((h, i) => (
              <th key={i} style={{
                padding: "12px 14px",
                textAlign: i === 0 ? "left" : "center",
                borderBottom: "2px solid var(--border)",
                fontWeight: 700,
                color: "#0f5959",
                fontSize: 11,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((b, i) => {
            const isLatest = i === sorted.length - 1;
            const bpSys = parseInt(b.bloodPressure);
            const bpColor = bpSys >= 140 ? "var(--red-text)" : bpSys >= 130 ? "var(--amber-text)" : "var(--green-text)";
            const bpBg = bpSys >= 140 ? "var(--red-bg)" : bpSys >= 130 ? "var(--amber-bg)" : "var(--green-bg)";
            const bmiColor = b.bmi >= 30 ? "var(--red-text)" : b.bmi >= 28 ? "var(--amber-text)" : "var(--text)";

            return (
              <tr key={i} style={{
                borderBottom: "1px solid var(--divider)",
                background: isLatest ? "#e0f7f5" : "transparent",
              }}>
                <td style={{ padding: "10px 14px", fontWeight: isLatest ? 600 : 400 }}>
                  {formatDate(b.date)}
                  {isLatest && <span style={{ fontSize: 8, color: "#0f5959", fontWeight: 700, marginLeft: 6 }}>LATEST</span>}
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "var(--font-mono)", fontWeight: isLatest ? 700 : 500 }}>
                  {b.weight}kg
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "var(--font-mono)", color: bmiColor, fontWeight: isLatest ? 700 : 500 }}>
                  {b.bmi}
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "var(--font-mono)", fontWeight: isLatest ? 700 : 500, color: b.waist >= 88 ? "var(--red-text)" : b.waist >= 85 ? "var(--amber-text)" : "var(--text)" }}>
                  {b.waist}cm
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: isLatest ? 700 : 500,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: bpBg,
                    color: bpColor,
                  }}>
                    {b.bloodPressure}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Key trends summary
// ============================================================================

function TrendSummary() {
  const glucHistory = getMarkerHistory("f-Glucose");
  const cholHistory = getMarkerHistory("TC");
  const bioFirst = BIOMETRICS_HISTORY[BIOMETRICS_HISTORY.length - 1];
  const bioLast = BIOMETRICS_HISTORY[0];

  const trends = [
    {
      label: "Blood sugar (fasting)",
      first: glucHistory.length > 0 ? glucHistory[0].value : 0,
      last: glucHistory.length > 0 ? glucHistory[glucHistory.length - 1].value : 0,
      unit: "mmol/L",
      goodIfDown: true,
    },
    {
      label: "Total cholesterol",
      first: cholHistory.length > 0 ? cholHistory[0].value : 0,
      last: cholHistory.length > 0 ? cholHistory[cholHistory.length - 1].value : 0,
      unit: "mmol/L",
      goodIfDown: true,
    },
    {
      label: "Weight",
      first: bioFirst?.weight || 0,
      last: bioLast?.weight || 0,
      unit: "kg",
      goodIfDown: true,
    },
    {
      label: "Blood pressure (systolic)",
      first: bioFirst ? parseInt(bioFirst.bloodPressure) : 0,
      last: bioLast ? parseInt(bioLast.bloodPressure) : 0,
      unit: "mmHg",
      goodIfDown: true,
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {trends.map((t, i) => {
        const change = t.last - t.first;
        const isGood = t.goodIfDown ? change <= 0 : change >= 0;
        const color = Math.abs(change) < 0.1 ? "var(--text-muted)" : isGood ? "var(--green-text)" : "var(--amber-text)";
        const bg = Math.abs(change) < 0.1 ? "var(--bg-elevated)" : isGood ? "var(--green-bg)" : "var(--amber-bg)";

        return (
          <div key={i} style={{
            padding: "14px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{t.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{t.first}</span>
              <span style={{ color: "var(--text-faint)" }}>-</span>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#0f5959" }}>{t.last}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{t.unit}</span>
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              padding: "2px 8px",
              borderRadius: 10,
              background: bg,
              color: color,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
            }}>
              {change > 0.1 ? <TrendingUp size={10} /> : change < -0.1 ? <TrendingDown size={10} /> : <Minus size={10} />}
              {change > 0 ? "+" : ""}{change.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function HistoryPage() {
  const [tab, setTab] = useState<"blood" | "biometrics">("blood");

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
          maxWidth: 720,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <Link href="/smith7" style={{ color: "var(--text-muted)", display: "flex" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f5959", margin: 0 }}>
              Full History
            </h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
              Every measurement, every year
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 20px 80px" }}>
        {/* Key trends */}
        <div className="animate-fade-in" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 10px" }}>
            5-year changes at a glance
          </h2>
          <TrendSummary />
        </div>

        {/* Tab switcher */}
        <div className="animate-fade-in stagger-1" style={{
          display: "flex",
          gap: 4,
          marginBottom: 16,
          padding: 4,
          borderRadius: 12,
          background: "var(--bg-elevated)",
        }}>
          {[
            { key: "blood" as const, label: "Blood tests", icon: <TestTube size={13} /> },
            { key: "biometrics" as const, label: "Biometrics", icon: <Calendar size={13} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: tab === t.key ? "var(--bg-card)" : "transparent",
                color: tab === t.key ? "#0f5959" : "var(--text-muted)",
                fontSize: 13,
                fontWeight: tab === t.key ? 600 : 500,
                cursor: "pointer",
                boxShadow: tab === t.key ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="animate-fade-in stagger-2">
          {tab === "blood" ? <MarkerHistoryTable /> : <BiometricsTable />}
        </div>

        {/* Context note */}
        <div className="animate-fade-in stagger-3" style={{
          marginTop: 16,
          padding: "14px 16px",
          borderRadius: 14,
          background: "#e0f7f5",
          border: "1.5px solid #0f5959",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Link2 size={14} style={{ color: "#0f5959" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f5959", textTransform: "uppercase" }}>
              Why tables matter
            </span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#0f5959", margin: 0 }}>
            Each column is a snapshot. Each row is a story.
            Glucose rising 0.1-0.3 per year looks normal at each visit.
            But 5.0 to 5.8 over 5 years is a trajectory that demands attention.
            This is what &quot;connecting the dots&quot; means in practice.
          </p>
        </div>

        {/* Back to timeline */}
        <div style={{ marginTop: 20 }}>
          <Link href="/smith7" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 20px",
            borderRadius: 14,
            background: "#0f5959",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} />
            Back to Health Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
