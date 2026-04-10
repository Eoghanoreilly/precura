"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  TreePine,
  TrendingUp,
  Shield,
  ClipboardList,
  Award,
  ChevronRight,
  AlertTriangle,
  User,
  ArrowLeft,
} from "lucide-react";
import {
  PATIENT,
  FAMILY_HISTORY,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// Deep purple accent palette for this vision
const PURPLE = {
  deep: "#4a148c",
  primary: "#6a1b9a",
  mid: "#8e24aa",
  light: "#ce93d8",
  pale: "#f3e5f5",
  wash: "#faf5ff",
  text: "#4a148c",
  accent: "#7c4dff",
};

// Family member data enriched with ages and conditions
const FAMILY_TREE = [
  {
    name: "Maternal Grandmother",
    relation: "Mormor",
    condition: "Type 2 Diabetes",
    plainCondition: "blood sugar disease",
    ageAtDiagnosis: 62,
    status: "Passed away at 78",
    generation: 0,
    side: "left" as const,
    icon: "grandmother",
  },
  {
    name: "Paternal Grandfather",
    relation: "Farfar",
    condition: "Stroke (brain blood clot)",
    plainCondition: "brain blood clot",
    ageAtDiagnosis: 71,
    status: "Passed away at 73",
    generation: 0,
    side: "right" as const,
    icon: "grandfather",
  },
  {
    name: "Mother",
    relation: "Mamma",
    condition: "Type 2 Diabetes",
    plainCondition: "blood sugar disease",
    ageAtDiagnosis: 58,
    status: "Living, on medication",
    generation: 1,
    side: "left" as const,
    icon: "mother",
  },
  {
    name: "Father",
    relation: "Pappa",
    condition: "Heart attack",
    plainCondition: "heart attack",
    ageAtDiagnosis: 65,
    status: "Living, stent placed",
    generation: 1,
    side: "right" as const,
    icon: "father",
  },
];

function FamilyMemberNode({
  member,
  delay,
}: {
  member: (typeof FAMILY_TREE)[0];
  delay: number;
}) {
  const isDeceased = member.status.includes("Passed") || member.status.includes("Deceased");
  const isDiabetes = member.condition.includes("Diabetes");

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px 14px",
          border: `1px solid ${isDeceased ? "#e0d0e8" : PURPLE.light}`,
          boxShadow: "var(--shadow-sm)",
          position: "relative",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: isDiabetes
              ? "linear-gradient(135deg, #f3e5f5, #e1bee7)"
              : "linear-gradient(135deg, #ede7f6, #d1c4e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
            border: `2px solid ${isDeceased ? "#d1c4e9" : PURPLE.light}`,
          }}
        >
          <User
            size={20}
            style={{ color: isDeceased ? "#9e9e9e" : PURPLE.primary }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 2,
            }}
          >
            {member.relation}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            {member.name}
          </div>

          {/* Condition badge */}
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
              background: isDiabetes ? "#fff3e0" : "#fce4ec",
              color: isDiabetes ? "#e65100" : "#c62828",
              marginBottom: 6,
            }}
          >
            {member.plainCondition}
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: PURPLE.deep,
              letterSpacing: "-0.02em",
            }}
          >
            Age {member.ageAtDiagnosis}
          </div>

          <div
            style={{
              fontSize: 10,
              color: isDeceased ? "var(--text-muted)" : "var(--text-secondary)",
              marginTop: 4,
              fontStyle: isDeceased ? "italic" : "normal",
            }}
          >
            {member.status}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnaNode() {
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1]?.value ?? 5.8;
  const yearsToMother = 58 - PATIENT.age;
  const yearsToGrandmother = 62 - PATIENT.age;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "500ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${PURPLE.wash}, white)`,
          borderRadius: 20,
          padding: "20px 16px",
          border: `2px solid ${PURPLE.mid}`,
          boxShadow: `0 4px 20px rgba(106, 27, 154, 0.12)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(124,77,255,0.1), transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${PURPLE.primary}, ${PURPLE.accent})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: `0 4px 12px rgba(106, 27, 154, 0.3)`,
          }}
        >
          <span style={{ color: "white", fontWeight: 700, fontSize: 20 }}>A</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: PURPLE.mid,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 2,
            }}
          >
            You
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 2,
            }}
          >
            {PATIENT.firstName}, {PATIENT.age}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              marginBottom: 12,
            }}
          >
            Blood sugar (fasting): {latestGlucose} mmol/L
          </div>

          {/* Countdown badges */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 12,
                background: "#fff3e0",
                border: "1px solid #ffe0b2",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e65100" }}>
                {yearsToMother}
              </div>
              <div style={{ fontSize: 9, color: "#bf360c", fontWeight: 500 }}>
                years to mum's age
              </div>
            </div>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 12,
                background: "#fce4ec",
                border: "1px solid #f8bbd0",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#c62828" }}>
                {yearsToGrandmother}
              </div>
              <div style={{ fontSize: 9, color: "#b71c1c", fontWeight: 500 }}>
                years to mormor's age
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionLine({ side }: { side: "left" | "right" | "center" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: side === "center" ? "center" : side === "left" ? "flex-start" : "flex-end",
        padding: side === "center" ? "0" : "0 25%",
      }}
    >
      <div
        style={{
          width: 2,
          height: 20,
          background: `linear-gradient(to bottom, ${PURPLE.light}, ${PURPLE.pale})`,
        }}
      />
    </div>
  );
}

function GlucoseTrajectoryMini() {
  const glucoseHistory = getMarkerHistory("f-Glucose");

  // SVG mini chart
  const width = 280;
  const height = 80;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minVal = 4.5;
  const maxVal = 7.0;

  const points = glucoseHistory.map((d, i) => ({
    x: padding.left + (i / (glucoseHistory.length - 1)) * chartW,
    y: padding.top + (1 - (d.value - minVal) / (maxVal - minVal)) * chartH,
    value: d.value,
    year: new Date(d.date).getFullYear(),
  }));

  // Borderline threshold line at 6.0
  const thresholdY = padding.top + (1 - (6.0 - minVal) / (maxVal - minVal)) * chartH;
  // Diabetic threshold at 7.0
  const diabeticY = padding.top + (1 - (7.0 - minVal) / (maxVal - minVal)) * chartH;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Projected path (if trend continues)
  const lastTwo = glucoseHistory.slice(-2);
  const yearDiff = 1;
  const valueDiff = lastTwo[1].value - lastTwo[0].value;
  const slopePerYear = valueDiff / yearDiff;

  const projectedPoints = [];
  for (let futureYear = 1; futureYear <= 18; futureYear += 3) {
    const projVal = glucoseHistory[glucoseHistory.length - 1].value + slopePerYear * futureYear;
    if (projVal <= maxVal) {
      projectedPoints.push({
        x: padding.left + ((glucoseHistory.length - 1 + futureYear * 0.3) / (glucoseHistory.length - 1 + 5.4)) * chartW,
        y: padding.top + (1 - (projVal - minVal) / (maxVal - minVal)) * chartH,
      });
    }
  }

  const projPath =
    projectedPoints.length > 0
      ? `M ${points[points.length - 1].x} ${points[points.length - 1].y} ` +
        projectedPoints.map((p) => `L ${p.x} ${p.y}`).join(" ")
      : "";

  return (
    <div style={{ margin: "0 auto", maxWidth: width }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        {/* Danger zone background */}
        <rect
          x={padding.left}
          y={diabeticY}
          width={chartW}
          height={thresholdY - diabeticY}
          fill="#ffebee"
          opacity={0.4}
          rx={4}
        />
        <rect
          x={padding.left}
          y={thresholdY}
          width={chartW}
          height={padding.top + chartH - thresholdY}
          fill="#fff8e1"
          opacity={0.3}
          rx={4}
        />

        {/* Threshold lines */}
        <line
          x1={padding.left}
          y1={thresholdY}
          x2={padding.left + chartW}
          y2={thresholdY}
          stroke="#e65100"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
        />
        <text
          x={padding.left + chartW + 2}
          y={thresholdY + 3}
          fontSize={8}
          fill="#e65100"
          fontWeight={500}
        >
          6.0
        </text>

        {/* Projected trend (dashed) */}
        {projPath && (
          <path
            d={projPath}
            fill="none"
            stroke={PURPLE.light}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.6}
          />
        )}

        {/* Actual line */}
        <path
          d={linePath}
          fill="none"
          stroke={PURPLE.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill={PURPLE.primary} />
            {(i === 0 || i === points.length - 1) && (
              <text
                x={p.x}
                y={p.y - 8}
                fontSize={9}
                fill={PURPLE.deep}
                fontWeight={600}
                textAnchor="middle"
              >
                {p.value}
              </text>
            )}
          </g>
        ))}

        {/* Year labels */}
        {points
          .filter((_, i) => i === 0 || i === points.length - 1)
          .map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 2}
              fontSize={8}
              fill="var(--text-muted)"
              textAnchor="middle"
            >
              {p.year}
            </text>
          ))}
      </svg>
    </div>
  );
}

function PatternInsightCard() {
  const yearsToMother = 58 - PATIENT.age;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "700ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, #fff3e0, #fce4ec)`,
          borderRadius: 16,
          padding: 16,
          border: "1px solid #ffccbc",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(230, 81, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} style={{ color: "#e65100" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#bf360c",
                marginBottom: 4,
              }}
            >
              The pattern repeating
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#4e342e",
                lineHeight: 1.5,
              }}
            >
              Your blood sugar (fasting glucose) has risen from 5.0 to 5.8 over 5 years.
              Your mum was diagnosed with Type 2 Diabetes at 58. That is {yearsToMother} years from now.
              If nothing changes, the same pattern may repeat.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Smith5Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const grandparents = FAMILY_TREE.filter((m) => m.generation === 0);
  const parents = FAMILY_TREE.filter((m) => m.generation === 1);

  const navCards = [
    {
      href: "/smith5/family-tree",
      icon: TreePine,
      title: "Family Health Tree",
      subtitle: "4 generations of health patterns",
      color: PURPLE.primary,
      bgColor: PURPLE.pale,
    },
    {
      href: "/smith5/trajectory",
      icon: TrendingUp,
      title: "Your Trajectory",
      subtitle: "Where you are vs. where they were",
      color: "#e65100",
      bgColor: "#fff3e0",
    },
    {
      href: "/smith5/change",
      icon: Shield,
      title: "What You Can Change",
      subtitle: "Risk factors in your control",
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
    {
      href: "/smith5/plan",
      icon: ClipboardList,
      title: "Your Prevention Plan",
      subtitle: "Training + testing to break the pattern",
      color: "#1565c0",
      bgColor: "#e3f2fd",
    },
    {
      href: "/smith5/progress",
      icon: Award,
      title: "Breaking the Pattern",
      subtitle: "How your numbers compare to family",
      color: PURPLE.accent,
      bgColor: PURPLE.pale,
    },
  ];

  if (!mounted) return null;

  return (
    <div style={{ background: PURPLE.wash, minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/v2/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: PURPLE.deep }}>
            Precura
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
            Break the Pattern
          </div>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${PURPLE.primary}, ${PURPLE.accent})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "white", fontWeight: 600, fontSize: 13 }}>A</span>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Hero section */}
        <div style={{ padding: "24px 0 16px", textAlign: "center" }}>
          <div
            className="animate-fade-in"
            style={{
              fontSize: 13,
              color: PURPLE.mid,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            Your family health story
          </div>
          <h1
            className="animate-fade-in"
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            You don't have to follow
            <br />
            <span style={{ color: PURPLE.primary }}>their path</span>
          </h1>
          <p
            className="animate-fade-in"
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Diabetes runs in your family. But the pattern can stop with you.
          </p>
        </div>

        {/* FAMILY TREE VISUALIZATION */}
        <div style={{ marginBottom: 20 }}>
          {/* Grandparents */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
            {grandparents.map((m, i) => (
              <FamilyMemberNode key={m.name} member={m} delay={100 + i * 120} />
            ))}
          </div>

          <ConnectionLine side="center" />

          {/* Parents */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
            {parents.map((m, i) => (
              <FamilyMemberNode key={m.name} member={m} delay={300 + i * 120} />
            ))}
          </div>

          <ConnectionLine side="center" />

          {/* ANNA - centerpiece */}
          <div style={{ maxWidth: 240, margin: "0 auto" }}>
            <AnnaNode />
          </div>
        </div>

        {/* Pattern insight */}
        <PatternInsightCard />

        {/* Glucose trajectory mini-chart */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "900ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 16,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              Blood sugar trend (5 years)
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              Fasting glucose, rising toward the danger zone
            </div>
            <GlucoseTrajectoryMini />
          </div>
        </div>

        {/* Navigation cards */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Explore your health story
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {navCards.map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                style={{ textDecoration: "none" }}
                className="animate-fade-in-up"
              >
                <div
                  className="card-hover"
                  style={{
                    background: "white",
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    animationDelay: `${1000 + i * 80}ms`,
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: card.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <card.icon size={20} style={{ color: card.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: 2,
                      }}
                    >
                      {card.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      {card.subtitle}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Emotional CTA */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "1400ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 28,
            textAlign: "center",
            padding: "24px 16px",
            background: `linear-gradient(135deg, ${PURPLE.pale}, white)`,
            borderRadius: 20,
            border: `1px solid ${PURPLE.light}`,
          }}
        >
          <Heart
            size={28}
            style={{ color: PURPLE.primary, margin: "0 auto 12px" }}
            fill={PURPLE.light}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: PURPLE.deep,
              marginBottom: 6,
            }}
          >
            18 years of opportunity
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              maxWidth: 280,
              margin: "0 auto",
            }}
          >
            Your mum was diagnosed at 58. You are 40. Every healthy choice you make today
            is another step away from the pattern.
          </div>
        </div>
      </div>
    </div>
  );
}
