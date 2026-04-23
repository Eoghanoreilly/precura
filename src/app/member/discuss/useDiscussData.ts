"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createChatSession,
  saveChatMessage,
  getUserSessions,
  getSessionMessages,
} from "@/lib/data/chat";
import { getCurrentUser } from "@/lib/data/panels";
import { USE_REAL_DATA } from "@/components/member/data";
import type { Profile, ChatSession } from "@/lib/data/types";

export type Role = "user" | "assistant";

export interface Turn {
  role: Role;
  content: string;
}

export type DiscussView = "history" | "empty" | "thread";

const STORAGE_KEY = "precura-discuss-thread-v1";

export interface UseDiscussData {
  user: Profile | null;
  sessions: ChatSession[];
  sessionsLoading: boolean;
  activeSessionId: string | null;
  messages: Turn[];
  isStreaming: boolean;
  error: string | null;
  view: DiscussView;

  openSession: (sessionId: string) => Promise<void>;
  startNewSession: () => void;
  goToHistory: () => void;

  sendMessage: (text: string) => Promise<void>;
  abortStreaming: () => void;
  clearError: () => void;
}

export function useDiscussData(): UseDiscussData {
  const [user, setUser] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<DiscussView>("history");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function init() {
      if (!USE_REAL_DATA) {
        try {
          const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
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
      const list = await getUserSessions(u.id);
      setSessions(list);
      setSessionsLoading(false);
    }
    init();
  }, []);

  const refreshSessions = useCallback(async (userId: string) => {
    const list = await getUserSessions(userId);
    setSessions(list);
  }, []);

  const openSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setView("thread");
    const msgs = await getSessionMessages(sessionId);
    setMessages(msgs.map((m) => ({ role: m.role as Role, content: m.content })));
  }, []);

  const startNewSession = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    setView("empty");
  }, []);

  const goToHistory = useCallback(() => {
    setView("history");
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    if (USE_REAL_DATA && user) {
      // Refresh session list so the just-finished conversation appears
      refreshSessions(user.id).catch(() => {
        /* non-fatal */
      });
    }
  }, [user, refreshSessions]);

  const clearError = useCallback(() => setError(null), []);

  const abortStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userTurn: Turn = { role: "user", content: trimmed };
    const withUser = [...messages, userTurn];
    setMessages(withUser);
    setView("thread");
    setError(null);
    setIsStreaming(true);

    let workingSessionId = activeSessionId;
    try {
      if (USE_REAL_DATA && user && !workingSessionId) {
        // createChatSession returns the new session id (or null).
        // Pass the first ~80 chars of the user message as the title so the
        // history list has something useful to show.
        const newId = await createChatSession(user.id, trimmed.slice(0, 80));
        if (newId) {
          workingSessionId = newId;
          setActiveSessionId(newId);
          // Refresh the sessions list so the new session shows up on the
          // history view once the user goes back.
          refreshSessions(user.id).catch(() => {
            /* non-fatal */
          });
        }
      }

      if (USE_REAL_DATA && workingSessionId) {
        await saveChatMessage(workingSessionId, "user", trimmed);
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch("/api/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: withUser }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: assistantText };
          return next;
        });
      }

      if (USE_REAL_DATA && workingSessionId) {
        await saveChatMessage(workingSessionId, "assistant", assistantText);
      }

      if (!USE_REAL_DATA) {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...withUser, { role: "assistant", content: assistantText }])
          );
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Something went wrong");
      setMessages((prev) =>
        prev[prev.length - 1]?.role === "assistant" && prev[prev.length - 1]?.content === ""
          ? prev.slice(0, -1)
          : prev
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, activeSessionId, user, isStreaming, refreshSessions]);

  return {
    user,
    sessions,
    sessionsLoading,
    activeSessionId,
    messages,
    isStreaming,
    error,
    view,
    openSession,
    startNewSession,
    goToHistory,
    sendMessage,
    abortStreaming,
    clearError,
  };
}
