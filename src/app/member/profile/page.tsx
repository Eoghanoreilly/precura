"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TopBar } from "@/components/member/TopBar";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import { PATIENT } from "@/lib/v2/mock-patient";

const SETTINGS_GROUPS = [
  {
    title: "Your care",
    items: [
      { label: "Your doctor", value: DOCTOR.name },
      { label: "Membership", value: "Annual, renews 12 Jan 2027" },
      { label: "Next panel", value: "26 July 2026" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Email", value: "anna.bergstrom@example.se" },
      { label: "Phone", value: "+46 70 123 45 67" },
      { label: "Address", value: "Stockholm" },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "Export as FHIR bundle", value: "" },
      { label: "Delete my data", value: "" },
      { label: "Privacy & GDPR", value: "" },
    ],
  },
];

export default function ProfilePage() {
  return (
    <>
      <TopBar userInitials="A" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "28px 22px 8px",
          fontFamily: SYSTEM_FONT,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(26px, 7vw, 32px)",
            lineHeight: 1.15,
            letterSpacing: "-0.028em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 4,
          }}
        >
          {PATIENT?.name ?? "Anna Bergstrom"}
        </h1>
        <div
          style={{
            fontSize: 14,
            color: C.inkMuted,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Member since January 2026
        </div>
      </motion.div>

      {SETTINGS_GROUPS.map((group, gi) => (
        <motion.section
          key={group.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 + gi * 0.08 }}
          style={{
            margin: "22px 20px 0",
            padding: "18px 22px 6px",
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
              color: C.terracotta,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {group.title}
          </div>
          {group.items.map((it, i) => (
            <div
              key={it.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}`,
                fontSize: 14,
              }}
            >
              <span style={{ color: C.inkSoft, fontWeight: 500 }}>
                {it.label}
              </span>
              <span style={{ color: C.inkMuted, fontWeight: 500 }}>
                {it.value}
              </span>
            </div>
          ))}
        </motion.section>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        style={{
          padding: "32px 22px 40px",
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
    </>
  );
}
