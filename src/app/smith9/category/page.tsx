"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Heart, Flame, Bone, Zap, Activity,
  Brain, TrendingUp, TrendingDown, Shield, AlertTriangle,
  CheckCircle, ArrowUpRight, Info,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY, RISK_ASSESSMENTS, SCREENING_SCORES,
  FAMILY_HISTORY, BIOMETRICS_HISTORY, DOCTOR_NOTES,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}

function Sparkline({ data, color, width = 80, height = 28 }: { data: { value: number }[]; color: string; width?: number; height?: number }) {
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
  const lx = w;
  const ly = h - ((vals[vals.length - 1] - min) / (max - min)) * h;
  const gradId = `cat-sp-${color.replace(/[^a-z0-9]/g, "")}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points.join(" ")} ${w},${h}`} fill={`url(#${gradId})`} />
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={2.5} fill={color} />
    </svg>
  );
}

const CATEGORY_CONFIG: Record<string, {
  name: string;
  icon: typeof Heart;
  color: string;
  colorBg: string;
  colorText: string;
  markers: string[];
  riskKey?: string;
  description: string;
  relatedFamily: string[];
}> = {
  metabolic: {
    name: "Metabolic Health",
    icon: Flame,
    color: "var(--amber)",
    colorBg: "var(--amber-bg)",
    colorText: "var(--amber-text)",
    markers: ["HbA1c", "f-Glucose", "f-Insulin", "TC", "HDL", "LDL", "TG"],
    riskKey: "diabetes",
    description: "Metabolic health covers how your body processes energy from food. Key measures include blood sugar regulation, cholesterol levels, and insulin sensitivity. This category is your primary area of focus given your family history and the rising glucose trend over 5 years.",
    relatedFamily: ["Mother - Type 2 Diabetes at 58", "Maternal grandmother - Type 2 Diabetes at 62"],
  },
  cardiovascular: {
    name: "Heart & Circulation",
    icon: Heart,
    color: "var(--red)",
    colorBg: "var(--red-bg)",
    colorText: "var(--red-text)",
    markers: ["TC", "HDL", "LDL", "TG"],
    riskKey: "cardiovascular",
    description: "Cardiovascular health measures your heart and blood vessel risk factors. This includes cholesterol balance, blood pressure, and inflammatory markers. Your blood pressure is controlled with medication, and your cholesterol profile is mostly within range.",
    relatedFamily: ["Father - Heart attack at 65", "Paternal grandfather - Stroke at 71"],
  },
  bone: {
    name: "Bone & Vitamin D",
    icon: Bone,
    color: "var(--teal)",
    colorBg: "var(--teal-bg)",
    colorText: "var(--teal-text)",
    markers: ["Vit D"],
    riskKey: "bone",
    description: "Bone health includes vitamin D status, calcium metabolism, and structural bone density. Vitamin D is particularly important in Sweden due to limited sunlight. Your current level is just below optimal, which is easily addressed with supplementation.",
    relatedFamily: [],
  },
  kidney: {
    name: "Kidney Function",
    icon: Zap,
    color: "var(--blue)",
    colorBg: "var(--blue-bg)",
    colorText: "var(--blue-text)",
    markers: ["Crea"],
    description: "Kidney function is monitored through creatinine levels, which indicate how well your kidneys filter waste from the blood. Important to track since ACE inhibitors (like your Enalapril) can affect kidney function.",
    relatedFamily: [],
  },
  thyroid: {
    name: "Thyroid Function",
    icon: Activity,
    color: "var(--purple)",
    colorBg: "var(--purple-bg)",
    colorText: "var(--purple-text)",
    markers: ["TSH"],
    description: "The thyroid gland regulates metabolism, energy levels, and body temperature. TSH (thyroid-stimulating hormone) is the primary screening marker. Your thyroid function is normal.",
    relatedFamily: [],
  },
  mental: {
    name: "Mental Health",
    icon: Brain,
    color: "var(--teal)",
    colorBg: "var(--teal-bg)",
    colorText: "var(--teal-text)",
    markers: [],
    description: "Mental health screening covers depression (PHQ-9), anxiety (GAD-7), alcohol use (AUDIT-C), and quality of life (EQ-5D). All your scores are in the minimal/low-risk range, indicating good mental wellbeing.",
    relatedFamily: [],
  },
};

function CategoryContent() {
  const searchParams = useSearchParams();
  const catId = searchParams.get("id") || "metabolic";
  const config = CATEGORY_CONFIG[catId];

  if (!config) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Category not found</div>;
  }

  const Icon = config.icon;
  const latest = BLOOD_TEST_HISTORY[0];
  const catMarkers = config.markers.map((m) => {
    const marker = latest.results.find((r) => r.shortName === m);
    const history = getMarkerHistory(m);
    return marker ? { ...marker, history } : null;
  }).filter(Boolean) as (typeof latest.results[0] & { history: { date: string; value: number }[] })[];

  const normalCount = catMarkers.filter((m) => m.status === "normal").length;
  const watchCount = catMarkers.filter((m) => m.status !== "normal").length;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248, 249, 250, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Link href="/smith9" style={{
            width: 36, height: 36, borderRadius: 12,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: config.colorBg, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={16} style={{ color: config.colorText }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{config.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {catMarkers.length > 0 ? `${catMarkers.length} biomarkers tracked` : "Screening-based"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Overview */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
          padding: 24, marginBottom: 16,
        }}>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 16px 0" }}>
            {config.description}
          </p>

          {catMarkers.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{
                flex: 1, padding: "12px 0", borderRadius: 12,
                background: "var(--green-bg)", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green-text)" }}>{normalCount}</div>
                <div style={{ fontSize: 11, color: "var(--green-text)" }}>In Range</div>
              </div>
              {watchCount > 0 && (
                <div style={{
                  flex: 1, padding: "12px 0", borderRadius: 12,
                  background: "var(--amber-bg)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--amber-text)" }}>{watchCount}</div>
                  <div style={{ fontSize: 11, color: "var(--amber-text)" }}>Borderline</div>
                </div>
              )}
            </div>
          )}

          {/* Related family history */}
          {config.relatedFamily.length > 0 && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "var(--amber-bg)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--amber-text)", marginBottom: 4 }}>
                Relevant Family History
              </div>
              {config.relatedFamily.map((fh, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {fh}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biomarkers in this category */}
        {catMarkers.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0" }}>
              Biomarkers
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {catMarkers.map((marker) => {
                const sc = statusColor(marker.status);
                const trend = marker.history.length >= 2
                  ? marker.history[marker.history.length - 1].value - marker.history[marker.history.length - 2].value
                  : 0;

                return (
                  <Link key={marker.shortName} href={`/smith9/marker?m=${marker.shortName}`} style={{ textDecoration: "none" }}>
                    <div className="card-hover" style={{
                      background: "var(--bg-card)", borderRadius: 16,
                      border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                      padding: "16px 18px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: sc.bg, display: "flex",
                          alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: sc.text }}>
                            {marker.value}
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                            {marker.plainName} ({marker.name})
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                              {marker.refLow}-{marker.refHigh} {marker.unit}
                            </span>
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: "1px 6px",
                              borderRadius: 4, background: sc.bg, color: sc.text,
                              textTransform: "uppercase",
                            }}>
                              {marker.status}
                            </span>
                            {trend !== 0 && (
                              <span style={{ fontSize: 11, fontWeight: 500, color: trend > 0 ? "var(--amber-text)" : "var(--green-text)", display: "flex", alignItems: "center", gap: 2 }}>
                                {trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {trend > 0 ? "+" : ""}{trend.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Sparkline data={marker.history} color={sc.dot} width={80} height={28} />
                      </div>

                      {/* Range bar */}
                      <div style={{ marginTop: 10, position: "relative", height: 20 }}>
                        {(() => {
                          const range = marker.refHigh - marker.refLow;
                          const extLow = marker.refLow - range * 0.2;
                          const extHigh = marker.refHigh + range * 0.2;
                          const total = extHigh - extLow;
                          const normStart = ((marker.refLow - extLow) / total) * 100;
                          const normWidth = ((marker.refHigh - marker.refLow) / total) * 100;
                          const valPos = Math.max(0, Math.min(100, ((marker.value - extLow) / total) * 100));
                          return (
                            <>
                              <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 4, borderRadius: 2, background: "var(--bg-elevated)" }} />
                              <div style={{ position: "absolute", top: 8, left: `${normStart}%`, width: `${normWidth}%`, height: 4, borderRadius: 2, background: "var(--green)", opacity: 0.25 }} />
                              <div style={{
                                position: "absolute", top: 2, left: `${valPos}%`, transform: "translateX(-50%)",
                                width: 0, height: 0,
                                borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                                borderTop: `6px solid ${sc.dot}`,
                              }} />
                              <div style={{ position: "absolute", top: 16, left: `${normStart}%`, fontSize: 9, color: "var(--text-muted)" }}>{marker.refLow}</div>
                              <div style={{ position: "absolute", top: 16, left: `${normStart + normWidth}%`, transform: "translateX(-100%)", fontSize: 9, color: "var(--text-muted)" }}>{marker.refHigh}</div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Mental health scores */}
        {catId === "mental" && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0" }}>
              Screening Scores
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "PHQ-9 (Depression Screening)", score: SCREENING_SCORES.phq9.score, max: SCREENING_SCORES.phq9.maxScore, interp: SCREENING_SCORES.phq9.interpretation, date: SCREENING_SCORES.phq9.date },
                { name: "GAD-7 (Anxiety Screening)", score: SCREENING_SCORES.gad7.score, max: SCREENING_SCORES.gad7.maxScore, interp: SCREENING_SCORES.gad7.interpretation, date: SCREENING_SCORES.gad7.date },
                { name: "AUDIT-C (Alcohol Use)", score: SCREENING_SCORES.auditC.score, max: SCREENING_SCORES.auditC.maxScore, interp: SCREENING_SCORES.auditC.interpretation, date: SCREENING_SCORES.auditC.date },
              ].map((s) => (
                <div key={s.name} style={{
                  background: "var(--bg-card)", borderRadius: 16,
                  border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                  padding: "16px 18px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{s.name}</div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatDate(s.date)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: "var(--green-text)" }}>{s.score}</span>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>/ {s.max}</span>
                  </div>
                  {/* Score bar */}
                  <div style={{ height: 6, borderRadius: 3, background: "var(--bg-elevated)", marginBottom: 8 }}>
                    <div style={{
                      height: 6, borderRadius: 3, background: "var(--green)",
                      width: `${(s.score / s.max) * 100}%`,
                    }} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.interp}</div>
                </div>
              ))}

              {/* EQ-5D */}
              <div style={{
                background: "var(--bg-card)", borderRadius: 16,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "16px 18px",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
                  EQ-5D (Quality of Life)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Mobility", score: SCREENING_SCORES.eq5d.mobility },
                    { label: "Self-Care", score: SCREENING_SCORES.eq5d.selfCare },
                    { label: "Usual Activities", score: SCREENING_SCORES.eq5d.activities },
                    { label: "Pain / Discomfort", score: SCREENING_SCORES.eq5d.pain },
                    { label: "Anxiety / Depression", score: SCREENING_SCORES.eq5d.anxiety },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)", width: 140 }}>{item.label}</span>
                      <div style={{ display: "flex", gap: 3, flex: 1 }}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div key={level} style={{
                            flex: 1, height: 16, borderRadius: 4,
                            background: level <= item.score
                              ? (item.score === 1 ? "var(--green)" : item.score === 2 ? "var(--amber)" : "var(--red)")
                              : "var(--bg-elevated)",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", width: 20, textAlign: "right" }}>
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
                  {SCREENING_SCORES.eq5d.interpretation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk model link */}
        {config.riskKey && (
          <Link href={`/smith9/risk?model=${config.riskKey}`} style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{
              background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
              borderRadius: 16, padding: "16px 20px",
              border: "1px solid rgba(55, 48, 163, 0.1)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Shield size={20} style={{ color: "#3730a3" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#3730a3" }}>
                  View {config.name} Risk Model
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Full risk assessment with factors and recommendations
                </div>
              </div>
              <ArrowUpRight size={16} style={{ color: "#3730a3" }} />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
