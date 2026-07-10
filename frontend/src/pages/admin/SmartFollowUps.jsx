import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card } from "../../components/admin/leads/leadsStyles";
import { getFollowUps, getWorkspaceStats, logFollowUp } from "../../services/leads.service";
import { getTemplates } from "../../services/whatsapp.service";
import {
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiTrendingDown,
  FiRefreshCw,
  FiZap,
  FiMessageCircle,
  FiPhoneCall,
  FiMail,
} from "react-icons/fi";

const CADENCE = [
  { day: "DAY 0", label: "Instant WhatsApp welcome + brochure", auto: "template" },
  { day: "DAY 1", label: "Counselor follow-up call", auto: false },
  { day: "DAY 3", label: "Counselor human call if score > 60", auto: false },
  { day: "DAY 5", label: "Program-specific email w/ alumni story", auto: false },
  { day: "DAY 7", label: "Re-engagement WhatsApp if no reply", auto: false },
  { day: "DAY 14", label: "Final offer window reminder", auto: false },
];

const channelFor = (lead) => {
  if (lead.score >= 70) return "call";
  if (lead.status === "contacted") return "whatsapp";
  return "email";
};

const CHANNEL_META = {
  call: { icon: <FiPhoneCall />, bg: "#dc2626", label: "Call" },
  whatsapp: { icon: <FiMessageCircle />, bg: "#2563eb", label: "WhatsApp" },
  email: { icon: <FiMail />, bg: "#2563eb", label: "Email" },
};

export default function SmartFollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [avgResponseSeconds, setAvgResponseSeconds] = useState(0);
  const [welcomeAutomated, setWelcomeAutomated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingId, setLoggingId] = useState(null);
  const [justLogged, setJustLogged] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [followUpData, workspaceStats, templates] = await Promise.all([
        getFollowUps(),
        getWorkspaceStats(),
        getTemplates(),
      ]);
      setFollowUps(followUpData);
      setAvgResponseSeconds(workspaceStats.avgResponseSeconds.value);
      setWelcomeAutomated(
        templates.some((t) => t.trigger === "new_lead" && t.is_active)
      );
    } catch (error) {
      console.error("Failed to load follow-up suggestions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Fire a tel:/mailto: protocol handler via a temp anchor — opening these in a
  // new tab shows a "can't be reached" error page instead.
  const triggerProtocol = (href) => {
    const a = document.createElement("a");
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Opens the right channel and returns a human message describing what happened.
  //  - WhatsApp: real https URL → new tab.
  //  - Email: mailto: → mail client.
  //  - Call: tel: opens the dialer on mobile; on desktop there's usually no phone
  //    app, so we ALSO copy the number to the clipboard so it's still usable.
  const openChannel = async (lead, channel) => {
    const digits = lead.phone ? lead.phone.replace(/[^\d]/g, "") : "";

    try {
      if (channel === "whatsapp" && digits) {
        window.open(
          `https://wa.me/${digits}?text=${encodeURIComponent(lead.suggestion || "")}`,
          "_blank",
          "noopener"
        );
        return `Opened WhatsApp for ${lead.name}.`;
      }

      if (channel === "email" && lead.email) {
        triggerProtocol(`mailto:${lead.email}`);
        return `Opened email to ${lead.email}.`;
      }

      if (channel === "call" && digits) {
        try {
          await navigator.clipboard.writeText(lead.phone);
        } catch {
          /* clipboard may be blocked — number is still shown in the banner */
        }
        triggerProtocol(`tel:${digits}`);
        return `Call ${lead.name} at ${lead.phone} — number copied to clipboard.`;
      }

      if (digits) {
        window.open(`https://wa.me/${digits}`, "_blank", "noopener");
        return `Opened WhatsApp for ${lead.name}.`;
      }

      return `No phone or email on file for ${lead.name} — add contact details first.`;
    } catch (error) {
      console.error("Failed to open channel", error);
      return "";
    }
  };

  const handleAction = async (lead, channel) => {
    const actionMsg = await openChannel(lead, channel);

    setLoggingId(lead.id);
    try {
      // Record the touch in the DB — resets recency, bumps status, rescores.
      const updated = await logFollowUp(lead.id, { channel, markContacted: true });
      setJustLogged({
        name: lead.name,
        score: updated.score,
        status: updated.status,
        actionMsg,
      });
      await load();
    } catch (error) {
      console.error("Failed to log follow-up", error);
    } finally {
      setLoggingId(null);
    }
  };

  const dueNow = followUps.length;
  const overdue = followUps.filter((l) => l.daysSinceContact > 2).length;
  const missed = followUps.filter((l) => l.daysSinceContact >= 7).length;
  const onTimePct = dueNow > 0 ? Math.round(((dueNow - overdue) / dueNow) * 100) : 100;

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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div>
              <span
                style={{
                  background: "rgba(255,255,255,.18)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                Lead ops • Follow-up Intelligence
              </span>
              <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>Smart Follow-up Intelligence</h1>
              <p style={{ opacity: 0.9, maxWidth: "700px", margin: 0 }}>
                AI tells your team who to follow up with, when to act, and exactly what to say —
                so response speed goes up and no lead falls through the cracks.
              </p>
            </div>
            <button
              onClick={load}
              style={{
                background: "#fff",
                color: "#2563eb",
                border: "none",
                borderRadius: "14px",
                padding: "12px 20px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>

          {loading ? (
            <p style={{ color: "#64748B" }}>Generating suggestions...</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <div style={{ color: "#dc2626", marginBottom: "8px" }}><FiAlertTriangle size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{dueNow}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Due now</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#2563eb", marginBottom: "8px" }}><FiClock size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>
                    {avgResponseSeconds > 0 ? `${Math.floor(avgResponseSeconds / 60)}m ${avgResponseSeconds % 60}s` : "—"}
                  </h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Avg. response</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#16a34a", marginBottom: "8px" }}><FiCheckCircle size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{onTimePct}%</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>On-time %</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#ea580c", marginBottom: "8px" }}><FiTrendingDown size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{missed}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Missed (7d+)</p>
                </div>
              </div>

              {justLogged && (
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
                  <span>
                    {justLogged.actionMsg ? `${justLogged.actionMsg} ` : ""}
                    Logged follow-up with <strong>{justLogged.name}</strong> — now{" "}
                    <strong>{justLogged.status}</strong>, intent score updated to{" "}
                    <strong>{justLogged.score}</strong>.
                  </span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <h2 style={{ margin: 0, color: "#172554" }}>Act in the next 30 minutes</h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "18px" }}>
                    Ordered by longest without contact
                  </p>

                  {followUps.length === 0 ? (
                    <p style={{ color: "#94a3b8", margin: 0 }}>
                      Nothing waiting — pipeline is caught up.
                    </p>
                  ) : (
                    followUps.slice(0, 6).map((lead) => {
                      const channel = channelFor(lead);
                      const meta = CHANNEL_META[channel];
                      const urgent = lead.daysSinceContact > 2;

                      return (
                        <div
                          key={lead.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "14px",
                            borderRadius: "14px",
                            border: urgent ? "1px solid #fecaca" : "1px solid #EEF2F7",
                            background: urgent ? "#fef8f8" : "#fff",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "12px",
                              background: meta.bg,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {meta.icon}
                          </div>

                          <div style={{ flex: 1 }}>
                            <strong>{lead.name}</strong>
                            <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "13px" }}>
                              {lead.suggestion}
                            </p>
                          </div>

                          <button
                            onClick={() => handleAction(lead, channel)}
                            disabled={loggingId === lead.id}
                            style={{
                              background: "#2563eb",
                              color: "#fff",
                              border: "none",
                              borderRadius: "10px",
                              padding: "8px 16px",
                              fontWeight: 600,
                              fontSize: "13px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            {loggingId === lead.id ? "Logging..." : meta.label}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={card}>
                  <h2 style={{ margin: 0, color: "#172554" }}>AI next-best-action</h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    What to say next, per lead
                  </p>

                  {followUps.slice(0, 4).map((lead) => (
                    <div key={lead.id} style={{ padding: "10px 0", borderTop: "1px solid #F1F5F9" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#2563eb",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                        }}
                      >
                        <FiZap size={12} /> SUGGESTION
                      </span>
                      <strong>{lead.name}</strong>
                      <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "13px" }}>
                        {lead.suggestion}
                      </p>
                    </div>
                  ))}

                  {followUps.length === 0 && (
                    <p style={{ color: "#94a3b8" }}>No suggestions right now.</p>
                  )}
                </div>
              </div>

              <div style={card}>
                <h2 style={{ margin: 0, color: "#172554" }}>Suggested follow-up cadence</h2>
                <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "18px" }}>
                  A reference journey for new leads — only Day 0 is actually automated today, via your
                  active "new_lead" WhatsApp template.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                  {CADENCE.map((step) => {
                    const isAutomated = step.auto === "template" && welcomeAutomated;
                    return (
                      <div
                        key={step.day}
                        style={{
                          border: isAutomated ? "1px solid #86efac" : "1px solid #EEF2F7",
                          background: isAutomated ? "#f0fdf4" : "#fff",
                          borderRadius: "14px",
                          padding: "16px",
                        }}
                      >
                        <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px" }}>
                          {step.day}
                        </span>
                        <p style={{ margin: "6px 0 8px", fontWeight: 600, color: "#172554" }}>{step.label}</p>
                        {isAutomated && (
                          <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                            <FiCheckCircle size={12} /> Automated
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
