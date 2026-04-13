"use client";

/**
 * /home-12 - Precura R3 "Split Classical".
 *
 * Round 3 brief was "cleaner", "add a carousel", "vertical how it works",
 * "keep the 3D terrain", "borrow Not a report. A living profile. and
 * Stories from the first 2,000 members from home-10". This page is the
 * most disciplined, grown-up answer of the five parallel designs.
 *
 * Shape:
 *  - Hero is a classical 12-column split. Left: typography + CTAs.
 *    Right: a contained rounded panel with the real 3D terrain inside,
 *    clipped to a golden-ratio-ish rectangle. The 3D feels like a
 *    premium interactive preview, not a cinematic take-over.
 *  - The rest of the page follows the same 12-column grid. Left-aligned
 *    text, generous leading, consistent section spacing, one accent.
 *
 * Sections: 1 Nav, 2 Hero, 3 Problem, 4 Anna's story, 5 How it works
 * (VERTICAL), 6 Living profile, 7 What you get, 8 Library carousel,
 * 9 Trust & science, 10 Member stories, 11 Pricing, 12 FAQ, 13 Final
 * CTA, 14 Footer.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { C, FONT } from "./_components/tokens";

import { NavBar } from "./_components/NavBar";
import { Hero } from "./_components/Hero";
import { ProblemSection } from "./_components/ProblemSection";
import { AnnaStory } from "./_components/AnnaStory";
import { HowItWorks } from "./_components/HowItWorks";
import { LivingProfile } from "./_components/LivingProfile";
import { WhatYouGet } from "./_components/WhatYouGet";
import { Carousel } from "./_components/Carousel";
import { TrustScience } from "./_components/TrustScience";
import { MemberStories } from "./_components/MemberStories";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";
import { FinalCTA } from "./_components/FinalCTA";
import { Footer } from "./_components/Footer";

export default function Home12Page() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <main
      style={{
        background: C.paper,
        color: C.ink,
        fontFamily: FONT,
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
      <LivingProfile />
      <WhatYouGet />
      <Carousel />
      <TrustScience />
      <MemberStories />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
