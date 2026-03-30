"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Send,
  ChevronRight,
  TestTube,
  TrendingUp,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { getOrMockFindriscResult, getOrMockFindriscInputs } from "@/lib/mock-data";
import { MOCK_BLOOD_RESULTS } from "@/lib/blood-test-data";
import {
  FindriscResult,
  FindriscInputs,
  getPlainLanguageSummary,
  getRiskColor,
  getModifiableAdvice,
  MAX_SCORE,
} from "@/lib/findrisc";
import { getUserPhase, recordVisit, type UserPhase } from "@/lib/user-state";
import BottomNav from "@/components/BottomNav";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);
  const [result, setResult] = useState<FindriscResult | null>(null);
  const [inputs, setInputs] = useState<FindriscInputs | null>(null);
  const [phase, setPhase] = useState<UserPhase>("exploring");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUserState(u);
    setResult(getOrMockFindriscResult());
    setInputs(getOrMockFindriscInputs());
    setPhase(getUserPhase());
    recordVisit();
    setMounted(true);
  }, [router]);

  if (!mounted || !user || !result || !inputs) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="skeleton w-10 h-10 rounded-full" />
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];
  const summary = getPlainLanguageSummary(result);
  const color = getRiskColor(result.riskLevel);
  const advice = getModifiableAdvice(result.breakdown);
  const pct = result.score / MAX_SCORE;
  const normalCount = MOCK_BLOOD_RESULTS.filter((r) => r.status === "normal").length;
  const totalTests = MOCK_BLOOD_RESULTS.length;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <main className="flex-1 px-5 pt-10 pb-28 max-w-md mx-auto w-full">
        {/* Greeting */}
        <p
          className="animate-fade-in text-xl font-bold tracking-tight mb-6"
          style={{ color: "var(--text)" }}
        >
          {getGreeting()}, {firstName}
        </p>

        {/* Score Ring - the hero, always visible */}
        <div
          className="animate-fade-in stagger-1 rounded-3xl p-6 mb-5"
          style={{
            background: summary.bgGradient,
            opacity: 0,
          }}
        >
          <Link href="/risk/diabetes" className="block">
            <div className="flex items-center gap-5">
              {/* Ring */}
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="226"
                    strokeDashoffset="75"
                    transform="rotate(135 60 60)"
                  />
                  <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke={`var(--${color})`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="226"
                    strokeDashoffset={226 - (pct * 151)}
                    transform="rotate(135 60 60)"
                    style={{ filter: `drop-shadow(0 0 6px var(--${color}))` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-xs font-bold"
                    style={{ color: `var(--${color}-text)` }}
                  >
                    {result.riskLabel}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {summary.headline}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    See your full breakdown
                  </span>
                  <ChevronRight size={12} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Phase-specific content */}
        {phase === "exploring" && <ExploringCards advice={advice} />}
        {phase === "results_ready" && <ResultsReadyCards normalCount={normalCount} totalTests={totalTests} />}
        {phase === "results_reviewed" && <ResultsReviewedCards normalCount={normalCount} totalTests={totalTests} advice={advice} />}
        {phase === "returning" && <ReturningCards />}
        {phase === "first_results" && <ExploringCards advice={advice} />}

        {/* AI Chat - always prominent */}
        <div className="animate-fade-in stagger-4 mb-5" style={{ opacity: 0 }}>
          <Link href="/chat">
            <div
              className="card-hover rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--purple-bg)" }}
              >
                <MessageCircle size={18} style={{ color: "var(--purple)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Ask Precura anything
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Get answers about your health data in plain language
                </p>
              </div>
              <Send size={16} style={{ color: "var(--accent)" }} />
            </div>
          </Link>
        </div>

        {/* Contextual suggestion chips */}
        <div className="animate-fade-in stagger-5 flex flex-wrap gap-2" style={{ opacity: 0 }}>
          {getChips(phase).map((chip) => (
            <Link
              key={chip}
              href="/chat"
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
      </main>

      <BottomNav />
    </div>
  );
}

/* ---- Phase-specific card sections ---- */

function ExploringCards({ advice }: { advice: string[] }) {
  return (
    <div className="animate-fade-in stagger-2 flex flex-col gap-3 mb-5" style={{ opacity: 0 }}>
      {/* Explore what-if */}
      <ContextCard
        href="/risk/diabetes"
        icon={<TrendingUp size={18} />}
        iconBg="var(--green-bg)"
        iconColor="var(--green)"
        title="See what small changes could do"
        subtitle={advice.length > 0
          ? "Try our what-if explorer to see how lifestyle changes affect your score"
          : "Explore the factors behind your risk score"
        }
      />

      {/* Blood tests - soft intro, no price */}
      <ContextCard
        href="/blood-tests"
        icon={<TestTube size={18} />}
        iconBg="var(--teal-bg)"
        iconColor="var(--teal)"
        title="Get a clearer picture with blood tests"
        subtitle="Your questionnaire gives an estimate. Blood tests add real measurement."
      />
    </div>
  );
}

function ResultsReadyCards({ normalCount, totalTests }: { normalCount: number; totalTests: number }) {
  return (
    <div className="animate-fade-in stagger-2 mb-5" style={{ opacity: 0 }}>
      <Link href="/blood-tests/results">
        <div
          className="card-hover rounded-2xl p-5"
          style={{
            background: "var(--teal-bg)",
            border: "1px solid #b2dfdb",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-card)" }}
            >
              <TestTube size={22} style={{ color: "var(--teal)" }} />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold" style={{ color: "var(--teal-text)" }}>
                Your blood test results are ready
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--teal-text)", opacity: 0.8 }}>
                {normalCount} of {totalTests} markers in normal range
              </p>
            </div>
            <ChevronRight size={18} style={{ color: "var(--teal-text)" }} />
          </div>
        </div>
      </Link>
    </div>
  );
}

function ResultsReviewedCards({ normalCount, totalTests, advice }: { normalCount: number; totalTests: number; advice: string[] }) {
  return (
    <div className="animate-fade-in stagger-2 flex flex-col gap-3 mb-5" style={{ opacity: 0 }}>
      {/* Blood results summary */}
      <ContextCard
        href="/blood-tests/results"
        icon={<TestTube size={18} />}
        iconBg="var(--teal-bg)"
        iconColor="var(--teal)"
        title={`Blood work: ${normalCount}/${totalTests} normal`}
        subtitle="Review your results and what they mean"
      />

      {/* What-if explorer */}
      {advice.length > 0 && (
        <ContextCard
          href="/risk/diabetes"
          icon={<TrendingUp size={18} />}
          iconBg="var(--green-bg)"
          iconColor="var(--green)"
          title="See what small changes could do"
          subtitle="Try the what-if explorer with your updated data"
        />
      )}
    </div>
  );
}

function ReturningCards() {
  return (
    <div className="animate-fade-in stagger-2 mb-5" style={{ opacity: 0 }}>
      <Link href="/onboarding">
        <div
          className="card-hover rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--accent-light)" }}
            >
              <RefreshCw size={20} style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                It's been a while. Want to check in?
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Retake your assessment to see if anything has changed
              </p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ---- Reusable context card ---- */

function ContextCard({
  href,
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link href={href}>
      <div
        className="card-hover rounded-2xl p-4 flex items-center gap-3"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        </div>
        <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
      </div>
    </Link>
  );
}

/* ---- Contextual chips per phase ---- */

function getChips(phase: UserPhase): string[] {
  switch (phase) {
    case "first_results":
    case "exploring":
      return ["What does my score mean?", "What can I change?", "How was this calculated?"];
    case "results_ready":
      return ["What do blood tests measure?", "What is HbA1c?"];
    case "results_reviewed":
      return ["Explain my blood results", "Should I be concerned?", "When should I retest?"];
    case "returning":
      return ["Has anything changed?", "Should I get retested?"];
    case "awaiting_results":
      return ["What is HbA1c?", "How are results analyzed?"];
  }
}
