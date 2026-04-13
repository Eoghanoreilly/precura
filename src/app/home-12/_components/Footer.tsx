"use client";

/**
 * FOOTER - logo, navigation columns, legal. Classical structure, tight
 * grid alignment, subdued type.
 */

import { C, FONT, MONO, TYPE, GRID } from "./tokens";

export function Footer() {
  return (
    <footer
      style={{
        background: C.paper,
        padding: `72px ${GRID.pagePaddingX}px 48px`,
        borderTop: `1px solid ${C.line}`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: GRID.columnGap,
        }}
      >
        {/* Logo + description */}
        <div
          style={{ gridColumn: "span 4" }}
          className="home12-foot-brand"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke={C.ink} strokeWidth="1.6" />
              <path
                d="M5 13.5 Q 8 9 11 11 T 17 8"
                stroke={C.accent}
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: "-0.01em",
              }}
            >
              Precura
            </span>
          </div>
          <p
            style={{
              ...TYPE.caption,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 280,
            }}
          >
            A predictive health membership built in Sweden. Reading the
            trajectory, not the snapshot.
          </p>
          <div
            style={{
              marginTop: 24,
              ...TYPE.eyebrow,
              color: C.inkMuted,
            }}
          >
            Stockholm / Sweden / EST 2026
          </div>
        </div>

        {/* Nav columns */}
        <FootCol
          title="Product"
          links={[
            "Blood panels",
            "Risk profile",
            "Dr. Marcus",
            "Personal coach",
            "AI chat",
          ]}
        />
        <FootCol
          title="Company"
          links={["About", "Medical team", "Research", "Careers", "Press"]}
        />
        <FootCol
          title="Science"
          links={[
            "FINDRISC",
            "SCORE2",
            "FRAX",
            "SDPP",
            "Citations",
          ]}
        />
        <FootCol
          title="Legal"
          links={[
            "Privacy",
            "Terms",
            "GDPR",
            "Data export",
            "Impressum",
          ]}
        />
      </div>

      {/* Bottom row */}
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "56px auto 0",
          paddingTop: 28,
          borderTop: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            ...TYPE.caption,
            color: C.inkMuted,
          }}
        >
          Precura AB / Org. 559xxx-xxxx / Sveavagen, Stockholm
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: C.inkMuted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          2026 / Reading the slope, not the snapshot
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home12-foot-brand) {
            grid-column: span 12 !important;
            margin-bottom: 32px;
          }
          :global(.home12-foot-col) {
            grid-column: span 6 !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div style={{ gridColumn: "span 2" }} className="home12-foot-col">
      <div
        style={{
          ...TYPE.eyebrow,
          color: C.inkMuted,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {links.map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontFamily: FONT,
              fontSize: 14,
              color: C.inkMid,
              textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.ink;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.inkMid;
            }}
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}
