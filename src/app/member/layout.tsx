import React from "react";
import { C } from "@/components/member/tokens";

// Layout provides the darker outer canvas so the cream shell inside
// MemberShell floats against it. The three-layer stack is:
//   outer (this layout) -> warm stone  (darkest)
//   inner (MemberShell) -> canvasDeep  (mid cream)
//   cards                -> paper white (lightest, real contrast)
export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.stone,
      }}
    >
      {children}
    </div>
  );
}
