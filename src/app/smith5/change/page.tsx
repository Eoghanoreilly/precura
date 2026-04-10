"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Unlock,
  TrendingDown,
  TrendingUp,
  Minus,
  Zap,
  Dumbbell,
  Utensils,
  Moon,
  Footprints,
  Heart,
  ChevronRight,
} from "lucide-react";
import {
  PATIENT,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
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

// Risk factors split into changeable and non-changeable
const UNCHANGEABLE_FACTORS = [
  {
    name: "Family history of diabetes",
    detail: "Mother (58) and grandmother (62) both diagnosed with Type 2 Diabetes",
    impact: "high" as const,
    note: "This is why your risk is elevated. You cannot change your genes, but you can change how they express.",
  },
  {
    name: "Family history of heart disease",
    detail: "Father had a heart attack at 65. Grandfather had a stroke at 71.",
    impact: "medium" as const,
    note: "Cardiovascular risk from both sides. Makes blood pressure control especially important.",
  },
  {
    name: "Age and sex",
    detail: "40-year-old woman. Diabetes risk increases with age, especially after menopause.",
    impact: "medium" as const,
    note: "You're pre-menopausal, which is protective. This protection decreases with age.",
  },
];

const CHANGEABLE_FACTORS = [
  {
    name: "Fasting glucose trend",
    currentValue: "5.8 mmol/L",
    direction: "rising" as const,
    impact: "high" as const,
    plainExplanation: "Your blood sugar (measured after not eating) has been creeping up for 5 years. From 5.0 in 2021 to 5.8 now.",
    whatToChange: "Your training plan targets this directly. Post-meal walks lower blood sugar immediately. Strength training improves your body's ability to use insulin long-term.",
    icon: TrendingUp,
    color: "#e65100",
    potential: "Could drop to 5.2-5.4 within 12 months with consistent exercise and dietary changes",
  },
  {
    name: "Activity level",
    currentValue: "2-3 sessions/week",
    direction: "improving" as const,
    impact: "high" as const,
    plainExplanation: "You are in week 10 of 12 in your training program. This is great progress - but consistency over years, not weeks, is what breaks the pattern.",
    whatToChange: "The training plan is already optimized for metabolic health. The key is maintaining 3 sessions/week plus daily walks for the long term.",
    icon: Dumbbell,
    color: "#2e7d32",
    potential: "150 min/week of moderate exercise reduces diabetes risk by 30-50%",
  },
  {
    name: "Weight / BMI",
    currentValue: "78kg / BMI 27.6",
    direction: "stable" as const,
    impact: "medium" as const,
    plainExplanation: "Your BMI of 27.6 is in the overweight category. Your waist is 86cm - just 2cm from the metabolic syndrome threshold of 88cm.",
    whatToChange: "Even 3-5kg of weight loss would significantly improve insulin sensitivity and move you further from the metabolic syndrome threshold. Focus on gradual, sustainable changes.",
    icon: Minus,
    color: "#1565c0",
    potential: "Losing 5% body weight (4kg) can reduce diabetes risk by 30-40%",
  },
  {
    name: "Blood pressure",
    currentValue: "132/82 (on Enalapril 5mg)",
    direction: "controlled" as const,
    impact: "medium" as const,
    plainExplanation: "Mild hypertension, well controlled with medication. Your father wasn't treated until age 50 - you started at 37.",
    whatToChange: "Continue medication. Salt reduction, weight management, and exercise can potentially reduce the dose needed. Never stop without consulting your doctor.",
    icon: Heart,
    color: "#00695c",
    potential: "Good control. Current medication keeping this in check - that is the pattern being broken",
  },
  {
    name: "Diet habits",
    currentValue: "Not tracked in detail",
    direction: "unknown" as const,
    impact: "high" as const,
    plainExplanation: "Diet is one of the biggest levers for blood sugar control. Your doctor has recommended dietary changes but we don't have detailed tracking yet.",
    whatToChange: "A 20-minute walk after dinner is the single most effective habit for blood sugar. Reducing refined carbs and eating more fiber helps your body process sugar more efficiently.",
    icon: Utensils,
    color: "#6a1b9a",
    potential: "Mediterranean-style diet can reduce Type 2 Diabetes risk by 20-30%",
  },
  {
    name: "Vitamin D",
    currentValue: "48 nmol/L (slightly low)",
    direction: "low" as const,
    impact: "low" as const,
    plainExplanation: "Vitamin D is slightly below the optimal threshold of 50. Living in Sweden, this is common, especially in winter months.",
    whatToChange: "Your doctor recommended D3 supplement 2000 IU daily. Low vitamin D has been linked to insulin resistance. An easy fix with a daily supplement.",
    icon: Moon,
    color: "#ff8f00",
    potential: "Simple supplementation - take D3 2000 IU daily as recommended",
  },
];

function ImpactBar({ impact }: { impact: "high" | "medium" | "low" }) {
  const segments = impact === "high" ? 3 : impact === "medium" ? 2 : 1;
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            width: 16,
            height: 4,
            borderRadius: 2,
            background:
              n <= segments
                ? impact === "high"
                  ? "#e65100"
                  : impact === "medium"
                    ? "#ff9800"
                    : "#ffc107"
                : "#e0e0e0",
          }}
        />
      ))}
    </div>
  );
}

function UnchangeableCard({
  factor,
  index,
}: {
  factor: (typeof UNCHANGEABLE_FACTORS)[0];
  index: number;
}) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${200 + index * 100}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 14,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          opacity: 0.85,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Lock size={16} style={{ color: "#9e9e9e" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                {factor.name}
              </div>
              <ImpactBar impact={factor.impact} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 6 }}>
              {factor.detail}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4, fontStyle: "italic" }}>
              {factor.note}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangeableCard({
  factor,
  index,
}: {
  factor: (typeof CHANGEABLE_FACTORS)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const directionIcon =
    factor.direction === "rising" ? (
      <TrendingUp size={12} style={{ color: "#e65100" }} />
    ) : factor.direction === "improving" ? (
      <TrendingDown size={12} style={{ color: "#2e7d32" }} />
    ) : factor.direction === "controlled" ? (
      <Shield size={12} style={{ color: "#00695c" }} />
    ) : (
      <Minus size={12} style={{ color: "#9e9e9e" }} />
    );

  const directionLabel =
    factor.direction === "rising"
      ? { text: "Rising", color: "#e65100", bg: "#fff3e0" }
      : factor.direction === "improving"
        ? { text: "Improving", color: "#2e7d32", bg: "#e8f5e9" }
        : factor.direction === "controlled"
          ? { text: "Controlled", color: "#00695c", bg: "#e0f2f1" }
          : factor.direction === "stable"
            ? { text: "Stable", color: "#1565c0", bg: "#e3f2fd" }
            : { text: "Unknown", color: "#9e9e9e", bg: "#f5f5f5" };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${500 + index * 120}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            padding: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `${factor.color}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <factor.icon size={20} style={{ color: factor.color }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                {factor.name}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 600,
                  background: directionLabel.bg,
                  color: directionLabel.color,
                }}
              >
                {directionIcon}
                {directionLabel.text}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: factor.color, marginBottom: 4 }}>
              {factor.currentValue}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Impact on risk:</div>
              <ImpactBar impact={factor.impact} />
            </div>
          </div>
        </button>

        {expanded && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: 16,
              background: "#fafafa",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                What is happening
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {factor.plainExplanation}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                What you can do
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {factor.whatToChange}
              </div>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "#e8f5e9",
                border: "1px solid #c8e6c9",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Zap size={14} style={{ color: "#2e7d32", marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#2e7d32", lineHeight: 1.4, fontWeight: 500 }}>
                  {factor.potential}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ControlMeter() {
  // Of Anna's risk factors, what percentage is changeable?
  const totalFactors = UNCHANGEABLE_FACTORS.length + CHANGEABLE_FACTORS.length;
  const changeablePercent = Math.round((CHANGEABLE_FACTORS.length / totalFactors) * 100);

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "150ms",
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
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
          How much is in your control?
        </div>

        {/* Visual meter */}
        <div
          style={{
            width: "100%",
            height: 28,
            borderRadius: 14,
            background: "#f5f5f5",
            overflow: "hidden",
            marginBottom: 12,
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${changeablePercent}%`,
              height: "100%",
              borderRadius: 14,
              background: `linear-gradient(90deg, ${PURPLE.primary}, #4caf50)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "width 1s ease",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>
              {changeablePercent}% changeable
            </span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Unlock size={14} style={{ color: "#4caf50" }} />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {CHANGEABLE_FACTORS.length} you can change
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Lock size={14} style={{ color: "#9e9e9e" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {UNCHANGEABLE_FACTORS.length} fixed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChangePage() {
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
            What You Can Change
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Risk factors in your control
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Hero */}
        <div
          className="animate-fade-in"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            You can't change your genes.
            <br />
            <span style={{ color: "#2e7d32" }}>You can change the outcome.</span>
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
            Some risk factors are locked. Most aren't. Tap each one to see what it means
            and what you can do about it.
          </div>
        </div>

        {/* Control meter */}
        <ControlMeter />

        {/* Unchangeable section */}
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
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Lock size={12} />
            Cannot change
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {UNCHANGEABLE_FACTORS.map((f, i) => (
              <UnchangeableCard key={f.name} factor={f} index={i} />
            ))}
          </div>
        </div>

        {/* Changeable section */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#2e7d32",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
              paddingLeft: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Unlock size={12} />
            In your control
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CHANGEABLE_FACTORS.map((f, i) => (
              <ChangeableCard key={f.name} factor={f} index={i} />
            ))}
          </div>
        </div>

        {/* CTA to plan */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "1200ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 24,
          }}
        >
          <Link href="/smith5/plan" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: `linear-gradient(135deg, #2e7d32, #4caf50)`,
                borderRadius: 14,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "white",
                boxShadow: "0 4px 16px rgba(46, 125, 50, 0.3)",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  Your prevention plan
                </div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  Training + testing designed to break the pattern
                </div>
              </div>
              <ChevronRight size={20} style={{ opacity: 0.7 }} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
