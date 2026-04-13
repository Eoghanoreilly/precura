"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * SOCIAL PROOF - Technique: Auto-advancing quote carousel with photo
 * backgrounds, smooth cross-fade between slides, progress ticker.
 * User can also click the navigation dots to jump.
 */
export function SocialProof() {
  const testimonials = [
    {
      image: IMG.testimonial1,
      quote:
        "I've been getting annual bloodwork for 10 years. Precura was the first time anyone showed me the trend across those ten years. The rising glucose was obvious once I saw it on one chart.",
      name: "Lotta Svensson",
      role: "Account Director, Stockholm",
      age: 44,
      highlight: "10 years of data, one chart",
    },
    {
      image: IMG.testimonial2,
      quote:
        "My mum was diagnosed with T2D. I went to my regular GP, she said my numbers were fine. Precura's risk model said I was in the moderate band for diabetes. I made changes. Six months later my glucose dropped.",
      name: "Erik Lindqvist",
      role: "Teacher, Malmo",
      age: 38,
      highlight: "Caught a moderate risk early",
    },
    {
      image: IMG.testimonial3,
      quote:
        "What I like is the honesty. No miracle promises. The doctor's note on my results actually said 'your cholesterol is borderline, let's retest in six months and see'. That's what I'd expect from a real clinician.",
      name: "Anja Bjornsson",
      role: "Product Designer, Gothenburg",
      age: 35,
      highlight: "Real doctor notes",
    },
  ];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const current = testimonials[active];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        background: C.ink,
        color: C.cream,
        padding: "160px 32px 160px",
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                ...TYPE.mono,
                color: C.amber,
                padding: "6px 12px",
                border: `1px solid ${C.amber}`,
                borderRadius: 100,
                display: "inline-block",
                marginBottom: 20,
              }}
            >
              06 / MEMBERS
            </div>
            <h2
              style={{
                ...TYPE.displayLarge,
                color: C.cream,
                margin: 0,
              }}
            >
              Stories from the first{" "}
              <span style={{ color: C.amber, fontStyle: "italic" }}>
                2,000 members.
              </span>
            </h2>
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: C.inkFaint,
              paddingTop: 36,
            }}
          >
            {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </div>
        </div>

        {/* Carousel */}
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            minHeight: 560,
          }}
          className="home10-social-grid"
        >
          {/* Image panel */}
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: C.inkSoft,
              minHeight: 520,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${current.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </AnimatePresence>

            {/* Bottom gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 50%, rgba(12,14,11,0.9) 100%)",
              }}
            />

            {/* Name caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: 32,
                  right: 32,
                }}
              >
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.amber,
                    marginBottom: 8,
                  }}
                >
                  PRECURA MEMBER / AGE {current.age}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: C.cream,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    marginBottom: 4,
                  }}
                >
                  {current.name}
                </div>
                <div style={{ ...TYPE.small, color: C.creamDeep }}>
                  {current.role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote panel */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "40px 0",
            }}
          >
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    style={{
                      fontSize: 72,
                      color: C.amber,
                      lineHeight: 0.6,
                      marginBottom: 20,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    "
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(22px, 2.2vw, 30px)",
                      lineHeight: 1.4,
                      color: C.cream,
                      margin: 0,
                      fontWeight: 400,
                      letterSpacing: "-0.015em",
                      marginBottom: 32,
                    }}
                  >
                    {current.quote}
                  </p>

                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.sage,
                      padding: "6px 12px",
                      background: "rgba(107,143,113,0.12)",
                      borderRadius: 100,
                      display: "inline-block",
                    }}
                  >
                    {current.highlight}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 40,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      width: i === active ? 42 : 14,
                      height: 14,
                      borderRadius: 100,
                      background: i === active ? C.amber : C.inkMuted,
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkFaint,
                }}
              >
                {paused ? "PAUSED" : "AUTO-ADVANCING"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-social-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
