"use client";

/**
 * =============================================================================
 * PRECURA / HOME 17 - "THE WELCOME KIT"
 * =============================================================================
 *
 * Round 4. Airbnb-warm aesthetic. Subscription-first. INSTANT value.
 *
 * Core metaphor: arriving on the page feels like receiving a welcome kit.
 * The hero shows a visual "flat lay" of what you get when you become a
 * member - test kit, membership card, doctor note, training card, pillar
 * ring. No scroll required to understand what you're buying.
 *
 * Section map:
 *   01  NAV              Slim warm nav with inline pricing anchor
 *   02  HERO             Welcome Kit flat lay, INSTANT value, pricing visible
 *   03  PROBLEM          Brief - "50% of Swedes with T2D don't know"
 *   04  ANNA             Editorial portrait + data reveal
 *   05  HOW IT WORKS     Vertical 3-step flow with warm illustrations
 *   06  LIVING PROFILE   "Not a report. A living profile." with tabs
 *   07  WHAT YOU GET     5 kit items, deeper elaboration
 *   08  CAROUSEL         Clickable interactive carousel of members
 *   09  TRUST            Dr. Marcus + science citations
 *   10  STORIES          2000 members testimonials
 *   11  PRICING          3 tiers, Member highlighted
 *   12  FAQ              Interactive accordion
 *   13  CTA + FOOTER     Final invitation
 */

import React from "react";
import { NavBar } from "./_components/NavBar";
import { Hero } from "./_components/Hero";
import { ProblemStrip } from "./_components/ProblemStrip";
import { AnnaSection } from "./_components/AnnaSection";
import { HowItWorks } from "./_components/HowItWorks";
import { LivingProfile } from "./_components/LivingProfile";
import { WhatYouGet } from "./_components/WhatYouGet";
import { MemberCarousel } from "./_components/MemberCarousel";
import { TrustScience } from "./_components/TrustScience";
import { StoriesSection } from "./_components/StoriesSection";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";
import { C, SYSTEM_FONT } from "./_components/tokens";

export default function Home17Page() {
  return (
    <main
      style={{
        background: C.canvas,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        overflowX: "hidden",
      }}
    >
      <NavBar />
      <Hero />
      <ProblemStrip />
      <AnnaSection />
      <HowItWorks />
      <LivingProfile />
      <WhatYouGet />
      <MemberCarousel />
      <TrustScience />
      <StoriesSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
