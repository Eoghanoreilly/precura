"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Brain,
  Sparkles,
  TrendingUp,
  Pill,
  MessageCircle,
  FileText,
  CheckCircle2,
  ChevronRight,
  Search,
  Send,
  AlertCircle,
  Clock,
  ClipboardList,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  SCREENING_SCORES,
  RISK_ASSESSMENTS,
  CONDITIONS,
  MEDICATIONS,
  FAMILY_HISTORY,
  DOCTOR_VISITS,
  BIOMETRICS_HISTORY,
  MESSAGES,
  DOCTOR_NOTES,
  TRAINING_PLAN,
  AI_PATIENT_SUMMARY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------ */

function scoreColor(level: string): { bg: string; text: string; dot: string } {
  switch (level) {
    case "minimal":
    case "low":
    case "low_risk":
      return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
    case "moderate":
    case "low_moderate":
      return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
    case "high":
    case "severe":
      return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
    default:
      return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  }
}

function trendArrow(values: { value: number }[]): { label: string; color: string; direction: string } {
  if (values.length < 2) return { label: "Stable", color: "var(--text-muted)", direction: "stable" };
  const first = values[0].value;
  const last = values[values.length - 1].value;
  const pctChange = ((last - first) / first) * 100;
  if (pctChange > 5) return { label: `+${pctChange.toFixed(0)}%`, color: "var(--amber-text)", direction: "up" };
  if (pctChange < -5) return { label: `${pctChange.toFixed(0)}%`, color: "var(--green-text)", direction: "down" };
  return { label: "Stable", color: "var(--text-muted)", direction: "stable" };
}

const AI_QUESTIONS = [
  "Any reported injuries?",
  "Medication interactions?",
  "Family history details?",
  "Blood test trends?",
];

const MOCK_AI_RESPONSE = `Based on Anna's records, she had a lower back strain in September 2023 (ICD-10: S39.012) from a lifting injury. She completed 4 sessions of physiotherapy and was cleared for light jogging by October 2023. The injury is marked as resolved. No other injuries on record. Her current training plan includes core strengthening exercises to support her back, with a note to avoid loaded spinal flexion and consult physio if pain returns.`;

const PATIENT_ACTIONS = [
  { label: "Retest comprehensive blood panel", due: "September 2026", status: "scheduled" as const },
  { label: "Review Vitamin D levels after supplementation", due: "September 2026", status: "scheduled" as const },
  { label: "Consider OGTT if fasting glucose continues to rise", due: "If f-Glucose > 6.0", status: "conditional" as const },
  { label: "Monitor waist circumference (approaching 88cm threshold)", due: "Ongoing", status: "active" as const },
];

/* ------------------------------------------------------------------
   Page
   ------------------------------------------------------------------ */

export default function ProviderPatientPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>("Any reported injuries?");
  const [aiQuery, setAiQuery] = useState("");

  // Gather blood marker trends
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const hba1cHistory = getMarkerHistory("HbA1c");
  const cholesterolHistory = getMarkerHistory("TC");

  const glucoseTrend = trendArrow(glucoseHistory);
  const hba1cTrend = trendArrow(hba1cHistory);
  const cholTrend = trendArrow(cholesterolHistory);

  // Split the AI summary into paragraphs for readability
  const summaryParagraphs = AI_PATIENT_SUMMARY.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f5f6f8" }}>
      <main className="flex-1 px-5 pt-6 pb-12 max-w-md mx-auto w-full">

        {/* Header */}
        <div className="animate-fade-in flex items-center gap-3 mb-6">
          <Link
            href="/v2/provider/dashboard"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <ArrowLeft size={14} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
              {PATIENT.name}
            </h1>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {PATIENT.age}y / {PATIENT.sex} / {PATIENT.personnummer} / {PATIENT.vardcentral}
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            AB
          </div>
        </div>

        {/* ============================================================
            AI SUMMARY - The hero card
            ============================================================ */}
        <div
          className="animate-fade-in stagger-1 rounded-2xl p-5 mb-5"
          style={{
            opacity: 0,
            background: "linear-gradient(135deg, #f0f4ff 0%, #faf8ff 100%)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-light)" }}
            >
              <Sparkles size={13} style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              AI Patient Summary
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {summaryParagraphs.map((paragraph, i) => {
              // Highlight key values in text
              const highlighted = paragraph
                .replace(/(5\.0 -> 5\.8 mmol\/L)/g, '<mark>$1</mark>')
                .replace(/(HbA1c 38 mmol\/mol)/g, '<mark>$1</mark>')
                .replace(/(FINDRISC score 12\/26)/g, '<mark>$1</mark>')
                .replace(/(T2D at 58)/g, '<mark>$1</mark>')
                .replace(/(father MI at 65)/g, '<mark>$1</mark>')
                .replace(/(2 of 5 criteria)/g, '<mark>$1</mark>')
                .replace(/(PHQ-9 score 4)/g, '<mark>$1</mark>')
                .replace(/(SCORE2 estimate ~3%)/g, '<mark>$1</mark>');

              return (
                <p
                  key={i}
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              );
            })}
          </div>

          <style>{`
            mark {
              background: color-mix(in srgb, var(--accent) 15%, transparent);
              color: var(--accent);
              padding: 1px 4px;
              border-radius: 4px;
              font-weight: 600;
              font-size: inherit;
            }
          `}</style>
        </div>

        {/* ============================================================
            AI Q&A
            ============================================================ */}
        <div
          className="animate-fade-in stagger-2 rounded-2xl p-4 mb-5"
          style={{
            opacity: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} style={{ color: "var(--accent)" }} />
            <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
              Ask about this patient
            </p>
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <Search size={13} style={{ color: "var(--text-faint)" }} />
            <input
              type="text"
              placeholder="Ask about this patient..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none"
              style={{ color: "var(--text)" }}
            />
            <button
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <Send size={10} />
            </button>
          </div>

          {/* Question chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {AI_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuestion(q)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full transition-all"
                style={{
                  background: selectedQuestion === q ? "var(--accent)" : "var(--bg-elevated)",
                  color: selectedQuestion === q ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${selectedQuestion === q ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Mock response */}
          {selectedQuestion && (
            <div
              className="rounded-xl p-3"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--divider)" }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={10} style={{ color: "var(--accent)" }} />
                <span className="text-[10px] font-semibold" style={{ color: "var(--accent)" }}>AI Response</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {MOCK_AI_RESPONSE}
              </p>
            </div>
          )}
        </div>

        {/* ============================================================
            Screening Scores at a Glance
            ============================================================ */}
        <div
          className="animate-fade-in stagger-3 mb-5"
          style={{ opacity: 0 }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Screening Scores
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { name: "PHQ-9", score: SCREENING_SCORES.phq9.score, max: SCREENING_SCORES.phq9.maxScore, level: SCREENING_SCORES.phq9.level, label: "Depression" },
              { name: "GAD-7", score: SCREENING_SCORES.gad7.score, max: SCREENING_SCORES.gad7.maxScore, level: SCREENING_SCORES.gad7.level, label: "Anxiety" },
              { name: "FINDRISC", score: SCREENING_SCORES.findrisc.score, max: SCREENING_SCORES.findrisc.maxScore, level: SCREENING_SCORES.findrisc.level, label: "Diabetes risk" },
              { name: "AUDIT-C", score: SCREENING_SCORES.auditC.score, max: SCREENING_SCORES.auditC.maxScore, level: SCREENING_SCORES.auditC.level, label: "Alcohol use" },
            ].map((s) => {
              const colors = scoreColor(s.level);
              const pct = (s.score / s.max) * 100;
              return (
                <div
                  key={s.name}
                  className="rounded-2xl p-3.5"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold" style={{ color: "var(--text)" }}>
                      {s.name}
                    </p>
                    <div className="w-2 h-2 rounded-full" style={{ background: colors.dot }} />
                  </div>
                  <p className="text-lg font-bold mb-0.5" style={{ color: colors.text }}>
                    {s.score}<span className="text-xs font-normal" style={{ color: "var(--text-faint)" }}>/{s.max}</span>
                  </p>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "var(--bg-elevated)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: colors.dot }}
                    />
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            Key Blood Trends
            ============================================================ */}
        <div
          className="animate-fade-in stagger-4 mb-5"
          style={{ opacity: 0 }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Key Blood Trends
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {[
              {
                name: "f-Glucose",
                label: "Fasting Glucose",
                history: glucoseHistory,
                trend: glucoseTrend,
                unit: "mmol/L",
              },
              {
                name: "HbA1c",
                label: "HbA1c (long-term sugar)",
                history: hba1cHistory,
                trend: hba1cTrend,
                unit: "mmol/mol",
              },
              {
                name: "TC",
                label: "Total Cholesterol",
                history: cholesterolHistory,
                trend: cholTrend,
                unit: "mmol/L",
              },
            ].map((marker, i) => {
              const first = marker.history[0];
              const last = marker.history[marker.history.length - 1];
              const isRising = marker.trend.direction === "up";

              return (
                <div
                  key={marker.name}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{
                    borderBottom: i < 2 ? "1px solid var(--divider)" : "none",
                  }}
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                      {marker.label}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        {first?.value}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>-&gt;</span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ fontFamily: "var(--font-mono)", color: isRising ? "var(--amber-text)" : "var(--text-secondary)" }}
                      >
                        {last?.value}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                        {marker.unit}
                      </span>
                    </div>
                  </div>

                  {/* Mini sparkline as dots */}
                  <div className="flex items-end gap-0.5 h-5">
                    {marker.history.map((point, pi) => {
                      const minVal = Math.min(...marker.history.map((h) => h.value));
                      const maxVal = Math.max(...marker.history.map((h) => h.value));
                      const range = maxVal - minVal || 1;
                      const height = ((point.value - minVal) / range) * 16 + 4;
                      return (
                        <div
                          key={pi}
                          className="w-1 rounded-full"
                          style={{
                            height: `${height}px`,
                            background: pi === marker.history.length - 1
                              ? (isRising ? "var(--amber)" : "var(--green)")
                              : "var(--bg-elevated)",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Trend badge */}
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{
                      background: isRising ? "var(--amber-bg)" : "var(--bg-elevated)",
                    }}
                  >
                    {isRising && <TrendingUp size={10} style={{ color: "var(--amber-text)" }} />}
                    <span className="text-[10px] font-semibold" style={{ color: marker.trend.color }}>
                      {marker.trend.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            Active Medications
            ============================================================ */}
        <div
          className="animate-fade-in stagger-5 mb-5"
          style={{ opacity: 0 }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Active Medications
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {MEDICATIONS.filter((m) => m.active).map((med, i) => (
              <div
                key={med.name}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: i < MEDICATIONS.filter((m) => m.active).length - 1 ? "1px solid var(--divider)" : "none",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--teal-bg)" }}
                >
                  <Pill size={14} style={{ color: "var(--teal)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                    {med.name} {med.dose}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {med.frequency} / {med.purpose}
                  </p>
                </div>
                <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                  Since {med.startDate.slice(0, 4)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            Recent Messages
            ============================================================ */}
        <div
          className="animate-fade-in stagger-5 mb-5"
          style={{ opacity: 0 }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Recent Messages
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {MESSAGES.slice(-3).map((msg, i) => (
              <div
                key={msg.id}
                className="px-4 py-3"
                style={{
                  borderBottom: i < 2 ? "1px solid var(--divider)" : "none",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{
                      background: msg.from === "doctor" ? "var(--accent-light)" : "var(--teal-bg)",
                      color: msg.from === "doctor" ? "var(--accent)" : "var(--teal-text)",
                    }}
                  >
                    {msg.from === "doctor" ? "MJ" : "AB"}
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text)" }}>
                    {msg.from === "doctor" ? "Dr. Johansson" : PATIENT.name}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                    {new Date(msg.date).toLocaleString("en-SE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed pl-7" style={{ color: "var(--text-secondary)" }}>
                  {msg.text.length > 140 ? msg.text.slice(0, 140) + "..." : msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            Doctor's Notes
            ============================================================ */}
        <div
          className="animate-fade-in stagger-6 mb-5"
          style={{ opacity: 0 }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Doctor&apos;s Notes
          </p>
          <div className="flex flex-col gap-2.5">
            {DOCTOR_NOTES.map((note) => (
              <div
                key={note.date}
                className="rounded-2xl p-4"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={12} style={{ color: "var(--accent)" }} />
                  <span className="text-[10px] font-bold" style={{ color: "var(--text)" }}>
                    {note.type}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                    {note.date} / {note.author}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
                  {note.note.length > 300 ? note.note.slice(0, 300) + "..." : note.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            Actions
            ============================================================ */}
        <div
          className="animate-fade-in stagger-6"
          style={{ opacity: 0 }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Actions
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {PATIENT_ACTIONS.map((action, i) => (
              <div
                key={action.label}
                className="flex items-start gap-3 px-4 py-3"
                style={{
                  borderBottom: i < PATIENT_ACTIONS.length - 1 ? "1px solid var(--divider)" : "none",
                }}
              >
                <div className="pt-0.5">
                  {action.status === "scheduled" && (
                    <Clock size={13} style={{ color: "var(--teal)" }} />
                  )}
                  {action.status === "conditional" && (
                    <AlertCircle size={13} style={{ color: "var(--amber)" }} />
                  )}
                  {action.status === "active" && (
                    <ClipboardList size={13} style={{ color: "var(--accent)" }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                    {action.label}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {action.due}
                  </p>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                  style={{
                    background:
                      action.status === "scheduled" ? "var(--teal-bg)" :
                      action.status === "conditional" ? "var(--amber-bg)" :
                      "var(--accent-light)",
                    color:
                      action.status === "scheduled" ? "var(--teal-text)" :
                      action.status === "conditional" ? "var(--amber-text)" :
                      "var(--accent)",
                  }}
                >
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
