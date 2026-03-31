# Precura - Project Handover Document

**Date:** April 1, 2026
**Author:** Claude Opus 4.6 (AI pair programmer)
**Project Owner:** Eoghan O'Reilly
**Repository:** https://github.com/Eoghanoreilly/precura
**Live URL:** https://precura-wine.vercel.app

---

## 1. What Is This Project

Precura ("pre" + "cura" = prediction is the cure) is a predictive health platform being built for the Swedish market. Co-founded by Eoghan O'Reilly (engineer, personal trainer) and a medical doctor friend based in Sweden.

The core thesis: healthcare is reactive. Patients get diagnosed with conditions like Type 2 diabetes that could have been predicted years earlier from existing data. Precura uses validated clinical risk models (FINDRISC, SCORE2, FRAX) combined with blood test analysis, AI chat, and doctor consultations to put predictive health intelligence directly in patients' hands.

The project exists as two parallel prototypes in the same codebase:
- **v1** - Original MVP demo focused on FINDRISC diabetes risk scoring
- **v2** - Full platform prototype with 1177 integration, multi-model risk, doctor messaging, provider portal, training plans, and membership model

**v2 is the current focus.** v1 remains untouched as a reference.

---

## 2. Current State of the Codebase

### What's Built and Working (v2)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Login | `/v2/login` | Working | Mock BankID with two demo users |
| 1177 Connect | `/v2/connect` | Working | Animated data import flow, routes to dashboard |
| Dashboard | `/v2/dashboard` | Working, needs card selection | 29 numbered cards, responsive grid, floating chat |
| Health | `/v2/health` | Working | Risk models, blood markers, conditions, medications, family history |
| Blood Tests | `/v2/blood-tests` | Working | Order journey with status tracking |
| Blood Results | `/v2/blood-tests/results` | Working | Doctor's note, range bars, sparklines |
| Doctor | `/v2/doctor` | Working | iMessage-style messaging, consultation history |
| AI Chat | `/v2/chat` | Working | Mock responses referencing patient's full history |
| Training | `/v2/training` | Working | Real workout program (exercises, sets, reps) |
| Membership | `/v2/membership` | Working | Annual/monthly pricing, competitor comparison |
| Profile | `/v2/profile` | Working | Settings, FHIR export, membership management |
| Provider Dashboard | `/v2/provider/dashboard` | Working | Doctor's view, patient queue, population stats |
| Provider Patient | `/v2/provider/patient` | Working | AI summary, AI Q&A, screening scores, trends |
| Provider Vardcentral | `/v2/provider/vardcentral` | Working | B2B investor demo, population health insights |

### What's NOT Built Yet

| Feature | Priority | Notes |
|---------|----------|-------|
| `/v2/onboarding` | HIGH | Comprehensive multi-tool onboarding (PHQ-9, GAD-7, AUDIT-C, FINDRISC, SCORE2, EQ-5D). Currently the connect page skips straight to dashboard. |
| `/v2/provider/triage` | MEDIUM | Triage nurse view with patient urgency queue |
| `/v2/provider/trainer` | MEDIUM | Trainer's view of clients with health-relevant data |
| Dashboard card selection | HIGH | 29 cards are numbered - owner needs to pick which to keep |
| Real workout logging | MEDIUM | Currently shows exercises but no completion/logging UI |
| Article content pages | LOW | Article cards link to chat, should link to real content |
| New user flow (Erik) | MEDIUM | Erik goes through connect -> dashboard but has no personalized data |
| Package-adaptive UI | MEDIUM | Dashboard should adapt based on user's membership tier |
| Light/dark mode toggle | LOW | Currently light mode only |

### Known Issues

1. **Onboarding 404**: New user (Erik) goes connect -> should go to onboarding, but `/v2/onboarding` doesn't exist. Currently routes to dashboard as workaround.
2. **Dashboard card numbers visible**: The `#N` labels are for design review and should be removed once cards are selected.
3. **Some v2 sub-pages may still reference old training metrics**: Any page referencing `progressMetrics`, `steps`, or `active minutes` from the old training plan data needs updating.
4. **Legacy dependencies**: `@nivo/*` and `recharts` packages are still in `package.json` but are not imported by any v2 page. Can be removed.
5. **Provider pages not linked from main flow**: Provider portal pages exist but there's no navigation from the patient app to them. They're accessed by directly visiting the URLs.
6. **Images load from Unsplash CDN**: Currently using direct Unsplash URLs. For production, images should be self-hosted or use Next.js Image optimization with configured remote patterns.

---

## 3. Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.1 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling (CSS-based config with `@theme inline`) |
| Apache ECharts | 6.0.0 | Charts and visualizations |
| echarts-for-react | 3.0.6 | React wrapper for ECharts |
| echarts-gl | 2.0.9 | 3D chart support (used in chart gallery only) |
| lucide-react | 1.7.0 | Icons |
| Vercel | - | Hosting and deployment |
| Node.js | 20.x | Runtime (via nvm) |

### Legacy Dependencies (can be removed)
- `@nivo/core`, `@nivo/line`, `@nivo/bullet`, `@nivo/bar`, `@nivo/tooltip` - replaced by ECharts
- `recharts` - replaced by ECharts

### Important Config
- `.npmrc` has `legacy-peer-deps=true` for echarts-gl compatibility
- `.nvmrc` specifies Node 20
- No `tailwind.config.ts` - Tailwind v4 uses CSS-based config in `globals.css`

---

## 4. File Structure

```
precura/
  .npmrc                          # legacy-peer-deps=true
  .nvmrc                          # Node 20
  CLAUDE.md                       # AI coding instructions
  SPEC.md                         # Product specification (780 lines)
  HANDOVER.md                     # This file
  package.json

  src/
    app/
      globals.css                 # Design system: CSS variables, animations, responsive classes
      layout.tsx                  # Root layout (Apple system fonts, metadata)
      page.tsx                    # v1 landing page

      # v1 pages (original MVP demo)
      login/page.tsx
      onboarding/page.tsx
      results/page.tsx
      dashboard/page.tsx
      health/page.tsx
      risk/diabetes/page.tsx
      blood-tests/page.tsx
      blood-tests/results/page.tsx
      chat/page.tsx
      consultations/page.tsx
      profile/page.tsx
      charts/page.tsx             # Temporary chart gallery (can be removed)

      # v2 pages (full platform prototype - THE FOCUS)
      v2/
        login/page.tsx            # Mock BankID
        connect/page.tsx          # 1177 data import
        dashboard/page.tsx        # Main page, 29 numbered cards, responsive
        health/page.tsx           # Deep health view
        blood-tests/page.tsx      # Order tracking
        blood-tests/results/page.tsx  # Results + doctor's note
        doctor/page.tsx           # iMessage-style messaging
        chat/page.tsx             # AI chat with full history
        training/page.tsx         # Real workout program
        membership/page.tsx       # Pricing
        profile/page.tsx          # Settings
        provider/
          dashboard/page.tsx      # Doctor's main view
          patient/page.tsx        # Individual patient (AI summary + Q&A)
          vardcentral/page.tsx    # B2B population health (investor demo)

    components/                   # v1 shared components
      BottomNav.tsx               # v1 bottom tab navigation
      Header.tsx                  # v1 header bar
      ImagePlaceholder.tsx        # Gradient placeholders
      QuickActions.tsx            # v1 action buttons (legacy)
      RiskCard.tsx                # v1 risk card (legacy)

    lib/
      auth.ts                     # Mock auth (localStorage)
      findrisc.ts                 # FINDRISC calculator + plain-language helpers
      mock-data.ts                # v1 mock patient data
      blood-test-data.ts          # v1 blood test panels and results
      prompts.ts                  # AI system prompt template
      user-state.ts               # v1 user phase state machine
      v2/
        mock-patient.ts           # v2 comprehensive 5-year patient record (THE KEY DATA FILE)
```

---

## 5. Mock Data Architecture

### v2 Mock Patient (`src/lib/v2/mock-patient.ts`)

This is the most important data file. It contains a complete, coherent 5-year medical history for Anna Bergstrom that tells a real clinical story:

**The Story:** Anna's fasting glucose has been slowly rising from 5.0 to 5.8 mmol/L over 5 years. Each individual blood test looked "normal" so no single doctor flagged it. Combined with her mother's Type 2 diabetes diagnosis at 58 and her father's heart attack at 65, she's on a trajectory toward T2D that the healthcare system missed. Precura connects the dots.

**Data includes:**
- `PATIENT` - profile, membership, contact info
- `CONDITIONS` - active and resolved medical conditions with ICD-10 codes
- `MEDICATIONS` - current + historical with prescriber info
- `MEDICATION_HISTORY` - past medications no longer taken
- `VACCINATIONS` - full vaccination record
- `ALLERGIES` - known allergies and reactions
- `DOCTOR_VISITS` - 8 visits over 4 years with summaries
- `BLOOD_TEST_HISTORY` - 6 test sessions (2021-2026) with 5-10 markers each
- `FAMILY_HISTORY` - 4 relatives with conditions and age at diagnosis
- `BIOMETRICS_HISTORY` - 8 data points (2021-2026) tracking weight, waist, BMI, BP
- `SCREENING_SCORES` - FINDRISC (12), PHQ-9 (4), GAD-7 (3), AUDIT-C (3), EQ-5D, SCORE2 (3%)
- `RISK_ASSESSMENTS` - multi-model risk with factors, trends, and summaries
- `MESSAGES` - 4-message doctor-patient conversation thread
- `DOCTOR_NOTES` - 2 detailed clinical notes from consultations
- `TRAINING_PLAN` - 3-day/week program with exercises, sets, reps, weights
- `AI_PATIENT_SUMMARY` - pre-written AI summary for the provider view

**Helper functions:**
- `getMarkerHistory(shortName)` - returns all values for a specific blood marker across all test sessions
- `getLatestMarker(shortName)` - returns the most recent value for a marker

---

## 6. Design System

### Typography
Apple system fonts only. Defined in `layout.tsx` (no Google Fonts imported):
- Body: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif`
- Mono (data/numbers): `"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace`

### Color Tokens (CSS variables in `globals.css`)
```
Backgrounds: --bg (#f8f9fa), --bg-card (#fff), --bg-elevated (#f1f3f5), --bg-warm (#fef7ee)
Text: --text (#1a1a2e), --text-secondary (#555770), --text-muted (#8b8da3), --text-faint (#b8bac6)
Borders: --border (#e6e8ed), --divider (#eef0f4)
Accent: --accent (#5c6bc0), --accent-light (#e8eaf6)
Health: --green/#4caf50, --amber/#ff9800, --red/#ef5350, --teal/#26a69a, --blue/#42a5f5, --purple/#7c4dff
Each health color has -bg and -text variants
Shadows: --shadow-sm, --shadow-md, --shadow-lg
```

### Responsive Breakpoints (defined in `globals.css`)
```css
.v2-container: max-width 448px (mobile) -> 640px (tablet) -> 1080px (desktop) -> 1200px (wide)
.v2-grid: flex-column (mobile) -> flex-row with sidebar (desktop 1024px+)
.v2-sidebar: hidden (mobile) -> 320px column (desktop) -> 360px (wide)
.v2-health-grid: 2 columns (mobile) -> 4 columns (desktop)
.v2-article-grid: 1 column (mobile) -> 2 columns (tablet 640px+)
```

### Chart Styles (approved by the owner)
All interactive charts use Apache ECharts. Simple bars/indicators use CSS.
1. Bell curve: gradient zones green-to-red, labeled "Avg" and "You" markers
2. Range bar: green zone highlighted, triangle marker pointing down
3. Zone bar: colored segments, white dot marker
4. Trend line: zone background bands, gradient line
5. Gauge: text-centric zone bar with triangle (no arc gauges)
6. Sparkline: gradient line, endpoint dot only
7. Factor breakdown: donut with legend

### Critical Design Rules
- NO left border accents on cards (AI giveaway)
- NO bottom tab bars on v2 pages
- All medical terms include plain English: "HbA1c (long-term blood sugar)"
- Risk labels say "X risk" not just "X" (e.g., "Low risk" for bone health)
- Training tracks workouts (exercises/sets/reps/weights) NEVER steps or active minutes
- Real Unsplash images, not gradient placeholders
- Quality over speed always

---

## 7. Revenue Model

### Packages (planned, not finalized)

| Package | Price | Includes |
|---------|-------|----------|
| Basic (one-off) | ~995 SEK | 1 blood test, 1 doctor session, risk assessment, limited AI chat (~30 messages) |
| Annual | 2,995 SEK/yr | 2 blood tests, ongoing doctor messaging, unlimited AI, risk monitoring, 3-month training plan |
| Platinum | ~4,995 SEK/yr | 4 blood tests, priority doctor access, 6-month training plan, full screening suite |
| Add-on blood test | 795 SEK | Additional test anytime |

### Revenue Streams
1. Membership subscriptions (primary)
2. Add-on blood tests
3. B2B SaaS for vardcentraler (future)
4. Training plan add-ons
5. Partner referrals (physiotherapy, specialist consultations)

---

## 8. Clinical Models and Screening Tools

### Currently Implemented
- **FINDRISC** (Finnish Diabetes Risk Score) - 8 questions, score 0-26, validated for 10-year T2D prediction. Full implementation in `src/lib/findrisc.ts` with scoring, plain-language helpers, what-if recalculation.

### Planned for v2 Onboarding (not yet built)
- **PHQ-9** - 9-question depression screening (score 0-27, cutoffs at 5/10/15/20)
- **GAD-7** - 7-question anxiety screening (score 0-21, cutoffs at 5/10/15)
- **AUDIT-C** - 3-question alcohol use screening (WHO-developed)
- **EQ-5D-5L** - 5-question quality of life assessment (EU standard)
- **SCORE2** - cardiovascular risk model (calibrated for Swedish population)
- **FRAX** - fracture/bone health risk assessment

Mock scores for all of these are already in `mock-patient.ts` under `SCREENING_SCORES`.

---

## 9. Key Decisions Made During Development

### Design Evolution
1. Started with dark mode (tegen-misfits inspired) -> switched to light mode (Google Labs inspired)
2. Started with DM Sans + Space Mono fonts -> switched to Apple system fonts (SF Pro)
3. Started with recharts -> tried Nivo (broke) -> settled on Apache ECharts
4. Started with gradient image placeholders -> switched to real Unsplash images
5. Started with bottom tab navigation -> removed tabs entirely (single page with floating chat)

### UX Decisions
1. Dashboard has no tabs - everything flows from one scrollable page with cards
2. Avatar top-right leads to profile/settings (no "You" tab needed)
3. Chat is a floating bubble, not a tab - available on every page
4. Doctor messaging is iMessage-style, not a booking page
5. Training tracks real workouts, not steps/minutes
6. Blood test ordering is a journey (ordered -> booked -> sample -> processing -> results), not a product page
7. v2 dashboard has 29 numbered cards - owner picks which to keep

### Technical Decisions
1. No backend for demo - all state in localStorage
2. v2 runs alongside v1 in the same Next.js app (separate route tree)
3. Mock data tells a coherent 5-year clinical story (not random numbers)
4. Responsive layout: mobile single column, desktop two-column with sidebar

---

## 10. User Flows

### Returning User (Anna Bergstrom - Annual Member)
```
v2/login -> (Anna) -> v2/dashboard
From dashboard, can access:
  -> v2/health (deep data view)
  -> v2/blood-tests (order tracking)
  -> v2/blood-tests/results (results + doctor's note)
  -> v2/doctor (messaging)
  -> v2/chat (AI chat via floating bubble)
  -> v2/training (workout program)
  -> v2/membership (plan management)
  -> v2/profile (settings, via avatar top-right)
```

### New User (Erik Lindqvist)
```
v2/login -> (Erik) -> v2/connect (1177 import) -> v2/dashboard
NOTE: v2/onboarding not yet built. Currently skips to dashboard.
Planned flow: connect -> onboarding (10 steps with screening tools) -> results reveal -> dashboard
```

### Provider / Investor Demo
```
v2/provider/dashboard (doctor's view, patient queue)
v2/provider/patient (individual patient, AI summary, AI Q&A)
v2/provider/vardcentral (B2B population health - THE PITCH)
```

---

## 11. Market Context (See SPEC.md for Full Details)

- **50% of Swedish T2D cases go undiagnosed** despite patients visiting primary care
- **COSMIC** (the new national EHR system) is failing - privacy breaches, medication errors, doctors calling it "the biggest fiasco"
- **Function Health** (US) proved the model: $100M ARR, $2.5B valuation, 200K subscribers at $365/year. NOT in Europe.
- **EHDS** (European Health Data Space) regulation entered force March 2025 - patient data portability across EU by 2029
- **Sweden** has 180+ digital health startups, $2.23B VC funding, and a population that's highly digitally literate
- **No European competitor** combines prediction + blood testing + doctor consultations + training plans + ongoing monitoring

---

## 12. What Needs to Happen Next

### Immediate (Demo Polish)
1. Owner selects which dashboard cards to keep from the 29 options
2. Remove card number labels after selection
3. Build `/v2/onboarding` with PHQ-9, GAD-7, AUDIT-C, FINDRISC, EQ-5D screening tools
4. Build new user flow (Erik) with personalized data
5. Polish responsive layout on all v2 pages (some still narrow on desktop)
6. Replace remaining gradient placeholders with real images
7. Remove legacy dependencies (@nivo/*, recharts)

### Short-term (Product)
1. Real BankID authentication (Criipto or Signicat)
2. Supabase backend (PostgreSQL + RLS, EU region)
3. Real AI chat (Claude API)
4. Payment integration (Stripe)
5. Lab partnership for blood tests

### Medium-term (Growth)
1. SCORE2 cardiovascular risk model
2. FRAX bone health model
3. Push notifications
4. Workout logging and completion tracking
5. B2B vardcentral dashboard
6. Nordic expansion (Norway, Denmark, Finland)

### Long-term (Scale)
1. EHDS integration (FHIR-ready data)
2. Population health intelligence
3. Research partnerships
4. EU-wide expansion

---

## 13. Development Environment Setup

```bash
# Clone
git clone https://github.com/Eoghanoreilly/precura.git
cd precura

# Node version
nvm install 20
nvm use 20

# Install
npm install

# Dev server
npm run dev
# Open http://localhost:3000

# Build (must pass before any commit)
npm run build

# Deploy
npx vercel --yes --prod --scope moonflows-projects-9c4fc1f9
```

### Key Environment Notes
- Node 20+ required (Next.js 16 requirement)
- `.npmrc` has `legacy-peer-deps=true` for echarts-gl
- No environment variables needed for the demo (all mock data)
- For future real AI chat: will need `ANTHROPIC_API_KEY` env var
- For future real auth: will need BankID provider credentials
- Vercel team scope: `moonflows-projects-9c4fc1f9`

---

## 14. Working With This Codebase - Tips

### Where to Find Things
- **Design tokens**: `src/app/globals.css` (CSS variables, responsive classes, animations)
- **v2 mock data**: `src/lib/v2/mock-patient.ts` (THE most important data file)
- **v1 mock data**: `src/lib/mock-data.ts` + `src/lib/blood-test-data.ts`
- **Risk scoring**: `src/lib/findrisc.ts` (FINDRISC calculator + helpers)
- **User state**: `src/lib/user-state.ts` (phase machine for v1)

### Patterns Used
- All pages are `"use client"` (client-side rendering with localStorage)
- Inline styles with CSS variables: `style={{ background: "var(--bg-card)" }}`
- No Tailwind utility classes for colors (all via CSS variables)
- Tailwind used for spacing, flexbox, grid, border-radius
- ECharts for interactive charts, CSS for simple bars/indicators
- Unsplash images via direct URLs (no API key needed)

### What NOT to Do
- Don't use Google Fonts (DM Sans, Space Mono, Inter, Roboto are banned)
- Don't use left border accents on cards
- Don't add bottom tab navigation to v2 pages
- Don't track steps, active minutes, or any data that requires a wearable
- Don't show risk levels without the word "risk" (say "Low risk" not "Low")
- Don't use medical jargon without plain English in parentheses
- Don't push directly to main without building first
- Don't use Nivo or recharts for new charts (use ECharts)

---

## 15. Reference Documents

| Document | Location | Description |
|----------|----------|-------------|
| CLAUDE.md | `/CLAUDE.md` | AI coding instructions, build commands, design rules |
| SPEC.md | `/SPEC.md` | Full product spec: problem, solution, pages, data model, revenue, roadmap, competitive landscape, regulatory, research sources |
| HANDOVER.md | `/HANDOVER.md` | This file |
| AGENTS.md | `/AGENTS.md` | Next.js 16 specific guidance (auto-generated) |
| Global CLAUDE.md | `~/.claude/CLAUDE.md` | Eoghan's global preferences for all projects |
| Memory files | `~/.claude/projects/-Users-eoghan/memory/` | Persistent context: project decisions, feedback, preferences |
