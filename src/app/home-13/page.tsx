"use client";

/**
 * /home-13 - "Reveal Terrain"
 *
 * Round 3 Precura landing page. The user loved home-6's 3D topographic hero
 * but said its first frame was too noisy. This version defers ALL visual
 * complexity: the first viewport is pure typography on cream paper, and the
 * 3D terrain dramatically reveals underneath the headline as the user starts
 * to scroll.
 *
 * Required sections (13):
 *   1. Reveal Hero  - text-only first frame, sticky 3D reveal second frame
 *   2. Problem      - the quiet drift nobody saw
 *   3. Anna's story - editorial image + narrative + glucose chart
 *   4. How It Works - VERTICAL 5-step rail (not horizontal)
 *   5. Living Profile - "Not a report. A living profile." (borrowed from home-10)
 *   6. What You Get - 6-feature mosaic, covers the 5 pillars
 *   7. Clickable Carousel - explore the profile
 *   8. Trust & Science - Dr. Marcus Johansson + cited studies
 *   9. Members - "Stories from the first 2,000 members." (borrowed from home-10)
 *  10. Pricing - 3 tiers (995 / 2995 / 4995 SEK)
 *  11. FAQ - 6 accordion questions
 *  12. Final CTA
 *  13. Footer
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Lenis from "lenis";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Plus,
  Minus,
  Check,
  Quote as QuoteIcon,
} from "lucide-react";

import { C, SYSTEM_FONT, TYPE, EASE, IMG } from "./_components/tokens";
import Problem from "./_components/Problem";
import AnnaStory from "./_components/AnnaStory";
import HowItWorks from "./_components/HowItWorks";
import LivingProfile from "./_components/LivingProfile";
import WhatYouGet from "./_components/WhatYouGet";
import ProfileCarousel from "./_components/ProfileCarousel";
import TrustScience from "./_components/TrustScience";
import Members from "./_components/Members";
import Pricing from "./_components/Pricing";
import FAQ from "./_components/FAQ";
import FinalCTA from "./_components/FinalCTA";
import Footer from "./_components/Footer";

// 3D hero is client-only. We pass an `active` flag so the Canvas only mounts
// once the reveal zone enters the viewport.
const Hero3D = dynamic(() => import("./_components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 100% 70% at 50% 55%, #1A140E 0%, #0E0A07 60%, #070503 100%)",
      }}
    />
  ),
});

// ---------------------------------------------------------------------------
// Top nav. Starts transparent over the cream first frame, gains a blur
// background once the user scrolls past the first viewport.
// ---------------------------------------------------------------------------
function TopNav({ dark }: { dark: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navTextColor = dark
    ? "rgba(245,239,226,0.85)"
    : scrolled
    ? C.ink
    : C.inkSoft;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "18px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? dark
            ? "rgba(14, 10, 7, 0.6)"
            : "rgba(245, 239, 226, 0.75)"
          : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? `1px solid ${dark ? "rgba(245,239,226,0.1)" : C.line}`
          : "1px solid transparent",
        transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <Link
        href="/home-13"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: navTextColor,
          letterSpacing: "-0.01em",
          fontWeight: 600,
          fontSize: 17,
          transition: "color 500ms",
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
        style={{
          display: "flex",
          gap: 36,
          alignItems: "center",
          fontSize: 14,
          color: navTextColor,
          transition: "color 500ms",
        }}
        className="home13-nav-links"
      >
        <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>
          How it works
        </a>
        <a href="#what" style={{ color: "inherit", textDecoration: "none" }}>
          What you get
        </a>
        <a href="#science" style={{ color: "inherit", textDecoration: "none" }}>
          Science
        </a>
        <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>
          Pricing
        </a>
      </div>
      <button
        style={{
          padding: "10px 20px",
          borderRadius: 999,
          background: dark ? C.cream : C.ink,
          color: dark ? C.ink : C.cream,
          border: "none",
          fontFamily: SYSTEM_FONT,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: "-0.01em",
          transition: "all 400ms",
        }}
      >
        Get started
      </button>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-nav-links) {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// REVEAL HERO
// ---------------------------------------------------------------------------
// Choreography:
//   [0,    1vh]    - nothing is moving. Just typography on cream.
//   [0,   60vh]    - subtle downward drift on the hero headline.
//   [50vh, 120vh]  - headline slides up and fades out.
//   [80vh, 140vh]  - reveal container opacity 0 -> 1. 3D terrain mounts.
//   [90vh, 150vh]  - terrain scales from 0.92 -> 1.0.
//   [100vh, 160vh] - caption text slides in from the right.
//   [160vh, 200vh] - the whole reveal container fades down and yields the page.
//
// Total hero zone = 200vh. After that, real content starts.
//
// The reveal section is a sticky 100vh container pinned between the first
// viewport and the rest of the page. That lets the 3D sit still under the
// text while the text slides, which is the dramatic "reveal" moment.
// ---------------------------------------------------------------------------
function RevealHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [canvasActive, setCanvasActive] = useState(false);

  // Scroll progress of the reveal zone, 0 at zone start, 1 at zone end
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Typography phase: quiet first frame
  const textY = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, -40, -200]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.45],
    [1, 0.95, 0.25, 0]
  );
  const subOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.32, 0.4],
    [1, 0.9, 0.2, 0]
  );

  // Scroll indicator - visible only at very top
  const indicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18],
    [1, 0.6, 0]
  );

  // 3D reveal
  const revealOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.82, 1],
    [0, 1, 1, 0.2]
  );
  const revealScale = useTransform(
    scrollYProgress,
    [0.3, 0.6, 0.9],
    [0.92, 1, 1.04]
  );

  // Caption
  const captionX = useTransform(scrollYProgress, [0.4, 0.6], [60, 0]);
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.58, 0.82, 1],
    [0, 1, 1, 0.1]
  );

  // Trigger Canvas mount once we cross 20% of reveal progress
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.2 && !canvasActive) setCanvasActive(true);
  });

  // Ticker for the small bottom-left "live" indicator
  const [ticker, setTicker] = useState(5.8);
  useEffect(() => {
    const id = setInterval(() => {
      setTicker((v) => +(5.78 + Math.random() * 0.04).toFixed(2));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: "relative",
        height: "260vh",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Sticky viewport - stays pinned while the parent scrolls */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* 3D reveal layer. Sits behind the text at first. */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            opacity: revealOpacity,
            scale: revealScale,
            transformOrigin: "center 60%",
            zIndex: 1,
          }}
        >
          <Hero3D active={canvasActive} />

          {/* Soft vignette at the edges so the scene fades into the page */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 95% 70% at 50% 55%, transparent 45%, rgba(14,10,7,0.85) 100%)",
            }}
          />
        </motion.div>

        {/* Quiet first-frame typography. Lives above the 3D layer. */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            y: textY,
            opacity: textOpacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 32px",
            pointerEvents: "none",
          }}
        >
          {/* Tiny top label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 40,
            }}
          >
            Precura  /  A living health profile
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            style={{
              ...TYPE.displayMega,
              color: C.ink,
              margin: 0,
              textAlign: "center",
              maxWidth: 1200,
            }}
          >
            See what your
            <br />
            blood is{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: C.amberDeep,
              }}
            >
              quietly
            </span>{" "}
            saying.
          </motion.h1>

          <motion.p
            style={{
              ...TYPE.lead,
              color: C.inkMid,
              maxWidth: 580,
              textAlign: "center",
              marginTop: 32,
              opacity: subOpacity,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: EASE }}
          >
            Predictive, preventative, and personal. A Swedish GP, 40+ biomarkers
            and six validated clinical models working together on your data.
          </motion.p>
        </motion.div>

        {/* Scroll indicator - fades out once the reveal begins */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 48,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: indicatorOpacity,
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              color: C.inkMuted,
              fontFamily: SYSTEM_FONT,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            <span>Scroll to reveal</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={14} strokeWidth={1.8} />
            </motion.div>
          </div>
        </motion.div>

        {/* Caption on right side - appears with the terrain */}
        <motion.div
          style={{
            position: "absolute",
            right: 48,
            bottom: 80,
            zIndex: 5,
            maxWidth: 320,
            x: captionX,
            opacity: captionOpacity,
            color: C.cream,
            fontFamily: SYSTEM_FONT,
          }}
          className="home13-reveal-caption"
        >
          <div
            style={{
              ...TYPE.mono,
              color: C.amberSoft,
              marginBottom: 14,
            }}
          >
            Fig. 01  /  Five-year glucose drift
          </div>
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: C.cream,
              fontWeight: 400,
            }}
          >
            Anna&apos;s fasting glucose slowly rose from 5.0 to 5.8 mmol/L.
            Rendered as landscape, the slope is impossible to miss.
          </div>
        </motion.div>

        {/* Live ticker bottom-left */}
        <motion.div
          style={{
            position: "absolute",
            left: 48,
            bottom: 48,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: captionOpacity,
            color: "rgba(245, 239, 226, 0.85)",
          }}
          className="home13-reveal-ticker"
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.amberSoft,
              boxShadow: "0 0 16px rgba(228, 184, 150, 0.6)",
            }}
          />
          <span
            style={{
              ...TYPE.mono,
              color: "rgba(245, 239, 226, 0.7)",
            }}
          >
            Live  /  Patient ID 198507220148
          </span>
          <span
            style={{
              fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
              fontSize: 13,
              color: C.cream,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {ticker.toFixed(2)} mmol/L
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-reveal-caption) {
            right: 24px !important;
            left: 24px !important;
            bottom: 120px !important;
            max-width: none !important;
          }
          :global(.home13-reveal-ticker) {
            left: 24px !important;
            bottom: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main page export
// ---------------------------------------------------------------------------
export default function Home13Page() {
  const [darkNav, setDarkNav] = useState(false);

  // Lenis smooth scroll. Same recipe as home-6 but tuned slightly.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Switch nav to dark mode while we're over the 3D reveal zone
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      // Reveal zone is 260vh starting at top. We want dark nav from ~80vh to
      // ~240vh.
      setDarkNav(y > vh * 0.8 && y < vh * 2.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      style={{
        background: C.cream,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      <TopNav dark={darkNav} />
      <RevealHero />
      <Problem />
      <AnnaStory />
      <HowItWorks />
      <LivingProfile />
      <WhatYouGet />
      <ProfileCarousel />
      <TrustScience />
      <Members />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
