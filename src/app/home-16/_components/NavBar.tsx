"use client";

import React, { useEffect, useState } from "react";
import { COLORS, SYSTEM_FONT } from "./tokens";

/**
 * Airbnb-style top nav: white background with soft shadow once scrolled.
 * Left: Precura wordmark. Middle: category links. Right: sign-in + CTA pill.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "How it works", href: "#how-it-works" },
    { label: "What you get", href: "#what-you-get" },
    { label: "Science", href: "#science" },
    { label: "Members", href: "#members" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(253,248,240,0.92)" : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${COLORS.line}`
          : "1px solid transparent",
        fontFamily: SYSTEM_FONT,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {/* Wordmark */}
        <a
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: COLORS.ink,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: COLORS.coral,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            P
          </span>
          Precura
        </a>

        {/* Middle links - desktop only */}
        <div
          className="home16-nav-links"
          style={{
            display: "flex",
            gap: 28,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: COLORS.inkSoft,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="#login"
            className="home16-nav-login"
            style={{
              color: COLORS.ink,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Sign in
          </a>
          <a
            href="#pricing"
            style={{
              background: COLORS.ink,
              color: "#FFFFFF",
              padding: "10px 18px",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              transition: "background 0.2s",
            }}
          >
            Start membership
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-nav-links) {
            display: none !important;
          }
          :global(.home16-nav-login) {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
