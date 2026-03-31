"use client";

import Link from "next/link";
import { ArrowLeft, Dumbbell, AlertTriangle } from "lucide-react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

const PROGRESS_PCT = Math.round((TRAINING_PLAN.completedThisWeek / TRAINING_PLAN.weeklySchedule.length) * 100);

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
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Sessions this week</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: PROGRESS_PCT >= 80 ? "var(--green)" : "var(--amber)", fontFamily: "var(--font-mono)" }}>{TRAINING_PLAN.completedThisWeek}/{TRAINING_PLAN.weeklySchedule.length}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--bg-elevated)" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${PROGRESS_PCT}%`, background: PROGRESS_PCT >= 80 ? "var(--green)" : "var(--amber)", transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Total sessions completed</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--green)", fontFamily: "var(--font-mono)" }}>{TRAINING_PLAN.totalCompleted}</span>
            </div>
          </div>
        </div>

        {/* Weekly schedule */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Weekly schedule</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {TRAINING_PLAN.weeklySchedule.map((day) => (
            <div key={day.day} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", minWidth: 80 }}>{day.day}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "var(--purple-bg)", color: "var(--purple)" }}>
                    {day.name}
                  </span>
                </div>
                <Dumbbell size={14} style={{ color: "var(--text-faint)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {day.exercises.map((ex) => (
                  <div key={ex.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{ex.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {ex.sets}x{ex.reps} {ex.weight ? `@ ${ex.weight}${ex.unit}` : ex.unit}
                    </span>
                  </div>
                ))}
              </div>
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
