/**
 * home-13 design tokens.
 *
 * House style: warm editorial, Swedish light, calm first frame.
 * Palette is derived from home-6 amber terrain but calmed down:
 * amber is desaturated, with more cream and sage balance.
 */

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

// Soft cubic bezier used everywhere. One curve for the whole page.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const C = {
  // Deep warm ink
  ink: "#14120E",
  inkSoft: "#2A2720",
  inkMid: "#4A463D",
  inkMuted: "#78736A",
  inkFaint: "#ACA79C",

  // Cream / paper - warmer than most sites
  cream: "#F5EFE2",
  creamDeep: "#ECE4D2",
  creamSoft: "#FBF7EC",
  paper: "#FFFFFF",

  // Calmed terracotta. Still warm but less saturated than home-6.
  amber: "#B76B3B",
  amberDeep: "#8A4A22",
  amberSoft: "#E4B896",
  amberWash: "#F1DFC7",

  // Calm sage - for trust and science signals
  sage: "#5F7F66",
  sageDeep: "#3E5945",
  sageSoft: "#C1D0BF",
  sageWash: "#E4ECE4",

  // Dark scene used behind the 3D reveal (deep, almost black, warm)
  night: "#0E0A07",
  nightSoft: "#1A140E",

  // Hairlines
  line: "#DED7C7",
  lineSoft: "#EBE5D4",
  lineStrong: "#C3BBA8",

  // Chart signals (only inside charts)
  signalGood: "#4E8E5C",
  signalCaution: "#C79025",
  signalRisk: "#B84A2A",

  // Shadows
  shadowSm: "0 1px 2px rgba(20, 18, 14, 0.04), 0 4px 16px rgba(20, 18, 14, 0.05)",
  shadowMd: "0 2px 6px rgba(20, 18, 14, 0.06), 0 12px 40px rgba(20, 18, 14, 0.08)",
  shadowLg: "0 4px 12px rgba(20, 18, 14, 0.08), 0 24px 80px rgba(20, 18, 14, 0.14)",
} as const;

// Typography scale. Display uses very tight letter-spacing.
export const TYPE = {
  displayMega: {
    fontSize: "clamp(64px, 12vw, 180px)",
    lineHeight: 0.9,
    letterSpacing: "-0.055em",
    fontWeight: 500,
  },
  displayHuge: {
    fontSize: "clamp(52px, 9vw, 136px)",
    lineHeight: 0.92,
    letterSpacing: "-0.045em",
    fontWeight: 500,
  },
  displayLarge: {
    fontSize: "clamp(40px, 6vw, 88px)",
    lineHeight: 0.96,
    letterSpacing: "-0.035em",
    fontWeight: 500,
  },
  displayMedium: {
    fontSize: "clamp(30px, 4vw, 52px)",
    lineHeight: 1.04,
    letterSpacing: "-0.025em",
    fontWeight: 500,
  },
  displaySmall: {
    fontSize: "clamp(22px, 2.4vw, 34px)",
    lineHeight: 1.15,
    letterSpacing: "-0.018em",
    fontWeight: 500,
  },
  lead: {
    fontSize: "clamp(18px, 1.5vw, 22px)",
    lineHeight: 1.5,
    letterSpacing: "-0.01em",
    fontWeight: 400,
  },
  body: {
    fontSize: "16px",
    lineHeight: 1.6,
    letterSpacing: "-0.003em",
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
    lineHeight: 1.35,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  },
};

// Real Unsplash imagery for the page
export const IMG = {
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1800&q=85&auto=format&fit=crop",
  doctor2:
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=1800&q=85&auto=format&fit=crop",
  lab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1800&q=85&auto=format&fit=crop",
  clinic:
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=2000&q=85&auto=format&fit=crop",
  runner:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1800&q=85&auto=format&fit=crop",
  strength:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=85&auto=format&fit=crop",
  coach:
    "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1800&q=85&auto=format&fit=crop",
  bloodTest:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1800&q=85&auto=format&fit=crop",
  anna:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=85&auto=format&fit=crop",
  annaKitchen:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1600&q=85&auto=format&fit=crop",
  memberA:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1600&q=85&auto=format&fit=crop",
  memberB:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1600&q=85&auto=format&fit=crop",
  memberC:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1600&q=85&auto=format&fit=crop",
  memberD:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=85&auto=format&fit=crop",
  memberE:
    "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1600&q=85&auto=format&fit=crop",
  study:
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1800&q=85&auto=format&fit=crop",
  microscope:
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1800&q=85&auto=format&fit=crop",
};
