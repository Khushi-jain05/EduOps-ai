import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { PiRobotBold } from "react-icons/pi";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { askAdmissions } from "../../services/applicant.service";

const SUGGESTIONS = [
  "Which programs are open for 2026?",
  "What is the fee for the MBA program?",
  "Do you offer scholarships?",
  "How many seats does B.Tech CSE have?",
];

export default function AdmissionsAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Admissions AI. Ask me about programs, fees, eligibility or the application process.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const { answer } = await askAdmissions(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer || "Sorry, I couldn't find an answer." },
      ]);
    } catch (err) {
      console.error("Admissions AI failed", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "35px", overflow: "hidden" }}>
          <h1 style={{ margin: 0, color: "#111827" }}>Admissions AI</h1>
          <p style={{ color: "#64748B", marginTop: "6px" }}>
            Instant answers about programs, fees and admissions — 24/7.
          </p>

          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: "22px",
              padding: "24px",
              marginTop: "22px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "14px 18px",
                      borderRadius: "16px",
                      background: m.role === "user" ? "#2563EB" : "#F1F5F9",
                      color: m.role === "user" ? "#fff" : "#111827",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B" }}>
                  <PiRobotBold /> Thinking...
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "14px 0" }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      border: "1px solid #DDE5F0",
                      background: "#fff",
                      borderRadius: "999px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#334155",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about admissions..."
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1px solid #DDE5F0",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              <button
                onClick={() => send()}
                disabled={loading}
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "0 22px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 600,
                }}
              >
                <FiSend /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
