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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-label="Sign in as Client (Eoghan)"
      >
        <div className="vlogin-inner">
          <div className="vlogin-kicker">
            <span className="vlogin-dot vlogin-dot--client" aria-hidden="true" />
            For members
          </div>
          <h1 className="vlogin-headline">Client</h1>
          <div className="vlogin-name">Eoghan O&rsquo;Reilly</div>
          <p className="vlogin-bio">
            Your panels, your trends, your doctor&rsquo;s notes.
          </p>
          <div className="vlogin-cta">
            {isLoading("client") ? "Signing in..." : "Sign in as Eoghan"}
          </div>
          <div className="vlogin-email">eoghan@vestego.com</div>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        aria-label="Sign in as Doctor (Tomas)"
      >
        <div className="vlogin-inner">
          <div className="vlogin-kicker">
            <span className="vlogin-dot vlogin-dot--doctor" aria-hidden="true" />
            For clinicians
          </div>
          <h1 className="vlogin-headline">Doctor</h1>
          <div className="vlogin-name">Dr. Tomas Kurakovas</div>
          <p className="vlogin-bio">
            Dual-pane review, patient by patient.
          </p>
          <div className="vlogin-cta">
            {isLoading("doctor") ? "Signing in..." : "Sign in as Tomas"}
          </div>
          <div className="vlogin-email">tomas@precura.se</div>
          {errorFor("doctor") && (
            <div className="vlogin-err" role="alert">
              {errorFor("doctor")}
            </div>
          )}
        </div>
      </motion.button>

      <div className="vlogin-foot">
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
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          border: 0;
          cursor: pointer;
          font-family: var(--font-sans);
          text-align: center;
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
              80% 60% at 50% 30%,
              rgba(239, 181, 155, 0.14),
              transparent 70%
            ),
            var(--canvas);
        }
        .vlogin-half--doctor {
          background: radial-gradient(
              80% 60% at 50% 30%,
              rgba(68, 90, 74, 0.1),
              transparent 70%
            ),
            var(--sage-tint);
        }

        .vlogin-half--client:hover:not(:disabled) {
          background: radial-gradient(
              80% 60% at 50% 30%,
              rgba(239, 181, 155, 0.2),
              transparent 70%
            ),
            var(--canvas-soft);
        }
        .vlogin-half--doctor:hover:not(:disabled) {
          background: radial-gradient(
              80% 60% at 50% 30%,
              rgba(68, 90, 74, 0.16),
              transparent 70%
            ),
            #E3ECE4;
        }

        .vlogin-half[data-dimmed="true"] {
          opacity: 0.42;
        }

        .vlogin-half:disabled {
          cursor: default;
        }

        .vlogin-half:focus-visible {
          outline: 2px solid var(--sage-deep);
          outline-offset: -6px;
        }

        .vlogin-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 440px;
          min-width: 0;
        }

        .vlogin-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 14px;
          color: var(--ink-soft);
          margin-bottom: 20px;
        }
        .vlogin-dot {
          width: 7px;
          height: 7px;
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
          font-size: clamp(2.5rem, 2rem + 2.2vw, 4rem);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.035em;
          color: var(--ink);
          margin: 0 0 14px;
        }

        .vlogin-name {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 17px;
          color: var(--ink-soft);
          margin-bottom: 28px;
        }

        .vlogin-bio {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.55;
          color: var(--ink-soft);
          margin: 0 0 36px;
          max-width: 32ch;
        }

        .vlogin-cta {
          display: inline-flex;
          align-items: center;
          padding: 14px 30px;
          border-radius: 999px;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.005em;
          color: #FFFFFF;
          background: var(--sage-deep);
          box-shadow: 0 12px 24px -12px rgba(68, 90, 74, 0.55),
            0 2px 6px rgba(68, 90, 74, 0.2);
          transition: background 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease;
          white-space: nowrap;
          margin-bottom: 18px;
        }
        .vlogin-half:hover:not(:disabled) .vlogin-cta {
          background: #3A4D3F;
          transform: translateY(-1px);
        }

        .vlogin-email {
          font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco,
            monospace;
          font-size: 11px;
          color: var(--ink-faint);
          letter-spacing: 0.02em;
        }

        .vlogin-err {
          margin-top: 16px;
          padding: 10px 14px;
          background: var(--terracotta-tint);
          border: 1px solid var(--terracotta-soft);
          border-radius: 10px;
          font-family: var(--font-sans);
          font-size: 12px;
          color: var(--terracotta-deep);
          max-width: 32ch;
        }

        .vlogin-foot {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 11px;
          color: var(--ink-faint);
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
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
          }
          .vlogin-half {
            min-height: 50dvh;
            padding: 56px 24px;
          }
          .vlogin-headline {
            font-size: clamp(2rem, 1.7rem + 1.5vw, 2.75rem);
          }
          .vlogin-foot {
            position: static;
            padding: 16px;
            font-size: 10px;
            gap: 8px;
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
