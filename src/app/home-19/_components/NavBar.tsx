"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * NAVBAR - Sticky, translucent when scrolled. Airbnb-style rounded pill
 * CTA on the right. Simple, quiet, leaves the hero its space.
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
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
        background: scrolled ? "rgba(250,246,236,0.82)" : "transparent",
        borderBottom: scrolled
          ? `1px solid ${C.line}`
          : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
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
        <Link
          href="/home-19"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: C.coral,
              display: "grid",
              placeItems: "center",
              color: C.paper,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.015em",
            }}
          >
            Precura
          </span>
        </Link>

        <nav
          className="home19-navlinks"
          style={{ display: "flex", gap: 34, alignItems: "center" }}
        >
          <a
            href="#how"
            style={{
              ...TYPE.small,
              color: C.inkSoft,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            How it works
          </a>
          <a
            href="#science"
            style={{
              ...TYPE.small,
              color: C.inkSoft,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Science
          </a>
          <a
            href="#pricing"
            style={{
              ...TYPE.small,
              color: C.inkSoft,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Pricing
          </a>
          <a
            href="#faq"
            style={{
              ...TYPE.small,
              color: C.inkSoft,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            FAQ
          </a>
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href="/login"
            className="home19-signin"
            style={{
              ...TYPE.small,
              color: C.inkSoft,
              fontWeight: 500,
              textDecoration: "none",
              padding: "10px 4px",
            }}
          >
            Sign in
          </a>
          <a
            href="#pricing"
            style={{
              ...TYPE.small,
              color: C.paper,
              fontWeight: 600,
              textDecoration: "none",
              padding: "11px 20px",
              borderRadius: 100,
              background: C.ink,
              transition: "transform 0.2s ease, background 0.2s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = C.coralDeep)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = C.ink)
            }
          >
            Start membership
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 880px) {
          :global(.home19-navlinks) {
            display: none !important;
          }
          :global(.home19-signin) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
