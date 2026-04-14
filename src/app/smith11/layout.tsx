"use client";

import React from "react";

export default function Smith11Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#121212",
        color: "#FFFFFF",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
