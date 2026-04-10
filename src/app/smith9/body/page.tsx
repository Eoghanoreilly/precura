"use client";

import Link from "next/link";
import {
  ArrowLeft, TrendingUp, TrendingDown, Scale,
  Ruler, Activity, Heart, Info,
} from "lucide-react";
import {
  BIOMETRICS_HISTORY, RISK_ASSESSMENTS, PATIENT,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function TrendChart({
  data,
  color,
  label,
  unit,
  refLine,
  refLabel,
}: {
  data: { date: string; value: number }[];
  color: string;
  label: string;
  unit: string;
  refLine?: number;
  refLabel?: string;
}) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.value);
  const minVal = Math.min(...vals) * 0.96;
  const maxVal = Math.max(...vals) * 1.04;
  const w = 500;
  const h = 140;
  const padX = 44;
  const padY = 16;

  const xScale = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const yScale = (v: number) => padY + ((maxVal - v) / (maxVal - minVal)) * (h - padY * 2);

  const linePath = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${h - padY} L ${xScale(0)} ${h - padY} Z`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color }}>{data[data.length - 1].value}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{unit}</span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`} style={{ overflow: "visible" }}>
        {/* Ref line */}
        {refLine && (
          <>
            <line x1={padX} y1={yScale(refLine)} x2={w - padX} y2={yScale(refLine)}
              stroke="var(--red)" strokeWidth={1} strokeDasharray="4 3" opacity={0.3} />
            <text x={w - padX + 4} y={yScale(refLine) + 4} fill="var(--red-text)" fontSize={9} fontWeight={600}>
              {refLabel || refLine}
            </text>
          </>
        )}

        <defs>
          <linearGradient id={`body-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#body-${label})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => {
          const x = xScale(i);
          const y = yScale(d.value);
          const isLast = i === data.length - 1;
          return (
            <g key={d.date}>
              {isLast && <circle cx={x} cy={y} r={7} fill={color} opacity={0.12} />}
              <circle cx={x} cy={y} r={isLast ? 4 : 2.5} fill={color} opacity={isLast ? 1 : 0.5} />
              <text x={x} y={y - 9} textAnchor="middle" fill={isLast ? color : "var(--text-muted)"} fontSize={isLast ? 11 : 9} fontWeight={isLast ? 700 : 500}>
                {d.value}
              </text>
              <text x={x} y={h + 12} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
                {new Date(d.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function BodyPage() {
  const latest = BIOMETRICS_HISTORY[0];
  const oldest = BIOMETRICS_HISTORY[BIOMETRICS_HISTORY.length - 1];
  const reversed = BIOMETRICS_HISTORY.slice().reverse();

  const weightData = reversed.map((b) => ({ date: b.date, value: b.weight }));
  const bmiData = reversed.map((b) => ({ date: b.date, value: b.bmi }));
  const waistData = reversed.map((b) => ({ date: b.date, value: b.waist }));

  // Blood pressure parsing
  const bpData = reversed.map((b) => {
    const [sys, dia] = b.bloodPressure.split("/").map(Number);
    return { date: b.date, systolic: sys, diastolic: dia };
  });

  const weightChange = latest.weight - oldest.weight;
  const bmiChange = latest.bmi - oldest.bmi;
  const waistChange = latest.waist - oldest.waist;

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
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Body Composition</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{BIOMETRICS_HISTORY.length} measurements since {new Date(oldest.date).getFullYear()}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Current Stats */}
        <div className="animate-fade-in" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10,
          marginBottom: 20,
        }}>
          {[
            { label: "Weight", value: `${latest.weight}`, unit: "kg", change: weightChange, icon: Scale, color: "#3730a3" },
            { label: "BMI", value: latest.bmi.toFixed(1), unit: "", change: bmiChange, icon: Activity, color: "var(--amber)" },
            { label: "Waist", value: `${latest.waist}`, unit: "cm", change: waistChange, icon: Ruler, color: "var(--teal)" },
            { label: "Blood Pressure", value: latest.bloodPressure, unit: "mmHg", change: 0, icon: Heart, color: "var(--red)" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{
                background: "var(--bg-card)", borderRadius: 14,
                border: "1px solid var(--border)", padding: "14px 12px",
                boxShadow: "var(--shadow-sm)", textAlign: "center",
              }}>
                <Icon size={16} style={{ color: stat.color, marginBottom: 6 }} />
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{stat.unit}</div>
                {stat.change !== 0 && stat.label !== "Blood Pressure" && (
                  <div style={{
                    fontSize: 10, fontWeight: 600, marginTop: 4,
                    color: stat.change > 0 ? "var(--amber-text)" : "var(--green-text)",
                  }}>
                    {stat.change > 0 ? "+" : ""}{stat.change.toFixed(1)} since {new Date(oldest.date).getFullYear()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weight Trend */}
        <div className="animate-fade-in stagger-1" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 18px", marginBottom: 14,
        }}>
          <TrendChart data={weightData} color="#3730a3" label="Weight" unit="kg" />
        </div>

        {/* BMI Trend */}
        <div className="animate-fade-in stagger-2" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 18px", marginBottom: 14,
        }}>
          <TrendChart data={bmiData} color="var(--amber)" label="BMI (Body Mass Index)" unit="" refLine={25} refLabel="Normal limit" />
          <div style={{
            marginTop: 8, padding: "8px 12px", borderRadius: 8,
            background: "var(--amber-bg)", fontSize: 12, color: "var(--amber-text)",
          }}>
            BMI {latest.bmi.toFixed(1)} is in the overweight range (25-30). Target: below 25.
          </div>
        </div>

        {/* Waist Circumference */}
        <div className="animate-fade-in stagger-3" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 18px", marginBottom: 14,
        }}>
          <TrendChart data={waistData} color="var(--teal)" label="Waist Circumference" unit="cm" refLine={88} refLabel="MetSyn threshold" />
          <div style={{
            marginTop: 8, padding: "8px 12px", borderRadius: 8,
            background: "var(--amber-bg)", fontSize: 12, color: "var(--amber-text)",
          }}>
            Waist {latest.waist}cm is approaching the metabolic syndrome threshold of 88cm for women. Currently 2cm away.
          </div>
        </div>

        {/* Blood Pressure Trend */}
        <div className="animate-fade-in stagger-4" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 18px", marginBottom: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Blood Pressure Trend</div>

          <svg width="100%" viewBox="0 0 500 180" style={{ overflow: "visible" }}>
            {/* Zones */}
            <rect x={44} y={16} width={412} height={148} fill="var(--green-bg)" opacity={0.3} rx={4} />
            <rect x={44} y={16} width={412} height={40} fill="var(--amber-bg)" opacity={0.3} rx={4} />

            {/* 140 and 90 reference lines */}
            {[140, 130, 120].map((val) => {
              const minBP = 70;
              const maxBP = 150;
              const y = 16 + ((maxBP - val) / (maxBP - minBP)) * 148;
              return (
                <g key={val}>
                  <line x1={44} y1={y} x2={456} y2={y} stroke="var(--border)" strokeWidth={0.5} />
                  <text x={40} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize={9}>{val}</text>
                </g>
              );
            })}

            {/* Systolic line */}
            {bpData.map((d, i) => {
              const x = 44 + (i / (bpData.length - 1)) * 412;
              const y = 16 + ((150 - d.systolic) / 80) * 148;
              const isLast = i === bpData.length - 1;
              return (
                <g key={`sys-${d.date}`}>
                  {i > 0 && (
                    <line
                      x1={44 + ((i - 1) / (bpData.length - 1)) * 412}
                      y1={16 + ((150 - bpData[i - 1].systolic) / 80) * 148}
                      x2={x} y2={y}
                      stroke="var(--red)" strokeWidth={2} strokeLinecap="round"
                    />
                  )}
                  <circle cx={x} cy={y} r={isLast ? 4 : 2.5} fill="var(--red)" opacity={isLast ? 1 : 0.5} />
                  <text x={x} y={y - 8} textAnchor="middle" fill="var(--red-text)" fontSize={isLast ? 10 : 0} fontWeight={700}>
                    {d.systolic}
                  </text>
                </g>
              );
            })}

            {/* Diastolic line */}
            {bpData.map((d, i) => {
              const x = 44 + (i / (bpData.length - 1)) * 412;
              const y = 16 + ((150 - d.diastolic) / 80) * 148;
              const isLast = i === bpData.length - 1;
              return (
                <g key={`dia-${d.date}`}>
                  {i > 0 && (
                    <line
                      x1={44 + ((i - 1) / (bpData.length - 1)) * 412}
                      y1={16 + ((150 - bpData[i - 1].diastolic) / 80) * 148}
                      x2={x} y2={y}
                      stroke="var(--blue)" strokeWidth={2} strokeLinecap="round"
                    />
                  )}
                  <circle cx={x} cy={y} r={isLast ? 4 : 2.5} fill="var(--blue)" opacity={isLast ? 1 : 0.5} />
                  <text x={x} y={y + 14} textAnchor="middle" fill="var(--blue-text)" fontSize={isLast ? 10 : 0} fontWeight={700}>
                    {d.diastolic}
                  </text>
                </g>
              );
            })}

            {/* X axis labels */}
            {bpData.map((d, i) => (
              <text key={`label-${d.date}`} x={44 + (i / (bpData.length - 1)) * 412} y={180} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
                {new Date(d.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
              </text>
            ))}
          </svg>

          <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 3, borderRadius: 2, background: "var(--red)" }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Systolic</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 3, borderRadius: 2, background: "var(--blue)" }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Diastolic</span>
            </div>
          </div>

          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 8,
            background: "var(--green-bg)", fontSize: 12, color: "var(--green-text)",
          }}>
            Blood pressure is well controlled on Enalapril 5mg. Previous high of 142/88 in 2022, now 132/82.
          </div>
        </div>

        {/* All Measurements Table */}
        <div className="animate-fade-in stagger-5" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "18px 18px",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
            All Measurements
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Date", "Weight", "BMI", "Waist", "BP"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "8px 10px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-muted)", fontWeight: 600, fontSize: 11,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BIOMETRICS_HISTORY.map((b, i) => (
                  <tr key={b.date}>
                    {[
                      formatDate(b.date),
                      `${b.weight} kg`,
                      b.bmi.toFixed(1),
                      `${b.waist} cm`,
                      b.bloodPressure,
                    ].map((cell, j) => (
                      <td key={j} style={{
                        padding: "8px 10px",
                        borderBottom: i < BIOMETRICS_HISTORY.length - 1 ? "1px solid var(--divider)" : "none",
                        color: i === 0 ? "var(--text)" : "var(--text-secondary)",
                        fontWeight: i === 0 ? 600 : 400,
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
