"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(246,241,232,0.92)" : "transparent",
        backdropFilter: scrolled ? "saturate(160%) blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(160%) blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.lineFaint}` : "1px solid transparent",
        transition: "all 0.3s ease",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link
          href="/home-20"
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
              width: 32,
              height: 32,
              borderRadius: 10,
              background: C.terra,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.creamSoft,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "-0.02em",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Precura
          </span>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
          className="home20-nav-links"
        >
          <a href="#included" style={linkStyle}>What you get</a>
          <a href="#how" style={linkStyle}>How it works</a>
          <a href="#science" style={linkStyle}>Science</a>
          <a href="#pricing" style={linkStyle}>Membership</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="#pricing"
            style={{
              padding: "10px 20px",
              background: C.ink,
              color: C.creamSoft,
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              transition: "background 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Start membership
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home20-nav-links) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

const linkStyle: React.CSSProperties = {
  ...TYPE.small,
  color: C.inkSoft,
  textDecoration: "none",
  fontWeight: 500,
};
