"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, FONT, MONO, GRID } from "./tokens";

/**
 * NavBar - thin sticky top bar, blur on scroll, 12-column aligned.
 * Deliberately quiet. No oversized CTA, no pill backgrounds.
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: `16px ${GRID.pagePaddingX}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(250, 250, 247, 0.78)" : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
        borderBottom: scrolled ? `1px solid ${C.line}` : "1px solid transparent",
        transition: "background 320ms ease, border-color 320ms ease",
        fontFamily: FONT,
      }}
    >
      <Link
        href="/home-12"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: C.ink,
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: "-0.01em",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke={C.ink} strokeWidth="1.6" />
          <path
            d="M5 13.5 Q 8 9 11 11 T 17 8"
            stroke={C.accent}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        Precura
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: C.inkMuted,
            letterSpacing: "0.1em",
            marginLeft: 6,
            padding: "2px 7px",
            border: `1px solid ${C.line}`,
            borderRadius: 4,
          }}
        >
          BETA
        </span>
      </Link>

      <div
        className="home12-nav-links"
        style={{
          display: "flex",
          gap: 36,
          alignItems: "center",
          fontFamily: FONT,
          fontSize: 14,
          color: C.inkSoft,
        }}
      >
        <a
          href="#how"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          How it works
        </a>
        <a
          href="#profile"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Living profile
        </a>
        <a
          href="#science"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Science
        </a>
        <a
          href="#members"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Members
        </a>
        <a
          href="#pricing"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Pricing
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <a
          href="#"
          style={{
            color: C.inkSoft,
            textDecoration: "none",
            fontFamily: FONT,
            fontSize: 14,
          }}
          className="home12-signin"
        >
          Sign in
        </a>
        <button
          style={{
            padding: "10px 18px",
            background: C.ink,
            color: C.paper,
            border: "none",
            borderRadius: 8,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "-0.005em",
            boxShadow: C.shadowSm,
            transition: "transform 200ms ease, background 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.graphiteSoft;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.ink;
          }}
        >
          Get started
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-nav-links) {
            display: none !important;
          }
          :global(.home12-signin) {
            display: none !important;
          }
        }
      `}</style>
    </motion.nav>
  );
}
