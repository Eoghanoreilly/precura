"use client";

import { useRouter } from "next/navigation";
import { Activity, LogOut } from "lucide-react";
import { getUser, logout } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const user = getUser();
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("") || "?";

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5"
      style={{
        background: "rgba(248, 249, 250, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--divider)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}
        >
          <Activity size={16} style={{ color: "var(--accent)" }} />
        </div>
        <span
          className="font-bold text-sm tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Precura
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {initials}
        </div>
        <button onClick={handleLogout} className="flex items-center justify-center p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
