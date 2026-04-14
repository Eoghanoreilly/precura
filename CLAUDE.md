# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

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
```

## Git Workflow

- Create feature branches, never push directly to main
- PRs with descriptions for every change
- Build MUST pass before committing
- Clean commit messages explaining WHY, not just WHAT
- Always include: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
- .npmrc has `legacy-peer-deps=true` for echarts-gl compatibility

## Project Overview

Precura is a predictive health platform. Two versions exist side-by-side:

- **v1** (`/src/app/`) - Original MVP demo with FINDRISC risk scoring
- **v2** (`/src/app/v2/`) - Full platform prototype with 1177 integration, multi-model risk, doctor messaging, provider portal, training plans

On top of both sits a new canonical home page: the **Welcome Kit** (`src/components/home/*`), shipped 2026-04-13. It replaces the old v1 gradient-blob landing at `/`. See the "Home page: Welcome Kit" section below.

**Live URL:** https://precura-wine.vercel.app
**GitHub:** https://github.com/Eoghanoreilly/precura

## Home page: Welcome Kit (canonical, 2026-04-13+)

The root `/` now renders the Welcome Kit, a 14-section Airbnb-warm landing page chosen after 4 rounds and 20 design explorations (home-1 through home-20, since deleted; git history preserves every round).

### Structure

All components live under `src/components/home/` (flat, not in an `_components` subfolder) and share a single `tokens.ts`:

```
src/components/home/
  tokens.ts             # Palette (cream / butter / terracotta / sage), system font
  NavBar.tsx            # Top nav: logo + links + Sign in (->/login) + Become a member
  Hero.tsx              # Editorial headline + welcome kit flat-lay visual
  ProblemStrip.tsx      # 3 stat cards on a darker canvas
  AnnaSection.tsx       # Anna Bergstrom's 5-year story arc
  HowItWorks.tsx        # 3-step onboarding flow
  LivingProfile.tsx     # Biomarker trend cards (the "living profile" concept)
  WhatYouGet.tsx        # Product components: science / care / profile
  MemberCarousel.tsx    # Member stories carousel
  TrustScience.tsx      # Dr. Tomas bio + clinical citations table
  StoriesSection.tsx    # Longer member stories
  Pricing.tsx           # Three tiers (currently all SEK/year - pending flexible-term rework)
  FAQ.tsx               # Expandable Q+A
  FinalCTA.tsx          # Bottom CTA section
  Footer.tsx            # Address, links, legal
```

### Design language

- Palette: cream canvas, butter highlights, terracotta accent, sage deep, warm radial highlights.
- Typography: editorial weight 600 serif-like sans with italic terracotta accents on secondary clauses.
- Motion: framer-motion reveals, slow and soft.
- Inspiration: Airbnb host pages. Restraint, warmth, single CTAs.

### Copy philosophy (learned 2026-04-14)

- **Hero headline:** "See your future health. Before the system does." The old "Before your doctor does" framing was wrong because Dr. Tomas IS the doctor - the real opponent is the once-a-year system model.
- **No gratuitous "Swedish X" marketing adjective.** Keep Sweden where it is operational fact (1177, BankID, SEK, Socialstyrelsen, Karolinska, patientdatalagen, Stockholm office, Made in Sweden footer, Swedish Post office shipping, Swedish-licensed clinic badge). Strip it where it is adjective flavor ("Swedish adults", "Swedish GP", "Swedish healthcare system", "Swedish primary care").
- **"Licensed doctors" plural** is the blanket replacement for any "Swedish-licensed GP" / "one Swedish doctor" copy. Fake it till you make it. Exception: when Dr. Tomas is named in a bio paragraph, singular + named is fine.
- **"One annual membership" is banned from marketing copy.** The product currently only sells annual, but the hero / footer / CTAs must not frame annual as the differentiator. Flexible-term pricing (once-off / 3mo / 6mo / year) is coming.
- **Stats must be real, verifiable, sourced.** Do not invent numbers. Do not rephrase a sourced stat in a way that invalidates the source. The ProblemStrip "1 in 2 Swedes with type 2 diabetes are undiagnosed" stat stays as-is because it is cited to Nationella Diabetesregistret 2024.

## Architecture

### Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Apache ECharts (echarts-for-react) for charts - NOT Nivo, NOT recharts (both are legacy deps that can be removed)
- lucide-react for icons
- No backend - all state in localStorage with mock data
- Deployed on Vercel

### Key Directories
```
src/app/           # v1 pages (original demo)
src/app/v2/        # v2 pages (full platform - this is the focus)
src/components/    # v1 shared components (Header, BottomNav, etc)
src/lib/           # v1 data (auth, findrisc, mock-data, blood-test-data)
src/lib/v2/        # v2 data (mock-patient.ts - comprehensive 5-year patient record)
```

### v2 Page Map
```
/v2/login              # Mock BankID login (Anna = returning, Erik = new)
/v2/connect            # 1177 health data import with consent flow
/v2/dashboard          # Main page - NO TABS, floating chat, responsive grid
/v2/health             # Deep health view - risk models, blood markers, conditions, meds
/v2/blood-tests        # Order tracking journey with status steps
/v2/blood-tests/results # Doctor's note + range bars + trend sparklines
/v2/doctor             # iMessage-style doctor messaging + consultation history
/v2/chat               # AI chat with full patient history context
/v2/training           # Real workout program (exercises, sets, reps, weights)
/v2/membership         # Annual/monthly pricing + competitor comparison
/v2/profile            # Settings, FHIR data export, membership management
/v2/provider/dashboard # Doctor's view - patient queue, population stats
/v2/provider/patient   # Individual patient - AI summary, AI Q&A, screening scores
/v2/provider/vardcentral # B2B investor demo - population health insights
```

### Smith prototypes (smith1-15)

Fifteen frozen prototypes under `src/app/smith1/` through `src/app/smith15/`, each exploring a different product vision for the logged-in experience. Part of a design exploration round, not live product.

- `smith12` is "Airbnb Health" - a mobile-first (max-width 430) prototype with an Airbnb-style bottom nav (Explore / Actions / Profile) across 8 pages (`layout.tsx`, `page.tsx`, `actions/`, `blood-tests/`, `messages/`, `profile/`, `risk/`, `training/`). Uses a Cereal font fallback which violates the Apple-system-font-only rule - do not copy the font stack.
- Other smiths vary: some desktop-first, some experimental (neon health scores, handwritten notes, population dashboards). Browse the gallery at `/home-previews` or directly at `/smith1`..`/smith15`.
- **Do not touch existing Smith prototypes.** They are frozen reference material for future redesigns.

### v2 Navigation Model
- NO bottom tab bar on any v2 page
- Top bar: Precura logo (left) + user avatar (right, links to profile)
- Floating chat bubble (bottom-right) on dashboard - opens AI chat sheet
- Sub-pages: back arrow + top bar
- Everything is reachable from the dashboard via cards

### v2 Mock Data (`src/lib/v2/mock-patient.ts`)
Anna Bergstrom - 40 years old, 5 years of medical history telling a coherent story:
- Fasting glucose rising from 5.0 to 5.8 over 5 years (nobody connected the dots)
- Mother diagnosed with T2D at 58 (family history risk)
- Mild hypertension on Enalapril 5mg
- 6 blood test sessions (2021-2026)
- Doctor visits, medications, vaccinations, allergies, injuries
- PHQ-9: 4, GAD-7: 3, AUDIT-C: 3, FINDRISC: 12
- Doctor-patient message thread
- Training plan with real exercises (sets/reps/weights)

## Design System - CRITICAL RULES

### Fonts
- Apple system fonts ONLY: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif`
- Mono: `"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace`
- NEVER use Google Fonts (DM Sans, Space Mono, Inter, Roboto are all banned)

### Colors
All via CSS variables in `globals.css`:
- Backgrounds: `--bg`, `--bg-card`, `--bg-elevated`, `--bg-warm`
- Text: `--text`, `--text-secondary`, `--text-muted`, `--text-faint`
- Health status: `--green/--amber/--red/--teal/--blue/--purple` (each has `-bg` and `-text` variants)
- Brand: `--accent` (#5c6bc0), `--accent-light` (#e8eaf6)
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Layout
- Light mode only. Warm, friendly, Google Labs inspired
- Mobile-first with responsive breakpoints:
  - Mobile (<640px): single column, full width
  - Tablet (640-1024px): wider container, 2-column article grids
  - Desktop (1024px+): multi-column grid with sidebar
- Cards: `rounded-2xl` or `rounded-3xl`, `border: 1px solid var(--border)`, `boxShadow: var(--shadow-sm)`
- NO left border accents on cards (AI giveaway)

### Approved Chart Styles
- **Bell curve**: gradient zones green-to-red, avg dotted line, labeled "You" marker
- **Range bar**: green zone highlighted, triangle marker pointing down
- **Zone bar**: colored segments (green/teal/amber/red/dark red), white dot marker
- **Trend line**: zone background bands, gradient line, no floating dots
- **Gauge**: text-centric zone bar with triangle (NOT arc gauges)
- **Sparkline**: gradient line, endpoint dot only
- **Factor breakdown**: donut with legend
- Use Apache ECharts for all interactive charts, CSS for simple bars/indicators

### Images
- Use real Unsplash images via direct URLs (e.g., `https://images.unsplash.com/photo-xxx?w=800&q=80&fit=crop`)
- Gradient placeholders only as temporary fallback

### Content Rules
- All medical terms MUST include plain English: "HbA1c (long-term blood sugar)" not "HbA1c"
- Risk labels ALWAYS say "X risk" not just "X" ("Low risk" not "Low" for bone health)
- No generic health advice ("exercise more"). Be specific to the user's data
- Upsells surface naturally within the journey, not buried at page bottoms
- Every blood test includes a doctor's review/note
- Training tracks real workouts (exercises, sets, reps, weights) - NEVER steps or active minutes
- Quality over speed. One polished component beats ten rushed ones.
- No em dashes, en dashes, or unicode arrows. Hyphens, slashes, ASCII only.
- No gratuitous "Swedish X" in marketing copy. Operational facts only. See the Home page / Copy philosophy section above for the full rule set.
- "Licensed doctors" (plural) is the blanket term in brand copy. Dr. Tomas stays singular only when named in a bio paragraph.
- "One annual membership" is banned from marketing copy.

## Known Issues and TODOs

### Missing v2 Pages
- `/v2/onboarding` - comprehensive multi-tool onboarding (PHQ-9, GAD-7, AUDIT-C, FINDRISC, SCORE2, EQ-5D) - not yet built, connect page skips straight to dashboard
- `/v2/provider/triage` - triage nurse view - not yet built
- `/v2/provider/trainer` - trainer client view - not yet built

### Legacy Dependencies to Remove
- `@nivo/*` packages - no longer used in any page
- `recharts` - no longer used in any page
- `echarts-gl` - only used in the temporary charts page

### v1 Cleanup
- v1 pages still have bottom tab nav and older design patterns
- `/charts` page is temporary (chart gallery for design decisions) - can be removed

### Dashboard Card Selection
- v2 dashboard has 29 numbered cards. User needs to pick which to keep/cut.
- Card numbers are visible in the UI with purple `#N` labels

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

## In-flight work (as of 2026-04-14)

Full session handover lives in `docs/handover/2026-04-14-session-state.md`. Read it before resuming any task.

### Open PRs (merge in order)

1. **#1 - `fix/home-nav-login-link`** - NavBar "Sign in" pointed to `#pricing` and was hidden below 900px. Now routes to `/login` and is visible at all widths.
2. **#2 - `fix/home-copy-inclusive-sweep`** - Hero rewrite + site-wide sweep to drop "Swedish X" marketing language and "one annual membership" framing. Stacked on #1.
3. **#3 - `docs/session-handover-2026-04-14`** - this handover documentation.

Deployed builds for #1 and #2 are already live on `https://precura-wine.vercel.app`.

### Pending tasks (deferred, explicit scope boundary)

- **Pricing section rework** - flexible terms (once-off / 3mo / 6mo / year). Needs real prices from user before building. Do not touch `src/components/home/Pricing.tsx` otherwise.
- **ProblemStrip "1 in 2 Swedes" stat** - sourced to Nationella Diabetesregistret 2024. User decision pending: keep as-is, re-source, or remove.
- **Logged-in page redesign** - in-flight creative task. User wants to blend the Welcome Kit aesthetic with the `smith12` "Airbnb Health" prototype. Brainstorming paused mid-exploration. Resume by reading `docs/superpowers/specs/2026-04-14-logged-in-redesign-brainstorm.md` and invoking `superpowers:brainstorming`.
