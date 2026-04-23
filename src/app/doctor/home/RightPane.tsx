"use client";

import React, { KeyboardEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/layout";
import { useAutoGrow } from "@/app/member/discuss/composer/useAutoGrow";
import type { PatientRollup, PatientStatus } from "./sortPatients";

export interface RightPaneProps {
  rollup: PatientRollup;
  doctorName: string;
  onPostNote: (args: { panelId: string; body: string }) => Promise<void>;
  isPosting: boolean;
  error: string | null;
  onClearError: () => void;
}

const STATUS_LABEL: Record<PatientStatus, string> = {
  pending_review: "Needs review",
  awaiting_patient: "Awaiting reply",
  active: "Active",
  stale: "Dormant",
  new_member: "New",
};

function formatAbs(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatRel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function RightPane({
  rollup,
  doctorName,
  onPostNote,
  isPosting,
  error,
  onClearError,
}: RightPaneProps) {
  const { profile, panels, annotations, latestPanelDate, flaggedMarkersCount, status } = rollup;
  const latestPanel = panels[0];

  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(
    latestPanel?.id ?? null,
  );
  const [body, setBody] = useState("");
  const { ref, resize } = useAutoGrow({ minRows: 2, maxRows: 8, lineHeight: 24 });

  useEffect(() => {
    setSelectedPanelId(latestPanel?.id ?? null);
    setBody("");
  }, [profile.id, latestPanel?.id]);

  const canPost =
    body.trim().length > 0 && selectedPanelId !== null && !isPosting;

  const submit = async () => {
    if (!canPost || !selectedPanelId) return;
    await onPostNote({ panelId: selectedPanelId, body });
    setBody("");
    setTimeout(() => resize(), 0);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  const flagged = latestPanel?.biomarkers?.filter((b) => b.status !== "normal") ?? [];

  const caseEntries = annotations
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const statusTint =
    status === "pending_review"
      ? { bg: "var(--terracotta-tint)", fg: "var(--terracotta-deep)" }
      : status === "awaiting_patient"
        ? { bg: "var(--butter-tint)", fg: "#7A5A10" }
        : status === "active"
          ? { bg: "var(--sage-tint)", fg: "var(--sage-deep)" }
          : status === "stale"
            ? { bg: "var(--stone-soft)", fg: "var(--ink-muted)" }
            : { bg: "var(--butter-tint)", fg: "#7A5A10" };

  return (
    <div className="rp-root">
      <div className="rp-header">
        <div className="rp-header-left">
          <div className="rp-name">{profile.display_name || profile.email}</div>
          <div className="rp-meta">
            <span
              className="rp-status"
              style={{ background: statusTint.bg, color: statusTint.fg }}
            >
              {STATUS_LABEL[status]}
            </span>
            <span className="rp-meta-dim">
              {panels.length} {panels.length === 1 ? "panel" : "panels"}
            </span>
            {latestPanelDate && (
              <span className="rp-meta-dim">
                Last panel {formatAbs(latestPanelDate)}
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/doctor/patient/${profile.id}`}
          className="rp-file-link"
        >
          Open full file
        </Link>
      </div>

      {flagged.length > 0 && (
        <div className="rp-flagged">
          <div className="rp-flagged-label">Flagged on latest panel</div>
          <div className="rp-flagged-row">
            {flagged.map((b) => {
              const over = b.ref_range_high !== null && b.value > (b.ref_range_high ?? 0);
              return (
                <span
                  key={b.id}
                  className={over ? "rp-chip high" : "rp-chip low"}
                >
                  {b.short_name} {b.value} {b.unit}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {flagged.length === 0 && flaggedMarkersCount === 0 && latestPanel && (
        <div className="rp-flagged">
          <div className="rp-flagged-label">Latest panel</div>
          <div className="rp-flagged-row">
            <span className="rp-chip ok">All within reference range</span>
          </div>
        </div>
      )}

      <div className="rp-log">
        {caseEntries.length === 0 ? (
          <div className="rp-empty">
            <em>No notes yet.</em> Write the first one below.
          </div>
        ) : (
          caseEntries.map((a) => {
            const isDoctor = a.author?.role === "doctor" || a.author?.role === "both";
            const onPanel = panels.find((p) => p.id === a.target_id);
            const panelLabel = onPanel
              ? `On panel from ${formatAbs(onPanel.panel_date)}`
              : "General note";
            return (
              <article key={a.id} className="rp-entry">
                <div className="rp-entry-eyebrow">
                  <em>{panelLabel}</em>
                </div>
                <div className="rp-entry-attrib">
                  <span className={isDoctor ? "rp-author doctor" : "rp-author patient"}>
                    {isDoctor ? doctorName : profile.display_name || "Patient"}
                  </span>
                  <span className="rp-dot">&middot;</span>
                  <span className="rp-time">{formatRel(a.created_at)}</span>
                </div>
                <div className="rp-entry-body">{a.body}</div>
              </article>
            );
          })
        )}
      </div>

      <div className="rp-composer">
        {error && (
          <div className="rp-error">
            <span>{error}</span>
            <button type="button" onClick={onClearError} className="rp-error-close">Dismiss</button>
          </div>
        )}
        <textarea
          ref={ref}
          className="rp-textarea"
          value={body}
          onChange={(e) => { setBody(e.target.value); resize(); }}
          onKeyDown={handleKey}
          placeholder={
            latestPanel
              ? `Write a note for ${profile.display_name || "patient"}`
              : "No panel to attach a note to yet"
          }
          disabled={!latestPanel || isPosting}
          rows={2}
        />
        <div className="rp-actions">
          <div className="rp-attach">
            <label className="rp-attach-label">Attach to</label>
            <select
              className="rp-attach-select"
              value={selectedPanelId ?? ""}
              onChange={(e) => setSelectedPanelId(e.target.value || null)}
              disabled={panels.length === 0}
            >
              {panels.length === 0 && <option value="">(no panels)</option>}
              {panels.map((p) => (
                <option key={p.id} value={p.id}>
                  Panel from {formatAbs(p.panel_date)}
                </option>
              ))}
            </select>
          </div>
          <Button tone="sage" onClick={submit} type="button">
            {isPosting ? "Posting..." : "Post note"}
          </Button>
        </div>
        <div className="rp-hint">Cmd+Return to post</div>
      </div>

      <style jsx>{`
        .rp-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--canvas-soft);
          font-family: var(--font-sans);
          min-height: 0;
        }
        .rp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--sp-4);
          padding: var(--sp-5) var(--sp-6);
          border-bottom: 1px solid var(--line-soft);
          background: var(--paper);
        }
        .rp-header-left { flex: 1; min-width: 0; }
        .rp-name {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-section);
          color: var(--ink);
          margin-bottom: var(--sp-2);
        }
        .rp-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--sp-2) var(--sp-3);
          font-size: var(--text-meta);
          color: var(--ink-muted);
        }
        .rp-status {
          font-size: var(--text-micro);
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }
        .rp-meta-dim {
          color: var(--ink-faint);
        }
        .rp-file-link {
          font-size: var(--text-meta);
          color: var(--sage-deep);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--sage-soft);
          background: var(--sage-tint);
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .rp-file-link:hover { background: var(--sage-soft); }

        .rp-flagged {
          padding: var(--sp-3) var(--sp-6);
          background: var(--canvas-warm);
          border-bottom: 1px solid var(--line-soft);
        }
        .rp-flagged-label {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: var(--sp-2);
        }
        .rp-flagged-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-2);
        }
        .rp-chip {
          font-size: var(--text-micro);
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid transparent;
        }
        .rp-chip.high {
          background: var(--terracotta-tint);
          color: var(--terracotta-deep);
          border-color: var(--terracotta-soft);
        }
        .rp-chip.low {
          background: var(--butter-tint);
          color: #7A5A10;
          border-color: rgba(233, 181, 71, 0.4);
        }
        .rp-chip.ok {
          background: var(--sage-tint);
          color: var(--sage-deep);
          border-color: var(--sage-soft);
        }

        .rp-log {
          flex: 1;
          overflow-y: auto;
          padding: var(--sp-6);
          min-height: 0;
        }
        .rp-empty {
          font-family: var(--font-serif);
          color: var(--ink-faint);
          text-align: center;
          padding: var(--sp-9) 0;
          font-size: var(--text-body);
        }
        .rp-entry {
          padding: var(--sp-4) 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .rp-entry:last-child { border-bottom: 0; }
        .rp-entry-eyebrow {
          font-size: var(--text-meta);
          color: var(--sage-deep);
          font-family: var(--font-serif);
          margin-bottom: var(--sp-1);
        }
        .rp-entry-attrib {
          font-size: var(--text-meta);
          color: var(--ink-muted);
          margin-bottom: var(--sp-2);
        }
        .rp-author.doctor { color: var(--sage-deep); font-weight: 600; }
        .rp-author.patient { color: var(--terracotta-deep); font-weight: 600; }
        .rp-dot { color: var(--ink-faint); margin: 0 4px; }
        .rp-time { font-style: italic; font-family: var(--font-serif); color: var(--ink-faint); }
        .rp-entry-body {
          font-size: var(--text-body);
          color: var(--ink);
          line-height: var(--line-height-body);
          white-space: pre-wrap;
        }

        .rp-composer {
          border-top: 1px solid var(--line-soft);
          background: var(--paper);
          padding: var(--sp-4) var(--sp-6) var(--sp-5);
        }
        .rp-error {
          padding: var(--sp-2) var(--sp-3);
          margin-bottom: var(--sp-3);
          background: var(--terracotta-tint);
          border: 1px solid var(--terracotta-soft);
          border-radius: var(--radius);
          color: var(--terracotta-deep);
          font-size: var(--text-meta);
          display: flex;
          justify-content: space-between;
          gap: var(--sp-3);
        }
        .rp-error-close {
          background: none;
          border: none;
          color: var(--terracotta-deep);
          cursor: pointer;
          text-decoration: underline;
          font-size: var(--text-meta);
          font-family: var(--font-sans);
        }
        .rp-textarea {
          width: 100%;
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: 1.5;
          color: var(--ink);
          background: var(--canvas-soft);
          border: 1px solid var(--line-card);
          border-radius: var(--radius);
          padding: var(--sp-3);
          outline: none;
          resize: none;
        }
        .rp-textarea:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px var(--sage-tint);
        }
        .rp-textarea:disabled { color: var(--ink-faint); cursor: not-allowed; }
        .rp-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-3);
          margin-top: var(--sp-3);
          flex-wrap: wrap;
        }
        .rp-attach { display: flex; align-items: center; gap: var(--sp-2); }
        .rp-attach-label {
          font-size: var(--text-micro);
          color: var(--ink-muted);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .rp-attach-select {
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          color: var(--ink);
          background: var(--paper);
          border: 1px solid var(--line-card);
          border-radius: var(--radius);
          padding: 4px 8px;
        }
        .rp-hint {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          margin-top: var(--sp-2);
          font-style: italic;
          font-family: var(--font-serif);
        }
      `}</style>
    </div>
  );
}
