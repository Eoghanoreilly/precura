"use client";

import Link from "next/link";
import { ChevronRight, Activity } from "lucide-react";
import { FindriscResult, getRiskColor, MAX_SCORE } from "@/lib/findrisc";

interface RiskCardProps {
  result: FindriscResult;
}

export default function RiskCard({ result }: RiskCardProps) {
  const color = getRiskColor(result.riskLevel);
  const pct = (result.score / MAX_SCORE) * 100;
  const topFactors = Object.values(result.breakdown)
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return (
    <Link href="/risk/diabetes" className="block">
      <div
        className="card-hover rounded-3xl overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--divider)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: `var(--${color}-bg)` }}
            >
              <Activity size={18} style={{ color: `var(--${color})` }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                FINDRISC Assessment
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Type 2 Diabetes Risk
              </p>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: "var(--text-faint)" }} />
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Score + risk level */}
          <div className="flex items-end justify-between mb-4">
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text)",
                }}
              >
                {result.score}
              </span>
              <span
                className="text-base"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "var(--text-muted)",
                }}
              >
                /{MAX_SCORE}
              </span>
            </div>
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: `var(--${color}-bg)`,
                color: `var(--${color}-text)`,
              }}
            >
              {result.riskLabel}
            </span>
          </div>

          {/* Score bar */}
          <div
            className="h-3 rounded-full mb-3 overflow-hidden"
            style={{ background: "var(--bg-elevated)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background:
                  pct < 27
                    ? "var(--teal)"
                    : pct < 46
                      ? "linear-gradient(90deg, var(--teal), var(--green))"
                      : pct < 58
                        ? "linear-gradient(90deg, var(--teal), var(--amber))"
                        : pct < 77
                          ? "linear-gradient(90deg, var(--teal), var(--red))"
                          : "linear-gradient(90deg, var(--amber), var(--red))",
                transition: "width 0.5s ease",
              }}
            />
          </div>

          {/* 10-year risk */}
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
            Estimated 10-year risk:{" "}
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                color: `var(--${color}-text)`,
                fontWeight: 700,
              }}
            >
              {result.tenYearRisk}
            </span>
          </p>

          {/* Top factors */}
          {topFactors.length > 0 && (
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                background: "var(--bg-elevated)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
                style={{ color: "var(--text-muted)" }}
              >
                Top contributing factors
              </p>
              <div className="flex flex-col gap-2">
                {topFactors.map((f) => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {f.label}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        background: `var(--${color}-bg)`,
                        color: `var(--${color}-text)`,
                      }}
                    >
                      +{f.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
