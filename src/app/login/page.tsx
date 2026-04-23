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
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        aria-label="Sign in as Client (Eoghan)"
      >
        <div className="vlogin-col">
          <div className="vlogin-avatar vlogin-avatar--client" aria-hidden="true">
            EO
          </div>
          <div className="vlogin-kicker">The member&rsquo;s view</div>
          <div className="vlogin-headline">Client</div>
          <div className="vlogin-bio">
            Real panels, real charts, real notes. What the member sees.
          </div>
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
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.08 }}
        aria-label="Sign in as Doctor (Tomas)"
      >
        <div className="vlogin-col">
          <div className="vlogin-avatar vlogin-avatar--doctor" aria-hidden="true">
            TK
          </div>
          <div className="vlogin-kicker">The doctor&rsquo;s view</div>
          <div className="vlogin-headline">Doctor</div>
          <div className="vlogin-bio">
            Patient list, case log, composer. What Tomas sees.
          </div>
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
          padding: clamp(20px, 4vw, 48px)
            clamp(16px, 3vw, 32px) clamp(80px, 10vw, 120px);
          border: 0;
          cursor: pointer;
          font-family: var(--font-sans);
          text-align: center;
          transition: opacity 0.4s ease, background-color 0.25s ease;
          position: relative;
          min-height: 100dvh;
          width: 100%;
          min-width: 0;
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
        }

        .vlogin-half--client {
          background: var(--canvas);
        }
        .vlogin-half--doctor {
          background: var(--sage-tint);
        }

        .vlogin-half--client:hover:not(:disabled) {
          background: var(--canvas-soft);
        }
        .vlogin-half--doctor:hover:not(:disabled) {
          background: #E3ECE4;
        }

        .vlogin-half[data-dimmed="true"] {
          opacity: 0.45;
        }

        .vlogin-half:disabled {
          cursor: default;
        }

        .vlogin-half:focus-visible {
          outline: none;
        }
        .vlogin-half:focus-visible .vlogin-col {
          box-shadow: 0 0 0 2px var(--sage-deep);
          border-radius: 32px;
        }

        .vlogin-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-3);
          width: 100%;
          max-width: min(400px, 100%);
          min-width: 0;
        }

        .vlogin-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 600;
          font-size: 26px;
          color: #FFFFFF;
          letter-spacing: 0.02em;
          margin-bottom: var(--sp-3);
          box-shadow: 0 8px 20px rgba(28, 26, 23, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }
        .vlogin-avatar--client {
          background: linear-gradient(
            135deg,
            var(--terracotta-soft) 0%,
            var(--terracotta-deep) 100%
          );
        }
        .vlogin-avatar--doctor {
          background: linear-gradient(
            135deg,
            var(--sage-soft) 0%,
            var(--sage-deep) 100%
          );
        }

        .vlogin-kicker {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--ink-soft);
          letter-spacing: 0.01em;
        }

        .vlogin-headline {
          font-size: clamp(1.75rem, 1.2rem + 2.2vw, 3rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: var(--ink);
          margin: 0;
          word-break: break-word;
        }

        .vlogin-bio {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(0.95rem, 0.85rem + 0.4vw, 1.0625rem);
          line-height: var(--line-height-body);
          color: var(--ink-soft);
          margin: var(--sp-2) 0 0;
          max-width: 34ch;
          width: 100%;
        }

        .vlogin-cta {
          margin-top: var(--sp-5);
          padding: 13px 26px;
          border-radius: 999px;
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          font-weight: 600;
          letter-spacing: -0.005em;
          color: #FFFFFF;
          background: var(--sage-deep);
          box-shadow: 0 10px 22px -10px rgba(68, 90, 74, 0.55),
            0 2px 6px rgba(68, 90, 74, 0.22);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .vlogin-half:hover:not(:disabled) .vlogin-cta {
          background: #3A4D3F;
          transform: translateY(-1px);
        }

        .vlogin-email {
          margin-top: var(--sp-3);
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
          max-width: 32ch;
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
            min-height: 50dvh;
            padding: clamp(32px, 6vw, 48px) clamp(16px, 4vw, 32px);
            width: 100%;
          }
          .vlogin-headline {
            font-size: clamp(1.75rem, 1.4rem + 2vw, 2.5rem);
          }
          .vlogin-foot {
            position: static;
            padding: var(--sp-4);
            font-size: 10px;
            gap: var(--sp-2);
          }
        }
        @media (max-width: 480px) {
          .vlogin-avatar {
            width: 60px;
            height: 60px;
            font-size: 22px;
          }
          .vlogin-bio {
            max-width: 28ch;
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
