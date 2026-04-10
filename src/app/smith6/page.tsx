"use client";

import React from "react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  CONDITIONS,
  MEDICATIONS,
  BIOMETRICS_HISTORY,
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  MESSAGES,
  TRAINING_PLAN,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Reusable styled building blocks                                     */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{title}</h2>
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
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "normal" ? "#059669" : status === "borderline" ? "#F59E0B" : "#EF4444";
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: 2,
        background: color,
        marginRight: 8,
        flexShrink: 0,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Tiny inline sparkline (CSS only)                                    */
/* ------------------------------------------------------------------ */

function Sparkline({ values, danger }: { values: number[]; danger?: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 80;
    const y = 24 - ((v - min) / range) * 20;
    return `${x},${y}`;
  });
  const color = danger ? "#EF4444" : "#0891B2";
  return (
    <svg width={80} height={28} viewBox="0 0 80 28" style={{ display: "block" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={80} cy={24 - ((values[values.length - 1] - min) / range) * 20} r={3} fill={color} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function OversiktPage() {
  const latestBio = BIOMETRICS_HISTORY[0];
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const cholesterolHistory = getMarkerHistory("TC");
  const latestMessage = MESSAGES[MESSAGES.length - 1];

  // Find borderline/abnormal markers from latest test
  const flaggedMarkers = latestBlood.results.filter(
    (r) => r.status === "borderline" || r.status === "abnormal"
  );

  return (
    <>
      {/* Welcome banner */}
      <Card style={{ marginBottom: 32 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              Hej, {PATIENT.firstName}
            </h1>
            <p style={{ color: "#4B7BA7", fontSize: 18, margin: 0 }}>
              Member since {new Date(PATIENT.memberSince).toLocaleDateString("sv-SE")} / {PATIENT.vardcentral}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 4px" }}>Next blood test</p>
            <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: 0 }}>
              {new Date(PATIENT.nextBloodTest).toLocaleDateString("sv-SE")}
            </p>
          </div>
        </div>
      </Card>

      {/* Doctor's latest note - the key insight */}
      <Section title="Latest from your doctor">
        <Card>
          <div className="flex items-start gap-3" style={{ marginBottom: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                background: "#D1E9F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0D3A6F",
                fontWeight: 600,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              MJ
            </div>
            <div>
              <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: 0 }}>
                {DOCTOR_NOTES[0].author}
              </p>
              <p style={{ color: "#4B7BA7", fontSize: 16, margin: 0 }}>
                {DOCTOR_NOTES[0].type} - {new Date(DOCTOR_NOTES[0].date).toLocaleDateString("sv-SE")}
              </p>
            </div>
          </div>
          <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            {DOCTOR_NOTES[0].note.split("\n\n")[0]}
          </p>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #D1E9F6" }}>
            <p style={{ color: "#4B7BA7", fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
              Recommendations:
            </p>
            <ul style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
              <li>Continue training plan targeting metabolic health</li>
              <li>Vitamin D3 supplement, 2000 IU daily</li>
              <li>Retest comprehensive blood panel in September 2026</li>
              <li>Consider OGTT if fasting glucose continues to rise</li>
            </ul>
          </div>
        </Card>
      </Section>

      {/* Flagged markers from latest blood test */}
      <Section title="Items needing attention">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {flaggedMarkers.map((marker) => {
            const history = getMarkerHistory(marker.shortName);
            const values = history.map((h) => h.value);
            const isRising = values.length >= 2 && values[values.length - 1] > values[values.length - 2];
            return (
              <Card key={marker.shortName}>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <div className="flex items-center">
                    <StatusDot status={marker.status} />
                    <span style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600 }}>
                      {marker.plainName}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: marker.status === "borderline" ? "#F59E0B" : "#EF4444",
                      background: marker.status === "borderline" ? "#FEF3C7" : "#FEE2E2",
                      padding: "2px 10px",
                      borderRadius: 4,
                    }}
                  >
                    {marker.status === "borderline" ? "Borderline" : "Abnormal"}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700, margin: 0 }}>
                      {marker.value} <span style={{ fontSize: 16, fontWeight: 400, color: "#4B7BA7" }}>{marker.unit}</span>
                    </p>
                    <p style={{ color: "#4B7BA7", fontSize: 16, margin: "4px 0 0" }}>
                      Reference: {marker.refLow}-{marker.refHigh} {marker.unit}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Sparkline values={values} danger={isRising} />
                    <p style={{ color: isRising ? "#EF4444" : "#4B7BA7", fontSize: 14, margin: "4px 0 0", fontWeight: 500 }}>
                      {isRising ? "Rising trend" : "Stable"}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Diabetes risk card */}
          <Card>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <div className="flex items-center">
                <StatusDot status="borderline" />
                <span style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600 }}>
                  Diabetes risk (type 2)
                </span>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#F59E0B",
                  background: "#FEF3C7",
                  padding: "2px 10px",
                  borderRadius: 4,
                }}
              >
                Moderate
              </span>
            </div>
            <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.5, margin: "0 0 12px" }}>
              10-year risk: {RISK_ASSESSMENTS.diabetes.tenYearRisk}. Glucose trending up over 5 years. Family history is a factor.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Sparkline values={glucoseHistory.map((h) => h.value)} danger />
              <span style={{ color: "#EF4444", fontSize: 14, fontWeight: 500 }}>
                5.0 to 5.8 over 5 years
              </span>
            </div>
          </Card>
        </div>
      </Section>

      {/* Quick vitals table */}
      <Section title="Current vitals">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "Weight", value: `${latestBio.weight} kg`, note: `BMI ${latestBio.bmi}` },
                { label: "Waist circumference", value: `${latestBio.waist} cm`, note: "Threshold: 88 cm (women)" },
                { label: "Blood pressure", value: latestBio.bloodPressure, note: "On Enalapril 5mg" },
                { label: "Fasting glucose (blood sugar)", value: `${latestBlood.results.find(r => r.shortName === "f-Glucose")?.value} mmol/L`, note: "Upper normal range" },
                { label: "HbA1c (long-term blood sugar)", value: `${latestBlood.results.find(r => r.shortName === "HbA1c")?.value} mmol/mol`, note: "Normal" },
                { label: "Total cholesterol", value: `${latestBlood.results.find(r => r.shortName === "TC")?.value} mmol/L`, note: "Slightly above target" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 5 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{row.label}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 700, textAlign: "right" }}>{row.value}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, textAlign: "right" }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Active conditions and medications */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", marginBottom: 32 }}>
        <div>
          <h2 style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Active conditions</h2>
          <Card style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {CONDITIONS.filter(c => c.status === "active").map((c, i, arr) => (
                  <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                    <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, textAlign: "right" }}>Since {new Date(c.diagnosedDate).getFullYear()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <h2 style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Current medications</h2>
          <Card style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {MEDICATIONS.filter(m => m.active).map((m, i, arr) => (
                  <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                    <td style={{ padding: "14px 24px" }}>
                      <p style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 600, margin: 0 }}>{m.name} {m.dose}</p>
                      <p style={{ color: "#4B7BA7", fontSize: 16, margin: "2px 0 0" }}>{m.frequency} / {m.purpose}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Training plan progress */}
      <Section title="Training plan">
        <Card>
          <div className="flex items-start justify-between flex-wrap gap-4" style={{ marginBottom: 16 }}>
            <div>
              <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>
                {TRAINING_PLAN.name}
              </p>
              <p style={{ color: "#4B7BA7", fontSize: 16, margin: 0 }}>
                By {TRAINING_PLAN.createdBy} / Reviewed by {TRAINING_PLAN.reviewedBy}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}
              </p>
              <p style={{ color: "#059669", fontSize: 16, fontWeight: 500, margin: 0 }}>
                {TRAINING_PLAN.completedThisWeek} of 3 sessions this week
              </p>
            </div>
          </div>
          {/* Week progress bar */}
          <div style={{ background: "#EDF2F7", borderRadius: 4, height: 8, marginBottom: 16 }}>
            <div
              style={{
                background: "#0891B2",
                borderRadius: 4,
                height: 8,
                width: `${(TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100}%`,
              }}
            />
          </div>
          {/* This week's schedule */}
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {TRAINING_PLAN.weeklySchedule.map((day, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  background: i < TRAINING_PLAN.completedThisWeek ? "#F0FDF4" : "#EDF2F7",
                  border: `1px solid ${i < TRAINING_PLAN.completedThisWeek ? "#059669" : "#D1E9F6"}`,
                  borderRadius: 4,
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 600 }}>{day.day}</span>
                  {i < TRAINING_PLAN.completedThisWeek && (
                    <span style={{ color: "#059669", fontSize: 14, fontWeight: 600 }}>Done</span>
                  )}
                </div>
                <p style={{ color: "#4B7BA7", fontSize: 16, margin: 0 }}>{day.name}</p>
                <p style={{ color: "#4B7BA7", fontSize: 16, margin: "4px 0 0" }}>
                  {day.exercises.length} exercises
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* Latest message preview */}
      <Section title="Latest message">
        <Card>
          <div className="flex items-start gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                background: latestMessage.from === "doctor" ? "#D1E9F6" : "#EDF2F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0D3A6F",
                fontWeight: 600,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {latestMessage.from === "doctor" ? "MJ" : "AB"}
            </div>
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: 4 }}>
                <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 600 }}>
                  {latestMessage.from === "doctor" ? "Dr. Marcus Johansson" : "You"}
                </span>
                <span style={{ color: "#4B7BA7", fontSize: 16 }}>
                  {new Date(latestMessage.date).toLocaleDateString("sv-SE")}
                </span>
              </div>
              <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                {latestMessage.text}
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* Screening summary */}
      <Section title="Screening scores">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "12px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Assessment</th>
                <th style={{ padding: "12px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Score</th>
                <th style={{ padding: "12px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Level</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "FINDRISC (diabetes risk screening)", score: `${SCREENING_SCORES.findrisc.score}/${SCREENING_SCORES.findrisc.maxScore}`, level: "Moderate risk", color: "#F59E0B" },
                { name: "SCORE2 (cardiovascular risk)", score: `${SCREENING_SCORES.score2.riskPercent}%`, level: "Low-moderate", color: "#F59E0B" },
                { name: "PHQ-9 (depression screening)", score: `${SCREENING_SCORES.phq9.score}/${SCREENING_SCORES.phq9.maxScore}`, level: "Minimal", color: "#059669" },
                { name: "GAD-7 (anxiety screening)", score: `${SCREENING_SCORES.gad7.score}/${SCREENING_SCORES.gad7.maxScore}`, level: "Minimal", color: "#059669" },
                { name: "AUDIT-C (alcohol use)", score: `${SCREENING_SCORES.auditC.score}/${SCREENING_SCORES.auditC.maxScore}`, level: "Low risk", color: "#059669" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{row.name}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 700, textAlign: "right" }}>{row.score}</td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <span style={{ color: row.color, fontSize: 16, fontWeight: 600 }}>{row.level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Membership info */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>
              Annual membership
            </p>
            <p style={{ color: "#4B7BA7", fontSize: 16, margin: 0 }}>
              Includes blood tests, doctor consultations, personalized training plan
            </p>
          </div>
          <p style={{ color: "#0D3A6F", fontSize: 22, fontWeight: 700, margin: 0 }}>
            {PATIENT.membershipPrice.toLocaleString("sv-SE")} SEK/year
          </p>
        </div>
      </Card>
    </>
  );
}
