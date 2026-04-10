"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  DOCTOR_VISITS,
  DOCTOR_NOTES,
  BIOMETRICS_HISTORY,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Health History
// Blood tests, doctor visits, clinical notes - the full 5-year picture.
// This is the data that tells Anna's story.
// ============================================================================

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SE", {
    month: "short",
    year: "numeric",
  });
}

function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "normal":
      return { bg: "#E8F5E9", text: "#7FA876" };
    case "borderline":
      return { bg: "#FFF3E0", text: "#E8A856" };
    case "abnormal":
      return { bg: "#FFEBEE", text: "#D45C5C" };
    default:
      return { bg: "#F5F1E8", text: "#6B5D52" };
  }
}

type TabType = "blood" | "visits" | "trends";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("blood");
  const [expandedTest, setExpandedTest] = useState<number | null>(0);

  const glucoseHistory = getMarkerHistory("f-Glucose");
  const cholesterolHistory = getMarkerHistory("TC");
  const hba1cHistory = getMarkerHistory("HbA1c");

  const tabs: { key: TabType; label: string }[] = [
    { key: "blood", label: "Blood tests" },
    { key: "visits", label: "Visits" },
    { key: "trends", label: "Trends" },
  ];

  return (
    <div
      style={{
        background: "#F5F1E8",
        color: "#2C2416",
        minHeight: "100dvh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#F5F1E8",
          borderBottom: "1px solid #E8DFD3",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "14px 20px",
          }}
        >
          <Link
            href="/smith2"
            style={{
              textDecoration: "none",
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            &lsaquo; Home
          </Link>
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 16,
              fontWeight: 700,
              color: "#2C2416",
            }}
          >
            Precura
          </span>
          <div style={{ width: 40 }} />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {/* Page title */}
        <div style={{ paddingTop: 24, paddingBottom: 4 }}>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 24,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Your Health History
          </h1>
          <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 4 }}>
            {BLOOD_TEST_HISTORY.length} blood tests, {DOCTOR_VISITS.length} visits over 5 years
          </p>
        </div>

        {/* Tab navigation */}
        <div
          className="flex"
          style={{
            gap: 0,
            marginTop: 16,
            background: "#FBF9F6",
            borderRadius: 8,
            border: "1px solid #E8DFD3",
            padding: 3,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === tab.key ? "#FBF9F6" : "#6B5D52",
                background: activeTab === tab.key ? "#2C2416" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================================================================
            BLOOD TESTS TAB
            ================================================================ */}
        {activeTab === "blood" && (
          <div style={{ marginTop: 16 }}>
            {BLOOD_TEST_HISTORY.map((session, sessionIndex) => {
              const isExpanded = expandedTest === sessionIndex;
              const isPrecura = session.orderedBy.includes("Precura");

              return (
                <div
                  key={sessionIndex}
                  style={{
                    background: "#FBF9F6",
                    border: "1px solid #E8DFD3",
                    borderRadius: 8,
                    marginBottom: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  {/* Session header - clickable */}
                  <button
                    onClick={() =>
                      setExpandedTest(isExpanded ? null : sessionIndex)
                    }
                    className="flex items-center justify-between"
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left" as const,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    <div>
                      <div className="flex items-center" style={{ gap: 8 }}>
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#2C2416",
                            margin: 0,
                          }}
                        >
                          {formatDate(session.date)}
                        </p>
                        {isPrecura && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              background: "#C97D5C",
                              color: "#FBF9F6",
                              padding: "1px 6px",
                              borderRadius: 3,
                            }}
                          >
                            PRECURA
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6B5D52",
                          margin: 0,
                          marginTop: 2,
                        }}
                      >
                        {session.orderedBy} - {session.results.length} markers
                      </p>
                    </div>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      {/* Status badges */}
                      {session.results.some((r) => r.status === "borderline") && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: "#FFF3E0",
                            color: "#E8A856",
                            padding: "2px 6px",
                            borderRadius: 3,
                          }}
                        >
                          {session.results.filter((r) => r.status === "borderline").length} borderline
                        </span>
                      )}
                      <span
                        style={{
                          color: "#6B5D52",
                          fontSize: 16,
                          transform: isExpanded ? "rotate(90deg)" : "none",
                          transition: "transform 0.2s ease",
                          display: "inline-block",
                        }}
                      >
                        &rsaquo;
                      </span>
                    </div>
                  </button>

                  {/* Expanded results */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 20px 16px",
                        borderTop: "1px solid #E8DFD3",
                      }}
                    >
                      {/* Find any matching doctor note */}
                      {DOCTOR_NOTES.filter((n) => n.date === session.date).map(
                        (note, ni) => (
                          <div
                            key={ni}
                            style={{
                              background: "#F5F1E8",
                              borderRadius: 6,
                              padding: "12px 14px",
                              marginTop: 14,
                              marginBottom: 14,
                            }}
                          >
                            <div
                              className="flex items-center"
                              style={{ gap: 8, marginBottom: 8 }}
                            >
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#FBF9F6",
                                  fontSize: 9,
                                  fontWeight: 600,
                                }}
                              >
                                MJ
                              </div>
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "#2C2416",
                                }}
                              >
                                Dr. Johansson's note
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: 13,
                                lineHeight: 1.55,
                                color: "#2C2416",
                                margin: 0,
                                whiteSpace: "pre-line" as const,
                              }}
                            >
                              {note.note}
                            </p>
                          </div>
                        )
                      )}

                      {/* Lab info */}
                      <p
                        style={{
                          fontSize: 11,
                          color: "#6B5D52",
                          margin: 0,
                          marginTop: 14,
                          marginBottom: 10,
                        }}
                      >
                        Lab: {session.lab}
                      </p>

                      {/* Results table */}
                      <div className="flex flex-col" style={{ gap: 8 }}>
                        {session.results.map((marker) => {
                          const colors = statusColor(marker.status);
                          return (
                            <div
                              key={marker.shortName}
                              className="flex items-center justify-between"
                              style={{
                                padding: "8px 0",
                                borderBottom: "1px solid #E8DFD3",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#2C2416",
                                    margin: 0,
                                  }}
                                >
                                  {marker.plainName}
                                </p>
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: "#6B5D52",
                                    margin: 0,
                                    marginTop: 1,
                                  }}
                                >
                                  {marker.name} - ref: {marker.refLow}-{marker.refHigh}{" "}
                                  {marker.unit}
                                </p>
                              </div>
                              <div className="flex items-center" style={{ gap: 8 }}>
                                <span
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "#2C2416",
                                  }}
                                >
                                  {marker.value}
                                </span>
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: colors.bg,
                                    color: colors.text,
                                    padding: "2px 6px",
                                    borderRadius: 3,
                                  }}
                                >
                                  {marker.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================
            VISITS TAB
            ================================================================ */}
        {activeTab === "visits" && (
          <div style={{ marginTop: 16 }}>
            {DOCTOR_VISITS.map((visit, i) => {
              const isPrecura = visit.provider.includes("Precura");
              return (
                <div
                  key={i}
                  style={{
                    background: "#FBF9F6",
                    border: "1px solid #E8DFD3",
                    borderRadius: 8,
                    padding: "16px 20px",
                    marginBottom: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between" style={{ marginBottom: 6 }}>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                        {visit.type}
                      </p>
                      {isPrecura && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: "#C97D5C",
                            color: "#FBF9F6",
                            padding: "1px 6px",
                            borderRadius: 3,
                          }}
                        >
                          PRECURA
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, flexShrink: 0 }}>
                      {formatDate(visit.date)}
                    </p>
                  </div>
                  <p style={{ fontSize: 12, color: "#C97D5C", margin: 0, marginBottom: 6, fontWeight: 600 }}>
                    {visit.provider}
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: "#6B5D52", margin: 0 }}>
                    {visit.summary}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================
            TRENDS TAB - Key markers over time
            ================================================================ */}
        {activeTab === "trends" && (
          <div style={{ marginTop: 16 }}>
            {/* The whole point of Precura: seeing the trajectory */}
            <div
              style={{
                background: "#FBF9F6",
                border: "1px solid #E8DFD3",
                borderRadius: 8,
                padding: "20px",
                marginBottom: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center" style={{ gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FBF9F6",
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  MJ
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#2C2416", margin: 0 }}>
                  "Each individual test looked normal. But the pattern tells a different story."
                  - Dr. Johansson
                </p>
              </div>
            </div>

            {/* Glucose trend */}
            <TrendCard
              title="Fasting Glucose (blood sugar)"
              unit="mmol/L"
              data={glucoseHistory}
              refLow={3.9}
              refHigh={6.0}
              warningThreshold={5.6}
              insight="Rising steadily from 5.0 to 5.8 over 5 years. Approaching the pre-diabetic threshold of 6.1."
            />

            {/* Cholesterol trend */}
            <TrendCard
              title="Total Cholesterol"
              unit="mmol/L"
              data={cholesterolHistory}
              refLow={3.0}
              refHigh={5.0}
              warningThreshold={5.0}
              insight="Gradually increasing. Now borderline at 5.1, above the 5.0 recommended maximum."
            />

            {/* HbA1c trend */}
            <TrendCard
              title="HbA1c (long-term blood sugar)"
              unit="mmol/mol"
              data={hba1cHistory}
              refLow={20}
              refHigh={42}
              warningThreshold={38}
              insight="Normal at 38, but approaching the pre-diabetic threshold of 42. Tracks with the glucose trend."
            />
          </div>
        )}

        {/* Bottom nav back */}
        <div style={{ marginTop: 32, textAlign: "center" as const }}>
          <Link
            href="/smith2"
            style={{
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            &lsaquo; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Trend Card Component
// Inline bar chart showing a marker's progression over time
// ============================================================================

function TrendCard({
  title,
  unit,
  data,
  refLow,
  refHigh,
  warningThreshold,
  insight,
}: {
  title: string;
  unit: string;
  data: { date: string; value: number }[];
  refLow: number;
  refHigh: number;
  warningThreshold: number;
  insight: string;
}) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const first = data[0];
  const change = latest.value - first.value;
  const isRising = change > 0;

  // For bar heights
  const allValues = data.map((d) => d.value);
  const minVal = Math.min(...allValues, refLow) * 0.95;
  const maxVal = Math.max(...allValues, refHigh) * 1.05;

  return (
    <div
      style={{
        background: "#FBF9F6",
        border: "1px solid #E8DFD3",
        borderRadius: 8,
        padding: "18px 20px",
        marginBottom: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2 }}>
            {data.length} measurements over {Math.round(
              (new Date(latest.date).getTime() - new Date(first.date).getTime()) /
                (1000 * 60 * 60 * 24 * 365)
            )} years
          </p>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <p
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 22,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {latest.value}
          </p>
          <p style={{ fontSize: 11, color: "#6B5D52", margin: 0, marginTop: 2 }}>
            {unit}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div
        className="flex items-end"
        style={{
          gap: 4,
          height: 80,
          marginBottom: 8,
          position: "relative",
        }}
      >
        {/* Warning threshold line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `${((warningThreshold - minVal) / (maxVal - minVal)) * 100}%`,
            borderTop: "1px dashed #E8A856",
            zIndex: 1,
          }}
        >
          <span
            style={{
              position: "absolute",
              right: 0,
              top: -14,
              fontSize: 9,
              color: "#E8A856",
              fontWeight: 600,
            }}
          >
            {warningThreshold}
          </span>
        </div>

        {data.map((point, i) => {
          const heightPct = ((point.value - minVal) / (maxVal - minVal)) * 100;
          const isLast = i === data.length - 1;
          const isAboveWarning = point.value >= warningThreshold;

          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ flex: 1 }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 32,
                  height: `${Math.max(heightPct, 5)}%`,
                  background: isLast
                    ? isAboveWarning
                      ? "#E8A856"
                      : "#7FA876"
                    : isAboveWarning
                    ? "rgba(232, 168, 86, 0.35)"
                    : "#E8DFD3",
                  borderRadius: "3px 3px 0 0",
                  transition: "height 0.4s ease",
                  position: "relative",
                }}
              >
                {/* Value label on top */}
                <span
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    fontWeight: isLast ? 700 : 400,
                    color: isLast
                      ? isAboveWarning
                        ? "#E8A856"
                        : "#7FA876"
                      : "#6B5D52",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {point.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Date labels */}
      <div className="flex" style={{ gap: 4 }}>
        {data.map((point, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center" as const,
              fontSize: 9,
              color: "#6B5D52",
            }}
          >
            {new Date(point.date).getFullYear().toString().slice(2)}
          </div>
        ))}
      </div>

      {/* Change indicator */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid #E8DFD3",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: isRising ? "#E8A856" : "#7FA876",
          }}
        >
          {isRising ? "+" : ""}{change.toFixed(1)} {unit} change
        </span>
        <span style={{ fontSize: 11, color: "#6B5D52" }}>
          ref: {refLow}-{refHigh}
        </span>
      </div>

      {/* Insight */}
      <p style={{ fontSize: 13, lineHeight: 1.5, color: "#6B5D52", margin: 0, marginTop: 8 }}>
        {insight}
      </p>
    </div>
  );
}
