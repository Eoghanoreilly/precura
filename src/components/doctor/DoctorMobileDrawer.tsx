"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const DOCTOR_NAV_ITEMS = [
  { label: "Home", href: "/doctor" },
  { label: "Patients", href: "/doctor/patients" },
  { label: "Settings", href: "/doctor/settings" },
];

export function DoctorMobileDrawer({
  open,
  onClose,
  activeHref = "/doctor",
}: {
  open: boolean;
  onClose: () => void;
  activeHref?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(28,26,23,0.45)", zIndex: 100 }}
          />
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
              background: "#FDFBF6",
              zIndex: 101,
              fontFamily: "var(--font-sans)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 60px rgba(28,26,23,0.22)",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 22px 16px",
              borderBottom: "1px solid #E0D9C8",
            }}>
              <Link
                href="/doctor"
                onClick={onClose}
                style={{ color: "#1C1A17", fontSize: 20, fontWeight: 600, letterSpacing: "-0.028em", textDecoration: "none" }}
              >
                Precura
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{ background: "none", border: "none", padding: 6, cursor: "pointer", color: "#615C52", display: "flex", alignItems: "center" }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M5 5 L17 17 M17 5 L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav style={{ padding: "14px 12px", flex: 1 }}>
              {DOCTOR_NAV_ITEMS.map((it) => {
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
                      color: active ? "#1C1A17" : "#615C52",
                      textDecoration: "none",
                      letterSpacing: "-0.008em",
                      borderRadius: 12,
                      background: active ? "#F5F0E8" : "transparent",
                    }}
                  >
                    <span style={{
                      width: 4,
                      height: 22,
                      background: active ? "#C9573A" : "transparent",
                      borderRadius: 2,
                      flexShrink: 0,
                      boxShadow: active ? "0 2px 6px rgba(201,87,58,0.35)" : "none",
                    }} />
                    {it.label}
                  </Link>
                );
              })}
            </nav>

            <div style={{
              padding: "16px 22px 22px",
              borderTop: "1px solid #E0D9C8",
            }}>
              <div style={{ fontSize: 11, color: "#8B8579", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Doctor portal
              </div>
              <div style={{ fontSize: 13, color: "#1C1A17", fontWeight: 600 }}>
                Precura clinic
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
