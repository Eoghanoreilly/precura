"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// ============================================================================
// SideRail - composable sticky rail.
// ============================================================================

export interface SideRailProps {
  logo?: React.ReactNode;
  sections: React.ReactNode[];
}

export function SideRail({ logo, sections }: SideRailProps) {
  return (
    <div className="siderail-root">
      {logo && <div className="siderail-logo">{logo}</div>}
      {sections.map((s, i) => (
        <div key={i} className="siderail-section">
          {s}
        </div>
      ))}

      <style jsx>{`
        .siderail-root {
          padding: var(--sp-7) var(--sp-6);
          font-family: var(--font-sans);
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }
        .siderail-logo {
          margin-bottom: var(--sp-2);
        }
        .siderail-section {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Wordmark - standard Precura logo block
// ============================================================================
export function Wordmark({ href = "/member" }: { href?: string }) {
  return (
    <Link href={href} className="wordmark">
      Precura
      <style jsx>{`
        .wordmark {
          display: inline-block;
          color: var(--ink);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.028em;
          text-decoration: none;
          font-family: var(--font-sans);
        }
      `}</style>
    </Link>
  );
}

// ============================================================================
// IdentityCard - paired user + doctor avatar stack, the trust anchor.
// ============================================================================
export interface IdentityCardProps {
  user: { name: string; initials: string; memberSince: string };
  doctor: { name: string; initials: string; title: string };
}

export function IdentityCard({ user, doctor }: IdentityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="idcard"
    >
      <div className="idrow">
        <div className="idavatar user">{user.initials}</div>
        <div className="idtext">
          <div className="idname">{user.name}</div>
          <div className="idmeta">{user.memberSince}</div>
        </div>
      </div>
      <div className="idhr" />
      <div className="idrow doc">
        <div className="idavatar doc">{doctor.initials}</div>
        <div className="idtext">
          <div className="idname">{doctor.name}</div>
          <div className="idmeta sage">{doctor.title}</div>
        </div>
      </div>

      <style jsx>{`
        .idcard {
          background: var(--paper);
          border-radius: var(--radius-card);
          border: 1px solid var(--line-card);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          font-family: var(--font-sans);
        }
        .idrow {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: 14px 16px;
        }
        .idrow.doc {
          background: var(--sage-tint);
        }
        .idhr {
          height: 1px;
          background: var(--line-soft);
          margin: 0 16px;
        }
        .idavatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          flex-shrink: 0;
          box-shadow: var(--shadow-soft);
        }
        .idavatar.user {
          background: linear-gradient(135deg, var(--butter-soft) 0%, var(--terracotta-soft) 100%);
        }
        .idavatar.doc {
          background: linear-gradient(135deg, var(--sage) 0%, var(--sage-deep) 100%);
          color: var(--canvas-soft);
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(68, 90, 74, 0.28);
        }
        .idtext {
          flex: 1;
          min-width: 0;
        }
        .idname {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.005em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .idmeta {
          font-size: 11px;
          color: var(--ink-faint);
        }
        .idmeta.sage {
          color: var(--sage-deep);
          letter-spacing: -0.005em;
        }
      `}</style>
    </motion.div>
  );
}

// ============================================================================
// NextPanelHint - small eyebrow/headline/subtext triple.
// ============================================================================
export interface NextPanelHintProps {
  eyebrow: string;
  headline: string;
  subtext: string;
}

export function NextPanelHint({ eyebrow, headline, subtext }: NextPanelHintProps) {
  return (
    <div className="nph">
      <div className="nph-eyebrow">{eyebrow}</div>
      <div className="nph-headline">{headline}</div>
      <div className="nph-subtext">{subtext}</div>
      <style jsx>{`
        .nph {
          padding: 0 4px;
          font-family: var(--font-sans);
        }
        .nph-eyebrow {
          font-size: 10px;
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .nph-headline {
          font-size: 15px;
          font-weight: 500;
          color: var(--ink-soft);
          letter-spacing: -0.008em;
          margin-bottom: 2px;
        }
        .nph-subtext {
          font-size: 11px;
          color: var(--ink-faint);
          font-style: italic;
          font-family: var(--font-serif);
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// RailNav - vertical nav with terracotta active indicator
// ============================================================================
export interface RailNavItem {
  label: string;
  href: string;
}
export interface RailNavProps {
  items: RailNavItem[];
  activeHref?: string;
}

export function RailNav({ items, activeHref }: RailNavProps) {
  return (
    <nav className="railnav">
      {items.map((it) => {
        const active = it.href === activeHref;
        return (
          <Link
            key={it.label}
            href={it.href}
            className={active ? "railnav-item active" : "railnav-item"}
          >
            <span className="railnav-indicator" />
            {it.label}
          </Link>
        );
      })}
      <style jsx>{`
        .railnav {
          font-family: var(--font-sans);
          padding-top: 4px;
          display: flex;
          flex-direction: column;
        }
        .railnav-item {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: 10px 4px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-muted);
          text-decoration: none;
          letter-spacing: -0.008em;
        }
        .railnav-item.active {
          font-weight: 700;
          color: var(--ink);
        }
        .railnav-indicator {
          width: 4px;
          height: 20px;
          background: transparent;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .railnav-item.active .railnav-indicator {
          background: var(--terracotta);
          box-shadow: 0 2px 6px rgba(201, 87, 58, 0.35);
        }
      `}</style>
    </nav>
  );
}
