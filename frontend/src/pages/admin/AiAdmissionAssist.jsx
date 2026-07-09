import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card, input as inputStyle } from "../../components/admin/leads/leadsStyles";
import { getChats, getChatMessages, sendMessage } from "../../services/adminChat.service";
import { getFollowUps, getLeadStats } from "../../services/leads.service";
import { getTemplates } from "../../services/whatsapp.service";
import { getAgents } from "../../services/callAgents.service";
import { FiSend, FiClock, FiMessageSquare, FiLayers } from "react-icons/fi";
import { PiRobotBold } from "react-icons/pi";

const SUGGESTIONS = [
  "How many hot leads do we have right now?",
  "Which leads haven't been contacted in a while?",
  "Summarize today's pipeline in one paragraph",
  "Draft a follow-up message for a lead interested in MBA",
];

const WELCOME = {
  role: "assistant",
  content:
    "Hi! I'm the Admission Assist AI. I'm live on the applicant portal 24×7 and I brief you with the full lead context every time a query comes in. Ask me anything.",
};

const priorityFor = (score) => {
  if (score >= 80) return { label: "High", bg: "#fef2f2", color: "#dc2626" };
  if (score >= 50) return { label: "Med", bg: "#fff7ed", color: "#ea580c" };
  return { label: "Low", bg: "#f0fdf4", color: "#16a34a" };
};

export default function AiAdmissionAssist() {
  const [messages, setMessages] = useState([WELCOME]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const [miniStats, setMiniStats] = useState({ avgResponseSeconds: 0, queriesToday: 0, totalConversations: 0 });
  const [followUps, setFollowUps] = useState([]);
  const [kb, setKb] = useState({ leadStats: null, activeTemplates: 0, activeAgents: 0 });

  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const chats = await getChats();
        setMiniStats((prev) => ({ ...prev, totalConversations: chats.length }));

        if (chats.length > 0) {
          const fullChats = await Promise.all(chats.map((c) => getChatMessages(c.id)));

          let responseTimes = [];
          let queriesToday = 0;
          const today = new Date().toDateString();

          fullChats.forEach((chat) => {
            chat.messages.forEach((m, i) => {
              if (m.role === "user") {
                if (new Date(m.createdAt).toDateString() === today) queriesToday += 1;
                const next = chat.messages[i + 1];
                if (next && next.role === "assistant") {
                  responseTimes.push(
                    (new Date(next.createdAt).getTime() - new Date(m.createdAt).getTime()) / 1000
                  );
                }
              }
            });
          });

          const avgResponseSeconds =
            responseTimes.length > 0
              ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
              : 0;

          setMiniStats({ avgResponseSeconds, queriesToday, totalConversations: chats.length });

          const latest = fullChats[0];
          if (latest?.messages?.length > 0) {
            setMessages(latest.messages.map((m) => ({ role: m.role, content: m.content })));
            setChatId(latest.id);
          }
        }
      } catch (error) {
        console.error("Failed to load Admission Assist history", error);
      }

      try {
        const [followUpData, leadStats, templates, agents] = await Promise.all([
          getFollowUps(),
          getLeadStats(),
          getTemplates(),
          getAgents(),
        ]);

        setFollowUps(followUpData.slice(0, 3));
        setKb({
          leadStats,
          activeTemplates: templates.filter((t) => t.is_active).length,
          activeAgents: agents.filter((a) => a.is_active).length,
        });
      } catch (error) {
        console.error("Failed to load Admission Assist context panels", error);
      }
    };

    load();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setSending(true);

    try {
      const result = await sendMessage(chatId || "new", question);
      setChatId(result.chatId);
      setMessages((prev) => [...prev, result.assistant]);
      setMiniStats((prev) => ({ ...prev, queriesToday: prev.queriesToday + 1 }));
    } catch (error) {
      console.error("Admission Assist failed", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong reaching the AI. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <div
            style={{
              background: "linear-gradient(135deg,#2563eb,#4f8ef7)",
              borderRadius: "26px",
              padding: "40px",
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,.18)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
              }}
            >
              Lead ops • AI Admission Assist
            </span>
            <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>AI Admission Assist</h1>
            <p style={{ opacity: 0.9, maxWidth: "700px", margin: 0 }}>
              24×7 AI answers counselor queries and briefs you with the full lead context so
              follow-ups never stall.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2563eb", marginBottom: "8px" }}>
                <FiClock size={18} />
              </div>
              <h2 style={{ margin: 0, fontSize: "24px" }}>
                {miniStats.avgResponseSeconds > 0 ? `${miniStats.avgResponseSeconds}s` : "—"}
              </h2>
              <p style={{ color: "#64748B", marginTop: "4px" }}>Avg. response</p>
            </div>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#7c3aed", marginBottom: "8px" }}>
                <FiMessageSquare size={18} />
              </div>
              <h2 style={{ margin: 0, fontSize: "24px" }}>{miniStats.queriesToday}</h2>
              <p style={{ color: "#64748B", marginTop: "4px" }}>Queries / day</p>
            </div>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0891b2", marginBottom: "8px" }}>
                <FiLayers size={18} />
              </div>
              <h2 style={{ margin: 0, fontSize: "24px" }}>{miniStats.totalConversations}</h2>
              <p style={{ color: "#64748B", marginTop: "4px" }}>Total conversations</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "20px" }}>
            <div style={{ ...card, display: "flex", flexDirection: "column", minHeight: "560px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0, color: "#172554" }}>Counselor co-pilot</h2>
                  <p style={{ margin: "6px 0 0", color: "#64748B" }}>
                    Chat directly with the assistant with live applicant context
                  </p>
                </div>
                <span
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#4f8ef7)",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <PiRobotBold /> Live
                </span>
              </div>

              <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: "auto", marginTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}
              >
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    {m.role === "assistant" && (
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "12px",
                          background: "#2563eb",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <PiRobotBold />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "72%",
                        padding: "14px 18px",
                        borderRadius: "16px",
                        background: m.role === "user" ? "#2563eb" : "#EEF2F7",
                        color: m.role === "user" ? "#fff" : "#111827",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.5,
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div style={{ color: "#64748B", display: "flex", gap: "8px", alignItems: "center" }}>
                    <PiRobotBold /> Thinking...
                  </div>
                )}
              </div>

              {messages.length <= 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "16px 0" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        textAlign: "left",
                        border: "1px solid #DDE5F0",
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "14px 16px",
                        cursor: "pointer",
                        color: "#334155",
                        fontSize: "14px",
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
                  placeholder="Ask about a lead, program, fees, docs..."
                  style={{ ...inputStyle, flex: 1, margin: 0 }}
                />
                <button
                  onClick={() => send()}
                  disabled={sending}
                  style={{
                    background: "#2563eb",
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

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={card}>
                <h3 style={{ margin: 0, color: "#172554" }}>Needs follow-up</h3>
                <p style={{ margin: "6px 0 16px", color: "#64748B" }}>Leads waiting longest without contact</p>

                {followUps.length === 0 ? (
                  <p style={{ color: "#94a3b8", margin: 0 }}>Nothing waiting — pipeline is caught up.</p>
                ) : (
                  followUps.map((lead) => {
                    const priority = priorityFor(lead.score);
                    return (
                      <div
                        key={lead.id}
                        style={{
                          padding: "12px 0",
                          borderTop: "1px solid #F1F5F9",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <strong>{lead.name}</strong>
                          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "13px" }}>
                            "{lead.suggestion}"
                          </p>
                          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "12px" }}>
                            WAITING {lead.daysSinceContact}d
                          </p>
                        </div>
                        <span
                          style={{
                            flexShrink: 0,
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 700,
                            background: priority.bg,
                            color: priority.color,
                          }}
                        >
                          {priority.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={card}>
                <h3 style={{ margin: 0, color: "#172554" }}>Knowledge base</h3>
                <p style={{ margin: "6px 0 16px", color: "#64748B" }}>What the AI is trained on</p>

                {kb.leadStats && (
                  <>
                    <div style={{ padding: "8px 0", borderTop: "1px solid #F1F5F9" }}>
                      {kb.leadStats.totalLeads30d} leads captured (last 30d)
                    </div>
                    <div style={{ padding: "8px 0", borderTop: "1px solid #F1F5F9" }}>
                      {kb.leadStats.hotLeads} hot leads (score ≥ 80)
                    </div>
                  </>
                )}
                <div style={{ padding: "8px 0", borderTop: "1px solid #F1F5F9" }}>
                  {kb.activeTemplates} active WhatsApp automations
                </div>
                <div style={{ padding: "8px 0", borderTop: "1px solid #F1F5F9" }}>
                  {kb.activeAgents} active AI voice agents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
