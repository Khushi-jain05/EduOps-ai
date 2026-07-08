import { useState } from "react";
import {
  createAgent,
  updateAgent,
  toggleAgent,
  testCall,
} from "../../../../services/callAgents.service";
import { card, input, primaryButton, secondaryButton, modalOverlay, modalCard } from "../leadsStyles";
import { FiPlus, FiPhoneCall, FiPhoneIncoming, FiClock, FiTrendingUp, FiPlay } from "react-icons/fi";

function AgentModal({ agent, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: agent?.name || "",
    role_label: agent?.role_label || "",
    languages: agent?.languages || "EN",
    description: agent?.description || "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.role_label) {
      alert("Name and role are required.");
      return;
    }

    if (agent) {
      await updateAgent(agent.id, form);
    } else {
      await createAgent(form);
    }

    await onSaved();
    onClose();
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>
          {agent ? "Configure Agent" : "New Agent"}
        </h2>

        <label>Name</label>
        <input style={input} value={form.name} onChange={set("name")} placeholder="Aria" />

        <label>Role</label>
        <input style={input} value={form.role_label} onChange={set("role_label")} placeholder="Qualifier" />

        <label>Languages</label>
        <input style={input} value={form.languages} onChange={set("languages")} placeholder="EN + HI" />

        <label>Description</label>
        <textarea rows={3} style={input} value={form.description} onChange={set("description")} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button style={secondaryButton} onClick={onClose}>Cancel</button>
          <button style={primaryButton} onClick={handleSave}>
            {agent ? "Save Changes" : "Create Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}

const statLine = (icon, value, label) => (
  <div style={{ ...card, padding: "20px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2563eb", marginBottom: "10px" }}>
      {icon}
    </div>
    <h2 style={{ margin: 0, fontSize: "26px" }}>{value}</h2>
    <p style={{ color: "#64748B", marginTop: "4px" }}>{label}</p>
  </div>
);

const queueStatusLabel = (call) => {
  if (call.status === "in_call") {
    const seconds = Math.round((Date.now() - new Date(call.started_at).getTime()) / 1000);
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `In call · ${mins}:${secs}`;
  }
  if (call.status === "no_answer") return "No answer";
  if (call.status === "ringing") return "Ringing";
  return "Queued";
};

export default function AiCallingAgentsTab({ agents, callStats, queue, onChanged }) {
  const [modalAgent, setModalAgent] = useState(undefined);

  const handleToggle = async (agent) => {
    await toggleAgent(agent.id);
    onChanged();
  };

  const handleTest = async (agent) => {
    await testCall(agent.id);
    onChanged();
  };

  const avgHandle = () => {
    const total = callStats.avgHandleSeconds || 0;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
        {statLine(<FiPhoneCall size={20} />, callStats.callsToday, "Calls today")}
        {statLine(<FiPhoneIncoming size={20} />, `${callStats.connectedRate}%`, "Connected")}
        {statLine(<FiClock size={20} />, avgHandle(), "Avg handle time")}
        {statLine(<FiTrendingUp size={20} />, callStats.hotHandoffs, "Hot handoffs")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }}>
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
            <div>
              <h2 style={{ margin: 0, color: "#172554" }}>AI voice agents</h2>
              <p style={{ color: "#64748B", margin: "4px 0 0" }}>
                Autonomous callers that qualify, book slots and hand off warm leads
              </p>
            </div>
            <button
              style={{ ...primaryButton, display: "flex", alignItems: "center", gap: "8px", height: "40px" }}
              onClick={() => setModalAgent(null)}
            >
              <FiPlus /> New Agent
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {agents.map((agent) => (
              <div key={agent.id} style={{ border: "1px solid #EEF2F7", borderRadius: "16px", padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong>{agent.name} — {agent.role_label}</strong>
                    <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "13px" }}>{agent.languages}</p>
                  </div>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" checked={agent.is_active} onChange={() => handleToggle(agent)} />
                  </label>
                </div>

                <p style={{ color: "#64748B", fontSize: "13px" }}>{agent.description}</p>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "12px" }}>
                  <span>Calls today: <strong>{agent.callsToday}</strong></span>
                  <span>Success: <strong style={{ color: "#16a34a" }}>{agent.successRate}%</strong></span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleTest(agent)}
                    style={{ ...secondaryButton, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px" }}
                  >
                    <FiPlay /> Test
                  </button>
                  <button
                    onClick={() => setModalAgent(agent)}
                    style={{ ...secondaryButton, flex: 1, padding: "8px" }}
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}

            {agents.length === 0 && (
              <p style={{ color: "#94a3b8" }}>No agents yet — create your first AI voice agent.</p>
            )}
          </div>
        </div>

        <div style={card}>
          <h2 style={{ marginTop: 0, color: "#172554" }}>Call queue</h2>
          <p style={{ color: "#64748B", marginTop: 0 }}>Live outbound queue</p>

          {queue.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Queue is empty.</p>
          ) : (
            queue.map((call) => (
              <div
                key={call.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <div>
                  <strong>{call.Lead?.name || "Unknown"}</strong>
                  <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "13px" }}>
                    {call.phone} · via {call.AiVoiceAgent?.name}
                  </p>
                </div>
                <span style={{ fontSize: "13px", color: "#64748B" }}>{queueStatusLabel(call)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {modalAgent !== undefined && (
        <AgentModal agent={modalAgent} onClose={() => setModalAgent(undefined)} onSaved={onChanged} />
      )}
    </div>
  );
}
