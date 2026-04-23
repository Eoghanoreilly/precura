"use client";

import React, { useEffect, useRef } from "react";
import { UserMessage } from "./UserMessage";
import { PrecuraMessage } from "./PrecuraMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { Turn } from "../useDiscussData";

export interface MessageListProps {
  messages: Turn[];
  streaming: boolean;
}

/**
 * MessageList - scrollable container that auto-scrolls to the bottom when a
 * new message arrives or when the streaming assistant message grows. The
 * scroll is rAF-throttled so fast token streams do not cause jank.
 */
export function MessageList({ messages, streaming }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [messages, streaming]);

  const lastIsAssistantEmpty =
    streaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content.length === 0;

  return (
    <div className="mlist">
      {messages.map((m, i) => {
        const isLast = i === messages.length - 1;
        const isStreamingThis =
          isLast && streaming && m.role === "assistant" && m.content.length > 0;
        if (m.role === "user") {
          return <UserMessage key={i} content={m.content} />;
        }
        return <PrecuraMessage key={i} content={m.content} streaming={isStreamingThis} />;
      })}
      {lastIsAssistantEmpty && <TypingIndicator />}
      <div ref={endRef} />
      <style jsx>{`
        .mlist {
          display: flex;
          flex-direction: column;
          gap: var(--sp-7);
          padding: var(--sp-6) 0;
        }
      `}</style>
    </div>
  );
}
