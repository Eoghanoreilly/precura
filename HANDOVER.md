# Precura - Project Handover Document

**Last updated:** April 18, 2026
**Previous version:** April 1, 2026
**Author:** Claude Opus 4.6 (pair programmer)
**Project Owner:** Eoghan O'Reilly
**Medical Co-founder:** Dr. Tomas Kurakovas
**Repository:** https://github.com/Eoghanoreilly/precura
**Live URL:** https://precura-wine.vercel.app

---

## 1. What Is This Project

Precura ("pre" + "cura" = prediction is the cure) is a predictive health platform for the Swedish market. Co-founded by Eoghan O'Reilly (engineer, personal trainer) and Dr. Tomas Kurakovas (licensed GP).

The core thesis: healthcare is reactive. Patients get diagnosed with conditions like Type 2 diabetes that could have been predicted years earlier from existing data. Precura uses validated clinical risk models (FINDRISC, SCORE2, FRAX) combined with blood test analysis, doctor consultations, and a chat assistant to put predictive health intelligence directly in patients' hands.

### What exists in the codebase

The project has evolved through several phases, all coexisting in one Next.js app:

- **Welcome Kit home page** at `/` - the public-facing landing page. Warm Airbnb-host aesthetic, cream/butter/terracotta/sage palette.
- **v1** (`/src/app/login`, `/src/app/onboarding`, etc.) - original MVP demo with FINDRISC risk scoring. Untouched, kept as reference.
- **v2** (`/src/app/v2/`) - full platform prototype with mock data (Anna Bergstrom). 1177 integration, multi-model risk, doctor messaging, provider portal, training plans. Still runs on mock data.
- **Smith prototypes** (`/src/app/smith1` through `smith15`) - 15 frozen design explorations for the logged-in experience. Reference material only.
- **Member app** (`/src/app/member/`) - THE ACTIVE FOCUS. Real Supabase backend, real auth, real blood panel data. This is what was built in the April 16-18 session.

---

## 2. Current State (April 18, 2026)

### What was built in the April 16-18 session

This was a major building session. The entire `/member/*` surface moved from mock data to a real Supabase backend. Everything listed below is deployed and working at https://precura-wine.vercel.app.

#### Supabase backend (EU Stockholm)

- **Project:** "Project Precura" (ID: `xturbbklghicpgucwhwy`)
- **Region:** EU Stockholm
- **Schema tables:** `profiles`, `panels`, `biomarkers`, `annotations`, `chat_sessions`, `chat_messages`
- **RLS policies:** Mutual read between the 2 allowlisted users, personal write only
- **Auto-profile trigger:** `handle_new_user()` fires on `auth.users` insert, creates a `profiles` row automatically
- **Migration:** `supabase/migrations/001_initial_schema.sql`, applied via `npx supabase db push`
- **Supabase CLI:** Linked to the project, config at `supabase/config.toml`

#### Authentication

- Magic link auth via Supabase (no BankID - overkill for 2 users)
- Email allowlist enforced at middleware level (`ALLOWED_EMAILS` env var)
- Dev quick login endpoint at `/api/dev-login` using `admin.generateLink()` - skips email during development
- Client-side auth callback at `/member/auth/callback` handles hash fragment tokens from magic link redirects
- Login page at `/member/login` with magic link form + dev quick login button (dev-only)

#### Blood panel management

- `/member/panels/new` - manual entry form with 13 Swedish biomarker presets (HbA1c, fP-Glukos, Kolesterol, LDL, HDL, Triglycerider, CRP, TSH, ALAT, ASAT, Hemoglobin, Kreatinin, Ferritin)
- **Paste-and-parse:** `/api/parse-panel` uses Claude Haiku to extract markers from pasted free-text lab reports
- **55-marker Swedish lookup table** at `src/lib/data/marker-defaults.ts` for auto-filling units and reference ranges
- Auto-fill happens visibly in the form (user sees it populate) AND as a safety net on save
- Panel save with validation: red highlights on incomplete rows, scroll to first error, prevents double-clicks, cleans up orphaned panels on failure
- `/member/panels/[id]` - panel detail page with animated analysis progress, "Not Doctor Reviewed" badge, range bars, findings grouped by severity, editable markers, annotations, delete functionality

#### Member home page - adaptive 7-state architecture

The home page is one adaptive page with 7 states, not 7 different pages. State detection runs with fallthrough priority: G > F > E > D > C > B > A.

| State | Condition | What renders |
|-------|-----------|-------------|
| A | No data | Welcome message, how it works explainer, upload CTA |
| B | First panel uploaded, no doctor review | Headline, flagged markers with range bars, body systems compact grid, Dr. Tomas progress track, action buttons |
| C | Doctor reviewed (1 panel) | Doctor's letter as hero |
| D | Multiple panels | 2-column layout, sparklines, trajectory chart, doctor notes |
| E | Steady state | Stability sparklines, seasonal context, aged doctor note |
| F | New results arrived (2+ panels) | WhatMoved hero comparison |
| G | New doctor note | Peak premium moment, doctor letter as hero |

Layout rules:
- Single column for early states (A/B/C)
- Two-column grid for mature states (D/E/F/G), only activates at 1200px+ to account for MemberShell sidebar
- Hidden zones don't render at all - no placeholders, no "coming soon"
- Peak moments (new results, doctor note) push that content to hero position

Body systems shown as a compact grid (2-col mobile, 3-col tablet, 4-col desktop) with inline mini range bars showing WHERE values sit in the reference range, plus the key value displayed.

#### Discuss (chat) page

- Chat history view: list of previous sessions with date and preview
- Session persistence in Supabase (replaced localStorage)
- Real user data context: system prompt built from Supabase panels + annotations at `src/lib/discuss/system-prompt.ts`
- Claude Haiku model for cost efficiency (Opus kept for demo mode)
- Prompt caching on system prompt via `cache_control: { type: 'ephemeral' }`
- Fixed jank: rAF-throttled scroll, stable scroll container, no entrance animation on streaming messages
- All "AI" references removed - it's "Precura" everywhere in the UI

#### Annotations system

- Create/view/delete notes on panels at `/member/panels/[id]`
- `/member/messages` repurposed as annotation feed ("Notes" in sidebar)
- Author attribution with role badges (doctor vs. member)

#### Sitewide changes

- All "AI" references purged from 14 files (22 replacements total)
- Category mapping handles real Swedish lab names (P-ALAT, S-TSH, fP-Triglycerid, etc.) via prefix stripping + fuzzy matching in `src/components/member/data.ts`
- Environment variables set on Vercel (5 vars: Supabase URL, anon key, service role key, Anthropic key, allowed emails)
- Multiple deploys to production

### What's NOT built / current blockers

| Item | Priority | Notes |
|------|----------|-------|
| Tomas's email in ALLOWED_EMAILS | BLOCKER | Currently placeholder. Must be updated before he can log in |
| Notification system | HIGH | Tomas doesn't know when panels are uploaded. No email/push notifications |
| Sign-out | MEDIUM | No sign-out button wired to Supabase auth |
| Profile page | MEDIUM | Still shows hardcoded data, not pulling from Supabase |
| Training page | LOW | Still on mock data |
| Old /login page | LOW | Anna/Erik demo login still exists alongside /member/login |
| Panel edit/delete from home | LOW | Only available from panel detail page |
| `/v2/onboarding` | DEFERRED | Multi-tool onboarding (PHQ-9, GAD-7, etc.) not yet built |

---

## 3. Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.1 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling (CSS-based config with `@theme inline`) |
| Supabase | @supabase/supabase-js + @supabase/ssr | Backend: Postgres, Auth, RLS |
| Anthropic SDK | @anthropic-ai/sdk | Claude API for chat |
| Apache ECharts | 6.0.0 | Charts and visualizations |
| echarts-for-react | 3.0.6 | React wrapper for ECharts |
| lucide-react | 1.7.0 | Icons |
| Vercel | - | Hosting and deployment |
| Node.js | 20.x | Runtime (via nvm) |

### Legacy dependencies (can be removed)
- `@nivo/core`, `@nivo/line`, `@nivo/bullet`, `@nivo/bar`, `@nivo/tooltip` - replaced by ECharts
- `recharts` - replaced by ECharts
- `echarts-gl` - only used in temporary chart gallery

### Important config
- `.npmrc` has `legacy-peer-deps=true` for echarts-gl compatibility
- `.nvmrc` specifies Node 20
- No `tailwind.config.ts` - Tailwind v4 uses CSS-based config in `globals.css`
- `AGENTS.md` warns about Next.js 16 breaking changes - always consult `node_modules/next/dist/docs/` before writing route handlers or middleware

---

## 4. File Structure

```
precura/
  .env.local                        # Secrets (gitignored)
  .env.local.example                # Template with placeholder values
  .npmrc                            # legacy-peer-deps=true
  .nvmrc                            # Node 20
  AGENTS.md                         # Next.js 16 specific guidance
  CLAUDE.md                         # Project instructions for Claude Code
  HANDOVER.md                       # This file
  SPEC.md                           # Product specification (780 lines)
  middleware.ts                     # Auth + allowlist enforcement on /member/*
  package.json

  supabase/
    config.toml                     # Supabase CLI config (linked to project)
    migrations/
      001_initial_schema.sql        # Full schema: profiles, panels, biomarkers, annotations, chat

  src/
    app/
      globals.css                   # Design system: CSS variables, animations, responsive classes
      layout.tsx                    # Root layout (Apple system fonts, metadata)
      page.tsx                      # Welcome Kit home page (/)

      # API routes
      api/
        dev-login/route.ts          # Dev-only quick login via admin.generateLink()
        discuss/route.ts            # Streaming chat - Claude Haiku, prompt caching, Supabase context
        parse-panel/route.ts        # Claude Haiku parses pasted lab text into structured markers

      # Member app (ACTIVE FOCUS - real Supabase data)
      member/
        layout.tsx                  # MemberShell wrapper
        page.tsx                    # Adaptive 7-state home page (A through G)
        auth/callback/page.tsx      # Magic link token handler
        discuss/page.tsx            # Chat with session persistence
        login/page.tsx              # Magic link + dev quick login
        messages/page.tsx           # Annotation feed ("Notes" in sidebar)
        panels/
          page.tsx                  # Panel list
          new/page.tsx              # Manual entry form + paste-and-parse
          [id]/page.tsx             # Panel detail: range bars, findings, annotations
        profile/page.tsx            # Settings (still hardcoded)
        training/page.tsx           # Workout program (still mock data)

      # v1 pages (original MVP demo - untouched)
      login/page.tsx
      onboarding/page.tsx
      results/page.tsx
      dashboard/page.tsx
      # ... etc

      # v2 pages (full platform prototype - still mock data)
      v2/
        login/page.tsx              # Mock BankID (Anna/Erik)
        connect/page.tsx            # 1177 data import
        dashboard/page.tsx          # 29 numbered cards
        health/page.tsx             # Deep health view
        # ... etc

      # Smith prototypes (frozen, reference only)
      smith1/ through smith15/

    components/
      home/                         # Welcome Kit home page components
      member/
        data.ts                     # Data layer - Supabase queries + Swedish marker category mapping
        GlucoseHero.tsx             # Glucose trend visualization
        MemberShell.tsx             # App shell with sidebar + responsive layout
        MemberSidebar.tsx           # Navigation sidebar
        MobileDrawer.tsx            # Mobile navigation drawer
        NextStep.tsx                # Action card component
        NoteFromDoctor.tsx          # Doctor note display
        RiskTrajectory.tsx          # Risk trend chart
        StatusHeadline.tsx          # Dynamic headline based on state
        tokens.ts                   # Design tokens (colors, spacing)
        WhatMoved.tsx               # Panel comparison component

    lib/
      auth.ts                       # Legacy mock auth (v1/v2)
      findrisc.ts                   # FINDRISC calculator
      mock-data.ts                  # v1 mock data
      blood-test-data.ts            # v1 blood test data
      prompts.ts                    # Legacy prompt template
      user-state.ts                 # v1 phase state machine

      data/                         # Supabase data layer
        annotations.ts              # Annotation CRUD
        chat.ts                     # Chat session + message persistence
        marker-defaults.ts          # 55-marker Swedish lookup table (units, ref ranges)
        panels.ts                   # Panel + biomarker CRUD
        types.ts                    # Shared TypeScript types

      discuss/
        system-prompt.ts            # Builds system prompt from real Supabase data

      supabase/
        client.ts                   # Browser-side Supabase client
        middleware.ts               # Session refresh + allowlist check
        server.ts                   # Server-side Supabase client (cookies)

      v2/
        mock-patient.ts             # Anna Bergstrom mock (still used by /v2/* pages)
```

---

## 5. Supabase Schema

### Tables

**profiles** (extends auth.users via trigger)
- `id` (uuid, FK to auth.users)
- `email`, `display_name`, `role` (enum: member/doctor/admin)
- `created_at`
- Auto-created by `handle_new_user()` trigger on auth.users insert

**panels**
- `id`, `user_id` (FK to profiles), `panel_date`, `lab_name`, `panel_type`
- `created_at`

**biomarkers**
- `id`, `panel_id` (FK to panels)
- `name_swe`, `name_eng`, `short_name`, `plain_name`
- `value`, `unit`, `ref_range_low`, `ref_range_high`
- `status` (enum: normal/low/high/critical)
- `category`
- `created_at`

**annotations**
- `id`, `target_type` (panel/biomarker), `target_id`
- `author_user_id` (FK to profiles), `body`
- `created_at`

**chat_sessions**
- `id`, `user_id`, `title`, `created_at`

**chat_messages**
- `id`, `session_id` (FK to chat_sessions)
- `role` (user/assistant), `content`
- `tokens_in`, `tokens_out`
- `created_at`

### RLS Policies

- Both allowlisted users can read all data (trusted mutual-review setup)
- Only the row owner can write/edit/delete their own data
- Email allowlist enforced at middleware AND at auth layer

---

## 6. Environment Variables

Defined in `.env.local` (gitignored). Template at `.env.local.example`.

```
NEXT_PUBLIC_SUPABASE_URL=https://xturbbklghicpgucwhwy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...      # Safe to expose, RLS enforces access
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # Server-side only, NEVER expose
ANTHROPIC_API_KEY=sk-ant-...              # For /api/discuss and /api/parse-panel
ALLOWED_EMAILS=eoghan@vestego.com,tomas@example.com
```

All 5 vars are also set on Vercel (Settings > Environment Variables).

---

## 7. Design System

### Typography
Apple system fonts only. Defined in `layout.tsx`:
- Body: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif`
- Mono: `"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace`
- NEVER use Google Fonts (DM Sans, Space Mono, Inter, Roboto are banned)

### Color Tokens (CSS variables in `globals.css`)
- Backgrounds: `--bg`, `--bg-card`, `--bg-elevated`, `--bg-warm`
- Text: `--text`, `--text-secondary`, `--text-muted`, `--text-faint`
- Health: `--green/--amber/--red/--teal/--blue/--purple` (each has `-bg` and `-text`)
- Brand: `--accent` (#5c6bc0), `--accent-light` (#e8eaf6)
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Layout
- Light mode only. Warm, friendly aesthetic
- Mobile-first with responsive breakpoints
- Desktop 2-column grid activates at 1200px+ (accounting for MemberShell sidebar)
- Cards: `rounded-2xl` or `rounded-3xl`, `border: 1px solid var(--border)`, `boxShadow: var(--shadow-sm)`
- NO left border accents on cards

### Chart Styles (approved)
- Range bar: green zone highlighted, triangle marker
- Zone bar: colored segments, white dot marker
- Sparkline: gradient line, endpoint dot only
- Trend line: zone background bands, gradient line
- Use Apache ECharts for interactive charts, CSS for simple bars/indicators

---

## 8. Design Decisions (locked in)

These are decided. Do not re-debate without the user.

1. **Never use the word "AI" anywhere in the product.** Not in UI, copy, labels, buttons, or conversation about the product. It's "Precura" or describe what it does.
2. **Never call it "dogfood."** Internal planning docs use the term; the product is just Precura.
3. **Doctor review is automatic** - it's part of the service, not something the user requests. No "request review" buttons.
4. **No fake promises.** No "48 hours" delivery estimates, no "we'll notify you" unless notification actually works.
5. **Body systems as compact grid** with inline range bars showing WHERE values sit in the reference range.
6. **Adaptive home page with 7 states**, not 7 different pages. Hidden zones don't render at all.
7. **Peak moments push to hero.** New results or a new doctor note take the hero position.
8. **Single column for early states** (A/B/C), **two-column for mature states** (D/E/F/G).
9. **Magic-link auth, not BankID.** Overkill for 2 users.
10. **Claude Haiku for chat** - cost-optimized for personal use. Easy swap to Sonnet/Opus later.
11. **Manual biomarker entry** - no PDF parsing in this phase. Paste-and-parse added as a compromise.
12. **Swedish marker name handling:** prefix stripping (`P-`, `S-`, `fP-`, `B-`, `Hb-`) + fuzzy matching to map real lab names to categories.
13. **No em dashes, en dashes, or unicode arrows** - anywhere, in any content. Hyphens and ASCII only.

---

## 9. Key Architecture Patterns

### Swedish biomarker name mapping (`src/components/member/data.ts`)

Real Swedish lab reports use prefixed names like `P-ALAT`, `S-TSH`, `fP-Triglycerid`. The category mapping:
1. Strips known prefixes: `P-`, `S-`, `fP-`, `B-`, `Hb-`
2. Normalizes to lowercase
3. Matches against a lookup table to assign body system categories
4. Falls back to "Other" if no match

### 55-marker lookup table (`src/lib/data/marker-defaults.ts`)

Pre-populated with Swedish standard markers. Each entry has:
- `name_swe`, `name_eng`, `short_name`, `plain_name` (plain English)
- `unit`, `ref_range_low`, `ref_range_high`
- `category`

Used for: preset buttons in the entry form, auto-fill after paste-and-parse, safety-net fill on save.

### Paste-and-parse (`/api/parse-panel`)

Uses Claude Haiku to extract structured marker data from pasted free-text lab reports. Returns JSON array of markers. The form then auto-fills with visible animation so the user sees what was extracted and can verify/edit.

### Chat system prompt (`src/lib/discuss/system-prompt.ts`)

Builds a context block from the user's real Supabase data:
- All panels with biomarker values
- All annotations
- User profile info
- Injected as the system message with `cache_control: { type: 'ephemeral' }` for prompt caching

### State detection (member home page)

Priority-based fallthrough: G > F > E > D > C > B > A.
- Checks for: new doctor note (G), new results with 2+ panels (F), age of latest note (E), multiple panels (D), doctor-reviewed panel (C), any panel (B), nothing (A)
- Each state renders its own component tree
- States that don't match render nothing

---

## 10. User Flows

### Real user (Eoghan or Tomas)
```
/member/login -> magic link email -> /member/auth/callback -> /member (home)
From home:
  -> /member/panels/new (upload blood test)
  -> /member/panels/[id] (view panel detail, annotations)
  -> /member/discuss (chat about data)
  -> /member/messages (annotation feed / notes)
  -> /member/profile (settings)
  -> /member/training (workout program)
```

### Demo user (Anna Bergstrom - mock data)
```
/v2/login -> (Anna) -> /v2/dashboard
Uses mock data from src/lib/v2/mock-patient.ts
Still works, separate from the real /member/* flow
```

---

## 11. Development Environment

```bash
# Node version
source ~/.nvm/nvm.sh && nvm use 20

# Install
npm install

# Dev server
npm run dev
# Open http://localhost:3000

# Build (must pass before any commit)
npm run build

# Deploy
npx vercel --yes --prod --scope moonflows-projects-9c4fc1f9

# Supabase CLI (linked to project)
npx supabase db push    # Apply migrations
```

### Vercel
- Team: `moonflows-projects-9c4fc1f9`
- Production URL: `https://precura-wine.vercel.app`
- All 5 env vars set in Vercel dashboard

### Supabase
- Project: "Project Precura" (ID: `xturbbklghicpgucwhwy`)
- Region: EU Stockholm
- Dashboard: https://supabase.com/dashboard/project/xturbbklghicpgucwhwy

---

## 12. What Needs to Happen Next

### Immediate
1. Add Tomas's real email to `ALLOWED_EMAILS` (both `.env.local` and Vercel)
2. Wire sign-out button to Supabase auth
3. Build notification system (email when panels uploaded, when annotations added)
4. Profile page: pull real data from Supabase profiles table
5. Remove old `/login` page or redirect to `/member/login`

### Short-term
1. Doctor review workflow for Tomas
2. Panel comparison / diff view (WhatMoved component for State F)
3. Sparkline trends on home page for returning users
4. Training page wired to real data
5. Mobile polish pass on all /member/* pages

### Medium-term
1. PDF upload and auto-parse (skip manual entry)
2. Real BankID authentication
3. Payment integration (Stripe)
4. Expand beyond 2 users (waitlist/invite system)
5. v2 onboarding with screening tools (PHQ-9, GAD-7, FINDRISC, etc.)

### Long-term
1. 1177 automated data import
2. EHDS integration (FHIR-ready)
3. B2B vardcentral dashboard
4. Nordic expansion

---

## 13. Revenue Model (planned, not active)

| Package | Price | Includes |
|---------|-------|----------|
| Basic (one-off) | ~995 SEK | 1 blood test, 1 doctor session, risk assessment |
| Annual | 2,995 SEK/yr | 2 blood tests, ongoing doctor messaging, unlimited chat, risk monitoring, training plan |
| Platinum | ~4,995 SEK/yr | 4 blood tests, priority doctor access, full screening suite |

Not active. No payments infrastructure exists. Current phase is founder testing on real data.

---

## 14. Reference Documents

| Document | Location | Description |
|----------|----------|-------------|
| CLAUDE.md | `/CLAUDE.md` | Project instructions for Claude Code |
| SPEC.md | `/SPEC.md` | Full product spec (780 lines) |
| HANDOVER.md | `/HANDOVER.md` | This file |
| AGENTS.md | `/AGENTS.md` | Next.js 16 specific guidance |
| Design spec | `~/.claude/projects/.../specs/2026-04-16-personal-dogfood-v0-design.md` | Design decisions for the real-data build |
| Implementation plan | `~/.claude/projects/.../specs/2026-04-16-personal-dogfood-v0-plan.md` | 14-task plan (mostly completed) |
| Previous session handover | `~/.claude/projects/.../handover/2026-04-16-dogfood-v0-session.md` | Planning session before the build |
| Global CLAUDE.md | `~/.claude/CLAUDE.md` | Eoghan's global preferences |
| Memory files | `~/.claude/projects/-Users-eoghan/memory/` | Persistent context: decisions, feedback, preferences |
