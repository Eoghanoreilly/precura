"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * LIVING PROFILE - "Not a report. A living profile."
 *
 * Borrows the framing from home-10 but is a standalone explanation here.
 * Left: giant editorial headline. Right: a sketched "profile page"
 * mockup that ticks small updates on scroll. Shows WHAT a living profile
 * IS and why it's different from a static PDF.
 */
export function LivingProfile() {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      id="profile"
      style={{
        background: C.paper,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Chapter head */}
        <div ref={headRef} style={{ marginBottom: 96 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 24,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 26,
                height: 1,
                background: C.inkMuted,
                display: "inline-block",
              }}
            />
            Ch. 04 / The living profile
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
            style={{
              ...TYPE.display,
              margin: 0,
              color: C.ink,
              maxWidth: 1200,
            }}
          >
            Not a report.{" "}
            <span style={{ color: C.sage, fontStyle: "italic" }}>
              A living profile.
            </span>
          </motion.h2>
        </div>

        <div
          className="home11-profile-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            gap: 96,
            alignItems: "flex-start",
          }}
        >
          {/* Left: narrative + bullet list */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: 0,
                marginBottom: 32,
                maxWidth: 560,
              }}
            >
              A Werlabs PDF is a moment. A Precura profile is a record. It
              updates with every new blood draw, every doctor message, every
              coach check-in, every AI conversation. You are not handed a
              report. You watch a slope.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              style={{
                ...TYPE.body,
                color: C.inkMuted,
                margin: 0,
                marginBottom: 56,
                maxWidth: 560,
              }}
            >
              Think of it as a twin of your body, built from the numbers your
              body already generates. Every new signal sharpens the picture.
              Nothing is one-shot. Everything is cumulative.
            </motion.p>

            <div
              style={{
                borderTop: `1px solid ${C.inkHairlineStrong}`,
                paddingTop: 32,
              }}
            >
              {bullets.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.08 * i,
                    ease: EASE,
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    padding: "22px 0",
                    borderBottom:
                      i === bullets.length - 1
                        ? "none"
                        : `1px solid ${C.inkHairline}`,
                  }}
                >
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.sage,
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 500,
                        color: C.ink,
                        letterSpacing: "-0.01em",
                        marginBottom: 6,
                      }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: C.inkMuted,
                        lineHeight: 1.55,
                      }}
                    >
                      {b.body}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Profile mockup */}
          <ProfileMockup />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-profile-grid) {
            grid-template-columns: 1fr !important;
            gap: 64px !important;
          }
        }
      `}</style>
    </section>
  );
}

const bullets = [
  {
    title: "It updates the day your numbers do.",
    body:
      "A new fasting glucose reading propagates to your risk models, your trend charts, your coach plan, and your AI chat context. No uploads. No PDFs.",
  },
  {
    title: "Trajectories, not snapshots.",
    body:
      "Every biomarker carries its own five-year line. The question is never the single value - it is which direction it has been moving and how fast.",
  },
  {
    title: "The humans are in the loop.",
    body:
      "When a signal crosses a corridor your doctor flagged, Dr. Johansson hears about it first. Your coach sees it the same day and adjusts the week.",
  },
  {
    title: "You own the record.",
    body:
      "Full FHIR export any time. EU-hosted, GDPR, BankID login. A Precura profile complements the Swedish 1177 record, it does not replace it.",
  },
];

// --------------------------------------------------------------------------
// The profile mockup - an illustrated "card" with rows of data that tick
// new signals in on a slow loop. Editorial rather than glossy.
// --------------------------------------------------------------------------
function ProfileMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        background: C.page,
        border: `1px solid ${C.inkHairlineStrong}`,
        borderRadius: 6,
        padding: 34,
        fontFamily: SYSTEM_FONT,
        position: "relative",
      }}
    >
      {/* Header - profile id */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: 22,
          borderBottom: `1px solid ${C.inkHairlineStrong}`,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 10 }}>
            Precura profile / AB-2026
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: C.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Anna Bergstrom
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.inkMuted,
              marginTop: 4,
            }}
          >
            40 / Stockholm / member since January
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            ...TYPE.mono,
            color: C.sage,
            background: C.sageWash,
            padding: "6px 12px",
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.sage,
              display: "inline-block",
            }}
          />
          Live
        </div>
      </div>

      {/* Three trajectory rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          marginBottom: 30,
        }}
      >
        <TrajectoryRow
          name="Fasting glucose"
          current="5.8"
          unit="mmol/L"
          values={[0.1, 0.16, 0.25, 0.46, 0.6, 0.82]}
          trend="worsening"
        />
        <TrajectoryRow
          name="LDL-C (bad cholesterol)"
          current="2.9"
          unit="mmol/L"
          values={[0.55, 0.58, 0.52, 0.48, 0.46, 0.44]}
          trend="improving"
        />
        <TrajectoryRow
          name="Vitamin D (25-OH-D)"
          current="48"
          unit="nmol/L"
          values={[0.25, 0.32, 0.4, 0.45, 0.52, 0.52]}
          trend="improving"
        />
      </div>

      {/* Activity feed - live updates */}
      <div
        style={{
          borderTop: `1px solid ${C.inkHairlineStrong}`,
          paddingTop: 22,
        }}
      >
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 16,
          }}
        >
          Recent updates
        </div>
        {feed.map((f, i) => (
          <ActivityRow key={i} item={f} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

const feed = [
  {
    when: "Today",
    who: "Dr. M. Johansson",
    msg: "Reviewed your Mar panel. Glucose trend still worth watching.",
  },
  {
    when: "Yesterday",
    who: "Lina (coach)",
    msg: "Added two intervals to Tue session. Your Zone 2 is up 8 %.",
  },
  {
    when: "2 days ago",
    who: "Risk engine",
    msg: "FINDRISC updated: 12 / 26. Moved from 16 % to 17 % 10-year risk.",
  },
  {
    when: "4 days ago",
    who: "AI chat",
    msg: "You asked about LDL particle size. Saved to your profile.",
  },
];

function TrajectoryRow({
  name,
  current,
  unit,
  values,
  trend,
}: {
  name: string;
  current: string;
  unit: string;
  values: number[];
  trend: "improving" | "worsening";
}) {
  // Build a mini sparkline 0..1 for each value
  const W = 160;
  const H = 36;
  const path = values
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"} ${(W / (values.length - 1)) * i} ${
          H - v * (H - 6) - 3
        }`
    )
    .join(" ");
  const accent = trend === "improving" ? C.signalGood : C.signalCaution;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: 22,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 14,
            color: C.ink,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginTop: 3,
          }}
        >
          {trend === "improving" ? "Trending improving" : "Trending caution"}
        </div>
      </div>
      <svg
        width={W}
        height={H}
        style={{ display: "block" }}
        viewBox={`0 0 ${W} ${H}`}
      >
        <motion.path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.8, ease: EASE }}
        />
        <motion.circle
          cx={W}
          cy={H - values[values.length - 1] * (H - 6) - 3}
          r={2.5}
          fill={accent}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 1.5, ease: EASE }}
        />
      </svg>
      <div
        style={{
          minWidth: 88,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: C.ink,
            letterSpacing: "-0.02em",
          }}
        >
          {current}
        </div>
        <div style={{ ...TYPE.mono, color: C.inkFaint }}>{unit}</div>
      </div>
    </div>
  );
}

function ActivityRow({
  item,
  index,
}: {
  item: (typeof feed)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.7,
        delay: 0.8 + index * 0.1,
        ease: EASE,
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr",
        padding: "10px 0",
        borderBottom: `1px solid ${C.inkHairline}`,
        alignItems: "baseline",
      }}
    >
      <div style={{ ...TYPE.mono, color: C.inkMuted }}>{item.when}</div>
      <div>
        <div
          style={{
            fontSize: 13,
            color: C.ink,
            fontWeight: 500,
          }}
        >
          {item.who}
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.inkMuted,
            lineHeight: 1.5,
            marginTop: 2,
          }}
        >
          {item.msg}
        </div>
      </div>
    </motion.div>
  );
}
