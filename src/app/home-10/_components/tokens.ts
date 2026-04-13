// Design tokens shared across all home-10 sections.
// Coherence strategy: same palette + same type scale used everywhere,
// so the variety of techniques sits inside a consistent house style.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Editorial ink palette - warm, not pure black
  ink: "#0C0E0B",
  inkSoft: "#1A1D17",
  inkMuted: "#4A4F43",
  inkFaint: "#7A7E71",

  // Cream canvas - warm, Swedish light
  cream: "#F5EFE4",
  creamDeep: "#EBE3D2",
  creamSoft: "#FAF6EC",
  paper: "#FFFFFF",

  // Vital accent - terracotta amber (never pastel)
  amber: "#E06B2D",
  amberDeep: "#B24E16",
  amberSoft: "#F6B896",

  // Clinical sage - trust + science
  sage: "#6B8F71",
  sageDeep: "#3F5C46",
  sageSoft: "#B7C9B9",

  // Data signals (used only inside charts)
  signalGood: "#4E8E5C",
  signalCaution: "#C79025",
  signalRisk: "#C84A2D",

  // Hairlines and strokes
  line: "#D9D2C1",
  lineSoft: "#E9E3D4",

  // Elevation
  shadow: "0 1px 2px rgba(12,14,11,0.04), 0 8px 32px rgba(12,14,11,0.06)",
  shadowLift: "0 2px 8px rgba(12,14,11,0.08), 0 20px 60px rgba(12,14,11,0.12)",
} as const;

// Typography scale (uses unitless line-heights and em letter-spacing so SwiftUI-style rhythm holds on all screens)
export const TYPE = {
  displayMega: {
    fontSize: "clamp(72px, 13vw, 200px)",
    lineHeight: 0.88,
    letterSpacing: "-0.055em",
    fontWeight: 500,
  },
  displayHuge: {
    fontSize: "clamp(56px, 9vw, 140px)",
    lineHeight: 0.9,
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
    fontSize: "clamp(32px, 4.5vw, 56px)",
    lineHeight: 1.05,
    letterSpacing: "-0.025em",
    fontWeight: 500,
  },
  lead: {
    fontSize: "clamp(19px, 1.6vw, 24px)",
    lineHeight: 1.5,
    letterSpacing: "-0.01em",
    fontWeight: 400,
  },
  body: {
    fontSize: "17px",
    lineHeight: 1.55,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  small: {
    fontSize: "14px",
    lineHeight: 1.5,
    letterSpacing: "0",
    fontWeight: 400,
  },
  eyebrow: {
    fontSize: "12px",
    lineHeight: 1.2,
    letterSpacing: "0.18em",
    fontWeight: 500,
    textTransform: "uppercase" as const,
  },
  mono: {
    fontFamily: MONO_FONT,
    fontSize: "12px",
    lineHeight: 1.3,
    letterSpacing: "0.03em",
    fontWeight: 400,
  },
};

// Curated real Unsplash imagery
export const IMG = {
  hero:
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=2400&q=85&auto=format&fit=crop",
  annaPortrait:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=85&auto=format&fit=crop",
  annaWalking:
    "https://images.unsplash.com/photo-1518310383802-640c2de681b3?w=1600&q=85&auto=format&fit=crop",
  annaCoffee:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1600&q=85&auto=format&fit=crop",
  annaWindow:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85&auto=format&fit=crop",
  annaNight:
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=1600&q=85&auto=format&fit=crop",
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1800&q=85&auto=format&fit=crop",
  lab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1800&q=85&auto=format&fit=crop",
  clinic:
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=2000&q=85&auto=format&fit=crop",
  runner:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&q=85&auto=format&fit=crop",
  testimonial1:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1600&q=85&auto=format&fit=crop",
  testimonial2:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1600&q=85&auto=format&fit=crop",
  testimonial3:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1600&q=85&auto=format&fit=crop",
};
