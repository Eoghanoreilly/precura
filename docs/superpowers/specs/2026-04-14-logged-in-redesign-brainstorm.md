# Logged-in page redesign - brainstorming spec (IN PROGRESS)

**Status:** Paused mid-brainstorm on 2026-04-14. Resume by invoking `superpowers:brainstorming` and working through the open questions below.

**Author:** Claude Opus 4.6 (handover from session of 2026-04-14)

## The brief (user's words, verbatim)

> "ok, now i want you to redesign the actual logged in page. But based on what we've designed here AND the https://precura-wine.vercel.app/smith12 design. which is 12. Airbnb health. Can you do that? any questuons?"

## Why this is hard

Two reference points, very different constraints:

- **Welcome Kit** (the new home page, `src/components/home/*`) is warm, editorial, Airbnb-host-page restraint. Desktop-first. Single-CTA hero. Cream/butter/terracotta/sage palette. Built for first-impression marketing.
- **smith12** (`src/app/smith12/*`) is an Airbnb Health app prototype. Mobile-first (max-width 430px). Airbnb's Explore / Wishlists / Profile bottom nav adapted as Explore / Actions / Profile. Uses a Cereal-style font fallback (which violates the user's Apple-system-font-only rule - needs to change in the redesign).

Blending them is not just "apply the Welcome Kit colors to smith12" - they solve different problems. The redesign has to pick which structural ideas to carry from each.

## Design inputs (read these before resuming)

### Welcome Kit home page

- `src/components/home/tokens.ts` - the canonical palette and typography scale. Use these tokens for the redesign.
- `src/components/home/Hero.tsx` - editorial headline with italic terracotta accent, warm radial highlights, single CTA.
- `src/components/home/TrustScience.tsx` - how we present Dr. Tomas + clinical citations.
- `src/components/home/LivingProfile.tsx` - the "living profile" concept: biomarkers trending over time.
- `src/components/home/WhatYouGet.tsx` - how the Welcome Kit frames the product's components.
- `src/components/home/Pricing.tsx` - warm card styling.

### smith12 "Airbnb Health"

- `src/app/smith12/layout.tsx` - navigation shell (bottom nav, top bar, max-width 430).
- `src/app/smith12/page.tsx` - root dashboard (770 lines, the biggest page).
- `src/app/smith12/blood-tests/page.tsx`, `risk/page.tsx`, `training/page.tsx`, `messages/page.tsx`, `actions/page.tsx`, `profile/page.tsx` - the 7 sub-pages.

### What the redesign is probably replacing

- `src/app/v2/dashboard/page.tsx` - the current canonical v2 logged-in dashboard.
- `src/app/dashboard/page.tsx` - the v1 dashboard, lower priority.

## Agreed so far

Nothing yet. The user gave the brief and invited questions; the handover was requested before questions were asked.

## Open questions (resume here)

Ask these one at a time per the brainstorming skill. Prefer multiple choice where possible.

1. **Which logged-in page is "the" logged-in page?**
   - a) v1 `/dashboard` (older, lowest priority)
   - b) v2 `/v2/dashboard` (current focus per `CLAUDE.md`)
   - c) A brand new canonical page that replaces both
   - d) Another Smith-style prototype at `/smith16` or similar, left next to the others for comparison

2. **Which of smith12's structural ideas carry over?**
   - Bottom nav (Explore / Actions / Profile)?
   - Mobile max-width 430?
   - The 7 sub-pages, or a flatter structure?
   - The card types and information density?

3. **Which of Welcome Kit's structural ideas carry over?**
   - Editorial headline with italic accent?
   - Warm radial highlights?
   - The "living profile" biomarker presentation?
   - Dr. Tomas's handwritten note motif?
   - The cream/butter/terracotta/sage palette (tokens.ts)?

4. **Which user persona is the redesign showcased with?**
   - a) Anna Bergstrom (returning user, 5 years of data, the Welcome Kit hero)
   - b) Erik Lindqvist (new user, onboarding)
   - c) Both, with a login switcher

5. **Is this mobile-first, desktop-first, or responsive from the start?** smith12 is mobile-only at 430px. Welcome Kit is desktop-first with a mobile reflow. Logged-in health apps are usually mobile-first but Precura has a desktop investor/demo angle too.

6. **Is this a fresh URL (e.g., `/app`, `/member`) or a replacement of an existing path?** If replacing, which one?

7. **What content surfaces matter most on the entry screen?**
   - Latest blood panel?
   - Risk trajectory?
   - Next action / doctor message?
   - Training plan?
   - All of the above in a scrollable feed, or a focused "one hero card" approach like the Welcome Kit hero?

8. **Scope: redesign just the entry screen, or the whole logged-in shell?** smith12 has 8 pages; the redesign could be the landing view only and leave the sub-pages for later.

9. **Font stack confirmation.** smith12 uses a Cereal fallback which violates the Apple-system-font-only rule. The redesign should use the system stack from the Welcome Kit tokens. Confirm.

10. **Output expectation.** Is the deliverable (a) working code committed as a PR, (b) a Figma-style mockup first for review, or (c) a Smith-style prototype next to the others (no merge, just a visual option)?

## Proposed process (after questions are answered)

1. Resolve questions 1-10 above via brainstorming dialogue
2. Propose 2-3 distinct structural approaches with trade-offs (blend directions: e.g., "Welcome Kit layout + smith12 nav", "smith12 shell + Welcome Kit palette", "fresh synthesis")
3. User picks a direction
4. Present the design in sections (shell, entry screen, card types, key interactions)
5. User approves, I write the final spec, user reviews, I invoke `superpowers:writing-plans`
6. Writing-plans produces an implementation plan
7. Build with `superpowers:executing-plans` using the build-evaluate-refine cycle from `~/.claude/CLAUDE.md`

## Hard constraints (from user's global rules)

- Apple system font stack ONLY. No Cereal, no Google Fonts.
- No em dashes, en dashes, unicode arrows. ASCII only.
- No left border accents on cards.
- Stats must be real, verifiable, sourced.
- No "Swedish X" marketing adjective. Keep operational facts only.
- No "one annual membership" framing.
- SwiftUI text styles only on any mobile code (not relevant to web but worth remembering if we also do an iOS angle).
- Light mode, warm, friendly. Not clinical, not dark.
- Every chart: gradients, smooth animations, touch interaction, tooltips.
- All medical terms include plain English.

## Hard constraints (from `precura/CLAUDE.md`)

- Apache ECharts for charts (not Nivo, not recharts).
- Tailwind CSS v4 + inline style objects (the Welcome Kit components use inline styles, not Tailwind classes - match that pattern).
- Next.js 16 App Router.
- All state in localStorage with mock data (no backend).
- Use `src/lib/v2/mock-patient.ts` for Anna's data.
- Build must pass before commit. Deploy via `npx vercel --yes --prod --scope moonflows-projects-9c4fc1f9`.

## Do NOT do

- Do not start writing code until brainstorming lands on an approved design.
- Do not touch the Welcome Kit home page files (`src/components/home/*`) unless the redesign needs a tokens update.
- Do not touch the existing Smith prototypes (`src/app/smith1` through `src/app/smith15`) - they are frozen prototypes.
- Do not touch `src/components/home/Pricing.tsx` - pending separate pricing rework.
- Do not invent stats.
