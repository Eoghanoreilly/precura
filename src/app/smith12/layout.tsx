"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User } from "lucide-react";

const TABS = [
  { href: "/smith12", label: "Explore", icon: Search },
  { href: "/smith12/actions", label: "Actions", icon: Heart },
  { href: "/smith12/profile", label: "Profile", icon: User },
];

export default function Smith12Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  function getActiveTab() {
    if (pathname === "/smith12" || pathname === "/smith12/blood-tests" || pathname === "/smith12/risk" || pathname === "/smith12/messages" || pathname === "/smith12/training") return "/smith12";
    if (pathname === "/smith12/actions") return "/smith12/actions";
    if (pathname === "/smith12/profile") return "/smith12/profile";
    return "/smith12";
  }

  const activeTab = getActiveTab();

  return (
    <div
      className="flex flex-col min-h-dvh mx-auto relative"
      style={{
        maxWidth: 430,
        background: "#FFFFFF",
        fontFamily: '"Cereal", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-5 pt-3 pb-2"
        style={{ background: "#FFFFFF" }}
      >
        <Link href="/smith12" style={{ textDecoration: "none" }}>
          <span
            style={{
              color: "#FF385C",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            precura
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 50,
              border: "1px solid #EBEBEB",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Search size={16} style={{ color: "#222222" }} />
          </button>

          <Link href="/smith12/profile">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 50,
                background: "linear-gradient(135deg, #FF385C, #E31C5F)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              A
            </div>
          </Link>
        </div>
      </header>

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="px-5 pb-3">
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: "#F7F7F7",
              borderRadius: 50,
              border: "1px solid #EBEBEB",
            }}
          >
            <Search size={16} style={{ color: "#717171" }} />
            <input
              type="text"
              placeholder="Search blood tests, risks, training..."
              autoFocus
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                flex: 1,
                fontSize: 15,
                color: "#222222",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-around"
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#FFFFFF",
          borderTop: "1px solid #EBEBEB",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          paddingTop: 8,
          zIndex: 50,
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1"
              style={{ textDecoration: "none", flex: 1 }}
            >
              <Icon
                size={22}
                style={{ color: isActive ? "#FF385C" : "#717171" }}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#FF385C" : "#717171",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
