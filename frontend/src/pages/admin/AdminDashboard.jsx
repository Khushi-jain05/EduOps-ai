import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card, badge } from "../../components/admin/leads/leadsStyles";
import {
  getWorkspaceStats,
  getLeads,
  getCounselorPerformance,
} from "../../services/leads.service";
import {
  FiPhoneCall,
  FiClock,
  FiTarget,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { PiRobotBold } from "react-icons/pi";

const formatSeconds = (value) => {
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${mins}m ${secs}s`;
};

const Delta = ({ pct }) => {
  const up = pct >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "13px",
        fontWeight: 600,
        color: up ? "#16a34a" : "#dc2626",
        background: up ? "#f0fdf4" : "#fef2f2",
        padding: "2px 8px",
        borderRadius: "999px",
      }}
    >
      {up ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
      {Math.abs(pct)}%
    </span>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState(null);
  const [hotLeads, setHotLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, leadsData, counselorData] = await Promise.all([
          getWorkspaceStats(),
          getLeads(),
          getCounselorPerformance(),
        ]);

        setStats(statsData);
        setHotLeads(
          leadsData
            .filter((l) => l.score >= 80)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
        );
        setCounselors(counselorData.counselors.slice(0, 5));
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toolkit = [
    {
      icon: <PiRobotBold />,
      color: "#2563eb",
      bg: "#eef4ff",
      title: "AI Admission Assist",
      desc: "24×7 AI that answers queries and supports counselors with live context.",
      path: "/admin/ai-admission-assist",
    },
    {
      icon: <FiTarget />,
      color: "#7c3aed",
      bg: "#f5f0ff",
      title: "AI Lead Intent Scoring",
      desc: "Auto-prioritize high-intent leads using behavior + funnel signals.",
      path: "/admin/lead-scoring",
    },
    {
      icon: <FiClock />,
      color: "#0891b2",
      bg: "#e8fbf6",
      title: "Smart Follow-up Intelligence",
      desc: "Who to call, when to act, and what to say next.",
      path: "/admin/follow-ups",
    },
    {
      icon: <FiPhoneCall />,
      color: "#ea580c",
      bg: "#fff1e9",
      title: "AI Calling for Qualification",
      desc: "Auto-qualify inquiries at scale; hand only serious prospects to humans.",
      path: "/admin/ai-calling",
    },
    {
      icon: <FiAward />,
      color: "#16a34a",
      bg: "#f0fdf4",
      title: "Counselor Performance Intelligence",
      desc: "Response times, follow-ups, and conversion impact by counselor.",
      path: "/admin/counselor-performance",
    },
    {
      icon: <FiUsers />,
      color: "#db2777",
      bg: "#fdf2f8",
      title: "All Leads (CRM)",
      desc: "Full command center — pipeline, WhatsApp, Sheets, campaigns.",
      path: "/admin/leads",
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
          <p style={{ color: "#94a3b8", letterSpacing: "2px", fontSize: "12px", marginBottom: "6px" }}>
            LEAD MANAGER WORKSPACE
          </p>
          <h1 style={{ margin: 0, color: "#172554" }}>
            Hello, <span style={{ color: "#2563eb" }}>{user?.username || "there"}</span>
          </h1>
          <p style={{ color: "#64748B", marginTop: "6px", marginBottom: "26px" }}>
            AI-first lead operations — score, follow up, and convert at scale.
          </p>

          {loading || !stats ? (
            <p style={{ color: "#64748B" }}>Loading workspace...</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "25px" }}>
                <div style={card}>
                  <p style={{ color: "#94a3b8", fontSize: "12px", letterSpacing: "1px", margin: 0 }}>OPEN LEADS</p>
                  <h2 style={{ margin: "8px 0" }}>{stats.openLeads.value}</h2>
                  <Delta pct={stats.openLeads.deltaPct} />
                </div>
                <div style={card}>
                  <p style={{ color: "#94a3b8", fontSize: "12px", letterSpacing: "1px", margin: 0 }}>HOT LEADS (80+)</p>
                  <h2 style={{ margin: "8px 0" }}>{stats.hotLeads.value}</h2>
                  <Delta pct={stats.hotLeads.deltaPct} />
                </div>
                <div style={card}>
                  <p style={{ color: "#94a3b8", fontSize: "12px", letterSpacing: "1px", margin: 0 }}>AVG. RESPONSE</p>
                  <h2 style={{ margin: "8px 0" }}>{formatSeconds(stats.avgResponseSeconds.value)}</h2>
                  <Delta pct={-stats.avgResponseSeconds.deltaPct} />
                </div>
                <div style={card}>
                  <p style={{ color: "#94a3b8", fontSize: "12px", letterSpacing: "1px", margin: 0 }}>CONVERSION</p>
                  <h2 style={{ margin: "8px 0" }}>{stats.conversionRate.value}%</h2>
                  <Delta pct={stats.conversionRate.deltaPct} />
                </div>
              </div>

              <div style={{ ...card, marginBottom: "25px" }}>
                <h2 style={{ margin: 0, color: "#172554" }}>Lead management toolkit</h2>
                <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "20px" }}>
                  Every AI capability you asked for — click a card to open the workspace
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {toolkit.map((t) => (
                    <div
                      key={t.path}
                      onClick={() => navigate(t.path)}
                      style={{
                        border: "1px solid #EEF2F7",
                        borderRadius: "16px",
                        padding: "20px",
                        cursor: "pointer",
                        background: t.bg,
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background: "#fff",
                          color: t.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "12px",
                          fontSize: "18px",
                        }}
                      >
                        {t.icon}
                      </div>
                      <strong style={{ color: "#172554" }}>{t.title}</strong>
                      <p style={{ color: "#64748B", fontSize: "13px", marginTop: "6px" }}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }}>
                <div style={card}>
                  <h2 style={{ margin: 0, color: "#172554" }}>🔥 Hot leads right now</h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    Auto-scored by intent model — act in the next 30 minutes
                  </p>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>
                        <th style={{ padding: "8px" }}>Lead</th>
                        <th style={{ padding: "8px" }}>Program</th>
                        <th style={{ padding: "8px" }}>Stage</th>
                        <th style={{ padding: "8px" }}>Source</th>
                        <th style={{ padding: "8px" }}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotLeads.map((lead) => (
                        <tr key={lead.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px", fontWeight: 600 }}>{lead.name}</td>
                          <td style={{ padding: "8px" }}>{lead.course || "—"}</td>
                          <td style={{ padding: "8px" }}>
                            <span style={badge(lead.status)}>{lead.status}</span>
                          </td>
                          <td style={{ padding: "8px" }}>{lead.source}</td>
                          <td style={{ padding: "8px", color: "#ea580c", fontWeight: 700 }}>{lead.score}</td>
                        </tr>
                      ))}
                      {hotLeads.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                            No hot leads right now.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={card}>
                  <h2 style={{ margin: 0, color: "#172554" }}>Team pulse</h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    Today's counselor snapshot
                  </p>

                  {counselors.map((c) => {
                    const max = Math.max(1, ...counselors.map((x) => x.calls));
                    return (
                      <div key={c.userId} style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                            <FiUsers color="#2563eb" /> {c.name}
                          </span>
                          <span style={{ color: "#64748B", fontSize: "13px" }}>
                            {c.calls} calls · {c.conversions} conv
                          </span>
                        </div>
                        <div style={{ background: "#F1F5F9", borderRadius: "999px", height: "6px" }}>
                          <div
                            style={{
                              width: `${(c.calls / max) * 100}%`,
                              background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                              height: "100%",
                              borderRadius: "999px",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {counselors.length === 0 && (
                    <p style={{ color: "#94a3b8" }}>No counselor activity yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
