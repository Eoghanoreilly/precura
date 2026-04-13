"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Menu } from "lucide-react";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * Top navigation. Paper surface, thin bottom hairline, subtle elevation
 * on scroll.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: C.paper,
        borderBottom: `1px solid ${scrolled ? C.inkHair : "transparent"}`,
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.04)" : "none",
        transition: "all 0.25s ease",
        fontFamily: SYSTEM_FONT,
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
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            color: C.ink,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(145deg, ${C.lingon} 0%, ${C.lingonDeep} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.paper,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: C.lingon,
            }}
          >
            precura
          </span>
        </Link>

        {/* Center nav pill */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
          className="home18-nav-center"
        >
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#stories">Stories</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              background: "transparent",
              border: "none",
              borderRadius: 100,
              color: C.ink,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Globe size={16} />
            SV
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 8px 8px 14px",
              borderRadius: 100,
              background: C.paper,
              border: `1px solid ${C.inkHair}`,
              color: C.ink,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: C.shadow,
            }}
          >
            <Menu size={14} />
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: C.inkSoft,
                color: C.paper,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              A
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          :global(.home18-nav-center) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        color: C.ink,
        fontSize: 15,
        fontWeight: 500,
        textDecoration: "none",
        transition: "color 0.2s",
      }}
    >
      {children}
    </a>
  );
}
