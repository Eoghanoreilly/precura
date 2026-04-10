"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle,
  ChevronRight, Calendar, Link2, Heart, TestTube, Info,
  Activity, Eye,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS, FAMILY_HISTORY,
  BIOMETRICS_HISTORY, getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Marker metadata
// ============================================================================

interface MarkerMeta {
  shortName: string;
  fullName: string;
  plainName: string;
  unit: string;
  description: string;
  whyItMatters: string;
  refLow: number;
  refHigh: number;
  preDiabeticThreshold?: number;
  relatedMarkers: string[];
  relatedEvents: string[];
  actionableAdvice: string[];
}

const MARKER_META: Record<string, MarkerMeta> = {
  "f-Glucose": {
    shortName: "f-Glucose",
    fullName: "Fasting Glucose",
    plainName: "Blood sugar (fasting)",
    unit: "mmol/L",
    description: "How much sugar is in your blood after not eating for 8-12 hours. A key indicator of how your body handles sugar.",
    whyItMatters: "Anna's fasting glucose has risen every single year for 5 years. Each individual reading was 'normal' but the trend points toward pre-diabetes. With mother diagnosed at 58 and grandmother at 62, this trajectory matters.",
    refLow: 3.9,
    refHigh: 6.0,
    preDiabeticThreshold: 6.1,
    relatedMarkers: ["HbA1c", "TC"],
    relatedEvents: [
      "Weight increased from 74kg to 79kg over the same period",
      "Mother diagnosed with type 2 diabetes at age 58",
      "Maternal grandmother had type 2 diabetes at 62",
      "Training plan started Jan 2026 targeting insulin sensitivity",
      "2 of 5 metabolic syndrome criteria now met",
    ],
    actionableAdvice: [
      "20-minute walk after dinner helps regulate post-meal blood sugar",
      "Training plan specifically targets insulin sensitivity",
      "Retest in September 2026 to track if trend continues or reverses",
      "If glucose reaches 6.1, formal OGTT (oral glucose tolerance test) recommended",
    ],
  },
  "HbA1c": {
    shortName: "HbA1c",
    fullName: "HbA1c (Glycated Hemoglobin)",
    plainName: "Long-term blood sugar",
    unit: "mmol/mol",
    description: "A 3-month average of your blood sugar levels. More reliable than a single fasting glucose reading because it can't be affected by what you ate yesterday.",
    whyItMatters: "Anna's HbA1c is 38, still within normal range but slowly climbing from 35 over 4 years. Pre-diabetic range starts at 42. At the current rate of increase, she could reach that threshold in 4-5 years - around the same age her mother was diagnosed.",
    refLow: 20,
    refHigh: 42,
    preDiabeticThreshold: 42,
    relatedMarkers: ["f-Glucose", "TC"],
    relatedEvents: [
      "Rose from 35 to 38 over 4 years (0.75/year)",
      "At this rate, reaches pre-diabetic (42) around age 45",
      "Mother was diagnosed at 58 - catching this early matters",
      "Training plan may slow or reverse the trend",
    ],
    actionableAdvice: [
      "HbA1c is the gold standard for tracking diabetes risk over time",
      "Retest every 6 months to see if training plan affects the trend",
      "If it reaches 42, pre-diabetes is formally diagnosed",
    ],
  },
  "TC": {
    shortName: "TC",
    fullName: "Total Cholesterol",
    plainName: "Total cholesterol",
    unit: "mmol/L",
    description: "The total amount of cholesterol in your blood - includes both 'good' (HDL) and 'bad' (LDL) types. Not all cholesterol is bad, but the total gives an overview.",
    whyItMatters: "Anna's total cholesterol has risen from 4.6 to 5.1 over 5 years, crossing the 5.0 threshold. This trend mirrors her glucose rise - both are signs of metabolic stress. The good news: HDL (good cholesterol) is healthy at 1.6.",
    refLow: 3.0,
    refHigh: 5.0,
    relatedMarkers: ["HDL", "LDL", "TG"],
    relatedEvents: [
      "Rose from 4.6 to 5.1 alongside glucose rise",
      "Father had heart attack at age 65",
      "HDL (good cholesterol) remains healthy at 1.6",
      "Blood pressure controlled with Enalapril",
    ],
    actionableAdvice: [
      "The ratio of HDL to total cholesterol is more important than total alone",
      "Anna's ratio is healthy (1.6/5.1 = 31%), target is above 20%",
      "Exercise (like her training plan) can raise HDL and lower LDL",
      "Monitor alongside glucose - they often move together",
    ],
  },
  "Vit D": {
    shortName: "Vit D",
    fullName: "Vitamin D (25-hydroxyvitamin D)",
    plainName: "Vitamin D",
    unit: "nmol/L",
    description: "Vitamin D is essential for bones, immune function, and mood. Living in Sweden means limited sun exposure for much of the year, making deficiency common.",
    whyItMatters: "Anna's Vitamin D is 48, slightly below the optimal threshold of 50. Common for Sweden in March. Low Vitamin D has been linked to increased insulin resistance - relevant given her glucose trend.",
    refLow: 50,
    refHigh: 125,
    relatedMarkers: ["f-Glucose"],
    relatedEvents: [
      "Measured in March - lowest point for sun exposure in Sweden",
      "Low vitamin D may worsen insulin resistance",
      "Doctor recommended D3 supplement 2000 IU daily",
    ],
    actionableAdvice: [
      "Take Vitamin D3 2000 IU daily, especially October through April",
      "Take with a fatty meal for better absorption",
      "Retest in September to check if supplementation worked",
    ],
  },
};

// ============================================================================
// Helpers
// ============================================================================

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getStatusLabel(value: number, refLow: number, refHigh: number): { label: string; color: string; bg: string } {
  if (value < refLow) return { label: "Below range", color: "var(--amber-text)", bg: "var(--amber-bg)" };
  if (value > refHigh) return { label: "Above range", color: "var(--red-text)", bg: "var(--red-bg)" };
  if (value >= refHigh * 0.9) return { label: "Upper normal", color: "var(--amber-text)", bg: "var(--amber-bg)" };
  return { label: "Normal", color: "var(--green-text)", bg: "var(--green-bg)" };
}

// ============================================================================
// Trend chart SVG
// ============================================================================

function TrendChart({ data, meta }: { data: { date: string; value: number }[]; meta: MarkerMeta }) {
  if (data.length < 2) return null;

  const w = 320;
  const h = 200;
  const padX = 40;
  const padY = 30;
  const padBottom = 40;

  const vals = data.map(d => d.value);
  const allVals = [...vals, meta.refLow, meta.refHigh];
  if (meta.preDiabeticThreshold) allVals.push(meta.preDiabeticThreshold);
  const min = Math.min(...allVals) * 0.96;
  const max = Math.max(...allVals) * 1.04;

  const scaleX = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const scaleY = (v: number) => padY + (1 - (v - min) / (max - min)) * (h - padY - padBottom);

  const points = data.map((d, i) => ({
    x: scaleX(i),
    y: scaleY(d.value),
    value: d.value,
    date: d.date,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Reference zone
  const refHighY = scaleY(meta.refHigh);
  const refLowY = scaleY(meta.refLow);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      {/* Normal zone */}
      <rect
        x={padX}
        y={refHighY}
        width={w - padX * 2}
        height={refLowY - refHighY}
        fill="var(--green-bg)"
        opacity={0.5}
        rx={4}
      />

      {/* Pre-diabetic zone if applicable */}
      {meta.preDiabeticThreshold && (
        <rect
          x={padX}
          y={padY}
          width={w - padX * 2}
          height={refHighY - padY}
          fill="var(--amber-bg)"
          opacity={0.3}
          rx={4}
        />
      )}

      {/* Reference lines */}
      <line x1={padX} y1={refHighY} x2={w - padX} y2={refHighY} stroke="var(--green)" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
      <line x1={padX} y1={refLowY} x2={w - padX} y2={refLowY} stroke="var(--green)" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />

      {/* Reference labels */}
      <text x={padX - 4} y={refHighY + 4} textAnchor="end" fill="var(--green-text)" fontSize={9} fontFamily="var(--font-mono)">
        {meta.refHigh}
      </text>
      <text x={padX - 4} y={refLowY + 4} textAnchor="end" fill="var(--green-text)" fontSize={9} fontFamily="var(--font-mono)">
        {meta.refLow}
      </text>

      {/* Pre-diabetic threshold */}
      {meta.preDiabeticThreshold && (
        <>
          <line
            x1={padX} y1={scaleY(meta.preDiabeticThreshold)}
            x2={w - padX} y2={scaleY(meta.preDiabeticThreshold)}
            stroke="var(--red)" strokeWidth={1} strokeDasharray="6,3" opacity={0.5}
          />
          <text
            x={w - padX + 4} y={scaleY(meta.preDiabeticThreshold) + 4}
            fill="var(--red-text)" fontSize={9} fontFamily="var(--font-mono)"
          >
            {meta.preDiabeticThreshold}
          </text>
        </>
      )}

      {/* Gradient fill */}
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f5959" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#0f5959" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${points[0].x},${h - padBottom} ${points.map(p => `${p.x},${p.y}`).join(" ")} ${points[points.length - 1].x},${h - padBottom}`}
        fill="url(#trendGrad)"
      />

      {/* Trend line */}
      <path d={linePath} fill="none" stroke="#0f5959" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {points.map((p, i) => {
        const status = getStatusLabel(p.value, meta.refLow, meta.refHigh);
        const isLast = i === points.length - 1;
        return (
          <g key={i}>
            {/* Point */}
            <circle
              cx={p.x} cy={p.y} r={isLast ? 6 : 4}
              fill={isLast ? "#0f5959" : "#fff"}
              stroke="#0f5959"
              strokeWidth={isLast ? 0 : 2}
            />
            {isLast && (
              <circle cx={p.x} cy={p.y} r={10} fill="none" stroke="#0f5959" strokeWidth={1.5} opacity={0.3} />
            )}

            {/* Value label */}
            <text
              x={p.x} y={p.y - (isLast ? 16 : 10)}
              textAnchor="middle" fill="#0f5959"
              fontSize={isLast ? 12 : 10} fontWeight={isLast ? 700 : 600}
              fontFamily="var(--font-mono)"
            >
              {p.value}
            </text>

            {/* Date label */}
            <text
              x={p.x} y={h - padBottom + 14}
              textAnchor="middle" fill="var(--text-muted)"
              fontSize={8} fontFamily="var(--font-mono)"
            >
              {new Date(p.date).toLocaleDateString("en-GB", { month: "short" })}
            </text>
            <text
              x={p.x} y={h - padBottom + 24}
              textAnchor="middle" fill="var(--text-muted)"
              fontSize={8} fontFamily="var(--font-mono)"
            >
              {new Date(p.date).getFullYear()}
            </text>
          </g>
        );
      })}

      {/* Zone labels */}
      <text x={w - padX - 4} y={refHighY - 6} textAnchor="end" fill="var(--green-text)" fontSize={8} fontWeight={600}>
        Normal range
      </text>
      {meta.preDiabeticThreshold && (
        <text x={w - padX - 4} y={scaleY(meta.preDiabeticThreshold) - 6} textAnchor="end" fill="var(--amber-text)" fontSize={8} fontWeight={600}>
          Pre-diabetic zone
        </text>
      )}
    </svg>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function MarkerDeepDive() {
  const params = useParams();
  const markerId = typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const meta = MARKER_META[markerId];
  const history = getMarkerHistory(markerId);
  const latest = getLatestMarker(markerId);

  if (!meta || !latest) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Marker not found: {markerId}</p>
        <Link href="/smith7" style={{ color: "#0f5959", textDecoration: "underline" }}>Back to timeline</Link>
      </div>
    );
  }

  const status = getStatusLabel(latest.value, meta.refLow, meta.refHigh);
  const firstValue = history.length > 0 ? history[0].value : latest.value;
  const change = latest.value - firstValue;
  const changePercent = ((change / firstValue) * 100).toFixed(1);
  const trendUp = change > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(248,249,250,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <Link href="/smith7" style={{ color: "var(--text-muted)", display: "flex" }}>
            <ArrowLeft size={20} />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#0f5959", margin: 0 }}>
              {meta.plainName}
            </h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
              {meta.fullName} ({meta.shortName})
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px 80px" }}>

        {/* Current value hero */}
        <div className="animate-fade-in" style={{
          borderRadius: 20,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "24px 20px",
          textAlign: "center",
          marginBottom: 16,
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 20,
            background: status.bg,
            color: status.color,
            fontSize: 11,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            {status.label}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 700, color: "#0f5959", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>
              {latest.value}
            </span>
            <span style={{ fontSize: 16, color: "var(--text-muted)" }}>{meta.unit}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: trendUp ? "var(--amber-text)" : "var(--green-text)",
              fontSize: 13,
              fontWeight: 600,
            }}>
              {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change > 0 ? "+" : ""}{change.toFixed(1)} ({changePercent}%)
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              over {history.length > 0 ? `${new Date(history[history.length - 1].date).getFullYear() - new Date(history[0].date).getFullYear()} years` : ""}
            </span>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "8px 0 0" }}>
            Ref. range: {meta.refLow} - {meta.refHigh} {meta.unit}
          </p>
        </div>

        {/* Trend chart */}
        <div className="animate-fade-in stagger-1" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 12px",
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 4px 8px" }}>
            5-year trend
          </h3>
          <TrendChart data={history} meta={meta} />
        </div>

        {/* Why it matters */}
        <div className="animate-fade-in stagger-2" style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #0f5959, #1a7a7a)",
          padding: "20px",
          color: "#fff",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Link2 size={15} style={{ opacity: 0.8 }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
              Why this matters for Anna
            </h3>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
            {meta.whyItMatters}
          </p>
        </div>

        {/* What is this test */}
        <div className="animate-fade-in stagger-3" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Info size={14} style={{ color: "var(--text-muted)" }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              What does this test measure?
            </h3>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
            {meta.description}
          </p>
        </div>

        {/* Connected events */}
        <div className="animate-fade-in stagger-4" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 12px" }}>
            Connected dots
          </h3>
          {meta.relatedEvents.map((event, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#e0f7f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}>
                <Link2 size={12} style={{ color: "#0f5959" }} />
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-secondary)", margin: 0 }}>
                {event}
              </p>
            </div>
          ))}
        </div>

        {/* Test history table */}
        <div className="animate-fade-in stagger-5" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: "0 0 12px" }}>
            All results
          </h3>
          {history.map((h, i) => {
            const s = getStatusLabel(h.value, meta.refLow, meta.refHigh);
            const prev = i > 0 ? history[i - 1].value : null;
            const diff = prev !== null ? h.value - prev : null;
            return (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: i > 0 ? "1px solid var(--divider)" : "none",
              }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>
                    {formatDate(h.date)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {diff !== null && diff !== 0 && (
                    <span style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: diff > 0 ? "var(--amber-text)" : "var(--green-text)",
                    }}>
                      {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                    </span>
                  )}
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: s.bg,
                    color: s.color,
                  }}>
                    {h.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actionable advice */}
        <div className="animate-fade-in stagger-6" style={{
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f5959", margin: "0 0 12px" }}>
            What you can do
          </h3>
          {meta.actionableAdvice.map((advice, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid var(--divider)" : "none",
            }}>
              <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-secondary)", margin: 0 }}>
                {advice}
              </p>
            </div>
          ))}
        </div>

        {/* Related markers */}
        {meta.relatedMarkers.length > 0 && (
          <div className="animate-fade-in" style={{
            borderRadius: 16,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            padding: "16px 18px",
            marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: "0 0 12px" }}>
              Related markers
            </h3>
            {meta.relatedMarkers.map((rm, i) => {
              const rmLatest = getLatestMarker(rm);
              if (!rmLatest) return null;
              const rmMeta = MARKER_META[rm];
              const rmStatus = getStatusLabel(rmLatest.value, rmLatest.refLow, rmLatest.refHigh);
              return (
                <Link
                  key={i}
                  href={`/smith7/marker/${encodeURIComponent(rm)}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderTop: i > 0 ? "1px solid var(--divider)" : "none",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                      {rmLatest.plainName}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>
                      ({rmLatest.shortName})
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: rmStatus.bg,
                      color: rmStatus.color,
                    }}>
                      {rmLatest.value} {rmLatest.unit}
                    </span>
                    <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Back to timeline */}
        <Link href="/smith7" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px 20px",
          borderRadius: 14,
          background: "#0f5959",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}>
          <ArrowLeft size={16} />
          Back to Health Timeline
        </Link>
      </div>
    </div>
  );
}
