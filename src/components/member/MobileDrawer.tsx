"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { C, SYSTEM_FONT, DOCTOR } from "./tokens";

// ============================================================================
// MobileDrawer - slide-in nav drawer shown below 1024px when the user taps
// the hamburger in the mobile header. Contains logo + nav items + signout.
// Closes on: close button, outside overlay tap, route change, Escape.
// ============================================================================

const NAV_ITEMS = [
  { label: "Home", href: "/member" },
  { label: "Blood panels", href: "/member/panels" },
  { label: "Doctor messages", href: "/member/messages" },
  { label: "Training", href: "/member/training" },
  { label: "Settings", href: "/member/profile" },
];

export function MobileDrawer({
  open,
  onClose,
  activeHref = "/member",
}: {
  open: boolean;
  onClose: () => void;
  activeHref?: string;
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(28,26,23,0.45)",
              zIndex: 100,
            }}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "min(84vw, 320px)",
              background: C.canvas,
              zIndex: 101,
              fontFamily: SYSTEM_FONT,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 60px rgba(28,26,23,0.22)",
            }}
          >
            {/* Drawer header: logo + close */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px 16px",
                borderBottom: `1px solid ${C.lineSoft}`,
              }}
            >
              <Link
                href="/member"
                onClick={onClose}
                style={{
                  color: C.ink,
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.028em",
                  textDecoration: "none",
                }}
              >
                Precura
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  background: "none",
                  border: "none",
                  padding: 6,
                  cursor: "pointer",
                  color: C.inkMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M5 5 L17 17 M17 5 L5 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <nav style={{ padding: "14px 12px", flex: 1 }}>
              {NAV_ITEMS.map((it) => {
                const active = it.href === activeHref;
                return (
                  <Link
                    key={it.label}
                    href={it.href}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 14px",
                      fontSize: 16,
                      fontWeight: active ? 700 : 500,
                      color: active ? C.ink : C.inkMuted,
                      textDecoration: "none",
                      letterSpacing: "-0.008em",
                      borderRadius: 12,
                      background: active ? C.canvasSoft : "transparent",
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 22,
                        background: active ? C.terracotta : "transparent",
                        borderRadius: 2,
                        flexShrink: 0,
                        boxShadow: active
                          ? "0 2px 6px rgba(201,87,58,0.35)"
                          : "none",
                      }}
                    />
                    {it.label}
                  </Link>
                );
              })}
            </nav>

            {/* Doctor footer */}
            <div
              style={{
                padding: "16px 22px 22px",
                borderTop: `1px solid ${C.lineSoft}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.canvasSoft,
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {DOCTOR.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.ink,
                    letterSpacing: "-0.005em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {DOCTOR.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.inkFaint,
                  }}
                >
                  {DOCTOR.title}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
