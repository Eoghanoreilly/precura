"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * Floating nav bar. Starts transparent over the hero, solidifies
 * into a pill as the page scrolls past the first viewport.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        width: "min(1280px, calc(100% - 32px))",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: scrolled ? "14px 22px" : "20px 28px",
          borderRadius: 100,
          background: scrolled
            ? "rgba(245, 239, 228, 0.85)"
            : "rgba(245, 239, 228, 0.0)",
          backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          border: `1px solid ${scrolled ? "rgba(12,14,11,0.08)" : "transparent"}`,
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          style={{
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: C.ink,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Precura
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: 50,
              background: C.amber,
            }}
          />
        </div>

        <nav
          style={{
            display: "flex",
            gap: 32,
            alignItems: "center",
            ...TYPE.small,
            color: C.inkSoft,
          }}
          className="home10-nav"
        >
          <a href="#problem" style={linkStyle}>
            The problem
          </a>
          <a href="#how" style={linkStyle}>
            How it works
          </a>
          <a href="#science" style={linkStyle}>
            Science
          </a>
          <a href="#pricing" style={linkStyle}>
            Pricing
          </a>
          <Link
            href="/onboarding"
            style={{
              ...TYPE.small,
              color: C.cream,
              background: C.ink,
              textDecoration: "none",
              padding: "10px 18px",
              borderRadius: 100,
              fontWeight: 500,
            }}
          >
            Get your risk profile
          </Link>
        </nav>
      </div>
      <style jsx>{`
        @media (max-width: 840px) {
          :global(.home10-nav) {
            display: none !important;
          }
        }
      `}</style>
    </motion.header>
  );
}

const linkStyle: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
};
