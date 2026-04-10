"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, TestTube, ChevronRight, TrendingUp, TrendingDown,
  Calendar, Heart, Shield, Brain, Bone, Flame, Zap,
  AlertTriangle, CheckCircle, Clock, User, Bell,
  ChevronDown, ArrowUpRight, Dumbbell, FileText,
  Stethoscope, Pill, Syringe, MessageCircle,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS,
  SCREENING_SCORES, FAMILY_HISTORY, BIOMETRICS_HISTORY,
  MESSAGES, DOCTOR_NOTES, TRAINING_PLAN, CONDITIONS,
  MEDICATIONS, AI_PATIENT_SUMMARY,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Utilities
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function statusColor(status: string) {
  if (status === "normal" || status === "low" || status === "positive" || status === "minimal" || status === "low_risk")
    return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline" || status === "moderate" || status === "low_moderate" || status === "approaching" || status === "worsening")
    return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}

function riskColor(level: string) {
  if (level === "low" || level === "minimal" || level === "low_risk")
    return { bg: "var(--green-bg)", text: "var(--green-text)", bar: "var(--green)" };
  if (level === "moderate" || level === "low_moderate" || level === "approaching")
    return { bg: "var(--amber-bg)", text: "var(--amber-text)", bar: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", bar: "var(--red)" };
}

// ============================================================================
// Health categories - group biomarkers by domain
// ============================================================================

interface CategoryDef {
  id: string;
  name: string;
  icon: typeof Heart;
  color: string;
  colorBg: string;
  colorText: string;
  markers: string[];
  riskKey?: string;
  screeningKey?: string;
  status: "optimal" | "watch" | "action";
  statusLabel: string;
  summary: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "metabolic",
    name: "Metabolic Health",
    icon: Flame,
    color: "var(--amber)",
    colorBg: "var(--amber-bg)",
    colorText: "var(--amber-text)",
    markers: ["HbA1c", "f-Glucose", "f-Insulin", "TC", "HDL", "LDL", "TG"],
    riskKey: "diabetes",
    status: "watch",
    statusLabel: "Watch",
    summary: "Glucose trending up over 5 years. 2/5 metabolic syndrome criteria met.",
  },
  {
    id: "cardiovascular",
    name: "Heart & Circulation",
    icon: Heart,
    color: "var(--red)",
    colorBg: "var(--red-bg)",
    colorText: "var(--red-text)",
    markers: ["TC", "HDL", "LDL", "TG"],
    riskKey: "cardiovascular",
    status: "optimal",
    statusLabel: "Good",
    summary: "BP controlled on medication. Cholesterol borderline but HDL is healthy.",
  },
  {
    id: "bone",
    name: "Bone & Vitamin D",
    icon: Bone,
    color: "var(--teal)",
    colorBg: "var(--teal-bg)",
    colorText: "var(--teal-text)",
    markers: ["Vit D"],
    riskKey: "bone",
    status: "watch",
    statusLabel: "Low Vit D",
    summary: "Vitamin D slightly below optimal. Supplementation recommended.",
  },
  {
    id: "kidney",
    name: "Kidney Function",
    icon: Zap,
    color: "var(--blue)",
    colorBg: "var(--blue-bg)",
    colorText: "var(--blue-text)",
    markers: ["Crea"],
    status: "optimal",
    statusLabel: "Normal",
    summary: "Creatinine (kidney function) within normal range.",
  },
  {
    id: "thyroid",
    name: "Thyroid",
    icon: Activity,
    color: "var(--purple)",
    colorBg: "var(--purple-bg)",
    colorText: "var(--purple-text)",
    markers: ["TSH"],
    status: "optimal",
    statusLabel: "Normal",
    summary: "TSH (thyroid function) within normal range.",
  },
  {
    id: "mental",
    name: "Mental Health",
    icon: Brain,
    color: "var(--teal)",
    colorBg: "var(--teal-bg)",
    colorText: "var(--teal-text)",
    markers: [],
    screeningKey: "mental",
    status: "optimal",
    statusLabel: "Good",
    summary: "PHQ-9: 4 (minimal depression). GAD-7: 3 (minimal anxiety).",
  },
];

// ============================================================================
// Sparkline Component
// ============================================================================

function Sparkline({ data, color, width = 72, height = 24 }: { data: { value: number }[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals) * 0.97;
  const max = Math.max(...vals) * 1.03;
  const w = width;
  const h = height;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const last = vals[vals.length - 1];
  const lx = w;
  const ly = h - ((last - min) / (max - min)) * h;
  const gradId = `sp-${color.replace(/[^a-z0-9]/g, "")}-${width}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
        fill={`url(#${gradId})`}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lx} cy={ly} r={2.5} fill={color} />
    </svg>
  );
}

// ============================================================================
// Range Bar Component - shows value within reference range
// ============================================================================

function RangeBar({ value, refLow, refHigh, unit, status }: { value: number; refLow: number; refHigh: number; unit: string; status: string }) {
  const range = refHigh - refLow;
  const extendLow = refLow - range * 0.2;
  const extendHigh = refHigh + range * 0.2;
  const totalRange = extendHigh - extendLow;
  const pos = Math.max(0, Math.min(100, ((value - extendLow) / totalRange) * 100));
  const normalStart = ((refLow - extendLow) / totalRange) * 100;
  const normalEnd = ((refHigh - extendLow) / totalRange) * 100;
  const sc = statusColor(status);

  return (
    <div style={{ position: "relative", height: 20, marginTop: 4 }}>
      {/* Track */}
      <div style={{
        position: "absolute", top: 8, left: 0, right: 0, height: 4,
        borderRadius: 2, background: "var(--bg-elevated)",
      }} />
      {/* Normal zone */}
      <div style={{
        position: "absolute", top: 8, left: `${normalStart}%`, width: `${normalEnd - normalStart}%`,
        height: 4, borderRadius: 2, background: "var(--green)", opacity: 0.25,
      }} />
      {/* Marker */}
      <div style={{
        position: "absolute", top: 2, left: `${pos}%`, transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
        borderTop: `6px solid ${sc.dot}`,
      }} />
    </div>
  );
}

// ============================================================================
// Main Dashboard
// ============================================================================

export default function Smith9Home() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("metabolic");
  const latest = BLOOD_TEST_HISTORY[0];
  const normalCount = latest.results.filter((r) => r.status === "normal").length;
  const borderlineCount = latest.results.filter((r) => r.status === "borderline").length;
  const abnormalCount = latest.results.filter((r) => r.status === "abnormal").length;
  const totalMarkers = latest.results.length;
  const daysToNext = daysUntil(PATIENT.nextBloodTest);
  const latestBiometric = BIOMETRICS_HISTORY[0];
  const lastMessage = MESSAGES[MESSAGES.length - 1];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248, 249, 250, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "12px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "#3730a3", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Activity size={16} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Precura
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{
              width: 36, height: 36, borderRadius: 12,
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <Bell size={16} style={{ color: "var(--text-secondary)" }} />
            </button>
            <Link href="/smith9" style={{
              width: 36, height: 36, borderRadius: 12,
              background: "#3730a3", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
              textDecoration: "none",
            }}>
              AB
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Header area */}
        <div style={{ paddingTop: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", margin: 0 }}>
              Health Overview
            </h1>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {PATIENT.firstName} {PATIENT.name.split(" ")[1]}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            Last updated {formatDate(BLOOD_TEST_HISTORY[0].date)} / Next test in {daysToNext} days
          </p>
        </div>

        {/* Desktop: two column layout */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* Main column */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Biomarker Summary Hero */}
            <div className="animate-fade-in" style={{
              background: "var(--bg-card)", borderRadius: 20,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
              padding: 24, overflow: "hidden", position: "relative",
            }}>
              {/* Subtle indigo gradient top accent */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #3730a3, #6366f1, #818cf8)",
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TestTube size={16} style={{ color: "#3730a3" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#3730a3", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Biomarker Summary
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
                  {totalMarkers} markers tested
                </span>
              </div>

              {/* Counts */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "var(--green-bg)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "var(--green-text)", letterSpacing: "-0.02em" }}>{normalCount}</div>
                  <div style={{ fontSize: 11, color: "var(--green-text)", fontWeight: 500 }}>In Range</div>
                </div>
                <div style={{
                  flex: 1, padding: "14px 0", borderRadius: 14,
                  background: "var(--amber-bg)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "var(--amber-text)", letterSpacing: "-0.02em" }}>{borderlineCount}</div>
                  <div style={{ fontSize: 11, color: "var(--amber-text)", fontWeight: 500 }}>Borderline</div>
                </div>
                {abnormalCount > 0 && (
                  <div style={{
                    flex: 1, padding: "14px 0", borderRadius: 14,
                    background: "var(--red-bg)", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "var(--red-text)", letterSpacing: "-0.02em" }}>{abnormalCount}</div>
                    <div style={{ fontSize: 11, color: "var(--red-text)", fontWeight: 500 }}>Out of Range</div>
                  </div>
                )}
              </div>

              {/* All markers mini-list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {latest.results.map((marker, i) => {
                  const sc = statusColor(marker.status);
                  const history = getMarkerHistory(marker.shortName);
                  const trend = history.length >= 2 ? history[history.length - 1].value - history[history.length - 2].value : 0;
                  return (
                    <Link key={marker.shortName} href={`/smith9/marker?m=${marker.shortName}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 0",
                        borderTop: i > 0 ? "1px solid var(--divider)" : "none",
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: 4,
                          background: sc.dot, flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                            {marker.plainName}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{marker.name}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Sparkline data={history} color={sc.dot} width={56} height={20} />
                          <div style={{ textAlign: "right", minWidth: 60 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: sc.text }}>
                              {marker.value}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{marker.unit}</div>
                          </div>
                          {trend !== 0 && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {trend > 0 ? (
                                <TrendingUp size={12} style={{ color: "var(--amber-text)" }} />
                              ) : (
                                <TrendingDown size={12} style={{ color: "var(--green-text)" }} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Doctor review badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 12,
                background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
                marginTop: 16,
              }}>
                <Shield size={14} style={{ color: "#3730a3" }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#3730a3" }}>
                    Reviewed by {DOCTOR_NOTES[0].author}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>
                    {formatDate(DOCTOR_NOTES[0].date)}
                  </span>
                </div>
                <ChevronRight size={14} style={{ color: "#3730a3" }} />
              </div>
            </div>

            {/* Health Categories */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
                  Health Categories
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {CATEGORIES.length} domains
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isExpanded = expandedCategory === cat.id;
                  const catMarkers = cat.markers.map((m) => {
                    const marker = latest.results.find((r) => r.shortName === m);
                    return marker ? { ...marker, history: getMarkerHistory(m) } : null;
                  }).filter(Boolean) as (typeof latest.results[0] & { history: { date: string; value: number }[] })[];

                  return (
                    <div key={cat.id} className="animate-fade-in" style={{
                      background: "var(--bg-card)", borderRadius: 16,
                      border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                      overflow: "hidden",
                    }}>
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                        style={{
                          width: "100%", background: "none", border: "none",
                          padding: "16px 18px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 14,
                        }}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: cat.colorBg, display: "flex",
                          alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Icon size={20} style={{ color: cat.colorText }} />
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{cat.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{cat.summary}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "3px 10px",
                            borderRadius: 8,
                            background: cat.status === "optimal" ? "var(--green-bg)" : cat.status === "watch" ? "var(--amber-bg)" : "var(--red-bg)",
                            color: cat.status === "optimal" ? "var(--green-text)" : cat.status === "watch" ? "var(--amber-text)" : "var(--red-text)",
                            textTransform: "uppercase", letterSpacing: "0.04em",
                          }}>
                            {cat.statusLabel}
                          </span>
                          <ChevronDown size={16} style={{
                            color: "var(--text-muted)",
                            transform: isExpanded ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div style={{
                          padding: "0 18px 16px",
                          borderTop: "1px solid var(--divider)",
                        }}>
                          {/* Markers in this category */}
                          {catMarkers.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              {catMarkers.map((marker, idx) => {
                                const sc = statusColor(marker.status);
                                return (
                                  <Link key={marker.shortName} href={`/smith9/marker?m=${marker.shortName}`} style={{ textDecoration: "none" }}>
                                    <div style={{
                                      display: "flex", alignItems: "center", gap: 12,
                                      padding: "10px 0",
                                      borderBottom: idx < catMarkers.length - 1 ? "1px solid var(--divider)" : "none",
                                    }}>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                                          {marker.plainName} ({marker.name})
                                        </div>
                                        <RangeBar value={marker.value} refLow={marker.refLow} refHigh={marker.refHigh} unit={marker.unit} status={marker.status} />
                                      </div>
                                      <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: sc.text }}>{marker.value}</div>
                                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                                          {marker.refLow}-{marker.refHigh} {marker.unit}
                                        </div>
                                      </div>
                                      <Sparkline data={marker.history} color={sc.dot} width={64} height={22} />
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}

                          {/* Risk model link if applicable */}
                          {cat.riskKey && RISK_ASSESSMENTS[cat.riskKey as keyof typeof RISK_ASSESSMENTS] && (() => {
                            const risk = RISK_ASSESSMENTS[cat.riskKey as keyof typeof RISK_ASSESSMENTS] as { riskLabel?: string; tenYearRisk?: string; riskLevel?: string };
                            if (!risk.riskLabel) return null;
                            const rc = riskColor(risk.riskLevel || "low");
                            return (
                              <Link href={`/smith9/risk?model=${cat.riskKey}`} style={{ textDecoration: "none" }}>
                                <div style={{
                                  display: "flex", alignItems: "center", gap: 10,
                                  padding: "10px 14px", borderRadius: 10,
                                  background: rc.bg, marginTop: 10,
                                }}>
                                  <Shield size={14} style={{ color: rc.text }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: rc.text }}>
                                      {risk.riskLabel} - 10-year risk: {risk.tenYearRisk}
                                    </div>
                                  </div>
                                  <ArrowUpRight size={14} style={{ color: rc.text }} />
                                </div>
                              </Link>
                            );
                          })()}

                          {/* Mental health screening scores */}
                          {cat.id === "mental" && (
                            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                              {[
                                { label: "PHQ-9 (Depression)", score: SCREENING_SCORES.phq9.score, max: SCREENING_SCORES.phq9.maxScore, interp: SCREENING_SCORES.phq9.interpretation },
                                { label: "GAD-7 (Anxiety)", score: SCREENING_SCORES.gad7.score, max: SCREENING_SCORES.gad7.maxScore, interp: SCREENING_SCORES.gad7.interpretation },
                                { label: "AUDIT-C (Alcohol)", score: SCREENING_SCORES.auditC.score, max: SCREENING_SCORES.auditC.maxScore, interp: SCREENING_SCORES.auditC.interpretation },
                              ].map((s) => (
                                <div key={s.label} style={{
                                  display: "flex", alignItems: "center", gap: 12,
                                  padding: "8px 0",
                                }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{s.label}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.interp}</div>
                                  </div>
                                  <div style={{ textAlign: "right" }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--green-text)" }}>{s.score}</span>
                                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/{s.max}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Models Overview */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
                  Risk Models
                </h2>
                <Link href="/smith9/risk" style={{ fontSize: 12, fontWeight: 600, color: "#3730a3", textDecoration: "none" }}>
                  View all
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { key: "diabetes", label: "Type 2 Diabetes", model: "FINDRISC", risk: RISK_ASSESSMENTS.diabetes.tenYearRisk, level: RISK_ASSESSMENTS.diabetes.riskLevel, trend: RISK_ASSESSMENTS.diabetes.trend },
                  { key: "cardiovascular", label: "Cardiovascular", model: "SCORE2", risk: RISK_ASSESSMENTS.cardiovascular.tenYearRisk, level: RISK_ASSESSMENTS.cardiovascular.riskLevel, trend: RISK_ASSESSMENTS.cardiovascular.trend },
                  { key: "metabolicSyndrome", label: "Metabolic Syndrome", model: "ATP III", risk: RISK_ASSESSMENTS.metabolicSyndrome.status, level: RISK_ASSESSMENTS.metabolicSyndrome.trend, trend: RISK_ASSESSMENTS.metabolicSyndrome.trend },
                  { key: "bone", label: "Bone Health", model: "Clinical", risk: RISK_ASSESSMENTS.bone.tenYearRisk, level: RISK_ASSESSMENTS.bone.riskLevel, trend: RISK_ASSESSMENTS.bone.trend },
                ].map((rm) => {
                  const rc = riskColor(rm.level);
                  return (
                    <Link key={rm.key} href={`/smith9/risk?model=${rm.key}`} style={{ textDecoration: "none" }}>
                      <div className="card-hover" style={{
                        background: "var(--bg-card)", borderRadius: 14,
                        border: "1px solid var(--border)", padding: "14px 16px",
                        boxShadow: "var(--shadow-sm)",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{rm.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{rm.model}</div>
                        <div style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 10px",
                          borderRadius: 6, background: rc.bg, color: rc.text,
                          display: "inline-block",
                        }}>
                          {typeof rm.risk === "string" && rm.risk.length < 20 ? rm.risk : rm.level}
                        </div>
                        {rm.trend === "worsening" && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                            <TrendingUp size={11} style={{ color: "var(--amber-text)" }} />
                            <span style={{ fontSize: 10, color: "var(--amber-text)", fontWeight: 500 }}>Trending up</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Body Composition Trends */}
            <Link href="/smith9/body" style={{ textDecoration: "none" }}>
              <div className="card-hover animate-fade-in" style={{
                background: "var(--bg-card)", borderRadius: 18,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "18px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <User size={15} style={{ color: "#3730a3" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Body Composition</span>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Weight", value: `${latestBiometric.weight}kg`, prev: BIOMETRICS_HISTORY[1]?.weight, unit: "kg" },
                    { label: "BMI", value: latestBiometric.bmi.toFixed(1), prev: BIOMETRICS_HISTORY[1]?.bmi, unit: "" },
                    { label: "Waist", value: `${latestBiometric.waist}cm`, prev: BIOMETRICS_HISTORY[1]?.waist, unit: "cm" },
                    { label: "BP", value: latestBiometric.bloodPressure, prev: null, unit: "" },
                  ].map((item) => (
                    <div key={item.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{item.value}</div>
                      {item.prev && (
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                          prev: {item.prev}{item.unit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Weight sparkline */}
                <div style={{ marginTop: 12 }}>
                  <Sparkline
                    data={BIOMETRICS_HISTORY.slice().reverse().map((b) => ({ value: b.weight }))}
                    color="#3730a3"
                    width={320}
                    height={32}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {new Date(BIOMETRICS_HISTORY[BIOMETRICS_HISTORY.length - 1].date).getFullYear()}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {new Date(BIOMETRICS_HISTORY[0].date).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Metabolic Syndrome Status */}
            <Link href="/smith9/risk?model=metabolicSyndrome" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                background: "var(--bg-card)", borderRadius: 16,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "18px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Metabolic Syndrome Criteria</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {RISK_ASSESSMENTS.metabolicSyndrome.metCount} of {RISK_ASSESSMENTS.metabolicSyndrome.threshold} threshold met
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: "4px 10px",
                    borderRadius: 8, background: "var(--amber-bg)", color: "var(--amber-text)",
                  }}>
                    Approaching
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
                    <div key={c.name} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "6px 0",
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: c.met ? "var(--amber-bg)" : "var(--green-bg)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {c.met ? (
                          <AlertTriangle size={11} style={{ color: "var(--amber-text)" }} />
                        ) : (
                          <CheckCircle size={11} style={{ color: "var(--green-text)" }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: c.met ? "var(--amber-text)" : "var(--text)" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.value} - {c.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar (hidden on mobile, visible on desktop via media query) */}
          <div className="smith9-sidebar" style={{
            width: 340, flexShrink: 0,
            display: "flex", flexDirection: "column", gap: 14,
          }}>

            {/* Quick Stats */}
            <div style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "16px 18px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Quick Stats
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Age", value: `${PATIENT.age}`, icon: User },
                  { label: "FINDRISC", value: `${SCREENING_SCORES.findrisc.score}/${SCREENING_SCORES.findrisc.maxScore}`, icon: Shield },
                  { label: "SCORE2", value: `${SCREENING_SCORES.score2.riskPercent}%`, icon: Heart },
                  { label: "Blood Tests", value: `${BLOOD_TEST_HISTORY.length} sessions`, icon: TestTube },
                  { label: "Member Since", value: formatDate(PATIENT.memberSince), icon: Calendar },
                ].map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <StatIcon size={14} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{stat.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Family History */}
            <div style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "16px 18px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Family History
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FAMILY_HISTORY.map((fh, i) => (
                  <div key={i} style={{
                    padding: "8px 0",
                    borderBottom: i < FAMILY_HISTORY.length - 1 ? "1px solid var(--divider)" : "none",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{fh.relative}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {fh.condition} (age {fh.ageAtDiagnosis})
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{fh.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Conditions & Medications */}
            <Link href="/smith9/medical" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                background: "var(--bg-card)", borderRadius: 16,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "16px 18px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Active Conditions & Medications
                </div>
                {CONDITIONS.filter((c) => c.status === "active").map((c, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 0",
                  }}>
                    <Stethoscope size={12} style={{ color: "var(--text-muted)" }} />
                    <span style={{ fontSize: 12, color: "var(--text)" }}>{c.name}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--divider)", marginTop: 8, paddingTop: 8 }}>
                  {MEDICATIONS.filter((m) => m.active).map((m, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 0",
                    }}>
                      <Pill size={12} style={{ color: "var(--blue-text)" }} />
                      <span style={{ fontSize: 12, color: "var(--text)" }}>{m.name} {m.dose} - {m.frequency}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: "#3730a3", fontWeight: 600 }}>View full medical record</span>
                  <ArrowUpRight size={11} style={{ color: "#3730a3" }} />
                </div>
              </div>
            </Link>

            {/* Training Plan */}
            <Link href="/smith9/training" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                background: "var(--bg-card)", borderRadius: 16,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Dumbbell size={15} style={{ color: "#3730a3" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{TRAINING_PLAN.name}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#3730a3" }}>
                      {TRAINING_PLAN.currentWeek}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>of {TRAINING_PLAN.totalWeeks} weeks</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green-text)" }}>
                      {TRAINING_PLAN.totalCompleted}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>sessions done</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                      {TRAINING_PLAN.completedThisWeek}/3
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>this week</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, borderRadius: 2, background: "var(--bg-elevated)" }}>
                  <div style={{
                    height: 4, borderRadius: 2, background: "#3730a3",
                    width: `${(TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100}%`,
                  }} />
                </div>
              </div>
            </Link>

            {/* Doctor's Latest Message */}
            <Link href="/smith9/doctor" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                background: "var(--bg-card)", borderRadius: 16,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <MessageCircle size={15} style={{ color: "#3730a3" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Marcus Johansson</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
                    {formatDate(lastMessage.date.split("T")[0])}
                  </span>
                </div>
                <p style={{
                  fontSize: 12, color: "var(--text-secondary)", margin: 0,
                  lineHeight: 1.6, display: "-webkit-box",
                  WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {lastMessage.text}
                </p>
              </div>
            </Link>

            {/* Screening Scores Summary */}
            <div style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "16px 18px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Quality of Life (EQ-5D)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Mobility", score: SCREENING_SCORES.eq5d.mobility },
                  { label: "Self-Care", score: SCREENING_SCORES.eq5d.selfCare },
                  { label: "Usual Activities", score: SCREENING_SCORES.eq5d.activities },
                  { label: "Pain / Discomfort", score: SCREENING_SCORES.eq5d.pain },
                  { label: "Anxiety / Depression", score: SCREENING_SCORES.eq5d.anxiety },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{item.label}</span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: level <= item.score
                            ? (item.score === 1 ? "var(--green)" : item.score === 2 ? "var(--amber)" : "var(--red)")
                            : "var(--bg-elevated)",
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                {SCREENING_SCORES.eq5d.interpretation}
              </div>
            </div>

            {/* Next Test */}
            <div style={{
              background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
              borderRadius: 16, padding: "16px 18px",
              border: "1px solid rgba(55, 48, 163, 0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#3730a3", marginBottom: 2 }}>
                    Next blood test
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {formatDate(PATIENT.nextBloodTest)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {daysToNext} days away
                  </div>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "rgba(55, 48, 163, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Calendar size={22} style={{ color: "#3730a3" }} />
                </div>
              </div>
            </div>

            {/* Membership */}
            <div style={{
              background: "var(--bg-card)", borderRadius: 14,
              border: "1px solid var(--border)", padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Precura Annual</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {PATIENT.membershipPrice} kr/year
                </div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 600, padding: "4px 8px",
                borderRadius: 6, background: "var(--green-bg)", color: "var(--green-text)",
                textTransform: "uppercase",
              }}>Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle styles */}
      <style>{`
        @media (max-width: 1023px) {
          .smith9-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
