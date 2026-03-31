"use client";

import Link from "next/link";
import { ArrowLeft, Dumbbell, Heart, AlertTriangle, TrendingUp, Check, Clock } from "lucide-react";
import { TRAINING_PLAN, PATIENT } from "@/lib/v2/mock-patient";

const DAY_COLORS: Record<string, string> = {
  "Moderate": "var(--amber)",
  "Moderate-High": "var(--amber)",
  "Light": "var(--green)",
  "None": "var(--text-faint)",
};

export default function TrainingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 60px" }}>
        {/* Back */}
        <div style={{ paddingTop: 16, marginBottom: 20 }}>
          <Link href="/v2/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)" }}>
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--purple-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Dumbbell size={20} style={{ color: "var(--purple)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{TRAINING_PLAN.name}</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>By {TRAINING_PLAN.createdBy}</p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Reviewed by {TRAINING_PLAN.reviewedBy}</p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
          {TRAINING_PLAN.goal}
        </p>

        {/* Progress */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>This week's progress</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {TRAINING_PLAN.progressMetrics.map((m) => {
            const pct = Math.min((m.current / m.target) * 100, 100);
            const color = pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)";
            return (
              <div key={m.metric} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.metric}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: "var(--font-mono)" }}>{m.current}/{m.target} {m.unit}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--bg-elevated)" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: color, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly schedule */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Weekly schedule</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {TRAINING_PLAN.weeklySchedule.map((day) => (
            <div key={day.day} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: day.activity !== "Rest day" ? 8 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", minWidth: 80 }}>{day.day}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: day.intensity === "None" ? "var(--bg-elevated)" : `${DAY_COLORS[day.intensity] || "var(--amber)"}15`, color: DAY_COLORS[day.intensity] || "var(--amber)" }}>
                    {day.intensity}
                  </span>
                </div>
                {day.intensity !== "None" && <Clock size={14} style={{ color: "var(--text-faint)" }} />}
              </div>
              {day.activity !== "Rest day" && (
                <>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{day.activity}</p>
                  {day.notes && <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>{day.notes}</p>}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Medical considerations */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Medical considerations</p>
        <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <AlertTriangle size={14} style={{ color: "var(--amber-text)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--amber-text)" }}>Adapted to your health profile</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
              <p key={i} style={{ fontSize: 12, color: "var(--amber-text)", lineHeight: 1.5 }}>{note}</p>
            ))}
          </div>
        </div>

        {/* Contact trainer */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--purple-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--purple)" }}>EO</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Eoghan O'Reilly</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Your personal trainer</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>Questions about your program? Need modifications? Message your trainer anytime.</p>
        </div>
      </div>
    </div>
  );
}
