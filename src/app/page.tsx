"use client";

import React from "react";
import { NavBar } from "@/components/home/NavBar";
import { Hero } from "@/components/home/Hero";
import { ProblemStrip } from "@/components/home/ProblemStrip";
import { AnnaSection } from "@/components/home/AnnaSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LivingProfile } from "@/components/home/LivingProfile";
import { WhatYouGet } from "@/components/home/WhatYouGet";
import { MemberCarousel } from "@/components/home/MemberCarousel";
import { TrustScience } from "@/components/home/TrustScience";
import { StoriesSection } from "@/components/home/StoriesSection";
import { Pricing } from "@/components/home/Pricing";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Footer } from "@/components/home/Footer";
import { C, SYSTEM_FONT } from "@/components/home/tokens";

export default function HomePage() {
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
