"use client";

import React from "react";
import { NavBar } from "./_components/NavBar";
import { Hero } from "./_components/Hero";
import { ProblemSection } from "./_components/ProblemSection";
import { AnnaStory } from "./_components/AnnaStory";
import { CatalogueGrid } from "./_components/CatalogueGrid";
import { HowItWorks } from "./_components/HowItWorks";
import { LivingProfile } from "./_components/LivingProfile";
import { WhatYouGet } from "./_components/WhatYouGet";
import { PerkCarousel } from "./_components/PerkCarousel";
import { TrustScience } from "./_components/TrustScience";
import { MemberStories } from "./_components/MemberStories";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";
import { C, SYSTEM_FONT } from "./_components/tokens";

/**
 * home-20 - "The Catalogue"
 *
 * Round-4 Airbnb-warm landing for Precura. Cream canvas, terracotta
 * accents, sage for trust, editorial ink typography, real Unsplash
 * imagery throughout. Section order:
 *
 * Round-4 refinement: Hero is single-focused (problem-first headline,
 * Werlabs price anchor, Dr. Marcus portrait). The 8-card catalogue has
 * been relocated to its own section (CatalogueGrid) after AnnaStory,
 * where "everything in your membership" is the right promise.
 *
 * NavBar -> Hero -> ProblemSection -> AnnaStory -> CatalogueGrid ->
 * HowItWorks -> LivingProfile -> WhatYouGet -> PerkCarousel ->
 * TrustScience -> MemberStories -> Pricing -> FAQ -> FinalCTA -> Footer
 */
export default function Home20Page() {
  return (
    <main
      style={{
        background: C.cream,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <NavBar />
      <Hero />
      <ProblemSection />
      <AnnaStory />
      <CatalogueGrid />
      <HowItWorks />
      <LivingProfile />
      <WhatYouGet />
      <PerkCarousel />
      <TrustScience />
      <MemberStories />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
