"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RISK_ASSESSMENTS,
  FAMILY_HISTORY,
  SCREENING_SCORES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Users,
  Heart,
  Bone,
  Activity,
} from "lucide-react";

function RiskGauge({
  level,
  color,
  pct,
}: {
  level: string;
  color: string;
  pct: number;
}) {
  return (
    <div className="mt-2">
      <div
        style={{
          position: "relative",
          height: 8,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Zone segments */}
        <div className="flex" style={{ height: "100%", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "#10B981" }} />
          <div style={{ flex: 1, background: "#F59E0B" }} />
          <div style={{ flex: 1, background: "#EF4444" }} />
          <div style={{ flex: 0.5, background: "#991B1B" }} />
        </div>
        {/* Marker */}
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: -3,
            transform: "translateX(-50%)",
            width: 14,
            height: 14,
            borderRadius: 7,
            background: color,
            border: "2px solid #141F2E",
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {["Low", "Moderate", "High", "Very high"].map((l) => (
          <span
            key={l}
            style={{
              color: "#B8C5D6",
              fontSize: 9,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "worsening") return <TrendingUp size={14} style={{ color: "#F59E0B" }} />;
  if (trend === "improving") return <TrendingDown size={14} style={{ color: "#10B981" }} />;
  return <Minus size={14} style={{ color: "#B8C5D6" }} />;
}

function FactorRow({
  factor,
}: {
  factor: { name: string; changeable: boolean; impact: string };
}) {
  const impactColors: Record<string, string> = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#B8C5D6",
    positive: "#10B981",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {factor.changeable ? (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: "#7C3AED",
            }}
          />
        ) : (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: "#1F2D42",
              border: "1px solid #B8C5D6",
            }}
          />
        )}
        <span
          style={{
            color: "#F5F7FA",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {factor.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="px-2 py-0.5"
          style={{
            color: impactColors[factor.impact],
            fontSize: 11,
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {factor.impact} impact
        </span>
        {factor.changeable && (
          <span
            style={{
              color: "#7C3AED",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            modifiable
          </span>
        )}
      </div>
    </div>
  );
}

export default function RiskPage() {
  const [expandedRisk, setExpandedRisk] = useState<string | null>("diabetes");

  const riskCards = [
    {
      key: "diabetes",
      icon: Activity,
      label: "Type 2 Diabetes",
      data: RISK_ASSESSMENTS.diabetes,
      color: "#F59E0B",
      pct: 45,
    },
    {
      key: "cardiovascular",
      icon: Heart,
      label: "Cardiovascular (heart and stroke)",
      data: RISK_ASSESSMENTS.cardiovascular,
      color: "#10B981",
      pct: 22,
    },
    {
      key: "bone",
      icon: Bone,
      label: "Bone Health",
      data: RISK_ASSESSMENTS.bone,
      color: "#10B981",
      pct: 10,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/smith1"
          className="flex items-center gap-1 mb-4"
          style={{
            color: "#B8C5D6",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <h1
          style={{
            color: "#F5F7FA",
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Risk Models
        </h1>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 14,
            marginTop: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Predictive health risk based on your blood tests, history, and family data
        </p>
      </div>

      {/* Risk cards */}
      <div className="flex flex-col gap-4 mb-8">
        {riskCards.map((card) => {
          const isExpanded = expandedRisk === card.key;
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpandedRisk(isExpanded ? null : card.key)}
                className="w-full p-5 flex items-center justify-between"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${card.color}15`,
                    }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <div className="text-left">
                    <div
                      style={{
                        color: "#F5F7FA",
                        fontSize: 15,
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      }}
                    >
                      {card.label}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        style={{
                          color: card.color,
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        {card.data.riskLabel}
                      </span>
                      <TrendIcon trend={card.data.trend} />
                      <span
                        style={{
                          color: "#B8C5D6",
                          fontSize: 12,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        {card.data.trend}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    style={{
                      color: card.color,
                      fontSize: 22,
                      fontWeight: 700,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    {card.data.tenYearRisk}
                  </div>
                  <div
                    style={{
                      color: "#B8C5D6",
                      fontSize: 10,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    10-year risk
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5" style={{ borderTop: "1px solid #1F2D42" }}>
                  <div className="pt-4">
                    <RiskGauge level={card.data.riskLevel} color={card.color} pct={card.pct} />

                    <p
                      className="mt-4"
                      style={{
                        color: "#B8C5D6",
                        fontSize: 13,
                        lineHeight: 1.6,
                        margin: 0,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {card.data.summary}
                    </p>

                    {/* Key factors */}
                    <div className="mt-4">
                      <div
                        className="flex items-center gap-2 mb-2"
                        style={{
                          color: "#F5F7FA",
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        Key Factors
                      </div>
                      <div
                        className="flex items-center gap-3 mb-2"
                        style={{ fontSize: 10, color: "#B8C5D6" }}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              background: "#7C3AED",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                            }}
                          >
                            You can change this
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              background: "#1F2D42",
                              border: "1px solid #B8C5D6",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                            }}
                          >
                            Not modifiable
                          </span>
                        </div>
                      </div>
                      {card.data.keyFactors.map((f) => (
                        <FactorRow key={f.name} factor={f} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Metabolic Syndrome */}
      <div
        className="p-5 mb-6"
        style={{
          background: "#141F2E",
          borderRadius: 12,
          border: "1px solid #1F2D42",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              color: "#F5F7FA",
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Metabolic Syndrome Check
          </h2>
          <span
            className="px-2 py-1"
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              color: "#F59E0B",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            {RISK_ASSESSMENTS.metabolicSyndrome.metCount}/5 criteria met
          </span>
        </div>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 13,
            margin: 0,
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Metabolic syndrome is diagnosed when 3 or more of the 5 criteria are met. You currently meet 2.
        </p>
        <div className="flex flex-col gap-2">
          {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
            <div
              key={c.name}
              className="flex items-start gap-3 p-3"
              style={{
                background: c.met ? "rgba(245, 158, 11, 0.06)" : "rgba(16, 185, 129, 0.04)",
                borderRadius: 8,
              }}
            >
              {c.met ? (
                <AlertTriangle size={14} style={{ color: "#F59E0B", marginTop: 2, flexShrink: 0 }} />
              ) : (
                <CheckCircle size={14} style={{ color: "#10B981", marginTop: 2, flexShrink: 0 }} />
              )}
              <div className="flex-1">
                <div
                  style={{
                    color: "#F5F7FA",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    color: "#B8C5D6",
                    fontSize: 12,
                    marginTop: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  Your value: {c.value} - {c.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family History */}
      <div
        className="p-5 mb-6"
        style={{
          background: "#141F2E",
          borderRadius: 12,
          border: "1px solid #1F2D42",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} style={{ color: "#7C3AED" }} />
          <h2
            style={{
              color: "#F5F7FA",
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Family History
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {FAMILY_HISTORY.map((f) => (
            <div
              key={`${f.relative}-${f.condition}`}
              className="flex items-center justify-between p-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
              }}
            >
              <div>
                <span
                  style={{
                    color: "#F5F7FA",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {f.relative}
                </span>
                <span
                  style={{
                    color: "#B8C5D6",
                    fontSize: 12,
                    marginLeft: 8,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {f.condition}
                </span>
              </div>
              <span
                style={{
                  color: "#B8C5D6",
                  fontSize: 12,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                Age {f.ageAtDiagnosis}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Screening Scores */}
      <div
        className="p-5"
        style={{
          background: "#141F2E",
          borderRadius: 12,
          border: "1px solid #1F2D42",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <h2
          style={{
            color: "#F5F7FA",
            fontSize: 16,
            fontWeight: 600,
            margin: 0,
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Screening Scores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "FINDRISC (diabetes risk screening)",
              score: SCREENING_SCORES.findrisc.score,
              max: SCREENING_SCORES.findrisc.maxScore,
              level: SCREENING_SCORES.findrisc.level,
              color: "#F59E0B",
            },
            {
              label: "PHQ-9 (depression screening)",
              score: SCREENING_SCORES.phq9.score,
              max: SCREENING_SCORES.phq9.maxScore,
              level: SCREENING_SCORES.phq9.level,
              color: "#10B981",
              note: SCREENING_SCORES.phq9.interpretation,
            },
            {
              label: "GAD-7 (anxiety screening)",
              score: SCREENING_SCORES.gad7.score,
              max: SCREENING_SCORES.gad7.maxScore,
              level: SCREENING_SCORES.gad7.level,
              color: "#10B981",
              note: SCREENING_SCORES.gad7.interpretation,
            },
            {
              label: "AUDIT-C (alcohol use screening)",
              score: SCREENING_SCORES.auditC.score,
              max: SCREENING_SCORES.auditC.maxScore,
              level: SCREENING_SCORES.auditC.level,
              color: "#10B981",
              note: SCREENING_SCORES.auditC.interpretation,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="p-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  color: "#F5F7FA",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {s.label}
              </div>
              <div className="flex items-end gap-1">
                <span
                  style={{
                    color: s.color,
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  }}
                >
                  {s.score}
                </span>
                <span
                  style={{
                    color: "#B8C5D6",
                    fontSize: 12,
                    marginBottom: 2,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  / {s.max}
                </span>
              </div>
              {/* Score bar */}
              <div
                className="mt-2"
                style={{
                  height: 4,
                  background: "#1F2D42",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(s.score / s.max) * 100}%`,
                    height: "100%",
                    background: s.color,
                    borderRadius: 2,
                  }}
                />
              </div>
              {s.note && (
                <div
                  className="mt-2"
                  style={{
                    color: "#B8C5D6",
                    fontSize: 11,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {s.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
