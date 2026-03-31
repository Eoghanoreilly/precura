"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Activity,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  Brain,
  TestTube,
  Pill,
  Heart,
  ArrowRight,
  BarChart3,
  PiggyBank,
  ChevronRight,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  SCREENING_SCORES,
  RISK_ASSESSMENTS,
  CONDITIONS,
  MEDICATIONS,
  FAMILY_HISTORY,
  DOCTOR_VISITS,
  BIOMETRICS_HISTORY,
  MESSAGES,
  DOCTOR_NOTES,
  TRAINING_PLAN,
  AI_PATIENT_SUMMARY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

/* ------------------------------------------------------------------
   ECharts options
   ------------------------------------------------------------------ */

function diabetesDistributionChart(): object {
  // Simulated FINDRISC score distribution for 2,000 patients
  const bins = [
    { range: "0-3", count: 320, risk: "Low" },
    { range: "4-6", count: 480, risk: "Low" },
    { range: "7-9", count: 410, risk: "Slightly elevated" },
    { range: "10-12", count: 340, risk: "Moderate" },
    { range: "13-15", count: 220, risk: "Moderate" },
    { range: "16-18", count: 120, risk: "High" },
    { range: "19-21", count: 70, risk: "High" },
    { range: "22-26", count: 40, risk: "Very high" },
  ];

  return {
    grid: { left: 40, right: 16, top: 30, bottom: 40 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#e6e8ed",
      textStyle: { color: "#1a1a2e", fontSize: 11 },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0];
        return `<b>FINDRISC ${p.name}</b><br/>${p.value} patients`;
      },
    },
    xAxis: {
      type: "category",
      data: bins.map((b) => b.range),
      axisLabel: { fontSize: 9, color: "#8b8da3" },
      axisLine: { lineStyle: { color: "#e6e8ed" } },
      axisTick: { show: false },
      name: "FINDRISC Score",
      nameLocation: "center",
      nameGap: 25,
      nameTextStyle: { fontSize: 9, color: "#8b8da3" },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 9, color: "#8b8da3" },
      splitLine: { lineStyle: { color: "#f1f3f5" } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: bins.map((b) => ({
          value: b.count,
          itemStyle: {
            color:
              b.risk === "Low" ? "#4caf50" :
              b.risk === "Slightly elevated" ? "#8bc34a" :
              b.risk === "Moderate" ? "#ff9800" :
              b.risk === "High" ? "#f44336" :
              "#c62828",
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: "60%",
        animationDuration: 1200,
        animationEasing: "cubicOut",
      },
    ],
  };
}

function ageDistributionChart(): object {
  const ageGroups = [
    { group: "18-29", diabetes: 3, depression: 8, overdue: 15 },
    { group: "30-39", diabetes: 8, depression: 6, overdue: 18 },
    { group: "40-49", diabetes: 12, depression: 4, overdue: 22 },
    { group: "50-59", diabetes: 14, depression: 3, overdue: 19 },
    { group: "60-69", diabetes: 7, depression: 2, overdue: 10 },
    { group: "70+", diabetes: 3, depression: 0, overdue: 5 },
  ];

  return {
    grid: { left: 40, right: 16, top: 40, bottom: 40 },
    legend: {
      top: 0,
      textStyle: { fontSize: 9, color: "#8b8da3" },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#e6e8ed",
      textStyle: { color: "#1a1a2e", fontSize: 11 },
    },
    xAxis: {
      type: "category",
      data: ageGroups.map((a) => a.group),
      axisLabel: { fontSize: 9, color: "#8b8da3" },
      axisLine: { lineStyle: { color: "#e6e8ed" } },
      axisTick: { show: false },
      name: "Age Group",
      nameLocation: "center",
      nameGap: 25,
      nameTextStyle: { fontSize: 9, color: "#8b8da3" },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 9, color: "#8b8da3" },
      splitLine: { lineStyle: { color: "#f1f3f5" } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: "Diabetes risk",
        type: "bar",
        stack: "total",
        data: ageGroups.map((a) => a.diabetes),
        itemStyle: { color: "#ff9800", borderRadius: [0, 0, 0, 0] },
        barWidth: "50%",
      },
      {
        name: "Depression",
        type: "bar",
        stack: "total",
        data: ageGroups.map((a) => a.depression),
        itemStyle: { color: "#42a5f5" },
        barWidth: "50%",
      },
      {
        name: "Overdue tests",
        type: "bar",
        stack: "total",
        data: ageGroups.map((a) => a.overdue),
        itemStyle: { color: "#26a69a", borderRadius: [4, 4, 0, 0] },
        barWidth: "50%",
      },
    ],
    animationDuration: 1200,
    animationEasing: "cubicOut",
  };
}

/* ------------------------------------------------------------------
   Page
   ------------------------------------------------------------------ */

export default function VardcentralPage() {
  const diabetesChartOpts = useMemo(() => diabetesDistributionChart(), []);
  const ageChartOpts = useMemo(() => ageDistributionChart(), []);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#f5f6f8" }}>
      <main className="flex-1 px-5 pt-8 pb-12 max-w-md mx-auto w-full">

        {/* Header */}
        <div className="animate-fade-in mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-light)", boxShadow: "var(--shadow-sm)" }}
            >
              <Activity size={16} style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
                Precura
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                PROVIDER
              </span>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-1" style={{ color: "var(--text)" }}>
            Cityakuten Vardcentral
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Population Health Overview
          </p>
        </div>

        {/* Hero stat */}
        <div
          className="animate-fade-in stagger-1 rounded-2xl p-5 mb-5 text-center"
          style={{
            opacity: 0,
            background: "linear-gradient(135deg, #f0f4ff 0%, #faf8ff 100%)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users size={16} style={{ color: "var(--accent)" }} />
            <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
              Registered Patients
            </p>
          </div>
          <p className="text-4xl font-bold tracking-tight mb-2" style={{ color: "var(--text)" }}>
            2,000
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Precura has identified health trends across your patient population that may require attention
          </p>
        </div>

        {/* ============================================================
            Risk Distribution Cards
            ============================================================ */}
        <div className="animate-fade-in stagger-2 flex flex-col gap-3 mb-5" style={{ opacity: 0 }}>

          {/* Diabetes trending */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--amber-bg)",
              border: "1px solid color-mix(in srgb, var(--amber) 20%, transparent)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in srgb, var(--amber) 15%, transparent)" }}
              >
                <TrendingUp size={18} style={{ color: "var(--amber-text)" }} />
              </div>
              <div>
                <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--amber-text)" }}>
                  47
                </p>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--amber-text)" }}>
                  Patients trending toward Type 2 diabetes
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--amber-text)", opacity: 0.8 }}>
                  Currently undiagnosed. Fasting glucose rising over 3+ years.
                </p>
              </div>
            </div>
          </div>

          {/* Depression indicators */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--blue-bg)",
              border: "1px solid color-mix(in srgb, var(--blue) 20%, transparent)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in srgb, var(--blue) 15%, transparent)" }}
              >
                <Brain size={18} style={{ color: "var(--blue-text)" }} />
              </div>
              <div>
                <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--blue-text)" }}>
                  23
                </p>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--blue-text)" }}>
                  Patients with moderate+ depression indicators
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--blue-text)", opacity: 0.8 }}>
                  PHQ-9 scores &gt; 10. 8 have not discussed this with a healthcare provider.
                </p>
              </div>
            </div>
          </div>

          {/* Overdue blood work */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--teal-bg)",
              border: "1px solid color-mix(in srgb, var(--teal) 20%, transparent)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in srgb, var(--teal) 15%, transparent)" }}
              >
                <TestTube size={18} style={{ color: "var(--teal-text)" }} />
              </div>
              <div>
                <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--teal-text)" }}>
                  89
                </p>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--teal-text)" }}>
                  Patients overdue for blood work
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--teal-text)", opacity: 0.8 }}>
                  No blood tests in 3+ years despite having risk factors.
                </p>
              </div>
            </div>
          </div>

          {/* Medication interactions */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--red-bg)",
              border: "1px solid color-mix(in srgb, var(--red) 20%, transparent)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in srgb, var(--red) 15%, transparent)" }}
              >
                <Pill size={18} style={{ color: "var(--red-text)" }} />
              </div>
              <div>
                <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--red-text)" }}>
                  12
                </p>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--red-text)" }}>
                  Patients with potential medication interactions
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--red-text)", opacity: 0.8 }}>
                  Cross-referencing prescriptions across providers flagged possible conflicts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            Cost Impact Projection
            ============================================================ */}
        <div
          className="animate-fade-in stagger-3 rounded-2xl p-5 mb-5"
          style={{
            opacity: 0,
            background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
            border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank size={16} style={{ color: "var(--green-text)" }} />
            <p className="text-xs font-bold" style={{ color: "var(--green-text)" }}>
              Cost Impact Projection
            </p>
          </div>
          <p className="text-2xl font-bold mb-2" style={{ color: "var(--green-text)" }}>
            SEK 4.2 million
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--green-text)", opacity: 0.85 }}>
            Early intervention for these 47 diabetes-trending patients could save an estimated SEK 4.2 million in treatment costs over 10 years.
          </p>
          <div
            className="rounded-xl px-3 py-2"
            style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)" }}
          >
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--green-text)", opacity: 0.75 }}>
              Based on average T2D treatment cost of SEK 89,000/year per patient. Source: Swedish National Diabetes Register (NDR).
            </p>
          </div>
        </div>

        {/* ============================================================
            Charts
            ============================================================ */}
        <div className="animate-fade-in stagger-4 mb-5" style={{ opacity: 0 }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Diabetes Risk Distribution
          </p>
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
              FINDRISC score distribution across 2,000 registered patients
            </p>
            <ReactECharts
              option={diabetesChartOpts}
              style={{ height: 220 }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </div>

        <div className="animate-fade-in stagger-5 mb-6" style={{ opacity: 0 }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Risk by Age Group
          </p>
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
              Identified risk factors segmented by patient age
            </p>
            <ReactECharts
              option={ageChartOpts}
              style={{ height: 240 }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </div>

        {/* ============================================================
            CTA
            ============================================================ */}
        <div
          className="animate-fade-in stagger-6 rounded-2xl p-5 text-center"
          style={{
            opacity: 0,
            background: "var(--accent)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <Shield size={20} color="#fff" className="mx-auto mb-2" />
          <p className="text-sm font-bold mb-1" style={{ color: "#fff" }}>
            Partner with Precura
          </p>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>
            Proactively reach these patients before conditions develop. Precura integrates with your existing workflows to surface risk trends and enable early intervention.
          </p>
          <button
            className="flex items-center justify-center gap-2 mx-auto px-6 py-2.5 rounded-full text-xs font-bold"
            style={{ background: "#fff", color: "var(--accent)" }}
          >
            Get started
            <ArrowRight size={13} />
          </button>
        </div>

      </main>
    </div>
  );
}
