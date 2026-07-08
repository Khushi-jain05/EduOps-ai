import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getAdminOverview } from "../../services/admin.service";
import { FiUsers, FiTrendingUp, FiCheckCircle, FiTarget, FiArrowRight } from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    totalLeads30d: 0,
    hotLeads: 0,
    enrolledThisMonth: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminOverview();
        setStats(data.leadStats);
      } catch (error) {
        console.error("Failed to load admin overview", error);
      }
    };

    load();
  }, []);

  const cards = [
    { label: "Total leads (30d)", value: stats.totalLeads30d, icon: <FiUsers />, bg: "#f8fbff", color: "#2563eb" },
    { label: "Hot leads", value: stats.hotLeads, icon: <FiTrendingUp />, bg: "#fff7ed", color: "#ea580c" },
    { label: "Enrolled this month", value: stats.enrolledThisMonth, icon: <FiCheckCircle />, bg: "#f0fdfa", color: "#0891b2" },
    { label: "Conversion rate", value: `${stats.conversionRate}%`, icon: <FiTarget />, bg: "#faf5ff", color: "#7c3aed" },
  ];

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
              marginBottom: "25px",
            }}
          >
            <p style={{ opacity: 0.85, marginBottom: "10px" }}>
              Admin • {user?.email || "Guest"}
            </p>
            <h1 style={{ margin: 0, fontSize: "32px" }}>Welcome back</h1>
            <p style={{ opacity: 0.9, marginTop: "10px", maxWidth: "600px" }}>
              Manage admissions leads, calling agents, and automation from the
              Leads command center.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            {cards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: card.bg,
                  borderRadius: "20px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    fontSize: "20px",
                    marginBottom: "14px",
                  }}
                >
                  {card.icon}
                </div>
                <h2 style={{ margin: 0, fontSize: "28px" }}>{card.value}</h2>
                <p style={{ color: "#64748B", marginTop: "4px" }}>{card.label}</p>
              </div>
            ))}
          </div>

          <div
            onClick={() => navigate("/admin/leads")}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 15px 40px rgba(37,99,235,.08)",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#172554" }}>
                Lead Handling Command Center
              </h2>
              <p style={{ color: "#64748B", marginTop: "6px" }}>
                Capture, score and convert admissions leads with WhatsApp
                automation, AI calling agents, and live Google Sheets sync.
              </p>
            </div>
            <FiArrowRight size={24} color="#2563eb" />
          </div>
        </div>
      </div>
    </div>
  );
}
