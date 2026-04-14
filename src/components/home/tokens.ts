// Design tokens for home-17 (Welcome Kit approach)
// Airbnb-warm palette: cream canvas, terracotta accent, sage trust, deep ink text.

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

export const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export const C = {
  // Warm canvas - Airbnb cream, not bleached white
  canvas: "#FBF7F0",
  canvasDeep: "#F4EEE2",
  canvasSoft: "#FDFBF6",
  paper: "#FFFFFF",

  // Editorial ink - warm black, never pure #000
  ink: "#1C1A17",
  inkSoft: "#2E2B26",
  inkMuted: "#615C52",
  inkFaint: "#8B8579",

  // Primary accent - warm terracotta (Airbnb energy, more brown than red)
  terracotta: "#C9573A",
  terracottaDeep: "#9C3F25",
  terracottaSoft: "#EFB59B",
  terracottaTint: "#FCEFE7",

  // Trust sage - for medical/doctor
  sage: "#728C76",
  sageDeep: "#445A4A",
  sageSoft: "#CBDACC",
  sageTint: "#ECF1EC",

  // Butter yellow - for highlights and kit card
  butter: "#E9B547",
  butterSoft: "#F6DDA0",
  butterTint: "#FDF4DD",

  // Stone - for supporting surfaces
  stone: "#E5DFD2",
  stoneSoft: "#EFEADD",
  stoneDeep: "#D0C9B8",

  // Data signals
  good: "#4E8E5C",
  caution: "#D08417",
  risk: "#C4472A",

  // Hairlines
  line: "#E5DFD0",
  lineSoft: "#EEE9DB",
  lineCard: "#E0D9C8",

  // Shadows - warm, subtle, Airbnb-grade
  shadowCard: "0 1px 2px rgba(28,26,23,0.04), 0 12px 28px rgba(28,26,23,0.08)",
  shadowLift: "0 2px 4px rgba(28,26,23,0.06), 0 24px 64px rgba(28,26,23,0.14)",
  shadowSoft: "0 1px 2px rgba(28,26,23,0.03), 0 4px 12px rgba(28,26,23,0.05)",
} as const;

// Curated Unsplash imagery (real, not stock clich)
export const IMG = {
  // Hero kit contents - flat lay feel
  annaPortrait:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1400&q=85&auto=format&fit=crop",
  anna2:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=85&auto=format&fit=crop",
  doctor:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600&q=85&auto=format&fit=crop",
  lab:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=85&auto=format&fit=crop",
  runner:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=85&auto=format&fit=crop",
  kitchen:
    "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=1400&q=85&auto=format&fit=crop",
  coach:
    "https://images.unsplash.com/photo-1594824475504-1f8cb1ecdd3d?w=1400&q=85&auto=format&fit=crop",
  bloodkit:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=85&auto=format&fit=crop",
  note:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1400&q=85&auto=format&fit=crop",
  testimonial1:
    "https://images.unsplash.com/photo-1542596594-649edbc13630?w=1200&q=85&auto=format&fit=crop",
  testimonial2:
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=85&auto=format&fit=crop",
  testimonial3:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85&auto=format&fit=crop",
  testimonial4:
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1200&q=85&auto=format&fit=crop",
  hands:
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1600&q=85&auto=format&fit=crop",
};
