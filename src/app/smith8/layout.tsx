"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const STAGES = [
  { num: 1, label: "Risk Assessment", status: "done" as const },
  { num: 2, label: "Understanding Results", status: "done" as const },
  { num: 3, label: "First Blood Test", status: "done" as const },
  { num: 4, label: "Results + Review", status: "done" as const },
  { num: 5, label: "Starting Training", status: "done" as const },
  { num: 6, label: "Building Habits", status: "done" as const },
  { num: 7, label: "Deepening Practice", status: "current" as const },
  { num: 8, label: "6-Month Check-In", status: "locked" as const },
  { num: 9, label: "Measuring Progress", status: "locked" as const },
  { num: 10, label: "Year Review", status: "locked" as const },
];

function ProgressDots() {
  return (
    <div className="flex items-center justify-center gap-2" style={{ padding: "12px 0" }}>
      {STAGES.map((s, i) => (
        <React.Fragment key={s.num}>
          {i > 0 && (
            <div
              style={{
                width: 16,
                height: 2,
                borderRadius: 1,
                background: s.status === "done" || STAGES[i - 1].status === "done" && s.status === "current"
                  ? "#B794F6"
                  : "#EFE6F8",
              }}
            />
          )}
          <div
            style={{
              width: s.status === "current" ? 14 : 10,
              height: s.status === "current" ? 14 : 10,
              borderRadius: "50%",
              background:
                s.status === "done"
                  ? "#B794F6"
                  : s.status === "current"
                  ? "#B794F6"
                  : "transparent",
              border:
                s.status === "locked"
                  ? "2px solid #EFE6F8"
                  : s.status === "current"
                  ? "3px solid #B794F6"
                  : "none",
              boxShadow:
                s.status === "current"
                  ? "0 0 0 4px rgba(183,148,246,0.25)"
                  : "none",
              transition: "all 0.3s ease",
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Smith8Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isRoot = pathname === "/smith8";

  return (
    <div
      style={{
        background: "#F9F5FC",
        minHeight: "100dvh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        color: "#3D2645",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #EFE6F8",
          boxShadow: "0 2px 6px rgba(183,148,246,0.12)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
          <div className="flex items-center justify-between" style={{ height: 56 }}>
            {!isRoot ? (
              <button
                onClick={() => router.back()}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#B794F6",
                  fontWeight: 500,
                  fontSize: 15,
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#B794F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #B794F6, #9F7AEA)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  P
                </div>
                <span style={{ color: "#3D2645", fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>
                  Precura
                </span>
              </div>
            )}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                background: "#F3EAFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B794F6",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              AB
            </div>
          </div>

          {/* Progress dots */}
          <ProgressDots />
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 100px" }}>
        {children}
      </main>
    </div>
  );
}
