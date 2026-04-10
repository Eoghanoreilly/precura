"use client";

import React, { useState } from "react";
import {
  PATIENT,
  FAMILY_HISTORY,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  TRAINING_PLAN,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

/* ============================================================================
   SHARED STYLES
   ============================================================================ */

const serif = 'Georgia, "Times New Roman", serif';
const sans =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

const BAND_DARK = "#1A0F2E";
const BAND_LIGHT = "#2D1B47";
const ACCENT = "#C77DFF";
const TEXT_PRIMARY = "#F8F4FB";
const TEXT_SECONDARY = "#C9B8D4";
const BORDER = "#472B5E";
const SUCCESS = "#52B788";
const WARNING = "#FFD60A";
const DANGER = "#FF8FB1";

/* ============================================================================
   SECTION 1: HERO
   ============================================================================ */

function HeroSection() {
  const motherAge = FAMILY_HISTORY.find((f) => f.relative === "Mother")
    ?.ageAtDiagnosis;
  const yearsLeft = motherAge ? motherAge - PATIENT.age : 18;

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center px-6 py-24 lg:py-36"
      style={{ background: BAND_DARK, minHeight: "100dvh" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Tagline */}
        <div
          className="inline-block px-4 py-1.5 mb-8"
          style={{
            background: "rgba(199,125,255,0.12)",
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            color: ACCENT,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: sans,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Predictive Health
        </div>

        {/* Main headline */}
        <h1
          className="mb-6"
          style={{
            fontFamily: serif,
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: TEXT_PRIMARY,
          }}
        >
          Break The
          <br />
          <span style={{ color: ACCENT, fontStyle: "italic" }}>Pattern</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-10 mx-auto"
          style={{
            fontFamily: sans,
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: TEXT_SECONDARY,
            lineHeight: 1.7,
            maxWidth: 560,
          }}
        >
          Your mother was diagnosed with type 2 diabetes at {motherAge}. Her
          mother at 62. You are {PATIENT.age}. You have{" "}
          <span style={{ color: WARNING, fontWeight: 600 }}>
            {yearsLeft} years
          </span>{" "}
          to change the story.
        </p>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <span
            style={{
              fontSize: 13,
              color: TEXT_SECONDARY,
              fontFamily: sans,
              letterSpacing: "0.03em",
            }}
          >
            Scroll to see your family health story
          </span>
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            style={{ opacity: 0.5 }}
          >
            <rect
              x="1"
              y="1"
              width="18"
              height="26"
              rx="9"
              stroke={ACCENT}
              strokeWidth="1.5"
            />
            <circle cx="10" cy="9" r="2.5" fill={ACCENT}>
              <animate
                attributeName="cy"
                values="9;17;9"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 2: FAMILY TREE
   ============================================================================ */

function FamilyTreeSection() {
  const relatives = [
    {
      label: "Grandmother",
      relation: "Mother's side",
      condition: "Type 2 Diabetes",
      age: 62,
      status: "Deceased at 78",
      x: 140,
      y: 60,
      color: DANGER,
    },
    {
      label: "Grandfather",
      relation: "Father's side",
      condition: "Stroke",
      age: 71,
      status: "Deceased at 73",
      x: 460,
      y: 60,
      color: DANGER,
    },
    {
      label: "Mother",
      relation: "",
      condition: "Type 2 Diabetes",
      age: 58,
      status: "Living, on medication",
      x: 180,
      y: 220,
      color: WARNING,
    },
    {
      label: "Father",
      relation: "",
      condition: "Heart attack",
      age: 65,
      status: "Living, stent placed",
      x: 420,
      y: 220,
      color: WARNING,
    },
  ];

  return (
    <section
      id="family-tree"
      className="px-6 py-20 lg:py-28"
      style={{ background: BAND_LIGHT }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: TEXT_PRIMARY,
              marginBottom: 12,
            }}
          >
            Your Family&apos;s Health Legacy
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: 16,
              color: TEXT_SECONDARY,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Four family members. Two conditions. One pattern emerging across
            generations.
          </p>
        </div>

        {/* SVG Family Tree */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <svg
            viewBox="0 0 600 440"
            className="w-full"
            style={{ maxWidth: 600, minWidth: 320 }}
          >
            {/* Connection lines */}
            {/* Grandmother to Mother */}
            <line
              x1="140"
              y1="95"
              x2="180"
              y2="195"
              stroke={BORDER}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Grandfather to Father */}
            <line
              x1="460"
              y1="95"
              x2="420"
              y2="195"
              stroke={BORDER}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Mother to Anna */}
            <line
              x1="180"
              y1="255"
              x2="300"
              y2="350"
              stroke={BORDER}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Father to Anna */}
            <line
              x1="420"
              y1="255"
              x2="300"
              y2="350"
              stroke={BORDER}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Generation labels */}
            <text
              x="20"
              y="78"
              fill={TEXT_SECONDARY}
              style={{ fontFamily: sans, fontSize: 11 }}
              opacity={0.6}
            >
              Grandparents
            </text>
            <text
              x="20"
              y="238"
              fill={TEXT_SECONDARY}
              style={{ fontFamily: sans, fontSize: 11 }}
              opacity={0.6}
            >
              Parents
            </text>
            <text
              x="20"
              y="378"
              fill={TEXT_SECONDARY}
              style={{ fontFamily: sans, fontSize: 11 }}
              opacity={0.6}
            >
              You
            </text>

            {/* Relative nodes */}
            {relatives.map((r) => (
              <g key={r.label}>
                {/* Glow behind circle */}
                <circle
                  cx={r.x}
                  cy={r.y}
                  r="32"
                  fill={r.color}
                  opacity={0.08}
                />
                <circle
                  cx={r.x}
                  cy={r.y}
                  r="22"
                  fill="none"
                  stroke={r.color}
                  strokeWidth="1.5"
                  opacity={0.6}
                />
                <circle cx={r.x} cy={r.y} r="4" fill={r.color} />
                <text
                  x={r.x}
                  y={r.y + 40}
                  textAnchor="middle"
                  fill={TEXT_PRIMARY}
                  style={{ fontFamily: sans, fontSize: 13, fontWeight: 600 }}
                >
                  {r.label}
                </text>
                <text
                  x={r.x}
                  y={r.y + 55}
                  textAnchor="middle"
                  fill={r.color}
                  style={{ fontFamily: sans, fontSize: 11 }}
                >
                  {r.condition} at {r.age}
                </text>
              </g>
            ))}

            {/* Anna - the center, different treatment */}
            <circle
              cx="300"
              cy="370"
              r="36"
              fill={ACCENT}
              opacity={0.1}
            />
            <circle
              cx="300"
              cy="370"
              r="26"
              fill="none"
              stroke={ACCENT}
              strokeWidth="2"
            />
            <text
              x="300"
              y="376"
              textAnchor="middle"
              fill={ACCENT}
              style={{
                fontFamily: serif,
                fontSize: 16,
                fontWeight: 700,
                fontStyle: "italic",
              }}
            >
              You
            </text>
            <text
              x="300"
              y="416"
              textAnchor="middle"
              fill={TEXT_PRIMARY}
              style={{ fontFamily: sans, fontSize: 13, fontWeight: 600 }}
            >
              {PATIENT.firstName}, {PATIENT.age}
            </text>
            <text
              x="300"
              y="432"
              textAnchor="middle"
              fill={SUCCESS}
              style={{ fontFamily: sans, fontSize: 11 }}
            >
              Breaking the pattern
            </text>
          </svg>
        </div>

        {/* Family condition cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {FAMILY_HISTORY.map((member) => (
            <div
              key={member.relative}
              className="p-5"
              style={{
                background: BAND_DARK,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 15,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {member.relative}
                  </div>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      color: TEXT_SECONDARY,
                      marginTop: 2,
                    }}
                  >
                    {member.status}
                  </div>
                </div>
                <div
                  className="px-2.5 py-1"
                  style={{
                    background: "rgba(255,143,177,0.12)",
                    borderRadius: 8,
                    color: DANGER,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: sans,
                  }}
                >
                  Age {member.ageAtDiagnosis}
                </div>
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  color: ACCENT,
                }}
              >
                {member.condition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 3: GLUCOSE TIMELINE
   ============================================================================ */

function TimelineSection() {
  const glucoseData = getMarkerHistory("f-Glucose");
  const hba1cData = getMarkerHistory("HbA1c");
  const cholData = getMarkerHistory("TC");

  // Glucose chart dimensions
  const chartW = 600;
  const chartH = 200;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const minGlucose = 4.5;
  const maxGlucose = 6.5;

  const glucosePoints = glucoseData.map((d, i) => {
    const x = padL + (i / (glucoseData.length - 1)) * plotW;
    const y =
      padT +
      plotH -
      ((d.value - minGlucose) / (maxGlucose - minGlucose)) * plotH;
    return { x, y, ...d };
  });

  const linePath = glucosePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${glucosePoints[glucosePoints.length - 1].x} ${padT + plotH} L ${glucosePoints[0].x} ${padT + plotH} Z`;

  // Pre-diabetes threshold line
  const thresholdY =
    padT +
    plotH -
    ((5.6 - minGlucose) / (maxGlucose - minGlucose)) * plotH;

  // Mother's diagnosis line (projected at age 58 = year ~2043)
  const normalHighY =
    padT +
    plotH -
    ((6.0 - minGlucose) / (maxGlucose - minGlucose)) * plotH;

  return (
    <section
      id="timeline"
      className="px-6 py-20 lg:py-28"
      style={{ background: BAND_DARK }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: TEXT_PRIMARY,
              marginBottom: 12,
            }}
          >
            The Numbers Tell a Story
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: 16,
              color: TEXT_SECONDARY,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Five years of blood tests. Each one &quot;normal&quot; on its own.
            Together, they reveal a pattern no single visit would catch.
          </p>
        </div>

        {/* Glucose chart */}
        <div
          className="p-6 lg:p-8 mb-8"
          style={{
            background: BAND_LIGHT,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
          }}
        >
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 22,
                  fontWeight: 400,
                  color: TEXT_PRIMARY,
                }}
              >
                Fasting Glucose
              </h3>
              <p
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: TEXT_SECONDARY,
                  marginTop: 4,
                }}
              >
                Blood sugar (fasting) over 5 years
              </p>
            </div>
            <div className="text-right">
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 28,
                  fontWeight: 700,
                  color: WARNING,
                }}
              >
                {glucoseData[glucoseData.length - 1]?.value}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 12,
                  color: TEXT_SECONDARY,
                }}
              >
                mmol/L (latest)
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full"
              style={{ maxWidth: chartW, minWidth: 340 }}
            >
              <defs>
                <linearGradient
                  id="glucose-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="line-gradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor={SUCCESS} />
                  <stop offset="60%" stopColor={WARNING} />
                  <stop offset="100%" stopColor={DANGER} />
                </linearGradient>
              </defs>

              {/* Y axis grid lines */}
              {[4.5, 5.0, 5.5, 6.0, 6.5].map((val) => {
                const y =
                  padT +
                  plotH -
                  ((val - minGlucose) / (maxGlucose - minGlucose)) * plotH;
                return (
                  <g key={val}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={chartW - padR}
                      y2={y}
                      stroke={BORDER}
                      strokeWidth="0.5"
                    />
                    <text
                      x={padL - 8}
                      y={y + 4}
                      textAnchor="end"
                      fill={TEXT_SECONDARY}
                      style={{ fontFamily: sans, fontSize: 10 }}
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Pre-diabetes threshold zone */}
              <rect
                x={padL}
                y={thresholdY}
                width={plotW}
                height={normalHighY - thresholdY}
                fill={WARNING}
                opacity={0.06}
              />

              {/* Threshold line at 5.6 */}
              <line
                x1={padL}
                y1={thresholdY}
                x2={chartW - padR}
                y2={thresholdY}
                stroke={WARNING}
                strokeWidth="1"
                strokeDasharray="6 4"
                opacity={0.5}
              />
              <text
                x={chartW - padR + 2}
                y={thresholdY - 4}
                fill={WARNING}
                style={{ fontFamily: sans, fontSize: 9 }}
                opacity={0.7}
              >
                Pre-diabetes
              </text>

              {/* Normal high line at 6.0 */}
              <line
                x1={padL}
                y1={normalHighY}
                x2={chartW - padR}
                y2={normalHighY}
                stroke={DANGER}
                strokeWidth="1"
                strokeDasharray="6 4"
                opacity={0.4}
              />
              <text
                x={chartW - padR + 2}
                y={normalHighY - 4}
                fill={DANGER}
                style={{ fontFamily: sans, fontSize: 9 }}
                opacity={0.7}
              >
                Diabetes zone
              </text>

              {/* Area fill */}
              <path d={areaPath} fill="url(#glucose-gradient)" />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {glucosePoints.map((p, i) => (
                <g key={p.date}>
                  <circle cx={p.x} cy={p.y} r="5" fill={BAND_LIGHT} />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill={
                      p.value >= 5.6
                        ? WARNING
                        : p.value >= 5.3
                          ? ACCENT
                          : SUCCESS
                    }
                  />
                  {/* Year label */}
                  <text
                    x={p.x}
                    y={padT + plotH + 18}
                    textAnchor="middle"
                    fill={TEXT_SECONDARY}
                    style={{ fontFamily: sans, fontSize: 10 }}
                  >
                    {p.date.slice(0, 4)}
                  </text>
                  {/* Value label */}
                  {(i === 0 || i === glucosePoints.length - 1) && (
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fill={TEXT_PRIMARY}
                      style={{
                        fontFamily: sans,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {p.value}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Insight callout */}
          <div
            className="mt-6 p-4"
            style={{
              background: "rgba(199,125,255,0.08)",
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontFamily: sans,
                fontSize: 14,
                color: TEXT_SECONDARY,
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: ACCENT, fontWeight: 600 }}>
                The pattern:
              </span>{" "}
              Your fasting glucose has risen from {glucoseData[0]?.value} to{" "}
              {glucoseData[glucoseData.length - 1]?.value} mmol/L over 5 years.
              Each test was marked &quot;normal.&quot; But the trend is not
              normal. Your mother&apos;s glucose followed this same trajectory
              before her diagnosis at 58.
            </p>
          </div>
        </div>

        {/* Secondary markers row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* HbA1c card */}
          <MarkerCard
            title="HbA1c"
            subtitle="Long-term blood sugar"
            data={hba1cData}
            unit="mmol/mol"
            thresholdLabel="Pre-diabetes"
            threshold={42}
            min={30}
            max={48}
            statusColor={WARNING}
            insight="Approaching pre-diabetic range (42+). Currently 38, up from 35."
          />

          {/* Cholesterol card */}
          <MarkerCard
            title="Total Cholesterol"
            subtitle="All cholesterol combined"
            data={cholData}
            unit="mmol/L"
            thresholdLabel="Above optimal"
            threshold={5.0}
            min={4.0}
            max={6.0}
            statusColor={WARNING}
            insight="Crept above optimal (5.0) for the first time. Borderline at 5.1."
          />
        </div>
      </div>
    </section>
  );
}

/* Reusable mini marker card with sparkline */
function MarkerCard({
  title,
  subtitle,
  data,
  unit,
  thresholdLabel,
  threshold,
  min,
  max,
  statusColor,
  insight,
}: {
  title: string;
  subtitle: string;
  data: { date: string; value: number }[];
  unit: string;
  thresholdLabel: string;
  threshold: number;
  min: number;
  max: number;
  statusColor: string;
  insight: string;
}) {
  const w = 260;
  const h = 60;
  const pad = 4;

  const points = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
    const y = pad + (h - pad * 2) - ((d.value - min) / (max - min)) * (h - pad * 2);
    return { x, y, ...d };
  });

  const sparkPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const thresholdY = pad + (h - pad * 2) - ((threshold - min) / (max - min)) * (h - pad * 2);
  const latest = data[data.length - 1];

  return (
    <div
      className="p-5"
      style={{
        background: BAND_LIGHT,
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
      }}
    >
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <h4
            style={{
              fontFamily: serif,
              fontSize: 17,
              fontWeight: 400,
              color: TEXT_PRIMARY,
            }}
          >
            {title}
          </h4>
          <p
            style={{
              fontFamily: sans,
              fontSize: 12,
              color: TEXT_SECONDARY,
              marginTop: 2,
            }}
          >
            {subtitle}
          </p>
        </div>
        <div className="text-right">
          <span
            style={{
              fontFamily: sans,
              fontSize: 22,
              fontWeight: 700,
              color: statusColor,
            }}
          >
            {latest?.value}
          </span>
          <span
            style={{
              fontFamily: sans,
              fontSize: 11,
              color: TEXT_SECONDARY,
              marginLeft: 4,
            }}
          >
            {unit}
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full my-3"
        style={{ maxWidth: w }}
      >
        <line
          x1={pad}
          y1={thresholdY}
          x2={w - pad}
          y2={thresholdY}
          stroke={statusColor}
          strokeWidth="0.75"
          strokeDasharray="4 3"
          opacity={0.4}
        />
        <path d={sparkPath} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3.5"
            fill={statusColor}
          />
        )}
      </svg>

      <p
        style={{
          fontFamily: sans,
          fontSize: 12,
          color: TEXT_SECONDARY,
          lineHeight: 1.5,
        }}
      >
        {insight}
      </p>
    </div>
  );
}

/* ============================================================================
   SECTION 4: RISK ASSESSMENT
   ============================================================================ */

function RiskSection() {
  const risks = [
    {
      key: "diabetes",
      label: "Type 2 Diabetes",
      plain: "Blood sugar disease",
      data: RISK_ASSESSMENTS.diabetes,
      familyLink: "Mother diagnosed at 58, grandmother at 62",
      icon: "drop",
    },
    {
      key: "cardiovascular",
      label: "Cardiovascular Disease",
      plain: "Heart and blood vessel disease",
      data: RISK_ASSESSMENTS.cardiovascular,
      familyLink: "Father had heart attack at 65, grandfather had stroke at 71",
      icon: "heart",
    },
  ];

  const levelColor = (level: string) => {
    if (level.includes("low") && !level.includes("moderate")) return SUCCESS;
    if (level.includes("moderate")) return WARNING;
    return DANGER;
  };

  const levelWidth = (level: string) => {
    if (level.includes("low") && !level.includes("moderate")) return "25%";
    if (level === "low_moderate") return "40%";
    if (level === "moderate") return "55%";
    return "75%";
  };

  return (
    <section
      id="risks"
      className="px-6 py-20 lg:py-28"
      style={{ background: BAND_LIGHT }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: TEXT_PRIMARY,
              marginBottom: 12,
            }}
          >
            Where You Stand Today
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: 16,
              color: TEXT_SECONDARY,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Your risk profile based on blood tests, biometrics, family history,
            and validated clinical models.
          </p>
        </div>

        {/* Risk cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {risks.map((risk) => (
            <div
              key={risk.key}
              className="p-6"
              style={{
                background: BAND_DARK,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: 20,
                      fontWeight: 400,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {risk.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      color: TEXT_SECONDARY,
                      marginTop: 2,
                    }}
                  >
                    {risk.plain}
                  </p>
                </div>
                <div
                  className="px-3 py-1.5"
                  style={{
                    background: `${levelColor(risk.data.riskLevel)}15`,
                    borderRadius: 8,
                    color: levelColor(risk.data.riskLevel),
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: sans,
                  }}
                >
                  {risk.data.riskLabel}
                </div>
              </div>

              {/* Risk bar */}
              <div className="mb-4">
                <div
                  className="w-full"
                  style={{
                    height: 6,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: levelWidth(risk.data.riskLevel),
                      height: "100%",
                      background: `linear-gradient(90deg, ${SUCCESS}, ${levelColor(risk.data.riskLevel)})`,
                      borderRadius: 3,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <div
                  className="flex justify-between mt-1.5"
                  style={{
                    fontFamily: sans,
                    fontSize: 10,
                    color: TEXT_SECONDARY,
                  }}
                >
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>

              {/* 10-year risk */}
              <div
                className="flex items-center gap-3 mb-4 p-3"
                style={{
                  background: "rgba(199,125,255,0.06)",
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: 24,
                    fontWeight: 700,
                    color: levelColor(risk.data.riskLevel),
                  }}
                >
                  {risk.data.tenYearRisk}
                </span>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: 12,
                    color: TEXT_SECONDARY,
                  }}
                >
                  10-year risk estimate
                </span>
              </div>

              {/* Family link */}
              <div
                className="flex items-start gap-2 mb-4"
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: TEXT_SECONDARY,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: DANGER, flexShrink: 0 }}>*</span>
                <span>
                  <span style={{ color: DANGER, fontWeight: 500 }}>
                    Family:
                  </span>{" "}
                  {risk.familyLink}
                </span>
              </div>

              {/* Key factors */}
              <div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 11,
                    color: TEXT_SECONDARY,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Key factors
                </div>
                {risk.data.keyFactors.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center gap-2 mb-1.5"
                    style={{ fontFamily: sans, fontSize: 13 }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background:
                          f.impact === "positive"
                            ? SUCCESS
                            : f.impact === "high"
                              ? DANGER
                              : f.impact === "medium"
                                ? WARNING
                                : TEXT_SECONDARY,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {f.name}
                    </span>
                    {f.changeable ? (
                      <span
                        style={{
                          fontSize: 10,
                          color: SUCCESS,
                          marginLeft: "auto",
                        }}
                      >
                        Changeable
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          color: TEXT_SECONDARY,
                          marginLeft: "auto",
                          opacity: 0.6,
                        }}
                      >
                        Fixed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Metabolic syndrome warning */}
        <div
          className="p-6"
          style={{
            background: BAND_DARK,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 20,
                  fontWeight: 400,
                  color: TEXT_PRIMARY,
                }}
              >
                Metabolic Syndrome
              </h3>
              <p
                style={{
                  fontFamily: sans,
                  fontSize: 12,
                  color: TEXT_SECONDARY,
                  marginTop: 2,
                }}
              >
                A cluster of conditions that raise disease risk
              </p>
            </div>
            <div
              className="px-3 py-1.5"
              style={{
                background: "rgba(255,214,10,0.12)",
                borderRadius: 8,
                color: WARNING,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: sans,
              }}
            >
              {RISK_ASSESSMENTS.metabolicSyndrome.metCount} of{" "}
              {RISK_ASSESSMENTS.metabolicSyndrome.threshold} criteria
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
              <div
                key={c.name}
                className="p-3 text-center"
                style={{
                  background: c.met
                    ? "rgba(255,143,177,0.08)"
                    : "rgba(82,183,136,0.06)",
                  border: `1px solid ${c.met ? "rgba(255,143,177,0.2)" : "rgba(82,183,136,0.15)"}`,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: c.met ? DANGER : SUCCESS,
                    margin: "0 auto 8px",
                  }}
                />
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 11,
                    color: TEXT_PRIMARY,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {c.name.split("(")[0].trim()}
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 13,
                    color: c.met ? DANGER : SUCCESS,
                    fontWeight: 600,
                  }}
                >
                  {c.value}
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 10,
                    color: TEXT_SECONDARY,
                    marginTop: 4,
                  }}
                >
                  {c.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 5: TRAINING PLAN (BREAKING THE PATTERN)
   ============================================================================ */

function TrainingSection() {
  const [openDay, setOpenDay] = useState<string | null>(null);
  const plan = TRAINING_PLAN;
  const progress = Math.round(
    (plan.completedThisWeek / plan.weeklySchedule.length) * 100
  );
  const totalProgress = Math.round(
    (plan.totalCompleted / (plan.totalWeeks * plan.weeklySchedule.length)) * 100
  );

  const bio = BIOMETRICS_HISTORY[0];

  return (
    <section
      id="training"
      className="px-6 py-20 lg:py-28"
      style={{ background: BAND_DARK }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: TEXT_PRIMARY,
              marginBottom: 12,
            }}
          >
            Your Plan to Break It
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: 16,
              color: TEXT_SECONDARY,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A training program designed around your metabolic health goals.
            Created by a certified personal trainer. Reviewed by your doctor.
          </p>
        </div>

        {/* Progress overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Week progress */}
          <div
            className="p-5 text-center"
            style={{
              background: BAND_LIGHT,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
            }}
          >
            <div
              style={{
                fontFamily: sans,
                fontSize: 32,
                fontWeight: 700,
                color: ACCENT,
              }}
            >
              {plan.currentWeek}/{plan.totalWeeks}
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 13,
                color: TEXT_SECONDARY,
                marginTop: 4,
              }}
            >
              Weeks completed
            </div>
            {/* Progress bar */}
            <div
              className="mt-3 mx-auto"
              style={{
                height: 4,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                maxWidth: 120,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${totalProgress}%`,
                  height: "100%",
                  background: ACCENT,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>

          {/* This week */}
          <div
            className="p-5 text-center"
            style={{
              background: BAND_LIGHT,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
            }}
          >
            <div
              style={{
                fontFamily: sans,
                fontSize: 32,
                fontWeight: 700,
                color: SUCCESS,
              }}
            >
              {plan.completedThisWeek}/{plan.weeklySchedule.length}
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 13,
                color: TEXT_SECONDARY,
                marginTop: 4,
              }}
            >
              Sessions this week
            </div>
            <div
              className="mt-3 mx-auto"
              style={{
                height: 4,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                maxWidth: 120,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: SUCCESS,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>

          {/* Biometrics */}
          <div
            className="p-5 text-center"
            style={{
              background: BAND_LIGHT,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
            }}
          >
            <div
              style={{
                fontFamily: sans,
                fontSize: 32,
                fontWeight: 700,
                color: TEXT_PRIMARY,
              }}
            >
              {bio?.weight}
              <span
                style={{ fontSize: 16, fontWeight: 400, color: TEXT_SECONDARY }}
              >
                kg
              </span>
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 13,
                color: TEXT_SECONDARY,
                marginTop: 4,
              }}
            >
              Current weight (BMI {bio?.bmi})
            </div>
            <div
              className="mt-3"
              style={{
                fontFamily: sans,
                fontSize: 11,
                color: TEXT_SECONDARY,
              }}
            >
              Waist: {bio?.waist}cm / BP: {bio?.bloodPressure}
            </div>
          </div>
        </div>

        {/* Weekly schedule */}
        <div
          className="p-6"
          style={{
            background: BAND_LIGHT,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
          }}
        >
          <div className="flex items-baseline justify-between mb-6">
            <h3
              style={{
                fontFamily: serif,
                fontSize: 20,
                fontWeight: 400,
                color: TEXT_PRIMARY,
              }}
            >
              {plan.name}
            </h3>
            <span
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: TEXT_SECONDARY,
              }}
            >
              By {plan.createdBy.split(",")[0]}
            </span>
          </div>

          {/* Days */}
          <div className="space-y-3">
            {plan.weeklySchedule.map((day, dayIdx) => {
              const isOpen = openDay === day.day;
              const isDone = dayIdx < plan.completedThisWeek;

              return (
                <div key={day.day}>
                  <button
                    onClick={() => setOpenDay(isOpen ? null : day.day)}
                    className="w-full flex items-center justify-between p-4"
                    style={{
                      background: isOpen
                        ? "rgba(199,125,255,0.08)"
                        : BAND_DARK,
                      border: `1px solid ${isOpen ? ACCENT + "40" : BORDER}`,
                      borderRadius: isOpen ? "14px 14px 0 0" : 14,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          background: isDone ? SUCCESS : "rgba(255,255,255,0.06)",
                          border: isDone ? "none" : `1px solid ${BORDER}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isDone && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path
                              d="M1 5L4.5 8.5L11 1.5"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <div
                          style={{
                            fontFamily: sans,
                            fontSize: 15,
                            fontWeight: 600,
                            color: TEXT_PRIMARY,
                          }}
                        >
                          {day.day}
                        </div>
                        <div
                          style={{
                            fontFamily: sans,
                            fontSize: 12,
                            color: TEXT_SECONDARY,
                          }}
                        >
                          {day.name}
                        </div>
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke={TEXT_SECONDARY}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      className="p-4"
                      style={{
                        background: BAND_DARK,
                        border: `1px solid ${ACCENT}40`,
                        borderTop: "none",
                        borderRadius: "0 0 14px 14px",
                      }}
                    >
                      <table className="w-full">
                        <thead>
                          <tr>
                            {["Exercise", "Sets", "Reps", "Weight"].map(
                              (h) => (
                                <th
                                  key={h}
                                  className="text-left pb-2"
                                  style={{
                                    fontFamily: sans,
                                    fontSize: 11,
                                    color: TEXT_SECONDARY,
                                    fontWeight: 500,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map((ex) => (
                            <tr key={ex.name}>
                              <td
                                className="py-2"
                                style={{
                                  fontFamily: sans,
                                  fontSize: 14,
                                  color: TEXT_PRIMARY,
                                }}
                              >
                                {ex.name}
                                {ex.notes && (
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: TEXT_SECONDARY,
                                      marginTop: 1,
                                    }}
                                  >
                                    {ex.notes}
                                  </div>
                                )}
                              </td>
                              <td
                                className="py-2"
                                style={{
                                  fontFamily: sans,
                                  fontSize: 14,
                                  color: ACCENT,
                                }}
                              >
                                {ex.sets}
                              </td>
                              <td
                                className="py-2"
                                style={{
                                  fontFamily: sans,
                                  fontSize: 14,
                                  color: TEXT_PRIMARY,
                                }}
                              >
                                {ex.reps} {ex.unit}
                              </td>
                              <td
                                className="py-2"
                                style={{
                                  fontFamily: sans,
                                  fontSize: 14,
                                  color: ex.weight
                                    ? TEXT_PRIMARY
                                    : TEXT_SECONDARY,
                                }}
                              >
                                {ex.weight ? `${ex.weight}kg` : "BW"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Medical considerations */}
          <div className="mt-6">
            <div
              style={{
                fontFamily: sans,
                fontSize: 11,
                color: TEXT_SECONDARY,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Medical considerations from your doctor
            </div>
            {plan.medicalConsiderations.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-2 mb-2"
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: TEXT_SECONDARY,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: ACCENT, flexShrink: 0 }}>*</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 6: CALL TO ACTION
   ============================================================================ */

function ActionSection() {
  const motherAge = FAMILY_HISTORY.find((f) => f.relative === "Mother")
    ?.ageAtDiagnosis;
  const yearsLeft = motherAge ? motherAge - PATIENT.age : 18;

  return (
    <section
      id="action"
      className="px-6 py-24 lg:py-32"
      style={{ background: BAND_LIGHT }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          style={{
            fontFamily: serif,
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 400,
            color: TEXT_PRIMARY,
            marginBottom: 16,
          }}
        >
          {yearsLeft} Years. Your Choice.
        </h2>
        <p
          className="mx-auto mb-10"
          style={{
            fontFamily: sans,
            fontSize: 16,
            color: TEXT_SECONDARY,
            lineHeight: 1.7,
            maxWidth: 540,
          }}
        >
          Your grandmother was diagnosed at 62. Your mother at 58. The pattern
          says you could be next. But patterns are not destiny. Every training
          session, every smart food choice, every checkup is a step off the path
          they walked.
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              number: "01",
              title: "Test",
              desc: "Comprehensive blood work every 6 months to track your trajectory",
              color: ACCENT,
            },
            {
              number: "02",
              title: "Train",
              desc: "A program built around your metabolic health, not generic fitness",
              color: SUCCESS,
            },
            {
              number: "03",
              title: "Track",
              desc: "Doctor-reviewed progress connecting every marker to your family story",
              color: WARNING,
            },
          ].map((pillar) => (
            <div
              key={pillar.number}
              className="p-6"
              style={{
                background: BAND_DARK,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 32,
                  fontWeight: 200,
                  color: pillar.color,
                  marginBottom: 12,
                  opacity: 0.6,
                }}
              >
                {pillar.number}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 22,
                  fontWeight: 400,
                  color: TEXT_PRIMARY,
                  marginBottom: 8,
                }}
              >
                {pillar.title}
              </div>
              <p
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  color: TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <button
            className="px-8 py-4"
            style={{
              background: ACCENT,
              color: "#1A0F2E",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: sans,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(199,125,255,0.35)",
              letterSpacing: "-0.01em",
            }}
          >
            Start Breaking the Pattern
          </button>
          <span
            style={{
              fontFamily: sans,
              fontSize: 13,
              color: TEXT_SECONDARY,
            }}
          >
            Next blood test: September 2026
          </span>
        </div>

        {/* Footer attribution */}
        <div
          className="mt-20 pt-8"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <div
            style={{
              fontFamily: serif,
              fontSize: 20,
              fontWeight: 400,
              color: ACCENT,
              marginBottom: 4,
              fontStyle: "italic",
            }}
          >
            Precura
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 12,
              color: TEXT_SECONDARY,
            }}
          >
            Prediction is the cure
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   MAIN PAGE
   ============================================================================ */

export default function Smith5Page() {
  return (
    <>
      <HeroSection />
      <FamilyTreeSection />
      <TimelineSection />
      <RiskSection />
      <TrainingSection />
      <ActionSection />
    </>
  );
}
