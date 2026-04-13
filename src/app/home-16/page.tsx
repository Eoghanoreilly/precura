"use client";

import React from "react";
import { NavBar } from "./_components/NavBar";
import { Hero } from "./_components/Hero";
import { ProblemSection } from "./_components/ProblemSection";
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
import { COLORS } from "./_components/tokens";

/**
 * HOME-16 / "The Shopfront"
 *
 * Round-4 Precura landing page. Airbnb-warm, instant-value, subscription
 * focused. Cream canvas, coral accents, editorial ink. Every section below
 * is self-contained and styled inline against the shared tokens file.
 */
export default function Home16Page() {
  return (
    <main
      style={{
        background: COLORS.bgCream,
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Hero />
      <ProblemSection />
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
  );
}
