"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  TestTube,
  Stethoscope,
  ChevronRight,
  Download,
  Trash2,
  LogOut,
  Shield,
} from "lucide-react";
import { getUser, logout } from "@/lib/auth";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUserState(u);
    setMounted(true);
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleDownload() {
    showToast("Preparing your data export...");
  }

  function handleDelete() {
    setShowDeleteConfirm(true);
  }

  function confirmDelete() {
    logout();
    router.push("/");
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!mounted || !user) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="skeleton w-8 h-8 rounded-full" />
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Mask personnummer: show first 8 digits, mask last 4
  const pnr = user.personnummer;
  const maskedPnr =
    pnr.length >= 12
      ? pnr.slice(0, 8) + "-****"
      : pnr;

  const settingsCards = [
    {
      icon: ClipboardList,
      label: "Health Profile",
      detail: "Last updated March 15, 2026",
      href: "/onboarding",
      color: "purple",
    },
    {
      icon: TestTube,
      label: "Blood Tests",
      detail: "1 completed",
      href: "/blood-tests",
      color: "teal",
    },
    {
      icon: Stethoscope,
      label: "Consultations",
      detail: "None scheduled",
      href: "/consultations",
      color: "amber",
    },
  ];

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <Header />

      <main className="flex-1 px-4 py-5 pb-24 max-w-2xl mx-auto w-full space-y-6">
        {/* User info */}
        <div className="animate-fade-in flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold"
            style={{
              background: "var(--purple-bg)",
              color: "var(--purple-text)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {initials}
          </div>
          <div>
            <h1
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {user.name}
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
              }}
            >
              {maskedPnr}
            </p>
          </div>
        </div>

        {/* Settings cards */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Your health
          </p>
          <div
            className="rounded-2xl overflow-hidden animate-fade-in-up stagger-1"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0,
            }}
          >
            {settingsCards.map((card, i) => (
              <Link
                key={card.label}
                href={card.href}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  borderBottom:
                    i < settingsCards.length - 1
                      ? "1px solid var(--divider)"
                      : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `var(--${card.color}-bg)` }}
                >
                  <card.icon
                    size={16}
                    style={{ color: `var(--${card.color})` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {card.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {card.detail}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  style={{ color: "var(--text-faint)" }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Data management */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Data management
          </p>
          <div
            className="rounded-2xl overflow-hidden animate-fade-in-up stagger-2"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0,
            }}
          >
            <button
              onClick={handleDownload}
              className="flex items-center gap-3 px-4 py-3.5 w-full text-left"
              style={{ borderBottom: "1px solid var(--divider)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--blue-bg)" }}
              >
                <Download size={16} style={{ color: "var(--blue)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Download my data
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Export all your health data as JSON
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "var(--text-faint)" }}
              />
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 px-4 py-3.5 w-full text-left"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--red-bg)" }}
              >
                <Trash2 size={16} style={{ color: "var(--red)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--red-text)" }}
                >
                  Delete account
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Permanently remove all data
                </p>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "var(--text-faint)" }}
              />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="animate-fade-in-up stagger-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            opacity: 0,
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>

        {/* Disclaimer */}
        <div
          className="animate-fade-in-up stagger-4 rounded-xl p-4 flex items-start gap-3"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            opacity: 0,
          }}
        >
          <Shield
            size={16}
            className="shrink-0 mt-0.5"
            style={{ color: "var(--text-faint)" }}
          />
          <p
            className="text-xs leading-relaxed"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--text-faint)",
            }}
          >
            Precura is not a medical device. Observations are educational, not
            diagnostic.
          </p>
        </div>
      </main>

      <BottomNav />

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium animate-fade-in-up"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 animate-scale-in"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "var(--red-bg)" }}
            >
              <Trash2 size={20} style={{ color: "var(--red)" }} />
            </div>
            <h3
              className="text-base font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              Delete your account?
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              This will permanently delete all your health data, assessments, and
              test results. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "var(--red)",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
