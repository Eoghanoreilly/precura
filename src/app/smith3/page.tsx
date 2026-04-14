"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PATIENT } from "@/lib/v2/mock-patient";
import { computeHealthScore, type Factor, type SubScore } from "./scoring";

// ---------------------------------------------------------------------------
// Animated number counter
// ---------------------------------------------------------------------------

function useAnimatedNumber(target: number, duration: number = 1800) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return current;
}

// ---------------------------------------------------------------------------
// Score color by value
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score >= 80) return "#39FF14";
  if (score >= 60) return "#00FF88";
  if (score >= 40) return "#FFFF00";
  return "#FF006E";
}

function scoreLabel(score: number): string {
  if (score >= 85) return "OPTIMAL";
  if (score >= 70) return "GOOD";
  if (score >= 55) return "MODERATE";
  if (score >= 40) return "ELEVATED RISK";
  return "HIGH RISK";
}

// ---------------------------------------------------------------------------
// Score Bar - thin horizontal 0-100
// ---------------------------------------------------------------------------

function ScoreBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0);
  const color = scoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
      {/* Track */}
      <div
        style={{
          width: "100%",
          height: 4,
          background: "#333333",
          position: "relative",
        }}
      >
        {/* Fill */}
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: color,
            boxShadow: `0 0 12px ${color}66`,
            transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {/* Marker */}
        <div
          style={{
            position: "absolute",
            left: `${width}%`,
            top: -6,
            width: 2,
            height: 16,
            background: color,
            boxShadow: `0 0 8px ${color}`,
            transition: "left 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      {/* Scale labels */}
      <div
        className="flex justify-between"
        style={{
          marginTop: 6,
          fontFamily: '"SF Mono", "Courier New", monospace',
          fontSize: 10,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
      >
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-score Box
// ---------------------------------------------------------------------------

function SubScoreBox({
  sub,
  onClick,
}: {
  sub: SubScore;
  onClick: () => void;
}) {
  const color = scoreColor(sub.score);
  const animated = useAnimatedNumber(sub.score, 1400);

  return (
    <button
      onClick={onClick}
      style={{
        background: "#1A1A1A",
        border: "2px solid #333333",
        borderRadius: 0,
        padding: "16px 12px",
        cursor: "pointer",
        flex: 1,
        minWidth: 100,
        textAlign: "left",
        fontFamily: '"SF Mono", "Courier New", monospace',
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 20px ${color}26`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#333333";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#A0A0A0",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {sub.shortName}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {animated}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
      >
        {sub.name}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Detail View - Factor Breakdown
// ---------------------------------------------------------------------------

function DetailView({
  healthScore,
  activeSubScore,
  onBack,
}: {
  healthScore: ReturnType<typeof computeHealthScore>;
  activeSubScore: number | null;
  onBack: () => void;
}) {
  const sub = activeSubScore !== null ? healthScore.subScores[activeSubScore] : null;
  const factors = sub ? sub.factors : healthScore.allFactors;
  const title = sub ? sub.name : "ALL FACTORS";

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: "100dvh",
        background: "#0A0A0A",
        fontFamily: '"SF Mono", "Courier New", monospace',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #333333",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#00FF88",
            fontFamily: '"SF Mono", "Courier New", monospace',
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
            letterSpacing: "0.05em",
          }}
        >
          {"< BACK"}
        </button>
        <div
          style={{
            fontSize: 12,
            color: "#A0A0A0",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <div style={{ width: 50 }} />
      </div>

      {/* Sub-score summary if viewing a specific sub-score */}
      {sub && (
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #333333",
          }}
        >
          <div className="flex items-baseline gap-4">
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: scoreColor(sub.score),
                lineHeight: 1,
              }}
            >
              {sub.score}
            </span>
            <span style={{ fontSize: 14, color: "#A0A0A0" }}>
              / 100
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#666666",
                letterSpacing: "0.1em",
                marginLeft: "auto",
              }}
            >
              WEIGHT: {Math.round(sub.weight * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Factors list */}
      <div style={{ padding: "8px 24px", flex: 1, overflowY: "auto" }}>
        <div
          style={{
            fontSize: 10,
            color: "#666666",
            letterSpacing: "0.12em",
            padding: "16px 0 8px",
            textTransform: "uppercase",
          }}
        >
          {factors.length} factor{factors.length !== 1 ? "s" : ""} identified
        </div>

        {factors.map((factor, i) => (
          <FactorRow key={i} factor={factor} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #333333",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 10, color: "#666666", letterSpacing: "0.05em" }}>
          Last updated: {healthScore.lastUpdated}
        </div>
      </div>
    </div>
  );
}

function FactorRow({ factor, index }: { factor: Factor; index: number }) {
  const isPositive = factor.impact > 0;
  const isNegative = factor.impact < 0;
  const color = isPositive ? "#39FF14" : isNegative ? "#FF006E" : "#A0A0A0";
  const sign = isPositive ? "+" : "";

  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid #1A1A1A",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        opacity: 0,
        animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s forwards`,
      }}
    >
      {/* Impact badge */}
      <div
        style={{
          minWidth: 48,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}15`,
          border: `1px solid ${color}40`,
          fontFamily: '"SF Mono", "Courier New", monospace',
          fontSize: 13,
          fontWeight: 700,
          color: color,
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}
      >
        {sign}{factor.impact}
      </div>

      {/* Label */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            color: "#F0F0F0",
            lineHeight: 1.4,
            marginBottom: 4,
          }}
        >
          {factor.label}
        </div>
        <div
          style={{
            fontSize: 10,
            color: factor.changeable ? "#00FF88" : "#666666",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {factor.changeable ? "MODIFIABLE" : "NON-MODIFIABLE"}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pulse ring animation (CSS-in-JS keyframes injected once)
// ---------------------------------------------------------------------------

function StyleInjector() {
  return (
    <style>{`
      @keyframes pulseRing {
        0% { transform: scale(0.95); opacity: 0.6; }
        50% { transform: scale(1.05); opacity: 0.2; }
        100% { transform: scale(0.95); opacity: 0.6; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes glowPulse {
        0%, 100% { text-shadow: 0 0 40px rgba(0,255,136,0.3), 0 0 80px rgba(0,255,136,0.1); }
        50% { text-shadow: 0 0 60px rgba(0,255,136,0.5), 0 0 120px rgba(0,255,136,0.2); }
      }
    `}</style>
  );
}

// ---------------------------------------------------------------------------
// Main Score Page
// ---------------------------------------------------------------------------

export default function Smith3Page() {
  const healthScore = useMemo(() => computeHealthScore(), []);
  const animatedScore = useAnimatedNumber(healthScore.composite, 2000);
  const color = scoreColor(healthScore.composite);
  const label = scoreLabel(healthScore.composite);

  const [view, setView] = useState<"score" | "detail">("score");
  const [activeSubScore, setActiveSubScore] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (view === "detail") {
    return (
      <>
        <StyleInjector />
        <DetailView
          healthScore={healthScore}
          activeSubScore={activeSubScore}
          onBack={() => {
            setView("score");
            setActiveSubScore(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <StyleInjector />
      <div
        className="flex flex-col items-center justify-center"
        style={{
          minHeight: "100dvh",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header line */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.3s",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#A0A0A0",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: '"SF Mono", "Courier New", monospace',
            }}
          >
            PRECURA
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#666666",
              fontFamily: '"SF Mono", "Courier New", monospace',
              letterSpacing: "0.05em",
            }}
          >
            {PATIENT.firstName.toUpperCase()} / {PATIENT.age}
          </div>
        </div>

        {/* Glow ring behind the number */}
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: `1px solid ${color}20`,
            animation: "pulseRing 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            border: `1px solid ${color}10`,
            animation: "pulseRing 4s ease-in-out infinite 1s",
            pointerEvents: "none",
          }}
        />

        {/* THE NUMBER */}
        <button
          onClick={() => {
            setActiveSubScore(null);
            setView("detail");
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "20px",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          aria-label="View health score breakdown"
        >
          <div
            style={{
              fontSize: "clamp(100px, 20vw, 160px)",
              fontWeight: 700,
              fontFamily: '"SF Mono", "Courier New", monospace',
              color: color,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              animation: mounted ? "glowPulse 4s ease-in-out infinite" : "none",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.5s ease-out",
              userSelect: "none",
            }}
          >
            {animatedScore}
          </div>
        </button>

        {/* Label */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            color: "#A0A0A0",
            marginTop: 4,
            fontFamily: '"SF Mono", "Courier New", monospace',
            textTransform: "uppercase",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.4s",
          }}
        >
          {label}
        </div>

        {/* Score bar */}
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            marginTop: 32,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.6s",
          }}
        >
          <ScoreBar score={healthScore.composite} />
        </div>

        {/* Sub-score boxes */}
        <div
          className="flex gap-3"
          style={{
            width: "100%",
            maxWidth: 400,
            marginTop: 32,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.8s",
          }}
        >
          {healthScore.subScores.map((sub, i) => (
            <SubScoreBox
              key={sub.shortName}
              sub={sub}
              onClick={() => {
                setActiveSubScore(i);
                setView("detail");
              }}
            />
          ))}
        </div>

        {/* Tap hint */}
        <div
          style={{
            marginTop: 40,
            fontSize: 10,
            color: "#333333",
            letterSpacing: "0.1em",
            fontFamily: '"SF Mono", "Courier New", monospace',
            textTransform: "uppercase",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease-out 1.2s",
          }}
        >
          TAP SCORE FOR BREAKDOWN
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            right: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease-out 1s",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#333333",
              fontFamily: '"SF Mono", "Courier New", monospace',
              letterSpacing: "0.05em",
            }}
          >
            UPDATED {healthScore.lastUpdated}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#333333",
              fontFamily: '"SF Mono", "Courier New", monospace',
              letterSpacing: "0.05em",
            }}
          >
            v1.0
          </div>
        </div>
      </div>
    </>
  );
}
