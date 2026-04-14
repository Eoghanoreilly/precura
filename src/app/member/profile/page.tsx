"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";

// Profile is a relationship page, not a Stripe settings tab.
// It opens with "hello, Anna", names the doctor and the work he's done,
// tells a one-line story about where Anna is in her care journey, and
// only THEN lists the account-level details.

const CARE_FACTS = [
  { label: "Panels reviewed", value: "2" },
  { label: "Notes from Dr. Tomas", value: "3" },
  { label: "Messages exchanged", value: "14" },
  { label: "Training weeks completed", value: "10" },
];

const ACCOUNT = [
  { label: "Email", value: "anna.bergstrom@example.se" },
  { label: "Phone", value: "+46 70 123 45 67" },
  { label: "Address", value: "Stockholm" },
  { label: "Membership", value: "Annual, renews 12 Jan 2027" },
];

const DATA_ACTIONS = [
  {
    label: "Export everything as a FHIR bundle",
    hint: "A single file with every panel, note, and message. Yours to keep.",
  },
  {
    label: "Privacy & GDPR",
    hint: "Where your data lives, who can see it, how we protect it.",
  },
  {
    label: "Delete my account",
    hint: "Removes your data from our servers. Not reversible.",
  },
];

const SIDEBAR: MemberSidebarProps = {
  user: {
    name: "Anna Bergstrom",
    initials: "A",
    memberSince: "Member since Jan 2026",
  },
  doctor: {
    name: DOCTOR.name,
    initials: DOCTOR.initials,
    title: DOCTOR.title,
  },
  nextPanel: {
    eyebrow: "Next panel",
    headline: "26 July 2026",
    subtext: "Kit ships 19 July",
  },
  activeHref: "/member/profile",
};

export default function ProfilePage() {
  return (
    <MemberShell sidebar={SIDEBAR} userInitials="A">
      {/* Hero: plain-English welcome, not a form header */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "28px 22px 8px",
          fontFamily: SYSTEM_FONT,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 42px)",
            lineHeight: 1.12,
            letterSpacing: "-0.028em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 6,
          }}
        >
          Hello, Anna.{" "}
          <span
            style={{
              color: C.inkMuted,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 500,
            }}
          >
            You&apos;ve been with Precura since January.
          </span>
        </h1>
      </motion.section>

      {/* Care summary - the relationship, in four facts */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{
          margin: "14px 20px 22px",
          padding: "22px 22px 18px",
          background: C.sageTint,
          border: `1px solid ${C.sageSoft}`,
          borderRadius: 22,
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
          The work so far
        </div>
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.5,
            color: C.ink,
            marginBottom: 18,
            letterSpacing: "-0.01em",
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: "italic",
          }}
        >
          &ldquo;Your glucose has been drifting since 2022. We caught it in
          January, started tracking it properly, and we&apos;re going to turn
          it around.&rdquo;
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: C.sageDeep,
            marginBottom: 16,
            letterSpacing: "0.02em",
          }}
        >
          Dr. Tomas Kurakovas, your doctor
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
            paddingTop: 16,
            borderTop: `1px solid ${C.sageSoft}`,
          }}
        >
          {CARE_FACTS.map((f) => (
            <div key={f.label}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: C.sageDeep,
                  letterSpacing: "-0.015em",
                  lineHeight: 1,
                  marginBottom: 4,
                  fontFamily:
                    '"SF Mono", SFMono-Regular, ui-monospace, monospace',
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {f.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.inkMuted,
                  letterSpacing: "0.02em",
                }}
              >
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Account details - warm card, not a spreadsheet */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        style={{
          margin: "0 20px 22px",
          padding: "20px 22px",
          background: C.paper,
          border: `1px solid ${C.lineCard}`,
          borderRadius: 22,
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
            marginBottom: 14,
          }}
        >
          Account
        </div>
        {ACCOUNT.map((it, i) => (
          <div
            key={it.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}`,
              fontSize: 14,
              fontFamily: SYSTEM_FONT,
              gap: 16,
            }}
          >
            <span style={{ color: C.inkMuted, fontWeight: 500 }}>
              {it.label}
            </span>
            <span
              style={{
                color: C.ink,
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              {it.value}
            </span>
          </div>
        ))}
      </motion.section>

      {/* Data + privacy - each action gets a one-line plain-English hint */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.32 }}
        style={{
          margin: "0 20px 28px",
          padding: "20px 22px 6px",
          background: C.paper,
          border: `1px solid ${C.lineCard}`,
          borderRadius: 22,
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
            marginBottom: 14,
          }}
        >
          Your data
        </div>
        {DATA_ACTIONS.map((a, i) => (
          <button
            key={a.label}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "14px 0",
              borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}`,
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: SYSTEM_FONT,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.ink,
                marginBottom: 4,
                letterSpacing: "-0.005em",
              }}
            >
              {a.label}
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.inkMuted,
                lineHeight: 1.45,
              }}
            >
              {a.hint}
            </div>
          </button>
        ))}
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          padding: "8px 22px 40px",
          textAlign: "center",
          fontFamily: SYSTEM_FONT,
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "11px 22px",
            border: `1px solid ${C.lineCard}`,
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            color: C.inkMuted,
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
        >
          Sign out
        </Link>
      </motion.div>
    </MemberShell>
  );
}
