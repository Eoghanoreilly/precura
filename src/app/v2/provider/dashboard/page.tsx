"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  TestTube,
  AlertTriangle,
  ChevronRight,
  Clock,
  MessageCircle,
  Calendar,
  TrendingUp,
  Brain,
  Shield,
  BarChart3,
  ArrowRight,
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
   Mock data for the provider dashboard beyond Anna's data
   ------------------------------------------------------------------ */

const FLAGGED_PATIENTS = [
  {
    id: "anna-bergstrom",
    name: "Anna Bergstrom",
    age: 40,
    urgency: "amber" as const,
    summary: "Blood results ready - glucose trending up. PHQ-9 stable.",
    tags: ["Blood results", "Glucose trend"],
  },
  {
    id: "lars-nilsson",
    name: "Lars Nilsson",
    age: 52,
    urgency: "red" as const,
    summary: "PHQ-9 score increased from 8 to 14. Triage nurse flagged.",
    tags: ["Mental health", "Triage"],
  },
  {
    id: "maria-svensson",
    name: "Maria Svensson",
    age: 63,
    urgency: "amber" as const,
    summary: "Overdue for 6-month blood retest. Last test: Sep 2025.",
    tags: ["Overdue", "Blood test"],
  },
];

const RECENT_PATIENT_MESSAGES = [
  {
    patient: "Anna Bergstrom",
    preview: "Is there anything specific I should be doing beyond the training plan?",
    time: "12:05",
    unread: true,
  },
  {
    patient: "Lars Nilsson",
    preview: "I have been feeling worse this week. Can we talk?",
    time: "09:30",
    unread: true,
  },
  {
    patient: "Erik Lundgren",
    preview: "Thank you, that makes sense. I will start the new dose tomorrow.",
    time: "Yesterday",
    unread: false,
  },
];

const TODAYS_SCHEDULE = [
  { time: "09:00", patient: "Anna Bergstrom", type: "Blood test review", status: "completed" as const },
  { time: "10:30", patient: "Lars Nilsson", type: "Follow-up consultation", status: "next" as const },
  { time: "14:00", patient: "Karin Holmberg", type: "Initial consultation", status: "upcoming" as const },
];

/* ------------------------------------------------------------------
   Helper: urgency dot color
   ------------------------------------------------------------------ */

function urgencyColor(urgency: "green" | "amber" | "red"): string {
  switch (urgency) {
    case "green": return "var(--green)";
    case "amber": return "var(--amber)";
    case "red": return "var(--red)";
  }
}

function urgencyBg(urgency: "green" | "amber" | "red"): string {
  switch (urgency) {
    case "green": return "var(--green-bg)";
    case "amber": return "var(--amber-bg)";
    case "red": return "var(--red-bg)";
  }
}

/* ------------------------------------------------------------------
   Page
   ------------------------------------------------------------------ */

export default function ProviderDashboardPage() {
  const [mounted] = useState(true);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f5f6f8" }}>
      <main className="flex-1 px-5 pt-8 pb-12 max-w-md mx-auto w-full">

        {/* Header */}
        <div className="animate-fade-in flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Dr. Johansson&apos;s Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                <Shield size={10} />
                Precura Provider
              </div>
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            MJ
          </div>
        </div>

        {/* Today's Overview */}
        <div
          className="animate-fade-in stagger-1 rounded-2xl p-4 mb-5"
          style={{
            opacity: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Today&apos;s Overview
          </p>
          <div className="flex gap-3">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar size={14} style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-lg font-bold" style={{ color: "var(--text)" }}>3</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Consultations</p>
            </div>
            <div style={{ width: 1, background: "var(--divider)" }} />
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center mb-1">
                <TestTube size={14} style={{ color: "var(--teal)" }} />
              </div>
              <p className="text-lg font-bold" style={{ color: "var(--text)" }}>2</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Results to review</p>
            </div>
            <div style={{ width: 1, background: "var(--divider)" }} />
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle size={14} style={{ color: "var(--red)" }} />
              </div>
              <p className="text-lg font-bold" style={{ color: "var(--text)" }}>1</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Flagged (triage)</p>
            </div>
          </div>
        </div>

        {/* Patients Needing Attention */}
        <div className="animate-fade-in stagger-2 mb-5" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Patients Needing Attention
            </p>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
              Priority Queue
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {FLAGGED_PATIENTS.map((patient) => (
              <Link
                key={patient.id}
                href="/v2/provider/patient"
                className="block"
              >
                <div
                  className="card-hover rounded-2xl p-4"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Urgency dot */}
                    <div className="pt-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: urgencyColor(patient.urgency) }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          {patient.name}
                        </p>
                        <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                        {patient.summary}
                      </p>
                      <div className="flex gap-1.5">
                        {patient.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: urgencyBg(patient.urgency), color: patient.urgency === "red" ? "var(--red-text)" : "var(--amber-text)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Population Stats */}
        <div className="animate-fade-in stagger-3 mb-5" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Population Overview
            </p>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              127 Precura patients
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { value: "12", label: "Moderate+ diabetes risk", color: "amber" as const },
              { value: "8", label: "PHQ-9 > 10 (depression)", color: "blue" as const },
              { value: "23", label: "Overdue blood tests", color: "teal" as const },
              { value: "47", label: "Rising glucose trend", color: "red" as const },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3.5"
                style={{
                  background: `var(--${stat.color}-bg)`,
                  border: `1px solid color-mix(in srgb, var(--${stat.color}) 15%, transparent)`,
                }}
              >
                <p
                  className="text-xl font-bold mb-0.5"
                  style={{ color: `var(--${stat.color}-text)` }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] leading-tight" style={{ color: `var(--${stat.color}-text)`, opacity: 0.8 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/v2/provider/vardcentral"
            className="flex items-center justify-center gap-1.5 mt-3 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <BarChart3 size={13} />
            View population insights
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Recent Messages */}
        <div className="animate-fade-in stagger-4 mb-5" style={{ opacity: 0 }}>
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
            {RECENT_PATIENT_MESSAGES.map((msg, i) => (
              <div
                key={msg.patient}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: i < RECENT_PATIENT_MESSAGES.length - 1 ? "1px solid var(--divider)" : "none",
                }}
              >
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {msg.patient.split(" ").map((n) => n[0]).join("")}
                  </div>
                  {msg.unread && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: "var(--accent)", border: "2px solid var(--bg-card)" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                      {msg.patient}
                    </p>
                    <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                    {msg.preview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="animate-fade-in stagger-5" style={{ opacity: 0 }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Today&apos;s Schedule
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {TODAYS_SCHEDULE.map((appt, i) => (
              <div
                key={appt.time}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: i < TODAYS_SCHEDULE.length - 1 ? "1px solid var(--divider)" : "none",
                  background: appt.status === "next" ? "var(--accent-light)" : "transparent",
                }}
              >
                <div className="w-11 text-center">
                  <p
                    className="text-xs font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: appt.status === "completed" ? "var(--text-faint)" : "var(--text)" }}
                  >
                    {appt.time}
                  </p>
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs font-semibold"
                    style={{
                      color: appt.status === "completed" ? "var(--text-muted)" : "var(--text)",
                      textDecoration: appt.status === "completed" ? "line-through" : "none",
                    }}
                  >
                    {appt.patient}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {appt.type}
                  </p>
                </div>
                {appt.status === "completed" && (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "var(--green-bg)", color: "var(--green-text)" }}
                  >
                    Done
                  </span>
                )}
                {appt.status === "next" && (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    Next
                  </span>
                )}
                {appt.status === "upcoming" && (
                  <Clock size={12} style={{ color: "var(--text-faint)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
