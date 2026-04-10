"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY,
  getMarkerHistory,
  type BloodTestSession,
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

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />;
}

function GlucoseTrendChart() {
  const data = getMarkerHistory("f-Glucose");
  if (data.length < 2) return null;

  const w = 600;
  const h = 160;
  const padding = { top: 20, right: 40, bottom: 30, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const min = Math.min(...data.map((d) => d.value)) - 0.3;
  const max = Math.max(...data.map((d) => d.value)) + 0.3;
  const range = max - min;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d.value - min) / range) * chartH,
    ...d,
  }));

  const refHighY = padding.top + chartH - ((6.0 - min) / range) * chartH;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={w} height={h} style={{ display: "block" }}>
        {/* Reference line at 6.0 */}
        <line
          x1={padding.left}
          y1={refHighY}
          x2={w - padding.right}
          y2={refHighY}
          stroke="#E9E9E7"
          strokeDasharray="4,3"
        />
        <text
          x={w - padding.right + 4}
          y={refHighY + 4}
          fill="#9B9A97"
          fontSize={10}
          fontFamily={FONT}
        >
          6.0
        </text>

        {/* Grid lines */}
        {[5.0, 5.5].map((v) => {
          const y = padding.top + chartH - ((v - min) / range) * chartH;
          return (
            <g key={v}>
              <line
                x1={padding.left}
                y1={y}
                x2={w - padding.right}
                y2={y}
                stroke="#F1F1EF"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                fill="#9B9A97"
                fontSize={10}
                textAnchor="end"
                fontFamily={FONT}
              >
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Line */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#2383E2"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={3}
              fill={i === points.length - 1 ? "#2383E2" : "#FAFAF9"}
              stroke="#2383E2"
              strokeWidth={1.5}
            />
            <text
              x={p.x}
              y={p.y - 10}
              fill="#37352F"
              fontSize={11}
              textAnchor="middle"
              fontWeight={i === points.length - 1 ? 600 : 400}
              fontFamily={FONT}
            >
              {p.value}
            </text>
            {/* Date label */}
            <text
              x={p.x}
              y={h - 6}
              fill="#9B9A97"
              fontSize={10}
              textAnchor="middle"
              fontFamily={FONT}
            >
              {new Date(p.date).toLocaleDateString("en-GB", {
                month: "short",
                year: "2-digit",
              })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function SessionBlock({ session, index }: { session: BloodTestSession; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full py-2 px-1 -mx-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: FONT,
          borderRadius: 3,
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {expanded ? (
          <ChevronDown size={12} style={{ color: "#9B9A97" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "#9B9A97" }} />
        )}
        <span style={{ fontSize: 14, fontWeight: 500, color: "#37352F" }}>
          {new Date(session.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span style={{ fontSize: 12, color: "#9B9A97", marginLeft: 8 }}>
          {session.results.length} markers / {session.orderedBy}
        </span>
        {session.results.some((r) => r.status === "borderline") && (
          <span
            style={{
              fontSize: 11,
              color: "#CB912F",
              background: "#FDEBD0",
              padding: "1px 6px",
              borderRadius: 3,
              marginLeft: "auto",
            }}
          >
            {session.results.filter((r) => r.status === "borderline").length} borderline
          </span>
        )}
      </button>

      {expanded && (
        <div style={{ paddingLeft: 20, paddingBottom: 8 }}>
          {session.results.map((marker) => (
            <div
              key={marker.shortName}
              className="flex items-center justify-between py-1"
            >
              <div>
                <span style={{ fontSize: 13, color: "#37352F" }}>
                  {marker.plainName}
                </span>
                <span style={{ fontSize: 11, color: "#9B9A97", marginLeft: 6 }}>
                  {marker.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontSize: 13,
                    color: "#37352F",
                    fontFamily:
                      '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                  }}
                >
                  {marker.value} {marker.unit}
                </span>
                <StatusPill status={marker.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BloodHistoryPage() {
  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <Link
          href="/smith15"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Health Overview
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <Link
          href="/smith15/blood"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Blood Work
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>
          Historical Trends
        </span>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 4,
        }}
      >
        Historical Trends
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        {BLOOD_TEST_HISTORY.length} test sessions from{" "}
        {new Date(
          BLOOD_TEST_HISTORY[BLOOD_TEST_HISTORY.length - 1].date
        ).getFullYear()}{" "}
        to {new Date(BLOOD_TEST_HISTORY[0].date).getFullYear()}
      </p>

      <Divider />

      {/* Glucose trend chart */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#9B9A97",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 8,
          }}
        >
          Fasting Glucose (blood sugar, fasting) - mmol/L
        </div>
        <GlucoseTrendChart />
        <div style={{ fontSize: 12, color: "#9B9A97", marginTop: 4 }}>
          5.0 (2021) to 5.8 (2026) - steady upward trend over 5 years. Upper
          limit is 6.0 mmol/L.
        </div>
      </div>

      <Divider />

      {/* All sessions */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#9B9A97",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 8,
        }}
      >
        All Test Sessions
      </div>

      <div>
        {BLOOD_TEST_HISTORY.map((session, i) => (
          <SessionBlock key={session.date} session={session} index={i} />
        ))}
      </div>
    </div>
  );
}
