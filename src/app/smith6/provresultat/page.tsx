"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TestTube, ChevronRight, TrendingUp, TrendingDown,
  ChevronLeft, AlertTriangle, CheckCircle, Minus,
  Activity, Heart, Calendar, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, getMarkerHistory,
  type BloodTestSession, type BloodMarker,
} from "@/lib/v2/mock-patient";

const HEALTHCARE_BLUE = "#1862a5";
const HEALTHCARE_BLUE_LIGHT = "#e8f0fb";
const HEALTHCARE_BLUE_DARK = "#0f4c81";
const WARM_BG = "#f7f8fa";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_SECONDARY = "#4a5568";
const TEXT_MUTED = "#718096";
const BORDER_COLOR = "#e2e8f0";
const SUCCESS_GREEN = "#16a34a";
const WARNING_AMBER = "#d97706";
const RISK_RED = "#dc2626";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Status helpers
function statusInfo(status: string) {
  if (status === "normal")
    return { label: "Normal", color: SUCCESS_GREEN, bg: "#ecfdf5", Icon: CheckCircle };
  if (status === "borderline")
    return { label: "Grans (borderline)", color: WARNING_AMBER, bg: "#fffbeb", Icon: AlertTriangle };
  return { label: "Avvikande (abnormal)", color: RISK_RED, bg: "#fef2f2", Icon: AlertTriangle };
}

// Range bar visualization
function RangeBar({
  value,
  refLow,
  refHigh,
  status,
}: {
  value: number;
  refLow: number;
  refHigh: number;
  status: string;
}) {
  const rangeSpan = refHigh - refLow;
  const displayMin = refLow - rangeSpan * 0.3;
  const displayMax = refHigh + rangeSpan * 0.3;
  const totalSpan = displayMax - displayMin;

  const normalStart = ((refLow - displayMin) / totalSpan) * 100;
  const normalWidth = ((refHigh - refLow) / totalSpan) * 100;
  const markerPos = Math.max(0, Math.min(100, ((value - displayMin) / totalSpan) * 100));

  const dotColor =
    status === "normal"
      ? SUCCESS_GREEN
      : status === "borderline"
      ? WARNING_AMBER
      : RISK_RED;

  return (
    <div style={{ position: "relative", height: 32, marginTop: 8, marginBottom: 4 }}>
      {/* Track */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          height: 12,
          borderRadius: 6,
          background: "#f1f5f9",
        }}
      />
      {/* Normal range */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: `${normalStart}%`,
          width: `${normalWidth}%`,
          height: 12,
          borderRadius: 6,
          background: "#dcfce7",
        }}
      />
      {/* Marker */}
      <div
        style={{
          position: "absolute",
          top: 4,
          left: `${markerPos}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: `10px solid ${dotColor}`,
          }}
        />
      </div>
      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: `${normalStart}%`,
          fontSize: 11,
          color: TEXT_MUTED,
        }}
      >
        {refLow}
      </div>
      <div
        style={{
          position: "absolute",
          top: 26,
          left: `${normalStart + normalWidth}%`,
          transform: "translateX(-100%)",
          fontSize: 11,
          color: TEXT_MUTED,
        }}
      >
        {refHigh}
      </div>
    </div>
  );
}

// Trend chart for a single marker across time
function TrendChart({
  data,
  refLow,
  refHigh,
  unit,
  color,
}: {
  data: { date: string; value: number }[];
  refLow: number;
  refHigh: number;
  unit: string;
  color: string;
}) {
  if (data.length < 2) return null;

  const values = data.map((d) => d.value);
  const allVals = [...values, refLow, refHigh];
  const min = Math.min(...allVals) * 0.95;
  const max = Math.max(...allVals) * 1.05;
  const w = 320;
  const h = 140;
  const padX = 40;
  const padY = 20;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const toX = (i: number) => padX + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => padY + chartH - ((v - min) / (max - min)) * chartH;

  const refLowY = toY(refLow);
  const refHighY = toY(refHigh);

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible", maxWidth: 400 }}
    >
      {/* Normal zone */}
      <rect
        x={padX}
        y={refHighY}
        width={chartW}
        height={refLowY - refHighY}
        fill="#dcfce7"
        opacity={0.5}
        rx={4}
      />

      {/* Reference lines */}
      <line
        x1={padX}
        y1={refLowY}
        x2={padX + chartW}
        y2={refLowY}
        stroke="#86efac"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <line
        x1={padX}
        y1={refHighY}
        x2={padX + chartW}
        y2={refHighY}
        stroke="#86efac"
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* Ref labels */}
      <text x={padX - 4} y={refLowY + 4} textAnchor="end" fontSize={11} fill={TEXT_MUTED}>
        {refLow}
      </text>
      <text x={padX - 4} y={refHighY + 4} textAnchor="end" fontSize={11} fill={TEXT_MUTED}>
        {refHigh}
      </text>

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots and values */}
      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={toX(i)} cy={toY(d.value)} r={4} fill="white" stroke={color} strokeWidth={2} />
          <text
            x={toX(i)}
            y={toY(d.value) - 10}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={TEXT_PRIMARY}
          >
            {d.value}
          </text>
          <text
            x={toX(i)}
            y={h - 2}
            textAnchor="middle"
            fontSize={10}
            fill={TEXT_MUTED}
          >
            {new Date(d.date).toLocaleDateString("sv-SE", {
              month: "short",
              year: "2-digit",
            })}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Smith6Provresultat() {
  const [selectedSession, setSelectedSession] = useState<number>(0);
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"session" | "trends">("session");

  const session = BLOOD_TEST_HISTORY[selectedSession];

  // Compute trend direction for each marker
  function getTrend(shortName: string): "up" | "down" | "stable" {
    const hist = getMarkerHistory(shortName);
    if (hist.length < 2) return "stable";
    const recent = hist[hist.length - 1].value;
    const prev = hist[hist.length - 2].value;
    const diff = ((recent - prev) / prev) * 100;
    if (diff > 2) return "up";
    if (diff < -2) return "down";
    return "stable";
  }

  // Key markers to show in trends view
  const trendMarkers = [
    { shortName: "f-Glucose", label: "Fasteblodsocker (blood sugar, fasting)", color: WARNING_AMBER },
    { shortName: "HbA1c", label: "HbA1c (long-term blood sugar)", color: HEALTHCARE_BLUE },
    { shortName: "TC", label: "Totalkolesterol (total cholesterol)", color: "#7c3aed" },
    { shortName: "HDL", label: "HDL (good cholesterol)", color: SUCCESS_GREEN },
    { shortName: "LDL", label: "LDL (bad cholesterol)", color: RISK_RED },
    { shortName: "TG", label: "Triglycerider (blood fats)", color: "#0891b2" },
  ];

  return (
    <div style={{ background: WARM_BG, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: HEALTHCARE_BLUE,
          color: "white",
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/smith6"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={22} />
          </Link>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Provresultat</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              {BLOOD_TEST_HISTORY.length} provtillfallen sedan{" "}
              {new Date(
                BLOOD_TEST_HISTORY[BLOOD_TEST_HISTORY.length - 1].date
              ).getFullYear()}
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "20px 20px 80px",
        }}
      >
        {/* View mode toggle */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 20,
            background: CARD_BG,
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setViewMode("session")}
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: viewMode === "session" ? HEALTHCARE_BLUE : "transparent",
              color: viewMode === "session" ? "white" : TEXT_SECONDARY,
              transition: "all 0.2s",
            }}
          >
            Per provtillfalle
          </button>
          <button
            onClick={() => setViewMode("trends")}
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: viewMode === "trends" ? HEALTHCARE_BLUE : "transparent",
              color: viewMode === "trends" ? "white" : TEXT_SECONDARY,
              transition: "all 0.2s",
            }}
          >
            Trender over tid
          </button>
        </div>

        {viewMode === "session" ? (
          <>
            {/* Session selector */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 4,
                marginBottom: 20,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {BLOOD_TEST_HISTORY.map((s, i) => (
                <button
                  key={s.date}
                  onClick={() => setSelectedSession(i)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 10,
                    border: `2px solid ${
                      i === selectedSession ? HEALTHCARE_BLUE : BORDER_COLOR
                    }`,
                    background:
                      i === selectedSession ? HEALTHCARE_BLUE_LIGHT : CARD_BG,
                    color:
                      i === selectedSession
                        ? HEALTHCARE_BLUE_DARK
                        : TEXT_SECONDARY,
                    fontWeight: i === selectedSession ? 700 : 500,
                    fontSize: 14,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {formatShortDate(s.date)}
                </button>
              ))}
            </div>

            {/* Session info */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      color: TEXT_MUTED,
                      marginBottom: 4,
                    }}
                  >
                    Provtagning
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {formatDate(session.date)}
                  </div>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <div
                    style={{
                      fontSize: 14,
                      color: TEXT_MUTED,
                      marginBottom: 4,
                    }}
                  >
                    Bestald av
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {session.orderedBy}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: TEXT_MUTED,
                  marginTop: 8,
                }}
              >
                Laboratorium: {session.lab}
              </div>
            </div>

            {/* Results summary */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {["normal", "borderline", "abnormal"].map((status) => {
                const count = session.results.filter(
                  (r) => r.status === status
                ).length;
                if (count === 0) return null;
                const info = statusInfo(status);
                return (
                  <div
                    key={status}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: info.bg,
                      fontSize: 14,
                      fontWeight: 600,
                      color: info.color,
                    }}
                  >
                    <info.Icon size={14} />
                    {count} {info.label.split(" ")[0].toLowerCase()}
                  </div>
                );
              })}
            </div>

            {/* Individual results */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {session.results.map((marker, i) => {
                const info = statusInfo(marker.status);
                const trend = getTrend(marker.shortName);
                const history = getMarkerHistory(marker.shortName);
                const isExpanded = expandedMarker === marker.shortName;

                return (
                  <div
                    key={marker.shortName}
                    style={{
                      borderBottom:
                        i < session.results.length - 1
                          ? `1px solid ${BORDER_COLOR}`
                          : "none",
                    }}
                  >
                    <button
                      onClick={() =>
                        setExpandedMarker(
                          isExpanded ? null : marker.shortName
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: isExpanded ? "#f8fafc" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left" as const,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: TEXT_PRIMARY,
                            marginBottom: 2,
                          }}
                        >
                          {marker.plainName}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: TEXT_MUTED,
                          }}
                        >
                          {marker.name} ({marker.shortName})
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {/* Trend arrow */}
                        {trend === "up" && (
                          <ArrowUpRight
                            size={16}
                            color={
                              marker.status !== "normal"
                                ? WARNING_AMBER
                                : TEXT_MUTED
                            }
                          />
                        )}
                        {trend === "down" && (
                          <ArrowDownRight
                            size={16}
                            color={SUCCESS_GREEN}
                          />
                        )}

                        <div style={{ textAlign: "right" as const }}>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: TEXT_PRIMARY,
                            }}
                          >
                            {marker.value}
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                color: TEXT_MUTED,
                                marginLeft: 4,
                              }}
                            >
                              {marker.unit}
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: info.color,
                            background: info.bg,
                            padding: "3px 10px",
                            borderRadius: 10,
                          }}
                        >
                          {info.label.split(" ")[0]}
                        </span>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "0 20px 20px",
                          background: "#f8fafc",
                        }}
                      >
                        {/* Range bar */}
                        <div style={{ marginBottom: 16 }}>
                          <div
                            style={{
                              fontSize: 13,
                              color: TEXT_MUTED,
                              marginBottom: 4,
                            }}
                          >
                            Referensintervall: {marker.refLow} - {marker.refHigh}{" "}
                            {marker.unit}
                          </div>
                          <RangeBar
                            value={marker.value}
                            refLow={marker.refLow}
                            refHigh={marker.refHigh}
                            status={marker.status}
                          />
                        </div>

                        {/* Trend chart */}
                        {history.length >= 2 && (
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: TEXT_SECONDARY,
                                marginBottom: 8,
                              }}
                            >
                              Historik over tid
                            </div>
                            <TrendChart
                              data={history}
                              refLow={marker.refLow}
                              refHigh={marker.refHigh}
                              unit={marker.unit}
                              color={HEALTHCARE_BLUE}
                            />
                            <div
                              style={{
                                fontSize: 13,
                                color: TEXT_MUTED,
                                marginTop: 8,
                                lineHeight: 1.5,
                              }}
                            >
                              {trend === "up" && marker.status !== "normal"
                                ? `Vardet har okat over tid. Diskutera med din lakare vad du kan gora for att vanda trenden.`
                                : trend === "up"
                                ? `Vardet har okat nagot men ar fortfarande inom normalintervallet.`
                                : trend === "down"
                                ? `Vardet har sjunkit, vilket generellt ar en positiv trend.`
                                : `Vardet har varit stabilt over tid.`}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Trends view */
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: HEALTHCARE_BLUE_LIGHT,
                border: `1px solid ${HEALTHCARE_BLUE}33`,
                borderRadius: 12,
                padding: "14px 18px",
                fontSize: 15,
                color: HEALTHCARE_BLUE_DARK,
                lineHeight: 1.5,
              }}
            >
              Precura samlar dina provresultat fran olika vardgivare och visar
              hur dina varden forandras over tid. Det ar sa vi kan upptacka
              trender som enskilda besok missar.
            </div>

            {trendMarkers.map((tm) => {
              const history = getMarkerHistory(tm.shortName);
              if (history.length < 2) return null;

              const latestSession = BLOOD_TEST_HISTORY.find((s) =>
                s.results.some((r) => r.shortName === tm.shortName)
              );
              const latestMarker = latestSession?.results.find(
                (r) => r.shortName === tm.shortName
              );
              if (!latestMarker) return null;

              const firstVal = history[0].value;
              const lastVal = history[history.length - 1].value;
              const changePct = (((lastVal - firstVal) / firstVal) * 100).toFixed(1);
              const changeDir = lastVal > firstVal ? "+" : "";

              return (
                <div
                  key={tm.shortName}
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${BORDER_COLOR}`,
                    borderRadius: 12,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 600,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {tm.label}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: TEXT_MUTED,
                          marginTop: 4,
                        }}
                      >
                        {history.length} matpunkter sedan{" "}
                        {new Date(history[0].date).getFullYear()}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {lastVal}
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 400,
                            color: TEXT_MUTED,
                            marginLeft: 4,
                          }}
                        >
                          {latestMarker.unit}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            parseFloat(changePct) > 0
                              ? latestMarker.status !== "normal"
                                ? WARNING_AMBER
                                : TEXT_MUTED
                              : SUCCESS_GREEN,
                          marginTop: 2,
                        }}
                      >
                        {changeDir}
                        {changePct}% sedan {new Date(history[0].date).getFullYear()}
                      </div>
                    </div>
                  </div>

                  <TrendChart
                    data={history}
                    refLow={latestMarker.refLow}
                    refHigh={latestMarker.refHigh}
                    unit={latestMarker.unit}
                    color={tm.color}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
