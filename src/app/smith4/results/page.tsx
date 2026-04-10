"use client";

import Link from "next/link";
import {
  BLOOD_TEST_HISTORY,
  TRAINING_PLAN,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  ChevronRight,
  Droplet,
  TrendingUp,
  TrendingDown,
  Minus,
  Stethoscope,
  Dumbbell,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Target,
  FlaskConical,
} from "lucide-react";

const latestSession = BLOOD_TEST_HISTORY[0];
const previousSession = BLOOD_TEST_HISTORY[1];
const plan = TRAINING_PLAN;
const doctorNote = DOCTOR_NOTES[0];

// Find change for each marker between latest and previous
function getChange(shortName: string): { prev: number | null; direction: "up" | "down" | "same" } {
  const prev = previousSession?.results.find((r) => r.shortName === shortName);
  const curr = latestSession.results.find((r) => r.shortName === shortName);
  if (!prev || !curr) return { prev: null, direction: "same" };
  if (curr.value > prev.value) return { prev: prev.value, direction: "up" };
  if (curr.value < prev.value) return { prev: prev.value, direction: "down" };
  return { prev: prev.value, direction: "same" };
}

export default function ResultsPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <header
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          background: "var(--bg)",
          zIndex: 40,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/smith4"
          style={{
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={22} />
        </Link>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          Blood Test Results
        </span>
      </header>

      <main style={{ padding: "20px 20px 80px", maxWidth: 480, margin: "0 auto" }}>
        {/* Framing: this is a training progress report */}
        <div
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #E8522A 100%)",
            borderRadius: 18,
            padding: "20px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <FlaskConical size={18} color="rgba(255,255,255,0.8)" />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Training Progress Report
            </span>
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            Blood Test -{" "}
            {new Date(latestSession.date).toLocaleDateString("en-SE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Ordered by {latestSession.orderedBy} / {latestSession.lab}
          </p>
        </div>

        {/* Doctor's review */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 18,
            padding: "18px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--teal-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stethoscope size={18} color="var(--teal)" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Doctor's Review
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {doctorNote.author} / {new Date(doctorNote.date).toLocaleDateString("en-SE", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            Your blood sugar (fasting) continues its slow rise to 5.8. HbA1c
            (long-term blood sugar) is 38 - still normal but moving towards the
            pre-diabetic range. This is exactly why your training plan targets
            insulin sensitivity. Vitamin D is slightly low - I recommend a
            supplement. We will retest in September to measure the impact of your
            training.
          </p>
        </div>

        {/* Training context */}
        <div
          style={{
            background: "#FFF3ED",
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Dumbbell size={16} color="#FF6B35" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            At the time of this test, you were in week 8 of your{" "}
            {plan.name}. Results inform your training adjustments.
          </span>
        </div>

        {/* Results list */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 12,
            }}
          >
            All markers
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {latestSession.results.map((marker) => {
              const change = getChange(marker.shortName);
              return (
                <ResultRow key={marker.shortName} marker={marker} change={change} />
              );
            })}
          </div>
        </div>

        {/* Key takeaways */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 18,
            padding: "18px",
            border: "1px solid var(--border)",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Target size={16} color="#FF6B35" />
            What this means for your training
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <TakeawayItem
              icon={<AlertTriangle size={14} color="var(--amber-text)" />}
              text="Glucose at 5.8 confirms the need for your current program. Keep training 3x per week - your September test will show whether it is working."
            />
            <TakeawayItem
              icon={<CheckCircle2 size={14} color="var(--green)" />}
              text="Good HDL cholesterol (1.6) suggests your cardio work is paying off. Keep the Friday Full Body + Cardio sessions going."
            />
            <TakeawayItem
              icon={<Info size={14} color="var(--blue)" />}
              text="Vitamin D at 48 (slightly low). A daily supplement will support bone health and muscle recovery."
            />
          </div>
        </div>

        {/* Historical comparison */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 18,
            padding: "18px",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calendar size={16} color="var(--text-muted)" />
            Test History
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BLOOD_TEST_HISTORY.map((session, idx) => (
              <div
                key={session.date}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background:
                    idx === 0 ? "#FFF3ED" : "var(--bg-elevated)",
                  borderRadius: 10,
                  border:
                    idx === 0
                      ? "1px solid rgba(255,107,53,0.2)"
                      : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: idx === 0 ? 700 : 500,
                      color:
                        idx === 0 ? "#FF6B35" : "var(--text-secondary)",
                    }}
                  >
                    {new Date(session.date).toLocaleDateString("en-SE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {idx === 0 ? " (Latest)" : ""}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                    }}
                  >
                    {session.results.length} markers / {session.orderedBy}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                  }}
                >
                  {session.results.find((r) => r.shortName === "f-Glucose")
                    ?.value || "-"}{" "}
                  glucose
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ResultRow({
  marker,
  change,
}: {
  marker: (typeof BLOOD_TEST_HISTORY)[0]["results"][0];
  change: { prev: number | null; direction: "up" | "down" | "same" };
}) {
  const statusColor =
    marker.status === "normal"
      ? "var(--green)"
      : marker.status === "borderline"
      ? "var(--amber)"
      : "var(--red)";

  const statusBg =
    marker.status === "normal"
      ? "var(--green-bg)"
      : marker.status === "borderline"
      ? "var(--amber-bg)"
      : "var(--red-bg)";

  const statusTextColor =
    marker.status === "normal"
      ? "var(--green-text)"
      : marker.status === "borderline"
      ? "var(--amber-text)"
      : "var(--red-text)";

  // Range bar position
  const rangeWidth = marker.refHigh - marker.refLow;
  const displayLow = marker.refLow - rangeWidth * 0.2;
  const displayHigh = marker.refHigh + rangeWidth * 0.2;
  const displayRange = displayHigh - displayLow;
  const valuePos = Math.max(
    2,
    Math.min(98, ((marker.value - displayLow) / displayRange) * 100)
  );
  const refLowPos = ((marker.refLow - displayLow) / displayRange) * 100;
  const refHighPos = ((marker.refHigh - displayLow) / displayRange) * 100;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 14,
        padding: "14px 16px",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 1,
            }}
          >
            {marker.plainName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            {marker.name} ({marker.shortName})
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              {marker.value}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {marker.unit}
            </span>
          </div>
          {change.prev !== null && change.direction !== "same" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "flex-end",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              was {change.prev}
              {change.direction === "up" ? (
                <ArrowUpRight size={10} />
              ) : (
                <ArrowDownRight size={10} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Range bar */}
      <div
        style={{
          height: 8,
          background: "var(--bg-elevated)",
          borderRadius: 4,
          position: "relative",
          marginBottom: 6,
        }}
      >
        {/* Normal range */}
        <div
          style={{
            position: "absolute",
            left: `${refLowPos}%`,
            width: `${refHighPos - refLowPos}%`,
            height: "100%",
            background: "var(--green-bg)",
            borderRadius: 4,
          }}
        />
        {/* Value marker */}
        <div
          style={{
            position: "absolute",
            left: `${valuePos}%`,
            top: -3,
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `7px solid ${statusColor}`,
            transform: "translateX(-5px)",
          }}
        />
      </div>

      {/* Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          Ref: {marker.refLow} - {marker.refHigh} {marker.unit}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: statusTextColor,
            padding: "2px 8px",
            background: statusBg,
            borderRadius: 6,
            textTransform: "capitalize",
          }}
        >
          {marker.status}
        </span>
      </div>
    </div>
  );
}

function TakeawayItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <span
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}
