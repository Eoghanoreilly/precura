"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, Clock, MapPin, TestTube,
  Stethoscope, Calendar, Package, ChevronRight,
  FileText, Truck, Building2, Microscope,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function monthsUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44));
  return diff > 0 ? diff : 0;
}

// Simulated journey for the most recent completed test
const COMPLETED_JOURNEY = {
  ordered: { date: "2026-03-15", note: "Dr. Johansson ordered comprehensive blood panel" },
  booked: { date: "2026-03-20", note: "Appointment booked at Karolinska University Lab", location: "Solna, Stockholm" },
  drawn: { date: "2026-03-27", note: "Blood sample collected (10 markers)", time: "08:15" },
  processing: { date: "2026-03-27", note: "Sample received and processing at Karolinska Lab" },
  results: { date: "2026-03-27", note: "Results delivered and reviewed by Dr. Johansson" },
  reviewed: { date: "2026-03-28", note: "Doctor's review note published. Message sent to Anna." },
};

// Upcoming test journey (not yet started)
const UPCOMING_JOURNEY = {
  scheduled: { date: PATIENT.nextBloodTest, note: "Comprehensive panel - follow-up for glucose trend" },
};

// Recommended tests for next round
const RECOMMENDED_TESTS = [
  {
    name: "Comprehensive Metabolic Panel",
    markers: ["Fasting Glucose", "HbA1c", "Fasting Insulin", "Total Cholesterol", "HDL", "LDL", "Triglycerides", "Vitamin D", "TSH", "Creatinine"],
    reason: "Continue tracking your glucose trend and recheck vitamin D after supplementation",
    price: "Included in annual membership",
    priority: "primary" as const,
  },
  {
    name: "OGTT (Oral Glucose Tolerance Test)",
    markers: ["2-hour glucose response"],
    reason: "If fasting glucose continues above 5.6, Dr. Johansson recommends this to check how your body handles sugar over time",
    price: "495 kr",
    priority: "conditional" as const,
  },
  {
    name: "High-sensitivity CRP",
    markers: ["hs-CRP (inflammation marker)"],
    reason: "Checks for chronic low-grade inflammation, which is linked to both diabetes and cardiovascular risk",
    price: "195 kr",
    priority: "optional" as const,
  },
];

export default function TrackingPage() {
  const [activeTab, setActiveTab] = useState<"latest" | "next">("next");
  const daysToNext = daysUntil(PATIENT.nextBloodTest);
  const monthsToNext = monthsUntil(PATIENT.nextBloodTest);

  const completedSteps = [
    { key: "ordered", label: "Test ordered", icon: <FileText size={14} />, ...COMPLETED_JOURNEY.ordered, done: true },
    { key: "booked", label: "Appointment booked", icon: <Calendar size={14} />, ...COMPLETED_JOURNEY.booked, done: true },
    { key: "drawn", label: "Sample collected", icon: <TestTube size={14} />, ...COMPLETED_JOURNEY.drawn, done: true },
    { key: "processing", label: "Lab processing", icon: <Microscope size={14} />, ...COMPLETED_JOURNEY.processing, done: true },
    { key: "results", label: "Results ready", icon: <Check size={14} />, ...COMPLETED_JOURNEY.results, done: true },
    { key: "reviewed", label: "Doctor reviewed", icon: <Stethoscope size={14} />, ...COMPLETED_JOURNEY.reviewed, done: true },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          paddingTop: 16, paddingBottom: 12,
        }}>
          <Link href="/smith1" style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--bg-elevated)", display: "flex",
            alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text)" }} />
          </Link>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>Blood Tests</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Track your testing journey</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="animate-fade-in" style={{
          display: "flex", gap: 4, padding: 4, borderRadius: 14,
          background: "var(--bg-elevated)", marginBottom: 16,
        }}>
          {[
            { key: "next" as const, label: "Upcoming" },
            { key: "latest" as const, label: "Last Test" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10,
                background: activeTab === tab.key ? "var(--bg-card)" : "transparent",
                boxShadow: activeTab === tab.key ? "var(--shadow-sm)" : "none",
                border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 500,
                color: activeTab === tab.key ? "var(--text)" : "var(--text-muted)",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "next" ? (
          <>
            {/* Next Test Countdown */}
            <div className="animate-fade-in" style={{
              background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
              borderRadius: 20, padding: "24px 20px",
              border: "1px solid rgba(66, 165, 245, 0.15)",
              marginBottom: 16, textAlign: "center",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "var(--blue-text)", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <Calendar size={24} style={{ color: "#fff" }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--blue-text)", marginBottom: 4 }}>
                Next blood test
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>
                {formatDate(PATIENT.nextBloodTest)}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                {monthsToNext > 1 ? `${monthsToNext} months` : `${daysToNext} days`} from now
              </div>

              <div style={{
                marginTop: 16, display: "flex", gap: 8,
              }}>
                <button style={{
                  flex: 1, padding: "10px 0", borderRadius: 12,
                  background: "var(--blue-text)", color: "#fff",
                  border: "none", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>
                  Book appointment
                </button>
                <button style={{
                  padding: "10px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.7)", color: "var(--blue-text)",
                  border: "1px solid rgba(66, 165, 245, 0.2)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  Reschedule
                </button>
              </div>
            </div>

            {/* Why this test matters */}
            <div className="animate-fade-in stagger-1" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "16px 18px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                Why this test matters
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                Your fasting glucose has been rising for 5 years (5.0 to 5.8). This September retest will show whether your training plan and lifestyle changes are making a difference. Dr. Johansson specifically wants to see if glucose has stabilized or continued climbing. Vitamin D will also be rechecked after supplementation.
              </p>
            </div>

            {/* Recommended Tests */}
            <div className="animate-fade-in stagger-2" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, paddingLeft: 2 }}>
                Recommended tests
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RECOMMENDED_TESTS.map((test) => (
                  <div key={test.name} style={{
                    background: "var(--bg-card)", borderRadius: 16,
                    border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                    padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
                          {test.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {test.markers.join(", ")}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 6, textTransform: "uppercase",
                        background: test.priority === "primary" ? "var(--blue-bg)" : test.priority === "conditional" ? "var(--amber-bg)" : "var(--bg-elevated)",
                        color: test.priority === "primary" ? "var(--blue-text)" : test.priority === "conditional" ? "var(--amber-text)" : "var(--text-muted)",
                      }}>
                        {test.priority === "primary" ? "Included" : test.priority === "conditional" ? "If needed" : "Optional"}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 8px" }}>
                      {test.reason}
                    </p>
                    <div style={{ fontSize: 12, fontWeight: 600, color: test.price.includes("Included") ? "var(--green-text)" : "var(--text)" }}>
                      {test.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation reminder */}
            <div style={{
              background: "var(--bg-warm)", borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(255, 152, 0, 0.1)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--amber-text)", marginBottom: 8 }}>
                Preparation checklist
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "Fast for 10-12 hours before your appointment (water is fine)",
                  "Take your morning medication as usual (Enalapril)",
                  "Avoid strenuous exercise the day before",
                  "Bring your Precura membership card or show the app",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: "1.5px solid var(--border)", flexShrink: 0,
                      marginTop: 1,
                    }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Last test journey */}
            <div className="animate-fade-in" style={{
              background: "var(--bg-card)", borderRadius: 18,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "18px 20px", marginBottom: 16,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 16,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: "var(--green-bg)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={13} style={{ color: "var(--green-text)" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green-text)" }}>Complete</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
                  March 2026
                </span>
              </div>

              {/* Journey steps */}
              <div style={{ position: "relative" }}>
                {completedSteps.map((step, i) => (
                  <div key={step.key} style={{ display: "flex", gap: 14, marginBottom: i < completedSteps.length - 1 ? 0 : 0 }}>
                    {/* Timeline */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 12,
                        background: "var(--green)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={12} style={{ color: "#fff" }} />
                      </div>
                      {i < completedSteps.length - 1 && (
                        <div style={{ width: 2, flex: 1, background: "var(--green-bg)", minHeight: 20 }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: i < completedSteps.length - 1 ? 16 : 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                        {formatDateShort(step.date)} - {step.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to results */}
            <Link href="/smith1/results" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                background: "var(--bg-card)", borderRadius: 16,
                border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
                padding: "16px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "var(--blue-bg)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <TestTube size={16} style={{ color: "var(--blue-text)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>View results</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      10 markers, reviewed by Dr. Johansson
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
