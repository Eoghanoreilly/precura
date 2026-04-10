"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, TestTube, ChevronRight, TrendingUp,
  Calendar, Clock, MessageCircle, Dumbbell,
  AlertTriangle, Droplet, Heart, Shield,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS,
  DOCTOR_NOTES, MESSAGES, TRAINING_PLAN,
  getMarkerHistory, getLatestMarker,
} from "@/lib/v2/mock-patient";

// Status color mapping
function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// Mini sparkline using SVG
function Sparkline({ data, color }: { data: { value: number }[]; color: string }) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals) * 0.98;
  const max = Math.max(...vals) * 1.02;
  const w = 80;
  const h = 28;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const last = vals[vals.length - 1];
  const lx = w;
  const ly = h - ((last - min) / (max - min)) * h;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`spark-${color.replace(/[^a-z0-9]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
        fill={`url(#spark-${color.replace(/[^a-z0-9]/g, "")})`}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lx} cy={ly} r={3} fill={color} />
    </svg>
  );
}

export default function Smith1Home() {
  const latest = BLOOD_TEST_HISTORY[0];
  const normalCount = latest.results.filter((r) => r.status === "normal").length;
  const borderlineCount = latest.results.filter((r) => r.status === "borderline").length;
  const abnormalCount = latest.results.filter((r) => r.status === "abnormal").length;
  const totalMarkers = latest.results.length;
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = getLatestMarker("f-Glucose");
  const daysToNext = daysUntil(PATIENT.nextBloodTest);
  const latestNote = DOCTOR_NOTES[0];
  const lastMessage = MESSAGES[MESSAGES.length - 1];

  // Markers that need attention (borderline or abnormal)
  const flaggedMarkers = latest.results.filter((r) => r.status !== "normal");
  const goodMarkers = latest.results.filter((r) => r.status === "normal");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 16, paddingBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              background: "var(--blue-bg)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Activity size={15} style={{ color: "var(--blue-text)" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>Precura</span>
          </div>
          <Link href="/smith1" style={{
            width: 36, height: 36, borderRadius: 12,
            background: "var(--accent-light)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "var(--accent)",
            textDecoration: "none",
          }}>
            AB
          </Link>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: "var(--text)",
            letterSpacing: "-0.02em", margin: 0,
          }}>
            Hi, {PATIENT.firstName}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>
            Your blood tests, explained.
          </p>
        </div>

        {/* Latest Results Summary Card - Hero */}
        <Link href="/smith1/results" style={{ textDecoration: "none" }}>
          <div className="animate-fade-in" style={{
            background: "var(--bg-card)", borderRadius: 20,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
            padding: "20px 20px 16px", marginBottom: 14,
            cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <TestTube size={14} style={{ color: "var(--blue-text)" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--blue-text)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Latest Results</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
                  {formatDate(latest.date)}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
                  {latest.lab}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: "var(--text-faint)", marginTop: 4 }} />
            </div>

            {/* Marker count pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <div style={{
                flex: 1, padding: "10px 0", borderRadius: 12,
                background: "var(--green-bg)", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green-text)" }}>{normalCount}</div>
                <div style={{ fontSize: 11, color: "var(--green-text)", fontWeight: 500 }}>Normal</div>
              </div>
              <div style={{
                flex: 1, padding: "10px 0", borderRadius: 12,
                background: "var(--amber-bg)", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--amber-text)" }}>{borderlineCount}</div>
                <div style={{ fontSize: 11, color: "var(--amber-text)", fontWeight: 500 }}>Watch</div>
              </div>
              {abnormalCount > 0 && (
                <div style={{
                  flex: 1, padding: "10px 0", borderRadius: 12,
                  background: "var(--red-bg)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--red-text)" }}>{abnormalCount}</div>
                  <div style={{ fontSize: 11, color: "var(--red-text)", fontWeight: 500 }}>Action</div>
                </div>
              )}
            </div>

            {/* Doctor reviewed badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 10,
              background: "var(--accent-light)",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: "var(--accent)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Shield size={12} style={{ color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>Reviewed by {latestNote.author}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tap to read full analysis</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Flagged Markers - what needs attention */}
        {flaggedMarkers.length > 0 && (
          <div className="animate-fade-in stagger-1" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingLeft: 2 }}>
              <AlertTriangle size={13} style={{ color: "var(--amber-text)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Needs attention</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {flaggedMarkers.map((marker) => {
                const sc = statusColor(marker.status);
                const history = getMarkerHistory(marker.shortName);
                const trend = history.length >= 2 ? history[history.length - 1].value - history[history.length - 2].value : 0;
                return (
                  <Link key={marker.shortName} href={`/smith1/marker?m=${marker.shortName}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "var(--bg-card)", borderRadius: 16,
                      border: "1px solid var(--border)", padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 12,
                      boxShadow: "var(--shadow-sm)",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: sc.bg, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Droplet size={18} style={{ color: sc.text }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                          {marker.plainName}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {marker.value} {marker.unit}
                          {trend !== 0 && (
                            <span style={{ color: sc.text, fontWeight: 600, marginLeft: 6 }}>
                              {trend > 0 ? "+" : ""}{trend.toFixed(1)} since last
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkline
                          data={history}
                          color={sc.dot}
                        />
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "3px 8px",
                          borderRadius: 6, background: sc.bg, color: sc.text,
                          textTransform: "uppercase",
                        }}>
                          {marker.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Glucose Trend - the key story */}
        <Link href="/smith1/marker?m=f-Glucose" style={{ textDecoration: "none" }}>
          <div className="animate-fade-in stagger-2" style={{
            background: "var(--bg-card)", borderRadius: 18,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            padding: "16px 18px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>5-Year Glucose Trend</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                  Blood sugar (fasting): {latestGlucose?.value} {latestGlucose?.unit}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 8,
                background: "var(--amber-bg)",
              }}>
                <TrendingUp size={12} style={{ color: "var(--amber-text)" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber-text)" }}>Rising</span>
              </div>
            </div>

            {/* Trend visualization */}
            <GlucoseTrendChart data={glucoseHistory} />

            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "10px 0 0", lineHeight: 1.5 }}>
              Your fasting glucose has risen from {glucoseHistory[0].value} to {glucoseHistory[glucoseHistory.length - 1].value} mmol/L over 5 years.
              Your GP noted each result as &quot;normal&quot; individually, but the trend tells a different story.
            </p>
          </div>
        </Link>

        {/* Doctor's Message Preview */}
        <div className="animate-fade-in stagger-3" style={{
          background: "var(--bg-card)", borderRadius: 16,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "14px 16px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "var(--accent-light)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <MessageCircle size={15} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Marcus Johansson</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {formatDate(lastMessage.date.split("T")[0])}
              </div>
            </div>
          </div>
          <p style={{
            fontSize: 13, color: "var(--text-secondary)", margin: 0,
            lineHeight: 1.6, display: "-webkit-box",
            WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {lastMessage.text}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <Link href="/smith1/history" style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", padding: "16px 14px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <Clock size={18} style={{ color: "var(--blue-text)", marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Test History</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{BLOOD_TEST_HISTORY.length} sessions since 2021</div>
            </div>
          </Link>

          <Link href="/smith1/tracking" style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", padding: "16px 14px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <Calendar size={18} style={{ color: "var(--teal-text)", marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Next Test</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {daysToNext > 0 ? `In ${daysToNext} days` : "Schedule now"}
              </div>
            </div>
          </Link>

          <Link href="/smith1/risk" style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{
              background: "var(--bg-card)", borderRadius: 16,
              border: "1px solid var(--border)", padding: "16px 14px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <Heart size={18} style={{ color: "var(--red-text)", marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Risk Models</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Diabetes: {RISK_ASSESSMENTS.diabetes.tenYearRisk}
              </div>
            </div>
          </Link>

          <div className="card-hover" style={{
            background: "var(--bg-card)", borderRadius: 16,
            border: "1px solid var(--border)", padding: "16px 14px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <Dumbbell size={18} style={{ color: "var(--purple-text)", marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Training</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Week {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks}
            </div>
          </div>
        </div>

        {/* All Normal Markers - collapsed list */}
        {goodMarkers.length > 0 && (
          <NormalMarkersSection markers={goodMarkers} />
        )}

        {/* Next Test Reminder */}
        <div className="animate-fade-in stagger-5" style={{
          background: "linear-gradient(135deg, var(--blue-bg) 0%, #e8eaf6 100%)",
          borderRadius: 16, padding: "16px 18px", marginBottom: 14,
          border: "1px solid rgba(66, 165, 245, 0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--blue-text)", marginBottom: 2 }}>
                Next blood test
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {formatDate(PATIENT.nextBloodTest)} - {daysToNext} days away
              </div>
            </div>
            <Link href="/smith1/tracking" style={{
              padding: "8px 14px", borderRadius: 10,
              background: "var(--blue-text)", color: "#fff",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>
              Details
            </Link>
          </div>
        </div>

        {/* Membership */}
        <div style={{
          background: "var(--bg-card)", borderRadius: 14,
          border: "1px solid var(--border)", padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Precura Annual</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {PATIENT.membershipPrice} kr/year - Member since {formatDate(PATIENT.memberSince)}
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 600, padding: "4px 8px",
            borderRadius: 6, background: "var(--green-bg)", color: "var(--green-text)",
            textTransform: "uppercase",
          }}>Active</div>
        </div>
      </div>
    </div>
  );
}

// Glucose trend chart component
function GlucoseTrendChart({ data }: { data: { date: string; value: number }[] }) {
  const vals = data.map((d) => d.value);
  const minVal = 4.5;
  const maxVal = 6.5;
  const refHigh = 6.0;
  const refLow = 3.9;
  const w = 340;
  const h = 100;
  const padX = 30;
  const padY = 10;

  const xScale = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const yScale = (v: number) => padY + ((maxVal - v) / (maxVal - minVal)) * (h - padY * 2);

  const pathD = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  // Area under the line
  const areaD = `${pathD} L ${xScale(data.length - 1)} ${h - padY} L ${xScale(0)} ${h - padY} Z`;

  const refHighY = yScale(refHigh);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`} style={{ overflow: "visible" }}>
      {/* Borderline zone background */}
      <rect x={padX} y={yScale(refHigh)} width={w - padX * 2} height={yScale(minVal) - yScale(refHigh)} fill="var(--amber-bg)" opacity={0.4} rx={4} />

      {/* Reference line at 6.0 */}
      <line x1={padX} y1={refHighY} x2={w - padX} y2={refHighY} stroke="var(--amber)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
      <text x={w - padX + 4} y={refHighY + 4} fill="var(--amber-text)" fontSize={9} fontWeight={600}>6.0</text>

      {/* Area fill */}
      <defs>
        <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity={0.15} />
          <stop offset="100%" stopColor="var(--amber)" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#glucoseGrad)" />

      {/* Trend line */}
      <path d={pathD} fill="none" stroke="var(--amber)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {data.map((d, i) => {
        const x = xScale(i);
        const y = yScale(d.value);
        const isLast = i === data.length - 1;
        return (
          <g key={d.date}>
            {isLast && <circle cx={x} cy={y} r={6} fill="var(--amber)" opacity={0.15} />}
            <circle cx={x} cy={y} r={isLast ? 4 : 2.5} fill={isLast ? "var(--amber)" : "var(--amber-text)"} opacity={isLast ? 1 : 0.6} />
            <text x={x} y={h + 12} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              {new Date(d.date).getFullYear().toString().slice(2)}
            </text>
            <text x={x} y={y - 8} textAnchor="middle" fill={isLast ? "var(--amber-text)" : "var(--text-muted)"} fontSize={isLast ? 11 : 9} fontWeight={isLast ? 700 : 500}>
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Collapsible normal markers
function NormalMarkersSection({ markers }: { markers: typeof BLOOD_TEST_HISTORY[0]["results"] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="animate-fade-in stagger-4" style={{ marginBottom: 14 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", background: "var(--bg-card)",
          borderRadius: expanded ? "16px 16px 0 0" : 16,
          border: "1px solid var(--border)", padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", boxShadow: "var(--shadow-sm)",
          borderBottom: expanded ? "none" : "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4, background: "var(--green)",
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
            {markers.length} markers in normal range
          </span>
        </div>
        <ChevronRight
          size={16}
          style={{
            color: "var(--text-muted)",
            transform: expanded ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {expanded && (
        <div style={{
          background: "var(--bg-card)", borderRadius: "0 0 16px 16px",
          border: "1px solid var(--border)", borderTop: "none",
          padding: "4px 0",
        }}>
          {markers.map((m, i) => (
            <Link key={m.shortName} href={`/smith1/marker?m=${m.shortName}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: i < markers.length - 1 ? "1px solid var(--divider)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.plainName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.name}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green-text)" }}>
                    {m.value} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>{m.unit}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
