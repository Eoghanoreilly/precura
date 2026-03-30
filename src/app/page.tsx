"use client";

import Link from "next/link";
import { Activity, Brain, TestTube, Shield, ArrowRight, ChevronRight, Heart, Sparkles } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--accent-light)", boxShadow: "var(--shadow-sm)" }}
          >
            <Activity size={18} style={{ color: "var(--accent)" }} />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>
            Precura
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold px-5 py-2.5 rounded-full"
          style={{
            color: "var(--accent)",
            background: "var(--accent-light)",
            border: "1px solid transparent",
          }}
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 pb-10">
        {/* Hero section with gradient bg */}
        <div
          className="w-full rounded-3xl px-6 pt-16 pb-12 mb-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #fef7ee 40%, #f0fdf4 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div className="blob-1" style={{ top: "-80px", right: "-60px" }} />
          <div className="blob-2" style={{ bottom: "-100px", left: "-80px" }} />

          <div className="max-w-xl mx-auto relative">
            {/* Badge */}
            <div
              className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                background: "rgba(255,255,255,0.8)",
                color: "var(--teal-text)",
                backdropFilter: "blur(8px)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Sparkles size={14} style={{ color: "var(--teal)" }} />
              Validated clinical risk models
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in stagger-1 text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-6"
              style={{ color: "var(--text)", opacity: 0 }}
            >
              Know your health risks
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                before they find you
              </span>
            </h1>

            {/* Sub */}
            <p
              className="animate-fade-in stagger-2 text-base sm:text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: "var(--text-secondary)", opacity: 0 }}
            >
              Precura uses the same risk models your doctor uses - and shows you
              what they would tell you, before you need to ask.
            </p>

            {/* CTA */}
            <div
              className="animate-fade-in stagger-3 flex flex-col sm:flex-row gap-3"
              style={{ opacity: 0 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white"
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 4px 14px rgba(92, 107, 192, 0.3)",
                }}
              >
                Get started free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
                style={{
                  color: "var(--text-secondary)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--border)",
                }}
              >
                How it works
              </Link>
            </div>

            {/* Hero illustration placeholder */}
            <div className="animate-fade-in stagger-4 mt-10" style={{ opacity: 0 }}>
              <ImagePlaceholder
                number={1}
                height="220px"
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
                className="rounded-3xl"
              />
              <p className="text-[10px] text-center mt-2" style={{ color: "var(--text-faint)", fontFamily: "var(--font-space-mono)" }}>
                Hero illustration - health data visualization
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-xl w-full">
          {/* Mock dashboard preview */}
          <div
            className="animate-fade-in stagger-4 rounded-3xl p-6 mb-12"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              opacity: 0,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--amber-bg)" }}>
                  <Activity size={18} style={{ color: "var(--amber)" }} />
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    FINDRISC Assessment
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    Type 2 Diabetes Risk
                  </p>
                </div>
              </div>
              <div
                className="px-3.5 py-1.5 rounded-full text-xs font-bold"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  background: "var(--amber-bg)",
                  color: "var(--amber-text)",
                }}
              >
                12/26
              </div>
            </div>
            {/* Score bar */}
            <div
              className="h-3 rounded-full mb-3 overflow-hidden"
              style={{ background: "var(--bg-elevated)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "46%",
                  background: "linear-gradient(90deg, var(--teal), var(--amber))",
                }}
              />
            </div>
            <div
              className="flex justify-between text-xs"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "var(--text-muted)",
              }}
            >
              <span>Low</span>
              <span style={{ color: "var(--amber-text)", fontWeight: 600 }}>Moderate</span>
              <span>Very high</span>
            </div>
          </div>

          {/* Features */}
          <div id="how-it-works" className="mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              How Precura works
            </p>
            <div className="grid gap-4">
              {[
                {
                  icon: Shield,
                  title: "Answer simple questions",
                  desc: "Complete a quick health questionnaire. The same inputs your doctor would collect.",
                  color: "teal",
                  bg: "#e0f2f1",
                },
                {
                  icon: Brain,
                  title: "Get your risk profile",
                  desc: "We run validated clinical risk models against your data and show you the results in plain language.",
                  color: "purple",
                  bg: "#ede7f6",
                },
                {
                  icon: TestTube,
                  title: "Go deeper with blood tests",
                  desc: "Order targeted blood panels through us. AI analyzes results and updates your risk profile.",
                  color: "amber",
                  bg: "#fff8e1",
                },
              ].map((feature, i) => (
                <div
                  key={feature.title}
                  className="card-hover rounded-2xl overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <ImagePlaceholder
                    number={i + 2}
                    height="120px"
                    gradient={[
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
                      "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
                    ][i]}
                    className="rounded-none"
                  />
                  <div className="flex gap-4 p-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: feature.bg }}
                    >
                      <feature.icon
                        size={20}
                        style={{ color: `var(--${feature.color})` }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1.5"
                        style={{ color: "var(--text)" }}
                      >
                        {feature.title}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div
            className="rounded-2xl p-6 mb-10"
            style={{
              background: "var(--bg-warm)",
              border: "1px solid #fde8cd",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} style={{ color: "var(--amber)" }} />
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--amber-text)" }}
              >
                Built with trust
              </p>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              Founded by a doctor and an engineer in Sweden. Precura uses
              published, peer-reviewed risk models - the same tools clinicians
              use. We show you the methodology behind every score.
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "var(--text-muted)",
              }}
            >
              FINDRISC / SCORE2 / FRAX
            </p>
          </div>

          {/* Bottom CTA */}
          <Link
            href="/login"
            className="flex items-center justify-between w-full p-5 rounded-2xl font-semibold text-sm"
            style={{
              background: "var(--accent)",
              color: "white",
              boxShadow: "0 4px 14px rgba(92, 107, 192, 0.25)",
            }}
          >
            <span>Start your free risk assessment</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p
          className="text-xs"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "var(--text-faint)",
          }}
        >
          Precura is not a medical device. Observations are educational, not diagnostic.
        </p>
      </footer>
    </div>
  );
}
