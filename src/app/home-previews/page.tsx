"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, LineChart, Quote, Film, Sparkles, Stethoscope } from "lucide-react";

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO = '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

type Design = {
  n: number;
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
  {
    n: 1,
    route: "/home-1",
    title: "The Data Story",
    constraint: "Scroll-scrubbed data visualization",
    description:
      "The hero is Anna's real 5-year glucose story as a live, scroll-scrubbed chart. The data is the argument.",
    vibe: "Stripe numbers / NYT interactives / Pudding.cool",
    icon: LineChart,
    accent: "#0B6BCB",
    tint: "#E8F2FE",
  },
  {
    n: 2,
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

export default function HomePreviews() {
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
            Round 1 / 5 designs / Smith home page
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
            Five new Precura home pages.
            <br />
            <span style={{ color: "#6B6B6B" }}>Each one divergent on purpose.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "#3A3A3A",
              maxWidth: 620,
              margin: 0,
            }}
          >
            Each agent researched 10 current 2026 sites and was given a unique structural constraint
            so nothing converges. Tap any card to open the full design. Current live landing is still
            at{" "}
            <Link href="/" style={{ color: "#0B6BCB", textDecoration: "none", borderBottom: "1px solid #C9DEF7" }}>
              the root route
            </Link>{" "}
            and is untouched.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {DESIGNS.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.n}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={d.route} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
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

                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
          })}
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
            Each agent ran independently. Feedback on a design? Keep note of which number. Round 2 can iterate the
            winner or remix pieces across the set.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
