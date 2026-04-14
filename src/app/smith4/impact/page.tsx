"use client";

import { useState } from "react";
import {
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
  DOCTOR_NOTES,
  TRAINING_PLAN,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const glucoseHistory = getMarkerHistory("f-Glucose");
const hba1cHistory = getMarkerHistory("HbA1c");
const cholesterolHistory = getMarkerHistory("TC");
const latestSession = BLOOD_TEST_HISTORY[0];
const latestBio = BIOMETRICS_HISTORY[0];

type TabKey = "overview" | "blood" | "body";

export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px" }}>
      {/* Header */}
      <div style={{ paddingTop: "20px", marginBottom: "20px" }}>
        <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "14px", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Health Data
        </p>
        <h1 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "28px", margin: "4px 0 0", lineHeight: 1.1 }}>
          Training Impact
        </h1>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: "flex",
        gap: "4px",
        background: "#FFE8E0",
        borderRadius: "14px",
        padding: "4px",
        marginBottom: "20px",
      }}>
        {([
          { key: "overview" as TabKey, label: "Overview" },
          { key: "blood" as TabKey, label: "Blood Work" },
          { key: "body" as TabKey, label: "Body" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: "11px",
              border: "none",
              background: activeTab === tab.key ? "#FFFBF9" : "transparent",
              color: activeTab === tab.key ? "#FA6847" : "#A0674A",
              fontWeight: 800,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: activeTab === tab.key ? "0 2px 8px rgba(250,104,71,0.15)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Risk summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {/* Diabetes risk */}
            <div style={{
              background: "#FFFBF9",
              border: "2px solid #FFD4C4",
              borderRadius: "20px",
              padding: "18px 16px",
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "rgba(255,154,86,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9A56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px", margin: "0 0 4px" }}>
                Diabetes (type 2)
              </p>
              <p style={{
                color: "#FF9A56",
                fontWeight: 900,
                fontSize: "18px",
                margin: "0 0 4px",
              }}>
                {RISK_ASSESSMENTS.diabetes.riskLabel}
              </p>
              <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: 0 }}>
                10yr: {RISK_ASSESSMENTS.diabetes.tenYearRisk}
              </p>
            </div>

            {/* Cardiovascular risk */}
            <div style={{
              background: "#FFFBF9",
              border: "2px solid #FFD4C4",
              borderRadius: "20px",
              padding: "18px 16px",
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "rgba(71,184,129,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#47B881" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px", margin: "0 0 4px" }}>
                Heart health
              </p>
              <p style={{
                color: "#47B881",
                fontWeight: 900,
                fontSize: "18px",
                margin: "0 0 4px",
              }}>
                {RISK_ASSESSMENTS.cardiovascular.riskLabel}
              </p>
              <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: 0 }}>
                10yr: {RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
              </p>
            </div>
          </div>

          {/* Metabolic syndrome status */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: 0 }}>
                Metabolic Syndrome Check
              </h3>
              <span style={{
                color: "#FF9A56",
                fontWeight: 800,
                fontSize: "12px",
                background: "rgba(255,154,86,0.15)",
                padding: "3px 10px",
                borderRadius: "8px",
              }}>
                {RISK_ASSESSMENTS.metabolicSyndrome.metCount}/5
              </span>
            </div>
            {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "10px 0",
                  borderBottom: idx < RISK_ASSESSMENTS.metabolicSyndrome.criteria.length - 1 ? "1px solid #FFE8E0" : "none",
                }}
              >
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "8px",
                  background: c.met ? "rgba(255,85,85,0.12)" : "rgba(71,184,129,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}>
                  {c.met ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#47B881" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{ color: "#5A1A1A", fontWeight: 700, fontSize: "13px", margin: 0 }}>
                    {c.name}
                  </p>
                  <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "2px 0 0" }}>
                    {c.value} - {c.note}
                  </p>
                </div>
              </div>
            ))}
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "12px 0 0", fontStyle: "italic" }}>
              3 of 5 criteria needed for diagnosis. You have 2. Training helps prevent reaching 3.
            </p>
          </div>

          {/* Doctor's latest note */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "rgba(250,104,71,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FA6847" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "15px", margin: 0 }}>
                  {DOCTOR_NOTES[0].author}
                </p>
                <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "1px 0 0" }}>
                  {DOCTOR_NOTES[0].type} - {DOCTOR_NOTES[0].date}
                </p>
              </div>
            </div>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
              Glucose 5.8 mmol/L, continuing upward trend. HbA1c (long-term blood sugar) 38, still normal but approaching pre-diabetic threshold (42). Vitamin D slightly low. Continue training plan targeting metabolic health. Retest September 2026.
            </p>
          </div>

          {/* Training impact */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "24px",
          }}>
            <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
              Training vs. Health
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{
                flex: 1,
                background: "rgba(250,104,71,0.08)",
                borderRadius: "14px",
                padding: "16px 12px",
                textAlign: "center",
              }}>
                <p style={{ color: "#FA6847", fontWeight: 900, fontSize: "28px", margin: 0 }}>
                  {TRAINING_PLAN.totalCompleted}
                </p>
                <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "12px", margin: "4px 0 0" }}>
                  Workouts done
                </p>
              </div>
              <div style={{
                flex: 1,
                background: "rgba(255,154,86,0.08)",
                borderRadius: "14px",
                padding: "16px 12px",
                textAlign: "center",
              }}>
                <p style={{ color: "#FF9A56", fontWeight: 900, fontSize: "28px", margin: 0 }}>
                  Sep
                </p>
                <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "12px", margin: "4px 0 0" }}>
                  Next blood test
                </p>
              </div>
              <div style={{
                flex: 1,
                background: "rgba(71,184,129,0.08)",
                borderRadius: "14px",
                padding: "16px 12px",
                textAlign: "center",
              }}>
                <p style={{ color: "#47B881", fontWeight: 900, fontSize: "28px", margin: 0 }}>
                  83%
                </p>
                <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "12px", margin: "4px 0 0" }}>
                  Adherence
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* BLOOD WORK TAB */}
      {activeTab === "blood" && (
        <>
          {/* Latest results */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: 0 }}>
                Latest Results
              </h3>
              <span style={{ color: "#A0674A", fontWeight: 700, fontSize: "12px" }}>
                {latestSession.date}
              </span>
            </div>
            {latestSession.results.map((marker, idx) => {
              const range = marker.refHigh - marker.refLow;
              const position = range > 0 ? Math.min(Math.max(((marker.value - marker.refLow) / range) * 100, 0), 100) : 50;

              return (
                <div
                  key={idx}
                  style={{
                    padding: "14px 0",
                    borderBottom: idx < latestSession.results.length - 1 ? "1px solid #FFE8E0" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div>
                      <span style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px" }}>
                        {marker.plainName}
                      </span>
                      <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", marginLeft: "6px" }}>
                        ({marker.shortName})
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        color: marker.status === "normal" ? "#47B881" : marker.status === "borderline" ? "#FF9A56" : "#FF5555",
                        fontWeight: 900,
                        fontSize: "15px",
                      }}>
                        {marker.value}
                      </span>
                      <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px" }}>
                        {marker.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range bar */}
                  <div style={{ position: "relative", height: "8px", borderRadius: "4px", background: "#FFE8E0", marginBottom: "4px" }}>
                    {/* Normal zone */}
                    <div style={{
                      position: "absolute",
                      left: "10%",
                      right: "10%",
                      top: 0,
                      bottom: 0,
                      borderRadius: "4px",
                      background: "rgba(71,184,129,0.3)",
                    }} />
                    {/* Marker */}
                    <div style={{
                      position: "absolute",
                      left: `calc(${Math.min(Math.max(position * 0.8 + 10, 5), 95)}% - 5px)`,
                      top: "-2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "6px",
                      background: marker.status === "normal" ? "#47B881" : marker.status === "borderline" ? "#FF9A56" : "#FF5555",
                      border: "2px solid #FFFBF9",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>{marker.refLow}</span>
                    <span style={{
                      color: marker.status === "normal" ? "#47B881" : "#FF9A56",
                      fontWeight: 700,
                      fontSize: "11px",
                      textTransform: "capitalize",
                    }}>
                      {marker.status}
                    </span>
                    <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>{marker.refHigh}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Glucose trend detail */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
              Blood Sugar Trend (5 Years)
            </h3>
            {/* Trend chart */}
            <div style={{ position: "relative", height: "120px", marginBottom: "12px" }}>
              {/* Reference zone */}
              <div style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${((3.9 - 3.5) / (7 - 3.5)) * 100}%`,
                height: `${((6.0 - 3.9) / (7 - 3.5)) * 100}%`,
                background: "rgba(71,184,129,0.08)",
                borderRadius: "8px",
              }} />
              {/* Pre-diabetes zone */}
              <div style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${((6.0 - 3.5) / (7 - 3.5)) * 100}%`,
                height: `${((6.9 - 6.0) / (7 - 3.5)) * 100}%`,
                background: "rgba(255,154,86,0.08)",
                borderRadius: "8px",
              }} />

              {/* Line connecting dots */}
              <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                {glucoseHistory.map((point, idx) => {
                  if (idx === 0) return null;
                  const prevPoint = glucoseHistory[idx - 1];
                  const x1 = (idx - 1) / (glucoseHistory.length - 1) * 100;
                  const x2 = idx / (glucoseHistory.length - 1) * 100;
                  const y1 = 100 - ((prevPoint.value - 3.5) / (7 - 3.5)) * 100;
                  const y2 = 100 - ((point.value - 3.5) / (7 - 3.5)) * 100;
                  return (
                    <line
                      key={idx}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#FA6847"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Data points */}
              {glucoseHistory.map((point, idx) => {
                const x = (idx / (glucoseHistory.length - 1)) * 100;
                const y = 100 - ((point.value - 3.5) / (7 - 3.5)) * 100;
                const isLast = idx === glucoseHistory.length - 1;
                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: `calc(${x}% - ${isLast ? 8 : 5}px)`,
                      top: `calc(${y}% - ${isLast ? 8 : 5}px)`,
                      width: isLast ? "16px" : "10px",
                      height: isLast ? "16px" : "10px",
                      borderRadius: "50%",
                      background: isLast ? "#FA6847" : "#FFB09A",
                      border: isLast ? "3px solid #FFFBF9" : "2px solid #FFFBF9",
                      boxShadow: isLast ? "0 2px 8px rgba(250,104,71,0.4)" : "none",
                    }}
                  />
                );
              })}
            </div>

            {/* Labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              {glucoseHistory.map((point, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "12px", margin: 0 }}>{point.value}</p>
                  <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "10px", margin: "2px 0 0" }}>
                    {point.date.slice(2, 4)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(71,184,129,0.3)" }} />
                <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>Normal (3.9-6.0)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(255,154,86,0.3)" }} />
                <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>Pre-diabetes (6.1-6.9)</span>
              </div>
            </div>
          </div>

          {/* Blood test history */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "24px",
          }}>
            <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
              Test History
            </h3>
            {BLOOD_TEST_HISTORY.map((session, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom: idx < BLOOD_TEST_HISTORY.length - 1 ? "1px solid #FFE8E0" : "none",
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  background: idx === 0 ? "rgba(250,104,71,0.1)" : "rgba(250,104,71,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={idx === 0 ? "#FA6847" : "#A0674A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px", margin: 0 }}>
                    {session.date}
                  </p>
                  <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "2px 0 0" }}>
                    {session.orderedBy} / {session.results.length} markers
                  </p>
                </div>
                {session.results.some((r) => r.status !== "normal") && (
                  <span style={{
                    color: "#FF9A56",
                    fontWeight: 800,
                    fontSize: "11px",
                    background: "rgba(255,154,86,0.15)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}>
                    Borderline
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* BODY TAB */}
      {activeTab === "body" && (
        <>
          {/* Current biometrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "Weight", value: `${latestBio.weight}kg`, color: "#FA6847" },
              { label: "BMI", value: `${latestBio.bmi}`, color: "#FF9A56" },
              { label: "Waist", value: `${latestBio.waist}cm`, color: "#FA6847" },
              { label: "Blood Pressure", value: latestBio.bloodPressure, color: "#47B881" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#FFFBF9",
                  border: "2px solid #FFD4C4",
                  borderRadius: "20px",
                  padding: "18px 16px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: item.color, fontWeight: 900, fontSize: "24px", margin: 0 }}>
                  {item.value}
                </p>
                <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "12px", margin: "4px 0 0" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Weight trend */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
              Weight Over Time
            </h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px", marginBottom: "8px" }}>
              {BIOMETRICS_HISTORY.slice().reverse().map((bio, idx) => {
                const min = 70;
                const max = 82;
                const height = ((bio.weight - min) / (max - min)) * 100;
                const isLast = idx === BIOMETRICS_HISTORY.length - 1;
                return (
                  <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{
                      width: "100%",
                      maxWidth: "28px",
                      height: `${Math.max(height, 10)}%`,
                      borderRadius: "8px 8px 4px 4px",
                      background: isLast ? "linear-gradient(180deg, #FA6847, #FF9A56)" : "rgba(250,104,71,0.25)",
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>2021</span>
              <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>74-78 kg</span>
              <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>2026</span>
            </div>
          </div>

          {/* Waist measurement context */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 12px" }}>
              Waist Circumference
            </h3>
            <div style={{ position: "relative", height: "12px", borderRadius: "6px", background: "#FFE8E0", marginBottom: "8px" }}>
              {/* Healthy zone */}
              <div style={{
                position: "absolute",
                left: 0,
                width: `${((88 - 60) / (100 - 60)) * 100}%`,
                top: 0,
                bottom: 0,
                borderRadius: "6px 0 0 6px",
                background: "rgba(71,184,129,0.3)",
              }} />
              {/* Marker for Anna */}
              <div style={{
                position: "absolute",
                left: `calc(${((latestBio.waist - 60) / (100 - 60)) * 100}% - 8px)`,
                top: "-4px",
                width: "20px",
                height: "20px",
                borderRadius: "10px",
                background: "#FF9A56",
                border: "3px solid #FFFBF9",
                boxShadow: "0 2px 8px rgba(255,154,86,0.4)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>60 cm</span>
              <span style={{ color: "#FF9A56", fontWeight: 800, fontSize: "11px" }}>Threshold: 88 cm</span>
              <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "11px" }}>100 cm</span>
            </div>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
              At {latestBio.waist}cm, you are 2cm below the metabolic syndrome threshold for women (88cm). Waist measurement is one of the strongest predictors of metabolic risk.
            </p>
          </div>

          {/* Blood pressure trend */}
          <div style={{
            background: "#FFFBF9",
            border: "2px solid #FFD4C4",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "24px",
          }}>
            <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
              Blood Pressure History
            </h3>
            {BIOMETRICS_HISTORY.slice(0, 5).map((bio, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: idx < 4 ? "1px solid #FFE8E0" : "none",
                }}
              >
                <span style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px" }}>
                  {bio.date}
                </span>
                <span style={{
                  color: "#5A1A1A",
                  fontWeight: 800,
                  fontSize: "15px",
                  background: "rgba(71,184,129,0.08)",
                  padding: "4px 12px",
                  borderRadius: "8px",
                }}>
                  {bio.bloodPressure}
                </span>
              </div>
            ))}
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "12px 0 0", fontStyle: "italic" }}>
              Controlled with Enalapril 5mg daily. Training supports blood pressure management.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
