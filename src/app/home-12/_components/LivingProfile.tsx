"use client";

/**
 * LIVING PROFILE - borrows the "Not a report. A living profile." framing
 * from home-10 but renders it in home-12's disciplined grid with a wide
 * dark band and a single live panel. The intent is to make the visitor
 * feel the contrast: static PDF versus a thing that updates.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

export function LivingProfile() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      id="profile"
      style={{
        background: C.graphite,
        color: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid hairlines behind content */}
      <BgGrid />

      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: GRID.columnGap,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left side - the headline */}
        <div
          style={{
            gridColumn: "span 6",
          }}
          className="home12-lp-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.0, delay: 0.1, ease: EASE.out }}
          >
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.accent,
                marginBottom: 24,
              }}
            >
              04 / The product
            </div>
            <h2
              style={{
                ...TYPE.display,
                margin: 0,
                color: C.paper,
                maxWidth: 600,
              }}
            >
              Not a report.{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                A living profile.
              </span>
            </h2>
            <p
              style={{
                ...TYPE.lead,
                color: "rgba(250, 250, 247, 0.68)",
                marginTop: 36,
                marginBottom: 0,
                maxWidth: 520,
              }}
            >
              Most services give you a PDF. Your labs at one point in time,
              stapled to a few paragraphs of advice. You read it once and
              lose it in a folder called Downloads.
            </p>
            <p
              style={{
                ...TYPE.lead,
                color: "rgba(250, 250, 247, 0.68)",
                marginTop: 20,
                marginBottom: 0,
                maxWidth: 520,
              }}
            >
              Your Precura profile is the opposite. It learns. Every blood
              draw, every doctor note, every coach check-in, every new
              research paper, gets folded back into the same continuous
              record. A health twin that grows up with you.
            </p>

            <div
              style={{
                marginTop: 48,
                paddingTop: 28,
                borderTop: `1px solid ${C.lineDark}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 28,
                maxWidth: 520,
              }}
            >
              <LPStat label="Updates / year" value="48+" />
              <LPStat label="Timeline depth" value="5 years" />
              <LPStat label="Markers tracked" value="40+" />
              <LPStat label="Care team" value="Doctor + coach" />
            </div>
          </motion.div>
        </div>

        {/* Right side - the living panel visual */}
        <div
          style={{
            gridColumn: "7 / span 6",
          }}
          className="home12-lp-right"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE.out }}
            style={{
              background: C.graphiteSoft,
              border: `1px solid ${C.lineDark}`,
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 40px 80px rgba(0, 0, 0, 0.35)",
            }}
          >
            {/* Chrome */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 16,
                borderBottom: `1px solid ${C.lineDark}`,
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPE.eyebrow,
                    color: "rgba(250, 250, 247, 0.55)",
                    marginBottom: 4,
                  }}
                >
                  Precura / Living profile
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 500,
                    color: C.paper,
                  }}
                >
                  Anna Bergstrom
                </div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 10px",
                  background: "rgba(94, 138, 104, 0.18)",
                  border: "1px solid rgba(94, 138, 104, 0.35)",
                  borderRadius: 100,
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.signalGood,
                  }}
                />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: "#9BC2A3",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Live
                </span>
              </div>
            </div>

            {/* Event feed */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {feedEvents.map((e, i) => (
                <FeedRow key={i} event={e} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-lp-left) {
            grid-column: span 12 !important;
          }
          :global(.home12-lp-right) {
            grid-column: span 12 !important;
            margin-top: 48px;
          }
        }
      `}</style>
    </section>
  );
}

function LPStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          ...TYPE.eyebrow,
          color: "rgba(250, 250, 247, 0.42)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 500,
          color: C.paper,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

type FeedEvent = {
  time: string;
  kind: string;
  title: string;
  sub: string;
  accent?: boolean;
};

const feedEvents: FeedEvent[] = [
  {
    time: "09:42",
    kind: "Blood draw",
    title: "Quarterly panel / 42 markers",
    sub: "Results expected in 48h / Cityakuten Stockholm",
    accent: true,
  },
  {
    time: "Yesterday",
    kind: "Doctor note",
    title: "Dr. Marcus reviewed your lipids",
    sub: "LDL-C trending down, ApoB stable. Keep doing what you are doing.",
  },
  {
    time: "2 days ago",
    kind: "Coach",
    title: "Ellen adjusted your zone 2 block",
    sub: "Added 20 min / session, based on HR trend",
  },
  {
    time: "5 days ago",
    kind: "Research",
    title: "SDPP 2024 paper added to your profile",
    sub: "Lowered your FINDRISC weighting on waist circumference",
  },
  {
    time: "1 week ago",
    kind: "Check-in",
    title: "3 minute AI check-in",
    sub: "Logged energy 7/10, sleep 6.5h, training 4/5",
  },
  {
    time: "2 weeks ago",
    kind: "Profile update",
    title: "Father's family history revised",
    sub: "New risk factor noted: MI at 65. SCORE2 adjusted.",
  },
];

function FeedRow({ event, index }: { event: FeedEvent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay: 0.3 + index * 0.08,
        ease: EASE.out,
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 120px 1fr",
        alignItems: "center",
        gap: 16,
        padding: "16px 4px",
        borderBottom:
          index === feedEvents.length - 1 ? "none" : `1px solid ${C.lineDarkSoft}`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: "rgba(250, 250, 247, 0.42)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {event.time}
      </div>
      <div
        style={{
          ...TYPE.eyebrow,
          color: event.accent ? C.accent : "rgba(250, 250, 247, 0.62)",
        }}
      >
        {event.kind}
      </div>
      <div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 500,
            color: C.paper,
            letterSpacing: "-0.005em",
            marginBottom: 2,
          }}
        >
          {event.title}
        </div>
        <div
          style={{
            ...TYPE.caption,
            color: "rgba(250, 250, 247, 0.5)",
          }}
        >
          {event.sub}
        </div>
      </div>
    </motion.div>
  );
}

function BgGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        backgroundImage: `linear-gradient(${C.lineDarkSoft} 1px, transparent 1px),
          linear-gradient(90deg, ${C.lineDarkSoft} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 90%)",
      }}
    />
  );
}
