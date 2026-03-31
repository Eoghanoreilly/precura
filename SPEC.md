# Precura - Product Specification

## 1. Overview

### 1.1 What Is Precura
Precura is a predictive health platform that puts health risk intelligence in users' hands. The name comes from "pre" (prediction/prevention) + "cura" (cure/care). The core thesis: prediction IS the cure. Prevention through early detection and actionable guidance.

### 1.2 The Problem

Swedish healthcare is in crisis on multiple fronts:

**The system is reactive, not predictive.** Patients interact episodically - a blood test here, a checkup there - but nobody watches the full picture over time. Roughly HALF of Swedes who develop Type 2 diabetes during a 10-year period go undiagnosed, despite 90% of Stockholm County visiting primary care at least once in five years (SDPP cohort study, BMC Medicine 2024). The data to predict their condition existed years before diagnosis. Nobody connected the dots.

**The IT infrastructure is broken.** Sweden's new COSMIC journal system - adopted by 19 of 21 regions - has been called "the biggest fiasco" in healthcare IT. Doctors in Region Gavleborg reported that after just 1.5 weeks, sensitive patient images (including gynecological ultrasounds and sexual assault documentation) were accessible to all doctors without consent. The system "makes it impossible to protect patients' integrity." Doctors reverted to the old system for sensitive cases. Previously, the 1177 healthcare line had 2.7 million patient phone calls stored on an unprotected web server without encryption.

**21 regions, 21 different systems.** Sweden's decentralized healthcare means patient data doesn't flow between regions. There is no unified patient record. Information is not automatically transferred between different EMRs. This is a coordination nightmare.

**Waiting times are failing patients.** Swedish law says patients should wait no more than 90 days for surgery or a specialist. Every third patient waits longer. The median wait for prostate cancer surgery in Vasterbotten was 271 days. 69% of Swedes say staff shortage is the biggest problem. There are 40% fewer GPs than needed.

**Diabetes costs are exploding.** Type 2 diabetes affected ~5% of the population in 2019, costing over SEK 30 billion in healthcare expenditure. Only 23% went to prevention - 70% went to treating complications that could have been predicted and prevented. Prevalence rose from 4.87% to 7.50% between 2006 and 2021, with early-onset T2D increasing sharply among younger populations. Societal costs are projected to rise 22% by 2040.

**The gap Precura fills:** Nobody is connecting the prediction data to the patient in a way they can understand and act on. The clinical risk models exist. The blood tests exist. The doctors exist. But there is no system that puts it all together for the individual person and says "here's where you're heading, here's what you can do about it, and here's how to get help."

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

### 8.1 Phase 1 - MVP Demo (Current)
- FINDRISC diabetes risk assessment with validated scoring
- Mock blood test ordering and results with doctor's note
- Mock AI chat with contextual responses
- Mock consultation booking
- Care packages (blood test + consultation + training plan bundles)
- Phase-aware dashboard adapting to user journey
- Deployed on Vercel for investor/co-founder demos

### 8.2 Phase 2 - Real Product (Target: Q3 2026)
- **Authentication**: Real BankID via Criipto or Signicat
- **Backend**: Supabase (PostgreSQL + Row Level Security, EU region)
- **Lab integration**: Partner with Synlab, Unilabs, or Karolinska University Laboratory (the three labs Werlabs uses) for blood test fulfillment
- **AI chat**: Claude API via Next.js API routes with streaming, grounded in user's health data
- **Payments**: Stripe (supports Swedish Klarna, Swish integration)
- **Notifications**: Push notifications for results ready, retest reminders, check-in prompts
- **FHIR readiness**: Structure all health data in FHIR-compatible format from day one (prepares for EHDS integration later)

### 8.3 Phase 3 - Additional Health Modules (Target: Q1 2027)
- **SCORE2** cardiovascular risk assessment (calibrated for Swedish population data)
- **FRAX** bone health / fracture risk assessment
- Module registry pattern: adding a new health area = adding a config entry to the registry
- Each module reuses the same page template, chart styles, and factor breakdown pattern
- Cross-module insights: "Your diabetes risk factors also affect your cardiovascular outlook"

### 8.4 Phase 4 - Training and Lifestyle (Target: Q2 2027)
- **Personalized exercise programs** based on health data, age, medical history, injuries
- Programs designed by Eoghan (certified personal trainer) with clinical input from the doctor co-founder
- **Physiotherapist referral partner** for users with physical limitations
- Activity tracking integration (could connect with Apple Health/WHOOP/Oura data)
- Progress monitoring: "You've been following your plan for 4 weeks. Want to retest to see if it's working?"
- This is a major revenue stream and differentiator - no other health prediction platform offers personalized action plans

### 8.5 Phase 5 - B2B Healthcare Provider Tools (Target: Q4 2027)
- **Vardcentral dashboard**: aggregate anonymized risk data for a primary care center's patient population
- "47 of your 2,000 registered patients are trending toward Type 2 diabetes and don't know it yet"
- Enables proactive outreach by healthcare providers to at-risk patients
- Revenue model: SaaS subscription for healthcare providers
- Solves the COSMIC problem from the other direction: instead of fixing the broken EHR, give providers a supplementary tool that actually works
- This is the "holy shit" moment for investors - it's where the platform becomes a population health tool

### 8.6 Phase 6 - Nordic Expansion (Target: 2028)
- Norway, Denmark, Finland share similar healthcare structures and challenges
- Multi-language support (i18n infrastructure, all user-facing strings externalized)
- BankID equivalents exist in all Nordic countries (Norwegian BankID, Danish NemID/MitID, Finnish bank authentication)
- Lab partnerships in each market
- Clinical risk models already calibrated for Nordic populations (SCORE2 has Nordic coefficients)

### 8.7 Phase 7 - Pan-European via EHDS (Target: 2029-2031)
- The European Health Data Space regulation mandates cross-border health data portability by 2029 (patient summaries) and 2031 (lab results, images)
- Precura's FHIR-ready data structure enables integration with the EHDS infrastructure
- Patients moving between EU countries can bring their Precura health profile with them
- This is where the 450M population EU market opens up
- Regulatory moat: being EHDS-compliant early is a competitive advantage

### 8.8 Phase 8 - Population Health Intelligence (Target: 2030+)
- Anonymized aggregate data from hundreds of thousands of users creates a population health dataset
- Research partnerships with Karolinska, Uppsala University, other Swedish research institutions
- Epidemiological insights: "In Region Stockholm, diabetes risk is 23% higher in postal code 145xx than 114xx"
- Public health collaboration: share insights with Folkhalsomyndigheten (Public Health Agency of Sweden)
- This is the long-term defensible moat: data that nobody else has

---

## 9. Legal, Regulatory, and Compliance

### 9.1 Positioning
- Precura is NOT a medical device in its current form
- All outputs are "observations" and "educational", not diagnoses or recommendations
- Clear disclaimers on every screen: "This is a screening estimate, not a diagnosis"
- The doctor consultation and blood test review ARE medical services (provided by a licensed physician)

### 9.2 Data Protection
- **GDPR** compliance required - health data is "special category" requiring explicit consent
- **Patientdatalagen** (Swedish Patient Data Act) governs processing of patient data
- EU-hosted servers mandatory (Sweden preferred)
- Right to deletion, right to data portability
- Explicit consent for all data processing
- Audit logging for all data access
- Currently all data is localStorage (no server-side storage in MVP)
- When Supabase backend is added: Row Level Security, encryption at rest, EU region hosting

### 9.3 EU Medical Device Regulation (MDR)
- Software that performs diagnosis or treatment recommendation may be classified as a medical device under EU MDR
- FINDRISC is a published clinical tool - Precura presents its results, does not create a new diagnostic
- The "observation not recommendation" framing is intentional and legally significant
- If classified as a medical device: Class IIa minimum, requiring notified body assessment
- The AI chat must be carefully scoped - answering "what does this mean" (educational) vs "what should I do" (medical advice) is the critical line
- Legal counsel needed before any real launch
- The EU AI Act (effective 2024, high-risk obligations by 2027) adds additional requirements for AI in medical contexts: explainability, algorithm transparency, risk controls

### 9.4 European Health Data Space (EHDS)
The EHDS regulation was published March 5, 2025 and enters into force March 26, 2025. This is a MAJOR opportunity for Precura.

**Timeline that matters:**
- June 2025: Each EU member state must appoint a National Digital Health Authority
- January 2026: All healthcare providers and EHR vendors must certify for interoperability
- March 2029: Cross-border patient summaries and e-prescriptions operational
- March 2031: Cross-border lab results, medical images, discharge reports operational

**What EHDS means for Precura:**
- Patients will have the legal right to access and port their health data across the EU
- FHIR (Fast Healthcare Interoperability Resources) is the standard for data exchange
- Third-party health apps (like Precura) will have a legal framework to access patient data with consent
- This solves the "21 regions, 21 systems" problem over time
- Precura should be FHIR-ready from the start, even if integration comes later
- Cross-border expansion becomes technically feasible by 2029-2031

### 9.5 The COSMIC Problem as Opportunity
The COSMIC EHR fiasco (adopted by 19/21 Swedish regions, documented patient safety failures, privacy breaches, medication error risks) creates a trust vacuum. Patients are losing faith in the system's ability to manage their health data. Precura's pitch can include:
- "Your health data, in your hands, not in a broken system"
- "We don't replace your medical records - we make sense of them for you"
- "While the regions sort out their IT, you can take control of your own health picture"
- This is not anti-establishment - it's complementary. Precura helps patients be better-informed participants in a system that's struggling to serve them.

### 9.6 Insurance and Liability
- Professional liability insurance needed for the doctor consultation service
- The AI chat needs clear disclaimers distinguishing educational information from medical advice
- Blood test interpretation combined with AI analysis may create liability questions
- The doctor's note/review on every blood test mitigates this - a licensed physician has reviewed the results
- Terms of service must clearly define what Precura is and is not

---

## 10. Competitive Landscape

### 10.1 Direct Competitors in Sweden

| Competitor | What They Do | Revenue | Gap Precura Fills |
|-----------|-------------|---------|-------------------|
| **Kry** | Reactive telemedicine - see a doctor when sick | ~SEK 2B+ | No prediction, no prevention, no ongoing monitoring. Only engaged when the patient initiates. |
| **Werlabs** | Blood test ordering + results journal. 350K+ customers, 4.4 stars | Est. SEK 200M+ | No risk scoring, no AI interpretation, no action plans, no ongoing relationship. Results are raw data. |
| **Min Doktor** | Telemedicine, chat with doctors | N/A | Same as Kry - reactive, not predictive |
| **Doktor.se** | Telemedicine platform | N/A | Same reactive model |

### 10.2 International Competitors (Not in Sweden Yet)

| Competitor | What They Do | Revenue/Valuation | Why They're Relevant |
|-----------|-------------|-------------------|---------------------|
| **Function Health** | Annual blood testing subscription, 100+ biomarkers, AI analysis | $100M ARR, $2.5B valuation (Nov 2025) | Proved the model works at scale. $365/year subscription. NOT in Europe yet. |
| **Superpower** | Biannual blood testing + 100 biomarkers + AI | $30M Series A, $199/year | Newer, aggressive pricing. NOT in Europe. |
| **Neko Health** | Full body scan (70+ sensors, 50M data points in minutes) | $260M Series B, $1.8B valuation | Stockholm-based, 100K+ waitlist. Expensive (~SEK 3,000/scan). Physical clinics only. |
| **InsideTracker** | Blood biomarker analysis + InnerAge concept | N/A | US-focused, expensive, no Swedish integration |
| **Hims & Hers** | Telehealth + blood testing ($199/year base tier) | Public company | Massive brand, entering blood testing. No European presence. |

### 10.3 Adjacent Players

| Player | Relationship to Precura |
|--------|------------------------|
| **Apple Health** | Data aggregation layer. No prediction, no action. Could be an integration partner. |
| **WHOOP/Oura** | Wearable daily tracking. Different data type (activity, sleep, HRV). Complementary, not competitive. Both have added lab test offerings. |
| **Cambio (COSMIC)** | The broken EHR vendor. Precura is patient-facing, not provider-facing - but the COSMIC mess means patients can't trust the system to manage their data. |

### 10.4 Precura's Unique Position

No player in the Swedish/Nordic market combines ALL of these:
1. Validated clinical risk models (FINDRISC, SCORE2, FRAX)
2. Blood test ordering with AI + doctor interpretation
3. Personalized action plans (training, diet, lifestyle)
4. AI conversational interface for health questions
5. Ongoing monitoring and trend tracking over years
6. Doctor consultations integrated into the journey
7. Swedish-market native (BankID, Swedish healthcare context)

Function Health proved this model works at $100M ARR in the US. Nobody has brought it to Europe yet. Precura can be the European Function Health, but with clinical risk models on top of blood testing - not just biomarker tracking.

### 10.5 Key Market Data

- Sweden digital health sector: 180+ startups, projected ~$1B by 2029 (8.86% CAGR)
- $2.23B total digital health VC funding raised in Sweden
- 13% of health spending is out-of-pocket (mainly pharma, dental, outpatient)
- Private health insurance growing - 60% employer-provided, primarily for faster access
- Function Health's $365/year price point validated willingness to pay for preventive testing

---

## 11. Market Opportunity and Pitch Narrative

### 11.1 The Numbers That Matter

| Metric | Value | Source |
|--------|-------|--------|
| Sweden population | 10.5M | SCB |
| Type 2 diabetes prevalence (2021) | 7.50% of population | European Journal of Public Health |
| Undiagnosed T2D rate | ~50% of new cases | SDPP cohort, BMC Medicine 2024 |
| Annual diabetes healthcare cost | SEK 30B+ | Swedish National Diabetes Register |
| Cost going to prevention vs treatment | 23% vs 70% | Same source |
| Projected cost increase by 2040 | +22% (SEK 4.9B to 5.8B) | Frontiers, 2025 |
| Function Health ARR (US comparable) | $100M at 200K subscribers | Sacra, Feb 2025 |
| Function Health valuation | $2.5B | Series B, Nov 2025 |
| Neko Health valuation | $1.8B | Series B, Jan 2025 |
| Sweden digital health VC total | $2.23B raised | Tracxn |
| Swedish digital health projected market | ~$1B by 2029 | Industry reports |
| Primary care visits per 5 years | 90%+ of population | SDPP study |
| Patients waiting >90 days for specialist | 1 in 3 | Swedish government |
| Healthcare staff shortage perception | 69% cite as #1 problem | Statista 2024 |

### 11.2 The Pitch

**Opening (the problem):**
"Every year in Sweden, roughly 40,000 people are diagnosed with Type 2 diabetes. Half of them could have been identified 5-10 years earlier. The data existed in their medical records. The risk models existed in clinical research. But nobody connected the dots. Meanwhile, Sweden's healthcare IT system - COSMIC - has been called 'the biggest fiasco' in healthcare, with documented patient privacy breaches and medication error risks. The system that's supposed to protect people is failing them."

**The solution:**
"Precura puts predictive health intelligence directly in people's hands. We use the same validated risk models doctors use - FINDRISC, SCORE2, FRAX - but present them in a way anyone can understand. We add blood tests with AI analysis and doctor review. We provide personalized action plans. And we track progress over years, not just single visits."

**The market proof:**
"Function Health proved this model works at scale - $100M ARR, $2.5B valuation, 200K subscribers in the US alone. But they're not in Europe. Neither is Superpower, Hims & Hers Labs, or any other consumer health testing platform. Sweden has Werlabs for blood tests and Kry for doctor visits, but nobody combines prediction, testing, action, and ongoing monitoring."

**The timing:**
"The European Health Data Space regulation entered into force in March 2025. By 2029, patient health data will be portable across all EU member states. Precura is building FHIR-ready from day one. We're not just building for Sweden - we're building for 450 million Europeans."

**The team:**
"A doctor and an engineer. Clinical credibility and technical capability. Plus a personal trainer for the action plan side that no other platform offers."

**The B2B flip:**
"Once we have 50,000 users in a region, we can go to their vardcentral and say: '47 of your 2,000 registered patients are trending toward Type 2 diabetes. Here's the data. We can help you reach them before they need treatment.' That's where the real money is."

### 11.3 Why Now

1. **AI makes the interface possible.** LLMs can explain health data in plain language for the first time. This wasn't buildable 3 years ago.
2. **EHDS creates the legal framework.** Patient data portability becomes law across the EU.
3. **COSMIC created the trust vacuum.** Patients are losing faith in institutional health IT. They want control.
4. **Function Health proved willingness to pay.** $365/year for preventive blood testing is a validated price point.
5. **Diabetes costs are exploding.** Only 23% of spending goes to prevention. That's insane. The math demands early detection.
6. **Post-COVID health awareness** is at a historic high. People care about their health more than ever.

### 11.4 Precura's Relationship to COSMIC and Broken Healthcare IT

The COSMIC article is not just context - it's core to Precura's positioning:

**What COSMIC represents:**
- A top-down, institution-first approach to health data
- Systems designed for hospital workflows, not patient understanding
- Privacy failures that erode trust (sensitive images accessible without consent)
- Medication error risks from poor UX design
- 19 regions committed to a system doctors call "the biggest fiasco"

**What Precura represents (the counter-narrative):**
- A bottom-up, patient-first approach to health data
- Designed for the person, not the institution
- The patient owns and controls their data
- Health information presented in a way that empowers, not confuses
- A supplement to the healthcare system, not a replacement
- When the system fails (long waits, fragmented records, broken IT), Precura fills the gap

**The messaging:**
- NOT "the healthcare system is broken, use us instead"
- YES "while the system sorts itself out, you can take control of your own health picture"
- NOT adversarial. Complementary. Precura makes informed patients who are easier for doctors to help.

---

## 12. Image Placeholders

The following numbered gradient placeholders exist in the codebase and need to be replaced with real images (to be generated via Midjourney):

| # | Location | Suggested Prompt |
|---|----------|-----------------|
| 1 | Landing hero | TBD - health data visualization concept art |
| 2 | Landing feature 1 | TBD - person answering health questionnaire |
| 3 | Landing feature 2 | TBD - health risk profile dashboard |
| 4 | Landing feature 3 | TBD - blood test analysis |

Midjourney prompts will be provided after the visual design is finalized.

---

## 13. Key Research Sources

- [COSMIC healthcare system problems - Sweden Herald](https://swedenherald.com/article/new-healthcare-system-sparks-outrage-completely-unacceptable)
- [COSMIC risks warned about - Sveriges Radio](https://www.sverigesradio.se/artikel/varnade-om-risker-om-cosmic-var-kvar-nar-det-infordes)
- [Undiagnosed T2D in Sweden - BMC Medicine 2024](https://link.springer.com/article/10.1186/s12916-024-03393-0)
- [Early-onset T2D increasing in Sweden - European Journal of Public Health](https://academic.oup.com/eurpub/article/35/6/1258/8195859)
- [Societal cost of T2D in Sweden - Frontiers 2025](https://www.frontiersin.org/journals/clinical-diabetes-and-healthcare/articles/10.3389/fcdhc.2025.1611426/full)
- [EHDS Regulation - EU Official](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en)
- [Function Health at $100M ARR - Sacra](https://sacra.com/research/function-health-at-100m-year/)
- [Neko Health $260M raise - MedTech Dive](https://www.medtechdive.com/news/neko-health-series-b-funding-full-body-scan/738447/)
- [Sweden healthcare system 2025 - OECD](https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/12/country-health-profile-2025-country-notes_7e72146d/sweden_89cbfa25/a77d5bfa-en.pdf)
- [Swedish healthcare IT incidents - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10515578/)
- [1177 data breach - Healthcare IT News](https://www.healthcareitnews.com/news/emea/swedish-healthcare-advice-line-stored-27-million-patient-phone-calls-unprotected-web-server)
- [Machine learning for diabetes prediction in Sweden - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8282976/)
- [EU AI Act and medical devices - Quickbird Medical](https://quickbirdmedical.com/en/ai-act-medical-devices-mdr/)
- [FHIR interoperability standard](https://www.sciencedirect.com/science/article/pii/S1532046419301066)
- [Sweden digital health startups - Tracxn](https://tracxn.com/d/explore/healthtech-startups-in-sweden/__ln06QUP_tDqJlr3fH4I962ZmcvhuHtWZT4rUCj0-6SI/companies)
- [Private health insurance in Sweden - Wiley 2025](https://onlinelibrary.wiley.com/doi/full/10.1002/hpm.3941)
