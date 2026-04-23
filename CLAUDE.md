# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

**Session state, handover notes, and in-progress specs live outside the repo** at `~/.claude/projects/-Users-eoghan-Desktop-precura/` (subfolders: `handover/`, `specs/`). Read those when resuming work - they are not auto-loaded.

## Build and Development Commands

```bash
# IMPORTANT: Always source nvm first. Node 20+ is required.
source ~/.nvm/nvm.sh && nvm use 20

# Development
npm run dev              # Start dev server on localhost:3000

# Build (ALWAYS run before committing)
npm run build            # Production build - must pass with 0 errors

# Lint
npm run lint             # ESLint

# Deploy to Vercel
npx vercel --yes --prod --scope moonflows-projects-9c4fc1f9

# Supabase CLI (linked to project xturbbklghicpgucwhwy)
npx supabase db push     # Apply migrations to remote
```

## Git Workflow

- Create feature branches, never push directly to main
- PRs with descriptions for every change
- Build MUST pass before committing
- Clean commit messages explaining WHY, not just WHAT
- Always include: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
- .npmrc has `legacy-peer-deps=true` for echarts-gl compatibility

## Project Overview

Precura is a predictive health platform. Multiple surfaces coexist:

- **Welcome Kit** at `/`. Components in `src/components/home/*`. Warm Airbnb-host aesthetic. Not yet on the shared token system; still its own palette.
- **Member app** (`/src/app/member/`). Real Supabase backend. Home + `/discuss` rewritten on the editorial design system (PRs #11 + #12, 2026-04-22 to 04-23). Panel detail partially migrated (SystemTile reuse). Remaining pages (panels list, new panel, messages, profile, training) still on the `MemberShell` shim.
- **Doctor portal** (`/src/app/doctor/`) - NEW in PR #14 (2026-04-23). Dual-pane daily driver at `/doctor`, tabbed patient file at `/doctor/patient/[id]`, magic-link + role-gated middleware, `profiles.role in (doctor, both)`.
- **Layout primitives** (`/src/components/layout/`) - 8 shared primitives (PR #11). `PageShell`, `SideRail`, `EditorialColumn`, `Hero`, `SubGrid`, `NarrativeCard`, `SystemTile`, `ActionList` + `Button`. Used by member home, discuss, and the doctor portal.
- **Doctor concepts** (`/src/app/doctor/concepts/*`) - 6 design-exploration artifacts from PR #13 kept for reference. Do not touch.
- **v1** (`/src/app/`) - Original MVP demo. Frozen reference.
- **v2** (`/src/app/v2/`) - Full platform mock prototype. Frozen reference.
- **Smith prototypes** (`/src/app/smith1` through `smith15`) - Frozen reference. Do not touch.

**Live URL:** https://precura-wine.vercel.app
**GitHub:** https://github.com/Eoghanoreilly/precura

## Architecture

### Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Supabase (Postgres + Auth + RLS, EU Stockholm region) - @supabase/supabase-js + @supabase/ssr
- Anthropic SDK (@anthropic-ai/sdk) - Claude Haiku for chat, prompt caching
- Apache ECharts (echarts-for-react) for charts - NOT Nivo, NOT recharts (legacy deps, can remove)
- lucide-react for icons
- Deployed on Vercel

### Environment Variables (in `.env.local`, also on Vercel)
```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Public anon key (safe to expose, RLS enforces)
SUPABASE_SERVICE_ROLE_KEY       # Server-side only, NEVER expose in client code
ANTHROPIC_API_KEY               # For /api/discuss and /api/parse-panel
ALLOWED_EMAILS                  # Comma-separated, enforced by middleware on /member/* and /doctor/*
```

### Key Directories
```
src/app/member/        # Member app (real data, real auth)
src/app/doctor/        # Doctor portal (real data, role-gated)
src/app/doctor/concepts/  # Six design-exploration concepts from PR #13 (reference only)
src/app/api/           # API routes (discuss, parse-panel, dev-login)
src/app/v2/            # v2 prototype (frozen, mock data)
src/components/layout/ # Shared editorial primitives (PR #11)
src/components/home/   # Welcome Kit home page components
src/components/member/ # Member app components (MemberShell shim, charts)
src/lib/data/          # Supabase data helpers (panels, annotations, chat, doctor, types)
src/lib/supabase/      # Supabase client/server/middleware helpers
src/lib/discuss/       # Chat system prompt builder
src/lib/v2/            # v2 mock data (frozen)
middleware.ts          # Root middleware - matches /member/:path* AND /doctor/:path*
supabase/migrations/   # Database schema migrations
```

### Member App Page Map
```
/member/login              # Magic link auth + dev quick login
/member/auth/callback      # Handles magic link token; reads ?next= to route doctors to /doctor
/member                    # Adaptive 7-state home page (PR #11 editorial rewrite)
/member/panels/new         # Manual biomarker entry + paste-and-parse (still MemberShell shim)
/member/panels/[id]        # Panel detail: SystemTile-based marker cards (partial PR #11 migration)
/member/panels             # Panel list (still MemberShell shim)
/member/discuss            # Editorial chat (PR #12 rewrite)
/member/messages           # Annotation feed ("Notes")
/member/profile            # Settings (still hardcoded)
/member/training           # Workout program (still mock data)
```

### Doctor Portal Page Map (NEW, PR #14)
```
/doctor/login              # Magic link + "Sign in as doctor" dev quick login
/doctor                    # Dual-pane home: urgency-sorted patient list + case log + composer
/doctor/patient/[id]       # Tabbed patient file (Overview / Panels / Notes / Chat)
/doctor/concepts           # Index of 6 design-exploration pages (reference)
/doctor/concepts/<slug>    # Six concept pages (triage/pipeline/briefing/inbox/workbench/messages)
```

### API Routes
```
/api/discuss               # Streaming chat - Claude Haiku, prompt caching, Supabase context
/api/parse-panel           # Claude Haiku extracts markers from pasted lab text
/api/dev-login             # Dev quick login: verifies server-side, sets cookies on response
                           # Optional body: { email, role?, redirect? } - role flips profile before auth
```

### Adaptive Home Page State Machine

The member home page is a thin router at `src/app/member/page.tsx` (96 lines after PR #11). State detection lives in `src/app/member/home/determineState.ts` and each state renders in its own file under `src/app/member/home/`. Priority fallthrough: G > F > E > D > C > B > A.

| State | Condition | Template | Hero |
|-------|-----------|----------|------|
| A | No data | Narrative | Warm welcome + CTA |
| B | First panel, no review | Home-Data | Quiet hero + 3-up flagged + 3-up body systems |
| C | Doctor reviewed (1 panel) | Narrative | Warm doctor letter + 3-up body systems |
| D | Multiple panels | Home-Data | Quiet trajectory hero + 2-up trajectory / note + 4-up sparklines |
| E | Steady state | Narrative | Quiet steady hero + 3-up body systems (lower contrast) |
| F | New results | Home-Data | Warm WhatMoved reveal + 3-up body systems + 2-up flagged |
| G | New doctor note | Narrative | Warm doctor letter + "New" pill eyebrow + 3-up body systems |

Responsive column widths: 720 (tablet) -> 880 (laptop) -> 1040 (desktop) -> 1160 (large). `SubGrid` collapses by container width via `@container` queries, not viewport. Hidden zones render nothing.

### Doctor Portal Architecture

Role-gated via middleware: `/doctor/*` requires `profiles.role in (doctor, both)`. Strict doctors on `/member/*` redirect to `/doctor`.

Daily-driver home at `/doctor`:
- Left pane: `useDoctorData` loads all allowlisted users (minus self), computes a rollup per patient (`pending_review | awaiting_patient | active | stale | new_member`), sorts by urgency (`src/app/doctor/home/sortPatients.ts`)
- Right pane: selected patient's case log (annotations timeline) + flagged-marker chip strip + sticky sage composer (`Cmd/Ctrl+Return` to post)
- First-load right pane: deterministic morning summary built from the rollup (`src/app/doctor/home/buildMorningSummary.ts`)

Patient file at `/doctor/patient/[id]`:
- Tabs: Overview (Precura summary + latest panel `BodySystemsGrid` + flagged `SystemTile` grid), Panels (chronological list linking to `/member/panels/[id]`), Notes (composer + full annotation timeline), Chat (read-only view of patient's Precura conversations)

Doctor annotations always attach to a panel (`target_type: 'panel'`). General patient notes deferred.

### Supabase Schema
Tables: `profiles`, `panels`, `biomarkers`, `annotations`, `chat_sessions`, `chat_messages`
- RLS: mutual read (2 allowlisted users), personal write
- Auto-profile trigger on auth.users insert
- Migration at `supabase/migrations/001_initial_schema.sql`

### Swedish Biomarker Name Handling

Real Swedish labs use prefixed names (P-ALAT, S-TSH, fP-Triglycerid). The data layer in `src/components/member/data.ts`:
1. Strips prefixes: `P-`, `S-`, `fP-`, `B-`, `Hb-`
2. Normalizes to lowercase
3. Matches against lookup table for body system category
4. Falls back to "Other"

The 55-marker lookup in `src/lib/data/marker-defaults.ts` provides auto-fill for units, ref ranges, and plain English names.

### v2 Page Map (mock data prototype, separate from /member)
```
/v2/login              # Mock BankID login (Anna = returning, Erik = new)
/v2/connect            # 1177 health data import
/v2/dashboard          # Main page - responsive grid
/v2/health             # Deep health view - risk models, blood markers
/v2/blood-tests        # Order tracking
/v2/blood-tests/results # Results + doctor's note
/v2/doctor             # iMessage-style messaging
/v2/chat               # Chat with mock history
/v2/training           # Workout program
/v2/membership         # Pricing
/v2/profile            # Settings
/v2/provider/*         # Provider portal (dashboard, patient, vardcentral)
```

## Design System - CRITICAL RULES

### Fonts
- Apple system fonts ONLY: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif`
- Mono: `"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace`
- NEVER use Google Fonts (DM Sans, Space Mono, Inter, Roboto are all banned)

### Colors
All via CSS variables in `globals.css`:
- Backgrounds: `--bg`, `--bg-card`, `--bg-elevated`, `--bg-warm`
- Text: `--text`, `--text-secondary`, `--text-muted`, `--text-faint`
- Health status: `--green/--amber/--red/--teal/--blue/--purple` (each has `-bg` and `-text`)
- Brand: `--accent` (#5c6bc0), `--accent-light` (#e8eaf6)
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Layout
- Light mode only. Warm, friendly aesthetic
- Mobile-first with responsive breakpoints
- Desktop 2-column grid activates at 1200px+ (accounts for MemberShell sidebar width)
- Cards: `rounded-2xl` or `rounded-3xl`, `border: 1px solid var(--border)`, `boxShadow: var(--shadow-sm)`
- NO left border accents on cards (AI giveaway)

### Approved Chart Styles
- **Range bar**: green zone highlighted, triangle marker pointing down
- **Zone bar**: colored segments (green/teal/amber/red/dark red), white dot marker
- **Trend line**: zone background bands, gradient line, no floating dots
- **Gauge**: text-centric zone bar with triangle (NOT arc gauges)
- **Sparkline**: gradient line, endpoint dot only
- **Factor breakdown**: donut with legend
- Use Apache ECharts for interactive charts, CSS for simple bars/indicators

### Content Rules - HARD REQUIREMENTS
- **Never use the word "AI"** anywhere in the product. Not in UI, copy, labels, buttons. It's "Precura" or describe the function.
- **Never make fake promises.** No delivery time estimates unless backed by a real system. No "we'll notify you" unless notifications work.
- **Doctor review is automatic** - part of the service, not something users request. No "request review" buttons.
- **Body systems as compact grid** with inline range bars showing WHERE values sit.
- All medical terms MUST include plain English: "HbA1c (long-term blood sugar)" not "HbA1c"
- Risk labels ALWAYS say "X risk" not just "X" ("Low risk" not "Low")
- No generic health advice. Be specific to the user's data.
- No em dashes, en dashes, or unicode arrows anywhere. Hyphens, slashes, ASCII only.
- No gratuitous "Swedish X" in marketing copy. Keep Sweden where operational (1177, BankID, SEK, etc.).
- "Licensed doctors" (plural) in brand copy. Dr. Tomas singular only when named in bio.
- Stats must be real, verifiable, sourced. No invented numbers.
- Quality over speed. One polished component beats ten rushed ones.

## Known Issues and TODOs

### Current blockers
- Tomas's email needs to be added to ALLOWED_EMAILS (env var + Vercel)
- No notification system (Tomas doesn't know when panels are uploaded)
- No sign-out wired to Supabase auth

### Pages needing work
- `/member/profile` - still shows hardcoded data
- `/member/training` - still on mock data
- Old `/login` page (Anna/Erik demo) still exists alongside `/member/login`

### Missing /member features
- Panel edit/delete from home page (only from panel detail)
- Doctor review workflow
- Panel comparison / WhatMoved for State F
- Sparkline trends on home for returning users

### Missing v2 pages (deferred)
- `/v2/onboarding` - multi-tool onboarding (PHQ-9, GAD-7, FINDRISC, etc.)
- `/v2/provider/triage` - triage nurse view
- `/v2/provider/trainer` - trainer client view

### Legacy dependencies to remove
- `@nivo/*` packages
- `recharts`
- `echarts-gl` (only used in temp chart gallery)

## Deployment

```bash
# Full deploy sequence
source ~/.nvm/nvm.sh && nvm use 20
npm run build                    # Must pass
git add -A
git commit -m "description"     # Include Co-Authored-By
git push origin main
npx vercel --yes --prod --scope moonflows-projects-9c4fc1f9
```

Vercel team: `moonflows-projects-9c4fc1f9`
Production URL: `https://precura-wine.vercel.app`
Supabase project: `xturbbklghicpgucwhwy` (EU Stockholm)
