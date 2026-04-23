"use client";

import React from "react";
import Link from "next/link";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  NextPanelHint,
  RailNav,
  EditorialColumn,
  Hero,
} from "@/components/layout";

const CONCEPTS = [
  {
    slug: "triage",
    title: "Triage queue",
    tagline: "Urgency-first ranked list. The doctor's day is a ranked handover.",
    refs: "ER board / shift handover / hospital rounds",
  },
  {
    slug: "pipeline",
    title: "Kanban pipeline",
    tagline: "Patients as cards across a 5-column lifecycle board.",
    refs: "Linear board / Notion Kanban / Airtable status",
  },
  {
    slug: "briefing",
    title: "Morning briefing",
    tagline: "Warm-wash editorial memo. The page is the prose.",
    refs: "Apple Newsroom / Stripe Press / NYT morning briefing",
  },
  {
    slug: "inbox",
    title: "Unified inbox",
    tagline: "Every action as a typed inbox item with keyboard shortcuts.",
    refs: "Superhuman / Linear triage / Hey",
  },
  {
    slug: "workbench",
    title: "Workbench database",
    tagline: "Sortable / filterable patient roster with dense columns.",
    refs: "Linear issues / Notion database / Airtable grid",
  },
  {
    slug: "messages",
    title: "Dual-pane messages",
    tagline: "Gmail-style: patient list left, conversation + file right.",
    refs: "Gmail / Front / Linear triage",
  },
];

export default function ConceptsIndexPage() {
  const sideRail = (
    <SideRail
      logo={<Wordmark />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: "Dr. Tomas Kurakovas", initials: "TK", memberSince: "Design exploration" }}
          doctor={{ name: "Precura clinic", initials: "P", title: "Doctor portal concepts" }}
        />,
        <NextPanelHint key="np" eyebrow="Concept set" headline="6 directions" subtext="Pick the strongest" />,
        <RailNav
          key="nav"
          items={CONCEPTS.map((c) => ({ label: c.title, href: `/doctor/concepts/${c.slug}` }))}
        />,
      ]}
    />
  );

  return (
    <PageShell sideRail={sideRail} userInitials="TK" activeHref="/doctor/concepts">
      <EditorialColumn>
        <Hero
          tone="warm"
          eyebrow={<em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>Doctor portal exploration</em>}
          display="Six directions for Dr. Tomas's daily driver."
          body={
            <p>
              Six independent design agents produced one concept each, each with a unique structural constraint so no two look alike. Same mock patient data across all six. Click through to see each approach live, then we pick the strongest.
            </p>
          }
        />

        <div className="concept-grid">
          {CONCEPTS.map((c) => (
            <Link key={c.slug} href={`/doctor/concepts/${c.slug}`} className="concept-card">
              <div className="concept-slug">{c.slug}</div>
              <div className="concept-title">{c.title}</div>
              <div className="concept-tagline">{c.tagline}</div>
              <div className="concept-refs">Refs &middot; {c.refs}</div>
            </Link>
          ))}
        </div>

        <style jsx>{`
          .concept-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--sp-4);
            padding-bottom: var(--sp-11);
          }
          @container main-col (min-width: 700px) {
            .concept-grid { grid-template-columns: 1fr 1fr; }
          }
          @container main-col (min-width: 1000px) {
            .concept-grid { grid-template-columns: 1fr 1fr 1fr; }
          }
          .concept-card {
            display: block;
            background: var(--paper);
            border: 1px solid var(--line-soft);
            border-radius: var(--radius-card);
            padding: var(--sp-5);
            text-decoration: none;
            color: var(--ink);
            font-family: var(--font-sans);
            transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }
          .concept-card:hover {
            transform: translateY(-2px);
            border-color: var(--line-card);
            box-shadow: var(--shadow-card);
          }
          .concept-slug {
            font-size: var(--text-micro);
            color: var(--terracotta);
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: var(--sp-2);
          }
          .concept-title {
            font-size: var(--text-section);
            font-weight: 600;
            color: var(--ink);
            letter-spacing: -0.01em;
            margin-bottom: var(--sp-2);
          }
          .concept-tagline {
            font-size: var(--text-body);
            line-height: var(--line-height-body);
            color: var(--ink-soft);
            margin-bottom: var(--sp-3);
          }
          .concept-refs {
            font-size: var(--text-meta);
            color: var(--ink-faint);
            font-style: italic;
            font-family: var(--font-serif);
          }
        `}</style>
      </EditorialColumn>
    </PageShell>
  );
}
