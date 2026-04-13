"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  LineChart,
  Quote,
  Film,
  Sparkles,
  Stethoscope,
  Box,
  Clapperboard,
  ArrowLeftRight,
  Layers,
  Palette,
  Wind,
  LayoutGrid,
  Sunrise,
  BookOpen,
  FlaskConical,
} from "lucide-react";

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO = '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

type Design = {
  n: number;
  round: 1 | 2 | 3;
  route: string;
  title: string;
  constraint: string;
  description: string;
  vibe: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  accent: string;
  tint: string;
};

const DESIGNS: Design[] = [
  // Round 3 - 3D refinements on home-6
  {
    n: 11,
    round: 3,
    route: "/home-11",
    title: "Minimal Ambient",
    constraint: "Quiet hero, 3D as background weather",
    description:
      "3D terrain lives ambient in the background at low intensity. Cream negative space dominates. Feels like a premium Swiss watch brand.",
    vibe: "Rauno / Patek / Kinfolk restraint",
    icon: Wind,
    accent: "#4A5A4E",
    tint: "#EEF0EA",
  },
  {
    n: 12,
    round: 3,
    route: "/home-12",
    title: "Split Classical",
    constraint: "Left text grid / right contained 3D panel",
    description:
      "Organized 12-column grid. Left: text hierarchy + CTAs. Right: the 3D terrain in a contained frame. Linear / Vercel / Stripe discipline.",
    vibe: "Linear / Vercel / Stripe",
    icon: LayoutGrid,
    accent: "#2B3340",
    tint: "#E9EDF3",
  },
  {
    n: 13,
    round: 3,
    route: "/home-13",
    title: "Reveal Hero",
    constraint: "First viewport text-only, 3D reveals on scroll",
    description:
      "Opens with just a massive headline. No 3D. As you scroll, the terrain mounts and animates in dramatically. Deferred complexity.",
    vibe: "Apple product pages / Stripe Sessions",
    icon: Sunrise,
    accent: "#8A4A1B",
    tint: "#FBEEDE",
  },
  {
    n: 14,
    round: 3,
    route: "/home-14",
    title: "Magazine Cover",
    constraint: "Editorial type + photo, 3D as accent",
    description:
      "Feels like a Kinfolk cover. Big typographic statement + one portrait. 3D is a small precious widget, not the star.",
    vibe: "Kinfolk / The Gentlewoman / Monocle",
    icon: BookOpen,
    accent: "#1E1E1E",
    tint: "#F1EEE6",
  },
  {
    n: 15,
    round: 3,
    route: "/home-15",
    title: "Research Forward",
    constraint: "Lead with peer-reviewed science",
    description:
      "Hero leads with cited clinical models and research. 3D is contained like a scientific instrument readout. Scientific research carousel as the main interactive section.",
    vibe: "Nature.com / Function Health / Zoe",
    icon: FlaskConical,
    accent: "#0E3A56",
    tint: "#E3EEF7",
  },

  // Round 2 - cinematic with substance
  {
    n: 6,
    round: 2,
    route: "/home-6",
    title: "Three Dimensional",
    constraint: "WebGL 3D hero + cinematic sections",
    description:
      "A real Three.js scene is the hero. Interactive, full-bleed, mouse-reactive. Ten full sections follow with scroll-triggered motion.",
    vibe: "Humane / Apple Vision Pro / Lusion",
    icon: Box,
    accent: "#5B2BC9",
    tint: "#EEE8FC",
  },
  {
    n: 7,
    round: 2,
    route: "/home-7",
    title: "Theater Mode",
    constraint: "Scroll-pinned stages with substance",
    description:
      "Ten scroll-pinned chapters. Each one pins, plays its internal choreography, and releases. Home-3's technique done with full content.",
    vibe: "Apple AirPods Pro / Linear Method / Cursor",
    icon: Clapperboard,
    accent: "#0E0E14",
    tint: "#E8E8ED",
  },
  {
    n: 8,
    round: 2,
    route: "/home-8",
    title: "Sideways",
    constraint: "Horizontal + vertical hybrid",
    description:
      "Vertical scrolling for hero, problem, trust, pricing. Three middle sections (Anna / How it works / What you get) slide HORIZONTALLY as the user scrolls.",
    vibe: "Apple iPhone pages / Stripe Sessions / Framer",
    icon: ArrowLeftRight,
    accent: "#B33A1E",
    tint: "#FCEBE5",
  },
  {
    n: 9,
    round: 2,
    route: "/home-9",
    title: "Snow Fall 2026",
    constraint: "Multi-layer parallax editorial",
    description:
      "Every section has 2-3 depth layers scrolling at different speeds. Rich photography, text revealing over imagery. Immersive editorial feel.",
    vibe: "NYT Snow Fall / Pudding / rauno.me",
    icon: Layers,
    accent: "#204B3B",
    tint: "#E5EFE9",
  },
  {
    n: 10,
    round: 2,
    route: "/home-10",
    title: "Mixed Media",
    constraint: "Variety as the design language",
    description:
      "Every section uses a different technique. 3D / SVG / parallax / carousel / lottie / hover-reactive. Feels like a Framer showcase.",
    vibe: "Framer showcase / Active Theory / Awwwards",
    icon: Palette,
    accent: "#B8590E",
    tint: "#FCEFDB",
  },

  // Round 1
  {
    n: 1,
    round: 1,
    route: "/home-1",
    title: "The Data Story",
    constraint: "Scroll-scrubbed data visualization",
    description:
      "The hero is Anna's real 5-year glucose story as a live, scroll-scrubbed chart. The data is the argument.",
    vibe: "Stripe numbers / NYT interactives / Pudding",
    icon: LineChart,
    accent: "#0B6BCB",
    tint: "#E8F2FE",
  },
  {
    n: 2,
    round: 1,
    route: "/home-2",
    title: "The Editorial",
    constraint: "Typography-led longform",
    description:
      "Massive display type, generous whitespace, literary pacing. Reads like an essay in The Atlantic or Stripe Press.",
    vibe: "Stripe Press / rauno.me / Craft Docs",
    icon: Quote,
    accent: "#1A1A1A",
    tint: "#F3F1EC",
  },
  {
    n: 3,
    round: 1,
    route: "/home-3",
    title: "The Cinematic",
    constraint: "Scroll-pinned, full-bleed stages",
    description:
      "Full-viewport stages that pin and scrub as you scroll. Motion carries the narrative, text gets out of the way.",
    vibe: "Apple AirPods Pro / Linear / Arc",
    icon: Film,
    accent: "#111111",
    tint: "#ECECEF",
  },
  {
    n: 4,
    round: 1,
    route: "/home-4",
    title: "The Quiz",
    constraint: "Interactive-first personalization",
    description:
      "Hero is a question, not a headline. Answer 3-4 prompts and the page builds a preview around you.",
    vibe: "Noom / Function Health / Typeform",
    icon: Sparkles,
    accent: "#0E7B4C",
    tint: "#E8F5EC",
  },
  {
    n: 5,
    round: 1,
    route: "/home-5",
    title: "Clinical Trust",
    constraint: "Portrait photography + named science",
    description:
      "Real faces, named risk models (FINDRISC, SCORE2, FRAX), cited studies. Feels like a premium Swedish clinic.",
    vibe: "Function Health / Parsley / Oura",
    icon: Stethoscope,
    accent: "#2A4F3A",
    tint: "#EDF3EF",
  },
];

function DesignCard({ d, index }: { d: Design; index: number }) {
  const Icon = d.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={d.route} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "#FFFFFF",
            borderRadius: 22,
            padding: 26,
            border: "1px solid #EEEAE1",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 8px 28px rgba(20,20,15,0.04)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {d.round === 3 && (
            <div
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                padding: "4px 10px",
                borderRadius: 999,
                background: "#111",
                color: "#FFF",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: MONO,
              }}
            >
              New
            </div>
          )}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: d.tint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={22} strokeWidth={1.8} color={d.accent} />
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9A9A9A",
                fontFamily: MONO,
                marginBottom: 10,
              }}
            >
              Home {d.n} / {d.constraint}
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginBottom: 10,
                lineHeight: 1.15,
              }}
            >
              {d.title}
            </h2>
            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.55,
                color: "#4A4A4A",
                margin: 0,
              }}
            >
              {d.description}
            </p>
          </div>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontFamily: MONO,
                color: "#9A9A9A",
              }}
            >
              {d.vibe}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: d.accent,
              }}
            >
              Open
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

export default function HomePreviews() {
  const round3 = DESIGNS.filter((d) => d.round === 3);
  const round2 = DESIGNS.filter((d) => d.round === 2);
  const round1 = DESIGNS.filter((d) => d.round === 1);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FAFAF7",
        fontFamily: FONT,
        color: "#0D0D0D",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 120px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B6B6B",
              fontFamily: MONO,
              marginBottom: 18,
            }}
          >
            15 designs / 3 rounds / Smith home page
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              marginBottom: 20,
              maxWidth: 820,
            }}
          >
            Fifteen Precura home pages.
            <br />
            <span style={{ color: "#6B6B6B" }}>Round 3 refines the 3D direction you liked.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "#3A3A3A",
              maxWidth: 640,
              margin: 0,
            }}
          >
            Round 3 iterates on home-6. Each design keeps the 3D terrain but fixes the noisy hero, adds the full
            next-level product story (scientific research, biomarkers, personal doctor, active coaching, living
            profile), adds a clickable carousel, and pulls in the living profile and 2,000 members sections you liked
            from home-10. Five different hero treatments so they don&apos;t converge.
          </p>
        </motion.div>

        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 20,
              paddingBottom: 14,
              borderBottom: "1px solid #E8E4DB",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                margin: 0,
              }}
            >
              Round 3 / Three Dimensional, refined
            </h2>
            <span
              style={{
                fontSize: 11,
                fontFamily: MONO,
                color: "#6B6B6B",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Home 11 to 15
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {round3.map((d, i) => (
              <DesignCard key={d.n} d={d} index={i} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 56, marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 20,
              paddingBottom: 14,
              borderBottom: "1px solid #E8E4DB",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                margin: 0,
                color: "#6B6B6B",
              }}
            >
              Round 2 / Cinematic with substance
            </h2>
            <span
              style={{
                fontSize: 11,
                fontFamily: MONO,
                color: "#6B6B6B",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Home 6 to 10
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {round2.map((d, i) => (
              <DesignCard key={d.n} d={d} index={i} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 20,
              paddingBottom: 14,
              borderBottom: "1px solid #E8E4DB",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                margin: 0,
                color: "#6B6B6B",
              }}
            >
              Round 1 / First exploration
            </h2>
            <span
              style={{
                fontSize: 11,
                fontFamily: MONO,
                color: "#6B6B6B",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Home 1 to 5
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {round1.map((d, i) => (
              <DesignCard key={d.n} d={d} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            marginTop: 72,
            paddingTop: 32,
            borderTop: "1px solid #E8E4DB",
            fontSize: 13,
            color: "#6B6B6B",
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: 0, maxWidth: 720 }}>
            Each agent ran independently and researched 10 top-tier 2026 websites before writing code. Feedback on a
            design? Note the number. Round 3 can refine a winner or remix the best pieces into one page.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
