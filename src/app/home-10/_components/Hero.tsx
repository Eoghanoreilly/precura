"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * HERO - Technique: Large typographic reveal with canvas grain field +
 * orbiting biomarker chips, all under a scroll-parallaxed headline.
 *
 * Each word of the headline rises individually on a staggered schedule
 * so the language unfolds like a statement. Behind it, a Canvas2D grain
 * field renders warm flecks that drift upward. Floating glass chips
 * show real biomarkers the platform tracks.
 */
export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const grainY = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const chipsY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Canvas grain field - warm flecks drifting upward like dust in light
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    const PARTICLE_COUNT = 140;
    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: string;
      life: number;
    };
    let particles: P[] = [];

    const palette = ["#E06B2D", "#E9AE7A", "#6B8F71", "#C79025", "#F5EFE4"];

    function seed() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.2 - Math.random() * 0.35,
        size: 0.8 + Math.random() * 2.4,
        hue: palette[Math.floor(Math.random() * palette.length)],
        life: Math.random(),
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
      seed();
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.004;
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.life = 0;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        const alpha = Math.sin(p.life * Math.PI) * 0.55;
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = p.hue;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Biomarker chips floating around the headline
  const chips = [
    { label: "HbA1c", value: "38 mmol/mol", x: "8%", y: "22%", delay: 1.4 },
    { label: "LDL", value: "2.9 mmol/L", x: "78%", y: "18%", delay: 1.6 },
    { label: "Glucose", value: "5.8", x: "4%", y: "68%", delay: 1.8 },
    { label: "SCORE2", value: "3%", x: "82%", y: "72%", delay: 2.0 },
    { label: "FINDRISC", value: "12/26", x: "88%", y: "44%", delay: 2.2 },
    { label: "Vit D", value: "48 nmol/L", x: "2%", y: "44%", delay: 2.4 },
  ];

  const headlineWords = ["Your", "health,", "decades", "ahead."];

  return (
    <section
      ref={wrapRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: C.cream,
        overflow: "hidden",
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Canvas grain field */}
      <motion.canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          y: grainY,
          pointerEvents: "none",
        }}
      />

      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(224,107,45,0.08) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating chips */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: chipsY,
          pointerEvents: "none",
        }}
      >
        {chips.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.1,
              delay: c.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 5 + i * 0.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 2,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${C.line}`,
                borderRadius: 14,
                boxShadow: C.shadow,
              }}
            >
              <span
                style={{
                  ...TYPE.mono,
                  color: C.inkMuted,
                }}
              >
                {c.label}
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: C.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                {c.value}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Headline stack */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "180px 32px 80px",
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            ...TYPE.eyebrow,
            color: C.amber,
            marginBottom: 24,
          }}
        >
          Precura / Preventive health, Sweden
        </motion.div>

        <h1
          style={{
            ...TYPE.displayMega,
            color: C.ink,
            margin: 0,
            maxWidth: 1100,
          }}
        >
          {headlineWords.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "baseline",
                marginRight: "0.25em",
              }}
            >
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.1,
                  delay: 0.7 + i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: "inline-block",
                  color: i === 2 ? C.amber : C.ink,
                  fontStyle: i === 2 ? "italic" : "normal",
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.3 }}
          style={{
            ...TYPE.lead,
            color: C.inkSoft,
            maxWidth: 620,
            marginTop: 40,
            marginBottom: 48,
          }}
        >
          One blood test. Three validated clinical risk models. A 10-year
          trajectory of your diabetes, heart and bone health, in plain English,
          reviewed by a Swedish doctor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.5 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <Link
            href="/onboarding"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 28px",
              background: C.ink,
              color: C.cream,
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              boxShadow: C.shadowLift,
            }}
          >
            Get your risk profile
            <span style={{ fontSize: 18, lineHeight: 1 }}>{">"}</span>
          </Link>
          <Link
            href="#how"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 28px",
              background: "transparent",
              color: C.ink,
              borderRadius: 100,
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              border: `1px solid ${C.ink}`,
            }}
          >
            How it works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
          style={{
            position: "absolute",
            left: 32,
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
            ...TYPE.mono,
            color: C.inkMuted,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 1,
              background: C.inkMuted,
            }}
          />
          SCROLL TO SEE THE SIGNAL
        </motion.div>
      </motion.div>
    </section>
  );
}
