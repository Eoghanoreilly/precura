"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Minus,
  Shield,
  Heart,
  AlertTriangle,
  Activity,
  FileText,
} from "lucide-react";
import {
  PATIENT,
  DOCTOR_NOTES,
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  FAMILY_HISTORY,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Risk level styling
function riskStyle(level: string): { bg: string; text: string; border: string } {
  switch (level) {
    case "low":
      return { bg: "var(--green-bg)", text: "var(--green-text)", border: "#c8e6c9" };
    case "low_moderate":
      return { bg: "var(--teal-bg)", text: "var(--teal-text)", border: "#b2dfdb" };
    case "moderate":
      return { bg: "var(--amber-bg)", text: "var(--amber-text)", border: "#ffecb3" };
    case "high":
      return { bg: "var(--red-bg)", text: "var(--red-text)", border: "#ffcdd2" };
    default:
      return { bg: "var(--bg-elevated)", text: "var(--text-secondary)", border: "var(--border)" };
  }
}

function trendIcon(trend: string) {
  if (trend === "worsening") return <TrendingUp size={13} style={{ color: "var(--amber-text)" }} />;
  if (trend === "stable") return <Minus size={13} style={{ color: "var(--teal-text)" }} />;
  return <Minus size={13} style={{ color: "var(--text-muted)" }} />;
}

// Simple sparkline for glucose trend
function GlucoseSparkline() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;
  const width = 200;
  const height = 48;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / (max - min)) * height;
    return `${x},${y}`;
  });
  const last = values[values.length - 1];
  const lastX = width;
  const lastY = height - ((last - min) / (max - min)) * height;

  return (
    <svg width={width} height={height + 8} viewBox={`0 0 ${width} ${height + 8}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="glucoseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={DOC_COLOR} stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--amber)" stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="url(#glucoseGrad)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={4} fill="var(--amber)" />
      <text x={lastX + 8} y={lastY + 4} fontSize={11} fontWeight={600} fill="var(--amber-text)">
        {last}
      </text>
    </svg>
  );
}

export default function HealthPage() {
  const router = useRouter();
  const [expandedRisk, setExpandedRisk] = useState<string | null>("diabetes");
  const latestNote = DOCTOR_NOTES[0];
  const latestBio = BIOMETRICS_HISTORY[0];

  const risks = [
    {
      key: "diabetes",
      label: "Diabetes",
      data: RISK_ASSESSMENTS.diabetes,
    },
    {
      key: "cardiovascular",
      label: "Cardiovascular (heart and blood vessels)",
      data: RISK_ASSESSMENTS.cardiovascular,
    },
    {
      key: "bone",
      label: "Bone health",
      data: RISK_ASSESSMENTS.bone,
    },
  ];

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
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Your health</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>As assessed by Dr. Johansson</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* ----------------------------------------------------------------- */}
        {/* DOCTOR'S SUMMARY                                                  */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in"
          style={{
            background: `linear-gradient(135deg, ${DOC_BG} 0%, #ecfdf5 100%)`,
            borderRadius: 18,
            padding: "18px",
            marginBottom: 20,
            border: `1px solid ${DOC_BORDER}`,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <img
              src={DOC_AVATAR}
              alt=""
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${DOC_COLOR}` }}
            />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Johansson's assessment</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Last updated {formatDate(latestNote.date)}</p>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              borderRadius: 12,
              padding: "14px",
            }}
          >
            {latestNote.note
              .split("\n")
              .filter(Boolean)
              .map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: i < latestNote.note.split("\n").filter(Boolean).length - 1 ? 10 : 0,
                  }}
                >
                  {para}
                </p>
              ))}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* GLUCOSE TREND - THE KEY STORY                                     */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in stagger-1"
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 16,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Fasting glucose (blood sugar)
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                5-year trend Dr. Johansson identified
              </p>
            </div>
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--amber-bg)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--amber-text)",
              }}
            >
              Trending up
            </div>
          </div>

          <div style={{ margin: "4px 0 8px" }}>
            <GlucoseSparkline />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>2021</span>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>5.0 mmol/L</p>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>2026 (latest)</span>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--amber-text)" }}>5.8 mmol/L</p>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: "var(--amber-bg)",
              borderRadius: 10,
              border: "1px solid #ffecb3",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--amber-text)", lineHeight: 1.5 }}>
              Still in normal range (under 6.0), but the steady upward trend over 5 years is what Dr. Johansson flagged. Your previous GP recorded each result as normal individually but didn't connect the pattern.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* RISK ASSESSMENTS                                                  */}
        {/* ----------------------------------------------------------------- */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 10,
            paddingLeft: 2,
          }}
        >
          Risk assessments
        </p>

        {risks.map((risk) => {
          const isExpanded = expandedRisk === risk.key;
          const style = riskStyle(risk.data.riskLevel);
          return (
            <div
              key={risk.key}
              className="animate-fade-in stagger-2"
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                marginBottom: 10,
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpandedRisk(isExpanded ? null : risk.key)}
                style={{
                  width: "100%",
                  textAlign: "left" as const,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: style.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {risk.key === "diabetes" && <Activity size={16} style={{ color: style.text }} />}
                  {risk.key === "cardiovascular" && <Heart size={16} style={{ color: style.text }} />}
                  {risk.key === "bone" && <Shield size={16} style={{ color: style.text }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      {risk.label}
                    </p>
                    {trendIcon(risk.data.trend)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: style.text,
                        padding: "1px 8px",
                        borderRadius: 10,
                        background: style.bg,
                      }}
                    >
                      {risk.data.riskLabel}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      10-year: {risk.data.tenYearRisk}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: "var(--text-faint)" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "var(--text-faint)" }} />
                )}
              </button>

              {isExpanded && (
                <div style={{ padding: "0 16px 16px" }}>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                    {risk.data.summary}
                  </p>

                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Key factors
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {risk.data.keyFactors.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 10,
                          background: "var(--bg-elevated)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background:
                                f.impact === "positive"
                                  ? "var(--green)"
                                  : f.impact === "high"
                                  ? "var(--amber)"
                                  : f.impact === "medium"
                                  ? "#fbbf24"
                                  : "var(--teal)",
                            }}
                          />
                          <span style={{ fontSize: 13, color: "var(--text)" }}>{f.name}</span>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: f.changeable ? DOC_COLOR : "var(--text-muted)",
                          }}
                        >
                          {f.changeable ? "Changeable" : "Fixed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ----------------------------------------------------------------- */}
        {/* METABOLIC SYNDROME TRACKER                                        */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in stagger-3"
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            padding: "16px",
            marginTop: 10,
            marginBottom: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Metabolic syndrome
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {RISK_ASSESSMENTS.metabolicSyndrome.metCount} of {RISK_ASSESSMENTS.metabolicSyndrome.threshold} criteria met
              </p>
            </div>
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--amber-bg)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--amber-text)",
              }}
            >
              Approaching
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "var(--bg-elevated)",
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(RISK_ASSESSMENTS.metabolicSyndrome.metCount / 5) * 100}%`,
                borderRadius: 4,
                background: "var(--amber)",
                transition: "width 0.8s ease",
              }}
            />
          </div>

          {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 0",
                borderBottom: i < RISK_ASSESSMENTS.metabolicSyndrome.criteria.length - 1 ? "1px solid var(--divider)" : "none",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: c.met ? "var(--amber-bg)" : "var(--green-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                  fontSize: 10,
                  fontWeight: 700,
                  color: c.met ? "var(--amber-text)" : "var(--green-text)",
                }}
              >
                {c.met ? "!" : "/"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{c.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {c.value} - {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* FAMILY HISTORY                                                    */}
        {/* ----------------------------------------------------------------- */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 10,
            paddingLeft: 2,
          }}
        >
          Family history (non-changeable risk factors)
        </p>

        <div
          className="animate-fade-in stagger-4"
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            padding: "4px 0",
            marginBottom: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {FAMILY_HISTORY.map((fh, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 16px",
                borderBottom: i < FAMILY_HISTORY.length - 1 ? "1px solid var(--divider)" : "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--bg-elevated)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                {fh.relative.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{fh.relative}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 1 }}>
                  {fh.condition} at age {fh.ageAtDiagnosis}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{fh.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* CURRENT BIOMETRICS                                                */}
        {/* ----------------------------------------------------------------- */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 10,
            paddingLeft: 2,
          }}
        >
          Current measurements
        </p>

        <div
          className="animate-fade-in stagger-5"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Weight", value: `${latestBio.weight} kg`, sub: `BMI ${latestBio.bmi}` },
            { label: "Blood pressure", value: latestBio.bloodPressure, sub: "On Enalapril 5mg" },
            { label: "Waist", value: `${latestBio.waist} cm`, sub: "Target: under 88cm" },
            { label: "FINDRISC score", value: `${SCREENING_SCORES.findrisc.score}/26`, sub: "Moderate diabetes risk" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                borderRadius: 14,
                padding: "14px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
                {item.value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Link to blood results */}
        <Link
          href="/smith2/blood-results"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "12px",
            borderRadius: 12,
            background: DOC_COLOR,
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          View detailed blood results <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
