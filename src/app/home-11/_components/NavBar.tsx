"use client";

import { useEffect, useState } from "react";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * NavBar - Minimal top chrome. Hairline border on scroll. No pill CTA.
 * Wordmark + four links + a plain text "Begin" link.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(250, 250, 247, 0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? `1px solid ${C.inkHairline}`
          : "1px solid transparent",
        transition: "all 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: C.ink,
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="8" stroke={C.ink} strokeWidth="1.25" />
          <path
            d="M4 10.5 Q 6 7 9 9 T 14 6"
            stroke={C.ink}
            strokeWidth="1.25"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        Precura
      </div>

      {/* Center links - hidden on mobile */}
      <div
        className="home11-navlinks"
        style={{
          display: "flex",
          gap: 36,
          alignItems: "center",
          fontSize: 14,
          color: C.inkSoft,
          fontWeight: 400,
          letterSpacing: "-0.005em",
        }}
      >
        <a href="#profile" style={{ color: "inherit", textDecoration: "none" }}>
          The profile
        </a>
        <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>
          How it works
        </a>
        <a href="#science" style={{ color: "inherit", textDecoration: "none" }}>
          Science
        </a>
        <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>
          Pricing
        </a>
      </div>

      {/* Quiet primary: plain text link, never a button */}
      <a
        href="#pricing"
        style={{
          color: C.ink,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "-0.005em",
          borderBottom: `1px solid ${C.ink}`,
          paddingBottom: 2,
        }}
      >
        Begin
      </a>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home11-navlinks) {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
