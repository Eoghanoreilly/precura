"use client";

import Link from "next/link";
import { ArrowLeft, User, Shield, Download, Trash2, Bell, LogOut, ChevronRight, Heart, CreditCard } from "lucide-react";
import { PATIENT } from "@/lib/v2/mock-patient";

export default function ProfilePage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 100px" }}>
        <div style={{ paddingTop: 16, marginBottom: 20 }}>
          <Link href="/v2/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-muted)" }}>
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>AB</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{PATIENT.name}</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {PATIENT.personnummer.slice(0, 8)}-****
            </p>
          </div>
        </div>

        {/* Membership */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Membership</p>
        <Link href="/v2/membership">
          <div style={{ background: "var(--accent-light)", border: "1px solid var(--accent)", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Heart size={18} style={{ color: "var(--accent)" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>Precura Annual Member</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Since {PATIENT.memberSince}. Next blood test: Sep 2026</p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--accent)" }} />
          </div>
        </Link>

        {/* Settings */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Settings</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
          {[
            { icon: User, label: "Personal details", sub: "Name, address, contact", href: "#" },
            { icon: Bell, label: "Notifications", sub: "Reminders, results alerts", href: "#" },
            { icon: CreditCard, label: "Payment", sub: "Manage subscription", href: "/v2/membership" },
            { icon: Shield, label: "Privacy & data", sub: "1177 connection, data access", href: "#" },
          ].map((item, i, arr) => (
            <Link key={item.label} href={item.href}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.icon size={15} style={{ color: "var(--text-muted)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</p>
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Data */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Your data</p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", width: "100%", border: "none", background: "none", cursor: "pointer", borderBottom: "1px solid var(--divider)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--teal-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Download size={15} style={{ color: "var(--teal)" }} />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Download my health data</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>FHIR-compatible format. Take your data anywhere.</p>
            </div>
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", width: "100%", border: "none", background: "none", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--red-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trash2 size={15} style={{ color: "var(--red)" }} />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--red-text)" }}>Delete my account</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Remove all data permanently</p>
            </div>
          </button>
        </div>

        {/* Sign out */}
        <Link href="/v2/login">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
            <LogOut size={16} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>Sign out</span>
          </div>
        </Link>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 10, color: "var(--text-faint)", marginTop: 20, fontFamily: "var(--font-mono)" }}>
          Precura v2. Your health data is encrypted and stored in the EU.
        </p>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--divider)", padding: "6px 0", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-around", maxWidth: 448, margin: "0 auto" }}>
          {[
            { href: "/v2/dashboard", label: "Home" },
            { href: "/v2/health", label: "Health" },
            { href: "/v2/chat", label: "Chat" },
            { href: "/v2/profile", label: "You", active: true },
          ].map((tab) => (
            <Link key={tab.href} href={tab.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 16px", borderRadius: 16, background: tab.active ? "var(--accent-light)" : "transparent", fontSize: 10, fontWeight: 600, color: tab.active ? "var(--accent)" : "var(--text-muted)", textDecoration: "none" }}>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
