"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Dumbbell,
  AlertCircle,
  Check,
} from "lucide-react";
import { TRAINING_PLAN } from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          flex: 1,
          height: 4,
          background: "#F1F1EF",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#2383E2",
            borderRadius: 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: "#9B9A97",
          fontFamily:
            '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function DayBlock({
  day,
  defaultOpen,
}: {
  day: (typeof TRAINING_PLAN.weeklySchedule)[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full py-2 px-1 -mx-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: FONT,
          borderRadius: 3,
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {open ? (
          <ChevronDown size={12} style={{ color: "#9B9A97" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "#9B9A97" }} />
        )}
        <Dumbbell size={14} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#37352F" }}>
          {day.day}
        </span>
        <span style={{ fontSize: 13, color: "#9B9A97" }}>{day.name}</span>
        <span
          style={{
            fontSize: 11,
            color: "#9B9A97",
            marginLeft: "auto",
            background: "#F1F1EF",
            padding: "1px 6px",
            borderRadius: 3,
          }}
        >
          {day.exercises.length} exercises
        </span>
      </button>

      {open && (
        <div style={{ paddingLeft: 22 }}>
          {/* Exercise table header */}
          <div
            className="flex items-center py-1"
            style={{ borderBottom: "1px solid #E9E9E7" }}
          >
            <span
              style={{
                flex: 1,
                fontSize: 11,
                color: "#9B9A97",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Exercise
            </span>
            <span
              style={{
                width: 50,
                fontSize: 11,
                color: "#9B9A97",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              Sets
            </span>
            <span
              style={{
                width: 60,
                fontSize: 11,
                color: "#9B9A97",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              Reps
            </span>
            <span
              style={{
                width: 60,
                fontSize: 11,
                color: "#9B9A97",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                textAlign: "center",
              }}
            >
              Load
            </span>
          </div>

          {day.exercises.map((ex) => (
            <div
              key={ex.name}
              className="flex items-center py-1.5"
              style={{ borderBottom: "1px solid #E9E9E7" }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: "#37352F" }}>
                  {ex.name}
                </span>
                {ex.notes && (
                  <span
                    style={{ fontSize: 11, color: "#9B9A97", marginLeft: 6 }}
                  >
                    {ex.notes}
                  </span>
                )}
              </div>
              <span
                style={{
                  width: 50,
                  textAlign: "center",
                  fontSize: 13,
                  color: "#37352F",
                  fontFamily:
                    '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                }}
              >
                {ex.sets}
              </span>
              <span
                style={{
                  width: 60,
                  textAlign: "center",
                  fontSize: 13,
                  color: "#37352F",
                  fontFamily:
                    '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                }}
              >
                {ex.reps}
                <span style={{ fontSize: 10, color: "#9B9A97", marginLeft: 1 }}>
                  {ex.unit}
                </span>
              </span>
              <span
                style={{
                  width: 60,
                  textAlign: "center",
                  fontSize: 13,
                  color: ex.weight ? "#37352F" : "#9B9A97",
                  fontFamily:
                    '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                }}
              >
                {ex.weight ? `${ex.weight}kg` : "BW"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrainingPage() {
  const plan = TRAINING_PLAN;
  const weekProgress = plan.completedThisWeek / plan.weeklySchedule.length;

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <Link
          href="/smith15"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Health Overview
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>Training Plan</span>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 4,
        }}
      >
        {plan.name}
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        {plan.goal}
      </p>

      <Divider />

      {/* Plan metadata */}
      <div>
        <div className="flex items-center justify-between py-1.5">
          <span style={{ fontSize: 14, color: "#9B9A97" }}>Created by</span>
          <span style={{ fontSize: 14, color: "#37352F" }}>
            {plan.createdBy}
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span style={{ fontSize: 14, color: "#9B9A97" }}>Reviewed by</span>
          <span style={{ fontSize: 14, color: "#37352F" }}>
            {plan.reviewedBy}
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span style={{ fontSize: 14, color: "#9B9A97" }}>Week</span>
          <span style={{ fontSize: 14, color: "#37352F" }}>
            {plan.currentWeek} of {plan.totalWeeks}
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span style={{ fontSize: 14, color: "#9B9A97" }}>
            Total sessions completed
          </span>
          <span
            style={{
              fontSize: 14,
              color: "#37352F",
              fontFamily:
                '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
            }}
          >
            {plan.totalCompleted}
          </span>
        </div>
      </div>

      <Divider />

      {/* This week progress */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        This Week
      </h2>
      <div className="flex items-center gap-3 mb-3">
        <span style={{ fontSize: 13, color: "#9B9A97" }}>
          {plan.completedThisWeek} of {plan.weeklySchedule.length} sessions
        </span>
      </div>
      <ProgressBar
        current={plan.completedThisWeek}
        total={plan.weeklySchedule.length}
      />

      {/* Week day indicators */}
      <div className="flex items-center gap-3 mt-3">
        {plan.weeklySchedule.map((day, i) => {
          const done = i < plan.completedThisWeek;
          return (
            <div key={day.day} className="flex items-center gap-1.5">
              {done ? (
                <Check size={12} style={{ color: "#4DAB9A" }} />
              ) : (
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "1.5px solid #E9E9E7",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 12,
                  color: done ? "#4DAB9A" : "#9B9A97",
                  fontWeight: done ? 500 : 400,
                }}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      <Divider />

      {/* Schedule */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        Weekly Schedule
      </h2>

      {plan.weeklySchedule.map((day, i) => (
        <DayBlock key={day.day} day={day} defaultOpen={i === 0} />
      ))}

      <Divider />

      {/* Medical considerations */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        Medical Considerations
      </h2>

      {plan.medicalConsiderations.map((note, i) => (
        <div key={i} className="flex items-start gap-2 py-1.5">
          <AlertCircle
            size={13}
            style={{ color: "#CB912F", marginTop: 2, flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: "#37352F", lineHeight: 1.5 }}>
            {note}
          </span>
        </div>
      ))}

      <Divider />

      <div style={{ fontSize: 12, color: "#9B9A97", lineHeight: 1.6 }}>
        This plan is designed around your specific health markers, medical
        history, and risk profile. It was created by a certified personal trainer
        and reviewed by your Precura doctor to ensure safety.
      </div>
    </div>
  );
}
