"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Activity, TestTube, ChevronRight, ChevronDown, ChevronUp,
  Calendar, Pill, Stethoscope, Syringe, Dumbbell,
  AlertTriangle, TrendingUp, TrendingDown, Heart, Brain,
  ArrowLeft, Link2, Eye, Filter, Search, Clock,
  Minus, Plus, X, ChevronLeft,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS, FAMILY_HISTORY,
  BIOMETRICS_HISTORY, MESSAGES, DOCTOR_NOTES, TRAINING_PLAN,
  CONDITIONS, MEDICATIONS, MEDICATION_HISTORY, DOCTOR_VISITS,
  VACCINATIONS, getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Types
// ============================================================================

type EventType = "blood_test" | "doctor_visit" | "medication_start" | "medication_end" |
  "condition_diagnosed" | "condition_resolved" | "vaccination" | "biometric" |
  "training_start" | "precura_join" | "insight";

interface TimelineEvent {
  id: string;
  date: string;
  type: EventType;
  title: string;
  subtitle: string;
  detail?: string;
  icon: EventType;
  severity: "normal" | "watch" | "alert" | "positive" | "neutral";
  connections: string[]; // IDs of related events
  markers?: { name: string; value: string; status: "normal" | "borderline" | "abnormal" }[];
  expanded?: boolean;
}

interface Connection {
  fromId: string;
  toId: string;
  label: string;
  type: "cause_effect" | "correlation" | "temporal" | "improvement";
}

// ============================================================================
// Build the unified timeline from ALL data sources
// ============================================================================

function buildTimeline(): { events: TimelineEvent[]; connections: Connection[] } {
  const events: TimelineEvent[] = [];
  const connections: Connection[] = [];

  // --- Blood tests ---
  BLOOD_TEST_HISTORY.forEach((session, idx) => {
    const borderline = session.results.filter(r => r.status === "borderline");
    const abnormal = session.results.filter(r => r.status === "abnormal");
    const severity = abnormal.length > 0 ? "alert" as const : borderline.length > 0 ? "watch" as const : "normal" as const;

    const markers = session.results.map(r => ({
      name: `${r.plainName} (${r.shortName})`,
      value: `${r.value} ${r.unit}`,
      status: r.status,
    }));

    const flagged = [...abnormal, ...borderline];
    const subtitle = flagged.length > 0
      ? `${flagged.map(r => `${r.plainName} ${r.value} ${r.unit}`).join(", ")}`
      : `${session.results.length} markers, all normal`;

    events.push({
      id: `blood-${session.date}`,
      date: session.date,
      type: "blood_test",
      title: "Blood test panel",
      subtitle,
      detail: `Ordered by ${session.orderedBy}. Lab: ${session.lab}. ${session.results.length} markers tested.`,
      icon: "blood_test",
      severity,
      connections: [],
      markers,
    });
  });

  // --- Doctor visits ---
  DOCTOR_VISITS.forEach((visit) => {
    events.push({
      id: `visit-${visit.date}`,
      date: visit.date,
      type: "doctor_visit",
      title: visit.type,
      subtitle: visit.provider,
      detail: visit.summary,
      icon: "doctor_visit",
      severity: "neutral",
      connections: [],
    });
  });

  // --- Conditions diagnosed ---
  CONDITIONS.forEach((cond) => {
    events.push({
      id: `cond-${cond.diagnosedDate}`,
      date: cond.diagnosedDate,
      type: cond.status === "resolved" ? "condition_resolved" : "condition_diagnosed",
      title: `Diagnosed: ${cond.name}`,
      subtitle: `${cond.icd10} - by ${cond.treatedBy}`,
      detail: cond.status === "resolved" ? "This condition has been resolved." : "Ongoing condition, currently active.",
      icon: cond.status === "resolved" ? "condition_resolved" : "condition_diagnosed",
      severity: cond.status === "resolved" ? "normal" : "watch",
      connections: [],
    });
  });

  // --- Medications started ---
  MEDICATIONS.forEach((med) => {
    events.push({
      id: `med-start-${med.name.toLowerCase()}`,
      date: med.startDate,
      type: "medication_start",
      title: `Started ${med.name} ${med.dose}`,
      subtitle: `${med.frequency} - ${med.purpose}`,
      detail: `Prescribed by ${med.prescribedBy}. ${med.active ? "Currently active." : "Discontinued."}`,
      icon: "medication_start",
      severity: "neutral",
      connections: [],
    });
  });

  // --- Medication history (completed) ---
  MEDICATION_HISTORY.forEach((med) => {
    events.push({
      id: `med-hist-start-${med.name.toLowerCase()}`,
      date: med.startDate,
      type: "medication_start",
      title: `Started ${med.name} ${med.dose}`,
      subtitle: `${med.frequency} - ${med.purpose}`,
      detail: `Prescribed by ${med.prescribedBy}. Temporary course.`,
      icon: "medication_start",
      severity: "neutral",
      connections: [],
    });
    if (med.endDate) {
      events.push({
        id: `med-hist-end-${med.name.toLowerCase()}`,
        date: med.endDate,
        type: "medication_end",
        title: `Completed ${med.name}`,
        subtitle: `Course finished - ${med.purpose}`,
        icon: "medication_end",
        severity: "normal",
        connections: [],
      });
    }
  });

  // --- Vaccinations ---
  VACCINATIONS.forEach((vax) => {
    events.push({
      id: `vax-${vax.date}`,
      date: vax.date,
      type: "vaccination",
      title: vax.name,
      subtitle: vax.provider,
      icon: "vaccination",
      severity: "positive",
      connections: [],
    });
  });

  // --- Biometrics (only include a few key inflection points, not every single one) ---
  BIOMETRICS_HISTORY.forEach((b) => {
    events.push({
      id: `bio-${b.date}`,
      date: b.date,
      type: "biometric",
      title: "Biometrics measured",
      subtitle: `${b.weight}kg / BMI ${b.bmi} / BP ${b.bloodPressure} / Waist ${b.waist}cm`,
      icon: "biometric",
      severity: "neutral",
      connections: [],
      markers: [
        { name: "Weight", value: `${b.weight} kg`, status: b.bmi >= 28 ? "borderline" : "normal" },
        { name: "BMI", value: `${b.bmi}`, status: b.bmi >= 28 ? "borderline" : "normal" },
        { name: "Blood pressure", value: b.bloodPressure, status: parseInt(b.bloodPressure) >= 140 ? "abnormal" : parseInt(b.bloodPressure) >= 130 ? "borderline" : "normal" },
        { name: "Waist", value: `${b.waist} cm`, status: b.waist >= 88 ? "abnormal" : b.waist >= 85 ? "borderline" : "normal" },
      ],
    });
  });

  // --- Training plan start ---
  events.push({
    id: "training-start",
    date: TRAINING_PLAN.startDate,
    type: "training_start",
    title: `Started: ${TRAINING_PLAN.name}`,
    subtitle: `Created by ${TRAINING_PLAN.createdBy}`,
    detail: `Goal: ${TRAINING_PLAN.goal}. Currently week ${TRAINING_PLAN.currentWeek} of ${TRAINING_PLAN.totalWeeks}. ${TRAINING_PLAN.totalCompleted} sessions completed.`,
    icon: "training_start",
    severity: "positive",
    connections: [],
  });

  // --- Precura membership ---
  events.push({
    id: "precura-join",
    date: PATIENT.memberSince,
    type: "precura_join",
    title: "Joined Precura",
    subtitle: "Annual membership - Predictive health monitoring",
    detail: "Started comprehensive health tracking with Precura. Historical health data imported from 1177.",
    icon: "precura_join",
    severity: "positive",
    connections: [],
  });

  // ============================================================================
  // Build connections - THIS IS THE CORE VALUE PROPOSITION
  // ============================================================================

  // Hypertension diagnosis -> Enalapril start
  connections.push({
    fromId: "cond-2022-03-14",
    toId: "med-start-enalapril",
    label: "6 days later, started Enalapril 5mg to control blood pressure",
    type: "cause_effect",
  });

  // Enalapril start -> BP improvement (2022 BP 142/88 -> 2023 BP 132/84)
  connections.push({
    fromId: "med-start-enalapril",
    toId: "bio-2023-03-10",
    label: "12 months on Enalapril: BP dropped from 142/88 to 132/84",
    type: "improvement",
  });

  // Blood test glucose rising trend across years
  connections.push({
    fromId: "blood-2021-04-10",
    toId: "blood-2026-03-27",
    label: "Glucose rose from 5.0 to 5.8 over 5 years - nobody flagged this until Precura",
    type: "correlation",
  });

  // Weight increase -> glucose rise correlation
  connections.push({
    fromId: "bio-2021-04-10",
    toId: "bio-2024-11-10",
    label: "Weight increased 74kg to 79kg (+5kg) as glucose steadily climbed",
    type: "correlation",
  });

  // Back strain -> medications
  connections.push({
    fromId: "cond-2023-09-10",
    toId: "med-hist-start-naproxen",
    label: "Back strain treated with 2-week Naproxen + Omeprazol course",
    type: "cause_effect",
  });

  // Doctor visit 2023-09-10 -> physiotherapy
  connections.push({
    fromId: "visit-2023-09-10",
    toId: "visit-2023-10-20",
    label: "Referred to physiotherapy, cleared for light jogging after 6 weeks",
    type: "temporal",
  });

  // Precura join -> comprehensive blood test
  connections.push({
    fromId: "precura-join",
    toId: "blood-2026-03-27",
    label: "Precura ordered comprehensive panel - 10 markers vs typical 3-4 at vardcentral",
    type: "cause_effect",
  });

  // Training start -> latest biometrics improvement
  connections.push({
    fromId: "training-start",
    toId: "bio-2026-03-15",
    label: "After 8 weeks of training: weight stable at 78kg, BP improved to 132/82",
    type: "improvement",
  });

  // Cholesterol creeping up alongside glucose
  connections.push({
    fromId: "blood-2021-04-10",
    toId: "blood-2026-03-27",
    label: "Total cholesterol rose from 4.6 to 5.1 alongside glucose - metabolic pattern",
    type: "correlation",
  });

  // BP peak at 2024-11-10 (138/86) coincided with peak weight (79kg)
  connections.push({
    fromId: "bio-2024-11-10",
    toId: "bio-2025-03-15",
    label: "Peak weight 79kg + BP 138/86 in Nov 2024 - dropped to 77kg + 130/82 by March",
    type: "correlation",
  });

  // Sort events by date descending (newest first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Assign connection IDs to events
  connections.forEach(conn => {
    const fromEvent = events.find(e => e.id === conn.fromId);
    const toEvent = events.find(e => e.id === conn.toId);
    if (fromEvent && !fromEvent.connections.includes(conn.toId)) fromEvent.connections.push(conn.toId);
    if (toEvent && !toEvent.connections.includes(conn.fromId)) toEvent.connections.push(conn.fromId);
  });

  return { events, connections };
}

// ============================================================================
// Formatting helpers
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatMonth(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function formatYear(d: string) {
  return new Date(d).getFullYear().toString();
}

function yearFromDate(d: string) {
  return new Date(d).getFullYear();
}

function daysBetween(a: string, b: string) {
  return Math.round(Math.abs(new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================================
// Event config
// ============================================================================

const EVENT_CONFIG: Record<EventType, { color: string; bgColor: string; label: string }> = {
  blood_test: { color: "var(--red)", bgColor: "var(--red-bg)", label: "Blood test" },
  doctor_visit: { color: "var(--blue)", bgColor: "var(--blue-bg)", label: "Doctor visit" },
  medication_start: { color: "var(--purple)", bgColor: "var(--purple-bg)", label: "Medication started" },
  medication_end: { color: "var(--teal)", bgColor: "var(--teal-bg)", label: "Medication ended" },
  condition_diagnosed: { color: "var(--amber)", bgColor: "var(--amber-bg)", label: "Condition" },
  condition_resolved: { color: "var(--green)", bgColor: "var(--green-bg)", label: "Resolved" },
  vaccination: { color: "var(--teal)", bgColor: "var(--teal-bg)", label: "Vaccination" },
  biometric: { color: "var(--blue)", bgColor: "var(--blue-bg)", label: "Biometrics" },
  training_start: { color: "var(--green)", bgColor: "var(--green-bg)", label: "Training" },
  precura_join: { color: "var(--accent)", bgColor: "var(--accent-light)", label: "Precura" },
  insight: { color: "#0f5959", bgColor: "#e0f2f1", label: "Insight" },
};

function EventIcon({ type }: { type: EventType }) {
  const size = 16;
  switch (type) {
    case "blood_test": return <TestTube size={size} />;
    case "doctor_visit": return <Stethoscope size={size} />;
    case "medication_start": return <Pill size={size} />;
    case "medication_end": return <Pill size={size} />;
    case "condition_diagnosed": return <AlertTriangle size={size} />;
    case "condition_resolved": return <Heart size={size} />;
    case "vaccination": return <Syringe size={size} />;
    case "biometric": return <Activity size={size} />;
    case "training_start": return <Dumbbell size={size} />;
    case "precura_join": return <Brain size={size} />;
    case "insight": return <Link2 size={size} />;
    default: return <Calendar size={size} />;
  }
}

function SeverityIndicator({ severity }: { severity: string }) {
  if (severity === "alert") return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--red)", marginRight: 6 }} />;
  if (severity === "watch") return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", marginRight: 6 }} />;
  if (severity === "positive") return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--green)", marginRight: 6 }} />;
  return null;
}

// ============================================================================
// Glucose trend sparkline
// ============================================================================

function GlucoseTrend() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;

  const w = 260;
  const h = 80;
  const padX = 30;
  const padY = 12;
  const vals = data.map(d => d.value);
  const min = Math.min(...vals) - 0.3;
  const max = Math.max(...vals) + 0.3;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = padY + (1 - (d.value - min) / (max - min)) * (h - padY * 2);
    return { x, y, value: d.value, date: d.date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Reference line at 6.0 (upper normal)
  const refY = padY + (1 - (6.0 - min) / (max - min)) * (h - padY * 2);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      {/* Pre-diabetic zone */}
      <rect x={padX} y={padY} width={w - padX * 2} height={refY - padY} fill="var(--amber-bg)" opacity={0.5} rx={4} />

      {/* Reference line */}
      <line x1={padX} y1={refY} x2={w - padX} y2={refY} stroke="var(--amber)" strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />
      <text x={w - padX + 4} y={refY + 4} fill="var(--amber-text)" fontSize={9} fontFamily="var(--font-mono)">6.0</text>

      {/* Gradient fill under line */}
      <defs>
        <linearGradient id="glucGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f5959" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#0f5959" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${points[0].x},${h - padY} ${points.map(p => `${p.x},${p.y}`).join(" ")} ${points[points.length - 1].x},${h - padY}`}
        fill="url(#glucGrad)"
      />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#0f5959" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#0f5959" strokeWidth={2} />
          <text x={p.x} y={h - 1} textAnchor="middle" fill="var(--text-muted)" fontSize={8} fontFamily="var(--font-mono)">
            {new Date(p.date).getFullYear()}
          </text>
          <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#0f5959" fontSize={9} fontWeight={600} fontFamily="var(--font-mono)">
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ============================================================================
// Connection Line Component
// ============================================================================

function ConnectionCard({ conn, events }: { conn: Connection; events: TimelineEvent[] }) {
  const from = events.find(e => e.id === conn.fromId);
  const to = events.find(e => e.id === conn.toId);
  if (!from || !to) return null;

  const typeColors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
    cause_effect: { border: "#0f5959", bg: "#e0f7f5", text: "#0f5959", icon: "var(--teal)" },
    correlation: { border: "var(--amber)", bg: "var(--amber-bg)", text: "var(--amber-text)", icon: "var(--amber)" },
    improvement: { border: "var(--green)", bg: "var(--green-bg)", text: "var(--green-text)", icon: "var(--green)" },
    temporal: { border: "var(--blue)", bg: "var(--blue-bg)", text: "var(--blue-text)", icon: "var(--blue)" },
  };

  const c = typeColors[conn.type] || typeColors.temporal;
  const days = daysBetween(from.date, to.date);

  return (
    <div style={{
      padding: "14px 16px",
      borderRadius: 14,
      background: c.bg,
      border: `1.5px solid ${c.border}`,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link2 size={14} style={{ color: c.icon, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: c.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {conn.type === "cause_effect" ? "Cause / Effect" : conn.type === "correlation" ? "Pattern" : conn.type === "improvement" ? "Improvement" : "Timeline"}
        </span>
        <span style={{ fontSize: 10, color: c.text, opacity: 0.7, marginLeft: "auto" }}>
          {days > 0 ? `${days} days` : "Same day"}
        </span>
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: c.text, margin: 0 }}>
        {conn.label}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: c.text, opacity: 0.7 }}>
        <span>{formatDate(from.date)}</span>
        <span style={{ color: c.icon }}>-</span>
        <span>{formatDate(to.date)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Event Card Component
// ============================================================================

function EventCard({
  event,
  connections,
  allEvents,
  isHighlighted,
  onToggle,
  onHighlight,
}: {
  event: TimelineEvent;
  connections: Connection[];
  allEvents: TimelineEvent[];
  isHighlighted: boolean;
  onToggle: () => void;
  onHighlight: (id: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = EVENT_CONFIG[event.type];

  const relatedConnections = connections.filter(
    c => c.fromId === event.id || c.toId === event.id
  );

  return (
    <div
      id={`event-${event.id}`}
      style={{
        borderRadius: 16,
        background: isHighlighted ? config.bgColor : "var(--bg-card)",
        border: `1px solid ${isHighlighted ? config.color : "var(--border)"}`,
        boxShadow: isHighlighted ? `0 0 0 3px ${config.bgColor}` : "var(--shadow-sm)",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
      onMouseEnter={() => onHighlight(event.id)}
      onMouseLeave={() => onHighlight(null)}
    >
      {/* Header */}
      <button
        onClick={() => { onToggle(); setExpanded(!expanded); }}
        style={{
          width: "100%",
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: config.bgColor,
          color: config.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}>
          <EventIcon type={event.type} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <SeverityIndicator severity={event.severity} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              {event.title}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
            {event.subtitle}
          </p>

          {/* Connection count badge */}
          {relatedConnections.length > 0 && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              padding: "2px 8px",
              borderRadius: 20,
              background: "#0f5959",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
            }}>
              <Link2 size={10} />
              {relatedConnections.length} connection{relatedConnections.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 4 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{
          padding: "0 16px 16px",
          borderTop: "1px solid var(--divider)",
          animation: "fadeIn 0.2s ease",
        }}>
          {/* Detail text */}
          {event.detail && (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)", margin: "12px 0 0" }}>
              {event.detail}
            </p>
          )}

          {/* Markers table */}
          {event.markers && event.markers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {event.markers.map((m, i) => {
                const statusColor = m.status === "abnormal" ? "var(--red)" : m.status === "borderline" ? "var(--amber)" : "var(--green)";
                const statusBg = m.status === "abnormal" ? "var(--red-bg)" : m.status === "borderline" ? "var(--amber-bg)" : "var(--green-bg)";
                return (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: i < event.markers!.length - 1 ? "1px solid var(--divider)" : "none",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.name}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-mono)",
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: statusBg,
                      color: statusColor,
                    }}>
                      {m.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Connected insights */}
          {relatedConnections.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f5959", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Connected dots
              </span>
              {relatedConnections.map((conn, i) => (
                <ConnectionCard key={i} conn={conn} events={allEvents} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Year separator
// ============================================================================

function YearMarker({ year }: { year: number }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 0",
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 700,
        color: "#0f5959",
        letterSpacing: "-0.02em",
      }}>
        {year}
      </div>
      <div style={{ flex: 1, height: 2, background: "linear-gradient(to right, #0f5959, transparent)", borderRadius: 1 }} />
    </div>
  );
}

// ============================================================================
// Filter chips
// ============================================================================

const FILTER_OPTIONS: { type: EventType | "all" | "connections"; label: string; icon?: React.ReactNode }[] = [
  { type: "all", label: "All events" },
  { type: "connections", label: "Connections only", icon: <Link2 size={12} /> },
  { type: "blood_test", label: "Blood tests", icon: <TestTube size={12} /> },
  { type: "doctor_visit", label: "Visits", icon: <Stethoscope size={12} /> },
  { type: "medication_start", label: "Medications", icon: <Pill size={12} /> },
  { type: "biometric", label: "Biometrics", icon: <Activity size={12} /> },
  { type: "condition_diagnosed", label: "Conditions", icon: <AlertTriangle size={12} /> },
  { type: "vaccination", label: "Vaccinations", icon: <Syringe size={12} /> },
];

// ============================================================================
// Insight Hero - the key narrative
// ============================================================================

function InsightHero() {
  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(135deg, #0f5959 0%, #1a7a7a 50%, #0f5959 100%)",
      padding: "24px 20px",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
      }} />
      <div style={{
        position: "absolute", bottom: -30, left: 20,
        width: 60, height: 60, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Link2 size={18} style={{ opacity: 0.8 }} />
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>
            Nobody connected these dots until now
          </span>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>
          Fasting glucose: 5.0 to 5.8 in 5 years
        </h2>

        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, margin: "0 0 16px" }}>
          Each individual reading was flagged &quot;normal&quot; by Anna&apos;s vardcentral.
          But the 5-year trend tells a different story. Combined with family history
          of diabetes (mother at 58, grandmother at 62) and 4kg weight gain,
          the metabolic pattern is clear.
        </p>

        {/* Mini glucose trend */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "12px 8px 4px",
          display: "flex",
          justifyContent: "center",
        }}>
          <GlucoseTrend />
        </div>

        <div style={{
          marginTop: 14,
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.12)",
          fontSize: 12,
          lineHeight: 1.5,
        }}>
          <strong>10 connections identified</strong> between blood tests, biometrics,
          medications, and doctor visits. Scroll the timeline to explore each one.
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Stats bar
// ============================================================================

function StatsBar({ events, connections }: { events: TimelineEvent[]; connections: Connection[] }) {
  const stats = [
    { label: "Events", value: events.length, color: "#0f5959" },
    { label: "Connections", value: connections.length, color: "var(--amber)" },
    { label: "Blood tests", value: events.filter(e => e.type === "blood_test").length, color: "var(--red)" },
    { label: "Years tracked", value: 5, color: "var(--blue)" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 8,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: "10px 8px",
          borderRadius: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "var(--font-mono)" }}>
            {s.value}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function Smith7Page() {
  const { events, connections } = useMemo(() => buildTimeline(), []);
  const [filter, setFilter] = useState<EventType | "all" | "connections">("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Filter events
  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    if (filter === "connections") {
      const connectedIds = new Set<string>();
      connections.forEach(c => { connectedIds.add(c.fromId); connectedIds.add(c.toId); });
      return events.filter(e => connectedIds.has(e.id));
    }
    // For medication filter, include both start and end
    if (filter === "medication_start") {
      return events.filter(e => e.type === "medication_start" || e.type === "medication_end");
    }
    // For condition filter, include both diagnosed and resolved
    if (filter === "condition_diagnosed") {
      return events.filter(e => e.type === "condition_diagnosed" || e.type === "condition_resolved");
    }
    return events.filter(e => e.type === filter);
  }, [events, connections, filter]);

  // Group events by year
  const eventsByYear = useMemo(() => {
    const groups: { year: number; events: TimelineEvent[] }[] = [];
    let currentYear: number | null = null;

    filteredEvents.forEach(event => {
      const year = yearFromDate(event.date);
      if (year !== currentYear) {
        groups.push({ year, events: [] });
        currentYear = year;
      }
      groups[groups.length - 1].events.push(event);
    });

    return groups;
  }, [filteredEvents]);

  // When highlighting an event, also highlight its connections
  const highlightedIds = useMemo(() => {
    if (!highlightedId) return new Set<string>();
    const ids = new Set<string>([highlightedId]);
    connections.forEach(c => {
      if (c.fromId === highlightedId) ids.add(c.toId);
      if (c.toId === highlightedId) ids.add(c.fromId);
    });
    return ids;
  }, [highlightedId, connections]);

  const toggleEvent = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(248,249,250,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/v2/dashboard" style={{ color: "var(--text-muted)", display: "flex" }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f5959", margin: 0, letterSpacing: "-0.02em" }}>
                Health Timeline
              </h1>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                {PATIENT.name} - {filteredEvents.length} events
              </p>
            </div>
          </div>

          {/* Profile avatar */}
          <Link href="/v2/profile" style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0f5959, #1a7a7a)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            AB
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px 80px" }}>
        {/* Hero insight */}
        <div className="animate-fade-in" style={{ marginBottom: 16 }}>
          <InsightHero />
        </div>

        {/* Stats */}
        <div className="animate-fade-in stagger-1" style={{ marginBottom: 16 }}>
          <StatsBar events={events} connections={connections} />
        </div>

        {/* Filter chips */}
        <div className="animate-fade-in stagger-2" style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: "1px solid var(--divider)",
        }}>
          {FILTER_OPTIONS.map((f) => {
            const isActive = filter === f.type;
            return (
              <button
                key={f.type}
                onClick={() => setFilter(f.type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: isActive ? "1.5px solid #0f5959" : "1px solid var(--border)",
                  background: isActive ? "#0f5959" : "var(--bg-card)",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {f.icon}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: 17,
            top: 0,
            bottom: 0,
            width: 2,
            background: "linear-gradient(to bottom, #0f5959, var(--border), transparent)",
            borderRadius: 1,
            zIndex: 0,
          }} />

          {eventsByYear.map((group, gi) => (
            <div key={group.year} className="animate-fade-in" style={{ animationDelay: `${gi * 0.05}s` }}>
              {/* Year marker */}
              <div style={{ position: "relative", zIndex: 1, paddingLeft: 44, marginBottom: 12, marginTop: gi > 0 ? 24 : 0 }}>
                <YearMarker year={group.year} />
              </div>

              {/* Events in this year */}
              {group.events.map((event, ei) => {
                const isHighlighted = highlightedIds.has(event.id);
                const config = EVENT_CONFIG[event.type];

                return (
                  <div
                    key={event.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 10,
                      position: "relative",
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{
                      width: 36,
                      display: "flex",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                      zIndex: 1,
                      paddingTop: 16,
                    }}>
                      <div style={{
                        width: isHighlighted ? 14 : 10,
                        height: isHighlighted ? 14 : 10,
                        borderRadius: "50%",
                        background: config.color,
                        border: "3px solid var(--bg)",
                        boxShadow: isHighlighted ? `0 0 0 3px ${config.bgColor}` : "none",
                        transition: "all 0.2s ease",
                      }} />
                    </div>

                    {/* Date label */}
                    <div style={{
                      width: 42,
                      flexShrink: 0,
                      paddingTop: 16,
                      textAlign: "right",
                    }}>
                      <span style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-muted)",
                        lineHeight: 1.2,
                      }}>
                        {formatMonth(event.date)}
                      </span>
                    </div>

                    {/* Event card */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <EventCard
                        event={event}
                        connections={connections}
                        allEvents={events}
                        isHighlighted={isHighlighted}
                        onToggle={() => toggleEvent(event.id)}
                        onHighlight={setHighlightedId}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Timeline end marker */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 5, paddingTop: 16 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Clock size={12} style={{ color: "var(--text-muted)" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Health history begins - 2020
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 32,
          padding: "20px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #0f5959, #1a7a7a)",
          color: "#fff",
          textAlign: "center",
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>
            Your next blood test
          </h3>
          <p style={{ fontSize: 13, opacity: 0.85, margin: "0 0 14px" }}>
            Scheduled for {formatDate(PATIENT.nextBloodTest)} - adds new data points to your timeline
          </p>
          <Link href="/smith7/marker/f-Glucose" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            <Eye size={14} />
            View glucose deep-dive
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Family history context */}
        <div style={{
          marginTop: 16,
          padding: "16px 18px",
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 10px" }}>
            Family history context
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
            Anna&apos;s timeline must be read with family history in mind.
            These are the non-modifiable risk factors that make the trends above significant.
          </p>
          {FAMILY_HISTORY.map((fh, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "var(--amber-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Heart size={13} style={{ color: "var(--amber)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                  {fh.relative}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {" "}- {fh.condition}, age {fh.ageAtDiagnosis}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
