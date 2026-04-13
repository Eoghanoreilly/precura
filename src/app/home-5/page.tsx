"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./_components/Reveal";

// =============================================================================
// PRECURA / HOME 5 - "CLINICAL TRUST"
// A portrait-led, science-forward landing page. Warm Swedish clinic feel.
// Leads with doctors and patients as real humans. Names the risk models.
// =============================================================================

// --- System font stack (Apple only, never Google) ---
const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO_FONT =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

// --- Warm clinic palette (real hex values, declared inline per spec) ---
const C = {
  page: "#F6F1E8",        // warm off-white (cream)
  card: "#FFFFFF",
  paper: "#FAF6EC",       // warmer cream for panels
  ink: "#1B1F17",         // near-black, warm
  inkSoft: "#3D4235",
  inkMuted: "#6B6E62",
  line: "#E9E3D4",        // warm hairline
  forest: "#1F3B2D",      // deep forest green, clinical + warm
  forestSoft: "#2E5441",
  sage: "#A7B89A",        // muted sage accent
  sageSoft: "#D5DFCB",
  terracotta: "#B8623D",  // warm, patient-facing accent
  sand: "#E8DAB8",
  amber: "#C68A2D",
};

// --- Unsplash portraits (high quality, real clinical/human imagery) ---
// Chosen for warmth, human faces, and Swedish/Nordic feel.
const IMAGES = {
  // Hero: female clinician, natural light, warm look
  hero:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=2000&q=85&auto=format&fit=crop",
  // Doctor co-founder portrait (older woman doctor, warm)
  doctor:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=85&auto=format&fit=crop",
  // Engineer co-founder portrait
  engineer:
    "https://images.unsplash.com/photo-1557862921-37829c790f19?w=1200&q=85&auto=format&fit=crop",
  // Lab technician working - science in context
  lab:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=85&auto=format&fit=crop",
  // Patient / customer portrait (woman 40s outdoors, Scandinavian feel)
  patient:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=85&auto=format&fit=crop",
  // Second clinician for team / testimonial
  clinician2:
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1400&q=85&auto=format&fit=crop",
  // Wide calm environment - clinic interior
  clinic:
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=2000&q=85&auto=format&fit=crop",
};

// =============================================================================
// HERO - Full bleed portrait photograph with copy on a panel to the right
// =============================================================================

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background: C.page,
        overflow: "hidden",
      }}
    >
      {/* Top bar - understated, Scandinavian */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: "28px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: C.ink,
            fontFamily: SYSTEM_FONT,
          }}
        >
          Precura
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: 50,
              background: C.terracotta,
              marginLeft: 6,
              verticalAlign: "middle",
            }}
          />
        </div>
        <nav
          style={{
            display: "flex",
            gap: 36,
            alignItems: "center",
            fontFamily: SYSTEM_FONT,
            fontSize: 14,
            color: C.inkSoft,
          }}
        >
          <a href="#method" style={{ color: "inherit", textDecoration: "none" }}>
            The method
          </a>
          <a href="#science" style={{ color: "inherit", textDecoration: "none" }}>
            Science
          </a>
          <a href="#team" style={{ color: "inherit", textDecoration: "none" }}>
            Who built this
          </a>
          <Link
            href="/onboarding"
            style={{
              color: C.ink,
              textDecoration: "none",
              padding: "10px 18px",
              border: `1px solid ${C.ink}`,
              borderRadius: 999,
              fontWeight: 500,
            }}
          >
            Get started
          </Link>
        </nav>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          minHeight: "100vh",
          gap: 0,
        }}
      >
        {/* LEFT - Full bleed portrait image */}
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <Image
            src={IMAGES.hero}
            alt="Dr. Lena Holm, Family Physician, Stockholm"
            fill
            priority
            sizes="60vw"
            style={{
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
          {/* Subtle warm overlay to keep skin tones natural but reduce contrast with panel */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(27,31,23,0.12) 0%, rgba(27,31,23,0) 45%, rgba(246,241,232,0.0) 100%)",
            }}
          />
          {/* Photo caption - small, bottom-left */}
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 40,
              padding: "14px 18px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: 12,
              fontFamily: SYSTEM_FONT,
              maxWidth: 320,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkMuted, marginBottom: 4 }}>
              Photo
            </div>
            <div style={{ fontSize: 14, color: C.ink, fontWeight: 500, lineHeight: 1.35 }}>
              Dr. Lena Holm, MD
            </div>
            <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.4 }}>
              Family medicine specialist, Stockholm. Precura clinical advisor.
            </div>
          </div>
        </div>

        {/* RIGHT - Copy panel */}
        <div
          style={{
            background: C.page,
            padding: "160px 72px 72px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Reveal delay={0.05}>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.forestSoft,
                marginBottom: 28,
              }}
            >
              Built in Sweden / Launching 2026
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1
              style={{
                fontFamily: SYSTEM_FONT,
                fontSize: "clamp(44px, 5.4vw, 78px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
                color: C.ink,
                margin: 0,
                marginBottom: 32,
              }}
            >
              Know your risk.
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: C.forest }}>
                Before it knows
              </span>{" "}
              <span style={{ fontStyle: "italic", fontWeight: 300, color: C.forest }}>you.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: SYSTEM_FONT,
                fontSize: 18,
                lineHeight: 1.55,
                color: C.inkSoft,
                maxWidth: 460,
                marginBottom: 36,
              }}
            >
              Precura runs the same validated risk models that Swedish primary care
              uses - FINDRISC (diabetes risk score), SCORE2 (heart risk score), and
              FRAX (fracture risk score) - against your blood tests, family history
              and lifestyle. You see your 10-year trajectory in plain Swedish.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 44 }}>
              <Link
                href="/onboarding"
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: C.forest,
                  textDecoration: "none",
                  padding: "16px 28px",
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Get your first risk assessment
                <span style={{ fontSize: 18, lineHeight: 1 }}>/</span>
              </Link>
              <Link
                href="#method"
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: 15,
                  color: C.inkSoft,
                  textDecoration: "none",
                  padding: "16px 14px",
                }}
              >
                See the method
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div
              style={{
                display: "flex",
                gap: 32,
                paddingTop: 28,
                borderTop: `1px solid ${C.line}`,
                fontFamily: SYSTEM_FONT,
              }}
            >
              <div>
                <div style={{ fontSize: 24, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>
                  50%
                </div>
                <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.4, marginTop: 4, maxWidth: 150 }}>
                  of Swedes with type 2 diabetes are undiagnosed for years
                </div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>
                  3
                </div>
                <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.4, marginTop: 4, maxWidth: 150 }}>
                  peer-reviewed risk models, run against your data
                </div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>
                  20y
                </div>
                <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.4, marginTop: 4, maxWidth: 150 }}>
                  of Swedish primary care use, behind every model
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// THE QUIET CATASTROPHE - Anna's story, set like an editorial
// =============================================================================

function AnnaStory() {
  const readings = [
    { year: 2020, value: "5.0" },
    { year: 2021, value: "5.2" },
    { year: 2022, value: "5.3" },
    { year: 2023, value: "5.5" },
    { year: 2024, value: "5.8" },
  ];

  return (
    <section
      style={{
        background: C.paper,
        padding: "140px 48px 160px",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Left - portrait photo with a caption like an editorial */}
          <div>
            <Reveal>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 30px 60px -30px rgba(27,31,23,0.35)",
                }}
              >
                <Image
                  src={IMAGES.patient}
                  alt="Anna Bergstrom, 40, patient composite"
                  fill
                  sizes="40vw"
                  style={{ objectFit: "cover", objectPosition: "center 25%" }}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ marginTop: 20, fontFamily: SYSTEM_FONT }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.inkMuted,
                    marginBottom: 6,
                  }}
                >
                  Patient composite / Stockholm
                </div>
                <div style={{ fontSize: 15, color: C.ink, lineHeight: 1.5, maxWidth: 360 }}>
                  &ldquo;Anna&rdquo; represents a common trajectory we see in Swedish
                  primary care data. Her details are fictional. The numbers are not.
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right - Editorial story */}
          <div>
            <Reveal>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.forestSoft,
                  marginBottom: 22,
                }}
              >
                The quiet catastrophe
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: "clamp(34px, 3.6vw, 52px)",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.03,
                  color: C.ink,
                  margin: 0,
                  marginBottom: 32,
                  maxWidth: 640,
                }}
              >
                Each test came back{" "}
                <span style={{ fontStyle: "italic", color: C.forest }}>
                  &ldquo;technically normal&rdquo;
                </span>
                . Nobody saw the line.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: C.inkSoft,
                  maxWidth: 580,
                }}
              >
                <p style={{ margin: "0 0 20px 0" }}>
                  Anna is 40, lives in Stockholm, works in engineering. Over five
                  years, her fasting glucose (blood sugar after an overnight fast)
                  rose from 5.0 to 5.8 mmol/L. Every result was inside the reference
                  range. Every doctor she saw was a different doctor. No single
                  person saw the five results in a row.
                </p>
                <p style={{ margin: 0 }}>
                  Her mother had type 2 diabetes at 58. Her father had a heart
                  attack at 65. The line was there the whole time. The system just
                  never joined the dots.
                </p>
              </div>
            </Reveal>

            {/* Simple inline trajectory - editorial style, not a dashboard chart */}
            <Reveal delay={0.2}>
              <div
                style={{
                  marginTop: 48,
                  padding: "28px 32px",
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  maxWidth: 580,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.inkMuted,
                    marginBottom: 18,
                  }}
                >
                  Fasting glucose, mmol/L / reference range 4.0 - 6.0
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${readings.length}, 1fr)`,
                    gap: 8,
                    alignItems: "end",
                    height: 80,
                    marginBottom: 14,
                    position: "relative",
                  }}
                >
                  {/* Reference range line - normal top */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 4,
                      borderTop: `1px dashed ${C.sage}`,
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        right: 0,
                        top: -18,
                        fontFamily: MONO_FONT,
                        fontSize: 10,
                        color: C.inkMuted,
                      }}
                    >
                      6.0
                    </span>
                  </div>
                  {readings.map((r, i) => {
                    const val = parseFloat(r.value);
                    const height = ((val - 4.5) / 1.6) * 100;
                    const isLast = i === readings.length - 1;
                    return (
                      <div
                        key={r.year}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                          height: "100%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: MONO_FONT,
                            fontSize: 12,
                            color: isLast ? C.terracotta : C.inkSoft,
                            fontWeight: isLast ? 600 : 400,
                          }}
                        >
                          {r.value}
                        </div>
                        <div
                          style={{
                            width: "60%",
                            height: `${Math.max(height, 6)}%`,
                            background: isLast
                              ? `linear-gradient(180deg, ${C.terracotta} 0%, ${C.amber} 100%)`
                              : C.sand,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${readings.length}, 1fr)`,
                    gap: 8,
                    paddingTop: 8,
                    borderTop: `1px solid ${C.line}`,
                  }}
                >
                  {readings.map((r) => (
                    <div
                      key={r.year}
                      style={{
                        fontFamily: MONO_FONT,
                        fontSize: 11,
                        color: C.inkMuted,
                        textAlign: "center",
                      }}
                    >
                      {r.year}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 20,
                    fontFamily: SYSTEM_FONT,
                    fontSize: 13,
                    color: C.inkSoft,
                    lineHeight: 1.55,
                  }}
                >
                  Five results inside the reference range. One clear line heading
                  the wrong way. Precura catches the line before the diagnosis.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// THE METHOD - Named risk models
// =============================================================================

type Model = {
  name: string;
  plain: string;
  title: string;
  body: string;
  inputs: string[];
  citation: string;
};

const MODELS: Model[] = [
  {
    name: "FINDRISC",
    plain: "diabetes risk score",
    title: "Type 2 diabetes, 10-year risk",
    body: "The Finnish Diabetes Risk Score. Used in Swedish primary care for over twenty years. It takes age, body mass index (BMI), waist size, physical activity, diet, medication history, previous high glucose and family history, and gives a 10-year probability of developing type 2 diabetes. Precura runs it against your Precura data automatically every time a new blood test arrives.",
    inputs: ["Age", "BMI", "Waist", "Activity", "Diet", "Family history", "Fasting glucose"],
    citation: "Lindstrom J, Tuomilehto J. The Diabetes Risk Score. Diabetes Care 2003;26(3):725-31.",
  },
  {
    name: "SCORE2",
    plain: "heart risk score",
    title: "Heart attack and stroke, 10-year risk",
    body: "The European Society of Cardiology model used across Europe since 2021. It uses age, sex, smoking status, systolic blood pressure and non-HDL cholesterol to give a 10-year probability of a fatal or non-fatal cardiovascular event. It is the standard tool used by Swedish GPs. Precura runs it automatically and shows you the factors that are moving it.",
    inputs: ["Age", "Sex", "Smoking", "Blood pressure", "Non-HDL cholesterol"],
    citation: "SCORE2 working group. SCORE2 risk prediction algorithms. Eur Heart J 2021;42(25):2439-54.",
  },
  {
    name: "FRAX",
    plain: "bone fracture risk score",
    title: "Major bone fracture, 10-year risk",
    body: "The University of Sheffield tool endorsed by the World Health Organization. It estimates the 10-year probability of a major osteoporotic fracture from age, weight, height, fracture history, parental hip fracture, smoking, steroid use, alcohol and, where available, bone density. It is the most widely used fracture risk model in the world.",
    inputs: ["Age", "Sex", "Height", "Weight", "Fracture history", "Smoking", "Alcohol"],
    citation: "Kanis JA, et al. FRAX and the assessment of fracture probability. Osteoporos Int 2008;19(4):385-97.",
  },
];

function Method() {
  return (
    <section
      id="method"
      style={{
        background: C.page,
        padding: "140px 48px",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 80 }}>
          <Reveal>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.forestSoft,
                marginBottom: 22,
              }}
            >
              The method / three validated risk models
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              style={{
                fontFamily: SYSTEM_FONT,
                fontSize: "clamp(36px, 4vw, 60px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                color: C.ink,
                margin: 0,
                marginBottom: 28,
              }}
            >
              The same tools used in{" "}
              <span style={{ fontStyle: "italic", color: C.forest }}>Swedish primary care</span>.
              Run for you, continuously.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              style={{
                fontFamily: SYSTEM_FONT,
                fontSize: 17,
                lineHeight: 1.6,
                color: C.inkSoft,
                margin: 0,
              }}
            >
              We do not invent scoring systems. We use the published, peer-reviewed
              ones that cardiologists, endocrinologists and family doctors in Sweden
              already trust. Where a model needs a blood marker you do not have,
              we tell you, and we never guess.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {MODELS.map((model, i) => (
            <Reveal key={model.name} delay={i * 0.06}>
              <article
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr 260px",
                  gap: 56,
                  alignItems: "start",
                  padding: "48px 0",
                  borderTop: `1px solid ${C.line}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: C.inkMuted,
                      marginBottom: 10,
                    }}
                  >
                    MODEL 0{i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: SYSTEM_FONT,
                      fontSize: 30,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.05,
                    }}
                  >
                    {model.name}
                  </div>
                  <div
                    style={{
                      fontFamily: SYSTEM_FONT,
                      fontSize: 14,
                      color: C.forestSoft,
                      fontStyle: "italic",
                      marginTop: 6,
                    }}
                  >
                    {model.plain}
                  </div>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: SYSTEM_FONT,
                      fontSize: 22,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                      margin: 0,
                      marginBottom: 14,
                    }}
                  >
                    {model.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: SYSTEM_FONT,
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: C.inkSoft,
                      margin: 0,
                      marginBottom: 18,
                    }}
                  >
                    {model.body}
                  </p>
                  <div
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 11,
                      color: C.inkMuted,
                      lineHeight: 1.6,
                      paddingTop: 14,
                      borderTop: `1px dashed ${C.line}`,
                    }}
                  >
                    <span style={{ color: C.forestSoft }}>CITATION /</span>{" "}
                    {model.citation}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: C.inkMuted,
                      marginBottom: 14,
                    }}
                  >
                    Inputs Precura uses
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {model.inputs.map((input) => (
                      <div
                        key={input}
                        style={{
                          fontFamily: SYSTEM_FONT,
                          fontSize: 13,
                          color: C.ink,
                          paddingBottom: 8,
                          borderBottom: `1px solid ${C.line}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{input}</span>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 50,
                            background: C.sage,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// THE TEAM - Real-feeling photos with names and credentials
// =============================================================================

function Team() {
  const people = [
    {
      name: "Dr. Sara Lindqvist",
      credential: "MD / Family Medicine",
      location: "Stockholm",
      image: IMAGES.doctor,
      body:
        "Sara has spent twelve years as a specialist in family medicine at a V\u00e5rdcentral in southern Stockholm. She saw the same story repeat in her own practice: normal blood tests, missed family history, a preventable diagnosis five years later. She started Precura to build the tool she wished she had.",
      role: "Co-founder, Chief Medical Officer",
    },
    {
      name: "Eoghan O'Reilly",
      credential: "Engineer / Former Apple Health",
      location: "Stockholm",
      image: IMAGES.engineer,
      body:
        "Eoghan builds the platform, the data pipeline and the apps. His focus: make clinical-grade reasoning feel as calm and legible as a good diagnosis from a doctor who knows you. He works on every detail alongside Sara.",
      role: "Co-founder, Engineering",
    },
  ];

  return (
    <section
      id="team"
      style={{
        background: C.paper,
        padding: "140px 48px",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: 80 }}>
          <Reveal>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.forestSoft,
                marginBottom: 22,
              }}
            >
              Who built this
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              style={{
                fontFamily: SYSTEM_FONT,
                fontSize: "clamp(34px, 3.6vw, 52px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.04,
                color: C.ink,
                margin: 0,
              }}
            >
              A Swedish doctor and an engineer.{" "}
              <span style={{ fontStyle: "italic", color: C.forest }}>
                Two people. One opinion.
              </span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
          }}
        >
          {people.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 5",
                    borderRadius: 4,
                    overflow: "hidden",
                    marginBottom: 24,
                    boxShadow: "0 24px 48px -24px rgba(27,31,23,0.3)",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={`${p.name}, ${p.credential}`}
                    fill
                    sizes="40vw"
                    style={{ objectFit: "cover", objectPosition: "center 25%" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.inkMuted,
                    marginBottom: 10,
                  }}
                >
                  {p.role}
                </div>
                <h3
                  style={{
                    fontFamily: SYSTEM_FONT,
                    fontSize: 28,
                    fontWeight: 500,
                    color: C.ink,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    marginBottom: 6,
                  }}
                >
                  {p.name}
                </h3>
                <div
                  style={{
                    fontFamily: SYSTEM_FONT,
                    fontSize: 15,
                    color: C.forestSoft,
                    marginBottom: 18,
                  }}
                >
                  {p.credential} / {p.location}
                </div>
                <p
                  style={{
                    fontFamily: SYSTEM_FONT,
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: C.inkSoft,
                    margin: 0,
                    maxWidth: 500,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// QUOTES - Two editorial quote cards (clinician + patient)
// =============================================================================

function Quotes() {
  return (
    <section
      style={{
        background: C.page,
        padding: "140px 48px",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
          }}
        >
          {/* Clinician quote */}
          <Reveal>
            <figure
              style={{
                margin: 0,
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "48px 48px 40px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.inkMuted,
                  marginBottom: 28,
                }}
              >
                From a clinician
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: SYSTEM_FONT,
                  fontSize: 22,
                  lineHeight: 1.45,
                  color: C.ink,
                  letterSpacing: "-0.015em",
                  fontWeight: 400,
                }}
              >
                &ldquo;The tools already exist. FINDRISC is in every family medicine
                textbook. What has been missing is a way to run them continuously,
                at the patient&rsquo;s side, against their real data. That is what
                Precura is doing.&rdquo;
              </blockquote>
              <figcaption
                style={{
                  marginTop: 36,
                  paddingTop: 24,
                  borderTop: `1px solid ${C.line}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 50,
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={IMAGES.clinician2}
                    alt="Dr. Anders Bergman"
                    fill
                    sizes="54px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ fontFamily: SYSTEM_FONT }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.ink }}>
                    Dr. Anders Bergman, MD
                  </div>
                  <div style={{ fontSize: 13, color: C.inkMuted }}>
                    Family medicine specialist, Uppsala
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {/* Patient quote */}
          <Reveal delay={0.08}>
            <figure
              style={{
                margin: 0,
                background: C.forest,
                borderRadius: 8,
                padding: "48px 48px 40px",
                position: "relative",
                color: "#F6F1E8",
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(246,241,232,0.65)",
                  marginBottom: 28,
                }}
              >
                From a Precura user
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: SYSTEM_FONT,
                  fontSize: 22,
                  lineHeight: 1.45,
                  color: "#F6F1E8",
                  letterSpacing: "-0.015em",
                  fontWeight: 400,
                }}
              >
                &ldquo;I had been getting the same blood test for five years and
                feeling fine. Precura showed me the slope and told me, in plain
                Swedish, that I was on track for a diabetes diagnosis by 45. I
                changed three things. The slope changed too.&rdquo;
              </blockquote>
              <figcaption
                style={{
                  marginTop: 36,
                  paddingTop: 24,
                  borderTop: `1px solid rgba(246,241,232,0.18)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 50,
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={IMAGES.patient}
                    alt="Anna B"
                    fill
                    sizes="54px"
                    style={{ objectFit: "cover", objectPosition: "center 25%" }}
                  />
                </div>
                <div style={{ fontFamily: SYSTEM_FONT }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#F6F1E8" }}>
                    Anna B, 40
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(246,241,232,0.65)" }}>
                    Stockholm / Precura beta user
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// TRANSPARENCY - The science, visible
// =============================================================================

function Science() {
  const refs = [
    {
      model: "FINDRISC",
      plain: "diabetes risk score",
      authors: "Lindstrom J, Tuomilehto J.",
      title: "The Diabetes Risk Score: a practical tool to predict type 2 diabetes risk.",
      journal: "Diabetes Care",
      year: "2003",
      ref: "26(3):725-31",
    },
    {
      model: "SCORE2",
      plain: "heart risk score",
      authors: "SCORE2 working group and ESC Cardiovascular risk collaboration.",
      title: "SCORE2 risk prediction algorithms: new models to estimate 10-year risk of cardiovascular disease in Europe.",
      journal: "European Heart Journal",
      year: "2021",
      ref: "42(25):2439-54",
    },
    {
      model: "FRAX",
      plain: "fracture risk score",
      authors: "Kanis JA, Johnell O, Oden A, Johansson H, McCloskey E.",
      title: "FRAX and the assessment of fracture probability in men and women from the UK.",
      journal: "Osteoporosis International",
      year: "2008",
      ref: "19(4):385-97",
    },
    {
      model: "Context",
      plain: "why we built this",
      authors: "Beagley J, Guariguata L, Weil C, Motala AA.",
      title: "Global estimates of undiagnosed diabetes in adults.",
      journal: "Diabetes Research and Clinical Practice",
      year: "2014",
      ref: "103(2):150-60",
    },
  ];

  return (
    <section
      id="science"
      style={{
        background: C.paper,
        padding: "140px 48px",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <Reveal>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.forestSoft,
                  marginBottom: 22,
                }}
              >
                Transparency / the science
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: "clamp(32px, 3.4vw, 48px)",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.04,
                  color: C.ink,
                  margin: 0,
                  marginBottom: 28,
                }}
              >
                Every number we show you is{" "}
                <span style={{ fontStyle: "italic", color: C.forest }}>
                  traceable back to a paper
                </span>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: C.inkSoft,
                  margin: 0,
                  marginBottom: 28,
                  maxWidth: 420,
                }}
              >
                We cite our sources the way a researcher would. If a risk model was
                not validated in a population similar to yours, we tell you. If a
                result has known limits, we tell you. We want you to be able to
                hand this report to your own doctor.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "5 / 4",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginTop: 36,
                  maxWidth: 420,
                }}
              >
                <Image
                  src={IMAGES.lab}
                  alt="Laboratory technician, Swedish clinical lab"
                  fill
                  sizes="40vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.inkMuted,
                }}
              >
                Photo / accredited clinical lab, Uppsala
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: "8px 0",
                }}
              >
                {refs.map((r) => (
                  <div
                    key={r.model}
                    style={{
                      padding: "28px 36px",
                      borderBottom: `1px solid ${C.line}`,
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      gap: 32,
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: SYSTEM_FONT,
                          fontSize: 17,
                          fontWeight: 500,
                          color: C.ink,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {r.model}
                      </div>
                      <div
                        style={{
                          fontFamily: SYSTEM_FONT,
                          fontSize: 12,
                          color: C.forestSoft,
                          fontStyle: "italic",
                          marginTop: 2,
                        }}
                      >
                        {r.plain}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: SYSTEM_FONT,
                          fontSize: 14,
                          color: C.ink,
                          lineHeight: 1.55,
                          marginBottom: 8,
                        }}
                      >
                        {r.title}
                      </div>
                      <div
                        style={{
                          fontFamily: MONO_FONT,
                          fontSize: 11,
                          color: C.inkMuted,
                          lineHeight: 1.6,
                        }}
                      >
                        {r.authors} <span style={{ color: C.forestSoft }}>{r.journal}</span>{" "}
                        {r.year}; {r.ref}.
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    padding: "28px 36px 8px",
                    fontFamily: MONO_FONT,
                    fontSize: 11,
                    color: C.inkMuted,
                    letterSpacing: "0.06em",
                  }}
                >
                  Last reviewed / 12 April 2026 / by Dr. Sara Lindqvist, MD
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div
                style={{
                  marginTop: 28,
                  padding: "24px 32px",
                  border: `1px dashed ${C.sage}`,
                  borderRadius: 8,
                  fontFamily: SYSTEM_FONT,
                  fontSize: 14,
                  color: C.inkSoft,
                  lineHeight: 1.6,
                  background: "rgba(167,184,154,0.08)",
                }}
              >
                Precura is a decision-support tool. It is not a diagnosis. A risk
                estimate is a probability, not a prediction. Always discuss any
                significant result with a licensed physician - and if you do not
                have one, Precura will route you to a Swedish GP within the
                platform.
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SOFT CTA + FOOTER
// =============================================================================

function CTA() {
  return (
    <section
      style={{
        background: C.page,
        padding: "140px 48px 100px",
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 80,
            alignItems: "end",
          }}
        >
          <div>
            <Reveal>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.forestSoft,
                  marginBottom: 22,
                }}
              >
                Get started
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: "clamp(40px, 4.8vw, 72px)",
                  fontWeight: 400,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  color: C.ink,
                  margin: 0,
                  marginBottom: 36,
                  maxWidth: 720,
                }}
              >
                Get your first risk assessment.
                <br />
                <span style={{ fontStyle: "italic", color: C.forest }}>
                  Takes about six minutes.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p
                style={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: C.inkSoft,
                  margin: 0,
                  marginBottom: 40,
                  maxWidth: 540,
                }}
              >
                You answer a short questionnaire, upload your most recent blood test
                (or we order one), and we run FINDRISC, SCORE2 and FRAX against your
                data. You get a calm, plain-Swedish report, reviewed by a licensed
                doctor, within 48 hours.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Link
                  href="/onboarding"
                  style={{
                    fontFamily: SYSTEM_FONT,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#FFFFFF",
                    background: C.forest,
                    textDecoration: "none",
                    padding: "18px 32px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Start my assessment
                  <span style={{ fontSize: 18, lineHeight: 1 }}>/</span>
                </Link>
                <Link
                  href="/v2/membership"
                  style={{
                    fontFamily: SYSTEM_FONT,
                    fontSize: 15,
                    color: C.ink,
                    textDecoration: "none",
                    padding: "18px 14px",
                  }}
                >
                  See pricing
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "36px 36px 32px",
                fontFamily: SYSTEM_FONT,
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.inkMuted,
                  marginBottom: 18,
                }}
              >
                What you get
              </div>
              {[
                { label: "Three validated risk scores", sub: "FINDRISC, SCORE2, FRAX" },
                { label: "A plain-Swedish report", sub: "No jargon, full references" },
                { label: "Doctor review", sub: "Licensed GP, within 48 hours" },
                { label: "Blood test ordering", sub: "Accredited Swedish lab, at home" },
                { label: "10-year trajectory", sub: "Updated every time you test" },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  style={{
                    padding: "16px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 2 }}>
                      {item.sub}
                    </div>
                  </div>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 50,
                      background: C.sageSoft,
                      color: C.forest,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    /
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: C.page,
        padding: "60px 48px 80px",
        borderTop: `1px solid ${C.line}`,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ fontSize: 13, color: C.inkMuted }}>
          Precura AB / Stockholm / A Swedish predictive health company
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: C.inkSoft }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Privacy
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Clinical governance
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Contact
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            1177 integration
          </a>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default function Home5Page() {
  return (
    <main
      style={{
        background: C.page,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        minHeight: "100vh",
      }}
    >
      <Hero />
      <AnnaStory />
      <Method />
      <Team />
      <Quotes />
      <Science />
      <CTA />
      <Footer />
    </main>
  );
}
