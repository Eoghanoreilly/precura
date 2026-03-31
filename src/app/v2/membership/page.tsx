"use client";

import Link from "next/link";
import { ArrowLeft, Check, Shield, TestTube, Stethoscope, Dumbbell, MessageCircle, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: TestTube, text: "2 comprehensive blood tests per year with 10+ biomarkers" },
  { icon: Stethoscope, text: "Doctor review on every test - personal note from Dr. Johansson" },
  { icon: MessageCircle, text: "Message your doctor anytime - responses within 24 hours" },
  { icon: TrendingUp, text: "Continuous risk monitoring: diabetes, cardiovascular, bone health, mental health" },
  { icon: Dumbbell, text: "Personalized training plan adapted to your health data" },
  { icon: Shield, text: "1177 health record integration - your complete health picture" },
];

export default function MembershipPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 60px" }}>
        {/* Back */}
        <div style={{ paddingTop: 16, marginBottom: 20 }}>
          <Link href="/v2/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)" }}>
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Precura Membership</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
          Your personal health companion. Blood tests, doctor access, risk monitoring, and training - all in one membership.
        </p>

        {/* Annual plan */}
        <div style={{ background: "var(--bg-card)", border: "2px solid var(--accent)", borderRadius: 20, padding: 24, marginBottom: 12, boxShadow: "var(--shadow-md)", position: "relative" }}>
          <div style={{ position: "absolute", top: -10, left: 20, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Best value</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Annual</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>2,995</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>SEK/year</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>That's 249 SEK/month. Save 1,193 SEK vs monthly.</p>
          <button style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Start annual membership
          </button>
        </div>

        {/* Monthly plan */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Monthly</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>349</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>SEK/month</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Cancel anytime. 4,188 SEK/year.</p>
          <button style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Start monthly membership
          </button>
        </div>

        {/* What's included */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>Everything included</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {FEATURES.map((f) => (
            <div key={f.text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <f.icon size={16} style={{ color: "var(--accent)" }} />
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, paddingTop: 2 }}>{f.text}</p>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>How we compare</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
          {[
            { name: "Precura", price: "2,995 SEK/yr", features: ["Risk prediction", "2 blood tests/yr", "Doctor review", "AI chat", "Training plan", "1177 integration"], highlight: true },
            { name: "Werlabs single test", price: "~1,500 SEK", features: ["Blood test only", "No interpretation", "No doctor", "No follow-up"], highlight: false },
            { name: "Function Health (US)", price: "~3,800 SEK/yr", features: ["Blood tests", "AI analysis", "Not in Europe", "No doctor", "No training"], highlight: false },
          ].map((comp, i) => (
            <div key={comp.name} style={{ padding: "14px 16px", borderBottom: i < 2 ? "1px solid var(--divider)" : "none", background: comp.highlight ? "var(--accent-light)" : "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: comp.highlight ? "var(--accent)" : "var(--text)" }}>{comp.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{comp.price}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {comp.features.map((f) => (
                  <span key={f} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: comp.highlight ? "rgba(92,107,192,0.1)" : "var(--bg-elevated)", color: "var(--text-muted)" }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Founded by a doctor and an engineer in Sweden.
            <br />Your data is encrypted and stored in the EU.
          </p>
        </div>
      </div>
    </div>
  );
}
