"use client";

import React from "react";
import { C } from "@/components/member/tokens";

// ============================================================================
// PillDot - small colored dot used before pill text. Private helper, kept here
// so future consumers of MarkerTag that need a matching pill-dot can reach it
// without re-defining it. Not exported in this task.
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PillDot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ============================================================================
// MarkerTag - small marker chip (Improved / Watching / Stable / New)
// ============================================================================

export function MarkerTag({
  label,
  tone,
}: {
  label: string;
  tone: "improved" | "watching" | "stable" | "new";
}) {
  const styles: Record<string, React.CSSProperties> = {
    improved: { background: C.sageTint, color: C.good },
    watching: { background: C.butterTint, color: C.caution },
    stable: { background: C.canvasDeep, color: C.inkFaint },
    new: { background: C.terracottaTint, color: C.terracotta },
  };

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 6,
        flexShrink: 0,
        ...styles[tone],
      }}
    >
      {label}
    </span>
  );
}

