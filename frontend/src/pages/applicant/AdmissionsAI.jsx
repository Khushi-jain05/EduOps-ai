import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSend,
  FiClock,
  FiMessageSquare,
  FiShield,
  FiFileText,
  FiCalendar,
  FiBook,
} from "react-icons/fi";
import { PiRobotBold } from "react-icons/pi";

import { ApplicantPage, ApplicantHero, StatRow } from "../../components/applicant/ApplicantShell";
import { heroWhiteBtn } from "../../components/applicant/styles";
import { askAdmissions } from "../../services/applicant.service";

const POPULAR = [
  "Cut-offs & merit list 2026",
  "Hostel facilities & fees",
  "Scholarships & EMI options",
  "Placement record (last 3 yrs)",
  "International exchange programs",
];

const SUGGESTIONS = [
  { icon: <FiBook />, text: "What are the eligibility criteria for B.Tech CSE?" },
  { icon: "₹", text: "What's the fee structure & scholarships for MBA?" },
  { icon: <FiFileText />, text: "What documents do I need to apply?" },
  { icon: <FiCalendar />, text: "Help me book a campus visit this weekend" },
];

export default function AdmissionsAI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Admissions AI assistant. Ask me anything about programs, eligibility, fees, scholarships, hostel, placements — or I can help you apply and book a counseling slot. What would you like to know?",
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
      setMessages((prev) => [...prev, { role: "assistant", content: answer || "Sorry, I couldn't find an answer." }]);
    } catch (err) {
      console.error("Admissions AI failed", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicantPage>
      <ApplicantHero
        tag="Applicant • Admissions AI"
        title="Admissions AI"
        subtitle="Instant, accurate answers about programs, fees, eligibility and your application — trained on the official 2026 brochure."
      >
        <button style={heroWhiteBtn} onClick={() => navigate("/applicant/apply")}>
          <FiFileText /> Start Application
        </button>
      </ApplicantHero>

      <StatRow
        items={[
          { icon: <FiClock />, value: "< 2s", label: "Avg. response" },
          { icon: <FiMessageSquare />, value: "120+", label: "Topics covered" },
          { icon: <FiShield />, value: "100%", label: "Verified answers" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* Chat */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", minHeight: "560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, color: "#111827" }}>Admissions AI</h2>
              <p style={{ margin: "6px 0 0", color: "#64748B" }}>Instant answers about admissions, fees, and your application</p>
            </div>
            <span style={{ background: "linear-gradient(135deg,#2563EB,#4F8EF7)", color: "#fff", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <PiRobotBold /> Online
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <PiRobotBold />
                  </div>
                )}
                <div style={{ maxWidth: "72%", padding: "14px 18px", borderRadius: "16px", background: m.role === "user" ? "#2563EB" : "#EEF2F7", color: m.role === "user" ? "#fff" : "#111827", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: "#64748B", display: "flex", gap: "8px", alignItems: "center" }}><PiRobotBold /> Thinking...</div>}
          </div>

          {messages.length <= 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "16px 0" }}>
              {SUGGESTIONS.map((s) => (
                <button key={s.text} onClick={() => send(s.text)} style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid #DDE5F0", background: "#fff", borderRadius: "14px", padding: "14px 16px", cursor: "pointer", textAlign: "left", color: "#334155", fontSize: "14px" }}>
                  <span style={{ color: "#2563EB" }}>{s.icon}</span> {s.text}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about eligibility, fees, hostel, placements..."
              style={{ flex: 1, padding: "14px 18px", borderRadius: "14px", border: "1px solid #DDE5F0", fontSize: "15px", outline: "none" }}
            />
            <button onClick={() => send()} disabled={loading} style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: "14px", padding: "0 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              <FiSend /> Send
            </button>
          </div>
        </div>

        {/* Sidebar: popular topics + next steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "26px" }}>
            <h3 style={{ margin: 0, color: "#111827" }}>Popular topics</h3>
            <p style={{ margin: "6px 0 16px", color: "#64748B" }}>Hand-picked by our counselors</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {POPULAR.map((t) => (
                <button key={t} onClick={() => send(t)} style={{ textAlign: "left", border: "1px solid #EEF2F7", background: "#fff", borderRadius: "12px", padding: "14px 16px", cursor: "pointer", color: "#334155", fontWeight: 500 }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "24px", padding: "26px" }}>
            <h3 style={{ margin: 0, color: "#111827" }}>Next steps</h3>
            <p style={{ margin: "6px 0 16px", color: "#64748B" }}>Move forward in your application</p>
            <button onClick={() => navigate("/applicant/apply")} style={{ width: "100%", background: "#2563EB", color: "#fff", border: "none", borderRadius: "14px", padding: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
              <FiFileText /> Start application
            </button>
            <button onClick={() => navigate("/applicant/appointment")} style={{ width: "100%", background: "#fff", color: "#334155", border: "1px solid #DDE5F0", borderRadius: "14px", padding: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
              <FiCalendar /> Book a counseling slot
            </button>
            <button onClick={() => navigate("/applicant/courses")} style={{ width: "100%", background: "#fff", color: "#334155", border: "1px solid #DDE5F0", borderRadius: "14px", padding: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
              <FiBook /> Browse courses & fees
            </button>
          </div>
        </div>
      </div>
    </ApplicantPage>
  );
}
