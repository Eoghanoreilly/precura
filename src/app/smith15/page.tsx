"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  SCREENING_SCORES,
  BIOMETRICS_HISTORY,
  CONDITIONS,
  MEDICATIONS,
  FAMILY_HISTORY,
  AI_PATIENT_SUMMARY,
  getLatestMarker,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    normal: { bg: "#F1F1EF", text: "#37352F" },
    borderline: { bg: "#FDEBD0", text: "#CB912F" },
    abnormal: { bg: "#FADBD8", text: "#E03E3E" },
    active: { bg: "#D5F5E3", text: "#4DAB9A" },
    resolved: { bg: "#F1F1EF", text: "#9B9A97" },
    low: { bg: "#D5F5E3", text: "#4DAB9A" },
    moderate: { bg: "#FDEBD0", text: "#CB912F" },
    low_moderate: { bg: "#F1F1EF", text: "#37352F" },
    worsening: { bg: "#FADBD8", text: "#E03E3E" },
    stable: { bg: "#D5F5E3", text: "#4DAB9A" },
    approaching: { bg: "#FDEBD0", text: "#CB912F" },
  };
  const c = colors[status] || colors.normal;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        color: c.text,
        background: c.bg,
        padding: "1px 7px",
        borderRadius: 3,
        fontFamily: FONT,
      }}
    >
      {status.replace("_", "-")}
    </span>
  );
}

function PropertyRow({
  label,
  value,
  tag,
  href,
  secondary,
}: {
  label: string;
  value: string | React.ReactNode;
  tag?: string;
  href?: string;
  secondary?: boolean;
}) {
  const content = (
    <div
      className="flex items-center justify-between py-1.5 px-1 -mx-1"
      style={{
        borderRadius: 3,
        cursor: href ? "pointer" : "default",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <span
        style={{
          fontSize: 14,
          color: secondary ? "#9B9A97" : "#37352F",
          fontFamily: FONT,
        }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          style={{
            fontSize: 14,
            color: "#37352F",
            fontFamily: FONT,
          }}
        >
          {value}
        </span>
        {tag && <StatusPill status={tag} />}
        {href && <ChevronRight size={14} style={{ color: "#9B9A97" }} />}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }
  return content;
}

function ToggleSection({
  title,
  defaultOpen,
  children,
  count,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full py-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: FONT,
          padding: 0,
        }}
      >
        {open ? (
          <ChevronDown size={12} style={{ color: "#9B9A97" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "#9B9A97" }} />
        )}
        <span style={{ fontSize: 12, color: "#9B9A97", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {title}
        </span>
        {count !== undefined && (
          <span style={{ fontSize: 11, color: "#9B9A97" }}>({count})</span>
        )}
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: "#37352F",
        fontFamily: FONT,
        marginBottom: 8,
      }}
    >
      {children}
    </h2>
  );
}

function MiniSparkline({ data }: { data: { date: string; value: number }[] }) {
  if (data.length < 2) return null;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 80;
  const h = 20;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * h;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#2383E2"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1].value - min) / range) * h}
        r={2.5}
        fill="#2383E2"
      />
    </svg>
  );
}

export default function HealthOverview() {
  const latestBio = BIOMETRICS_HISTORY[0];
  const latestTest = BLOOD_TEST_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const cholesterolHistory = getMarkerHistory("TC");
  const hba1cHistory = getMarkerHistory("HbA1c");
  const glucoseLatest = getLatestMarker("f-Glucose");
  const cholesterolLatest = getLatestMarker("TC");
  const hba1cLatest = getLatestMarker("HbA1c");
  const vitDLatest = getLatestMarker("Vit D");

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <span style={{ fontSize: 12, color: "#9B9A97" }}>Precura</span>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>Health Overview</span>
      </div>

      {/* Page title */}
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 4,
        }}
      >
        Health Overview
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        {PATIENT.name} / {PATIENT.age} / Member since{" "}
        {new Date(PATIENT.memberSince).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        })}
      </p>

      <Divider />

      {/* Alert bar - borderline items */}
      <div
        className="flex items-start gap-2 px-3 py-2.5 mb-4"
        style={{
          background: "#FAFAF9",
          border: "1px solid #E9E9E7",
          borderRadius: 6,
        }}
      >
        <AlertTriangle
          size={14}
          style={{ color: "#CB912F", marginTop: 2, flexShrink: 0 }}
        />
        <div>
          <span style={{ fontSize: 13, color: "#37352F" }}>
            2 markers need attention:{" "}
          </span>
          <span style={{ fontSize: 13, color: "#CB912F", fontWeight: 500 }}>
            Fasting Glucose
          </span>
          <span style={{ fontSize: 13, color: "#9B9A97" }}> (5.8 mmol/L) and </span>
          <span style={{ fontSize: 13, color: "#CB912F", fontWeight: 500 }}>
            Vitamin D
          </span>
          <span style={{ fontSize: 13, color: "#9B9A97" }}> (48 nmol/L)</span>
        </div>
      </div>

      {/* Key Markers */}
      <SectionHeading>Key Markers</SectionHeading>

      <div>
        <PropertyRow
          label="Fasting Glucose (blood sugar, fasting)"
          value={
            <span className="flex items-center gap-3">
              <span style={{ fontSize: 14, fontWeight: 500 }}>5.8 mmol/L</span>
              <MiniSparkline data={glucoseHistory} />
            </span>
          }
          tag="borderline"
          href="/smith15/blood"
        />
        <PropertyRow
          label="HbA1c (long-term blood sugar)"
          value={
            <span className="flex items-center gap-3">
              <span style={{ fontSize: 14, fontWeight: 500 }}>38 mmol/mol</span>
              <MiniSparkline data={hba1cHistory} />
            </span>
          }
          tag="normal"
          href="/smith15/blood"
        />
        <PropertyRow
          label="Total Cholesterol"
          value={
            <span className="flex items-center gap-3">
              <span style={{ fontSize: 14, fontWeight: 500 }}>5.1 mmol/L</span>
              <MiniSparkline data={cholesterolHistory} />
            </span>
          }
          tag="borderline"
          href="/smith15/blood"
        />
        <PropertyRow
          label="Vitamin D"
          value="48 nmol/L"
          tag="borderline"
          href="/smith15/blood"
        />
        <PropertyRow
          label="Blood Pressure"
          value={latestBio.bloodPressure}
          tag="normal"
        />
      </div>

      <Divider />

      {/* Risk Models */}
      <SectionHeading>Risk Models</SectionHeading>

      <PropertyRow
        label="Type 2 Diabetes"
        value={RISK_ASSESSMENTS.diabetes.tenYearRisk + " 10-year risk"}
        tag="moderate"
        href="/smith15/risk"
      />
      <PropertyRow
        label="Cardiovascular Disease"
        value={RISK_ASSESSMENTS.cardiovascular.tenYearRisk + " 10-year risk"}
        tag="low_moderate"
        href="/smith15/risk"
      />
      <PropertyRow
        label="Bone Health"
        value={RISK_ASSESSMENTS.bone.tenYearRisk + " 10-year risk"}
        tag="low"
        href="/smith15/risk"
      />
      <PropertyRow
        label="Metabolic Syndrome"
        value={RISK_ASSESSMENTS.metabolicSyndrome.metCount + " of 5 criteria met"}
        tag="approaching"
        href="/smith15/risk"
      />

      <Divider />

      {/* Biometrics */}
      <SectionHeading>Biometrics</SectionHeading>
      <PropertyRow label="Weight" value={`${latestBio.weight} kg`} />
      <PropertyRow label="BMI" value={latestBio.bmi.toString()} />
      <PropertyRow
        label="Waist Circumference"
        value={`${latestBio.waist} cm`}
      />
      <PropertyRow
        label="Blood Pressure"
        value={latestBio.bloodPressure}
        tag="normal"
      />
      <div style={{ fontSize: 12, color: "#9B9A97", marginTop: 4 }}>
        Last measured{" "}
        {new Date(latestBio.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>

      <Divider />

      {/* Screening Scores */}
      <ToggleSection title="Screening Scores" count={5}>
        <PropertyRow
          label="FINDRISC (diabetes risk screening)"
          value={`${SCREENING_SCORES.findrisc.score}/${SCREENING_SCORES.findrisc.maxScore}`}
          tag="moderate"
        />
        <PropertyRow
          label="PHQ-9 (depression screening)"
          value={`${SCREENING_SCORES.phq9.score}/${SCREENING_SCORES.phq9.maxScore}`}
          tag="low"
        />
        <PropertyRow
          label="GAD-7 (anxiety screening)"
          value={`${SCREENING_SCORES.gad7.score}/${SCREENING_SCORES.gad7.maxScore}`}
          tag="low"
        />
        <PropertyRow
          label="AUDIT-C (alcohol use screening)"
          value={`${SCREENING_SCORES.auditC.score}/${SCREENING_SCORES.auditC.maxScore}`}
          tag="low"
        />
        <PropertyRow
          label="SCORE2 (cardiovascular risk)"
          value={`${SCREENING_SCORES.score2.riskPercent}%`}
          tag="low_moderate"
        />
      </ToggleSection>

      <Divider />

      {/* Conditions & Medications */}
      <ToggleSection
        title="Active Conditions"
        count={CONDITIONS.filter((c) => c.status === "active").length}
      >
        {CONDITIONS.filter((c) => c.status === "active").map((condition) => (
          <PropertyRow
            key={condition.name}
            label={condition.name}
            value={new Date(condition.diagnosedDate).getFullYear().toString()}
            tag="active"
          />
        ))}
      </ToggleSection>

      <ToggleSection
        title="Medications"
        count={MEDICATIONS.filter((m) => m.active).length}
      >
        {MEDICATIONS.filter((m) => m.active).map((med) => (
          <PropertyRow
            key={med.name}
            label={`${med.name} ${med.dose}`}
            value={med.frequency}
            secondary
          />
        ))}
      </ToggleSection>

      <Divider />

      {/* Family History */}
      <ToggleSection title="Family History" count={FAMILY_HISTORY.length}>
        {FAMILY_HISTORY.map((fh) => (
          <PropertyRow
            key={fh.relative}
            label={fh.relative}
            value={`${fh.condition} (age ${fh.ageAtDiagnosis})`}
          />
        ))}
      </ToggleSection>

      <Divider />

      {/* Upcoming */}
      <SectionHeading>Upcoming</SectionHeading>
      <div className="flex items-center gap-2 py-1.5">
        <Calendar size={14} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 14, color: "#37352F" }}>
          Next blood test:{" "}
          {new Date(PATIENT.nextBloodTest).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="flex items-center gap-2 py-1.5">
        <Clock size={14} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 14, color: "#37352F" }}>
          Last check-in:{" "}
          {new Date(PATIENT.lastCheckIn).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <Divider />

      {/* Last blood test metadata */}
      <div style={{ fontSize: 12, color: "#9B9A97", lineHeight: 1.6 }}>
        Latest blood work: {new Date(latestTest.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} / Ordered by {latestTest.orderedBy} / Lab: {latestTest.lab}
      </div>
    </div>
  );
}
