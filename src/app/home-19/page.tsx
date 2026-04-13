"use client";

/**
 * =============================================================================
 * PRECURA / HOME 19 - "THE GUIDED TOUR"
 * =============================================================================
 *
 * Round 4. The pivot: away from cinematic 3D hero pages, toward Airbnb-warm,
 * subscription-focused, INSTANT value. Hero is a clickable product tour
 * (4 tabs, auto-advance) so the visitor sees what they actually get in 2
 * seconds, no scroll required. Everything below reinforces the subscription
 * idea with warmth, craft and honest science.
 *
 * Section map:
 *   01  HERO TOUR         Interactive product tour with 4 preview tabs
 *   02  PROBLEM           50% undiagnosed. Simple typographic stat
 *   03  ANNA              Anna's 5-year glucose story
 *   04  HOW IT WORKS      Vertical 3-step flow
 *   05  LIVING PROFILE    "Not a report. A living profile."
 *   06  WHAT YOU GET      Deeper breakdown - the 6 things
 *   07  CAROUSEL          Clickable feature carousel (different from hero tour)
 *   08  TRUST + SCIENCE   Dr. Marcus + research citations
 *   09  MEMBER STORIES    "Stories from the first 2,000 members"
 *   10  PRICING           3 tiers with Member highlighted
 *   11  FAQ               Expandable accordion
 *   12  FINAL CTA         Warm membership invitation
 *   13  FOOTER            Wordmark, columns, plus Stockholm clock
 *
 * Palette: cream + ink + coral + sage + amber. Apple system font only.
 * No em dashes, no unicode arrows, no 3D, no scroll-locked stages.
 */

import React from "react";
import { NavBar } from "./_components/NavBar";
import { HeroTour } from "./_components/HeroTour";
import { ProblemSection } from "./_components/ProblemSection";
import { AnnaStory } from "./_components/AnnaStory";
import { HowItWorks } from "./_components/HowItWorks";
import { LivingProfile } from "./_components/LivingProfile";
import { WhatYouGet } from "./_components/WhatYouGet";
import { FeatureCarousel } from "./_components/FeatureCarousel";
import { TrustScience } from "./_components/TrustScience";
import { MemberStories } from "./_components/MemberStories";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";
import { C, SYSTEM_FONT } from "./_components/tokens";

export default function Home19Page() {
  return (
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
      <HeroTour />
      <ProblemSection />
      <AnnaStory />
      <HowItWorks />
      <LivingProfile />
      <WhatYouGet />
      <FeatureCarousel />
      <TrustScience />
      <MemberStories />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
