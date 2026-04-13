"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * WHAT YOU GET - horizontal-pinned 6 panel feature tour.
 * Each panel has a rich visual mockup of a Precura capability.
 */
export default function WhatYouGet() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const panels = 6;
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

  if (!isDesktop) {
    return (
      <section
        style={{
          background: colors.ink,
          color: colors.ivory,
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
            color: colors.inkFaint,
            marginBottom: "24px",
          }}
        >
          Ch 04 / What you get
        </div>
        <h2
          style={{
            fontSize: "40px",
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Six things that
          <br />
          <span style={{ color: colors.amber, fontStyle: "italic", fontWeight: 400 }}>
            arrive on day one.
          </span>
        </h2>
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "24px",
                background: colors.inkSoft,
                borderRadius: "18px",
                border: `1px solid ${colors.inkMid}`,
              }}
            >
              <div
                style={{
                  fontFamily: fontStack.mono,
                  fontSize: "10px",
                  color: colors.amber,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: "8px",
                }}
              >
                {f.num}
              </div>
              <h3 style={{ fontSize: "22px", margin: 0, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "14px", color: colors.inkFaint, marginTop: "10px", lineHeight: 1.6 }}>
                {f.body}
              </p>
            </div>
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
        background: colors.ink,
        fontFamily: fontStack.display,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: colors.ink,
          color: colors.ivory,
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
            color: colors.inkFaint,
            display: "flex",
            gap: "24px",
          }}
        >
          <span>Ch 04</span>
          <span>What you get</span>
          <span>6 panels</span>
        </div>

        {/* Panel counter, top right */}
        <PanelCounter progress={scrollYProgress} total={panels} />

        {/* Container */}
        <motion.div
          style={{
            x,
            display: "flex",
            height: "100%",
            width: `${panels * 100}%`,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                width: `${100 / panels}%`,
                flexShrink: 0,
                height: "100%",
                padding: "110px 60px 60px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FeaturePanel feature={f} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PanelCounter({
  progress,
  total,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  const numRaw = useTransform(progress, (v) => Math.min(total, Math.floor(v * total) + 1));
  const [num, setNum] = useState(1);
  useEffect(() => {
    const unsub = numRaw.on("change", (v) => setNum(v));
    return () => unsub();
  }, [numRaw]);
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: "40px",
        zIndex: 10,
        fontFamily: fontStack.mono,
        fontSize: "11px",
        letterSpacing: "0.15em",
        color: colors.inkFaint,
        textTransform: "uppercase",
        display: "flex",
        alignItems: "baseline",
        gap: "14px",
      }}
    >
      <span style={{ fontSize: "48px", color: colors.amber, fontWeight: 400, letterSpacing: "-0.02em" }}>
        {String(num).padStart(2, "0")}
      </span>
      <span>/ {String(total).padStart(2, "0")}</span>
    </div>
  );
}

const features = [
  {
    num: "Feature 01",
    title: "A living risk profile.",
    body:
      "FINDRISC for type 2 diabetes. SCORE2 for cardiovascular events. FRAX for fracture risk. Your profile updates with every retest and shows a clear trajectory, not a single frozen score.",
    visual: "risk",
  },
  {
    num: "Feature 02",
    title: "Biomarker tracking over years.",
    body:
      "Every marker you have ever tested, in one view, sorted by trend. Fasting glucose up 0.8 since 2021. LDL stable. Vitamin D dipping every winter. No more hunting through 1177 PDFs.",
    visual: "markers",
  },
  {
    num: "Feature 03",
    title: "AI chat, with your own context loaded.",
    body:
      "Ask questions about your own data at 11pm. The chat knows your full 1177 history, your current medications, your doctor's notes and your training plan. Everything stays inside Precura, GDPR compliant.",
    visual: "ai",
  },
  {
    num: "Feature 04",
    title: "Messaging with a named doctor.",
    body:
      "No triage queue, no multi-tap menus. Write to Dr. Marcus Johansson and get a reply within 24 hours, with your entire record already open on his side. Included in annual membership.",
    visual: "doctor",
  },
  {
    num: "Feature 05",
    title: "A training plan built around your labs.",
    body:
      "Your certified coach builds a 12-week program that targets your specific risk drivers. Insulin sensitivity, blood pressure, bone density. Sets, reps, weights, progress tracked against your next blood test.",
    visual: "training",
  },
  {
    num: "Feature 06",
    title: "An annual retest. Automatic.",
    body:
      "You don't have to remember. We book your 6-month and 12-month retests, send the reminder, hold the clinic slot, and hand the new results straight to your doctor the moment they land.",
    visual: "retest",
  },
];

function FeaturePanel({
  feature,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: colors.amber,
            marginBottom: "24px",
          }}
        >
          {feature.num}
        </div>
        <h3
          style={{
            fontSize: "clamp(40px, 5vw, 82px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            margin: 0,
            fontWeight: 500,
            color: colors.ivory,
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            marginTop: "28px",
            fontSize: "17px",
            lineHeight: 1.65,
            color: colors.inkFaint,
            maxWidth: "520px",
          }}
        >
          {feature.body}
        </p>
      </div>
      <div style={{ height: "min(560px, 65vh)" }}>
        {feature.visual === "risk" && <RiskCard />}
        {feature.visual === "markers" && <MarkersCard />}
        {feature.visual === "ai" && <AICard />}
        {feature.visual === "doctor" && <DoctorMessagesCard />}
        {feature.visual === "training" && <TrainingCard />}
        {feature.visual === "retest" && <RetestCard />}
      </div>
    </div>
  );
}

const cardBase = {
  background: colors.inkSoft,
  border: `1px solid ${colors.inkMid}`,
  borderRadius: "22px",
  padding: "32px",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  gap: "18px",
};

const cardLabel = {
  fontFamily: fontStack.mono,
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: colors.inkFaint,
};

function RiskCard() {
  const risks = [
    { name: "Type 2 diabetes", pct: 17, color: colors.zoneBorderline, trend: "up" },
    { name: "Cardiovascular", pct: 3, color: colors.forestSoft, trend: "flat" },
    { name: "Bone / fracture", pct: 2, color: colors.forestSoft, trend: "flat" },
  ];
  return (
    <div style={cardBase}>
      <div style={cardLabel}>Risk profile / 10-year outlook</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px", flex: 1 }}>
        {risks.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: easing.out }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "15px", color: colors.ivory, fontWeight: 500 }}>{r.name}</div>
              <div
                style={{
                  fontSize: "32px",
                  color: colors.ivory,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                }}
              >
                {r.pct}
                <span style={{ fontSize: "14px", color: colors.inkFaint, marginLeft: "2px" }}>
                  %
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: "10px",
                height: "8px",
                background: colors.inkMid,
                borderRadius: "100px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${r.pct * 3}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: easing.out }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.forestSoft}, ${r.color})`,
                  borderRadius: "100px",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MarkersCard() {
  const markers = [
    { name: "Fasting glucose", values: [5.0, 5.1, 5.2, 5.4, 5.5, 5.8], up: true },
    { name: "LDL cholesterol", values: [2.6, 2.7, 2.7, 2.8, 2.8, 2.9], up: true },
    { name: "HDL cholesterol", values: [1.5, 1.5, 1.6, 1.6, 1.6, 1.6], up: false },
    { name: "Vitamin D", values: [60, 52, 55, 50, 48, 48], up: false },
  ];
  return (
    <div style={cardBase}>
      <div style={cardLabel}>Biomarker trends / 5 years</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", flex: 1 }}>
        {markers.map((m, i) => {
          const min = Math.min(...m.values);
          const max = Math.max(...m.values);
          const range = max - min || 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easing.out }}
              style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 0.6fr", gap: "16px", alignItems: "center" }}
            >
              <div style={{ fontSize: "13px", color: colors.ivory, fontWeight: 500 }}>
                {m.name}
              </div>
              <svg viewBox="0 0 120 30" style={{ width: "100%" }}>
                <polyline
                  points={m.values
                    .map((v, idx) => {
                      const x = (idx / (m.values.length - 1)) * 120;
                      const y = 30 - ((v - min) / range) * 24 - 3;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke={m.up ? colors.rust : colors.forestSoft}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {m.values.map((v, idx) => {
                  const x = (idx / (m.values.length - 1)) * 120;
                  const y = 30 - ((v - min) / range) * 24 - 3;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={idx === m.values.length - 1 ? 2.5 : 1.4}
                      fill={m.up ? colors.rust : colors.forestSoft}
                    />
                  );
                })}
              </svg>
              <div
                style={{
                  fontSize: "14px",
                  color: m.up ? colors.rust : colors.forestSoft,
                  textAlign: "right",
                  fontWeight: 500,
                  fontFamily: fontStack.mono,
                }}
              >
                {m.values[m.values.length - 1]}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AICard() {
  const msgs = [
    { from: "user", text: "Is my glucose rising too fast?" },
    {
      from: "ai",
      text: "Your fasting glucose has gone from 5.0 in 2021 to 5.8 in 2026. The trend is steady, about 0.16 mmol/L per year. At this rate you'd cross the pre-diabetic line (6.1) around 2028. Your doctor has flagged this.",
    },
    { from: "user", text: "What should I do before my next test?" },
  ];
  return (
    <div style={cardBase}>
      <div style={cardLabel}>Precura chat / your data loaded</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.15, ease: easing.out }}
            style={{
              alignSelf: m.from === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "14px 18px",
              borderRadius: "16px",
              background: m.from === "user" ? colors.amber : colors.inkMid,
              color: m.from === "user" ? colors.ink : colors.ivory,
              fontSize: "13px",
              lineHeight: 1.55,
            }}
          >
            {m.text}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            alignSelf: "flex-start",
            padding: "14px 18px",
            borderRadius: "16px",
            background: colors.inkMid,
            display: "flex",
            gap: "6px",
          }}
        >
          {[0, 1, 2].map((d) => (
            <motion.div
              key={d}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, delay: d * 0.2, repeat: Infinity }}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: colors.ivory,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function DoctorMessagesCard() {
  const msgs = [
    {
      from: "doctor",
      name: "Dr. Johansson",
      time: "11:30",
      text:
        "Your fasting glucose at 5.8 is in the upper normal range, not diabetic but worth watching. Combined with your family history, I'd like us to keep close eye on this.",
    },
    {
      from: "patient",
      name: "Anna",
      time: "12:05",
      text:
        "That makes sense. My mum was diagnosed at 58 so I've always worried about it.",
    },
    {
      from: "doctor",
      name: "Dr. Johansson",
      time: "14:20",
      text:
        "Understandable. Three small things: daily walk, Vit D supplement, continue Enalapril. We'll retest in 6 months.",
    },
  ];
  return (
    <div style={cardBase}>
      <div style={cardLabel}>Messages / Dr. Marcus Johansson</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: easing.out }}
            style={{
              alignSelf: m.from === "patient" ? "flex-end" : "flex-start",
              maxWidth: "88%",
              padding: "12px 16px",
              borderRadius: "14px",
              background: m.from === "patient" ? colors.amber : colors.inkMid,
              color: m.from === "patient" ? colors.ink : colors.ivory,
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontSize: "10px", opacity: 0.6, marginBottom: "4px", fontFamily: fontStack.mono }}>
              {m.name} / {m.time}
            </div>
            {m.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrainingCard() {
  const sessions = [
    { day: "Mon", name: "Upper body", done: true, exercises: "Push-ups, rows, shoulder press, plank" },
    { day: "Wed", name: "Lower + core", done: true, exercises: "Squats, lunges, glute bridge, dead bugs" },
    { day: "Fri", name: "Full body + cardio", done: false, exercises: "Walk intervals, pull-aparts, step-ups" },
  ];
  return (
    <div style={cardBase}>
      <div style={cardLabel}>Metabolic Health Program / Week 10 of 12</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
        {sessions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              padding: "18px 20px",
              background: s.done ? colors.inkMid : "transparent",
              border: `1px solid ${colors.inkMid}`,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: s.done ? colors.forestSoft : colors.inkSoft,
                color: s.done ? colors.ink : colors.inkFaint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fontStack.mono,
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              {s.day}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 500, color: colors.ivory }}>{s.name}</div>
              <div style={{ fontSize: "11px", color: colors.inkFaint, marginTop: "2px" }}>
                {s.exercises}
              </div>
            </div>
            <div
              style={{
                fontSize: "10px",
                fontFamily: fontStack.mono,
                color: s.done ? colors.forestSoft : colors.inkFaint,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {s.done ? "Done" : "Upcoming"}
            </div>
          </motion.div>
        ))}
      </div>
      <div
        style={{
          paddingTop: "16px",
          borderTop: `1px solid ${colors.inkMid}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div style={cardLabel}>Adherence / 28 of 36</div>
        <div style={{ fontSize: "16px", color: colors.amber, fontFamily: fontStack.mono }}>78%</div>
      </div>
    </div>
  );
}

function RetestCard() {
  return (
    <div style={cardBase}>
      <div style={cardLabel}>Schedule / next 12 months</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px" }}>
        {[
          { date: "15 Sep 2026", label: "Retest scheduled", state: "upcoming", detail: "Cityakuten Vardcentral, Stockholm" },
          { date: "22 Sep 2026", label: "Doctor review", state: "upcoming", detail: "Dr. Johansson / 48h after blood draw" },
          { date: "15 Mar 2027", label: "Annual retest", state: "upcoming", detail: "Full 14 marker panel included" },
        ].map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: easing.out }}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "18px",
              alignItems: "center",
              padding: "16px 0",
              borderBottom: i < 2 ? `1px solid ${colors.inkMid}` : "none",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: `2px solid ${colors.amber}`,
                background: "transparent",
              }}
            />
            <div>
              <div style={{ fontSize: "15px", color: colors.ivory, fontWeight: 500 }}>{e.label}</div>
              <div style={{ fontSize: "11px", color: colors.inkFaint, marginTop: "2px" }}>{e.detail}</div>
            </div>
            <div
              style={{
                fontSize: "11px",
                fontFamily: fontStack.mono,
                color: colors.inkFaint,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {e.date}
            </div>
          </motion.div>
        ))}
      </div>
      <div
        style={{
          padding: "14px 18px",
          background: colors.amber,
          color: colors.ink,
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        All retests included in annual membership / 2995 SEK per year
      </div>
    </div>
  );
}
