"use client";

/**
 * =============================================================================
 * PRECURA / HOME 10 - "MIXED-MEDIA AWARD GALLERY"
 * =============================================================================
 *
 * Round 2. The constraint: every major section uses a DIFFERENT primary
 * animation technique, so the visitor keeps being surprised. Coherence
 * comes from the shared palette, typography and tone of voice.
 *
 * Section map (technique per section):
 *   01  HERO              Canvas particle field + staggered word rise
 *   02  PROBLEM           Animated SVG line chart draw on scroll
 *   03  ANNA'S STORY      Horizontal scroll-pinned carousel
 *   04  HOW IT WORKS      3D isometric scene (react-three-fiber)
 *   05  WHAT YOU GET      Bespoke mosaic grid, cursor-reactive cards
 *   06  TRUST & SCIENCE   Multi-layer parallax portrait + citations
 *   07  SOCIAL PROOF      Auto-advancing cross-fade quote carousel
 *   08  PRICING           Scroll-revealed tiers + annual/monthly toggle
 *   09  FAQ               Spring-physics accordion
 *   10  FINAL CTA         Clip-mask text reveal + magnetic button
 *   11  FOOTER            Giant wordmark + live Stockholm clock
 *
 * Palette: warm cream + editorial ink + terracotta amber + clinical sage.
 * Typography: Apple system only. All font sizes and weights declared
 * inline inside tokens.ts. No Google Fonts. No unicode arrows.
 * No em/en dashes.
 */

import React from "react";
import { SmoothScroll } from "./_components/SmoothScroll";
import { NavBar } from "./_components/NavBar";
import { Hero } from "./_components/Hero";
import { ProblemSection } from "./_components/ProblemSection";
import { AnnaStory } from "./_components/AnnaStory";
import { HowItWorks } from "./_components/HowItWorks";
import { WhatYouGet } from "./_components/WhatYouGet";
import { TrustScience } from "./_components/TrustScience";
import { SocialProof } from "./_components/SocialProof";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";
import { C, SYSTEM_FONT } from "./_components/tokens";

export default function Home10Page() {
  return (
    <>
      <SmoothScroll />
      <main
        style={{
          background: C.cream,
          color: C.ink,
          fontFamily: SYSTEM_FONT,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          overflowX: "hidden",
        }}
      >
        <NavBar />
        <Hero />
        <ProblemSection />
        <AnnaStory />
        <HowItWorks />
        <WhatYouGet />
        <TrustScience />
        <SocialProof />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
