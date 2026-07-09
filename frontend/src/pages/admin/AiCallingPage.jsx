import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import AiCallingAgentsTab from "../../components/admin/leads/tabs/AiCallingAgentsTab";
import { getAgents, getCallStats, getQueue } from "../../services/callAgents.service";

export default function AiCallingPage() {
  const [agents, setAgents] = useState([]);
  const [callStats, setCallStats] = useState({
    callsToday: 0,
    connectedRate: 0,
    avgHandleSeconds: 0,
    hotHandoffs: 0,
  });
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <h1 style={{ margin: 0, color: "#172554" }}>AI Calling for Qualification</h1>
          <p style={{ color: "#64748B", marginTop: "6px", marginBottom: "26px" }}>
            Auto-qualify inquiries at scale; hand only serious prospects to humans.
          </p>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading call center...</p>
          ) : (
            <AiCallingAgentsTab
              agents={agents}
              callStats={callStats}
              queue={queue}
              onChanged={load}
            />
          )}
        </div>
      </div>
    </div>
  );
}
