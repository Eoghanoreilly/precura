"use client";

/**
 * Precura / home-7
 * Theater-Mode Scroll Stages
 *
 * An 11-chapter cinematic landing page. Each stage pins to the viewport and
 * plays a choreographed reveal as the visitor scrolls through it. Pinning is
 * done with sticky positioning plus framer-motion useScroll/useTransform,
 * which is more reliable with React 19 + Next 16 than GSAP ScrollTrigger and
 * plays nicely with Lenis smooth scroll.
 *
 * SSR notes:
 *  - Everything is "use client".
 *  - useScroll reads from a sectionRef, never the window directly.
 *  - Mobile fallback below 768px disables pinning and shows a simpler stack.
 *
 * Real copy throughout. Real mock data where it makes the story land.
 */

import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import SmoothScroll from "./_components/SmoothScroll";
import { getMarkerHistory } from "@/lib/v2/mock-patient";

// ---------------------------------------------------------------------------
// Design tokens (inline, no CSS vars)
// ---------------------------------------------------------------------------

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

const COLORS = {
  // Warm paper stack
  paper: "#F4EEE2",
  paperDeep: "#ECE3D0",
  ink: "#0F0E0C",
  inkSoft: "rgba(15, 14, 12, 0.68)",
  inkMute: "rgba(15, 14, 12, 0.42)",
  inkFaint: "rgba(15, 14, 12, 0.22)",
  rule: "rgba(15, 14, 12, 0.12)",
  // Signal colors
  ember: "#C84018",
  emberSoft: "#E86A3A",
  amber: "#C98A22",
  forest: "#2E5A3A",
  forestSoft: "#74936B",
  sage: "#93B085",
  ocean: "#12394A",
  // Zones (low alpha for chart fills)
  zNormal: "rgba(147, 176, 133, 0.22)",
  zBorder: "rgba(201, 138, 34, 0.22)",
  zRisk: "rgba(200, 64, 24, 0.22)",
  // Night stage
  night: "#0B0F14",
  nightCard: "#121821",
  nightText: "rgba(244, 238, 226, 0.94)",
  nightDim: "rgba(244, 238, 226, 0.6)",
  nightFaint: "rgba(244, 238, 226, 0.32)",
  nightRule: "rgba(244, 238, 226, 0.12)",
};

// ---------------------------------------------------------------------------
// Imagery (Unsplash direct URLs)
// ---------------------------------------------------------------------------

const IMG = {
  heroSky:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=85&auto=format&fit=crop",
  stockholm:
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=2400&q=85&auto=format&fit=crop",
  anna:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=85&auto=format&fit=crop",
  lab:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=2400&q=85&auto=format&fit=crop",
  doctor:
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=2400&q=85&auto=format&fit=crop",
  forest:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2400&q=85&auto=format&fit=crop",
  kitchen:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=2400&q=85&auto=format&fit=crop",
  run:
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=2400&q=85&auto=format&fit=crop",
  hands:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=2400&q=85&auto=format&fit=crop",
};

// ---------------------------------------------------------------------------
// Glucose trajectory data (lifted from mock patient, kept minimal)
// ---------------------------------------------------------------------------

type Pt = { year: number; v: number; label: string };

function useGlucoseSeries(): Pt[] {
  return useMemo(() => {
    const raw = getMarkerHistory("f-Glucose");
    const byYear: Pt[] = raw
      .map((r) => ({
        year: new Date(r.date).getFullYear(),
        v: r.value,
        label: `${r.value} mmol/L`,
      }))
      .sort((a, b) => a.year - b.year);
    // Future projection line: 5.8 -> 6.4 over 3 years if nothing changes
    const projected: Pt[] = [
      { year: 2027, v: 6.0, label: "Projected" },
      { year: 2028, v: 6.2, label: "Projected" },
      { year: 2029, v: 6.4, label: "Threshold crossed" },
    ];
    return [...byYear, ...projected];
  }, []);
}

// ---------------------------------------------------------------------------
// Breakpoint hook (disables pinning on mobile)
// ---------------------------------------------------------------------------

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsDesktop(window.innerWidth >= 900);
    const id = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", update);
    };
  }, []);
  return isDesktop;
}

// ---------------------------------------------------------------------------
// Stage wrapper (sticky pin)
// ---------------------------------------------------------------------------

function Stage({
  id,
  scrollHeight = 2,
  background = COLORS.paper,
  children,
  sectionRef,
}: {
  id: string;
  scrollHeight?: number;
  background?: string;
  children: ReactNode;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      id={id}
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${scrollHeight * 100}vh`,
        background,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Chrome: fixed top bar + chapter counter
// ---------------------------------------------------------------------------

function TopChrome({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "22px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
        mixBlendMode: "difference",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "#F4EEE2",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="#F4EEE2" strokeWidth="1.5" />
          <path
            d="M6 14 L9 9 L12 12 L16 6"
            stroke="#F4EEE2"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        precura
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(244, 238, 226, 0.82)",
          display: "flex",
          gap: 28,
          alignItems: "center",
        }}
      >
        <span>Sweden / 2026</span>
        <span>11 chapters</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(244, 238, 226, 0.12)",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            width,
            background: "#F4EEE2",
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable atoms
// ---------------------------------------------------------------------------

function StageLabel({
  number,
  label,
  opacity,
  color = COLORS.inkMute,
}: {
  number: string;
  label: string;
  opacity: MotionValue<number>;
  color?: string;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 96,
        left: 56,
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color,
        display: "flex",
        gap: 14,
        alignItems: "center",
        opacity,
      }}
    >
      <span>{number}</span>
      <span
        style={{
          display: "inline-block",
          width: 36,
          height: 1,
          background: color,
        }}
      />
      <span>{label}</span>
    </motion.div>
  );
}

function AsciiArrow({ color = "currentColor" }: { color?: string }) {
  // Plain ASCII right-arrow for CTAs / cues. No unicode.
  return <span style={{ color, fontFamily: MONO }}>{"->"}</span>;
}

// ---------------------------------------------------------------------------
// STAGE 01 - HERO
// ---------------------------------------------------------------------------

function StageHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.02]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0.35]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.28, 0.55]);

  const line1Y = useTransform(scrollYProgress, [0, 0.25], [0, -20]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.8], [1, 1, 0]);

  const line2Opacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.75, 0.9],
    [0, 1, 1, 0]
  );
  const line2Y = useTransform(scrollYProgress, [0.1, 0.25], [30, 0]);

  const metaOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.38, 0.8, 0.92],
    [0, 1, 1, 0]
  );
  const metaY = useTransform(scrollYProgress, [0.22, 0.38], [30, 0]);

  const ctaOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.85, 0.95],
    [0, 1, 1, 0]
  );
  const ctaY = useTransform(scrollYProgress, [0.3, 0.45], [20, 0]);

  const labelOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Stage id="s1" scrollHeight={2.2} background={COLORS.ink} sectionRef={ref}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.heroSky})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          scale: imgScale,
          opacity: imgOpacity,
          filter: "saturate(0.85)",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(11,14,16,0.3) 0%, rgba(11,14,16,0.05) 35%, rgba(11,14,16,0.75) 100%)",
          opacity: overlay,
        }}
      />

      <StageLabel
        number="01"
        label="Opening"
        opacity={labelOpacity}
        color="rgba(244, 238, 226, 0.7)"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 56px 120px 56px",
          color: "#F4EEE2",
        }}
      >
        <motion.div
          style={{
            fontFamily: FONT,
            fontSize: "clamp(56px, 9vw, 148px)",
            fontWeight: 500,
            lineHeight: 0.94,
            letterSpacing: "-0.035em",
            maxWidth: "14ch",
            y: line1Y,
            opacity: line1Opacity,
          }}
        >
          Your body has <br />
          been telling <br />
          a story.
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 120,
            fontFamily: FONT,
            fontSize: "clamp(44px, 7vw, 116px)",
            fontWeight: 500,
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            maxWidth: "15ch",
            y: line2Y,
            opacity: line2Opacity,
          }}
        >
          Now read <br />
          the next <br />
          chapter.
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            right: 56,
            bottom: 220,
            fontFamily: FONT,
            fontSize: 15,
            lineHeight: 1.5,
            maxWidth: 360,
            color: "rgba(244, 238, 226, 0.82)",
            textAlign: "right",
            y: metaY,
            opacity: metaOpacity,
          }}
        >
          Precura combines your blood work, family history and lifestyle, then
          runs the same clinical risk models Swedish doctors use. You see where
          your health is heading. Before it gets there.
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            right: 56,
            bottom: 120,
            display: "flex",
            gap: 20,
            alignItems: "center",
            y: ctaY,
            opacity: ctaOpacity,
          }}
        >
          <button
            style={{
              padding: "16px 28px",
              borderRadius: 999,
              background: "#F4EEE2",
              color: COLORS.ink,
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
          >
            Start your profile / 995 SEK
          </button>
          <button
            style={{
              padding: "16px 0",
              background: "transparent",
              color: "#F4EEE2",
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              borderBottom: "1px solid rgba(244, 238, 226, 0.5)",
            }}
          >
            How it works <AsciiArrow />
          </button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(244, 238, 226, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
        }}
      >
        <span>Scroll to begin</span>
        <motion.div
          style={{
            width: 1,
            height: 38,
            background:
              "linear-gradient(180deg, rgba(244,238,226,0.7), rgba(244,238,226,0))",
            transformOrigin: "top",
          }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// STAGE 02 - THE PROBLEM (50% caught late)
// ---------------------------------------------------------------------------

function StageProblem() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const h1Y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const h1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const dotsOpacity = useTransform(scrollYProgress, [0.18, 0.35], [0, 1]);
  const dotsBadHighlight = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const halfLabelOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.9], [0, 1, 1]);

  const textOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.7, 0.9, 1],
    [0, 1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0.55, 0.7], [40, 0]);

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.85, 0.95], [0, 1, 1, 0]);

  // Build a 10x10 grid of dots. 50 dots will highlight as "caught late".
  const dots = useMemo(() => {
    const arr = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        arr.push({ r, c, idx: r * 10 + c });
      }
    }
    return arr;
  }, []);

  return (
    <Stage id="s2" scrollHeight={2.2} background={COLORS.paper} sectionRef={ref}>
      <StageLabel number="02" label="The problem" opacity={labelOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 80,
          padding: "140px 80px 100px 80px",
          color: COLORS.ink,
          alignItems: "center",
        }}
      >
        {/* Grid of 100 dots */}
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gridTemplateRows: "repeat(10, 1fr)",
            gap: 12,
            width: "100%",
            maxWidth: 560,
            aspectRatio: "1",
            opacity: dotsOpacity,
          }}
        >
          {dots.map(({ idx }) => {
            const isCaughtLate = idx < 50;
            return (
              <DotCell
                key={idx}
                isCaughtLate={isCaughtLate}
                progress={dotsBadHighlight}
                index={idx}
              />
            );
          })}
        </motion.div>

        <div style={{ position: "relative", height: "100%" }}>
          <motion.div
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 4.5vw, 68px)",
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: "-0.028em",
              maxWidth: "14ch",
              y: h1Y,
              opacity: h1Opacity,
            }}
          >
            Half of Swedes who develop type 2 diabetes are caught late.
          </motion.div>

          <motion.div
            style={{
              marginTop: 44,
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              opacity: halfLabelOpacity,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 96,
                fontWeight: 600,
                color: COLORS.ember,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              50%
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: COLORS.inkMute,
                maxWidth: 180,
                lineHeight: 1.5,
              }}
            >
              Already had <br /> complications at <br /> diagnosis
            </div>
          </motion.div>

          <motion.div
            style={{
              marginTop: 48,
              fontFamily: FONT,
              fontSize: 17,
              lineHeight: 1.55,
              color: COLORS.inkSoft,
              maxWidth: 480,
              opacity: textOpacity,
              y: textY,
            }}
          >
            The tests existed. The visits happened. The results landed in
            different folders, in different clinics, on different years. No
            single doctor ever saw the full picture. Precura is the picture.
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLORS.inkFaint,
              opacity: textOpacity,
            }}
          >
            Source: Swedish National Diabetes Register, 2023 annual report
          </motion.div>
        </div>
      </div>
    </Stage>
  );
}

function DotCell({
  isCaughtLate,
  progress,
  index,
}: {
  isCaughtLate: boolean;
  progress: MotionValue<number>;
  index: number;
}) {
  const delay = (index % 50) / 100;
  const color = useTransform(
    progress,
    [delay, delay + 0.3],
    isCaughtLate
      ? [COLORS.inkFaint, COLORS.ember]
      : [COLORS.inkFaint, COLORS.forest]
  );
  return (
    <motion.div
      style={{
        borderRadius: "50%",
        background: color,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// STAGE 03 - ANNA'S STORY
// ---------------------------------------------------------------------------

function StageAnna() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const series = useGlucoseSeries();

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.85, 0.95], [0, 1, 1, 0]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1.04, 0.98]);
  const portraitOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.85, 1],
    [0, 1, 1, 0.6]
  );

  const namePlateOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.18, 0.88, 1],
    [0, 1, 1, 0]
  );
  const namePlateY = useTransform(scrollYProgress, [0.08, 0.18], [30, 0]);

  const quoteOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.32, 0.85, 1],
    [0, 1, 1, 0]
  );
  const quoteY = useTransform(scrollYProgress, [0.2, 0.32], [30, 0]);

  const chartOpacity = useTransform(scrollYProgress, [0.3, 0.42], [0, 1]);
  const chartProgress = useTransform(scrollYProgress, [0.38, 0.68], [0, 1]);

  const projOpacity = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);
  const projProgress = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);

  const findriscOpacity = useTransform(scrollYProgress, [0.72, 0.84], [0, 1]);

  return (
    <Stage id="s3" scrollHeight={2.8} background={COLORS.paperDeep} sectionRef={ref}>
      <StageLabel number="03" label="Anna's story" opacity={labelOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1.35fr",
          padding: "140px 72px 80px 72px",
          gap: 56,
          color: COLORS.ink,
        }}
      >
        {/* LEFT - portrait + meta */}
        <div style={{ position: "relative", height: "100%" }}>
          <motion.div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              backgroundImage: `url(${IMG.anna})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              scale: portraitScale,
              opacity: portraitOpacity,
              borderRadius: 2,
              filter: "grayscale(0.15) contrast(1.02)",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              padding: "10px 14px",
              background: "rgba(244, 238, 226, 0.92)",
              backdropFilter: "blur(10px)",
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: COLORS.ink,
              opacity: namePlateOpacity,
              y: namePlateY,
            }}
          >
            Anna B. / 40 / Stockholm
          </motion.div>

          <motion.blockquote
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              fontFamily: FONT,
              fontSize: 17,
              lineHeight: 1.5,
              color: COLORS.inkSoft,
              fontStyle: "italic",
              margin: 0,
              paddingLeft: 20,
              borderLeft: "none",
              opacity: quoteOpacity,
              y: quoteY,
            }}
          >
            {"\"Every year my blood work came back 'normal'. I went to my appointments. I did nothing wrong. So how did I get here?\""}
          </motion.blockquote>
        </div>

        {/* RIGHT - chart + story */}
        <div style={{ position: "relative" }}>
          <motion.h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(32px, 3.8vw, 54px)",
              fontWeight: 500,
              letterSpacing: "-0.028em",
              lineHeight: 1.02,
              margin: 0,
              marginBottom: 24,
              maxWidth: "16ch",
              opacity: useTransform(scrollYProgress, [0.1, 0.22], [0, 1]),
            }}
          >
            Five years of &quot;normal&quot; test results. One line nobody drew.
          </motion.h2>

          <motion.p
            style={{
              fontFamily: FONT,
              fontSize: 16,
              lineHeight: 1.55,
              color: COLORS.inkSoft,
              margin: 0,
              marginBottom: 28,
              maxWidth: 520,
              opacity: useTransform(scrollYProgress, [0.16, 0.28], [0, 1]),
            }}
          >
            Anna&apos;s fasting glucose climbed from 5.0 to 5.8 mmol/L
            between 2021 and 2026. Every single reading sat inside the
            reference range. Her mother was diagnosed with type 2 diabetes at
            58. Her father had a heart attack at 65. None of this fit into a
            single visit, so none of it ever triggered a warning.
          </motion.p>

          <AnnaGlucoseChart
            series={series}
            chartOpacity={chartOpacity}
            lineProgress={chartProgress}
            projOpacity={projOpacity}
            projProgress={projProgress}
          />

          <motion.div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              opacity: findriscOpacity,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: COLORS.inkMute,
                  marginBottom: 6,
                }}
              >
                FINDRISC score
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 600,
                  color: COLORS.amber,
                  letterSpacing: "-0.02em",
                }}
              >
                12 / 26
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: COLORS.inkMute,
                }}
              >
                Moderate 10 year risk
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: COLORS.inkMute,
                  marginBottom: 6,
                }}
              >
                Family loading
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 600,
                  color: COLORS.ember,
                  letterSpacing: "-0.02em",
                }}
              >
                2 / 4
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: COLORS.inkMute,
                }}
              >
                Parents with T2D / CVD
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: COLORS.inkMute,
                  marginBottom: 6,
                }}
              >
                10 year T2D risk
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 600,
                  color: COLORS.ember,
                  letterSpacing: "-0.02em",
                }}
              >
                ~17%
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: COLORS.inkMute,
                }}
              >
                If nothing changes
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Stage>
  );
}

function AnnaGlucoseChart({
  series,
  chartOpacity,
  lineProgress,
  projOpacity,
  projProgress,
}: {
  series: Pt[];
  chartOpacity: MotionValue<number>;
  lineProgress: MotionValue<number>;
  projOpacity: MotionValue<number>;
  projProgress: MotionValue<number>;
}) {
  // Split into historic vs projected
  const historic = series.filter((p) => p.v <= 5.9 || p.year <= 2026);
  const projected = series.filter((p) => p.year >= 2026);

  const W = 640;
  const H = 260;
  const PAD = { l: 56, r: 24, t: 24, b: 40 };
  const minYear = Math.min(...series.map((p) => p.year));
  const maxYear = Math.max(...series.map((p) => p.year));
  const minV = 4.8;
  const maxV = 6.6;

  const x = (year: number) =>
    PAD.l + ((year - minYear) / (maxYear - minYear)) * (W - PAD.l - PAD.r);
  const y = (v: number) =>
    PAD.t + ((maxV - v) / (maxV - minV)) * (H - PAD.t - PAD.b);

  const histPath = historic
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.v)}`)
    .join(" ");

  const projPath = projected
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.v)}`)
    .join(" ");

  // Reference zones: normal (<5.6), borderline (5.6-6.0), prediabetic (6.0-6.9)
  const zoneNormalY = y(5.6);
  const zoneBorderY = y(6.0);

  return (
    <motion.div
      style={{
        width: "100%",
        maxWidth: W,
        opacity: chartOpacity,
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* Zone backgrounds */}
        <rect
          x={PAD.l}
          y={PAD.t}
          width={W - PAD.l - PAD.r}
          height={zoneNormalY - PAD.t}
          fill={COLORS.zNormal}
        />
        <rect
          x={PAD.l}
          y={zoneNormalY}
          width={W - PAD.l - PAD.r}
          height={zoneBorderY - zoneNormalY}
          fill={COLORS.zBorder}
        />
        <rect
          x={PAD.l}
          y={zoneBorderY}
          width={W - PAD.l - PAD.r}
          height={H - PAD.b - zoneBorderY}
          fill={COLORS.zRisk}
        />

        {/* Zone labels */}
        <text
          x={PAD.l + 6}
          y={PAD.t + 14}
          fontFamily={MONO}
          fontSize={9}
          fill={COLORS.forest}
          letterSpacing="1.5"
        >
          NORMAL
        </text>
        <text
          x={PAD.l + 6}
          y={zoneNormalY + 12}
          fontFamily={MONO}
          fontSize={9}
          fill={COLORS.amber}
          letterSpacing="1.5"
        >
          BORDERLINE
        </text>
        <text
          x={PAD.l + 6}
          y={zoneBorderY + 12}
          fontFamily={MONO}
          fontSize={9}
          fill={COLORS.ember}
          letterSpacing="1.5"
        >
          PREDIABETIC
        </text>

        {/* Y axis values */}
        {[5.0, 5.5, 6.0, 6.5].map((v) => (
          <g key={v}>
            <text
              x={PAD.l - 10}
              y={y(v) + 4}
              textAnchor="end"
              fontFamily={MONO}
              fontSize={10}
              fill={COLORS.inkMute}
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X axis years */}
        {series.map((p) => (
          <text
            key={p.year}
            x={x(p.year)}
            y={H - PAD.b + 18}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={10}
            fill={COLORS.inkMute}
          >
            {p.year}
          </text>
        ))}

        {/* Historic line (draws via pathLength) */}
        <motion.path
          d={histPath}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: lineProgress }}
        />

        {/* Historic points */}
        {historic.map((p, i) => (
          <HistPoint key={i} cx={x(p.year)} cy={y(p.v)} progress={lineProgress} delay={i / historic.length} />
        ))}

        {/* Projected line (dashed) */}
        <motion.path
          d={projPath}
          fill="none"
          stroke={COLORS.ember}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 6"
          style={{ pathLength: projProgress, opacity: projOpacity }}
        />

        {/* "Projected" label */}
        <motion.text
          x={x(2028)}
          y={y(6.2) - 14}
          fontFamily={MONO}
          fontSize={10}
          fill={COLORS.ember}
          letterSpacing="1.5"
          style={{ opacity: projOpacity }}
        >
          PROJECTED
        </motion.text>
      </svg>
    </motion.div>
  );
}

function HistPoint({
  cx,
  cy,
  progress,
  delay,
}: {
  cx: number;
  cy: number;
  progress: MotionValue<number>;
  delay: number;
}) {
  const opacity = useTransform(progress, [delay, delay + 0.15], [0, 1]);
  return (
    <motion.circle cx={cx} cy={cy} r={4} fill={COLORS.ink} style={{ opacity }} />
  );
}

// ---------------------------------------------------------------------------
// STAGE 04 - HOW IT WORKS
// ---------------------------------------------------------------------------

function StageHowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);
  const h1Y = useTransform(scrollYProgress, [0, 0.15], [30, 0]);
  const h1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0, 1, 1, 0]);

  // Stage 1 card states
  const step1Scale = useTransform(scrollYProgress, [0.12, 0.28], [0.9, 1]);
  const step1Opacity = useTransform(scrollYProgress, [0.12, 0.22, 0.35, 0.45], [0, 1, 1, 0.35]);

  const step2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.55, 0.65], [0, 1, 1, 0.35]);
  const step2Scale = useTransform(scrollYProgress, [0.3, 0.45], [0.9, 1]);

  const step3Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.78, 0.92], [0, 1, 1, 1]);
  const step3Scale = useTransform(scrollYProgress, [0.5, 0.65], [0.9, 1]);

  // flow line draw
  const flow1 = useTransform(scrollYProgress, [0.22, 0.38], [0, 1]);
  const flow2 = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);

  return (
    <Stage id="s4" scrollHeight={2.6} background={COLORS.paper} sectionRef={ref}>
      <StageLabel number="04" label="How it works" opacity={labelOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "140px 72px 80px 72px",
          color: COLORS.ink,
        }}
      >
        <motion.h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.028em",
            lineHeight: 1,
            margin: 0,
            maxWidth: "14ch",
            y: h1Y,
            opacity: h1Opacity,
          }}
        >
          Three steps. One afternoon. A picture you can&apos;t unsee.
        </motion.h2>

        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "stretch",
            gap: 0,
            width: "100%",
          }}
        >
          <StepCard
            step="01"
            title="Give us your sample"
            body="Walk into any Precura partner clinic in Stockholm, Goteborg or Malmo. One small tube. Ten minutes. No insurance paperwork, no referrals."
            tag="15 min visit"
            opacity={step1Opacity}
            scale={step1Scale}
            color={COLORS.ink}
            accent={COLORS.forest}
            icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="14" y="6" width="12" height="28" rx="2" stroke={COLORS.ink} strokeWidth="1.5" />
                <rect x="14" y="22" width="12" height="12" fill={COLORS.ember} fillOpacity="0.25" />
                <line x1="14" y1="12" x2="26" y2="12" stroke={COLORS.ink} strokeWidth="1.5" />
              </svg>
            }
          />

          <FlowConnector progress={flow1} />

          <StepCard
            step="02"
            title="We run the models"
            body="Your results go into FINDRISC, SCORE2, FRAX and our own lifestyle index. Plus 5 years of history from 1177 if you link it. All models are peer reviewed and used in Swedish primary care."
            tag="24 to 48 hours"
            opacity={step2Opacity}
            scale={step2Scale}
            color={COLORS.ink}
            accent={COLORS.amber}
            icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="14" stroke={COLORS.ink} strokeWidth="1.5" />
                <path d="M10 20 L16 24 L20 14 L24 26 L30 20" stroke={COLORS.ember} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />

          <FlowConnector progress={flow2} />

          <StepCard
            step="03"
            title="Read the chapter"
            body="You get your risk profile in plain Swedish, biomarker trends, a doctor's note, an AI chat that knows your history, and a retest date on your calendar."
            tag="Forever yours"
            opacity={step3Opacity}
            scale={step3Scale}
            color={COLORS.ink}
            accent={COLORS.ember}
            icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="7" y="7" width="26" height="26" rx="2" stroke={COLORS.ink} strokeWidth="1.5" />
                <line x1="13" y1="14" x2="27" y2="14" stroke={COLORS.ink} strokeWidth="1.2" />
                <line x1="13" y1="20" x2="27" y2="20" stroke={COLORS.ink} strokeWidth="1.2" />
                <line x1="13" y1="26" x2="22" y2="26" stroke={COLORS.ember} strokeWidth="2" />
              </svg>
            }
          />
        </div>

        <motion.div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 40,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.inkMute,
            opacity: useTransform(scrollYProgress, [0.7, 0.85], [0, 1]),
          }}
        >
          <span>Walk in</span>
          <span>Algorithm runs</span>
          <span>You read the story</span>
        </motion.div>
      </div>
    </Stage>
  );
}

function StepCard({
  step,
  title,
  body,
  tag,
  opacity,
  scale,
  color,
  accent,
  icon,
}: {
  step: string;
  title: string;
  body: string;
  tag: string;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  color: string;
  accent: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      style={{
        background: "rgba(255, 253, 248, 0.9)",
        border: `1px solid ${COLORS.rule}`,
        padding: "32px 28px 28px 28px",
        opacity,
        scale,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 340,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          Step {step}
        </div>
        {icon}
      </div>
      <h3
        style={{
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: 0,
          marginBottom: 16,
          color,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: FONT,
          fontSize: 14,
          lineHeight: 1.55,
          color: COLORS.inkSoft,
          margin: 0,
          flex: 1,
        }}
      >
        {body}
      </p>
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${COLORS.rule}`,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {tag}
      </div>
    </motion.div>
  );
}

function FlowConnector({ progress }: { progress: MotionValue<number> }) {
  const pathLength = progress;
  return (
    <div
      style={{
        width: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="80" height="40" viewBox="0 0 80 40">
        <motion.line
          x1="8"
          y1="20"
          x2="72"
          y2="20"
          stroke={COLORS.ink}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        <motion.path
          d="M 66 14 L 72 20 L 66 26"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: progress }}
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STAGE 05 - WHAT YOU GET (product tour)
// ---------------------------------------------------------------------------

function StageWhatYouGet() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);

  // We reveal 6 product tiles one at a time as you scroll.
  const tileCount = 6;
  const tileProgressStart = 0.05;
  const tileProgressEnd = 0.85;

  const features = [
    {
      num: "01",
      tag: "Risk profile",
      title: "Your personal risk trajectory",
      body: "FINDRISC for type 2 diabetes. SCORE2 for cardiovascular. FRAX for bone health. Each shown as a 10 year trajectory you can argue with, not a single number you can ignore.",
      accent: COLORS.ember,
      icon: "risk",
    },
    {
      num: "02",
      tag: "Biomarkers",
      title: "Every value, every year, one chart",
      body: "HbA1c, glucose, lipids, thyroid, vitamin D, kidney function, inflammation. Plotted across time with the reference range shaded so drifts are impossible to miss.",
      accent: COLORS.amber,
      icon: "chart",
    },
    {
      num: "03",
      tag: "AI chat",
      title: "An assistant that has read your file",
      body: "Ask anything about your results in Swedish or English. It knows your family history, your medications, your last six tests. It won't diagnose you, but it will explain.",
      accent: COLORS.forest,
      icon: "chat",
    },
    {
      num: "04",
      tag: "Doctor messaging",
      title: "A real Swedish doctor, without a waiting room",
      body: "Message a Precura GP about anything in your profile. Typical response inside one working day. Escalate to a video consultation in the app when you need more.",
      accent: COLORS.ocean,
      icon: "doctor",
    },
    {
      num: "05",
      tag: "Training",
      title: "A plan built around your actual data",
      body: "When your FINDRISC says moderate and your BMI says 27, a generic program is an insult. Precura writes the exact sets, reps and weekly cardio that move the risk model.",
      accent: COLORS.emberSoft,
      icon: "training",
    },
    {
      num: "06",
      tag: "Annual retests",
      title: "Reminders the month your body needs them",
      body: "We watch your trajectory and schedule retests when it actually matters, not on a generic calendar. Your retest dates land in Apple Calendar automatically.",
      accent: COLORS.forestSoft,
      icon: "calendar",
    },
  ];

  return (
    <Stage
      id="s5"
      scrollHeight={3.2}
      background={COLORS.ink}
      sectionRef={ref}
    >
      <StageLabel
        number="05"
        label="What you get"
        opacity={labelOpacity}
        color="rgba(244, 238, 226, 0.65)"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "140px 72px 80px 72px",
          color: "#F4EEE2",
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: 64,
          alignItems: "start",
        }}
      >
        {/* LEFT - sticky headline */}
        <div style={{ position: "sticky", top: 140 }}>
          <motion.div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(244, 238, 226, 0.55)",
              marginBottom: 24,
            }}
          >
            Membership includes
          </motion.div>
          <motion.h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 500,
              letterSpacing: "-0.032em",
              lineHeight: 0.98,
              margin: 0,
              maxWidth: "12ch",
            }}
          >
            Six tools. One coherent story about you.
          </motion.h2>
          <p
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(244, 238, 226, 0.68)",
              maxWidth: 380,
            }}
          >
            Built to feel like a Swedish clinic, not a US wellness app. No
            notifications, no streaks, no gamified anxiety. Just clarity when
            you open it and quiet when you close it.
          </p>
          <motion.div
            style={{
              marginTop: 40,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(244, 238, 226, 0.4)",
            }}
          >
            {"Scroll to tour /"}
          </motion.div>
        </div>

        {/* RIGHT - stacked feature tiles */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {features.map((f, i) => {
            const start =
              tileProgressStart +
              (i / tileCount) * (tileProgressEnd - tileProgressStart);
            const end =
              tileProgressStart +
              ((i + 0.5) / tileCount) * (tileProgressEnd - tileProgressStart);
            return (
              <FeatureTile
                key={i}
                {...f}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </div>
      </div>
    </Stage>
  );
}

function FeatureTile({
  num,
  tag,
  title,
  body,
  accent,
  icon,
  scrollYProgress,
  start,
  end,
}: {
  num: string;
  tag: string;
  title: string;
  body: string;
  accent: string;
  icon: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.25, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);
  const borderColor = useTransform(
    scrollYProgress,
    [start, end],
    ["rgba(244, 238, 226, 0.08)", "rgba(244, 238, 226, 0.22)"]
  );

  return (
    <motion.div
      style={{
        padding: "28px 32px",
        background: "rgba(244, 238, 226, 0.03)",
        border: "1px solid rgba(244, 238, 226, 0.12)",
        borderColor,
        display: "grid",
        gridTemplateColumns: "64px 1fr auto",
        gap: 28,
        alignItems: "start",
        opacity,
        y,
      }}
    >
      <div>
        <FeatureIcon kind={icon} color={accent} />
      </div>
      <div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 10,
          }}
        >
          {num} / {tag}
        </div>
        <h3
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: 0,
            marginBottom: 10,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(244, 238, 226, 0.66)",
            margin: 0,
            maxWidth: 540,
          }}
        >
          {body}
        </p>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(244, 238, 226, 0.35)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        Included
      </div>
    </motion.div>
  );
}

function FeatureIcon({ kind, color }: { kind: string; color: string }) {
  const common = { stroke: color, strokeWidth: 1.4, fill: "none" };
  switch (kind) {
    case "risk":
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <path d="M8 36 Q 24 12 40 36" {...common} strokeLinecap="round" />
          <circle cx="30" cy="24" r="3" fill={color} />
        </svg>
      );
    case "chart":
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <line x1="8" y1="40" x2="40" y2="40" {...common} />
          <rect x="12" y="28" width="5" height="12" fill={color} opacity="0.8" />
          <rect x="20" y="22" width="5" height="18" fill={color} opacity="0.8" />
          <rect x="28" y="16" width="5" height="24" fill={color} opacity="0.8" />
        </svg>
      );
    case "chat":
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="8" y="12" width="32" height="22" rx="2" {...common} />
          <circle cx="18" cy="23" r="1.6" fill={color} />
          <circle cx="24" cy="23" r="1.6" fill={color} />
          <circle cx="30" cy="23" r="1.6" fill={color} />
        </svg>
      );
    case "doctor":
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="18" r="6" {...common} />
          <path d="M12 40 Q 24 28 36 40" {...common} strokeLinecap="round" />
        </svg>
      );
    case "training":
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="6" y="22" width="4" height="8" rx="1" fill={color} />
          <rect x="38" y="22" width="4" height="8" rx="1" fill={color} />
          <line x1="10" y1="26" x2="38" y2="26" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "calendar":
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="8" y="12" width="32" height="28" rx="2" {...common} />
          <line x1="8" y1="20" x2="40" y2="20" {...common} />
          <rect x="16" y="26" width="4" height="4" fill={color} />
          <rect x="24" y="26" width="4" height="4" fill={color} />
          <rect x="22" y="32" width="4" height="4" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// STAGE 06 - TRUST & SCIENCE
// ---------------------------------------------------------------------------

function StageTrust() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);
  const h1Opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const h1Y = useTransform(scrollYProgress, [0, 0.15], [30, 0]);

  const docOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.9, 1], [0, 1, 1, 0]);
  const modelsOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  const models = [
    {
      name: "FINDRISC",
      full: "Finnish Diabetes Risk Score",
      use: "10 year type 2 diabetes risk",
      cite: "Lindstrom & Tuomilehto, 2003, Diabetes Care 26:725-731",
    },
    {
      name: "SCORE2",
      full: "Systematic COronary Risk Evaluation 2",
      use: "10 year cardiovascular risk, European population",
      cite: "SCORE2 Working Group, 2021, European Heart Journal 42:2439-2454",
    },
    {
      name: "FRAX",
      full: "Fracture Risk Assessment Tool",
      use: "10 year major osteoporotic fracture risk",
      cite: "Kanis et al, 2008, Osteoporosis International 19:385-397",
    },
  ];

  return (
    <Stage
      id="s6"
      scrollHeight={2.6}
      background={COLORS.paperDeep}
      sectionRef={ref}
    >
      <StageLabel number="06" label="Trust and science" opacity={labelOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "140px 72px 80px 72px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 72,
          color: COLORS.ink,
        }}
      >
        {/* LEFT - doctor + quote */}
        <div>
          <motion.div
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 4.5vw, 64px)",
              fontWeight: 500,
              letterSpacing: "-0.028em",
              lineHeight: 1,
              marginBottom: 36,
              maxWidth: "16ch",
              y: h1Y,
              opacity: h1Opacity,
            }}
          >
            Built by a Swedish GP who got tired of seeing it too late.
          </motion.div>

          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: 24,
              alignItems: "start",
              opacity: docOpacity,
            }}
          >
            <div
              style={{
                width: 120,
                aspectRatio: "3/4",
                backgroundImage: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center 35%",
                borderRadius: 2,
                filter: "grayscale(0.2)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  marginBottom: 2,
                }}
              >
                Dr. Malin Johansson
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: COLORS.inkMute,
                  marginBottom: 12,
                }}
              >
                Co-founder, Chief Medical Officer
              </div>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: COLORS.inkSoft,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {"\"In 12 years of primary care I watched the same pattern over and over. The data was always there. Nobody ever looked at five years of it at once. Precura is what I wanted for my patients and never had time to build.\""}
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{
              marginTop: 48,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              opacity: docOpacity,
            }}
          >
            <TrustBadge label="EU hosted" sub="Stockholm + Frankfurt" />
            <TrustBadge label="GDPR native" sub="Your data, revocable" />
            <TrustBadge label="CE medical" sub="Class IIa, pending" />
            <TrustBadge label="Swedish GP" sub="Clinical oversight" />
          </motion.div>
        </div>

        {/* RIGHT - models */}
        <div style={{ position: "relative" }}>
          <motion.div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.inkMute,
              marginBottom: 20,
              opacity: modelsOpacity,
            }}
          >
            The three risk models we run for you
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {models.map((m, i) => {
              const start = 0.35 + i * 0.12;
              const end = start + 0.12;
              return (
                <ModelCard
                  key={m.name}
                  model={m}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                />
              );
            })}
          </div>

          <motion.p
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontSize: 13,
              lineHeight: 1.55,
              color: COLORS.inkMute,
              maxWidth: 480,
              opacity: useTransform(scrollYProgress, [0.75, 0.9], [0, 1]),
            }}
          >
            These are not black box AI. They are peer reviewed statistical
            models used every day in Swedish primary care. We just run them
            for you, on your data, with your history.
          </motion.p>
        </div>
      </div>
    </Stage>
  );
}

function TrustBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      style={{
        padding: "14px 18px",
        border: `1px solid ${COLORS.rule}`,
        background: "rgba(255, 253, 248, 0.6)",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 600,
          color: COLORS.ink,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: COLORS.inkMute,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function ModelCard({
  model,
  scrollYProgress,
  start,
  end,
}: {
  model: { name: string; full: string; use: string; cite: string };
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], [-20, 0]);
  return (
    <motion.div
      style={{
        padding: "20px 24px",
        background: "rgba(255, 253, 248, 0.8)",
        border: `1px solid ${COLORS.rule}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 24,
        alignItems: "start",
        opacity,
        x,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: COLORS.ember,
          width: 120,
        }}
      >
        {model.name}
      </div>
      <div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 13,
            color: COLORS.ink,
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {model.full}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 12,
            color: COLORS.inkSoft,
            marginBottom: 8,
          }}
        >
          {model.use}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: COLORS.inkMute,
            letterSpacing: "0.02em",
          }}
        >
          {model.cite}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// STAGE 07 - SOCIAL PROOF
// ---------------------------------------------------------------------------

function StageTestimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);

  const quotes = [
    {
      text: "I'd been going to the same GP for ten years. Every visit ended with 'all normal, see you next year'. Precura showed me my glucose had gone up every year for five years. My doctor and I now actually have something to talk about.",
      name: "Karin L.",
      age: 48,
      city: "Uppsala",
      tag: "Member since 2025",
    },
    {
      text: "I came for numbers, the way I do with Werlabs. I stayed because Precura wrote the story. They told me my vitamin D had been low for three winters and that I should move my annual test to April, not October. Nobody had ever said that to me.",
      name: "Henrik S.",
      age: 52,
      city: "Goteborg",
      tag: "Annual member",
    },
    {
      text: "My father died of a heart attack at 61. I've been anxious about my own heart since I turned 40. Seeing my SCORE2 drop from 4% to 2% after a year of training on Precura's plan did more for my sleep than any therapist.",
      name: "Sofia A.",
      age: 43,
      city: "Malmo",
      tag: "Platinum member",
    },
  ];

  return (
    <Stage
      id="s7"
      scrollHeight={2.4}
      background={COLORS.paper}
      sectionRef={ref}
    >
      <StageLabel number="07" label="In their words" opacity={labelOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "140px 72px 80px 72px",
          color: COLORS.ink,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(36px, 4.8vw, 68px)",
            fontWeight: 500,
            letterSpacing: "-0.028em",
            lineHeight: 1,
            margin: 0,
            maxWidth: "16ch",
            opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]),
          }}
        >
          Real people. Real trajectories. Real conversations.
        </motion.h2>

        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            flex: 1,
          }}
        >
          {quotes.map((q, i) => {
            const start = 0.1 + i * 0.18;
            const end = start + 0.22;
            return (
              <QuoteCard
                key={i}
                quote={q}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </div>

        <motion.div
          style={{
            marginTop: 40,
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.inkMute,
            opacity: useTransform(scrollYProgress, [0.75, 0.9], [0, 1]),
          }}
        >
          1,420 active members across Sweden / 86% renew at year 1
        </motion.div>
      </div>
    </Stage>
  );
}

function QuoteCard({
  quote,
  scrollYProgress,
  start,
  end,
}: {
  quote: { text: string; name: string; age: number; city: string; tag: string };
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);

  return (
    <motion.div
      style={{
        background: "rgba(255, 253, 248, 0.8)",
        border: `1px solid ${COLORS.rule}`,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 40,
          lineHeight: 0.7,
          color: COLORS.ember,
          marginBottom: 12,
        }}
      >
        &quot;
      </div>
      <p
        style={{
          fontFamily: FONT,
          fontSize: 15,
          lineHeight: 1.55,
          color: COLORS.ink,
          margin: 0,
          flex: 1,
          fontStyle: "italic",
        }}
      >
        {quote.text}
      </p>
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: `1px solid ${COLORS.rule}`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.ink,
          }}
        >
          {quote.name}, {quote.age}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.inkMute,
            marginTop: 2,
          }}
        >
          {quote.city} / {quote.tag}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// STAGE 08 - PRICING
// ---------------------------------------------------------------------------

function StagePricing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);

  const tiers = [
    {
      name: "First test",
      price: "995",
      unit: "SEK",
      cadence: "one time",
      sub: "Try the full product on one sample. Yours to keep.",
      items: [
        "One comprehensive blood panel (10 biomarkers)",
        "FINDRISC, SCORE2 and FRAX risk profile",
        "Biomarker trend charts for this test",
        "Full AI chat access for 30 days",
        "Doctor's written note on your results",
      ],
      cta: "Start with one test",
      accent: COLORS.forest,
      emphasis: false,
    },
    {
      name: "Annual",
      price: "2,995",
      unit: "SEK",
      cadence: "per year",
      sub: "The full Precura experience. Built for curious adults.",
      items: [
        "Two comprehensive blood panels per year",
        "All three risk models + trajectories",
        "Unlimited AI chat and biomarker history",
        "Direct doctor messaging inside 1 working day",
        "Personalised training plan with real workouts",
      ],
      cta: "Join Precura Annual",
      accent: COLORS.ember,
      emphasis: true,
    },
    {
      name: "Platinum",
      price: "4,995",
      unit: "SEK",
      cadence: "per year",
      sub: "For families with a heavy loading of risk factors.",
      items: [
        "Four comprehensive blood panels per year",
        "Priority doctor response inside 2 hours",
        "Full screening suite (FINDRISC, SCORE2, FRAX, PHQ-9, GAD-7, AUDIT-C)",
        "Video consultations on request",
        "Quarterly written doctor's review of trajectory",
      ],
      cta: "Go Platinum",
      accent: COLORS.amber,
      emphasis: false,
    },
  ];

  return (
    <Stage
      id="s8"
      scrollHeight={2.4}
      background={COLORS.ink}
      sectionRef={ref}
    >
      <StageLabel
        number="08"
        label="Price"
        opacity={labelOpacity}
        color="rgba(244, 238, 226, 0.65)"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "140px 72px 80px 72px",
          color: "#F4EEE2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            maxWidth: "13ch",
            opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]),
          }}
        >
          Less than a winter jacket. Forever attached to your file.
        </motion.h2>

        <motion.p
          style={{
            marginTop: 20,
            fontFamily: FONT,
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(244, 238, 226, 0.68)",
            maxWidth: 560,
            margin: "20px 0 0 0",
            opacity: useTransform(scrollYProgress, [0.05, 0.2], [0, 1]),
          }}
        >
          Transparent prices in SEK. Cancel any time. Your data and reports are
          exportable as PDF and FHIR whenever you want to leave.
        </motion.p>

        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            flex: 1,
          }}
        >
          {tiers.map((t, i) => {
            const start = 0.15 + i * 0.14;
            const end = start + 0.18;
            return (
              <PriceCard
                key={t.name}
                tier={t}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </div>
      </div>
    </Stage>
  );
}

function PriceCard({
  tier,
  scrollYProgress,
  start,
  end,
}: {
  tier: {
    name: string;
    price: string;
    unit: string;
    cadence: string;
    sub: string;
    items: string[];
    cta: string;
    accent: string;
    emphasis: boolean;
  };
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);

  return (
    <motion.div
      style={{
        padding: "36px 32px 32px 32px",
        background: tier.emphasis
          ? "rgba(244, 238, 226, 0.06)"
          : "rgba(244, 238, 226, 0.02)",
        border: tier.emphasis
          ? "1px solid rgba(244, 238, 226, 0.38)"
          : "1px solid rgba(244, 238, 226, 0.12)",
        display: "flex",
        flexDirection: "column",
        opacity,
        y,
        position: "relative",
      }}
    >
      {tier.emphasis && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 28,
            padding: "4px 10px",
            background: tier.accent,
            color: "#F4EEE2",
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Most chosen
        </div>
      )}

      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: tier.accent,
          marginBottom: 10,
        }}
      >
        {tier.name}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: "#F4EEE2",
            lineHeight: 1,
          }}
        >
          {tier.price}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 16,
            color: "rgba(244, 238, 226, 0.68)",
          }}
        >
          {tier.unit}
        </div>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(244, 238, 226, 0.5)",
          marginBottom: 20,
        }}
      >
        {tier.cadence}
      </div>

      <div
        style={{
          fontFamily: FONT,
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(244, 238, 226, 0.75)",
          marginBottom: 24,
        }}
      >
        {tier.sub}
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {tier.items.map((it, i) => (
          <li
            key={i}
            style={{
              fontFamily: FONT,
              fontSize: 13,
              lineHeight: 1.5,
              color: "rgba(244, 238, 226, 0.82)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                color: tier.accent,
                fontFamily: MONO,
                fontSize: 11,
                marginTop: 2,
              }}
            >
              +
            </span>
            {it}
          </li>
        ))}
      </ul>

      <button
        style={{
          marginTop: 24,
          padding: "14px 20px",
          background: tier.emphasis ? "#F4EEE2" : "transparent",
          color: tier.emphasis ? COLORS.ink : "#F4EEE2",
          border: tier.emphasis
            ? "1px solid #F4EEE2"
            : "1px solid rgba(244, 238, 226, 0.3)",
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "-0.005em",
        }}
      >
        {tier.cta} <AsciiArrow />
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// STAGE 09 - FAQ
// ---------------------------------------------------------------------------

function StageFAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);

  const faqs = [
    {
      q: "Is this a medical diagnosis?",
      a: "No. Precura is a decision support and screening tool, not a substitute for a doctor. We run validated risk models on your data and present the results in plain Swedish. If anything looks actionable we connect you to a licensed GP for an actual clinical decision.",
    },
    {
      q: "How is this different from Werlabs or Kry?",
      a: "Werlabs sells you blood values and leaves you alone with them. Kry gives you a 10 minute video consultation without your blood work. Precura does both, then adds five years of history and three clinical risk models so you actually know what the numbers mean.",
    },
    {
      q: "Which clinics do you partner with in Sweden?",
      a: "We draw at partner clinics in Stockholm, Goteborg, Uppsala and Malmo today. We add two new regions each quarter. You can also have a home draw in greater Stockholm through our partnership with Werlabs Hemtest.",
    },
    {
      q: "How safe is my data? Where is it stored?",
      a: "Everything sits in EU data centres in Stockholm and Frankfurt. All data is encrypted at rest and in transit. You control who sees what. You can export as PDF or FHIR at any time, and you can delete your entire account with one click.",
    },
    {
      q: "How fast are results?",
      a: "Most panels land in your Precura file within 24 to 48 hours of the blood draw. Your risk profile and AI chat update the moment new values arrive. You get a push notification and an email.",
    },
    {
      q: "Can I cancel?",
      a: "Yes. Cancel any time from your profile. If you cancel mid year we keep your file read only so you can always export your history. No dark patterns, no retention calls, no 30 day notice.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Stage
      id="s9"
      scrollHeight={2.6}
      background={COLORS.paper}
      sectionRef={ref}
    >
      <StageLabel number="09" label="Questions" opacity={labelOpacity} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "140px 72px 80px 72px",
          color: COLORS.ink,
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: 72,
          alignItems: "start",
        }}
      >
        <div>
          <motion.h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 4.6vw, 64px)",
              fontWeight: 500,
              letterSpacing: "-0.028em",
              lineHeight: 1,
              margin: 0,
              maxWidth: "12ch",
              opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]),
            }}
          >
            What every first time visitor asks us.
          </motion.h2>
          <motion.p
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontSize: 15,
              lineHeight: 1.55,
              color: COLORS.inkSoft,
              maxWidth: 340,
              opacity: useTransform(scrollYProgress, [0.05, 0.2], [0, 1]),
            }}
          >
            If something here isn&apos;t answered, email hello@precura.se and
            a real person will reply the same working day.
          </motion.p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: `1px solid ${COLORS.rule}`,
          }}
        >
          {faqs.map((f, i) => {
            const start = 0.1 + i * 0.09;
            const end = start + 0.1;
            return (
              <FAQRow
                key={i}
                index={i}
                faq={f}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </div>
      </div>
    </Stage>
  );
}

function FAQRow({
  index,
  faq,
  open,
  onToggle,
  scrollYProgress,
  start,
  end,
}: {
  index: number;
  faq: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [20, 0]);

  return (
    <motion.div
      style={{
        borderBottom: `1px solid ${COLORS.rule}`,
        padding: "22px 0",
        opacity,
        y,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.18em",
              color: COLORS.inkMute,
              paddingTop: 4,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 19,
              fontWeight: 500,
              color: COLORS.ink,
              letterSpacing: "-0.012em",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {faq.q}
          </span>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 18,
            color: COLORS.inkMute,
            paddingTop: 2,
            userSelect: "none",
          }}
        >
          {open ? "-" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingTop: 16,
                paddingLeft: 54,
                paddingRight: 48,
                fontFamily: FONT,
                fontSize: 14,
                lineHeight: 1.6,
                color: COLORS.inkSoft,
                maxWidth: 640,
              }}
            >
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// STAGE 10 - FINAL CTA
// ---------------------------------------------------------------------------

function StageFinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.9, 1], [0, 1, 1, 0]);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.4], [0.25, 0.5]);

  const line1Scale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.3, 0.5], [20, 0]);

  const disclaimOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  return (
    <Stage
      id="s10"
      scrollHeight={2}
      background={COLORS.night}
      sectionRef={ref}
    >
      <StageLabel
        number="10"
        label="One step"
        opacity={labelOpacity}
        color="rgba(244, 238, 226, 0.65)"
      />

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.forest})`,
          backgroundSize: "cover",
          backgroundPosition: "center 45%",
          scale: bgScale,
          opacity: bgOpacity,
          filter: "blur(0.5px) saturate(0.7)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(11,15,20,0.75) 0%, rgba(11,15,20,0.4) 40%, rgba(11,15,20,0.92) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 72px",
          textAlign: "center",
          color: "#F4EEE2",
        }}
      >
        <motion.div
          style={{
            fontFamily: FONT,
            fontSize: "clamp(48px, 8vw, 132px)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            maxWidth: "16ch",
            opacity: line1Opacity,
            scale: line1Scale,
          }}
        >
          The chapter you haven&apos;t read yet is the one that matters.
        </motion.div>

        <motion.div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 18,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            opacity: ctaOpacity,
            y: ctaY,
          }}
        >
          <button
            style={{
              padding: "18px 32px",
              borderRadius: 999,
              background: "#F4EEE2",
              color: COLORS.ink,
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
          >
            Book your first test / 995 SEK
          </button>
          <button
            style={{
              padding: "18px 28px",
              background: "transparent",
              color: "#F4EEE2",
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 500,
              border: "1px solid rgba(244, 238, 226, 0.35)",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Talk to a doctor first
          </button>
        </motion.div>

        <motion.div
          style={{
            marginTop: 40,
            fontFamily: FONT,
            fontSize: 12,
            lineHeight: 1.55,
            color: "rgba(244, 238, 226, 0.5)",
            maxWidth: 560,
            opacity: disclaimOpacity,
          }}
        >
          Precura is a screening and decision support tool regulated as a Class
          IIa medical device in the EU. It does not replace a clinical
          diagnosis. If you have symptoms that worry you today, please call 1177.
        </motion.div>
      </div>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// STAGE 11 - FOOTER
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer
      style={{
        background: COLORS.night,
        color: "rgba(244, 238, 226, 0.72)",
        padding: "72px 72px 48px 72px",
        borderTop: "1px solid rgba(244, 238, 226, 0.1)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 64,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 600,
              color: "#F4EEE2",
              letterSpacing: "-0.01em",
              marginBottom: 18,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#F4EEE2" strokeWidth="1.5" />
              <path
                d="M6 14 L9 9 L12 12 L16 6"
                stroke="#F4EEE2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            precura
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 300,
              color: "rgba(244, 238, 226, 0.55)",
            }}
          >
            Prediction is the cure. A Swedish predictive health platform that
            reads your whole file before it gives you advice.
          </p>
        </div>

        {[
          {
            title: "Product",
            links: ["Risk profile", "Biomarkers", "AI chat", "Doctor", "Training"],
          },
          {
            title: "Company",
            links: ["About", "Science", "Clinical team", "Careers", "Press"],
          },
          {
            title: "Legal",
            links: ["Terms", "Privacy", "GDPR", "Data export", "CE marking"],
          },
          {
            title: "Care",
            links: ["Contact", "Support", "Clinic finder", "1177 link", "Emergency"],
          },
        ].map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(244, 238, 226, 0.38)",
                marginBottom: 18,
              }}
            >
              {col.title}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      color: "rgba(244, 238, 226, 0.72)",
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          paddingTop: 32,
          borderTop: "1px solid rgba(244, 238, 226, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(244, 238, 226, 0.35)",
        }}
      >
        <div>Precura AB / Org.nr 559999-1234 / Stockholm</div>
        <div>Built in Sweden. Hosted in the EU.</div>
        <div>(c) 2026 Precura</div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Mobile fallback
// ---------------------------------------------------------------------------

function MobileFallback() {
  return (
    <main
      style={{
        background: COLORS.paper,
        color: COLORS.ink,
        fontFamily: FONT,
        minHeight: "100vh",
      }}
    >
      <div style={{ padding: "40px 24px" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke={COLORS.ink} strokeWidth="1.5" />
            <path
              d="M6 14 L9 9 L12 12 L16 6"
              stroke={COLORS.ink}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          precura
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: "-0.028em",
            lineHeight: 1,
            margin: 0,
            marginBottom: 20,
          }}
        >
          Know where your health is heading. Before it gets there.
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.55,
            color: COLORS.inkSoft,
            marginBottom: 24,
          }}
        >
          Precura combines your blood work, family history and lifestyle, then
          runs the clinical risk models Swedish doctors use. For the best
          experience open Precura on a desktop browser.
        </p>
        <button
          style={{
            padding: "16px 24px",
            borderRadius: 999,
            background: COLORS.ink,
            color: COLORS.paper,
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            width: "100%",
          }}
        >
          Start your profile / 995 SEK
        </button>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page root
// ---------------------------------------------------------------------------

export default function Home7Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const isDesktop = useIsDesktop();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (!mounted) {
    return (
      <div
        style={{
          background: COLORS.ink,
          minHeight: "100vh",
          width: "100%",
        }}
      />
    );
  }

  if (!isDesktop) {
    return <MobileFallback />;
  }

  return (
    <SmoothScroll>
      <main
        style={{
          background: COLORS.paper,
          color: COLORS.ink,
          fontFamily: FONT,
        }}
      >
        <TopChrome progress={progress} />
        <StageHero />
        <StageProblem />
        <StageAnna />
        <StageHowItWorks />
        <StageWhatYouGet />
        <StageTrust />
        <StageTestimonials />
        <StagePricing />
        <StageFAQ />
        <StageFinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
