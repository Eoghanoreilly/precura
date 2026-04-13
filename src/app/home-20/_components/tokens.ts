// home-20 - The Catalogue
// Airbnb-warm aesthetic. Cream canvas, warm terracotta and peach accents,
// clinical sage for trust, editorial ink typography. No pure black.
// Every page section imports from here so the aesthetic stays coherent.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Warm editorial ink
  ink: "#161512",
  inkSoft: "#2C2A25",
  inkMuted: "#555149",
  inkFaint: "#8B867A",

  // Cream canvas
  cream: "#F6F1E8",
  creamWarm: "#F9F3E7",
  creamDeep: "#EDE4D0",
  creamSoft: "#FBF7EE",
  paper: "#FFFFFF",

  // Terracotta - the primary warm accent
  terra: "#D35838",
  terraDeep: "#A83E23",
  terraSoft: "#F2C9B4",
  terraHaze: "#FCE8DB",
  peach: "#F4A27A",

  // Clinical sage - trust
  sage: "#6B8F71",
  sageDeep: "#3F5C46",
  sageSoft: "#CCD9C8",
  sageHaze: "#EAF0E5",

  // Butter yellow - soft secondary
  butter: "#F0D175",
  butterHaze: "#FBEFC5",

  // Signals
  signalGood: "#3F8F4D",
  signalCaution: "#C79025",
  signalRisk: "#C84A2D",

  // Lines
  line: "#D6CDB7",
  lineSoft: "#E6DFCB",
  lineFaint: "#EFE8D5",

  // Shadow
  shadow: "0 1px 2px rgba(22,21,18,0.04), 0 4px 16px rgba(22,21,18,0.06)",
  shadowSoft: "0 2px 6px rgba(22,21,18,0.04)",
  shadowLift: "0 2px 8px rgba(22,21,18,0.08), 0 16px 40px rgba(22,21,18,0.10)",
} as const;

export const TYPE = {
  displayXL: {
    fontSize: "clamp(44px, 6.2vw, 84px)",
    lineHeight: 1.02,
    letterSpacing: "-0.035em",
    fontWeight: 600,
  },
  displayL: {
    fontSize: "clamp(36px, 4.8vw, 64px)",
    lineHeight: 1.04,
    letterSpacing: "-0.03em",
    fontWeight: 600,
  },
  displayM: {
    fontSize: "clamp(28px, 3.2vw, 44px)",
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
    fontWeight: 600,
  },
  h3: {
    fontSize: "clamp(22px, 2.2vw, 28px)",
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
    fontWeight: 600,
  },
  lead: {
    fontSize: "clamp(17px, 1.35vw, 20px)",
    lineHeight: 1.55,
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
  tiny: {
    fontSize: "12px",
    lineHeight: 1.4,
    letterSpacing: "0.01em",
    fontWeight: 500,
  },
  mono: {
    fontFamily: MONO_FONT,
    fontSize: "12px",
    lineHeight: 1.3,
    letterSpacing: "0.05em",
    fontWeight: 500,
  },
};

// Real Unsplash imagery - all warm, natural, editorial
// Each image is picked to match an Airbnb Experiences feel: real people,
// warm light, grounded, no stock-art feeling.
export const IMG = {
  // Hero catalogue cards
  doctor:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&q=85&auto=format&fit=crop",
  labKit:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=85&auto=format&fit=crop",
  coach:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85&auto=format&fit=crop",
  training:
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=85&auto=format&fit=crop",
  aiChat:
    "https://images.unsplash.com/photo-1551808525-051ab96d5ae1?w=1200&q=85&auto=format&fit=crop",
  profile:
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&q=85&auto=format&fit=crop",
  checkin:
    "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=1200&q=85&auto=format&fit=crop",
  priority:
    "https://images.unsplash.com/photo-1631815588090-d4bfec5b1e3f?w=1200&q=85&auto=format&fit=crop",
  // Anna story
  annaPortrait:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=85&auto=format&fit=crop",
  annaKitchen:
    "https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=1400&q=85&auto=format&fit=crop",
  annaWalking:
    "https://images.unsplash.com/photo-1518310383802-640c2de681b3?w=1400&q=85&auto=format&fit=crop",
  // Trust
  drMarcus:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1400&q=85&auto=format&fit=crop",
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1800&q=85&auto=format&fit=crop",
  // Members
  member1:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=85&auto=format&fit=crop",
  member2:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=85&auto=format&fit=crop",
  member3:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200&q=85&auto=format&fit=crop",
  member4:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85&auto=format&fit=crop",
  // Carousel perks (different from hero to avoid repetition)
  cLab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1400&q=85&auto=format&fit=crop",
  cMorning:
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1400&q=85&auto=format&fit=crop",
  cWalk:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=85&auto=format&fit=crop",
  cMeal:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&q=85&auto=format&fit=crop",
  cNotebook:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85&auto=format&fit=crop",
};
