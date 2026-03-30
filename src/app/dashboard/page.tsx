"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Heart,
  Bone,
  Lock,
  ChevronRight,
  TrendingDown,
  TrendingUp as TrendUp,
  Minus,
  TestTube,
  MessageCircle,
  Send,
  CalendarClock,
  CheckCircle2,
  Circle,
  RefreshCw,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { getOrMockFindriscResult, getOrMockFindriscInputs } from "@/lib/mock-data";
import { MOCK_BLOOD_RESULTS } from "@/lib/blood-test-data";
import {
  FindriscResult,
  getRiskColor,
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
  const [phase, setPhase] = useState<UserPhase>("exploring");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUserState(u);
    setResult(getOrMockFindriscResult());
    setPhase(getUserPhase());
    recordVisit();
    setMounted(true);
  }, [router]);

  if (!mounted || !user || !result) {
    return <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}><div className="skeleton w-10 h-10 rounded-full" /></div>;
  }

  const firstName = user.name.split(" ")[0];
  const color = getRiskColor(result.riskLevel);
  const pct = result.score / MAX_SCORE;
  const hasBloodResults = phase === "results_ready" || phase === "results_reviewed";
  const normalCount = MOCK_BLOOD_RESULTS.filter((r) => r.status === "normal").length;
  const totalTests = MOCK_BLOOD_RESULTS.length;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <main className="flex-1 px-5 pt-8 pb-28 max-w-lg mx-auto w-full">

        {/* Greeting + date */}
        <div className="animate-fade-in flex items-baseline justify-between mb-5">
          <p className="text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            {getGreeting()}, {firstName}
          </p>
          <span className="text-[10px]" style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* === SECTION A: Health Gauges Row === */}
        <div className="animate-fade-in stagger-1 flex gap-3 overflow-x-auto pb-2 mb-5 -mx-1 px-1" style={{ opacity: 0, scrollbarWidth: "none" }}>
          {/* Diabetes gauge */}
          <Link href="/risk/diabetes" className="shrink-0">
            <div
              className="card-hover w-36 rounded-2xl p-4 flex flex-col items-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <MiniGauge pct={pct} color={color} />
              <span className="text-xs font-bold mt-2" style={{ color: `var(--${color}-text)` }}>
                {result.riskLabel}
              </span>
              <span className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                Diabetes Risk
              </span>
            </div>
          </Link>

          {/* Heart - not started */}
          <div className="shrink-0 w-36 rounded-2xl p-4 flex flex-col items-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", opacity: 0.5 }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
              <Heart size={20} style={{ color: "var(--text-faint)" }} />
            </div>
            <span className="text-[10px] font-semibold mt-2" style={{ color: "var(--text-muted)" }}>
              Heart Health
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>Coming soon</span>
          </div>

          {/* Bone - locked */}
          <div className="shrink-0 w-36 rounded-2xl p-4 flex flex-col items-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", opacity: 0.4 }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
              <Bone size={20} style={{ color: "var(--text-faint)" }} />
            </div>
            <span className="text-[10px] font-semibold mt-2" style={{ color: "var(--text-muted)" }}>
              Bone Health
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>Coming soon</span>
          </div>
        </div>

        {/* === SECTION B: Attention Banner === */}
        {hasBloodResults && phase === "results_ready" && (
          <Link href="/blood-tests/results">
            <div
              className="animate-fade-in stagger-2 card-hover rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: "var(--teal-bg)", border: "1px solid #b2dfdb", boxShadow: "var(--shadow-sm)", opacity: 0 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--bg-card)" }}>
                <TestTube size={18} style={{ color: "var(--teal)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--teal-text)" }}>Blood test results ready</p>
                <p className="text-xs" style={{ color: "var(--teal-text)", opacity: 0.8 }}>{normalCount}/{totalTests} markers normal</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--teal-text)" }} />
            </div>
          </Link>
        )}

        {phase === "returning" && (
          <Link href="/onboarding">
            <div
              className="animate-fade-in stagger-2 card-hover rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: "var(--accent-light)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", opacity: 0 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--bg-card)" }}>
                <RefreshCw size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Time for a check-in?</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Retake your assessment to track changes</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--accent)" }} />
            </div>
          </Link>
        )}

        {/* === SECTION C: Change Highlights === */}
        {hasBloodResults && (
          <div className="animate-fade-in stagger-2 mb-5" style={{ opacity: 0 }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Recent changes</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <ChangeRow label="f-Glucose" from="5.8" to="5.4" unit="mmol/L" period="6 months" direction="improved" />
              <ChangeRow label="FINDRISC" from="12" to="10" unit="pts" period="Since Jan" direction="improved" isLast />
            </div>
          </div>
        )}

        {/* === SECTION D: Next Actions === */}
        <div className="animate-fade-in stagger-3 mb-5" style={{ opacity: 0 }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Next steps</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            {hasBloodResults ? (
              <>
                <ActionRow icon={<CalendarClock size={14} />} text="Schedule 6-month blood retest" meta="Due Sep 2026" href="/blood-tests" />
                <ActionRow icon={<Activity size={14} />} text="Increase daily activity to 30 min" meta="Ongoing" href="/risk/diabetes" />
                <ActionRow icon={<CheckCircle2 size={14} />} text="Complete diabetes risk check" meta="Done" href="/risk/diabetes" done isLast />
              </>
            ) : (
              <>
                <ActionRow icon={<TrendUp size={14} />} text="Explore what small changes could do" meta="What-if explorer" href="/risk/diabetes" />
                <ActionRow icon={<TestTube size={14} />} text="Get a clearer picture with blood tests" meta="Optional next step" href="/blood-tests" isLast />
              </>
            )}
          </div>
        </div>

        {/* === SECTION E: AI Chat === */}
        <div className="animate-fade-in stagger-4 mb-4" style={{ opacity: 0 }}>
          <Link href="/chat">
            <div
              className="card-hover rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--purple-bg)" }}>
                <MessageCircle size={18} style={{ color: "var(--purple)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Ask Precura anything</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Plain-language answers about your health</p>
              </div>
              <Send size={16} style={{ color: "var(--accent)" }} />
            </div>
          </Link>
        </div>

        {/* Chips */}
        <div className="animate-fade-in stagger-5 flex flex-wrap gap-2" style={{ opacity: 0 }}>
          {getChips(phase, hasBloodResults).map((chip) => (
            <Link key={chip} href="/chat" className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              {chip}
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

/* ---- Mini gauge for dashboard ---- */
function MiniGauge({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="75" transform="rotate(135 60 60)" />
        <circle cx="60" cy="60" r="48" fill="none" stroke={`var(--${color})`} strokeWidth="8" strokeLinecap="round" strokeDasharray="226" strokeDashoffset={226 - (pct * 151)} transform="rotate(135 60 60)" style={{ filter: `drop-shadow(0 0 4px var(--${color}))` }} />
      </svg>
    </div>
  );
}

/* ---- Change highlight row ---- */
function ChangeRow({ label, from, to, unit, period, direction, isLast }: {
  label: string; from: string; to: string; unit: string; period: string;
  direction: "improved" | "stable" | "worsened"; isLast?: boolean;
}) {
  const iconMap = { improved: TrendingDown, stable: Minus, worsened: TrendUp };
  const colorMap = { improved: "green", stable: "text-muted", worsened: "red" };
  const Icon = iconMap[direction];
  const c = colorMap[direction];

  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: isLast ? "none" : "1px solid var(--divider)" }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: direction === "improved" ? "var(--green-bg)" : "var(--bg-elevated)" }}>
        <Icon size={12} style={{ color: direction === "improved" ? "var(--green)" : `var(--${c})` }} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</span>
          <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-muted)" }}>{from} <span style={{ color: "var(--text-faint)" }}>-&gt;</span> {to} {unit}</span>
        </div>
        <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{period}</span>
      </div>
    </div>
  );
}

/* ---- Action row ---- */
function ActionRow({ icon, text, meta, href, done, isLast }: {
  icon: React.ReactNode; text: string; meta: string; href: string; done?: boolean; isLast?: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: isLast ? "none" : "1px solid var(--divider)", opacity: done ? 0.5 : 1 }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: done ? "var(--green-bg)" : "var(--bg-elevated)", color: done ? "var(--green)" : "var(--text-muted)" }}>
          {done ? <CheckCircle2 size={12} style={{ color: "var(--green)" }} /> : icon}
        </div>
        <div className="flex-1">
          <p className="text-sm" style={{ color: "var(--text)", textDecoration: done ? "line-through" : "none" }}>{text}</p>
          <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{meta}</p>
        </div>
        {!done && <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />}
      </div>
    </Link>
  );
}

/* ---- Contextual chips ---- */
function getChips(phase: UserPhase, hasBlood: boolean): string[] {
  if (hasBlood) return ["Explain my glucose", "When to retest?", "What changed?"];
  if (phase === "exploring") return ["What does my score mean?", "What can I change?"];
  if (phase === "returning") return ["Has anything changed?", "Should I retest?"];
  return ["What does my score mean?", "How was this calculated?"];
}
