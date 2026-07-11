import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card, modalOverlay, modalCard } from "../../components/admin/leads/leadsStyles";
import { getCounselorPerformance } from "../../services/leads.service";
import {
  FiTrendingUp,
  FiClock,
  FiTarget,
  FiUsers,
  FiZap,
  FiAward,
} from "react-icons/fi";

const fmtSeconds = (secs) => {
  if (!secs) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export default function CounselorPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drill, setDrill] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await getCounselorPerformance();
      setData(res);
    } catch (error) {
      console.error("Failed to load counselor performance", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const team = data?.team || {};
  const counselors = data?.counselors || [];
  const topPerformer = data?.topPerformer;
  const coachingInsights = data?.coachingInsights || [];
  const attentionNeeded = data?.attentionNeeded || [];

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
            <span
              style={{
                background: "rgba(255,255,255,.18)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
              }}
            >
              Lead ops • Performance Intelligence
            </span>
            <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>
              Counselor Performance Intelligence
            </h1>
            <p style={{ opacity: 0.9, maxWidth: "720px", margin: 0 }}>
              Clear visibility into response times, follow-ups, and conversion impact by counselor —
              so coaching is focused and outcomes improve fast.
            </p>
          </div>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading performance...</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <div style={{ color: "#2563eb", marginBottom: "8px" }}><FiTrendingUp size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{team.conversionRate}%</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Team conv.</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#7c3aed", marginBottom: "8px" }}><FiClock size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{fmtSeconds(team.avgResponseSeconds)}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Avg. response</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#0891b2", marginBottom: "8px" }}><FiTarget size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{team.onTimeFollowUpPct}%</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>On-time follow-ups</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#16a34a", marginBottom: "8px" }}><FiUsers size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{team.activeCounselors}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Active counselors</p>
                </div>
              </div>

              <div style={{ ...card, marginBottom: "20px" }}>
                <h2 style={{ margin: 0, color: "#172554" }}>Counselor leaderboard</h2>
                <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                  Ranked by performance score · click a row for full drill-down
                </p>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: "12px", letterSpacing: "0.5px" }}>
                        <th style={{ padding: "12px 10px" }}>COUNSELOR</th>
                        <th style={{ padding: "12px 10px" }}>CALLS</th>
                        <th style={{ padding: "12px 10px" }}>AVG. RESPONSE</th>
                        <th style={{ padding: "12px 10px" }}>FOLLOW-UPS</th>
                        <th style={{ padding: "12px 10px" }}>CONVERSION</th>
                        <th style={{ padding: "12px 10px" }}>SCORE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {counselors.map((c) => (
                        <tr
                          key={c.userId}
                          onClick={() => setDrill(c)}
                          style={{ borderTop: "1px solid #F1F5F9", cursor: "pointer" }}
                        >
                          <td style={{ padding: "16px 10px" }}>
                            <strong style={{ color: "#172554" }}>{c.name}</strong>
                            <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "13px" }}>{c.note}</p>
                          </td>
                          <td style={{ padding: "16px 10px" }}>{c.calls}</td>
                          <td style={{ padding: "16px 10px" }}>{fmtSeconds(c.avgResponseSeconds)}</td>
                          <td style={{ padding: "16px 10px" }}>{c.followUpPct}%</td>
                          <td style={{ padding: "16px 10px", fontWeight: 700 }}>{c.conversionRate}%</td>
                          <td style={{ padding: "16px 10px", fontWeight: 700 }}>{c.score}</td>
                        </tr>
                      ))}
                      {counselors.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>
                            No counselor activity yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                <div style={card}>
                  <h3 style={{ margin: 0, color: "#172554" }}>🏆 Top performer</h3>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>This month</p>

                  {topPerformer ? (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FiAward />
                        </div>
                        <div>
                          <strong style={{ fontSize: "18px", color: "#172554" }}>{topPerformer.name}</strong>
                          <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "13px" }}>
                            {topPerformer.calls} calls · {topPerformer.conversionRate}% conversion
                          </p>
                        </div>
                      </div>
                      <p style={{ color: "#64748B", margin: 0 }}>{topPerformer.note}</p>
                    </>
                  ) : (
                    <p style={{ color: "#94a3b8" }}>No data yet.</p>
                  )}
                </div>

                <div style={card}>
                  <h3 style={{ margin: 0, color: "#172554" }}>AI coaching insights</h3>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    Generated from real counselor stats
                  </p>

                  {coachingInsights.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No insights yet.</p>
                  ) : (
                    coachingInsights.map((line, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", padding: "8px 0", color: "#334155" }}>
                        <FiZap style={{ flexShrink: 0, marginTop: "3px", color: "#2563eb" }} size={14} />
                        <span>{line}</span>
                      </div>
                    ))
                  )}
                </div>

                <div style={card}>
                  <h3 style={{ margin: 0, color: "#172554" }}>Attention needed</h3>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    Counselors below team benchmark
                  </p>

                  {attentionNeeded.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>Everyone's at or above benchmark 🎉</p>
                  ) : (
                    attentionNeeded.map((c) => (
                      <div
                        key={c.name}
                        style={{
                          border: "1px solid #fecaca",
                          background: "#fef2f2",
                          borderRadius: "12px",
                          padding: "12px 14px",
                          marginBottom: "10px",
                          color: "#b91c1c",
                          fontWeight: 600,
                        }}
                      >
                        {c.name} — score {c.score}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {drill && (
        <div style={modalOverlay} onClick={() => setDrill(null)}>
          <div style={modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: "#172554" }}>{drill.name}</h2>
            <p style={{ color: "#64748B", marginTop: "-6px", marginBottom: "16px" }}>{drill.note}</p>

            {[
              ["Performance score", `${drill.score} / 100`],
              ["Leads assigned", drill.leadsAssigned],
              ["Calls logged", drill.calls],
              ["Conversions", drill.conversions],
              ["Conversion rate", `${drill.conversionRate}%`],
              ["Follow-up coverage", `${drill.followUpPct}%`],
              ["Avg. response time", fmtSeconds(drill.avgResponseSeconds)],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <span style={{ color: "#64748B" }}>{label}</span>
                <strong style={{ color: "#172554" }}>{value}</strong>
              </div>
            ))}

            <button
              onClick={() => setDrill(null)}
              style={{
                marginTop: "20px",
                width: "100%",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
