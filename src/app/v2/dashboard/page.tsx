"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle, Sparkles, ChevronRight, Send, X,
  Activity, TestTube, Stethoscope, Dumbbell,
  TrendingUp, TrendingDown, Minus,
  AlertCircle, Calendar, Clock, Heart, Download,
  Pill, BookOpen, Users, ArrowRight, Zap, Apple as AppleIcon,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import {
  PATIENT, BLOOD_TEST_HISTORY, RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY, MESSAGES, TRAINING_PLAN,
  MEDICATIONS, getMarkerHistory,
} from "@/lib/v2/mock-patient";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Unsplash images (free to use, direct URLs)
const IMG = {
  hero: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop",
  workout: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop",
  food: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&fit=crop",
  bloodTest: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&fit=crop",
  walking: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&fit=crop",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&fit=crop",
  family: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80&fit=crop",
  community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fit=crop",
};

export default function V2Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const normalCount = latestBlood.results.filter((r) => r.status === "normal").length;
  const lastMsg = MESSAGES[MESSAGES.length - 1];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1];
  const firstGlucose = glucoseHistory[0];
  const cholHistory = getMarkerHistory("TC");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh", position: "relative" }}>
      {/* Responsive container: narrow on mobile, wide on desktop */}
      <div className="v2-container">

        {/* TOP BAR */}
        <div className="v2-topbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={14} style={{ color: "var(--accent)" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>Precura</span>
          </div>
          <Link href="/v2/profile">
            <div style={{ width: 34, height: 34, borderRadius: 12, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>AB</div>
          </Link>
        </div>

        {/* GREETING */}
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>{getGreeting()}, {PATIENT.firstName}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>

        {/* Desktop: two column layout */}
        <div className="v2-grid">
        <div className="v2-main">

        {/* ==================== NUMBERED CARDS ==================== */}

        {/* 1. HERO ATTENTION CARD */}
        <NumberLabel n={1} />
        <Link href="/v2/health">
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-md)" }}>
            <div style={{ height: 140, position: "relative", background: "#333" }}>
              <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
              <div style={{ position: "absolute", bottom: 12, left: 16, right: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <AlertCircle size={13} color="#fbbf24" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#fbbf24" }}>Worth watching</span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>Your blood sugar has been gradually rising over 5 years</p>
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "12px 16px", border: "1px solid var(--border)", borderTop: "none" }}>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {firstGlucose.value} to {latestGlucose.value} mmol/L since {firstGlucose.date.slice(0, 4)}. Dr. Johansson is monitoring this.
              </p>
            </div>
          </div>
        </Link>

        {/* 2-6. QUICK ACTIONS */}
        <NumberLabel n={2} label="2-6" />
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 14, scrollbarWidth: "none" }}>
          <QCard n={2} icon={<Stethoscope size={18} />} color="accent" label="Dr. Johansson" sub="1 new message" href="/v2/doctor" />
          <QCard n={3} icon={<TestTube size={18} />} color="teal" label="Blood Results" sub={`${normalCount}/${latestBlood.results.length} normal`} href="/v2/blood-tests/results" />
          <QCard n={4} icon={<Dumbbell size={18} />} color="purple" label="Today's Workout" sub="Upper body" href="/v2/training" />
          <QCard n={5} icon={<Calendar size={18} />} color="blue" label="Next Blood Test" sub="Sep 2026" href="/v2/blood-tests" />
          <QCard n={6} icon={<Download size={18} />} color="green" label="Health Report" sub="Download PDF" href="/v2/health" />
        </div>

        {/* 7-10. HEALTH SNAPSHOT */}
        <NumberLabel n={7} label="7-10" />
        <Sec title="Health snapshot" />
        <div className="v2-health-grid" style={{ marginBottom: 14 }}>
          <HM n={7} label="Diabetes Risk" value="Moderate risk" color="amber" trend="worsening" href="/v2/health" />
          <HM n={8} label="Heart Risk" value="Low-mod risk" color="teal" trend="stable" href="/v2/health" />
          <HM n={9} label="Blood Sugar" value={`${latestGlucose.value}`} unit="mmol/L" color="amber" trend="worsening" href="/v2/blood-tests/results" />
          <HM n={10} label="Blood Pressure" value={BIOMETRICS_HISTORY[0].bloodPressure} color="green" trend="stable" href="/v2/health" />
        </div>

        {/* 11. DOCTOR UPDATE */}
        <NumberLabel n={11} />
        <Link href="/v2/doctor">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)", display: "flex", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>MJ</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Johansson</span>
                <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Yesterday</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg.text.slice(0, 80)}...</p>
            </div>
          </div>
        </Link>

        {/* 12. TODAY'S WORKOUT */}
        <NumberLabel n={12} />
        <Link href="/v2/training">
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ height: 100, position: "relative", background: "#333" }}>
              <img src={IMG.workout} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
              <div style={{ position: "absolute", bottom: 10, left: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Week 10, Day 3: Upper Body</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>4 exercises - ~30 min</p>
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "12px 14px", border: "1px solid var(--border)", borderTop: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-muted)" }}>
                <span>Push-ups 3x12</span><span>DB Rows 3x10</span><span>+2 more</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>Start</span>
            </div>
          </div>
        </Link>

        {/* 13-14. ARTICLES */}
        <div className="v2-article-grid">
          <div><NumberLabel n={13} /><ArticleCard title="Understanding your blood sugar numbers" subtitle="What fasting glucose and HbA1c actually tell you about your health" img={IMG.bloodTest} href="/v2/chat" /></div>
          <div><NumberLabel n={14} /><ArticleCard title="5 foods that help prevent Type 2 diabetes" subtitle="Evidence-based dietary choices for metabolic health" img={IMG.food} href="/v2/chat" /></div>
        </div>

        {/* 15. TIP CARD */}
        <NumberLabel n={15} />
        <div style={{ background: "var(--green-bg)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(76,175,80,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Zap size={13} style={{ color: "var(--green-text)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--green-text)" }}>Quick tip</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--green-text)", lineHeight: 1.5 }}>Walking for 20 minutes after meals can reduce blood sugar spikes by up to 30%</p>
        </div>

        {/* 16. BLOOD MARKER SPOTLIGHT */}
        <NumberLabel n={16} />
        <Link href="/v2/blood-tests/results">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <TestTube size={13} style={{ color: "var(--amber)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--amber-text)" }}>Marker spotlight</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Vitamin D: slightly below optimal</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>48 nmol/L (recommended: 50+). Dr. Johansson recommends D3 supplementation.</p>
            <div style={{ position: "relative", height: 10, borderRadius: 5, background: "#f5f5f5" }}>
              <div style={{ position: "absolute", left: "33%", width: "50%", height: "100%", borderRadius: 5, background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.3)" }} />
              <div style={{ position: "absolute", left: "31%", top: -6, transform: "translateX(-50%)" }}><div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "7px solid #ff9800" }} /></div>
            </div>
          </div>
        </Link>

        {/* 17. CHOLESTEROL TREND */}
        <NumberLabel n={17} />
        <Link href="/v2/health">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>5-year trend</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Total cholesterol: {cholHistory[0]?.value} to {cholHistory[cholHistory.length - 1]?.value} mmol/L</p>
            <div style={{ height: 50 }}>
              <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
                grid: { top: 4, right: 4, bottom: 4, left: 4 },
                xAxis: { type: "category", show: false, data: cholHistory.map(h => h.date) },
                yAxis: { type: "value", show: false, min: 4.3, max: 5.5 },
                series: [{ type: "line", smooth: 0.3, data: cholHistory.map(h => h.value),
                  symbol: (v: number, p: { dataIndex: number }) => p.dataIndex === cholHistory.length - 1 ? "circle" : "none",
                  symbolSize: 8, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 },
                  lineStyle: { width: 2, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.3)" }, { offset: 1, color: "#ff9800" }] } },
                  areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.12)" }, { offset: 1, color: "transparent" }] } },
                }],
              }} />
            </div>
          </div>
        </Link>

        {/* 18. TRAINING PROGRESS */}
        <NumberLabel n={18} />
        <Link href="/v2/training">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{TRAINING_PLAN.name}</span>
              <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Week {TRAINING_PLAN.currentWeek} of {TRAINING_PLAN.totalWeeks}. {TRAINING_PLAN.completedThisWeek}/3 workouts this week.</p>
            <div style={{ height: 6, borderRadius: 3, background: "var(--bg-elevated)" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${(TRAINING_PLAN.completedThisWeek / 3) * 100}%`, background: "var(--purple)" }} />
            </div>
          </div>
        </Link>

        {/* 19. WEIGHT TREND */}
        <NumberLabel n={19} />
        <Link href="/v2/health">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Weight</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{BIOMETRICS_HISTORY[0].weight} kg</p>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                <Minus size={10} style={{ color: "var(--text-faint)" }} />
                <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Stable for 3 months</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>BMI {BIOMETRICS_HISTORY[0].bmi}</div>
          </div>
        </Link>

        {/* 20. UPCOMING */}
        <NumberLabel n={20} />
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--blue-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar size={16} style={{ color: "var(--blue)" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>6-month blood retest</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Sep 15, 2026 - included in your membership</p>
          </div>
        </div>

        {/* 21. ACTION ITEM */}
        <NumberLabel n={21} />
        <div style={{ background: "var(--amber-bg)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(255,152,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Pill size={14} style={{ color: "var(--amber-text)" }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--amber-text)" }}>Start Vitamin D3 supplement</p>
              <p style={{ fontSize: 11, color: "var(--amber-text)", opacity: 0.8 }}>2000 IU daily - recommended by Dr. Johansson</p>
            </div>
          </div>
        </div>

        {/* 22-23. ARTICLES */}
        <div className="v2-article-grid">
          <div><NumberLabel n={22} /><ArticleCard title="How FINDRISC predicts your diabetes risk" subtitle="The validated clinical tool behind your risk score" img={IMG.nature} href="/v2/chat" /></div>
          <div><NumberLabel n={23} /><ArticleCard title="What your family history means for your health" subtitle="Your mother's T2D diagnosis and what it means for you" img={IMG.family} href="/v2/chat" /></div>
        </div>

        {/* 24. COMMUNITY */}
        <NumberLabel n={24} />
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ height: 90, position: "relative", background: "#333" }}>
            <img src={IMG.community} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>12,000+</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Precura members taking control</p>
              </div>
            </div>
          </div>
        </div>

        {/* 25. MEMBERSHIP */}
        <NumberLabel n={25} />
        <div style={{ background: "var(--accent-light)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>Precura Annual Member</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Next blood test: Sep 15, 2026</p>
          </div>
          <Link href="/v2/membership" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", padding: "6px 12px", borderRadius: 100, background: "var(--bg-card)", textDecoration: "none" }}>Manage</Link>
        </div>

        {/* 26. UPGRADE */}
        <NumberLabel n={26} />
        <Link href="/v2/membership">
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ height: 80, position: "relative", background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 18px" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Upgrade to Platinum</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>4 blood tests/year + 6-month training plan</p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* 27. ADD-ON */}
        <NumberLabel n={27} />
        <Link href="/v2/blood-tests">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <TestTube size={16} style={{ color: "var(--teal)" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Need an extra blood test?</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Add one anytime for 795 SEK</p>
              </div>
            </div>
            <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />
          </div>
        </Link>

        {/* CURRENT MEDICATIONS - bonus */}
        <NumberLabel n={28} label="28 (bonus)" />
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Pill size={13} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>Current medications</span>
          </div>
          {MEDICATIONS.map((m) => (
            <div key={m.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>{m.name} {m.dose}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.frequency}</span>
            </div>
          ))}
        </div>

        {/* WALKING ARTICLE - bonus */}
        <NumberLabel n={29} label="29 (bonus)" />
        <ArticleCard title="The science behind post-meal walks" subtitle="How 20 minutes of walking regulates blood sugar better than most medications" img={IMG.walking} href="/v2/chat" />

        </div>{/* end v2-main */}

        {/* DESKTOP SIDEBAR - visible only on lg+ screens */}
        <div className="v2-sidebar">
          {/* Doctor */}
          <Link href="/v2/doctor" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 16px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>MJ</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dr. Johansson</p>
                  <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Your Precura physician</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{lastMsg.text.slice(0, 100)}...</p>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", marginTop: 8 }}>View conversation</p>
            </div>
          </Link>

          {/* Membership */}
          <div style={{ background: "var(--accent-light)", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>Precura Annual Member</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>Next blood test: Sep 15, 2026</p>
            <Link href="/v2/membership" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>Manage plan</Link>
          </div>

          {/* Medications */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Current medications</p>
            {MEDICATIONS.map((m) => (
              <div key={m.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ fontSize: 12, color: "var(--text)" }}>{m.name} {m.dose}</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{m.frequency}</span>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Upcoming</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={14} style={{ color: "var(--blue)" }} />
              <div>
                <p style={{ fontSize: 12, color: "var(--text)" }}>6-month blood retest</p>
                <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Sep 15, 2026</p>
              </div>
            </div>
          </div>

          {/* Upgrade */}
          <Link href="/v2/membership" style={{ textDecoration: "none" }}>
            <div style={{ borderRadius: 14, padding: "16px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff" }}>
              <p style={{ fontSize: 14, fontWeight: 700 }}>Upgrade to Platinum</p>
              <p style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>4 blood tests/year + 6-month training</p>
            </div>
          </Link>

          {/* Quick links */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Quick links</p>
            {[
              { label: "Health overview", href: "/v2/health" },
              { label: "Blood test results", href: "/v2/blood-tests/results" },
              { label: "Training plan", href: "/v2/training" },
              { label: "Download health report", href: "/v2/health" },
            ].map((link) => (
              <Link key={link.label} href={link.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", borderBottom: "1px solid var(--divider)" }}>
                {link.label} <ChevronRight size={12} style={{ color: "var(--text-faint)" }} />
              </Link>
            ))}
          </div>
        </div>{/* end v2-sidebar */}

        </div>{/* end v2-grid */}
      </div>{/* end v2-container */}

      {/* FLOATING CHAT */}
      <button onClick={() => setChatOpen(!chatOpen)} style={{ position: "fixed", bottom: 24, right: 24, width: 52, height: 52, borderRadius: 16, background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(92,107,192,0.35)", zIndex: 50 }}>
        {chatOpen ? <X size={20} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>

      {chatOpen && (
        <div style={{ position: "fixed", bottom: 88, right: 20, width: "calc(100% - 40px)", maxWidth: 380, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow-lg)", zIndex: 49 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} style={{ color: "var(--accent)" }} /><span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Precura</span></div>
            <Link href="/v2/doctor" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>Message Doctor</Link>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={10} style={{ color: "var(--accent)" }} /></div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, background: "var(--bg-elevated)", padding: "8px 12px", borderRadius: "4px 12px 12px 12px" }}>Hi Anna! I have your full health history. What would you like to know?</p>
            </div>
          </div>
          <div style={{ padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid var(--divider)" }}>
            {["Why is my glucose rising?", "Explain my blood results", "Am I at risk?"].map((q) => (
              <Link key={q} href="/v2/chat" style={{ fontSize: 10, fontWeight: 500, padding: "5px 10px", borderRadius: 100, background: "var(--accent-light)", color: "var(--accent)", textDecoration: "none" }}>{q}</Link>
            ))}
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--divider)", display: "flex", gap: 8 }}>
            <input placeholder="Ask anything..." style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px", fontSize: 13, background: "var(--bg-elevated)", outline: "none", color: "var(--text)" }} />
            <button style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Send size={14} color="#fff" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Helper Components ---- */

function NumberLabel({ n, label }: { n: number; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", background: "var(--accent-light)", padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-mono)" }}>#{label || n}</span>
    </div>
  );
}

function Sec({ title }: { title: string }) {
  return <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>{title}</p>;
}

function QCard({ n, icon, color, label, sub, href }: { n: number; icon: React.ReactNode; color: string; label: string; sub: string; href: string }) {
  return (
    <Link href={href} style={{ flexShrink: 0, textDecoration: "none" }}>
      <div style={{ width: 130, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 14px 12px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: `var(--${color})` }}>{icon}</div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{sub}</p>
      </div>
    </Link>
  );
}

function HM({ n, label, value, unit, color, trend, href }: { n: number; label: string; value: string; unit?: string; color: string; trend: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px", boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: `var(--${color}-text)`, fontFamily: unit ? "var(--font-mono)" : "inherit" }}>{value}</span>
          {unit && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{unit}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
          {trend === "worsening" ? <TrendingUp size={10} style={{ color: "var(--amber)" }} /> : <Minus size={10} style={{ color: "var(--text-faint)" }} />}
          <span style={{ fontSize: 10, color: trend === "worsening" ? "var(--amber)" : "var(--text-faint)" }}>{trend === "worsening" ? "Trending up" : "Stable"}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ title, subtitle, img, href }: { title: string; subtitle: string; img: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow-sm)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ height: 100, position: "relative", background: "#eee" }}>
          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "12px 14px" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: 3 }}>{title}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{subtitle}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
            <BookOpen size={12} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)" }}>Read more</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
