"use client";

import React from "react";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  NextPanelHint,
  RailNav,
} from "@/components/layout";
import { DOCTOR } from "@/components/member/tokens";
import { useDiscussData } from "./useDiscussData";
import { HistoryView } from "./HistoryView";
import { ActiveChat } from "./ActiveChat";

const NAV_ITEMS = [
  { label: "Home", href: "/member" },
  { label: "Discuss", href: "/member/discuss" },
  { label: "Blood panels", href: "/member/panels" },
  { label: "Notes", href: "/member/messages" },
  { label: "Training", href: "/member/training" },
  { label: "Settings", href: "/member/profile" },
];

export default function DiscussPage() {
  const data = useDiscussData();

  const displayName = data.user?.display_name || "Member";
  const initials = displayName[0]?.toUpperCase() || "M";

  const sideRail = (
    <SideRail
      logo={<Wordmark />}
      sections={[
        <IdentityCard
          key="id"
          user={{
            name: displayName,
            initials,
            memberSince: "Member since 2026",
          }}
          doctor={{
            name: DOCTOR.name,
            initials: DOCTOR.initials,
            title: "Your licensed doctor",
          }}
        />,
        <NextPanelHint
          key="np"
          eyebrow="Next panel"
          headline="To be scheduled"
          subtext="After your next review"
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/member/discuss" />,
      ]}
    />
  );

  const content =
    data.view === "history" ? (
      <HistoryView
        sessions={data.sessions}
        loading={data.sessionsLoading}
        onOpenSession={data.openSession}
        onStartNew={data.startNewSession}
      />
    ) : (
      <ActiveChat
        messages={data.messages}
        streaming={data.isStreaming}
        error={data.error}
        onSend={data.sendMessage}
        onAbort={data.abortStreaming}
        onBack={data.goToHistory}
        onClearError={data.clearError}
      />
    );

  return (
    <PageShell sideRail={sideRail} userInitials={initials} activeHref="/member/discuss">
      {content}
    </PageShell>
  );
}
