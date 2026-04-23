"use client";

import React from "react";
import Link from "next/link";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  RailNav,
} from "@/components/layout";
import { useDoctorData } from "./useDoctorData";
import { LeftPane } from "./home/LeftPane";
import { RightPane } from "./home/RightPane";
import { MorningSummary } from "./home/MorningSummary";

const NAV_ITEMS = [
  { label: "Home", href: "/doctor" },
  { label: "Patients", href: "/doctor" },
  { label: "Settings", href: "/doctor/settings" },
];

export default function DoctorHomePage() {
  const data = useDoctorData();

  const displayName = data.doctor?.display_name || "Doctor";
  const firstName = displayName.split(/\s+/)[0] || "Doctor";
  const initials =
    displayName
      .split(/\s+/)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "D";

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/doctor" />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: displayName, initials, memberSince: "Clinician" }}
          doctor={{
            name: "Precura clinic",
            initials: "P",
            title: `${data.patients.length} patients`,
          }}
        />,
        <RailNav key="nav" items={NAV_ITEMS} activeHref="/doctor" />,
      ]}
    />
  );

  const right = data.activePatient ? (
    <RightPane
      rollup={data.activePatient}
      doctorName={displayName}
      onPostNote={data.writeNote}
      isPosting={data.isPosting}
      error={data.error}
      onClearError={data.clearError}
    />
  ) : (
    <MorningSummary
      data={data.morningSummary}
      onSelectPatient={data.selectPatient}
      doctorFirstName={firstName}
    />
  );

  return (
    <PageShell sideRail={sideRail} userInitials={initials} activeHref="/doctor">
      <div className="dhome">
        {/* Mobile: back button when a patient is selected */}
        {data.activePatient && (
          <div className="dhome-mobile-back">
            <button
              type="button"
              className="dhome-back-btn"
              onClick={() => data.selectPatient(null)}
            >
              Back to patients
            </button>
          </div>
        )}
        <div className={data.activePatient ? "dhome-panes has-active" : "dhome-panes"}>
          <div className="dhome-left">
            <LeftPane
              rollups={data.patients}
              activePatientId={data.activePatientId}
              onSelect={data.selectPatient}
              loading={data.loading}
            />
          </div>
          <div className="dhome-right">{right}</div>
        </div>
      </div>

      <style jsx>{`
        .dhome {
          height: calc(100dvh - 66px);
          display: flex;
          flex-direction: column;
          margin: calc(var(--sp-6) * -1) calc(var(--sp-5) * -1) calc(var(--sp-10) * -1);
        }
        .dhome-mobile-back {
          display: block;
          padding: var(--sp-3) var(--sp-5);
          border-bottom: 1px solid var(--line-soft);
          background: var(--canvas);
        }
        .dhome-back-btn {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          color: var(--sage-deep);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--sage-soft);
          cursor: pointer;
          padding: 0;
        }
        .dhome-panes {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr;
          min-height: 0;
          overflow: hidden;
        }
        .dhome-panes .dhome-left { display: block; }
        .dhome-panes .dhome-right { display: none; }
        .dhome-panes.has-active .dhome-left { display: none; }
        .dhome-panes.has-active .dhome-right { display: block; }

        @media (min-width: 900px) {
          .dhome-mobile-back { display: none; }
          .dhome-panes,
          .dhome-panes.has-active {
            grid-template-columns: 340px 1fr;
          }
          .dhome-panes .dhome-left,
          .dhome-panes.has-active .dhome-left,
          .dhome-panes .dhome-right,
          .dhome-panes.has-active .dhome-right {
            display: block;
          }
        }

        @media (min-width: 1024px) {
          .dhome {
            margin: calc(var(--sp-8) * -1) calc(clamp(24px, 4vw, 56px) * -1)
              calc(var(--sp-11) * -1);
            height: 100dvh;
          }
        }
      `}</style>
    </PageShell>
  );
}
