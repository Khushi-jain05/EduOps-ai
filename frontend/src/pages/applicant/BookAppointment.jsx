import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import {
  bookAppointment,
  getAppointments,
} from "../../services/applicant.service";

export default function BookAppointment() {
  const [mode, setMode] = useState("video");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const load = async () => {
    try {
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleBook = async () => {
    if (!slot) {
      alert("Please pick a date and time.");
      return;
    }
    setSaving(true);
    try {
      await bookAppointment({ mode, slot, notes });
      setSlot("");
      setNotes("");
      await load();
      alert("Appointment requested! A counselor will confirm shortly.");
    } catch (err) {
      console.error("Failed to book appointment", err);
      alert(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setSaving(false);
    }
  };

  const input = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #DDE5F0",
    marginTop: "8px",
    fontSize: "15px",
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          <h1 style={{ margin: 0, color: "#111827" }}>Book Appointment</h1>
          <p style={{ color: "#64748B", marginTop: "6px" }}>
            Schedule a counseling session — video call or campus visit.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "26px", maxWidth: "1000px" }}>
            <div style={{ background: "#fff", borderRadius: "22px", padding: "28px" }}>
              <h3 style={{ marginTop: 0, color: "#111827" }}>New request</h3>

              <label>Mode</label>
              <select style={input} value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="video">Video call</option>
                <option value="campus">Campus visit</option>
              </select>

              <div style={{ marginTop: "18px" }}>
                <label>Preferred date & time</label>
                <input
                  type="datetime-local"
                  style={input}
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "18px" }}>
                <label>Notes (optional)</label>
                <textarea
                  rows={3}
                  style={input}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What would you like to discuss?"
                />
              </div>

              <button
                onClick={handleBook}
                disabled={saving}
                style={{
                  marginTop: "20px",
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 26px",
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Booking..." : "Request appointment"}
              </button>
            </div>

            <div style={{ background: "#fff", borderRadius: "22px", padding: "28px" }}>
              <h3 style={{ marginTop: 0, color: "#111827" }}>Your appointments</h3>
              {appointments.length === 0 ? (
                <p style={{ color: "#64748B" }}>No appointments yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {appointments.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        border: "1px solid #EEF2F7",
                        borderRadius: "14px",
                        padding: "16px",
                      }}
                    >
                      <div style={{ fontWeight: 600, color: "#111827" }}>
                        {a.mode === "campus" ? "Campus visit" : "Video call"}
                      </div>
                      <div style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>
                        {new Date(a.slot).toLocaleString()}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          background: "#EEF4FF",
                          color: "#2563EB",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
