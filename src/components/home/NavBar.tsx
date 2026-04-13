"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * Slim warm nav. Airbnb feel - logo left, links center, CTA right.
 * No glassy/frosted effect on top; turns subtle background on scroll.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "18px 32px",
        background: scrolled ? "rgba(251,247,240,0.88)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.line}` : "1px solid transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: C.ink,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.terracotta,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.canvasSoft,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Precura
          </span>
        </Link>

        {/* Center links */}
        <div
          className="home17-nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          {[
            { label: "How it works", href: "#how" },
            { label: "What you get", href: "#whatyouget" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.inkSoft,
                textDecoration: "none",
                letterSpacing: "-0.005em",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="#pricing"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: C.inkSoft,
              textDecoration: "none",
            }}
            className="home17-nav-signin"
          >
            Sign in
          </Link>
          <Link
            href="#pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 20px",
              background: C.ink,
              color: C.canvasSoft,
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            Become a member
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home17-nav-links) {
            display: none !important;
          }
          :global(.home17-nav-signin) {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
