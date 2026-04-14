"use client";

import React, { useState } from "react";
import {
  Home,
  Droplets,
  Dumbbell,
  HeartPulse,
  User,
} from "lucide-react";
import HomePage from "./home";
import BloodPage from "./blood/page";
import TrainingPage from "./training/page";
import DoctorPage from "./doctor/page";
import YouPage from "./you/page";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "blood", label: "Blood", icon: Droplets },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "doctor", label: "Doctor", icon: HeartPulse },
  { id: "you", label: "You", icon: User },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Smith11App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />;
      case "blood":
        return <BloodPage />;
      case "training":
        return <TrainingPage />;
      case "doctor":
        return <DoctorPage />;
      case "you":
        return <YouPage />;
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", maxWidth: 430, margin: "0 auto", background: "#121212" }}>
      {/* Status bar spacer */}
      <div style={{ height: 54, background: "#121212", flexShrink: 0 }} />

      {/* Page content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 0 }}>
        {renderPage()}
      </div>

      {/* Bottom Tab Bar */}
      <div
        className="flex items-center justify-around"
        style={{
          height: 56,
          background: "#1E1E1E",
          borderTop: "1px solid #282828",
          flexShrink: 0,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 0",
              }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? "#1DB954" : "#B3B3B3" }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#1DB954" : "#B3B3B3",
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
