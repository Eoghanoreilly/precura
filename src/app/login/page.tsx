"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Smartphone, Loader2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { DEMO_USERS, setUser } from "@/lib/auth";
import { initMockReturningUser } from "@/lib/user-state";

type LoginState = "idle" | "verifying" | "success";

export default function LoginPage() {
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
    const user = DEMO_USERS[type];
    setPersonnummer(formatPersonnummer(user.personnummer));
    setLoginState("verifying");

    setTimeout(() => {
      setLoginState("success");
      setTimeout(() => {
        setUser(user);
        if (type === "new") {
          router.push("/member?state=new-member");
        } else {
          initMockReturningUser();
          router.push("/member");
        }
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
        {/* Logo */}
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
                        Returning user - has data
                      </p>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
                </div>

                {/* Try v2 button */}
                <Link
                  href="/v2/login"
                  className="card-hover w-full flex items-center gap-3 p-4 rounded-2xl text-left block"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-light) 0%, var(--purple-bg) 100%)",
                    border: "1px solid var(--accent-light)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--accent)", boxShadow: "var(--shadow-sm)" }}
                  >
                    <Sparkles size={18} style={{ color: "#ffffff" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: "var(--accent-hover)" }}>
                        Try Precura v2
                      </p>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                      >
                        New
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Full platform prototype
                    </p>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--accent)" }} />
                </Link>
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
                  Verifying {selectedDemo === "new" ? "Erik Lindqvist" : "Anna Bergstrom"}
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
