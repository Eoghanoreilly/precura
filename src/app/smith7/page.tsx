"use client";

import React, { useState } from "react";
import {
  PATIENT,
  DOCTOR_VISITS,
  BLOOD_TEST_HISTORY,
  BIOMETRICS_HISTORY,
  MEDICATIONS,
  MEDICATION_HISTORY,
  CONDITIONS,
  VACCINATIONS,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  FAMILY_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Types
// ============================================================================

type EventType =
  | "blood-test"
  | "doctor-visit"
  | "medication-start"
  | "medication-end"
  | "condition-diagnosed"
  | "condition-resolved"
  | "vaccination"
  | "biometric"
  | "training-start";

interface TimelineEvent {
  id: string;
  date: string;
  type: EventType;
  title: string;
  subtitle: string;
  details?: string;
  markers?: { label: string; value: string; status: "normal" | "borderline" | "abnormal" }[];
  connectionTo?: string;
  connectionLabel?: string;
}

// ============================================================================
// Build the unified timeline from all data sources
// ============================================================================

function buildTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Blood tests
  BLOOD_TEST_HISTORY.forEach((session, i) => {
    const markers = session.results.map((r) => ({
      label: `${r.plainName} (${r.shortName})`,
      value: `${r.value} ${r.unit}`,
      status: r.status,
    }));
    events.push({
      id: `blood-${i}`,
      date: session.date,
      type: "blood-test",
      title: "Blood test results",
      subtitle: `${session.orderedBy} / ${session.lab}`,
      markers,
    });
  });

  // Doctor visits
  DOCTOR_VISITS.forEach((visit, i) => {
    events.push({
      id: `visit-${i}`,
      date: visit.date,
      type: "doctor-visit",
      title: visit.type,
      subtitle: visit.provider,
      details: visit.summary,
    });
  });

  // Active medications started
  MEDICATIONS.forEach((med, i) => {
    events.push({
      id: `med-start-${i}`,
      date: med.startDate,
      type: "medication-start",
      title: `Started ${med.name} ${med.dose}`,
      subtitle: `${med.frequency} for ${med.purpose}`,
      details: `Prescribed by ${med.prescribedBy}`,
    });
  });

  // Past medications
  MEDICATION_HISTORY.forEach((med, i) => {
    events.push({
      id: `med-hist-start-${i}`,
      date: med.startDate,
      type: "medication-start",
      title: `Started ${med.name} ${med.dose}`,
      subtitle: `${med.frequency} for ${med.purpose}`,
      details: `Prescribed by ${med.prescribedBy}`,
    });
    if (med.endDate) {
      events.push({
        id: `med-hist-end-${i}`,
        date: med.endDate,
        type: "medication-end",
        title: `Stopped ${med.name}`,
        subtitle: `Completed course for ${med.purpose}`,
      });
    }
  });

  // Conditions diagnosed
  CONDITIONS.forEach((cond, i) => {
    events.push({
      id: `cond-${i}`,
      date: cond.diagnosedDate,
      type: "condition-diagnosed",
      title: `Diagnosed: ${cond.name}`,
      subtitle: `ICD-10: ${cond.icd10}`,
      details: `${cond.treatedBy}`,
    });
    if (cond.status === "resolved") {
      events.push({
        id: `cond-resolved-${i}`,
        date: cond.diagnosedDate,
        type: "condition-resolved",
        title: `Resolved: ${cond.name}`,
        subtitle: "No longer active",
      });
    }
  });

  // Vaccinations
  VACCINATIONS.forEach((vax, i) => {
    events.push({
      id: `vax-${i}`,
      date: vax.date,
      type: "vaccination",
      title: vax.name,
      subtitle: vax.provider,
    });
  });

  // Biometrics (only add if not same day as blood test or visit)
  BIOMETRICS_HISTORY.forEach((bio, i) => {
    const hasSameDayEvent = events.some(
      (e) => e.date === bio.date && (e.type === "blood-test" || e.type === "doctor-visit")
    );
    if (!hasSameDayEvent) {
      events.push({
        id: `bio-${i}`,
        date: bio.date,
        type: "biometric",
        title: "Biometric measurement",
        subtitle: `Weight ${bio.weight}kg / BMI ${bio.bmi} / BP ${bio.bloodPressure}`,
        markers: [
          { label: "Weight", value: `${bio.weight} kg`, status: "normal" },
          { label: "BMI", value: `${bio.bmi}`, status: bio.bmi > 27.5 ? "borderline" : "normal" },
          { label: "Blood pressure", value: bio.bloodPressure, status: "normal" },
          { label: "Waist", value: `${bio.waist} cm`, status: bio.waist > 86 ? "borderline" : "normal" },
        ],
      });
    }
  });

  // Training plan start
  events.push({
    id: "training-start",
    date: TRAINING_PLAN.startDate,
    type: "training-start",
    title: `Started: ${TRAINING_PLAN.name}`,
    subtitle: `Created by ${TRAINING_PLAN.createdBy}`,
    details: TRAINING_PLAN.goal,
  });

  // Sort by date descending (newest first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Add connections between related events
  addConnections(events);

  return events;
}

function addConnections(events: TimelineEvent[]) {
  // Connection: Enalapril start -> BP improvement
  const enalaprilStart = events.find((e) => e.id === "med-start-0");
  const bpFollowup = events.find(
    (e) => e.type === "doctor-visit" && e.date === "2025-03-15"
  );
  if (enalaprilStart && bpFollowup) {
    enalaprilStart.connectionTo = bpFollowup.id;
    enalaprilStart.connectionLabel =
      "3 years on Enalapril: BP dropped from 142/88 to 130/82";
  }

  // Connection: Back strain -> physio
  const backStrain = events.find(
    (e) => e.type === "doctor-visit" && e.date === "2023-09-10"
  );
  const physio = events.find(
    (e) => e.type === "doctor-visit" && e.date === "2023-10-20"
  );
  if (backStrain && physio) {
    backStrain.connectionTo = physio.id;
    backStrain.connectionLabel =
      "6 weeks later: cleared for light jogging after physio";
  }

  // Connection: Weight up -> glucose rise
  const bloodTest2024 = events.find((e) => e.id === "blood-2");
  const bloodTest2025 = events.find((e) => e.id === "blood-1");
  if (bloodTest2024 && bloodTest2025) {
    bloodTest2024.connectionTo = bloodTest2025.id;
    bloodTest2024.connectionLabel =
      "Glucose crept from 5.4 to 5.5 as weight held at 77-79kg";
  }

  // Connection: First glucose reading -> latest
  const firstBlood = events.find((e) => e.id === "blood-5");
  const latestBlood = events.find((e) => e.id === "blood-0");
  if (firstBlood && latestBlood) {
    firstBlood.connectionTo = latestBlood.id;
    firstBlood.connectionLabel =
      "5-year trend: glucose 5.0 to 5.8, cholesterol 4.6 to 5.1";
  }

  // Connection: Hypertension diagnosis -> medication start
  const hypertensionDx = events.find((e) => e.id === "cond-0");
  if (hypertensionDx && enalaprilStart) {
    hypertensionDx.connectionTo = enalaprilStart.id;
    hypertensionDx.connectionLabel =
      "6 days later: started Enalapril 5mg daily";
  }

  // Connection: Training plan start -> latest blood test
  const trainingStart = events.find((e) => e.id === "training-start");
  if (trainingStart && latestBlood) {
    trainingStart.connectionTo = latestBlood.id;
    trainingStart.connectionLabel =
      "10 weeks into metabolic health program at time of latest test";
  }

  // Connection: Precura onboarding -> training start
  const precuraVisit = events.find(
    (e) => e.type === "doctor-visit" && e.date === "2026-01-15"
  );
  if (precuraVisit && trainingStart) {
    precuraVisit.connectionTo = trainingStart.id;
    precuraVisit.connectionLabel =
      "5 days later: personalized training plan began";
  }
}

// ============================================================================
// Visual constants
// ============================================================================

const TYPE_CONFIG: Record<
  EventType,
  { icon: string; color: string; bg: string; label: string }
> = {
  "blood-test": {
    icon: "&#128308;",
    color: "#C85A54",
    bg: "rgba(200,90,84,0.08)",
    label: "Blood test",
  },
  "doctor-visit": {
    icon: "&#128100;",
    color: "#2D6A4F",
    bg: "rgba(45,106,79,0.08)",
    label: "Doctor visit",
  },
  "medication-start": {
    icon: "&#128138;",
    color: "#5B7AA3",
    bg: "rgba(91,122,163,0.08)",
    label: "Medication",
  },
  "medication-end": {
    icon: "&#9898;",
    color: "#6D6B63",
    bg: "rgba(109,107,99,0.06)",
    label: "Medication ended",
  },
  "condition-diagnosed": {
    icon: "&#9888;",
    color: "#D4A574",
    bg: "rgba(212,165,116,0.1)",
    label: "Diagnosis",
  },
  "condition-resolved": {
    icon: "&#9989;",
    color: "#558B6B",
    bg: "rgba(85,139,107,0.08)",
    label: "Resolved",
  },
  vaccination: {
    icon: "&#128137;",
    color: "#7B8A6E",
    bg: "rgba(123,138,110,0.08)",
    label: "Vaccination",
  },
  biometric: {
    icon: "&#128207;",
    color: "#8B7355",
    bg: "rgba(139,115,85,0.08)",
    label: "Measurement",
  },
  "training-start": {
    icon: "&#127947;",
    color: "#2D6A4F",
    bg: "rgba(45,106,79,0.08)",
    label: "Training",
  },
};

const STATUS_COLORS = {
  normal: { color: "#558B6B", bg: "rgba(85,139,107,0.1)" },
  borderline: { color: "#D4A574", bg: "rgba(212,165,116,0.12)" },
  abnormal: { color: "#C85A54", bg: "rgba(200,90,84,0.1)" },
};

// ============================================================================
// Glucose sparkline
// ============================================================================

function GlucoseSparkline() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;

  const min = Math.min(...data.map((d) => d.value)) - 0.3;
  const max = Math.max(...data.map((d) => d.value)) + 0.3;
  const w = 280;
  const h = 80;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (w - 2 * padding);
    const y = h - padding - ((d.value - min) / (max - min)) * (h - 2 * padding);
    return { x, y, value: d.value, year: d.date.slice(0, 4) };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Warning zone (above 5.6)
  const warnY =
    h - padding - ((5.6 - min) / (max - min)) * (h - 2 * padding);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Warning zone */}
      <rect
        x={padding}
        y={Math.max(0, warnY)}
        width={w - 2 * padding}
        height={h - padding - Math.max(0, warnY)}
        fill="rgba(212,165,116,0.1)"
        rx={4}
      />
      <line
        x1={padding}
        y1={warnY}
        x2={w - padding}
        y2={warnY}
        stroke="#D4A574"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text
        x={w - padding + 2}
        y={warnY + 4}
        fill="#D4A574"
        style={{ fontSize: 9, fontFamily: "-apple-system, sans-serif" }}
      >
        5.6
      </text>

      {/* Line */}
      <path d={pathD} fill="none" stroke="#C85A54" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3.5} fill={i === points.length - 1 ? "#C85A54" : "#D4A574"} stroke="#FFFBF5" strokeWidth={2} />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fill="#3E2723"
            style={{
              fontSize: 10,
              fontWeight: i === points.length - 1 ? 700 : 400,
              fontFamily: "-apple-system, sans-serif",
            }}
          >
            {p.value}
          </text>
          <text
            x={p.x}
            y={h - 3}
            textAnchor="middle"
            fill="#6D6B63"
            style={{ fontSize: 8, fontFamily: "-apple-system, sans-serif" }}
          >
            {p.year}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ============================================================================
// Connection arrow component
// ============================================================================

function ConnectionBadge({ label }: { label: string }) {
  return (
    <div
      className="flex items-start gap-2 mt-3 mb-1"
      style={{
        paddingLeft: 12,
        borderLeft: "2px solid #2D6A4F",
        marginLeft: 6,
      }}
    >
      <div
        style={{
          background: "rgba(45,106,79,0.08)",
          border: "1px solid rgba(45,106,79,0.2)",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 12,
          lineHeight: 1.4,
          color: "#2D6A4F",
          fontFamily: "-apple-system, sans-serif",
          fontWeight: 500,
          fontStyle: "italic",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ============================================================================
// Event card component
// ============================================================================

function EventCard({ event, isExpanded, onToggle }: { event: TimelineEvent; isExpanded: boolean; onToggle: () => void }) {
  const config = TYPE_CONFIG[event.type];
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });

  return (
    <div id={event.id}>
      {/* Date + node dot + card row */}
      <div className="flex items-start gap-0" style={{ position: "relative" }}>
        {/* Date column */}
        <div
          className="flex flex-col items-end shrink-0"
          style={{ width: 52, paddingRight: 0, paddingTop: 12 }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#3E2723",
              fontFamily: '"Lora", Georgia, serif',
              lineHeight: 1,
            }}
          >
            {day}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#6D6B63",
              fontFamily: "-apple-system, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {month}
          </span>
        </div>

        {/* Spine dot */}
        <div
          className="shrink-0 flex flex-col items-center"
          style={{ width: 28, position: "relative" }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: config.color,
              border: "3px solid #FFFBF5",
              boxShadow: `0 0 0 2px ${config.color}`,
              marginTop: 16,
              position: "relative",
              zIndex: 2,
            }}
          />
        </div>

        {/* Card */}
        <div
          className="flex-1"
          style={{ minWidth: 0, paddingTop: 4, paddingBottom: 4 }}
        >
          <button
            onClick={onToggle}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              border: "1px solid #D7CCC8",
              borderRadius: 10,
              background: "#FAF8F5",
              padding: "12px 14px",
              boxShadow: "0 2px 8px rgba(62,39,35,0.12)",
              transition: "all 0.2s ease",
            }}
          >
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                  color: config.color,
                  background: config.bg,
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                {config.label}
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#3E2723",
                fontFamily: '"Lora", Georgia, serif',
                lineHeight: 1.3,
              }}
            >
              {event.title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 13,
                color: "#6D6B63",
                fontFamily: "-apple-system, sans-serif",
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              {event.subtitle}
            </div>

            {/* Blood markers (always visible if present) */}
            {event.markers && event.markers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {event.markers.slice(0, isExpanded ? undefined : 4).map((m, i) => {
                  const sc = STATUS_COLORS[m.status];
                  return (
                    <span
                      key={i}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontFamily: "-apple-system, sans-serif",
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: sc.bg,
                        color: sc.color,
                        fontWeight: 500,
                      }}
                    >
                      {m.label}: {m.value}
                    </span>
                  );
                })}
                {!isExpanded && event.markers.length > 4 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6D6B63",
                      padding: "3px 8px",
                      fontFamily: "-apple-system, sans-serif",
                    }}
                  >
                    +{event.markers.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Expanded details */}
            {isExpanded && event.details && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px solid #D7CCC8",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#3E2723",
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                {event.details}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Connection line to related event */}
      {event.connectionLabel && (
        <div className="flex" style={{ position: "relative" }}>
          <div style={{ width: 52 }} />
          <div
            className="flex flex-col items-center"
            style={{ width: 28 }}
          />
          <div className="flex-1" style={{ paddingLeft: 2 }}>
            <ConnectionBadge label={event.connectionLabel} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main page component
// ============================================================================

export default function Smith7Page() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const events = buildTimeline();

  // Group events by year
  const eventsByYear: Record<string, TimelineEvent[]> = {};
  events.forEach((e) => {
    const year = e.date.slice(0, 4);
    if (!eventsByYear[year]) eventsByYear[year] = [];
    eventsByYear[year].push(e);
  });

  const years = Object.keys(eventsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div
      className="min-h-dvh"
      style={{ background: "#FFFBF5", paddingBottom: 120 }}
    >
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header
        className="px-5 pt-12 pb-8"
        style={{ maxWidth: 640, margin: "0 auto" }}
      >
        {/* Precura mark */}
        <div
          className="flex items-center gap-2 mb-8"
          style={{ opacity: 0.7 }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#2D6A4F",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2D6A4F",
              fontFamily: "-apple-system, sans-serif",
            }}
          >
            Precura
          </span>
        </div>

        {/* Patient name and title */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#3E2723",
            fontFamily: '"Lora", Georgia, serif',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {PATIENT.name}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#6D6B63",
            fontFamily: "-apple-system, sans-serif",
            marginTop: 4,
          }}
        >
          {PATIENT.age} years / {PATIENT.vardcentral} / Member since{" "}
          {new Date(PATIENT.memberSince).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* The big insight - what Precura caught */}
        <div
          className="mt-6"
          style={{
            background: "rgba(200,90,84,0.06)",
            border: "1px solid rgba(200,90,84,0.2)",
            borderRadius: 10,
            padding: "16px 16px 12px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#C85A54",
              fontFamily: "-apple-system, sans-serif",
              marginBottom: 6,
            }}
          >
            Pattern detected
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#3E2723",
              fontFamily: '"Lora", Georgia, serif',
              lineHeight: 1.35,
            }}
          >
            Fasting glucose (blood sugar) has risen steadily over 5 years
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6D6B63",
              fontFamily: "-apple-system, sans-serif",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            From 5.0 to 5.8 mmol/L. Each visit looked normal individually.
            But connected together, the trend points toward pre-diabetes.
            With family history (mother diagnosed at 58), this matters.
          </div>

          {/* Sparkline */}
          <div className="mt-3">
            <GlucoseSparkline />
          </div>
        </div>

        {/* Risk snapshot */}
        <div className="flex gap-3 mt-5">
          {[
            {
              label: "Diabetes risk",
              level: RISK_ASSESSMENTS.diabetes.riskLabel,
              color: "#D4A574",
              trend: "Rising",
            },
            {
              label: "Heart risk",
              level: RISK_ASSESSMENTS.cardiovascular.riskLabel,
              color: "#558B6B",
              trend: "Stable",
            },
            {
              label: "Metabolic syndrome",
              level: `${RISK_ASSESSMENTS.metabolicSyndrome.metCount} of 5 criteria`,
              color: "#D4A574",
              trend: "Approaching",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                background: "#FAF8F5",
                border: "1px solid #D7CCC8",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#6D6B63",
                  fontFamily: "-apple-system, sans-serif",
                  fontWeight: 500,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: r.color,
                  fontFamily: "-apple-system, sans-serif",
                  marginTop: 2,
                }}
              >
                {r.level}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#6D6B63",
                  fontFamily: "-apple-system, sans-serif",
                  marginTop: 1,
                }}
              >
                {r.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Family history callout */}
        <div
          className="mt-5"
          style={{
            background: "rgba(45,106,79,0.06)",
            border: "1px solid rgba(45,106,79,0.15)",
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#2D6A4F",
              fontFamily: "-apple-system, sans-serif",
              marginBottom: 8,
            }}
          >
            Family history
          </div>
          <div className="flex flex-col gap-2">
            {FAMILY_HISTORY.map((fh, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between"
                style={{
                  fontSize: 13,
                  fontFamily: "-apple-system, sans-serif",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: "#3E2723", fontWeight: 500 }}>
                  {fh.relative}
                </span>
                <span style={{ color: "#6D6B63", textAlign: "right", marginLeft: 8 }}>
                  {fh.condition}, age {fh.ageAtDiagnosis}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* TIMELINE */}
      {/* ================================================================== */}
      <main
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 12px",
          position: "relative",
        }}
      >
        {/* The green spine line */}
        <div
          style={{
            position: "absolute",
            left: 65,
            top: 0,
            bottom: 0,
            width: 3,
            background: "linear-gradient(to bottom, #2D6A4F, rgba(45,106,79,0.15))",
            borderRadius: 2,
            zIndex: 0,
          }}
        />

        {years.map((year) => (
          <section key={year} id={`year-${year}`} style={{ position: "relative" }}>
            {/* Year marker */}
            <div
              className="flex items-center gap-0 mb-2"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                paddingTop: 24,
                paddingBottom: 8,
              }}
            >
              <div
                className="flex items-center justify-end"
                style={{ width: 52 }}
              />
              <div
                className="flex items-center justify-center"
                style={{ width: 28 }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    background: "#2D6A4F",
                    border: "3px solid #FFFBF5",
                    boxShadow: "0 0 0 2px #2D6A4F",
                    zIndex: 2,
                  }}
                />
              </div>
              <div
                className="flex-1"
                style={{ paddingLeft: 8 }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#2D6A4F",
                    fontFamily: '"Lora", Georgia, serif',
                    lineHeight: 1,
                    background: "#FFFBF5",
                    paddingRight: 12,
                  }}
                >
                  {year}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6D6B63",
                    fontFamily: "-apple-system, sans-serif",
                    marginLeft: 8,
                  }}
                >
                  {eventsByYear[year].length} event{eventsByYear[year].length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Events for this year */}
            <div className="flex flex-col gap-1">
              {eventsByYear[year].map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isExpanded={expandedId === event.id}
                  onToggle={() =>
                    setExpandedId(expandedId === event.id ? null : event.id)
                  }
                />
              ))}
            </div>
          </section>
        ))}

        {/* Timeline end marker */}
        <div className="flex items-center gap-0 mt-6 mb-12">
          <div style={{ width: 52 }} />
          <div
            className="flex items-center justify-center"
            style={{ width: 28 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "rgba(45,106,79,0.25)",
                zIndex: 2,
              }}
            />
          </div>
          <div className="flex-1" style={{ paddingLeft: 8 }}>
            <span
              style={{
                fontSize: 13,
                color: "#6D6B63",
                fontFamily: "-apple-system, sans-serif",
                fontStyle: "italic",
              }}
            >
              Beginning of records
            </span>
          </div>
        </div>
      </main>

      {/* ================================================================== */}
      {/* DOCTOR'S NOTES SECTION */}
      {/* ================================================================== */}
      <section
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            borderTop: "1px solid #D7CCC8",
            paddingTop: 32,
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: "#3E2723",
              fontFamily: '"Lora", Georgia, serif',
              margin: "0 0 16px 0",
            }}
          >
            Doctor&apos;s notes
          </h2>

          <div className="flex flex-col gap-4">
            {DOCTOR_NOTES.map((note, i) => (
              <div
                key={i}
                style={{
                  background: "#FAF8F5",
                  border: "1px solid #D7CCC8",
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: "0 2px 8px rgba(62,39,35,0.12)",
                }}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#3E2723",
                      fontFamily: '"Lora", Georgia, serif',
                    }}
                  >
                    {note.type}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#6D6B63",
                      fontFamily: "-apple-system, sans-serif",
                    }}
                  >
                    {new Date(note.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#2D6A4F",
                    fontWeight: 500,
                    fontFamily: "-apple-system, sans-serif",
                    marginBottom: 8,
                  }}
                >
                  {note.author}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#3E2723",
                    fontFamily: "-apple-system, sans-serif",
                    lineHeight: 1.65,
                    whiteSpace: "pre-line",
                  }}
                >
                  {note.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer
        className="px-5 pb-12 pt-8"
        style={{
          maxWidth: 640,
          margin: "0 auto",
          borderTop: "1px solid #D7CCC8",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: "#2D6A4F",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#2D6A4F",
              fontFamily: "-apple-system, sans-serif",
            }}
          >
            Precura
          </span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "#6D6B63",
            fontFamily: "-apple-system, sans-serif",
            lineHeight: 1.6,
            maxWidth: 400,
          }}
        >
          Connecting the dots across years of health data.
          Individual visits look normal. The trend tells the real story.
        </p>
        <p
          style={{
            fontSize: 11,
            color: "#6D6B63",
            fontFamily: "-apple-system, sans-serif",
            marginTop: 12,
            opacity: 0.6,
          }}
        >
          Next blood test: {new Date(PATIENT.nextBloodTest).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </footer>
    </div>
  );
}
