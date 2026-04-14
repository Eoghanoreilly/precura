import React from "react";

// The responsive canvas, centering, and sidebar logic all live in
// src/components/member/MemberShell.tsx so this layout is a passthrough.
// It exists because Next.js App Router requires a layout file alongside pages.
export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
