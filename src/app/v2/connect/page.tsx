"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Shield,
  Fingerprint,
  CheckCircle2,
  FileText,
  TestTube2,
  Pill,
  Stethoscope,
  Syringe,
  Lock,
  ArrowRight,
} from "lucide-react";

type PageState = "consent" | "importing" | "complete";

const IMPORT_STEPS = [
  { label: "Importing medical history...", icon: FileText, delay: 0 },
  { label: "Importing blood test results...", icon: TestTube2, delay: 800 },
  { label: "Importing medications...", icon: Pill, delay: 1600 },
  { label: "Importing doctor notes...", icon: Stethoscope, delay: 2400 },
  { label: "Importing vaccinations...", icon: Syringe, delay: 3200 },
];

export default function ConnectPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("consent");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  const startImport = useCallback(() => {
    setPageState("importing");

    IMPORT_STEPS.forEach((_, index) => {
      // Show the step (visible but not yet completed)
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, index]);
      }, IMPORT_STEPS[index].delay);

      // Mark as completed after a brief loading period
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index]);
      }, IMPORT_STEPS[index].delay + 500);
    });

    // All done - show completion
    setTimeout(() => {
      setPageState("complete");
    }, IMPORT_STEPS[IMPORT_STEPS.length - 1].delay + 1000);
  }, []);

  function handleAuthorize() {
    startImport();
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center px-6 py-12"
      style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #fef7ee 50%, #f0fdf4 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-light)", boxShadow: "var(--shadow-sm)" }}
          >
            <Activity size={18} style={{ color: "var(--accent)" }} />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>
            Precura
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            v2
          </span>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Consent state */}
          {pageState === "consent" && (
            <div className="animate-fade-in">
              {/* Header section */}
              <div className="px-6 pt-8 pb-6 text-center">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "var(--blue-bg)" }}
                >
                  <Shield size={28} style={{ color: "var(--blue)" }} />
                </div>
                <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>
                  Connect your health records
                </h1>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Precura can import your medical history from 1177 to build a complete picture
                  of your health. This includes blood test results, medications, doctor notes,
                  vaccinations, and more.
                </p>
              </div>

              {/* Data categories */}
              <div className="px-6 pb-6">
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--divider)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                    Data we will import
                  </p>
                  <div className="grid gap-2.5">
                    {[
                      { icon: FileText, label: "Medical history", color: "var(--blue)" },
                      { icon: TestTube2, label: "Blood test results", color: "var(--teal)" },
                      { icon: Pill, label: "Medications", color: "var(--purple)" },
                      { icon: Stethoscope, label: "Doctor notes", color: "var(--accent)" },
                      { icon: Syringe, label: "Vaccinations", color: "var(--green)" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--bg-card)" }}
                        >
                          <item.icon size={16} style={{ color: item.color }} />
                        </div>
                        <span className="text-sm" style={{ color: "var(--text)" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BankID consent prompt */}
              <div
                className="px-6 py-5 text-center"
                style={{ borderTop: "1px solid var(--divider)", background: "var(--bg-elevated)" }}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Fingerprint size={18} style={{ color: "var(--accent)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Allow Precura to access your health records?
                  </p>
                </div>
                <button
                  onClick={handleAuthorize}
                  className="w-full py-4 rounded-2xl text-sm font-semibold"
                  style={{
                    background: "var(--accent)",
                    color: "#ffffff",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  Authorize with BankID
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <Lock size={12} style={{ color: "var(--text-faint)" }} />
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                    Your data is encrypted and stored securely
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Importing state */}
          {pageState === "importing" && (
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
                  Importing your health data...
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Connecting securely to 1177
                </p>
              </div>
              <div className="grid gap-3">
                {IMPORT_STEPS.map((step, index) => {
                  const isVisible = visibleSteps.includes(index);
                  const isComplete = completedSteps.includes(index);
                  const StepIcon = step.icon;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={step.label}
                      className="animate-fade-in flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background: isComplete ? "var(--green-bg)" : "var(--bg-elevated)",
                        border: `1px solid ${isComplete ? "var(--green-bg)" : "var(--divider)"}`,
                        transition: "background 0.3s ease, border-color 0.3s ease",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isComplete ? "var(--green)" : "var(--bg-card)",
                          transition: "background 0.3s ease",
                        }}
                      >
                        {isComplete ? (
                          <CheckCircle2 size={16} style={{ color: "#ffffff" }} />
                        ) : (
                          <StepIcon size={16} className="animate-pulse-slow" style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                      <span
                        className="text-sm"
                        style={{
                          color: isComplete ? "var(--green-text)" : "var(--text-secondary)",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {isComplete ? step.label.replace("Importing", "Imported").replace("...", "") : step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Complete state */}
          {pageState === "complete" && (
            <div className="animate-fade-in p-6">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 animate-scale-in"
                  style={{ background: "var(--green-bg)" }}
                >
                  <CheckCircle2 size={28} style={{ color: "var(--green)" }} />
                </div>
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
                  Import complete
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  We found 5 years of health data. Let's build your complete health picture.
                </p>
              </div>

              {/* Summary of imported data */}
              <div className="grid gap-2 mb-6">
                {IMPORT_STEPS.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "var(--green-bg)", border: "1px solid var(--green-bg)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--green)" }}
                      >
                        <CheckCircle2 size={16} style={{ color: "#ffffff" }} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--green-text)" }}>
                        {step.label.replace("Importing", "Imported").replace("...", "")}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => router.push("/v2/onboarding")}
                className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Trust footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <Lock size={12} style={{ color: "var(--text-faint)" }} />
          <p
            className="text-center text-xs"
            style={{ color: "var(--text-faint)" }}
          >
            Your data is encrypted and stored securely. You can revoke access at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
