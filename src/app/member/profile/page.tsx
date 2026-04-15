"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";

// Pass 5 full rewrite: no stat tiles, no labeled key/value rows, no form
// cards. A single editorial column of prose with inline facts and underlined
// text links. Reads like a member letter, not a settings page.

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

function EditLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        background: "none",
        border: "none",
        padding: 0,
        fontFamily: "inherit",
        fontSize: "inherit",
        color: C.inkSoft,
        cursor: "pointer",
        textDecoration: "underline",
        textDecorationColor: C.stone,
        textDecorationThickness: 1,
        textUnderlineOffset: 3,
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </button>
  );
}

function Para({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      style={{
        fontSize: "clamp(17px, 1.9vw, 19px)",
        lineHeight: 1.7,
        color: C.inkSoft,
        letterSpacing: "-0.005em",
        margin: 0,
        marginBottom: 22,
        maxWidth: 620,
      }}
    >
      {children}
    </motion.p>
  );
}

export default function ProfilePage() {
  return (
    <MemberShell sidebar={SIDEBAR} userInitials="A">
      <div
        style={{
          padding: "36px 28px 40px",
          fontFamily: SYSTEM_FONT,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "clamp(32px, 5vw, 46px)",
            lineHeight: 1.1,
            letterSpacing: "-0.028em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 10,
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
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 14,
            color: C.inkMuted,
            marginBottom: 34,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          A quiet corner of your membership. Everything about you,
          everything about us, every way out.
        </motion.div>

        <Para delay={0.18}>
          You joined Precura on{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>
            12 January 2026
          </strong>
          . Since then, Dr. Tomas has reviewed{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>two panels</strong>{" "}
          for you, written{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>three notes</strong>
          , and exchanged{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>
            fourteen messages
          </strong>{" "}
          with you. Your next kit ships{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>
            19 July 2026
          </strong>
          , and Dr. Tomas will have your third panel reviewed within 48 hours
          of the lab results landing.
        </Para>

        <Para delay={0.26}>
          Your membership is the{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>
            annual plan
          </strong>{" "}
          at 2,995 SEK, renewing automatically on{" "}
          <strong style={{ color: C.ink, fontWeight: 600 }}>
            12 January 2027
          </strong>
          . You can{" "}
          <EditLink>switch plan</EditLink>,{" "}
          <EditLink>pause billing</EditLink>, or{" "}
          <EditLink>cancel</EditLink>{" "}
          any time from here. If you cancel, your historical data stays yours
          and we&apos;ll keep your profile warm for when you come back.
        </Para>

        <Para delay={0.34}>
          We have you at{" "}
          <EditLink>anna.bergstrom@example.se</EditLink>, on{" "}
          <EditLink>+46 70 123 45 67</EditLink>, shipping kits to{" "}
          <EditLink>an address in Stockholm</EditLink>. Your personnummer is on
          file for the clinic. Anything wrong? Tap any of those to correct it.
        </Para>

        <motion.hr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          style={{
            border: "none",
            borderTop: `1px solid ${C.lineSoft}`,
            margin: "34px 0 28px",
            maxWidth: 620,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
          style={{ maxWidth: 620, marginBottom: 30 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.inkMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Your data, your rights
          </div>

          <div
            style={{
              fontSize: "clamp(16px, 1.8vw, 18px)",
              lineHeight: 1.7,
              color: C.inkSoft,
              letterSpacing: "-0.005em",
            }}
          >
            Your health data lives in the EU on GDPR-compliant infrastructure,
            encrypted at rest and in transit. We never sell, rent, or share it
            with advertisers, insurers, or employers. You can{" "}
            <EditLink>export everything as a FHIR bundle</EditLink> - a single
            file with every panel, note, and message, yours to keep. You can{" "}
            <EditLink>read how we handle your data</EditLink> in plain English.
            You can{" "}
            <EditLink>delete your account</EditLink> and take everything with
            you the moment you decide to.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.58 }}
          style={{
            paddingTop: 24,
            maxWidth: 620,
            fontSize: "clamp(16px, 1.8vw, 18px)",
            color: C.inkMuted,
            lineHeight: 1.6,
            letterSpacing: "-0.005em",
          }}
        >
          Done for now?{" "}
          <Link
            href="/"
            style={{
              color: C.inkSoft,
              textDecoration: "underline",
              textDecorationColor: C.stone,
              textUnderlineOffset: 3,
              fontWeight: 600,
            }}
          >
            Sign out of Precura
          </Link>
          .
        </motion.div>
      </div>
    </MemberShell>
  );
}
