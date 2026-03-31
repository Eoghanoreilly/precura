"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  AlertTriangle,
  TestTube,
  Dumbbell,
  CheckCircle2,
  Circle,
  MessageSquare,
  Search,
  Home,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  SCREENING_SCORES,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
  MESSAGES,
  TRAINING_PLAN,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  if (diffD < 7) return `${diffD}d ago`;
  return formatDate(iso);
}

// ---------------------------------------------------------------------------
// Zone bar component (shared across risk rows)
// ---------------------------------------------------------------------------

function ZoneBar({
  level,
  zones,
}: {
  level: string;
  zones: { key: string; color: string }[];
}) {
  const idx = zones.findIndex((z) => z.key === level);
  const segCount = zones.length;
  const markerPct = idx >= 0 ? ((idx + 0.5) / segCount) * 100 : 10;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className="flex rounded-full overflow-hidden"
        style={{ height: 6, gap: 1 }}
      >
        {zones.map((z, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: z.color,
              borderRadius:
                i === 0
                  ? "3px 0 0 3px"
                  : i === segCount - 1
                  ? "0 3px 3px 0"
                  : 0,
            }}
          />
        ))}
      </div>
      {/* Marker dot */}
      <div
        style={{
          position: "absolute",
          left: `${markerPct}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#fff",
          border: `2px solid ${zones[Math.max(idx, 0)]?.color || "var(--text-muted)"}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Risk row inside health overview card
// ---------------------------------------------------------------------------

const RISK_ZONES_4 = [
  { key: "low", color: "var(--green)" },
  { key: "low_moderate", color: "var(--teal)" },
  { key: "moderate", color: "var(--amber)" },
  { key: "high", color: "var(--red)" },
];

function riskStyle(level: string): { color: string; bg: string } {
  switch (level) {
    case "low":
      return { color: "var(--green-text)", bg: "var(--green-bg)" };
    case "low_moderate":
      return { color: "var(--teal-text)", bg: "var(--teal-bg)" };
    case "moderate":
      return { color: "var(--amber-text)", bg: "var(--amber-bg)" };
    case "high":
      return { color: "var(--red-text)", bg: "var(--red-bg)" };
    default:
      return { color: "var(--text-muted)", bg: "var(--bg-elevated)" };
  }
}

function trendLabel(trend: string): string {
  switch (trend) {
    case "worsening":
      return "trending up";
    case "improving":
      return "trending down";
    default:
      return "stable";
  }
}

function RiskRow({
  label,
  riskLevel,
  riskLabel,
  trend,
  showZoneBar,
  subtitle,
}: {
  label: string;
  riskLevel: string;
  riskLabel: string;
  trend?: string;
  showZoneBar?: boolean;
  subtitle?: string;
}) {
  const style = riskStyle(riskLevel);
  const desc = subtitle
    ? subtitle
    : `${riskLabel} - ${trend ? trendLabel(trend) : "stable"}`;

  return (
    <Link href="/v2/health">
      <div
        className="flex items-center gap-3 px-4 py-3 card-hover"
        style={{ cursor: "pointer" }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            {label}
          </p>
          {showZoneBar && (
            <div className="mt-1.5 mb-1" style={{ maxWidth: 160 }}>
              <ZoneBar level={riskLevel} zones={RISK_ZONES_4} />
            </div>
          )}
          <p className="text-xs" style={{ color: style.color }}>
            {desc}
          </p>
        </div>
        <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Bottom nav (v2 routes)
// ---------------------------------------------------------------------------

const NAV_TABS = [
  { href: "/v2/dashboard", label: "Home", icon: Home },
  { href: "/v2/health", label: "Health", icon: Heart },
  { href: "/v2/chat", label: "Chat", icon: MessageCircle },
  { href: "/v2/profile", label: "You", icon: User },
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 safe-bottom"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto py-1.5">
        {NAV_TABS.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/v2/dashboard" &&
              pathname?.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
              }}
            >
              <tab.icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                style={{
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------

export default function DashboardV2Page() {
  const [chatInput, setChatInput] = useState("");

  // Derived data
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const normalCount = latestBlood.results.filter(
    (r) => r.status === "normal"
  ).length;
  const borderlineCount = latestBlood.results.filter(
    (r) => r.status === "borderline"
  ).length;
  const totalMarkers = latestBlood.results.length;
  const borderlineNames = latestBlood.results
    .filter((r) => r.status === "borderline")
    .map((r) => r.plainName.toLowerCase());

  const lastDoctorMsg = [...MESSAGES]
    .filter((m) => m.from === "doctor")
    .pop();

  const glucoseHistory = getMarkerHistory("f-Glucose");
  const glucoseYears =
    glucoseHistory.length > 1
      ? new Date(glucoseHistory[glucoseHistory.length - 1].date).getFullYear() -
        new Date(glucoseHistory[0].date).getFullYear()
      : 0;

  const allRiskLevels = [
    RISK_ASSESSMENTS.diabetes.riskLevel as string,
    RISK_ASSESSMENTS.cardiovascular.riskLevel as string,
    RISK_ASSESSMENTS.bone.riskLevel as string,
  ];
  const areasToWatch = allRiskLevels.filter(
    (l) => l === "moderate" || l === "high"
  ).length;
  const urgentCount = allRiskLevels.filter((l) => l === "high").length;

  const progressMetrics = TRAINING_PLAN.progressMetrics;

  const chips = [
    "Why is my glucose rising?",
    "Explain my blood results",
    "Am I at risk for diabetes?",
  ];

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <main className="flex-1 px-5 pt-8 pb-28 max-w-md mx-auto w-full">
        {/* ------------------------------------------------------------ */}
        {/* 1. Greeting                                                   */}
        {/* ------------------------------------------------------------ */}
        <div className="animate-fade-in mb-1">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            {getGreeting()}, {PATIENT.firstName}
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 2. Membership pill                                            */}
        {/* ------------------------------------------------------------ */}
        <div className="animate-fade-in stagger-1 flex items-center gap-2 mt-4 mb-6" style={{ opacity: 0 }}>
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
            }}
          >
            Precura Member
          </span>
          <span
            className="text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            Next blood test: {formatDate(PATIENT.nextBloodTest)}
          </span>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 3. Health Overview Card (hero)                                */}
        {/* ------------------------------------------------------------ */}
        <div
          className="animate-fade-in stagger-2 rounded-2xl mb-4 overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            opacity: 0,
          }}
        >
          <div className="px-4 pt-4 pb-2">
            <h2
              className="text-sm font-bold"
              style={{ color: "var(--text)" }}
            >
              Your health overview
            </h2>
          </div>

          {/* Risk rows */}
          <div>
            <div style={{ borderBottom: "1px solid var(--divider)" }}>
              <RiskRow
                label="Diabetes"
                riskLevel={RISK_ASSESSMENTS.diabetes.riskLevel}
                riskLabel={RISK_ASSESSMENTS.diabetes.riskLabel}
                trend={RISK_ASSESSMENTS.diabetes.trend}
                showZoneBar
              />
            </div>
            <div style={{ borderBottom: "1px solid var(--divider)" }}>
              <RiskRow
                label="Heart"
                riskLevel={RISK_ASSESSMENTS.cardiovascular.riskLevel}
                riskLabel={RISK_ASSESSMENTS.cardiovascular.riskLabel}
                trend={RISK_ASSESSMENTS.cardiovascular.trend}
                showZoneBar
              />
            </div>
            <div style={{ borderBottom: "1px solid var(--divider)" }}>
              <RiskRow
                label="Bone"
                riskLevel={RISK_ASSESSMENTS.bone.riskLevel}
                riskLabel={RISK_ASSESSMENTS.bone.riskLabel}
                trend={RISK_ASSESSMENTS.bone.trend}
                showZoneBar
              />
            </div>
            <div>
              <RiskRow
                label="Mental"
                riskLevel="low"
                riskLabel="Minimal"
                subtitle={`PHQ-9: ${SCREENING_SCORES.phq9.score} - ${SCREENING_SCORES.phq9.level}`}
              />
            </div>
          </div>

          {/* Summary line */}
          <div
            className="px-4 py-3 text-xs font-medium"
            style={{
              borderTop: "1px solid var(--divider)",
              color: "var(--text-secondary)",
            }}
          >
            {areasToWatch} area{areasToWatch !== 1 ? "s" : ""} to watch.{" "}
            {urgentCount} urgent.
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 4. Attention Banner                                           */}
        {/* ------------------------------------------------------------ */}
        <Link href="/v2/health">
          <div
            className="animate-fade-in stagger-2 card-hover rounded-2xl p-4 mb-4 flex items-start gap-3"
            style={{
              background: "var(--amber-bg)",
              border: "1px solid #ffe0b2",
              boxShadow: "var(--shadow-sm)",
              opacity: 0,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "rgba(255,255,255,0.7)" }}
            >
              <AlertTriangle
                size={16}
                style={{ color: "var(--amber-text)" }}
              />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--amber-text)" }}
              >
                Your fasting glucose has been rising for {glucoseYears} years.
              </p>
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{ color: "var(--amber-text)", opacity: 0.85 }}
              >
                Dr. Johansson recommends monitoring closely.
              </p>
            </div>
            <ChevronRight
              size={16}
              className="shrink-0 mt-1"
              style={{ color: "var(--amber-text)", opacity: 0.5 }}
            />
          </div>
        </Link>

        {/* ------------------------------------------------------------ */}
        {/* 5. Recent Blood Results                                       */}
        {/* ------------------------------------------------------------ */}
        <Link href="/v2/blood-tests/results">
          <div
            className="animate-fade-in stagger-3 card-hover rounded-2xl p-4 mb-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--teal-bg)" }}
              >
                <TestTube size={18} style={{ color: "var(--teal)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Blood Test - {formatDate(latestBlood.date)}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {normalCount}/{totalMarkers} normal
                  {borderlineCount > 0 && (
                    <>
                      , {borderlineCount} borderline (
                      {borderlineNames.join(", ")})
                    </>
                  )}
                </p>
                <p
                  className="text-[11px] mt-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  Reviewed by Dr. Johansson
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "var(--text-faint)" }}
              />
            </div>
          </div>
        </Link>

        {/* ------------------------------------------------------------ */}
        {/* 6. Messages - latest doctor message                           */}
        {/* ------------------------------------------------------------ */}
        {lastDoctorMsg && (
          <Link href="/v2/doctor">
            <div
              className="animate-fade-in stagger-3 card-hover rounded-2xl p-4 mb-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                opacity: 0,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Doctor avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                  }}
                >
                  MJ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Dr. Johansson
                    </p>
                    <span
                      className="text-[10px] shrink-0"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {relativeTime(lastDoctorMsg.date)}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{
                      color: "var(--text-secondary)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {lastDoctorMsg.text}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="shrink-0 mt-1"
                  style={{ color: "var(--text-faint)" }}
                />
              </div>
            </div>
          </Link>
        )}

        {/* ------------------------------------------------------------ */}
        {/* 7. Training Plan Progress                                     */}
        {/* ------------------------------------------------------------ */}
        <Link href="/v2/training">
          <div
            className="animate-fade-in stagger-4 card-hover rounded-2xl p-4 mb-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--purple-bg)" }}
              >
                <Dumbbell size={18} style={{ color: "var(--purple)" }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {TRAINING_PLAN.name}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  This week
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "var(--text-faint)" }}
              />
            </div>

            {/* Progress bars */}
            <div className="flex flex-col gap-2.5">
              {progressMetrics.map((m, i) => {
                const pct = Math.min(
                  (m.current / m.target) * 100,
                  100
                );
                const label =
                  m.metric === "Weekly active minutes"
                    ? `${m.current}/${m.target} active min`
                    : m.metric === "Daily steps average"
                    ? `${m.current.toLocaleString()}/${m.target.toLocaleString()} steps`
                    : `${m.current}/${m.target} strength`;
                return (
                  <div key={i}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[10px] font-semibold"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: 5,
                        background: "var(--bg-elevated)",
                      }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            pct >= 100
                              ? "var(--green)"
                              : pct >= 60
                              ? "var(--accent)"
                              : "var(--amber)",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Link>

        {/* ------------------------------------------------------------ */}
        {/* 8. Actions - tracked next steps                               */}
        {/* ------------------------------------------------------------ */}
        <div
          className="animate-fade-in stagger-4 mb-4"
          style={{ opacity: 0 }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
            style={{ color: "var(--text-muted)" }}
          >
            Next steps
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {[
              {
                text: "Retest blood panel in Sep 2026",
                done: false,
              },
              {
                text: "Start Vitamin D3 supplement",
                done: false,
              },
              {
                text: "Increase daily steps to 8,000",
                done: false,
              },
            ].map((action, i, arr) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom:
                    i < arr.length - 1
                      ? "1px solid var(--divider)"
                      : "none",
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: action.done
                      ? "var(--green-bg)"
                      : "var(--bg-elevated)",
                  }}
                >
                  {action.done ? (
                    <CheckCircle2
                      size={14}
                      style={{ color: "var(--green)" }}
                    />
                  ) : (
                    <Circle
                      size={14}
                      style={{ color: "var(--text-faint)" }}
                    />
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: action.done
                      ? "var(--text-muted)"
                      : "var(--text)",
                    textDecoration: action.done
                      ? "line-through"
                      : "none",
                  }}
                >
                  {action.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 9. AI Chat bar                                                */}
        {/* ------------------------------------------------------------ */}
        <div
          className="animate-fade-in stagger-5"
          style={{ opacity: 0 }}
        >
          <Link href="/v2/chat">
            <div
              className="card-hover rounded-2xl p-4 mb-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--purple-bg)" }}
                >
                  <Search
                    size={18}
                    style={{ color: "var(--purple)" }}
                  />
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ask about your health...
                </span>
              </div>
            </div>
          </Link>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Link
                key={chip}
                href="/v2/chat"
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------ */}
      {/* 10. Bottom Nav                                                 */}
      {/* ------------------------------------------------------------ */}
      <BottomNav />
    </div>
  );
}
