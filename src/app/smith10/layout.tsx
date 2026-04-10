"use client";

import React from "react";

export default function Smith10Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FEFFFE",
        color: "#0F0F0F",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
