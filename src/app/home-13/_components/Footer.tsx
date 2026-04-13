"use client";

/**
 * Footer - editorial four-column with a giant wordmark on the left.
 */

import { C, SYSTEM_FONT, TYPE } from "./tokens";

export default function Footer() {
  return (
    <footer
      style={{
        background: C.ink,
        color: C.cream,
        padding: "100px 36px 60px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
            marginBottom: 80,
          }}
          className="home13-footer-grid"
        >
          <div>
            <div
              style={{
                fontSize: "clamp(56px, 10vw, 150px)",
                lineHeight: 0.88,
                fontWeight: 500,
                letterSpacing: "-0.04em",
                color: C.cream,
                margin: 0,
              }}
            >
              Precura
            </div>
            <div
              style={{
                ...TYPE.mono,
                color: "rgba(245, 239, 226, 0.5)",
                marginTop: 28,
                maxWidth: 320,
                textTransform: "none" as const,
                letterSpacing: "0.02em",
              }}
            >
              Pre / cura  .  Predictive and preventative health for Sweden.
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              "How it works",
              "Biomarkers",
              "Doctors",
              "Coaching",
              "Pricing",
            ]}
          />
          <FooterCol
            title="Science"
            links={["FINDRISC", "SCORE2", "FRAX", "SDPP", "UKPDS", "DPP"]}
          />
          <FooterCol
            title="Company"
            links={["About", "Careers", "Press", "Contact", "Medical team"]}
          />
        </div>

        <div
          style={{
            paddingTop: 40,
            borderTop: "1px solid rgba(245, 239, 226, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div
            style={{
              ...TYPE.mono,
              color: "rgba(245, 239, 226, 0.45)",
            }}
          >
            Stockholm  /  Built in Sweden  /  2026
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 12,
              color: "rgba(245, 239, 226, 0.55)",
              letterSpacing: "0.02em",
            }}
          >
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Terms
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              GDPR
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Cookies
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div
        style={{
          ...TYPE.mono,
          color: C.amberSoft,
          marginBottom: 20,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 14,
              color: "rgba(245, 239, 226, 0.75)",
              textDecoration: "none",
              transition: "color 300ms",
            }}
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}
