"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";
import { DOCTOR_NOTES, DOCTOR_VISITS } from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />;
}

function NoteBlock({
  note,
  defaultOpen,
}: {
  note: (typeof DOCTOR_NOTES)[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div style={{ borderBottom: "1px solid #E9E9E7" }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full py-2.5 px-1 -mx-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: FONT,
          borderRadius: 3,
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {open ? (
          <ChevronDown size={12} style={{ color: "#9B9A97" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "#9B9A97" }} />
        )}
        <FileText size={14} style={{ color: "#9B9A97" }} />
        <div className="flex-1 text-left">
          <span style={{ fontSize: 14, fontWeight: 500, color: "#37352F" }}>
            {note.type}
          </span>
          <span style={{ fontSize: 12, color: "#9B9A97", marginLeft: 8 }}>
            {note.author}
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#9B9A97" }}>
          {new Date(note.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </button>

      {open && (
        <div style={{ paddingLeft: 32, paddingBottom: 12, paddingRight: 8 }}>
          {note.note.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontSize: 13,
                color: "#37352F",
                lineHeight: 1.7,
                marginBottom: 8,
                marginTop: 0,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClinicalNotesPage() {
  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <Link
          href="/smith15"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Health Overview
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <Link
          href="/smith15/doctor"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Doctor
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>Clinical Notes</span>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 4,
        }}
      >
        Clinical Notes
      </h1>
      <p style={{ fontSize: 14, color: "#9B9A97", marginBottom: 0 }}>
        Notes from your Precura consultations
      </p>

      <Divider />

      {/* Precura clinical notes */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#9B9A97",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 8,
        }}
      >
        Precura Notes
      </div>

      {DOCTOR_NOTES.map((note, i) => (
        <NoteBlock key={note.date} note={note} defaultOpen={i === 0} />
      ))}

      <Divider />

      {/* Visit history */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#9B9A97",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 8,
        }}
      >
        Visit History (from 1177)
      </div>

      {DOCTOR_VISITS.map((visit) => (
        <div
          key={visit.date}
          style={{ borderBottom: "1px solid #E9E9E7", paddingBottom: 10, marginBottom: 10 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 14, fontWeight: 500, color: "#37352F" }}>
                {visit.type}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#9B9A97",
                  background: "#F1F1EF",
                  padding: "1px 6px",
                  borderRadius: 3,
                }}
              >
                {visit.provider}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#9B9A97" }}>
              {new Date(visit.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#37352F",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {visit.summary}
          </p>
        </div>
      ))}
    </div>
  );
}
