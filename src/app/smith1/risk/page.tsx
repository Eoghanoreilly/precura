"use client";

import Link from "next/link";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  Heart, Droplet, Bone, AlertTriangle,
  ChevronRight, Users, Activity, Shield,
  CheckCircle,
} from "lucide-react";
import {
  RISK_ASSESSMENTS, FAMILY_HISTORY, SCREENING_SCORES,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Risk level visual config
function riskConfig(level: string) {
  if (level === "low") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)", barPct: 20 };
  if (level === "low_moderate") return { bg: "var(--teal-bg)", text: "var(--teal-text)", dot: "var(--teal)", barPct: 35 };
  if (level === "moderate") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)", barPct: 50 };
  if (level === "high") return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)", barPct: 75 };
  return { bg: "var(--bg-elevated)", text: "var(--text-muted)", dot: "var(--text-faint)", barPct: 10 };
}

function trendIcon(trend: string) {
  if (trend === "worsening") return <TrendingUp size={12} style={{ color: "var(--amber-text)" }} />;
  if (trend === "improving") return <TrendingDown size={12} style={{ color: "var(--green-text)" }} />;
  if (trend === "approaching") return <TrendingUp size={12} style={{ color: "var(--amber-text)" }} />;
  return <Minus size={12} style={{ color: "var(--text-muted)" }} />;
}

function trendLabel(trend: string) {
  if (trend === "worsening") return { text: "Worsening", color: "var(--amber-text)", bg: "var(--amber-bg)" };
  if (trend === "improving") return { text: "Improving", color: "var(--green-text)", bg: "var(--green-bg)" };
  if (trend === "approaching") return { text: "Approaching threshold", color: "var(--amber-text)", bg: "var(--amber-bg)" };
  return { text: "Stable", color: "var(--teal-text)", bg: "var(--teal-bg)" };
}

// Risk zone bar
function RiskZoneBar({ level, label }: { level: string; label: string }) {
  const zones = [
    { name: "Low", color: "var(--green)", width: 25 },
    { name: "Low-mod", color: "var(--teal)", width: 25 },
    { name: "Moderate", color: "var(--amber)", width: 25 },
    { name: "High", color: "var(--red)", width: 25 },
  ];

  const posMap: Record<string, number> = {
    "low": 12.5,
    "low_moderate": 37.5,
    "moderate": 62.5,
    "high": 87.5,
  };
  const pos = posMap[level] || 12.5;

  return (
    <div>
      <div style={{ position: "relative", height: 12, borderRadius: 6, overflow: "hidden", display: "flex" }}>
        {zones.map((z) => (
          <div key={z.name} style={{ width: `${z.width}%`, background: z.color, opacity: 0.25 }} />
        ))}
        {/* Marker */}
        <div style={{
          position: "absolute", left: `${pos}%`, top: "50%",
          transform: "translate(-50%, -50%)", zIndex: 2,
        }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: `8px solid ${riskConfig(level).dot}`,
          }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 9, color: "var(--green-text)" }}>Low</span>
        <span style={{ fontSize: 9, color: "var(--text-faint)" }}>Moderate</span>
        <span style={{ fontSize: 9, color: "var(--red-text)" }}>High</span>
      </div>
    </div>
  );
}

export default function RiskPage() {
  const { diabetes, cardiovascular, bone, metabolicSyndrome } = RISK_ASSESSMENTS;

  const riskModels = [
    {
      key: "diabetes",
      title: "Type 2 Diabetes",
      icon: <Droplet size={16} />,
      risk: diabetes,
      tenYear: diabetes.tenYearRisk,
      linkedMarkers: ["f-Glucose", "HbA1c"],
    },
    {
      key: "cardiovascular",
      title: "Cardiovascular Disease",
      icon: <Heart size={16} />,
      risk: cardiovascular,
      tenYear: cardiovascular.tenYearRisk,
      linkedMarkers: ["TC", "HDL", "LDL", "TG"],
    },
    {
      key: "bone",
      title: "Bone Health",
      icon: <Bone size={16} />,
      risk: bone,
      tenYear: bone.tenYearRisk,
      linkedMarkers: ["Vit D"],
    },
  ];

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
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>Risk Models</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Based on your blood tests and history</p>
          </div>
        </div>

        {/* Context */}
        <div className="animate-fade-in" style={{
          background: "var(--accent-light)", borderRadius: 14,
          padding: "12px 16px", marginBottom: 16,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <Shield size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Risk models combine your blood test results, family history, biometrics, and lifestyle data into a clinical risk estimate. These use validated tools (FINDRISC, SCORE2) reviewed by your Precura doctor.
          </p>
        </div>

        {/* Risk Cards */}
        {riskModels.map((model, idx) => {
          const rc = riskConfig(model.risk.riskLevel);
          const tl = trendLabel(model.risk.trend);

          return (
            <div key={model.key} className={`animate-fade-in stagger-${idx + 1}`} style={{
              background: "var(--bg-card)", borderRadius: 18,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "18px 18px 16px", marginBottom: 14,
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: rc.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: rc.text }}>{model.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{model.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>10-year risk: {model.tenYear}</div>
                  </div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 10px", borderRadius: 8, background: tl.bg,
                }}>
                  {trendIcon(model.risk.trend)}
                  <span style={{ fontSize: 11, fontWeight: 600, color: tl.color }}>{tl.text}</span>
                </div>
              </div>

              {/* Risk level badge + bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 20, fontWeight: 800, color: rc.text,
                  marginBottom: 8,
                }}>
                  {model.risk.riskLabel}
                </div>
                <RiskZoneBar level={model.risk.riskLevel} label={model.risk.riskLabel} />
              </div>

              {/* Summary */}
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>
                {model.risk.summary}
              </p>

              {/* Key Factors */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Key factors
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {model.risk.keyFactors.map((factor) => {
                    const impactColor = factor.impact === "high" ? "var(--red-text)" :
                      factor.impact === "medium" ? "var(--amber-text)" :
                      factor.impact === "positive" ? "var(--green-text)" : "var(--text-muted)";
                    const impactBg = factor.impact === "high" ? "var(--red-bg)" :
                      factor.impact === "medium" ? "var(--amber-bg)" :
                      factor.impact === "positive" ? "var(--green-bg)" : "var(--bg-elevated)";

                    return (
                      <div key={factor.name} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 10px", borderRadius: 10, background: "var(--bg-elevated)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {factor.changeable ? (
                            <Activity size={12} style={{ color: "var(--accent)" }} />
                          ) : (
                            <Users size={12} style={{ color: "var(--text-faint)" }} />
                          )}
                          <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{factor.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {factor.changeable && (
                            <span style={{ fontSize: 9, color: "var(--accent)", fontWeight: 600 }}>MODIFIABLE</span>
                          )}
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "2px 6px",
                            borderRadius: 4, background: impactBg, color: impactColor,
                            textTransform: "capitalize",
                          }}>
                            {factor.impact}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Linked markers */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {model.linkedMarkers.map((shortName) => {
                  const m = getLatestMarker(shortName);
                  if (!m) return null;
                  const sc = statusColor(m.status);
                  return (
                    <Link key={shortName} href={`/smith1/marker?m=${shortName}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 8,
                        background: sc.bg, cursor: "pointer",
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: sc.dot }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: sc.text }}>
                          {m.plainName}: {m.value} {m.unit}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Metabolic Syndrome */}
        <div className="animate-fade-in stagger-4" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 18px 16px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--amber-bg)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <AlertTriangle size={16} style={{ color: "var(--amber-text)" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Metabolic Syndrome</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{metabolicSyndrome.status}</div>
            </div>
          </div>

          {/* Progress bar showing 2/5 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} style={{
                  flex: 1, height: 8, borderRadius: 4,
                  background: n <= metabolicSyndrome.metCount ? "var(--amber)" : "var(--bg-elevated)",
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
              {metabolicSyndrome.metCount} of {metabolicSyndrome.threshold} criteria needed for diagnosis
            </div>
          </div>

          {/* Criteria list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {metabolicSyndrome.criteria.map((c) => (
              <div key={c.name} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: c.met ? "var(--amber-bg)" : "var(--bg-elevated)",
              }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}>
                  {c.met ? (
                    <AlertTriangle size={13} style={{ color: "var(--amber-text)" }} />
                  ) : (
                    <CheckCircle size={13} style={{ color: "var(--green-text)" }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.met ? "var(--amber-text)" : "var(--text)" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                    {c.value} - {c.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 12, padding: "10px 12px", borderRadius: 10,
            background: "var(--amber-bg)", border: "1px solid rgba(255, 152, 0, 0.1)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              marginBottom: 4,
            }}>
              {trendIcon(metabolicSyndrome.trend)}
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--amber-text)" }}>
                {trendLabel(metabolicSyndrome.trend).text}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Your waist circumference (86 cm) is approaching the 88 cm threshold. If it crosses, combined with your existing blood pressure and glucose criteria, you would meet 3 of 5 criteria for metabolic syndrome.
            </p>
          </div>
        </div>

        {/* Family History */}
        <div className="animate-fade-in stagger-5" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "16px 18px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Users size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Family History</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAMILY_HISTORY.map((fh) => (
              <div key={`${fh.relative}-${fh.condition}`} style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                padding: "8px 10px", borderRadius: 10, background: "var(--bg-elevated)",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                    {fh.relative}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {fh.condition} at age {fh.ageAtDiagnosis}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                  {fh.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Screening Scores */}
        <div className="animate-fade-in stagger-6" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "16px 18px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
            Screening Scores
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { name: "FINDRISC", desc: "Diabetes risk", score: SCREENING_SCORES.findrisc.score, max: SCREENING_SCORES.findrisc.maxScore, level: SCREENING_SCORES.findrisc.level },
              { name: "SCORE2", desc: "Heart risk", score: `${SCREENING_SCORES.score2.riskPercent}%`, max: null, level: SCREENING_SCORES.score2.level },
              { name: "PHQ-9", desc: "Depression", score: SCREENING_SCORES.phq9.score, max: SCREENING_SCORES.phq9.maxScore, level: SCREENING_SCORES.phq9.level },
              { name: "GAD-7", desc: "Anxiety", score: SCREENING_SCORES.gad7.score, max: SCREENING_SCORES.gad7.maxScore, level: SCREENING_SCORES.gad7.level },
            ].map((s) => {
              const levelStr = s.level as string;
              const rc = riskConfig(levelStr === "minimal" ? "low" : levelStr === "low_risk" ? "low" : levelStr);
              return (
                <div key={s.name} style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: "var(--bg-elevated)",
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: rc.text }}>
                    {s.score}{s.max ? <span style={{ fontSize: 11, color: "var(--text-faint)" }}>/{s.max}</span> : null}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginTop: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}
