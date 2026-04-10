"use client";

import React from "react";
import {
  CONDITIONS,
  MEDICATIONS,
  MEDICATION_HISTORY,
  VACCINATIONS,
  ALLERGIES,
  DOCTOR_VISITS,
  BIOMETRICS_HISTORY,
  FAMILY_HISTORY,
  PATIENT,
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
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HalsodataPage() {
  return (
    <>
      <h1 style={{ color: "#0D3A6F", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Halsodata (Health data)
      </h1>
      <p style={{ color: "#4B7BA7", fontSize: 16, margin: "0 0 32px" }}>
        Complete health record for {PATIENT.name}, personnummer {PATIENT.personnummer}. Data from 1177 Journalen and Precura.
      </p>

      {/* Personal details */}
      <Section title="Personal details">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "Full name", value: PATIENT.name },
                { label: "Date of birth", value: new Date(PATIENT.dateOfBirth).toLocaleDateString("sv-SE") + ` (${PATIENT.age} years)` },
                { label: "Personnummer", value: PATIENT.personnummer },
                { label: "Address", value: PATIENT.address },
                { label: "Phone", value: PATIENT.phone },
                { label: "Email", value: PATIENT.email },
                { label: "Primary care center", value: PATIENT.vardcentral },
              ].map((row, i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 500, width: "40%" }}>{row.label}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Conditions */}
      <Section title="Conditions (diagnoser)" subtitle={`${CONDITIONS.length} recorded conditions`}>
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Condition</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>ICD-10</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Diagnosed</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Status</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Provider</th>
              </tr>
            </thead>
            <tbody>
              {CONDITIONS.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < CONDITIONS.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16, fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace' }}>{c.icd10}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{new Date(c.diagnosedDate).toLocaleDateString("sv-SE")}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.status === "active" ? "#0891B2" : "#059669",
                        background: c.status === "active" ? "#E0F7FA" : "#F0FDF4",
                        padding: "2px 10px",
                        borderRadius: 4,
                      }}
                    >
                      {c.status === "active" ? "Active" : "Resolved"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{c.treatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Current medications */}
      <Section title="Current medications (lakemedel)" subtitle={`${MEDICATIONS.filter(m => m.active).length} active medications`}>
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Medication</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Dose</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Frequency</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Purpose</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Since</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Prescribed by</th>
              </tr>
            </thead>
            <tbody>
              {MEDICATIONS.filter(m => m.active).map((m, i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{m.dose}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{m.frequency}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{m.purpose}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{new Date(m.startDate).toLocaleDateString("sv-SE")}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{m.prescribedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Past medications */}
      <Section title="Past medications" subtitle="Previously prescribed, no longer active">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Medication</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Dose / Frequency</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Purpose</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Period</th>
              </tr>
            </thead>
            <tbody>
              {MEDICATION_HISTORY.map((m, i) => (
                <tr key={i} style={{ borderBottom: i < MEDICATION_HISTORY.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{m.name}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{m.dose}, {m.frequency}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{m.purpose}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>
                    {new Date(m.startDate).toLocaleDateString("sv-SE")} to {new Date(m.endDate).toLocaleDateString("sv-SE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Allergies */}
      <Section title="Allergies (allergier)">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Substance</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Reaction</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {ALLERGIES.map((a, i) => (
                <tr key={i} style={{ borderBottom: i < ALLERGIES.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{a.substance}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{a.reaction || "-"}</td>
                  <td style={{ padding: "14px 24px" }}>
                    {a.severity !== "none" ? (
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: a.severity === "mild" ? "#F59E0B" : "#EF4444",
                          background: a.severity === "mild" ? "#FEF3C7" : "#FEE2E2",
                          padding: "2px 10px",
                          borderRadius: 4,
                        }}
                      >
                        {a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                      </span>
                    ) : (
                      <span style={{ color: "#4B7BA7", fontSize: 16 }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Vaccinations */}
      <Section title="Vaccinations (vaccinationer)" subtitle={`${VACCINATIONS.length} recorded vaccinations`}>
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Vaccination</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Date</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Provider</th>
              </tr>
            </thead>
            <tbody>
              {VACCINATIONS.map((v, i) => (
                <tr key={i} style={{ borderBottom: i < VACCINATIONS.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>{v.name}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{new Date(v.date).toLocaleDateString("sv-SE")}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{v.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Family history */}
      <Section title="Family history (hereditet)" subtitle="Relevant genetic risk factors">
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Relative</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Condition</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Age at diagnosis</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {FAMILY_HISTORY.map((f, i) => (
                <tr key={i} style={{ borderBottom: i < FAMILY_HISTORY.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 600 }}>{f.relative}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16 }}>{f.condition}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 700, textAlign: "right" }}>{f.ageAtDiagnosis}</td>
                  <td style={{ padding: "14px 24px", color: "#4B7BA7", fontSize: 16 }}>{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Biometrics history */}
      <Section title="Biometrics over time (kropp)" subtitle={`${BIOMETRICS_HISTORY.length} measurements from ${BIOMETRICS_HISTORY[BIOMETRICS_HISTORY.length - 1].date.slice(0, 4)} to ${BIOMETRICS_HISTORY[0].date.slice(0, 4)}`}>
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #D1E9F6" }}>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "left" }}>Date</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Weight (kg)</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Waist (cm)</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>BMI</th>
                <th style={{ padding: "10px 24px", color: "#4B7BA7", fontSize: 16, fontWeight: 600, textAlign: "right" }}>Blood pressure</th>
              </tr>
            </thead>
            <tbody>
              {BIOMETRICS_HISTORY.map((b, i) => (
                <tr key={i} style={{ borderBottom: i < BIOMETRICS_HISTORY.length - 1 ? "1px solid #D1E9F6" : "none" }}>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>
                    {new Date(b.date).toLocaleDateString("sv-SE")}
                  </td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 600, textAlign: "right" }}>{b.weight}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, textAlign: "right" }}>{b.waist}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, textAlign: "right" }}>{b.bmi}</td>
                  <td style={{ padding: "14px 24px", color: "#0D3A6F", fontSize: 16, fontWeight: 600, textAlign: "right" }}>{b.bloodPressure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Doctor visits timeline */}
      <Section title="Doctor visits (besok)" subtitle={`${DOCTOR_VISITS.length} visits recorded`}>
        {DOCTOR_VISITS.map((visit, i) => (
          <Card key={i} style={{ padding: 24, marginBottom: i < DOCTOR_VISITS.length - 1 ? 12 : 0 }}>
            <div className="flex items-start justify-between flex-wrap gap-2" style={{ marginBottom: 8 }}>
              <div>
                <h3 style={{ color: "#0D3A6F", fontSize: 18, fontWeight: 600, margin: 0 }}>
                  {visit.type}
                </h3>
                <p style={{ color: "#4B7BA7", fontSize: 16, margin: "4px 0 0" }}>{visit.provider}</p>
              </div>
              <span style={{ color: "#0D3A6F", fontSize: 16, fontWeight: 500 }}>
                {new Date(visit.date).toLocaleDateString("sv-SE")}
              </span>
            </div>
            <p style={{ color: "#0D3A6F", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              {visit.summary}
            </p>
          </Card>
        ))}
      </Section>
    </>
  );
}
