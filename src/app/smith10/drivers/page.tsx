"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  Scale,
  Heart,
  Pill,
} from "lucide-react";
import {
  PATIENT,
  RISK_ASSESSMENTS,
  FAMILY_HISTORY,
  BIOMETRICS_HISTORY,
  SCREENING_SCORES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// WHAT'S DRIVING YOUR TRAJECTORY
// ============================================================================

const diabetesRisk = RISK_ASSESSMENTS.diabetes;
const metSyndrome = RISK_ASSESSMENTS.metabolicSyndrome;
const latestBio = BIOMETRICS_HISTORY[0];

// Risk factors organized by impact and changeability
const riskFactors = [
  {
    name: "Fasting glucose trend",
    description:
      "Rising from 5.0 to 5.8 mmol/L over 5 years. Approaching the 6.1 threshold for impaired fasting glucose.",
    changeable: true,
    impact: "high" as const,
    icon: <TrendingUp size={18} />,
    current: "5.8 mmol/L",
    target: "< 5.6 mmol/L",
    progress: null as number | null,
  },
  {
    name: "Family history",
    description:
      "Mother diagnosed with type 2 diabetes at 58. Maternal grandmother at 62. Two first-degree relatives with T2D significantly increases your risk.",
    changeable: false,
    impact: "high" as const,
    icon: <Users size={18} />,
    current: "2 relatives with T2D",
    target: null,
    progress: null,
  },
  {
    name: "Activity level",
    description:
      "Currently training 3x per week on your Metabolic Health Program. Post-meal walks help blood sugar regulation. Consistency is key.",
    changeable: true,
    impact: "medium" as const,
    icon: <Activity size={18} />,
    current: "3 sessions/week",
    target: "3 sessions + daily walks",
    progress: 70,
  },
  {
    name: "Weight and waist circumference",
    description: `BMI ${latestBio.bmi} (overweight range). Waist ${latestBio.waist} cm - approaching the 88 cm threshold for metabolic syndrome in women.`,
    changeable: true,
    impact: "medium" as const,
    icon: <Scale size={18} />,
    current: `${latestBio.weight} kg / ${latestBio.waist} cm waist`,
    target: "< 75 kg / < 84 cm waist",
    progress: 40,
  },
  {
    name: "Blood pressure",
    description:
      "Mild hypertension controlled with Enalapril 5mg. Blood pressure is a metabolic syndrome criterion and cardiovascular risk factor.",
    changeable: true,
    impact: "low" as const,
    icon: <Heart size={18} />,
    current: latestBio.bloodPressure + " (on medication)",
    target: "< 130/85",
    progress: 60,
  },
];

function impactColor(impact: string) {
  if (impact === "high") return { bg: "#ffebee", text: "#c62828", label: "High impact" };
  if (impact === "medium") return { bg: "#fff8e1", text: "#e65100", label: "Medium impact" };
  if (impact === "positive") return { bg: "#e8f5e9", text: "#2e7d32", label: "Protective" };
  return { bg: "#f1f3f5", text: "#555770", label: "Lower impact" };
}

export default function DriversPage() {
  const changeableFactors = riskFactors.filter((f) => f.changeable);
  const fixedFactors = riskFactors.filter((f) => !f.changeable);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link
          href="/smith10"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#f1f3f5",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} color="#555770" />
        </Link>
        <span
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#1a1a2e",
          }}
        >
          What&apos;s driving your trajectory
        </span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Summary */}
        <div style={{ padding: "24px 0 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              background: "#fff8e1",
              borderRadius: 14,
              border: "1px solid #ffe0b2",
            }}
          >
            <AlertTriangle
              size={20}
              color="#e65100"
              style={{ flexShrink: 0 }}
            />
            <div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  margin: "0 0 2px",
                }}
              >
                {diabetesRisk.tenYearRisk} estimated 10-year diabetes risk
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#555770",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Moderate risk, and it&apos;s getting worse. But 3 of your 5 key
                risk factors are things you can change.
              </p>
            </div>
          </div>
        </div>

        {/* Metabolic syndrome status */}
        <div style={{ margin: "24px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8b8da3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            Metabolic syndrome check
          </h2>
          <div
            style={{
              padding: "16px 20px",
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#e65100",
                }}
              >
                {metSyndrome.metCount}
              </span>
              <span style={{ fontSize: 14, color: "#8b8da3" }}>of</span>
              <span
                style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e" }}
              >
                {metSyndrome.threshold}
              </span>
              <span style={{ fontSize: 14, color: "#8b8da3" }}>
                criteria needed for diagnosis
              </span>
            </div>

            {metSyndrome.criteria.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 0",
                  borderTop: i === 0 ? "none" : "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: c.met ? "#ffebee" : "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {c.met ? (
                    <X size={12} color="#c62828" strokeWidth={3} />
                  ) : (
                    <Check size={12} color="#2e7d32" strokeWidth={3} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: c.met ? "#c62828" : "#1a1a2e",
                      margin: "0 0 2px",
                    }}
                  >
                    {c.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8b8da3",
                      margin: 0,
                    }}
                  >
                    {c.value}
                    {c.note ? ` - ${c.note}` : ""}
                  </p>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                background: "#fff8e1",
                borderRadius: 10,
              }}
            >
              <p style={{ fontSize: 12, color: "#e65100", margin: 0, fontWeight: 500 }}>
                Waist circumference is 2 cm from the threshold. A third
                criterion would mean metabolic syndrome.
              </p>
            </div>
          </div>
        </div>

        {/* Changeable factors */}
        <div style={{ margin: "28px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#2e7d32",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            Things you can change
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {changeableFactors.map((factor, i) => (
              <FactorCard key={i} factor={factor} />
            ))}
          </div>
        </div>

        {/* Fixed factors */}
        <div style={{ margin: "28px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8b8da3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            Things you can&apos;t change
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {fixedFactors.map((factor, i) => (
              <FactorCard key={i} factor={factor} />
            ))}
          </div>
        </div>

        {/* FINDRISC score */}
        <div style={{ margin: "28px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8b8da3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            FINDRISC diabetes risk screening
          </h2>
          <div
            style={{
              padding: "16px 20px",
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <span
                style={{ fontSize: 28, fontWeight: 800, color: "#e65100" }}
              >
                {SCREENING_SCORES.findrisc.score}
              </span>
              <span style={{ fontSize: 14, color: "#8b8da3" }}>
                / {SCREENING_SCORES.findrisc.maxScore}
              </span>
            </div>

            {/* Score bar */}
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "#f1f3f5",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(SCREENING_SCORES.findrisc.score / SCREENING_SCORES.findrisc.maxScore) * 100}%`,
                  borderRadius: 4,
                  background:
                    "linear-gradient(90deg, #e65100, #ff9800)",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#2e7d32" }}>Low risk</span>
              <span style={{ fontSize: 11, color: "#e65100", fontWeight: 600 }}>
                Moderate risk
              </span>
              <span style={{ fontSize: 11, color: "#c62828" }}>High risk</span>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "#8b8da3",
                margin: "10px 0 0",
                lineHeight: 1.5,
              }}
            >
              The Finnish Diabetes Risk Score. Scores 7-11 are slightly elevated,
              12-14 moderate, 15-20 high. A score of 12 means roughly 1 in 6
              chance of developing type 2 diabetes in the next 10 years.
            </p>
          </div>
        </div>

        {/* Link to bend page */}
        <Link
          href="/smith10/bend"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            margin: "28px 0 0",
            padding: "16px",
            background: "#1a1a2e",
            color: "#fff",
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          How to bend the curve
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// Factor card component
function FactorCard({
  factor,
}: {
  factor: {
    name: string;
    description: string;
    changeable: boolean;
    impact: string;
    icon: React.ReactNode;
    current: string;
    target: string | null;
    progress: number | null;
  };
}) {
  const impactStyle = impactColor(factor.impact);

  return (
    <div
      style={{
        padding: "16px 18px",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: impactStyle.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: impactStyle.text,
            }}
          >
            {factor.icon}
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#1a1a2e",
              margin: 0,
            }}
          >
            {factor.name}
          </p>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: impactStyle.text,
            background: impactStyle.bg,
            padding: "3px 8px",
            borderRadius: 6,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          {impactStyle.label}
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#555770",
          margin: "0 0 12px",
          lineHeight: 1.5,
        }}
      >
        {factor.description}
      </p>

      {/* Current vs target */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 120,
            padding: "8px 12px",
            background: "#f8f9fa",
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "#8b8da3",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              margin: "0 0 2px",
            }}
          >
            Current
          </p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1a1a2e",
              margin: 0,
            }}
          >
            {factor.current}
          </p>
        </div>
        {factor.target && (
          <div
            style={{
              flex: 1,
              minWidth: 120,
              padding: "8px 12px",
              background: "#e8f5e9",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#2e7d32",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                margin: "0 0 2px",
              }}
            >
              Target
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2e7d32",
                margin: 0,
              }}
            >
              {factor.target}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {factor.progress !== null && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: "#f1f3f5",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${factor.progress}%`,
                borderRadius: 2,
                background:
                  factor.progress >= 70
                    ? "#2e7d32"
                    : factor.progress >= 40
                      ? "#e65100"
                      : "#c62828",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
