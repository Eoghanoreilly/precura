"use client";

import React, { useState, useEffect } from "react";

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

export default function Smith7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeYear, setActiveYear] = useState("2026");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 300;
      for (const year of YEARS) {
        const el = document.getElementById(`year-${year}`);
        if (el && el.offsetTop <= scrollY) {
          setActiveYear(year);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpTo = (year: string) => {
    const el = document.getElementById(`year-${year}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  return (
    <div
      style={{
        background: "#FFFBF5",
        color: "#3E2723",
        minHeight: "100dvh",
      }}
    >
      {children}

      {/* Floating year-jump control - bottom right */}
      <div className="fixed z-50" style={{ bottom: 24, right: 24 }}>
        {isOpen && (
          <div
            className="flex flex-col gap-1 mb-2"
            style={{
              background: "#FAF8F5",
              border: "1px solid #D7CCC8",
              borderRadius: 12,
              padding: 6,
              boxShadow: "0 4px 20px rgba(62,39,35,0.18)",
              animation: "fadeIn 0.2s ease forwards",
            }}
          >
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => jumpTo(year)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: activeYear === year ? 700 : 400,
                  fontFamily: '"Lora", Georgia, serif',
                  background:
                    activeYear === year
                      ? "rgba(45,106,79,0.12)"
                      : "transparent",
                  color: activeYear === year ? "#2D6A4F" : "#6D6B63",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            border: "1px solid #D7CCC8",
            background: "#2D6A4F",
            color: "#FFFBF5",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: '"Lora", Georgia, serif',
            boxShadow: "0 4px 16px rgba(45,106,79,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          {isOpen ? "+" : activeYear}
        </button>
      </div>
    </div>
  );
}
