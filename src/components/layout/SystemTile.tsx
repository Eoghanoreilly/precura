"use client";

import React from "react";

export interface SystemTileMarker {
  shortName: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  status: "normal" | "low" | "high" | "critical";
  plainName?: string;
}

export interface SystemTileProps {
  system: string;
  marker: SystemTileMarker;
}

/**
 * SystemTile - body-system card with key marker and inline mini range bar.
 * Shows: system name (eyebrow), marker name + value, range bar, plain-English footer.
 */
export function SystemTile({ system, marker }: SystemTileProps) {
  const { shortName, value, unit, refLow, refHigh, status, plainName } = marker;

  const pct = refHigh > refLow ? ((value - refLow) / (refHigh - refLow)) * 100 : 50;
  const clampedPct = Math.max(-10, Math.min(110, pct));

  const statusColor =
    status === "normal" ? "var(--health-good)" :
    status === "high"   ? "var(--health-caution)" :
    status === "low"    ? "var(--health-caution)" :
                          "var(--health-risk)";

  return (
    <div className="systile">
      <div className="systile-system">{system}</div>
      <div className="systile-valrow">
        <span className="systile-name">{shortName}</span>
        <span className="systile-value">
          {value}
          <span className="systile-unit"> {unit}</span>
        </span>
      </div>
      <div className="systile-range">
        <div className="systile-range-zone" />
        <div className="systile-range-marker" style={{ left: `${clampedPct}%`, background: statusColor }} />
      </div>
      {plainName && (
        <div className="systile-foot" style={{ color: statusColor }}>
          {status === "normal" ? "Within range" : status === "high" ? "Above range" : status === "low" ? "Below range" : "Out of range"}
          {" · "}
          <span className="systile-plain">{plainName}</span>
        </div>
      )}

      <style jsx>{`
        .systile {
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          padding: var(--sp-4) var(--sp-4) var(--sp-4);
          font-family: var(--font-sans);
        }
        .systile-system {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: var(--sp-3);
        }
        .systile-valrow {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--sp-2);
          margin-bottom: var(--sp-3);
        }
        .systile-name {
          font-size: var(--text-meta);
          color: var(--ink-muted);
          font-weight: 600;
          letter-spacing: -0.008em;
        }
        .systile-value {
          font-size: 22px;
          font-weight: 500;
          color: var(--ink);
          letter-spacing: -0.018em;
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }
        .systile-unit {
          font-size: var(--text-meta);
          color: var(--ink-muted);
          font-family: var(--font-mono);
        }
        .systile-range {
          position: relative;
          height: 8px;
          background: var(--stone-soft);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: var(--sp-2);
        }
        .systile-range-zone {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0%;
          right: 0%;
          background: rgba(114, 140, 118, 0.22);
          border-left: 1px solid rgba(114, 140, 118, 0.5);
          border-right: 1px solid rgba(114, 140, 118, 0.5);
        }
        .systile-range-marker {
          position: absolute;
          top: -4px;
          width: 2px;
          height: 16px;
          border-radius: 1px;
          transform: translateX(-50%);
        }
        .systile-foot {
          font-size: var(--text-meta);
          margin-top: var(--sp-1);
        }
        .systile-plain {
          color: var(--ink-muted);
        }
      `}</style>
    </div>
  );
}
