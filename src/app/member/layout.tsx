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
      {children}
    </div>
  );
}
