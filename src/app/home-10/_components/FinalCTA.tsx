"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FINAL CTA - Technique: Oversized text reveal with clip-mask, a tiny
 * canvas particle system behind, and a magnetic hover CTA that follows
 * the cursor with spring physics. Closing statement of the page.
 */
export function FinalCTA() {
  const ref = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipInset = useTransform(scrollYProgress, [0.1, 0.55], ["100%", "0%"]);
  const clipPath = useTransform(clipInset, (v) => `inset(0 ${v} 0 0)`);

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
    };
    const PARTICLE_COUNT = 80;
    let particles: P[] = [];

    function seed() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.15 - Math.random() * 0.25,
        size: 0.5 + Math.random() * 1.8,
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
        p.life += 0.003;
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.life = 0;
        }
        const alpha = Math.sin(p.life * Math.PI) * 0.5;
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = "#E06B2D";
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

  // Magnetic button
  const handleMove = (e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    setBtnOffset({ x: dx, y: dy });
  };

  const handleLeave = () => setBtnOffset({ x: 0, y: 0 });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: C.ink,
        color: C.cream,
        padding: "180px 32px 180px",
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      <motion.canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(224,107,45,0.15) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...TYPE.mono,
            color: C.amber,
            padding: "6px 12px",
            border: `1px solid ${C.amber}`,
            borderRadius: 100,
            display: "inline-block",
            marginBottom: 40,
          }}
        >
          09 / NEXT STEP
        </div>

        {/* Massive text with clip mask reveal */}
        <motion.h2
          style={{
            ...TYPE.displayHuge,
            color: C.cream,
            margin: 0,
            marginBottom: 24,
            maxWidth: 1200,
            marginInline: "auto",
            clipPath,
          }}
        >
          Don't wait for a diagnosis.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            ...TYPE.lead,
            color: C.creamDeep,
            maxWidth: 640,
            margin: "0 auto 60px",
          }}
        >
          See your 10-year trajectory for diabetes, heart and bone health. One
          blood test. Three validated risk models. A Swedish doctor. Your data,
          your move.
        </motion.p>

        <div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            display: "inline-block",
            padding: 80,
            margin: -80,
          }}
        >
          <motion.div
            animate={btnOffset}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
              mass: 0.5,
            }}
            style={{ display: "inline-block" }}
          >
            <Link
              ref={btnRef}
              href="/onboarding"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "24px 44px",
                background: C.amber,
                color: C.ink,
                borderRadius: 100,
                textDecoration: "none",
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                boxShadow:
                  "0 10px 40px rgba(224,107,45,0.3), 0 2px 8px rgba(224,107,45,0.2)",
              }}
            >
              Get your risk profile
              <span
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                }}
              >
                {">"}
              </span>
            </Link>
          </motion.div>
        </div>

        <p
          style={{
            ...TYPE.small,
            color: C.inkFaint,
            marginTop: 40,
            maxWidth: 560,
            marginInline: "auto",
          }}
        >
          Precura is a preventive health service, not a substitute for
          emergency medical care. All results are reviewed by a Swedish
          licensed clinician. Data stays in Sweden.
        </p>
      </div>
    </section>
  );
}
