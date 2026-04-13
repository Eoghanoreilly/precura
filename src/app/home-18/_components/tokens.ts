// =============================================================================
// HOME 18 - PRECURA CALM CLARITY
// Warm paper canvas, deep ink, lingon accent, eucalyptus trust
// =============================================================================
//
// Palette strategy: a distinctly Swedish, calm-clarity identity for a worried
// adult reading at 11pm. Paper-white canvas with warm cream inflections.
// Lingon (Swedish lingonberry red #B8322C) is the signal colour: grounded,
// culturally rooted, nothing like a booking accent. Eucalyptus green for
// trust and "good" signals. Restrained amber for highlights. Ink is a soft
// charcoal #1F1D1A so long paragraphs read calmly rather than clinically.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Core surfaces
  paper: "#FFFFFF",
  cream: "#FFFBF5",
  creamDeep: "#FBF4E8",
  creamShadow: "#F5ECDB",
  canvas: "#FAF7F2",

  // Ink - soft charcoal for calm long-form reading
  ink: "#1F1D1A",
  inkSoft: "#484848",
  inkMuted: "#6A6A6A",
  inkFaint: "#9B9B9B",
  inkHair: "#DDDDDD",
  inkLine: "#EBEBEB",

  // Lingon - Swedish lingonberry red, Precura's primary signal colour
  lingon: "#B8322C",
  lingonDeep: "#8E2320",
  lingonSoft: "#EBC0BD",
  lingonBg: "#FBEEEC",

  // Eucalyptus - trust, health, "good" signals
  euc: "#3E6B54",
  eucSoft: "#7BA38B",
  eucBg: "#E8F0EB",
  eucLight: "#F2F7F3",

  // Warm amber for highlights / price chips / "most popular"
  amber: "#E8A03D",
  amberDeep: "#C47B15",
  amberBg: "#FDF4E3",

  // Data signals (chart colours)
  good: "#3E8E5C",
  caution: "#D97706",
  risk: "#DC2626",

  // Shadows - soft paper-card lift
  shadow: "0 6px 20px rgba(0,0,0,0.06)",
  shadowLift: "0 12px 40px rgba(0,0,0,0.10)",
  shadowCard: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
  shadowBook:
    "0 8px 28px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.04)",
} as const;

// Typography scale - tight, clean hierarchy tuned for calm reading
export const TYPE = {
  displayHuge: {
    fontSize: "clamp(48px, 6.5vw, 84px)",
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    fontWeight: 600,
  },
  displayLarge: {
    fontSize: "clamp(38px, 4.8vw, 62px)",
    lineHeight: 1.05,
    letterSpacing: "-0.025em",
    fontWeight: 600,
  },
  displayMedium: {
    fontSize: "clamp(28px, 3.4vw, 42px)",
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    fontWeight: 600,
  },
  title: {
    fontSize: "clamp(22px, 2.4vw, 28px)",
    lineHeight: 1.22,
    letterSpacing: "-0.015em",
    fontWeight: 600,
  },
  lead: {
    fontSize: "clamp(17px, 1.4vw, 20px)",
    lineHeight: 1.52,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  body: {
    fontSize: "16px",
    lineHeight: 1.55,
    letterSpacing: "0",
    fontWeight: 400,
  },
  small: {
    fontSize: "14px",
    lineHeight: 1.5,
    letterSpacing: "0",
    fontWeight: 400,
  },
  micro: {
    fontSize: "12px",
    lineHeight: 1.4,
    letterSpacing: "0",
    fontWeight: 500,
  },
  eyebrow: {
    fontSize: "12px",
    lineHeight: 1.2,
    letterSpacing: "0.1em",
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },
  label: {
    fontSize: "11px",
    lineHeight: 1.3,
    letterSpacing: "0.06em",
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },
};

// Real Unsplash imagery - vetted URLs, warm and human
export const IMG = {
  // Warm Swedish apartment / morning light
  heroKitchen:
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&q=85&auto=format&fit=crop",
  // Anna portraits
  annaMorning:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=85&auto=format&fit=crop",
  annaCoffee:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1400&q=85&auto=format&fit=crop",
  annaWalking:
    "https://images.unsplash.com/photo-1518310383802-640c2de681b3?w=1400&q=85&auto=format&fit=crop",
  // Clinic / lab
  clinic:
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1600&q=85&auto=format&fit=crop",
  lab: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=85&auto=format&fit=crop",
  bloodDraw:
    "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=1600&q=85&auto=format&fit=crop",
  // Doctor
  doctor:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600&q=85&auto=format&fit=crop",
  // Members (stories)
  memberLotta:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1400&q=85&auto=format&fit=crop",
  memberErik:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1400&q=85&auto=format&fit=crop",
  memberAnja:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1400&q=85&auto=format&fit=crop",
  memberJohan:
    "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=1400&q=85&auto=format&fit=crop",
  // Atmospherics
  stockholmStreet:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1600&q=85&auto=format&fit=crop",
  runner:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=85&auto=format&fit=crop",
  kitchen:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85&auto=format&fit=crop",
  training:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85&auto=format&fit=crop",
};

// Swedish clinic cities with addresses
export const CLINICS = [
  {
    city: "Stockholm",
    address: "Sveavagen 42",
    distance: "0.8 km from you",
    nextSlot: "Tomorrow, 08:15",
  },
  {
    city: "Goteborg",
    address: "Kungsportsavenyen 22",
    distance: "1.2 km",
    nextSlot: "Tomorrow, 07:30",
  },
  {
    city: "Malmo",
    address: "Stortorget 18",
    distance: "0.5 km",
    nextSlot: "Tomorrow, 08:00",
  },
  {
    city: "Uppsala",
    address: "Kungsgatan 33",
    distance: "1.1 km",
    nextSlot: "Tomorrow, 09:00",
  },
  {
    city: "Lund",
    address: "Stora Sodergatan 15",
    distance: "0.7 km",
    nextSlot: "Tomorrow, 08:30",
  },
  {
    city: "Linkoping",
    address: "Storgatan 12",
    distance: "2.3 km",
    nextSlot: "Wednesday, 08:15",
  },
  {
    city: "Orebro",
    address: "Drottninggatan 7",
    distance: "1.8 km",
    nextSlot: "Wednesday, 08:30",
  },
  {
    city: "Vasteras",
    address: "Stora Gatan 21",
    distance: "1.4 km",
    nextSlot: "Wednesday, 09:00",
  },
];

// Pricing tiers - single source of truth
export const TIERS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "One panel a year",
    priceAnnual: 995,
    priceMonthly: 99,
    perks: [
      "1 comprehensive blood panel",
      "24 biomarkers, plain-English results",
      "AI chat with your data",
      "FINDRISC diabetes screening",
      "Secure 1177 import",
    ],
    panels: 1,
    doctor: false,
    coach: false,
  },
  {
    id: "member",
    name: "Member",
    tagline: "Most people start here",
    priceAnnual: 2995,
    priceMonthly: 299,
    perks: [
      "2 blood panels a year",
      "40+ biomarkers, tracked over time",
      "Dr. Marcus Johansson reviews every result",
      "Assigned coach + training plan",
      "Full AI chat + living profile",
      "All three risk models (FINDRISC, SCORE2, FRAX)",
    ],
    panels: 2,
    doctor: true,
    coach: true,
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Quarterly + priority",
    priceAnnual: 4995,
    priceMonthly: 499,
    perks: [
      "4 blood panels a year (quarterly)",
      "Priority doctor messaging",
      "Two full video consultations",
      "Advanced biomarkers (ApoB, hs-CRP, Omega-3)",
      "Partner add-on at 50% off",
      "Exercise prescription from Dr. Marcus",
    ],
    panels: 4,
    doctor: true,
    coach: true,
  },
];
