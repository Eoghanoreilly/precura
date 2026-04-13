// Design tokens for home-14 "Magazine Cover".
// A high-end print-inspired palette: cream paper, ink type,
// a single rust accent used only where it matters. No warm amber washes.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Paper: the page itself. Warm off-white, not pastel.
  paper: "#F4EFE6",
  paperDeep: "#EAE2D2",
  paperSoft: "#FAF6EC",
  white: "#FFFFFF",

  // Ink: the type. Not true black; it breathes like printed ink.
  ink: "#14120E",
  inkSoft: "#262320",
  inkMuted: "#5A554C",
  inkFaint: "#8A8476",

  // Rule weights
  rule: "#D8D0BE",
  ruleSoft: "#E6DFCF",

  // One accent. Rust, used like a spot color in print.
  rust: "#B24E1A",
  rustSoft: "#D97A3D",
  rustInk: "#5A250A",

  // A secondary clinical accent. Used only in data contexts.
  sage: "#3F5A46",
  sageSoft: "#7B9481",

  // Shadows tuned for paper feel
  shadowPrint: "0 1px 2px rgba(20,18,14,0.04), 0 16px 40px rgba(20,18,14,0.08)",
  shadowLift: "0 2px 6px rgba(20,18,14,0.06), 0 28px 80px rgba(20,18,14,0.14)",
} as const;

// Typographic scale: editorial. Drop caps, mega headlines,
// big clamp ranges for fluid responsive magazine sizing.
export const TYPE = {
  // Cover headline. Huge.
  cover: {
    fontSize: "clamp(74px, 14vw, 220px)",
    lineHeight: 0.82,
    letterSpacing: "-0.055em",
    fontWeight: 700,
  },
  // Section chapter opening
  chapter: {
    fontSize: "clamp(44px, 7vw, 112px)",
    lineHeight: 0.9,
    letterSpacing: "-0.04em",
    fontWeight: 600,
  },
  // Pullquote sized text
  pull: {
    fontSize: "clamp(28px, 3.6vw, 56px)",
    lineHeight: 1.12,
    letterSpacing: "-0.025em",
    fontWeight: 400,
    fontStyle: "italic" as const,
  },
  // Standard h3 / card title
  title: {
    fontSize: "clamp(22px, 2.4vw, 34px)",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    fontWeight: 600,
  },
  // Deck / subtitle
  deck: {
    fontSize: "clamp(17px, 1.4vw, 21px)",
    lineHeight: 1.55,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  body: {
    fontSize: "16px",
    lineHeight: 1.65,
    letterSpacing: "0",
    fontWeight: 400,
  },
  small: {
    fontSize: "13px",
    lineHeight: 1.5,
    letterSpacing: "0",
    fontWeight: 400,
  },
  // Mono used for issue numbers, captions, footnotes
  mono: {
    fontFamily: MONO_FONT,
    fontSize: "11px",
    lineHeight: 1.4,
    letterSpacing: "0.14em",
    fontWeight: 500,
    textTransform: "uppercase" as const,
  },
  monoLarge: {
    fontFamily: MONO_FONT,
    fontSize: "13px",
    lineHeight: 1.4,
    letterSpacing: "0.12em",
    fontWeight: 500,
    textTransform: "uppercase" as const,
  },
};

// Curated editorial imagery. Fewer, better photos.
// All portraits chosen for a contemplative, pensive feel.
export const IMG = {
  // Cover portrait: pensive, quiet, editorial
  cover:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=2000&q=90&auto=format&fit=crop",
  // Anna story portraits
  anna1:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=88&auto=format&fit=crop",
  anna2:
    "https://images.unsplash.com/photo-1518310383802-640c2de681b3?w=1600&q=88&auto=format&fit=crop",
  anna3:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1600&q=88&auto=format&fit=crop",
  anna4:
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=1600&q=88&auto=format&fit=crop",
  anna5:
    "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=1600&q=88&auto=format&fit=crop",
  // Doctor
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1800&q=90&auto=format&fit=crop",
  // Lab / science
  lab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1800&q=90&auto=format&fit=crop",
  // Carousel editorial imagery
  spread1:
    "https://images.unsplash.com/photo-1551076805-e1869033e561?w=2000&q=90&auto=format&fit=crop",
  spread2:
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=2000&q=90&auto=format&fit=crop",
  spread3:
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=2000&q=90&auto=format&fit=crop",
  spread4:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=2000&q=90&auto=format&fit=crop",
  spread5:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=2000&q=90&auto=format&fit=crop",
  // Member portraits
  member1:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1400&q=90&auto=format&fit=crop",
  member2:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1400&q=90&auto=format&fit=crop",
  member3:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1400&q=90&auto=format&fit=crop",
  member4:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1400&q=90&auto=format&fit=crop",
};
