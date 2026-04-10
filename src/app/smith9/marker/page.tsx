"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, TrendingUp, TrendingDown, Info, Shield,
  AlertTriangle, CheckCircle, Activity, BookOpen,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY, DOCTOR_NOTES, RISK_ASSESSMENTS,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}

// Research context for each marker
const MARKER_CONTEXT: Record<string, { description: string; whyItMatters: string; whatYouCanDo: string[]; relatedRisk?: string }> = {
  "f-Glucose": {
    description: "Fasting glucose measures the sugar level in your blood after not eating for at least 8 hours. It reflects how well your body manages blood sugar overnight.",
    whyItMatters: "A gradual rise over years can signal developing insulin resistance, even when each individual reading is within the 'normal' range. Your value has risen from 5.0 to 5.8 over 5 years, which is a pattern worth monitoring.",
    whatYouCanDo: [
      "Walk for 15-20 minutes after meals, especially dinner, to help clear blood sugar",
      "Focus on fiber-rich foods: whole grains, legumes, vegetables",
      "Limit refined carbs and sugary drinks",
      "Your training plan targets insulin sensitivity specifically",
    ],
    relatedRisk: "diabetes",
  },
  "HbA1c": {
    description: "HbA1c measures the average blood sugar over the past 2-3 months. It shows how much glucose has attached to your red blood cells.",
    whyItMatters: "At 38 mmol/mol, your HbA1c is normal but has been rising. Pre-diabetes starts at 42. Given your family history, this trend is important to monitor.",
    whatYouCanDo: [
      "Continue regular exercise (your training plan helps)",
      "Maintain consistent meal timing",
      "Post-meal walks to smooth glucose spikes",
    ],
    relatedRisk: "diabetes",
  },
  "f-Insulin": {
    description: "Fasting insulin measures how much insulin your pancreas produces when you haven't eaten. High levels can indicate your body is working harder to control blood sugar.",
    whyItMatters: "At 12 mU/L, your insulin is normal, which is reassuring. If this rises alongside glucose, it would suggest developing insulin resistance.",
    whatYouCanDo: [
      "Maintain current activity level",
      "Resistance training (in your plan) improves insulin sensitivity",
      "Adequate sleep supports insulin function",
    ],
    relatedRisk: "diabetes",
  },
  "TC": {
    description: "Total cholesterol is the sum of all cholesterol types in your blood. It includes HDL (good), LDL (bad), and others.",
    whyItMatters: "At 5.1, yours is just above the recommended 5.0 upper limit. The overall risk depends more on the ratio of HDL to LDL, which in your case is healthy.",
    whatYouCanDo: [
      "Increase omega-3 rich foods: fatty fish, walnuts, flaxseed",
      "Use olive oil as your primary cooking fat",
      "Soluble fiber (oats, beans) can help lower cholesterol",
    ],
    relatedRisk: "cardiovascular",
  },
  "HDL": {
    description: "HDL (good cholesterol) helps remove other forms of cholesterol from your bloodstream. Higher is generally better.",
    whyItMatters: "At 1.6, your HDL is healthy. This is a protective factor for your cardiovascular health.",
    whatYouCanDo: [
      "Regular aerobic exercise (in your plan) maintains HDL",
      "Moderate alcohol consumption is associated with higher HDL",
      "Avoid trans fats which lower HDL",
    ],
    relatedRisk: "cardiovascular",
  },
  "LDL": {
    description: "LDL (bad cholesterol) can build up in artery walls and increase heart disease risk. Lower is generally better.",
    whyItMatters: "At 2.9, your LDL is within the normal range but near the upper limit. Given your father's history of heart disease, keeping this low is important.",
    whatYouCanDo: [
      "Plant sterols/stanols can block cholesterol absorption",
      "Exercise helps reduce LDL levels",
      "Limit saturated fat from processed meats and full-fat dairy",
    ],
    relatedRisk: "cardiovascular",
  },
  "TG": {
    description: "Triglycerides are a type of fat in your blood. They come from the calories you eat but don't immediately use.",
    whyItMatters: "At 1.3, your triglycerides are normal and well within range. This is one less metabolic syndrome criterion to worry about.",
    whatYouCanDo: [
      "Maintain current activity levels",
      "Limit added sugars and refined carbs",
    ],
    relatedRisk: "cardiovascular",
  },
  "TSH": {
    description: "TSH (thyroid-stimulating hormone) reflects how well your thyroid is functioning. The thyroid controls metabolism, energy, and body temperature.",
    whyItMatters: "At 2.1, your TSH is well within the normal range, indicating healthy thyroid function.",
    whatYouCanDo: [
      "No action needed - thyroid function is normal",
      "We'll continue monitoring at your regular blood tests",
    ],
  },
  "Vit D": {
    description: "Vitamin D is essential for bone health, immune function, and mood. It's produced when skin is exposed to sunlight, which makes deficiency common in Sweden.",
    whyItMatters: "At 48 nmol/L, you're just below the recommended minimum of 50. This is very common in Sweden, especially in winter. Supplementation is straightforward.",
    whatYouCanDo: [
      "Take 2000 IU Vitamin D3 daily (recommended by your doctor)",
      "Eat vitamin D rich foods: fatty fish, eggs, fortified dairy",
      "Get outdoor time when possible, especially spring/summer",
    ],
    relatedRisk: "bone",
  },
  "Crea": {
    description: "Creatinine is a waste product from muscle metabolism. Your kidneys filter it out of your blood, so creatinine levels indicate how well your kidneys work.",
    whyItMatters: "At 68 umol/L, your kidney function is normal. This is important to monitor since your blood pressure medication (Enalapril) can affect the kidneys.",
    whatYouCanDo: [
      "Stay well hydrated",
      "Continue taking Enalapril as prescribed",
      "No specific action needed - kidneys are working well",
    ],
  },
};

function MarkerContent() {
  const searchParams = useSearchParams();
  const shortName = searchParams.get("m") || "f-Glucose";
  const marker = getLatestMarker(shortName);
  const history = getMarkerHistory(shortName);

  if (!marker) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
        Marker not found
      </div>
    );
  }

  const sc = statusColor(marker.status);
  const context = MARKER_CONTEXT[shortName];
  const trend = history.length >= 2 ? history[history.length - 1].value - history[history.length - 2].value : 0;

  // Chart dimensions
  const chartW = 600;
  const chartH = 180;
  const padX = 50;
  const padY = 20;
  const vals = history.map((h) => h.value);
  const minVal = Math.min(marker.refLow * 0.85, Math.min(...vals) * 0.95);
  const maxVal = Math.max(marker.refHigh * 1.15, Math.max(...vals) * 1.05);

  const xScale = (i: number) => padX + (i / Math.max(1, history.length - 1)) * (chartW - padX * 2);
  const yScale = (v: number) => padY + ((maxVal - v) / (maxVal - minVal)) * (chartH - padY * 2);

  const linePath = history.map((h, i) => {
    const x = xScale(i);
    const y = yScale(h.value);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const areaPath = `${linePath} L ${xScale(history.length - 1)} ${chartH - padY} L ${xScale(0)} ${chartH - padY} Z`;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248, 249, 250, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Link href="/smith9" style={{
            width: 36, height: 36, borderRadius: 12,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{marker.plainName}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{marker.name}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Hero value */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
          padding: 24, marginTop: 20, marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 40, fontWeight: 800, color: sc.text, letterSpacing: "-0.03em" }}>
                {marker.value}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{marker.unit}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "4px 12px",
                borderRadius: 8, background: sc.bg, color: sc.text,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                {marker.status}
              </span>
              {trend !== 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, justifyContent: "flex-end" }}>
                  {trend > 0 ? (
                    <TrendingUp size={14} style={{ color: "var(--amber-text)" }} />
                  ) : (
                    <TrendingDown size={14} style={{ color: "var(--green-text)" }} />
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: trend > 0 ? "var(--amber-text)" : "var(--green-text)" }}>
                    {trend > 0 ? "+" : ""}{trend.toFixed(1)} since last test
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reference range bar */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Reference range</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{marker.refLow} - {marker.refHigh} {marker.unit}</span>
            </div>
            <div style={{ position: "relative", height: 28 }}>
              <div style={{
                position: "absolute", top: 10, left: 0, right: 0, height: 8,
                borderRadius: 4, background: "var(--bg-elevated)",
              }} />
              {/* Normal zone */}
              {(() => {
                const range = maxVal - minVal;
                const normStart = ((marker.refLow - minVal) / range) * 100;
                const normWidth = ((marker.refHigh - marker.refLow) / range) * 100;
                const valPos = ((marker.value - minVal) / range) * 100;
                return (
                  <>
                    <div style={{
                      position: "absolute", top: 10, left: `${normStart}%`, width: `${normWidth}%`,
                      height: 8, borderRadius: 4, background: "var(--green)", opacity: 0.2,
                    }} />
                    <div style={{
                      position: "absolute", top: 3, left: `${valPos}%`, transform: "translateX(-50%)",
                      width: 0, height: 0,
                      borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                      borderTop: `8px solid ${sc.dot}`,
                    }} />
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        {history.length > 1 && (
          <div className="animate-fade-in stagger-1" style={{
            background: "var(--bg-card)", borderRadius: 18,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            padding: "20px 16px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
              {history.length}-Year Trend
            </div>

            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ overflow: "visible" }}>
              {/* Reference zone */}
              <rect
                x={padX} y={yScale(marker.refHigh)}
                width={chartW - padX * 2}
                height={yScale(marker.refLow) - yScale(marker.refHigh)}
                fill="var(--green)" opacity={0.08} rx={4}
              />
              {/* Ref lines */}
              <line x1={padX} y1={yScale(marker.refHigh)} x2={chartW - padX} y2={yScale(marker.refHigh)}
                stroke="var(--green)" strokeWidth={1} strokeDasharray="4 3" opacity={0.3} />
              <line x1={padX} y1={yScale(marker.refLow)} x2={chartW - padX} y2={yScale(marker.refLow)}
                stroke="var(--green)" strokeWidth={1} strokeDasharray="4 3" opacity={0.3} />
              <text x={padX - 6} y={yScale(marker.refHigh) + 4} textAnchor="end" fill="var(--text-muted)" fontSize={10}>
                {marker.refHigh}
              </text>
              <text x={padX - 6} y={yScale(marker.refLow) + 4} textAnchor="end" fill="var(--text-muted)" fontSize={10}>
                {marker.refLow}
              </text>

              {/* Area gradient */}
              <defs>
                <linearGradient id="markerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sc.dot} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={sc.dot} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#markerGrad)" />

              {/* Line */}
              <path d={linePath} fill="none" stroke={sc.dot} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points */}
              {history.map((h, i) => {
                const x = xScale(i);
                const y = yScale(h.value);
                const isLast = i === history.length - 1;
                return (
                  <g key={h.date}>
                    {isLast && <circle cx={x} cy={y} r={8} fill={sc.dot} opacity={0.12} />}
                    <circle cx={x} cy={y} r={isLast ? 5 : 3} fill={isLast ? sc.dot : sc.text} opacity={isLast ? 1 : 0.5} />
                    <text x={x} y={y - 10} textAnchor="middle" fill={isLast ? sc.text : "var(--text-muted)"} fontSize={isLast ? 12 : 10} fontWeight={isLast ? 700 : 500}>
                      {h.value}
                    </text>
                    <text x={x} y={chartH + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={10}>
                      {new Date(h.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Test History Table */}
        <div className="animate-fade-in stagger-2" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 18px", marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
            All Results
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {history.slice().reverse().map((h, i) => {
              const session = BLOOD_TEST_HISTORY.find((s) => s.date === h.date);
              const result = session?.results.find((r) => r.shortName === shortName);
              const thisSc = result ? statusColor(result.status) : statusColor("normal");
              return (
                <div key={h.date} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: i < history.length - 1 ? "1px solid var(--divider)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{formatDate(h.date)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{session?.orderedBy || ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: thisSc.text }}>{h.value}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{marker.unit}</span>
                    <div style={{
                      width: 8, height: 8, borderRadius: 4,
                      background: thisSc.dot,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Context */}
        {context && (
          <>
            <div className="animate-fade-in stagger-3" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "18px 18px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <BookOpen size={15} style={{ color: "#3730a3" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>What is {marker.plainName}?</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {context.description}
              </p>
            </div>

            <div className="animate-fade-in stagger-4" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "18px 18px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Info size={15} style={{ color: "#3730a3" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Why it matters for you</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {context.whyItMatters}
              </p>
            </div>

            <div className="animate-fade-in stagger-5" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              padding: "18px 18px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <CheckCircle size={15} style={{ color: "var(--green-text)" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>What you can do</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {context.whatYouCanDo.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      background: "var(--green-bg)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, color: "var(--green-text)",
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Related Risk Model */}
        {context?.relatedRisk && (
          <Link href={`/smith9/risk?model=${context.relatedRisk}`} style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{
              background: "linear-gradient(135deg, #eef2ff, #e8eaf6)",
              borderRadius: 16, padding: "16px 18px", marginBottom: 16,
              border: "1px solid rgba(55, 48, 163, 0.1)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Shield size={18} style={{ color: "#3730a3" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#3730a3" }}>
                  View {context.relatedRisk === "diabetes" ? "Diabetes" : context.relatedRisk === "cardiovascular" ? "Cardiovascular" : "Bone Health"} Risk Model
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  See how this marker fits into your overall risk profile
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Doctor's Note */}
        <div className="animate-fade-in stagger-6" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Shield size={15} style={{ color: "#3730a3" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Doctor&apos;s Note</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
            {DOCTOR_NOTES[0].author} - {formatDate(DOCTOR_NOTES[0].date)}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
            {DOCTOR_NOTES[0].note}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MarkerPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>}>
      <MarkerContent />
    </Suspense>
  );
}
