"use client";

import React from "react";
import type { PatientRollup, PatientStatus } from "./sortPatients";

export interface LeftPaneProps {
  rollups: PatientRollup[];
  activePatientId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

const STATUS_LABEL: Record<PatientStatus, string> = {
  pending_review: "Needs review",
  awaiting_patient: "Awaiting reply",
  active: "Active",
  stale: "Dormant",
  new_member: "New",
};

function statusTint(status: PatientStatus): { bg: string; fg: string } {
  switch (status) {
    case "pending_review":
      return { bg: "var(--terracotta-tint)", fg: "var(--terracotta-deep)" };
    case "awaiting_patient":
      return { bg: "var(--butter-tint)", fg: "#7A5A10" };
    case "active":
      return { bg: "var(--sage-tint)", fg: "var(--sage-deep)" };
    case "stale":
      return { bg: "var(--stone-soft)", fg: "var(--ink-muted)" };
    case "new_member":
      return { bg: "var(--butter-tint)", fg: "#7A5A10" };
  }
}

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
}

export function LeftPane({
  rollups,
  activePatientId,
  onSelect,
  loading,
}: LeftPaneProps) {
  if (loading) {
    return (
      <div className="lp-root">
        <div className="lp-header">
          <div className="lp-eyebrow">Your patients</div>
        </div>
        <div className="lp-loading">Loading roster...</div>
        <style jsx>{leftPaneStyles}</style>
      </div>
    );
  }

  return (
    <div className="lp-root">
      <div className="lp-header">
        <div className="lp-eyebrow">Your patients</div>
        <div className="lp-count">{rollups.length}</div>
      </div>
      <div className="lp-list" role="list">
        {rollups.map((r) => {
          const active = r.profile.id === activePatientId;
          const tint = statusTint(r.status);
          const time = relativeTime(r.lastPatientActivity);
          const initials =
            (r.profile.display_name || r.profile.email)
              .split(/\s+/)
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "M";
          return (
            <button
              key={r.profile.id}
              type="button"
              role="listitem"
              className={active ? "lp-row active" : "lp-row"}
              onClick={() => onSelect(r.profile.id)}
            >
              <span className="lp-indicator" />
              <div className="lp-avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="lp-body">
                <div className="lp-top">
                  <span className="lp-name">{r.profile.display_name || r.profile.email}</span>
                  {time && <span className="lp-time">{time}</span>}
                </div>
                <div className="lp-mid">
                  <span
                    className="lp-status"
                    style={{ background: tint.bg, color: tint.fg }}
                  >
                    {STATUS_LABEL[r.status]}
                  </span>
                  {r.unreadFromPatient > 0 && <span className="lp-unread" aria-label="Unread" />}
                </div>
                <div className="lp-summary">{r.summary}</div>
              </div>
            </button>
          );
        })}
      </div>
      <style jsx>{leftPaneStyles}</style>
    </div>
  );
}

const leftPaneStyles = `
  .lp-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--paper);
    border-right: 1px solid var(--line-soft);
    overflow: hidden;
    font-family: var(--font-sans);
  }
  .lp-header {
    padding: var(--sp-5) var(--sp-5) var(--sp-3);
    border-bottom: 1px solid var(--line-soft);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp-3);
  }
  .lp-eyebrow {
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--sage-deep);
    font-size: var(--text-meta);
  }
  .lp-count {
    font-size: var(--text-micro);
    font-weight: 600;
    color: var(--ink-faint);
    letter-spacing: 0.12em;
    background: var(--canvas-soft);
    padding: 3px 8px;
    border-radius: var(--radius-pill);
  }
  .lp-loading {
    padding: var(--sp-7) var(--sp-5);
    color: var(--ink-faint);
    font-style: italic;
    font-family: var(--font-serif);
  }
  .lp-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--sp-2) 0;
  }
  .lp-row {
    display: flex;
    width: 100%;
    align-items: flex-start;
    gap: var(--sp-3);
    padding: var(--sp-4) var(--sp-5);
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid var(--line-soft);
    font-family: var(--font-sans);
    transition: background 0.15s ease;
  }
  .lp-row:last-child { border-bottom: 0; }
  .lp-row:hover { background: var(--canvas-soft); }
  .lp-row.active { background: var(--sage-tint); }
  .lp-indicator {
    width: 2px;
    min-height: 40px;
    border-radius: 1px;
    background: transparent;
    flex-shrink: 0;
    margin-left: -12px;
  }
  .lp-row.active .lp-indicator {
    background: var(--terracotta);
    box-shadow: 0 2px 6px rgba(201, 87, 58, 0.35);
  }
  .lp-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--butter-soft), var(--terracotta-soft));
    color: var(--ink);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-meta);
    flex-shrink: 0;
  }
  .lp-body {
    flex: 1;
    min-width: 0;
  }
  .lp-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--sp-2);
    margin-bottom: 2px;
  }
  .lp-name {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--text-body);
    color: var(--ink);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lp-time {
    font-size: var(--text-micro);
    color: var(--ink-faint);
    font-family: var(--font-sans);
    flex-shrink: 0;
  }
  .lp-mid {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-2);
  }
  .lp-status {
    font-size: var(--text-micro);
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    text-transform: uppercase;
  }
  .lp-unread {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--terracotta);
  }
  .lp-summary {
    font-size: var(--text-meta);
    color: var(--ink-soft);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
