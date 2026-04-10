"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Shield, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, ChevronDown, Heart,
  Flame, Bone, Activity, Info, ArrowUpRight,
} from "lucide-react";
import {
  RISK_ASSESSMENTS, SCREENING_SCORES, FAMILY_HISTORY,
  BIOMETRICS_HISTORY, BLOOD_TEST_HISTORY,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function riskColor(level: string) {
  if (level === "low" || level === "minimal" || level === "low_risk" || level === "positive")
    return { bg: "var(--green-bg)", text: "var(--green-text)", bar: "var(--green)" };
  if (level === "moderate" || level === "low_moderate" || level === "approaching" || level === "worsening")
    return { bg: "var(--amber-bg)", text: "var(--amber-text)", bar: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", bar: "var(--red)" };
}

function RiskContent() {
  const searchParams = useSearchParams();
  const activeModel = searchParams.get("model") || "all";
  const [expandedModel, setExpandedModel] = useState<string | null>(activeModel !== "all" ? activeModel : "diabetes");

  const models = [
    {
      id: "diabetes",
      name: "Type 2 Diabetes Risk",
      icon: Flame,
      color: "var(--amber)",
      colorBg: "var(--amber-bg)",
      colorText: "var(--amber-text)",
      risk: RISK_ASSESSMENTS.diabetes,
      screeningScore: SCREENING_SCORES.findrisc,
      screeningLabel: "FINDRISC",
      explanation: "The Finnish Diabetes Risk Score (FINDRISC) estimates your 10-year risk of developing Type 2 Diabetes. It considers age, BMI, waist circumference, physical activity, diet, blood pressure medication, high glucose history, and family history.",
      relatedMarkers: ["f-Glucose", "HbA1c", "f-Insulin", "TG"],
    },
    {
      id: "cardiovascular",
      name: "Cardiovascular Risk",
      icon: Heart,
      color: "var(--red)",
      colorBg: "var(--red-bg)",
      colorText: "var(--red-text)",
      risk: RISK_ASSESSMENTS.cardiovascular,
      screeningScore: SCREENING_SCORES.score2,
      screeningLabel: "SCORE2",
      explanation: "The SCORE2 algorithm estimates 10-year risk of cardiovascular events (heart attack, stroke) in apparently healthy people. It factors in age, sex, smoking status, systolic blood pressure, and cholesterol levels. Calibrated for the Swedish population.",
      relatedMarkers: ["TC", "HDL", "LDL", "TG"],
    },
    {
      id: "bone",
      name: "Bone Health Risk",
      icon: Bone,
      color: "var(--teal)",
      colorBg: "var(--teal-bg)",
      colorText: "var(--teal-text)",
      risk: RISK_ASSESSMENTS.bone,
      screeningScore: null,
      screeningLabel: "Clinical Assessment",
      explanation: "Bone health risk is assessed using a combination of age, sex, menopausal status, vitamin D levels, calcium intake, physical activity, medication history, and family history. DEXA scan would provide more precise assessment.",
      relatedMarkers: ["Vit D"],
    },
    {
      id: "metabolicSyndrome",
      name: "Metabolic Syndrome",
      icon: Activity,
      color: "var(--purple)",
      colorBg: "var(--purple-bg)",
      colorText: "var(--purple-text)",
      risk: null,
      metSyn: RISK_ASSESSMENTS.metabolicSyndrome,
      screeningScore: null,
      screeningLabel: "ATP III Criteria",
      explanation: "Metabolic syndrome is diagnosed when 3 of 5 criteria are met: elevated waist circumference, elevated triglycerides, reduced HDL, elevated blood pressure, and elevated fasting glucose. You currently meet 2 of 5, with waist circumference approaching the threshold.",
      relatedMarkers: ["f-Glucose", "TG", "HDL"],
    },
  ];

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
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Risk Models</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Clinical risk assessment</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Risk Overview Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Diabetes", risk: RISK_ASSESSMENTS.diabetes.tenYearRisk, level: RISK_ASSESSMENTS.diabetes.riskLevel, trend: RISK_ASSESSMENTS.diabetes.trend },
            { label: "Cardiovascular", risk: RISK_ASSESSMENTS.cardiovascular.tenYearRisk, level: RISK_ASSESSMENTS.cardiovascular.riskLevel, trend: RISK_ASSESSMENTS.cardiovascular.trend },
            { label: "FINDRISC", risk: `${SCREENING_SCORES.findrisc.score}/${SCREENING_SCORES.findrisc.maxScore}`, level: SCREENING_SCORES.findrisc.level, trend: null },
            { label: "SCORE2", risk: `${SCREENING_SCORES.score2.riskPercent}%`, level: SCREENING_SCORES.score2.level, trend: null },
          ].map((item) => {
            const rc = riskColor(item.level);
            return (
              <div key={item.label} style={{
                background: "var(--bg-card)", borderRadius: 14,
                border: "1px solid var(--border)", padding: "14px 16px",
                boxShadow: "var(--shadow-sm)", textAlign: "center",
              }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: rc.text, letterSpacing: "-0.02em" }}>
                  {item.risk}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 8px",
                  borderRadius: 6, background: rc.bg, color: rc.text,
                  display: "inline-block", marginTop: 4, textTransform: "uppercase",
                }}>
                  {item.level.replace("_", "-")}
                </div>
                {item.trend === "worsening" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "center", marginTop: 4 }}>
                    <TrendingUp size={10} style={{ color: "var(--amber-text)" }} />
                    <span style={{ fontSize: 10, color: "var(--amber-text)" }}>Rising</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Models */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {models.map((model) => {
            const isExpanded = expandedModel === model.id;
            const Icon = model.icon;
            const risk = model.risk as typeof RISK_ASSESSMENTS.diabetes | null;
            const metSyn = (model as { metSyn?: typeof RISK_ASSESSMENTS.metabolicSyndrome }).metSyn;

            return (
              <div key={model.id} style={{
                background: "var(--bg-card)", borderRadius: 18,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setExpandedModel(isExpanded ? null : model.id)}
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: "18px 20px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: model.colorBg, display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={22} style={{ color: model.colorText }} />
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{model.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{model.screeningLabel}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {risk && (
                      <span style={{
                        fontSize: 16, fontWeight: 700,
                        color: riskColor(risk.riskLevel).text,
                      }}>
                        {risk.tenYearRisk}
                      </span>
                    )}
                    {metSyn && (
                      <span style={{
                        fontSize: 14, fontWeight: 700,
                        color: riskColor(metSyn.trend).text,
                      }}>
                        {metSyn.metCount}/{metSyn.threshold}
                      </span>
                    )}
                    <ChevronDown size={16} style={{
                      color: "var(--text-muted)",
                      transform: isExpanded ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }} />
                  </div>
                </button>

                {isExpanded && (
                  <div style={{
                    padding: "0 20px 20px",
                    borderTop: "1px solid var(--divider)",
                  }}>
                    {/* Risk summary */}
                    {risk && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{
                          padding: "12px 16px", borderRadius: 12,
                          background: riskColor(risk.riskLevel).bg, marginBottom: 16,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: riskColor(risk.riskLevel).text, marginBottom: 4 }}>
                            {risk.riskLabel}
                            {(risk.trend as string) === "worsening" && " - Trending Worse"}
                            {(risk.trend as string) === "stable" && " - Stable"}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            {risk.summary}
                          </div>
                        </div>

                        {/* Key factors */}
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>
                          Key Risk Factors
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {risk.keyFactors.map((factor) => {
                            const fc = riskColor(factor.impact);
                            return (
                              <div key={factor.name} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "8px 0",
                              }}>
                                <div style={{
                                  width: 24, height: 24, borderRadius: 7,
                                  background: fc.bg, display: "flex",
                                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                  {(factor.impact as string) === "positive" ? (
                                    <CheckCircle size={13} style={{ color: fc.text }} />
                                  ) : (
                                    <AlertTriangle size={13} style={{ color: fc.text }} />
                                  )}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{factor.name}</div>
                                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                    {factor.changeable ? "Modifiable" : "Non-modifiable"} / {factor.impact} impact
                                  </div>
                                </div>
                                <span style={{
                                  fontSize: 10, fontWeight: 600, padding: "2px 8px",
                                  borderRadius: 6, background: fc.bg, color: fc.text,
                                  textTransform: "uppercase",
                                }}>
                                  {factor.impact}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Metabolic syndrome criteria */}
                    {metSyn && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{
                          padding: "12px 16px", borderRadius: 12,
                          background: "var(--amber-bg)", marginBottom: 16,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--amber-text)", marginBottom: 4 }}>
                            {metSyn.status}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            Metabolic syndrome is approaching. Waist circumference (86cm) is close to the 88cm threshold for women.
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {metSyn.criteria.map((c) => (
                            <div key={c.name} style={{
                              display: "flex", alignItems: "flex-start", gap: 10,
                              padding: "10px 14px", borderRadius: 12,
                              background: c.met ? "var(--amber-bg)" : "var(--bg-elevated)",
                            }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                                background: c.met ? "var(--amber)" : "var(--green)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginTop: 2,
                              }}>
                                {c.met ? (
                                  <AlertTriangle size={13} style={{ color: "#fff" }} />
                                ) : (
                                  <CheckCircle size={13} style={{ color: "#fff" }} />
                                )}
                              </div>
                              <div>
                                <div style={{
                                  fontSize: 13, fontWeight: 600,
                                  color: c.met ? "var(--amber-text)" : "var(--green-text)",
                                }}>
                                  {c.name}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                                  Your value: {c.value}
                                </div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                                  {c.note}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Screening score */}
                    {model.screeningScore && (
                      <div style={{
                        marginTop: 16, padding: "12px 16px", borderRadius: 12,
                        background: "var(--bg-elevated)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                            {model.screeningLabel} Score
                          </span>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {formatDate(model.screeningScore.date)}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span style={{ fontSize: 24, fontWeight: 800, color: riskColor(model.screeningScore.level).text }}>
                            {"score" in model.screeningScore ? (model.screeningScore as { score: number }).score : (model.screeningScore as { riskPercent: number }).riskPercent}
                          </span>
                          {"maxScore" in model.screeningScore && (
                            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                              / {(model.screeningScore as { maxScore: number }).maxScore}
                            </span>
                          )}
                          {"riskPercent" in model.screeningScore && (
                            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>%</span>
                          )}
                        </div>
                        {/* Score bar */}
                        <div style={{ height: 6, borderRadius: 3, background: "var(--bg-card)", marginTop: 8, overflow: "hidden" }}>
                          <div style={{
                            height: 6, borderRadius: 3,
                            background: riskColor(model.screeningScore.level).bar,
                            width: `${("score" in model.screeningScore
                              ? ((model.screeningScore as { score: number }).score / (model.screeningScore as { maxScore: number }).maxScore)
                              : (model.screeningScore as { riskPercent: number }).riskPercent / 20
                            ) * 100}%`,
                          }} />
                        </div>
                        {"interpretation" in model.screeningScore && (
                          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                            {(model.screeningScore as { interpretation: string }).interpretation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanation */}
                    <div style={{
                      marginTop: 16, padding: "12px 16px", borderRadius: 12,
                      background: "var(--bg-elevated)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <Info size={13} style={{ color: "#3730a3" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#3730a3" }}>About this model</span>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                        {model.explanation}
                      </p>
                    </div>

                    {/* Related markers */}
                    {model.relatedMarkers.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                          Related Biomarkers
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {model.relatedMarkers.map((m) => {
                            const marker = getLatestMarker(m);
                            if (!marker) return null;
                            const sc = riskColor(marker.status === "normal" ? "low" : marker.status === "borderline" ? "moderate" : "high");
                            return (
                              <Link key={m} href={`/smith9/marker?m=${m}`} style={{ textDecoration: "none" }}>
                                <div style={{
                                  display: "flex", alignItems: "center", gap: 6,
                                  padding: "6px 12px", borderRadius: 10,
                                  background: sc.bg, border: "1px solid transparent",
                                }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: sc.text }}>
                                    {marker.plainName}: {marker.value} {marker.unit}
                                  </span>
                                  <ArrowUpRight size={11} style={{ color: sc.text }} />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Family History relevance */}
        <div style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 20px", marginTop: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
            Family History Impact on Risk
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAMILY_HISTORY.map((fh, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 0",
                borderBottom: i < FAMILY_HISTORY.length - 1 ? "1px solid var(--divider)" : "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "var(--amber-bg)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <AlertTriangle size={14} style={{ color: "var(--amber-text)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{fh.relative}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {fh.condition} at age {fh.ageAtDiagnosis}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{fh.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RiskPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>}>
      <RiskContent />
    </Suspense>
  );
}
