"use client";

import { colors, fontStack } from "./tokens";

/**
 * FOOTER - logo, nav, legal.
 */
export default function Footer() {
  const year = "2026";

  return (
    <footer
      style={{
        background: colors.ink,
        color: colors.ivory,
        padding: "80px 40px 40px",
        fontFamily: fontStack.display,
        borderTop: `1px solid ${colors.inkMid}`,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "60px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: colors.ivory,
              marginBottom: "16px",
            }}
          >
            precura
            <span style={{ color: colors.amber }}>.</span>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: colors.inkFaint,
              lineHeight: 1.6,
              maxWidth: "360px",
              margin: 0,
            }}
          >
            Pre + cura. Prediction, and the cure that follows from it. Built in
            Stockholm by doctors, engineers and trainers who lost too many
            relatives too early.
          </p>
          <div
            style={{
              marginTop: "32px",
              fontFamily: fontStack.mono,
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: colors.inkMuted,
              textTransform: "uppercase",
            }}
          >
            Made in Stockholm / Sverige
          </div>
        </div>

        <FooterCol
          title="Product"
          links={[
            "Blood tests",
            "Risk models",
            "Training plans",
            "Doctor messaging",
            "For families",
          ]}
        />
        <FooterCol
          title="Company"
          links={["About", "Our doctors", "Clinical advisors", "Press", "Careers"]}
        />
        <FooterCol
          title="Legal"
          links={[
            "Terms of service",
            "Privacy (GDPR)",
            "Data processing",
            "Clinical governance",
            "Cookies",
          ]}
        />
      </div>

      <div
        style={{
          marginTop: "80px",
          paddingTop: "32px",
          borderTop: `1px solid ${colors.inkMid}`,
          maxWidth: "1440px",
          margin: "80px auto 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "11px",
            color: colors.inkMuted,
            letterSpacing: "0.06em",
          }}
        >
          © {year} Precura AB / 559444-0000 / Sveavagen 42, 113 34 Stockholm
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Instagram", "LinkedIn", "Substack"].map((n) => (
            <a
              key={n}
              href="#"
              style={{
                fontFamily: fontStack.mono,
                fontSize: "11px",
                color: colors.inkFaint,
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {n}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div
        style={{
          fontFamily: fontStack.mono,
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: colors.inkMuted,
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        {title}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
        {links.map((l, i) => (
          <li key={i}>
            <a
              href="#"
              style={{
                fontSize: "14px",
                color: colors.ivory,
                textDecoration: "none",
              }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
