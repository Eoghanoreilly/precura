"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Activity,
  Droplets,
  TrendingUp,
  Dumbbell,
  HeartPulse,
  MessageSquare,
  FileText,
  User,
  PanelLeftClose,
  PanelLeft,
  Search,
  type LucideIcon,
} from "lucide-react";

const FONT =
  '-apple-system, "Inter", system-ui, sans-serif';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { id: string; label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Health Overview",
    href: "/smith15",
    icon: Activity,
  },
  {
    id: "blood",
    label: "Blood Work",
    href: "/smith15/blood",
    icon: Droplets,
    children: [
      { id: "blood-latest", label: "Latest Results", href: "/smith15/blood" },
      {
        id: "blood-history",
        label: "Historical Trends",
        href: "/smith15/blood/history",
      },
    ],
  },
  {
    id: "risk",
    label: "Risk Models",
    href: "/smith15/risk",
    icon: TrendingUp,
  },
  {
    id: "training",
    label: "Training Plan",
    href: "/smith15/training",
    icon: Dumbbell,
  },
  {
    id: "doctor",
    label: "Doctor",
    href: "/smith15/doctor",
    icon: HeartPulse,
    children: [
      { id: "doctor-messages", label: "Messages", href: "/smith15/doctor" },
      {
        id: "doctor-notes",
        label: "Clinical Notes",
        href: "/smith15/doctor/notes",
      },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/smith15/profile",
    icon: User,
  },
];

function SidebarItem({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const isActive =
    pathname === item.href ||
    item.children?.some((c) => pathname === c.href);
  const [expanded, setExpanded] = useState(isActive || false);
  const Icon = item.icon;

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          className="flex items-center flex-1 gap-2 px-3 py-1.5"
          style={{
            fontFamily: FONT,
            fontSize: 14,
            color: isActive ? "#37352F" : "#9B9A97",
            fontWeight: isActive ? 500 : 400,
            background: isActive && !hasChildren ? "#F1F1EF" : "transparent",
            borderRadius: 3,
            textDecoration: "none",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => {
            if (!isActive || hasChildren)
              (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
          }}
          onMouseLeave={(e) => {
            if (!isActive || hasChildren)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          {!collapsed && (
            <Icon
              size={15}
              style={{ color: isActive ? "#37352F" : "#9B9A97", flexShrink: 0 }}
            />
          )}
          {collapsed && (
            <Icon
              size={18}
              style={{ color: isActive ? "#37352F" : "#9B9A97" }}
            />
          )}
          {!collapsed && <span>{item.label}</span>}
        </Link>
        {hasChildren && !collapsed && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px 4px 0",
              color: "#9B9A97",
              display: "flex",
              alignItems: "center",
            }}
          >
            {expanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </button>
        )}
      </div>
      {hasChildren && expanded && !collapsed && (
        <div style={{ paddingLeft: 28 }}>
          {item.children!.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.id}
                href={child.href}
                className="block px-3 py-1"
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: childActive ? "#37352F" : "#9B9A97",
                  fontWeight: childActive ? 500 : 400,
                  background: childActive ? "#F1F1EF" : "transparent",
                  borderRadius: 3,
                  textDecoration: "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!childActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "#F1F1EF";
                }}
                onMouseLeave={(e) => {
                  if (!childActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                }}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Smith15Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandHint, setCommandHint] = useState(true);

  return (
    <div
      className="flex min-h-dvh"
      style={{ background: "#FAFAF9", fontFamily: FONT }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 h-dvh sticky top-0"
        style={{
          width: sidebarOpen ? 220 : 48,
          borderRight: "1px solid #E9E9E7",
          background: "#FAFAF9",
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-3 py-3"
          style={{
            borderBottom: "1px solid #E9E9E7",
            minHeight: 44,
          }}
        >
          {sidebarOpen && (
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#37352F",
                letterSpacing: "-0.01em",
              }}
            >
              Precura
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9B9A97",
              padding: 4,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={16} />
            ) : (
              <PanelLeft size={16} />
            )}
          </button>
        </div>

        {/* Search hint */}
        {sidebarOpen && (
          <div className="px-3 pt-3 pb-1">
            <div
              className="flex items-center gap-2 px-2 py-1.5"
              style={{
                background: "#F1F1EF",
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              <Search size={13} style={{ color: "#9B9A97" }} />
              <span style={{ fontSize: 12, color: "#9B9A97" }}>Search...</span>
              <span
                style={{
                  fontSize: 10,
                  color: "#9B9A97",
                  marginLeft: "auto",
                  background: "#FAFAF9",
                  padding: "1px 5px",
                  borderRadius: 3,
                  border: "1px solid #E9E9E7",
                }}
              >
                /
              </span>
            </div>
          </div>
        )}

        {/* Nav tree */}
        <nav className="flex-1 px-1 py-2 overflow-y-auto">
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                pathname={pathname}
                collapsed={!sidebarOpen}
              />
            ))}
          </div>
        </nav>

        {/* Sidebar footer */}
        {sidebarOpen && (
          <div
            className="px-3 py-3"
            style={{ borderTop: "1px solid #E9E9E7" }}
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#E9E9E7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#37352F",
                }}
              >
                A
              </div>
              <span style={{ fontSize: 13, color: "#37352F" }}>
                Anna Bergstrom
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Command palette hint */}
        {commandHint && (
          <div
            className="flex items-center justify-center py-1.5"
            style={{
              background: "#F1F1EF",
              borderBottom: "1px solid #E9E9E7",
              cursor: "pointer",
            }}
            onClick={() => setCommandHint(false)}
          >
            <span style={{ fontSize: 11, color: "#9B9A97" }}>
              Press{" "}
              <span
                style={{
                  background: "#FAFAF9",
                  padding: "1px 5px",
                  borderRadius: 3,
                  border: "1px solid #E9E9E7",
                  fontSize: 10,
                  fontFamily:
                    '"SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace',
                }}
              >
                /
              </span>{" "}
              for commands
            </span>
          </div>
        )}

        <div
          className="mx-auto px-6 py-6"
          style={{ maxWidth: 860 }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
