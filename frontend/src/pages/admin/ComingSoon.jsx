import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { FiTool } from "react-icons/fi";

export default function ComingSoon({ title }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#2563eb,#60a5fa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "28px",
              boxShadow: "0 15px 35px rgba(37,99,235,.25)",
            }}
          >
            <FiTool />
          </div>

          <h1 style={{ margin: 0, color: "#172554" }}>{title}</h1>

          <p style={{ color: "#64748B", maxWidth: "420px", textAlign: "center" }}>
            This section is coming soon. We're focused on rolling out the Leads
            command center first — check back here shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
