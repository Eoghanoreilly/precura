"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle, Info, Calendar,
  Users, Activity,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY, FAMILY_HISTORY, RISK_ASSESSMENTS,
  getMarkerHistory, getLatestMarker,
  type BloodMarker,
} from "@/lib/v2/mock-patient";

function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Deep contextual info per marker
function getDeepContext(shortName: string): { whatItMeans: string; whyItMatters: string; whatToDo: string; familyRelevance: string | null } {
  const map: Record<string, { whatItMeans: string; whyItMatters: string; whatToDo: string; familyRelevance: string | null }> = {
    "f-Glucose": {
      whatItMeans: "Fasting glucose measures the sugar level in your blood after not eating for at least 8 hours. It's the simplest way to check how well your body handles sugar. Normal is 3.9-6.0 mmol/L. Above 6.1 is considered impaired fasting glucose (pre-diabetes). Above 7.0 on two occasions is diabetes.",
      whyItMatters: "Your glucose has been creeping up steadily - from 5.0 in 2021 to 5.8 now. Each individual test looked 'normal' to your previous GP, but the 5-year trend shows a clear direction. At this rate, you could cross into pre-diabetic territory within 2-3 years. That's exactly why Precura exists: to catch these patterns before they become diagnoses.",
      whatToDo: "Your training plan is designed to improve insulin sensitivity. The single most impactful addition: a 15-20 minute walk after your largest meal each day. Research shows post-meal walking can reduce glucose spikes by 30-50%. Your weight (BMI 27.6) is another lever. Even a 3-5 kg reduction can significantly improve glucose control.",
      familyRelevance: "Your mother was diagnosed with Type 2 diabetes at age 58, and your maternal grandmother at 62. This family pattern means your body may be genetically predisposed to losing glucose control with age. You're 40 now. The window to change your trajectory is open, but it narrows with time.",
    },
    "HbA1c": {
      whatItMeans: "HbA1c (long-term blood sugar) measures the percentage of your red blood cells that have sugar attached to them. Because red blood cells live about 3 months, this gives an average picture of your blood sugar over that time. Normal is under 42 mmol/mol. 42-47 is pre-diabetes. 48+ is diabetes.",
      whyItMatters: "At 38 mmol/mol, your HbA1c is normal but has been slowly rising (from 35 in 2022). While your fasting glucose is the more dramatic story, HbA1c confirms the overall trend. The gap between your 'normal' HbA1c and your 'borderline' fasting glucose suggests your body is working harder to keep blood sugar controlled, but it's starting to lose the battle.",
      whatToDo: "Everything that helps fasting glucose helps HbA1c too. Consistent activity (your training plan), post-meal walks, and maintaining a healthy weight are the big three. We'll retest in September 2026 to check the trend.",
      familyRelevance: "With your mother's T2D history, watching HbA1c approach 42 is particularly important. Early intervention - before it crosses the threshold - is far more effective than treating established diabetes.",
    },
    "TC": {
      whatItMeans: "Total cholesterol is the sum of all cholesterol in your blood: HDL (good), LDL (bad), and some from triglycerides. The recommended upper limit is 5.0 mmol/L. Yours is 5.1, slightly above. Cholesterol itself isn't harmful - your body needs it - but too much of the wrong kind builds up in artery walls.",
      whyItMatters: "Your total cholesterol has been slowly rising (4.6 in 2021, now 5.1). The good news: your HDL (good cholesterol) is healthy at 1.6, and your LDL (bad cholesterol) is within range at 2.9. The ratio matters more than the total number. Your ratio is reasonable, but the upward trend needs watching.",
      whatToDo: "Dietary changes can make a 10-15% difference in cholesterol: more oily fish (salmon, mackerel), nuts, olive oil, and less processed food. Your activity level helps too. If diet and exercise don't stabilize it over the next 6-12 months, medication might be discussed, but we're not there yet.",
      familyRelevance: "Your father had a heart attack at 65. Keeping cholesterol controlled is especially important given this history. The combination of rising cholesterol AND rising glucose creates compound cardiovascular risk.",
    },
    "HDL": {
      whatItMeans: "HDL is 'good' cholesterol because it carries other cholesterol away from your arteries and back to your liver for processing. Higher is better. For women, anything above 1.2 mmol/L is considered healthy.",
      whyItMatters: "At 1.6, your HDL is healthy. This is one of your body's natural defenses against heart disease. It partially offsets your slightly elevated total cholesterol.",
      whatToDo: "Keep doing what you're doing. Regular exercise is the best way to maintain healthy HDL. Alcohol in moderation and healthy fats (avocado, nuts, olive oil) also help.",
      familyRelevance: null,
    },
    "LDL": {
      whatItMeans: "LDL is 'bad' cholesterol because it deposits cholesterol in artery walls, forming plaques that can narrow arteries over time. For most people, under 3.0 mmol/L is the target.",
      whyItMatters: "At 2.9, you're just within the recommended range. This gives some buffer, but given your family history of cardiovascular disease, keeping LDL well controlled is important.",
      whatToDo: "Reduce saturated fat intake (red meat, butter, cheese). Increase fiber (oats, beans, lentils). Your training plan contributes too. These changes together can lower LDL by 10-20%.",
      familyRelevance: "Your father's heart attack at 65 makes LDL management a priority. Even 'normal' LDL can be a concern when combined with other risk factors like hypertension and rising glucose.",
    },
    "TG": {
      whatItMeans: "Triglycerides are a type of fat in your blood. Your body converts calories it doesn't need right away into triglycerides, stored in fat cells. High levels are linked to heart disease and can indicate metabolic syndrome.",
      whyItMatters: "At 1.3, your triglycerides are normal and healthy. This is a positive sign for your metabolic health overall.",
      whatToDo: "No specific action needed. To keep triglycerides healthy: limit sugar and refined carbs, stay active, and maintain a healthy weight.",
      familyRelevance: null,
    },
    "Vit D": {
      whatItMeans: "Vitamin D is essential for bone health, immune function, and mood. Your body makes it from sunlight, but in Sweden's northern latitude, most people don't get enough from October to April. Optimal is above 50 nmol/L.",
      whyItMatters: "At 48, you're slightly below the optimal level. This is extremely common in Sweden - almost everyone is deficient after winter. Low vitamin D is linked to fatigue, low mood, weakened immunity, and long-term bone health issues.",
      whatToDo: "Dr. Johansson recommends a D3 supplement, 2000 IU daily, especially from September through April. It's cheap, safe, and effective. We'll recheck in September to confirm you're back in range.",
      familyRelevance: null,
    },
    "TSH": {
      whatItMeans: "TSH (thyroid-stimulating hormone) is the master control for your thyroid gland, which regulates your metabolism, energy levels, body temperature, and weight. High TSH means your thyroid is underactive. Low TSH means it's overactive.",
      whyItMatters: "At 2.1, your thyroid function is perfectly normal. No concerns here.",
      whatToDo: "No action needed. Thyroid issues are more common in women over 40, so it's good to include this in regular testing.",
      familyRelevance: null,
    },
    "Crea": {
      whatItMeans: "Creatinine is a waste product from muscle metabolism, filtered out by your kidneys. It's a simple measure of kidney function. If creatinine is high, it can mean your kidneys aren't filtering properly.",
      whyItMatters: "At 68 umol/L, your kidney function is normal. This is important to track because some medications (like your blood pressure medication Enalapril) can affect kidney function over time.",
      whatToDo: "No action needed. We'll continue monitoring with each blood test to ensure your kidneys stay healthy while on Enalapril.",
      familyRelevance: null,
    },
    "f-Insulin": {
      whatItMeans: "Fasting insulin measures how much insulin your pancreas produces to keep blood sugar in check. It's an earlier indicator of metabolic problems than glucose. Even when glucose looks normal, rising insulin can mean your body is working harder to keep it there (insulin resistance).",
      whyItMatters: "At 12 mU/L, your insulin is in the normal range. But combined with your rising glucose, this is worth watching. If insulin starts rising in future tests while glucose keeps climbing, it's a sign of developing insulin resistance.",
      whatToDo: "Your training plan targets insulin sensitivity directly. Resistance training (your Monday and Wednesday sessions) is particularly effective. Post-meal walking helps too.",
      familyRelevance: "Insulin resistance often runs in families alongside type 2 diabetes. Your mother's T2D diagnosis at 58 makes this marker particularly relevant for you.",
    },
  };
  return map[shortName] || {
    whatItMeans: "Information not available for this marker.",
    whyItMatters: "Consult your doctor for interpretation.",
    whatToDo: "Follow your doctor's recommendations.",
    familyRelevance: null,
  };
}

function MarkerDetailContent() {
  const params = useSearchParams();
  const shortName = params.get("m") || "f-Glucose";
  const marker = getLatestMarker(shortName);
  const history = getMarkerHistory(shortName);

  if (!marker) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Marker not found.</p>
        <Link href="/smith1/results" style={{ color: "var(--accent)" }}>Back to results</Link>
      </div>
    );
  }

  const sc = statusColor(marker.status);
  const context = getDeepContext(shortName);
  const trend = history.length >= 2 ? history[history.length - 1].value - history[0].value : 0;
  const trendPercent = history.length >= 2 ? ((trend / history[0].value) * 100).toFixed(1) : "0";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          paddingTop: 16, paddingBottom: 12,
        }}>
          <Link href="/smith1/results" style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--bg-elevated)", display: "flex",
            alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text)" }} />
          </Link>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              {marker.plainName}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{marker.name}</p>
          </div>
        </div>

        {/* Current Value Hero */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 20,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
          padding: "24px 20px", marginBottom: 16,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: sc.text, letterSpacing: "-0.03em" }}>
            {marker.value}
            <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)", marginLeft: 4 }}>{marker.unit}</span>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 8,
            background: sc.bg, margin: "8px 0 16px",
          }}>
            {marker.status === "normal" ? (
              <CheckCircle size={13} style={{ color: sc.text }} />
            ) : (
              <AlertTriangle size={13} style={{ color: sc.text }} />
            )}
            <span style={{ fontSize: 12, fontWeight: 600, color: sc.text, textTransform: "capitalize" }}>
              {marker.status}
            </span>
          </div>

          {/* Full zone bar */}
          <FullZoneBar marker={marker} />

          {/* Change badge */}
          {history.length >= 2 && (
            <div style={{
              display: "flex", justifyContent: "center", gap: 12, marginTop: 14,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 8,
                background: "var(--bg-elevated)",
              }}>
                {trend > 0 ? <TrendingUp size={12} style={{ color: "var(--amber-text)" }} /> :
                 trend < 0 ? <TrendingDown size={12} style={{ color: "var(--green-text)" }} /> :
                 <Minus size={12} style={{ color: "var(--text-muted)" }} />}
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {trend > 0 ? "+" : ""}{trend.toFixed(1)} ({trend > 0 ? "+" : ""}{trendPercent}%) over {history.length} tests
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Trend Chart - Full width */}
        {history.length >= 2 && (
          <div className="animate-fade-in stagger-1" style={{
            background: "var(--bg-card)", borderRadius: 18,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            padding: "18px 16px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>
              Your {marker.plainName.toLowerCase()} over time
            </div>
            <DetailTrendChart data={history} marker={marker} />
          </div>
        )}

        {/* What It Means */}
        <div className="animate-fade-in stagger-2" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "16px 18px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Info size={14} style={{ color: "var(--blue-text)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>What this test measures</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {context.whatItMeans}
          </p>
        </div>

        {/* Why It Matters for You */}
        <div className="animate-fade-in stagger-3" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "16px 18px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Activity size={14} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Why this matters for you</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {context.whyItMatters}
          </p>
        </div>

        {/* What to Do */}
        <div className="animate-fade-in stagger-4" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "16px 18px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <CheckCircle size={14} style={{ color: "var(--green-text)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>What you can do</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {context.whatToDo}
          </p>
        </div>

        {/* Family History Connection */}
        {context.familyRelevance && (
          <div className="animate-fade-in stagger-5" style={{
            background: "var(--amber-bg)", borderRadius: 16,
            padding: "16px 18px", marginBottom: 12,
            border: "1px solid rgba(255, 152, 0, 0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Users size={14} style={{ color: "var(--amber-text)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber-text)" }}>Family history connection</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              {context.familyRelevance}
            </p>
          </div>
        )}

        {/* Test History Table */}
        <div className="animate-fade-in stagger-5" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          overflow: "hidden", marginBottom: 12,
        }}>
          <div style={{ padding: "14px 18px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>All results</span>
            </div>
          </div>
          {history.map((h, i) => {
            const session = BLOOD_TEST_HISTORY.find((s) => s.date === h.date);
            const sessionMarker = session?.results.find((r) => r.shortName === shortName);
            const hsc = sessionMarker ? statusColor(sessionMarker.status) : statusColor("normal");
            const prevVal = i > 0 ? history[i - 1].value : null;
            const diff = prevVal !== null ? h.value - prevVal : null;

            return (
              <div key={h.date} style={{
                display: "flex", alignItems: "center", padding: "12px 18px",
                borderTop: "1px solid var(--divider)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                    {formatDate(h.date)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {session?.orderedBy}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {diff !== null && diff !== 0 && (
                    <span style={{ fontSize: 10, color: hsc.text, fontWeight: 500 }}>
                      {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                    </span>
                  )}
                  <span style={{ fontSize: 15, fontWeight: 700, color: hsc.text }}>
                    {h.value}
                  </span>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4, background: hsc.dot,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Full zone bar with labeled zones
function FullZoneBar({ marker }: { marker: BloodMarker }) {
  const { refLow, refHigh, value, unit } = marker;
  const range = refHigh - refLow;
  const extendLow = Math.max(0, refLow - range * 0.4);
  const extendHigh = refHigh + range * 0.4;
  const totalRange = extendHigh - extendLow;

  const pos = Math.max(0, Math.min(1, (value - extendLow) / totalRange));
  const normalStart = (refLow - extendLow) / totalRange;
  const normalEnd = (refHigh - extendLow) / totalRange;
  const sc = statusColor(marker.status);

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ position: "relative", height: 16, borderRadius: 8, overflow: "hidden", background: "var(--bg-elevated)" }}>
        {/* Low zone */}
        {refLow > extendLow && (
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${normalStart * 100}%`,
            background: "var(--amber-bg)",
            borderRadius: "8px 0 0 8px",
          }} />
        )}
        {/* Normal zone */}
        <div style={{
          position: "absolute", left: `${normalStart * 100}%`, top: 0, bottom: 0,
          width: `${(normalEnd - normalStart) * 100}%`,
          background: "var(--green-bg)",
        }} />
        {/* High zone */}
        <div style={{
          position: "absolute", left: `${normalEnd * 100}%`, top: 0, bottom: 0,
          right: 0, background: "var(--amber-bg)",
          borderRadius: "0 8px 8px 0",
        }} />

        {/* Marker */}
        <div style={{
          position: "absolute", left: `${pos * 100}%`, top: "50%",
          transform: "translate(-50%, -50%)", zIndex: 2,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 9,
            background: sc.dot, border: "3px solid var(--bg-card)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }} />
        </div>
      </div>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, padding: "0 2px" }}>
        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Low</span>
        <span style={{ fontSize: 10, color: "var(--green-text)", fontWeight: 600 }}>Normal: {refLow}-{refHigh} {unit}</span>
        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>High</span>
      </div>
    </div>
  );
}

// Detailed trend chart
function DetailTrendChart({ data, marker }: { data: { date: string; value: number }[]; marker: BloodMarker }) {
  const vals = data.map((d) => d.value);
  const dataMin = Math.min(...vals);
  const dataMax = Math.max(...vals);
  const range = marker.refHigh - marker.refLow;
  const chartMin = Math.min(dataMin, marker.refLow) - range * 0.2;
  const chartMax = Math.max(dataMax, marker.refHigh) + range * 0.2;
  const w = 340;
  const h = 150;
  const padX = 36;
  const padY = 16;
  const padBottom = 24;

  const xScale = (i: number) => padX + (i / (data.length - 1)) * (w - padX - 8);
  const yScale = (v: number) => padY + ((chartMax - v) / (chartMax - chartMin)) * (h - padY - padBottom);

  const refHighY = yScale(marker.refHigh);
  const refLowY = yScale(marker.refLow);

  const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.value)}`).join(" ");
  const areaD = `${pathD} L ${xScale(data.length - 1)} ${h - padBottom} L ${xScale(0)} ${h - padBottom} Z`;

  const sc = statusColor(marker.status);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      {/* Normal zone background */}
      <rect
        x={padX} y={refHighY}
        width={w - padX - 8} height={refLowY - refHighY}
        fill="var(--green-bg)" opacity={0.5} rx={4}
      />

      {/* Reference lines */}
      <line x1={padX} y1={refHighY} x2={w - 8} y2={refHighY} stroke="var(--green)" strokeWidth={1} strokeDasharray="4 3" opacity={0.3} />
      <line x1={padX} y1={refLowY} x2={w - 8} y2={refLowY} stroke="var(--green)" strokeWidth={1} strokeDasharray="4 3" opacity={0.3} />

      {/* Reference labels */}
      <text x={padX - 4} y={refHighY + 3} textAnchor="end" fill="var(--green-text)" fontSize={9} fontWeight={500}>{marker.refHigh}</text>
      <text x={padX - 4} y={refLowY + 3} textAnchor="end" fill="var(--green-text)" fontSize={9} fontWeight={500}>{marker.refLow}</text>

      {/* Area fill */}
      <defs>
        <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sc.dot} stopOpacity={0.12} />
          <stop offset="100%" stopColor={sc.dot} stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#detailGrad)" />

      {/* Trend line */}
      <path d={pathD} fill="none" stroke={sc.dot} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {data.map((d, i) => {
        const x = xScale(i);
        const y = yScale(d.value);
        const isLast = i === data.length - 1;
        const session = BLOOD_TEST_HISTORY.find((s) => s.date === d.date);
        const markerData = session?.results.find((r) => r.shortName === marker.shortName);
        const ptSc = markerData ? statusColor(markerData.status) : sc;

        return (
          <g key={d.date}>
            {isLast && <circle cx={x} cy={y} r={8} fill={ptSc.dot} opacity={0.12} />}
            <circle cx={x} cy={y} r={isLast ? 5 : 3} fill={ptSc.dot} stroke="var(--bg-card)" strokeWidth={2} />
            <text x={x} y={y - 10} textAnchor="middle" fill={isLast ? ptSc.text : "var(--text-muted)"} fontSize={isLast ? 12 : 10} fontWeight={isLast ? 700 : 500}>
              {d.value}
            </text>
            <text x={x} y={h - 6} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              {new Date(d.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function MarkerPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
    }>
      <MarkerDetailContent />
    </Suspense>
  );
}
