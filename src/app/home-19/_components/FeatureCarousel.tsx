"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * FEATURE CAROUSEL - Different from the hero tour. This is a deep dive
 * carousel: clickable cards on the bottom, large image + headline + story
 * on top. Think Airbnb experience category cards with a gallery.
 *
 * Six slides. Each is a deeper look at one aspect of the membership
 * (blood draw, doctor review, coach plan, living profile, AI chat, kit).
 */

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

const SLIDES: Slide[] = [
  {
    id: "draw",
    eyebrow: "Blood draw",
    title: "Karolinska lab, or at home",
    body:
      "Walk-in a Karolinska lab near you or get a home draw kit. Same accreditation, same panels, same lab pipeline as university research.",
    image: IMG.lab,
  },
  {
    id: "doctor",
    eyebrow: "Doctor review",
    title: "A note in plain Swedish",
    body:
      "Dr. Marcus reads your results before you do. You get a written note, a 20 minute video review if anything needs it, and the risk models run automatically.",
    image: IMG.doctor,
  },
  {
    id: "coach",
    eyebrow: "Coach plan",
    title: "Training tuned to your metabolism",
    body:
      "Your assigned coach writes a real plan, real sets, real reps, informed by your blood work. Reviewed by Dr. Marcus. Not generic 'exercise more' advice.",
    image: IMG.coach,
  },
  {
    id: "profile",
    eyebrow: "Living profile",
    title: "Your health file, always current",
    body:
      "Everything in one profile that keeps itself up to date. Every panel, every note, every training block, every retest. Visible to you, visible to your doctor.",
    image: IMG.annaCoffee,
  },
  {
    id: "ai",
    eyebrow: "AI that reads your file",
    title: "Ask anything about your own data",
    body:
      "Private AI assistant with your history loaded. Answers are specific to you, not generic health advice. Cites your last test when it speaks.",
    image: IMG.annaWalking,
  },
  {
    id: "kit",
    eyebrow: "Welcome kit",
    title: "A warm on-ramp, day one",
    body:
      "Home test kit, plain-English guide to your first panel, a physical card with Dr. Marcus on it, a welcome letter with your first booking already made.",
    image: IMG.kit,
  },
];

export function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const current = SLIDES[active];

  const next = () => setActive((a) => (a + 1) % SLIDES.length);
  const prev = () => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section
      style={{
        padding: "120px 32px 130px",
        background: C.creamDeep,
        fontFamily: SYSTEM_FONT,
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
            alignItems: "flex-end",
            gap: 24,
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                ...TYPE.label,
                color: C.coral,
                marginBottom: 16,
              }}
            >
              Take the slow tour
            </div>
            <h2
              style={{
                ...TYPE.displayL,
                margin: 0,
                maxWidth: 800,
              }}
            >
              A closer look at every{" "}
              <span
                style={{
                  color: C.coral,
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                part of your membership.
              </span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={prev}
              aria-label="Previous"
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: C.paper,
                border: `1px solid ${C.line}`,
                color: C.ink,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                boxShadow: C.shadow,
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: C.ink,
                border: `1px solid ${C.ink}`,
                color: C.paper,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                boxShadow: C.shadowLift,
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Active slide */}
        <div
          style={{
            position: "relative",
            borderRadius: 32,
            overflow: "hidden",
            background: C.paper,
            border: `1px solid ${C.line}`,
            boxShadow: C.shadowLift,
            minHeight: 460,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                minHeight: 460,
              }}
              className="home19-slide-grid"
            >
              <div
                style={{
                  position: "relative",
                  minHeight: 380,
                }}
              >
                <motion.div
                  key={`img-${current.id}`}
                  initial={{ scale: 1.06, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${current.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "56px 48px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    ...TYPE.micro,
                    color: C.coral,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(SLIDES.length).padStart(2, "0")}{" "}
                  {" "}
                  {current.eyebrow}
                </div>
                <h3
                  style={{
                    ...TYPE.displayM,
                    margin: 0,
                    marginBottom: 18,
                    color: C.ink,
                  }}
                >
                  {current.title}
                </h3>
                <p
                  style={{
                    ...TYPE.lead,
                    color: C.inkMuted,
                    margin: 0,
                  }}
                >
                  {current.body}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumb row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 14,
            marginTop: 22,
          }}
          className="home19-thumb-grid"
        >
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "14px 16px",
                  borderRadius: 16,
                  border: `1px solid ${isActive ? C.ink : C.line}`,
                  background: isActive ? C.ink : C.paper,
                  color: isActive ? C.paper : C.ink,
                  fontFamily: "inherit",
                  transition: "all 0.25s ease",
                  boxShadow: isActive ? C.shadowLift : "none",
                }}
              >
                <div
                  style={{
                    ...TYPE.micro,
                    color: isActive ? C.coralSoft : C.inkMuted,
                    marginBottom: 4,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: isActive ? C.paper : C.ink,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {s.eyebrow}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home19-slide-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home19-slide-grid > div:first-child) {
            min-height: 320px !important;
          }
          :global(.home19-thumb-grid) {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          :global(.home19-thumb-grid) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
