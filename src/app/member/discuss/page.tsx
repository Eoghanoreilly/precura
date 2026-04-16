"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DOCTOR } from "@/components/member/tokens";
import { buildSidebar, USE_REAL_DATA } from "@/components/member/data";
import { getCurrentUser } from "@/lib/data/panels";
import { createChatSession, saveChatMessage, getUserSessions, getSessionMessages } from "@/lib/data/chat";
import type { Profile } from "@/lib/data/types";

// ============================================================================
// /member/discuss
//
// A private conversation with a specialist AI that has read Anna's complete
// health file. Streams responses from /api/discuss (Claude Opus 4.6 with
// prompt caching on the system prompt).
// ============================================================================

type Role = "user" | "assistant";

interface Turn {
  role: Role;
  content: string;
}

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

const SUGGESTED_QUESTIONS = USE_REAL_DATA ? SUGGESTED_QUESTIONS_REAL : SUGGESTED_QUESTIONS_MOCK;

export default function DiscussPage() {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const prevMessageCountRef = useRef(0);
  const userIsNearBottomRef = useRef(true);
  const [user, setUser] = useState<Profile | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Load user and existing session on mount
  useEffect(() => {
    async function init() {
      if (!USE_REAL_DATA) {
        // Mock mode: load from localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setMessages(parsed);
          }
        } catch { /* ignore */ }
        return;
      }

      const u = await getCurrentUser();
      if (!u) return;
      setUser(u);

      // Load most recent session if one exists
      const sessions = await getUserSessions(u.id);
      if (sessions.length > 0) {
        const latest = sessions[0];
        setSessionId(latest.id);
        const msgs = await getSessionMessages(latest.id);
        setMessages(msgs.map(m => ({ role: m.role, content: m.content })));
      }
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
    } catch { /* ignore */ }
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
  }, []);

  // Auto-scroll only when a new message is added or during streaming,
  // and only if the user is already near the bottom.
  useEffect(() => {
    const newCount = messages.length;
    const isNewMessage = newCount > prevMessageCountRef.current;
    prevMessageCountRef.current = newCount;

    if ((isNewMessage || isStreaming) && userIsNearBottomRef.current) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
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
        currentSessionId = await createChatSession(user.id);
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
            ...(USE_REAL_DATA && user ? { userId: user.id, sessionId: currentSessionId } : {}),
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
                // Could log usage here if we surface it to the user.
              }
            } catch {
              // Skip malformed event
            }
          }
        }
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          setError(
            "I couldn't reach the model just now. Check your connection and try again."
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
    [messages, isStreaming]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const clearThread = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setSessionId(null); // Next send will create a fresh session
    if (!USE_REAL_DATA) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
  };

  return (
    <MemberShell sidebar={buildSidebar("/member/discuss")} userInitials={user?.display_name?.[0]?.toUpperCase() || "A"}>
      <div
        style={{
          fontFamily: SYSTEM_FONT,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100dvh - 80px)",
          width: "100%",
        }}
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <EmptyState key="empty" onPick={send} />
          ) : (
            <motion.div
              key="thread"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              ref={scrollContainerRef}
              style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "auto" }}
            >
              <Header onClear={clearThread} />
              <div
                style={{
                  flex: 1,
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
                      key={i}
                      role={m.role}
                      content={m.content}
                      isStreaming={isCurrentlyStreaming}
                      skipEntrance={isCurrentlyStreaming}
                    />
                  );
                })}
                <div ref={threadEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <ErrorBar message={error} onDismiss={() => setError(null)} />}

        <Composer
          value={input}
          onChange={setInput}
          onSubmit={onSubmit}
          disabled={isStreaming}
        />
      </div>
    </MemberShell>
  );
}

// ============================================================================
// Header (shown once the thread has started)
// ============================================================================

function Header({ onClear }: { onClear: () => void }) {
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
            fontSize: 10,
            fontWeight: 600,
            color: C.terracotta,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
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
          Precura AI{" "}
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
        onClick={onClear}
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
        Start a new thread
      </button>
    </div>
  );
}

// ============================================================================
// EmptyState - the hero when no conversation has started
// ============================================================================

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingBottom: 48,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.terracotta,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Discuss
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
          Precura AI has read your panels.
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
        Precura AI reviews every blood panel and annotation you've uploaded.
        It will cite specific markers and dates when answering and won't
        invent numbers. This is not Dr. Tomas - it's an AI assistant.
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
        Want to talk to Dr. Tomas directly? Ask the AI to set up a consultation.
      </p>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.inkMuted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
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
  skipEntrance,
}: {
  role: Role;
  content: string;
  isStreaming: boolean;
  skipEntrance: boolean;
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={skipEntrance ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
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
          {isUser ? "You" : "Precura AI"}
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
          }}
        >
          {content}
          {isStreaming && content.length === 0 && <TypingDots />}
          {isStreaming && content.length > 0 && (
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
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes discussBlink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </motion.div>
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
      <style jsx>{`
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
        position: "sticky",
        bottom: 0,
        background: C.canvas,
        paddingTop: 16,
        paddingBottom: 8,
        marginTop: 12,
        minHeight: 110,
        flexShrink: 0,
        zIndex: 10,
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
          placeholder="Ask about your file..."
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
              disabled || value.trim().length === 0
                ? C.stone
                : C.terracotta,
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
        Precura AI reviews your uploaded panels. It won't invent numbers.
        Not a substitute for medical advice from Dr. Tomas.
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
          marginBottom: 12,
          background: C.terracottaTint,
          border: `1px solid ${C.terracottaSoft}`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          fontFamily: SYSTEM_FONT,
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
