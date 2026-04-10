"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Shield, Heart, Droplets, Activity,
  TrendingUp, AlertTriangle, CheckCircle, Info,
  ChevronDown, ChevronUp,
} from "lucide-react";
import {
  RISK_ASSESSMENTS, SCREENING_SCORES, FAMILY_HISTORY,
} from "@/lib/v2/mock-patient";

const HEALTHCARE_BLUE = "#1862a5";
const HEALTHCARE_BLUE_LIGHT = "#e8f0fb";
const HEALTHCARE_BLUE_DARK = "#0f4c81";
const WARM_BG = "#f7f8fa";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_SECONDARY = "#4a5568";
const TEXT_MUTED = "#718096";
const BORDER_COLOR = "#e2e8f0";
const SUCCESS_GREEN = "#16a34a";
const WARNING_AMBER = "#d97706";
const RISK_RED = "#dc2626";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Risk level zone bar
function RiskZoneBar({ level }: { level: string }) {
  const zones = [
    { id: "low", label: "Lag", color: "#16a34a" },
    { id: "low_moderate", label: "Lag-mattlig", color: "#d97706" },
    { id: "moderate", label: "Mattlig", color: "#ea580c" },
    { id: "high", label: "Hog", color: "#dc2626" },
    { id: "very_high", label: "Mycket hog", color: "#991b1b" },
  ];

  const activeIndex = zones.findIndex((z) => z.id === level);

  return (
    <div style={{ margin: "16px 0 8px" }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
        {zones.map((zone, i) => (
          <div
            key={zone.id}
            style={{
              flex: 1,
              height: 10,
              borderRadius: 5,
              background: zone.color,
              opacity: i === activeIndex ? 1 : 0.2,
              position: "relative",
              transition: "opacity 0.3s",
            }}
          >
            {i === activeIndex && (
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: `8px solid ${zone.color}`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: TEXT_MUTED }}>
        <span>Lag</span>
        <span>Hog</span>
      </div>
    </div>
  );
}

// Screening score bar
function ScoreBar({
  score,
  maxScore,
  level,
  label,
}: {
  score: number;
  maxScore: number;
  level: string;
  label: string;
}) {
  const pct = (score / maxScore) * 100;
  const color =
    level === "minimal" || level === "low_risk" || level === "low"
      ? SUCCESS_GREEN
      : level === "moderate" || level === "low_moderate"
      ? WARNING_AMBER
      : RISK_RED;

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 14,
          color: TEXT_SECONDARY,
        }}
      >
        <span>{label}</span>
        <span style={{ fontWeight: 600, color }}>
          {score}/{maxScore}
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

// Factor impact row
function FactorRow({
  factor,
}: {
  factor: {
    name: string;
    changeable: boolean;
    impact: string;
  };
}) {
  const impactColors: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: "#fef2f2", text: RISK_RED, label: "Stor paverkan" },
    medium: { bg: "#fffbeb", text: WARNING_AMBER, label: "Mattlig paverkan" },
    low: { bg: "#f1f5f9", text: TEXT_MUTED, label: "Liten paverkan" },
    positive: { bg: "#ecfdf5", text: SUCCESS_GREEN, label: "Skyddsfaktor" },
  };

  const impact = impactColors[factor.impact] || impactColors.low;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: factor.changeable ? "#eef4ff" : "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {factor.changeable ? (
            <TrendingUp size={14} color={HEALTHCARE_BLUE} />
          ) : (
            <Info size={14} color={TEXT_MUTED} />
          )}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY }}>
            {factor.name}
          </div>
          <div style={{ fontSize: 13, color: TEXT_MUTED }}>
            {factor.changeable ? "Paverkbar" : "Ej paverkbar"}
          </div>
        </div>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: impact.text,
          background: impact.bg,
          padding: "3px 10px",
          borderRadius: 10,
        }}
      >
        {impact.label}
      </span>
    </div>
  );
}

export default function Smith6Riskbedomning() {
  const [expandedRisk, setExpandedRisk] = useState<string | null>("diabetes");
  const [showScreenings, setShowScreenings] = useState(false);

  const risks = [
    {
      id: "diabetes",
      title: "Diabetes (typ 2)",
      plainTitle: "Risk for diabetes (type 2 diabetes)",
      risk: RISK_ASSESSMENTS.diabetes,
      icon: <Droplets size={24} />,
      iconColor: "#ea580c",
      iconBg: "#fff7ed",
    },
    {
      id: "cardiovascular",
      title: "Hjart- och karlsjukdom",
      plainTitle: "Risk for cardiovascular disease (heart attack, stroke)",
      risk: RISK_ASSESSMENTS.cardiovascular,
      icon: <Heart size={24} />,
      iconColor: WARNING_AMBER,
      iconBg: "#fffbeb",
    },
    {
      id: "bone",
      title: "Benhalsa",
      plainTitle: "Risk for bone health problems (osteoporosis)",
      risk: RISK_ASSESSMENTS.bone,
      icon: <Activity size={24} />,
      iconColor: SUCCESS_GREEN,
      iconBg: "#ecfdf5",
    },
  ];

  return (
    <div style={{ background: WARM_BG, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: HEALTHCARE_BLUE,
          color: "white",
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/smith6"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={22} />
          </Link>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Riskbedomning</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Baserat pa dina provsvar, arftlighet och livsstil
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "20px 20px 80px",
        }}
      >
        {/* Explanation banner */}
        <div
          style={{
            background: HEALTHCARE_BLUE_LIGHT,
            border: `1px solid ${HEALTHCARE_BLUE}33`,
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            fontSize: 15,
            color: HEALTHCARE_BLUE_DARK,
            lineHeight: 1.6,
          }}
        >
          Precura analyserar dina blodprover, arftlighet, biometri och
          livsstilsfaktorer for att ge dig en samlad bild av dina halsorisker.
          Riskbedomningarna granskas av din lakare. Risken ar inte ett
          fastsallt ode - livsstilsforandringar kan gora stor skillnad.
        </div>

        {/* Risk cards */}
        {risks.map((riskItem) => {
          const isExpanded = expandedRisk === riskItem.id;
          const r = riskItem.risk;
          const trendStr = r.trend as string;
          const trendLabel =
            trendStr === "worsening"
              ? "Forsamrande trend"
              : trendStr === "improving"
              ? "Forbattrande trend"
              : trendStr === "approaching"
              ? "Narmar sig gransen"
              : "Stabil";
          const trendColor =
            trendStr === "worsening" || trendStr === "approaching"
              ? WARNING_AMBER
              : trendStr === "improving"
              ? SUCCESS_GREEN
              : TEXT_MUTED;

          return (
            <div
              key={riskItem.id}
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              {/* Risk header - always visible */}
              <button
                onClick={() =>
                  setExpandedRisk(isExpanded ? null : riskItem.id)
                }
                style={{
                  width: "100%",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left" as const,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: riskItem.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: riskItem.iconColor,
                  }}
                >
                  {riskItem.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                      marginBottom: 4,
                    }}
                  >
                    {riskItem.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        color:
                          r.riskLevel === "low"
                            ? SUCCESS_GREEN
                            : r.riskLevel === "moderate"
                            ? "#ea580c"
                            : WARNING_AMBER,
                        background:
                          r.riskLevel === "low"
                            ? "#ecfdf5"
                            : r.riskLevel === "moderate"
                            ? "#fff7ed"
                            : "#fffbeb",
                        padding: "3px 10px",
                        borderRadius: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background:
                            r.riskLevel === "low"
                              ? SUCCESS_GREEN
                              : r.riskLevel === "moderate"
                              ? "#ea580c"
                              : WARNING_AMBER,
                        }}
                      />
                      {r.riskLabel}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: trendColor,
                        fontWeight: 500,
                      }}
                    >
                      {trendLabel}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {r.tenYearRisk}
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                    10-arsrisk
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div
                  style={{
                    padding: "0 20px 20px",
                    borderTop: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  {/* Plain name */}
                  <div
                    style={{
                      fontSize: 14,
                      color: TEXT_MUTED,
                      padding: "12px 0 8px",
                      fontStyle: "italic",
                    }}
                  >
                    {riskItem.plainTitle}
                  </div>

                  {/* Risk zone visualization */}
                  <RiskZoneBar level={r.riskLevel} />

                  {/* Summary */}
                  <div
                    style={{
                      fontSize: 15,
                      color: TEXT_SECONDARY,
                      lineHeight: 1.7,
                      padding: "12px 0 16px",
                    }}
                  >
                    {r.summary}
                  </div>

                  {/* Key factors */}
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                      marginBottom: 8,
                    }}
                  >
                    Nyckelfaktorer
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: 10,
                      padding: "4px 16px",
                    }}
                  >
                    {r.keyFactors.map((f, i) => (
                      <div
                        key={f.name}
                        style={{
                          borderBottom:
                            i < r.keyFactors.length - 1
                              ? `1px solid ${BORDER_COLOR}`
                              : "none",
                        }}
                      >
                        <FactorRow factor={f} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Metabolic syndrome status */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: 12,
            padding: "20px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <AlertTriangle size={20} color={WARNING_AMBER} />
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                }}
              >
                Metabolt syndrom
              </div>
              <div style={{ fontSize: 14, color: TEXT_MUTED }}>
                A collection of risk factors that increase heart disease and diabetes risk
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fffbeb",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 15,
              fontWeight: 600,
              color: WARNING_AMBER,
            }}
          >
            {RISK_ASSESSMENTS.metabolicSyndrome.status}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: c.met ? "#fef2f2" : "#f8fafc",
                  border: `1px solid ${c.met ? "#fecaca" : BORDER_COLOR}`,
                }}
              >
                {c.met ? (
                  <AlertTriangle
                    size={18}
                    color={RISK_RED}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                ) : (
                  <CheckCircle
                    size={18}
                    color={SUCCESS_GREEN}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                      marginBottom: 2,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_SECONDARY }}>
                    Ditt varde: {c.value}
                  </div>
                  {c.note && (
                    <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 2 }}>
                      {c.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screening scores */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setShowScreenings(!showScreenings)}
            style={{
              width: "100%",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  textAlign: "left" as const,
                }}
              >
                Screeningresultat
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: TEXT_MUTED,
                  marginTop: 2,
                  textAlign: "left" as const,
                }}
              >
                Standardiserade halsoformular - {formatDate(SCREENING_SCORES.findrisc.date)}
              </div>
            </div>
            {showScreenings ? (
              <ChevronUp size={22} color={TEXT_MUTED} />
            ) : (
              <ChevronDown size={22} color={TEXT_MUTED} />
            )}
          </button>

          {showScreenings && (
            <div
              style={{
                padding: "0 20px 20px",
                borderTop: `1px solid ${BORDER_COLOR}`,
              }}
            >
              <div style={{ paddingTop: 16 }}>
                <ScoreBar
                  score={SCREENING_SCORES.findrisc.score}
                  maxScore={SCREENING_SCORES.findrisc.maxScore}
                  level={SCREENING_SCORES.findrisc.level}
                  label="FINDRISC (diabetes risk screening)"
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <ScoreBar
                  score={SCREENING_SCORES.phq9.score}
                  maxScore={SCREENING_SCORES.phq9.maxScore}
                  level={SCREENING_SCORES.phq9.level}
                  label="PHQ-9 (depression screening)"
                />
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                  {SCREENING_SCORES.phq9.interpretation}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <ScoreBar
                  score={SCREENING_SCORES.gad7.score}
                  maxScore={SCREENING_SCORES.gad7.maxScore}
                  level={SCREENING_SCORES.gad7.level}
                  label="GAD-7 (anxiety screening)"
                />
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                  {SCREENING_SCORES.gad7.interpretation}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <ScoreBar
                  score={SCREENING_SCORES.auditC.score}
                  maxScore={SCREENING_SCORES.auditC.maxScore}
                  level={SCREENING_SCORES.auditC.level}
                  label="AUDIT-C (alcohol use screening)"
                />
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                  {SCREENING_SCORES.auditC.interpretation}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: TEXT_SECONDARY,
                    marginBottom: 8,
                  }}
                >
                  SCORE2 (cardiovascular risk - European model)
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {SCREENING_SCORES.score2.riskPercent}%
                  <span style={{ fontSize: 14, fontWeight: 400, color: TEXT_MUTED }}>
                    10-ars risk
                  </span>
                </div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                  {SCREENING_SCORES.score2.interpretation}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: TEXT_SECONDARY,
                    marginBottom: 8,
                  }}
                >
                  EQ-5D (quality of life)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Rorlighet", score: SCREENING_SCORES.eq5d.mobility },
                    { label: "Hygien", score: SCREENING_SCORES.eq5d.selfCare },
                    { label: "Aktiviteter", score: SCREENING_SCORES.eq5d.activities },
                    { label: "Smarta", score: SCREENING_SCORES.eq5d.pain },
                    { label: "Angest", score: SCREENING_SCORES.eq5d.anxiety },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        background: item.score === 1 ? "#ecfdf5" : "#fffbeb",
                        textAlign: "center" as const,
                      }}
                    >
                      <div style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>
                        {item.score}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8 }}>
                  {SCREENING_SCORES.eq5d.interpretation}. Scale: 1 = no problems, 5 = extreme problems.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
