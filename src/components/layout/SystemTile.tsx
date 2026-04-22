"use client";

import React, { useState } from "react";
import { getMarkerExplanation } from "@/app/member/home/markerExplanations";

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
 * SystemTile - body-system card with key marker and a banded range bar.
 *
 * Range bar uses a gradient background (red -> amber -> green -> amber -> red)
 * that maps the normal reference range to the centre 40% of the bar (positions
 * 30%-70%). The marker is a circular dot positioned along the bar based on the
 * value, coloured by status with a white border so it is visible on any band.
 *
 * If an "Explain more" entry exists for the marker in markerExplanations.ts,
 * a collapsible block is shown below the tile's status footer.
 */
export function SystemTile({ system, marker }: SystemTileProps) {
  const { shortName, value, unit, refLow, refHigh, status, plainName } = marker;
  const [expanded, setExpanded] = useState(false);
  const explanation = getMarkerExplanation(shortName);

  // --- Marker position on the banded bar ---
  // Normal range occupies positions 30-70. Below low clamps toward 0, above high toward 100.
  let markerPct = 50;
  if (refHigh > refLow) {
    const rangeWidth = refHigh - refLow;
    const barStart = refLow - rangeWidth;
    const barEnd = refHigh + rangeWidth;
    const raw = ((value - barStart) / (barEnd - barStart)) * 100;
    markerPct = Math.max(2, Math.min(98, raw));
  }

  const statusColor =
    status === "normal" ? "var(--health-good)" :
    status === "high"   ? "var(--health-caution)" :
    status === "low"    ? "var(--health-caution)" :
                          "var(--health-risk)";

  const statusLabel =
    status === "normal" ? "Within range" :
    status === "high"   ? "Above range" :
    status === "low"    ? "Below range" :
                          "Out of range";

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

      <div className="systile-range" aria-label={`${statusLabel}. Value ${value} ${unit}. Reference ${refLow} to ${refHigh}.`}>
        <div className="systile-range-bg" />
        <div
          className="systile-range-marker"
          style={{ left: `${markerPct}%`, background: statusColor }}
        />
      </div>

      <div className="systile-foot" style={{ color: statusColor }}>
        {statusLabel}
        {plainName && (
          <>
            {" · "}
            <span className="systile-plain">{plainName}</span>
          </>
        )}
      </div>

      {explanation && (
        <>
          <button
            className="systile-explain-btn"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
          >
            {expanded ? "Collapse" : "Explain more"}
          </button>
          {expanded && (
            <div className="systile-explain-body">
              <p className="systile-explain-what">{explanation.what}</p>
              <p className="systile-explain-why">
                {explanation.why({ value, refLow, refHigh, unit, status })}
              </p>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .systile {
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          padding: var(--sp-4);
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
          margin-bottom: var(--sp-4);
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

        /* Banded range bar */
        .systile-range {
          position: relative;
          height: 10px;
          margin-bottom: var(--sp-3);
        }

        .systile-range-bg {
          position: absolute;
          inset: 0;
          border-radius: 5px;
          background: linear-gradient(
            to right,
            var(--health-risk) 0%,
            var(--health-risk) 8%,
            var(--health-caution) 20%,
            var(--health-good) 35%,
            var(--health-good) 65%,
            var(--health-caution) 80%,
            var(--health-risk) 92%,
            var(--health-risk) 100%
          );
          opacity: 0.85;
        }

        .systile-range-marker {
          position: absolute;
          top: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--paper);
          box-shadow: 0 1px 3px rgba(28, 26, 23, 0.2);
          transform: translateX(-50%);
        }

        .systile-foot {
          font-size: var(--text-meta);
          margin-bottom: var(--sp-1);
        }

        .systile-plain {
          color: var(--ink-muted);
        }

        .systile-explain-btn {
          margin-top: var(--sp-3);
          padding: 4px 0;
          background: none;
          border: none;
          color: var(--sage-deep);
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          font-weight: 500;
          cursor: pointer;
          letter-spacing: -0.005em;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--sage-soft);
        }

        .systile-explain-btn:hover {
          color: var(--ink);
          text-decoration-color: var(--sage);
        }

        .systile-explain-body {
          margin-top: var(--sp-3);
          padding-top: var(--sp-3);
          border-top: 1px solid var(--line-soft);
          font-size: var(--text-meta);
          line-height: var(--line-height-body);
          color: var(--ink-soft);
        }

        .systile-explain-body p {
          margin: 0 0 var(--sp-2);
        }

        .systile-explain-body p:last-child {
          margin-bottom: 0;
        }

        .systile-explain-what {
          color: var(--ink);
        }
      `}</style>
    </div>
  );
}
