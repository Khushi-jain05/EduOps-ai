import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import {
  getPrograms,
  getApplicantDashboard,
  advanceApplication,
} from "../../services/applicant.service";

export default function ApplyNow() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [selected, setSelected] = useState("");
  const [stats, setStats] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [progs, dash] = await Promise.all([
      getPrograms(),
      getApplicantDashboard(),
    ]);
    setPrograms(progs);
    setStats(dash.stats);
  };

  useEffect(() => {
    load().catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selected) {
      alert("Please choose a program to apply for.");
      return;
    }
    setSaving(true);
    try {
      await advanceApplication();
      await load();
      alert("Application step submitted! Track progress on your dashboard.");
      navigate("/applicant");
    } catch (err) {
      console.error("Failed to submit application", err);
      alert("Failed to submit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          <h1 style={{ margin: 0, color: "#111827" }}>Apply Now</h1>
          <p style={{ color: "#64748B", marginTop: "6px" }}>
            Pick a program and continue your application.
          </p>

          {stats && (
            <div
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "18px 22px",
                marginTop: "22px",
                maxWidth: "760px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "14px" }}>
                <span>Application progress</span>
                <span>{stats.stepsDone} of {stats.totalSteps} steps</span>
              </div>
              <div style={{ height: "8px", background: "#E2E8F0", borderRadius: "999px", marginTop: "10px", overflow: "hidden" }}>
                <div style={{ width: `${stats.progressPercent}%`, height: "100%", background: "linear-gradient(90deg,#2563EB,#60A5FA)" }} />
              </div>
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: "22px", padding: "28px", marginTop: "22px", maxWidth: "760px" }}>
            <h3 style={{ marginTop: 0, color: "#111827" }}>Choose a program</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {programs.map((p) => (
                <label
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    border: `1px solid ${selected === p.id ? "#2563EB" : "#E2E8F0"}`,
                    borderRadius: "14px",
                    padding: "16px 18px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="program"
                    checked={selected === p.id}
                    onChange={() => setSelected(p.id)}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{p.name}</div>
                    <div style={{ color: "#64748B", fontSize: "13px" }}>
                      {p.duration} · {p.fee} · {p.seats} seats
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                marginTop: "22px",
                background: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "14px 28px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Submitting..." : "Submit application step"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
