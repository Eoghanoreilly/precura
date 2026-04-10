"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TestTube, Heart, MessageCircle, FileText, Shield,
  TrendingUp, AlertTriangle, ChevronRight, Pill,
  Activity, Calendar, User, Bell, Dumbbell,
  ClipboardList, Syringe, ChevronDown, ChevronUp, Droplet,
} from "lucide-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS,
  CONDITIONS, MEDICATIONS, BIOMETRICS_HISTORY,
  MESSAGES, DOCTOR_NOTES, TRAINING_PLAN,
  SCREENING_SCORES, DOCTOR_VISITS, VACCINATIONS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Smith 6: "Healthcare, but better" - A redesigned 1177 Journalen
// Swedish healthcare portal. Familiar, trustworthy, accessible.
// Healthcare blue primary (#1862a5). Large text. Clear hierarchy.
// Designed for 50-70 year olds. No learning curve.
// ============================================================================

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
  });
}

function daysUntil(d: string) {
  const diff = Math.ceil(
    (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}

// Simple trend sparkline
function MiniTrend({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values) * 0.97;
  const max = Math.max(...values) * 1.03;
  const w = 64;
  const h = 24;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const lastX = w;
  const lastY = h - ((values[values.length - 1] - min) / (max - min)) * h;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
    </svg>
  );
}

// Risk level indicator
function RiskBadge({ level, label }: { level: string; label: string }) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    low: { bg: "#ecfdf5", text: SUCCESS_GREEN, dot: SUCCESS_GREEN },
    low_moderate: { bg: "#fffbeb", text: WARNING_AMBER, dot: WARNING_AMBER },
    moderate: { bg: "#fff7ed", text: "#ea580c", dot: "#ea580c" },
    high: { bg: "#fef2f2", text: RISK_RED, dot: RISK_RED },
  };
  const c = colors[level] || colors.low;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        background: c.bg,
        color: c.text,
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: c.dot,
        }}
      />
      {label}
    </span>
  );
}

export default function Smith6Overview() {
  const [showAllConditions, setShowAllConditions] = useState(false);
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const latestBio = BIOMETRICS_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const cholesterolHistory = getMarkerHistory("TC");
  const unreadMessages = MESSAGES.filter((m) => m.from === "doctor").length;
  const nextTestDays = daysUntil(PATIENT.nextBloodTest);

  // Latest doctor note snippet
  const latestNote = DOCTOR_NOTES[0];

  return (
    <div style={{ background: WARM_BG, minHeight: "100vh" }}>
      {/* Top navigation bar - 1177 style */}
      <header
        style={{
          background: HEALTHCARE_BLUE,
          color: "white",
          padding: "0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>
                Precura
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Din halsojournal
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <Bell size={22} color="white" />
              {unreadMessages > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#ef4444",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </button>
            <Link
              href="/smith6/profil"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "white",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {PATIENT.firstName[0]}
              </div>
            </Link>
          </div>
        </div>

        {/* Section navigation tabs */}
        <nav
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: 0,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            { label: "Oversikt", href: "/smith6", active: true, icon: Activity },
            { label: "Provresultat", href: "/smith6/provresultat", active: false, icon: TestTube },
            { label: "Halsodata", href: "/smith6/halsodata", active: false, icon: ClipboardList },
            { label: "Meddelanden", href: "/smith6/meddelanden", active: false, icon: MessageCircle },
            { label: "Riskbedomning", href: "/smith6/riskbedomning", active: false, icon: Shield },
            { label: "Journal", href: "/smith6/journal", active: false, icon: FileText },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 16px",
                fontSize: 15,
                fontWeight: tab.active ? 600 : 400,
                color: "white",
                textDecoration: "none",
                whiteSpace: "nowrap",
                borderBottom: tab.active
                  ? "3px solid white"
                  : "3px solid transparent",
                opacity: tab.active ? 1 : 0.75,
                transition: "opacity 0.2s",
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 20px 80px",
        }}
      >
        {/* Welcome section */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Hej, {PATIENT.firstName}
          </h1>
          <p
            style={{
              fontSize: 16,
              color: TEXT_SECONDARY,
              margin: "6px 0 0",
              lineHeight: 1.5,
            }}
          >
            Har ar en sammanfattning av din halsa. Senast uppdaterad{" "}
            {formatDate(latestBlood.date)}.
          </p>
        </div>

        {/* Important notice / alert banner */}
        {latestNote && (
          <div
            style={{
              background: HEALTHCARE_BLUE_LIGHT,
              border: `1px solid ${HEALTHCARE_BLUE}33`,
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: HEALTHCARE_BLUE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <FileText size={20} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: HEALTHCARE_BLUE_DARK,
                  marginBottom: 4,
                }}
              >
                Ny anteckning fran din lakare
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: TEXT_SECONDARY,
                  lineHeight: 1.5,
                }}
              >
                Dr. Johansson har granskat dina provsvar fran {formatDate(latestBlood.date)}.
                {" "}
                <Link
                  href="/smith6/meddelanden"
                  style={{
                    color: HEALTHCARE_BLUE,
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Las anteckningen
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick actions grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <Link
            href="/smith6/provresultat"
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              padding: "18px 16px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transition: "box-shadow 0.2s",
            }}
            className="card-hover"
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#eef4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TestTube size={22} color={HEALTHCARE_BLUE} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>
                Provresultat
              </div>
              <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                {BLOOD_TEST_HISTORY.length} provtillfallen
              </div>
            </div>
          </Link>

          <Link
            href="/smith6/meddelanden"
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              padding: "18px 16px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transition: "box-shadow 0.2s",
            }}
            className="card-hover"
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <MessageCircle size={22} color={SUCCESS_GREEN} />
              {unreadMessages > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#ef4444",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>
                Meddelanden
              </div>
              <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                {unreadMessages} nya meddelanden
              </div>
            </div>
          </Link>

          <Link
            href="/smith6/riskbedomning"
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              padding: "18px 16px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transition: "box-shadow 0.2s",
            }}
            className="card-hover"
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={22} color={WARNING_AMBER} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>
                Riskbedomning
              </div>
              <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                3 riskprofiler
              </div>
            </div>
          </Link>

          <Link
            href="/smith6/halsodata"
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              padding: "18px 16px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transition: "box-shadow 0.2s",
            }}
            className="card-hover"
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#faf5ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClipboardList size={22} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>
                Halsodata
              </div>
              <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                Diagnoser, lakemedel, mer
              </div>
            </div>
          </Link>
        </div>

        {/* Health summary section */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Activity size={20} color={HEALTHCARE_BLUE} />
            Halsosammanfattning
          </h2>

          {/* Biometrics row */}
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              padding: "20px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: TEXT_SECONDARY,
                marginBottom: 16,
              }}
            >
              Senaste matningar ({formatShortDate(latestBio.date)})
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 4 }}>
                  Vikt
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>
                  {latestBio.weight}
                  <span style={{ fontSize: 14, fontWeight: 400, color: TEXT_MUTED }}>
                    {" "}kg
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 4 }}>
                  Blodtryck
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>
                  {latestBio.bloodPressure}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 4 }}>
                  BMI
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_PRIMARY }}>
                  {latestBio.bmi}
                </div>
              </div>
            </div>
          </div>

          {/* Key markers with trends */}
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px 12px",
                fontSize: 15,
                fontWeight: 600,
                color: TEXT_SECONDARY,
                borderBottom: `1px solid ${BORDER_COLOR}`,
              }}
            >
              Nyckelmarorer med trender
            </div>

            {[
              {
                label: "Fasteblodsocker (blood sugar, fasting)",
                shortName: "f-Glucose",
                history: glucoseHistory,
                color: WARNING_AMBER,
              },
              {
                label: "HbA1c (long-term blood sugar)",
                shortName: "HbA1c",
                history: getMarkerHistory("HbA1c"),
                color: HEALTHCARE_BLUE,
              },
              {
                label: "Totalkolesterol (total cholesterol)",
                shortName: "TC",
                history: cholesterolHistory,
                color: "#7c3aed",
              },
            ].map((marker, i) => {
              const latest = marker.history[marker.history.length - 1];
              const latestResult = latestBlood.results.find(
                (r) => r.shortName === marker.shortName
              );
              const statusColor =
                latestResult?.status === "borderline"
                  ? WARNING_AMBER
                  : latestResult?.status === "abnormal"
                  ? RISK_RED
                  : SUCCESS_GREEN;

              return (
                <div
                  key={marker.shortName}
                  style={{
                    padding: "16px 20px",
                    borderBottom:
                      i < 2 ? `1px solid ${BORDER_COLOR}` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: TEXT_PRIMARY,
                        marginBottom: 2,
                      }}
                    >
                      {marker.label}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {latest?.value}
                      </span>
                      <span style={{ fontSize: 14, color: TEXT_MUTED }}>
                        {latestResult?.unit}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: statusColor,
                          background:
                            latestResult?.status === "borderline"
                              ? "#fffbeb"
                              : latestResult?.status === "abnormal"
                              ? "#fef2f2"
                              : "#ecfdf5",
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}
                      >
                        {latestResult?.status === "borderline"
                          ? "Grans"
                          : latestResult?.status === "abnormal"
                          ? "Avvikande"
                          : "Normal"}
                      </span>
                    </div>
                  </div>
                  <MiniTrend
                    values={marker.history.map((h) => h.value)}
                    color={marker.color}
                  />
                </div>
              );
            })}

            <Link
              href="/smith6/provresultat"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 600,
                color: HEALTHCARE_BLUE,
                textDecoration: "none",
                borderTop: `1px solid ${BORDER_COLOR}`,
                background: "#f8fafc",
              }}
            >
              Se alla provresultat
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* Risk overview */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Shield size={20} color={HEALTHCARE_BLUE} />
            Riskbedomning
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              {
                title: "Diabetes (type 2)",
                risk: RISK_ASSESSMENTS.diabetes,
                icon: <Droplet size={20} color="#ea580c" />,
              },
              {
                title: "Hjart- och karlsjukdom (cardiovascular disease)",
                risk: RISK_ASSESSMENTS.cardiovascular,
                icon: <Heart size={20} color={WARNING_AMBER} />,
              },
              {
                title: "Benhalsa (bone health)",
                risk: RISK_ASSESSMENTS.bone,
                icon: <Activity size={20} color={SUCCESS_GREEN} />,
              },
            ].map((item, i) => (
              <div
                key={item.title}
                style={{
                  padding: "18px 20px",
                  borderBottom:
                    i < 2 ? `1px solid ${BORDER_COLOR}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 14 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background:
                        item.risk.riskLevel === "moderate"
                          ? "#fff7ed"
                          : item.risk.riskLevel === "low_moderate"
                          ? "#fffbeb"
                          : "#ecfdf5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </div>
                    <RiskBadge
                      level={item.risk.riskLevel}
                      label={item.risk.riskLabel}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {item.risk.trend === "worsening" && (
                    <TrendingUp size={16} color="#ea580c" />
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      color: TEXT_MUTED,
                    }}
                  >
                    {item.risk.tenYearRisk}
                  </span>
                </div>
              </div>
            ))}

            <Link
              href="/smith6/riskbedomning"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 600,
                color: HEALTHCARE_BLUE,
                textDecoration: "none",
                borderTop: `1px solid ${BORDER_COLOR}`,
                background: "#f8fafc",
              }}
            >
              Se fullstandig riskbedomning
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* Active conditions and medications */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Pill size={20} color={HEALTHCARE_BLUE} />
            Aktiva diagnoser och lakemedel
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Conditions */}
            <div
              style={{
                padding: "16px 20px 8px",
                fontSize: 13,
                fontWeight: 600,
                color: TEXT_MUTED,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
              }}
            >
              Diagnoser
            </div>
            {CONDITIONS.filter((c) => c.status === "active").map((c, i) => (
              <div
                key={c.name}
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                    Sedan {formatDate(c.diagnosedDate)}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: SUCCESS_GREEN,
                    background: "#ecfdf5",
                    padding: "3px 10px",
                    borderRadius: 10,
                  }}
                >
                  Aktiv
                </span>
              </div>
            ))}

            <div
              style={{
                borderTop: `1px solid ${BORDER_COLOR}`,
                padding: "16px 20px 8px",
                fontSize: 13,
                fontWeight: 600,
                color: TEXT_MUTED,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
              }}
            >
              Lakemedel
            </div>
            {MEDICATIONS.filter((m) => m.active).map((m) => (
              <div
                key={m.name}
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {m.name} {m.dose}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                    {m.frequency} - {m.purpose}
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/smith6/halsodata"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 600,
                color: HEALTHCARE_BLUE,
                textDecoration: "none",
                borderTop: `1px solid ${BORDER_COLOR}`,
                background: "#f8fafc",
              }}
            >
              Se all halsodata
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* Training plan summary */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Dumbbell size={20} color={HEALTHCARE_BLUE} />
            Traningsplan
          </h2>

          <div
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
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
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
                  {TRAINING_PLAN.name}
                </div>
                <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 2 }}>
                  Av {TRAINING_PLAN.createdBy}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: HEALTHCARE_BLUE,
                  background: HEALTHCARE_BLUE_LIGHT,
                  padding: "4px 12px",
                  borderRadius: 10,
                }}
              >
                Vecka {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: TEXT_MUTED,
                  marginBottom: 6,
                }}
              >
                <span>Framsteg denna vecka</span>
                <span>
                  {TRAINING_PLAN.completedThisWeek}/
                  {TRAINING_PLAN.weeklySchedule.length} pass
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "#f1f5f9",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${
                      (TRAINING_PLAN.completedThisWeek /
                        TRAINING_PLAN.weeklySchedule.length) *
                      100
                    }%`,
                    background: `linear-gradient(90deg, ${HEALTHCARE_BLUE}, ${HEALTHCARE_BLUE_DARK})`,
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* This week's schedule */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TRAINING_PLAN.weeklySchedule.map((day, i) => (
                <div
                  key={day.day}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background:
                      i < TRAINING_PLAN.completedThisWeek
                        ? "#ecfdf5"
                        : "#f8fafc",
                    border: `1px solid ${
                      i < TRAINING_PLAN.completedThisWeek
                        ? "#bbf7d0"
                        : BORDER_COLOR
                    }`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background:
                          i < TRAINING_PLAN.completedThisWeek
                            ? SUCCESS_GREEN
                            : "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 600,
                        color:
                          i < TRAINING_PLAN.completedThisWeek
                            ? "white"
                            : TEXT_MUTED,
                      }}
                    >
                      {i < TRAINING_PLAN.completedThisWeek ? "✓" : i + 1}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {day.day} - {day.name}
                      </div>
                      <div style={{ fontSize: 13, color: TEXT_MUTED }}>
                        {day.exercises.length} ovningar
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calendar size={20} color={HEALTHCARE_BLUE} />
            Kommande
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderBottom: `1px solid ${BORDER_COLOR}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: HEALTHCARE_BLUE_LIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <TestTube size={22} color={HEALTHCARE_BLUE} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                  }}
                >
                  Nasta blodprov
                </div>
                <div style={{ fontSize: 15, color: TEXT_SECONDARY }}>
                  {formatDate(PATIENT.nextBloodTest)}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: HEALTHCARE_BLUE,
                  background: HEALTHCARE_BLUE_LIGHT,
                  padding: "4px 12px",
                  borderRadius: 10,
                }}
              >
                Om {nextTestDays} dagar
              </div>
            </div>

            <div
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Dumbbell size={22} color={SUCCESS_GREEN} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                  }}
                >
                  Traningsplan avslutas
                </div>
                <div style={{ fontSize: 15, color: TEXT_SECONDARY }}>
                  Vecka {TRAINING_PLAN.totalWeeks} -{" "}
                  {TRAINING_PLAN.totalWeeks - TRAINING_PLAN.currentWeek} veckor
                  kvar
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent visit history */}
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FileText size={20} color={HEALTHCARE_BLUE} />
            Senaste besok
          </h2>

          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {DOCTOR_VISITS.slice(0, 3).map((visit, i) => (
              <div
                key={visit.date}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    i < 2 ? `1px solid ${BORDER_COLOR}` : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {visit.type}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED }}>
                    {formatDate(visit.date)}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: TEXT_SECONDARY }}>
                  {visit.provider}
                </div>
              </div>
            ))}

            <Link
              href="/smith6/journal"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 600,
                color: HEALTHCARE_BLUE,
                textDecoration: "none",
                borderTop: `1px solid ${BORDER_COLOR}`,
                background: "#f8fafc",
              }}
            >
              Se hela journalen
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center" as const,
            padding: "24px 0",
            fontSize: 13,
            color: TEXT_MUTED,
            lineHeight: 1.6,
          }}
        >
          <div>Precura AB - Organisationsnummer 559XXX-XXXX</div>
          <div>
            {PATIENT.vardcentral} | Medlem sedan{" "}
            {formatDate(PATIENT.memberSince)}
          </div>
        </footer>
      </main>
    </div>
  );
}
