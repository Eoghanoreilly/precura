/**
 * home-12 tokens. Split Classical theme - premium enterprise SaaS
 * meets premium health. Grown-up, confident, grid-disciplined.
 *
 * Palette is cooler and more refined than home-6: deep graphite,
 * soft sage, muted slate blue, a single warm accent for emphasis.
 *
 * All values inline. No CSS variables. No Tailwind utilities.
 */

export const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Backgrounds
  paper: "#FAFAF7", // warm off-white page bg
  paperElev: "#FFFFFF", // pure card surface
  paperSoft: "#F3F2EC", // secondary surface
  graphite: "#0D1014", // deepest ink, also used for inverted bands
  graphiteSoft: "#1A1E24",
  slate: "#242A32",

  // Text
  ink: "#0D1014",
  inkStrong: "#0D1014",
  inkMid: "#3A4049",
  inkSoft: "#5A626D",
  inkMuted: "#8C929B",
  inkFaint: "#B5B8BE",

  // Lines
  line: "rgba(13, 16, 20, 0.10)",
  lineSoft: "rgba(13, 16, 20, 0.06)",
  lineStrong: "rgba(13, 16, 20, 0.16)",
  lineDark: "rgba(250, 250, 247, 0.10)",
  lineDarkSoft: "rgba(250, 250, 247, 0.05)",

  // The one warm accent
  accent: "#C97A3D", // muted terracotta
  accentDeep: "#8A4618",
  accentSoft: "#F2E5D4",
  accentTint: "rgba(201, 122, 61, 0.10)",

  // Cool companions (sage + slate blue) - used for data, never backgrounds
  sage: "#6E8A79",
  sageDeep: "#3F5A49",
  sageSoft: "#E5EDE7",
  slateBlue: "#5F7689",
  slateBlueDeep: "#374A5A",
  slateBlueSoft: "#E2E8EE",

  // Status colors for data vis (low key, not traffic light)
  signalGood: "#5E8A68",
  signalCaution: "#C97A3D",
  signalRisk: "#A84532",

  // Shadows
  shadowXs: "0 1px 2px rgba(13, 16, 20, 0.04)",
  shadowSm: "0 1px 2px rgba(13, 16, 20, 0.04), 0 4px 12px rgba(13, 16, 20, 0.04)",
  shadowMd:
    "0 2px 4px rgba(13, 16, 20, 0.04), 0 12px 32px rgba(13, 16, 20, 0.06)",
  shadowLg:
    "0 4px 8px rgba(13, 16, 20, 0.04), 0 32px 60px rgba(13, 16, 20, 0.10)",
} as const;

// Easings
export const EASE = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

// Typography presets. Sizes kept fluid with clamp for responsive behavior.
// Weights are deliberate, letter-spacing tuned per size.
export const TYPE = {
  eyebrow: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  },
  eyebrowBig: {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  },
  display: {
    fontFamily: FONT,
    fontSize: "clamp(48px, 6.4vw, 92px)",
    lineHeight: 0.96,
    letterSpacing: "-0.035em",
    fontWeight: 500,
  },
  displaySmall: {
    fontFamily: FONT,
    fontSize: "clamp(36px, 4.2vw, 64px)",
    lineHeight: 0.98,
    letterSpacing: "-0.03em",
    fontWeight: 500,
  },
  h2: {
    fontFamily: FONT,
    fontSize: "clamp(32px, 3.4vw, 52px)",
    lineHeight: 1.02,
    letterSpacing: "-0.025em",
    fontWeight: 500,
  },
  h3: {
    fontFamily: FONT,
    fontSize: "clamp(22px, 1.6vw, 28px)",
    lineHeight: 1.15,
    letterSpacing: "-0.015em",
    fontWeight: 500,
  },
  lead: {
    fontFamily: FONT,
    fontSize: 19,
    lineHeight: 1.55,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  body: {
    fontFamily: FONT,
    fontSize: 16,
    lineHeight: 1.62,
    letterSpacing: 0,
    fontWeight: 400,
  },
  small: {
    fontFamily: FONT,
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
  },
  caption: {
    fontFamily: FONT,
    fontSize: 13,
    lineHeight: 1.45,
    fontWeight: 400,
  },
} as const;

// Page-level layout
export const GRID = {
  pageMaxWidth: 1360,
  pagePaddingX: 40,
  pagePaddingXMobile: 24,
  columnGap: 32,
  sectionSpacing: 160,
  sectionSpacingMobile: 96,
};

// Real Unsplash images used across the page.
export const IMG = {
  doctor:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80&fit=crop",
  coach:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&fit=crop",
  member1:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1100&q=80&fit=crop",
  member2:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1100&q=80&fit=crop",
  member3:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1100&q=80&fit=crop",
  member4:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1100&q=80&fit=crop",
  bloodLab:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80&fit=crop",
  trainingStudio:
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80&fit=crop",
  clinician:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&q=80&fit=crop",
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=80&fit=crop",
};
