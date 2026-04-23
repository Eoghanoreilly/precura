"use client";

import React from "react";
import { Hero, Button } from "@/components/layout";
import type { MorningSummaryData } from "./buildMorningSummary";

export interface MorningSummaryProps {
  data: MorningSummaryData;
  onSelectPatient: (id: string) => void;
  doctorFirstName: string;
}

function formatMorning(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/**
 * First-load right-pane content: warm-wash hero with a data-grounded briefing
 * plus a short action list. Clicking an action selects the relevant patient.
 */
export function MorningSummary({ data, onSelectPatient, doctorFirstName }: MorningSummaryProps) {
  return (
    <div className="ms-root">
      <div className="ms-scroll">
        <Hero
          tone="warm"
          eyebrow={
            <em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>
              Morning briefing &middot; {formatMorning()}
            </em>
          }
          display={data.headline}
          body={
            <>
              <p>Good morning, {doctorFirstName}.</p>
              {data.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </>
          }
          sig={<em style={{ fontFamily: "var(--font-serif)" }}>Pre-read by Precura</em>}
        />

        {data.topActions.length > 0 && (
          <section className="ms-actions">
            <h2 className="ms-title">Top of the list</h2>
            <ul className="ms-list">
              {data.topActions.map((a) => (
                <li key={a.patientId} className="ms-item">
                  <div className="ms-item-body">
                    <div className="ms-item-label">{a.label}</div>
                    <div className="ms-item-context">{a.context}</div>
                  </div>
                  <Button tone="sage" onClick={() => onSelectPatient(a.patientId)}>
                    Open
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <style jsx>{`
        .ms-root {
          height: 100%;
          overflow: hidden;
          background: var(--canvas-soft);
          display: flex;
          flex-direction: column;
        }
        .ms-scroll {
          flex: 1;
          overflow-y: auto;
          padding: var(--sp-7) var(--sp-7) var(--sp-11);
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        .ms-actions { margin-top: var(--sp-4); }
        .ms-title {
          font-size: var(--text-micro);
          font-weight: 600;
          color: var(--ink-faint);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 var(--sp-4);
        }
        .ms-list { list-style: none; padding: 0; margin: 0; }
        .ms-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-4);
          padding: var(--sp-4) 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .ms-item:last-child { border-bottom: 0; }
        .ms-item-body { flex: 1; min-width: 0; }
        .ms-item-label {
          font-size: var(--text-body);
          font-weight: 500;
          color: var(--ink);
          margin-bottom: var(--sp-1);
        }
        .ms-item-context {
          font-size: var(--text-meta);
          color: var(--ink-soft);
          line-height: var(--line-height-body);
        }
      `}</style>
    </div>
  );
}
