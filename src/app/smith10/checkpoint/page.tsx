"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  TestTube,
  User,
  Calendar,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// YOUR LATEST CHECKPOINT
// Blood test results as trajectory measurement
// ============================================================================

const latestSession = BLOOD_TEST_HISTORY[0];
const previousSession = BLOOD_TEST_HISTORY[1];
const doctorNote = DOCTOR_NOTES[0];

// Build comparison data
function getChange(shortName: string): {
  current: number;
  previous: number | null;
  direction: "up" | "down" | "same";
} | null {
  const current = latestSession.results.find((r) => r.shortName === shortName);
  const previous = previousSession?.results.find(
    (r) => r.shortName === shortName
  );
  if (!current) return null;
  if (!previous) return { current: current.value, previous: null, direction: "same" };

  const diff = current.value - previous.value;
  const direction =
    Math.abs(diff) < 0.05 ? "same" : diff > 0 ? "up" : "down";
  return { current: current.value, previous: previous.value, direction };
}

// Markers that matter most for the trajectory
const keyMarkers = [
  {
    short: "f-Glucose",
    name: "Fasting glucose (blood sugar)",
    unit: "mmol/L",
    context: "The number that defines your trajectory. Rising every year since 2021.",
    goodDirection: "down" as const,
  },
  {
    short: "HbA1c",
    name: "HbA1c (long-term blood sugar)",
    unit: "mmol/mol",
    context: "Average blood sugar over 3 months. Still normal, but approaching the 42 pre-diabetes threshold.",
    goodDirection: "down" as const,
  },
  {
    short: "TC",
    name: "Total cholesterol",
    unit: "mmol/L",
    context: "Marginally above the recommended 5.0 limit. Connected to cardiovascular risk.",
    goodDirection: "down" as const,
  },
  {
    short: "HDL",
    name: "HDL (good cholesterol)",
    unit: "mmol/L",
    context: "Healthy level. HDL is protective - higher is better here.",
    goodDirection: "up" as const,
  },
  {
    short: "LDL",
    name: "LDL (bad cholesterol)",
    unit: "mmol/L",
    context: "Within normal range. Monitor alongside total cholesterol.",
    goodDirection: "down" as const,
  },
  {
    short: "TG",
    name: "Triglycerides (blood fats)",
    unit: "mmol/L",
    context: "Normal level. Triglycerides are a metabolic syndrome criterion.",
    goodDirection: "down" as const,
  },
  {
    short: "Vit D",
    name: "Vitamin D",
    unit: "nmol/L",
    context: "Slightly below optimal (target >50). Common in Sweden. Supplementation recommended.",
    goodDirection: "up" as const,
  },
];

function statusColor(status: string) {
  if (status === "normal") return { bg: "#e8f5e9", text: "#2e7d32", label: "Normal" };
  if (status === "borderline")
    return { bg: "#fff8e1", text: "#e65100", label: "Borderline" };
  return { bg: "#ffebee", text: "#c62828", label: "Abnormal" };
}

function directionIcon(
  direction: "up" | "down" | "same",
  goodDirection: "up" | "down"
) {
  const isGood =
    direction === "same" ||
    direction === goodDirection;

  if (direction === "up")
    return (
      <TrendingUp
        size={14}
        color={isGood ? "#2e7d32" : "#c62828"}
        strokeWidth={2.5}
      />
    );
  if (direction === "down")
    return (
      <TrendingDown
        size={14}
        color={isGood ? "#2e7d32" : "#c62828"}
        strokeWidth={2.5}
      />
    );
  return <Minus size={14} color="#8b8da3" strokeWidth={2.5} />;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CheckpointPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link
          href="/smith10"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#f1f3f5",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} color="#555770" />
        </Link>
        <span
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#1a1a2e",
          }}
        >
          Latest checkpoint
        </span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Header */}
        <div style={{ padding: "24px 0 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <TestTube size={18} color="var(--accent)" />
            <p
              style={{
                fontSize: 13,
                color: "#8b8da3",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Blood test {formatDate(latestSession.date)}
            </p>
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
              margin: "0 0 6px",
            }}
          >
            Your latest measurements
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#555770",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Compared against your previous test from{" "}
            {formatDate(previousSession.date)}. Each marker is a data point on
            your trajectory.
          </p>
        </div>

        {/* Doctor's review */}
        <div
          style={{
            margin: "20px 0 0",
            padding: "16px 20px",
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={14} color="var(--accent)" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1a1a2e",
                  margin: 0,
                }}
              >
                {doctorNote.author}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#8b8da3",
                  margin: 0,
                }}
              >
                {doctorNote.type} / {formatDate(doctorNote.date)}
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#555770",
              margin: 0,
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            &quot;Fasting glucose 5.8 - upper normal, continuing the upward trend. HbA1c
            38 - still normal but watch closely. Total cholesterol marginally above
            recommended. Vitamin D slightly low - supplementation recommended.
            Overall: your metabolic trajectory needs active attention, but we have
            clear levers to pull. Retest in 6 months.&quot;
          </p>
        </div>

        {/* Results - trajectory markers first */}
        <div style={{ margin: "24px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8b8da3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            Key markers
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {keyMarkers.map((marker) => {
              const result = latestSession.results.find(
                (r) => r.shortName === marker.short
              );
              if (!result) return null;
              const change = getChange(marker.short);
              const status = statusColor(result.status);

              return (
                <div
                  key={marker.short}
                  style={{
                    padding: "14px 18px",
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Header row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1a1a2e",
                        margin: 0,
                      }}
                    >
                      {marker.name}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: status.text,
                        background: status.bg,
                        padding: "3px 8px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Value row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#1a1a2e",
                      }}
                    >
                      {result.value}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#8b8da3",
                      }}
                    >
                      {marker.unit}
                    </span>
                    {change && change.previous !== null && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          marginLeft: 4,
                        }}
                      >
                        {directionIcon(change.direction, marker.goodDirection)}
                        <span
                          style={{
                            fontSize: 12,
                            color: "#8b8da3",
                          }}
                        >
                          was {change.previous}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Range bar */}
                  <div style={{ marginBottom: 6 }}>
                    <div
                      style={{
                        position: "relative",
                        height: 6,
                        borderRadius: 3,
                        background: "#f1f3f5",
                        overflow: "visible",
                      }}
                    >
                      {/* Normal range */}
                      <div
                        style={{
                          position: "absolute",
                          left: `${((result.refLow - result.refLow * 0.7) / (result.refHigh * 1.3 - result.refLow * 0.7)) * 100}%`,
                          width: `${((result.refHigh - result.refLow) / (result.refHigh * 1.3 - result.refLow * 0.7)) * 100}%`,
                          height: "100%",
                          borderRadius: 3,
                          background: "#e8f5e9",
                        }}
                      />
                      {/* Value marker */}
                      <div
                        style={{
                          position: "absolute",
                          left: `${Math.min(Math.max(((result.value - result.refLow * 0.7) / (result.refHigh * 1.3 - result.refLow * 0.7)) * 100, 2), 98)}%`,
                          top: -3,
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: "5px solid transparent",
                            borderRight: "5px solid transparent",
                            borderTop: `6px solid ${result.status === "normal" ? "#2e7d32" : result.status === "borderline" ? "#e65100" : "#c62828"}`,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 2,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#bbb" }}>
                        {result.refLow}
                      </span>
                      <span style={{ fontSize: 10, color: "#bbb" }}>
                        {result.refHigh}
                      </span>
                    </div>
                  </div>

                  {/* Context */}
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8b8da3",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {marker.context}
                  </p>

                  {/* Mini sparkline for glucose and HbA1c */}
                  {(marker.short === "f-Glucose" || marker.short === "HbA1c") && (
                    <MiniSparkline shortName={marker.short} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Other results */}
        <div style={{ margin: "24px 0 0" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8b8da3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 12px",
            }}
          >
            Other markers
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {latestSession.results
              .filter(
                (r) =>
                  !keyMarkers.some((km) => km.short === r.shortName) ||
                  r.shortName === "Crea" ||
                  r.shortName === "TSH" ||
                  r.shortName === "f-Insulin"
              )
              .filter(
                (r) => !keyMarkers.some((km) => km.short === r.shortName)
              )
              .map((result, i, arr) => (
                <div
                  key={result.shortName}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    borderBottom:
                      i < arr.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#1a1a2e",
                        margin: "0 0 1px",
                      }}
                    >
                      {result.plainName}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#8b8da3",
                        margin: 0,
                      }}
                    >
                      {result.shortName}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#1a1a2e",
                      }}
                    >
                      {result.value} {result.unit}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: statusColor(result.status).text,
                        background: statusColor(result.status).bg,
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {statusColor(result.status).label}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Test metadata */}
        <div
          style={{
            margin: "20px 0 0",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 140,
              padding: "10px 14px",
              background: "#f8f9fa",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#8b8da3",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                margin: "0 0 2px",
              }}
            >
              Ordered by
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#1a1a2e",
                margin: 0,
              }}
            >
              {latestSession.orderedBy}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 140,
              padding: "10px 14px",
              background: "#f8f9fa",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#8b8da3",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                margin: "0 0 2px",
              }}
            >
              Laboratory
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#1a1a2e",
                margin: 0,
              }}
            >
              {latestSession.lab}
            </p>
          </div>
        </div>

        {/* Bottom nav */}
        <div
          style={{
            display: "flex",
            gap: 10,
            margin: "28px 0 0",
          }}
        >
          <Link
            href="/smith10/bend"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "14px",
              background: "#f1f3f5",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              color: "#555770",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} />
            Bend the curve
          </Link>
          <Link
            href="/smith10"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "14px",
              background: "#c41c1c",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Back to trajectory
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Next test */}
        <div
          style={{
            margin: "20px 0 0",
            padding: "14px 18px",
            background: "#f8f9fa",
            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <Calendar size={16} color="#8b8da3" style={{ marginBottom: 4 }} />
          <p style={{ fontSize: 13, color: "#555770", margin: 0 }}>
            Next blood test: <strong>September 15, 2026</strong>
          </p>
          <p style={{ fontSize: 12, color: "#8b8da3", margin: "2px 0 0" }}>
            The checkpoint where we measure if the curve is bending
          </p>
        </div>
      </div>
    </div>
  );
}

// Mini sparkline component
function MiniSparkline({ shortName }: { shortName: string }) {
  const history = getMarkerHistory(shortName);
  if (history.length < 3) return null;

  const vals = history.map((d) => d.value);
  const min = Math.min(...vals) * 0.97;
  const max = Math.max(...vals) * 1.03;
  const w = 200;
  const h = 32;

  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return { x, y, v };
  });

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    d += ` C ${cpx} ${points[i - 1].y}, ${cpx} ${points[i].y}, ${points[i].x} ${points[i].y}`;
  }

  const last = points[points.length - 1];

  return (
    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f5f5f5" }}>
      <p
        style={{
          fontSize: 10,
          color: "#bbb",
          fontWeight: 500,
          margin: "0 0 4px",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        5-year trend
      </p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", maxWidth: w, height: h, overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`spark-${shortName}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c41c1c" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#c41c1c" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Area */}
        <path
          d={d + ` L ${last.x} ${h} L ${points[0].x} ${h} Z`}
          fill={`url(#spark-${shortName})`}
        />
        {/* Line */}
        <path d={d} fill="none" stroke="#c41c1c" strokeWidth={1.5} strokeLinecap="round" />
        {/* Endpoint */}
        <circle cx={last.x} cy={last.y} r={3} fill="#c41c1c" />
        {/* Year labels */}
        {history.map((pt, i) => (
          <text
            key={i}
            x={points[i].x}
            y={h + 10}
            textAnchor="middle"
            fill="#ccc"
            fontSize={8}
            fontFamily='-apple-system, "SF Pro Text", system-ui'
          >
            {new Date(pt.date).getFullYear().toString().slice(2)}
          </text>
        ))}
      </svg>
    </div>
  );
}
