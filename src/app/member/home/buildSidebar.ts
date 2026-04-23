import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import { DOCTOR } from "@/components/member/tokens";
import type { PanelWithBiomarkers, Profile } from "@/lib/data/types";

// ============================================================================
// buildSidebar - assemble MemberSidebarProps from the Supabase user + panels.
// Extracted from AdaptiveHomeView so the router stays thin.
// ============================================================================

export function buildSidebar(
  user: Profile | null,
  panels: PanelWithBiomarkers[]
): MemberSidebarProps {
  const name = user?.display_name || "Member";
  const initials = name[0].toUpperCase();
  const memberSince = user?.created_at
    ? `Member since ${new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })}`
    : "";

  const hasPanel = panels.length > 0;
  const latest = hasPanel ? panels[0] : null;

  return {
    user: { name, initials, memberSince },
    doctor: {
      name: DOCTOR.name,
      initials: DOCTOR.initials,
      title: DOCTOR.title,
    },
    nextPanel: {
      eyebrow: hasPanel ? "Latest panel" : "Get started",
      headline: latest
        ? new Date(latest.panel_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Add your first panel",
      subtext: latest
        ? `${latest.biomarkers.length} markers`
        : "Upload your blood test data",
    },
    activeHref: "/member",
  };
}
