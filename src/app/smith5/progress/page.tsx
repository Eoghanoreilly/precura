"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  TrendingDown,
  TrendingUp,
  Minus,
  Shield,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Star,
  Sparkles,
  Clock,
  Dumbbell,
} from "lucide-react";
import {
  PATIENT,
  FAMILY_HISTORY,
  TRAINING_PLAN,
  BIOMETRICS_HISTORY,
  RISK_ASSESSMENTS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

const PURPLE = {
  deep: "#4a148c",
  primary: "#6a1b9a",
  mid: "#8e24aa",
  light: "#ce93d8",
  pale: "#f3e5f5",
  wash: "#faf5ff",
  accent: "#7c4dff",
};

// Score card - how much is Anna diverging from family pattern
const PATTERN_SCORE = {
  overall: 62, // out of 100, where 100 = fully breaking the pattern
  label: "Breaking away",
  change: "+8 since joining Precura",
  details: "Based on your current trajectory vs. family health pattern. Higher means further from the family pattern.",
};

// Progress markers - concrete comparisons
const PROGRESS_MARKERS = [
  {
    name: "Blood pressure treatment",
    icon: Shield,
    familyComparison: "Your father was first treated at 50. You started at 37.",
    yourStatus: "13 years earlier than Pappa",
    breaking: true,
    impact: "This early intervention is already protecting your heart and blood vessels - exactly what your father didn't have.",
  },
  {
    name: "Blood sugar awareness",
    icon: AlertTriangle,
    familyComparison: "Your mum had no idea her glucose was rising. You are tracking it at 40.",
    yourStatus: "Catching it 18 years earlier",
    breaking: true,
    impact: "Awareness is the first step. Your mum was diagnosed at 58 with no warning. You already know the trend at 40 and are taking action.",
  },
  {
    name: "Glucose trend",
    icon: TrendingUp,
    familyComparison: "Rising at +0.16/year. At this rate, you would reach pre-diabetic levels around age 47.",
    yourStatus: "Trend not yet reversed",
    breaking: false,
    impact: "This is the main number to change. Your training plan and diet changes aim to flatten or reverse this rise. Next test in September will show if it is working.",
  },
  {
    name: "Active training program",
    icon: Dumbbell,
    familyComparison: "No family members had structured exercise programs before their diagnoses.",
    yourStatus: "28 sessions completed",
    breaking: true,
    impact: "You are doing what nobody in your family did: proactively training to improve metabolic health. 150 min/week of exercise reduces diabetes risk by 30-50%.",
  },
  {
    name: "Weight stability",
    icon: Minus,
    familyComparison: "BMI 27.6 - below the obesity threshold that increases diabetes risk dramatically.",
    yourStatus: "Holding steady at 78kg",
    breaking: true,
    impact: "Your mother's BMI was reportedly above 30 before diagnosis. Maintaining yours below 28 is a significant pattern break. Even losing 3-4kg would amplify the benefit.",
  },
  {
    name: "Cholesterol monitoring",
    icon: Heart,
    familyComparison: "Your grandfather wasn't checked until 60. Total cholesterol 5.1 - borderline but HDL is healthy.",
    yourStatus: "Tracked 20 years earlier",
    breaking: true,
    impact: "Good HDL (1.6) is protective. Total cholesterol is marginally high but the balance is good. Regular monitoring means no surprises.",
  },
];

function PatternScoreRing() {
  const score = PATTERN_SCORE.overall;
  const circumference = 2 * Math.PI * 55;
  const offset = circumference * (1 - score / 100);

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "200ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          textAlign: "center",
        }}
      >
        {/* Score ring */}
        <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 16px" }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r="55"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="70"
              cy="70"
              r="55"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dashoffset 1.5s ease" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={PURPLE.primary} />
                <stop offset="100%" stopColor="#4caf50" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 800, color: PURPLE.deep }}>{score}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>/ 100</div>
          </div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {PATTERN_SCORE.label}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 12px",
            borderRadius: 20,
            background: "#e8f5e9",
            fontSize: 12,
            fontWeight: 600,
            color: "#2e7d32",
            marginBottom: 8,
          }}
        >
          <TrendingUp size={12} />
          {PATTERN_SCORE.change}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, maxWidth: 300, margin: "0 auto" }}>
          {PATTERN_SCORE.details}
        </div>
      </div>
    </div>
  );
}

function ProgressCard({
  marker,
  index,
}: {
  marker: (typeof PROGRESS_MARKERS)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${400 + index * 100}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          background: "white",
          borderRadius: 14,
          padding: "14px 16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          {/* Status icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: marker.breaking ? "#e8f5e9" : "#fff3e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {marker.breaking ? (
              <CheckCircle2 size={18} style={{ color: "#4caf50" }} />
            ) : (
              <Clock size={18} style={{ color: "#e65100" }} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                {marker.name}
              </div>
              {marker.breaking && (
                <div
                  style={{
                    padding: "1px 6px",
                    borderRadius: 6,
                    fontSize: 9,
                    fontWeight: 700,
                    background: "#e8f5e9",
                    color: "#2e7d32",
                  }}
                >
                  BREAKING
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: marker.breaking ? "#2e7d32" : "#e65100", fontWeight: 600, marginBottom: 4 }}>
              {marker.yourStatus}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
              {marker.familyComparison}
            </div>

            {expanded && (
              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  borderRadius: 10,
                  background: marker.breaking
                    ? "linear-gradient(135deg, #e8f5e9, #f1f8e9)"
                    : "linear-gradient(135deg, #fff3e0, #fff8e1)",
                  border: `1px solid ${marker.breaking ? "#c8e6c9" : "#ffe0b2"}`,
                }}
              >
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {marker.impact}
                </div>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

function MilestoneTimeline() {
  const milestones = [
    { date: "Jan 2026", label: "Joined Precura", detail: "First comprehensive health review connecting all the dots", done: true },
    { date: "Jan 2026", label: "Started training program", detail: "Metabolic health program with real exercises", done: true },
    { date: "Mar 2026", label: "Blood test - full panel", detail: "Glucose 5.8, HbA1c 38 - rising but still time", done: true },
    { date: "Apr 2026", label: "Week 10 of 12", detail: "28 sessions completed. Building consistency.", done: true },
    { date: "Sep 2026", label: "Next blood test", detail: "The big one - will the glucose trend flatten?", done: false },
    { date: "2027", label: "1 year anniversary", detail: "Full year of data - see the new trajectory", done: false },
    { date: "Age 45", label: "Midway checkpoint", detail: "Halfway to mum's diagnosis age. How does the pattern look?", done: false },
    { date: "Age 58", label: "Mum's diagnosis age", detail: "If you reach this age healthy, the pattern is broken.", done: false },
  ];

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "800ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          Your journey
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
          Milestones toward breaking the pattern
        </div>

        {milestones.map((m, i) => (
          <div key={m.label} style={{ display: "flex", gap: 12, marginBottom: i < milestones.length - 1 ? 0 : 0 }}>
            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
              <div
                style={{
                  width: m.done ? 12 : 10,
                  height: m.done ? 12 : 10,
                  borderRadius: "50%",
                  background: m.done
                    ? "#4caf50"
                    : i === milestones.findIndex((x) => !x.done)
                      ? PURPLE.accent
                      : "#e0e0e0",
                  border: !m.done && i === milestones.findIndex((x) => !x.done)
                    ? `2px solid ${PURPLE.light}`
                    : "none",
                  flexShrink: 0,
                }}
              />
              {i < milestones.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background: m.done ? "#c8e6c9" : "#e0e0e0",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: i < milestones.length - 1 ? 14 : 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: m.done ? "#4caf50" : "var(--text-muted)",
                  }}
                >
                  {m.date}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: m.done ? "var(--text)" : "var(--text-secondary)",
                  marginTop: 1,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  lineHeight: 1.4,
                  marginTop: 2,
                }}
              >
                {m.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakingSummary() {
  const breakingCount = PROGRESS_MARKERS.filter((m) => m.breaking).length;
  const totalCount = PROGRESS_MARKERS.length;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "300ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, #e8f5e9, #f1f8e9)`,
          borderRadius: 16,
          padding: 16,
          border: "1px solid #c8e6c9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2e7d32" }}>
            Breaking the pattern
          </div>
          <div style={{ fontSize: 12, color: "#33691e", marginTop: 2 }}>
            {breakingCount} of {totalCount} markers diverging from family history
          </div>
        </div>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(46, 125, 50, 0.15)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2e7d32" }}>{breakingCount}</div>
            <div style={{ fontSize: 8, color: "#558b2f" }}>/{totalCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ background: PURPLE.wash, minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/smith5"
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            Breaking the Pattern
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Your progress against family trajectory
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Hero */}
        <div
          className="animate-fade-in"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <Sparkles
            size={28}
            style={{ color: PURPLE.accent, margin: "0 auto 8px" }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            The pattern is
            <br />
            <span style={{ color: "#2e7d32" }}>already changing</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Every action you take moves you further from the family pattern. Here is
            where you stand.
          </div>
        </div>

        {/* Pattern breaking score */}
        <PatternScoreRing />

        {/* Breaking summary */}
        <div style={{ marginTop: 16 }}>
          <BreakingSummary />
        </div>

        {/* Progress markers */}
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            How you compare to family
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PROGRESS_MARKERS.map((marker, i) => (
              <ProgressCard key={marker.name} marker={marker} index={i} />
            ))}
          </div>
        </div>

        {/* Milestone timeline */}
        <div style={{ marginTop: 20 }}>
          <MilestoneTimeline />
        </div>

        {/* Final message */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "1200ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 24,
            textAlign: "center",
            padding: "28px 20px",
            background: `linear-gradient(135deg, ${PURPLE.pale}, white, #e8f5e9)`,
            borderRadius: 20,
            border: `1px solid ${PURPLE.light}`,
          }}
        >
          <Award
            size={32}
            style={{ color: PURPLE.primary, margin: "0 auto 12px" }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: PURPLE.deep,
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            You are not your family history.
            <br />
            You are what you do next.
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: 300,
              margin: "0 auto 16px",
            }}
          >
            Your grandmother didn't know. Your mother didn't know in time.
            You know at 40, with 18 years and every tool available. The pattern stops here.
          </div>

          <Link href="/smith5" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${PURPLE.primary}, ${PURPLE.accent})`,
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                boxShadow: `0 4px 16px rgba(106, 27, 154, 0.3)`,
              }}
            >
              <Heart size={16} fill="rgba(255,255,255,0.3)" />
              Back to your story
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
