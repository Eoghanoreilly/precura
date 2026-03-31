"use client";

import Link from "next/link";
import { ArrowLeft, Stethoscope, ChevronRight, MessageCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { BLOOD_TEST_HISTORY, DOCTOR_NOTES, PATIENT, getMarkerHistory } from "@/lib/v2/mock-patient";

const SCALE: Record<string, { min: number; max: number }> = {
  HbA1c: { min: 15, max: 50 },
  "f-Glucose": { min: 3, max: 7 },
  "f-Insulin": { min: 0, max: 30 },
  TC: { min: 2, max: 7 },
  HDL: { min: 0.5, max: 3 },
  LDL: { min: 0, max: 5 },
  TG: { min: 0, max: 3 },
  TSH: { min: 0, max: 6 },
  "Vit D": { min: 10, max: 150 },
  Crea: { min: 30, max: 120 },
};

export default function BloodResultsPage() {
  const latest = BLOOD_TEST_HISTORY[0];
  const note = DOCTOR_NOTES[0];
  const normalCount = latest.results.filter((r) => r.status === "normal").length;
  const borderlineCount = latest.results.filter((r) => r.status === "borderline").length;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ paddingTop: 16, marginBottom: 20 }}>
          <Link href="/v2/blood-tests" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)" }}>
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Blood Test Results</h1>
        <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 20 }}>
          {new Date(latest.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - {latest.lab}
        </p>

        {/* Summary cards */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "var(--green-bg)", borderRadius: 12, padding: "12px 14px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "var(--green-text)", fontFamily: "var(--font-mono)" }}>{normalCount}</span>
            <p style={{ fontSize: 11, color: "var(--green-text)", fontWeight: 500 }}>Normal</p>
          </div>
          <div style={{ flex: 1, background: "var(--amber-bg)", borderRadius: 12, padding: "12px 14px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "var(--amber-text)", fontFamily: "var(--font-mono)" }}>{borderlineCount}</span>
            <p style={{ fontSize: 11, color: "var(--amber-text)", fontWeight: 500 }}>Borderline</p>
          </div>
          <div style={{ flex: 1, background: "var(--bg-card)", borderRadius: 12, padding: "12px 14px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>0</span>
            <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 500 }}>Abnormal</p>
          </div>
        </div>

        {/* Doctor's note - THE HERO */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--accent)", borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: "var(--shadow-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stethoscope size={16} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Johansson's Review</p>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{note.date}</p>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {note.note.split("\n\n").map((para, i) => (
              <p key={i} style={{ marginBottom: i < note.note.split("\n\n").length - 1 ? 10 : 0 }}>{para}</p>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12, fontStyle: "italic" }}>Dr. Marcus Johansson, MD</p>
        </div>

        {/* Actions */}
        <div style={{ background: "var(--accent-light)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}>Recommended next steps</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>- Start Vitamin D3 supplement (2000 IU daily)</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>- Continue training plan for metabolic health</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>- Retest comprehensive panel in September 2026</p>
          </div>
          <Link href="/v2/doctor" style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
            Discuss with Dr. Johansson <ChevronRight size={12} />
          </Link>
        </div>

        {/* Individual results */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>
          Borderline markers
        </p>

        {latest.results
          .filter((r) => r.status === "borderline")
          .map((result) => (
            <MarkerCard key={result.shortName} result={result} />
          ))}

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginTop: 20, marginBottom: 10 }}>
          Normal markers
        </p>

        {latest.results
          .filter((r) => r.status === "normal")
          .map((result) => (
            <MarkerCard key={result.shortName} result={result} />
          ))}
      </div>
    </div>
  );
}

function MarkerCard({ result }: { result: typeof BLOOD_TEST_HISTORY[0]["results"][0] }) {
  const scale = SCALE[result.shortName] || { min: 0, max: result.refHigh * 1.5 };
  const range = scale.max - scale.min;
  const refStartPct = ((result.refLow - scale.min) / range) * 100;
  const refWidthPct = ((result.refHigh - result.refLow) / range) * 100;
  const valuePct = Math.max(0, Math.min(100, ((result.value - scale.min) / range) * 100));
  const statusColor = result.status === "normal" ? "#4caf50" : result.status === "borderline" ? "#ff9800" : "#ef5350";

  const history = getMarkerHistory(result.shortName);
  const hasTrend = history.length > 1;
  const trendDir = hasTrend ? (history[history.length - 1].value > history[0].value ? "up" : history[history.length - 1].value < history[0].value ? "down" : "stable") : null;

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{result.plainName}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{result.name}</p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 100, background: result.status === "normal" ? "var(--green-bg)" : "var(--amber-bg)", color: result.status === "normal" ? "var(--green-text)" : "var(--amber-text)" }}>
          {result.status === "normal" ? "Normal" : "Borderline"}
        </span>
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{result.value}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{result.unit}</span>
        {trendDir && (
          <span style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 2, fontSize: 11, color: trendDir === "up" ? "var(--amber-text)" : trendDir === "down" ? "var(--green-text)" : "var(--text-muted)" }}>
            {trendDir === "up" ? <TrendingUp size={12} /> : trendDir === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}
            {trendDir === "up" ? "Rising" : trendDir === "down" ? "Improving" : "Stable"}
          </span>
        )}
      </div>

      {/* Range bar - approved style: green zone, triangle marker */}
      <div style={{ position: "relative", height: 12, borderRadius: 6, background: "#f5f5f5", marginBottom: 4 }}>
        <div style={{ position: "absolute", left: `${refStartPct}%`, width: `${refWidthPct}%`, height: "100%", borderRadius: 6, background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.3)" }} />
        <div style={{ position: "absolute", left: `${valuePct}%`, top: -7, transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `8px solid ${statusColor}`, filter: result.status === "borderline" ? "drop-shadow(0 1px 3px rgba(255,152,0,0.5))" : "none" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#999", fontFamily: "var(--font-mono)" }}>
        <span>{scale.min}</span>
        <span style={{ color: statusColor, fontWeight: 600 }}>{result.value}</span>
        <span>{scale.max}</span>
      </div>

      {/* Trend sparkline for borderline or markers with history */}
      {hasTrend && history.length >= 3 && (
        <div style={{ marginTop: 10, height: 40 }}>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 40 }} option={{
            grid: { top: 4, right: 4, bottom: 4, left: 4 },
            xAxis: { type: "category", show: false, data: history.map((h) => h.date) },
            yAxis: { type: "value", show: false, min: Math.min(...history.map((h) => h.value)) - 0.3, max: Math.max(...history.map((h) => h.value)) + 0.3 },
            series: [{ type: "line", smooth: 0.3, data: history.map((h) => h.value),
              symbol: (v: number, p: { dataIndex: number }) => p.dataIndex === history.length - 1 ? "circle" : "none",
              symbolSize: 8, itemStyle: { color: statusColor, borderColor: "#fff", borderWidth: 2 },
              lineStyle: { width: 2, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `${statusColor}50` }, { offset: 1, color: statusColor }] } },
              areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${statusColor}18` }, { offset: 1, color: "transparent" }] } },
            }],
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>
            <span>{history[0].date.slice(0, 7)}</span>
            <span>{history[history.length - 1].date.slice(0, 7)}</span>
          </div>
        </div>
      )}

      {/* Ask about this */}
      <Link href="/v2/chat" style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, fontWeight: 500, color: "var(--accent)" }}>
        <MessageCircle size={12} /> Ask about this marker
      </Link>
    </div>
  );
}
