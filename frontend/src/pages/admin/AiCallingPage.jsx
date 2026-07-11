import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card, input, primaryButton, secondaryButton, modalOverlay, modalCard } from "../../components/admin/leads/leadsStyles";
import {
  getAgents,
  getCallStats,
  getQueue,
  generateTranscript,
  launchCampaign,
  advanceQueue,
} from "../../services/callAgents.service";
import {
  FiPhoneCall,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiPlay,
  FiVolume2,
  FiZap,
} from "react-icons/fi";
import { PiRobotBold } from "react-icons/pi";

function LaunchCampaignModal({ onClose, onLaunched }) {
  const [name, setName] = useState("");
  const [audience, setAudience] = useState(10);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name) {
      setError("Campaign name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await launchCampaign({ name, audience_count: Number(audience) || 10 });
      onLaunched(result.queued);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to launch campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>Launch Calling Campaign</h2>
        <p style={{ color: "#64748B", marginTop: "-6px", marginBottom: "16px" }}>
          Queues AI voice calls to your active leads (hottest first), split across active agents.
        </p>

        <label>Campaign name</label>
        <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Autumn intake outreach" />

        <label>How many leads to call</label>
        <input type="number" style={input} value={audience} onChange={(e) => setAudience(e.target.value)} />

        {error && <p style={{ color: "#dc2626", marginTop: "-8px" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button style={secondaryButton} onClick={onClose}>Cancel</button>
          <button style={primaryButton} onClick={handleSave} disabled={saving}>
            {saving ? "Launching..." : "Launch Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}

const elapsed = (startedAt) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(startedAt).getTime()) / 1000));
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

const STATUS_LABEL = {
  queued: "Queued",
  ringing: "Ringing",
  in_call: "In call",
  no_answer: "No answer",
};

export default function AiCallingPage() {
  const [agents, setAgents] = useState([]);
  const [callStats, setCallStats] = useState({ callsToday: 0, connectedCount: 0, avgHandleSeconds: 0, hotHandoffs: 0 });
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLaunch, setShowLaunch] = useState(false);

  const [selectedCallId, setSelectedCallId] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [previewingId, setPreviewingId] = useState(null);
  const [banner, setBanner] = useState("");

  const [, forceTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const [agentsData, statsData, queueData] = await Promise.all([
        getAgents(),
        getCallStats(),
        getQueue(),
      ]);
      setAgents(agentsData);
      setCallStats(statsData);
      setQueue(queueData);
    } catch (error) {
      console.error("Failed to load AI calling data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const tick = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const hasActiveCalls = queue.some((c) =>
    ["queued", "ringing", "in_call"].includes(c.status)
  );

  const runQueue = useCallback(async () => {
    try {
      await advanceQueue();
      await load();
    } catch (error) {
      console.error("Failed to advance queue", error);
    }
  }, [load]);

  // Auto-advance the live queue while calls are in flight, so it feels live.
  // Pause while the user is viewing a transcript so the selected call doesn't
  // complete and drop out of the queue mid-read.
  useEffect(() => {
    if (!hasActiveCalls || selectedCallId || transcriptLoading) return undefined;
    const timer = setTimeout(runQueue, 4500);
    return () => clearTimeout(timer);
  }, [hasActiveCalls, selectedCallId, transcriptLoading, queue, runQueue]);

  const onLaunched = async (queued) => {
    setBanner(`Launched — ${queued} AI call(s) queued. Watch them progress in the live queue below.`);
    await load();
  };

  const handlePreview = (agent) => {
    if (!("speechSynthesis" in window)) {
      alert("Voice preview isn't supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Hi, this is ${agent.name}, your ${agent.role_label} agent. ${agent.description || ""}`
    );
    setPreviewingId(agent.id);
    utterance.onend = () => setPreviewingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectCall = async (call) => {
    setSelectedCallId(call.id);
    setTranscript(null);
    setTranscriptLoading(true);
    try {
      const data = await generateTranscript(call.id);
      setTranscript(data);
    } catch (error) {
      setTranscript({ error: error.response?.data?.message || "Failed to generate transcript." });
    } finally {
      setTranscriptLoading(false);
    }
  };

  const liveCallsFor = (agentId) =>
    queue.filter((c) => c.agent_id === agentId && c.status === "in_call").length;

  const avgDuration = () => {
    const total = callStats.avgHandleSeconds || 0;
    return `${Math.floor(total / 60)}m ${total % 60}s`;
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
          <div
            style={{
              background: "linear-gradient(135deg,#2563eb,#4f8ef7)",
              borderRadius: "26px",
              padding: "40px",
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            <span style={{ background: "rgba(255,255,255,.18)", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
              Lead ops • AI Calling
            </span>
            <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>AI Calling for Qualification &amp; Scale</h1>
            <p style={{ opacity: 0.9, maxWidth: "700px", marginBottom: "26px" }}>
              AI voice agents call your queued leads, qualify intent, and hand off only serious
              prospects to human counselors.
            </p>

            <button
              onClick={() => setShowLaunch(true)}
              style={{
                background: "#fff",
                color: "#2563eb",
                border: "none",
                borderRadius: "14px",
                padding: "12px 22px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiPlay /> Launch campaign
            </button>
          </div>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading call center...</p>
          ) : (
            <>
              {banner && (
                <div
                  style={{
                    ...card,
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#f0fdf4",
                    color: "#166534",
                  }}
                >
                  <FiCheckCircle style={{ flexShrink: 0 }} />
                  <span>{banner}</span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <div style={{ color: "#2563eb", marginBottom: "8px" }}><FiPhoneCall size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{callStats.callsToday}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Calls today</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#16a34a", marginBottom: "8px" }}><FiCheckCircle size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{callStats.connectedCount}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Qualified</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#7c3aed", marginBottom: "8px" }}><FiClock size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{avgDuration()}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Avg. duration</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#ea580c", marginBottom: "8px" }}><FiTrendingUp size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{callStats.hotHandoffs}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Hot handoffs</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "20px" }}>
                {agents.map((agent) => (
                  <div key={agent.id} style={card}>
                    <strong style={{ color: "#172554" }}>{agent.name} — AI Voice Agent</strong>
                    <p style={{ margin: "2px 0 12px", color: "#94a3b8", fontSize: "13px" }}>
                      {agent.role_label} • {agent.languages}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "#2563eb",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PiRobotBold />
                        </div>
                        <div>
                          <div>
                            <strong>{liveCallsFor(agent.id)}</strong> live calls
                          </div>
                          <p style={{ margin: 0, color: "#64748B", fontSize: "13px" }}>
                            {agent.description || "No description set"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePreview(agent)}
                        style={{ ...secondaryButton, display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px" }}
                      >
                        <FiVolume2 /> {previewingId === agent.id ? "Speaking..." : "Preview"}
                      </button>
                    </div>
                  </div>
                ))}

                {agents.length === 0 && (
                  <p style={{ color: "#94a3b8" }}>No agents yet — create one from the All Leads → AI Calling Agents tab.</p>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "20px" }}>
                <div style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h2 style={{ margin: 0, color: "#172554" }}>Live call queue</h2>
                      <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                        {hasActiveCalls
                          ? "Calls in progress — updating live…"
                          : "Click a call to preview its AI transcript"}
                      </p>
                    </div>
                    {hasActiveCalls && (
                      <button
                        onClick={runQueue}
                        style={{ ...secondaryButton, padding: "6px 12px", fontSize: "13px" }}
                      >
                        Advance
                      </button>
                    )}
                  </div>

                  {queue.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>
                      Queue is empty — launch a campaign to start calling leads.
                    </p>
                  ) : (
                    queue.map((call) => (
                      <div
                        key={call.id}
                        onClick={() => handleSelectCall(call)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          background: selectedCallId === call.id ? "#eef4ff" : "transparent",
                          border: selectedCallId === call.id ? "1px solid #93c5fd" : "1px solid transparent",
                          marginBottom: "6px",
                        }}
                      >
                        <div>
                          <strong>{call.Lead?.name || "Unknown"}</strong>
                          <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "13px" }}>
                            Agent: {call.AiVoiceAgent?.name} • {STATUS_LABEL[call.status] || call.status}
                          </p>
                        </div>
                        <span style={{ color: "#64748B", fontVariantNumeric: "tabular-nums" }}>
                          {elapsed(call.started_at)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ ...card, minHeight: "300px" }}>
                  <h2 style={{ margin: 0, color: "#172554" }}>
                    {transcript && !transcript.error
                      ? `Live transcript · ${transcript.agentName} ↔ ${transcript.leadName}`
                      : "Live transcript"}
                  </h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    AI-generated preview of how this call could go, grounded in the lead's real data
                  </p>

                  {!selectedCallId && (
                    <p style={{ color: "#94a3b8" }}>Select a call from the queue to generate a transcript.</p>
                  )}

                  {transcriptLoading && (
                    <div style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "8px" }}>
                      <PiRobotBold /> Generating transcript...
                    </div>
                  )}

                  {transcript?.error && <p style={{ color: "#dc2626" }}>{transcript.error}</p>}

                  {transcript && !transcript.error && (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                        {transcript.turns.map((turn, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: turn.speaker === "agent" ? "flex-start" : "flex-end",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "80%",
                                padding: "10px 14px",
                                borderRadius: "14px",
                                background: turn.speaker === "agent" ? "#2563eb" : "#EEF2F7",
                                color: turn.speaker === "agent" ? "#fff" : "#111827",
                                fontSize: "14px",
                              }}
                            >
                              <span style={{ display: "block", fontSize: "11px", opacity: 0.7, marginBottom: "2px" }}>
                                {turn.speaker === "agent" ? transcript.agentName.toUpperCase() : transcript.leadName.toUpperCase()}
                              </span>
                              {turn.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      {transcript.nextBestAction && (
                        <div
                          style={{
                            background: "#eef4ff",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            color: "#1e3a8a",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <FiZap style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>
                            <strong>Next-best-action: </strong>
                            {transcript.nextBestAction}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showLaunch && (
        <LaunchCampaignModal onClose={() => setShowLaunch(false)} onLaunched={onLaunched} />
      )}
    </div>
  );
}
