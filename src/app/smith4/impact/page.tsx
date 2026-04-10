"use client";

import Link from "next/link";
import {
  TRAINING_PLAN,
  BLOOD_TEST_HISTORY,
  BIOMETRICS_HISTORY,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Droplets,
  Heart,
  Scale,
  Activity,
  Target,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Dumbbell,
  ChevronRight,
  Info,
  Flame,
} from "lucide-react";

const plan = TRAINING_PLAN;
const glucoseHistory = getMarkerHistory("f-Glucose");
const hba1cHistory = getMarkerHistory("HbA1c");
const cholHistory = getMarkerHistory("TC");
const latestBio = BIOMETRICS_HISTORY[0];
const prevBio = BIOMETRICS_HISTORY[1];

// Calculate changes since program started (Jan 2026)
// Using most recent vs previous readings
const glucoseNow = glucoseHistory[glucoseHistory.length - 1]?.value || 0;
const glucosePrev = glucoseHistory[glucoseHistory.length - 2]?.value || 0;

export default function ImpactPage() {
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
          Health Impact
        </span>
      </header>

      <main style={{ padding: "20px 20px 80px", maxWidth: 480, margin: "0 auto" }}>
        {/* Context banner */}
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
              top: -15,
              right: -15,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 8,
            }}
          >
            Training + Health
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            How your training is affecting your body
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.45,
            }}
          >
            {plan.totalCompleted} sessions completed over {plan.currentWeek}{" "}
            weeks. Here is what your blood tests and biometrics show.
          </p>
        </div>

        {/* Primary target: Blood sugar */}
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
            Primary target
          </h2>

          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "18px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--amber-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Droplets size={18} color="var(--amber-text)" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Blood sugar (fasting)
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    Fasting glucose - your key marker
                  </div>
                </div>
              </div>
            </div>

            {/* Trend visualization */}
            <div
              style={{
                padding: "16px 0 12px",
                marginBottom: 12,
              }}
            >
              <MiniTrend
                data={glucoseHistory}
                refLow={3.9}
                refHigh={6.0}
                unit="mmol/L"
                color="var(--amber)"
                warningZone={5.6}
              />
            </div>

            <div
              style={{
                padding: "12px 14px",
                background: "var(--amber-bg)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "var(--amber-text)" }}>Status:</strong>{" "}
              Your fasting glucose rose from {glucoseHistory[0]?.value} to{" "}
              {glucoseHistory[glucoseHistory.length - 1]?.value} over 5 years.
              Since starting training, the goal is to halt and reverse this
              trend. Your next blood test (Sep 2026) will show whether training
              is working.
            </div>
          </div>
        </div>

        {/* Secondary markers */}
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
            Other markers training affects
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* HbA1c */}
            <MarkerCard
              icon={<Droplets size={16} color="var(--teal-text)" />}
              iconBg="var(--teal-bg)"
              label="HbA1c (long-term blood sugar)"
              current={`${hba1cHistory[hba1cHistory.length - 1]?.value} mmol/mol`}
              status="normal"
              statusText="Normal range - but approaching 42 (pre-diabetic)"
              detail="3-month average of blood sugar. Still safe, but needs watching."
            />

            {/* Cholesterol */}
            <MarkerCard
              icon={<Heart size={16} color="var(--amber-text)" />}
              iconBg="var(--amber-bg)"
              label="Total cholesterol"
              current={`${cholHistory[cholHistory.length - 1]?.value} mmol/L`}
              status="borderline"
              statusText="Borderline - slightly above 5.0 target"
              detail="Exercise raises HDL (good cholesterol) and lowers LDL (bad cholesterol). Your HDL is already healthy at 1.6."
            />

            {/* Blood pressure */}
            <MarkerCard
              icon={<Activity size={16} color="var(--green-text)" />}
              iconBg="var(--green-bg)"
              label="Blood pressure"
              current={latestBio.bloodPressure}
              status="normal"
              statusText="Controlled with Enalapril + exercise"
              detail="Was 142/88 before medication. Now 132/82. Regular exercise helps maintain this improvement."
            />

            {/* Weight */}
            <MarkerCard
              icon={<Scale size={16} color="var(--text-secondary)" />}
              iconBg="var(--bg-elevated)"
              label="Weight"
              current={`${latestBio.weight} kg / BMI ${latestBio.bmi}`}
              status="stable"
              statusText="Stable at 78kg - waist 86cm (target: below 88)"
              detail="Weight alone does not tell the full story. Waist circumference is more important for metabolic risk. Yours is 86cm, close to the 88cm threshold."
            />
          </div>
        </div>

        {/* Risk assessment */}
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
            Risk profile
          </h2>

          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 18,
              padding: "18px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <RiskItem
              label="Type 2 diabetes risk"
              level={RISK_ASSESSMENTS.diabetes.riskLabel}
              trend="Worsening"
              trendColor="var(--amber-text)"
              tenYear={RISK_ASSESSMENTS.diabetes.tenYearRisk}
              factors={RISK_ASSESSMENTS.diabetes.keyFactors
                .filter((f) => f.changeable)
                .map((f) => f.name)}
            />

            <div
              style={{
                height: 1,
                background: "var(--divider)",
                margin: "14px 0",
              }}
            />

            <RiskItem
              label="Cardiovascular risk"
              level={RISK_ASSESSMENTS.cardiovascular.riskLabel}
              trend="Stable"
              trendColor="var(--green-text)"
              tenYear={RISK_ASSESSMENTS.cardiovascular.tenYearRisk}
              factors={RISK_ASSESSMENTS.cardiovascular.keyFactors
                .filter((f) => f.changeable)
                .map((f) => f.name)}
            />
          </div>
        </div>

        {/* What you can control */}
        <div
          style={{
            background: "#FFF3ED",
            borderRadius: 18,
            padding: "18px",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#FF6B35",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Flame size={16} />
            What training changes
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ChangeItem
              text="Muscle tissue absorbs glucose without needing insulin - more muscle = better blood sugar control"
            />
            <ChangeItem
              text="Resistance training improves insulin sensitivity for 24-48 hours after each session"
            />
            <ChangeItem
              text="Consistent training reduces visceral fat (the dangerous fat around organs) even when weight stays the same"
            />
            <ChangeItem
              text="Exercise lowers resting blood pressure by 5-8 mmHg on average"
            />
          </div>
        </div>

        {/* Next milestone */}
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
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Target size={16} color="#FF6B35" />
            Next checkpoint
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              marginBottom: 12,
            }}
          >
            Your next blood test is scheduled for{" "}
            <strong>September 2026</strong>. That test will measure whether 8
            months of training has changed your glucose trajectory. The goal:
            fasting glucose below 5.6 and HbA1c stable below 42.
          </p>
          <Link
            href="/smith4/results"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 700,
              color: "#FF6B35",
              textDecoration: "none",
            }}
          >
            View latest blood test results
            <ChevronRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}

function MiniTrend({
  data,
  refLow,
  refHigh,
  unit,
  color,
  warningZone,
}: {
  data: { date: string; value: number }[];
  refLow: number;
  refHigh: number;
  unit: string;
  color: string;
  warningZone?: number;
}) {
  const minVal = Math.min(...data.map((d) => d.value), refLow) - 0.3;
  const maxVal = Math.max(...data.map((d) => d.value), refHigh) + 0.3;
  const range = maxVal - minVal;
  const width = 320;
  const height = 100;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.value - minVal) / range) * height,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const refHighY = height - ((refHigh - minVal) / range) * height;
  const warningY = warningZone
    ? height - ((warningZone - minVal) / range) * height
    : null;

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: 100 }}
        preserveAspectRatio="none"
      >
        {/* Reference high line */}
        <line
          x1={0}
          y1={refHighY}
          x2={width}
          y2={refHighY}
          stroke="var(--red)"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.4}
        />

        {/* Warning zone line */}
        {warningY !== null && (
          <line
            x1={0}
            y1={warningY}
            x2={width}
            y2={warningY}
            stroke="var(--amber)"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.4}
          />
        )}

        {/* Trend line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? color : "#fff"}
            stroke={color}
            strokeWidth={2}
          />
        ))}
      </svg>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              fontSize: 10,
              color:
                i === data.length - 1 ? "var(--text)" : "var(--text-muted)",
              fontWeight: i === data.length - 1 ? 700 : 400,
              textAlign: "center",
            }}
          >
            <div>{d.value}</div>
            <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
              {new Date(d.date).getFullYear()}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 10,
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            color: "var(--text-muted)",
          }}
        >
          <div
            style={{
              width: 12,
              height: 1,
              borderTop: "2px dashed var(--red)",
              opacity: 0.4,
            }}
          />
          Upper limit ({refHigh})
        </div>
        {warningZone && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: "var(--text-muted)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 1,
                borderTop: "2px dashed var(--amber)",
                opacity: 0.4,
              }}
            />
            Watch zone ({warningZone})
          </div>
        )}
      </div>
    </div>
  );
}

function MarkerCard({
  icon,
  iconBg,
  label,
  current,
  status,
  statusText,
  detail,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  current: string;
  status: "normal" | "borderline" | "stable";
  statusText: string;
  detail: string;
}) {
  const statusColor =
    status === "normal"
      ? "var(--green-text)"
      : status === "borderline"
      ? "var(--amber-text)"
      : "var(--text-secondary)";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 16,
        padding: "16px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
          <span
            style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          {current}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: statusColor,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {statusText}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.5,
        }}
      >
        {detail}
      </div>
    </div>
  );
}

function RiskItem({
  label,
  level,
  trend,
  trendColor,
  tenYear,
  factors,
}: {
  label: string;
  level: string;
  trend: string;
  trendColor: string;
  tenYear: string;
  factors: string[];
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: trendColor,
          }}
        >
          {level}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <span>
          Trend:{" "}
          <span style={{ color: trendColor, fontWeight: 600 }}>{trend}</span>
        </span>
        <span>10-year risk: {tenYear}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {factors.map((f) => (
          <span
            key={f}
            style={{
              fontSize: 11,
              padding: "3px 8px",
              background: "var(--bg-elevated)",
              borderRadius: 6,
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

function ChangeItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <Dumbbell
        size={14}
        color="#FF6B35"
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.45,
        }}
      >
        {text}
      </span>
    </div>
  );
}
