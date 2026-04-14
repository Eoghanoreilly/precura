import React from "react";
import { C, SYSTEM_FONT } from "@/components/member/tokens";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.canvasDeep,
        fontFamily: SYSTEM_FONT,
        display: "flex",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          background: C.canvas,
          minHeight: "100dvh",
          boxShadow: "0 0 40px rgba(28,26,23,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
