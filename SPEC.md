# Precura - Product Specification

## 1. Overview

### 1.1 What Is Precura
Precura is a predictive health platform that puts health risk intelligence in users' hands. The name comes from "pre" (prediction/prevention) + "cura" (cure/care). The core thesis: prediction IS the cure. Prevention through early detection and actionable guidance.

### 1.2 The Problem
Healthcare systems (especially in Sweden) are reactive. Patients interact episodically - a blood test here, a checkup there - but nobody watches the full picture over time. The data to predict conditions like Type 2 diabetes exists years before diagnosis, but nobody connects the dots for the patient.

### 1.3 The Solution
Precura uses validated clinical risk models (the same ones doctors use) to analyze user health data, show risk trajectories, and provide actionable next steps. It complements, never replaces, professional healthcare.

### 1.4 Target Market
- Primary: Health-conscious adults in Sweden (25-65)
- Secondary: Broader Nordics, then EU
- Users range from elderly with no tech literacy to young health professionals
- The app must work for ALL of them

### 1.5 Founders
- Eoghan O'Reilly - Engineer, personal trainer/coach
- [Doctor co-founder] - Medical doctor, clinical validation, provides consultations

---

## 2. User Journeys

### 2.1 User Phases (State Machine)
The app tracks where each user is in their health journey and adapts content accordingly.

| Phase | Description | What They See |
|-------|-------------|---------------|
| `first_results` | Just completed onboarding, hasn't seen results | Animated results reveal page |
| `exploring` | Seen results, exploring the app | Risk overview, what-if explorer, blood test intro |
| `awaiting_results` | Ordered blood test, waiting | Status banner, educational content |
| `results_ready` | Blood test results arrived, not yet viewed | Prominent results banner |
| `results_reviewed` | Has viewed blood test results | Combined health snapshot, retest reminders |
| `returning` | Been away 7+ days | Welcome back, retake assessment prompt |

Implementation: `/src/lib/user-state.ts`

### 2.2 Journey: New User (Erik)
1. Lands on marketing page (`/`)
2. Signs in with BankID (`/login`) - mock in demo
3. Completes 8-step FINDRISC questionnaire (`/onboarding`)
4. Sees animated results reveal with score ring (`/results`)
5. Taps "Continue" to reach dashboard (`/dashboard`)
6. Explores risk detail page, what-if sliders (`/risk/diabetes`)
7. May order blood tests or ask AI questions
8. Returns periodically to track changes

### 2.3 Journey: Returning User (Anna)
1. Signs in with BankID
2. Sees phase-aware dashboard with blood results banner
3. Reviews blood test results with doctor's note
4. Discusses results with AI or books consultation
5. Follows action items, retests in 6 months

### 2.4 Journey: Worried User
- Sees risk level, may feel anxious
- AI chat available everywhere for reassurance
- Language is always empowering, never alarming
- Consultations offered contextually: "Want to discuss with Dr. Johansson?"
- What-if sliders show that situation is not fixed - things can improve

---

## 3. Pages and Screens

### 3.1 Landing Page (`/`)
**Purpose:** Convert visitors to sign-ups
**Content:**
- Hero: "Know your health risks before they find you"
- Gradient headline with brand accent color
- Trust signals: "Built by doctors and engineers in Sweden"
- Animated mock dashboard preview
- Feature cards with image placeholders (to be replaced with Midjourney images)
- Care packages section
- Footer disclaimer

### 3.2 Login (`/login`)
**Purpose:** Authenticate via BankID (mocked)
**Content:**
- Precura logo
- Personal number input field
- Two demo account buttons:
  - Erik Lindqvist (new user - goes to onboarding)
  - Anna Bergstrom (returning user - goes to dashboard with mock data)
- Simulated BankID verification animation
- On success: redirect based on user state

### 3.3 Onboarding (`/onboarding`)
**Purpose:** Collect FINDRISC inputs
**Content:**
- 8 steps, one question per screen with progress bar
- Each step has a friendly explanation of WHY the question matters
- Steps:
  1. Age range (under 45, 45-54, 55-64, 65+)
  2. Biological sex (male/female)
  3. Height (cm) + Weight (kg) - shows calculated BMI
  4. Waist circumference (cm) - with measurement instructions
  5. Physical activity (30+ min daily? yes/no)
  6. Diet (daily fruit/veg? yes/no)
  7. Medical history: blood pressure meds + high blood glucose history
  8. Family history of diabetes (none / extended / immediate)
- On completion: calculates FINDRISC score, saves to localStorage, redirects to `/results`
- Does NOT set isNew=false until user sees results reveal

### 3.4 Results Reveal (`/results`)
**Purpose:** First-time results presentation - a moment, not a data dump
**Content:**
- Full-screen focused experience
- Animated score ring that fills to user's position
- Risk level label and 10-year risk in plain language
- "Main factors in your score" card
- "Within your control" card with actionable factors
- "Can't be changed, but good to know" card with fixed factors
- "Continue" button -> marks results as revealed, sets isNew=false, goes to dashboard
- Disclaimer: "This is a screening estimate, not a diagnosis"

### 3.5 Dashboard (`/dashboard`)
**Purpose:** Quick-glance health status, what needs attention, next actions
**Content:**
- Greeting with date
- Health gauge row (horizontal scroll):
  - Diabetes risk: text-centric zone bar with triangle marker + risk label
  - Heart Health: "Coming soon" placeholder
  - Bone Health: "Coming soon" placeholder
- Attention banner (phase-dependent):
  - `results_ready`: "Blood test results ready" (teal, prominent)
  - `returning`: "Time for a check-in?" (accent, with retake link)
- Change highlights (if blood results exist):
  - "Blood Sugar (f-Glucose) 5.8 -> 5.4 mmol/L" with trend arrow
  - "Diabetes Risk Score 12 -> 10 pts" with trend arrow
- Next actions:
  - Tracked, specific items with due dates
  - NOT generic advice. e.g., "Try a 20-min walk after dinner" not "Exercise more"
  - Completed items shown struck through
- Care packages card (natural upsell, not aggressive)
- AI chat entry point with contextual suggestion chips
- 4-tab bottom nav: Dashboard, Health, Chat, You

### 3.6 Health Hub (`/health`)
**Purpose:** Deep comprehensive health view
**Content:**
- Health score overview card:
  - Diabetes risk zone bar with current position
  - Blood test summary (X/Y normal)
  - Status sentence
- "Your Body" section: 2x2 grid of biometric stats (height, weight, BMI, waist) with concern indicators
- Blood markers section: compact range bars for each biomarker with status dots
- Health modules list: Diabetes (active), Heart (coming soon), Bone (coming soon)
- Activity & Training section: current activity status + training plan upsell
- Timeline: narrative entries of health events
- Care packages at bottom

### 3.7 Risk Detail (`/risk/diabetes`)
**Purpose:** Deep dive into diabetes risk with interactive exploration
**Content:**
- Back navigation
- Hero: risk level text (e.g., "Slightly elevated") in zone color + zone bar with triangle marker + probability sentence
- Peer comparison: gradient bell curve (green-to-red) with "Avg (age 35-45)" dashed line and "You" marker
- Factor breakdown: donut chart showing factor proportions with legend, only active factors
- Modifiable vs fixed factors split
- What-if explorer: weight slider, lifestyle toggle - shows live score recalculation with two markers on zone bar (current + projected)
- Related blood markers: inline range bars (green zone, triangle marker) for HbA1c, f-Glucose, f-Insulin
- Score trend chart: zone background bands with gradient line showing score over time
- Expandable raw data section (for the detail-oriented)
- Care package upsell
- AI chat entry: "Ask about your diabetes risk"

### 3.8 Blood Tests - Order (`/blood-tests`)
**Purpose:** Browse and order blood test panels
**Content:**
- Two panels available:
  - Diabetes Focus Panel (795 SEK): HbA1c, fasting glucose, fasting insulin, lipid panel
  - Comprehensive Health Check (1,495 SEK): all of the above + thyroid, vitamins, iron, kidney, liver
- Each panel: name, description, price, expandable test list
- Order flow: select panel -> "How it works" 3-step explainer -> confirm -> success state
- "View Sample Results" link

### 3.9 Blood Test Results (`/blood-tests/results`)
**Purpose:** View and understand blood test results
**Content:**
- Header intro explaining results have been analyzed and reviewed
- Summary stat cards: X Normal (green), Y Borderline (amber), Z Abnormal (red)
- Doctor's note: "Dr. Johansson's Review" with personalized medical assessment
- Next steps section (BEFORE individual results, not buried):
  - Recommended retest date
  - Discuss with specialist link
  - Ask AI link
- Individual biomarker cards grouped by status (borderline first):
  - Plain English name + technical name
  - Large value in mono font with unit
  - Range bar: green zone highlighted, triangle marker
  - Brief interpretation (one line)
  - "Ask about this" link
  - Trend sparkline for borderline values (gradient line, endpoint dot)
- Care packages at bottom

### 3.10 Consultations (`/consultations`)
**Purpose:** Book doctor appointments
**Content:**
- Doctor card: Dr. Marcus Johansson, credentials, specialization
- Appointment type toggle: Video / In-person
- Date picker: horizontal scroll of next 7 days
- Time slot grid
- Price: 495 SEK
- "Book Appointment" button
- Confirmation state with details
- Note: "Your Precura health report will be shared with Dr. Johansson before your session"

### 3.11 AI Chat (`/chat`)
**Purpose:** Answer health questions in plain language
**Content:**
- Disclaimer banner: "Precura observations are educational, not medical advice"
- Pre-seeded AI greeting with user's name and score summary
- Suggested question chips (change based on user phase)
- Chat interface: user messages right (accent bg), AI messages left (card bg)
- Mock responses based on keyword matching:
  - Risk/level questions -> explains contributing factors
  - Change/improve questions -> lists modifiable factors with suggestions
  - FINDRISC/model questions -> explains methodology
  - Default -> suggests consulting a professional, offers booking link
- Input bar at bottom

### 3.12 Profile (`/profile`)
**Purpose:** Settings, data management, account
**Content:**
- User info (name, masked personnummer)
- Settings cards: Health Profile, Blood Tests, Consultations with last activity dates
- Data management: download, delete account
- Sign out button
- Disclaimer footer

### 3.13 Chart Gallery (`/charts`) - TEMPORARY
**Purpose:** Design decision page for reviewing chart styles
**Status:** Can be removed after chart decisions are finalized

---

## 4. Design System

### 4.1 Typography
- Body: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif
- Monospace (data/numbers): "SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace
- NEVER use Google Fonts (DM Sans, Space Mono, Inter, Roboto are all banned)

### 4.2 Color Palette

**Base (light mode):**
| Token | Value | Usage |
|-------|-------|-------|
| --bg | #f8f9fa | Page background |
| --bg-card | #ffffff | Card background |
| --bg-elevated | #f1f3f5 | Elevated surfaces |
| --bg-warm | #fef7ee | Warm accent sections |
| --text | #1a1a2e | Primary text |
| --text-secondary | #555770 | Secondary text |
| --text-muted | #8b8da3 | Muted labels |
| --text-faint | #b8bac6 | Faint hints |
| --border | #e6e8ed | Card borders |
| --divider | #eef0f4 | Section dividers |
| --accent | #5c6bc0 | Brand accent (indigo) |
| --accent-light | #e8eaf6 | Accent background |

**Health status colors:**
| Color | Base | Background | Text |
|-------|------|------------|------|
| Green | #4caf50 | #e8f5e9 | #2e7d32 |
| Amber | #ff9800 | #fff8e1 | #e65100 |
| Red | #ef5350 | #ffebee | #c62828 |
| Teal | #26a69a | #e0f2f1 | #00695c |
| Blue | #42a5f5 | #e3f2fd | #1565c0 |
| Purple | #7c4dff | #ede7f6 | #5e35b1 |

**Shadows:**
| Token | Value |
|-------|-------|
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03) |
| --shadow-md | 0 2px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04) |
| --shadow-lg | 0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06) |

### 4.3 Spacing and Layout
- Mobile-first: max-w-md (448px) for content
- Card padding: 16-24px
- Card border-radius: rounded-2xl (16px) or rounded-3xl (24px)
- Section gaps: 16-24px
- Bottom nav clearance: pb-28 (112px)

### 4.4 Components
- Cards: bg-card, 1px border, shadow-sm, rounded-2xl
- Pills/badges: rounded-full, small text, status-colored bg
- Buttons: rounded-full for primary CTAs, rounded-xl for secondary
- Icons: lucide-react, 16-20px
- Animations: fadeIn (0.5s), fadeInUp (0.6s), scaleIn (0.35s), stagger delays

### 4.5 Approved Chart Styles
1. **Bell curve (peer comparison)**: ECharts line with gradient zones green-to-red (lineStyle + areaStyle with linear color stops). markLine for average (dashed, gray, labeled). markPoint for user position (circle, 16px, white border, zone color, labeled "You", elastic animation)
2. **Range bar (blood markers)**: CSS divs. Gray track (#f5f5f5, 12px, rounded). Green zone overlay (rgba(76,175,80,0.15) with green border). Triangle marker pointing down from above, colored by status
3. **Zone bar (risk level)**: CSS divs. 5 colored segments (green 27%, teal 19%, amber 12%, red 23%, dark red 19%). White dot marker with colored border at score position. Zone labels below
4. **Trend line (score over time)**: ECharts line with markArea zone bands (green/teal/amber/red at low opacity). Smooth gradient line (green to orange). Circle symbols with white fill and colored borders. Tooltip on interaction
5. **Gauge (dashboard overview)**: Text-centric. Risk label in zone color, then compact zone bar with upward triangle marker, then probability sentence
6. **Sparkline (inline trend)**: ECharts line. Gradient line color (fading in from transparent). Gradient area fill. Only endpoint dot shown (8px, white border). Height 36-50px
7. **Factor breakdown (donut)**: ECharts pie, radius ["50%", "75%"]. borderRadius 6, white gap borders. Only factors with score > 0. Vertical legend beside: colored dot + name + "+X"

---

## 5. Data Model

### 5.1 User (localStorage: precura_user)
```typescript
interface User {
  id: string;
  name: string;
  personnummer: string;
  isNew: boolean;
  onboardingComplete: boolean;
}
```

### 5.2 FINDRISC Inputs (localStorage: precura_findrisc_inputs)
```typescript
interface FindriscInputs {
  age: number;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  sex: "male" | "female";
  physicalActivity: boolean;
  dailyFruitVeg: boolean;
  bloodPressureMeds: boolean;
  highBloodGlucoseHistory: boolean;
  familyDiabetes: "none" | "grandparent_aunt_uncle_cousin" | "parent_sibling_child";
}
```

### 5.3 FINDRISC Result (localStorage: precura_findrisc_result)
```typescript
interface FindriscResult {
  score: number;           // 0-26
  riskLevel: "low" | "slightly_elevated" | "moderate" | "high" | "very_high";
  riskLabel: string;       // "Slightly elevated"
  tenYearRisk: string;     // "~4%"
  breakdown: FindriscBreakdown;  // Per-factor scores
}
```

### 5.4 FINDRISC Scoring
| Score | Risk Level | 10-year Risk |
|-------|-----------|-------------|
| 0-6 | Low | ~1% |
| 7-11 | Slightly elevated | ~4% |
| 12-14 | Moderate | ~17% |
| 15-20 | High | ~33% |
| 21-26 | Very high | ~50% |

Factor point breakdown:
- Age: 0 (under 45) to 4 (65+)
- BMI: 0 (under 25) to 3 (over 30)
- Waist: 0 (M<94/F<80) to 4 (M>102/F>88)
- Physical activity: 0 (active) or 2 (inactive)
- Diet: 0 (daily fruit/veg) or 1 (not daily)
- Blood pressure meds: 0 (no) or 2 (yes)
- High blood glucose history: 0 (no) or 5 (yes)
- Family history: 0 (none) to 5 (parent/sibling)

### 5.5 User State (localStorage keys)
- `precura_results_revealed`: boolean - has seen results reveal
- `precura_blood_test_ordered`: boolean - ordered a blood test
- `precura_blood_test_viewed`: boolean - viewed blood test results
- `precura_last_visit`: timestamp - last dashboard visit

### 5.6 Blood Test Data
Mock data in `/src/lib/blood-test-data.ts`:
- Two panels: Diabetes Focus (795 SEK, 7 tests), Comprehensive (1,495 SEK, 9 tests)
- Mock results for 7 markers (5 normal, 2 borderline)
- Each result: testName, shortName, value, unit, refRangeLow, refRangeHigh, status, interpretation
- Doctor's summary note (mock)

### 5.7 Mock Users
- Erik Lindqvist (new): personnummer 199201150234, goes to onboarding
- Anna Bergstrom (returning): personnummer 198507220148, has data + blood results

---

## 6. Technical Architecture

### 6.1 Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-based config with @theme inline)
- **Charts**: Apache ECharts via echarts-for-react, echarts-gl for 3D
- **Icons**: lucide-react
- **Hosting**: Vercel
- **Repository**: GitHub (Eoghanoreilly/precura)
- **Node**: v20+ (via nvm)

### 6.2 File Structure
```
precura/
  src/
    app/
      page.tsx                    # Landing page
      layout.tsx                  # Root layout (fonts, metadata)
      globals.css                 # Design system (CSS variables, animations)
      login/page.tsx              # Mock BankID auth
      onboarding/page.tsx         # FINDRISC questionnaire
      results/page.tsx            # Post-onboarding results reveal
      dashboard/page.tsx          # Phase-aware home screen
      health/page.tsx             # Comprehensive health hub
      risk/diabetes/page.tsx      # Diabetes risk detail + charts
      blood-tests/page.tsx        # Order test panels
      blood-tests/results/page.tsx # View results + doctor's note
      chat/page.tsx               # AI chat (mock)
      consultations/page.tsx      # Book appointments
      profile/page.tsx            # Settings
      charts/page.tsx             # Temporary chart gallery
    components/
      BottomNav.tsx               # 4-tab navigation
      Header.tsx                  # App header with logo + user
      ImagePlaceholder.tsx        # Gradient placeholder for future images
      QuickActions.tsx            # (legacy, may be unused)
      RiskCard.tsx                # (legacy, may be unused)
    lib/
      auth.ts                     # Mock auth (localStorage)
      findrisc.ts                 # FINDRISC calculator + helpers
      mock-data.ts                # Mock patient data + localStorage helpers
      blood-test-data.ts          # Blood test panels, results, summary
      prompts.ts                  # AI system prompt template
      user-state.ts               # User phase state machine
```

### 6.3 Dependencies
**Production:**
- next, react, react-dom
- echarts, echarts-for-react, echarts-gl
- lucide-react
- @nivo/* (legacy, can be removed - no longer used in any page)
- recharts (legacy, can be removed - no longer used in any page)

**Dev:**
- tailwindcss, @tailwindcss/postcss
- typescript, @types/react, @types/react-dom, @types/node
- eslint, eslint-config-next

### 6.4 State Management
All state is localStorage-based (no backend). Keys:
- `precura_user` - User profile
- `precura_findrisc_inputs` - Questionnaire answers
- `precura_findrisc_result` - Calculated score
- `precura_results_revealed` - Has seen results page
- `precura_blood_test_ordered` - Has ordered a test
- `precura_blood_test_viewed` - Has viewed results
- `precura_last_visit` - Last visit timestamp

---

## 7. Revenue Model

### 7.1 Products
| Product | Price (SEK) | What's Included |
|---------|-------------|-----------------|
| Free assessment | 0 | FINDRISC questionnaire + risk score + AI chat |
| Diabetes Focus Panel | 795 | HbA1c, fasting glucose, fasting insulin, full lipid panel + doctor review |
| Comprehensive Health Check | 1,495 | All above + thyroid, vitamins, iron, kidney, liver + doctor review |
| Doctor Consultation | 495 | 30-min video/in-person with Dr. Johansson |
| Blood Test + Consultation | 1,195 | Diabetes panel + 30-min consultation |
| Complete Package | 1,895 | Blood test + consultation + personalized 4-week training plan |

### 7.2 Upsell Strategy
- Upsells surface naturally within the health journey
- After seeing risk factors -> training plan
- After blood results -> consultation
- Combo packages presented as "Care Packages"
- Never feels like an ad. Feels like a natural next step
- Doctor's note included with every blood test (differentiator)

---

## 8. Future Roadmap

### 8.1 Phase 1 (Current - MVP Demo)
- FINDRISC diabetes risk assessment
- Mock blood test ordering and results
- Mock AI chat
- Mock consultation booking
- Care packages
- Deploy to Vercel for demo purposes

### 8.2 Phase 2 - Real Integrations
- Real BankID authentication (via Criipto or similar)
- Supabase backend (PostgreSQL + Row Level Security)
- Real blood test lab integration (Werlabs, Unilabs, Synlab)
- Real AI chat (Claude API via Next.js API routes)
- Payment processing (Stripe)
- Push notifications

### 8.3 Phase 3 - Additional Health Modules
- SCORE2 cardiovascular risk assessment
- FRAX bone health assessment
- Module registry pattern: adding a new health area = adding a config entry
- Each module reuses the same page template, chart styles, and factor breakdown pattern

### 8.4 Phase 4 - Training Plans
- Personalized exercise programs based on health data
- Integration with Eoghan's personal training expertise
- Physiotherapist referral partner
- Activity tracking and progress monitoring

### 8.5 Phase 5 - B2B
- Doctor dashboard: aggregate risk data for their patient population
- Vardcentral integration
- "47 of your 2,000 patients are trending toward Type 2 diabetes"
- This is the "holy shit" moment for investors

### 8.6 Phase 6 - Expansion
- Nordic markets (Norway, Denmark, Finland)
- Multi-language support (i18n infrastructure)
- EU expansion via EHDS (European Health Data Space)

---

## 9. Legal and Compliance Notes

### 9.1 Positioning
- Precura is NOT a medical device
- All outputs are "observations" and "educational", not diagnoses or recommendations
- Clear disclaimers on every screen: "This is a screening estimate, not a diagnosis"

### 9.2 Data
- GDPR compliance required (special category health data)
- EU-hosted servers (Sweden preferred)
- Right to deletion
- Explicit consent for data processing
- Currently all data is localStorage (no server-side storage in MVP)

### 9.3 Regulatory
- EU MDR (Medical Device Regulation) classification must be assessed
- Using validated, published risk models (FINDRISC) mitigates regulatory risk
- "Observation not recommendation" framing is intentional
- Legal counsel needed before any real launch

---

## 10. Competitive Landscape

| Competitor | What They Do | How Precura Differs |
|-----------|-------------|-------------------|
| Kry | Reactive telemedicine | Precura is proactive/predictive |
| Werlabs | Blood test ordering + results | Precura adds risk scoring + AI interpretation + action plans |
| InsideTracker | Blood-based health optimization | US-focused, expensive, no Swedish integration |
| Apple Health | Health data aggregation | No predictive risk scoring, no action plans |
| WHOOP/Oura | Wearable health tracking | Daily data, no clinical risk models, no blood tests |

Precura's unique position: ongoing predictive health monitoring + validated clinical risk models + AI interface + Swedish health system integration + action plans. None of the above do all of these.

---

## 11. Image Placeholders

The following numbered gradient placeholders exist in the codebase and need to be replaced with real images (to be generated via Midjourney):

| # | Location | Suggested Prompt |
|---|----------|-----------------|
| 1 | Landing hero | TBD - health data visualization concept art |
| 2 | Landing feature 1 | TBD - person answering health questionnaire |
| 3 | Landing feature 2 | TBD - health risk profile dashboard |
| 4 | Landing feature 3 | TBD - blood test analysis |

Midjourney prompts will be provided after the visual design is finalized.
