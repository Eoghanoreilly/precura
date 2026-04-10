"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Shield, ChevronRight, ChevronDown, ChevronUp,
  Droplet, TrendingUp, AlertTriangle, CheckCircle, Info,
  Stethoscope, Calendar,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY, DOCTOR_NOTES, getMarkerHistory, getLatestMarker,
  type BloodMarker,
} from "@/lib/v2/mock-patient";

function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)", label: "Normal" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)", label: "Borderline" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)", label: "High" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Contextual interpretation for each marker
function getInterpretation(marker: BloodMarker): string {
  const map: Record<string, string> = {
    "HbA1c": "This measures your average blood sugar over the past 2-3 months. At 38 mmol/mol, you're within the normal range (under 42). But combined with your rising fasting glucose, it's worth monitoring closely.",
    "f-Glucose": "Your fasting blood sugar is at the upper edge of the normal range. It's been rising gradually over 5 years. This is the pattern that often leads to pre-diabetes if nothing changes. The good news: lifestyle changes work.",
    "TC": "Your total cholesterol is slightly above the recommended limit. On its own this isn't alarming, but combined with your family history of heart disease, it's worth managing through diet and activity.",
    "HDL": "This is your 'good' cholesterol, and yours is healthy. HDL helps remove other forms of cholesterol from your bloodstream. Keep it up.",
    "LDL": "Your 'bad' cholesterol is within the recommended range. LDL builds up in artery walls, so keeping it controlled is important given your father's heart history.",
    "TG": "Your blood fats are normal. High triglycerides are linked to heart disease and can indicate metabolic issues. Yours look good.",
    "TSH": "Your thyroid function is normal. TSH controls your metabolism, energy, and weight regulation.",
    "Vit D": "Your vitamin D is slightly below the optimal level (50+ nmol/L). This is very common in Sweden, especially after winter. Dr. Johansson recommends a D3 supplement, 2000 IU daily.",
    "Crea": "Your kidney function is normal. Creatinine is a waste product filtered by your kidneys. Normal levels mean your kidneys are working well.",
    "f-Insulin": "Your fasting insulin level is normal. This measures how much insulin your body needs to control blood sugar. Rising insulin can be an early sign of insulin resistance, even before glucose goes up.",
  };
  return map[marker.shortName] || `Your ${marker.plainName.toLowerCase()} is ${marker.status}.`;
}

// Zone bar visualization
function ZoneBar({ marker }: { marker: BloodMarker }) {
  const { refLow, refHigh, value, unit } = marker;
  const range = refHigh - refLow;
  const extendLow = refLow - range * 0.3;
  const extendHigh = refHigh + range * 0.3;
  const totalRange = extendHigh - extendLow;

  // Clamp position
  const pos = Math.max(0, Math.min(1, (value - extendLow) / totalRange));
  const normalStart = (refLow - extendLow) / totalRange;
  const normalEnd = (refHigh - extendLow) / totalRange;

  const sc = statusColor(marker.status);

  return (
    <div style={{ padding: "4px 0" }}>
      {/* Bar */}
      <div style={{ position: "relative", height: 12, borderRadius: 6, overflow: "hidden", background: "var(--bg-elevated)" }}>
        {/* Low zone */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${normalStart * 100}%`,
          background: "var(--amber-bg)",
          borderRadius: "6px 0 0 6px",
        }} />
        {/* Normal zone */}
        <div style={{
          position: "absolute", left: `${normalStart * 100}%`, top: 0, bottom: 0,
          width: `${(normalEnd - normalStart) * 100}%`,
          background: "var(--green-bg)",
        }} />
        {/* High zone */}
        <div style={{
          position: "absolute", left: `${normalEnd * 100}%`, top: 0, bottom: 0,
          right: 0,
          background: "var(--amber-bg)",
          borderRadius: "0 6px 6px 0",
        }} />

        {/* Marker dot */}
        <div style={{
          position: "absolute",
          left: `${pos * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: 7,
          background: sc.dot,
          border: "2.5px solid var(--bg-card)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          zIndex: 2,
        }} />
      </div>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{refLow} {unit}</span>
        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{refHigh} {unit}</span>
      </div>
    </div>
  );
}

// Mini trend sparkline
function MiniTrend({ shortName, color }: { shortName: string; color: string }) {
  const data = getMarkerHistory(shortName);
  if (data.length < 2) return null;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals) * 0.98;
  const max = Math.max(...vals) * 1.02;
  const w = 60;
  const h = 20;

  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });

  const last = vals[vals.length - 1];
  const lx = w;
  const ly = h - ((last - min) / (max - min)) * h;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={2.5} fill={color} />
    </svg>
  );
}

export default function ResultsPage() {
  const latest = BLOOD_TEST_HISTORY[0];
  const latestNote = DOCTOR_NOTES[0];
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);
  const [showFullNote, setShowFullNote] = useState(false);

  // Group markers by category
  const sugarMarkers = latest.results.filter((m) =>
    ["HbA1c", "f-Glucose", "f-Insulin"].includes(m.shortName)
  );
  const lipidMarkers = latest.results.filter((m) =>
    ["TC", "HDL", "LDL", "TG"].includes(m.shortName)
  );
  const otherMarkers = latest.results.filter((m) =>
    !["HbA1c", "f-Glucose", "f-Insulin", "TC", "HDL", "LDL", "TG"].includes(m.shortName)
  );

  const categories = [
    { title: "Blood Sugar", icon: <Droplet size={14} />, markers: sugarMarkers, key: "sugar" },
    { title: "Cholesterol & Lipids", icon: <TrendingUp size={14} />, markers: lipidMarkers, key: "lipids" },
    { title: "General Health", icon: <CheckCircle size={14} />, markers: otherMarkers, key: "other" },
  ];

  const noteLines = latestNote.note.split("\n\n");
  const truncatedNote = noteLines.slice(0, 1).join("\n\n");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          paddingTop: 16, paddingBottom: 12,
        }}>
          <Link href="/smith1" style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--bg-elevated)", display: "flex",
            alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text)" }} />
          </Link>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>Blood Test Results</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{formatDate(latest.date)}</p>
          </div>
        </div>

        {/* Doctor's Note - THE HERO */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
          padding: 0, marginBottom: 20, overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #e8eaf6 0%, #e3f2fd 100%)",
            padding: "18px 20px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "var(--accent)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Stethoscope size={18} style={{ color: "#fff" }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
                  Doctor&apos;s Review
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {latestNote.author} - {latestNote.type}
                </div>
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 8,
              background: "rgba(255,255,255,0.6)", width: "fit-content",
            }}>
              <Shield size={12} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>
                Reviewed and signed {formatDateShort(latestNote.date)}
              </span>
            </div>
          </div>

          {/* Note Content */}
          <div style={{ padding: "16px 20px 18px" }}>
            <div style={{
              fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}>
              {showFullNote ? latestNote.note : truncatedNote}
            </div>
            {noteLines.length > 1 && (
              <button
                onClick={() => setShowFullNote(!showFullNote)}
                style={{
                  marginTop: 10, background: "none", border: "none",
                  color: "var(--accent)", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {showFullNote ? "Show less" : "Read full note"}
                {showFullNote ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="animate-fade-in stagger-1" style={{
          display: "flex", gap: 8, marginBottom: 20,
        }}>
          {[
            { count: latest.results.filter((r) => r.status === "normal").length, label: "Normal", bg: "var(--green-bg)", color: "var(--green-text)" },
            { count: latest.results.filter((r) => r.status === "borderline").length, label: "Watch", bg: "var(--amber-bg)", color: "var(--amber-text)" },
            { count: latest.results.filter((r) => r.status === "abnormal").length, label: "Action", bg: "var(--red-bg)", color: "var(--red-text)" },
          ].filter((s) => s.count > 0).map((s) => (
            <div key={s.label} style={{
              flex: 1, padding: "10px 0", borderRadius: 12,
              background: s.bg, textAlign: "center",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Marker Categories */}
        {categories.map((cat, catIdx) => (
          <div key={cat.key} className={`animate-fade-in stagger-${catIdx + 2}`} style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginBottom: 10, paddingLeft: 2,
            }}>
              <span style={{ color: "var(--text-muted)" }}>{cat.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "-0.01em" }}>
                {cat.title}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                {cat.markers.length} markers
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cat.markers.map((marker) => {
                const sc = statusColor(marker.status);
                const isExpanded = expandedMarker === marker.shortName;
                const history = getMarkerHistory(marker.shortName);
                const prevValue = history.length >= 2 ? history[history.length - 2].value : null;
                const change = prevValue !== null ? marker.value - prevValue : null;

                return (
                  <div key={marker.shortName} style={{
                    background: "var(--bg-card)", borderRadius: 16,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                  }}>
                    {/* Marker Header - always visible */}
                    <button
                      onClick={() => setExpandedMarker(isExpanded ? null : marker.shortName)}
                      style={{
                        width: "100%", background: "none", border: "none",
                        padding: "14px 16px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      {/* Status indicator */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: sc.bg, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {marker.status === "normal" ? (
                          <CheckCircle size={16} style={{ color: sc.text }} />
                        ) : (
                          <AlertTriangle size={16} style={{ color: sc.text }} />
                        )}
                      </div>

                      <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                          {marker.plainName}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {marker.name}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: sc.text }}>
                          {marker.value}
                          <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)", marginLeft: 2 }}>{marker.unit}</span>
                        </div>
                        {change !== null && change !== 0 && (
                          <div style={{ fontSize: 10, color: sc.text, fontWeight: 500 }}>
                            {change > 0 ? "+" : ""}{change.toFixed(1)} since last
                          </div>
                        )}
                      </div>

                      <ChevronRight
                        size={16}
                        style={{
                          color: "var(--text-faint)", flexShrink: 0,
                          transform: isExpanded ? "rotate(90deg)" : "none",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div style={{
                        padding: "0 16px 16px",
                        borderTop: "1px solid var(--divider)",
                      }}>
                        {/* Zone bar */}
                        <div style={{ padding: "14px 0 10px" }}>
                          <ZoneBar marker={marker} />
                        </div>

                        {/* Interpretation */}
                        <div style={{
                          background: "var(--bg-elevated)", borderRadius: 12,
                          padding: "12px 14px", marginBottom: 12,
                        }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <Info size={14} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                              {getInterpretation(marker)}
                            </p>
                          </div>
                        </div>

                        {/* Trend sparkline */}
                        {history.length >= 2 && (
                          <Link href={`/smith1/marker?m=${marker.shortName}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "10px 12px", borderRadius: 10,
                              background: "var(--bg-elevated)",
                            }}>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>
                                  {history.length}-test trend
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                                  {history[0].value} to {history[history.length - 1].value} {marker.unit}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MiniTrend shortName={marker.shortName} color={sc.dot} />
                                <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Test Info Footer */}
        <div style={{
          background: "var(--bg-elevated)", borderRadius: 14,
          padding: "14px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Calendar size={13} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Test Details</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8 }}>
            Date: {formatDate(latest.date)}<br />
            Lab: {latest.lab}<br />
            Ordered by: {latest.orderedBy}<br />
            Markers tested: {latest.results.length}
          </div>
        </div>
      </div>
    </div>
  );
}
