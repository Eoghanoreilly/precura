"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Sparkles,
  ShieldAlert,
  User,
} from "lucide-react";
import {
  PATIENT,
  SCREENING_SCORES,
  RISK_ASSESSMENTS,
  BLOOD_TEST_HISTORY,
  MEDICATIONS,
  CONDITIONS,
  FAMILY_HISTORY,
} from "@/lib/v2/mock-patient";

interface ChatMessage {
  id: string;
  from: "user" | "ai";
  text: string;
}

const SUGGESTION_CHIPS = [
  "Why is my glucose rising?",
  "What does my FINDRISC score mean?",
  "Is my cholesterol a problem?",
  "Explain my medications",
  "How does my family history affect me?",
];

// Build the AI response referencing real patient data
const glucoseHistory = BLOOD_TEST_HISTORY
  .flatMap((session) =>
    session.results
      .filter((r) => r.shortName === "f-Glucose")
      .map((r) => ({ year: new Date(session.date).getFullYear(), value: r.value }))
  )
  .sort((a, b) => a.year - b.year);

const glucoseTrendString = glucoseHistory
  .map((g) => `${g.value} (${g.year})`)
  .join(" -> ");

const latestHbA1c = BLOOD_TEST_HISTORY[0]?.results.find(
  (r) => r.shortName === "HbA1c"
);

const motherHistory = FAMILY_HISTORY.find((f) => f.relative === "Mother");

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "ai-greeting",
    from: "ai",
    text: `Hi ${PATIENT.firstName}! I have access to your complete health profile, including your 1177 medical history, blood test results going back to 2021, and your current medications. What would you like to know?`,
  },
];

const MOCK_CONVERSATION: ChatMessage[] = [
  {
    id: "user-1",
    from: "user",
    text: "Why is my glucose rising?",
  },
  {
    id: "ai-1",
    from: "ai",
    text: `Looking at your blood test history over the past 5 years, your fasting glucose has increased steadily: ${glucoseTrendString}. While ${glucoseHistory[glucoseHistory.length - 1]?.value} is still within the normal range (3.9-6.0), the consistent upward trend is worth paying attention to, especially given your family history${motherHistory ? ` - your ${motherHistory.relative.toLowerCase()} was diagnosed with Type 2 diabetes at ${motherHistory.ageAtDiagnosis}` : ""}.\n\nYour HbA1c (long-term blood sugar) is ${latestHbA1c?.value ?? "N/A"} ${latestHbA1c?.unit ?? ""}, which is normal but has also been slowly rising. Dr. Johansson is monitoring this closely.\n\nThe training plan you're on targets exactly this - regular activity improves insulin sensitivity. Your next blood test in September will help us see if the trend is stabilizing.`,
  },
];

// Pre-built responses for suggestion chips
const CHIP_RESPONSES: Record<string, string> = {
  "What does my FINDRISC score mean?": `Your FINDRISC score is ${SCREENING_SCORES.findrisc.score} out of ${SCREENING_SCORES.findrisc.maxScore}, which puts you in the "${SCREENING_SCORES.findrisc.level}" risk category. FINDRISC (Finnish Diabetes Risk Score) estimates your 10-year risk of developing Type 2 diabetes based on factors like age, BMI, waist circumference, physical activity, diet, blood pressure history, and family history.\n\nA score of ${SCREENING_SCORES.findrisc.score} means roughly a 1-in-6 chance of developing Type 2 diabetes in the next decade. The biggest contributors to your score are your family history (mother with T2D) and your waist measurement (86 cm, approaching the 88 cm risk threshold).\n\nThe good news: most of the risk factors are modifiable. The training plan and dietary changes Dr. Johansson recommended directly target the factors you can change.`,

  "Is my cholesterol a problem?": `Your total cholesterol is ${BLOOD_TEST_HISTORY[0]?.results.find((r) => r.shortName === "TC")?.value ?? "N/A"} mmol/L, which is marginally above the recommended upper limit of 5.0. However, the picture is more nuanced than just the total number.\n\nYour HDL ("good" cholesterol) is ${BLOOD_TEST_HISTORY[0]?.results.find((r) => r.shortName === "HDL")?.value ?? "N/A"} mmol/L - that's actually a healthy level. HDL protects against heart disease.\n\nYour LDL ("bad" cholesterol) is ${BLOOD_TEST_HISTORY[0]?.results.find((r) => r.shortName === "LDL")?.value ?? "N/A"} mmol/L, just under the 3.0 threshold.\n\nYour triglycerides are ${BLOOD_TEST_HISTORY[0]?.results.find((r) => r.shortName === "TG")?.value ?? "N/A"} mmol/L - normal.\n\nGiven your father's heart attack at ${FAMILY_HISTORY.find((f) => f.relative === "Father")?.ageAtDiagnosis ?? "N/A"}, it's worth keeping an eye on. But right now, lifestyle measures (exercise, diet) are the right approach - medication isn't indicated at these levels.`,

  "Explain my medications": `You're currently on ${MEDICATIONS.filter((m) => m.active).length} active medications:\n\n1. ${MEDICATIONS[0]?.name} ${MEDICATIONS[0]?.dose} (${MEDICATIONS[0]?.frequency}) - This is for your blood pressure. Your hypertension was diagnosed in March 2022 when your BP was consistently around 142/88. On Enalapril, it's come down to 132/82, which is well controlled. This medication also provides some kidney protection, which is a bonus given your glucose trend.\n\n2. ${MEDICATIONS[1]?.name} ${MEDICATIONS[1]?.dose} (${MEDICATIONS[1]?.frequency}) - This is an antihistamine for your seasonal allergies (birch and grass pollen). You take it as needed, mainly during spring and summer.\n\nBoth medications are well-tolerated, and Dr. Johansson sees no reason to change them. The Enalapril in particular is doing its job well.`,

  "How does my family history affect me?": `Your family history is one of the most important parts of your health picture. Here's what it means:\n\nMaternal side:\n- Your mother was diagnosed with Type 2 diabetes at age ${FAMILY_HISTORY[0]?.ageAtDiagnosis}\n- Your maternal grandmother also had T2D (diagnosed at ${FAMILY_HISTORY[2]?.ageAtDiagnosis})\n\nThis strong maternal diabetes history significantly increases your risk - it's the main reason your FINDRISC score is elevated. You're now 40, which means the next 15-20 years are the key window for prevention.\n\nPaternal side:\n- Your father had a heart attack at age ${FAMILY_HISTORY[1]?.ageAtDiagnosis}\n- Your paternal grandfather had a stroke at ${FAMILY_HISTORY[3]?.ageAtDiagnosis}\n\nThis cardiovascular history, combined with your mild hypertension and borderline cholesterol, is why Dr. Johansson monitors your heart health too. Your SCORE2 cardiovascular risk is currently estimated at ~${RISK_ASSESSMENTS.cardiovascular.tenYearRisk}.\n\nThe crucial thing to understand: family history isn't destiny. It means you need to be more proactive than average, which is exactly what you're doing with Precura.`,
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    ...INITIAL_MESSAGES,
    ...MOCK_CONVERSATION,
  ]);
  const [inputText, setInputText] = useState("");
  const [showChips, setShowChips] = useState(true);

  // Filter out chips that have already been asked
  const askedQuestions = messages
    .filter((m) => m.from === "user")
    .map((m) => m.text);
  const remainingChips = SUGGESTION_CHIPS.filter(
    (chip) => !askedQuestions.includes(chip)
  );

  function handleSendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: text.trim(),
    };

    const aiResponse = CHIP_RESPONSES[text.trim()];
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      from: "ai",
      text:
        aiResponse ??
        `That's a great question. Based on your health profile, I can see several relevant data points. For a detailed clinical answer, I'd recommend discussing this with Dr. Johansson - you can message him directly from the My Doctor page.`,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText("");
    setShowChips(true);
  }

  function handleChipClick(chip: string) {
    handleSendMessage(chip);
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 py-4 flex items-center gap-3"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <button
          onClick={() => router.push("/v2/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--purple-bg)" }}
          >
            <Sparkles size={15} style={{ color: "var(--purple)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Precura
          </p>
        </div>
      </div>

      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-5 py-5">
          {/* Disclaimer */}
          <div
            className="rounded-xl px-3.5 py-2.5 mb-5 flex items-start gap-2.5 animate-fade-in"
            style={{
              background: "var(--amber-bg)",
              border: "1px solid #ffe0b2",
            }}
          >
            <ShieldAlert
              size={15}
              className="shrink-0 mt-0.5"
              style={{ color: "var(--amber-text)" }}
            />
            <p className="text-xs leading-relaxed" style={{ color: "var(--amber-text)" }}>
              Health assistant - not medical advice. Your doctor is always available
              for clinical guidance.
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`flex gap-2.5 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                  style={{ maxWidth: "90%" }}
                >
                  {/* Avatar */}
                  {msg.from === "ai" ? (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: "var(--purple-bg)" }}
                    >
                      <Sparkles size={13} style={{ color: "var(--purple)" }} />
                    </div>
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: "var(--accent-light)" }}
                    >
                      <User size={13} style={{ color: "var(--accent)" }} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={
                      msg.from === "user"
                        ? {
                            background: "var(--accent)",
                            color: "#ffffff",
                            borderBottomRightRadius: "6px",
                          }
                        : {
                            background: "var(--bg-card)",
                            color: "var(--text)",
                            border: "1px solid var(--border)",
                            borderBottomLeftRadius: "6px",
                          }
                    }
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p
                        key={i}
                        className={`text-sm leading-relaxed ${i > 0 ? "mt-2" : ""}`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion Chips */}
          {showChips && remainingChips.length > 0 && (
            <div className="mt-4 mb-2 animate-fade-in">
              <div className="flex flex-wrap gap-2">
                {remainingChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3.5 py-2 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      color: "var(--accent)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar - fixed at bottom */}
      <div
        className="sticky bottom-0 z-10 px-5 py-3.5 safe-bottom"
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--divider)",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-md mx-auto flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputText);
              }
            }}
            placeholder="Ask about your health..."
            rows={1}
            className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "16px",
              maxHeight: "100px",
            }}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: inputText.trim()
                ? "var(--accent)"
                : "var(--bg-elevated)",
              cursor: inputText.trim() ? "pointer" : "default",
            }}
          >
            <Send
              size={16}
              style={{
                color: inputText.trim() ? "#ffffff" : "var(--text-faint)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
