"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    normal: { bg: "#F1F1EF", text: "#37352F" },
    borderline: { bg: "#FDEBD0", text: "#CB912F" },
    abnormal: { bg: "#FADBD8", text: "#E03E3E" },
  };
  const c = colors[status] || colors.normal;
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
      {status}
    </span>
  );
}

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
  const visualLow = refLow - rangeSpan * 0.3;
  const visualHigh = refHigh + rangeSpan * 0.3;
  const totalRange = visualHigh - visualLow;
  const normalStart = ((refLow - visualLow) / totalRange) * 100;
  const normalWidth = (rangeSpan / totalRange) * 100;
  const markerPos = Math.max(0, Math.min(100, ((value - visualLow) / totalRange) * 100));

  return (
    <div style={{ position: "relative", height: 8, width: 120, background: "#F1F1EF", borderRadius: 4 }}>
      <div
        style={{
          position: "absolute",
          left: `${normalStart}%`,
          width: `${normalWidth}%`,
          height: "100%",
          background: "#D5F5E3",
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${markerPos}%`,
          top: -2,
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: `6px solid ${status === "normal" ? "#4DAB9A" : status === "borderline" ? "#CB912F" : "#E03E3E"}`,
          transform: "translateX(-4px)",
        }}
      />
    </div>
  );
}

function TrendArrow({ shortName }: { shortName: string }) {
  const history = getMarkerHistory(shortName);
  if (history.length < 2) return <Minus size={12} style={{ color: "#9B9A97" }} />;

  const latest = history[history.length - 1].value;
  const previous = history[history.length - 2].value;
  const diff = latest - previous;

  if (Math.abs(diff) < 0.05) return <Minus size={12} style={{ color: "#9B9A97" }} />;
  if (diff > 0)
    return <ArrowUp size={12} style={{ color: "#CB912F" }} />;
  return <ArrowDown size={12} style={{ color: "#4DAB9A" }} />;
}

function MiniSparkline({ data }: { data: { date: string; value: number }[] }) {
  if (data.length < 2) return null;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 60;
  const h = 16;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#2383E2"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1].value - min) / range) * (h - 4) - 2}
        r={2}
        fill="#2383E2"
      />
    </svg>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />;
}

export default function BloodWorkPage() {
  const latestSession = BLOOD_TEST_HISTORY[0];
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <Link href="/smith15" style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}>
          Health Overview
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>Blood Work</span>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#37352F", marginBottom: 4 }}>
        Latest Results
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        {new Date(latestSession.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        / {latestSession.orderedBy} / {latestSession.lab}
      </p>

      <Divider />

      {/* Results table */}
      <div>
        {/* Table header */}
        <div
          className="flex items-center py-1.5 px-1"
          style={{ borderBottom: "1px solid #E9E9E7" }}
        >
          <span style={{ flex: 1, fontSize: 11, color: "#9B9A97", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Marker
          </span>
          <span style={{ width: 80, fontSize: 11, color: "#9B9A97", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "right" }}>
            Value
          </span>
          <span style={{ width: 130, fontSize: 11, color: "#9B9A97", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "center" }}>
            Range
          </span>
          <span style={{ width: 70, fontSize: 11, color: "#9B9A97", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "right" }}>
            Trend
          </span>
          <span style={{ width: 80, fontSize: 11, color: "#9B9A97", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "right" }}>
            Status
          </span>
        </div>

        {latestSession.results.map((marker) => {
          const history = getMarkerHistory(marker.shortName);
          const isExpanded = expandedMarker === marker.shortName;

          return (
            <div key={marker.shortName}>
              <div
                className="flex items-center py-2 px-1 -mx-1 cursor-pointer"
                style={{
                  borderBottom: "1px solid #E9E9E7",
                  borderRadius: 3,
                  transition: "background 0.1s",
                }}
                onClick={() =>
                  setExpandedMarker(isExpanded ? null : marker.shortName)
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#37352F" }}>
                    {isExpanded ? (
                      <ChevronDown
                        size={11}
                        style={{
                          color: "#9B9A97",
                          marginRight: 4,
                          display: "inline",
                        }}
                      />
                    ) : (
                      <ChevronRight
                        size={11}
                        style={{
                          color: "#9B9A97",
                          marginRight: 4,
                          display: "inline",
                        }}
                      />
                    )}
                    {marker.plainName}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9B9A97",
                      marginLeft: 19,
                    }}
                  >
                    {marker.name}
                  </div>
                </div>
                <div
                  style={{
                    width: 80,
                    textAlign: "right",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#37352F",
                    fontFamily:
                      '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                  }}
                >
                  {marker.value}
                  <span
                    style={{
                      fontSize: 11,
                      color: "#9B9A97",
                      fontWeight: 400,
                      marginLeft: 2,
                    }}
                  >
                    {marker.unit}
                  </span>
                </div>
                <div
                  style={{ width: 130 }}
                  className="flex items-center justify-center"
                >
                  <RangeBar
                    value={marker.value}
                    refLow={marker.refLow}
                    refHigh={marker.refHigh}
                    status={marker.status}
                  />
                </div>
                <div
                  style={{ width: 70 }}
                  className="flex items-center justify-end gap-1"
                >
                  <MiniSparkline data={history} />
                  <TrendArrow shortName={marker.shortName} />
                </div>
                <div style={{ width: 80, textAlign: "right" }}>
                  <StatusPill status={marker.status} />
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div
                  style={{
                    padding: "8px 1px 8px 23px",
                    borderBottom: "1px solid #E9E9E7",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#9B9A97",
                      marginBottom: 8,
                    }}
                  >
                    Reference range: {marker.refLow} - {marker.refHigh}{" "}
                    {marker.unit}
                  </div>

                  {/* History table */}
                  {history.length > 1 && (
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#9B9A97",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          marginBottom: 4,
                        }}
                      >
                        History
                      </div>
                      {history.map((h, i) => (
                        <div
                          key={h.date}
                          className="flex items-center gap-4 py-0.5"
                        >
                          <span
                            style={{ fontSize: 12, color: "#9B9A97", width: 80 }}
                          >
                            {new Date(h.date).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#37352F",
                              fontFamily:
                                '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                              fontWeight:
                                i === history.length - 1 ? 500 : 400,
                            }}
                          >
                            {h.value} {marker.unit}
                          </span>
                          {i > 0 && (
                            <span style={{ fontSize: 11, color: h.value > history[i - 1].value ? "#CB912F" : "#4DAB9A" }}>
                              {h.value > history[i - 1].value ? "+" : ""}
                              {(h.value - history[i - 1].value).toFixed(1)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Divider />

      <Link
        href="/smith15/blood/history"
        className="flex items-center gap-1.5"
        style={{ fontSize: 14, color: "#2383E2", textDecoration: "none" }}
      >
        View all historical test sessions
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
