"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "./_components/SmoothScroll";
import { Reveal, WordsReveal } from "./_components/Reveal";

/* ------------------------------------------------------------------ */
/*  Palette - defined inline, no project CSS vars used                */
/* ------------------------------------------------------------------ */

const PALETTE = {
  page: "#FBF8F3", // warm paper
  ink: "#1C1B18", // near-black ink
  inkSoft: "#3A382F",
  inkMuted: "#6B6860",
  inkFaint: "#A8A49A",
  rule: "#E3DED3", // hairline rule
  cream: "#F5F0E6",
  accent: "#7A3E1D", // muted rust accent, used sparingly
  accentSoft: "#B25D36",
  selection: "rgba(178, 93, 54, 0.18)",
};

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO_STACK =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

/* A constrained reading measure, roughly 60-68 characters */
const MEASURE = 620;

/* ------------------------------------------------------------------ */
/*  Parallax portrait                                                  */
/* ------------------------------------------------------------------ */

function ParallaxPortrait() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <figure
      ref={ref}
      style={{
        margin: "96px auto 0",
        maxWidth: 360,
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          overflow: "hidden",
          background: PALETTE.cream,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: "-6% 0",
            y: reduce ? 0 : y,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&auto=format&fit=crop"
            alt="Portrait of a woman, mid-thirties, warm afternoon light"
            fill
            sizes="(max-width: 720px) 100vw, 360px"
            style={{
              objectFit: "cover",
              filter: "grayscale(0.1) contrast(0.98) saturate(0.92)",
            }}
            unoptimized
          />
        </motion.div>
      </div>
      <figcaption
        style={{
          marginTop: 16,
          fontFamily: MONO_STACK,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: PALETTE.inkMuted,
          lineHeight: 1.6,
        }}
      >
        Anna, 40. Five years of normal results, one pattern nobody saw.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Small typographic atoms                                            */
/* ------------------------------------------------------------------ */

function Rule() {
  return (
    <div
      role="separator"
      style={{
        height: 1,
        background: PALETTE.rule,
        width: "100%",
        margin: "0",
      }}
    />
  );
}

function SectionLabel({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <Reveal>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          fontFamily: MONO_STACK,
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: PALETTE.inkMuted,
          marginBottom: 32,
        }}
      >
        <span style={{ color: PALETTE.accent }}>{number}</span>
        <span>{title}</span>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function HomeTwoPage() {
  return (
    <main
      style={{
        background: PALETTE.page,
        color: PALETTE.ink,
        fontFamily: FONT_STACK,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "ss01" 1',
      }}
    >
      <style>{`
        ::selection { background: ${PALETTE.selection}; color: ${PALETTE.ink}; }
        a { color: inherit; text-decoration: none; }
        .h2-page a.h2-underline {
          background-image: linear-gradient(${PALETTE.ink}, ${PALETTE.ink});
          background-size: 100% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          padding-bottom: 2px;
          transition: background-size 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .h2-page a.h2-underline:hover {
          background-size: 0% 1px;
        }
        .h2-dropcap::first-letter {
          float: left;
          font-size: 5.2em;
          line-height: 0.86;
          padding: 0.06em 0.08em 0 0;
          font-weight: 300;
          color: ${PALETTE.ink};
        }
      `}</style>

      <SmoothScroll />

      <div className="h2-page">
        {/* ================================================== */}
        {/*  NAVIGATION - spare, horizontal, hairline below     */}
        {/* ================================================== */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: `${PALETTE.page}e6`,
            backdropFilter: "saturate(140%) blur(12px)",
            WebkitBackdropFilter: "saturate(140%) blur(12px)",
            borderBottom: `1px solid ${PALETTE.rule}`,
          }}
        >
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              padding: "20px clamp(24px, 5vw, 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: PALETTE.ink,
                }}
              >
                Precura
              </span>
              <span
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: PALETTE.inkMuted,
                }}
              >
                Essay / 01
              </span>
            </div>

            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                fontSize: 13,
                color: PALETTE.inkSoft,
              }}
            >
              <a href="#argument" className="h2-underline">
                The argument
              </a>
              <a href="#evidence" className="h2-underline">
                Evidence
              </a>
              <a href="#method" className="h2-underline">
                Method
              </a>
              <a
                href="#begin"
                style={{
                  color: PALETTE.ink,
                  borderBottom: `1px solid ${PALETTE.ink}`,
                  paddingBottom: 2,
                }}
              >
                Begin
              </a>
            </nav>
          </div>
        </header>

        {/* ================================================== */}
        {/*  OPENING - one massive pull-quote sentence          */}
        {/* ================================================== */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px)",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div style={{ width: "100%" }}>
            <Reveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 20,
                  fontFamily: MONO_STACK,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: PALETTE.inkMuted,
                  marginBottom: "clamp(48px, 8vh, 96px)",
                }}
              >
                <span style={{ color: PALETTE.accent }}>00</span>
                <span>Opening</span>
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: PALETTE.rule,
                    maxWidth: 280,
                  }}
                />
                <span>Stockholm, 2026</span>
              </div>
            </Reveal>

            <WordsReveal
              as="h1"
              text="Half of Swedes who develop type 2 diabetes will live with it for years before anyone thinks to say the word out loud."
              stagger={0.035}
              duration={0.9}
              style={{
                fontSize: "clamp(44px, 9.2vw, 148px)",
                lineHeight: 0.96,
                letterSpacing: "-0.035em",
                fontWeight: 300,
                color: PALETTE.ink,
                maxWidth: "16ch",
                margin: 0,
                fontFeatureSettings: '"kern" 1, "ss01" 1',
              }}
            />

            <Reveal delay={1.1}>
              <p
                style={{
                  marginTop: "clamp(40px, 6vh, 72px)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: PALETTE.inkMuted,
                  maxWidth: 520,
                  fontWeight: 400,
                }}
              >
                An essay about a woman named Anna, a decade of quiet blood
                test results, and a disease that grew up unseen in the space
                between visits.
              </p>
            </Reveal>

            <Reveal delay={1.25}>
              <div
                style={{
                  marginTop: 48,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  fontFamily: MONO_STACK,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: PALETTE.inkFaint,
                }}
              >
                <span>Scroll to read</span>
                <span
                  style={{
                    display: "inline-block",
                    width: 36,
                    height: 1,
                    background: PALETTE.inkFaint,
                  }}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <Rule />

        {/* ================================================== */}
        {/*  THE ARGUMENT - literary prose                      */}
        {/* ================================================== */}
        <section
          id="argument"
          style={{
            padding: "clamp(96px, 14vh, 200px) clamp(24px, 5vw, 64px)",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: 0,
            }}
          >
            <SectionLabel number="01" title="The argument" />

            <Reveal>
              <h2
                style={{
                  fontSize: "clamp(32px, 5.2vw, 72px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.025em",
                  fontWeight: 400,
                  color: PALETTE.ink,
                  maxWidth: "18ch",
                  marginBottom: "clamp(56px, 8vh, 96px)",
                  marginTop: 0,
                }}
              >
                The data already existed.{" "}
                <em
                  style={{
                    fontWeight: 300,
                    color: PALETTE.inkSoft,
                    fontStyle: "italic",
                  }}
                >
                  No single doctor saw the full picture.
                </em>
              </h2>
            </Reveal>

            <div style={{ maxWidth: MEASURE }}>
              <Reveal>
                <p
                  className="h2-dropcap"
                  style={{
                    fontSize: 20,
                    lineHeight: 1.62,
                    color: PALETTE.inkSoft,
                    fontWeight: 400,
                    marginBottom: 32,
                  }}
                >
                  Anna Bergstrom is forty. She lives outside Stockholm, runs
                  twice a week, eats a little too much bread. Her mother was
                  diagnosed with type 2 diabetes at fifty-eight. Her father
                  had a heart attack at sixty-five. For the last five years
                  she has walked into her vardcentral when something itches
                  or aches, had her blood drawn, been told that everything
                  looks fine, and walked home.
                </p>
              </Reveal>

              <Reveal>
                <p
                  style={{
                    fontSize: 20,
                    lineHeight: 1.62,
                    color: PALETTE.inkSoft,
                    fontWeight: 400,
                    marginBottom: 32,
                  }}
                >
                  Each of those visits was a different doctor. Each of those
                  results was, technically, within range. And yet, viewed
                  end-to-end, her fasting glucose has drifted from 5.0 to 5.8
                  mmol per litre, a slow, quiet climb that no individual
                  appointment had the context to notice. Her cholesterol has
                  crept up. Her blood pressure, medicated mildly since 2023,
                  reads like a warning she has not been told to read.
                </p>
              </Reveal>

              <Reveal>
                <p
                  style={{
                    fontSize: 20,
                    lineHeight: 1.62,
                    color: PALETTE.inkSoft,
                    fontWeight: 400,
                    marginBottom: 32,
                  }}
                >
                  Roughly ninety percent of Swedish adults see primary care
                  at least once every five years. The data exists. It is
                  scattered across visits, providers, and systems that do
                  not, in any meaningful sense, talk to one another. The
                  disease is predictable. Our ability to predict it, for
                  most people, is not.
                </p>
              </Reveal>

              <Reveal>
                <blockquote
                  style={{
                    borderTop: `1px solid ${PALETTE.rule}`,
                    borderBottom: `1px solid ${PALETTE.rule}`,
                    padding: "48px 0",
                    margin: "56px 0",
                    fontSize: "clamp(26px, 3.4vw, 42px)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: PALETTE.ink,
                    maxWidth: "22ch",
                  }}
                >
                  Precura is a second reader, quietly holding ten years of
                  your own results up to the light.
                </blockquote>
              </Reveal>

              <Reveal>
                <p
                  style={{
                    fontSize: 20,
                    lineHeight: 1.62,
                    color: PALETTE.inkSoft,
                    fontWeight: 400,
                    marginBottom: 0,
                  }}
                >
                  We do not replace her doctor. We do not invent new tests.
                  We take the ones she already has, set them against the
                  family she was born into, and run them through clinical
                  models built and validated by people who have spent their
                  careers studying exactly this quiet drift. Then we write
                  down, in plain Swedish and plain English, what we see and
                  what we would do about it.
                </p>
              </Reveal>

              <ParallaxPortrait />
            </div>
          </div>
        </section>

        <Rule />

        {/* ================================================== */}
        {/*  THE EVIDENCE - typographic numerals                */}
        {/* ================================================== */}
        <section
          id="evidence"
          style={{
            padding: "clamp(96px, 14vh, 200px) clamp(24px, 5vw, 64px)",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <SectionLabel number="02" title="The evidence" />

          <Reveal>
            <h2
              style={{
                fontSize: "clamp(32px, 5.2vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                fontWeight: 400,
                color: PALETTE.ink,
                maxWidth: "16ch",
                marginBottom: "clamp(64px, 10vh, 128px)",
                marginTop: 0,
              }}
            >
              Four numbers we keep coming back to.
            </h2>
          </Reveal>

          <Numeral
            number="50%"
            caption="of Swedes who develop type 2 diabetes go undiagnosed for years."
            source="Swedish National Diabetes Register, 2024"
          />

          <Numeral
            number="90%"
            caption="of Swedish adults visit primary care at least once every five years."
            source="Socialstyrelsen, Vardanalys 2023"
          />

          <Numeral
            number="5.8"
            caption="mmol/L. Anna's latest fasting glucose, up from 5.0 in 2020. Still, technically, normal."
            source="Patient record, anonymised"
          />

          <Numeral
            number="0"
            caption="new blood tests required. We work with the ones you already have."
            source="The idea"
            last
          />
        </section>

        <Rule />

        {/* ================================================== */}
        {/*  THE METHOD - prose-first                           */}
        {/* ================================================== */}
        <section
          id="method"
          style={{
            padding: "clamp(96px, 14vh, 200px) clamp(24px, 5vw, 64px)",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <SectionLabel number="03" title="The method" />

          <Reveal>
            <h2
              style={{
                fontSize: "clamp(32px, 5.2vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                fontWeight: 400,
                color: PALETTE.ink,
                maxWidth: "18ch",
                marginBottom: "clamp(56px, 8vh, 96px)",
                marginTop: 0,
              }}
            >
              Three questions, asked carefully, in the right order.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) minmax(0, 2fr)",
              gap: "clamp(32px, 6vw, 96px)",
              maxWidth: 1040,
            }}
          >
            <div />
            <div style={{ maxWidth: MEASURE }}>
              <MethodStep
                index="i."
                title="What have your numbers been doing?"
                body="You connect Precura to 1177 and hand us the blood tests you already have, all the way back. We turn ten years of paper-thin PDFs into a single, quiet graph. Glucose, cholesterol, blood pressure, kidney markers, liver markers. Trends, not snapshots."
              />
              <MethodStep
                index="ii."
                title="What are you actually likely to get?"
                body="We run your results through FINDRISC for diabetes, SCORE2 for cardiovascular disease, and FRAX for bone, the same instruments your doctor would use if she had a long afternoon and all of your history in one place. The output is a ten-year estimate, with honest confidence intervals, not a score out of a hundred."
              />
              <MethodStep
                index="iii."
                title="What would actually move the number?"
                body="Not eat vegetables. Not exercise more. Specific changes, grounded in your data: the supplement that matters, the walk that matters, the appointment that matters. Written as if one human is talking to another, because one is."
                last
              />
            </div>
          </div>

          {/* Quiet detail diagram */}
          <Reveal>
            <figure
              style={{
                marginTop: "clamp(80px, 14vh, 160px)",
                maxWidth: 860,
                marginLeft: "auto",
                marginRight: "auto",
                borderTop: `1px solid ${PALETTE.rule}`,
                paddingTop: 40,
              }}
            >
              <GlucoseDriftChart />
              <figcaption
                style={{
                  marginTop: 24,
                  fontFamily: MONO_STACK,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: PALETTE.inkMuted,
                  lineHeight: 1.7,
                  textAlign: "center",
                }}
              >
                Fig. 1 - Anna&apos;s fasting glucose, 2020 to 2025. Every point below
                6.0 mmol/L. Every point above the last.
              </figcaption>
            </figure>
          </Reveal>
        </section>

        <Rule />

        {/* ================================================== */}
        {/*  THE CLOSE                                          */}
        {/* ================================================== */}
        <section
          id="begin"
          style={{
            padding: "clamp(120px, 18vh, 240px) clamp(24px, 5vw, 64px)",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <SectionLabel number="04" title="The close" />

          <Reveal>
            <h2
              style={{
                fontSize: "clamp(48px, 10vw, 168px)",
                lineHeight: 0.94,
                letterSpacing: "-0.035em",
                fontWeight: 300,
                color: PALETTE.ink,
                maxWidth: "11ch",
                margin: 0,
              }}
            >
              Read your own story,{" "}
              <em
                style={{
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: PALETTE.accent,
                }}
              >
                before it writes itself.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              style={{
                marginTop: "clamp(40px, 6vh, 72px)",
                fontSize: 18,
                lineHeight: 1.6,
                color: PALETTE.inkSoft,
                maxWidth: 560,
                fontWeight: 400,
              }}
            >
              Precura opens in Sweden this spring. Founding members pay 349
              SEK a month, get their first report within an hour of
              connecting 1177, and keep the same doctor on the other end of
              every message. No dashboards full of badges. No daily
              reminders. Just a quiet second reader, for the people who
              would rather know.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div
              style={{
                marginTop: "clamp(48px, 8vh, 96px)",
                display: "flex",
                flexWrap: "wrap",
                gap: 32,
                alignItems: "center",
              }}
            >
              <a
                href="/v2/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 17,
                  fontWeight: 500,
                  color: PALETTE.page,
                  background: PALETTE.ink,
                  padding: "20px 32px",
                  borderRadius: 2,
                  letterSpacing: "-0.005em",
                }}
              >
                Begin reading
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 1,
                    background: PALETTE.page,
                  }}
                />
              </a>
              <a
                href="#argument"
                className="h2-underline"
                style={{
                  fontSize: 15,
                  color: PALETTE.inkSoft,
                  fontWeight: 400,
                }}
              >
                Start the essay over
              </a>
            </div>
          </Reveal>
        </section>

        <Rule />

        {/* ================================================== */}
        {/*  COLOPHON                                           */}
        {/* ================================================== */}
        <footer
          style={{
            padding: "clamp(64px, 10vh, 120px) clamp(24px, 5vw, 64px) 96px",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
              gap: "clamp(32px, 6vw, 80px)",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: PALETTE.inkMuted,
                  marginBottom: 12,
                }}
              >
                Colophon
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: PALETTE.inkSoft,
                  maxWidth: 360,
                }}
              >
                Precura is a predictive health company registered in
                Stockholm. Founded in 2025 with a family doctor, built for
                people who would rather see the pattern.
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 24,
              }}
            >
              <FooterList
                title="Read"
                items={[
                  "The argument",
                  "The evidence",
                  "The method",
                  "The close",
                ]}
              />
              <FooterList
                title="Company"
                items={["About", "Clinical board", "Press", "Contact"]}
              />
              <FooterList
                title="Fine print"
                items={[
                  "Privacy",
                  "Terms",
                  "Data protection",
                  "Regulatory",
                ]}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "clamp(56px, 8vh, 96px)",
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              paddingTop: 24,
              borderTop: `1px solid ${PALETTE.rule}`,
              fontFamily: MONO_STACK,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: PALETTE.inkMuted,
            }}
          >
            <span>(c) Precura AB, 2026</span>
            <span>Set in SF Pro</span>
            <span>Stockholm / Sweden</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ================================================================== */
/*  Sub components                                                     */
/* ================================================================== */

function Numeral({
  number,
  caption,
  source,
  last = false,
}: {
  number: string;
  caption: string;
  source: string;
  last?: boolean;
}) {
  return (
    <Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)",
          gap: "clamp(24px, 5vw, 80px)",
          alignItems: "baseline",
          padding: "clamp(56px, 9vh, 104px) 0",
          borderBottom: last ? "none" : `1px solid ${PALETTE.rule}`,
        }}
      >
        <div
          style={{
            fontSize: "clamp(96px, 22vw, 320px)",
            lineHeight: 0.86,
            letterSpacing: "-0.055em",
            fontWeight: 200,
            color: PALETTE.ink,
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}
        >
          {number}
        </div>
        <div style={{ maxWidth: 420 }}>
          <div
            style={{
              fontSize: "clamp(18px, 1.6vw, 22px)",
              lineHeight: 1.45,
              color: PALETTE.inkSoft,
              fontWeight: 400,
              marginBottom: 24,
              letterSpacing: "-0.005em",
            }}
          >
            {caption}
          </div>
          <div
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: PALETTE.inkMuted,
            }}
          >
            Source / {source}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function MethodStep({
  index,
  title,
  body,
  last = false,
}: {
  index: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <Reveal>
      <div
        style={{
          padding: "40px 0",
          borderBottom: last ? "none" : `1px solid ${PALETTE.rule}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: MONO_STACK,
              fontSize: 12,
              color: PALETTE.accent,
              letterSpacing: "0.04em",
            }}
          >
            {index}
          </span>
          <h3
            style={{
              fontSize: 24,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              fontWeight: 500,
              color: PALETTE.ink,
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: PALETTE.inkSoft,
            fontWeight: 400,
            margin: 0,
            paddingLeft: 32,
          }}
        >
          {body}
        </p>
      </div>
    </Reveal>
  );
}

function FooterList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: MONO_STACK,
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: PALETTE.inkMuted,
          marginBottom: 14,
        }}
      >
        {title}
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
        {items.map((it) => (
          <li key={it}>
            <a
              href="#"
              className="h2-underline"
              style={{
                fontSize: 14,
                color: PALETTE.inkSoft,
                fontWeight: 400,
              }}
            >
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hand-drawn-ish glucose drift chart - inline SVG, pure typography   */
/* ------------------------------------------------------------------ */

function GlucoseDriftChart() {
  const reduce = useReducedMotion();

  const data = [
    { year: "2020", value: 5.0 },
    { year: "2021", value: 5.1 },
    { year: "2022", value: 5.3 },
    { year: "2023", value: 5.4 },
    { year: "2024", value: 5.6 },
    { year: "2025", value: 5.8 },
  ];

  const w = 860;
  const h = 220;
  const padL = 48;
  const padR = 48;
  const padT = 30;
  const padB = 44;

  const min = 4.8;
  const max = 6.1;

  const xFor = (i: number) =>
    padL + (i / (data.length - 1)) * (w - padL - padR);
  const yFor = (v: number) =>
    padT + ((max - v) / (max - min)) * (h - padT - padB);

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.value)}`)
    .join(" ");

  // horizontal reference lines at 5.0, 5.5, 6.0
  const refs = [5.0, 5.5, 6.0];

  return (
    <div style={{ width: "100%", overflow: "visible" }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Anna's fasting glucose from 2020 to 2025"
      >
        {/* baseline rule */}
        <line
          x1={padL}
          x2={w - padR}
          y1={h - padB}
          y2={h - padB}
          stroke={PALETTE.rule}
          strokeWidth={1}
        />
        {/* reference lines */}
        {refs.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={w - padR}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke={PALETTE.rule}
              strokeWidth={1}
              strokeDasharray="2 6"
            />
            <text
              x={padL - 10}
              y={yFor(v) + 4}
              fontFamily={MONO_STACK}
              fontSize={10}
              fill={PALETTE.inkMuted}
              textAnchor="end"
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        {/* line */}
        <motion.path
          d={path}
          fill="none"
          stroke={PALETTE.ink}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduce ? 0 : 1.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        {/* points + year labels */}
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          return (
            <g key={d.year}>
              <motion.circle
                cx={xFor(i)}
                cy={yFor(d.value)}
                r={isLast ? 4 : 2.6}
                fill={isLast ? PALETTE.accent : PALETTE.ink}
                initial={{ opacity: reduce ? 1 : 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  delay: reduce ? 0 : 1.2 + i * 0.08,
                  duration: 0.4,
                }}
              />
              <text
                x={xFor(i)}
                y={h - padB + 22}
                fontFamily={MONO_STACK}
                fontSize={10}
                fill={PALETTE.inkMuted}
                textAnchor="middle"
              >
                {d.year}
              </text>
              {isLast && (
                <text
                  x={xFor(i) + 10}
                  y={yFor(d.value) - 10}
                  fontFamily={FONT_STACK}
                  fontSize={12}
                  fontStyle="italic"
                  fill={PALETTE.accent}
                  textAnchor="start"
                >
                  still &quot;normal&quot;
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
