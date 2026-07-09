import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card } from "../../components/admin/leads/leadsStyles";
import { getCounselorPerformance } from "../../services/leads.service";
import { FiAward, FiZap } from "react-icons/fi";

export default function CounselorPerformance() {
  const [counselors, setCounselors] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getCounselorPerformance();
      setCounselors(data.counselors);
      setInsight(data.insight);
    } catch (error) {
      console.error("Failed to load counselor performance", error);
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
          <p style={{ color: "#94a3b8", letterSpacing: "2px", fontSize: "12px", marginBottom: "6px" }}>
            LEAD OPS
          </p>
          <h1 style={{ margin: 0, color: "#172554" }}>Counselor Performance Intelligence</h1>
          <p style={{ color: "#64748B", marginTop: "6px", marginBottom: "26px" }}>
            Response times, follow-ups, and conversion impact by counselor.
          </p>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading performance data...</p>
          ) : (
            <>
              {insight && (
                <div
                  style={{
                    ...card,
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "linear-gradient(135deg,#2563eb,#4f8ef7)",
                    color: "#fff",
                  }}
                >
                  <FiZap size={20} />
                  <span>{insight}</span>
                </div>
              )}

              <div style={card}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>
                      <th style={{ padding: "10px" }}>Counselor</th>
                      <th style={{ padding: "10px" }}>Leads assigned</th>
                      <th style={{ padding: "10px" }}>Calls logged</th>
                      <th style={{ padding: "10px" }}>Conversions</th>
                      <th style={{ padding: "10px" }}>Conversion rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counselors.map((c, i) => (
                      <tr key={c.userId} style={{ borderTop: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                          {i === 0 && <FiAward color="#eab308" />} {c.name}
                        </td>
                        <td style={{ padding: "10px" }}>{c.leadsAssigned}</td>
                        <td style={{ padding: "10px" }}>{c.calls}</td>
                        <td style={{ padding: "10px" }}>{c.conversions}</td>
                        <td style={{ padding: "10px" }}>
                          {c.leadsAssigned > 0
                            ? `${Math.round((c.conversions / c.leadsAssigned) * 100)}%`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                    {counselors.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                          No counselor activity recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
