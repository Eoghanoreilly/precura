"use client";

/**
 * CAROUSEL - "The Library".
 *
 * A bespoke clickable carousel that doubles as a content browser. Four
 * tracks:
 *   - Biomarker deep dives (HbA1c, ApoB, hs-CRP, Omega-3, Vitamin D)
 *   - Research papers (FINDRISC, SCORE2, FRAX, SDPP, DPP)
 *   - Member journeys (mini cards)
 *   - Product modules (blood panel, doctor, coach, AI chat)
 *
 * You pick a track with the tabs, then click through the cards either
 * with the side arrows or by clicking directly on the card you want.
 * The active card takes the full-width hero slot at top, the others
 * sit as a scrollable rail underneath. Keyboard accessible.
 *
 * This is NOT a typical flipping stack. It is a two-level picker.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

type Track = "biomarkers" | "research" | "members" | "product";

type CardData = {
  eyebrow: string;
  title: string;
  body: string;
  footnote: string;
  color: string;
  meta: { label: string; value: string }[];
};

const TRACKS: Record<Track, { label: string; count: number; cards: CardData[] }> = {
  biomarkers: {
    label: "Biomarkers",
    count: 5,
    cards: [
      {
        eyebrow: "Biomarker / 01",
        title: "HbA1c, your long-term blood sugar",
        body:
          "HbA1c reflects the average glucose your red blood cells have been bathed in over roughly the past 3 months. Unlike a fasting reading it is not fooled by a missed breakfast. Precura flags a rise inside the normal range because the slope predicts diabetes before the threshold does.",
        footnote: "Normal <42 / Pre-diabetic 42-47 / Diabetic >=48 mmol/mol",
        color: C.accent,
        meta: [
          { label: "Anna current", value: "38 mmol/mol" },
          { label: "Slope / 5yr", value: "+3" },
          { label: "Action", value: "Retest q3m" },
        ],
      },
      {
        eyebrow: "Biomarker / 02",
        title: "ApoB, the container that delivers cholesterol",
        body:
          "Every bad cholesterol particle that can lodge in your artery wall carries exactly one ApoB protein. Count the containers and you count the risk. ApoB is a better cardiovascular predictor than LDL-C alone, which is why Precura tracks both.",
        footnote: "Optimal <0.8 / Borderline 0.8-1.0 / High >=1.0 g/L",
        color: C.accent,
        meta: [
          { label: "Anna current", value: "0.85 g/L" },
          { label: "Reference", value: "0.8 optimal" },
          { label: "Trend", value: "Stable" },
        ],
      },
      {
        eyebrow: "Biomarker / 03",
        title: "hs-CRP, silent inflammation",
        body:
          "High-sensitivity C-reactive protein is the smoke detector. Chronic low-grade inflammation quietly accelerates cardiovascular disease, insulin resistance and depression. A reading above 3 mg/L consistently is a signal your body is in a low-grade fire.",
        footnote: "Low <1 / Average 1-3 / High >3 mg/L",
        color: C.accent,
        meta: [
          { label: "Anna current", value: "1.4 mg/L" },
          { label: "Status", value: "Average" },
          { label: "Action", value: "Monitor" },
        ],
      },
      {
        eyebrow: "Biomarker / 04",
        title: "Omega-3 index, your membrane fuel",
        body:
          "A direct measurement of EPA and DHA in your red blood cell membranes. Aiming for 8% or above is associated with reduced cardiovascular mortality and improved brain ageing. Most Swedes score between 4 and 6% without supplementation.",
        footnote: "Low <4 / Moderate 4-8 / Desirable >=8 %",
        color: C.accent,
        meta: [
          { label: "Anna current", value: "5.2%" },
          { label: "Target", value: ">=8%" },
          { label: "Protocol", value: "2g/day EPA+DHA" },
        ],
      },
      {
        eyebrow: "Biomarker / 05",
        title: "Vitamin D, 25-hydroxy",
        body:
          "Sweden is the third country from the top in global vitamin D deficiency prevalence. Your levels drop between October and March. Precura retests in winter and summer to build your actual seasonal curve, not a single deceptive reading.",
        footnote: "Deficient <25 / Insufficient 25-50 / Sufficient >=50 nmol/L",
        color: C.accent,
        meta: [
          { label: "Anna current", value: "48 nmol/L" },
          { label: "Season", value: "Winter" },
          { label: "Protocol", value: "2000 IU/day Oct-Mar" },
        ],
      },
    ],
  },
  research: {
    label: "The science",
    count: 5,
    cards: [
      {
        eyebrow: "Paper / 01",
        title: "FINDRISC, the Finnish Diabetes Risk Score",
        body:
          "Lindstrom and Tuomilehto built FINDRISC in 2003 from a 10-year follow-up of 4,435 middle-aged Finns. It predicts the 10-year probability of developing type 2 diabetes from 8 simple inputs including age, BMI, waist, family history and activity. It is the backbone of Swedish diabetes prevention in primary care.",
        footnote: "Lindstrom J, Tuomilehto J. Diabetes Care 2003;26(3):725-731",
        color: C.slateBlue,
        meta: [
          { label: "Cohort", value: "4,435 adults" },
          { label: "Follow-up", value: "10 years" },
          { label: "AUC", value: "0.85" },
        ],
      },
      {
        eyebrow: "Paper / 02",
        title: "SCORE2, the 2021 European cardiovascular risk model",
        body:
          "The SCORE2 Working Group recalibrated the European cardiovascular risk score against 677,684 individuals and 30,121 events across 45 cohorts. Unlike SCORE from 2003 it gives risk by age category for ages 40-69, and is the current recommended model across the EU including Sweden.",
        footnote: "SCORE2 Working Group. Eur Heart J 2021;42(25):2439-2454",
        color: C.slateBlue,
        meta: [
          { label: "Cohort", value: "677,684" },
          { label: "Events", value: "30,121" },
          { label: "Regions", value: "4 risk bands" },
        ],
      },
      {
        eyebrow: "Paper / 03",
        title: "FRAX, the WHO fracture risk tool",
        body:
          "Developed by Kanis et al at Sheffield in 2008, FRAX estimates 10-year probability of a major osteoporotic fracture and of hip fracture from clinical risk factors, with or without femoral neck bone mineral density. Used by every major clinical guideline including Swedish SBU.",
        footnote: "Kanis JA et al. Osteoporosis International 2008;19(4):385-397",
        color: C.slateBlue,
        meta: [
          { label: "Countries", value: "85 models" },
          { label: "Inputs", value: "12 factors" },
          { label: "Use", value: "WHO referenced" },
        ],
      },
      {
        eyebrow: "Paper / 04",
        title: "SDPP, the Stockholm Diabetes Prevention Programme",
        body:
          "Carlsson et al followed 7,949 Stockholm-area adults for a median of 20 years. The paper quantifies how combinations of family history, waist, activity and glucose actually translate into progression to T2D in a Swedish population, making Precura's models relevant here specifically.",
        footnote: "Carlsson et al. BMC Medicine 2024",
        color: C.slateBlue,
        meta: [
          { label: "Cohort", value: "7,949" },
          { label: "Follow-up", value: "20 years" },
          { label: "Location", value: "Stockholm county" },
        ],
      },
      {
        eyebrow: "Paper / 05",
        title: "DPP, the US Diabetes Prevention Program",
        body:
          "Knowler and colleagues randomised 3,234 adults with impaired glucose tolerance to metformin, a lifestyle intervention, or placebo. The lifestyle arm reduced incidence of diabetes by 58%. The core insight: moderate, sustained activity and a small amount of weight loss beat medication over 3 years.",
        footnote: "Knowler WC et al. NEJM 2002;346(6):393-403",
        color: C.slateBlue,
        meta: [
          { label: "N", value: "3,234" },
          { label: "Reduction", value: "-58%" },
          { label: "Arm", value: "Lifestyle" },
        ],
      },
    ],
  },
  members: {
    label: "Members",
    count: 4,
    cards: [
      {
        eyebrow: "Member / Stockholm",
        title: "Lotta, 44. Found a 10-year trend nobody had seen.",
        body:
          "Ten years of annual bloodwork from three different vardcentraler. Precura stitched them into one chart and the rise in fasting glucose was obvious the moment you saw them on a single axis. Dr. Marcus flagged pre-diabetic trajectory. She changed training and diet. Her panel 6 months later was back in a clean corridor.",
        footnote: "Member since January 2026 / Stockholm / Account Director",
        color: C.sage,
        meta: [
          { label: "Age", value: "44" },
          { label: "City", value: "Stockholm" },
          { label: "Outcome", value: "Glucose down" },
        ],
      },
      {
        eyebrow: "Member / Malmo",
        title: "Erik, 38. Caught a moderate cardiovascular risk.",
        body:
          "GP said his numbers were fine. Precura's SCORE2 run put him in the moderate band based on lipid ratios and family history. Dr. Marcus recommended a statin trial plus a metabolic training plan from coach Ellen. Six months later his ApoB dropped from 1.1 to 0.78.",
        footnote: "Member since February 2026 / Malmo / Teacher",
        color: C.sage,
        meta: [
          { label: "Age", value: "38" },
          { label: "City", value: "Malmo" },
          { label: "Outcome", value: "ApoB -30%" },
        ],
      },
      {
        eyebrow: "Member / Goteborg",
        title: "Anja, 35. A real doctor's note, in writing.",
        body:
          "What she liked was the honesty. No miracle promises. Dr. Marcus's note on her results actually said her cholesterol was borderline and to retest in six months. That felt like what she would expect from a real clinician, not a longevity influencer.",
        footnote: "Member since January 2026 / Goteborg / Product Designer",
        color: C.sage,
        meta: [
          { label: "Age", value: "35" },
          { label: "City", value: "Goteborg" },
          { label: "Outcome", value: "Watch-and-retest" },
        ],
      },
      {
        eyebrow: "Member / Uppsala",
        title: "Jonas, 52. A coach who actually understood his data.",
        body:
          "Jonas had been getting generic training plans for years. Ellen, his Precura coach, built his current block from his real VO2, his RHR trend and his HbA1c. The first thing she did was cut his volume and rewrite the zones. Three months later his sleep and glucose both improved.",
        footnote: "Member since March 2026 / Uppsala / Engineer",
        color: C.sage,
        meta: [
          { label: "Age", value: "52" },
          { label: "City", value: "Uppsala" },
          { label: "Outcome", value: "Sleep + glucose" },
        ],
      },
    ],
  },
  product: {
    label: "Product",
    count: 4,
    cards: [
      {
        eyebrow: "Product / 01",
        title: "The blood panel",
        body:
          "40+ biomarkers in one 10-minute draw, at a Precura-partnered lab in your city. Results inside 48 hours. Your plain-English doctor note follows within a week, personally written by Dr. Marcus. Included in every tier from 995 SEK.",
        footnote: "Stockholm / Goteborg / Malmo / Uppsala / Lund",
        color: C.graphite,
        meta: [
          { label: "Markers", value: "40+" },
          { label: "Turnaround", value: "48h" },
          { label: "Review", value: "<1 week" },
        ],
      },
      {
        eyebrow: "Product / 02",
        title: "The doctor relationship",
        body:
          "Dr. Marcus Johansson is a Swedish GP trained at Karolinska Institute with 15+ years in primary care. He personally reads every panel, writes every note, and is reachable via secure BankID-gated messaging for 12 months after your first blood draw.",
        footnote: "Leg. lakare / Karolinska Institute / Primary care",
        color: C.graphite,
        meta: [
          { label: "Reviews", value: "Personal" },
          { label: "Messages", value: "12mo" },
          { label: "Response", value: "<48h" },
        ],
      },
      {
        eyebrow: "Product / 03",
        title: "The coach relationship",
        body:
          "A certified coach is assigned when you start. They read your metabolic profile before they meet you, then build a real training plan around your actual markers. They adjust the block every four weeks. Real sets, real reps, real weights, not a step count.",
        footnote: "Exercise physiology / Strength coaching / Progressive overload",
        color: C.graphite,
        meta: [
          { label: "Plan", value: "12 weeks" },
          { label: "Review", value: "Every 4w" },
          { label: "Format", value: "App + check-ins" },
        ],
      },
      {
        eyebrow: "Product / 04",
        title: "The AI context layer",
        body:
          "A large model sits on top of your full profile, so when you ask a question it sees every lab, note, and message. Everything clinical is reviewed by Dr. Marcus before it reaches you. It is a note-taker and a researcher, not a replacement doctor.",
        footnote: "EU-hosted / GDPR-compliant / No training on personal data",
        color: C.graphite,
        meta: [
          { label: "Hosting", value: "EU" },
          { label: "Training", value: "None" },
          { label: "Review", value: "Doctor-gated" },
        ],
      },
    ],
  },
};

export function Carousel() {
  const [track, setTrack] = useState<Track>("biomarkers");
  const [index, setIndex] = useState(0);

  const current = TRACKS[track];
  const card = current.cards[index];

  function pickTrack(t: Track) {
    setTrack(t);
    setIndex(0);
  }

  function next() {
    setIndex((i) => (i + 1) % current.count);
  }
  function prev() {
    setIndex((i) => (i - 1 + current.count) % current.count);
  }

  return (
    <section
      id="library"
      style={{
        background: C.paperSoft,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
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
            marginBottom: 56,
          }}
        >
          <div style={{ gridColumn: "span 7" }} className="home12-car-head">
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.inkMuted,
                marginBottom: 20,
              }}
            >
              06 / The library
            </div>
            <h2 style={{ ...TYPE.h2, margin: 0, color: C.ink }}>
              Dig in.{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                Every piece of this product is legible.
              </span>
            </h2>
          </div>
          <p
            style={{
              gridColumn: "9 / span 4",
              ...TYPE.body,
              color: C.inkSoft,
              margin: 0,
              alignSelf: "end",
            }}
            className="home12-car-sub"
          >
            Pick a track, click through the cards. Biomarker dictionaries,
            research papers, member journeys, product modules. Nothing is
            a black box here.
          </p>
        </div>

        {/* Track tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 40,
            paddingBottom: 24,
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          {(Object.keys(TRACKS) as Track[]).map((t) => {
            const active = t === track;
            return (
              <button
                key={t}
                onClick={() => pickTrack(t)}
                style={{
                  padding: "10px 18px",
                  background: active ? C.ink : "transparent",
                  color: active ? C.paper : C.inkMid,
                  border: `1px solid ${active ? C.ink : C.lineStrong}`,
                  borderRadius: 100,
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 200ms ease",
                }}
              >
                {TRACKS[t].label}
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: active ? "rgba(250, 250, 247, 0.55)" : C.inkMuted,
                    letterSpacing: "0.06em",
                  }}
                >
                  {TRACKS[t].count.toString().padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main card area */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
            minHeight: 460,
          }}
        >
          {/* Active card - left 8 cols */}
          <div
            style={{
              gridColumn: "span 8",
              position: "relative",
            }}
            className="home12-car-active"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${track}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE.out }}
                style={{
                  background: C.paperElev,
                  border: `1px solid ${C.line}`,
                  borderRadius: 22,
                  padding: 48,
                  minHeight: 460,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: C.shadowSm,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 32,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 12px",
                      borderRadius: 100,
                      background: card.color + "1A",
                      border: `1px solid ${card.color}40`,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: card.color,
                      }}
                    />
                    <span
                      style={{
                        ...TYPE.eyebrow,
                        color: card.color,
                      }}
                    >
                      {card.eyebrow}
                    </span>
                  </div>
                  <div
                    style={{
                      ...TYPE.eyebrow,
                      color: C.inkMuted,
                    }}
                  >
                    {(index + 1).toString().padStart(2, "0")} /{" "}
                    {current.count.toString().padStart(2, "0")}
                  </div>
                </div>

                <h3
                  style={{
                    ...TYPE.displaySmall,
                    fontSize: "clamp(28px, 3vw, 40px)",
                    margin: 0,
                    marginBottom: 20,
                    color: C.ink,
                    maxWidth: 680,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    ...TYPE.body,
                    color: C.inkSoft,
                    margin: 0,
                    marginBottom: 32,
                    maxWidth: 680,
                  }}
                >
                  {card.body}
                </p>

                {/* Meta grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 20,
                    padding: "22px 0",
                    borderTop: `1px solid ${C.line}`,
                    marginTop: "auto",
                  }}
                  className="home12-car-meta"
                >
                  {card.meta.map((m, i) => (
                    <div key={i}>
                      <div
                        style={{
                          ...TYPE.eyebrow,
                          color: C.inkMuted,
                          marginBottom: 6,
                        }}
                      >
                        {m.label}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT,
                          fontSize: 20,
                          fontWeight: 500,
                          color: C.ink,
                          letterSpacing: "-0.015em",
                        }}
                      >
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    ...TYPE.caption,
                    color: C.inkMuted,
                    marginTop: 14,
                    fontStyle: "italic",
                  }}
                >
                  {card.footnote}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                display: "flex",
                gap: 8,
              }}
            >
              <button
                onClick={prev}
                aria-label="Previous card"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `1px solid ${C.lineStrong}`,
                  background: C.paperElev,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: C.ink,
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.ink;
                  e.currentTarget.style.color = C.paper;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.paperElev;
                  e.currentTarget.style.color = C.ink;
                }}
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                onClick={next}
                aria-label="Next card"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `1px solid ${C.lineStrong}`,
                  background: C.ink,
                  color: C.paper,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.graphiteSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.ink;
                }}
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Picker rail - right 4 cols */}
          <div
            style={{
              gridColumn: "span 4",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
            className="home12-car-rail"
          >
            {current.cards.map((c, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "18px 20px",
                    background: active ? C.ink : C.paperElev,
                    color: active ? C.paper : C.ink,
                    border: `1px solid ${active ? C.ink : C.line}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    transition: "all 250ms ease",
                    fontFamily: FONT,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.borderColor = C.lineStrong;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.borderColor = C.line;
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        ...TYPE.eyebrow,
                        color: active ? C.accent : C.inkMuted,
                      }}
                    >
                      {c.eyebrow}
                    </span>
                    {active && (
                      <ArrowRight
                        size={14}
                        strokeWidth={2}
                        color={C.paper}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 15,
                      fontWeight: 500,
                      color: active ? C.paper : C.ink,
                      lineHeight: 1.35,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {c.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-car-head),
          :global(.home12-car-sub) {
            grid-column: span 12 !important;
          }
          :global(.home12-car-active),
          :global(.home12-car-rail) {
            grid-column: span 12 !important;
          }
          :global(.home12-car-meta) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
