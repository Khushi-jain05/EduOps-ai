import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getPrograms } from "../../services/applicant.service";

export default function CoursesFees() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch((err) => console.error("Failed to load programs", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          <h1 style={{ margin: 0, color: "#111827" }}>Courses & Fees</h1>
          <p style={{ color: "#64748B", marginTop: "6px" }}>
            Programs, eligibility and fees for the 2026 intake.
          </p>

          {loading ? (
            <h2 style={{ marginTop: "40px" }}>Loading programs...</h2>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
                gap: "22px",
                marginTop: "28px",
              }}
            >
              {programs.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#fff",
                    borderRadius: "22px",
                    padding: "26px",
                    boxShadow: "0 10px 30px rgba(15,23,42,.05)",
                  }}
                >
                  <div style={{ color: "#2563EB", fontWeight: 700, fontSize: "13px" }}>
                    {p.level || "Program"}
                  </div>
                  <h2 style={{ margin: "8px 0", color: "#111827", fontSize: "22px" }}>{p.name}</h2>
                  {p.description && (
                    <p style={{ color: "#64748B", fontSize: "14px", minHeight: "40px" }}>
                      {p.description}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "18px", marginTop: "16px", flexWrap: "wrap" }}>
                    <Fact label="Duration" value={p.duration} />
                    <Fact label="Fee / year" value={p.fee} />
                    <Fact label="Seats" value={p.seats} />
                    <Fact label="Intake" value={p.intake || "—"} />
                  </div>
                </div>
              ))}
              {programs.length === 0 && (
                <div style={{ color: "#64748B" }}>No programs available yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div style={{ color: "#94A3B8", fontSize: "12px" }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#111827" }}>{value}</div>
    </div>
  );
}
