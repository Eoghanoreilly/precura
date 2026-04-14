"use client";

import React, { useState, useEffect } from "react";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "family-tree", label: "Family" },
  { id: "timeline", label: "Timeline" },
  { id: "risks", label: "Risks" },
  { id: "training", label: "Plan" },
  { id: "action", label: "Act" },
];

export default function Smith5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        background: "#1A0F2E",
        color: "#F8F4FB",
        minHeight: "100dvh",
      }}
    >
      {/* Floating jump-to pill menu */}
      <nav
        className="fixed bottom-6 left-1/2 z-50 flex items-center gap-1 px-2 py-1.5"
        style={{
          transform: "translateX(-50%)",
          background: "rgba(45, 27, 71, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 28,
          border: "1px solid #472B5E",
          boxShadow: "0 8px 24px rgba(199,125,255,0.15)",
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSection === s.id ? 600 : 400,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              background:
                activeSection === s.id
                  ? "rgba(199,125,255,0.25)"
                  : "transparent",
              color: activeSection === s.id ? "#C77DFF" : "#C9B8D4",
              transition: "all 0.2s ease",
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {children}
    </div>
  );
}
