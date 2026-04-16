"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Droplets,
  Activity,
  MessageSquare,
  Bot,
  Dumbbell,
  User,
  Menu,
  X,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/smith1", label: "Dashboard", icon: LayoutDashboard },
  { href: "/smith1/blood-tests", label: "Blood Tests", icon: Droplets },
  { href: "/smith1/results", label: "Latest Results", icon: Activity },
  { href: "/smith1/risk", label: "Risk Models", icon: Shield },
  { href: "/smith1/messages", label: "Doctor Chat", icon: MessageSquare },
  { href: "/smith1/chat", label: "Health Assistant", icon: Bot },
  { href: "/smith1/training", label: "Training Plan", icon: Dumbbell },
  { href: "/smith1/profile", label: "Profile", icon: User },
];

export default function Smith1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#0B1628" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: 240,
          background: "#0F1C30",
          borderRight: "1px solid #1F2D42",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5">
          <Link
            href="/smith1"
            className="flex items-center gap-2"
            style={{ textDecoration: "none" }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#7C3AED",
              }}
            >
              <Activity size={18} style={{ color: "#FFFFFF" }} />
            </div>
            <span
              style={{
                color: "#F5F7FA",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              }}
            >
              Precura
            </span>
          </Link>
          <button
            className="lg:hidden p-1"
            onClick={() => setSidebarOpen(false)}
            style={{ color: "#B8C5D6", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/smith1" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 mb-1"
                style={{
                  borderRadius: 8,
                  background: isActive ? "rgba(124, 58, 237, 0.15)" : "transparent",
                  color: isActive ? "#A78BFA" : "#B8C5D6",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  transition: "background 0.15s",
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Membership badge */}
        <div className="p-4">
          <div
            className="p-3"
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              borderRadius: 10,
              border: "1px solid rgba(124, 58, 237, 0.2)",
            }}
          >
            <div
              style={{
                color: "#A78BFA",
                fontSize: 12,
                fontWeight: 600,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Annual Member
            </div>
            <div
              style={{
                color: "#B8C5D6",
                fontSize: 11,
                marginTop: 2,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              2,995 SEK/year
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header
          className="flex items-center justify-between px-4 py-3 lg:hidden"
          style={{
            background: "#0F1C30",
            borderBottom: "1px solid #1F2D42",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: "#B8C5D6", background: "none", border: "none", cursor: "pointer" }}
          >
            <Menu size={22} />
          </button>
          <span
            style={{
              color: "#F5F7FA",
              fontSize: 16,
              fontWeight: 600,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            }}
          >
            Precura
          </span>
          <div style={{ width: 22 }} />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
