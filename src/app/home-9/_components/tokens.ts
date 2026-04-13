/**
 * Inline design tokens for home-9. No CSS vars allowed.
 *
 * Palette: warm editorial. Deep forest green + cream + muted terracotta.
 * Typography: Apple system stack exclusively. Sizes are CSS clamp() so the
 * page breathes on large screens without blowing up on mobile.
 */

export const C = {
  // Backgrounds
  cream: "#f4efe6",
  sand: "#e8e0d1",
  paper: "#faf7f0",
  ink: "#141514",
  inkSoft: "#2a2b29",
  forest: "#1b2a24",
  forestDeep: "#0f1a16",
  moss: "#3a4f3f",
  // Accents
  terracotta: "#c85d3f",
  terracottaSoft: "#e68a6d",
  brass: "#b48a3d",
  // Data / status
  green: "#4a7c59",
  amber: "#c98e3a",
  red: "#b14840",
  // Borders / dividers
  rule: "rgba(20, 21, 20, 0.12)",
  ruleDark: "rgba(244, 239, 230, 0.16)",
  // Text on cream
  textPrimary: "#141514",
  textSecondary: "#4a4a46",
  textMuted: "#7c7a72",
  // Text on forest
  textLight: "#f4efe6",
  textLightSoft: "rgba(244, 239, 230, 0.7)",
} as const;

export const FONT = {
  ui: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  mono: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
} as const;

export const SIZE = {
  displayXL: "clamp(48px, 9vw, 160px)",
  display: "clamp(40px, 7vw, 120px)",
  h1: "clamp(36px, 5.2vw, 82px)",
  h2: "clamp(28px, 3.8vw, 56px)",
  h3: "clamp(20px, 2.2vw, 32px)",
  lead: "clamp(17px, 1.6vw, 22px)",
  body: "clamp(15px, 1.1vw, 17px)",
  small: "clamp(13px, 0.95vw, 14px)",
  eyebrow: "clamp(11px, 0.8vw, 12px)",
} as const;

/**
 * Unsplash photo IDs vetted for atmosphere + editorial quality.
 * All are used with explicit format params so the browser picks reasonable
 * dimensions and aspect ratios.
 */
export const IMG = {
  // Full bleed Nordic mood
  heroForest:
    "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=2400&q=80",
  // Stockholm winter morning
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=2000&q=80",
  // Birch forest
  birch:
    "https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=2000&q=80",
  // Lab glassware macro
  lab:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2000&q=80",
  // Clinical hand / vial
  vial:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=2000&q=80",
  // Doctor / researcher
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=2000&q=80",
  // Woman thoughtful, portrait-ish
  anna:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1800&q=80",
  // Woman at home, cozy scene
  annaHome:
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80",
  // Scientific papers / reading
  papers:
    "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=2000&q=80",
  // Person on phone, moody
  phone:
    "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=2000&q=80",
  // Blood draw / clinic
  clinic:
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=2000&q=80",
  // Running / outdoors fitness
  training:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2000&q=80",
  // Window / home morning
  window:
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=2000&q=80",
  // Aurora / Swedish north
  aurora:
    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2400&q=80",
  // Moody sea / archipelago
  archipelago:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80",
};
