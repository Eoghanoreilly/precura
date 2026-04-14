"use client";

import React from "react";

export default function Smith14Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col mx-auto relative"
      style={{
        maxWidth: 430,
        minHeight: "100dvh",
        background: "#FAFDFB",
        fontFamily:
          '"Google Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
