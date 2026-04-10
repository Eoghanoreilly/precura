"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, Calendar, TestTube,
  CheckCircle, AlertTriangle, Clock,
  TrendingUp, Droplets,
} from "lucide-react";
import {
  BLOOD_TEST_HISTORY, getMarkerHistory,
  type BloodTestSession, type BloodMarker,
} from "@/lib/v2/mock-patient";

function statusColor(status: string) {
  if (status === "normal") return { bg: "var(--green-bg)", text: "var(--green-text)", dot: "var(--green)" };
  if (status === "borderline") return { bg: "var(--amber-bg)", text: "var(--amber-text)", dot: "var(--amber)" };
  return { bg: "var(--red-bg)", text: "var(--red-text)", dot: "var(--red)" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function yearsBetween(d1: string, d2: string) {
  const diff = Math.abs(new Date(d1).getTime() - new Date(d2).getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10;
}

// Key tracked markers and their trends
const TRACKED_MARKERS = ["f-Glucose", "HbA1c", "TC", "HDL", "LDL", "TG", "Vit D"];

export default function HistoryPage() {
  const [expandedSession, setExpandedSession] = useState<string | null>(BLOOD_TEST_HISTORY[0].date);
  const totalSessions = BLOOD_TEST_HISTORY.length;
  const firstDate = BLOOD_TEST_HISTORY[BLOOD_TEST_HISTORY.length - 1].date;
  const lastDate = BLOOD_TEST_HISTORY[0].date;
  const years = yearsBetween(firstDate, lastDate);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          paddingTop: 16, paddingBottom: 12,
        }}>
          <Link href="/smith1" style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--bg-elevated)", display: "flex",
            alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text)" }} />
          </Link>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>Test History</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              {totalSessions} blood tests over {years} years
            </p>
          </div>
        </div>

        {/* Multi-marker trend overview */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "16px 18px", marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>
            Key markers over time
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TRACKED_MARKERS.map((shortName) => {
              const history = getMarkerHistory(shortName);
              if (history.length < 2) return null;
              const first = history[0];
              const last = history[history.length - 1];
              const change = last.value - first.value;
              const latestSession = BLOOD_TEST_HISTORY[0];
              const latestMarker = latestSession.results.find((r) => r.shortName === shortName);
              if (!latestMarker) return null;
              const sc = statusColor(latestMarker.status);

              return (
                <Link key={shortName} href={`/smith1/marker?m=${shortName}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", padding: "8px 10px",
                    borderRadius: 10, background: "var(--bg-elevated)",
                    gap: 10,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: 4,
                      background: sc.dot, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                        {latestMarker.plainName}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {first.value}
                      </span>
                      <TrendingUp size={10} style={{ color: "var(--text-faint)" }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: sc.text }}>
                        {last.value}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: sc.text,
                        padding: "2px 6px", borderRadius: 4, background: sc.bg,
                      }}>
                        {change > 0 ? "+" : ""}{change.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical timeline line */}
          <div style={{
            position: "absolute", left: 19, top: 30, bottom: 30,
            width: 2, background: "var(--border)", zIndex: 0,
          }} />

          {BLOOD_TEST_HISTORY.map((session, idx) => {
            const isExpanded = expandedSession === session.date;
            const normalCount = session.results.filter((r) => r.status === "normal").length;
            const borderlineCount = session.results.filter((r) => r.status === "borderline").length;
            const abnormalCount = session.results.filter((r) => r.status === "abnormal").length;
            const isLatest = idx === 0;
            const isPrecura = session.orderedBy.includes("Precura");

            return (
              <div key={session.date} className={`animate-fade-in stagger-${Math.min(idx + 1, 6)}`} style={{ position: "relative", marginBottom: 12 }}>
                {/* Timeline dot */}
                <div style={{
                  position: "absolute", left: 12, top: 20,
                  width: 16, height: 16, borderRadius: 8,
                  background: isLatest ? "var(--blue)" : "var(--bg-elevated)",
                  border: `2px solid ${isLatest ? "var(--blue)" : "var(--border)"}`,
                  zIndex: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isLatest && <div style={{ width: 6, height: 6, borderRadius: 3, background: "#fff" }} />}
                </div>

                {/* Session Card */}
                <div style={{ marginLeft: 40 }}>
                  <button
                    onClick={() => setExpandedSession(isExpanded ? null : session.date)}
                    style={{
                      width: "100%", textAlign: "left", cursor: "pointer",
                      background: "var(--bg-card)", borderRadius: isExpanded ? "16px 16px 0 0" : 16,
                      border: "1px solid var(--border)",
                      borderBottom: isExpanded ? "none" : "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                            {formatDateShort(session.date)}
                          </span>
                          {isPrecura && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: "2px 6px",
                              borderRadius: 4, background: "var(--accent-light)",
                              color: "var(--accent)", textTransform: "uppercase",
                            }}>Precura</span>
                          )}
                          {isLatest && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: "2px 6px",
                              borderRadius: 4, background: "var(--blue-bg)",
                              color: "var(--blue-text)", textTransform: "uppercase",
                            }}>Latest</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {session.results.length} markers - {session.orderedBy}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Mini status dots */}
                        <div style={{ display: "flex", gap: 3 }}>
                          {normalCount > 0 && <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(--green)" }} title={`${normalCount} normal`} />}
                          {borderlineCount > 0 && <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(--amber)" }} title={`${borderlineCount} borderline`} />}
                          {abnormalCount > 0 && <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(--red)" }} title={`${abnormalCount} abnormal`} />}
                        </div>
                        <ChevronRight
                          size={14}
                          style={{
                            color: "var(--text-faint)",
                            transform: isExpanded ? "rotate(90deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded results */}
                  {isExpanded && (
                    <div style={{
                      background: "var(--bg-card)", borderRadius: "0 0 16px 16px",
                      border: "1px solid var(--border)", borderTop: "none",
                      padding: "4px 0 8px",
                    }}>
                      {session.results.map((marker, mIdx) => {
                        const sc = statusColor(marker.status);
                        return (
                          <Link key={marker.shortName} href={`/smith1/marker?m=${marker.shortName}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              display: "flex", alignItems: "center",
                              padding: "10px 16px",
                              borderTop: mIdx > 0 ? "1px solid var(--divider)" : "none",
                            }}>
                              <div style={{
                                width: 8, height: 8, borderRadius: 4,
                                background: sc.dot, flexShrink: 0, marginRight: 10,
                              }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
                                  {marker.plainName}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: sc.text }}>
                                  {marker.value}
                                </span>
                                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{marker.unit}</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}

                      {/* View full results link */}
                      {isLatest && (
                        <Link href="/smith1/results" style={{ textDecoration: "none" }}>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: 6, padding: "10px 16px", marginTop: 4,
                            borderTop: "1px solid var(--divider)",
                          }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
                              View full results with doctor&apos;s note
                            </span>
                            <ChevronRight size={14} style={{ color: "var(--accent)" }} />
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div style={{
          background: "var(--bg-elevated)", borderRadius: 14,
          padding: "14px 16px", marginTop: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{totalSessions}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>blood tests</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{years}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>years of data</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                {BLOOD_TEST_HISTORY.reduce((acc, s) => acc + s.results.length, 0)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>total measurements</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>2</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>different labs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
