"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import { EYEBROW, DISPLAY_NUM } from "@/components/member/tokens";
import { buildSidebar, USE_REAL_DATA } from "@/components/member/data";
import { getCurrentUser } from "@/lib/data/panels";
import {
  createChatSession,
  saveChatMessage,
  getUserSessions,
  getSessionMessages,
} from "@/lib/data/chat";
import type { Profile } from "@/lib/data/types";
import type { ChatSession } from "@/lib/data/types";

// ============================================================================
// /member/discuss
//
// A private conversation with a specialist that has read the member's
// complete health file. Streams responses from /api/discuss (Claude Opus 4.6
// with prompt caching on the system prompt).
//
// Three views:
//   1. "history"  - list of previous chat sessions
//   2. "empty"    - no active thread, suggested questions
//   3. "thread"   - active conversation
// ============================================================================

type Role = "user" | "assistant";

interface Turn {
  role: Role;
  content: string;
}

type View = "history" | "empty" | "thread";

const STORAGE_KEY = "precura-discuss-thread-v1";

const SUGGESTED_QUESTIONS_REAL = [
  "What trends do you see in my recent panels?",
  "Which markers should I pay attention to?",
  "How do my latest results compare to previous ones?",
  "Is there anything I should discuss with Dr. Tomas?",
];

const SUGGESTED_QUESTIONS_MOCK = [
  "Why is my fasting glucose drifting?",
  "Am I at risk for what my mother has?",
  "Is my cholesterol actually a problem?",
  "What should I ask Dr. Tomas next time?",
];

const SUGGESTED_QUESTIONS = USE_REAL_DATA
  ? SUGGESTED_QUESTIONS_REAL
  : SUGGESTED_QUESTIONS_MOCK;

export default function DiscussPage() {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("history");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const userIsNearBottomRef = useRef(true);
  const scrollRafRef = useRef<number | null>(null);
  const lastMessageCountRef = useRef(0);

  const [user, setUser] = useState<Profile | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Load user and sessions on mount
  useEffect(() => {
    async function init() {
      if (!USE_REAL_DATA) {
        // Mock mode: check localStorage for an existing thread
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              setView("thread");
            }
          }
        } catch {
          /* ignore */
        }
        setSessionsLoading(false);
        return;
      }

      const u = await getCurrentUser();
      if (!u) {
        setSessionsLoading(false);
        return;
      }
      setUser(u);

      // Fetch all sessions for history view
      const allSessions = await getUserSessions(u.id);
      setSessions(allSessions);
      setSessionsLoading(false);
      // Stay on history view so the user can pick a session or start new
    }
    init();
  }, []);

  // Persist to localStorage in mock mode only
  useEffect(() => {
    if (USE_REAL_DATA || isStreaming) return;
    try {
      if (messages.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {
      /* ignore */
    }
  }, [messages, isStreaming]);

  // Track whether user is near the bottom of the scroll area.
  // We only auto-scroll if they haven't scrolled up to read history.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const threshold = 120;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      userIsNearBottomRef.current = distanceFromBottom < threshold;
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [view]); // Re-bind when view changes since the container content changes

  // Auto-scroll: rAF-throttled during streaming to avoid jank.
  // Only scrolls when user is near bottom.
  useEffect(() => {
    if (!userIsNearBottomRef.current) return;

    const isNewMessage = messages.length > lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    if (isNewMessage) {
      // New message just added - scroll smoothly
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (isStreaming) {
      // Streaming content update - throttle via rAF so we don't call
      // scrollIntoView dozens of times per second
      if (scrollRafRef.current) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }

    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [messages, isStreaming]);

  // Load a specific session from history
  const loadSession = useCallback(async (session: ChatSession) => {
    const msgs = await getSessionMessages(session.id);
    setMessages(msgs.map((m) => ({ role: m.role, content: m.content })));
    setSessionId(session.id);
    setView("thread");
  }, []);

  // Start a new conversation
  const startNew = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setView("empty");
  }, []);

  // Go back to history
  const goToHistory = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setSessionId(null);
    setError(null);
    setIsStreaming(false);
    setView("history");
    // Refresh sessions list
    if (USE_REAL_DATA && user) {
      getUserSessions(user.id).then(setSessions);
    }
  }, [user]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);

      // Transition to thread view if not already there
      if (view !== "thread") {
        setView("thread");
      }

      const nextMessages: Turn[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages([...nextMessages, { role: "assistant", content: "" }]);
      setInput("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      // Ensure we have a session for Supabase persistence
      let currentSessionId = sessionId;
      if (USE_REAL_DATA && user && !currentSessionId) {
        currentSessionId = await createChatSession(
          user.id,
          trimmed.slice(0, 80)
        );
        setSessionId(currentSessionId);
      }

      // Save user message to Supabase
      if (USE_REAL_DATA && currentSessionId) {
        await saveChatMessage(currentSessionId, "user", trimmed);
      }

      try {
        const response = await fetch("/api/discuss", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            ...(USE_REAL_DATA && user
              ? { userId: user.id, sessionId: currentSessionId }
              : {}),
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are delimited by a blank line
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const rawEvent of events) {
            const dataLine = rawEvent
              .split("\n")
              .find((l) => l.startsWith("data: "));
            if (!dataLine) continue;
            const json = dataLine.slice(6);
            if (!json) continue;

            try {
              const event = JSON.parse(json);
              if (event.kind === "delta" && typeof event.text === "string") {
                accumulated += event.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                  };
                  return next;
                });
              } else if (event.kind === "error") {
                setError(event.message ?? "Something went wrong.");
              } else if (event.kind === "done") {
                // Save completed assistant message
                if (USE_REAL_DATA && currentSessionId && accumulated) {
                  saveChatMessage(currentSessionId, "assistant", accumulated);
                }
              }
            } catch {
              // Skip malformed event
            }
          }
        }
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          setError(
            "Could not reach the model just now. Check your connection and try again."
          );
          setMessages((prev) => {
            const next = [...prev];
            // Remove the empty assistant placeholder on error
            if (
              next.length > 0 &&
              next[next.length - 1].role === "assistant" &&
              next[next.length - 1].content === ""
            ) {
              next.pop();
            }
            return next;
          });
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming, sessionId, user, view]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <MemberShell
      sidebar={buildSidebar("/member/discuss")}
      userInitials={user?.display_name?.[0]?.toUpperCase() || "A"}
    >
      <div
        style={{
          fontFamily: SYSTEM_FONT,
          display: "flex",
          flexDirection: "column",
          height: "calc(100dvh - 80px)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Scrollable content area - single stable container, no AnimatePresence swap */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {view === "history" && (
            <HistoryView
              sessions={sessions}
              loading={sessionsLoading}
              onSelectSession={loadSession}
              onStartNew={startNew}
            />
          )}

          {view === "empty" && (
            <EmptyState onPick={send} onBack={goToHistory} />
          )}

          {view === "thread" && (
            <>
              <Header onBack={goToHistory} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  paddingBottom: 24,
                }}
              >
                {messages.map((m, i) => {
                  const isCurrentlyStreaming =
                    isStreaming &&
                    i === messages.length - 1 &&
                    m.role === "assistant";
                  return (
                    <MessageBubble
                      key={`${i}-${m.role}`}
                      role={m.role}
                      content={m.content}
                      isStreaming={isCurrentlyStreaming}
                      isExistingMessage={
                        !isCurrentlyStreaming && i < messages.length - 1
                      }
                    />
                  );
                })}
                <div ref={threadEndRef} style={{ height: 1 }} />
              </div>
            </>
          )}
        </div>

        {/* Error bar */}
        {error && (
          <ErrorBar message={error} onDismiss={() => setError(null)} />
        )}

        {/* Composer - visible on thread and empty views, hidden on history */}
        {(view === "thread" || view === "empty") && (
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={onSubmit}
            disabled={isStreaming}
          />
        )}
      </div>
    </MemberShell>
  );
}

// ============================================================================
// HistoryView - list of previous conversations
// ============================================================================

function HistoryView({
  sessions,
  loading,
  onSelectSession,
  onStartNew,
}: {
  sessions: ChatSession[];
  loading: boolean;
  onSelectSession: (s: ChatSession) => void;
  onStartNew: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ paddingBottom: 48 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            ...EYEBROW,
            color: C.terracotta,
            marginBottom: 10,
          }}
        >
          Discuss
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 10,
          }}
        >
          Your conversations
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            color: C.inkMuted,
            margin: 0,
            maxWidth: 480,
          }}
        >
          Pick up where you left off, or start something new. Precura has your
          full health file ready.
        </p>
      </div>

      {/* New conversation button */}
      <button
        onClick={onStartNew}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 24px",
          background: C.terracotta,
          color: "#fff",
          border: "none",
          borderRadius: 16,
          fontFamily: SYSTEM_FONT,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          cursor: "pointer",
          boxShadow:
            "0 8px 18px -8px rgba(201,87,58,0.42), 0 2px 6px rgba(201,87,58,0.2)",
          marginBottom: 32,
          transition: "transform 0.15s ease",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          +
        </span>
        Start a new conversation
      </button>

      {/* Sessions list */}
      {loading ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: C.inkFaint,
            fontSize: 14,
          }}
        >
          Loading conversations...
        </div>
      ) : sessions.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: C.canvasSoft,
            borderRadius: 20,
            border: `1px solid ${C.lineSoft}`,
          }}
        >
          <div
            style={{
              fontSize: 15,
              color: C.inkMuted,
              marginBottom: 6,
            }}
          >
            No conversations yet
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.inkFaint,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            Start your first conversation to ask about your health data.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {sessions.map((session, i) => (
            <SessionCard
              key={session.id}
              session={session}
              index={i}
              onClick={() => onSelectSession(session)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// SessionCard - a single conversation in the history list
// ============================================================================

function SessionCard({
  session,
  index,
  onClick,
}: {
  session: ChatSession;
  index: number;
  onClick: () => void;
}) {
  const title = session.title || "Untitled conversation";
  const preview = title.length > 80 ? title.slice(0, 77) + "..." : title;
  const dateStr = formatSessionDate(session.created_at);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        textAlign: "left",
        padding: "18px 20px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 16,
        fontFamily: SYSTEM_FONT,
        cursor: "pointer",
        boxShadow: C.shadowSoft,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {/* Chat icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${C.sageTint} 0%, ${C.sageSoft} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.sageDeep}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: C.ink,
            letterSpacing: "-0.005em",
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {preview}
        </div>
        <div
          style={{
            ...DISPLAY_NUM,
            fontSize: 11,
            fontWeight: 500,
            color: C.inkFaint,
          }}
        >
          {dateStr}
        </div>
      </div>

      {/* Chevron */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={C.stone}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </motion.button>
  );
}

function formatSessionDate(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (diffDays === 1) {
    return `Yesterday at ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (diffDays < 7) {
    return `${d.toLocaleDateString("en-GB", { weekday: "long" })} at ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: diffDays > 365 ? "numeric" : undefined,
  });
}

// ============================================================================
// Header (shown in thread view)
// ============================================================================

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            ...EYEBROW,
            color: C.terracotta,
            marginBottom: 4,
          }}
        >
          Discuss
        </div>
        <h1
          style={{
            fontSize: "clamp(22px, 3vw, 30px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
          }}
        >
          Precura{" "}
          <span
            style={{
              color: C.inkMuted,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 500,
            }}
          >
            is reviewing your data.
          </span>
        </h1>
      </div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "inherit",
          fontSize: 12,
          fontWeight: 600,
          color: C.inkMuted,
          cursor: "pointer",
          letterSpacing: "-0.005em",
          textDecoration: "underline",
          textDecorationColor: C.stone,
          textUnderlineOffset: 3,
          flexShrink: 0,
        }}
      >
        All conversations
      </button>
    </div>
  );
}

// ============================================================================
// EmptyState - the hero when starting a new conversation
// ============================================================================

function EmptyState({
  onPick,
  onBack,
}: {
  onPick: (q: string) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingBottom: 48,
        minHeight: 400,
      }}
    >
      {/* Back link */}
      <button
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: SYSTEM_FONT,
          fontSize: 13,
          fontWeight: 500,
          color: C.inkMuted,
          cursor: "pointer",
          marginBottom: 24,
          letterSpacing: "-0.005em",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All conversations
      </button>

      <div
        style={{
          ...EYEBROW,
          color: C.terracotta,
          marginBottom: 10,
        }}
      >
        New conversation
      </div>
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 48px)",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontWeight: 600,
          color: C.ink,
          margin: 0,
          marginBottom: 14,
        }}
      >
        Ask anything about your health data.{" "}
        <span
          style={{
            color: C.inkMuted,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
          }}
        >
          Precura has read your panels.
        </span>
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: C.inkMuted,
          margin: 0,
          marginBottom: 12,
          maxWidth: 560,
        }}
      >
        Your full blood panel history and doctor annotations are loaded.
        Specific markers and dates will be cited when answering - nothing is
        invented. This is not Dr. Tomas - it is your health assistant.
      </p>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: C.inkFaint,
          margin: 0,
          marginBottom: 32,
          maxWidth: 560,
          fontStyle: "italic",
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        Want to talk to Dr. Tomas directly? Ask to set up a consultation.
      </p>
      <div
        style={{
          ...EYEBROW,
          color: C.inkMuted,
          letterSpacing: "0.14em",
          marginBottom: 12,
        }}
      >
        Try one of these
      </div>
      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "1fr",
          maxWidth: 620,
        }}
      >
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "16px 18px",
              background: C.paper,
              border: `1px solid ${C.lineCard}`,
              borderRadius: 14,
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 500,
              color: C.ink,
              cursor: "pointer",
              letterSpacing: "-0.005em",
              boxShadow: C.shadowSoft,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MessageBubble - single turn in the thread
// ============================================================================

function MessageBubble({
  role,
  content,
  isStreaming,
  isExistingMessage,
}: {
  role: Role;
  content: string;
  isStreaming: boolean;
  isExistingMessage: boolean;
}) {
  const isUser = role === "user";

  // Existing messages (loaded from history) and the currently streaming message
  // should NOT animate entrance. Only newly added messages animate in.
  const shouldAnimate = !isStreaming && !isExistingMessage;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <Avatar role={role} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          maxWidth: 640,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.inkMuted,
            letterSpacing: "-0.005em",
            marginBottom: 6,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {isUser ? "You" : "Precura"}
        </div>
        <div
          style={{
            padding: "16px 20px",
            background: isUser ? C.paper : C.canvasSoft,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 18,
            borderTopLeftRadius: isUser ? 18 : 4,
            borderTopRightRadius: isUser ? 4 : 18,
            fontSize: 15,
            lineHeight: 1.65,
            color: C.inkSoft,
            letterSpacing: "-0.005em",
            boxShadow: C.shadowSoft,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            // Reserve minimum height during streaming to prevent layout shift
            minHeight: isStreaming && content.length === 0 ? 52 : undefined,
          }}
        >
          {content}
          {isStreaming && content.length === 0 && <TypingDots />}
          {isStreaming && content.length > 0 && <BlinkingCursor />}
        </div>
      </div>
    </motion.div>
  );
}

// Extracted as a standalone component so the inline style+keyframe
// is not re-created on every streaming content update.
function BlinkingCursor() {
  return (
    <>
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1em",
          background: C.terracotta,
          marginLeft: 2,
          verticalAlign: "text-bottom",
          animation: "discussBlink 1s steps(2, start) infinite",
        }}
      />
      <style jsx global>{`
        @keyframes discussBlink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </>
  );
}

function Avatar({ role }: { role: Role }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: isUser
          ? `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`
          : `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isUser ? C.ink : C.canvasSoft,
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
        boxShadow: C.shadowSoft,
      }}
    >
      {isUser ? "Y" : DOCTOR.initials}
    </div>
  );
}

function TypingDots() {
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 4,
        alignItems: "center",
        color: C.inkFaint,
      }}
    >
      <Dot delay={0} />
      <Dot delay={0.15} />
      <Dot delay={0.3} />
      <style jsx global>{`
        @keyframes discussPulse {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </span>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: C.inkFaint,
        animation: `discussPulse 1.2s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

// ============================================================================
// Composer - the input box + send button
// ============================================================================

function Composer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea as the user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: C.canvas,
        paddingTop: 12,
        paddingBottom: 8,
        flexShrink: 0,
        zIndex: 10,
        borderTop: `1px solid ${C.lineSoft}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          padding: "14px 16px 14px 20px",
          background: C.paper,
          border: `1px solid ${C.lineCard}`,
          borderRadius: 22,
          boxShadow: C.shadowCard,
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about your health data..."
          rows={1}
          disabled={disabled}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: SYSTEM_FONT,
            fontSize: 15,
            lineHeight: 1.5,
            color: C.ink,
            letterSpacing: "-0.005em",
            resize: "none",
            maxHeight: 180,
            padding: "6px 0",
          }}
        />
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          style={{
            flexShrink: 0,
            padding: "10px 20px",
            background:
              disabled || value.trim().length === 0 ? C.stone : C.terracotta,
            color: C.canvasSoft,
            border: "none",
            borderRadius: 100,
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            cursor:
              disabled || value.trim().length === 0 ? "default" : "pointer",
            boxShadow:
              disabled || value.trim().length === 0
                ? "none"
                : "0 8px 18px -8px rgba(201,87,58,0.42), 0 2px 6px rgba(201,87,58,0.2)",
            transition: "background 0.2s ease",
          }}
        >
          {disabled ? "Thinking..." : "Send"}
        </button>
      </div>
      <div
        style={{
          fontSize: 10,
          color: C.inkFaint,
          marginTop: 8,
          textAlign: "center",
          fontStyle: "italic",
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        Precura reviews your uploaded panels. It will not invent numbers. Not a
        substitute for medical advice from Dr. Tomas.
      </div>
    </form>
  );
}

// ============================================================================
// ErrorBar
// ============================================================================

function ErrorBar({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        style={{
          padding: "12px 16px",
          margin: "0 0 4px 0",
          background: C.terracottaTint,
          border: `1px solid ${C.terracottaSoft}`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          fontFamily: SYSTEM_FONT,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: C.terracottaDeep,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {message}
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            color: C.terracottaDeep,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Dismiss
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
