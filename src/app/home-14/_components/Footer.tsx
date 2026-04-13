"use client";

import React from "react";
import { C, SYSTEM_FONT, MONO_FONT, TYPE } from "./tokens";

/**
 * FOOTER - Magazine imprint page style.
 * Giant wordmark at the top, a 4-column imprint with editorial sections,
 * a fine-print row at the bottom.
 */
export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: C.paper,
        color: C.ink,
        fontFamily: SYSTEM_FONT,
        padding: "120px 48px 56px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Giant wordmark */}
        <div
          style={{
            fontSize: "clamp(120px, 22vw, 360px)",
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.82,
            color: C.ink,
            marginBottom: 60,
          }}
        >
          Precura
        </div>

        {/* Imprint row */}
        <div
          className="ft14-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 40,
            paddingTop: 40,
            borderTop: `2px solid ${C.ink}`,
          }}
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 16,
              }}
            >
              Imprint
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.65,
                color: C.inkSoft,
                maxWidth: 340,
              }}
            >
              The Quarterly is the house journal of Precura, a Swedish
              predictive health company founded in Stockholm. Issue 01
              published April 2026.
            </p>
          </div>
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 16,
              }}
            >
              Company
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                fontSize: 14,
                color: C.ink,
                lineHeight: 1.9,
              }}
            >
              <li>About</li>
              <li>Method</li>
              <li>Science</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 16,
              }}
            >
              Clinical
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                fontSize: 14,
                color: C.ink,
                lineHeight: 1.9,
              }}
            >
              <li>The doctor</li>
              <li>Risk models</li>
              <li>Biomarkers</li>
              <li>Coaching</li>
              <li>Partner clinics</li>
            </ul>
          </div>
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 16,
              }}
            >
              Legal
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                fontSize: 14,
                color: C.ink,
                lineHeight: 1.9,
              }}
            >
              <li>Privacy policy</li>
              <li>Terms of service</li>
              <li>GDPR</li>
              <li>Patientdatalagen</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>

        {/* Fine print band */}
        <div
          style={{
            marginTop: 60,
            paddingTop: 28,
            borderTop: `1px solid ${C.rule}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 11,
              color: C.inkMuted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            (c) 2026 Precura AB / Stockholm
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 11,
              color: C.inkFaint,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Set in SF Pro / Printed digitally
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 11,
              color: C.inkFaint,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Vol I / Issue 01 / 2026.04
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.ft14-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
