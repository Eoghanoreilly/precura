"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { id: "oversikt", label: "Oversikt", path: "/smith6" },
  { id: "provresultat", label: "Provresultat", path: "/smith6/provresultat" },
  { id: "halsodata", label: "Halsodata", path: "/smith6/halsodata" },
  { id: "meddelanden", label: "Meddelanden", path: "/smith6/meddelanden" },
  { id: "riskbedomning", label: "Riskbedomning", path: "/smith6/riskbedomning" },
];

export default function Smith6Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = TABS.find((t) => t.path === pathname)?.id || "oversikt";

  return (
    <div style={{ background: "#EDF2F7", minHeight: "100dvh", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* Top header bar */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #D1E9F6",
          boxShadow: "0 1px 2px rgba(13,58,111,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {/* Logo + user row */}
          <div className="flex items-center justify-between" style={{ height: 64 }}>
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  background: "#0891B2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                P
              </div>
              <span style={{ color: "#0D3A6F", fontWeight: 700, fontSize: 22 }}>Precura</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: "#4B7BA7", fontSize: 16 }}>Anna Bergstrom</span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  background: "#D1E9F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0D3A6F",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                AB
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex" style={{ gap: 0, marginTop: -1 }}>
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.path)}
                  style={{
                    padding: "12px 20px",
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0891B2" : "#4B7BA7",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? "3px solid #0891B2" : "3px solid transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    minHeight: 48,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
        {children}
      </main>
    </div>
  );
}
