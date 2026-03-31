"use client";

import Link from "next/link";
import { ArrowLeft, TestTube, Check, Clock, ChevronRight, Truck, FlaskConical } from "lucide-react";
import { PATIENT, BLOOD_TEST_HISTORY } from "@/lib/v2/mock-patient";

const JOURNEY_STEPS = [
  { icon: TestTube, label: "Ordered", date: "Mar 22, 2026", done: true },
  { icon: Clock, label: "Booked at lab", date: "Mar 24, 2026", done: true },
  { icon: FlaskConical, label: "Sample taken", date: "Mar 25, 2026", done: true },
  { icon: Truck, label: "Processing", date: "Mar 25-27", done: true },
  { icon: Check, label: "Results ready", date: "Mar 27, 2026", done: true },
];

export default function BloodTestsPage() {
  const latestSession = BLOOD_TEST_HISTORY[0];
  const previousSessions = BLOOD_TEST_HISTORY.slice(1);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ paddingTop: 16, marginBottom: 20 }}>
          <Link href="/v2/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)" }}>
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Blood Tests</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Included in your Precura membership. 2 comprehensive tests per year.</p>

        {/* Latest test journey */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Latest test</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, marginBottom: 8, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: step.done ? "var(--green-bg)" : "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {step.done ? <Check size={14} style={{ color: "var(--green)" }} /> : <step.icon size={14} style={{ color: "var(--text-faint)" }} />}
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && <div style={{ width: 2, height: 12, background: step.done ? "var(--green-bg)" : "var(--bg-elevated)", marginTop: 2 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: step.done ? "var(--text)" : "var(--text-muted)" }}>{step.label}</span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 8 }}>{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/v2/blood-tests/results">
          <div style={{ background: "var(--teal-bg)", border: "1px solid var(--teal)", borderRadius: 14, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--teal-text)" }}>Results ready - reviewed by Dr. Johansson</p>
              <p style={{ fontSize: 11, color: "var(--teal-text)", opacity: 0.8 }}>{latestSession.results.length} biomarkers tested</p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--teal-text)" }} />
          </div>
        </Link>

        {/* Next test */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Next test</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>6-month follow-up panel</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Scheduled for September 2026</p>
              <p style={{ fontSize: 11, color: "var(--accent)", marginTop: 4 }}>Included in your membership</p>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TestTube size={16} style={{ color: "var(--accent)" }} />
            </div>
          </div>
        </div>

        {/* Test history */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>History</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          {BLOOD_TEST_HISTORY.map((session, i) => (
            <div key={session.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < BLOOD_TEST_HISTORY.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                  {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{session.orderedBy} - {session.results.length} markers</p>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>{session.lab.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
