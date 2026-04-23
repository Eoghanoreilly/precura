"use client";

import React from "react";

export interface ActionItem {
  label: string;
  checked?: boolean;
  href?: string;
}
export interface ActionListProps {
  title?: React.ReactNode;
  items: ActionItem[];
}

export function ActionList({ title, items }: ActionListProps) {
  return (
    <div className="actlist">
      {title && <h3 className="actlist-title">{title}</h3>}
      <ul className="actlist-ul">
        {items.map((it, i) => {
          const content = (
            <>
              <span className={`actlist-check ${it.checked ? "checked" : ""}`} />
              <span className={`actlist-label ${it.checked ? "done" : ""}`}>{it.label}</span>
            </>
          );
          return (
            <li key={i} className="actlist-li">
              {it.href ? (
                <a href={it.href} className="actlist-row">{content}</a>
              ) : (
                <div className="actlist-row">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .actlist {
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          padding: var(--sp-5) var(--sp-6);
          font-family: var(--font-sans);
        }
        .actlist-title {
          font-size: var(--text-section);
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 var(--sp-3);
          letter-spacing: -0.01em;
        }
        .actlist-ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .actlist-li {
          border-bottom: 1px solid var(--line-soft);
        }
        .actlist-li:last-child { border-bottom: 0; }
        .actlist-row {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-2) 0;
          font-size: var(--text-body);
          color: var(--ink);
          text-decoration: none;
        }
        .actlist-check {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid var(--line-card);
          background: var(--paper);
          flex-shrink: 0;
        }
        .actlist-check.checked {
          background: var(--sage-deep);
          border-color: var(--sage-deep);
        }
        .actlist-label.done {
          text-decoration: line-through;
          color: var(--ink-muted);
        }
      `}</style>
    </div>
  );
}
