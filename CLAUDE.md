@AGENTS.md

## Precura Project

### What This Is
Precura ("pre" + "cura" = prediction is the cure) is a predictive health platform. Users complete health questionnaires, get risk scores using validated clinical models, order blood tests, talk to AI, see doctors, and follow action plans. Think "Kry meets Apple Health meets Werlabs" but focused on prediction and prevention.

### Co-founders
- Eoghan (engineer, personal trainer/coach) - builds the product
- Doctor friend (medical co-founder) - clinical validation, consultations, blood test reviews

### Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Apache ECharts (echarts-for-react) for charts
- lucide-react for icons
- Deployed on Vercel: https://precura-wine.vercel.app
- GitHub: https://github.com/Eoghanoreilly/precura
- Node 20 required (use nvm: `source ~/.nvm/nvm.sh && nvm use 20`)
- .npmrc has `legacy-peer-deps=true` for echarts-gl compatibility

### Git Workflow
- Create feature branches, never push directly to main
- PRs with descriptions for every change
- Build must pass before committing
- Clean commit messages explaining WHY

### Design System
- Apple system fonts only (-apple-system, SF Pro). NEVER Google Fonts
- Light mode, warm, friendly. Google Labs inspired aesthetic
- CSS variables for all colors (defined in globals.css)
- Soft shadows (var(--shadow-sm), var(--shadow-md), var(--shadow-lg))
- Rounded corners: 2xl for cards, full for pills/buttons
- Mobile-first, max-w-md for content

### Approved Chart Styles
- Bell curve: gradient zones green-to-red, avg dotted line, "You" marker
- Range bar: green zone highlighted, triangle marker
- Zone bar: colored segments, white dot marker
- Trend line: zone background bands, gradient line
- Gauge: text-centric zone bar with triangle (NOT arc gauges)
- Sparkline: gradient line, endpoint dot only
- Factor breakdown: donut with legend

### Key Design Rules
- All medical terms need plain English in parentheses
- No generic health advice - be specific to user's data
- No left border accents on cards
- Upsells surface naturally within the health journey, not buried
- Every blood test includes a doctor's review/note
- Dashboard = quick glance. Health page = deep comprehensive view
- Quality over speed. Polish before shipping.

### User State Machine
User phases (in user-state.ts): first_results, exploring, awaiting_results, results_ready, results_reviewed, returning. Dashboard renders different content per phase.

### Pages
- `/` - Landing page
- `/login` - Mock BankID auth (two demo users: Erik new, Anna returning)
- `/onboarding` - 8-step FINDRISC questionnaire
- `/results` - Post-onboarding animated results reveal
- `/dashboard` - Phase-aware home screen with zone bar gauge, actions, AI chat
- `/health` - Comprehensive health hub with body stats, blood markers, timeline
- `/risk/diabetes` - Detailed risk breakdown with bell curve, factors, what-if, trends
- `/blood-tests` - Order test panels
- `/blood-tests/results` - View results with range bars, doctor's note, care packages
- `/chat` - AI chat (mock responses)
- `/consultations` - Book doctor appointments
- `/profile` - Settings, data management
- `/charts` - Temporary chart gallery for design decisions (can be removed)

### Revenue Model
- Blood test panels (795-1,495 SEK)
- Doctor consultations (495 SEK)
- Training plans (personalized, price TBD)
- Combo packages: Blood Test + Consultation (1,195 SEK), Complete Package with training (1,895 SEK)

### Clinical Models
- FINDRISC (diabetes risk) - implemented in lib/findrisc.ts
- SCORE2 (cardiovascular) - future
- FRAX (bone health) - future
