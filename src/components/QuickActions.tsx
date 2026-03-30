"use client";

import Link from "next/link";
import { MessageCircle, TestTube, Calendar } from "lucide-react";

const actions = [
  {
    href: "/chat",
    label: "Ask AI",
    icon: MessageCircle,
    color: "purple",
    bg: "#ede7f6",
  },
  {
    href: "/blood-tests",
    label: "Blood Test",
    icon: TestTube,
    color: "teal",
    bg: "#e0f2f1",
  },
  {
    href: "/consultations",
    label: "Consultation",
    icon: Calendar,
    color: "blue",
    bg: "#e3f2fd",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="card-hover flex flex-col items-center gap-2.5 py-5 rounded-2xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: action.bg }}
          >
            <action.icon size={20} style={{ color: `var(--${action.color})` }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
