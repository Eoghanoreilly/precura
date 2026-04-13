"use client";

/**
 * home-9 / Parallax Editorial (Snow Fall 2026)
 *
 * A long form parallax editorial landing for Precura. Every section uses
 * multi-layer parallax (background photo, mid layer accents, foreground
 * copy) tied to its own scrollYProgress. Smooth scrolling is handled by
 * Lenis at the root level; reduced-motion visitors get flat layers.
 *
 * Sections (total scroll depth ~12000px on desktop):
 *   01 Hero
 *   02 The Problem ("50% of Swedes")
 *   03 Anna's Story (glucose drift + portrait)
 *   04 How It Works (3 photo stages)
 *   05 What You Get (6 photo feature rows)
 *   06 Trust and Science (doctor + citations)
 *   07 Social Proof (3 editorial quotes)
 *   08 Pricing (3 tiers, parallaxing)
 *   09 FAQ
 *   10 Final CTA
 *   11 Footer
 */

import React from "react";
import { ReactLenis } from "lenis/react";
import ScrollProgress from "./_components/ScrollProgress";
import Hero from "./_components/Hero";
import Problem from "./_components/Problem";
import AnnaStory from "./_components/AnnaStory";
import HowItWorks from "./_components/HowItWorks";
import WhatYouGet from "./_components/WhatYouGet";
import Trust from "./_components/Trust";
import Social from "./_components/Social";
import Pricing from "./_components/Pricing";
import FAQ from "./_components/FAQ";
import FinalCta from "./_components/FinalCta";
import Footer from "./_components/Footer";
import { C, FONT } from "./_components/tokens";

export default function Home9Page() {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        // Reasonable touch handling on mobile - disable to avoid iOS scroll jank
        syncTouch: false,
      }}
    >
      <main
        style={{
          background: C.cream,
          color: C.ink,
          fontFamily: FONT.ui,
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <ScrollProgress />
        <Hero />
        <Problem />
        <AnnaStory />
        <HowItWorks />
        <WhatYouGet />
        <Trust />
        <Social />
        <Pricing />
        <FAQ />
        <FinalCta />
        <Footer />
      </main>
    </ReactLenis>
  );
}
