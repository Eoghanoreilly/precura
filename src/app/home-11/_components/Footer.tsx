"use client";

import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FOOTER - Spare. Logo top-left, four link columns, legal strip bottom.
 */
export function Footer() {
  return (
    <footer
      style={{
        background: C.inkPanel,
        color: "rgba(250,250,247,0.8)",
        padding: "96px 40px 48px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.ink}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="home11-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 80,
          }}
        >
          {/* Wordmark + note */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: C.page,
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                marginBottom: 20,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="8"
                  stroke={C.page}
                  strokeWidth="1.25"
                />
                <path
                  d="M4 10.5 Q 6 7 9 9 T 14 6"
                  stroke={C.page}
                  strokeWidth="1.25"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              Precura
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(250,250,247,0.55)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 320,
              }}
            >
              A predictive health membership for Swedish adults. Built in
              Stockholm by clinicians, researchers and engineers who got tired
              of watching data get filed and forgotten.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  ...TYPE.mono,
                  color: "rgba(250,250,247,0.45)",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: "rgba(250,250,247,0.78)",
                        textDecoration: "none",
                        fontSize: 14,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal strip */}
        <div
          style={{
            paddingTop: 32,
            borderTop: "1px solid rgba(250,250,247,0.16)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            ...TYPE.mono,
            color: "rgba(250,250,247,0.45)",
          }}
        >
          <div>Precura AB / Sveavagen 42 / 113 34 Stockholm / Org 559456-1234</div>
          <div>2026 / All rights reserved</div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home11-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

const cols = [
  {
    title: "Product",
    links: [
      "The profile",
      "How it works",
      "Pricing",
      "Science",
      "For clinicians",
    ],
  },
  {
    title: "Science",
    links: [
      "Risk models",
      "Biomarkers",
      "Published research",
      "Methodology",
      "Clinical advisors",
    ],
  },
  {
    title: "Company",
    links: ["About", "Medical team", "Careers", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "GDPR", "Accessibility", "Patient rights"],
  },
];
