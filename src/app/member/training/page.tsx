"use client";

import React from "react";
import { motion } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "@/components/member/tokens";
import { buildSidebar, rebrandDoctor } from "@/components/member/data";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

// ============================================================================
// /member/training - the real training plan.
// Uses TRAINING_PLAN data. Coach and reviewer names are rebrand-doctored so
// the /member area shows the canonical brand names.
// ============================================================================

export default function TrainingPage() {
  const plan = TRAINING_PLAN;
  const progressPct = Math.round((plan.currentWeek / plan.totalWeeks) * 100);

  return (
    <MemberShell sidebar={buildSidebar("/member/training")} userInitials="A">
      <div
        style={{
          padding: "36px 28px 40px",
          fontFamily: SYSTEM_FONT,
          maxWidth: 780,
        }}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.terracotta,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Your training
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.028em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              marginBottom: 14,
            }}
          >
            {plan.name}.{" "}
            <span
              style={{
                color: C.inkMuted,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 500,
              }}
            >
              Three sessions a week, built around your blood markers.
            </span>
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: C.inkMuted,
              margin: 0,
              marginBottom: 30,
              maxWidth: 580,
            }}
          >
            {plan.goal}
          </p>
        </motion.div>

        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            padding: "24px 26px",
            background: C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 22,
            boxShadow: C.shadowCard,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: C.inkMuted,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Progress
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.015em",
                }}
              >
                Week{" "}
                <span style={{ ...DISPLAY_NUM, fontSize: 24, color: C.terracotta }}>
                  {plan.currentWeek}
                </span>{" "}
                <span style={{ color: C.inkFaint, fontWeight: 400 }}>
                  of {plan.totalWeeks}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.inkFaint,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              Started{" "}
              {new Date(plan.startDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 8,
              background: C.stoneSoft,
              borderRadius: 4,
              overflow: "hidden",
              border: `1px solid ${C.lineCard}`,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${C.sage} 0%, ${C.butter} 50%, ${C.terracotta} 100%)`,
                borderRadius: 4,
              }}
            />
          </div>
        </motion.div>

        {/* Coach block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          style={{
            padding: "18px 22px",
            background: C.sageTint,
            border: `1px solid ${C.sageSoft}`,
            borderRadius: 18,
            marginBottom: 32,
            fontFamily: SYSTEM_FONT,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.sageDeep,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Who designed this
          </div>
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: C.inkSoft,
              letterSpacing: "-0.005em",
            }}
          >
            Designed by{" "}
            <span style={{ color: C.ink, fontWeight: 600 }}>
              {rebrandDoctor(plan.createdBy).split(",")[0]}
            </span>
            , your certified personal trainer. Reviewed and medically signed
            off by{" "}
            <span style={{ color: C.ink, fontWeight: 600 }}>
              {rebrandDoctor(plan.reviewedBy)}
            </span>
            .
          </div>
        </motion.div>

        {/* Weekly schedule */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ marginBottom: 20 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.inkMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            This week&apos;s schedule
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {plan.weeklySchedule.map((session, i) => (
            <SessionCard
              key={session.day}
              day={session.day}
              name={session.name}
              exercises={session.exercises}
              index={i}
            />
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

// ============================================================================
// SessionCard - one training day
// ============================================================================

function SessionCard({
  day,
  name,
  exercises,
  index,
}: {
  day: string;
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number | null;
    unit: string;
    notes: string;
  }[];
  index: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 + index * 0.08 }}
      style={{
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 26px 14px",
          borderBottom: `1px solid ${C.lineSoft}`,
          background: C.canvasSoft,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: C.terracotta,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {day}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: C.ink,
            letterSpacing: "-0.018em",
          }}
        >
          {name}
        </div>
      </div>

      <div style={{ padding: "6px 26px 18px" }}>
        {exercises.map((ex, i) => (
          <div
            key={ex.name}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "14px 0",
              borderBottom:
                i === exercises.length - 1
                  ? "none"
                  : `1px solid ${C.lineSoft}`,
              gap: 14,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                  marginBottom: ex.notes ? 4 : 0,
                }}
              >
                {ex.name}
              </div>
              {ex.notes && (
                <div
                  style={{
                    fontSize: 12,
                    color: C.inkMuted,
                    fontStyle: "italic",
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    lineHeight: 1.5,
                  }}
                >
                  {ex.notes}
                </div>
              )}
            </div>
            <div
              style={{
                textAlign: "right",
                flexShrink: 0,
                minWidth: 90,
              }}
            >
              <div
                style={{
                  ...DISPLAY_NUM,
                  fontSize: 16,
                  color: C.ink,
                  lineHeight: 1,
                }}
              >
                {ex.sets} x {ex.reps}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.inkFaint,
                  marginTop: 4,
                  fontFamily: '"SF Mono", ui-monospace, monospace',
                  letterSpacing: "0.02em",
                }}
              >
                {ex.weight !== null ? `${ex.weight} kg` : ex.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
