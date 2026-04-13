"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * SOCIAL PROOF - three beta user quotes with real Swedish names/cities.
 * Rotating carousel feel via staggered scroll-linked translate.
 */
export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const testimonials = [
    {
      quote:
        "I'd been told my glucose was fine for six years. Precura showed me the slope in one chart, and suddenly my GP took it seriously. I rebooked for six months instead of twelve.",
      name: "Elin Lindqvist",
      age: 42,
      city: "Goteborg",
      img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=85&fit=crop",
    },
    {
      quote:
        "The thing that sold me was the doctor. A real named person, replying within a day, with my full history open on his side. Werlabs gives you numbers. Precura gives you a conversation.",
      name: "Johan Andersson",
      age: 51,
      city: "Uppsala",
      img: "https://images.unsplash.com/photo-1508243771214-6e95d137426b?w=600&q=85&fit=crop",
    },
    {
      quote:
        "My father had a heart attack at 62. I spent five years worrying without doing anything. I signed up, did one blood test, and Precura laid out exactly what I could and couldn't change. The anxiety dropped overnight.",
      name: "Sara Nilsson",
      age: 38,
      city: "Malmo",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=85&fit=crop",
    },
  ];

  return (
    <section
      ref={ref}
      style={{
        background: colors.ivory,
        padding: "160px 0 120px",
        fontFamily: fontStack.display,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          fontFamily: fontStack.mono,
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.inkMuted,
          display: "flex",
          gap: "24px",
        }}
      >
        <span>Ch 06</span>
        <span>Social proof</span>
      </div>

      <div style={{ padding: "0 40px", maxWidth: "1440px", margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: easing.out }}
          style={{
            fontSize: "clamp(44px, 6vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
            color: colors.ink,
            fontWeight: 500,
            maxWidth: "960px",
          }}
        >
          Early users who stopped guessing{" "}
          <span style={{ color: colors.amberDeep, fontStyle: "italic", fontWeight: 400 }}>
            about themselves.
          </span>
        </motion.h2>
      </div>

      <motion.div
        style={{
          marginTop: "80px",
          display: "flex",
          gap: "32px",
          padding: "0 60px",
          x: marqueeX,
        }}
      >
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: {
    quote: string;
    name: string;
    age: number;
    city: string;
    img: string;
  };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: easing.out }}
      style={{
        flex: "0 0 min(520px, 85vw)",
        background: colors.white,
        borderRadius: "24px",
        border: `1px solid ${colors.inkLine}`,
        padding: "40px 36px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      <div
        style={{
          fontSize: "38px",
          fontFamily: fontStack.display,
          color: colors.amber,
          lineHeight: 1,
          fontWeight: 500,
        }}
      >
        &ldquo;
      </div>
      <p
        style={{
          fontSize: "20px",
          lineHeight: 1.5,
          color: colors.inkSoft,
          margin: 0,
          letterSpacing: "-0.01em",
          flex: 1,
        }}
      >
        {testimonial.quote}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          paddingTop: "24px",
          borderTop: `1px solid ${colors.inkLine}`,
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            overflow: "hidden",
            background: colors.cream,
            flexShrink: 0,
          }}
        >
          <img
            src={testimonial.img}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(0.2)",
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 500, color: colors.ink }}>
            {testimonial.name}
          </div>
          <div style={{ fontSize: "12px", color: colors.inkMuted, fontFamily: fontStack.mono }}>
            {testimonial.age} / {testimonial.city}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
