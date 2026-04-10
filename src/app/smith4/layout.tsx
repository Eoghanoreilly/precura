"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const TABS = [
  {
    label: "Today",
    href: "/smith4",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FA6847" : "#A0674A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: "Program",
    href: "/smith4/program",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FA6847" : "#A0674A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    label: "Impact",
    href: "/smith4/impact",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FA6847" : "#A0674A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/smith4/profile",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FA6847" : "#A0674A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Smith4Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/smith4") return pathname === "/smith4";
    return pathname.startsWith(href);
  }

  return (
    <div style={{ background: "#FFF5F1", minHeight: "100dvh", display: "flex", flexDirection: "column", fontFamily: "-apple-system, system-ui, sans-serif" }}>
      {/* Page content */}
      <div style={{ flex: 1, paddingBottom: "88px" }}>
        {children}
      </div>

      {/* Bottom tab bar */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#FFFBF9",
        borderTop: "2px solid #FFD4C4",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "72px",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 50,
      }}>
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "16px",
                background: active ? "rgba(250,104,71,0.1)" : "transparent",
                transition: "background 0.2s ease",
              }}
            >
              {tab.icon(active)}
              <span style={{
                fontSize: "11px",
                fontWeight: active ? 800 : 600,
                color: active ? "#FA6847" : "#A0674A",
                letterSpacing: "0.02em",
              }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
