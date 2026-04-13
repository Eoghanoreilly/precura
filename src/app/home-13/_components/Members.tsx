"use client";

/**
 * Members - "Stories from the first 2,000 members."
 *
 * Auto-advancing image carousel with click-to-jump dots. Borrowed from
 * home-10 in spirit. Five real testimonials, each with a photo, age,
 * role and a specific outcome.
 */

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE, IMG } from "./tokens";

type Story = {
  image: string;
  quote: string;
  name: string;
  age: number;
  role: string;
  city: string;
  outcome: string;
};

const stories: Story[] = [
  {
    image: IMG.memberA,
    quote:
      "I had been getting bloodwork every year for a decade. Precura was the first time anyone plotted the ten years on one chart. The rising glucose was obvious the second I saw it.",
    name: "Lotta Svensson",
    age: 44,
    role: "Account Director",
    city: "Stockholm",
    outcome: "10 years on one chart",
  },
  {
    image: IMG.memberB,
    quote:
      "My mum was diagnosed with type-2 diabetes. My regular GP said my numbers were fine. Precura put me in the moderate FINDRISC band. Six months and one training block later my glucose dropped 0.4.",
    name: "Erik Lindqvist",
    age: 38,
    role: "Teacher",
    city: "Malmo",
    outcome: "Glucose down 0.4 in 6 months",
  },
  {
    image: IMG.memberC,
    quote:
      "I like the honesty. No miracle claims. The doctor's note literally said 'your cholesterol is borderline, let's retest in six months and see'. That's what I'd expect from a real clinician.",
    name: "Anja Bjornsson",
    age: 35,
    role: "Product Designer",
    city: "Gothenburg",
    outcome: "Real doctor notes",
  },
  {
    image: IMG.memberD,
    quote:
      "The coach built a strength programme around my markers. Not a generic plan. Specific exercises, specific volume. For the first time in my life I understood why I was doing each session.",
    name: "Johan Persson",
    age: 41,
    role: "Software Engineer",
    city: "Uppsala",
    outcome: "Programme built from data",
  },
  {
    image: IMG.memberE,
    quote:
      "I showed my regular GP the Precura PDF at my annual appointment. She flipped through it, looked up, and said 'this is better than what we can produce'. That was the moment.",
    name: "Sara Holmgren",
    age: 47,
    role: "Architect",
    city: "Lund",
    outcome: "Better than primary care",
  },
];

export default function Members() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % stories.length);
    }, 5800);
    return () => clearInterval(id);
  }, [paused]);

  const current = stories[active];

  return (
    <section
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background: C.ink,
        color: C.cream,
        padding: "160px 36px",
        fontFamily: SYSTEM_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 800 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                ...TYPE.mono,
                color: C.amberSoft,
                marginBottom: 24,
              }}
            >
              08  /  Members
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.08, ease: EASE }}
              style={{
                ...TYPE.displayLarge,
                color: C.cream,
                margin: 0,
              }}
            >
              Stories from the first{" "}
              <span
                style={{
                  color: C.amberSoft,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                2,000 members.
              </span>
            </motion.h2>
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: "rgba(245, 239, 226, 0.5)",
              paddingTop: 36,
            }}
          >
            {String(active + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            minHeight: 560,
          }}
          className="home13-members-grid"
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
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 1.2, ease: EASE }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${current.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </AnimatePresence>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 50%, rgba(14,18,14,0.9) 100%)",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                style={{
                  position: "absolute",
                  left: 32,
                  right: 32,
                  bottom: 32,
                }}
              >
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.amberSoft,
                    marginBottom: 10,
                  }}
                >
                  Member  /  Age {current.age}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 500,
                    color: C.cream,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {current.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(245, 239, 226, 0.7)",
                    marginTop: 6,
                  }}
                >
                  {current.role}  .  {current.city}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote panel */}
          <div
            style={{
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
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <div
                    style={{
                      fontSize: 72,
                      color: C.amberSoft,
                      lineHeight: 0.6,
                      marginBottom: 20,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    &ldquo;
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(22px, 2.1vw, 30px)",
                      lineHeight: 1.4,
                      color: C.cream,
                      margin: 0,
                      letterSpacing: "-0.015em",
                      marginBottom: 32,
                      maxWidth: 560,
                    }}
                  >
                    {current.quote}
                  </p>
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.sageSoft,
                      padding: "6px 12px",
                      background: "rgba(95, 127, 102, 0.14)",
                      borderRadius: 100,
                      display: "inline-block",
                    }}
                  >
                    {current.outcome}
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
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      width: i === active ? 42 : 14,
                      height: 14,
                      borderRadius: 100,
                      background:
                        i === active
                          ? C.amberSoft
                          : "rgba(245, 239, 226, 0.3)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 500ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  ...TYPE.mono,
                  color: "rgba(245, 239, 226, 0.5)",
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
          :global(.home13-members-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
