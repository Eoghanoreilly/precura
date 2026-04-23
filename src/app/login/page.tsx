"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type Persona = "client" | "doctor";

type UiState =
  | { tag: "idle" }
  | { tag: "loading"; persona: Persona }
  | { tag: "error"; persona: Persona; message: string };

export default function LoginPage() {
  const [state, setState] = useState<UiState>({ tag: "idle" });

  async function signIn(persona: Persona) {
    setState({ tag: "loading", persona });
    const body =
      persona === "client"
        ? {
            email: "eoghan@vestego.com",
            role: "patient",
            redirect: "/member",
          }
        : {
            email: "tomas@precura.se",
            role: "doctor",
            redirect: "/doctor",
          };
    try {
      const res = await fetch("/api/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setState({
        tag: "error",
        persona,
        message: data.error || "Sign in failed.",
      });
    } catch {
      setState({
        tag: "error",
        persona,
        message: "Sign in failed.",
      });
    }
  }

  const busy = state.tag === "loading";
  const dimOther = (p: Persona) =>
    state.tag === "loading" && state.persona !== p;
  const isLoading = (p: Persona) =>
    state.tag === "loading" && state.persona === p;
  const errorFor = (p: Persona) =>
    state.tag === "error" && state.persona === p ? state.message : null;

  return (
    <div className="vlogin-root">
      <motion.button
        type="button"
        disabled={busy}
        onClick={() => signIn("client")}
        className="vlogin-half vlogin-half--client"
        data-dimmed={dimOther("client") ? "true" : "false"}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        aria-label="Sign in as Client (Eoghan)"
      >
        <div className="vlogin-numeral" aria-hidden="true">01</div>

        <div className="vlogin-inner">
          <div className="vlogin-kicker">
            <span className="vlogin-dot vlogin-dot--client" aria-hidden="true" />
            For members
          </div>
          <div className="vlogin-headline vlogin-headline--client">Client</div>
          <div className="vlogin-name">Eoghan O&rsquo;Reilly</div>
          <p className="vlogin-bio">
            Your panels, your trends, your doctor&rsquo;s notes. The warm side
            of Precura.
          </p>

          <div className="vlogin-cta-row">
            <div className="vlogin-cta">
              {isLoading("client") ? "Signing in..." : "Sign in as Eoghan"}
            </div>
            <div className="vlogin-email">eoghan@vestego.com</div>
          </div>

          {errorFor("client") && (
            <div className="vlogin-err" role="alert">
              {errorFor("client")}
            </div>
          )}
        </div>
      </motion.button>

      <motion.button
        type="button"
        disabled={busy}
        onClick={() => signIn("doctor")}
        className="vlogin-half vlogin-half--doctor"
        data-dimmed={dimOther("doctor") ? "true" : "false"}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.08 }}
        aria-label="Sign in as Doctor (Tomas)"
      >
        <div className="vlogin-numeral" aria-hidden="true">02</div>

        <div className="vlogin-inner">
          <div className="vlogin-kicker">
            <span className="vlogin-dot vlogin-dot--doctor" aria-hidden="true" />
            For clinicians
          </div>
          <div className="vlogin-headline vlogin-headline--doctor">Doctor</div>
          <div className="vlogin-name">Dr. Tomas Kurakovas</div>
          <p className="vlogin-bio">
            Dual-pane review, patient-by-patient. The clinical side of Precura.
          </p>

          <div className="vlogin-cta-row">
            <div className="vlogin-cta">
              {isLoading("doctor") ? "Signing in..." : "Sign in as Tomas"}
            </div>
            <div className="vlogin-email">tomas@precura.se</div>
          </div>

          {errorFor("doctor") && (
            <div className="vlogin-err" role="alert">
              {errorFor("doctor")}
            </div>
          )}
        </div>
      </motion.button>

      <div className="vlogin-foot" aria-hidden="false">
        <span className="vlogin-foot-mark">Precura</span>
        <span className="vlogin-foot-sep">/</span>
        <span>Dev console</span>
        <span className="vlogin-foot-sep">/</span>
        <span>
          Real users:{" "}
          <a href="/member/login">/member/login</a>{" "}
          or <a href="/doctor/login">/doctor/login</a>
        </span>
      </div>

      <style jsx>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .vlogin-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100dvh;
          font-family: var(--font-sans);
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 100vw;
        }

        .vlogin-half {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          padding: clamp(40px, 6vh, 96px) clamp(32px, 6vw, 96px)
            clamp(96px, 14vh, 168px);
          border: 0;
          cursor: pointer;
          font-family: var(--font-sans);
          text-align: left;
          transition: opacity 0.4s ease, background 0.3s ease;
          position: relative;
          min-height: 100dvh;
          width: 100%;
          min-width: 0;
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
        }

        .vlogin-half--client {
          background: radial-gradient(
              1200px 600px at 30% 110%,
              rgba(239, 181, 155, 0.18),
              transparent 70%
            ),
            linear-gradient(180deg, var(--canvas-soft) 0%, var(--canvas) 100%);
        }
        .vlogin-half--doctor {
          background: radial-gradient(
              1200px 600px at 70% 110%,
              rgba(68, 90, 74, 0.14),
              transparent 70%
            ),
            linear-gradient(180deg, #EEF3EE 0%, var(--sage-tint) 100%);
        }

        .vlogin-half--client:hover:not(:disabled) {
          background: radial-gradient(
              1200px 600px at 30% 110%,
              rgba(239, 181, 155, 0.26),
              transparent 70%
            ),
            linear-gradient(180deg, var(--paper) 0%, var(--canvas-soft) 100%);
        }
        .vlogin-half--doctor:hover:not(:disabled) {
          background: radial-gradient(
              1200px 600px at 70% 110%,
              rgba(68, 90, 74, 0.2),
              transparent 70%
            ),
            linear-gradient(180deg, #E5EDE6 0%, #D9E3DA 100%);
        }

        .vlogin-half[data-dimmed="true"] {
          opacity: 0.42;
        }

        .vlogin-half:disabled {
          cursor: default;
        }

        .vlogin-half:focus-visible {
          outline: 2px solid var(--sage-deep);
          outline-offset: -4px;
        }

        .vlogin-numeral {
          position: absolute;
          top: clamp(24px, 4vh, 48px);
          left: clamp(32px, 6vw, 96px);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--ink-faint);
          letter-spacing: 0.14em;
          font-weight: 400;
        }
        .vlogin-half--doctor .vlogin-numeral {
          left: auto;
          right: clamp(32px, 6vw, 96px);
        }

        .vlogin-inner {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 640px;
          width: 100%;
          min-width: 0;
        }
        .vlogin-half--doctor .vlogin-inner {
          align-items: flex-end;
          text-align: right;
          margin-left: auto;
        }

        .vlogin-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--ink-soft);
          letter-spacing: 0.01em;
          margin-bottom: var(--sp-4);
        }
        .vlogin-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .vlogin-dot--client {
          background: var(--terracotta-deep);
        }
        .vlogin-dot--doctor {
          background: var(--sage-deep);
        }

        .vlogin-headline {
          font-size: clamp(3.5rem, 2.5rem + 5.5vw, 7.5rem);
          font-weight: 600;
          line-height: 0.92;
          letter-spacing: -0.045em;
          color: var(--ink);
          margin: 0 0 var(--sp-4);
          word-break: break-word;
        }

        .vlogin-name {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(1rem, 0.9rem + 0.4vw, 1.25rem);
          font-weight: 400;
          color: var(--ink-soft);
          letter-spacing: -0.005em;
          margin-bottom: var(--sp-5);
        }

        .vlogin-bio {
          font-family: var(--font-sans);
          font-size: clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem);
          line-height: 1.5;
          color: var(--ink-soft);
          margin: 0 0 var(--sp-8);
          max-width: 38ch;
        }
        .vlogin-half--doctor .vlogin-bio {
          margin-left: auto;
        }

        .vlogin-cta-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--sp-3);
        }
        .vlogin-half--doctor .vlogin-cta-row {
          align-items: flex-end;
        }

        .vlogin-cta {
          display: inline-flex;
          align-items: center;
          padding: 16px 34px;
          border-radius: 999px;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.005em;
          color: #FFFFFF;
          background: var(--sage-deep);
          box-shadow: 0 14px 28px -14px rgba(68, 90, 74, 0.55),
            0 2px 6px rgba(68, 90, 74, 0.2);
          transition: background 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease;
          white-space: nowrap;
        }
        .vlogin-half:hover:not(:disabled) .vlogin-cta {
          background: #3A4D3F;
          transform: translateY(-1px);
          box-shadow: 0 18px 34px -14px rgba(68, 90, 74, 0.6),
            0 3px 8px rgba(68, 90, 74, 0.22);
        }

        .vlogin-email {
          font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco,
            monospace;
          font-size: var(--text-micro);
          color: var(--ink-faint);
          letter-spacing: 0.02em;
        }

        .vlogin-err {
          margin-top: var(--sp-3);
          padding: var(--sp-2) var(--sp-4);
          background: var(--terracotta-tint);
          border: 1px solid var(--terracotta-soft);
          border-radius: var(--radius);
          font-family: var(--font-sans);
          font-size: var(--text-micro);
          color: var(--terracotta-deep);
          max-width: 34ch;
        }

        .vlogin-foot {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--sp-4) var(--sp-5);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-micro);
          color: var(--ink-faint);
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--sp-3);
          flex-wrap: wrap;
          pointer-events: auto;
          background: transparent;
          z-index: 2;
        }
        .vlogin-foot-mark {
          font-family: var(--font-sans);
          font-style: normal;
          font-weight: 600;
          color: var(--ink-soft);
          letter-spacing: -0.005em;
        }
        .vlogin-foot-sep {
          color: var(--line-card);
        }
        .vlogin-foot a {
          color: var(--ink-soft);
          text-decoration: underline;
          text-decoration-color: var(--line-card);
          text-underline-offset: 3px;
        }
        .vlogin-foot a:hover {
          text-decoration-color: var(--sage-deep);
        }

        @media (max-width: 860px) {
          .vlogin-root {
            display: flex;
            flex-direction: column;
            min-height: 100dvh;
          }
          .vlogin-half {
            min-height: 60dvh;
            padding: clamp(64px, 10vh, 88px) clamp(24px, 6vw, 40px)
              clamp(40px, 6vh, 72px);
            align-items: flex-start;
            justify-content: flex-end;
            width: 100%;
          }
          .vlogin-half--doctor .vlogin-inner {
            align-items: flex-start;
            text-align: left;
            margin-left: 0;
          }
          .vlogin-half--doctor .vlogin-bio {
            margin-left: 0;
          }
          .vlogin-half--doctor .vlogin-cta-row {
            align-items: flex-start;
          }
          .vlogin-half--doctor .vlogin-numeral {
            left: clamp(24px, 6vw, 40px);
            right: auto;
          }
          .vlogin-headline {
            font-size: clamp(3rem, 2rem + 6vw, 5rem);
          }
          .vlogin-foot {
            position: static;
            padding: var(--sp-5) var(--sp-4);
            font-size: 10px;
            gap: var(--sp-2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vlogin-cta,
          .vlogin-half {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
