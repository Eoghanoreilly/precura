// Design tokens for home-19 (The Guided Tour / Airbnb-warm edition)
// Single source of truth for palette, type, and imagery. Keeps every
// section visually coherent even when we mix interactive techniques.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

// Airbnb-warm palette. Cream canvas, deep ink text, one hero coral,
// a sage for trust, and warm amber for moments of surprise.
export const C = {
  // Ink
  ink: "#1A1A1A",
  inkSoft: "#2B2B2B",
  inkMuted: "#585858",
  inkFaint: "#8A8A8A",
  inkHairline: "#C9C2B4",

  // Cream / paper
  cream: "#FAF6EC",
  creamDeep: "#F1EADB",
  creamSoft: "#FDFAF2",
  paper: "#FFFFFF",

  // Primary accent - Precura coral (Airbnb-family warmth, not pink)
  coral: "#E25A4C",
  coralDeep: "#BF3F31",
  coralSoft: "#FCE2DD",

  // Sage for trust
  sage: "#5F7F63",
  sageDeep: "#3F5C43",
  sageSoft: "#D5E2D5",

  // Warm amber for small highlights
  amber: "#C9811E",
  amberSoft: "#F6E1B2",

  // Signals (used inside charts / status pills only)
  signalGood: "#3F8A4F",
  signalCaution: "#C47E1A",
  signalRisk: "#C64A34",

  // Lines
  line: "#E5DFCD",
  lineSoft: "#EEE8D7",

  // Shadows - soft Airbnb style
  shadow: "0 1px 2px rgba(26,26,26,0.04), 0 6px 22px rgba(26,26,26,0.06)",
  shadowLift:
    "0 2px 6px rgba(26,26,26,0.06), 0 18px 48px rgba(26,26,26,0.14)",
} as const;

// Typography scale. Airbnb-ish: not oversized displays, comfortable body,
// tight letterspacing on headings.
export const TYPE = {
  displayXL: {
    fontSize: "clamp(44px, 5.4vw, 76px)",
    lineHeight: 1.02,
    letterSpacing: "-0.028em",
    fontWeight: 600,
  },
  displayL: {
    fontSize: "clamp(36px, 4.4vw, 56px)",
    lineHeight: 1.06,
    letterSpacing: "-0.022em",
    fontWeight: 600,
  },
  displayM: {
    fontSize: "clamp(28px, 3.2vw, 40px)",
    lineHeight: 1.1,
    letterSpacing: "-0.018em",
    fontWeight: 600,
  },
  headline: {
    fontSize: "clamp(22px, 2vw, 26px)",
    lineHeight: 1.2,
    letterSpacing: "-0.012em",
    fontWeight: 600,
  },
  lead: {
    fontSize: "clamp(17px, 1.3vw, 19px)",
    lineHeight: 1.55,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  body: {
    fontSize: "16px",
    lineHeight: 1.55,
    letterSpacing: "-0.003em",
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
  label: {
    fontSize: "13px",
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },
};

// Imagery (real Unsplash, same style family across page)
export const IMG = {
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=85&auto=format&fit=crop",
  coach:
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1600&q=85&auto=format&fit=crop",
  anna:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=85&auto=format&fit=crop",
  annaCoffee:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1600&q=85&auto=format&fit=crop",
  annaWalking:
    "https://images.unsplash.com/photo-1518310383802-640c2de681b3?w=1600&q=85&auto=format&fit=crop",
  lab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=85&auto=format&fit=crop",
  kit:
    "https://images.unsplash.com/photo-1603555401066-458bdf609e41?w=1600&q=85&auto=format&fit=crop",
  member1:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=85&auto=format&fit=crop",
  member2:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=85&auto=format&fit=crop",
  member3:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200&q=85&auto=format&fit=crop",
  member4:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85&auto=format&fit=crop",
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=2000&q=85&auto=format&fit=crop",
};
