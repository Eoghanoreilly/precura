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

Precura is a predictive health platform. Multiple versions coexist:

- **Welcome Kit** home page at `/` (canonical since 2026-04-13). Components in `src/components/home/*`. Warm Airbnb-host aesthetic, cream/butter/terracotta/sage palette, editorial type, single-CTA hero.
- **Member app** (`/src/app/member/`) - THE ACTIVE FOCUS. Real Supabase backend with auth, blood panel management, chat, annotations. Two real users (Eoghan + Dr. Tomas).
- **v1** (`/src/app/`) - Original MVP demo with FINDRISC risk scoring. Untouched.
- **v2** (`/src/app/v2/`) - Full platform prototype with mock data (Anna Bergstrom). Still works, separate from /member.
- **Smith prototypes** (`/src/app/smith1` through `smith15`) - 15 frozen design explorations. Reference only. Do not touch.

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
ALLOWED_EMAILS                  # Comma-separated, enforced by middleware on /member/*
```

### Key Directories
```
src/app/member/        # Member app (real data, real auth - THE FOCUS)
src/app/api/           # API routes (discuss, parse-panel, dev-login)
src/app/v2/            # v2 prototype (mock data, separate from /member)
src/components/home/   # Welcome Kit home page components
src/components/member/ # Member app components (MemberShell, data layer, charts)
src/lib/data/          # Supabase data helpers (panels, annotations, chat, types)
src/lib/supabase/      # Supabase client/server/middleware helpers
src/lib/discuss/       # Chat system prompt builder
src/lib/v2/            # v2 mock data (mock-patient.ts - still used by /v2/*)
middleware.ts          # Root middleware - auth session refresh + email allowlist
supabase/migrations/   # Database schema migrations
```

### Member App Page Map
```
/member/login              # Magic link auth + dev quick login
/member/auth/callback      # Handles magic link token from email
/member                    # Adaptive 7-state home page
/member/panels/new         # Manual biomarker entry + paste-and-parse
/member/panels/[id]        # Panel detail: range bars, findings, annotations, edit
/member/discuss            # Chat with real data context, session persistence
/member/messages           # Annotation feed ("Notes" in sidebar)
/member/profile            # Settings (still hardcoded data)
/member/training           # Workout program (still mock data)
```

### API Routes
```
/api/discuss               # Streaming chat - Claude Haiku, prompt caching, Supabase context
/api/parse-panel           # Claude Haiku extracts markers from pasted lab text
/api/dev-login             # Dev-only quick login via admin.generateLink()
```

### Adaptive Home Page State Machine

The member home page (`/member/page.tsx`) has 7 states with priority-based detection (G > F > E > D > C > B > A):

| State | Condition | Layout |
|-------|-----------|--------|
| A | No data | Single column, welcome + CTA |
| B | First panel, no doctor review | Single column, flagged markers + body systems grid |
| C | Doctor reviewed (1 panel) | Single column, doctor letter hero |
| D | Multiple panels | Two-column, sparklines + trajectory |
| E | Steady state | Two-column, stability view |
| F | New results (2+ panels) | Two-column, WhatMoved hero |
| G | New doctor note | Two-column, doctor letter hero |

Hidden zones render nothing - no placeholders. Two-column layout activates at 1200px+.

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
