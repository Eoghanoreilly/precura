"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle, Sparkles, ChevronRight, Send,
  Activity, TestTube, Stethoscope, Dumbbell,
  TrendingUp, TrendingDown, Minus,
  AlertCircle, Calendar, Clock,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY, MESSAGES, TRAINING_PLAN,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import ImagePlaceholder from "@/components/ImagePlaceholder";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function V2Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const normalCount = latestBlood.results.filter((r) => r.status === "normal").length;
  const lastMsg = MESSAGES[MESSAGES.length - 1];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1];
  const firstGlucose = glucoseHistory[0];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh", position: "relative" }}>
      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 40px" }}>

        {/* ---- TOP BAR ---- */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={14} style={{ color: "var(--accent)" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>Precura</span>
          </div>
          <Link href="/v2/profile">
            <div style={{ width: 34, height: 34, borderRadius: 12, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
              AB
            </div>
          </Link>
        </div>

        {/* ---- GREETING ---- */}
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>{getGreeting()}, {PATIENT.firstName}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* ---- HERO CARD ---- */}
        <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-md)" }}>
          <ImagePlaceholder number={1} height="120px" gradient="linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" className="rounded-none" />
          <div style={{ background: "var(--bg-card)", padding: "16px 18px 18px", border: "1px solid var(--border)", borderTop: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <AlertCircle size={14} style={{ color: "var(--amber)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber-text)" }}>Worth watching</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 4 }}>
              Your blood sugar has been gradually rising over 5 years
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
              {firstGlucose.value} to {latestGlucose.value} mmol/L since {firstGlucose.date.slice(0, 4)}. Still in normal range, but Dr. Johansson is monitoring this closely.
            </p>
            <Link href="/v2/health" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
              View your health data <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* ---- QUICK ACTIONS: Horizontal scroll ---- */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 14, scrollbarWidth: "none" }}>
          <QuickCard icon={<Stethoscope size={18} />} color="accent" label="Dr. Johansson" sub="1 new message" href="/v2/doctor" />
          <QuickCard icon={<TestTube size={18} />} color="teal" label="Blood Results" sub={`${normalCount}/${latestBlood.results.length} normal`} href="/v2/blood-tests/results" />
          <QuickCard icon={<Dumbbell size={18} />} color="purple" label="Today's Workout" sub="Upper body" href="/v2/training" />
          <QuickCard icon={<Calendar size={18} />} color="blue" label="Next Blood Test" sub="Sep 15, 2026" href="/v2/blood-tests" />
        </div>

        {/* ---- DOCTOR MESSAGE ---- */}
        <Link href="/v2/doctor">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)", display: "flex", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>MJ</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Johansson</span>
                <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Yesterday</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {lastMsg.text.slice(0, 80)}...
              </p>
            </div>
          </div>
        </Link>

        {/* ---- HEALTH SNAPSHOT ---- */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Health snapshot</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <HealthMetric label="Diabetes Risk" value={RISK_ASSESSMENTS.diabetes.riskLabel} color="amber" trend="worsening" href="/v2/health" />
          <HealthMetric label="Heart Risk" value={RISK_ASSESSMENTS.cardiovascular.riskLabel} color="teal" trend="stable" href="/v2/health" />
          <HealthMetric label="Blood Sugar" value={`${latestGlucose.value}`} unit="mmol/L" color="amber" trend="worsening" href="/v2/blood-tests/results" />
          <HealthMetric label="Blood Pressure" value={BIOMETRICS_HISTORY[0].bloodPressure} color="green" trend="stable" href="/v2/health" />
        </div>

        {/* ---- TRAINING ---- */}
        <Link href="/v2/training">
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
            <ImagePlaceholder number={2} height="80px" gradient="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" className="rounded-none" />
            <div style={{ background: "var(--bg-card)", padding: "14px 16px", border: "1px solid var(--border)", borderTop: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{TRAINING_PLAN.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Week 10 - 2 of 3 workouts completed this week</p>
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
              </div>
            </div>
          </div>
        </Link>

        {/* ---- MEMBERSHIP ---- */}
        <div style={{ background: "var(--accent-light)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>Precura Annual Member</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Next blood test: Sep 15, 2026</p>
          </div>
          <Link href="/v2/membership" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", padding: "6px 12px", borderRadius: 100, background: "var(--bg-card)" }}>
            Manage
          </Link>
        </div>

        {/* ---- RECENT ---- */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Recent</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          {[
            { icon: TestTube, text: "Blood results reviewed by Dr. Johansson", date: "Mar 28", color: "teal" },
            { icon: Stethoscope, text: "Dr. Johansson responded to your message", date: "Mar 28", color: "accent" },
            { icon: Dumbbell, text: "Completed: Interval walking + core work", date: "Mar 26", color: "purple" },
          ].map((event, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <event.icon size={13} style={{ color: `var(--${event.color})` }} />
              </div>
              <p style={{ flex: 1, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{event.text}</p>
              <span style={{ fontSize: 10, color: "var(--text-faint)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{event.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- FLOATING CHAT BUBBLE ---- */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 52, height: 52, borderRadius: 16,
          background: "var(--accent)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(92,107,192,0.35), 0 2px 6px rgba(0,0,0,0.1)",
          zIndex: 50,
        }}
      >
        {chatOpen ? <span style={{ color: "#fff", fontSize: 18, fontWeight: 300 }}>x</span> : <MessageCircle size={22} color="#fff" />}
      </button>

      {/* ---- CHAT SHEET ---- */}
      {chatOpen && (
        <div style={{
          position: "fixed", bottom: 88, right: 20, width: "calc(100% - 40px)", maxWidth: 380,
          background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20,
          boxShadow: "var(--shadow-lg)", zIndex: 49, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Precura AI</span>
            </div>
            <Link href="/v2/doctor" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>
              Message Doctor
            </Link>
          </div>
          <div style={{ padding: "12px 16px", maxHeight: 200, overflowY: "auto" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={10} style={{ color: "var(--accent)" }} />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, background: "var(--bg-elevated)", padding: "8px 12px", borderRadius: "4px 12px 12px 12px" }}>
                Hi Anna! I have your full health history. What would you like to know?
              </p>
            </div>
          </div>
          <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid var(--divider)" }}>
            {["Why is my glucose rising?", "Explain my blood results", "Am I at risk?"].map((q) => (
              <Link key={q} href="/v2/chat" style={{ fontSize: 10, fontWeight: 500, padding: "5px 10px", borderRadius: 100, background: "var(--accent-light)", color: "var(--accent)", textDecoration: "none" }}>
                {q}
              </Link>
            ))}
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--divider)", display: "flex", gap: 8 }}>
            <input placeholder="Ask anything..." style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px", fontSize: 13, background: "var(--bg-elevated)", outline: "none", color: "var(--text)" }} />
            <button style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={14} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickCard({ icon, color, label, sub, href }: { icon: React.ReactNode; color: string; label: string; sub: string; href: string }) {
  return (
    <Link href={href} style={{ flexShrink: 0, textDecoration: "none" }}>
      <div style={{ width: 130, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 14px 12px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: `var(--${color})` }}>
          {icon}
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{sub}</p>
      </div>
    </Link>
  );
}

function HealthMetric({ label, value, unit, color, trend, href }: { label: string; value: string; unit?: string; color: string; trend: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px", boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: `var(--${color}-text)`, fontFamily: "var(--font-mono)" }}>{value}</span>
          {unit && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{unit}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
          {trend === "worsening" ? <TrendingUp size={10} style={{ color: "var(--amber)" }} /> : trend === "improving" ? <TrendingDown size={10} style={{ color: "var(--green)" }} /> : <Minus size={10} style={{ color: "var(--text-faint)" }} />}
          <span style={{ fontSize: 10, color: trend === "worsening" ? "var(--amber)" : trend === "improving" ? "var(--green)" : "var(--text-faint)" }}>
            {trend === "worsening" ? "Trending up" : trend === "improving" ? "Improving" : "Stable"}
          </span>
        </div>
      </div>
    </Link>
  );
}
