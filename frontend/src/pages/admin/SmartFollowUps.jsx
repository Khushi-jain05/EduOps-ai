import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card, badge, secondaryButton } from "../../components/admin/leads/leadsStyles";
import { getFollowUps } from "../../services/leads.service";
import { FiClock, FiRefreshCw, FiZap } from "react-icons/fi";

export default function SmartFollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFollowUps();
      setFollowUps(data);
    } catch (error) {
      console.error("Failed to load follow-up suggestions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "26px" }}>
            <div>
              <p style={{ color: "#94a3b8", letterSpacing: "2px", fontSize: "12px", marginBottom: "6px" }}>
                LEAD OPS
              </p>
              <h1 style={{ margin: 0, color: "#172554" }}>Smart Follow-up Intelligence</h1>
              <p style={{ color: "#64748B", marginTop: "6px" }}>
                Who to call, when to act, and what to say next — ranked by longest without contact.
              </p>
            </div>
            <button
              onClick={load}
              style={{ ...secondaryButton, display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>

          {loading ? (
            <p style={{ color: "#64748B" }}>Generating suggestions...</p>
          ) : followUps.length === 0 ? (
            <div style={card}>
              <p style={{ color: "#94a3b8", margin: 0 }}>
                No leads currently need follow-up — everything in "new"/"contacted" is caught up.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {followUps.map((lead) => (
                <div key={lead.id} style={{ ...card, display: "flex", justifyContent: "space-between", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <strong style={{ color: "#172554" }}>{lead.name}</strong>
                      <span style={badge(lead.status)}>{lead.status}</span>
                      <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                        {lead.course || "No course"} • {lead.city || "Unknown city"} • Score {lead.score}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        background: "#eef4ff",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        color: "#1e3a8a",
                      }}
                    >
                      <FiZap style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{lead.suggestion}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#dc2626",
                      fontWeight: 600,
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <FiClock /> {lead.daysSinceContact}d silent
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
