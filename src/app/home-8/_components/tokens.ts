/**
 * Design tokens for home-8 - cinematic Precura landing page.
 * Inline colors (not CSS variables). Apple system font stack.
 * Warm, premium, 2026 award-winning palette.
 */

export const colors = {
  // Base surfaces - warm cream and ivory
  ivory: "#F7F3EC",
  cream: "#F1EBDF",
  parchment: "#EDE5D2",
  white: "#FFFFFF",

  // Ink - text colors
  ink: "#0B0B0C",
  inkSoft: "#1E1D21",
  inkMid: "#4A464F",
  inkMuted: "#7A7481",
  inkFaint: "#B0A99E",
  inkLine: "#DED6C4",

  // Signature accents
  amber: "#E08E42", // primary brand accent, warm sienna
  amberDeep: "#C37329",
  amberSoft: "#F4CCA4",
  plum: "#4B2A3D", // deep secondary
  plumSoft: "#7D5467",
  forest: "#2F4A3A", // positive green
  forestSoft: "#7BAA8F",
  rust: "#8F3A1D", // warning
  bone: "#EADFC7", // card warm
  sand: "#D4C7A8", // chart fills

  // Chart zones
  zoneGood: "#7BAA8F",
  zoneBorderline: "#E0B46A",
  zoneBad: "#C87858",
} as const;

export const fontStack = {
  display:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  mono: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
} as const;

export const easing = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: [0.2, 0.8, 0.2, 1] as const,
} as const;
