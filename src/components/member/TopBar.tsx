"use client";

import React from "react";
import Link from "next/link";
import { C, SYSTEM_FONT } from "./tokens";

export function TopBar({ userInitials = "A" }: { userInitials?: string }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px 14px",
        background: "transparent",
        fontFamily: SYSTEM_FONT,
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      <Link href="/member" style={{ textDecoration: "none" }}>
        <span
          style={{
            color: C.ink,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.028em",
          }}
        >
          Precura
        </span>
      </Link>

      <Link href="/member/profile" style={{ textDecoration: "none" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.ink,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            boxShadow: C.shadowSoft,
          }}
        >
          {userInitials}
        </div>
      </Link>
    </header>
  );
}
