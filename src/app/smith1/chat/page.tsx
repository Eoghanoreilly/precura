"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PATIENT,
  RISK_ASSESSMENTS,
  getLatestMarker,
  TRAINING_PLAN,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  Clock,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "sys-1",
    role: "assistant",
    text: `Hi ${PATIENT.firstName}! I'm your Precura health assistant. I have access to your complete health history, blood tests, risk assessments, and training plan. I can help you understand your results, explain medical terms in plain language, or answer questions about your health journey. What would you like to know?`,
    time: "Now",
  },
];

const SUGGESTED_QUESTIONS = [
  "Why is my glucose rising and what can I do about it?",
  "Explain my diabetes risk in simple terms",
  "What did Dr. Johansson say about my latest results?",
  "How does my training plan help my blood sugar?",
  "What is HbA1c and why does it matter?",
  "Am I at risk for metabolic syndrome?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "Why is my glucose rising and what can I do about it?": `Great question. Your fasting glucose (blood sugar measured after not eating overnight) has gone from 5.0 mmol/L in 2021 to 5.8 mmol/L now. That's still technically in the normal range (under 6.0), but the steady upward trend over 5 years is what concerns your doctor.

Why it's rising: A combination of factors. Your mother was diagnosed with Type 2 diabetes at 58, so there's a genetic component. Your BMI is 27.6 (slightly overweight), and your waist circumference (86 cm) is approaching the threshold for metabolic risk (88 cm for women).

What you can do: The good news is that this trajectory can be changed.

1. Keep following your training plan - the combination of resistance training and walking intervals directly improves insulin sensitivity
2. Add a 15-20 minute walk after dinner - this is one of the most effective ways to lower post-meal blood sugar
3. Your Vitamin D is slightly low (48 nmol/L, target is 50+) - Dr. Johansson recommended a D3 supplement, which may also help glucose regulation
4. Your next blood test in September will show whether these changes are working`,

  "Explain my diabetes risk in simple terms": `Your 10-year risk of developing Type 2 diabetes is estimated at around 17%. Here's what that means in plain terms:

If we took 100 people with your exact profile - age, family history, blood sugar levels, weight, activity level - roughly 17 of them would develop Type 2 diabetes within the next 10 years.

The main factors driving your risk:
- Family history: Your mother got T2D at 58, your grandmother at 62. This is the biggest non-changeable factor
- Blood sugar trend: Going from 5.0 to 5.8 over 5 years shows your body is gradually becoming less efficient at processing sugar
- Weight: BMI 27.6 and waist 86 cm put extra strain on your insulin system

The encouraging part: Your HbA1c (long-term blood sugar) is 38 mmol/mol, which is still well within normal. The pre-diabetic threshold is 42. So you have time and room to act.

Your training plan was specifically designed to improve insulin sensitivity. Combined with the dietary advice from Dr. Johansson, you have realistic tools to slow or reverse this trend.`,

  "What did Dr. Johansson say about my latest results?": `Dr. Johansson reviewed your March 2026 blood panel and highlighted several things:

Key findings:
- Fasting glucose at 5.8 mmol/L - upper normal, continuing the upward trend he's been tracking
- HbA1c (long-term blood sugar) at 38 - still normal but approaching the pre-diabetic threshold of 42
- Total cholesterol at 5.1 - slightly above the recommended 5.0
- Vitamin D at 48 - just below the optimal level of 50

His assessment: Your overall metabolic trajectory is concerning given your strong family history of diabetes and heart disease. You currently meet 2 of the 5 criteria for metabolic syndrome, with your waist measurement approaching the third threshold.

His plan:
1. Continue the current training plan targeting metabolic health
2. Start Vitamin D3 supplementation (2000 IU daily)
3. Retest the full blood panel in September 2026
4. If glucose keeps rising, he may recommend an OGTT (a more detailed glucose tolerance test)

He specifically noted that your previous GP documented each individual result as "normal" but never flagged the multi-year trend - which is exactly the pattern Precura is designed to catch.`,

  "How does my training plan help my blood sugar?": `Your Metabolic Health Program was designed specifically to target insulin sensitivity - which directly affects blood sugar regulation. Here's how each component helps:

Resistance training (Monday upper body, Wednesday lower body): When your muscles contract during exercises like squats and rows, they pull glucose from your blood for energy - even without insulin. After training, your muscles stay more sensitive to insulin for 24-48 hours. This means your body needs less insulin to process the same amount of sugar.

Walking intervals (Friday): The brisk walk intervals (2 min fast, 1 min easy for 20 minutes) improve cardiovascular fitness, which enhances how your body uses glucose. Post-meal walks are especially effective.

Core work: While this doesn't directly affect blood sugar, a stronger core supports the other exercises and protects your back (given your 2023 back strain history).

You're in week ${TRAINING_PLAN.currentWeek} of ${TRAINING_PLAN.totalWeeks} with ${TRAINING_PLAN.totalCompleted} sessions completed. Good consistency. The research shows 12+ weeks of regular resistance training can meaningfully improve insulin sensitivity.

Dr. Johansson reviewed and approved this program with your blood pressure and back history in mind.`,

  "What is HbA1c and why does it matter?": `HbA1c (also called glycated hemoglobin) measures your average blood sugar over the past 2-3 months. Think of it as a "blood sugar history report" rather than a snapshot.

How it works: Red blood cells live for about 3 months. When blood sugar is high, sugar molecules stick to the hemoglobin in your red blood cells. HbA1c measures the percentage of hemoglobin with sugar attached.

Your number: 38 mmol/mol. The ranges are:
- Normal: under 42 mmol/mol
- Pre-diabetic: 42-47 mmol/mol
- Diabetic: 48+ mmol/mol

So at 38, you're in the normal range with some room before the pre-diabetic threshold. But given your fasting glucose trend (rising from 5.0 to 5.8), your doctor is watching this closely.

Why it matters more than a single glucose test: A fasting glucose reading can vary day to day based on what you ate, how you slept, stress levels. HbA1c gives a more stable picture of your overall blood sugar control. That's why Dr. Johansson orders both - the glucose shows the current state, HbA1c shows the trend.`,

  "Am I at risk for metabolic syndrome?": `Metabolic syndrome is diagnosed when someone meets 3 or more of 5 specific criteria. You currently meet 2 of 5:

Met (2):
1. Blood pressure above 130/85 - yours is 132/82 (controlled with Enalapril medication)
2. Fasting glucose above 5.6 mmol/L - yours is 5.8 (borderline and rising)

Not met (3):
3. Waist circumference above 88 cm (for women) - yours is 86 cm. Close but under
4. Triglycerides (blood fats) above 1.7 mmol/L - yours is 1.3. Normal
5. HDL (good cholesterol) below 1.3 mmol/L (for women) - yours is 1.6. Healthy

The concern: You're close on the waist measurement (86 vs 88 cm threshold), and your glucose is on a rising trend. If either of those tips over, you'd meet 3 of 5 criteria.

Dr. Johansson flagged this trajectory in his notes. The training plan and dietary recommendations are specifically aimed at preventing you from crossing into metabolic syndrome territory. The September blood test will be an important checkpoint.`,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function handleSend(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim(),
      time: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response =
        MOCK_RESPONSES[text.trim()] ||
        `Based on your health data, I can see that your main area of focus should be the rising glucose trend. Your fasting glucose has gone from 5.0 to 5.8 mmol/L over 5 years. Combined with your family history of Type 2 diabetes (mother diagnosed at 58) and your current training plan in week ${TRAINING_PLAN.currentWeek}, you're taking the right steps. Would you like me to go deeper into any specific area of your health?`;

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: response,
        time: "Just now",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div className="mb-4">
        <Link
          href="/smith1"
          className="flex items-center gap-1 mb-4"
          style={{
            color: "#B8C5D6",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(124, 58, 237, 0.15)",
            }}
          >
            <Sparkles size={16} style={{ color: "#7C3AED" }} />
          </div>
          <div>
            <h1
              style={{
                color: "#F5F7FA",
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              }}
            >
              Health Assistant
            </h1>
            <p
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Trained on your health history
            </p>
          </div>
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-2"
              style={{
                background: "rgba(124, 58, 237, 0.08)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                borderRadius: 8,
                color: "#A78BFA",
                fontSize: 12,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 mb-4"
        style={{
          background: "#141F2E",
          borderRadius: 12,
          border: "1px solid #1F2D42",
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}
                style={{ maxWidth: "85%" }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    background: isUser
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(124, 58, 237, 0.15)",
                    marginTop: 2,
                  }}
                >
                  {isUser ? (
                    <User size={14} style={{ color: "#B8C5D6" }} />
                  ) : (
                    <Bot size={14} style={{ color: "#7C3AED" }} />
                  )}
                </div>
                <div
                  className="p-3"
                  style={{
                    background: isUser
                      ? "rgba(124, 58, 237, 0.12)"
                      : "rgba(255,255,255,0.04)",
                    borderRadius: isUser
                      ? "12px 12px 4px 12px"
                      : "12px 12px 12px 4px",
                    border: isUser
                      ? "1px solid rgba(124, 58, 237, 0.2)"
                      : "1px solid #1F2D42",
                  }}
                >
                  <div
                    style={{
                      color: "#F5F7FA",
                      fontSize: 13,
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    className="mt-1"
                    style={{
                      color: "#B8C5D6",
                      fontSize: 10,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: "rgba(124, 58, 237, 0.15)",
              }}
            >
              <Bot size={14} style={{ color: "#7C3AED" }} />
            </div>
            <div
              className="px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "12px 12px 12px 4px",
                border: "1px solid #1F2D42",
              }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      background: "#7C3AED",
                      opacity: 0.4,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="flex items-end gap-2 p-3"
        style={{
          background: "#141F2E",
          borderRadius: 12,
          border: "1px solid #1F2D42",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(input);
            }
          }}
          placeholder="Ask about your health..."
          rows={1}
          className="flex-1 p-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #1F2D42",
            borderRadius: 8,
            color: "#F5F7FA",
            fontSize: 13,
            resize: "none",
            outline: "none",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        />
        <button
          onClick={() => handleSend(input)}
          className="flex items-center justify-center p-2.5"
          style={{
            background: "#7C3AED",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <Send size={16} style={{ color: "#FFFFFF" }} />
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
