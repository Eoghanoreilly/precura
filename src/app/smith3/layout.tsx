"use client";

import React from "react";

export default function Smith3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#0A0A0A",
        minHeight: "100dvh",
        fontFamily: '"SF Mono", "Courier New", monospace',
        color: "#F0F0F0",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
