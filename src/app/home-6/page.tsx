"use client";

/**
 * /home-6 - Precura R2 cinematic landing page.
 *
 * Concept: "The Quiet Trajectory"
 * A warm, 2026 awwwards-tier landing page built around a live 3D topographic
 * hero (Three.js + R3F) where the terrain is derived from Anna's real 5-year
 * glucose trajectory. Every section has its own motion vocabulary. Every
 * section has real copy. No section is filler.
 *
 * Required sections implemented:
 *  1. Top nav (sticky, blur)
 *  2. Hero - 3D topology + headline + dual CTA + sub-metrics ticker
 *  3. Problem - stat wall "1 in 2" + urgency copy + Swedish map dots
 *  4. Anna's story - scroll-scrubbed glucose chart + narrative + pullquote
 *  5. How it works - three sticky panels, each with its own illustration
 *  6. What you get - bespoke bento product showcase with animated mockups
 *  7. Trust / science - doctor card + 3 cited clinical models
 *  8. Social proof - 3 quote cards, not a grid
 *  9. Pricing - 3 tiers, middle highlighted
 * 10. FAQ - animated accordion
 * 11. Final CTA + footer
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Lenis from "lenis";
import {
  ArrowRight,
  Play,
  Plus,
  Check,
  Shield,
  FlaskConical,
  Stethoscope,
  MessageSquareText,
  LineChart as LineChartIcon,
  Dumbbell,
  Sparkles,
  Quote as QuoteIcon,
} from "lucide-react";
import GlucoseChart from "./_components/GlucoseChart";

// The 3D hero is loaded client-only to avoid SSR issues with three.js.
const Hero3D = dynamic(() => import("./_components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 100% 70% at 50% 55%, #1A120C 0%, #0E0A08 60%, #070506 100%)",
      }}
    />
  ),
});

// ---------------------------------------------------------------------------
// Design tokens. All colors inline, no CSS variables, no Tailwind colors.
// ---------------------------------------------------------------------------
const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

const COLORS = {
  cream: "#F6F3EE",
  white: "#FFFFFF",
  paper: "#FBF9F4",
  ink: "#0E0E10",
  graphite: "#2A2A30",
  muted: "#6B6B76",
  faint: "#9C9CA6",
  hairline: "rgba(14, 14, 16, 0.08)",
  hairlineStrong: "rgba(14, 14, 16, 0.14)",
  tint: "#ECE7DE",
  tintDeep: "#DFD7C5",
  amber: "#C77A45",
  amberDeep: "#8A3E1C",
  amberWash: "#F3E4D2",
  sage: "#3A5A47",
  sageWash: "#E4ECE6",
  rose: "#B05A4A",
  night: "#0E0A08",
} as const;

// ---------------------------------------------------------------------------
// Small reusable Reveal primitive. Replaces every bespoke inView animation.
// ---------------------------------------------------------------------------
function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.35,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Split a string into animated per-character spans.
function SplitText({
  text,
  delay = 0,
  stagger = 0.025,
  style,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <span
      ref={ref}
      style={{ display: "inline-block", ...style }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sticky top nav with blur + scroll-driven opacity.
// ---------------------------------------------------------------------------
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(246, 243, 238, 0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? `1px solid ${COLORS.hairline}`
          : "1px solid transparent",
        transition: "all 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        fontFamily: FONT,
      }}
    >
      <Link
        href="/home-6"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: scrolled ? COLORS.ink : COLORS.cream,
          letterSpacing: "-0.01em",
          fontWeight: 600,
          fontSize: 17,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle
            cx="11"
            cy="11"
            r="9"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M5 13.5 Q 8 9 11 11 T 17 8"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        Precura
      </Link>
      <div
        className="hidden md:flex"
        style={{
          gap: 32,
          alignItems: "center",
          fontSize: 14,
          color: scrolled ? COLORS.graphite : "rgba(246, 243, 238, 0.78)",
          transition: "color 300ms",
        }}
      >
        <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>
          How it works
        </a>
        <a href="#what" style={{ color: "inherit", textDecoration: "none" }}>
          What you get
        </a>
        <a
          href="#science"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Science
        </a>
        <a
          href="#pricing"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Pricing
        </a>
      </div>
      <button
        style={{
          padding: "9px 18px",
          borderRadius: 999,
          background: scrolled ? COLORS.ink : COLORS.cream,
          color: scrolled ? COLORS.cream : COLORS.ink,
          border: "none",
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: "-0.01em",
          transition: "all 300ms",
        }}
      >
        Get started
      </button>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
function HeroSection() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 120]);
  const fadeOut = useTransform(scrollY, [0, 600], [1, 0]);
  const scale3d = useTransform(scrollY, [0, 800], [1, 1.12]);

  // Subtle live ticker values
  const [glucose, setGlucose] = useState(5.8);
  useEffect(() => {
    const id = setInterval(() => {
      setGlucose(() => +(5.78 + Math.random() * 0.04).toFixed(2));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 760,
        overflow: "hidden",
        background: COLORS.night,
        color: COLORS.cream,
      }}
    >
      {/* 3D scene */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          scale: scale3d,
          opacity: fadeOut,
        }}
      >
        <Hero3D />
      </motion.div>

      {/* Vignette overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(14,10,8,0.55) 0%, rgba(14,10,8,0) 25%, rgba(14,10,8,0) 60%, rgba(14,10,8,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Foreground content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 32px 80px",
          y: parallaxY,
          fontFamily: FONT,
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%" }}>
          {/* Small eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 32,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(246, 243, 238, 0.62)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: COLORS.amber,
                borderRadius: 3,
                boxShadow: "0 0 12px rgba(199, 122, 69, 0.8)",
              }}
            />
            Predictive health / Stockholm / Spring 2026
          </motion.div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(46px, 8.2vw, 132px)",
              lineHeight: 0.93,
              letterSpacing: "-0.035em",
              fontWeight: 500,
              margin: 0,
              maxWidth: 1200,
              color: COLORS.cream,
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <SplitText text="Your doctor sees" delay={0.3} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <SplitText text="one test." delay={0.55} />
            </div>
            <div
              style={{
                overflow: "hidden",
                color: COLORS.amber,
                fontStyle: "italic",
                fontFamily: FONT,
              }}
            >
              <SplitText text="Precura sees the story." delay={0.85} />
            </div>
          </h1>

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.55 }}
            style={{
              marginTop: 40,
              maxWidth: 560,
              fontSize: 18,
              lineHeight: 1.55,
              color: "rgba(246, 243, 238, 0.78)",
              fontWeight: 400,
            }}
          >
            Five years of blood work, family history and lifestyle, read by
            clinical risk models your GP never ran. A quiet warning before the
            diagnosis. Made in Sweden.
          </motion.p>

          {/* CTAs + ticker row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.75 }}
            style={{
              marginTop: 44,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 20,
            }}
          >
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 28px",
                borderRadius: 999,
                background: COLORS.cream,
                color: COLORS.ink,
                border: "none",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 10px 40px rgba(199, 122, 69, 0.25)",
              }}
            >
              See your trajectory <ArrowRight size={16} strokeWidth={2.2} />
            </button>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "17px 22px",
                borderRadius: 999,
                background: "transparent",
                color: COLORS.cream,
                border: "1px solid rgba(246, 243, 238, 0.3)",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              <Play size={14} strokeWidth={2.2} /> Watch the 90-second tour
            </button>
          </motion.div>

          {/* Live data strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 2.2 }}
            style={{
              marginTop: 80,
              borderTop: "1px solid rgba(246, 243, 238, 0.12)",
              paddingTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              maxWidth: 960,
            }}
          >
            {[
              {
                label: "Live scene",
                value: `${glucose.toFixed(2)} mmol/L`,
                sub: "Anna's glucose, rendered",
              },
              {
                label: "Clinical models",
                value: "3",
                sub: "FINDRISC / SCORE2 / FRAX",
              },
              { label: "Data horizon", value: "10 yr", sub: "Risk projection" },
              {
                label: "Turnaround",
                value: "48 h",
                sub: "From blood draw to read",
              },
            ].map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(246, 243, 238, 0.5)",
                    marginBottom: 8,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: COLORS.cream,
                    marginBottom: 4,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(246, 243, 238, 0.55)",
                  }}
                >
                  {m.sub}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        style={{
          position: "absolute",
          bottom: 28,
          right: 32,
          zIndex: 2,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(246, 243, 238, 0.5)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ display: "inline-block", width: 1, height: 24, background: "rgba(246, 243, 238, 0.4)" }}
        />
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PROBLEM section - big stat wall + Swedish dot pattern
// ---------------------------------------------------------------------------
function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  // 50 dots, half filled amber (caught), half empty (missed)
  const dots = Array.from({ length: 50 }, (_, i) => ({
    i,
    caught: i < 25,
    x: (i % 10) * 52 + 16,
    y: Math.floor(i / 10) * 52 + 16,
  }));

  return (
    <section
      ref={ref}
      style={{
        background: COLORS.cream,
        color: COLORS.ink,
        padding: "160px 32px 180px",
        position: "relative",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}
        className="gap-16"
      >
        {/* Left: type block */}
        <div>
          <Reveal>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.muted,
                marginBottom: 36,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 1,
                  background: COLORS.muted,
                }}
              />
              I. The problem
            </div>
          </Reveal>

          <h2
            style={{
              fontSize: "clamp(44px, 5.4vw, 92px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 44,
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Half the people
              </motion.div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                who develop
              </motion.div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ color: COLORS.amberDeep, fontStyle: "italic" }}
              >
                Type 2 diabetes
              </motion.div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.36,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                in Sweden go
              </motion.div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                undiagnosed.
              </motion.div>
            </div>
          </h2>

          <Reveal delay={0.8}>
            <p
              style={{
                maxWidth: 520,
                fontSize: 18,
                lineHeight: 1.6,
                color: COLORS.graphite,
                margin: 0,
                marginBottom: 28,
              }}
            >
              They visit their GP year after year. They get blood tests. Every
              single result is filed as {`"within normal range"`}. And still
              the disease arrives, quietly, through the back door. The data to
              catch it existed. No single doctor ever saw the full picture.
            </p>
          </Reveal>
          <Reveal delay={1.0}>
            <p
              style={{
                maxWidth: 520,
                fontSize: 15,
                lineHeight: 1.6,
                color: COLORS.muted,
                margin: 0,
              }}
            >
              Precura connects the dots. One continuous health record. Validated
              risk models running on every new result. A trajectory, not a
              snapshot.
            </p>
          </Reveal>
        </div>

        {/* Right: dot grid + giant 1/2 */}
        <div style={{ position: "relative", paddingTop: 8 }}>
          <Reveal delay={0.3}>
            <div
              style={{
                position: "relative",
                background: COLORS.paper,
                borderRadius: 32,
                border: `1px solid ${COLORS.hairline}`,
                padding: 40,
                boxShadow: "0 20px 60px rgba(14, 14, 16, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 32,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: COLORS.muted,
                      marginBottom: 8,
                    }}
                  >
                    50 adults, newly diagnosed
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: COLORS.graphite,
                      maxWidth: 240,
                      lineHeight: 1.5,
                    }}
                  >
                    Filled dots were caught on the first test that flagged.
                    Empty dots had been drifting for years.
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 80,
                    fontWeight: 300,
                    letterSpacing: "-0.04em",
                    color: COLORS.amberDeep,
                    lineHeight: 0.8,
                    fontFamily: FONT,
                  }}
                >
                  1/2
                </div>
              </div>

              <svg
                viewBox="0 0 540 280"
                style={{ width: "100%", height: "auto", display: "block" }}
              >
                {dots.map((d) => (
                  <motion.circle
                    key={d.i}
                    cx={d.x}
                    cy={d.y}
                    r={10}
                    fill={d.caught ? COLORS.amber : "transparent"}
                    stroke={d.caught ? COLORS.amber : COLORS.hairlineStrong}
                    strokeWidth={1.5}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      inView
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      delay: 0.6 + d.i * 0.012,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: `${d.x}px ${d.y}px` }}
                  />
                ))}
              </svg>

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  gap: 28,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: COLORS.muted,
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: COLORS.amber,
                    }}
                  />
                  Caught early
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      border: `1.5px solid ${COLORS.hairlineStrong}`,
                    }}
                  />
                  Missed for years
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.6}>
            <div
              style={{
                marginTop: 20,
                fontFamily: MONO,
                fontSize: 10,
                color: COLORS.faint,
                letterSpacing: "0.08em",
              }}
            >
              Source: Folkhalsomyndigheten, Swedish Diabetes Registry (2023)
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ANNA'S STORY section
// ---------------------------------------------------------------------------
function AnnaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        background: COLORS.paper,
        color: COLORS.ink,
        padding: "160px 32px 180px",
        position: "relative",
        fontFamily: FONT,
        borderTop: `1px solid ${COLORS.hairline}`,
        borderBottom: `1px solid ${COLORS.hairline}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: COLORS.muted,
              }}
            />
            II. A quiet case study
          </div>
        </Reveal>

        <div
          className="grid-anna"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 80,
          }}
        >
          {/* Left: portrait + identity */}
          <div>
            <Reveal>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  borderRadius: 24,
                  overflow: "hidden",
                  background: COLORS.tint,
                  border: `1px solid ${COLORS.hairline}`,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop"
                  alt="Anna Bergstrom, 40, Stockholm"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(0.92) contrast(1.02)",
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(14,14,16,0) 50%, rgba(14,14,16,0.5) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    color: COLORS.cream,
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Anna Bergstrom, 40
                  <br />
                  Stockholm
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                style={{
                  marginTop: 24,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  fontFamily: MONO,
                  fontSize: 11,
                }}
              >
                {[
                  { k: "Mother", v: "T2D at 58" },
                  { k: "Father", v: "MI at 65" },
                  { k: "BP on Enalapril", v: "132 / 82" },
                  { k: "FINDRISC", v: "12 / 26" },
                ].map((r) => (
                  <div
                    key={r.k}
                    style={{
                      padding: "12px 14px",
                      background: COLORS.white,
                      border: `1px solid ${COLORS.hairline}`,
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        color: COLORS.muted,
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {r.k}
                    </div>
                    <div style={{ color: COLORS.ink, fontWeight: 500 }}>
                      {r.v}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: narrative + pullquote */}
          <div>
            <h2
              style={{
                fontSize: "clamp(38px, 4.2vw, 68px)",
                lineHeight: 1.02,
                letterSpacing: "-0.028em",
                fontWeight: 500,
                margin: 0,
                marginBottom: 36,
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  initial={{ y: "100%" }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  Five tests.
                </motion.div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  initial={{ y: "100%" }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{
                    duration: 1,
                    delay: 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  Five years.
                </motion.div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  initial={{ y: "100%" }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{
                    duration: 1,
                    delay: 0.24,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ color: COLORS.amberDeep, fontStyle: "italic" }}
                >
                  One story nobody told her.
                </motion.div>
              </div>
            </h2>

            <Reveal delay={0.4}>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: COLORS.graphite,
                  margin: 0,
                  marginBottom: 24,
                  maxWidth: 620,
                }}
              >
                In 2021, Anna{`'`}s fasting glucose was 5.0 mmol/L.
                Comfortable middle of the reference range. Her GP said it was
                fine and it was fine. Every year after, the number crept
                upward by a tenth or two. In 2026, it was 5.8. Still inside
                the normal range, so still, technically, fine.
              </p>
            </Reveal>
            <Reveal delay={0.55}>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: COLORS.graphite,
                  margin: 0,
                  marginBottom: 40,
                  maxWidth: 620,
                }}
              >
                But Precura ran the whole series through FINDRISC, weighted
                it against her mother{`'`}s T2D and her father{`'`}s heart
                attack, and surfaced a moderate-risk trajectory that would
                have been obvious to any doctor with all the data on the same
                screen. No doctor ever had it.
              </p>
            </Reveal>

            <Reveal delay={0.7}>
              <div
                style={{
                  position: "relative",
                  padding: "32px 36px",
                  background: COLORS.tint,
                  borderRadius: 24,
                  maxWidth: 620,
                }}
              >
                <QuoteIcon
                  size={20}
                  color={COLORS.amberDeep}
                  style={{ marginBottom: 12 }}
                />
                <p
                  style={{
                    fontSize: 22,
                    lineHeight: 1.45,
                    letterSpacing: "-0.01em",
                    color: COLORS.ink,
                    margin: 0,
                    marginBottom: 16,
                    fontWeight: 400,
                  }}
                >
                  I had been getting blood tests for years and nobody ever
                  told me I was drifting toward diabetes until Precura did. I
                  am forty. I still have time to change this.
                </p>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: COLORS.muted,
                    letterSpacing: "0.08em",
                  }}
                >
                  Anna, on her first Precura report
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Chart */}
        <Reveal delay={0.2}>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 28,
              border: `1px solid ${COLORS.hairline}`,
              padding: "48px 48px 36px",
              boxShadow: "0 20px 60px rgba(14, 14, 16, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 32,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: COLORS.muted,
                    marginBottom: 6,
                  }}
                >
                  Fasting glucose / mmol/L / 2021 to 2026
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: COLORS.ink,
                  }}
                >
                  The slow drift nobody saw
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: COLORS.muted,
                  alignItems: "center",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 2,
                      background: COLORS.amberDeep,
                    }}
                  />
                  Anna
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 0,
                      borderTop: `1px dashed ${COLORS.muted}`,
                    }}
                  />
                  Upper normal
                </span>
              </div>
            </div>
            <GlucoseChart />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOW IT WORKS section - three sticky panels
// ---------------------------------------------------------------------------
type Step = {
  n: string;
  eyebrow: string;
  title: string;
  body: string;
  illustration: (animating: boolean) => React.ReactNode;
};

function KitIllustration({ animating }: { animating: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/3",
        background: COLORS.paper,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${COLORS.hairline}`,
      }}
    >
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>
        {/* Clinic pin */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={animating ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <circle
            cx="120"
            cy="100"
            r="36"
            fill={COLORS.sageWash}
            stroke={COLORS.sage}
            strokeWidth="1.5"
          />
          <text
            x="120"
            y="106"
            textAnchor="middle"
            fontSize="24"
            fill={COLORS.sage}
            fontFamily={MONO}
          >
            +
          </text>
          <text
            x="120"
            y="162"
            textAnchor="middle"
            fontSize="11"
            fill={COLORS.muted}
            fontFamily={MONO}
          >
            Vardcentral
          </text>
        </motion.g>

        {/* Home kit */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={animating ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <rect
            x="220"
            y="64"
            width="110"
            height="74"
            rx="10"
            fill={COLORS.amberWash}
            stroke={COLORS.amber}
            strokeWidth="1.5"
          />
          <rect
            x="236"
            y="82"
            width="78"
            height="6"
            rx="3"
            fill={COLORS.amber}
          />
          <rect
            x="236"
            y="96"
            width="50"
            height="4"
            rx="2"
            fill={COLORS.amber}
            opacity="0.5"
          />
          <rect
            x="236"
            y="108"
            width="64"
            height="4"
            rx="2"
            fill={COLORS.amber}
            opacity="0.5"
          />
          <text
            x="275"
            y="162"
            textAnchor="middle"
            fontSize="11"
            fill={COLORS.muted}
            fontFamily={MONO}
          >
            Home kit
          </text>
        </motion.g>

        {/* Arrow from both to the lab */}
        <motion.path
          d="M 120 185 Q 200 230 200 260"
          fill="none"
          stroke={COLORS.muted}
          strokeWidth="1.2"
          strokeDasharray="2 4"
          initial={{ pathLength: 0 }}
          animate={animating ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.path
          d="M 275 185 Q 220 230 200 260"
          fill="none"
          stroke={COLORS.muted}
          strokeWidth="1.2"
          strokeDasharray="2 4"
          initial={{ pathLength: 0 }}
          animate={animating ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 0.85 }}
        />

        {/* Tube */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={animating ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.05 }}
        >
          <rect
            x="184"
            y="252"
            width="32"
            height="24"
            rx="4"
            fill={COLORS.amberDeep}
          />
          <rect
            x="184"
            y="246"
            width="32"
            height="8"
            rx="4"
            fill={COLORS.graphite}
          />
        </motion.g>
      </svg>
    </div>
  );
}

function ModelsIllustration({ animating }: { animating: boolean }) {
  const markers = [
    { name: "f-Glucose", v: 5.8, status: "borderline", delay: 0.1 },
    { name: "HbA1c", v: 38, status: "normal", delay: 0.18 },
    { name: "TC", v: 5.1, status: "borderline", delay: 0.26 },
    { name: "HDL", v: 1.6, status: "normal", delay: 0.34 },
    { name: "LDL", v: 3.2, status: "normal", delay: 0.42 },
    { name: "TG", v: 1.3, status: "normal", delay: 0.5 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/3",
        background: COLORS.paper,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${COLORS.hairline}`,
        padding: 28,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: COLORS.muted,
          marginBottom: 12,
        }}
      >
        Input markers
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {markers.map((m) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, x: -20 }}
            animate={animating ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: m.delay }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              background: COLORS.white,
              borderRadius: 8,
              border: `1px solid ${COLORS.hairline}`,
              fontFamily: MONO,
              fontSize: 11,
            }}
          >
            <span style={{ color: COLORS.muted }}>{m.name}</span>
            <span style={{ color: COLORS.ink, fontWeight: 500 }}>
              {m.v}
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    m.status === "borderline" ? COLORS.amber : COLORS.sage,
                  marginLeft: 8,
                }}
              />
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={animating ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: COLORS.muted,
          marginBottom: 8,
        }}
      >
        Clinical models
      </motion.div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["FINDRISC", "SCORE2", "FRAX"].map((m, i) => (
          <motion.div
            key={m}
            initial={{ opacity: 0, y: 8 }}
            animate={animating ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
            style={{
              padding: "6px 14px",
              background: COLORS.ink,
              color: COLORS.cream,
              borderRadius: 999,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.06em",
            }}
          >
            {m}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportIllustration({ animating }: { animating: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/3",
        background: COLORS.paper,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${COLORS.hairline}`,
        padding: 24,
      }}
    >
      <div
        style={{
          background: COLORS.white,
          borderRadius: 16,
          border: `1px solid ${COLORS.hairline}`,
          padding: 20,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: COLORS.muted,
                marginBottom: 4,
              }}
            >
              Diabetes risk / 10 yr
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={animating ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: COLORS.amberDeep,
              }}
            >
              ~17%
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={animating ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: MONO,
              fontSize: 9,
              padding: "4px 10px",
              background: COLORS.amberWash,
              color: COLORS.amberDeep,
              borderRadius: 999,
              height: "fit-content",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Moderate
          </motion.div>
        </div>

        {/* Zone bar */}
        <div
          style={{
            position: "relative",
            height: 14,
            borderRadius: 7,
            overflow: "hidden",
            background: `linear-gradient(90deg, ${COLORS.sage} 0%, ${COLORS.sage} 25%, #9DB87E 25%, #9DB87E 50%, ${COLORS.amber} 50%, ${COLORS.amber} 75%, ${COLORS.rose} 75%, ${COLORS.rose} 100%)`,
          }}
        >
          <motion.div
            initial={{ left: "0%" }}
            animate={animating ? { left: "60%" } : {}}
            transition={{
              duration: 1.6,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "absolute",
              top: -4,
              width: 22,
              height: 22,
              borderRadius: 11,
              background: COLORS.white,
              border: `3px solid ${COLORS.ink}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 12,
            color: COLORS.graphite,
            lineHeight: 1.5,
            fontFamily: FONT,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={animating ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Glucose has risen from 5.0 to 5.8 over 5 years.
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={animating ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Family history (mother T2D at 58) is a fixed factor.
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={animating ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.3 }}
            style={{ color: COLORS.sage, fontWeight: 500, marginTop: 6 }}
          >
            + Book doctor call
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const steps: Step[] = [
    {
      n: "01",
      eyebrow: "Collect",
      title: "A single blood test, at a clinic you already trust.",
      body: "Book a blood draw at one of our Swedish lab partners (Unilabs, Karolinska, Synlab), or order a home kit. Precura handles the paperwork and tracks the sample from draw to lab.",
      illustration: (a) => <KitIllustration animating={a} />,
    },
    {
      n: "02",
      eyebrow: "Interpret",
      title: "Every new marker meets every past one.",
      body: "Your results drop into a continuous record that goes back as far as 1177 has history. Validated clinical risk models (FINDRISC, SCORE2, FRAX) run on the full series, not just the latest point.",
      illustration: (a) => <ModelsIllustration animating={a} />,
    },
    {
      n: "03",
      eyebrow: "Decide",
      title: "A plain-English trajectory you can act on.",
      body: "You get a 10-year risk projection, a one-page doctor-reviewed summary, and the option to book a consultation with a Swedish GP on the Precura panel. No guesswork. No Google spiral.",
      illustration: (a) => <ReportIllustration animating={a} />,
    },
  ];

  return (
    <section
      id="how"
      style={{
        background: COLORS.cream,
        color: COLORS.ink,
        padding: "160px 32px 40px",
        position: "relative",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 28, height: 1, background: COLORS.muted }}
            />
            III. How it works
          </div>
        </Reveal>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(38px, 4.6vw, 72px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 24,
              maxWidth: 900,
            }}
          >
            Three steps. Forty-eight hours.
            <br />
            <span style={{ color: COLORS.muted }}>
              Zero waiting rooms.
            </span>
          </h2>
        </Reveal>
      </div>

      {steps.map((s, i) => (
        <StepPanel key={s.n} step={s} index={i} total={steps.length} />
      ))}

      <div style={{ height: 120 }} />
    </section>
  );
}

function StepPanel({
  step,
  index,
}: {
  step: Step;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "80px 0",
        display: "grid",
        gridTemplateColumns: index % 2 === 0 ? "1fr 1.1fr" : "1.1fr 1fr",
        gap: 80,
        alignItems: "center",
      }}
    >
      <div style={{ order: index % 2 === 0 ? 0 : 1 }}>
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              color: COLORS.amberDeep,
              marginBottom: 20,
            }}
          >
            {step.n} / {step.eyebrow}
          </div>
          <h3
            style={{
              fontSize: "clamp(28px, 3.2vw, 48px)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 24,
              maxWidth: 520,
            }}
          >
            {step.title}
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: COLORS.graphite,
              margin: 0,
              maxWidth: 480,
            }}
          >
            {step.body}
          </p>
        </motion.div>
      </div>
      <div style={{ order: index % 2 === 0 ? 1 : 0 }}>
        {step.illustration(inView)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WHAT YOU GET - bespoke bento
// ---------------------------------------------------------------------------
function BentoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id="what"
      ref={ref}
      style={{
        background: COLORS.night,
        color: COLORS.cream,
        padding: "160px 32px 180px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(246, 243, 238, 0.5)",
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: "rgba(246, 243, 238, 0.3)",
              }}
            />
            IV. What you get
          </div>
        </Reveal>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(44px, 5.4vw, 88px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 72,
              maxWidth: 1100,
            }}
          >
            A second opinion that
            <br />
            <span style={{ color: COLORS.amber, fontStyle: "italic" }}>
              never stops reading.
            </span>
          </h2>
        </Reveal>

        <div
          className="bento"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "minmax(220px, auto)",
            gap: 16,
          }}
        >
          {/* Risk profile - hero tile */}
          <BentoTile
            span="span 7 / span 7"
            row="span 2"
            animate={inView}
            delay={0.1}
          >
            <div
              style={{
                padding: 36,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <IconCircle>
                  <LineChartIcon size={18} strokeWidth={1.8} />
                </IconCircle>
                <h3 style={bentoTitle}>
                  A 10-year risk profile
                  <br />
                  across three models.
                </h3>
                <p style={bentoBody}>
                  FINDRISC for diabetes, SCORE2 for cardiovascular, FRAX for
                  bone. Not black boxes. Peer-reviewed, widely used, fully
                  cited in your report.
                </p>
              </div>

              {/* Mini risk gauges */}
              <div
                style={{
                  marginTop: 32,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {[
                  {
                    name: "Diabetes",
                    value: 60,
                    color: COLORS.amber,
                    label: "Moderate",
                  },
                  {
                    name: "Cardio",
                    value: 28,
                    color: COLORS.sage,
                    label: "Low-mod",
                  },
                  {
                    name: "Bone",
                    value: 12,
                    color: COLORS.sage,
                    label: "Low",
                  },
                ].map((r, i) => (
                  <div key={r.name}>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(246, 243, 238, 0.4)",
                        marginBottom: 10,
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "rgba(246, 243, 238, 0.08)",
                        borderRadius: 3,
                        overflow: "hidden",
                        marginBottom: 10,
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${r.value}%` } : {}}
                        transition={{
                          duration: 1.6,
                          delay: 0.5 + i * 0.15,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          height: "100%",
                          background: r.color,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: COLORS.cream,
                        fontWeight: 500,
                      }}
                    >
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoTile>

          {/* AI chat tile */}
          <BentoTile
            span="span 5 / span 5"
            row="span 1"
            animate={inView}
            delay={0.2}
          >
            <div style={{ padding: 28, height: "100%" }}>
              <IconCircle>
                <MessageSquareText size={18} strokeWidth={1.8} />
              </IconCircle>
              <h3 style={bentoTitle}>AI that remembers everything.</h3>
              <p style={bentoBody}>
                Ask anything. The assistant has your full history on hand and
                answers in plain Swedish or English.
              </p>
              <div
                style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: "rgba(246, 243, 238, 0.06)",
                  borderRadius: 14,
                  fontSize: 12,
                  color: "rgba(246, 243, 238, 0.8)",
                  fontStyle: "italic",
                }}
              >
                Should I be worried that my glucose is 5.8?
              </div>
            </div>
          </BentoTile>

          {/* Doctor messaging */}
          <BentoTile
            span="span 5 / span 5"
            row="span 1"
            animate={inView}
            delay={0.3}
          >
            <div style={{ padding: 28, height: "100%" }}>
              <IconCircle>
                <Stethoscope size={18} strokeWidth={1.8} />
              </IconCircle>
              <h3 style={bentoTitle}>Secure messaging with a Swedish GP.</h3>
              <p style={bentoBody}>
                Flat-rate doctor access inside the app. Replies within 24
                hours, not three weeks.
              </p>
            </div>
          </BentoTile>

          {/* Biomarker tracking */}
          <BentoTile
            span="span 4 / span 4"
            row="span 2"
            animate={inView}
            delay={0.35}
          >
            <div
              style={{
                padding: 28,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <IconCircle>
                <FlaskConical size={18} strokeWidth={1.8} />
              </IconCircle>
              <h3 style={bentoTitle}>Every marker, tracked over years.</h3>
              <p style={bentoBody}>
                Trend lines on glucose, HbA1c, cholesterol, thyroid, inflammation
                markers. Patterns, not single readings.
              </p>
              {/* Mini sparkline demo */}
              <div style={{ marginTop: "auto", paddingTop: 24 }}>
                <svg
                  viewBox="0 0 200 80"
                  style={{ width: "100%", height: "auto" }}
                >
                  <motion.path
                    d="M 10 60 L 50 55 L 90 52 L 130 42 L 170 36 L 190 22"
                    stroke={COLORS.amber}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.6, delay: 0.8 }}
                  />
                  <motion.circle
                    cx="190"
                    cy="22"
                    r="4"
                    fill={COLORS.amberDeep}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 2.3 }}
                  />
                </svg>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: MONO,
                    fontSize: 9,
                    color: "rgba(246, 243, 238, 0.4)",
                  }}
                >
                  <span>2021</span>
                  <span>2026</span>
                </div>
              </div>
            </div>
          </BentoTile>

          {/* Training plan */}
          <BentoTile
            span="span 4 / span 4"
            row="span 1"
            animate={inView}
            delay={0.45}
          >
            <div style={{ padding: 28, height: "100%" }}>
              <IconCircle>
                <Dumbbell size={18} strokeWidth={1.8} />
              </IconCircle>
              <h3 style={bentoTitle}>A training plan built on your labs.</h3>
              <p style={bentoBody}>
                Real sets, reps and weights, reviewed by your doctor. Not
                {` `}
                {`"walk more".`}
              </p>
            </div>
          </BentoTile>

          {/* Annual retesting */}
          <BentoTile
            span="span 4 / span 4"
            row="span 1"
            animate={inView}
            delay={0.55}
          >
            <div style={{ padding: 28, height: "100%" }}>
              <IconCircle>
                <Sparkles size={18} strokeWidth={1.8} />
              </IconCircle>
              <h3 style={bentoTitle}>Retesting, built in.</h3>
              <p style={bentoBody}>
                Annual and twice-yearly panels at flat prices. The trajectory
                keeps getting longer.
              </p>
            </div>
          </BentoTile>
        </div>
      </div>
    </section>
  );
}

const bentoTitle: React.CSSProperties = {
  fontSize: 22,
  lineHeight: 1.15,
  letterSpacing: "-0.015em",
  fontWeight: 500,
  margin: 0,
  marginTop: 20,
  marginBottom: 12,
  color: COLORS.cream,
};
const bentoBody: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.55,
  color: "rgba(246, 243, 238, 0.65)",
  margin: 0,
  maxWidth: 380,
};

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 19,
        background: "rgba(199, 122, 69, 0.18)",
        color: COLORS.amber,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

function BentoTile({
  children,
  span,
  row,
  animate,
  delay,
}: {
  children: React.ReactNode;
  span: string;
  row: string;
  animate: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: span,
        gridRow: row,
        background: "rgba(246, 243, 238, 0.04)",
        border: "1px solid rgba(246, 243, 238, 0.08)",
        borderRadius: 24,
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// TRUST / SCIENCE
// ---------------------------------------------------------------------------
function ScienceSection() {
  const models = [
    {
      name: "FINDRISC",
      full: "Finnish Diabetes Risk Score",
      cite: "Lindstrom & Tuomilehto (2003), Diabetes Care 26(3).",
      body: "Non-invasive 8-factor score widely used across Nordic primary care to identify adults at high risk of Type 2 diabetes within 10 years.",
    },
    {
      name: "SCORE2",
      full: "Systematic Coronary Risk Evaluation 2",
      cite: "SCORE2 Working Group (2021), European Heart Journal.",
      body: "European guideline-endorsed model for 10-year cardiovascular risk. Recalibrated for low, moderate and high-risk countries including Sweden.",
    },
    {
      name: "FRAX",
      full: "Fracture Risk Assessment Tool",
      cite: "Kanis et al. (2008), Osteoporosis International 19(4).",
      body: "10-year probability of major osteoporotic fracture and hip fracture, calibrated to Swedish population data.",
    },
  ];

  return (
    <section
      id="science"
      style={{
        background: COLORS.paper,
        color: COLORS.ink,
        padding: "160px 32px 180px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 28, height: 1, background: COLORS.muted }}
            />
            V. The science
          </div>
        </Reveal>

        <div
          className="science-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 96,
          }}
        >
          <div>
            <Reveal>
              <h2
                style={{
                  fontSize: "clamp(38px, 4.6vw, 72px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: 32,
                }}
              >
                Built in a Swedish
                <br />
                clinic, not a
                <br />
                <span style={{ fontStyle: "italic", color: COLORS.sage }}>
                  Silicon Valley garage.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: COLORS.graphite,
                  maxWidth: 540,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                Precura is co-founded by Dr. Marcus Johansson, a practicing
                general physician in Stockholm who spent fifteen years watching
                patients slip through the cracks between annual blood tests.
                Every risk model we run has been used in Swedish primary care
                for over a decade and is cited in your report. Nothing is
                hidden behind a black box.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div
                style={{
                  display: "flex",
                  gap: 32,
                  flexWrap: "wrap",
                  paddingTop: 24,
                  borderTop: `1px solid ${COLORS.hairline}`,
                }}
              >
                {[
                  { k: "EU-hosted", v: "GDPR compliant" },
                  { k: "Encryption", v: "AES-256 at rest" },
                  { k: "Never sold", v: "Your data, your data" },
                ].map((p) => (
                  <div key={p.k}>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: COLORS.muted,
                        marginBottom: 4,
                      }}
                    >
                      {p.k}
                    </div>
                    <div style={{ fontSize: 14, color: COLORS.ink }}>
                      {p.v}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Doctor card */}
          <Reveal delay={0.15}>
            <div
              style={{
                background: COLORS.white,
                borderRadius: 28,
                border: `1px solid ${COLORS.hairline}`,
                padding: 36,
                boxShadow: "0 20px 60px rgba(14, 14, 16, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    overflow: "hidden",
                    background: COLORS.tint,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&fit=crop"
                    alt="Dr. Marcus Johansson"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: COLORS.ink,
                      marginBottom: 2,
                    }}
                  >
                    Dr. Marcus Johansson
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>
                    Co-founder, Precura / GP, Stockholm
                  </div>
                </div>
              </div>
              <blockquote
                style={{
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: COLORS.graphite,
                  margin: 0,
                  fontStyle: "italic",
                  borderLeft: "none",
                  padding: 0,
                }}
              >
                {`"In primary care, I see the same pattern every week. A marker drifting for five years. Each single result filed as normal. The missing piece is not another test. The missing piece is somebody reading the whole chart."`}
              </blockquote>
            </div>
          </Reveal>
        </div>

        {/* Model cards */}
        <div
          className="model-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {models.map((m, i) => (
            <Reveal key={m.name} delay={0.15 + i * 0.1}>
              <div
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.hairline}`,
                  borderRadius: 20,
                  padding: 28,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    color: COLORS.amberDeep,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Shield size={12} strokeWidth={2} />
                  VALIDATED MODEL
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: COLORS.ink,
                    marginBottom: 4,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 16,
                  }}
                >
                  {m.full}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: COLORS.graphite,
                    marginBottom: 20,
                  }}
                >
                  {m.body}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: COLORS.faint,
                    paddingTop: 16,
                    borderTop: `1px solid ${COLORS.hairline}`,
                    letterSpacing: "0.02em",
                  }}
                >
                  {m.cite}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SOCIAL PROOF - three quote tiles with hover lift
// ---------------------------------------------------------------------------
function SocialProofSection() {
  const quotes = [
    {
      q: "I had been getting blood tests for years and nobody ever told me I was drifting toward diabetes until Precura did. I am forty. I still have time to change this.",
      name: "Linnea",
      meta: "42, Malmo",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fit=crop",
    },
    {
      q: "It is the first time in my adult life a system has told me what my numbers mean instead of just what they are. I showed the report to my GP and she read the whole thing.",
      name: "Johan",
      meta: "51, Gothenburg",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop",
    },
    {
      q: "My father died of his first heart attack at sixty-five. I am thirty-eight and my cardiovascular risk just dropped two points after six months of training. That is the whole product for me.",
      name: "Hedvig",
      meta: "38, Uppsala",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&fit=crop",
    },
  ];

  return (
    <section
      style={{
        background: COLORS.cream,
        color: COLORS.ink,
        padding: "160px 32px 180px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 28, height: 1, background: COLORS.muted }}
            />
            VI. In their words
          </div>
        </Reveal>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(40px, 4.8vw, 76px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 72,
              maxWidth: 900,
            }}
          >
            The first three hundred
            <br />
            <span style={{ color: COLORS.muted }}>
              are already on the trajectory.
            </span>
          </h2>
        </Reveal>

        <div
          className="quote-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={0.1 + i * 0.15}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.hairline}`,
                  borderRadius: 24,
                  padding: 32,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <QuoteIcon
                  size={18}
                  color={COLORS.amberDeep}
                  style={{ marginBottom: 20 }}
                />
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.55,
                    color: COLORS.graphite,
                    margin: 0,
                    marginBottom: 32,
                    flex: 1,
                  }}
                >
                  {q.q}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    paddingTop: 20,
                    borderTop: `1px solid ${COLORS.hairline}`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      overflow: "hidden",
                      background: COLORS.tint,
                    }}
                  >
                    <img
                      src={q.img}
                      alt={q.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: COLORS.ink,
                      }}
                    >
                      {q.name}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 11,
                        color: COLORS.muted,
                      }}
                    >
                      {q.meta}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PRICING
// ---------------------------------------------------------------------------
function PricingSection() {
  const tiers = [
    {
      name: "First test",
      price: "995",
      period: "one time",
      tag: "Try it once",
      body: "For a single honest look at where you stand today. One comprehensive blood panel, one risk profile, unlimited AI chat for 90 days.",
      features: [
        "Comprehensive blood panel (40+ markers)",
        "Full risk profile across 3 models",
        "Plain-English doctor-reviewed summary",
        "AI chat access for 90 days",
      ],
      cta: "Order one-off",
      highlight: false,
    },
    {
      name: "Annual",
      price: "2,995",
      period: "per year",
      tag: "Most popular",
      body: "Two blood tests a year, a continuous risk profile, secure doctor messaging and a personalized training plan. Cancel any time.",
      features: [
        "2 blood panels per year",
        "Continuous risk tracking",
        "Secure messaging with a Swedish GP",
        "Full AI chat + training plan",
        "Priority blood draw slots",
      ],
      cta: "Start annual",
      highlight: true,
    },
    {
      name: "Platinum",
      price: "4,995",
      period: "per year",
      tag: "For a full picture",
      body: "Four blood tests a year, priority doctor access, the full screening suite (PHQ-9, GAD-7, AUDIT-C, EQ-5D), and advanced markers.",
      features: [
        "4 blood panels per year",
        "Priority doctor video consults",
        "Full screening suite",
        "Advanced biomarker add-ons",
        "Direct line to care team",
      ],
      cta: "Go platinum",
      highlight: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        background: COLORS.paper,
        color: COLORS.ink,
        padding: "160px 32px 180px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 28, height: 1, background: COLORS.muted }}
            />
            VII. Pricing
          </div>
        </Reveal>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(40px, 4.8vw, 72px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 24,
              maxWidth: 880,
            }}
          >
            One flat price. No lock-in.
            <br />
            <span style={{ color: COLORS.muted }}>
              Roughly the cost of one Werlabs panel.
            </span>
          </h2>
        </Reveal>

        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 72,
            alignItems: "stretch",
          }}
        >
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={0.1 + i * 0.12}>
              <div
                style={{
                  position: "relative",
                  height: "100%",
                  background: t.highlight ? COLORS.ink : COLORS.white,
                  color: t.highlight ? COLORS.cream : COLORS.ink,
                  border: t.highlight
                    ? "none"
                    : `1px solid ${COLORS.hairline}`,
                  borderRadius: 28,
                  padding: "40px 36px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: t.highlight
                    ? "0 30px 80px rgba(14, 14, 16, 0.18)"
                    : "0 10px 40px rgba(14, 14, 16, 0.04)",
                  transform: t.highlight ? "translateY(-8px)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: t.highlight
                      ? COLORS.amber
                      : COLORS.muted,
                    marginBottom: 20,
                  }}
                >
                  {t.tag}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    marginBottom: 4,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {t.price}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: t.highlight
                        ? "rgba(246, 243, 238, 0.6)"
                        : COLORS.muted,
                    }}
                  >
                    SEK / {t.period}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: t.highlight
                      ? "rgba(246, 243, 238, 0.7)"
                      : COLORS.graphite,
                    margin: 0,
                    marginBottom: 28,
                  }}
                >
                  {t.body}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    marginBottom: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {t.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      <Check
                        size={14}
                        strokeWidth={2.4}
                        color={
                          t.highlight ? COLORS.amber : COLORS.sage
                        }
                        style={{ marginTop: 4, flexShrink: 0 }}
                      />
                      <span
                        style={{
                          color: t.highlight
                            ? "rgba(246, 243, 238, 0.85)"
                            : COLORS.graphite,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    marginTop: "auto",
                    padding: "16px 24px",
                    borderRadius: 999,
                    background: t.highlight ? COLORS.amber : COLORS.ink,
                    color: t.highlight ? COLORS.ink : COLORS.cream,
                    border: "none",
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.5}>
          <div
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 13,
              color: COLORS.muted,
            }}
          >
            All prices in SEK. Blood draw included at partner clinics. Cancel
            any time, no questions asked. HSA not applicable outside Sweden.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ - animated accordion
// ---------------------------------------------------------------------------
function FaqSection() {
  const faqs = [
    {
      q: "Is Precura a medical diagnosis?",
      a: "No. Precura provides health decision support. Everything we produce is designed to be read by you and your GP together. We surface patterns and risks, we do not prescribe or diagnose. You still see your own doctor and you still own every decision.",
    },
    {
      q: "How is this different from Werlabs or Kry?",
      a: "Werlabs gives you numbers. Kry gives you a video appointment. Precura gives you a continuous record read by validated risk models over time, plus a doctor conversation when a trajectory warrants one. It is the layer between a single test and a full GP visit.",
    },
    {
      q: "Which clinics and labs do you partner with?",
      a: "We work with major Swedish lab partners including Unilabs, Karolinska University Laboratory and Synlab, with draw stations in Stockholm, Gothenburg, Malmo, Uppsala and Umea. A home kit is available for members who prefer it.",
    },
    {
      q: "Is my health data safe?",
      a: "Your data is stored on EU servers, encrypted at rest with AES-256, covered by GDPR and the Swedish Patient Data Act (Patientdatalagen), and is never sold. You can export or delete your entire record with one click from your profile.",
    },
    {
      q: "How fast do I get results?",
      a: "Forty-eight hours from blood draw to interpreted report in most cases. Our lab partners run same-day processing and your results are pushed into the app as soon as they clear the lab's QC.",
    },
    {
      q: "Can I cancel any time?",
      a: "Yes. Any tier, any time, no lock-in. You keep your historical data forever, even if you leave. Swedish consumer law gives you fourteen days to change your mind on any subscription, and we honor it beyond that.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      style={{
        background: COLORS.cream,
        color: COLORS.ink,
        padding: "160px 32px 180px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 28, height: 1, background: COLORS.muted }}
            />
            VIII. Questions you already have
          </div>
        </Reveal>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(38px, 4.4vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.028em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 64,
              maxWidth: 800,
            }}
          >
            Everything a skeptical
            <br />
            <span style={{ color: COLORS.muted }}>Swede would ask first.</span>
          </h2>
        </Reveal>

        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                style={{
                  borderBottom: `1px solid ${COLORS.hairline}`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "28px 0",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: FONT,
                    gap: 24,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(18px, 2vw, 24px)",
                      fontWeight: 500,
                      color: COLORS.ink,
                      letterSpacing: "-0.01em",
                      flex: 1,
                    }}
                  >
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: isOpen ? COLORS.ink : COLORS.white,
                      color: isOpen ? COLORS.cream : COLORS.ink,
                      border: `1px solid ${COLORS.hairline}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "0 0 32px",
                          fontSize: 16,
                          lineHeight: 1.65,
                          color: COLORS.graphite,
                          maxWidth: 820,
                        }}
                      >
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FINAL CTA + FOOTER
// ---------------------------------------------------------------------------
function FinalCTASection() {
  return (
    <section
      style={{
        position: "relative",
        background: COLORS.night,
        color: COLORS.cream,
        padding: "180px 32px 120px",
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      {/* Very subtle echo of the hero terrain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(199, 122, 69, 0.18) 0%, rgba(199, 122, 69, 0) 70%)",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(246, 243, 238, 0.5)",
              marginBottom: 32,
            }}
          >
            IX. One decision
          </div>
        </Reveal>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(46px, 6vw, 108px)",
              lineHeight: 0.97,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 40,
            }}
          >
            See the chapter
            <br />
            <span style={{ color: COLORS.amber, fontStyle: "italic" }}>
              before it is written.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "rgba(246, 243, 238, 0.7)",
              maxWidth: 580,
              margin: "0 auto 48px",
            }}
          >
            Your first blood test arrives in a week. Your first interpreted
            report, within forty-eight hours of the draw. The quiet trajectory
            starts today.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "20px 32px",
                borderRadius: 999,
                background: COLORS.cream,
                color: COLORS.ink,
                border: "none",
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 20px 60px rgba(199, 122, 69, 0.35)",
              }}
            >
              Start with the first test <ArrowRight size={16} strokeWidth={2.2} />
            </button>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "19px 26px",
                borderRadius: 999,
                background: "transparent",
                color: COLORS.cream,
                border: "1px solid rgba(246, 243, 238, 0.3)",
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Talk to the team
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.5}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(246, 243, 238, 0.35)",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Precura provides health decision support. It is not a medical
            device and does not replace the judgment of a licensed physician.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: COLORS.night,
        color: "rgba(246, 243, 238, 0.6)",
        padding: "64px 32px 48px",
        borderTop: "1px solid rgba(246, 243, 238, 0.08)",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
        }}
        className="footer-grid"
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: COLORS.cream,
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle
                cx="11"
                cy="11"
                r="9"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M5 13.5 Q 8 9 11 11 T 17 8"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            Precura
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              maxWidth: 320,
              marginBottom: 20,
            }}
          >
            Predictive health, read aloud. Co-founded in Stockholm. Built
            alongside Swedish primary care.
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "rgba(246, 243, 238, 0.4)",
            }}
          >
            Precura AB, Sveavagen 42, 113 34 Stockholm
          </div>
        </div>
        {[
          {
            title: "Product",
            links: ["How it works", "What you get", "Pricing", "FAQ"],
          },
          {
            title: "Company",
            links: ["Science", "For clinicians", "Press", "Careers"],
          },
          {
            title: "Legal",
            links: ["Privacy", "Terms", "Data processing", "Contact"],
          },
        ].map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(246, 243, 238, 0.5)",
                marginBottom: 16,
              }}
            >
              {col.title}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    style={{
                      color: "rgba(246, 243, 238, 0.7)",
                      textDecoration: "none",
                      fontSize: 13,
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1280,
          margin: "48px auto 0",
          paddingTop: 32,
          borderTop: "1px solid rgba(246, 243, 238, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "rgba(246, 243, 238, 0.35)",
        }}
      >
        <div>2026 Precura AB / All rights reserved</div>
        <div>Made in Stockholm with care</div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Smooth scroll wrapper
// ---------------------------------------------------------------------------
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);
}

// Progress bar
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22 });
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: COLORS.amber,
        transformOrigin: "0% 50%",
        scaleX: progress,
        zIndex: 200,
      }}
    />
  );
}

// Mouse cursor accent dot
function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  useEffect(() => {
    const on = (e: MouseEvent) => {
      x.set(e.clientX - 6);
      y.set(e.clientY - 6);
    };
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        background: COLORS.amber,
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 300,
        x: sx,
        y: sy,
      }}
      className="hidden md:block"
    />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home6Page() {
  useLenis();

  return (
    <div
      style={{
        background: COLORS.cream,
        color: COLORS.ink,
        fontFamily: FONT,
        WebkitFontSmoothing: "antialiased",
        minHeight: "100vh",
      }}
    >
      <style>{`
        html, body { background: ${COLORS.cream}; }
        @media (max-width: 900px) {
          .grid-anna,
          .science-grid,
          .model-grid,
          .quote-grid,
          .pricing-grid,
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .bento {
            grid-template-columns: 1fr !important;
          }
          .bento > * {
            grid-column: 1 / -1 !important;
            grid-row: auto !important;
          }
        }
        @media (max-width: 900px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      <ScrollProgress />
      <Cursor />
      <TopNav />
      <HeroSection />
      <ProblemSection />
      <AnnaSection />
      <HowItWorksSection />
      <BentoSection />
      <ScienceSection />
      <SocialProofSection />
      <PricingSection />
      <FaqSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
