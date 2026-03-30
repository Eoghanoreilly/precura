"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Lock } from "lucide-react";
import { getUser, updateUser } from "@/lib/auth";
import { getOrMockFindriscResult, getOrMockFindriscInputs } from "@/lib/mock-data";
import {
  FindriscResult,
  getPlainLanguageSummary,
  getRiskColor,
  getModifiableAdvice,
  MAX_SCORE,
} from "@/lib/findrisc";
import { markResultsRevealed } from "@/lib/user-state";

export default function ResultsPage() {
  const router = useRouter();
  const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);
  const [result, setResult] = useState<FindriscResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUserState(u);
    setResult(getOrMockFindriscResult());
    setMounted(true);

    // Trigger the reveal animation after a brief pause
    const t1 = setTimeout(() => setRevealed(true), 600);
    const t2 = setTimeout(() => setShowDetails(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [router]);

  if (!mounted || !user || !result) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="skeleton w-10 h-10 rounded-full" />
      </div>
    );
  }

  const summary = getPlainLanguageSummary(result);
  const color = getRiskColor(result.riskLevel);
  const advice = getModifiableAdvice(result.breakdown);
  const pct = result.score / MAX_SCORE;
  const firstName = user.name.split(" ")[0];

  // Top 2 factors
  const topFactors = Object.values(result.breakdown)
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 2)
    .map((f) => {
      const names: Record<string, string> = {
        "Family history of diabetes": "Family history",
        "Physical activity": "Activity level",
        "Daily fruit & vegetables": "Diet",
        "Waist circumference": "Waist measurement",
        "BMI": "Body weight",
        "Age": "Age",
        "Blood pressure medication": "Blood pressure",
        "High blood glucose history": "Blood sugar history",
      };
      return names[f.label] || f.label;
    });

  // Non-modifiable factors
  const fixedFactors = Object.values(result.breakdown)
    .filter((f) => f.points > 0 && ["Age", "Family history of diabetes", "High blood glucose history", "Blood pressure medication"].includes(f.label));

  function handleContinue() {
    markResultsRevealed();
    updateUser({ isNew: false });
    router.push("/dashboard");
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-10"
      style={{ background: summary.bgGradient }}
    >
      <div className="w-full max-w-sm">
        {/* Greeting */}
        <p
          className="text-center text-sm font-medium mb-8 animate-fade-in"
          style={{ color: "var(--text-secondary)" }}
        >
          {firstName}, here's what we found
        </p>

        {/* Score Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Background arc */}
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="var(--bg-elevated)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="245"
                strokeDashoffset="82"
                transform="rotate(135 60 60)"
              />
              {/* Score arc - animates in */}
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={`var(--${color})`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="245"
                strokeDashoffset={revealed ? 245 - (pct * 163) : 245}
                transform="rotate(135 60 60)"
                style={{
                  transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: `drop-shadow(0 0 8px var(--${color}))`,
                }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-xs font-semibold mb-1"
                style={{
                  color: `var(--${color}-text)`,
                  opacity: revealed ? 1 : 0,
                  transition: "opacity 0.5s ease 0.8s",
                }}
              >
                {result.riskLabel}
              </span>
              <span
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  opacity: revealed ? 1 : 0,
                  transition: "opacity 0.5s ease 1s",
                }}
              >
                {result.tenYearRisk} 10-yr risk
              </span>
            </div>
          </div>
        </div>

        {/* Summary sentence */}
        <p
          className="text-center text-base leading-relaxed mb-8 px-2"
          style={{
            color: "var(--text)",
            fontWeight: 500,
            opacity: showDetails ? 1 : 0,
            transform: showDetails ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s ease",
          }}
        >
          {summary.headline}
        </p>

        {/* Details cards */}
        <div
          style={{
            opacity: showDetails ? 1 : 0,
            transform: showDetails ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s ease 0.2s",
          }}
        >
          {/* Main factors */}
          {topFactors.length > 0 && (
            <div
              className="rounded-2xl p-4 mb-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                Main factors in your score
              </p>
              <div className="flex flex-col gap-2">
                {topFactors.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: `var(--${color}-bg)` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: `var(--${color})` }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--text)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What you can change */}
          {advice.length > 0 && (
            <div
              className="rounded-2xl p-4 mb-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--green-text)" }}>
                Within your control
              </p>
              <div className="flex flex-col gap-2">
                {advice.map((tip) => (
                  <div key={tip} className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--green-bg)" }}
                    >
                      <Check size={10} style={{ color: "var(--green)" }} />
                    </div>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's fixed */}
          {fixedFactors.length > 0 && (
            <div
              className="rounded-2xl p-4 mb-6"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                Can't be changed, but good to know
              </p>
              <div className="flex flex-col gap-2">
                {fixedFactors.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      <Lock size={10} style={{ color: "var(--text-faint)" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Continue */}
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white"
            style={{
              background: "var(--accent)",
              boxShadow: "0 4px 14px rgba(92, 107, 192, 0.3)",
            }}
          >
            Continue
            <ArrowRight size={16} />
          </button>

          <p
            className="text-center text-[10px] mt-4"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)" }}
          >
            This is a screening estimate, not a diagnosis
          </p>
        </div>
      </div>
    </div>
  );
}
