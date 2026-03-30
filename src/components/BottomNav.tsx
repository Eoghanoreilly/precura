"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "You", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 safe-bottom"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto py-1.5">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href === "/chat" && pathname?.startsWith("/chat")) ||
            (tab.href === "/profile" && pathname?.startsWith("/profile"));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-2 px-6 rounded-2xl"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
              }}
            >
              <tab.icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
