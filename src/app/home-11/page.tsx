"use client";

/**
 * =============================================================================
 * PRECURA / HOME 11 - "MINIMAL AMBIENT"
 * =============================================================================
 *
 * Round 3. User feedback applied:
 *  - Keep the 3D terrain from home-6 (they love it)
 *  - Replace the noisy, busy hero with something clean and quiet
 *  - Add a clickable carousel (biomarker deep dives)
 *  - Use home-8's How It Works content as a VERTICAL flow (not horizontal)
 *  - Add "Not a report. A living profile." framing from home-10
 *  - Add "Stories from the first 2,000 members" section from home-10
 *  - Communicate the five Precura pillars clearly:
 *      1. Peer-reviewed risk models
 *      2. 40+ biomarkers, trajectory tracking
 *      3. A real named Swedish doctor (Dr. Marcus Johansson)
 *      4. A real coach and a real training plan (active health)
 *      5. A living profile, always updating
 *
 * Aesthetic: Swiss editorial restraint. Cream backgrounds, tight type
 * scale, single sage accent, generous whitespace, quiet motion. Think
 * Anthropic + Patek Philippe + rauno.me. Weather behind a window.
 *
 * Sections in order:
 *   01  HERO              Clean, editorial. 3D terrain as ambient bg.
 *   02  PROBLEM           50 % stat, five year ticker.
 *   03  ANNA'S STORY      Portrait + spare SVG line chart + pullquote.
 *   04  HOW IT WORKS      VERTICAL flow, 3 steps, rail fills on scroll.
 *   05  LIVING PROFILE    "Not a report. A living profile." explanation.
 *   06  WHAT YOU GET      Five pillars as editorial index rows.
 *   07  CAROUSEL          Clickable biomarker deep dives.
 *   08  TRUST & SCIENCE   Dr. Johansson + real citations + heritage.
 *   09  MEMBER STORIES    "Stories from the first 2,000 members."
 *   10  PRICING           Three tiers, middle highlighted.
 *   11  FAQ               Accordion, six honest answers.
 *   12  FINAL CTA         Quiet oversized closing statement.
 *   13  FOOTER            Spare columns + legal strip.
 */

import { SmoothScroll } from "./_components/SmoothScroll";
import { NavBar } from "./_components/NavBar";
import { Hero } from "./_components/Hero";
import { Problem } from "./_components/Problem";
import { AnnaStory } from "./_components/AnnaStory";
import { HowItWorks } from "./_components/HowItWorks";
import { LivingProfile } from "./_components/LivingProfile";
import { WhatYouGet } from "./_components/WhatYouGet";
import { BiomarkerCarousel } from "./_components/BiomarkerCarousel";
import { TrustScience } from "./_components/TrustScience";
import { MemberStories } from "./_components/MemberStories";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";
import { C, SYSTEM_FONT } from "./_components/tokens";

export default function Home11Page() {
  return (
    <>
      <SmoothScroll />
      <main
        style={{
          background: C.page,
          color: C.ink,
          fontFamily: SYSTEM_FONT,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          overflowX: "hidden",
        }}
      >
        <NavBar />
        <Hero />
        <Problem />
        <AnnaStory />
        <HowItWorks />
        <LivingProfile />
        <WhatYouGet />
        <BiomarkerCarousel />
        <TrustScience />
        <MemberStories />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
