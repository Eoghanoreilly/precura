"use client";

import React, { useState } from "react";
import {
  Home,
  Droplets,
  Dumbbell,
  MessageCircle,
  User,
} from "lucide-react";
import HomePage from "./home";
import BloodPage from "./blood";
import TrainingPage from "./training";
import MessagesPage from "./messages";
import ProfilePage from "./profile";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "blood", label: "Blood", icon: Droplets },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "profile", label: "You", icon: User },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Smith14App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />;
      case "blood":
        return <BloodPage />;
      case "training":
        return <TrainingPage />;
      case "messages":
        return <MessagesPage />;
      case "profile":
        return <ProfilePage />;
    }
  };

  return (
    <>
      {/* Top app bar */}
      <header
        className="flex items-center justify-between px-4"
        style={{
          height: 64,
          background: "#FAFDFB",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#006D3E",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Precura
        </span>

        <button
          onClick={() => setActiveTab("profile")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            background: "#006D3E",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          A
        </button>
      </header>

      {/* Page content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: 80 }}
      >
        {renderPage()}
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-around"
        style={{
          width: "100%",
          maxWidth: 430,
          height: 80,
          background: "#ECF5EF",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: 50,
          boxShadow: "0 -1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center gap-1"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "12px 0 8px",
                position: "relative",
              }}
            >
              {/* Pill-shaped active indicator (Material 3 signature) */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 32,
                  borderRadius: 50,
                  background: isActive ? "#95F7B5" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <Icon
                  size={24}
                  style={{
                    color: isActive ? "#002110" : "#4F6354",
                  }}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  fill={isActive ? "#002110" : "none"}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#002110" : "#4F6354",
                  letterSpacing: "0.01em",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
