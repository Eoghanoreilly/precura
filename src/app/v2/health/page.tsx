"use client";

import Link from "next/link";
import { ArrowLeft, Activity, Heart, Bone, Brain, TestTube, TrendingUp, TrendingDown, Minus, ChevronRight, Clock, Dumbbell, AlertCircle } from "lucide-react";
import ReactECharts from "echarts-for-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, SCREENING_SCORES, RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY, CONDITIONS, MEDICATIONS, FAMILY_HISTORY,
  getMarkerHistory, TRAINING_PLAN,
} from "@/lib/v2/mock-patient";

export default function HealthPage() {
  const bio = BIOMETRICS_HISTORY[0];
  const prevBio = BIOMETRICS_HISTORY[1];
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const normalCount = latestBlood.results.filter((r) => r.status === "normal").length;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 20px 100px" }}>
        <div style={{ paddingTop: 16, marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>Your Health</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Complete picture from your medical records and Precura data</p>
        </div>

        {/* Risk areas */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Risk assessments</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <RiskRow icon={<Activity size={18} />} color="amber" label="Diabetes" level={RISK_ASSESSMENTS.diabetes.riskLabel} trend={RISK_ASSESSMENTS.diabetes.trend} tenYr={RISK_ASSESSMENTS.diabetes.tenYearRisk} href="/v2/health" />
          <RiskRow icon={<Heart size={18} />} color="teal" label="Cardiovascular" level={RISK_ASSESSMENTS.cardiovascular.riskLabel} trend={RISK_ASSESSMENTS.cardiovascular.trend} tenYr={RISK_ASSESSMENTS.cardiovascular.tenYearRisk} href="/v2/health" />
          <RiskRow icon={<Bone size={18} />} color="green" label="Bone Health" level={RISK_ASSESSMENTS.bone.riskLabel} trend={RISK_ASSESSMENTS.bone.trend} tenYr={RISK_ASSESSMENTS.bone.tenYearRisk} href="/v2/health" />
          <RiskRow icon={<Brain size={18} />} color="green" label="Mental Health" level={`PHQ-9: ${SCREENING_SCORES.phq9.score}`} trend="stable" tenYr={SCREENING_SCORES.phq9.interpretation} href="/v2/health" />
        </div>

        {/* Metabolic syndrome watch */}
        <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <AlertCircle size={14} style={{ color: "var(--amber-text)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--amber-text)" }}>Metabolic syndrome watch</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--amber-text)", lineHeight: 1.5, marginBottom: 8 }}>
            {RISK_ASSESSMENTS.metabolicSyndrome.status}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: c.met ? "var(--amber)" : "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c.met ? <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>!</span> : <span style={{ fontSize: 9, color: "var(--green)", fontWeight: 700 }}>OK</span>}
                </div>
                <span style={{ fontSize: 11, color: c.met ? "var(--amber-text)" : "var(--text-muted)" }}>{c.name}: {c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body stats */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Your body</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <StatCard label="Weight" value={`${bio.weight}`} unit="kg" prev={prevBio.weight} />
          <StatCard label="BMI" value={`${bio.bmi}`} unit="" prev={prevBio.bmi} />
          <StatCard label="Waist" value={`${bio.waist}`} unit="cm" prev={prevBio.waist} />
          <StatCard label="Blood Pressure" value={bio.bloodPressure} unit="" prev={null} />
        </div>

        {/* Key blood markers with trends */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Key blood markers (5-year trend)</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
          {["f-Glucose", "HbA1c", "TC", "HDL"].map((marker, i, arr) => {
            const history = getMarkerHistory(marker);
            const latest = history[history.length - 1];
            const first = history[0];
            const dir = latest && first ? (latest.value > first.value ? "up" : latest.value < first.value ? "down" : "stable") : "stable";
            const plainNames: Record<string, string> = { "f-Glucose": "Blood sugar", HbA1c: "Long-term sugar", TC: "Cholesterol", HDL: "Good cholesterol" };

            return (
              <div key={marker} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{plainNames[marker] || marker}</p>
                  <p style={{ fontSize: 10, color: "var(--text-faint)" }}>{marker}</p>
                </div>
                {/* Mini sparkline */}
                {history.length >= 2 && (
                  <div style={{ width: 60, height: 24 }}>
                    <ReactECharts opts={{ renderer: "svg" }} style={{ height: 24, width: 60 }} option={{
                      grid: { top: 2, right: 2, bottom: 2, left: 2 },
                      xAxis: { type: "category", show: false, data: history.map((h) => h.date) },
                      yAxis: { type: "value", show: false, min: Math.min(...history.map((h) => h.value)) * 0.95, max: Math.max(...history.map((h) => h.value)) * 1.05 },
                      series: [{ type: "line", smooth: 0.3, data: history.map((h) => h.value), symbol: "none", lineStyle: { width: 1.5, color: dir === "up" ? "#ff9800" : dir === "down" ? "#4caf50" : "#999" } }],
                    }} />
                  </div>
                )}
                <div style={{ textAlign: "right", minWidth: 50 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                    {latest?.value}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                    {dir === "up" ? <TrendingUp size={10} style={{ color: "var(--amber)" }} /> : dir === "down" ? <TrendingDown size={10} style={{ color: "var(--green)" }} /> : <Minus size={10} style={{ color: "var(--text-faint)" }} />}
                    <span style={{ fontSize: 9, color: dir === "up" ? "var(--amber)" : dir === "down" ? "var(--green)" : "var(--text-faint)" }}>
                      {first && latest ? `${first.value} -> ${latest.value}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/v2/blood-tests/results" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "10px 16px", fontSize: 12, fontWeight: 500, color: "var(--accent)", borderTop: "1px solid var(--divider)" }}>
            View all blood results <ChevronRight size={12} />
          </Link>
        </div>

        {/* Conditions & medications */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Active conditions</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 12, boxShadow: "var(--shadow-sm)" }}>
          {CONDITIONS.filter((c) => c.status === "active").map((c, i, arr) => (
            <div key={c.name} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{c.name}</p>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Since {new Date(c.diagnosedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {c.treatedBy}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Current medications</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
          {MEDICATIONS.map((m, i) => (
            <div key={m.name} style={{ padding: "12px 16px", borderBottom: i < MEDICATIONS.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.name} {m.dose}</p>
                <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{m.frequency}</span>
              </div>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{m.purpose} - prescribed by {m.prescribedBy}</p>
            </div>
          ))}
        </div>

        {/* Family history */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Family history</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
          {FAMILY_HISTORY.map((f, i) => (
            <div key={f.relative + f.condition} style={{ padding: "12px 16px", borderBottom: i < FAMILY_HISTORY.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{f.relative}: {f.condition}</p>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Age at diagnosis: {f.ageAtDiagnosis}. {f.status}</p>
            </div>
          ))}
        </div>

        {/* Training */}
        <Link href="/v2/training">
          <div style={{ background: "var(--purple-bg)", border: "1px solid var(--purple)", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Dumbbell size={18} style={{ color: "var(--purple)" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--purple-text)" }}>{TRAINING_PLAN.name}</p>
                <p style={{ fontSize: 11, color: "var(--purple-text)", opacity: 0.8 }}>Week {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks} - {TRAINING_PLAN.completedThisWeek}/{TRAINING_PLAN.weeklySchedule.length} sessions done</p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--purple-text)" }} />
          </div>
        </Link>
      </div>

    </div>
  );
}

function RiskRow({ icon, color, label, level, trend, tenYr, href }: { icon: React.ReactNode; color: string; label: string; level: string; trend: string; tenYr: string; href: string }) {
  return (
    <Link href={href}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `var(--${color}-bg)`, display: "flex", alignItems: "center", justifyContent: "center", color: `var(--${color})` }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: `var(--${color}-text)`, padding: "1px 6px", borderRadius: 100, background: `var(--${color}-bg)` }}>{level}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            {trend === "worsening" ? <TrendingUp size={10} style={{ color: "var(--amber)" }} /> : trend === "stable" ? <Minus size={10} style={{ color: "var(--text-faint)" }} /> : <TrendingDown size={10} style={{ color: "var(--green)" }} />}
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{tenYr}</span>
          </div>
        </div>
        <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
      </div>
    </Link>
  );
}

function StatCard({ label, value, unit, prev }: { label: string; value: string; unit: string; prev: number | null }) {
  const numVal = parseFloat(value);
  const changed = prev !== null ? numVal - prev : 0;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", boxShadow: "var(--shadow-sm)" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{unit}</span>}
      </div>
      {prev !== null && changed !== 0 && (
        <span style={{ fontSize: 10, color: changed > 0 ? "var(--amber)" : "var(--green)" }}>
          {changed > 0 ? "+" : ""}{changed.toFixed(1)} since last
        </span>
      )}
    </div>
  );
}
