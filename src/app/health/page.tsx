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
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { getOrMockFindriscResult } from "@/lib/mock-data";
import { FindriscResult, getRiskColor } from "@/lib/findrisc";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function HealthPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<FindriscResult | null>(null);
  const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUserState(u);
    setResult(getOrMockFindriscResult());
    setMounted(true);
  }, [router]);

  if (!mounted || !user || !result) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="skeleton w-10 h-10 rounded-full" />
      </div>
    );
  }

  const color = getRiskColor(result.riskLevel);
  const isReturning = !user.isNew;

  const comparison =
    result.riskLevel === "low"
      ? "Lower than average"
      : result.riskLevel === "slightly_elevated"
        ? "About average"
        : result.riskLevel === "moderate"
          ? "Slightly higher than average"
          : "Higher than average";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Header />
      <main className="flex-1 px-5 py-6 pb-28 max-w-lg mx-auto w-full">
        <h1
          className="text-xl font-bold tracking-tight mb-1"
          style={{ color: "var(--text)" }}
        >
          Your Health
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          All your health areas in one place
        </p>

        <div className="flex flex-col gap-3">
          {/* Diabetes Risk */}
          <Link href="/risk/diabetes">
            <div
              className="card-hover flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `var(--${color}-bg)` }}
              >
                <Activity size={22} style={{ color: `var(--${color})` }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Diabetes Risk
                </p>
                <p className="text-xs" style={{ color: `var(--${color}-text)` }}>
                  {comparison}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: "var(--text-faint)" }} />
            </div>
          </Link>

          {/* Blood Tests */}
          <Link href={isReturning ? "/blood-tests/results" : "/blood-tests"}>
            <div
              className="card-hover flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "var(--teal-bg)" }}
              >
                <TestTube size={22} style={{ color: "var(--teal)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Blood Tests
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {isReturning ? "Results available" : "No tests yet"}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: "var(--text-faint)" }} />
            </div>
          </Link>

          {/* Heart Health - Coming Soon */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0.5,
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-elevated)" }}
            >
              <Heart size={22} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                Heart Health
              </p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Coming soon
              </p>
            </div>
            <Lock size={14} style={{ color: "var(--text-faint)" }} />
          </div>

          {/* Bone Health - Coming Soon */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0.5,
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-elevated)" }}
            >
              <Bone size={22} style={{ color: "var(--text-faint)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                Bone Health
              </p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Coming soon
              </p>
            </div>
            <Lock size={14} style={{ color: "var(--text-faint)" }} />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
