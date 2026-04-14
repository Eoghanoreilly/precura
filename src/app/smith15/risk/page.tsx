"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react";
import { RISK_ASSESSMENTS, SCREENING_SCORES } from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    low: { bg: "#D5F5E3", text: "#4DAB9A" },
    moderate: { bg: "#FDEBD0", text: "#CB912F" },
    low_moderate: { bg: "#F1F1EF", text: "#37352F" },
    high: { bg: "#FADBD8", text: "#E03E3E" },
    worsening: { bg: "#FADBD8", text: "#E03E3E" },
    stable: { bg: "#D5F5E3", text: "#4DAB9A" },
    approaching: { bg: "#FDEBD0", text: "#CB912F" },
    positive: { bg: "#D5F5E3", text: "#4DAB9A" },
  };
  const c = colors[status] || { bg: "#F1F1EF", text: "#37352F" };
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

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "20px 0" }} />;
}

function ToggleSection({
  title,
  subtitle,
  riskLevel,
  trend,
  tenYearRisk,
  children,
  defaultOpen,
}: {
  title: string;
  subtitle: string;
  riskLevel: string;
  trend: string;
  tenYearRisk: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full py-2 px-1 -mx-1"
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
          <ChevronDown size={12} style={{ color: "#9B9A97", marginRight: 6, flexShrink: 0 }} />
        ) : (
          <ChevronRight size={12} style={{ color: "#9B9A97", marginRight: 6, flexShrink: 0 }} />
        )}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 500, color: "#37352F" }}>
              {title}
            </span>
            <StatusPill status={riskLevel} />
            <StatusPill status={trend} />
          </div>
          <div style={{ fontSize: 12, color: "#9B9A97", marginTop: 1, marginLeft: 0 }}>
            {subtitle}
          </div>
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#37352F",
            fontFamily:
              '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
            marginLeft: 16,
          }}
        >
          {tenYearRisk}
        </span>
      </button>

      {open && <div style={{ paddingLeft: 22, paddingBottom: 4 }}>{children}</div>}
    </div>
  );
}

function FactorImpactBar({ impact }: { impact: string }) {
  const width = impact === "high" ? 60 : impact === "medium" ? 40 : 20;
  const color = impact === "high" ? "#E03E3E" : impact === "medium" ? "#CB912F" : impact === "positive" ? "#4DAB9A" : "#9B9A97";

  return (
    <div style={{ width: 60, height: 4, background: "#F1F1EF", borderRadius: 2, display: "inline-block", verticalAlign: "middle" }}>
      <div style={{ width, height: "100%", background: color, borderRadius: 2 }} />
    </div>
  );
}

export default function RiskModelsPage() {
  const { diabetes, cardiovascular, bone, metabolicSyndrome } =
    RISK_ASSESSMENTS;

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
        <span style={{ fontSize: 12, color: "#37352F" }}>Risk Models</span>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 4,
        }}
      >
        Risk Models
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        Multi-model risk assessment based on blood work, family history,
        biometrics, and validated clinical tools.
      </p>

      <Divider />

      {/* Diabetes */}
      <ToggleSection
        title="Type 2 Diabetes"
        subtitle="FINDRISC + blood markers + family history"
        riskLevel={diabetes.riskLevel}
        trend={diabetes.trend}
        tenYearRisk={diabetes.tenYearRisk}
        defaultOpen
      >
        <p style={{ fontSize: 13, color: "#37352F", lineHeight: 1.6, marginBottom: 12 }}>
          {diabetes.summary}
        </p>

        <div style={{ fontSize: 11, fontWeight: 500, color: "#9B9A97", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
          Key Factors
        </div>
        {diabetes.keyFactors.map((f) => (
          <div key={f.name} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, color: "#37352F" }}>{f.name}</span>
              {!f.changeable && (
                <span style={{ fontSize: 10, color: "#9B9A97", background: "#F1F1EF", padding: "0 5px", borderRadius: 3 }}>
                  non-modifiable
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FactorImpactBar impact={f.impact} />
              <StatusPill status={f.impact} />
            </div>
          </div>
        ))}
      </ToggleSection>

      <div style={{ borderTop: "1px solid #E9E9E7" }} />

      {/* Cardiovascular */}
      <ToggleSection
        title="Cardiovascular Disease"
        subtitle="SCORE2 + blood pressure + lipid panel + family history"
        riskLevel={cardiovascular.riskLevel}
        trend={cardiovascular.trend}
        tenYearRisk={cardiovascular.tenYearRisk}
      >
        <p style={{ fontSize: 13, color: "#37352F", lineHeight: 1.6, marginBottom: 12 }}>
          {cardiovascular.summary}
        </p>

        <div style={{ fontSize: 11, fontWeight: 500, color: "#9B9A97", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
          Key Factors
        </div>
        {cardiovascular.keyFactors.map((f) => (
          <div key={f.name} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, color: "#37352F" }}>{f.name}</span>
              {!f.changeable && f.impact !== "positive" && (
                <span style={{ fontSize: 10, color: "#9B9A97", background: "#F1F1EF", padding: "0 5px", borderRadius: 3 }}>
                  non-modifiable
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FactorImpactBar impact={f.impact} />
              <StatusPill status={f.impact} />
            </div>
          </div>
        ))}
      </ToggleSection>

      <div style={{ borderTop: "1px solid #E9E9E7" }} />

      {/* Bone */}
      <ToggleSection
        title="Bone Health"
        subtitle="Age + Vitamin D + risk factors"
        riskLevel={bone.riskLevel}
        trend={bone.trend}
        tenYearRisk={bone.tenYearRisk}
      >
        <p style={{ fontSize: 13, color: "#37352F", lineHeight: 1.6, marginBottom: 12 }}>
          {bone.summary}
        </p>

        <div style={{ fontSize: 11, fontWeight: 500, color: "#9B9A97", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
          Key Factors
        </div>
        {bone.keyFactors.map((f) => (
          <div key={f.name} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, color: "#37352F" }}>{f.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FactorImpactBar impact={f.impact} />
              <StatusPill status={f.impact} />
            </div>
          </div>
        ))}
      </ToggleSection>

      <Divider />

      {/* Metabolic Syndrome */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        Metabolic Syndrome Criteria
      </h2>
      <p style={{ fontSize: 12, color: "#9B9A97", marginBottom: 12 }}>
        {metabolicSyndrome.status}. Trend: {metabolicSyndrome.trend}.
      </p>

      {metabolicSyndrome.criteria.map((c) => (
        <div
          key={c.name}
          className="flex items-center justify-between py-1.5"
          style={{ borderBottom: "1px solid #E9E9E7" }}
        >
          <div className="flex items-center gap-2">
            {c.met ? (
              <X size={13} style={{ color: "#E03E3E" }} />
            ) : (
              <Check size={13} style={{ color: "#4DAB9A" }} />
            )}
            <div>
              <span style={{ fontSize: 13, color: "#37352F" }}>{c.name}</span>
              <div style={{ fontSize: 11, color: "#9B9A97" }}>{c.note}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 13,
                color: "#37352F",
                fontFamily:
                  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
              }}
            >
              {c.value}
            </span>
            <StatusPill status={c.met ? "moderate" : "low"} />
          </div>
        </div>
      ))}

      <Divider />

      <div style={{ fontSize: 12, color: "#9B9A97", lineHeight: 1.6 }}>
        Risk models use validated clinical scoring systems (FINDRISC, SCORE2,
        FRAX) combined with longitudinal blood test trends. They are tools to
        guide prevention, not diagnoses. Discuss with your doctor.
      </div>
    </div>
  );
}
