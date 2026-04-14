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
  { label: "Blood panels", href: "#" },
  { label: "Doctor messages", href: "#" },
  { label: "Training", href: "#" },
  { label: "Settings", href: "/member/profile" },
];

export function MemberSidebar({
  user,
  doctor,
  nextPanel,
  activeHref = "/member",
}: MemberSidebarProps) {
  return (
    <aside className="member-sidebar">
      <div className="member-sidebar-inner">
        {/* Logo */}
        <Link
          href="/member"
          style={{
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 32,
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

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            padding: "14px 16px",
            background: C.paper,
            borderRadius: 16,
            border: `1px solid ${C.lineCard}`,
            boxShadow: C.shadowSoft,
            fontFamily: SYSTEM_FONT,
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
        </motion.div>

        {/* Doctor sidecard */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            padding: "16px 18px",
            background: C.sageTint,
            border: `1px solid ${C.sageSoft}`,
            borderRadius: 16,
            marginBottom: 20,
            fontFamily: SYSTEM_FONT,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.sageDeep,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Your doctor
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
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
              <div style={{ fontSize: 11, color: C.sageDeep }}>
                {doctor.title}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next panel card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            padding: "16px 18px",
            background: C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 16,
            marginBottom: 28,
            boxShadow: C.shadowSoft,
            fontFamily: SYSTEM_FONT,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.inkMuted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {nextPanel.eyebrow}
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.01em",
              marginBottom: 2,
            }}
          >
            {nextPanel.headline}
          </div>
          <div style={{ fontSize: 11, color: C.inkFaint }}>
            {nextPanel.subtext}
          </div>
        </motion.div>

        {/* Nav */}
        <nav style={{ fontFamily: SYSTEM_FONT }}>
          {NAV_ITEMS.map((it) => {
            const active = it.href === activeHref;
            return (
              <Link
                key={it.label}
                href={it.href}
                style={{
                  display: "block",
                  padding: "11px 14px",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? C.ink : C.inkMuted,
                  textDecoration: "none",
                  borderRadius: 10,
                  background: active ? C.stoneSoft : "transparent",
                  marginBottom: 2,
                  letterSpacing: "-0.005em",
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
