"use client";

import React from "react";
import Link from "next/link";
import {
  PATIENT,
  RISK_ASSESSMENTS,
  TRAINING_PLAN,
  DOCTOR_NOTES,
  BLOOD_TEST_HISTORY,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Factor row - what moves the line
// ============================================================================

function FactorRow({
  label,
  value,
  changeable,
  impact,
}: {
  label: string;
  value?: string;
  changeable: boolean;
  impact: string;
}) {
  const impactColor =
    impact === "high" ? "#CC0000" : impact === "medium" ? "#FF9900" : impact === "positive" ? "#00B341" : "#8A8A8A";

  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        paddingTop: 12,
        paddingBottom: 12,
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div className="flex items-baseline gap-3">
        <span
          style={{
            fontSize: 14,
            color: "#0F0F0F",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {label}
        </span>
        {!changeable && (
          <span
            style={{
              fontSize: 10,
              color: "#8A8A8A",
              fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            fixed
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {value && (
          <span
            style={{
              fontSize: 13,
              color: "#8A8A8A",
              fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
            }}
          >
            {value}
          </span>
        )}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 1,
            background: impactColor,
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Blood marker row
// ============================================================================

function MarkerRow({
  label,
  plainName,
  value,
  unit,
  status,
}: {
  label: string;
  plainName: string;
  value: number;
  unit: string;
  status: string;
}) {
  const statusColor =
    status === "borderline" ? "#FF9900" : status === "abnormal" ? "#CC0000" : "#00B341";

  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div>
        <span
          style={{
            fontSize: 13,
            color: "#0F0F0F",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {plainName}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#8A8A8A",
            marginLeft: 6,
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#0F0F0F",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#8A8A8A",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
          }}
        >
          {unit}
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 1,
            background: statusColor,
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Micro sparkline for a marker
// ============================================================================

function MicroSparkline({ shortName }: { shortName: string }) {
  const data = getMarkerHistory(shortName);
  if (data.length < 2) return null;

  const w = 80;
  const h = 24;
  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / (max - min)) * h;
    return `${x},${y}`;
  });

  const rising = values[values.length - 1] > values[0];

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={rising ? "#CC0000" : "#00B341"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function PlanPage() {
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latest = glucoseHistory[glucoseHistory.length - 1];
  const latestSession = BLOOD_TEST_HISTORY[0];
  const doctorNote = DOCTOR_NOTES[0];

  const keyMarkers = latestSession.results.filter(
    (r) => r.status === "borderline" || r.status === "abnormal"
  );
  const normalMarkers = latestSession.results.filter(
    (r) => r.status === "normal"
  );

  return (
    <div
      className="mx-auto px-4"
      style={{
        maxWidth: 720,
        paddingTop: 48,
        paddingBottom: 120,
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between" style={{ marginBottom: 64 }}>
        <Link
          href="/smith10"
          style={{
            fontSize: 12,
            color: "#8A8A8A",
            textDecoration: "none",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          back
        </Link>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0F0F0F",
            letterSpacing: "-0.01em",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Precura
        </span>
      </header>

      {/* Section: What moves the line */}
      <div style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#0F0F0F",
            margin: 0,
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          What moves the line
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#8A8A8A",
            margin: 0,
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Your diabetes risk factors, ranked by impact.
        </p>

        <div>
          {RISK_ASSESSMENTS.diabetes.keyFactors.map((f) => (
            <FactorRow
              key={f.name}
              label={f.name}
              changeable={f.changeable}
              impact={f.impact}
            />
          ))}
        </div>
      </div>

      {/* Section: Your numbers */}
      <div style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#0F0F0F",
            margin: 0,
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Your numbers
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#8A8A8A",
            margin: 0,
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Latest blood test, {new Date(latestSession.date).toLocaleDateString("en-SE", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {/* Flagged markers first */}
        {keyMarkers.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <span
              style={{
                fontSize: 10,
                color: "#FF9900",
                fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
              }}
            >
              Needs attention
            </span>
            {keyMarkers.map((r) => (
              <div key={r.shortName} className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                  <MarkerRow
                    label={r.shortName}
                    plainName={r.plainName}
                    value={r.value}
                    unit={r.unit}
                    status={r.status}
                  />
                </div>
                <div style={{ marginLeft: 12, flexShrink: 0 }}>
                  <MicroSparkline shortName={r.shortName} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Normal markers */}
        <span
          style={{
            fontSize: 10,
            color: "#00B341",
            fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
          }}
        >
          Normal
        </span>
        {normalMarkers.map((r) => (
          <MarkerRow
            key={r.shortName}
            label={r.shortName}
            plainName={r.plainName}
            value={r.value}
            unit={r.unit}
            status={r.status}
          />
        ))}
      </div>

      {/* Section: Doctor's note */}
      <div style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#0F0F0F",
            margin: 0,
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Doctor&apos;s note
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#8A8A8A",
            margin: 0,
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {doctorNote.author}, {new Date(doctorNote.date).toLocaleDateString("en-SE", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div
          style={{
            border: "1px solid #F0F0F0",
            borderRadius: 2,
            padding: 20,
            background: "#FFFFFF",
            boxShadow: "0 0.5px 2px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#0F0F0F",
              margin: 0,
              whiteSpace: "pre-wrap",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            {doctorNote.note}
          </p>
        </div>
      </div>

      {/* Section: The plan */}
      <div style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#0F0F0F",
            margin: 0,
            marginBottom: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          The plan
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#8A8A8A",
            margin: 0,
            marginBottom: 24,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {TRAINING_PLAN.name}. Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}.
        </p>

        {TRAINING_PLAN.weeklySchedule.map((day, dayIdx) => (
          <div key={day.day} style={{ marginBottom: dayIdx < TRAINING_PLAN.weeklySchedule.length - 1 ? 32 : 0 }}>
            <div className="flex items-baseline justify-between" style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#0F0F0F",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {day.day}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#8A8A8A",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                {day.name}
              </span>
            </div>

            {day.exercises.map((ex) => (
              <div
                key={ex.name}
                className="flex items-baseline justify-between"
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingLeft: 12,
                  borderBottom: "1px solid #F0F0F0",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "#0F0F0F",
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {ex.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#8A8A8A",
                    fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
                  }}
                >
                  {ex.sets}x{ex.reps}
                  {ex.weight ? ` @ ${ex.weight}${ex.unit}` : ` ${ex.unit}`}
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* Medical considerations */}
        <div style={{ marginTop: 24 }}>
          <span
            style={{
              fontSize: 10,
              color: "#8A8A8A",
              fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            Medical notes
          </span>
          {TRAINING_PLAN.medicalConsiderations.map((note, i) => (
            <p
              key={i}
              style={{
                fontSize: 12,
                color: "#8A8A8A",
                lineHeight: 1.5,
                margin: 0,
                marginTop: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {note}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          borderTop: "1px solid #F0F0F0",
          paddingTop: 32,
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: "#0F0F0F",
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 24,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          This is the trajectory you change. Your next blood test is in 6 months.
          Between now and then, the green line is possible.
        </p>

        <Link href="/smith10" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "#0F0F0F",
              color: "#FEFFFE",
              padding: "16px 24px",
              borderRadius: 2,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.02em",
              cursor: "pointer",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            Back to trajectory
          </div>
        </Link>
      </div>
    </div>
  );
}
