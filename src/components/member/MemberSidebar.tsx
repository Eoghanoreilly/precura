"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

// ============================================================================
// MemberSidebar - sticky left rail shown at >=1024px.
// Renders: logo, user identity, doctor sidecard, next panel, nav.
// ============================================================================

export interface MemberSidebarProps {
  user: {
    name: string;
    initials: string;
    memberSince: string;
  };
  doctor: {
    name: string;
    initials: string;
    title: string;
  };
  nextPanel: {
    eyebrow: string;
    headline: string;
    subtext: string;
  };
  activeHref?: string;
}

const NAV_ITEMS = [
  { label: "Home", href: "/member" },
  { label: "Discuss", href: "/member/discuss" },
  { label: "Blood panels", href: "/member/panels" },
  { label: "Notes", href: "/member/messages" },
  { label: "Training", href: "/member/training" },
  { label: "Settings", href: "/member/profile" },
];

export function MemberSidebar({
  user,
  doctor,
  nextPanel,
  activeHref = "/member",
}: MemberSidebarProps) {
  return (
    <div
      style={{
        padding: "28px 26px 28px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div>
        {/* Logo */}
        <Link
          href="/member"
          style={{
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              color: C.ink,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.028em",
              fontFamily: SYSTEM_FONT,
            }}
          >
            Precura
          </span>
        </Link>

        {/* Identity pair: user on top, hairline, doctor below. Single container
            so the relationship reads as one object (you + your doctor) rather
            than two disconnected widgets. Stronger shadow than supporting
            cards so the humans land first in the sidebar visual hierarchy. */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: C.paper,
            borderRadius: 18,
            border: `1px solid ${C.lineCard}`,
            boxShadow:
              "0 1px 2px rgba(28,26,23,0.04), 0 18px 40px rgba(28,26,23,0.10)",
            overflow: "hidden",
            marginBottom: 26,
            fontFamily: SYSTEM_FONT,
          }}
        >
          {/* User row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px 14px",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.ink,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                boxShadow: C.shadowSoft,
                flexShrink: 0,
              }}
            >
              {user.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: C.inkFaint }}>
                {user.memberSince}
              </div>
            </div>
          </div>

          {/* Hairline connector */}
          <div
            style={{
              height: 1,
              background: C.lineSoft,
              marginLeft: 16,
              marginRight: 16,
            }}
          />

          {/* Doctor row - sage ground marks it as medical trust */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px 14px",
              background: C.sageTint,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.canvasSoft,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(68,90,74,0.28)",
                flexShrink: 0,
              }}
            >
              {doctor.initials}
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
                {doctor.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.sageDeep,
                  letterSpacing: "-0.005em",
                }}
              >
                {doctor.title}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next panel - demoted to borderless listing so the identity card
            wins the sidebar visual hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            padding: "0 4px",
            marginBottom: 28,
            fontFamily: SYSTEM_FONT,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.inkFaint,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            {nextPanel.eyebrow}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: C.inkSoft,
              letterSpacing: "-0.008em",
              marginBottom: 2,
            }}
          >
            {nextPanel.headline}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.inkFaint,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            {nextPanel.subtext}
          </div>
        </motion.div>

        {/* Nav - lighter, borderless, lets the content win. Active item
            gets a thicker terracotta bar + bold + full ink color so the
            indicator registers. */}
        <nav
          style={{
            fontFamily: SYSTEM_FONT,
            paddingTop: 4,
          }}
        >
          {NAV_ITEMS.map((it) => {
            const active = it.href === activeHref;
            return (
              <Link
                key={it.label}
                href={it.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 4px",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? C.ink : C.inkMuted,
                  textDecoration: "none",
                  letterSpacing: "-0.008em",
                }}
              >
                {/* Thicker left indicator on active */}
                <span
                  style={{
                    width: 4,
                    height: 20,
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
      </div>
    </div>
  );
}
