import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { FiBarChart2 } from "react-icons/fi";

export default function Analytics() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF", overflow: "hidden" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          <h1 style={{ margin: 0, color: "#172554" }}>Faculty Analytics</h1>
          <p style={{ color: "#64748B", marginTop: "6px", marginBottom: "26px" }}>
            Class performance and engagement insights.
          </p>

          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <FiBarChart2 size={28} style={{ marginBottom: "12px" }} />
            <p style={{ margin: 0 }}>Analytics dashboard coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
