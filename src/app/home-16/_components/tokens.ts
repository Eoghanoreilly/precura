// ============================================================================
// HOME-16 TOKENS / "THE SHOPFRONT"
// ============================================================================
// Airbnb-warm aesthetic. Cream backgrounds, rounded cards, friendly accents.
// Apple system fonts only. No Google Fonts. No em dashes. No unicode arrows.
// ============================================================================

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

// ---------------------------------------------------------------------------
// COLOUR PALETTE / Airbnb warm + Swedish light
// ---------------------------------------------------------------------------
// Cream canvas + editorial ink + coral accent + sage trust + amber warmth.
// Every colour is neutral enough to feel premium, warm enough to feel friendly.
// ---------------------------------------------------------------------------

export const COLORS = {
  // Canvas layers
  bgCream: "#FDF8F0", // page background, warm cream
  bgCreamDeep: "#F6EDDD", // hero panel, deeper cream
  bgPaper: "#FFFFFF", // cards, crisp white
  bgSoft: "#F7F3EB", // alt section background

  // Ink / text
  ink: "#1B1B1B", // primary text, warm black
  inkSoft: "#3D3A36", // secondary text
  inkMuted: "#767067", // tertiary, captions
  inkFaint: "#A59F95", // hairline captions

  // Coral (primary accent, Airbnb-ish)
  coral: "#E85A4F", // buttons, links, highlights
  coralDeep: "#C7423A", // hover
  coralSoft: "#FCE4E1", // tinted surfaces
  coralTint: "#FDEEEB", // subtle backgrounds

  // Sage (trust / science)
  sage: "#4E7F5F", // doctor, trust, good status
  sageSoft: "#E3EFE4", // sage-tinted surfaces

  // Amber (warmth / borderline)
  amber: "#C77E2A", // borderline markers, amber chips
  amberSoft: "#FBEFD6", // tinted chips

  // Data status (only inside data visuals)
  good: "#4E8E5C",
  caution: "#C68C1F",
  watch: "#C84A2D",

  // Lines / dividers
  line: "#E8E1D2",
  lineSoft: "#F0EADC",
  lineFaint: "#F5F0E4",

  // Shadows (Airbnb style - soft and warm)
  shadowSoft: "0 2px 8px rgba(28,26,22,0.06)",
  shadowMedium: "0 6px 24px rgba(28,26,22,0.09)",
  shadowLift: "0 12px 48px rgba(28,26,22,0.14)",
  shadowHero: "0 18px 60px rgba(28,26,22,0.16)",
} as const;

// ---------------------------------------------------------------------------
// BORDER RADII / Airbnb rounds hard on cards
// ---------------------------------------------------------------------------

export const RADIUS = {
  pill: 999,
  chip: 12,
  card: 20,
  cardLarge: 28,
  image: 24,
} as const;

// ---------------------------------------------------------------------------
// IMAGERY / Real Unsplash photos with warm, human, Swedish feel
// ---------------------------------------------------------------------------

export const IMG = {
  // Hero product image - a warm portrait that feels aspirational and honest
  heroProduct:
    "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1800&q=85&auto=format&fit=crop",

  // Anna photos
  annaPortrait:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=85&auto=format&fit=crop",
  annaCoffee:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1600&q=85&auto=format&fit=crop",

  // Doctor
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1800&q=85&auto=format&fit=crop",
  doctorHands:
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85&auto=format&fit=crop",

  // Lab and test kit
  lab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1800&q=85&auto=format&fit=crop",
  bloodDraw:
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1800&q=85&auto=format&fit=crop",

  // Lifestyle / members
  runner:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&q=85&auto=format&fit=crop",
  member1:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=85&auto=format&fit=crop",
  member2:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=85&auto=format&fit=crop",
  member3:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200&q=85&auto=format&fit=crop",
  member4:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85&auto=format&fit=crop",
  member5:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=85&auto=format&fit=crop",

  // Science / trust
  research:
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1800&q=85&auto=format&fit=crop",

  // Stockholm / Swedish feel
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1800&q=85&auto=format&fit=crop",
};

// ---------------------------------------------------------------------------
// SUBSCRIPTION PRICING / Source of truth for the page
// ---------------------------------------------------------------------------

export const TIERS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Try it once, see the trend.",
    price: 995,
    perMonth: Math.round(995 / 12),
    featured: false,
    cta: "Start with Starter",
    includes: [
      "1 blood panel per year (40+ markers)",
      "Digital risk profile (FINDRISC, SCORE2, FRAX)",
      "AI chat with your data",
      "Basic biomarker tracking",
      "Cancel anytime",
    ],
  },
  {
    id: "member",
    name: "Member",
    tagline: "Everything a worried 40-year-old needs.",
    price: 2995,
    perMonth: Math.round(2995 / 12),
    featured: true,
    cta: "Start your membership",
    includes: [
      "2 blood panels per year",
      "Secure messaging with Dr. Marcus",
      "Personal coach and training plan",
      "Full AI chat with your history",
      "Living health profile",
      "Cancel anytime",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "For people who want the full picture.",
    price: 4995,
    perMonth: Math.round(4995 / 12),
    featured: false,
    cta: "Go Plus",
    includes: [
      "4 blood panels per year",
      "Priority doctor access",
      "Expanded coaching sessions",
      "Full screening suite (PHQ-9, GAD-7, AUDIT-C)",
      "Priority support",
      "Cancel anytime",
    ],
  },
];

// ---------------------------------------------------------------------------
// CITATIONS / Real validated science
// ---------------------------------------------------------------------------

export const CITATIONS = [
  {
    model: "FINDRISC",
    use: "Type 2 Diabetes risk",
    authors: "Lindstrom and Tuomilehto",
    year: 2003,
    journal: "Diabetes Care",
  },
  {
    model: "SCORE2",
    use: "Cardiovascular risk",
    authors: "SCORE2 Working Group",
    year: 2021,
    journal: "European Heart Journal",
  },
  {
    model: "FRAX",
    use: "Fracture risk",
    authors: "Kanis et al.",
    year: 2008,
    journal: "Osteoporosis International",
  },
  {
    model: "SDPP",
    use: "Swedish diabetes prevention",
    authors: "Carlsson et al.",
    year: 2024,
    journal: "BMC Medicine",
  },
  {
    model: "UKPDS",
    use: "Diabetes outcomes",
    authors: "Turner et al.",
    year: 1998,
    journal: "The Lancet",
  },
  {
    model: "DPP",
    use: "Diabetes Prevention Program",
    authors: "Knowler et al.",
    year: 2002,
    journal: "NEJM",
  },
];
