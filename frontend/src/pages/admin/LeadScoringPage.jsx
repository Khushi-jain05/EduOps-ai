import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import LeadScoringTab from "../../components/admin/leads/tabs/LeadScoringTab";
import { getLeadScoring } from "../../services/leads.service";

export default function LeadScoringPage() {
  const [scoring, setScoring] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getLeadScoring();
      setScoring(data);
    } catch (error) {
      console.error("Failed to load lead scoring", error);
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
          <h1 style={{ margin: 0, color: "#172554" }}>AI Lead Intent Scoring</h1>
          <p style={{ color: "#64748B", marginTop: "6px", marginBottom: "26px" }}>
            Auto-prioritize high-intent leads using behavior + funnel signals.
          </p>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading scoring...</p>
          ) : (
            <LeadScoringTab scoring={scoring} />
          )}
        </div>
      </div>
    </div>
  );
}
