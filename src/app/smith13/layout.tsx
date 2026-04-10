"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEGMENTS = [
  { href: "/smith13", label: "Summary" },
  { href: "/smith13/blood-tests", label: "Blood Work" },
  { href: "/smith13/training", label: "Training" },
  { href: "/smith13/messages", label: "Doctor" },
];

export default function Smith13Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function getActiveSegment() {
    if (pathname === "/smith13") return "/smith13";
    for (const seg of SEGMENTS) {
      if (seg.href !== "/smith13" && pathname.startsWith(seg.href)) return seg.href;
    }
    return "/smith13";
  }

  const active = getActiveSegment();

  return (
    <div
      className="flex flex-col min-h-dvh mx-auto relative"
      style={{
        maxWidth: 430,
        background: "#000000",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* iOS-style top bar */}
      <header className="px-5 pt-4 pb-2" style={{ background: "#000000" }}>
        <div className="flex items-center justify-between mb-4">
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Precura
          </span>
          <Link href="/smith13" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF2D55, #FF6482)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              AB
            </div>
          </Link>
        </div>

        {/* Segmented control */}
        <div
          className="flex items-center gap-0.5 p-1"
          style={{
            background: "#1C1C1E",
            borderRadius: 10,
          }}
        >
          {SEGMENTS.map((seg) => {
            const isActive = active === seg.href;
            return (
              <Link
                key={seg.href}
                href={seg.href}
                className="flex-1 flex items-center justify-center"
                style={{
                  textDecoration: "none",
                  padding: "7px 0",
                  borderRadius: 8,
                  background: isActive ? "#2C2C2E" : "transparent",
                  color: isActive ? "#FFFFFF" : "#98989D",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                {seg.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: "#000000" }}
      >
        {children}
      </main>
    </div>
  );
}
