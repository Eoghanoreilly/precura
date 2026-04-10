"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Calendar,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";
import type { BloodMarker, BloodTestSession } from "@/lib/v2/mock-patient";

export default function BloodPage() {
  const [expandedSession, setExpandedSession] = useState<number>(0);
  const [showRiskDetail, setShowRiskDetail] = useState<string | null>(null);

  const latestSession = BLOOD_TEST_HISTORY[0];
  const latestNote = DOCTOR_NOTES[0];

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: "#002110", margin: 0 }}>
          Blood tests
        </h1>
        <p style={{ fontSize: 14, color: "#4F6354", marginTop: 4 }}>
          {BLOOD_TEST_HISTORY.length} tests over 5 years
        </p>
      </div>

      {/* Doctor's note - Material 3 primary container */}
      <div
        style={{
          background: "#95F7B5",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <FileText size={18} style={{ color: "#002110" }} />
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#002110", margin: 0 }}>
            Doctor&apos;s review
          </h2>
        </div>
        <p style={{ fontSize: 14, color: "#002110", lineHeight: 1.6, margin: 0 }}>
          Glucose at 5.8 is in the upper normal range and continuing a consistent upward trend.
          Combined with your family history, I recommend we retest in 6 months and continue
          the current training plan. Vitamin D supplement (2000 IU daily) recommended.
        </p>
        <p style={{ fontSize: 12, color: "#002110", opacity: 0.6, marginTop: 8 }}>
          {latestNote.author} - {latestNote.date}
        </p>
      </div>

      {/* Risk breakdown cards */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 8px" }}>
          Risk analysis
        </h2>
        <div className="flex flex-col gap-3">
          <RiskCard
            title="Diabetes (Type 2)"
            risk={RISK_ASSESSMENTS.diabetes}
            expanded={showRiskDetail === "diabetes"}
            onToggle={() =>
              setShowRiskDetail(showRiskDetail === "diabetes" ? null : "diabetes")
            }
          />
          <RiskCard
            title="Cardiovascular"
            risk={RISK_ASSESSMENTS.cardiovascular}
            expanded={showRiskDetail === "cardiovascular"}
            onToggle={() =>
              setShowRiskDetail(
                showRiskDetail === "cardiovascular" ? null : "cardiovascular"
              )
            }
          />
          <RiskCard
            title="Bone health"
            risk={RISK_ASSESSMENTS.bone}
            expanded={showRiskDetail === "bone"}
            onToggle={() =>
              setShowRiskDetail(showRiskDetail === "bone" ? null : "bone")
            }
          />
        </div>
      </div>

      {/* Metabolic syndrome tracker */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 4px" }}>
          Metabolic syndrome check
        </h2>
        <p style={{ fontSize: 13, color: "#4F6354", margin: "0 0 12px" }}>
          {RISK_ASSESSMENTS.metabolicSyndrome.metCount} of 5 criteria met (3 needed for diagnosis)
        </p>
        <div className="flex flex-col gap-2">
          {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3"
              style={{
                padding: "8px 12px",
                borderRadius: 12,
                background: c.met ? "#FFF3E0" : "#FAFDFB",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 50,
                  background: c.met ? "#E65100" : "#006D3E",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "#002110", margin: 0, fontWeight: 500 }}>
                  {c.name}
                </p>
                <p style={{ fontSize: 12, color: "#6F796F", margin: 0 }}>
                  {c.value} - {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blood test sessions - expandable */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 8px" }}>
          Test history
        </h2>
        <div className="flex flex-col gap-3">
          {BLOOD_TEST_HISTORY.map((session, idx) => (
            <SessionCard
              key={session.date}
              session={session}
              expanded={expandedSession === idx}
              onToggle={() =>
                setExpandedSession(expandedSession === idx ? -1 : idx)
              }
              isLatest={idx === 0}
            />
          ))}
        </div>
      </div>

      {/* Next test scheduling */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "#95F7B5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Calendar size={20} style={{ color: "#002110" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
            Next test: September 15, 2026
          </p>
          <p style={{ fontSize: 13, color: "#4F6354", margin: "2px 0 0" }}>
            Comprehensive panel - Karolinska Lab
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- Risk card ---- */

function RiskCard({
  title,
  risk,
  expanded,
  onToggle,
}: {
  title: string;
  risk: {
    riskLevel: string;
    riskLabel: string;
    trend: string;
    summary: string;
    tenYearRisk: string;
    keyFactors: { name: string; changeable: boolean; impact: string }[];
  };
  expanded: boolean;
  onToggle: () => void;
}) {
  const levelColor =
    risk.riskLevel === "moderate"
      ? "#E65100"
      : risk.riskLevel === "low_moderate"
        ? "#F9A825"
        : "#006D3E";
  const levelBg =
    risk.riskLevel === "moderate"
      ? "#FFF3E0"
      : risk.riskLevel === "low_moderate"
        ? "#FFFDE7"
        : "#E8F5E9";

  return (
    <div
      style={{
        background: "#ECF5EF",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full"
        style={{
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#002110", margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: 13, color: "#4F6354", margin: "2px 0 0" }}>
            10-year risk: {risk.tenYearRisk}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: levelColor,
              background: levelBg,
              padding: "3px 10px",
              borderRadius: 50,
            }}
          >
            {risk.riskLabel}
          </span>
          {expanded ? (
            <ChevronUp size={18} style={{ color: "#6F796F" }} />
          ) : (
            <ChevronDown size={18} style={{ color: "#6F796F" }} />
          )}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <p style={{ fontSize: 14, color: "#002110", lineHeight: 1.6, margin: "0 0 12px" }}>
            {risk.summary}
          </p>
          <div className="flex flex-col gap-2">
            {risk.keyFactors.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2"
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: "#FAFDFB",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 50,
                    background:
                      f.impact === "positive"
                        ? "#006D3E"
                        : f.impact === "high"
                          ? "#BA1A1A"
                          : f.impact === "medium"
                            ? "#E65100"
                            : "#6F796F",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: "#002110", flex: 1 }}>
                  {f.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: f.changeable ? "#006D3E" : "#6F796F",
                    fontWeight: 500,
                  }}
                >
                  {f.changeable ? "Changeable" : "Fixed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Session card ---- */

function SessionCard({
  session,
  expanded,
  onToggle,
  isLatest,
}: {
  session: BloodTestSession;
  expanded: boolean;
  onToggle: () => void;
  isLatest: boolean;
}) {
  return (
    <div
      style={{
        background: isLatest ? "#ECF5EF" : "#FAFDFB",
        borderRadius: 16,
        border: isLatest ? "none" : "1px solid #C0C9BF",
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full"
        style={{
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#002110", margin: 0 }}>
            {new Date(session.date).toLocaleDateString("en-SE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p style={{ fontSize: 13, color: "#4F6354", margin: "2px 0 0" }}>
            {session.orderedBy} - {session.results.length} markers
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLatest && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#006D3E",
                background: "#95F7B5",
                padding: "2px 8px",
                borderRadius: 50,
              }}
            >
              Latest
            </span>
          )}
          {expanded ? (
            <ChevronUp size={18} style={{ color: "#6F796F" }} />
          ) : (
            <ChevronDown size={18} style={{ color: "#6F796F" }} />
          )}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <div className="flex flex-col gap-2">
            {session.results.map((marker) => (
              <MarkerRow key={marker.shortName} marker={marker} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Marker row with range bar ---- */

function MarkerRow({ marker }: { marker: BloodMarker }) {
  const history = getMarkerHistory(marker.shortName);
  const hasTrend = history.length > 1;
  const prevValue = hasTrend ? history[history.length - 2]?.value : null;
  const trendDir =
    prevValue !== null
      ? marker.value > prevValue
        ? "up"
        : marker.value < prevValue
          ? "down"
          : "flat"
      : "flat";

  const statusColor =
    marker.status === "borderline"
      ? "#E65100"
      : marker.status === "abnormal"
        ? "#BA1A1A"
        : "#006D3E";

  // Range bar calculation
  const rangeMin = marker.refLow * 0.7 || 0;
  const rangeMax = marker.refHigh * 1.3;
  const total = rangeMax - rangeMin;
  const normalStart = ((marker.refLow - rangeMin) / total) * 100;
  const normalWidth = ((marker.refHigh - marker.refLow) / total) * 100;
  const markerPos = ((marker.value - rangeMin) / total) * 100;

  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: "#FAFDFB",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#002110", margin: 0 }}>
            {marker.plainName}
          </p>
          <p style={{ fontSize: 11, color: "#6F796F", margin: 0 }}>
            {marker.name}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#002110",
            }}
          >
            {marker.value}
          </span>
          <span style={{ fontSize: 12, color: "#6F796F" }}>{marker.unit}</span>
          {trendDir === "up" && (
            <TrendingUp size={14} style={{ color: "#E65100" }} />
          )}
          {trendDir === "down" && (
            <TrendingDown size={14} style={{ color: "#006D3E" }} />
          )}
          {trendDir === "flat" && (
            <Minus size={14} style={{ color: "#6F796F" }} />
          )}
        </div>
      </div>

      {/* Range bar */}
      <div
        style={{
          height: 8,
          borderRadius: 50,
          background: "#DAE8DE",
          position: "relative",
          marginTop: 6,
        }}
      >
        {/* Normal range highlight */}
        <div
          style={{
            position: "absolute",
            left: `${normalStart}%`,
            width: `${normalWidth}%`,
            height: "100%",
            borderRadius: 50,
            background: "#95F7B5",
          }}
        />
        {/* Marker position */}
        <div
          style={{
            position: "absolute",
            left: `${Math.min(Math.max(markerPos, 2), 98)}%`,
            top: -3,
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `7px solid ${statusColor}`,
            transform: "translateX(-5px)",
          }}
        />
      </div>
      <div className="flex justify-between" style={{ marginTop: 2 }}>
        <span style={{ fontSize: 10, color: "#6F796F" }}>{marker.refLow || 0}</span>
        <span style={{ fontSize: 10, color: "#6F796F" }}>Ref: {marker.refLow}-{marker.refHigh}</span>
        <span style={{ fontSize: 10, color: "#6F796F" }}>{marker.refHigh}</span>
      </div>
    </div>
  );
}
