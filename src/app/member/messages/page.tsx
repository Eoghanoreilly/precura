"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import { buildSidebar, rebrandDoctor, USE_REAL_DATA } from "@/components/member/data";
import { MESSAGES, DOCTOR_NOTES } from "@/lib/v2/mock-patient";
import { getAllAnnotations } from "@/lib/data/annotations";
import { getCurrentUser } from "@/lib/data/panels";
import type { Annotation, Profile } from "@/lib/data/types";

// ============================================================================
// /member/messages - notes and annotations feed.
// Real mode: shows all annotations across panels.
// Mock mode: shows mock doctor notes + messages (Anna).
// ============================================================================

export default function MessagesPage() {
  if (USE_REAL_DATA) {
    return <RealNotesView />;
  }
  return <MockMessagesView />;
}

// ============================================================================
// Real annotations view
// ============================================================================

function RealNotesView() {
  const [user, setUser] = useState<Profile | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      setUser(u);
      const notes = await getAllAnnotations();
      setAnnotations(notes);
      setLoading(false);
    }
    load();
  }, []);

  const userInitials = (user?.display_name || "M")[0].toUpperCase();

  return (
    <MemberShell sidebar={buildSidebar("/member/messages")} userInitials={userInitials}>
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: C.terracotta, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
            Notes
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: "-0.028em", fontWeight: 600, color: C.ink, margin: 0, marginBottom: 10 }}>
            {annotations.length === 0 ? "No notes yet." : "All notes"}{" "}
            <span style={{ color: C.inkMuted, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 }}>
              {annotations.length === 0 ? "They'll appear as you annotate panels." : "across every panel."}
            </span>
          </h1>
        </motion.div>

        {loading ? (
          <div style={{ padding: "40px 0", fontSize: 14, color: C.inkFaint }}>Loading...</div>
        ) : annotations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ padding: "32px 24px", background: C.canvasSoft, border: `1px dashed ${C.stoneDeep}`, borderRadius: 18, marginTop: 20 }}
          >
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkMuted, margin: 0 }}>
              When you or Dr. Tomas write notes on blood panels, they'll show up here in one feed. Go to{" "}
              <a href="/member/panels" style={{ color: C.terracotta, textDecoration: "underline", textUnderlineOffset: 3 }}>your panels</a>{" "}
              and expand one to leave the first note.
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            {annotations.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
                style={{
                  padding: "18px 22px",
                  background: C.paper,
                  border: `1px solid ${C.lineCard}`,
                  borderRadius: 18,
                  boxShadow: C.shadowSoft,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: a.author?.role === "doctor"
                      ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`
                      : `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: a.author?.role === "doctor" ? C.canvasSoft : C.ink,
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {(a.author?.display_name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{a.author?.display_name || "Unknown"}</div>
                    <div style={{ fontSize: 10, color: C.inkFaint, fontFamily: '"SF Mono", ui-monospace, monospace' }}>
                      {new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      {" / "}on a {a.target_type}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.65, color: C.inkSoft, letterSpacing: "-0.005em" }}>
                  {a.body}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MemberShell>
  );
}

// ============================================================================
// Mock messages view (Anna demo)
// ============================================================================

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function MockMessagesView() {
  return (
    <MemberShell sidebar={buildSidebar("/member/messages")} userInitials="A">
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.terracotta, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Your conversation</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: "-0.028em", fontWeight: 600, color: C.ink, margin: 0, marginBottom: 10 }}>
            Notes and messages{" "}
            <span style={{ color: C.inkMuted, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 }}>from Dr. Tomas.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkMuted, margin: 0, marginBottom: 36, maxWidth: 560, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Every clinical note and every message between you two, in one place.
          </p>
        </motion.div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>On file</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {DOCTOR_NOTES.map((note, i) => (
              <motion.div key={note.date} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 + i * 0.06 }}
                style={{ padding: "22px 26px", background: C.canvasSoft, border: `1px solid ${C.lineCard}`, borderRadius: 22, boxShadow: C.shadowCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.canvasSoft, fontSize: 13, fontWeight: 700, boxShadow: "0 2px 8px rgba(68,90,74,0.28)" }}>{DOCTOR.initials}</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.terracotta, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2 }}>{note.type}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{DOCTOR.name}<span style={{ color: C.inkFaint, fontWeight: 400, marginLeft: 8, fontFamily: '"SF Mono", ui-monospace, monospace', fontSize: 11 }}>{formatNoteDate(note.date)}</span></div>
                  </div>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.65, color: C.inkSoft }}>{rebrandDoctor(note.note)}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Messages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
            {MESSAGES.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: m.from === "doctor" ? "row" : "row-reverse" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.from === "doctor" ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)` : `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: m.from === "doctor" ? C.canvasSoft : C.ink, fontSize: 12, fontWeight: 700, flexShrink: 0, boxShadow: C.shadowSoft }}>
                  {m.from === "doctor" ? DOCTOR.initials : "A"}
                </div>
                <div style={{ flex: 1, minWidth: 0, maxWidth: 520 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6, justifyContent: m.from === "doctor" ? "flex-start" : "flex-end" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{m.from === "doctor" ? DOCTOR.name : "Anna"}</span>
                    <span style={{ fontSize: 10, color: C.inkFaint, fontFamily: '"SF Mono", ui-monospace, monospace' }}>{formatTime(m.date)}</span>
                  </div>
                  <div style={{ padding: "14px 18px", background: m.from === "doctor" ? C.canvasSoft : C.paper, border: `1px solid ${C.lineCard}`, borderRadius: 16, borderTopLeftRadius: m.from === "doctor" ? 4 : 16, borderTopRightRadius: m.from === "doctor" ? 16 : 4, fontSize: 14, lineHeight: 1.6, color: C.inkSoft, boxShadow: C.shadowSoft }}>
                    {rebrandDoctor(m.text)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MemberShell>
  );
}
