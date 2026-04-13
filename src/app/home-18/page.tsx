"use client";

import React from "react";
import { NavBar } from "./_components/NavBar";
import { BookerHero } from "./_components/BookerHero";
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

/**
 * HOME 18 - "CALM CLARITY"
 * ------------------------
 * Round-4 landing page for Precura. Warm paper canvas, lingon red accent,
 * a conviction-first hero that promises clarity (not a trip), followed by
 * a long-form funnel of proof and product reveal.
 *
 * Section order:
 * 1. NavBar            - sticky, minimal, paper surface
 * 2. BookerHero        - H1 conviction + compact tier preview
 * 3. ProblemSection    - why this exists (50% undiagnosed)
 * 4. AnnaStory         - the emotional anchor (Anna's 5-year drift)
 * 5. HowItWorks        - 3 chapters: Book / Understand / Act
 * 6. LivingProfile     - dark-mode contrast reveal of the product
 * 7. WhatYouGet        - the 5 pillars
 * 8. FeatureCarousel   - interactive product tour
 * 9. TrustScience      - Dr. Marcus + cited risk models
 * 10. MemberStories    - first-member stories
 * 11. Pricing          - 3 tiers, annual
 * 12. FAQ              - real questions
 * 13. FinalCTA         - confident close + disclaimer
 * 14. Footer           - legal + nav
 */
export default function Home18Page() {
  return (
    <main
      style={{
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <NavBar />
      <BookerHero />
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
