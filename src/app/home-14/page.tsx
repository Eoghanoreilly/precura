"use client";

/**
 * =============================================================================
 * PRECURA / HOME 14 - "The Quarterly" (Magazine Cover)
 * =============================================================================
 *
 * A Round 3 landing page treatment where the hero reads like a printed
 * magazine cover rather than a product site. The beloved 3D terrain from
 * home-6 is present, but as a small "cover feature" widget nested into
 * the hero portrait, not a full-bleed showpiece.
 *
 * Section map:
 *   01  HERO               Magazine cover with huge headline + portrait
 *                          + 3D terrain as a nested widget
 *   02  PROBLEM            Ch 01 / The missed years essay
 *   03  ANNA'S STORY       Ch 02 / Feature spread with animated chart
 *   04  HOW IT WORKS       Ch 03 / Vertical editorial timeline
 *   05  FIVE PILLARS       Ch 04 / Department essays
 *   06  LIVING PROFILE     Ch 05 / "Not a report. A living profile."
 *   07  CAROUSEL           Ch 06 / Clickable editorial carousel
 *   08  TRUST & SCIENCE    Ch 07 / Doctor interview with footnotes
 *   09  MEMBER STORIES     Ch 08 / "Stories from the first 2,000 members"
 *   10  PRICING            Ch 09 / Subscription rate card
 *   11  FAQ                Ch 10 / Letters & answers
 *   12  FINAL CTA          Ch 11 / Back cover
 *   13  FOOTER             Imprint page
 *
 * Design constraint: "Magazine Cover". SF Pro Display set very large,
 * clean rules, drop caps, mono-type footnotes, no pastel blobs. Every
 * chapter opens with "Ch. N" in mono.
 *
 * Palette: warm cream paper, soft ink, a single rust accent used like
 * a spot color in print. The only dark section is the back cover.
 */

import React from "react";
import { Hero } from "./_components/Hero";
import { ProblemSection } from "./_components/ProblemSection";
import { AnnaStory } from "./_components/AnnaStory";
import { HowItWorks } from "./_components/HowItWorks";
import { FivePillars } from "./_components/FivePillars";
import { LivingProfile } from "./_components/LivingProfile";
import { FeatureCarousel } from "./_components/FeatureCarousel";
import { TrustScience } from "./_components/TrustScience";
import { MemberStories } from "./_components/MemberStories";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";
import { C, SYSTEM_FONT } from "./_components/tokens";

export default function Home14Page() {
  return (
    <main
      style={{
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        overflowX: "hidden",
      }}
    >
      <Hero />
      <ProblemSection />
      <AnnaStory />
      <HowItWorks />
      <FivePillars />
      <LivingProfile />
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
