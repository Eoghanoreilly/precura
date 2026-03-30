"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, AlertTriangle, Bot, Loader2 } from "lucide-react";
import { getUser } from "@/lib/auth";
import { getOrMockFindriscResult, getOrMockFindriscInputs } from "@/lib/mock-data";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

function getMockResponse(
  message: string,
  score: number,
  riskLabel: string,
  breakdown: Record<string, { points: number; label: string; value: unknown }>
): string {
  const lower = message.toLowerCase();

  const contributingFactors = Object.entries(breakdown)
    .filter(([, v]) => v.points > 0)
    .sort(([, a], [, b]) => b.points - a.points);

  if (lower.includes("why") || lower.includes("risk") || lower.includes("level")) {
    const topFactors = contributingFactors
      .slice(0, 3)
      .map(([, v]) => `- ${v.label}: contributing ${v.points} point${v.points > 1 ? "s" : ""} to your score`)
      .join("\n");

    return `Your FINDRISC score of ${score}/26 is shaped by several factors. Here are the biggest contributors:\n\n${topFactors}\n\nSome of these are things you can influence (like activity and weight), while others (like age and family history) are fixed. The good news is that even small changes in modifiable factors can meaningfully shift your risk over time.\n\nRemember, this is an educational risk estimate, not a diagnosis.`;
  }

  if (lower.includes("change") || lower.includes("improve") || lower.includes("reduce")) {
    const modifiable = contributingFactors.filter(([key]) =>
      ["activity", "diet", "bmi", "waist"].includes(key)
    );

    const suggestions: string[] = [];
    for (const [key] of modifiable) {
      if (key === "activity")
        suggestions.push("- Physical activity: Research shows 30+ minutes of moderate activity daily can significantly reduce diabetes risk. Even brisk walking counts.");
      if (key === "diet")
        suggestions.push("- Daily fruits and vegetables: Aiming for at least 5 portions a day of varied fruits and vegetables supports metabolic health.");
      if (key === "bmi")
        suggestions.push("- Body weight: Studies show that even a 5-7% weight reduction can cut Type 2 diabetes risk substantially.");
      if (key === "waist")
        suggestions.push("- Waist circumference: Reducing abdominal fat is particularly impactful. This often improves alongside general weight management and exercise.");
    }

    if (suggestions.length === 0) {
      suggestions.push("- Stay physically active for at least 30 minutes daily");
      suggestions.push("- Maintain a balanced diet rich in fruits, vegetables, and whole grains");
      suggestions.push("- Keep a healthy weight");
    }

    return `Based on your profile, here are modifiable factors that research suggests can help reduce diabetes risk:\n\n${suggestions.join("\n")}\n\nThese are general observations from published research, not personal medical recommendations. A healthcare professional can help you build a plan tailored to your situation. Would you like to book a consultation?`;
  }

  if (lower.includes("findrisc") || lower.includes("model") || lower.includes("how")) {
    return `FINDRISC stands for the Finnish Diabetes Risk Score. It was developed by researchers at the Finnish National Institute for Health and Welfare and has been validated across multiple populations worldwide.\n\nIt estimates your 10-year probability of developing Type 2 diabetes based on 8 factors: age, BMI, waist circumference, physical activity, diet, blood pressure medication use, history of high blood glucose, and family history of diabetes.\n\nThe score ranges from 0 to 26. It is the same tool used by many healthcare systems in Europe for population-level diabetes screening. Precura runs this model so you can see your results and track changes over time.\n\nWould you like to know more about your specific contributing factors?`;
  }

  return "That's a great question. Based on your profile, I'd suggest discussing this with a healthcare professional for personalized advice. Would you like to book a consultation?";
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("there");
  const [score, setScore] = useState(0);
  const [riskLabel, setRiskLabel] = useState("");
  const [breakdown, setBreakdown] = useState<Record<string, { points: number; label: string; value: unknown }>>({});
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = getUser();
    const result = getOrMockFindriscResult();
    const name = user?.name?.split(" ")[0] || "there";

    setUserName(name);
    setScore(result.score);
    setRiskLabel(result.riskLabel);
    setBreakdown(result.breakdown);

    const initialMessage: Message = {
      id: "initial",
      role: "ai",
      text: `Hi ${name}! I can see your diabetes risk profile. Your FINDRISC score is ${result.score}/26, which puts you at ${result.riskLabel.toLowerCase()} risk. What would you like to know about your results?`,
    };
    setMessages([initialMessage]);
    setInitialized(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getMockResponse(text, score, riskLabel, breakdown);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  }

  const suggestedChips = [
    "Why is my risk at this level?",
    "What can I change?",
    "Tell me about FINDRISC",
  ];

  const showChips = messages.length === 1 && !isTyping;

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--purple-bg)" }}
          >
            <Bot size={16} style={{ color: "var(--purple)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Precura AI
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Health assistant
            </p>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <div
        className="px-4 py-2 flex items-center gap-2"
        style={{ background: "var(--amber-bg)" }}
      >
        <AlertTriangle size={14} style={{ color: "var(--amber-text)" }} />
        <p className="text-xs" style={{ color: "var(--amber-text)" }}>
          Precura observations are educational, not medical advice
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className="max-w-[85%] rounded-2xl px-4 py-3"
              style={{
                background:
                  msg.role === "user"
                    ? "var(--purple-bg)"
                    : "var(--bg-card)",
                border:
                  msg.role === "ai"
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{
                  color:
                    msg.role === "user"
                      ? "var(--purple-text)"
                      : "var(--text)",
                }}
              >
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Suggested chips */}
        {showChips && (
          <div className="flex flex-wrap gap-2 animate-fade-in-up">
            {suggestedChips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="px-3 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--purple-text)",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-2"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <Loader2
                size={14}
                className="animate-spin"
                style={{ color: "var(--text-muted)" }}
              />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="shrink-0 px-4 py-3 safe-bottom"
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about your results..."
            className="flex-1 px-4 py-3 rounded-xl"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-input)",
              color: "var(--text)",
              fontSize: "16px",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: input.trim() ? "var(--purple)" : "var(--bg-elevated)",
              opacity: input.trim() && !isTyping ? 1 : 0.5,
            }}
          >
            <Send
              size={18}
              style={{
                color: input.trim() ? "white" : "var(--text-muted)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
