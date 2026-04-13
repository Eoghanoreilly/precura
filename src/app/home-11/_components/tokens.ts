// Design tokens for home-11 "Minimal Ambient".
// Philosophy: Swiss editorial restraint. Cream foundation. One accent colour
// used sparingly. Tight type scale (4 sizes, 2 weights). Generous whitespace.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Cream canvas family. Warm Swedish daylight.
  page: "#FAFAF7",
  paper: "#F7F5EF",
  paperDeep: "#F0EDE3",
  paperWash: "#ECE9DD",

  // Editorial ink - warm near-black, never pure #000.
  ink: "#141614",
  inkSoft: "#2E312C",
  inkMuted: "#6A6C63",
  inkFaint: "#9A9B90",
  inkHairline: "rgba(20, 22, 20, 0.08)",
  inkHairlineStrong: "rgba(20, 22, 20, 0.14)",

  // Single accent. Deep forest sage - trust, science, Swedish landscape.
  // Used sparingly. Never backgrounds.
  sage: "#3F5C46",
  sageDeep: "#2A3F31",
  sageWash: "#E3EAE0",
  sageHairline: "rgba(63, 92, 70, 0.18)",

  // Signal colours - only used inside charts/data surfaces, never decoratively.
  signalGood: "#4E8E5C",
  signalCaution: "#B88428",
  signalRisk: "#B14B2A",

  // Pressed ink on cream (for the dark panel sections that use inverted type)
  inkPanel: "#1A1D19",
} as const;

// Tight type scale. 5 sizes total. No numeric font constants anywhere else.
export const TYPE = {
  display: {
    fontSize: "clamp(54px, 7vw, 96px)",
    lineHeight: 0.94,
    letterSpacing: "-0.035em",
    fontWeight: 400,
  },
  displayLarge: {
    fontSize: "clamp(40px, 5.2vw, 72px)",
    lineHeight: 0.98,
    letterSpacing: "-0.03em",
    fontWeight: 400,
  },
  displayMedium: {
    fontSize: "clamp(30px, 3.6vw, 52px)",
    lineHeight: 1.04,
    letterSpacing: "-0.022em",
    fontWeight: 400,
  },
  title: {
    fontSize: "clamp(22px, 2.4vw, 32px)",
    lineHeight: 1.18,
    letterSpacing: "-0.012em",
    fontWeight: 500,
  },
  lead: {
    fontSize: "clamp(18px, 1.4vw, 21px)",
    lineHeight: 1.55,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  body: {
    fontSize: "16px",
    lineHeight: 1.62,
    letterSpacing: "0",
    fontWeight: 400,
  },
  small: {
    fontSize: "14px",
    lineHeight: 1.5,
    letterSpacing: "0",
    fontWeight: 400,
  },
  mono: {
    fontFamily: MONO_FONT,
    fontSize: "11px",
    lineHeight: 1.3,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    fontWeight: 400,
  },
};

// Motion easing, shared across sections.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Curated Unsplash imagery. Editorial, considered, not stock.
export const IMG = {
  // Nordic landscape for the Problem section backdrop
  nordicMorning:
    "https://images.unsplash.com/photo-1495103033382-fe343886b671?w=1800&q=85&auto=format&fit=crop",
  // Anna's story
  annaPortrait:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=85&auto=format&fit=crop",
  annaWindow:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&q=85&auto=format&fit=crop",
  // Biomarker / lab aesthetic
  lab:
    "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1400&q=85&auto=format&fit=crop",
  // Doctor (Dr. Marcus Johansson)
  doctor:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1400&q=85&auto=format&fit=crop",
  // Coach / training aesthetic
  coach:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1400&q=85&auto=format&fit=crop",
  // Member portraits for the stories section
  memberLotta:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=85&auto=format&fit=crop",
  memberErik:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=85&auto=format&fit=crop",
  memberAnja:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200&q=85&auto=format&fit=crop",
  memberPer:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=85&auto=format&fit=crop",
  // Stockholm / Swedish context
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1800&q=85&auto=format&fit=crop",
};
