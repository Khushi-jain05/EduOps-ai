import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { card, primaryButton, secondaryButton } from "../../components/admin/leads/leadsStyles";
import {
  getAdminAppointments,
  updateAppointment,
  regenerateLink,
} from "../../services/appointments.service";
import { FiVideo, FiCalendar, FiCheckCircle, FiClock, FiRefreshCw, FiArrowRight } from "react-icons/fi";

const STATUS_STYLE = {
  requested: { bg: "#f3f4f6", color: "#374151" },
  scheduled: { bg: "#eff6ff", color: "#2563eb" },
  confirmed: { bg: "#f0fdf4", color: "#16a34a" },
  completed: { bg: "#e8fbf6", color: "#0891b2" },
  cancelled: { bg: "#fef2f2", color: "#dc2626" },
};

const statusBadge = (status) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.requested;
  return {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "capitalize",
    background: s.bg,
    color: s.color,
  };
};

const fmt = (slot) =>
  new Date(slot).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function Meetings() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getAdminAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    await updateAppointment(id, { status });
    await load();
  };

  const regen = async (id) => {
    await regenerateLink(id);
    await load();
  };

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) => new Date(a.slot).getTime() >= now && a.status !== "cancelled"
  ).length;
  const scheduled = appointments.filter((a) => ["scheduled", "confirmed"].includes(a.status)).length;
  const completed = appointments.filter((a) => a.status === "completed").length;

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
            <span style={{ background: "rgba(255,255,255,.18)", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
              Lead ops • Counseling Meetings
            </span>
            <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>Counseling Meetings</h1>
            <p style={{ opacity: 0.9, maxWidth: "720px", margin: 0 }}>
              Every counseling call an applicant books lands here with a ready video link — join,
              confirm, and hand off to the pipeline.
            </p>
          </div>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading meetings...</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <div style={{ color: "#2563eb", marginBottom: "8px" }}><FiCalendar size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{upcoming}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Upcoming</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#16a34a", marginBottom: "8px" }}><FiClock size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{scheduled}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Scheduled / confirmed</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#0891b2", marginBottom: "8px" }}><FiCheckCircle size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{completed}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Completed</p>
                </div>
              </div>

              <div style={card}>
                <h2 style={{ margin: 0, color: "#172554" }}>All meetings</h2>
                <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                  Applicant-booked counseling calls
                </p>

                {appointments.length === 0 ? (
                  <p style={{ color: "#94a3b8" }}>No meetings booked yet.</p>
                ) : (
                  appointments.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        border: "1px solid #EEF2F7",
                        borderRadius: "16px",
                        padding: "18px",
                        marginBottom: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "240px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <strong style={{ color: "#172554" }}>{a.User?.username || "Applicant"}</strong>
                          <span style={statusBadge(a.status)}>{a.status}</span>
                        </div>
                        <p style={{ margin: "0 0 4px", color: "#64748B", fontSize: "14px" }}>
                          {a.program || "No program"} • {a.mode} • {fmt(a.slot)}
                        </p>
                        {a.Lead && (
                          <span
                            onClick={() => navigate(`/admin/leads?q=${encodeURIComponent(a.Lead.name)}`)}
                            style={{ color: "#2563eb", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            View lead <FiArrowRight size={12} />
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          {a.meeting_link && (
                            <a
                              href={a.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ ...primaryButton, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                              <FiVideo /> Join
                            </a>
                          )}
                          <button style={secondaryButton} onClick={() => regen(a.id)} title="Regenerate link">
                            <FiRefreshCw />
                          </button>
                        </div>
                        <select
                          value={a.status}
                          onChange={(e) => setStatus(a.id, e.target.value)}
                          style={{ borderRadius: "10px", border: "1px solid #DDE5F0", padding: "8px 12px" }}
                        >
                          {["requested", "scheduled", "confirmed", "completed", "cancelled"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
