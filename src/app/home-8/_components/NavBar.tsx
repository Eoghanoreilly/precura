"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { colors, fontStack } from "./tokens";

/**
 * NAV - fixed minimal top bar. Becomes opaque after 80px of scroll.
 */
export default function NavBar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: fontStack.display,
        background: solid ? `${colors.ivory}dd` : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
        borderBottom: solid ? `1px solid ${colors.inkLine}` : "1px solid transparent",
        transition: "background 0.3s ease, border 0.3s ease",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: colors.ink,
        }}
      >
        precura<span style={{ color: colors.amber }}>.</span>
      </div>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {["How", "Science", "Pricing", "FAQ"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              fontSize: "13px",
              color: colors.inkSoft,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {l}
          </a>
        ))}
        <a
          href="#signup"
          style={{
            padding: "10px 20px",
            background: colors.ink,
            color: colors.ivory,
            borderRadius: "100px",
            fontSize: "13px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Start / 995 SEK
        </a>
      </div>
    </motion.nav>
  );
}
