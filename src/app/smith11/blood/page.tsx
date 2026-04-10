"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  getMarkerHistory,
  getLatestMarker,
  type BloodMarker,
  type BloodTestSession,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Marker Detail Bottom Sheet                                          */
/* ------------------------------------------------------------------ */
function MarkerDetailSheet({
  marker,
  onClose,
}: {
  marker: BloodMarker | null;
  onClose: () => void;
}) {
  if (!marker) return null;
  const history = getMarkerHistory(marker.shortName);
  const min = Math.min(...history.map((h) => h.value));
  const max = Math.max(...history.map((h) => h.value));
  const range = max - min || 1;
  const statusColor =
    marker.status === "borderline"
      ? "#FFA42B"
      : marker.status === "abnormal"
        ? "#F15E6C"
        : "#1DB954";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "#00000080",
          zIndex: 50,
        }}
      />
      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: "#1E1E1E",
          borderRadius: "16px 16px 0 0",
          padding: "20px 20px 40px",
          zIndex: 51,
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "#B3B3B340",
            margin: "0 auto 20px",
          }}
        />

        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
            {marker.plainName}
          </h3>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: statusColor,
              background: `${statusColor}18`,
              borderRadius: 24,
              padding: "4px 10px",
            }}
          >
            {marker.status === "normal"
              ? "Normal"
              : marker.status === "borderline"
                ? "Borderline"
                : "Abnormal"}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#B3B3B3", marginBottom: 20 }}>
          {marker.name} ({marker.shortName})
        </div>

        {/* Current value */}
        <div className="flex items-baseline gap-2" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: statusColor, lineHeight: 1 }}>
            {marker.value}
          </span>
          <span style={{ fontSize: 15, color: "#B3B3B3" }}>{marker.unit}</span>
        </div>

        {/* Reference range bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#B3B3B3", marginBottom: 8 }}>Reference range</div>
          <div style={{ position: "relative", height: 8, borderRadius: 4, background: "#282828" }}>
            <div
              style={{
                position: "absolute",
                left: "10%",
                right: "10%",
                top: 0,
                bottom: 0,
                background: "#1DB95430",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${Math.min(
                  Math.max(
                    ((marker.value - marker.refLow * 0.7) /
                      (marker.refHigh * 1.3 - marker.refLow * 0.7)) *
                      100,
                    2
                  ),
                  98
                )}%`,
                top: -3,
                width: 14,
                height: 14,
                borderRadius: 7,
                background: statusColor,
                border: "3px solid #1E1E1E",
              }}
            />
          </div>
          <div className="flex justify-between" style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#B3B3B3" }}>
              {marker.refLow} {marker.unit}
            </span>
            <span style={{ fontSize: 11, color: "#B3B3B3" }}>
              {marker.refHigh} {marker.unit}
            </span>
          </div>
        </div>

        {/* Trend */}
        {history.length > 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 12 }}>
              Your history
            </div>
            <div className="flex items-end gap-1" style={{ height: 80 }}>
              {history.map((h, i) => {
                const barH = ((h.value - min) / range) * 60 + 20;
                const isLast = i === history.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span style={{ fontSize: 10, color: "#B3B3B3", fontWeight: 600 }}>
                      {h.value}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 24,
                        height: barH,
                        borderRadius: 4,
                        background: isLast
                          ? statusColor
                          : `${statusColor}40`,
                      }}
                    />
                    <span style={{ fontSize: 9, color: "#B3B3B360" }}>
                      {new Date(h.date).getFullYear().toString().slice(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Single Marker Row                                                   */
/* ------------------------------------------------------------------ */
function MarkerRow({
  marker,
  onTap,
}: {
  marker: BloodMarker;
  onTap: () => void;
}) {
  const statusColor =
    marker.status === "borderline"
      ? "#FFA42B"
      : marker.status === "abnormal"
        ? "#F15E6C"
        : "#1DB954";

  const history = getMarkerHistory(marker.shortName);

  return (
    <button
      onClick={onTap}
      className="flex items-center w-full"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "14px 0",
        borderBottom: "1px solid #28282850",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: statusColor,
          flexShrink: 0,
          marginRight: 12,
        }}
      />
      <div className="flex-1" style={{ textAlign: "left" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF" }}>
          {marker.plainName}
        </div>
        <div style={{ fontSize: 12, color: "#B3B3B3" }}>{marker.name}</div>
      </div>
      <div className="flex items-center gap-3">
        {/* Mini sparkline */}
        {history.length > 1 && (
          <div className="flex items-end gap-0.5" style={{ height: 20 }}>
            {history.slice(-5).map((h, i) => {
              const vals = history.slice(-5).map((x) => x.value);
              const mn = Math.min(...vals);
              const mx = Math.max(...vals);
              const rng = mx - mn || 1;
              const ht = ((h.value - mn) / rng) * 16 + 4;
              const last = i === Math.min(history.length, 5) - 1;
              return (
                <div
                  key={i}
                  style={{
                    width: last ? 3 : 2,
                    height: ht,
                    borderRadius: 1,
                    background: last ? statusColor : `${statusColor}40`,
                  }}
                />
              );
            })}
          </div>
        )}
        <div style={{ textAlign: "right", minWidth: 50 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: statusColor }}>
            {marker.value}
          </div>
          <div style={{ fontSize: 10, color: "#B3B3B360" }}>{marker.unit}</div>
        </div>
        <ChevronRight size={16} style={{ color: "#B3B3B340" }} />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Test Session Card                                                    */
/* ------------------------------------------------------------------ */
function TestSessionCard({
  session,
  isLatest,
  isExpanded,
  onToggle,
  onSelectMarker,
}: {
  session: BloodTestSession;
  isLatest: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectMarker: (m: BloodMarker) => void;
}) {
  const borderlineCount = session.results.filter(
    (r) => r.status === "borderline" || r.status === "abnormal"
  ).length;
  const date = new Date(session.date);
  const dateStr = date.toLocaleDateString("en-SE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: isLatest ? "#1E1E1E" : "#1A1A1A",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center w-full"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 16,
        }}
      >
        <div className="flex-1" style={{ textAlign: "left" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              {dateStr}
            </span>
            {isLatest && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#1DB954",
                  background: "#1DB95418",
                  borderRadius: 24,
                  padding: "2px 8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Latest
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#B3B3B3" }}>
            {session.orderedBy} / {session.results.length} markers
          </div>
        </div>
        <div className="flex items-center gap-2">
          {borderlineCount > 0 && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#FFA42B",
              }}
            >
              {borderlineCount} flagged
            </span>
          )}
          <ChevronDown
            size={18}
            style={{
              color: "#B3B3B3",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      </button>

      {isExpanded && (
        <div style={{ padding: "0 16px 8px" }}>
          {session.results.map((marker) => (
            <MarkerRow
              key={marker.shortName}
              marker={marker}
              onTap={() => onSelectMarker(marker)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctor Note Card                                                     */
/* ------------------------------------------------------------------ */
function DoctorNoteCard({
  note,
}: {
  note: (typeof DOCTOR_NOTES)[0];
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = note.note.slice(0, 160);

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 16, marginBottom: 8 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
        <FileText size={14} style={{ color: "#1DB954" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1DB954" }}>{note.type}</span>
        <span style={{ fontSize: 12, color: "#B3B3B360", marginLeft: "auto" }}>{note.date}</span>
      </div>
      <div style={{ fontSize: 12, color: "#B3B3B3", marginBottom: 8 }}>{note.author}</div>
      <p
        style={{
          fontSize: 13,
          color: "#B3B3B3",
          lineHeight: 1.6,
          margin: 0,
          whiteSpace: "pre-wrap",
        }}
      >
        {expanded ? note.note : `${preview}...`}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginTop: 8,
          fontSize: 13,
          fontWeight: 600,
          color: "#1DB954",
        }}
      >
        {expanded ? "Show less" : "Read full note"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Summary Stats Row                                                    */
/* ------------------------------------------------------------------ */
function SummaryStats() {
  const latest = BLOOD_TEST_HISTORY[0];
  const normal = latest.results.filter((r) => r.status === "normal").length;
  const flagged = latest.results.filter(
    (r) => r.status === "borderline" || r.status === "abnormal"
  ).length;

  return (
    <div className="flex gap-3" style={{ marginBottom: 20 }}>
      <div
        className="flex-1 flex items-center gap-3"
        style={{ background: "#1E1E1E", borderRadius: 8, padding: 14 }}
      >
        <CheckCircle size={20} style={{ color: "#1DB954" }} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1DB954" }}>{normal}</div>
          <div style={{ fontSize: 11, color: "#B3B3B3" }}>Normal</div>
        </div>
      </div>
      <div
        className="flex-1 flex items-center gap-3"
        style={{ background: "#1E1E1E", borderRadius: 8, padding: 14 }}
      >
        <AlertCircle size={20} style={{ color: "#FFA42B" }} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#FFA42B" }}>{flagged}</div>
          <div style={{ fontSize: 11, color: "#B3B3B3" }}>Flagged</div>
        </div>
      </div>
      <div
        className="flex-1 flex items-center gap-3"
        style={{ background: "#1E1E1E", borderRadius: 8, padding: 14 }}
      >
        <Calendar size={20} style={{ color: "#B3B3B3" }} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>
            {BLOOD_TEST_HISTORY.length}
          </div>
          <div style={{ fontSize: 11, color: "#B3B3B3" }}>Tests</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BLOOD PAGE                                                           */
/* ------------------------------------------------------------------ */
export default function BloodPage() {
  const [expandedIdx, setExpandedIdx] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<BloodMarker | null>(null);

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
        Blood work
      </h1>
      <p style={{ fontSize: 14, color: "#B3B3B3", margin: "0 0 20px" }}>
        {BLOOD_TEST_HISTORY.length} test sessions over{" "}
        {new Date(BLOOD_TEST_HISTORY[0].date).getFullYear() -
          new Date(BLOOD_TEST_HISTORY[BLOOD_TEST_HISTORY.length - 1].date).getFullYear()}{" "}
        years
      </p>

      <SummaryStats />

      {/* Doctor Notes */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
          Doctor&apos;s notes
        </h2>
        {DOCTOR_NOTES.slice(0, 1).map((note) => (
          <DoctorNoteCard key={note.date} note={note} />
        ))}
      </div>

      {/* Test Sessions */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
        Test history
      </h2>
      {BLOOD_TEST_HISTORY.map((session, idx) => (
        <TestSessionCard
          key={session.date}
          session={session}
          isLatest={idx === 0}
          isExpanded={expandedIdx === idx}
          onToggle={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
          onSelectMarker={(m) => setSelectedMarker(m)}
        />
      ))}

      {/* Marker Detail Sheet */}
      <MarkerDetailSheet
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
      />
    </div>
  );
}
