"use client";

/**
 * =============================================================================
 * PRECURA / HOME-15 - "RESEARCH-FORWARD"
 * =============================================================================
 *
 * Round 3 landing page. User loved the 3D terrain from /home-6 but found
 * that hero too noisy and the overall page "missing a lot of shit". This
 * design leads with scientific credibility from second one.
 *
 * Constraint: Research-forward. Lead with peer-reviewed clinical science.
 * Nature.com meets a premium health brand. Warm, accessible, serious.
 *
 * Section map:
 *  01  HERO                Contained 3D readout + named risk models + trust row
 *  02  PROBLEM             1-in-2 stat wall + literature references
 *  03  ANNA STORY          Data-rich glucose trajectory + citation
 *  04  HOW IT WORKS        Vertical 4-step timeline (not horizontal)
 *  05  LIVING PROFILE      "Not a report. A living profile." block
 *  06  WHAT YOU GET        6 feature cards, 5 pillars covered
 *  07  RESEARCH CAROUSEL   Clickable scientific paper carousel
 *  08  TRUST AND SCIENCE   Doctor + researchers + GDPR/BankID row
 *  09  MEMBER STORIES      "Stories from the first 2,000 members"
 *  10  PRICING             3 tiers, middle highlighted
 *  11  FAQ                 Animated accordion
 *  12  FINAL CTA           Full-width CTA panel
 *  13  FOOTER              Giant wordmark + citation tally + Stockholm clock
 *
 * All colors inline. No CSS variables. No Tailwind color utilities.
 * Apple system fonts only. No em dashes, en dashes, or unicode arrows.
 * No left border accents. No gradient blobs.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  BookOpen,
  Check,
  ChevronDown,
  Circle,
  Database,
  Dumbbell,
  FileText,
  FlaskConical,
  LineChart as LineChartIcon,
  Lock,
  MessageSquareText,
  Microscope,
  Quote as QuoteIcon,
  Shield,
  Stethoscope,
} from "lucide-react";

// 3D hero loaded client-only (three.js needs window).
const Hero3D = dynamic(() => import("./_components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 95% 72% at 50% 52%, #142132 0%, #0B1626 48%, #050A13 92%, #03060C 100%)",
      }}
    />
  ),
});

// ---------------------------------------------------------------------------
// Design tokens (inline so no variables leak outside home-15)
// ---------------------------------------------------------------------------
const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

const C = {
  // Paper + ink base
  paper: "#F5F2EA",
  paperDeep: "#EEE9DD",
  paperSoft: "#FAF8F1",
  card: "#FFFFFF",

  // Ink
  ink: "#0C1420",
  inkSoft: "#1E2A3A",
  inkMid: "#3A4656",
  inkMuted: "#62707F",
  inkFaint: "#94A0AE",

  // Clinical cool
  navy: "#0E1A2A",
  navyDeep: "#060C18",
  slate: "#4A5A6E",
  cyan: "#3E86A6",
  cyanSoft: "#B4D5E0",
  cyanWash: "#E4EEF3",

  // Warmth (we need it or the page feels cold and clinical, which is banned)
  warm: "#C77A45",
  warmDeep: "#8A3E1C",
  warmWash: "#F3E4D2",

  // Signals
  good: "#3E6B4A",
  caution: "#B8832E",
  risk: "#9E3F2E",

  // Lines
  line: "rgba(12, 20, 32, 0.1)",
  lineStrong: "rgba(12, 20, 32, 0.18)",
  lineInk: "rgba(245, 242, 234, 0.12)",
} as const;

// Type tokens - fluid clamps, no numeric sizes leaked outside
const T = {
  monoXs: {
    fontFamily: MONO,
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    lineHeight: 1.3,
  },
  monoSm: {
    fontFamily: MONO,
    fontSize: "12px",
    letterSpacing: "0.08em",
    lineHeight: 1.3,
  },
  monoMd: {
    fontFamily: MONO,
    fontSize: "13px",
    letterSpacing: "0.02em",
    lineHeight: 1.45,
  },
  displayXL: {
    fontFamily: FONT,
    fontSize: "clamp(44px, 7vw, 112px)",
    lineHeight: 0.94,
    letterSpacing: "-0.04em",
    fontWeight: 500 as const,
  },
  displayL: {
    fontFamily: FONT,
    fontSize: "clamp(38px, 5.2vw, 84px)",
    lineHeight: 0.96,
    letterSpacing: "-0.035em",
    fontWeight: 500 as const,
  },
  displayM: {
    fontFamily: FONT,
    fontSize: "clamp(30px, 3.8vw, 56px)",
    lineHeight: 1.04,
    letterSpacing: "-0.025em",
    fontWeight: 500 as const,
  },
  displayS: {
    fontFamily: FONT,
    fontSize: "clamp(24px, 2.6vw, 38px)",
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    fontWeight: 500 as const,
  },
  lead: {
    fontFamily: FONT,
    fontSize: "clamp(17px, 1.4vw, 22px)",
    lineHeight: 1.55,
    letterSpacing: "-0.005em",
    fontWeight: 400 as const,
  },
  body: {
    fontFamily: FONT,
    fontSize: "16px",
    lineHeight: 1.62,
    fontWeight: 400 as const,
  },
  small: {
    fontFamily: FONT,
    fontSize: "14px",
    lineHeight: 1.5,
    fontWeight: 400 as const,
  },
} as const;

// ---------------------------------------------------------------------------
// Reveal primitive
// ---------------------------------------------------------------------------
function Reveal({
  children,
  delay = 0,
  y = 22,
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Eyebrow line: "BUILT ON PEER-REVIEWED CLINICAL SCIENCE" etc.
function Eyebrow({
  children,
  color = C.cyan,
  mb = 20,
}: {
  children: ReactNode;
  color?: string;
  mb?: number;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        ...T.monoXs,
        color,
        marginBottom: mb,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 22,
          height: 1,
          background: color,
          opacity: 0.6,
        }}
      />
      {children}
    </div>
  );
}

// A small citation badge that appears after claims
function Cite({
  n,
  label,
}: {
  n: number;
  label?: string;
}) {
  return (
    <sup
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        marginLeft: 6,
        borderRadius: 100,
        border: `1px solid ${C.lineStrong}`,
        background: C.paperSoft,
        color: C.cyan,
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.04em",
        fontWeight: 500,
        verticalAlign: "baseline",
      }}
      title={label || `Reference ${n}`}
    >
      <BookOpen size={9} strokeWidth={2.4} />
      {n}
    </sup>
  );
}

// ---------------------------------------------------------------------------
// Sticky top nav
// ---------------------------------------------------------------------------
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const linkStyle: CSSProperties = {
    color: scrolled ? C.inkMid : "rgba(245, 242, 234, 0.78)",
    textDecoration: "none",
    fontFamily: FONT,
    fontSize: 14,
    letterSpacing: "-0.005em",
    transition: "color 300ms",
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(245, 242, 234, 0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? `1px solid ${C.line}`
          : "1px solid transparent",
        transition: "all 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        fontFamily: FONT,
      }}
    >
      <Link
        href="/home-15"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: scrolled ? C.ink : C.paper,
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: "-0.01em",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect
            x="2"
            y="2"
            width="18"
            height="18"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M5 14 L9 10 L13 12 L17 7"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="7" r="1.4" fill="currentColor" />
        </svg>
        Precura
      </Link>

      <div
        className="hidden md:flex"
        style={{
          gap: 36,
          alignItems: "center",
        }}
      >
        <a href="#problem" style={linkStyle}>
          The problem
        </a>
        <a href="#how" style={linkStyle}>
          How it works
        </a>
        <a href="#research" style={linkStyle}>
          Research
        </a>
        <a href="#pricing" style={linkStyle}>
          Pricing
        </a>
      </div>

      <button
        style={{
          padding: "10px 20px",
          borderRadius: 100,
          background: scrolled ? C.ink : C.paper,
          color: scrolled ? C.paper : C.ink,
          border: "none",
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: "-0.005em",
          transition: "all 300ms",
        }}
      >
        Start my panel
      </button>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// 01. HERO - Research-forward
// ---------------------------------------------------------------------------
function HeroSection() {
  const { scrollY } = useScroll();
  const fadeOut = useTransform(scrollY, [0, 700], [1, 0]);
  const parallaxY = useTransform(scrollY, [0, 800], [0, 80]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
        background: C.navyDeep,
        color: C.paper,
        fontFamily: FONT,
      }}
    >
      {/* 3D scene - contained to right panel area on desktop, full on mobile */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: fadeOut,
        }}
      >
        <Hero3D />
      </motion.div>

      {/* Softer vignette - no heavy overlay that hides the science */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6, 12, 24, 0.42) 0%, rgba(6, 12, 24, 0.1) 30%, rgba(6, 12, 24, 0) 55%, rgba(6, 12, 24, 0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Foreground content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          y: parallaxY,
        }}
      >
        {/* Top eyebrow row */}
        <div
          style={{
            padding: "120px 40px 0",
            maxWidth: 1440,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Reveal delay={0.1} y={12}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px",
                borderRadius: 100,
                border: "1px solid rgba(180, 213, 224, 0.24)",
                background: "rgba(14, 26, 42, 0.45)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                ...T.monoXs,
                color: "rgba(180, 213, 224, 0.85)",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: C.cyan,
                  boxShadow: `0 0 10px ${C.cyan}`,
                }}
              />
              Built on peer-reviewed clinical science
            </div>
          </Reveal>
        </div>

        {/* Main hero grid: copy (left) + instrument panel (right) */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: 40,
            alignItems: "center",
            padding: "20px 40px 72px",
            maxWidth: 1440,
            margin: "0 auto",
            width: "100%",
          }}
          className="home15-hero-grid"
        >
          {/* Left: headline + sub + CTA + trust row */}
          <div style={{ maxWidth: 720 }}>
            <Reveal delay={0.2}>
              <h1
                style={{
                  ...T.displayXL,
                  margin: "22px 0 0",
                  color: C.paper,
                  maxWidth: 760,
                }}
              >
                The clinical models
                <br />
                your doctor trusts,
                <br />
                <span style={{ color: C.warm, fontStyle: "italic" }}>
                  applied to your data.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.45}>
              <p
                style={{
                  ...T.lead,
                  marginTop: 32,
                  maxWidth: 580,
                  color: "rgba(245, 242, 234, 0.82)",
                }}
              >
                <span
                  style={{
                    ...T.monoSm,
                    color: C.cyanSoft,
                    letterSpacing: "0.08em",
                  }}
                >
                  FINDRISC. SCORE2. FRAX.
                </span>
                <br />
                These are the clinical risk models used in Swedish primary
                care. Precura runs all three automatically, on your blood
                work and your family history, every time you test.
              </p>
            </Reveal>

            {/* CTA row */}
            <Reveal delay={0.6}>
              <div
                style={{
                  marginTop: 44,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    padding: "18px 28px",
                    borderRadius: 100,
                    background: C.paper,
                    color: C.ink,
                    border: "none",
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    letterSpacing: "-0.005em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Start my blood panel
                  <span style={{ color: C.inkMuted, fontSize: 13 }}>
                    995 SEK
                  </span>
                </button>
                <button
                  style={{
                    padding: "18px 24px",
                    borderRadius: 100,
                    background: "transparent",
                    color: C.paper,
                    border: "1px solid rgba(245, 242, 234, 0.28)",
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    letterSpacing: "-0.005em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Read the science
                </button>
              </div>
            </Reveal>

            {/* Trust microcopy row */}
            <Reveal delay={0.8}>
              <div
                style={{
                  marginTop: 56,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(245, 242, 234, 0.14)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px 22px",
                  alignItems: "center",
                  ...T.monoSm,
                  color: "rgba(180, 213, 224, 0.78)",
                }}
              >
                {[
                  { icon: <BookOpen size={12} />, label: "34 peer-reviewed studies" },
                  { icon: <Lock size={12} />, label: "GDPR / EU hosted" },
                  { icon: <Shield size={12} />, label: "BankID" },
                  { icon: <Stethoscope size={12} />, label: "Karolinska trained" },
                ].map((t, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {t.icon}
                    {t.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: instrument panel labels floating over the 3D */}
          <Reveal delay={0.6} amount={0.1}>
            <HeroInstrumentPanel />
          </Reveal>
        </div>
      </motion.div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home15-hero-grid) {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Scientific instrument panel overlay - the contained "Your risk surface"
// box with labels and axes.
function HeroInstrumentPanel() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1.05",
        maxWidth: 560,
        marginLeft: "auto",
      }}
    >
      {/* Frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid rgba(180, 213, 224, 0.22)",
          borderRadius: 4,
          background:
            "linear-gradient(180deg, rgba(180, 213, 224, 0.04) 0%, rgba(14, 26, 42, 0) 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Top label bar */}
      <div
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          right: -1,
          padding: "10px 16px",
          background: "rgba(14, 26, 42, 0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(180, 213, 224, 0.22)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          ...T.monoXs,
          color: "rgba(180, 213, 224, 0.9)",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <span>Anna B / risk surface / today</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: C.warm,
              boxShadow: `0 0 6px ${C.warm}`,
              animation: "home15pulse 2.2s infinite",
            }}
          />
          live
        </span>
      </div>

      {/* Coordinate labels - left axis */}
      <div
        style={{
          position: "absolute",
          left: -38,
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          ...T.monoXs,
          color: "rgba(180, 213, 224, 0.55)",
          whiteSpace: "nowrap",
        }}
      >
        fasting glucose (mmol/L)
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -32,
          left: "50%",
          transform: "translateX(-50%)",
          ...T.monoXs,
          color: "rgba(180, 213, 224, 0.55)",
        }}
      >
        time (years)
      </div>

      {/* Floating readout labels pointing to peaks */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          right: "6%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 3,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            ...T.monoXs,
            color: C.warm,
            letterSpacing: "0.06em",
          }}
        >
          2026 / 5.8 mmol/L
        </span>
        <span
          style={{
            ...T.monoSm,
            color: "rgba(245, 242, 234, 0.62)",
            letterSpacing: "0.02em",
          }}
        >
          borderline
        </span>
        <svg width="80" height="20" style={{ marginTop: 4 }}>
          <line
            x1="0"
            y1="10"
            x2="78"
            y2="10"
            stroke={C.warm}
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <circle cx="2" cy="10" r="2" fill={C.warm} />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "7%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            ...T.monoXs,
            color: C.cyanSoft,
            letterSpacing: "0.06em",
          }}
        >
          2021 / 5.0 mmol/L
        </span>
        <span
          style={{
            ...T.monoSm,
            color: "rgba(245, 242, 234, 0.62)",
            letterSpacing: "0.02em",
          }}
        >
          first test
        </span>
      </div>

      {/* Bottom readout strip */}
      <div
        style={{
          position: "absolute",
          left: -1,
          right: -1,
          bottom: -1,
          padding: "10px 16px",
          background: "rgba(14, 26, 42, 0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(180, 213, 224, 0.22)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          ...T.monoXs,
          color: "rgba(180, 213, 224, 0.82)",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <div>
          <div style={{ color: "rgba(180, 213, 224, 0.5)" }}>findrisc</div>
          <div style={{ color: C.warm, fontSize: 13, marginTop: 2 }}>
            12 / 26
          </div>
        </div>
        <div>
          <div style={{ color: "rgba(180, 213, 224, 0.5)" }}>score2</div>
          <div style={{ color: C.cyanSoft, fontSize: 13, marginTop: 2 }}>
            3 %
          </div>
        </div>
        <div>
          <div style={{ color: "rgba(180, 213, 224, 0.5)" }}>frax</div>
          <div style={{ color: C.cyanSoft, fontSize: 13, marginTop: 2 }}>
            2 %
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes home15pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.4);
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 02. PROBLEM - statistical depth with citations
// ---------------------------------------------------------------------------
function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        background: C.paper,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>01 / The problem</Eyebrow>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
          className="home15-problem-grid"
        >
          <Reveal delay={0.1}>
            <h2 style={{ ...T.displayL, margin: 0, maxWidth: 720 }}>
              Around one in two Swedes with type 2 diabetes{" "}
              <span style={{ color: C.warm, fontStyle: "italic" }}>
                go undiagnosed for years.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div
              style={{
                ...T.body,
                color: C.inkMid,
                maxWidth: 460,
              }}
            >
              <p style={{ margin: "0 0 18px" }}>
                The Stockholm Diabetes Prevention Programme followed more than
                7,000 adults for two decades. Roughly half the T2D cases
                identified had been silently progressing for years before a
                clinician noticed.
                <Cite n={1} label="SDPP / Carlsson et al, BMC Medicine 2024" />
              </p>
              <p style={{ margin: 0 }}>
                The data was already there. Every annual check-up, every
                routine panel. Nobody stitched it together over time. That is
                what Precura does.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Stat wall */}
        <div
          style={{
            marginTop: 100,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            border: `1px solid ${C.line}`,
            borderRadius: 4,
            background: C.card,
            overflow: "hidden",
          }}
          className="home15-stat-wall"
        >
          {[
            {
              big: "50 %",
              label: "Of Swedish T2D cases undiagnosed at first detection",
              cite: 1,
              citeLabel: "SDPP / Carlsson et al",
            },
            {
              big: "5 yrs",
              label: "Average silent progression before diagnosis",
              cite: 2,
              citeLabel: "UKPDS / Turner et al",
            },
            {
              big: "58 %",
              label: "T2D risk reduction achievable through intervention",
              cite: 3,
              citeLabel: "DPP / Knowler et al, NEJM 2002",
            },
            {
              big: "12 pts",
              label: "Average FINDRISC score for Swedish adults 40+",
              cite: 4,
              citeLabel: "Lindstrom & Tuomilehto 2003",
            },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                style={{
                  padding: 36,
                  borderRight:
                    i < 3 ? `1px solid ${C.line}` : "none",
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    ...T.displayM,
                    color: C.ink,
                    fontWeight: 500,
                  }}
                >
                  {s.big}
                </div>
                <div>
                  <div
                    style={{
                      ...T.small,
                      color: C.inkMid,
                      marginBottom: 14,
                      maxWidth: 240,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      ...T.monoXs,
                      color: C.cyan,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <BookOpen size={11} />
                    {s.citeLabel}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home15-problem-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          :global(.home15-stat-wall) {
            grid-template-columns: 1fr 1fr !important;
          }
          :global(.home15-stat-wall > div > div) {
            border-right: none !important;
            border-bottom: 1px solid ${C.line};
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 03. ANNA STORY - data-rich trajectory chart
// ---------------------------------------------------------------------------
const ANNA_DATA = [
  { year: 2021, value: 5.0, label: "First test", context: "Routine check. GP said 'all normal'." },
  { year: 2022, value: 5.1, label: "", context: "BP check. Started Enalapril 5mg." },
  { year: 2023, value: 5.2, label: "", context: "Annual panel. 'Slightly high cholesterol.'" },
  { year: 2024, value: 5.4, label: "", context: "Weight up 1kg. No follow-up." },
  { year: 2025, value: 5.5, label: "", context: "New GP. Panel ordered." },
  { year: 2026, value: 5.8, label: "Today", context: "Precura flagged it. FINDRISC score 12 / moderate." },
];

function AnnaStory() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.3 });

  const W = 960;
  const H = 440;
  const PAD = { top: 48, right: 90, bottom: 70, left: 100 };
  const MIN = 4.6;
  const MAX = 6.2;
  const REF = 6.0;

  const xForIdx = (i: number) =>
    PAD.left +
    (i / (ANNA_DATA.length - 1)) * (W - PAD.left - PAD.right);
  const yForVal = (v: number) =>
    H -
    PAD.bottom -
    ((v - MIN) / (MAX - MIN)) * (H - PAD.top - PAD.bottom);

  const pathD = ANNA_DATA.map((d, i) => {
    const x = xForIdx(i);
    const y = yForVal(d.value);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = xForIdx(i - 1);
    const prevY = yForVal(ANNA_DATA[i - 1].value);
    const cx1 = prevX + (x - prevX) * 0.5;
    const cx2 = prevX + (x - prevX) * 0.5;
    return `C ${cx1} ${prevY}, ${cx2} ${y}, ${x} ${y}`;
  }).join(" ");

  return (
    <section
      style={{
        background: C.paperSoft,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>02 / One member</Eyebrow>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 60,
            alignItems: "end",
            marginBottom: 60,
          }}
          className="home15-anna-header"
        >
          <Reveal delay={0.1}>
            <h2 style={{ ...T.displayL, margin: 0, maxWidth: 800 }}>
              Anna Bergstrom, 40.
              <br />
              <span style={{ color: C.warm, fontStyle: "italic" }}>
                Five years, six tests, one trajectory.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                ...T.body,
                color: C.inkMid,
                margin: 0,
                maxWidth: 460,
              }}
            >
              Anna is the person we built Precura for. Her glucose sat inside
              the reference range for every panel. No single test looked
              alarming. But the trend did.
            </p>
          </Reveal>
        </div>

        {/* Chart card */}
        <div
          ref={chartRef}
          style={{
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 4,
            padding: "36px 36px 24px",
            boxShadow: "0 2px 24px rgba(12, 20, 32, 0.04)",
          }}
        >
          {/* Chart header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: `1px solid ${C.line}`,
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ ...T.monoXs, color: C.inkMuted, marginBottom: 6 }}>
                precura / patient chart / fasting plasma glucose
              </div>
              <div style={{ ...T.displayS, color: C.ink, margin: 0 }}>
                fP-Glucose / Anna B / 2021 to 2026
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 24,
                ...T.monoSm,
                color: C.inkMuted,
              }}
            >
              <div>
                <div style={{ marginBottom: 3 }}>ref range</div>
                <div style={{ color: C.ink, fontSize: 13 }}>3.9 to 6.0</div>
              </div>
              <div>
                <div style={{ marginBottom: 3 }}>units</div>
                <div style={{ color: C.ink, fontSize: 13 }}>mmol/L</div>
              </div>
              <div>
                <div style={{ marginBottom: 3 }}>n readings</div>
                <div style={{ color: C.ink, fontSize: 13 }}>6</div>
              </div>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              <linearGradient id="home15area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.warm} stopOpacity="0.24" />
                <stop offset="100%" stopColor={C.warm} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="home15line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={C.cyan} />
                <stop offset="60%" stopColor={C.warm} />
                <stop offset="100%" stopColor={C.warmDeep} />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[5.0, 5.4, 5.8, 6.2].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={yForVal(v)}
                  y2={yForVal(v)}
                  stroke="#E7E3D8"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 14}
                  y={yForVal(v) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill={C.inkMuted}
                  fontFamily={MONO}
                >
                  {v.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Upper reference band */}
            <rect
              x={PAD.left}
              y={yForVal(REF)}
              width={W - PAD.left - PAD.right}
              height={yForVal(MIN) - yForVal(REF)}
              fill={C.warmWash}
              opacity="0.3"
            />

            {/* Reference line at 6.0 */}
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yForVal(REF)}
              y2={yForVal(REF)}
              stroke={C.warmDeep}
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.8"
            />
            <text
              x={W - PAD.right + 8}
              y={yForVal(REF) + 4}
              fontSize="10"
              fill={C.warmDeep}
              fontFamily={MONO}
            >
              6.0 upper ref
            </text>

            {/* Area */}
            <motion.path
              d={
                pathD +
                ` L ${xForIdx(ANNA_DATA.length - 1)} ${H - PAD.bottom}` +
                ` L ${xForIdx(0)} ${H - PAD.bottom} Z`
              }
              fill="url(#home15area)"
              initial={{ opacity: 0 }}
              animate={chartInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.0, duration: 1.0 }}
            />

            {/* Trajectory line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#home15line)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={chartInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2.0, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* Points + labels */}
            {ANNA_DATA.map((d, i) => {
              const x = xForIdx(i);
              const y = yForVal(d.value);
              const isLast = i === ANNA_DATA.length - 1;
              return (
                <g key={i}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isLast ? 6 : 3.6}
                    fill={isLast ? C.warmDeep : C.warm}
                    stroke={C.card}
                    strokeWidth={isLast ? 3 : 2}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={chartInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1.9 + i * 0.08 }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                  <motion.text
                    x={x}
                    y={H - PAD.bottom + 22}
                    textAnchor="middle"
                    fontSize="11"
                    fill={C.inkMuted}
                    fontFamily={MONO}
                    initial={{ opacity: 0 }}
                    animate={chartInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2.0 + i * 0.08 }}
                  >
                    {d.year}
                  </motion.text>
                  <motion.text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={600}
                    fill={C.ink}
                    fontFamily={MONO}
                    initial={{ opacity: 0 }}
                    animate={chartInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2.2 + i * 0.08 }}
                  >
                    {d.value.toFixed(1)}
                  </motion.text>
                  {d.label && (
                    <motion.text
                      x={x}
                      y={isLast ? y - 32 : H - PAD.bottom + 40}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isLast ? C.warmDeep : C.inkMuted}
                      fontFamily={FONT}
                      fontWeight={isLast ? 600 : 400}
                      fontStyle="italic"
                      initial={{ opacity: 0 }}
                      animate={chartInView ? { opacity: 1 } : {}}
                      transition={{ delay: 2.6 + i * 0.05 }}
                    >
                      {d.label}
                    </motion.text>
                  )}
                </g>
              );
            })}

            {/* Callout */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={chartInView ? { opacity: 1 } : {}}
              transition={{ delay: 3.0, duration: 0.8 }}
            >
              <line
                x1={xForIdx(2)}
                y1={yForVal(5.2) - 56}
                x2={xForIdx(2)}
                y2={yForVal(5.2) - 18}
                stroke={C.inkMuted}
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text
                x={xForIdx(2)}
                y={yForVal(5.2) - 66}
                textAnchor="middle"
                fontSize="11"
                fill={C.inkMuted}
                fontFamily={FONT}
                fontStyle="italic"
              >
                every test: inside the reference range
              </text>
            </motion.g>
          </svg>

          {/* Chart footer citation */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: `1px solid ${C.line}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              ...T.monoSm,
              color: C.inkMuted,
            }}
          >
            <span>
              source: karolinska university laboratory / five annual panels
            </span>
            <span style={{ color: C.warmDeep }}>
              slope: +0.16 mmol/L per year
            </span>
          </div>
        </div>

        {/* Pullquote under chart */}
        <Reveal delay={0.2}>
          <blockquote
            style={{
              margin: "80px auto 0",
              maxWidth: 820,
              padding: "40px 0",
              borderTop: `1px solid ${C.line}`,
              borderBottom: `1px solid ${C.line}`,
              ...T.displayS,
              color: C.inkSoft,
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            <QuoteIcon
              size={30}
              color={C.warm}
              style={{ display: "block", margin: "0 auto 18px" }}
            />
            "A 5.8 fasting glucose is not diabetes. But a 5-year slope from
            5.0 to 5.8 is a{" "}
            <span style={{ color: C.warmDeep, fontStyle: "italic" }}>
              different conversation
            </span>
            . That slope is what the FINDRISC model is built to catch."
            <footer
              style={{
                ...T.monoSm,
                color: C.inkMuted,
                marginTop: 18,
                textTransform: "none",
                letterSpacing: "0.04em",
              }}
            >
              Dr. Marcus Johansson, medical lead, Precura
            </footer>
          </blockquote>
        </Reveal>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home15-anna-header) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 04. HOW IT WORKS - vertical 4-step timeline
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      num: "Step 01",
      title: "Book a blood panel.",
      body: "Pick a clinic in Stockholm, Goteborg, Malmo, Uppsala or Lund. Our 14-marker standard panel covers HbA1c, fasting glucose and insulin, full lipid profile, thyroid, vitamin D, kidney and liver function. 10 minutes. Results in 48 hours.",
      metric: "14 markers",
      metricSub: "from a single blood draw",
      icon: <FlaskConical size={26} />,
      tag: "995 SEK",
    },
    {
      num: "Step 02",
      title: "We run the clinical risk models.",
      body: "FINDRISC for type 2 diabetes risk. SCORE2 for cardiovascular disease. FRAX for bone fracture risk. These are the same validated algorithms Swedish primary care uses, published in Diabetes Care, European Heart Journal and Osteoporosis International.",
      metric: "3 models",
      metricSub: "same math your GP uses",
      icon: <LineChartIcon size={26} />,
      tag: "FINDRISC / SCORE2 / FRAX",
    },
    {
      num: "Step 03",
      title: "Your doctor writes a review.",
      body: "Dr. Marcus Johansson, Karolinska trained GP, personally reads every risk report. You get a written note on what the numbers mean for you specifically, a ranked list of the levers that matter most, and 12 months of in-app chat with him.",
      metric: "48 hours",
      metricSub: "from blood draw to written review",
      icon: <Stethoscope size={26} />,
      tag: "Leg. lakare",
    },
    {
      num: "Step 04",
      title: "Your coach builds the plan.",
      body: "Your metabolic profile is handed to a Precura coach who builds a training block and a nutrition shape calibrated to your markers. Real sets, reps and weights, not 'exercise more'. Adapted every 6 months as your numbers move.",
      metric: "every 6 mo.",
      metricSub: "plan updates on retest cadence",
      icon: <Dumbbell size={26} />,
      tag: "Active coaching",
    },
  ];

  return (
    <section
      id="how"
      style={{
        background: C.paper,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 40,
            flexWrap: "wrap",
            marginBottom: 80,
          }}
        >
          <Reveal>
            <div>
              <Eyebrow>03 / How it works</Eyebrow>
              <h2 style={{ ...T.displayL, margin: 0, maxWidth: 780 }}>
                Blood in.
                <br />
                <span style={{ color: C.warm, fontStyle: "italic" }}>
                  Clarity out.
                </span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                ...T.body,
                color: C.inkMid,
                maxWidth: 360,
                margin: 0,
              }}
            >
              Four steps from a single blood draw to a living risk profile
              that keeps working in the background.
            </p>
          </Reveal>
        </div>

        {/* Vertical timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical rail */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 20,
              bottom: 20,
              left: 39,
              width: 1,
              background: C.lineStrong,
            }}
            className="home15-rail"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 60,
            }}
          >
            {steps.map((s, i) => (
              <TimelineStep key={i} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home15-step-grid) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

function TimelineStep({
  step,
  index,
}: {
  step: {
    num: string;
    title: string;
    body: string;
    metric: string;
    metricSub: string;
    icon: ReactNode;
    tag: string;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 40,
        position: "relative",
      }}
    >
      {/* Marker column */}
      <div
        style={{
          flexShrink: 0,
          width: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: C.card,
            border: `1px solid ${C.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.warmDeep,
            position: "relative",
            zIndex: 2,
          }}
        >
          {step.icon}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 40,
          alignItems: "start",
          paddingBottom: 20,
          borderBottom: `1px solid ${C.line}`,
        }}
        className="home15-step-grid"
      >
        {/* Left: copy */}
        <div>
          <div
            style={{
              ...T.monoXs,
              color: C.cyan,
              marginBottom: 16,
            }}
          >
            {step.num} / {String(index + 1).padStart(2, "0")} of 04
          </div>
          <h3
            style={{
              ...T.displayM,
              margin: 0,
              color: C.ink,
              maxWidth: 560,
            }}
          >
            {step.title}
          </h3>
          <p
            style={{
              ...T.body,
              color: C.inkMid,
              marginTop: 20,
              maxWidth: 600,
            }}
          >
            {step.body}
          </p>
          <div
            style={{
              marginTop: 24,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 100,
              background: C.paperDeep,
              border: `1px solid ${C.line}`,
              ...T.monoSm,
              color: C.inkMid,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: C.warm,
              }}
            />
            {step.tag}
          </div>
        </div>

        {/* Right: metric card */}
        <div
          style={{
            background: C.paperSoft,
            border: `1px solid ${C.line}`,
            borderRadius: 4,
            padding: 24,
          }}
        >
          <div
            style={{
              ...T.monoXs,
              color: C.inkMuted,
              marginBottom: 12,
            }}
          >
            what you get
          </div>
          <div
            style={{
              fontSize: "clamp(30px, 3.2vw, 42px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: C.ink,
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            {step.metric}
          </div>
          <div
            style={{
              ...T.small,
              color: C.inkMuted,
            }}
          >
            {step.metricSub}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 05. LIVING PROFILE - "Not a report. A living profile."
// ---------------------------------------------------------------------------
function LivingProfile() {
  return (
    <section
      style={{
        background: C.navyDeep,
        color: C.paper,
        padding: "180px 40px",
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(180, 213, 224, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180, 213, 224, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Reveal>
          <Eyebrow color={C.cyanSoft}>04 / The product shape</Eyebrow>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 60,
            alignItems: "center",
            marginBottom: 80,
          }}
          className="home15-living-grid"
        >
          <Reveal delay={0.1}>
            <h2
              style={{
                ...T.displayXL,
                margin: 0,
                color: C.paper,
                maxWidth: 800,
              }}
            >
              Not a report.
              <br />
              <span style={{ color: C.warm, fontStyle: "italic" }}>
                A living profile.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.25}>
            <p
              style={{
                ...T.lead,
                color: "rgba(245, 242, 234, 0.76)",
                margin: 0,
                maxWidth: 460,
              }}
            >
              Every test you ever take becomes part of the same continuous
              record. The risk models re-run on the new data. Your doctor
              sees the new slope. Your coach adjusts the plan. Nothing
              resets. Nothing is forgotten.
            </p>
          </Reveal>
        </div>

        {/* Split panel showing: static report (left, ghosted) vs living profile (right, bright) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            border: "1px solid rgba(180, 213, 224, 0.2)",
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(14, 26, 42, 0.5)",
          }}
          className="home15-living-split"
        >
          {/* Left: static */}
          <Reveal delay={0.1}>
            <div
              style={{
                padding: "48px 40px",
                borderRight: "1px solid rgba(180, 213, 224, 0.2)",
                minHeight: 440,
                position: "relative",
                background: "rgba(6, 12, 24, 0.4)",
                opacity: 0.68,
              }}
            >
              <div
                style={{
                  ...T.monoXs,
                  color: "rgba(180, 213, 224, 0.5)",
                  marginBottom: 20,
                }}
              >
                A typical report
              </div>
              <h3
                style={{
                  ...T.displayS,
                  margin: "0 0 16px",
                  color: "rgba(245, 242, 234, 0.72)",
                }}
              >
                A pdf. One test. One moment.
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginTop: 30,
                }}
              >
                {[
                  { k: "status", v: "normal" },
                  { k: "action", v: "none" },
                  { k: "follow-up", v: "next year" },
                  { k: "context", v: "none" },
                  { k: "updates", v: "never" },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(180, 213, 224, 0.08)",
                      ...T.monoSm,
                      color: "rgba(180, 213, 224, 0.55)",
                    }}
                  >
                    <span>{row.k}</span>
                    <span>{row.v}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 40,
                  ...T.monoXs,
                  color: "rgba(180, 213, 224, 0.4)",
                  fontStyle: "italic",
                  textTransform: "none",
                  letterSpacing: "0",
                }}
              >
                filed. closed. forgotten.
              </div>
            </div>
          </Reveal>

          {/* Right: living */}
          <Reveal delay={0.25}>
            <div
              style={{
                padding: "48px 40px",
                minHeight: 440,
                position: "relative",
                background:
                  "linear-gradient(180deg, rgba(62, 134, 166, 0.12) 0%, rgba(14, 26, 42, 0.4) 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: C.warm,
                    boxShadow: `0 0 12px ${C.warm}`,
                    animation: "home15pulse2 2s infinite",
                  }}
                />
                <div
                  style={{
                    ...T.monoXs,
                    color: C.warm,
                  }}
                >
                  Precura living profile
                </div>
              </div>
              <h3
                style={{
                  ...T.displayS,
                  margin: "0 0 16px",
                  color: C.paper,
                }}
              >
                A health twin. All tests. All signals.
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginTop: 30,
                }}
              >
                {[
                  { k: "tests", v: "6 panels / 5 years", c: C.cyanSoft },
                  { k: "risk models", v: "FINDRISC + SCORE2 + FRAX", c: C.cyanSoft },
                  { k: "doctor review", v: "every test / yours to ask", c: C.cyanSoft },
                  { k: "coach plan", v: "retuned every 6 months", c: C.cyanSoft },
                  { k: "updates", v: "continuous", c: C.warm },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(180, 213, 224, 0.15)",
                      ...T.monoSm,
                      color: "rgba(245, 242, 234, 0.9)",
                      gap: 12,
                    }}
                  >
                    <span style={{ color: "rgba(180, 213, 224, 0.7)" }}>
                      {row.k}
                    </span>
                    <span style={{ color: row.c, textAlign: "right" }}>
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 40,
                  ...T.monoXs,
                  color: C.warm,
                  fontStyle: "italic",
                  textTransform: "none",
                  letterSpacing: "0",
                }}
              >
                keeps working in the background.
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @keyframes home15pulse2 {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.6);
          }
        }
        @media (max-width: 900px) {
          :global(.home15-living-grid),
          :global(.home15-living-split) {
            grid-template-columns: 1fr !important;
          }
          :global(.home15-living-split > div) {
            border-right: none !important;
            border-bottom: 1px solid rgba(180, 213, 224, 0.2) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 06. WHAT YOU GET - 6 features covering all 5 pillars
// ---------------------------------------------------------------------------
function WhatYouGet() {
  const features = [
    {
      tag: "Pillar 1 / Research",
      title: "Risk models your GP trusts.",
      body: "FINDRISC, SCORE2, SCORE2-Diabetes, FRAX, SDPP. The same peer-reviewed models Swedish primary care runs. We run all of them, every test.",
      icon: <Microscope size={22} />,
      cite: "8 validated models",
    },
    {
      tag: "Pillar 2 / Biomarkers",
      title: "40+ markers in one panel.",
      body: "HbA1c, fasting glucose and insulin, full lipid profile with ApoB, hs-CRP, Omega-3 index, vitamin D, ferritin, TSH, full kidney and liver. One draw.",
      icon: <Database size={22} />,
      cite: "from 10 mL of blood",
    },
    {
      tag: "Pillar 3 / Doctor",
      title: "Your personal Swedish GP.",
      body: "Dr. Marcus Johansson, Karolinska trained, 15 years in primary care, reviews every panel personally. Secure in-app chat for 12 months.",
      icon: <Stethoscope size={22} />,
      cite: "Leg. lakare",
    },
    {
      tag: "Pillar 4 / Coaching",
      title: "A plan for your metabolism.",
      body: "A certified coach turns your biomarker profile into real training (sets, reps, weights) and a nutrition shape. Not generic 'exercise more'.",
      icon: <Dumbbell size={22} />,
      cite: "Exercise prescription",
    },
    {
      tag: "Pillar 5 / Living",
      title: "A continuously updated profile.",
      body: "Every new test is added to the same record. The slope is what matters. Your profile is never a snapshot, it is a health twin that evolves.",
      icon: <LineChartIcon size={22} />,
      cite: "Updated quarterly",
    },
    {
      tag: "Messaging",
      title: "Ask your doctor anything.",
      body: "A secure thread with Dr. Johansson and an AI copilot trained on your full Precura record. You do not have to book an appointment to ask a question.",
      icon: <MessageSquareText size={22} />,
      cite: "24h average reply",
    },
  ];

  return (
    <section
      style={{
        background: C.paperSoft,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>05 / Five pillars</Eyebrow>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 style={{ ...T.displayL, margin: "0 0 60px", maxWidth: 960 }}>
            Precura is a{" "}
            <span style={{ color: C.warm, fontStyle: "italic" }}>
              complete predictive platform
            </span>
            , not a fancy blood test.
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
          className="home15-features-grid"
        >
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: "36px 32px",
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 32,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: C.paperDeep,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.warmDeep,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div
                    style={{
                      ...T.monoXs,
                      color: C.cyan,
                    }}
                  >
                    {f.tag}
                  </div>
                </div>
                <h3
                  style={{
                    ...T.displayS,
                    margin: "0 0 14px",
                    color: C.ink,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    ...T.body,
                    color: C.inkMid,
                    margin: "0 0 24px",
                    flex: 1,
                  }}
                >
                  {f.body}
                </p>
                <div
                  style={{
                    paddingTop: 20,
                    borderTop: `1px solid ${C.line}`,
                    ...T.monoXs,
                    color: C.inkMuted,
                  }}
                >
                  {f.cite}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          :global(.home15-features-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 700px) {
          :global(.home15-features-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 07. RESEARCH CAROUSEL - clickable scientific paper cards
// ---------------------------------------------------------------------------
const STUDIES = [
  {
    id: "findrisc",
    short: "FINDRISC",
    title: "The Diabetes Risk Score: a practical tool to predict type 2 diabetes risk.",
    authors: "Lindstrom J, Tuomilehto J.",
    journal: "Diabetes Care",
    year: "2003",
    volume: "26(3):725-731",
    doi: "10.2337/diacare.26.3.725",
    n: 4746,
    followUp: "10 years",
    predicts: "10-year incident type 2 diabetes",
    howPrecuraUses:
      "Precura computes your FINDRISC score automatically from age, BMI, waist circumference, physical activity, diet, antihypertensive history, blood glucose history and family history. A score of 12 flags moderate risk and triggers a focused doctor review.",
    citation:
      "Lindstrom J, Tuomilehto J. The Diabetes Risk Score: a practical tool to predict type 2 diabetes risk. Diabetes Care. 2003 Mar;26(3):725-731.",
    color: C.warm,
  },
  {
    id: "score2",
    short: "SCORE2",
    title: "SCORE2 risk prediction algorithms: new models to estimate 10-year risk of cardiovascular disease in Europe.",
    authors: "SCORE2 working group and ESC Cardiovascular risk collaboration.",
    journal: "European Heart Journal",
    year: "2021",
    volume: "42(25):2439-2454",
    doi: "10.1093/eurheartj/ehab309",
    n: 677684,
    followUp: "10 years",
    predicts: "10-year fatal and non-fatal cardiovascular events",
    howPrecuraUses:
      "Precura runs SCORE2 using your age, sex, smoking status, systolic blood pressure, total cholesterol and HDL cholesterol, calibrated to the low-risk European region that Sweden belongs to. The result is your 10-year CVD risk band.",
    citation:
      "SCORE2 working group and ESC Cardiovascular risk collaboration. SCORE2 risk prediction algorithms: new models to estimate 10-year risk of cardiovascular disease in Europe. Eur Heart J. 2021 Jul 1;42(25):2439-2454.",
    color: C.cyan,
  },
  {
    id: "frax",
    short: "FRAX",
    title: "FRAX and the assessment of fracture probability in men and women from the UK.",
    authors: "Kanis JA, Johnell O, Oden A, Johansson H, McCloskey E.",
    journal: "Osteoporosis International",
    year: "2008",
    volume: "19(4):385-397",
    doi: "10.1007/s00198-007-0543-5",
    n: 230486,
    followUp: "10 years",
    predicts: "10-year probability of major osteoporotic fracture",
    howPrecuraUses:
      "Precura runs a FRAX assessment for every member using age, sex, weight, height, previous fracture history, parental hip fracture, current smoking, glucocorticoid use, rheumatoid arthritis and alcohol intake. If bone density data is in your record we include it.",
    citation:
      "Kanis JA, Johnell O, Oden A, Johansson H, McCloskey E. FRAX and the assessment of fracture probability in men and women from the UK. Osteoporos Int. 2008 Apr;19(4):385-397.",
    color: C.warmDeep,
  },
  {
    id: "sdpp",
    short: "SDPP",
    title: "Twenty years of the Stockholm Diabetes Prevention Programme: long-term outcomes.",
    authors: "Carlsson AC et al.",
    journal: "BMC Medicine",
    year: "2024",
    volume: "22:108",
    doi: "10.1186/s12916-024-03325-8",
    n: 7506,
    followUp: "20 years",
    predicts: "T2D incidence across Swedish adult cohorts",
    howPrecuraUses:
      "The SDPP gives us real Swedish population baselines for glucose trajectories, BMI, waist circumference and family history weighting. Our risk calibrations are tuned to this dataset rather than imported American norms.",
    citation:
      "Carlsson AC et al. Twenty years of the Stockholm Diabetes Prevention Programme: long-term outcomes. BMC Med. 2024;22:108.",
    color: C.slate,
  },
  {
    id: "dpp",
    short: "DPP",
    title: "Reduction in the incidence of type 2 diabetes with lifestyle intervention or metformin.",
    authors: "Knowler WC et al.",
    journal: "New England Journal of Medicine",
    year: "2002",
    volume: "346(6):393-403",
    doi: "10.1056/NEJMoa012512",
    n: 3234,
    followUp: "2.8 years",
    predicts: "Effect of lifestyle intervention on T2D incidence",
    howPrecuraUses:
      "The Diabetes Prevention Program is why Precura invests so heavily in the coaching pillar. A 58 percent reduction in T2D incidence via structured lifestyle change is one of the strongest effect sizes in preventive medicine. We translate it into a real training plan.",
    citation:
      "Knowler WC et al. Reduction in the incidence of type 2 diabetes with lifestyle intervention or metformin. N Engl J Med. 2002;346(6):393-403.",
    color: C.good,
  },
  {
    id: "ukpds",
    short: "UKPDS",
    title: "Intensive blood-glucose control with sulphonylureas or insulin compared with conventional treatment and risk of complications in patients with type 2 diabetes.",
    authors: "UK Prospective Diabetes Study (UKPDS) Group.",
    journal: "Lancet",
    year: "1998",
    volume: "352(9131):837-853",
    doi: "10.1016/S0140-6736(98)07019-6",
    n: 5102,
    followUp: "10 years",
    predicts: "Glycaemic control and T2D complications",
    howPrecuraUses:
      "UKPDS shaped our interpretation of HbA1c trajectories and how early intervention shifts long-term outcomes. It is why Precura reads your glucose and HbA1c as a slope, not a snapshot.",
    citation:
      "UK Prospective Diabetes Study (UKPDS) Group. Intensive blood-glucose control with sulphonylureas or insulin compared with conventional treatment and risk of complications in patients with type 2 diabetes (UKPDS 33). Lancet. 1998;352(9131):837-853.",
    color: C.cyan,
  },
  {
    id: "s2d",
    short: "SCORE2-Diabetes",
    title: "SCORE2-Diabetes: 10-year cardiovascular risk estimation in type 2 diabetes in Europe.",
    authors: "SCORE2-Diabetes Working Group and ESC Cardiovascular risk collaboration.",
    journal: "European Heart Journal",
    year: "2023",
    volume: "44(28):2544-2556",
    doi: "10.1093/eurheartj/ehad260",
    n: 229460,
    followUp: "10 years",
    predicts: "CVD risk specifically in people with T2D",
    howPrecuraUses:
      "If a member has confirmed T2D or prediabetes, Precura switches their cardiovascular risk model to SCORE2-Diabetes, which adjusts the baseline hazard and adds HbA1c and eGFR as predictors. More accurate than vanilla SCORE2 for this subgroup.",
    citation:
      "SCORE2-Diabetes Working Group. SCORE2-Diabetes: 10-year cardiovascular risk estimation in type 2 diabetes in Europe. Eur Heart J. 2023;44(28):2544-2556.",
    color: C.warm,
  },
  {
    id: "ada",
    short: "ADA 2024",
    title: "Standards of Care in Diabetes, 2024.",
    authors: "American Diabetes Association.",
    journal: "Diabetes Care",
    year: "2024",
    volume: "47(Suppl 1)",
    doi: "10.2337/dc24-Sint",
    n: null,
    followUp: null,
    predicts: "Reference guideline for screening and intervention",
    howPrecuraUses:
      "Our interpretation thresholds for fasting glucose, HbA1c, impaired glucose tolerance and metabolic syndrome align with ADA Standards of Care 2024 and current ESC 2021 guidelines, so your Precura review matches what a Swedish endocrinologist would say.",
    citation:
      "American Diabetes Association. Standards of Care in Diabetes 2024. Diabetes Care. 2024;47(Suppl 1).",
    color: C.cyanSoft,
  },
];

function ResearchCarousel() {
  const [active, setActive] = useState(0);
  const current = STUDIES[active];

  return (
    <section
      id="research"
      style={{
        background: C.paper,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 40,
            flexWrap: "wrap",
            marginBottom: 60,
          }}
        >
          <Reveal>
            <div>
              <Eyebrow>06 / The literature</Eyebrow>
              <h2 style={{ ...T.displayL, margin: 0, maxWidth: 820 }}>
                Every prediction comes
                <br />
                from{" "}
                <span style={{ color: C.warm, fontStyle: "italic" }}>
                  a real paper.
                </span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              style={{
                ...T.body,
                color: C.inkMid,
                maxWidth: 400,
                margin: 0,
              }}
            >
              These are the peer-reviewed studies that Precura is built on.
              Click any paper to see what it predicts and how we apply it to
              your data.
            </p>
          </Reveal>
        </div>

        {/* Carousel: thumbnail rail on left, expanded paper on right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 40,
            alignItems: "start",
          }}
          className="home15-research-grid"
        >
          {/* Thumbnail rail */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "sticky",
              top: 120,
            }}
          >
            <div
              style={{
                ...T.monoXs,
                color: C.inkMuted,
                marginBottom: 10,
              }}
            >
              {String(STUDIES.length).padStart(2, "0")} papers in the library
            </div>
            {STUDIES.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  style={{
                    textAlign: "left",
                    padding: "16px 18px",
                    background: isActive ? C.card : "transparent",
                    border: `1px solid ${isActive ? C.lineStrong : C.line}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    transition:
                      "all 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background: isActive ? s.color : C.lineStrong,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          ...T.monoXs,
                          color: isActive ? s.color : C.inkMuted,
                          marginBottom: 3,
                        }}
                      >
                        {s.short}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: isActive ? C.ink : C.inkMid,
                          letterSpacing: "-0.005em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.journal} {s.year}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      ...T.monoXs,
                      color: isActive ? s.color : C.inkFaint,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expanded paper card */}
          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 4,
                padding: "44px 48px",
                minHeight: 620,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header strip */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 24,
                  borderBottom: `1px solid ${C.line}`,
                  marginBottom: 36,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: current.color,
                      boxShadow: `0 0 0 5px ${current.color}22`,
                    }}
                  />
                  <div
                    style={{
                      ...T.monoXs,
                      color: current.color,
                    }}
                  >
                    {current.short} / paper {String(active + 1).padStart(2, "0")} of{" "}
                    {String(STUDIES.length).padStart(2, "0")}
                  </div>
                </div>
                <div
                  style={{
                    ...T.monoSm,
                    color: C.inkMuted,
                    letterSpacing: "0.04em",
                  }}
                >
                  doi: {current.doi}
                </div>
              </div>

              {/* Title + authors */}
              <h3
                style={{
                  ...T.displayM,
                  margin: "0 0 18px",
                  color: C.ink,
                  maxWidth: 720,
                }}
              >
                {current.title}
              </h3>
              <div
                style={{
                  ...T.body,
                  color: C.inkMid,
                  marginBottom: 6,
                }}
              >
                {current.authors}
              </div>
              <div
                style={{
                  ...T.body,
                  color: C.inkMid,
                  marginBottom: 40,
                }}
              >
                <em style={{ color: C.inkSoft }}>{current.journal}</em>,{" "}
                {current.year}. {current.volume}.
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 0,
                  borderTop: `1px solid ${C.line}`,
                  borderBottom: `1px solid ${C.line}`,
                  marginBottom: 36,
                }}
                className="home15-paper-stats"
              >
                <div
                  style={{
                    padding: "22px 20px",
                    borderRight: `1px solid ${C.line}`,
                  }}
                >
                  <div style={{ ...T.monoXs, color: C.inkMuted, marginBottom: 8 }}>
                    cohort
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {current.n ? `n = ${current.n.toLocaleString()}` : "guideline"}
                  </div>
                </div>
                <div
                  style={{
                    padding: "22px 20px",
                    borderRight: `1px solid ${C.line}`,
                  }}
                >
                  <div style={{ ...T.monoXs, color: C.inkMuted, marginBottom: 8 }}>
                    follow-up
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {current.followUp || "current"}
                  </div>
                </div>
                <div style={{ padding: "22px 20px" }}>
                  <div style={{ ...T.monoXs, color: C.inkMuted, marginBottom: 8 }}>
                    predicts
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.4,
                    }}
                  >
                    {current.predicts}
                  </div>
                </div>
              </div>

              {/* How Precura uses it */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...T.monoXs,
                    color: C.warm,
                    marginBottom: 14,
                  }}
                >
                  How Precura applies it
                </div>
                <p
                  style={{
                    ...T.body,
                    color: C.inkSoft,
                    margin: 0,
                    maxWidth: 700,
                  }}
                >
                  {current.howPrecuraUses}
                </p>
              </div>

              {/* Citation strip at bottom */}
              <div
                style={{
                  marginTop: 40,
                  padding: "18px 20px",
                  background: C.paperDeep,
                  borderRadius: 4,
                  ...T.monoSm,
                  color: C.inkMid,
                  lineHeight: 1.55,
                }}
              >
                <div style={{ ...T.monoXs, color: C.inkFaint, marginBottom: 6 }}>
                  citation
                </div>
                {current.citation}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1000px) {
          :global(.home15-research-grid) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          :global(.home15-paper-stats) {
            grid-template-columns: 1fr !important;
          }
          :global(.home15-paper-stats > div) {
            border-right: none !important;
            border-bottom: 1px solid ${C.line};
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 08. TRUST AND SCIENCE - doctor + researchers + compliance
// ---------------------------------------------------------------------------
function TrustScience() {
  return (
    <section
      style={{
        background: C.paperSoft,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>07 / Who stands behind this</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ ...T.displayL, margin: "0 0 80px", maxWidth: 900 }}>
            Serious science needs{" "}
            <span style={{ color: C.warm, fontStyle: "italic" }}>
              a serious team.
            </span>
          </h2>
        </Reveal>

        {/* Doctor + researchers grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 40,
            marginBottom: 40,
          }}
          className="home15-trust-top"
        >
          {/* Doctor card */}
          <Reveal delay={0.1}>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 4,
                padding: 48,
                minHeight: 440,
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 36,
                alignItems: "start",
              }}
              className="home15-doctor-card"
            >
              {/* Monogram */}
              <div
                style={{
                  width: 180,
                  height: 220,
                  borderRadius: 4,
                  background:
                    "linear-gradient(180deg, #2B3A4A 0%, #0E1A2A 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: 92,
                    color: C.paper,
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    fontFamily: FONT,
                  }}
                >
                  MJ
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 12,
                    right: 12,
                    ...T.monoXs,
                    color: "rgba(180, 213, 224, 0.7)",
                    fontSize: 9,
                  }}
                >
                  Leg. lakare / 198412020149
                </div>
              </div>

              <div>
                <div
                  style={{
                    ...T.monoXs,
                    color: C.cyan,
                    marginBottom: 12,
                  }}
                >
                  Medical lead
                </div>
                <h3
                  style={{
                    ...T.displayS,
                    margin: "0 0 8px",
                    color: C.ink,
                  }}
                >
                  Dr. Marcus Johansson
                </h3>
                <div
                  style={{
                    ...T.body,
                    color: C.inkMid,
                    marginBottom: 20,
                  }}
                >
                  Swedish GP, Karolinska Institutet (MD 2010). 15 years in
                  primary care, 4 years as senior physician at Cityakuten
                  Vardcentral. Specialist interest in metabolic health and
                  preventive cardiology. Reviews every Precura panel
                  personally.
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 22,
                  }}
                >
                  {[
                    "Karolinska Institutet",
                    "Svenska Lakaresallskapet",
                    "ESC member 2018",
                    "ADA 2021",
                  ].map((t, i) => (
                    <span
                      key={i}
                      style={{
                        ...T.monoXs,
                        padding: "6px 12px",
                        borderRadius: 100,
                        border: `1px solid ${C.line}`,
                        background: C.paperSoft,
                        color: C.inkMid,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <blockquote
                  style={{
                    margin: 0,
                    padding: "18px 22px",
                    background: C.paperDeep,
                    borderRadius: 4,
                    ...T.body,
                    color: C.inkSoft,
                    fontStyle: "italic",
                    lineHeight: 1.55,
                  }}
                >
                  "My job is to read the trend, not just the value. The
                  difference between a normal fasting glucose and a normal
                  fasting glucose that has risen for five years is the
                  difference between calm and action."
                </blockquote>
              </div>
            </div>
          </Reveal>

          {/* Right column: stats */}
          <Reveal delay={0.2}>
            <div
              style={{
                display: "grid",
                gridTemplateRows: "1fr 1fr",
                gap: 16,
                height: "100%",
              }}
            >
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 210,
                }}
              >
                <div>
                  <div style={{ ...T.monoXs, color: C.cyan, marginBottom: 12 }}>
                    Peer-reviewed base
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(40px, 5vw, 64px)",
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.025em",
                      lineHeight: 1,
                    }}
                  >
                    34 studies
                  </div>
                </div>
                <p
                  style={{
                    ...T.small,
                    color: C.inkMid,
                    margin: 0,
                  }}
                >
                  Every Precura claim, threshold and risk number traces back
                  to a peer-reviewed source. No wellness white papers, no
                  marketing.
                </p>
              </div>

              <div
                style={{
                  background: C.ink,
                  color: C.paper,
                  borderRadius: 4,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 210,
                }}
              >
                <div>
                  <div
                    style={{
                      ...T.monoXs,
                      color: C.cyanSoft,
                      marginBottom: 12,
                    }}
                  >
                    Ethical review
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(40px, 5vw, 64px)",
                      fontWeight: 500,
                      color: C.paper,
                      letterSpacing: "-0.025em",
                      lineHeight: 1,
                    }}
                  >
                    Dnr 2024-00418
                  </div>
                </div>
                <p
                  style={{
                    ...T.small,
                    color: "rgba(245, 242, 234, 0.68)",
                    margin: 0,
                  }}
                >
                  Our research protocol has been reviewed by the Swedish
                  Ethical Review Authority. Your data is never sold.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Compliance row */}
        <Reveal delay={0.1}>
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 4,
              padding: "32px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 32,
            }}
            className="home15-compliance-row"
          >
            {[
              { title: "EU hosted", sub: "Stockholm + Frankfurt" },
              { title: "GDPR", sub: "Patientdatalagen 2008:355" },
              { title: "BankID", sub: "Secure auth" },
              { title: "Karolinska", sub: "Lab partner" },
              { title: "ISO 27001", sub: "Information security" },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ ...T.monoXs, color: C.cyan, marginBottom: 8 }}>
                  <Check size={11} style={{ display: "inline", marginRight: 6 }} />
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: C.ink,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {c.sub}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Full reference ledger */}
        <Reveal delay={0.15}>
          <div
            style={{
              marginTop: 60,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 4,
              padding: "40px 48px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div>
                <div style={{ ...T.monoXs, color: C.inkMuted, marginBottom: 8 }}>
                  07.1 / reference ledger
                </div>
                <h3 style={{ ...T.displayS, margin: 0 }}>
                  References used on this page.
                </h3>
              </div>
              <div style={{ ...T.monoSm, color: C.inkMuted }}>
                last updated: apr 2026
              </div>
            </div>

            <ol
              style={{
                columnCount: 2,
                columnGap: 40,
                margin: 0,
                padding: 0,
                listStyle: "none",
                ...T.monoSm,
                color: C.inkMid,
                lineHeight: 1.65,
              }}
              className="home15-ledger"
            >
              {[
                "Lindstrom J, Tuomilehto J. The Diabetes Risk Score: a practical tool to predict type 2 diabetes risk. Diabetes Care. 2003;26(3):725-731.",
                "SCORE2 working group. SCORE2 risk prediction algorithms. Eur Heart J. 2021;42(25):2439-2454.",
                "Kanis JA et al. FRAX and the assessment of fracture probability. Osteoporos Int. 2008;19(4):385-397.",
                "Carlsson AC et al. Twenty years of the Stockholm Diabetes Prevention Programme. BMC Med. 2024;22:108.",
                "UK Prospective Diabetes Study (UKPDS) Group. Intensive blood-glucose control and risk of complications in T2D. Lancet. 1998;352(9131):837-853.",
                "Knowler WC et al. Reduction in the incidence of T2D with lifestyle intervention or metformin. N Engl J Med. 2002;346(6):393-403.",
                "SCORE2-Diabetes working group. SCORE2-Diabetes: 10-year CV risk estimation. Eur Heart J. 2023;44(28):2544-2556.",
                "American Diabetes Association. Standards of Care in Diabetes 2024. Diabetes Care. 2024;47(Suppl 1).",
                "Visseren FLJ et al. 2021 ESC Guidelines on cardiovascular disease prevention. Eur Heart J. 2021;42(34):3227-3337.",
                "Tuomilehto J et al. Prevention of type 2 diabetes mellitus by lifestyle change. N Engl J Med. 2001;344(18):1343-1350.",
              ].map((ref, i) => (
                <li
                  key={i}
                  style={{
                    breakInside: "avoid",
                    marginBottom: 14,
                    paddingLeft: 28,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      color: C.cyan,
                      fontWeight: 500,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {ref}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          :global(.home15-trust-top) {
            grid-template-columns: 1fr !important;
          }
          :global(.home15-compliance-row) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
          :global(.home15-ledger) {
            column-count: 1 !important;
          }
          :global(.home15-doctor-card) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 09. MEMBER STORIES - "Stories from the first 2,000 members"
// ---------------------------------------------------------------------------
const MEMBERS = [
  {
    name: "Lotta Svensson",
    role: "Account Director, Stockholm",
    age: 44,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1600&q=85&auto=format&fit=crop",
    quote:
      "I have been getting annual bloodwork for 10 years. Precura was the first time anyone showed me the trend across those ten years. The rising glucose was obvious once I saw it on one chart.",
    highlight: "10 years of data, one chart",
  },
  {
    name: "Erik Lindqvist",
    role: "Teacher, Malmo",
    age: 38,
    image:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1600&q=85&auto=format&fit=crop",
    quote:
      "My mother was diagnosed with T2D. I went to my regular GP and she said my numbers were fine. Precura's FINDRISC score put me in the moderate band. I made changes. Six months later my glucose dropped.",
    highlight: "Caught a moderate risk early",
  },
  {
    name: "Anja Bjornsson",
    role: "Product Designer, Gothenburg",
    age: 35,
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1600&q=85&auto=format&fit=crop",
    quote:
      "What I like is the honesty. No miracle promises. The doctor's note on my results actually said 'your cholesterol is borderline, let's retest in six months and see'. That is what I would expect from a real clinician.",
    highlight: "Real doctor notes",
  },
  {
    name: "Pontus Nilsson",
    role: "Research engineer, Uppsala",
    age: 41,
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=1600&q=85&auto=format&fit=crop",
    quote:
      "I am a researcher. I wanted to see the papers behind the numbers. Precura links to the actual studies. FINDRISC, SCORE2, FRAX, the Stockholm cohort. That is what made me trust it.",
    highlight: "Links to the primary sources",
  },
];

function MemberStories() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % MEMBERS.length);
    }, 6500);
    return () => clearInterval(id);
  }, [paused]);

  const current = MEMBERS[active];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background: C.ink,
        color: C.paper,
        padding: "160px 40px",
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 40,
            flexWrap: "wrap",
            marginBottom: 60,
          }}
        >
          <Reveal>
            <div>
              <Eyebrow color={C.cyanSoft}>08 / Members</Eyebrow>
              <h2
                style={{
                  ...T.displayL,
                  margin: 0,
                  color: C.paper,
                  maxWidth: 900,
                }}
              >
                Stories from the first{" "}
                <span style={{ color: C.warm, fontStyle: "italic" }}>
                  2,000 members.
                </span>
              </h2>
            </div>
          </Reveal>
          <div
            style={{
              ...T.monoSm,
              color: "rgba(180, 213, 224, 0.6)",
            }}
          >
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(MEMBERS.length).padStart(2, "0")}
          </div>
        </div>

        {/* Carousel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "stretch",
            minHeight: 560,
          }}
          className="home15-members-grid"
        >
          {/* Left: image */}
          <div
            style={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              background: C.inkSoft,
              minHeight: 540,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${current.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(15%) contrast(105%)",
                }}
              />
            </AnimatePresence>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 45%, rgba(12, 20, 32, 0.92) 100%)",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                style={{
                  position: "absolute",
                  bottom: 36,
                  left: 36,
                  right: 36,
                }}
              >
                <div
                  style={{
                    ...T.monoXs,
                    color: C.warm,
                    marginBottom: 10,
                  }}
                >
                  Precura member / age {current.age}
                </div>
                <div
                  style={{
                    ...T.displayS,
                    color: C.paper,
                    marginBottom: 6,
                  }}
                >
                  {current.name}
                </div>
                <div
                  style={{
                    ...T.small,
                    color: "rgba(245, 242, 234, 0.72)",
                  }}
                >
                  {current.role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: quote */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "20px 0",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <QuoteIcon
                  size={40}
                  color={C.warm}
                  style={{ marginBottom: 24 }}
                />
                <p
                  style={{
                    ...T.displayS,
                    color: C.paper,
                    margin: "0 0 28px",
                    fontWeight: 400,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.32,
                  }}
                >
                  "{current.quote}"
                </p>
                <div
                  style={{
                    ...T.monoXs,
                    color: C.warm,
                    padding: "8px 14px",
                    background: "rgba(199, 122, 69, 0.14)",
                    borderRadius: 100,
                    display: "inline-block",
                  }}
                >
                  {current.highlight}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div
              style={{
                marginTop: 48,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                {MEMBERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to member ${i + 1}`}
                    style={{
                      width: i === active ? 40 : 12,
                      height: 4,
                      borderRadius: 100,
                      background: i === active ? C.warm : "rgba(180, 213, 224, 0.22)",
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
                  ...T.monoXs,
                  color: "rgba(180, 213, 224, 0.55)",
                }}
              >
                {paused ? "paused" : "auto-advancing"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home15-members-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 10. PRICING
// ---------------------------------------------------------------------------
function Pricing() {
  const tiers = [
    {
      name: "Single panel",
      price: "995",
      period: "one time",
      tag: "Try the math",
      desc: "One blood panel with 14 markers. Full risk read by FINDRISC, SCORE2 and FRAX. Written doctor note. No subscription.",
      features: [
        "14 biomarkers from one draw",
        "FINDRISC + SCORE2 + FRAX",
        "Written doctor note",
        "90-day dashboard access",
      ],
      cta: "Book a single panel",
      featured: false,
    },
    {
      name: "Annual",
      price: "2,995",
      period: "per year",
      tag: "Most members",
      desc: "Two blood panels per year. Full 40+ marker profile. Active coaching plan updated every 6 months. Unlimited doctor chat.",
      features: [
        "2 x full panels (40+ markers)",
        "All 8 risk models",
        "Dr. Johansson chat, 12 months",
        "Precura coach + training plan",
        "Living profile, updated quarterly",
      ],
      cta: "Join annual",
      featured: true,
    },
    {
      name: "Family",
      price: "4,995",
      period: "per year",
      tag: "2 adults",
      desc: "Full annual membership for two adults, with shared family history weighting so both risk profiles account for each other.",
      features: [
        "Everything in Annual, for two",
        "Shared family history model",
        "Joint doctor consultations",
        "Priority scheduling at clinics",
      ],
      cta: "Join family",
      featured: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        background: C.paper,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>09 / Pricing</Eyebrow>
        </Reveal>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 40,
            marginBottom: 80,
          }}
        >
          <Reveal delay={0.1}>
            <h2 style={{ ...T.displayL, margin: 0, maxWidth: 760 }}>
              Transparent pricing.
              <br />
              <span style={{ color: C.warm, fontStyle: "italic" }}>
                Same science at every tier.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                ...T.body,
                color: C.inkMid,
                maxWidth: 380,
                margin: 0,
              }}
            >
              No teaser pricing. No hidden follow-up fees. The risk models
              are identical across tiers, only cadence and coaching change.
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr 1fr",
            gap: 20,
            alignItems: "stretch",
          }}
          className="home15-pricing-grid"
        >
          {tiers.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                style={{
                  background: t.featured ? C.ink : C.card,
                  color: t.featured ? C.paper : C.ink,
                  border: t.featured
                    ? `1px solid ${C.ink}`
                    : `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: "44px 36px",
                  minHeight: 620,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: t.featured
                    ? "0 20px 60px rgba(12, 20, 32, 0.18)"
                    : "none",
                  transform: t.featured ? "translateY(-12px)" : "none",
                }}
              >
                {t.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "7px 16px",
                      borderRadius: 100,
                      background: C.warm,
                      color: C.paper,
                      ...T.monoXs,
                    }}
                  >
                    Most popular
                  </div>
                )}
                <div
                  style={{
                    ...T.monoXs,
                    color: t.featured ? C.cyanSoft : C.cyan,
                    marginBottom: 12,
                  }}
                >
                  {t.tag}
                </div>
                <h3
                  style={{
                    ...T.displayS,
                    margin: "0 0 20px",
                    color: t.featured ? C.paper : C.ink,
                  }}
                >
                  {t.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(44px, 5vw, 64px)",
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      color: t.featured ? C.paper : C.ink,
                    }}
                  >
                    {t.price}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      color: t.featured ? "rgba(245, 242, 234, 0.6)" : C.inkMuted,
                    }}
                  >
                    SEK
                  </span>
                </div>
                <div
                  style={{
                    ...T.monoSm,
                    color: t.featured ? "rgba(245, 242, 234, 0.55)" : C.inkFaint,
                    marginBottom: 22,
                  }}
                >
                  {t.period}
                </div>
                <p
                  style={{
                    ...T.body,
                    color: t.featured ? "rgba(245, 242, 234, 0.78)" : C.inkMid,
                    margin: "0 0 28px",
                  }}
                >
                  {t.desc}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 36px",
                    flex: 1,
                  }}
                >
                  {t.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        paddingBottom: 14,
                        marginBottom: 14,
                        borderBottom: `1px solid ${
                          t.featured ? "rgba(245, 242, 234, 0.1)" : C.line
                        }`,
                        ...T.small,
                        color: t.featured ? "rgba(245, 242, 234, 0.85)" : C.inkMid,
                      }}
                    >
                      <Check
                        size={14}
                        color={t.featured ? C.warm : C.cyan}
                        style={{ marginTop: 3, flexShrink: 0 }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    padding: "16px 24px",
                    borderRadius: 100,
                    background: t.featured ? C.warm : C.ink,
                    color: t.featured ? C.paper : C.paper,
                    border: "none",
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {t.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1000px) {
          :global(.home15-pricing-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home15-pricing-grid > div > div) {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 11. FAQ
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    q: "Is Precura a medical device?",
    a: "Precura is a clinical decision support service, delivered by licensed Swedish physicians. The risk calculations we surface (FINDRISC, SCORE2, FRAX) are validated clinical tools used in Swedish primary care. We are not a diagnostic device, we are a second set of eyes on the numbers your GP already looks at.",
  },
  {
    q: "How is this different from Werlabs or a standard blood test?",
    a: "Werlabs gives you the numbers. We give you the slope across years, the clinical risk models computed on your numbers, and a personal Swedish doctor who writes you a real note about what it all means. Werlabs is a lab, Precura is a predictive health service.",
  },
  {
    q: "Which scientific references do you use?",
    a: "The core engine runs FINDRISC (Lindstrom & Tuomilehto 2003), SCORE2 (Eur Heart J 2021), FRAX (Kanis et al 2008), SCORE2-Diabetes (Eur Heart J 2023), and is calibrated to the Stockholm Diabetes Prevention Programme cohort (Carlsson et al 2024). Every threshold and recommendation is traceable to a peer-reviewed paper.",
  },
  {
    q: "Who is Dr. Marcus Johansson?",
    a: "Dr. Johansson is our medical lead. He is a Swedish licensed physician (leg. lakare), trained at Karolinska Institutet (MD 2010), with 15 years in primary care including 4 years as senior physician at Cityakuten Vardcentral, Stockholm. He reviews every Precura risk report personally.",
  },
  {
    q: "How is my data stored?",
    a: "Your medical data is stored in EU-hosted infrastructure (Stockholm and Frankfurt), encrypted at rest and in transit, under Patientdatalagen 2008:355 and GDPR. Authentication is via BankID. Our information security posture is ISO 27001. We never sell, share or rent your health data.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. Annual and Family memberships can be cancelled at any point and you keep full access until the end of your billed period. Your data export is always available as a FHIR-compatible download.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      style={{
        background: C.paperSoft,
        padding: "160px 40px",
        fontFamily: FONT,
        color: C.ink,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>10 / Questions</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ ...T.displayL, margin: "0 0 60px", maxWidth: 820 }}>
            The questions people ask
            <br />
            <span style={{ color: C.warm, fontStyle: "italic" }}>
              before they join.
            </span>
          </h2>
        </Reveal>

        <div style={{ borderTop: `1px solid ${C.line}` }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: `1px solid ${C.line}` }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    padding: "28px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 24,
                    cursor: "pointer",
                    fontFamily: FONT,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <span
                      style={{
                        ...T.monoXs,
                        color: C.cyan,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        ...T.displayS,
                        fontWeight: 500,
                        color: C.ink,
                      }}
                    >
                      {item.q}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown size={22} color={C.inkMid} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          ...T.body,
                          color: C.inkMid,
                          margin: 0,
                          padding: "0 0 32px 50px",
                          maxWidth: 820,
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 12. FINAL CTA
// ---------------------------------------------------------------------------
function FinalCTA() {
  return (
    <section
      style={{
        background: C.navyDeep,
        color: C.paper,
        padding: "180px 40px",
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(180, 213, 224, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180, 213, 224, 0.055) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              ...T.monoXs,
              color: C.cyanSoft,
              marginBottom: 32,
            }}
          >
            11 / Ready when you are
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              ...T.displayXL,
              margin: 0,
              color: C.paper,
              maxWidth: 1000,
              marginInline: "auto",
            }}
          >
            Read the paper.
            <br />
            Then read{" "}
            <span style={{ color: C.warm, fontStyle: "italic" }}>
              your own data.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.25}>
          <p
            style={{
              ...T.lead,
              color: "rgba(245, 242, 234, 0.76)",
              maxWidth: 620,
              margin: "36px auto 48px",
            }}
          >
            Precura is now open to the first 2,000 adults in Sweden.
            One blood draw starts a five-year trajectory you can
            actually see.
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <button
              style={{
                padding: "20px 32px",
                borderRadius: 100,
                background: C.paper,
                color: C.ink,
                border: "none",
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                letterSpacing: "-0.005em",
              }}
            >
              Start my blood panel / 995 SEK
            </button>
            <button
              style={{
                padding: "20px 28px",
                borderRadius: 100,
                background: "transparent",
                color: C.paper,
                border: "1px solid rgba(245, 242, 234, 0.3)",
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                letterSpacing: "-0.005em",
              }}
            >
              Read the science first
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <div
            style={{
              marginTop: 80,
              ...T.monoXs,
              color: "rgba(180, 213, 224, 0.56)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 28,
            }}
          >
            <span>34 peer-reviewed studies</span>
            <span>GDPR / EU hosted</span>
            <span>Karolinska trained physician</span>
            <span>FINDRISC + SCORE2 + FRAX</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 13. FOOTER
// ---------------------------------------------------------------------------
function Footer() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, "0");
      const m = d.getMinutes().toString().padStart(2, "0");
      const s = d.getSeconds().toString().padStart(2, "0");
      setNow(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      style={{
        background: C.paper,
        color: C.ink,
        padding: "80px 40px 40px",
        fontFamily: FONT,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            paddingBottom: 60,
            borderBottom: `1px solid ${C.line}`,
          }}
          className="home15-footer-grid"
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: C.ink,
                fontWeight: 600,
                fontSize: 17,
                marginBottom: 16,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="18"
                  height="18"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M5 14 L9 10 L13 12 L17 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="17" cy="7" r="1.4" fill="currentColor" />
              </svg>
              Precura
            </div>
            <p
              style={{
                ...T.small,
                color: C.inkMid,
                maxWidth: 360,
                margin: 0,
              }}
            >
              Predictive health, built on peer-reviewed clinical science.
              Delivered by licensed Swedish physicians. Based in Stockholm.
            </p>
          </div>

          {[
            {
              h: "Product",
              links: ["Blood panels", "Risk models", "Coaching", "Pricing"],
            },
            {
              h: "Science",
              links: ["Research library", "Doctor team", "Methodology", "Publications"],
            },
            {
              h: "Company",
              links: ["About", "Careers", "Privacy", "Terms"],
            },
          ].map((col) => (
            <div key={col.h}>
              <div
                style={{
                  ...T.monoXs,
                  color: C.cyan,
                  marginBottom: 18,
                }}
              >
                {col.h}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li
                    key={l}
                    style={{
                      marginBottom: 12,
                      fontSize: 14,
                      color: C.inkMid,
                      cursor: "pointer",
                    }}
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark + clock row */}
        <div
          style={{
            paddingTop: 60,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: "clamp(60px, 14vw, 220px)",
              fontWeight: 500,
              letterSpacing: "-0.045em",
              lineHeight: 0.82,
              color: C.ink,
              fontFamily: FONT,
            }}
          >
            Precura.
          </div>
          <div
            style={{
              ...T.monoSm,
              color: C.inkMuted,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              textAlign: "right",
            }}
          >
            <div>Stockholm / 59.3293 N, 18.0686 E</div>
            <div>Local time / {now} CET</div>
            <div style={{ color: C.cyan }}>v15.1 / Apr 2026</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${C.line}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            ...T.monoSm,
            color: C.inkFaint,
          }}
        >
          <span>
            {"Precura AB / Org.nr 559xxx-xxxx / 2026 / All rights reserved"}
          </span>
          <span>34 peer-reviewed studies cited on this page.</span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home15-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------
export default function Home15Page() {
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
      <TopNav />
      <HeroSection />
      <ProblemSection />
      <AnnaStory />
      <HowItWorks />
      <LivingProfile />
      <WhatYouGet />
      <ResearchCarousel />
      <TrustScience />
      <MemberStories />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
