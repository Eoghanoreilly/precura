"use client";

import React from "react";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  MEDICATION_HISTORY,
  VACCINATIONS,
  ALLERGIES,
  DOCTOR_VISITS,
  BLOOD_TEST_HISTORY,
  FAMILY_HISTORY,
  BIOMETRICS_HISTORY,
  SCREENING_SCORES,
  RISK_ASSESSMENTS,
  MESSAGES,
  DOCTOR_NOTES,
  TRAINING_PLAN,
  AI_PATIENT_SUMMARY,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Design tokens - inline everywhere, no CSS vars
// ============================================================================
const T = {
  bg: "#F8FAFB",
  card: "#FFFFFF",
  text: "#1A202C",
  textSec: "#718096",
  accent: "#2563EB",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  border: "#E2E8F0",
  shadow: "0 1px 3px rgba(0,0,0,0.1)",
  radius: 6,
  font: '-apple-system, system-ui, "SF Pro Text", sans-serif',
  fontDisplay: '-apple-system, system-ui, "SF Pro Display", sans-serif',
  fontMono: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
};

// ============================================================================
// Tiny reusable pieces
// ============================================================================

function StatusDot({ status }: { status: string }) {
  const color =
    status === "abnormal"
      ? T.red
      : status === "borderline"
      ? T.amber
      : T.green;
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function Badge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        fontFamily: T.font,
        color,
        background: bg,
        padding: "1px 6px",
        borderRadius: 3,
        textTransform: "uppercase",
        letterSpacing: 0.3,
      }}
    >
      {label}
    </span>
  );
}

function PanelHeader({ title, extra }: { title: string; extra?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        paddingBottom: 8,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          fontFamily: T.font,
          color: T.text,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </span>
      {extra}
    </div>
  );
}

function MiniSparkline({
  data,
  color,
  width = 80,
  height = 24,
}: {
  data: { value: number }[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals) - (Math.max(...vals) - Math.min(...vals)) * 0.2;
  const max = Math.max(...vals) + (Math.max(...vals) - Math.min(...vals)) * 0.2;
  const range = max - min || 1;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const last = vals[vals.length - 1];
  const lastX = width;
  const lastY = height - ((last - min) / range) * height;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} />
    </svg>
  );
}

function RangeBar({
  value,
  refLow,
  refHigh,
  status,
}: {
  value: number;
  refLow: number;
  refHigh: number;
  status: string;
}) {
  const visualMin = refLow - (refHigh - refLow) * 0.3;
  const visualMax = refHigh + (refHigh - refLow) * 0.3;
  const range = visualMax - visualMin || 1;
  const greenLeft = ((refLow - visualMin) / range) * 100;
  const greenWidth = ((refHigh - refLow) / range) * 100;
  const markerPos = Math.max(0, Math.min(100, ((value - visualMin) / range) * 100));
  const dotColor = status === "abnormal" ? T.red : status === "borderline" ? T.amber : T.green;

  return (
    <div style={{ position: "relative", height: 8, width: "100%" }}>
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 0,
          right: 0,
          height: 4,
          background: "#EDF2F7",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 2,
          left: `${greenLeft}%`,
          width: `${greenWidth}%`,
          height: 4,
          background: "rgba(5, 150, 105, 0.2)",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${markerPos}%`,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dotColor,
          transform: "translateX(-4px)",
        }}
      />
    </div>
  );
}

// ============================================================================
// Panel card wrapper
// ============================================================================
function Panel({
  children,
  style: extraStyle,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        boxShadow: T.shadow,
        padding: 14,
        overflow: "hidden",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function Smith9Dashboard() {
  const latestSession = BLOOD_TEST_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const hba1cHistory = getMarkerHistory("HbA1c");
  const cholHistory = getMarkerHistory("TC");
  const glucose = getLatestMarker("f-Glucose");
  const hba1c = getLatestMarker("HbA1c");
  const tc = getLatestMarker("TC");
  const hdl = getLatestMarker("HDL");
  const ldl = getLatestMarker("LDL");
  const tg = getLatestMarker("TG");
  const tsh = getLatestMarker("TSH");
  const vitD = getLatestMarker("Vit D");
  const crea = getLatestMarker("Crea");
  const insulin = getLatestMarker("f-Insulin");

  const latestBio = BIOMETRICS_HISTORY[0];
  const prevBio = BIOMETRICS_HISTORY[1];
  const lastMessage = MESSAGES[MESSAGES.length - 1];
  const borderlineMarkers = latestSession.results.filter(
    (r) => r.status === "borderline"
  );
  const abnormalMarkers = latestSession.results.filter(
    (r) => r.status === "abnormal"
  );

  const metSynCriteriaMet = RISK_ASSESSMENTS.metabolicSyndrome.metCount;

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        fontFamily: T.font,
        color: T.text,
      }}
    >
      {/* ================================================================ */}
      {/* TOP NAV BAR */}
      {/* ================================================================ */}
      <nav
        style={{
          background: T.card,
          borderBottom: `1px solid ${T.border}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          padding: "0 24px",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              fontFamily: T.fontDisplay,
              color: T.accent,
              letterSpacing: -0.5,
            }}
          >
            Precura
          </span>
          {["Dashboard", "Blood Tests", "Risk Models", "Training", "Messages"].map(
            (tab, i) => (
              <span
                key={tab}
                style={{
                  fontSize: 12,
                  fontWeight: i === 0 ? 600 : 400,
                  fontFamily: T.font,
                  color: i === 0 ? T.accent : T.textSec,
                  cursor: "pointer",
                  borderBottom: i === 0 ? `2px solid ${T.accent}` : "2px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {tab}
              </span>
            )
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: T.font,
              color: T.textSec,
            }}
          >
            Last sync: {latestSession.date}
          </span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: T.accent,
              color: T.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: T.font,
            }}
          >
            AB
          </div>
        </div>
      </nav>

      {/* ================================================================ */}
      {/* ALERT BAR */}
      {/* ================================================================ */}
      {(borderlineMarkers.length > 0 || abnormalMarkers.length > 0) && (
        <div
          style={{
            background: "#FFFBEB",
            borderBottom: `1px solid ${T.border}`,
            padding: "6px 24px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontFamily: T.font,
          }}
        >
          <span style={{ color: T.amber, fontWeight: 700 }}>ALERT</span>
          <span style={{ color: T.text }}>
            {borderlineMarkers.length} borderline marker
            {borderlineMarkers.length !== 1 ? "s" : ""} detected.
            Fasting glucose (blood sugar) has risen from 5.0 to 5.8 over 5 years.
          </span>
          <span style={{ color: T.accent, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
            View details
          </span>
        </div>
      )}

      {/* ================================================================ */}
      {/* PATIENT HEADER BAR */}
      {/* ================================================================ */}
      <div
        style={{
          padding: "12px 24px",
          borderBottom: `1px solid ${T.border}`,
          background: T.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                fontFamily: T.fontDisplay,
                color: T.text,
              }}
            >
              {PATIENT.name}
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: T.font,
                color: T.textSec,
                marginLeft: 8,
              }}
            >
              {PATIENT.age}y / {PATIENT.sex} / {PATIENT.personnummer}
            </span>
          </div>
          <Badge label="Annual Member" color={T.accent} bg="#EBF5FF" />
          <Badge
            label={`Since ${new Date(PATIENT.memberSince).toLocaleDateString("en-SE", { month: "short", year: "numeric" })}`}
            color={T.textSec}
            bg="#F7FAFC"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, fontFamily: T.font, color: T.textSec }}>
          <span>Next test: {PATIENT.nextBloodTest}</span>
          <span>Vardcentral: {PATIENT.vardcentral}</span>
          <span>{PATIENT.email}</span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MAIN 3-COLUMN GRID */}
      {/* ================================================================ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          padding: "12px 16px",
          maxWidth: 1600,
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {/* ============================================================ */}
        {/* LEFT COLUMN: Biomarkers + Alerts + Medical History */}
        {/* ============================================================ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* --- Latest Blood Panel --- */}
          <Panel>
            <PanelHeader
              title="Blood Panel - Latest"
              extra={
                <span style={{ fontSize: 10, fontFamily: T.font, color: T.textSec }}>
                  {latestSession.date} / {latestSession.lab}
                </span>
              }
            />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: T.font }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ textAlign: "left", padding: "3px 0", fontWeight: 600, color: T.textSec, fontSize: 10 }}>Marker</th>
                  <th style={{ textAlign: "right", padding: "3px 0", fontWeight: 600, color: T.textSec, fontSize: 10 }}>Value</th>
                  <th style={{ textAlign: "center", padding: "3px 0", fontWeight: 600, color: T.textSec, fontSize: 10, width: 80 }}>Range</th>
                  <th style={{ textAlign: "center", padding: "3px 0", fontWeight: 600, color: T.textSec, fontSize: 10, width: 90 }}>Trend</th>
                  <th style={{ textAlign: "center", padding: "3px 4px", fontWeight: 600, color: T.textSec, fontSize: 10, width: 14 }}></th>
                </tr>
              </thead>
              <tbody>
                {latestSession.results.map((r) => {
                  const history = getMarkerHistory(r.shortName);
                  return (
                    <tr key={r.shortName} style={{ borderBottom: `1px solid #F7FAFC` }}>
                      <td style={{ padding: "5px 0" }}>
                        <div style={{ fontWeight: 500, color: T.text, fontSize: 12 }}>{r.plainName}</div>
                        <div style={{ fontSize: 10, color: T.textSec }}>{r.shortName} ({r.unit})</div>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600, color: T.text, fontFamily: T.fontMono, fontSize: 12 }}>
                        {r.value}
                      </td>
                      <td style={{ padding: "5px 4px" }}>
                        <RangeBar value={r.value} refLow={r.refLow} refHigh={r.refHigh} status={r.status} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.textSec, marginTop: 1 }}>
                          <span>{r.refLow}</span>
                          <span>{r.refHigh}</span>
                        </div>
                      </td>
                      <td style={{ padding: "5px 4px", textAlign: "center" }}>
                        {history.length >= 2 ? (
                          <MiniSparkline
                            data={history}
                            color={r.status === "borderline" ? T.amber : r.status === "abnormal" ? T.red : T.green}
                            width={70}
                            height={20}
                          />
                        ) : (
                          <span style={{ fontSize: 9, color: T.textSec }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <StatusDot status={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 8, fontSize: 10, color: T.textSec }}>
              Ordered by {latestSession.orderedBy}. {latestSession.results.length} markers tested.
            </div>
          </Panel>

          {/* --- Blood Test History (sessions) --- */}
          <Panel>
            <PanelHeader title="Test History (6 sessions)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {BLOOD_TEST_HISTORY.map((session, i) => (
                <div
                  key={session.date}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 6px",
                    borderRadius: 4,
                    background: i === 0 ? "#F0F7FF" : "transparent",
                    fontSize: 11,
                    fontFamily: T.font,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.textSec, width: 72 }}>{session.date}</span>
                    <span style={{ color: T.text, fontWeight: 500 }}>{session.results.length} markers</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {session.results.filter((r) => r.status === "borderline").length > 0 && (
                      <Badge
                        label={`${session.results.filter((r) => r.status === "borderline").length} borderline`}
                        color={T.amber}
                        bg="rgba(217, 119, 6, 0.1)"
                      />
                    )}
                    <span style={{ fontSize: 9, color: T.textSec }}>{session.orderedBy.split(",")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* --- Active Conditions --- */}
          <Panel>
            <PanelHeader title="Conditions & Diagnoses" />
            {CONDITIONS.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 0",
                  borderBottom: `1px solid #F7FAFC`,
                  fontSize: 12,
                  fontFamily: T.font,
                }}
              >
                <div>
                  <span style={{ fontWeight: 500, color: T.text }}>{c.name}</span>
                  <span style={{ fontSize: 10, color: T.textSec, marginLeft: 6 }}>ICD-10: {c.icd10}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Badge
                    label={c.status}
                    color={c.status === "active" ? T.amber : T.green}
                    bg={c.status === "active" ? "rgba(217,119,6,0.1)" : "rgba(5,150,105,0.1)"}
                  />
                  <span style={{ fontSize: 9, color: T.textSec }}>{c.diagnosedDate}</span>
                </div>
              </div>
            ))}
          </Panel>

          {/* --- Medications --- */}
          <Panel>
            <PanelHeader title="Medications" />
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textSec, marginBottom: 4, textTransform: "uppercase" }}>Active</div>
            {MEDICATIONS.map((m) => (
              <div
                key={m.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 12,
                  fontFamily: T.font,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: T.text }}>{m.name}</span>
                  <span style={{ color: T.textSec, marginLeft: 4 }}>{m.dose}, {m.frequency}</span>
                </div>
                <span style={{ fontSize: 10, color: T.textSec }}>{m.purpose}</span>
              </div>
            ))}
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textSec, marginTop: 8, marginBottom: 4, textTransform: "uppercase" }}>Past</div>
            {MEDICATION_HISTORY.map((m) => (
              <div
                key={m.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 11,
                  fontFamily: T.font,
                  color: T.textSec,
                }}
              >
                <span>{m.name} {m.dose} - {m.purpose}</span>
                <span style={{ fontSize: 9 }}>{m.startDate} to {m.endDate}</span>
              </div>
            ))}
          </Panel>

          {/* --- Allergies --- */}
          <Panel>
            <PanelHeader title="Allergies" />
            {ALLERGIES.map((a) => (
              <div
                key={a.substance}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 12,
                  fontFamily: T.font,
                }}
              >
                <span style={{ fontWeight: 500, color: T.text }}>{a.substance}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {a.reaction && <span style={{ fontSize: 10, color: T.textSec }}>{a.reaction}</span>}
                  {a.severity !== "none" && (
                    <Badge
                      label={a.severity}
                      color={a.severity === "mild" ? T.amber : T.red}
                      bg={a.severity === "mild" ? "rgba(217,119,6,0.1)" : "rgba(220,38,38,0.1)"}
                    />
                  )}
                </div>
              </div>
            ))}
          </Panel>

          {/* --- Vaccinations --- */}
          <Panel>
            <PanelHeader title="Vaccinations" />
            {VACCINATIONS.map((v, i) => (
              <div
                key={`${v.name}-${v.date}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  borderBottom: i < VACCINATIONS.length - 1 ? `1px solid #F7FAFC` : "none",
                  fontSize: 11,
                  fontFamily: T.font,
                }}
              >
                <span style={{ fontWeight: 500, color: T.text }}>{v.name}</span>
                <span style={{ fontSize: 10, color: T.textSec }}>{v.date}</span>
              </div>
            ))}
          </Panel>
        </div>

        {/* ============================================================ */}
        {/* CENTER COLUMN: Risk Models + Screening + Categories */}
        {/* ============================================================ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* --- Category Status Overview --- */}
          <Panel>
            <PanelHeader title="Health Categories" />
            {[
              {
                name: "Metabolic Health",
                status: "Moderate risk",
                trend: "worsening",
                color: T.amber,
                markers: ["Glucose 5.8 (borderline)", "HbA1c 38 (normal)", "Insulin 12 (normal)", "FINDRISC 12/26"],
                score: 62,
              },
              {
                name: "Cardiovascular Health",
                status: "Low-moderate risk",
                trend: "stable",
                color: T.green,
                markers: ["BP 132/82 (controlled)", "TC 5.1 (borderline)", "HDL 1.6 (good)", "SCORE2 ~3%"],
                score: 78,
              },
              {
                name: "Bone Health",
                status: "Low risk",
                trend: "stable",
                color: T.green,
                markers: ["Vitamin D 48 (low)", "No fracture history", "Pre-menopausal"],
                score: 88,
              },
              {
                name: "Mental Health",
                status: "Good",
                trend: "stable",
                color: T.green,
                markers: ["PHQ-9: 4 (minimal)", "GAD-7: 3 (minimal)", "AUDIT-C: 3 (low risk)"],
                score: 92,
              },
              {
                name: "Kidney Function",
                status: "Normal",
                trend: "stable",
                color: T.green,
                markers: ["Creatinine 68 (normal)"],
                score: 95,
              },
              {
                name: "Thyroid Function",
                status: "Normal",
                trend: "stable",
                color: T.green,
                markers: ["TSH 2.1 (normal)"],
                score: 96,
              },
            ].map((cat) => (
              <div
                key={cat.name}
                style={{
                  padding: "8px 0",
                  borderBottom: `1px solid #F7FAFC`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 12,
                        color: T.text,
                        fontFamily: T.font,
                      }}
                    >
                      {cat.name}
                    </span>
                    <Badge
                      label={cat.status}
                      color={cat.color}
                      bg={cat.color === T.green ? "rgba(5,150,105,0.08)" : "rgba(217,119,6,0.08)"}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: 13,
                      fontWeight: 700,
                      color: cat.color,
                    }}
                  >
                    {cat.score}
                  </span>
                </div>
                {/* score bar */}
                <div style={{ height: 3, background: "#EDF2F7", borderRadius: 2, marginBottom: 4 }}>
                  <div
                    style={{
                      height: 3,
                      width: `${cat.score}%`,
                      background: cat.color,
                      borderRadius: 2,
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {cat.markers.map((m) => (
                    <span
                      key={m}
                      style={{
                        fontSize: 9,
                        fontFamily: T.font,
                        color: T.textSec,
                        background: "#F7FAFC",
                        padding: "1px 4px",
                        borderRadius: 2,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
                {cat.trend === "worsening" && (
                  <div style={{ fontSize: 9, color: T.amber, fontWeight: 600, marginTop: 2 }}>
                    TREND: Worsening
                  </div>
                )}
              </div>
            ))}
          </Panel>

          {/* --- Diabetes Risk Model --- */}
          <Panel>
            <PanelHeader
              title="Risk: Diabetes (Type 2)"
              extra={
                <Badge
                  label={RISK_ASSESSMENTS.diabetes.riskLabel}
                  color={T.amber}
                  bg="rgba(217,119,6,0.1)"
                />
              }
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: T.fontDisplay, color: T.text }}>
                {RISK_ASSESSMENTS.diabetes.tenYearRisk}
              </span>
              <span style={{ fontSize: 11, color: T.textSec }}>10-year risk</span>
              <Badge label="Worsening" color={T.red} bg="rgba(220,38,38,0.08)" />
            </div>
            <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, margin: "0 0 8px" }}>
              {RISK_ASSESSMENTS.diabetes.summary}
            </p>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textSec, marginBottom: 4, textTransform: "uppercase" }}>Key Factors</div>
            {RISK_ASSESSMENTS.diabetes.keyFactors.map((f) => (
              <div
                key={f.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 11,
                  fontFamily: T.font,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        (f.impact as string) === "positive"
                          ? T.green
                          : (f.impact as string) === "high"
                          ? T.red
                          : (f.impact as string) === "medium"
                          ? T.amber
                          : "#CBD5E0",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: T.text }}>{f.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 9, color: T.textSec }}>{f.impact} impact</span>
                  {f.changeable ? (
                    <Badge label="Modifiable" color={T.green} bg="rgba(5,150,105,0.08)" />
                  ) : (
                    <Badge label="Fixed" color={T.textSec} bg="#F7FAFC" />
                  )}
                </div>
              </div>
            ))}
          </Panel>

          {/* --- CVD Risk Model --- */}
          <Panel>
            <PanelHeader
              title="Risk: Cardiovascular"
              extra={
                <Badge
                  label={RISK_ASSESSMENTS.cardiovascular.riskLabel}
                  color={T.green}
                  bg="rgba(5,150,105,0.1)"
                />
              }
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: T.fontDisplay, color: T.text }}>
                {RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
              </span>
              <span style={{ fontSize: 11, color: T.textSec }}>10-year risk (SCORE2)</span>
            </div>
            <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, margin: "0 0 8px" }}>
              {RISK_ASSESSMENTS.cardiovascular.summary}
            </p>
            {RISK_ASSESSMENTS.cardiovascular.keyFactors.map((f) => (
              <div
                key={f.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 11,
                  fontFamily: T.font,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        (f.impact as string) === "positive"
                          ? T.green
                          : (f.impact as string) === "high"
                          ? T.red
                          : (f.impact as string) === "medium"
                          ? T.amber
                          : "#CBD5E0",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: T.text }}>{f.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {f.changeable ? (
                    <Badge label="Modifiable" color={T.green} bg="rgba(5,150,105,0.08)" />
                  ) : (
                    <Badge label="Fixed" color={T.textSec} bg="#F7FAFC" />
                  )}
                </div>
              </div>
            ))}
          </Panel>

          {/* --- Bone Health Risk --- */}
          <Panel>
            <PanelHeader
              title="Risk: Bone Health"
              extra={
                <Badge label={RISK_ASSESSMENTS.bone.riskLabel} color={T.green} bg="rgba(5,150,105,0.1)" />
              }
            />
            <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, margin: 0 }}>
              {RISK_ASSESSMENTS.bone.summary}
            </p>
          </Panel>

          {/* --- Metabolic Syndrome Criteria --- */}
          <Panel>
            <PanelHeader
              title="Metabolic Syndrome Criteria"
              extra={
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: T.fontMono, color: metSynCriteriaMet >= 3 ? T.red : T.amber }}>
                  {metSynCriteriaMet}/5
                </span>
              }
            />
            <div style={{ fontSize: 10, color: T.textSec, marginBottom: 6 }}>
              {RISK_ASSESSMENTS.metabolicSyndrome.status}
            </div>
            {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                  padding: "4px 0",
                  borderBottom: `1px solid #F7FAFC`,
                  fontSize: 11,
                  fontFamily: T.font,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    border: `1.5px solid ${c.met ? T.red : T.green}`,
                    background: c.met ? "rgba(220,38,38,0.08)" : "rgba(5,150,105,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    fontWeight: 700,
                    color: c.met ? T.red : T.green,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {c.met ? "X" : " "}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: T.text, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: T.textSec }}>
                    Current: {c.value} - {c.note}
                  </div>
                </div>
              </div>
            ))}
            {RISK_ASSESSMENTS.metabolicSyndrome.trend === "approaching" && (
              <div style={{ fontSize: 10, color: T.amber, fontWeight: 600, marginTop: 6 }}>
                TREND: Approaching threshold. Waist circumference 86cm is 2cm from the 88cm cutoff.
              </div>
            )}
          </Panel>

          {/* --- Screening Scores --- */}
          <Panel>
            <PanelHeader title="Screening Instruments" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { name: "FINDRISC (diabetes risk)", score: SCREENING_SCORES.findrisc.score, max: SCREENING_SCORES.findrisc.maxScore, level: SCREENING_SCORES.findrisc.level, color: T.amber },
                { name: "SCORE2 (cardiovascular)", score: `${SCREENING_SCORES.score2.riskPercent}%`, max: null, level: SCREENING_SCORES.score2.level, color: T.green },
                { name: "PHQ-9 (depression)", score: SCREENING_SCORES.phq9.score, max: SCREENING_SCORES.phq9.maxScore, level: SCREENING_SCORES.phq9.level, color: T.green },
                { name: "GAD-7 (anxiety)", score: SCREENING_SCORES.gad7.score, max: SCREENING_SCORES.gad7.maxScore, level: SCREENING_SCORES.gad7.level, color: T.green },
                { name: "AUDIT-C (alcohol)", score: SCREENING_SCORES.auditC.score, max: SCREENING_SCORES.auditC.maxScore, level: SCREENING_SCORES.auditC.level, color: T.green },
              ].map((s) => (
                <div
                  key={s.name}
                  style={{
                    padding: 8,
                    background: "#F7FAFC",
                    borderRadius: 4,
                  }}
                >
                  <div style={{ fontSize: 10, color: T.textSec, fontFamily: T.font, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: T.fontMono, color: s.color }}>
                      {s.score}
                    </span>
                    {s.max && (
                      <span style={{ fontSize: 10, color: T.textSec }}>/ {s.max}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 9, color: T.textSec, textTransform: "capitalize" }}>
                    {String(s.level).replace(/_/g, " ")}
                  </div>
                </div>
              ))}
              {/* EQ-5D */}
              <div
                style={{
                  padding: 8,
                  background: "#F7FAFC",
                  borderRadius: 4,
                  gridColumn: "1 / -1",
                }}
              >
                <div style={{ fontSize: 10, color: T.textSec, fontFamily: T.font, marginBottom: 4 }}>EQ-5D (quality of life)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { label: "Mobility", val: SCREENING_SCORES.eq5d.mobility },
                    { label: "Self-care", val: SCREENING_SCORES.eq5d.selfCare },
                    { label: "Activities", val: SCREENING_SCORES.eq5d.activities },
                    { label: "Pain", val: SCREENING_SCORES.eq5d.pain },
                    { label: "Anxiety", val: SCREENING_SCORES.eq5d.anxiety },
                  ].map((d) => (
                    <div key={d.label} style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.fontMono, color: d.val === 1 ? T.green : T.amber }}>{d.val}</div>
                      <div style={{ fontSize: 8, color: T.textSec }}>{d.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, color: T.textSec, marginTop: 4 }}>
                  {SCREENING_SCORES.eq5d.interpretation}
                </div>
              </div>
            </div>
          </Panel>

          {/* --- Family History --- */}
          <Panel>
            <PanelHeader title="Family History" />
            {FAMILY_HISTORY.map((f) => (
              <div
                key={`${f.relative}-${f.condition}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 0",
                  borderBottom: `1px solid #F7FAFC`,
                  fontSize: 11,
                  fontFamily: T.font,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: T.text }}>{f.relative}</span>
                  <span style={{ color: T.textSec, marginLeft: 4 }}>{f.condition}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: T.textSec }}>
                  <span>Age {f.ageAtDiagnosis}</span>
                  <span>{f.status}</span>
                </div>
              </div>
            ))}
          </Panel>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Biometrics, Training, Doctor, Messages */}
        {/* ============================================================ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* --- Biometrics --- */}
          <Panel>
            <PanelHeader title="Body Composition & Vitals" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[
                { label: "Weight", value: `${latestBio.weight}kg`, prev: prevBio ? `${prevBio.weight}kg` : null, color: latestBio.weight > (prevBio?.weight ?? 0) ? T.amber : T.green },
                { label: "BMI", value: latestBio.bmi.toFixed(1), prev: prevBio ? prevBio.bmi.toFixed(1) : null, color: latestBio.bmi > 25 ? T.amber : T.green },
                { label: "Waist", value: `${latestBio.waist}cm`, prev: prevBio ? `${prevBio.waist}cm` : null, color: latestBio.waist >= 88 ? T.red : latestBio.waist >= 85 ? T.amber : T.green },
                { label: "BP", value: latestBio.bloodPressure, prev: prevBio?.bloodPressure ?? null, color: T.amber },
              ].map((m) => (
                <div key={m.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: T.textSec, fontFamily: T.font, marginBottom: 2, textTransform: "uppercase" }}>{m.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: T.fontMono, color: m.color }}>{m.value}</div>
                  {m.prev && (
                    <div style={{ fontSize: 9, color: T.textSec }}>prev: {m.prev}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textSec, marginBottom: 4, textTransform: "uppercase" }}>Trend (8 readings)</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: T.fontMono }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ textAlign: "left", padding: "2px 0", fontWeight: 600, color: T.textSec, fontSize: 9, fontFamily: T.font }}>Date</th>
                  <th style={{ textAlign: "right", padding: "2px 0", fontWeight: 600, color: T.textSec, fontSize: 9, fontFamily: T.font }}>Wt</th>
                  <th style={{ textAlign: "right", padding: "2px 0", fontWeight: 600, color: T.textSec, fontSize: 9, fontFamily: T.font }}>BMI</th>
                  <th style={{ textAlign: "right", padding: "2px 0", fontWeight: 600, color: T.textSec, fontSize: 9, fontFamily: T.font }}>Waist</th>
                  <th style={{ textAlign: "right", padding: "2px 0", fontWeight: 600, color: T.textSec, fontSize: 9, fontFamily: T.font }}>BP</th>
                </tr>
              </thead>
              <tbody>
                {BIOMETRICS_HISTORY.map((b) => (
                  <tr key={b.date} style={{ borderBottom: `1px solid #F7FAFC` }}>
                    <td style={{ padding: "2px 0", color: T.textSec, fontSize: 9 }}>{b.date}</td>
                    <td style={{ textAlign: "right", padding: "2px 0", color: T.text }}>{b.weight}</td>
                    <td style={{ textAlign: "right", padding: "2px 0", color: T.text }}>{b.bmi}</td>
                    <td style={{ textAlign: "right", padding: "2px 0", color: T.text }}>{b.waist}</td>
                    <td style={{ textAlign: "right", padding: "2px 0", color: T.text }}>{b.bloodPressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* --- Training Plan --- */}
          <Panel>
            <PanelHeader
              title="Training Plan"
              extra={
                <Badge label={`Week ${TRAINING_PLAN.currentWeek}/${TRAINING_PLAN.totalWeeks}`} color={T.accent} bg="#EBF5FF" />
              }
            />
            <div style={{ fontSize: 11, color: T.textSec, marginBottom: 6 }}>
              {TRAINING_PLAN.name} - {TRAINING_PLAN.goal}
            </div>
            <div style={{ fontSize: 10, color: T.textSec, marginBottom: 4 }}>
              By {TRAINING_PLAN.createdBy} / Reviewed by {TRAINING_PLAN.reviewedBy}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 4, background: "#EDF2F7", borderRadius: 2 }}>
                <div
                  style={{
                    height: 4,
                    width: `${(TRAINING_PLAN.currentWeek / TRAINING_PLAN.totalWeeks) * 100}%`,
                    background: T.accent,
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontSize: 10, fontFamily: T.fontMono, color: T.accent, fontWeight: 600 }}>
                {TRAINING_PLAN.totalCompleted} sessions done
              </span>
            </div>
            {TRAINING_PLAN.weeklySchedule.map((day, di) => {
              const done = di < TRAINING_PLAN.completedThisWeek;
              return (
                <div key={day.day} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: done ? T.green : "#EDF2F7",
                        color: done ? T.card : T.textSec,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 700,
                      }}
                    >
                      {done ? "\u2713" : " "}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{day.day}</span>
                    <span style={{ fontSize: 10, color: T.textSec }}>{day.name}</span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: T.font, marginLeft: 20 }}>
                    {day.exercises.map((ex) => (
                      <tr key={ex.name} style={{ borderBottom: `1px solid #F7FAFC` }}>
                        <td style={{ padding: "2px 0", color: T.text, fontWeight: 500, width: "40%" }}>{ex.name}</td>
                        <td style={{ padding: "2px 0", color: T.textSec, fontFamily: T.fontMono }}>
                          {ex.sets}x{ex.reps} {ex.unit}{ex.weight ? ` @ ${ex.weight}${ex.unit === "kg" ? "kg" : "kg"}` : ""}
                        </td>
                        <td style={{ padding: "2px 0", color: T.textSec, fontSize: 9 }}>{ex.notes}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              );
            })}
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textSec, marginTop: 6, marginBottom: 4, textTransform: "uppercase" }}>Medical Considerations</div>
            {TRAINING_PLAN.medicalConsiderations.map((mc, i) => (
              <div key={i} style={{ fontSize: 10, color: T.textSec, padding: "2px 0", lineHeight: 1.4 }}>
                - {mc}
              </div>
            ))}
          </Panel>

          {/* --- Doctor Notes --- */}
          <Panel>
            <PanelHeader title="Doctor Notes" />
            {DOCTOR_NOTES.map((n) => (
              <div
                key={n.date}
                style={{
                  padding: "6px 0",
                  borderBottom: `1px solid #F7FAFC`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{n.author}</span>
                    <Badge label={n.type} color={T.accent} bg="#EBF5FF" />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: T.fontMono, color: T.textSec }}>{n.date}</span>
                </div>
                <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
                  {n.note}
                </p>
              </div>
            ))}
          </Panel>

          {/* --- Messages --- */}
          <Panel>
            <PanelHeader
              title="Messages - Dr. Johansson"
              extra={
                <span style={{ fontSize: 10, color: T.accent, fontWeight: 600, cursor: "pointer" }}>Reply</span>
              }
            />
            {MESSAGES.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "6px 0",
                  borderBottom: `1px solid #F7FAFC`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: msg.from === "doctor" ? T.accent : T.text,
                    }}
                  >
                    {msg.from === "doctor" ? "Dr. Johansson" : "Anna"}
                  </span>
                  <span style={{ fontSize: 9, fontFamily: T.fontMono, color: T.textSec }}>
                    {new Date(msg.date).toLocaleString("en-SE", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, margin: 0 }}>
                  {msg.text}
                </p>
              </div>
            ))}
          </Panel>

          {/* --- Doctor Visit History --- */}
          <Panel>
            <PanelHeader title="Visit History" />
            {DOCTOR_VISITS.map((v) => (
              <div
                key={v.date}
                style={{
                  padding: "4px 0",
                  borderBottom: `1px solid #F7FAFC`,
                  fontSize: 11,
                  fontFamily: T.font,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 9, color: T.textSec }}>{v.date}</span>
                    <Badge label={v.type} color={T.accent} bg="#EBF5FF" />
                  </div>
                  <span style={{ fontSize: 9, color: T.textSec }}>{v.provider}</span>
                </div>
                <p style={{ fontSize: 10, color: T.textSec, lineHeight: 1.4, margin: 0 }}>
                  {v.summary}
                </p>
              </div>
            ))}
          </Panel>

          {/* --- AI Patient Summary --- */}
          <Panel>
            <PanelHeader title="AI Patient Summary" />
            <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
              {AI_PATIENT_SUMMARY}
            </p>
          </Panel>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}
      <div
        style={{
          padding: "8px 24px",
          borderTop: `1px solid ${T.border}`,
          background: T.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 10,
          fontFamily: T.font,
          color: T.textSec,
        }}
      >
        <span>Precura / Predictive Health Platform / {PATIENT.membershipPrice} SEK/year</span>
        <span>Data from 1177 + Precura labs. Not a substitute for medical advice.</span>
      </div>
    </div>
  );
}
