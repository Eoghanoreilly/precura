"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, AlertTriangle, Heart, Activity, Bone, TrendingUp,
  TrendingDown, Minus, ChevronRight, ChevronDown, ChevronUp,
  Link2, Shield, Droplets, Brain,
} from "lucide-react";
import {
  PATIENT, RISK_ASSESSMENTS, FAMILY_HISTORY, BLOOD_TEST_HISTORY,
  BIOMETRICS_HISTORY, CONDITIONS, MEDICATIONS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Helpers
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ============================================================================
// Risk level visual
// ============================================================================

const RISK_COLORS: Record<string, { color: string; bg: string; text: string }> = {
  low: { color: "var(--green)", bg: "var(--green-bg)", text: "var(--green-text)" },
  low_moderate: { color: "var(--teal)", bg: "var(--teal-bg)", text: "var(--teal-text)" },
  moderate: { color: "var(--amber)", bg: "var(--amber-bg)", text: "var(--amber-text)" },
  high: { color: "var(--red)", bg: "var(--red-bg)", text: "var(--red-text)" },
  approaching: { color: "var(--amber)", bg: "var(--amber-bg)", text: "var(--amber-text)" },
};

function RiskZoneBar({ level, label }: { level: string; label: string }) {
  const zones = ["low", "low_moderate", "moderate", "high"];
  const position = level === "low" ? 12.5 : level === "low_moderate" ? 37.5 : level === "moderate" ? 62.5 : 87.5;

  return (
    <div style={{ position: "relative", marginBottom: 8 }}>
      <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
        <div style={{ flex: 1, background: "var(--green)", opacity: level === "low" ? 1 : 0.3, borderRadius: "4px 0 0 4px" }} />
        <div style={{ flex: 1, background: "var(--teal)", opacity: level === "low_moderate" ? 1 : 0.3 }} />
        <div style={{ flex: 1, background: "var(--amber)", opacity: level === "moderate" ? 1 : 0.3 }} />
        <div style={{ flex: 1, background: "var(--red)", opacity: level === "high" ? 1 : 0.3, borderRadius: "0 4px 4px 0" }} />
      </div>
      {/* Marker */}
      <div style={{
        position: "absolute",
        left: `${position}%`,
        top: -4,
        transform: "translateX(-50%)",
      }}>
        <div style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `6px solid ${RISK_COLORS[level]?.color || "var(--amber)"}`,
        }} />
      </div>
    </div>
  );
}

// ============================================================================
// Risk card component
// ============================================================================

function RiskCard({
  title,
  icon,
  risk,
  tenYearRisk,
  timelineConnections,
}: {
  title: string;
  icon: React.ReactNode;
  risk: { riskLevel: string; riskLabel: string; trend: string; summary: string; keyFactors: { name: string; changeable: boolean; impact: string }[] };
  tenYearRisk: string;
  timelineConnections: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const c = RISK_COLORS[risk.riskLevel] || RISK_COLORS.moderate;

  return (
    <div style={{
      borderRadius: 16,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "16px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: c.bg,
          color: c.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>{title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {risk.trend === "worsening" && <TrendingUp size={13} style={{ color: "var(--amber)" }} />}
              {risk.trend === "stable" && <Minus size={13} style={{ color: "var(--teal)" }} />}
              {risk.trend === "improving" && <TrendingDown size={13} style={{ color: "var(--green)" }} />}
              {expanded ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: 20,
              background: c.bg,
              color: c.text,
            }}>
              {risk.riskLabel}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              10-year: {tenYearRisk}
            </span>
          </div>

          <RiskZoneBar level={risk.riskLevel} label={risk.riskLabel} />
        </div>
      </button>

      {expanded && (
        <div style={{
          padding: "0 18px 18px",
          borderTop: "1px solid var(--divider)",
          animation: "fadeIn 0.2s ease",
        }}>
          {/* Summary */}
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)", margin: "12px 0 16px" }}>
            {risk.summary}
          </p>

          {/* Key factors */}
          <h4 style={{ fontSize: 11, fontWeight: 700, color: "#0f5959", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
            Key factors
          </h4>
          {risk.keyFactors.map((f, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: f.impact === "high" ? "var(--red)" : f.impact === "medium" ? "var(--amber)" : f.impact === "positive" ? "var(--green)" : "var(--text-muted)",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, color: "var(--text)" }}>{f.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: f.changeable ? "var(--green-bg)" : "var(--bg-elevated)",
                  color: f.changeable ? "var(--green-text)" : "var(--text-muted)",
                  fontWeight: 600,
                }}>
                  {f.changeable ? "Changeable" : "Fixed"}
                </span>
                <span style={{
                  fontSize: 10,
                  color: f.impact === "high" ? "var(--red-text)" : f.impact === "medium" ? "var(--amber-text)" : f.impact === "positive" ? "var(--green-text)" : "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}>
                  {f.impact}
                </span>
              </div>
            </div>
          ))}

          {/* Timeline connections */}
          {timelineConnections.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#0f5959", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
                Timeline connections
              </h4>
              {timelineConnections.map((tc, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "#e0f7f5",
                  marginBottom: 6,
                }}>
                  <Link2 size={12} style={{ color: "#0f5959", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, lineHeight: 1.5, color: "#0f5959" }}>{tc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Metabolic syndrome tracker
// ============================================================================

function MetabolicSyndromeCard() {
  const ms = RISK_ASSESSMENTS.metabolicSyndrome;
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      borderRadius: 16,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "var(--amber-bg)",
          color: "var(--amber)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Shield size={18} />
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
            Metabolic syndrome
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: 20,
              background: "var(--amber-bg)",
              color: "var(--amber-text)",
            }}>
              {ms.metCount} of {ms.threshold} criteria met
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Approaching</span>
          </div>
        </div>

        {expanded ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
      </button>

      {expanded && (
        <div style={{
          padding: "0 18px 18px",
          borderTop: "1px solid var(--divider)",
          animation: "fadeIn 0.2s ease",
        }}>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)", margin: "12px 0" }}>
            Metabolic syndrome is diagnosed when 3 or more criteria are met. Anna currently meets 2,
            with waist circumference approaching the third threshold. This is a warning sign that
            connects to both diabetes and cardiovascular risk.
          </p>

          {/* Criteria progress */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 14,
          }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: i < ms.metCount ? "var(--amber)" : i < ms.threshold ? "var(--border)" : "var(--bg-elevated)",
                transition: "background 0.3s ease",
              }} />
            ))}
          </div>

          {ms.criteria.map((c, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: c.met ? "var(--amber-bg)" : "var(--green-bg)",
                color: c.met ? "var(--amber-text)" : "var(--green-text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
              }}>
                {c.met ? "!" : "OK"}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{c.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: c.met ? "var(--amber-text)" : "var(--green-text)" }}>
                    {c.value}
                  </span>
                  {c.note && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.note}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function RiskPage() {
  const glucoseData = getMarkerHistory("f-Glucose");
  const firstGluc = glucoseData.length > 0 ? glucoseData[0].value : 0;
  const lastGluc = glucoseData.length > 0 ? glucoseData[glucoseData.length - 1].value : 0;

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
          gap: 12,
        }}>
          <Link href="/smith7" style={{ color: "var(--text-muted)", display: "flex" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f5959", margin: 0 }}>
              Risk Models
            </h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
              How your timeline data feeds into health predictions
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px 80px" }}>
        {/* Hero explanation */}
        <div className="animate-fade-in" style={{
          borderRadius: 20,
          background: "linear-gradient(135deg, #0f5959, #1a7a7a)",
          padding: "22px 20px",
          color: "#fff",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Brain size={16} style={{ opacity: 0.8 }} />
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.8 }}>
              Risk from your timeline
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 14px", fontWeight: 600 }}>
            These risk scores are not from a questionnaire.
            They are calculated from your actual health timeline.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
            5 years of blood tests, biometrics, medications, and family history.
            Every data point in your timeline feeds into these models.
            As new events are added, the scores update automatically.
          </p>
        </div>

        {/* Risk cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="animate-fade-in stagger-1">
            <RiskCard
              title="Type 2 diabetes risk"
              icon={<Droplets size={18} />}
              risk={RISK_ASSESSMENTS.diabetes}
              tenYearRisk={RISK_ASSESSMENTS.diabetes.tenYearRisk}
              timelineConnections={[
                `Glucose rose ${firstGluc} to ${lastGluc} mmol/L over 5 years of blood tests`,
                "Weight increased 74kg to 79kg (peak) - correlated with glucose rise",
                "Mother diagnosed with T2D at 58, grandmother at 62",
                "Training plan started Jan 2026 targeting insulin sensitivity",
                "Currently meeting 2/5 metabolic syndrome criteria",
              ]}
            />
          </div>

          <div className="animate-fade-in stagger-2">
            <RiskCard
              title="Cardiovascular risk"
              icon={<Heart size={18} />}
              risk={RISK_ASSESSMENTS.cardiovascular}
              tenYearRisk={RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
              timelineConnections={[
                "Hypertension diagnosed March 2022 - BP was 142/88",
                "Enalapril started 6 days later - BP dropped to 132/84 within 12 months",
                "Father had heart attack at age 65",
                "Cholesterol rose from 4.6 to 5.1 alongside glucose",
                "Good HDL (1.6) is a protective factor",
              ]}
            />
          </div>

          <div className="animate-fade-in stagger-3">
            <RiskCard
              title="Bone health"
              icon={<Bone size={18} />}
              risk={RISK_ASSESSMENTS.bone}
              tenYearRisk={RISK_ASSESSMENTS.bone.tenYearRisk}
              timelineConnections={[
                "Vitamin D at 48 nmol/L (slightly below 50 threshold) - common in Sweden",
                "D3 supplement recommended by doctor",
                "Weight-bearing exercise in training plan supports bone density",
              ]}
            />
          </div>

          <div className="animate-fade-in stagger-4">
            <MetabolicSyndromeCard />
          </div>
        </div>

        {/* Family history context */}
        <div className="animate-fade-in stagger-5" style={{
          marginTop: 16,
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 10px" }}>
            Family history (non-modifiable risk factors)
          </h3>
          {FAMILY_HISTORY.map((fh, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "var(--amber-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Heart size={13} style={{ color: "var(--amber)" }} />
              </div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{fh.relative}</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}> - {fh.condition}, age {fh.ageAtDiagnosis}</span>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{fh.status}</div>
              </div>
            </div>
          ))}
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
