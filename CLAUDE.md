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

On top of both sits the **Welcome Kit** home page at `/` (canonical since 2026-04-13). Components live in `src/components/home/*` - warm Airbnb-host aesthetic, cream/butter/terracotta/sage palette, editorial type, single-CTA hero.

Also on disk: 15 frozen **Smith prototypes** at `src/app/smith1` through `smith15`, each exploring a different logged-in product vision. `smith12` is "Airbnb Health" (mobile-first bottom nav, 8 pages). Do not touch existing Smiths - they are reference material.

**Live URL:** https://precura-wine.vercel.app
**GitHub:** https://github.com/Eoghanoreilly/precura

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
- No em dashes, en dashes, or unicode arrows anywhere. Hyphens, slashes, ASCII only.
- No gratuitous "Swedish X" in marketing copy. Keep Sweden where it is operational fact (1177, BankID, SEK, Socialstyrelsen, Karolinska, patientdatalagen, Stockholm office, Made in Sweden footer, Swedish-licensed clinic badge, Nationella Diabetesregistret stat source). Strip it where it is adjective flavor.
- "Licensed doctors" (plural) is the blanket term in brand copy, even though the team is currently one doctor. Dr. Tomas stays singular only when named in a bio paragraph.
- "One annual membership" is banned in marketing copy. Flexible-term pricing (once-off / 3mo / 6mo / year) is coming - do not frame annual as the differentiator.
- Stats must be real, verifiable, sourced. Do not invent numbers. Do not rephrase a sourced stat in a way that invalidates the source.
- Hero headline philosophy: "See your future health. Before the system does." The opponent is the once-a-year checkup model, not doctors - because Precura IS doctors.

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
