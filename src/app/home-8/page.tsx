"use client";

import SmoothScroll from "./_components/SmoothScroll";
import NavBar from "./_components/NavBar";
import Hero from "./_components/Hero";
import Problem from "./_components/Problem";
import AnnaStory from "./_components/AnnaStory";
import TransitionStrip from "./_components/TransitionStrip";
import HowItWorks from "./_components/HowItWorks";
import WhatYouGet from "./_components/WhatYouGet";
import TrustScience from "./_components/TrustScience";
import SocialProof from "./_components/SocialProof";
import Pricing from "./_components/Pricing";
import FAQ from "./_components/FAQ";
import FinalCTA from "./_components/FinalCTA";
import Footer from "./_components/Footer";
import { colors, fontStack } from "./_components/tokens";

/**
 * HOME-8 / Cinematic horizontal-vertical hybrid.
 *
 * 10 full sections plus transition strips and footer.
 * Three horizontal-pinned sections break up the vertical flow:
 *   - Anna's Story (5 panels)
 *   - How It Works (4 panels)
 *   - What You Get (6 panels)
 *
 * Total scroll depth roughly 13x viewport height on desktop, giving
 * the page its "film reel in the middle of a landing page" feel.
 */
export default function Home8Page() {
  return (
    <SmoothScroll>
      <main
        style={{
          background: colors.ivory,
          color: colors.ink,
          fontFamily: fontStack.display,
          fontWeight: 400,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <NavBar />

        {/* 1. HERO */}
        <Hero />

        {/* 2. PROBLEM */}
        <Problem />

        {/* Transition into horizontal 1 */}
        <TransitionStrip
          label="01 / Vertical becomes horizontal"
          caption="Scroll down, and sideways"
          bg={colors.parchment}
        />

        {/* 3. ANNA'S STORY (horizontal pinned, 5 panels) */}
        <AnnaStory />

        {/* Transition out of horizontal 1 */}
        <TransitionStrip
          label="02 / From story to product"
          caption="How Precura reads five years at once"
          bg={colors.ivory}
        />

        {/* 4. HOW IT WORKS (horizontal pinned, 4 panels) */}
        <HowItWorks />

        {/* Transition between horizontal 2 and 3 */}
        <TransitionStrip
          label="03 / Six things on day one"
          caption="Everything you unlock with a single blood test"
          bg={colors.ink}
          fg={colors.ivory}
        />

        {/* 5. WHAT YOU GET (horizontal pinned, 6 panels) */}
        <WhatYouGet />

        {/* 6. TRUST & SCIENCE */}
        <TrustScience />

        {/* 7. SOCIAL PROOF */}
        <SocialProof />

        {/* 8. PRICING */}
        <Pricing />

        {/* 9. FAQ */}
        <FAQ />

        {/* 10. FINAL CTA */}
        <FinalCTA />

        {/* 11. FOOTER */}
        <Footer />
      </main>
    </SmoothScroll>
  );
}
