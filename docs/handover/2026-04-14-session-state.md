# Session handover - 2026-04-14

Everything a fresh Claude Code session needs to resume work on Precura from this point. Read top-to-bottom.

## TL;DR

- Two open PRs fix the new Welcome Kit home page (sign-in link + inclusive copy). Merge them in order before starting fresh work.
- One in-flight creative task: **redesign the logged-in page** by blending the Welcome Kit aesthetic with the `smith12` "Airbnb Health" prototype. Brainstorming was paused after the brief and before the clarifying questions. Resume via the spec stub in `docs/superpowers/specs/2026-04-14-logged-in-redesign-brainstorm.md`.
- The `precura/CLAUDE.md` in this branch is updated to reflect the new reality (Welcome Kit is canonical, Smith prototypes exist, copy rules tightened).

## Current git state

Branches on disk:

- `main` - does not yet contain the recent home page fixes
- `fix/home-nav-login-link` - NavBar sign-in link fix (PR #1)
- `fix/home-copy-inclusive-sweep` - stacked on #1, inclusive copy rewrite (PR #2)
- `docs/session-handover-2026-04-14` - this handover (PR #3, this file)
- `feature/home-page-designs` - parent of the recent home page work, already pushed
- `feature/agent-smith-designs` - parent of the Smith prototypes, already pushed

Open PRs:

1. **#1 - `fix/home-nav-login-link`** - target main. NavBar "Sign in" pointed to `#pricing` and was hidden below 900px. Now points to `/login` and is visible at all widths.
2. **#2 - `fix/home-copy-inclusive-sweep`** - target main, stacked on #1. Hero headline + subhead rewrite and site-wide sweep to drop gratuitous "Swedish X" marketing language and "one annual membership" framing. Keeps all operational facts (1177, BankID, SEK, Socialstyrelsen, Karolinska, patientdatalagen, Stockholm address, Made in Sweden footer, Swedish-licensed clinic badge).
3. **#3 - `docs/session-handover-2026-04-14`** - this handover. Target main. Safe to merge independently.

**Merge order for the fresh session:** #1 -> #2 -> #3. Once all three land on main, the fresh session has the full context loaded via `precura/CLAUDE.md` and this handover.

## What shipped in this session

### 1. NavBar sign-in fix (PR #1, deployed)

`src/components/home/NavBar.tsx`:

- `href="#pricing"` -> `href="/login"` on the Sign in link.
- Removed the mobile hide rule that made the Sign in link disappear below 900px.

Deployed to `https://precura-wine.vercel.app`.

### 2. Inclusive home copy rewrite (PR #2, deployed)

Files touched:

- `src/components/home/Hero.tsx` - new headline "See your future health. Before the system does." (italic terracotta on second clause). New subhead drops "Swedish adults", "one Swedish GP", "a year of", and "four blood panels".
- `src/components/home/Footer.tsx` - tagline drops "Predictive health for Sweden. One annual membership, one Swedish doctor".
- `src/components/home/FinalCTA.tsx` - "Accepting new members / Sweden" -> "Accepting new members". "A Swedish doctor reads" -> "Licensed doctors review".
- `src/components/home/TrustScience.tsx` - "Run by a Swedish doctor" -> "Run by licensed doctors". Dr. Tomas bio chip drops "Swedish-licensed GP". Citation body drops "Swedish GPs use today".
- `src/components/home/FAQ.tsx` - Dr. Tomas bio drops "Swedish" from "primary care". "Swedish-licensed GP (Dr. Tomas Kurakovas)" -> "licensed doctor (Dr. Tomas Kurakovas)". Socialstyrelsen reference retained.
- `src/components/home/WhatYouGet.tsx` - "same models Swedish GPs trust" -> "same models doctors trust".
- `src/components/home/LivingProfile.tsx` - "Low for the Swedish winter months" -> "Low for the winter months".
- `src/components/home/ProblemStrip.tsx` - heading "The Swedish healthcare system is good at treatment" -> "The system is good at treatment" (creates thematic callback to new hero).

Deployed to `https://precura-wine.vercel.app`.

### 3. Judgment calls made during the sweep

- **ProblemStrip stat "1 in 2 Swedes with type 2 diabetes are undiagnosed"** was left untouched. It is cited to Nationella Diabetesregistret 2024, so "Swedes" is accurate to the source population, not marketing flavor. Flagged to the user: if they want it rephrased, we need either a new source or explicit permission to re-cite.
- **"Swedish-licensed clinic" badge in `src/components/home/Pricing.tsx`** was left untouched per explicit user instruction. Retained as a factual credential.
- **Pricing section (`src/components/home/Pricing.tsx`)** - still shows three tiers at SEK/year despite the new hero messaging implying flexible commitments. User chose to leave Pricing as-is and do flexible terms (once-off / 3 months / 6 months / year) as a separate PR once the actual prices are decided. Do not touch Pricing without explicit new prices.
- **TrustScience has a plural/singular tension**: the new headline says "Run by licensed doctors" (plural, per brand rule "fake it till you make it") while the body still says "Dr. Tomas personally reviews every new member's baseline panel". This is a deliberate marketing sleight of hand the user approved. The plural header implies a small team, the body names the one real doctor. If the team actually grows, the body stays accurate. If Precura only ever has Dr. Tomas, it reads as aspirational.

## What was NOT touched (explicit scope boundary)

These items came up in conversation but were deferred. Do not touch them without re-asking the user:

- **Pricing section cadence** - flexible term rework pending real price decisions.
- **ProblemStrip "1 in 2 Swedes" stat** - pending source decision.
- **Smith prototypes (smith1-15)** - not in scope for home page fixes.
- **All v1 pages** (`/src/app/dashboard`, `/src/app/login`, etc.) - except the NavBar link target.
- **All v2 pages** (`/src/app/v2/*`) - not touched.

## In-flight creative task: Redesign the logged-in page

User's brief, verbatim:

> "ok, now i want you to redesign the actual logged in page. But based on what we've designed here AND the https://precura-wine.vercel.app/smith12 design. which is 12. Airbnb health. Can you do that? any questuons?"

**Status:** Brainstorming invoked (superpowers:brainstorming), initial project exploration begun, paused before clarifying questions. The user interrupted to request this handover.

**Design inputs:**

1. **Welcome Kit** (new home page, `src/components/home/*`) - warm cream/butter/terracotta/sage palette, editorial type, Airbnb-host restraint, single-CTA hero philosophy, "see your future health before the system does" positioning.
2. **smith12** (`src/app/smith12/*`, 8 pages, ~3300 lines) - "Airbnb Health" prototype. Mobile-first (max-width 430), Airbnb-style bottom nav (Explore / Actions / Profile), Cereal-style font stack (user's hard rule against this: Apple system font only — this will need to change in the redesign), 3300 lines of prototype across dashboard + 7 sub-pages.

**What to do next (fresh session):** Read `docs/superpowers/specs/2026-04-14-logged-in-redesign-brainstorm.md` and resume brainstorming from the question list there.

## User-level context (things that bit us in this session)

- **Sweden-specific marketing flavor** is a pet peeve. User called it "a liiiiittta racist". The blanket rule going forward: keep Sweden where it is a fact (operational, legal, shipping, credentials), strip it where it is adjective flavor ("Swedish adults", "Swedish GP", "Swedish healthcare system").
- **"One annual membership" is banned in marketing copy.** User wants to fake-it-till-you-make-it on flexible commitments (once-off / 3mo / 6mo / year) even if the product currently only sells annual. The Pricing section's "SEK / year" pricing is fine as a fact; the hero / footer / final CTA must not frame annual as the differentiator.
- **"Licensed doctors" plural is the blanket replacement** for any singular "Swedish-licensed GP" / "Swedish doctor" marketing copy. Exception: when Dr. Tomas is named in a bio paragraph, singular + named is OK. The goal is to not reveal the one-doctor reality in brand copy.
- **Stats must be real, verifiable, backed up.** Do not invent numbers. Do not rephrase a sourced stat in a way that invalidates the source.
- **No em dashes or unicode arrows anywhere.** Hyphens, slashes, ASCII only. This is a hard rule across all Precura content.
- **Apple system font stack only.** Never DM Sans, Space Mono, Inter, Roboto, Cereal, or any Google Font. This applies to the logged-in redesign too, even though smith12 uses a Cereal fallback.
- **Left border accents on cards are banned** (AI giveaway). Hard rule.
- **SwiftUI-equivalent text styles only** on iOS, never hard-coded font sizes. Relevant for any RN/SwiftUI code we might generate, not web.

## References the fresh session should read

In priority order:

1. **This file** (`docs/handover/2026-04-14-session-state.md`)
2. **`docs/superpowers/specs/2026-04-14-logged-in-redesign-brainstorm.md`** - the in-progress spec stub for the redesign
3. **`precura/CLAUDE.md`** - updated in this branch with Welcome Kit + Smith + copy rules + in-flight work
4. **`src/components/home/*`** - Welcome Kit source (14 components + tokens.ts)
5. **`src/app/smith12/*`** - Airbnb Health prototype (layout + 8 pages)
6. **`src/app/v2/dashboard/page.tsx`** - the existing v2 logged-in dashboard that the redesign is probably replacing
7. **`src/app/dashboard/page.tsx`** - the existing v1 logged-in dashboard (older design, lower priority)

## Next action for the fresh session

```
1. Verify PRs #1, #2, #3 have all merged to main.
2. git checkout main && git pull
3. Read docs/handover/2026-04-14-session-state.md (this file)
4. Read docs/superpowers/specs/2026-04-14-logged-in-redesign-brainstorm.md
5. Resume the logged-in redesign by invoking superpowers:brainstorming
   and starting with the open questions in the spec stub
```

That is the whole handover. Questions or gaps should be added to this file as they come up.
