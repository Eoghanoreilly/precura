"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Smartphone, Loader2, CheckCircle2 } from "lucide-react";

type LoginState = "idle" | "verifying" | "success";

const V2_DEMO_USERS = {
  returning: {
    name: "Anna Bergstrom",
    personnummer: "198507220148",
    initials: "AB",
    description: "Returning member - full data",
    route: "/v2/dashboard",
  },
  new: {
    name: "Erik Lindqvist",
    personnummer: "199201150234",
    initials: "EL",
    description: "New user - starts onboarding",
    route: "/v2/connect",
  },
};

export default function V2LoginPage() {
  const router = useRouter();
  const [personnummer, setPersonnummer] = useState("");
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [selectedDemo, setSelectedDemo] = useState<"new" | "returning" | null>(null);

  function formatPersonnummer(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    if (digits.length > 8) {
      return digits.slice(0, 8) + "-" + digits.slice(8);
    }
    return digits;
  }

  function handleLogin(type: "new" | "returning") {
    setSelectedDemo(type);
    const user = V2_DEMO_USERS[type];
    setPersonnummer(formatPersonnummer(user.personnummer));
    setLoginState("verifying");

    setTimeout(() => {
      setLoginState("success");
      setTimeout(() => {
        router.push(user.route);
      }, 800);
    }, 2000);
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #fef7ee 50%, #f0fdf4 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo with v2 badge */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--accent-light)", boxShadow: "var(--shadow-sm)" }}
          >
            <Activity size={22} style={{ color: "var(--accent)" }} />
          </div>
          <span className="font-bold text-xl tracking-tight" style={{ color: "var(--text)" }}>
            Precura
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "var(--accent)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            v2
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Header */}
          <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--divider)" }}>
            <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
              Sign in with BankID
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Secure identification via Mobile BankID
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            {loginState === "idle" && (
              <div className="animate-fade-in">
                <label
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Personal number
                </label>
                <input
                  type="text"
                  value={personnummer}
                  onChange={(e) => setPersonnummer(formatPersonnummer(e.target.value))}
                  placeholder="YYYYMMDD-XXXX"
                  className="w-full px-4 py-3.5 rounded-2xl text-base mb-6"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "16px",
                    letterSpacing: "0.05em",
                  }}
                />

                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                  Demo accounts:
                </p>
                <div className="grid gap-3">
                  <button
                    onClick={() => handleLogin("returning")}
                    className="card-hover w-full flex items-center gap-3 p-4 rounded-2xl text-left"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "var(--accent-light)",
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      AB
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        Anna Bergstrom
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Returning member - full data
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLogin("new")}
                    className="card-hover w-full flex items-center gap-3 p-4 rounded-2xl text-left"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "var(--teal-bg)",
                        color: "var(--teal-text)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      EL
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        Erik Lindqvist
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        New user - starts onboarding
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {loginState === "verifying" && (
              <div className="animate-fade-in flex flex-col items-center py-10">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
                  style={{ background: "var(--blue-bg)" }}
                >
                  <Smartphone size={28} className="animate-pulse-slow" style={{ color: "var(--blue)" }} />
                </div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Open BankID on your device
                </p>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Verifying {selectedDemo === "returning" ? "Anna Bergstrom" : "Erik Lindqvist"}
                </p>
                <Loader2 size={20} className="animate-spin" style={{ color: "var(--text-muted)" }} />
              </div>
            )}

            {loginState === "success" && (
              <div className="animate-scale-in flex flex-col items-center py-10">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
                  style={{ background: "var(--green-bg)" }}
                >
                  <CheckCircle2 size={28} style={{ color: "var(--green)" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--green-text)" }}>
                  Verified
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Smith Prototypes */}
        <div className="mt-8">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Agent Smith Prototypes</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>10 independent product visions</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 1, name: "Blood Tests", style: "Werlabs killer", color: "#1e6bb8", bg: "#eef5fc" },
              { id: 2, name: "Your Doctor", style: "Doctor-first", color: "#0d8a72", bg: "#f0faf7" },
              { id: 3, name: "One Number", style: "Health score", color: "#1a1a1a", bg: "#f0f0f0" },
              { id: 4, name: "Train To Prevent", style: "Fitness + health", color: "#e8550f", bg: "#fff4ee" },
              { id: 5, name: "Break The Pattern", style: "Family health", color: "#6b21a8", bg: "#f5f0ff" },
              { id: 6, name: "Better 1177", style: "Swedish standard", color: "#1862a5", bg: "#edf4ff" },
              { id: 7, name: "Connect The Dots", style: "Health timeline", color: "#0f5959", bg: "#eefaf9" },
              { id: 8, name: "Guided Journey", style: "Coaching program", color: "#2d7a3a", bg: "#f0faf1" },
              { id: 9, name: "Full Picture", style: "Data depth", color: "#3730a3", bg: "#eef2ff" },
              { id: 10, name: "The Trajectory", style: "One chart", color: "#c41c1c", bg: "#fff1f0" },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => router.push(`/smith${a.id}`)}
                className="p-3 rounded-xl text-left transition-all active:scale-95 hover:opacity-80"
                style={{ background: a.bg, border: `1px solid ${a.bg === "#000" ? "#333" : "var(--border)"}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: a.color, fontFamily: "var(--font-mono)" }}>{a.id}</span>
                  <span className="text-xs font-semibold" style={{ color: a.color }}>{a.name}</span>
                </div>
                <p className="text-[10px] mt-1 opacity-60" style={{ color: a.color }}>{a.style}</p>
              </button>
            ))}
          </div>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}
        >
          Demo mode - no real BankID required
        </p>
      </div>
    </div>
  );
}
