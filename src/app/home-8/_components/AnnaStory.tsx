"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { colors, fontStack } from "./tokens";

type Panel = {
  year: string;
  age: number;
  glucose: number;
  status: string;
  statusColor: string;
  title: string;
  body: string;
  note: string;
  img: string;
};

/**
 * ANNA'S STORY - horizontal-pinned 5-panel story of Anna Bergstrom's
 * 5-year glucose trajectory. Vertical scroll pins the section and drives
 * horizontal translation. This is the emotional centerpiece of the page.
 */
export default function AnnaStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Horizontal translate from 0 to -80% (5 panels = 500vw wide container)
  const panels = 5;
  const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", `-${(panels - 1) * (100 / panels)}%`]);
  const x = useSpring(xRaw, { stiffness: 100, damping: 30, mass: 0.4 });

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 900px)");
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const storyPanels = [
    {
      year: "2021",
      age: 35,
      glucose: 5.0,
      status: "Normal",
      statusColor: colors.forestSoft,
      title: "A perfectly healthy annual check-up.",
      body: "Anna is 35. Her GP at Cityakuten orders the same yearly panel every Swedish adult gets. Fasting glucose 5.0. Below the 6.0 threshold. She's told everything looks fine. She leaves feeling reassured.",
      note: "Mother just diagnosed with T2D at 58. Nobody links the two.",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=85&fit=crop",
    },
    {
      year: "2022-2023",
      age: 36,
      glucose: 5.2,
      status: "Normal",
      statusColor: colors.forestSoft,
      title: "The number rises. Nobody notices.",
      body: "5.1 in 2022. 5.2 in 2023. Both comfortably below 6.0. The readings are individually fine, but each doctor visits is isolated. Nobody flags the trend. Anna is 36, feels healthy, trains twice a week.",
      note: "Blood pressure also begins to creep. Started on Enalapril 5mg for mild hypertension.",
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&q=85&fit=crop",
    },
    {
      year: "2024",
      age: 38,
      glucose: 5.4,
      status: "Normal",
      statusColor: colors.forestSoft,
      title: "Four points in four years. Still 'normal'.",
      body: "The fasting glucose reading is 5.4. Father has a heart attack at 65, survives with a stent. The cardiovascular thread is now on the chart too. Her GP documents the result. No alert. No retest. No questions.",
      note: "Total cholesterol nudges to 5.0. Still within reference range. Still unflagged.",
      img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=85&fit=crop",
    },
    {
      year: "2025",
      age: 39,
      glucose: 5.5,
      status: "Borderline",
      statusColor: colors.zoneBorderline,
      title: "The trajectory becomes obvious.",
      body: "A 0.5 rise from 2021. This is not random noise, it's a signal. In a standard annual review the single reading still reads 'normal'. But across five years the trajectory is a straight line towards pre-diabetes. The data is already there. Nobody is looking.",
      note: "Waist circumference has grown from 81cm to 85cm. Approaching the metabolic syndrome threshold.",
      img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=85&fit=crop",
    },
    {
      year: "2026",
      age: 40,
      glucose: 5.8,
      status: "Action needed",
      statusColor: colors.rust,
      title: "Precura reads five years at once.",
      body: "Anna signs up for Precura. Her 1177 history imports automatically. FINDRISC runs, scoring her at 12 / 26. Moderate risk. The rising trend is labelled, her family history is weighted, and she gets a 6-month follow-up plan and a training program tuned to insulin sensitivity. First time any system has connected the dots.",
      note: "10-year type 2 diabetes risk: ~17%. Without intervention, she'd almost certainly have been diagnosed by 48.",
      img: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=900&q=85&fit=crop",
    },
  ];

  // Mobile fallback - stack panels vertically
  if (!isDesktop) {
    return (
      <section
        style={{
          background: colors.parchment,
          padding: "80px 24px",
          fontFamily: fontStack.display,
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.inkMuted,
            marginBottom: "24px",
          }}
        >
          {"Ch 02 / Anna's story / 5 years"}
        </div>
        <h2
          style={{
            fontSize: "40px",
            lineHeight: 0.95,
            margin: 0,
            color: colors.ink,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Five years of data.
          <br />
          <span style={{ color: colors.amberDeep, fontStyle: "italic", fontWeight: 400 }}>
            Nobody read it together.
          </span>
        </h2>
        <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "40px" }}>
          {storyPanels.map((p, i) => (
            <StoryCard key={i} panel={p} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: `${panels * 100}vh`,
        background: colors.parchment,
        fontFamily: fontStack.display,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Chapter label */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            zIndex: 10,
            fontFamily: fontStack.mono,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.inkMid,
            display: "flex",
            gap: "24px",
          }}
        >
          <span>Ch 02</span>
          <span>{"Anna's story"}</span>
          <span>5 years, 5 panels</span>
        </div>

        {/* Progress dots */}
        <motion.div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            zIndex: 10,
            display: "flex",
            gap: "12px",
          }}
        >
          {storyPanels.map((_, i) => (
            <ProgressDot key={i} index={i} total={panels} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* Horizontal container */}
        <motion.div
          style={{
            x,
            display: "flex",
            height: "100%",
            width: `${panels * 100}%`,
          }}
        >
          {storyPanels.map((p, i) => (
            <div
              key={i}
              style={{
                width: `${100 / panels}%`,
                flexShrink: 0,
                height: "100%",
                padding: "100px 60px 60px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "60px",
                alignItems: "center",
              }}
            >
              <StoryPanel panel={p} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StoryPanel({ panel, index }: { panel: Panel; index: number }) {
  return (
    <>
      {/* Left - story text */}
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            padding: "8px 18px",
            background: colors.bone,
            borderRadius: "100px",
            marginBottom: "32px",
            border: `1px solid ${colors.inkLine}`,
          }}
        >
          <span
            style={{
              fontFamily: fontStack.mono,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.inkMid,
            }}
          >
            {String(index + 1).padStart(2, "0")} / {panel.year}
          </span>
          <span
            style={{
              fontFamily: fontStack.mono,
              fontSize: "11px",
              color: colors.inkMid,
            }}
          >
            Anna, age {panel.age}
          </span>
        </div>

        <h3
          style={{
            fontSize: "clamp(36px, 4.5vw, 68px)",
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            margin: 0,
            color: colors.ink,
            fontWeight: 500,
            maxWidth: "560px",
          }}
        >
          {panel.title}
        </h3>

        <p
          style={{
            marginTop: "32px",
            fontSize: "17px",
            lineHeight: 1.65,
            color: colors.inkSoft,
            maxWidth: "520px",
          }}
        >
          {panel.body}
        </p>

        <div
          style={{
            marginTop: "32px",
            padding: "20px 24px",
            borderRadius: "14px",
            background: colors.white,
            border: `1px solid ${colors.inkLine}`,
            fontSize: "13px",
            lineHeight: 1.55,
            color: colors.inkMid,
            maxWidth: "500px",
          }}
        >
          <span
            style={{
              fontFamily: fontStack.mono,
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.inkMuted,
              display: "block",
              marginBottom: "6px",
            }}
          >
            What else her chart showed
          </span>
          {panel.note}
        </div>
      </div>

      {/* Right - number card + image */}
      <div style={{ position: "relative", height: "70%", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "60%",
            borderRadius: "20px",
            overflow: "hidden",
            background: colors.cream,
          }}
        >
          <img
            src={panel.img}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(0.2) contrast(1.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, transparent 40%, ${colors.ink}88 100%)`,
            }}
          />
        </div>

        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.inkLine}`,
            borderRadius: "20px",
            padding: "28px 32px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            gap: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: fontStack.mono,
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.inkMuted,
                marginBottom: "6px",
              }}
            >
              Fasting glucose / mmol per L
            </div>
            <div
              style={{
                fontSize: "72px",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontWeight: 500,
                color: colors.ink,
              }}
            >
              {panel.glucose.toFixed(1)}
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "100px",
              background: panel.statusColor + "22",
              border: `1px solid ${panel.statusColor}`,
              fontSize: "11px",
              fontFamily: fontStack.mono,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: panel.statusColor === colors.forestSoft ? colors.forest : panel.statusColor === colors.zoneBorderline ? colors.inkSoft : colors.rust,
              whiteSpace: "nowrap",
            }}
          >
            {panel.status}
          </div>
        </div>
      </div>
    </>
  );
}

function StoryCard({ panel, index }: { panel: Panel; index: number }) {
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.inkLine}`,
        borderRadius: "20px",
        padding: "28px",
      }}
    >
      <div
        style={{
          fontFamily: fontStack.mono,
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.inkMuted,
          marginBottom: "12px",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {panel.year} / age {panel.age}
      </div>
      <h3
        style={{
          fontSize: "24px",
          lineHeight: 1.1,
          margin: 0,
          color: colors.ink,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {panel.title}
      </h3>
      <p style={{ fontSize: "15px", lineHeight: 1.6, color: colors.inkSoft, marginTop: "16px" }}>
        {panel.body}
      </p>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          borderTop: `1px solid ${colors.inkLine}`,
        }}
      >
        <div style={{ fontSize: "40px", fontWeight: 500, color: colors.ink, letterSpacing: "-0.02em" }}>
          {panel.glucose.toFixed(1)}
          <span style={{ fontSize: "12px", color: colors.inkMuted, marginLeft: "8px" }}>mmol/L</span>
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "100px",
            background: panel.statusColor + "22",
            border: `1px solid ${panel.statusColor}`,
            fontSize: "10px",
            fontFamily: fontStack.mono,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.ink,
          }}
        >
          {panel.status}
        </div>
      </div>
    </div>
  );
}

function ProgressDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const dotWidth = useTransform(progress, (v) => {
    const section = 1 / total;
    const start = index * section;
    const end = start + section;
    const active = v >= start && v <= end;
    return active ? "32px" : "8px";
  });

  const dotOpacity = useTransform(progress, (v) => {
    const section = 1 / total;
    const start = index * section;
    const end = start + section;
    return v >= start - 0.02 && v <= end + 0.02 ? 1 : 0.35;
  });

  return (
    <motion.div
      style={{
        width: dotWidth,
        height: "8px",
        borderRadius: "4px",
        background: colors.ink,
        opacity: dotOpacity,
      }}
    />
  );
}
