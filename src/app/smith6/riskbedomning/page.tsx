"use client";

import React from "react";
import {
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  TRAINING_PLAN,
  FAMILY_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Reusable building blocks                                            */
/* ------------------------------------------------------------------ */

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, marginBottom: subtitle ? 4 : 16 }}>{title}</h2>
      {subtitle && <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 16px" }}>{subtitle}</p>}
      {children}
    </section>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #D1E9F6",
        borderRadius: 4,
        boxShadow: "0 1px 2px rgba(13,58,111,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Risk level bar: a segmented zone bar with a marker                  */
/* ------------------------------------------------------------------ */

function RiskBar({ level }: { level: string }) {
  const zones = [
    { label: "Low", color: "#059669", width: 25 },
    { label: "Low-moderate", color: "#0891B2", width: 25 },
    { label: "Moderate", color: "#F59E0B", width: 25 },
    { label: "High", color: "#EF4444", width: 25 },
  ];

  const levelMap: Record<string, number> = {
    low: 12.5,
    low_moderate: 37.5,
    moderate: 62.5,
    high: 87.5,
  };

  const markerPct = levelMap[level] ?? 50;

  return (
    <div style={{ position: "relative", marginTop: 12, marginBottom: 20 }}>
      {/* Segmented bar */}
      <div className="flex" style={{ borderRadius: 4, overflow: "hidden", height: 12 }}>
        {zones.map((z, i) => (
          <div key={i} style={{ width: `${z.width}%`, background: z.color, height: 12 }} />
        ))}
      </div>
      {/* Marker */}
      <div
        style={{
          position: "absolute",
          left: `${markerPct}%`,
          top: -4,
          transform: "translateX(-8px)",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "3px solid #0D3A6F",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between" style={{ marginTop: 8 }}>
        {zones.map((z, i) => (
          <span key={i} style={{ color: "#4B7BA7", fontSize: 14, textAlign: "center", width: `${z.width}%` }}>
            {z.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Factor impact tag                                                   */
/* ------------------------------------------------------------------ */

function FactorTag({ factor }: { factor: { name: string; changeable: boolean; impact: string } }) {
  const impactColor: Record<string, { bg: string; text: string }> = {
    high: { bg: "#FEE2E2", text: "#EF4444" },
    medium: { bg: "#FEF3C7", text: "#F59E0B" },
    low: { bg: "#E0F7FA", text: "#0891B2" },
    positive: { bg: "#F0FDF4", text: "#059669" },
  };
  const colors = impactColor[factor.impact] || impactColor.low;

  return (
    <tr style={{ borderBottom: "1px solid #D1E9F6" }}>
      <td style={{ padding: "12px 24px", color: "#0D3A6F", fontSize: 16 }}>{factor.name}</td>
      <td style={{ padding: "12px 24px", textAlign: "center" }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
            background: colors.bg,
            padding: "2px 10px",
            borderRadius: 4,
          }}
        >
          {factor.impact === "positive" ? "Protective" : factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1) + " impact"}
        </span>
      </td>
      <td style={{ padding: "12px 24px", textAlign: "center" }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: factor.changeable ? "#059669" : "#4B7BA7",
            background: factor.changeable ? "#F0FDF4" : "#EDF2F7",
            padding: "2px 10px",
            borderRadius: 4,
          }}
        >
          {factor.changeable ? "Modifiable" : "Non-modifiable"}
        </span>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Screening score bar                                                 */
/* ------------------------------------------------------------------ */

function ScoreBar({ score, maxScore, color }: { score: number; maxScore: number; color: string }) {
  const pct = (score / maxScore) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 8, background: "#EDF2F7", borderRadius: 4 }}>
        <div style={{ width: `${pct}%`, height: 8, background: color, borderRadius: 4 }} />
      </div>
      <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 700, minWidth: 60, textAlign: "right" }}>
        {score}/{maxScore}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RiskbedomningPage() {
  const glucoseHistory = getMarkerHistory("f-Glucose");

  return (
    <>
      <h1 style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Riskbedomning (Risk assessment)
      </h1>
      <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 32px" }}>
        Multi-model risk analysis based on blood tests, biometrics, family history, and validated screening tools. Last updated March 2026.
      </p>

      {/* ============================================================ */}
      {/* DIABETES RISK                                                 */}
      {/* ============================================================ */}
      <Section title="Type 2 diabetes risk">
        <Card style={{ padding: 24 }}>
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 8 }}>
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#F59E0B",
                  background: "#FEF3C7",
                  padding: "4px 12px",
                  borderRadius: 4,
                }}
              >
                {RISK_ASSESSMENTS.diabetes.riskLabel}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#EF4444",
                  background: "#FEE2E2",
                  padding: "4px 12px",
                  borderRadius: 4,
                }}
              >
                Trend: worsening
              </span>
            </div>
            <span style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700 }}>
              10-year risk: {RISK_ASSESSMENTS.diabetes.tenYearRisk}
            </span>
          </div>

          <RiskBar level="moderate" />

          <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: "0 0 20px" }}>
            {RISK_ASSESSMENTS.diabetes.summary}
          </p>

          {/* Glucose trend detail */}
          <div
            style={{
              background: "#FEF3C7",
              border: "1px solid #F59E0B",
              borderRadius: 4,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <p style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
              Fasting glucose (blood sugar) trend over 5 years
            </p>
            <div className="flex flex-wrap gap-4">
              {glucoseHistory.map((reading, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 2px" }}>{reading.value}</p>
                  <p style={{ color: "#4B7BA7", fontSize: 14, margin: 0 }}>{reading.date.slice(0, 7)}</p>
                </div>
              ))}
            </div>
            <p style={{ color: "#4B7BA7", fontSize: 14, margin: "8px 0 0" }}>
              mmol/L. Normal range: 3.9-6.0. Pre-diabetic threshold: 6.1
            </p>
          </div>

          {/* Key factors table */}
          <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>Contributing factors</h3>
          <div style={{ border: "1px solid #D1E9F6", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Factor</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Impact</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {RISK_ASSESSMENTS.diabetes.keyFactors.map((f, i) => (
                  <FactorTag key={i} factor={f} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* ============================================================ */}
      {/* CARDIOVASCULAR RISK                                           */}
      {/* ============================================================ */}
      <Section title="Cardiovascular risk (heart and blood vessels)">
        <Card style={{ padding: 24 }}>
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 8 }}>
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0891B2",
                  background: "#E0F7FA",
                  padding: "4px 12px",
                  borderRadius: 4,
                }}
              >
                {RISK_ASSESSMENTS.cardiovascular.riskLabel}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#059669",
                  background: "#F0FDF4",
                  padding: "4px 12px",
                  borderRadius: 4,
                }}
              >
                Trend: stable
              </span>
            </div>
            <span style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700 }}>
              10-year risk: {RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
            </span>
          </div>

          <RiskBar level="low_moderate" />

          <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: "0 0 20px" }}>
            {RISK_ASSESSMENTS.cardiovascular.summary}
          </p>

          <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>Contributing factors</h3>
          <div style={{ border: "1px solid #D1E9F6", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Factor</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Impact</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {RISK_ASSESSMENTS.cardiovascular.keyFactors.map((f, i) => (
                  <FactorTag key={i} factor={f} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* ============================================================ */}
      {/* BONE HEALTH                                                   */}
      {/* ============================================================ */}
      <Section title="Bone health risk">
        <Card style={{ padding: 24 }}>
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 8 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#059669",
                background: "#F0FDF4",
                padding: "4px 12px",
                borderRadius: 4,
              }}
            >
              {RISK_ASSESSMENTS.bone.riskLabel}
            </span>
            <span style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700 }}>
              10-year risk: {RISK_ASSESSMENTS.bone.tenYearRisk}
            </span>
          </div>

          <RiskBar level="low" />

          <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: "0 0 16px" }}>
            {RISK_ASSESSMENTS.bone.summary}
          </p>

          <div style={{ border: "1px solid #D1E9F6", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Factor</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Impact</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {RISK_ASSESSMENTS.bone.keyFactors.map((f, i) => (
                  <FactorTag key={i} factor={f} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* ============================================================ */}
      {/* METABOLIC SYNDROME                                            */}
      {/* ============================================================ */}
      <Section title="Metabolic syndrome assessment">
        <Card style={{ padding: 24 }}>
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#F59E0B",
                background: "#FEF3C7",
                padding: "4px 12px",
                borderRadius: 4,
              }}
            >
              {RISK_ASSESSMENTS.metabolicSyndrome.status}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#EF4444",
                background: "#FEE2E2",
                padding: "4px 12px",
                borderRadius: 4,
              }}
            >
              Trend: approaching threshold
            </span>
          </div>

          <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: "0 0 20px" }}>
            Metabolic syndrome is diagnosed when 3 of 5 criteria are met. You currently meet {RISK_ASSESSMENTS.metabolicSyndrome.metCount} of 5.
            Your waist circumference is close to the third threshold.
          </p>

          <div style={{ border: "1px solid #D1E9F6", borderRadius: 4, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Criterion</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Your value</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "center" }}>Met?</th>
                  <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < RISK_ASSESSMENTS.metabolicSyndrome.criteria.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                    <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{c.name}</td>
                    <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 700, textAlign: "right" }}>{c.value}</td>
                    <td style={{ padding: "14px 24px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background: c.met ? "#FEE2E2" : "#F0FDF4",
                          color: c.met ? "#EF4444" : "#059669",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "24px",
                          textAlign: "center",
                        }}
                      >
                        {c.met ? "Y" : "N"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* ============================================================ */}
      {/* SCREENING SCORES                                              */}
      {/* ============================================================ */}
      <Section title="Validated screening tools" subtitle="Standardized questionnaires completed March 2026">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}>
          {/* FINDRISC */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>FINDRISC</h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 12px" }}>Finnish Diabetes Risk Score (diabetes screening)</p>
            <ScoreBar score={SCREENING_SCORES.findrisc.score} maxScore={SCREENING_SCORES.findrisc.maxScore} color="#F59E0B" />
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: "8px 0 0" }}>
              Score of {SCREENING_SCORES.findrisc.score} indicates moderate risk. Scores 12-14 carry roughly 1 in 6 chance of developing diabetes within 10 years.
            </p>
          </Card>

          {/* SCORE2 */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>SCORE2</h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 12px" }}>European cardiovascular risk model</p>
            <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
              <span style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700 }}>{SCREENING_SCORES.score2.riskPercent}%</span>
              <span style={{ color: "#4B7BA7", fontSize: 16 }}>10-year fatal/non-fatal CVD risk</span>
            </div>
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: 0 }}>{SCREENING_SCORES.score2.interpretation}</p>
          </Card>

          {/* PHQ-9 */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>PHQ-9</h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 12px" }}>Patient Health Questionnaire (depression screening)</p>
            <ScoreBar score={SCREENING_SCORES.phq9.score} maxScore={SCREENING_SCORES.phq9.maxScore} color="#059669" />
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: "8px 0 0" }}>{SCREENING_SCORES.phq9.interpretation}</p>
          </Card>

          {/* GAD-7 */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>GAD-7</h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 12px" }}>Generalized Anxiety Disorder scale (anxiety screening)</p>
            <ScoreBar score={SCREENING_SCORES.gad7.score} maxScore={SCREENING_SCORES.gad7.maxScore} color="#059669" />
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: "8px 0 0" }}>{SCREENING_SCORES.gad7.interpretation}</p>
          </Card>

          {/* AUDIT-C */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>AUDIT-C</h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 12px" }}>Alcohol Use Disorders Identification Test</p>
            <ScoreBar score={SCREENING_SCORES.auditC.score} maxScore={SCREENING_SCORES.auditC.maxScore} color="#059669" />
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: "8px 0 0" }}>{SCREENING_SCORES.auditC.interpretation}</p>
          </Card>

          {/* EQ-5D */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>EQ-5D</h3>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 12px" }}>Quality of life assessment (5 dimensions)</p>
            <div style={{ border: "1px solid #D1E9F6", borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    { dim: "Mobility", score: SCREENING_SCORES.eq5d.mobility },
                    { dim: "Self-care", score: SCREENING_SCORES.eq5d.selfCare },
                    { dim: "Usual activities", score: SCREENING_SCORES.eq5d.activities },
                    { dim: "Pain / discomfort", score: SCREENING_SCORES.eq5d.pain },
                    { dim: "Anxiety / depression", score: SCREENING_SCORES.eq5d.anxiety },
                  ].map((row, i, arr) => (
                    <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                      <td style={{ padding: "10px 16px", color: "#0D3A6F", fontSize: 16 }}>{row.dim}</td>
                      <td style={{ padding: "10px 16px", textAlign: "right" }}>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: row.score === 1 ? "#059669" : row.score === 2 ? "#F59E0B" : "#EF4444",
                            background: row.score === 1 ? "#F0FDF4" : row.score === 2 ? "#FEF3C7" : "#FEE2E2",
                            padding: "2px 10px",
                            borderRadius: 4,
                          }}
                        >
                          {row.score === 1 ? "No problems" : row.score === 2 ? "Some problems" : "Severe"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: "8px 0 0" }}>{SCREENING_SCORES.eq5d.interpretation}</p>
          </Card>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* FAMILY HISTORY                                                */}
      {/* ============================================================ */}
      <Section title="Family history impact" subtitle="How your genetic background affects your risk profile">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Relative</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Condition</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Their age at diagnosis</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Relevant to your risk</th>
              </tr>
            </thead>
            <tbody>
              {FAMILY_HISTORY.map((f, i) => {
                const relevance = f.condition.toLowerCase().includes("diabetes")
                  ? "Diabetes (type 2)"
                  : f.condition.toLowerCase().includes("infarction") || f.condition.toLowerCase().includes("stroke")
                  ? "Cardiovascular"
                  : "General";
                return (
                  <tr key={i} style={{ borderBottom: i < FAMILY_HISTORY.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                    <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 600 }}>{f.relative}</td>
                    <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{f.condition}</td>
                    <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 700, textAlign: "right" }}>{f.ageAtDiagnosis}</td>
                    <td style={{ padding: "14px 24px" }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: relevance === "Diabetes (type 2)" ? "#F59E0B" : relevance === "Cardiovascular" ? "#0891B2" : "#4B7BA7",
                          background: relevance === "Diabetes (type 2)" ? "#FEF3C7" : relevance === "Cardiovascular" ? "#E0F7FA" : "#EDF2F7",
                          padding: "2px 10px",
                          borderRadius: 4,
                        }}
                      >
                        {relevance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* ============================================================ */}
      {/* TRAINING PLAN                                                 */}
      {/* ============================================================ */}
      <Section title="Training plan (personalized for your risks)" subtitle="Designed to target insulin sensitivity, weight management, and cardiovascular fitness">
        <Card style={{ padding: 24 }}>
          <div className="flex items-start justify-between flex-wrap gap-4" style={{ marginBottom: 16 }}>
            <div>
              <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                {TRAINING_PLAN.name}
              </p>
              <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 4px" }}>
                Created by {TRAINING_PLAN.createdBy}
              </p>
              <p style={{ color: "#4B7BA7", fontSize: 16, margin: 0 }}>
                Reviewed by {TRAINING_PLAN.reviewedBy}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
                Week {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks}
              </p>
              <p style={{ color: "#059669", fontSize: 16, fontWeight: 500, margin: 0 }}>
                {TRAINING_PLAN.totalCompleted} total sessions completed
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: "#EDF2F7", borderRadius: 4, height: 8, marginBottom: 24 }}>
            <div
              style={{
                background: "#0891B2",
                borderRadius: 4,
                height: 8,
                width: `${(TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100}%`,
              }}
            />
          </div>

          {/* Goal */}
          <div
            style={{
              background: "#EDF2F7",
              border: "1px solid #D1E9F6",
              borderRadius: 4,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <p style={{ color: "#4B7BA7", fontSize: 14, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>
              Goal
            </p>
            <p style={{ color: "#0D3A6F", fontSize: 16, margin: 0 }}>
              {TRAINING_PLAN.goal}
            </p>
          </div>

          {/* Weekly schedule with exercise details */}
          {TRAINING_PLAN.weeklySchedule.map((day, di) => (
            <div key={di} style={{ marginBottom: di < TRAINING_PLAN.weeklySchedule.length - 1 ? 20 : 0 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: 0 }}>
                  {day.day} - {day.name}
                </h3>
                {di < TRAINING_PLAN.completedThisWeek && (
                  <span style={{ color: "#059669", fontSize: 14, fontWeight: 600, background: "#F0FDF4", padding: "2px 10px", borderRadius: 4 }}>
                    Completed
                  </span>
                )}
              </div>
              <div style={{ border: "1px solid #D1E9F6", borderRadius: 4, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                      <th style={{ padding: "8px 16px", color: "#4B7BA7", fontSize: 14, fontWeight: 600, textAlign: "left" }}>Exercise</th>
                      <th style={{ padding: "8px 16px", color: "#4B7BA7", fontSize: 14, fontWeight: 600, textAlign: "right" }}>Sets</th>
                      <th style={{ padding: "8px 16px", color: "#4B7BA7", fontSize: 14, fontWeight: 600, textAlign: "right" }}>Reps</th>
                      <th style={{ padding: "8px 16px", color: "#4B7BA7", fontSize: 14, fontWeight: 600, textAlign: "right" }}>Weight</th>
                      <th style={{ padding: "8px 16px", color: "#4B7BA7", fontSize: 14, fontWeight: 600, textAlign: "left" }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.exercises.map((ex, ei) => (
                      <tr key={ei} style={{ borderBottom: ei < day.exercises.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                        <td style={{ padding: "10px 16px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{ex.name}</td>
                        <td style={{ padding: "10px 16px", color: "#0D3A6F", fontSize: 16, textAlign: "right" }}>{ex.sets}</td>
                        <td style={{ padding: "10px 16px", color: "#0D3A6F", fontSize: 16, textAlign: "right" }}>{ex.reps} {ex.unit}</td>
                        <td style={{ padding: "10px 16px", color: "#0D3A6F", fontSize: 16, fontWeight: 600, textAlign: "right" }}>
                          {ex.weight ? `${ex.weight} kg` : "-"}
                        </td>
                        <td style={{ padding: "10px 16px", color: "#4B7BA7", fontSize: 16 }}>{ex.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Medical considerations */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #D1E9F6" }}>
            <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>
              Medical considerations for this plan
            </h3>
            <ul style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
              {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{note}</li>
              ))}
            </ul>
          </div>
        </Card>
      </Section>
    </>
  );
}
