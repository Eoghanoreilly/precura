"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  RailNav,
  EditorialColumn,
  SubGrid,
  SystemTile,
  NarrativeCard,
  Button,
} from "@/components/layout";
import { useDoctorData } from "../../useDoctorData";
import { BodySystemsGrid } from "@/app/member/home/blocks/BodySystemsGrid";
import { fetchChatMessagesForSession } from "@/lib/data/doctor";
import type { Biomarker, ChatSession } from "@/lib/data/types";

type TabKey = "overview" | "panels" | "notes" | "chat";

const NAV_ITEMS = [
  { label: "Home", href: "/doctor" },
  { label: "Patients", href: "/doctor" },
  { label: "Settings", href: "/doctor/settings" },
];

function mapStatus(
  status: Biomarker["status"],
  value: number,
  refHigh: number,
): "normal" | "low" | "high" | "critical" {
  if (status === "normal") return "normal";
  if (status === "abnormal") return "critical";
  return value > refHigh ? "high" : "low";
}

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
  return `${Math.floor(days / 30)} months ago`;
}

function PatientFileInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const patientId = params?.id ?? "";
  const activeTab = (search.get("tab") as TabKey) || "overview";

  const data = useDoctorData();
  const rollup = useMemo(
    () => data.patients.find((p) => p.profile.id === patientId) ?? null,
    [data.patients, patientId],
  );

  const displayName = data.doctor?.display_name || "Doctor";
  const initials =
    displayName.split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "D";

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor" />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: displayName, initials, memberSince: "Clinician" }}
          doctor={{ name: "Precura clinic", initials: "P", title: `${data.patients.length} patients` }}
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/doctor" />,
      ]}
    />
  );

  const goTab = (tab: TabKey) => {
    const qs = new URLSearchParams(search.toString());
    qs.set("tab", tab);
    router.replace(`/doctor/patient/${patientId}?${qs.toString()}`);
  };

  return (
    <PageShell sideRail={sideRail} userInitials={initials} activeHref="/doctor">
      <EditorialColumn variant="reading">
        <div className="pf-back">
          <Link href="/doctor" className="pf-back-link">Back to patients</Link>
        </div>

        {data.loading && !rollup && (
          <div className="pf-loading">Loading patient file...</div>
        )}

        {!data.loading && !rollup && (
          <div className="pf-loading">Patient not found in roster.</div>
        )}

        {rollup && (
          <>
            <header className="pf-header">
              <h1 className="pf-name">{rollup.profile.display_name || rollup.profile.email}</h1>
              <div className="pf-meta">
                <span className="pf-status">{rollup.status.replace(/_/g, " ")}</span>
                <span className="pf-dim">
                  Member since {formatAbs(rollup.profile.created_at)}
                </span>
                <span className="pf-dim">
                  {rollup.panels.length} {rollup.panels.length === 1 ? "panel" : "panels"} on file
                </span>
              </div>
            </header>

            <nav className="pf-tabs" role="tablist">
              {(["overview", "panels", "notes", "chat"] as TabKey[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={activeTab === t}
                  className={activeTab === t ? "pf-tab active" : "pf-tab"}
                  onClick={() => goTab(t)}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </nav>

            <div className="pf-content">
              {activeTab === "overview" && <OverviewTab rollup={rollup} />}
              {activeTab === "panels" && <PanelsTab rollup={rollup} />}
              {activeTab === "notes" && (
                <NotesTab
                  rollup={rollup}
                  doctorName={displayName}
                  onPostNote={data.writeNote}
                  isPosting={data.isPosting}
                  error={data.error}
                  onClearError={data.clearError}
                />
              )}
              {activeTab === "chat" && <ChatTab sessions={rollup.chatSessions} />}
            </div>
          </>
        )}
      </EditorialColumn>

      <style jsx>{`
        .pf-back { padding: var(--sp-4) 0; }
        .pf-back-link {
          color: var(--sage-deep);
          font-size: var(--text-meta);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--sage-soft);
        }
        .pf-back-link:hover { color: var(--ink); }
        .pf-loading {
          padding: var(--sp-11) 0;
          text-align: center;
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--ink-faint);
        }
        .pf-header { margin-bottom: var(--sp-5); }
        .pf-name {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-display);
          font-weight: 500;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin: 0 0 var(--sp-3);
        }
        .pf-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--sp-2) var(--sp-4);
          color: var(--ink-muted);
          font-size: var(--text-meta);
        }
        .pf-status {
          background: var(--sage-tint);
          color: var(--sage-deep);
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          text-transform: capitalize;
          font-size: var(--text-micro);
          letter-spacing: 0.04em;
        }
        .pf-dim { color: var(--ink-faint); }
        .pf-tabs {
          display: flex;
          gap: var(--sp-2);
          border-bottom: 1px solid var(--line-soft);
          margin-bottom: var(--sp-6);
          padding-bottom: var(--sp-1);
        }
        .pf-tab {
          background: none;
          border: none;
          padding: var(--sp-3) var(--sp-4);
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          color: var(--ink-muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .pf-tab:hover { color: var(--ink); }
        .pf-tab.active {
          color: var(--ink);
          border-bottom-color: var(--terracotta);
          font-weight: 600;
        }
        .pf-content { padding-bottom: var(--sp-11); }
      `}</style>
    </PageShell>
  );
}

// ============================================================================
// Overview tab
// ============================================================================
function OverviewTab({ rollup }: { rollup: import("../../home/sortPatients").PatientRollup }) {
  const latest = rollup.panels[0];
  const flagged = latest?.biomarkers?.filter((b) => b.status !== "normal").slice(0, 6) ?? [];

  return (
    <div>
      <NarrativeCard title={`Precura summary`}>
        <p>{rollup.summary}</p>
        {rollup.lastDoctorNoteDate && (
          <p>Your last note was {formatRel(rollup.lastDoctorNoteDate)}.</p>
        )}
      </NarrativeCard>

      <h2 className="ot-h">Latest panel</h2>
      {latest ? (
        <>
          <div className="ot-sub">
            <em style={{ fontFamily: "var(--font-serif)" }}>
              Dated {formatAbs(latest.panel_date)}
            </em>
          </div>
          <BodySystemsGrid biomarkers={latest.biomarkers ?? []} />
        </>
      ) : (
        <p className="ot-empty">No panels on file yet.</p>
      )}

      {flagged.length > 0 && (
        <>
          <h2 className="ot-h">Flagged markers</h2>
          <SubGrid columns={3}>
            {flagged.map((b) => {
              const refLow = b.ref_range_low ?? 0;
              const refHigh = b.ref_range_high ?? 1;
              return (
                <SystemTile
                  key={b.id}
                  system={b.name_eng || b.short_name}
                  marker={{
                    shortName: b.short_name,
                    value: b.value,
                    unit: b.unit,
                    refLow,
                    refHigh,
                    status: mapStatus(b.status, b.value, refHigh),
                    plainName: b.plain_name ?? undefined,
                  }}
                />
              );
            })}
          </SubGrid>
        </>
      )}

      <style jsx>{`
        .ot-h {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: var(--sp-8) 0 var(--sp-3);
        }
        .ot-sub {
          color: var(--ink-muted);
          font-size: var(--text-meta);
          margin-bottom: var(--sp-4);
        }
        .ot-empty {
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
          padding: var(--sp-6) 0;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Panels tab
// ============================================================================
function PanelsTab({ rollup }: { rollup: import("../../home/sortPatients").PatientRollup }) {
  if (rollup.panels.length === 0) {
    return <p style={{ color: "var(--ink-faint)", fontFamily: "var(--font-serif)", fontStyle: "italic", padding: "var(--sp-8) 0" }}>No panels on file yet.</p>;
  }
  return (
    <div>
      <ul className="pt-list">
        {rollup.panels.map((p) => {
          const flagged = p.biomarkers?.filter((b) => b.status !== "normal").length ?? 0;
          const total = p.biomarkers?.length ?? 0;
          return (
            <li key={p.id} className="pt-item">
              <div className="pt-item-body">
                <div className="pt-date">
                  <em style={{ fontFamily: "var(--font-serif)" }}>
                    {formatAbs(p.panel_date)}
                  </em>
                </div>
                <div className="pt-meta">
                  {p.lab_name && <span>{p.lab_name}</span>}
                  <span>{total} markers</span>
                  <span>{flagged} flagged</span>
                </div>
              </div>
              <Link href={`/member/panels/${p.id}`} className="pt-open">
                Open panel
              </Link>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .pt-list { list-style: none; padding: 0; margin: 0; }
        .pt-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-5) 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .pt-item:last-child { border-bottom: 0; }
        .pt-date {
          font-size: var(--text-body);
          color: var(--ink);
          margin-bottom: var(--sp-1);
        }
        .pt-meta {
          display: flex;
          gap: var(--sp-3);
          font-size: var(--text-meta);
          color: var(--ink-muted);
        }
        .pt-open {
          font-size: var(--text-meta);
          color: var(--sage-deep);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--sage-soft);
          background: var(--sage-tint);
        }
        .pt-open:hover { background: var(--sage-soft); }
      `}</style>
    </div>
  );
}

// ============================================================================
// Notes tab
// ============================================================================
function NotesTab({
  rollup,
  doctorName,
  onPostNote,
  isPosting,
  error,
  onClearError,
}: {
  rollup: import("../../home/sortPatients").PatientRollup;
  doctorName: string;
  onPostNote: (args: { panelId: string; body: string }) => Promise<void>;
  isPosting: boolean;
  error: string | null;
  onClearError: () => void;
}) {
  const [panelId, setPanelId] = useState<string | null>(rollup.panels[0]?.id ?? null);
  const [body, setBody] = useState("");

  // Sync panel selection when rollup changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPanelId(rollup.panels[0]?.id ?? null);
  }, [rollup.panels]);

  const submit = async () => {
    if (!panelId || !body.trim() || isPosting) return;
    await onPostNote({ panelId, body });
    setBody("");
  };

  const sorted = rollup.annotations
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      <div className="nt-composer">
        {error && (
          <div className="nt-error">
            <span>{error}</span>
            <button type="button" onClick={onClearError} className="nt-error-close">Dismiss</button>
          </div>
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={rollup.panels.length > 0 ? `Write a note for ${rollup.profile.display_name}` : "No panel to attach a note to"}
          disabled={rollup.panels.length === 0 || isPosting}
          className="nt-textarea"
        />
        <div className="nt-row">
          <select
            value={panelId ?? ""}
            onChange={(e) => setPanelId(e.target.value || null)}
            disabled={rollup.panels.length === 0}
            className="nt-select"
          >
            {rollup.panels.length === 0 && <option value="">(no panels)</option>}
            {rollup.panels.map((p) => (
              <option key={p.id} value={p.id}>Attach to panel from {formatAbs(p.panel_date)}</option>
            ))}
          </select>
          <Button tone="sage" onClick={submit} type="button">
            {isPosting ? "Posting..." : "Post note"}
          </Button>
        </div>
      </div>

      <h2 className="nt-h">All notes</h2>
      {sorted.length === 0 ? (
        <p className="nt-empty">No notes yet.</p>
      ) : (
        <ul className="nt-list">
          {sorted.map((a) => {
            const isDoctor = a.author?.role === "doctor" || a.author?.role === "both";
            const onPanel = rollup.panels.find((p) => p.id === a.target_id);
            return (
              <li key={a.id} className="nt-item">
                <div className="nt-eyebrow">
                  <em style={{ fontFamily: "var(--font-serif)" }}>
                    {onPanel ? `On panel from ${formatAbs(onPanel.panel_date)}` : "Note"}
                  </em>
                </div>
                <div className="nt-attrib">
                  <span className={isDoctor ? "nt-author doctor" : "nt-author patient"}>
                    {isDoctor ? doctorName : rollup.profile.display_name}
                  </span>
                  <span className="nt-dim">&middot; {formatRel(a.created_at)}</span>
                </div>
                <div className="nt-body">{a.body}</div>
              </li>
            );
          })}
        </ul>
      )}

      <style jsx>{`
        .nt-composer {
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          padding: var(--sp-4);
          margin-bottom: var(--sp-7);
        }
        .nt-error {
          padding: var(--sp-2) var(--sp-3);
          margin-bottom: var(--sp-3);
          background: var(--terracotta-tint);
          border: 1px solid var(--terracotta-soft);
          border-radius: var(--radius);
          color: var(--terracotta-deep);
          font-size: var(--text-meta);
          display: flex;
          justify-content: space-between;
        }
        .nt-error-close {
          background: none;
          border: none;
          color: var(--terracotta-deep);
          cursor: pointer;
          text-decoration: underline;
          font-size: var(--text-meta);
        }
        .nt-textarea {
          width: 100%;
          min-height: 96px;
          font-family: var(--font-sans);
          font-size: var(--text-body);
          color: var(--ink);
          background: var(--canvas-soft);
          border: 1px solid var(--line-card);
          border-radius: var(--radius);
          padding: var(--sp-3);
          outline: none;
          resize: vertical;
          margin-bottom: var(--sp-3);
        }
        .nt-textarea:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px var(--sage-tint);
        }
        .nt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--sp-3);
          flex-wrap: wrap;
        }
        .nt-select {
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          color: var(--ink);
          background: var(--paper);
          border: 1px solid var(--line-card);
          border-radius: var(--radius);
          padding: var(--sp-2) var(--sp-3);
        }
        .nt-h {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 var(--sp-4);
        }
        .nt-empty {
          color: var(--ink-faint);
          font-family: var(--font-serif);
          font-style: italic;
          padding: var(--sp-6) 0;
        }
        .nt-list { list-style: none; padding: 0; margin: 0; }
        .nt-item {
          padding: var(--sp-5) 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .nt-item:last-child { border-bottom: 0; }
        .nt-eyebrow {
          font-size: var(--text-meta);
          color: var(--sage-deep);
          margin-bottom: var(--sp-1);
        }
        .nt-attrib {
          font-size: var(--text-meta);
          color: var(--ink-muted);
          margin-bottom: var(--sp-2);
        }
        .nt-author.doctor { color: var(--sage-deep); font-weight: 600; }
        .nt-author.patient { color: var(--terracotta-deep); font-weight: 600; }
        .nt-dim { color: var(--ink-faint); font-style: italic; font-family: var(--font-serif); }
        .nt-body {
          font-size: var(--text-body);
          color: var(--ink);
          line-height: var(--line-height-body);
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Chat tab - read-only view of patient's conversations with Precura
// ============================================================================
function ChatTab({ sessions }: { sessions: ChatSession[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!openId) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchChatMessagesForSession(openId)
      .then((msgs) => { if (!cancelled) setMessages(msgs); })
      .catch(() => { if (!cancelled) setMessages([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [openId]);

  if (sessions.length === 0) {
    return <p style={{ color: "var(--ink-faint)", fontFamily: "var(--font-serif)", fontStyle: "italic", padding: "var(--sp-6) 0" }}>No conversations yet.</p>;
  }

  return (
    <div>
      <ul className="ct-list">
        {sessions.map((s) => (
          <li key={s.id} className="ct-session">
            <button
              type="button"
              className={openId === s.id ? "ct-session-head open" : "ct-session-head"}
              onClick={() => setOpenId((curr) => (curr === s.id ? null : s.id))}
            >
              <span className="ct-date">
                <em style={{ fontFamily: "var(--font-serif)" }}>{formatAbs(s.created_at)}</em>
              </span>
              <span className="ct-title">{s.title || "Conversation"}</span>
              <span className="ct-toggle">{openId === s.id ? "Collapse" : "Open"}</span>
            </button>
            {openId === s.id && (
              <div className="ct-thread">
                {loading ? (
                  <p className="ct-loading">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="ct-loading">No messages in this session.</p>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={`ct-msg ${m.role}`}>
                      <div className="ct-msg-author">
                        <em style={{ fontFamily: "var(--font-serif)" }}>
                          {m.role === "user" ? "Patient" : "Precura"}
                        </em>
                        <span className="ct-msg-time">{formatRel(m.created_at)}</span>
                      </div>
                      <div className="ct-msg-body">{m.content}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .ct-list { list-style: none; padding: 0; margin: 0; }
        .ct-session { border-bottom: 1px solid var(--line-soft); }
        .ct-session-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--sp-3);
          width: 100%;
          padding: var(--sp-4) 0;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-sans);
        }
        .ct-date { color: var(--sage-deep); font-size: var(--text-meta); }
        .ct-title { flex: 1; color: var(--ink); font-size: var(--text-body); }
        .ct-toggle { color: var(--ink-faint); font-size: var(--text-micro); letter-spacing: 0.08em; text-transform: uppercase; }
        .ct-thread {
          padding: var(--sp-3) 0 var(--sp-5);
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }
        .ct-loading { color: var(--ink-faint); font-style: italic; font-family: var(--font-serif); padding: var(--sp-3) 0; }
        .ct-msg {
          max-width: 80%;
          padding: var(--sp-3) var(--sp-4);
          border-radius: var(--radius-card);
          border: 1px solid var(--line-soft);
        }
        .ct-msg.user {
          background: var(--sage-tint);
          border-color: var(--sage-soft);
          align-self: flex-end;
        }
        .ct-msg.assistant {
          background: var(--paper);
          align-self: flex-start;
        }
        .ct-msg-author {
          font-size: var(--text-meta);
          color: var(--sage-deep);
          margin-bottom: var(--sp-1);
          display: flex;
          gap: var(--sp-2);
          align-items: baseline;
        }
        .ct-msg-time { color: var(--ink-faint); font-size: var(--text-micro); font-family: var(--font-serif); font-style: italic; }
        .ct-msg-body {
          color: var(--ink);
          line-height: var(--line-height-body);
          font-size: var(--text-body);
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}

export default function DoctorPatientPage() {
  return (
    <Suspense fallback={null}>
      <PatientFileInner />
    </Suspense>
  );
}
