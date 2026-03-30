"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  TestTube,
  Heart,
  Bone,
  ChevronRight,
  Lock,
  Clock,
  TrendingDown,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { getOrMockFindriscResult, MOCK_NARRATIVE_TIMELINE } from "@/lib/mock-data";
import { MOCK_BLOOD_RESULTS } from "@/lib/blood-test-data";
import { FindriscResult, getRiskColor } from "@/lib/findrisc";
import { getUserPhase } from "@/lib/user-state";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function HealthPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<FindriscResult | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setResult(getOrMockFindriscResult());
    setMounted(true);
  }, [router]);

  if (!mounted || !result) {
    return <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}><div className="skeleton w-10 h-10 rounded-full" /></div>;
  }

  const color = getRiskColor(result.riskLevel);
  const phase = getUserPhase();
  const hasBlood = phase === "results_ready" || phase === "results_reviewed";
  const normalCount = MOCK_BLOOD_RESULTS.filter((r) => r.status === "normal").length;
  const totalTests = MOCK_BLOOD_RESULTS.length;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Header />
      <main className="flex-1 px-5 py-5 pb-28 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold tracking-tight mb-1" style={{ color: "var(--text)" }}>Your Health</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Track, understand, and improve</p>

        {/* Health modules */}
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Health areas</p>
        <div className="flex flex-col gap-2.5 mb-6">
          {/* Diabetes */}
          <Link href="/risk/diabetes">
            <div className="card-hover flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `var(--${color}-bg)` }}>
                <Activity size={20} style={{ color: `var(--${color})` }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Diabetes Risk</p>
                <p className="text-xs" style={{ color: `var(--${color}-text)` }}>{result.riskLabel} - last checked Mar 15</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
            </div>
          </Link>

          {/* Blood tests */}
          <Link href={hasBlood ? "/blood-tests/results" : "/blood-tests"}>
            <div className="card-hover flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--teal-bg)" }}>
                <TestTube size={20} style={{ color: "var(--teal)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Blood Tests</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {hasBlood ? `${normalCount}/${totalTests} normal - Mar 27` : "No tests yet"}
                </p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
            </div>
          </Link>

          {/* Heart - coming soon */}
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", opacity: 0.45 }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--bg-elevated)" }}>
              <Heart size={20} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Heart Health</p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>Coming soon</p>
            </div>
            <Lock size={14} style={{ color: "var(--text-faint)" }} />
          </div>

          {/* Bone - coming soon */}
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", opacity: 0.45 }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--bg-elevated)" }}>
              <Bone size={20} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Bone Health</p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>Coming soon</p>
            </div>
            <Lock size={14} style={{ color: "var(--text-faint)" }} />
          </div>
        </div>

        {/* Timeline */}
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>Timeline</p>
        <div className="rounded-2xl overflow-hidden mb-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          {MOCK_NARRATIVE_TIMELINE.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < MOCK_NARRATIVE_TIMELINE.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--bg-elevated)" }}>
                <Clock size={11} style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="flex-1 text-sm" style={{ color: "var(--text-secondary)" }}>{entry.text}</p>
              <span className="text-[10px] shrink-0" style={{ fontFamily: "var(--font-space-mono)", color: "var(--text-faint)" }}>{entry.date}</span>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
