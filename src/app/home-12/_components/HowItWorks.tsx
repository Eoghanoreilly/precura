"use client";

/**
 * HOW IT WORKS - vertical three-step flow with scroll-triggered reveals.
 * Adapts home-8's content verbatim but renders as an organized vertical
 * sequence. Each step uses the 12-column grid: eyebrow on the left,
 * title + body in the middle, and a clean visual on the right.
 *
 * A continuous hairline runs down the left column to tie the three
 * steps together as one journey.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

export function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        background: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
            marginBottom: 96,
          }}
        >
          <div style={{ gridColumn: "span 7" }} className="home12-how-head">
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 20,
              }}
            >
              03 / How it works
            </div>
            <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink }}>
              Three steps.{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                Then we stay with you.
              </span>
            </h2>
          </div>
          <p
            style={{
              ...TYPE.body,
              color: C.inkSoft,
              gridColumn: "9 / span 4",
              margin: 0,
              alignSelf: "end",
            }}
            className="home12-how-sub"
          >
            Blood drawn in your city, analysed against peer-reviewed risk
            models, reviewed by a real Swedish doctor, and then watched
            continuously by a coach who actually knows your metabolism.
          </p>
        </div>

        {/* The three steps */}
        <div
          style={{
            position: "relative",
          }}
        >
          <Step
            num="01"
            label="Blood test"
            title="Book a blood panel in your city."
            body="Choose a Precura clinic in Stockholm, Goteborg, Malmo, Uppsala or Lund. 40+ biomarkers from one draw, including HbA1c, fasting glucose, full lipid panel (LDL-C, ApoB, HDL, triglycerides), hs-CRP (inflammation), fP-insulin, Omega-3 index, liver, kidney, thyroid, ferritin and vitamin D. 10 minutes, no fasting gymnastics, results in 48 hours."
            index={0}
            visual={<BloodVisual />}
          />
          <Step
            num="02"
            label="Analysis"
            title="Clinical models, not a colour coded PDF."
            body="FINDRISC for type 2 diabetes. SCORE2 for cardiovascular risk. FRAX for bone health. The same validated algorithms your GP would run, only against the full five-year trajectory of every marker, not a single snapshot. Your personal doctor Dr. Marcus Johansson reviews every result."
            index={1}
            visual={<ModelVisual />}
          />
          <Step
            num="03"
            label="Living profile"
            title="A doctor, a coach, and a profile that keeps learning."
            body="You get Dr. Marcus's written note on your panel, an assigned personal coach who builds a real training plan around your metabolic profile, secure in-app messaging with both, and a profile that updates with every new data point. Quarterly retests, annual reset, and a quiet alert if anything drifts out of a safe corridor."
            index={2}
            visual={<ProfileVisual />}
            isLast
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-how-head) {
            grid-column: span 12 !important;
          }
          :global(.home12-how-sub) {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

// -------------------------------------------------------------------------
// STEP - one vertical panel on the 12-col grid.
// -------------------------------------------------------------------------

function Step({
  num,
  label,
  title,
  body,
  index,
  visual,
  isLast,
}: {
  num: string;
  label: string;
  title: string;
  body: string;
  index: number;
  visual: React.ReactNode;
  isLast?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: GRID.columnGap,
        paddingTop: 64,
        paddingBottom: isLast ? 0 : 64,
      }}
      className="home12-step"
    >
      {/* Vertical hairline in the left column */}
      {!isLast && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "calc((100% - 11 * 32px) / 12 / 2 + 4px)",
            top: 112,
            bottom: 0,
            width: 1,
            background: C.line,
            pointerEvents: "none",
          }}
          className="home12-step-hairline"
        />
      )}

      {/* Left: number + label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.9, delay: 0.05, ease: EASE.out }}
        style={{
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 18,
        }}
        className="home12-step-left"
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: C.paperElev,
            border: `1px solid ${C.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: C.shadowXs,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: C.accent,
              letterSpacing: "0.04em",
              fontWeight: 600,
            }}
          >
            {num}
          </span>
        </div>
        <div
          style={{
            ...TYPE.eyebrow,
            color: C.inkMid,
            writingMode: "horizontal-tb",
          }}
        >
          {label}
        </div>
      </motion.div>

      {/* Middle: title + body */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 1.0, delay: 0.15, ease: EASE.out }}
        style={{
          gridColumn: "span 5",
        }}
        className="home12-step-mid"
      >
        <h3
          style={{
            ...TYPE.displaySmall,
            margin: 0,
            marginBottom: 24,
            color: C.ink,
            maxWidth: 520,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            ...TYPE.body,
            color: C.inkSoft,
            margin: 0,
            maxWidth: 520,
          }}
        >
          {body}
        </p>
      </motion.div>

      {/* Right: visual */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.1, delay: 0.25, ease: EASE.out }}
        style={{
          gridColumn: "span 5",
        }}
        className="home12-step-right"
      >
        {visual}
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------------------
// STEP VISUALS
// -------------------------------------------------------------------------

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: C.paperElev,
        border: `1px solid ${C.line}`,
        borderRadius: 20,
        padding: 28,
        boxShadow: C.shadowSm,
        height: "100%",
        minHeight: 360,
      }}
    >
      {children}
    </div>
  );
}

// Step 1 visual - biomarker panel grid
function BloodVisual() {
  const markers = [
    { n: "HbA1c", v: "38", u: "mmol/mol", s: "good" },
    { n: "Glucose", v: "5.8", u: "mmol/L", s: "watch" },
    { n: "LDL-C", v: "2.9", u: "mmol/L", s: "good" },
    { n: "ApoB", v: "0.85", u: "g/L", s: "good" },
    { n: "HDL", v: "1.6", u: "mmol/L", s: "good" },
    { n: "TG", v: "1.3", u: "mmol/L", s: "good" },
    { n: "hs-CRP", v: "1.4", u: "mg/L", s: "good" },
    { n: "Vit D", v: "48", u: "nmol/L", s: "watch" },
    { n: "TSH", v: "2.1", u: "mIU/L", s: "good" },
    { n: "Ferritin", v: "65", u: "ug/L", s: "good" },
  ];
  return (
    <VisualFrame>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: `1px solid ${C.line}`,
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.inkMuted,
              marginBottom: 4,
            }}
          >
            Precura / Blood panel
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 500,
              color: C.ink,
            }}
          >
            Bergstrom, Anna / 27.03.2026
          </div>
        </div>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: C.accent,
            boxShadow: `0 0 0 5px ${C.accentTint}`,
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {markers.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            style={{
              padding: "12px 14px",
              background: C.paper,
              border: `1px solid ${C.line}`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: C.inkMuted,
                  fontSize: 9,
                }}
              >
                {m.n}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 17,
                  color: C.ink,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {m.v}
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: C.inkMuted,
                    marginLeft: 4,
                    fontWeight: 400,
                  }}
                >
                  {m.u}
                </span>
              </div>
            </div>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: m.s === "good" ? C.signalGood : C.signalCaution,
              }}
            />
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// Step 2 visual - 3 risk models with scale bars
function ModelVisual() {
  const models = [
    {
      name: "FINDRISC",
      full: "Finnish Diabetes Risk Score",
      value: "17%",
      level: "Moderate",
      color: C.accent,
      pct: 0.62,
    },
    {
      name: "SCORE2",
      full: "ESC cardiovascular risk",
      value: "3%",
      level: "Low-moderate",
      color: C.sage,
      pct: 0.28,
    },
    {
      name: "FRAX",
      full: "Fracture risk assessment",
      value: "<5%",
      level: "Low",
      color: C.sage,
      pct: 0.15,
    },
  ];
  return (
    <VisualFrame>
      <div
        style={{
          ...TYPE.eyebrow,
          color: C.inkMuted,
          marginBottom: 24,
        }}
      >
        Risk engine / 3 validated models
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {models.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 * i, ease: EASE.out }}
            style={{
              padding: "18px 20px",
              background: C.paper,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 17,
                  fontWeight: 500,
                  color: C.ink,
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: m.color === C.accent ? C.accentDeep : C.sageDeep,
                  padding: "4px 9px",
                  background:
                    m.color === C.accent ? C.accentTint : "rgba(110, 138, 121, 0.12)",
                  borderRadius: 100,
                }}
              >
                {m.level}
              </div>
            </div>
            <div
              style={{
                ...TYPE.caption,
                color: C.inkMuted,
                marginBottom: 14,
              }}
            >
              {m.full}
            </div>
            <div
              style={{
                position: "relative",
                height: 5,
                background: C.paperSoft,
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${m.pct * 100}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  delay: 0.3 + i * 0.1,
                  ease: EASE.out,
                }}
                style={{
                  height: "100%",
                  background: m.color,
                  borderRadius: 100,
                }}
              />
            </div>
            <div
              style={{
                ...TYPE.caption,
                color: C.ink,
                marginTop: 12,
                fontWeight: 500,
              }}
            >
              {m.value} 10-year risk
            </div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// Step 3 visual - doctor note + coach chip stacked
function ProfileVisual() {
  return (
    <VisualFrame>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingBottom: 16,
          borderBottom: `1px solid ${C.line}`,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: C.slateBlue,
            color: C.paperElev,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          MJ
        </div>
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 500,
              color: C.ink,
            }}
          >
            Dr. Marcus Johansson
          </div>
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.inkMuted,
              fontSize: 10,
            }}
          >
            Medical lead / Leg. lakare
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            ...TYPE.eyebrow,
            color: C.inkMuted,
          }}
        >
          28 Mar 2026
        </div>
      </div>

      <div
        style={{
          background: C.paper,
          border: `1px solid ${C.line}`,
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            ...TYPE.eyebrow,
            color: C.inkMuted,
            marginBottom: 10,
          }}
        >
          Panel review
        </div>
        <p
          style={{
            ...TYPE.body,
            color: C.inkMid,
            margin: 0,
          }}
        >
          Hi Anna, your glucose at 5.8 is upper normal, not diabetic, but
          it has climbed from 5.0 in 2021. Combined with your mother's T2D
          at 58, I want us to keep a close eye on this. Ellen has rebuilt
          your training plan to hit this directly.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: C.sageSoft,
          border: `1px solid ${C.line}`,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: C.sageDeep,
            color: C.paperElev,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          EL
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 500,
              color: C.ink,
            }}
          >
            Ellen Lindqvist / Your coach
          </div>
          <div
            style={{
              ...TYPE.caption,
              color: C.inkMuted,
            }}
          >
            New training block: metabolic conditioning, 12 weeks
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
