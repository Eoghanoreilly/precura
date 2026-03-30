"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TestTube,
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
import { PANELS } from "@/lib/blood-test-data";

type ViewState = "browse" | "confirm" | "success";

export default function BloodTestsPage() {
  const router = useRouter();
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>("browse");

  const selected = PANELS.find((p) => p.id === selectedPanel);

  function handleOrder(panelId: string) {
    setSelectedPanel(panelId);
    setViewState("confirm");
  }

  function handleConfirm() {
    setViewState("success");
  }

  function handleClose() {
    setSelectedPanel(null);
    setViewState("browse");
  }

  const steps = [
    {
      icon: Package,
      title: "Order online",
      desc: "Select your panel and pay securely. No referral needed.",
      color: "purple",
    },
    {
      icon: MapPin,
      title: "Visit partner lab",
      desc: "Walk in to any Unilabs location in Sweden. No appointment required.",
      color: "teal",
    },
    {
      icon: Clock,
      title: "Results in 3-5 days",
      desc: "Your results appear in Precura with AI-powered interpretation.",
      color: "amber",
    },
  ];

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div className="flex items-center gap-2">
          <TestTube size={18} style={{ color: "var(--teal)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Blood Tests
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        {/* Intro */}
        <div className="animate-fade-in">
          <h1
            className="text-xl font-bold tracking-tight mb-1"
            style={{ color: "var(--text)" }}
          >
            Blood Tests
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Order targeted panels based on your risk profile. No referral needed.
          </p>
        </div>

        {/* Panels */}
        {PANELS.map((panel, i) => (
          <div
            key={panel.id}
            className={`animate-fade-in-up stagger-${i + 1} rounded-2xl overflow-hidden`}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0,
            }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    {panel.name}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {panel.description}
                  </p>
                </div>
                <div
                  className="ml-3 px-3 py-1 rounded-lg text-sm font-bold shrink-0"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "var(--bg-elevated)",
                    color: "var(--text)",
                  }}
                >
                  {panel.price} SEK
                </div>
              </div>

              {/* Expandable test list */}
              <button
                onClick={() =>
                  setExpandedPanel(expandedPanel === panel.id ? null : panel.id)
                }
                className="flex items-center gap-1 text-xs font-medium mt-2 mb-3"
                style={{ color: "var(--purple-text)" }}
              >
                {expandedPanel === panel.id ? (
                  <>
                    Hide tests <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    {panel.tests.length} tests included <ChevronDown size={14} />
                  </>
                )}
              </button>

              {expandedPanel === panel.id && (
                <div className="space-y-2 mb-3 animate-fade-in">
                  {panel.tests.map((test) => (
                    <div
                      key={test.shortName}
                      className="flex items-start gap-2 px-3 py-2 rounded-lg"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: "var(--teal)" }}
                      />
                      <div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {test.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {test.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order button */}
              <button
                onClick={() => handleOrder(panel.id)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "var(--purple)",
                  color: "white",
                }}
              >
                Order
              </button>
            </div>
          </div>
        ))}

        {/* View sample results */}
        <Link
          href="/blood-tests/results"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium animate-fade-in"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--purple-text)",
          }}
        >
          <FileText size={16} />
          View Sample Results
        </Link>
      </main>

      {/* Confirmation Modal */}
      {(viewState === "confirm" || viewState === "success") && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl animate-fade-in-up overflow-y-auto"
            style={{
              background: "var(--bg-card)",
              maxHeight: "85dvh",
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--divider)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {viewState === "success" ? "Order Confirmed" : "Confirm Order"}
              </p>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--bg-elevated)" }}
              >
                <X size={16} style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>

            <div className="p-5">
              {viewState === "success" ? (
                <div className="animate-scale-in flex flex-col items-center py-6 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "var(--green-bg)" }}
                  >
                    <CheckCircle2 size={28} style={{ color: "var(--green)" }} />
                  </div>
                  <p
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    Order confirmed!
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    You&apos;ll receive instructions by email with your nearest
                    lab location and what to bring.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: "var(--purple)",
                      color: "white",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Selected panel info */}
                  {selected && (
                    <div
                      className="rounded-xl p-4 mb-5"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {selected.name}
                        </p>
                        <p
                          className="text-sm font-bold"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "var(--text)",
                          }}
                        >
                          {selected.price} SEK
                        </p>
                      </div>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {selected.tests.length} tests included
                      </p>
                    </div>
                  )}

                  {/* How it works */}
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    How it works
                  </p>
                  <div className="space-y-3 mb-6">
                    {steps.map((step, i) => (
                      <div key={step.title} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: `var(--${step.color}-bg)`,
                            }}
                          >
                            <step.icon
                              size={16}
                              style={{ color: `var(--${step.color})` }}
                            />
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className="w-px h-4 mt-1"
                              style={{ background: "var(--border)" }}
                            />
                          )}
                        </div>
                        <div className="pt-1">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {i + 1}. {step.title}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Confirm button */}
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: "var(--purple)",
                      color: "white",
                    }}
                  >
                    Confirm Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
