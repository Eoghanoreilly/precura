"use client";

import React from "react";
import { EditorialColumn, Hero, Button } from "@/components/layout";
import { SessionCard } from "./sessions/SessionCard";
import type { ChatSession } from "@/lib/data/types";

export interface HistoryViewProps {
  sessions: ChatSession[];
  loading: boolean;
  onOpenSession: (id: string) => void;
  onStartNew: () => void;
}

/**
 * HistoryView - list of past conversations with a New conversation CTA.
 * Empty state: quiet hero with the CTA centred.
 */
export function HistoryView({
  sessions,
  loading,
  onOpenSession,
  onStartNew,
}: HistoryViewProps) {
  if (loading) {
    return (
      <EditorialColumn variant="narrow">
        <div className="hv-loading">Loading your conversations...</div>
        <style jsx>{`
          .hv-loading {
            padding: var(--sp-9) 0;
            color: var(--ink-faint);
            font-style: italic;
            font-family: var(--font-serif);
            text-align: center;
          }
        `}</style>
      </EditorialColumn>
    );
  }

  if (sessions.length === 0) {
    return (
      <EditorialColumn variant="narrow">
        <Hero
          tone="quiet"
          eyebrow={
            <em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>
              Start a conversation
            </em>
          }
          display="Ask Precura anything about your health."
          body={
            <p>
              Your data is loaded into the context. Ask about trends, specific markers, or what to discuss with your doctor.
            </p>
          }
          ctas={
            <Button tone="sage" onClick={onStartNew}>
              New conversation
            </Button>
          }
        />
      </EditorialColumn>
    );
  }

  return (
    <EditorialColumn variant="narrow">
      <div className="hv-header">
        <h1 className="hv-title">Your conversations</h1>
        <Button tone="sage" onClick={onStartNew}>
          New conversation
        </Button>
      </div>
      <div className="hv-list">
        {sessions.map((s) => (
          <SessionCard
            key={s.id}
            session={s as ChatSession & { preview?: string; messageCount?: number }}
            onOpen={onOpenSession}
          />
        ))}
      </div>
      <style jsx>{`
        .hv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--sp-6);
          padding-top: var(--sp-4);
          gap: var(--sp-4);
          flex-wrap: wrap;
        }
        .hv-title {
          font-size: var(--text-title);
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.02em;
          margin: 0;
        }
        .hv-list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
          padding-bottom: var(--sp-9);
        }
      `}</style>
    </EditorialColumn>
  );
}
