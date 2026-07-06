import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiVideo, FiMapPin, FiPhone, FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import { PiSparkleFill } from "react-icons/pi";

import { ApplicantPage, ApplicantHero, StatRow } from "../../components/applicant/ApplicantShell";
import { heroWhiteBtn } from "../../components/applicant/styles";
import { bookAppointment, getPrograms } from "../../services/applicant.service";

const MODES = [
  { key: "video", icon: <FiVideo />, title: "Video call", sub: "Google Meet · 30 min", color: "#2563EB" },
  { key: "campus", icon: <FiMapPin />, title: "Campus visit", sub: "Tour + counseling · 60 min", color: "#06B6D4" },
  { key: "phone", icon: <FiPhone />, title: "Phone call", sub: "Quick chat · 15 min", color: "#7C3AED" },
];

const SLOTS = ["09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00"];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function startOfWeek(base) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const diff = (d.getDay() + 6) % 7; // Monday start
  d.setDate(d.getDate() - diff);
  return d;
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const user = getUser();

  const [mode, setMode] = useState("video");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [details, setDetails] = useState({
    fullName: user.username || "",
    email: user.email || "",
    phone: "",
    program: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPrograms().then(setPrograms).catch((e) => console.error(e));
  }, []);

  const days = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart]
  );

  const weekLabel = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 5);
    const opts = { month: "short", day: "numeric" };
    return `${weekStart.toLocaleDateString(undefined, opts)} — ${end.toLocaleDateString(undefined, opts)}`;
  }, [weekStart]);

  const set = (field) => (e) => setDetails((prev) => ({ ...prev, [field]: e.target.value }));

  const dateKey = (d) => (d ? d.toISOString().slice(0, 10) : null);

  const confirm = async () => {
    if (!selectedDate || !slot) {
      alert("Please pick a date and time slot.");
      return;
    }
    setSaving(true);
    try {
      const isoSlot = `${dateKey(selectedDate)}T${slot}`;
      await bookAppointment({
        mode,
        slot: isoSlot,
        program: details.program,
        notes: `Booked by ${details.fullName || user.username} (${details.email || user.email}, ${details.phone})`,
      });
      alert("Appointment confirmed! A counselor will reach out to confirm your slot.");
      setSlot(null);
      setSelectedDate(null);
      navigate("/applicant");
    } catch (err) {
      console.error("Failed to book appointment", err);
      alert(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setSaving(false);
    }
  };

  const selectedMode = MODES.find((m) => m.key === mode);

  return (
    <ApplicantPage>
      <ApplicantHero
        tag="Applicant • Book Appointment"
        title="Book an appointment"
        subtitle="Pick a mode, date and time — confirmations are instant and calendar invites arrive within seconds."
      >
        <button style={heroWhiteBtn} onClick={() => navigate("/applicant/admissions-ai")}>
          <PiSparkleFill /> Ask AI
        </button>
      </ApplicantHero>

      <StatRow
        items={[
          { icon: <FiCalendar />, value: MODES.length, label: "Modes" },
          { icon: <FiClock />, value: SLOTS.length, label: "Slots / day" },
          { icon: <FiUsers />, value: "12", label: "Counselors online" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* Left: mode + date + slots */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "30px" }}>
          <h2 style={{ margin: 0, color: "#111827" }}>Choose mode</h2>
          <p style={{ margin: "6px 0 18px", color: "#64748B" }}>How would you like to meet?</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {MODES.map((m) => (
              <div
                key={m.key}
                onClick={() => setMode(m.key)}
                style={{
                  border: `1px solid ${mode === m.key ? "#2563EB" : "#EEF2F7"}`,
                  boxShadow: mode === m.key ? "0 0 0 3px rgba(37,99,235,.12)" : "none",
                  borderRadius: "18px",
                  padding: "20px",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: m.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "14px" }}>
                  {m.icon}
                </div>
                <div style={{ fontWeight: 700, color: "#111827" }}>{m.title}</div>
                <div style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px" }}>
            <h3 style={{ margin: 0, color: "#111827" }}>Pick a date</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#475569" }}>
              <FiChevronLeft style={{ cursor: "pointer" }} onClick={() => setWeekStart((w) => { const n = new Date(w); n.setDate(w.getDate() - 7); return n; })} />
              <span style={{ fontWeight: 600 }}>{weekLabel}</span>
              <FiChevronRight style={{ cursor: "pointer" }} onClick={() => setWeekStart((w) => { const n = new Date(w); n.setDate(w.getDate() + 7); return n; })} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px", marginTop: "16px" }}>
            {days.map((d) => {
              const active = dateKey(d) === dateKey(selectedDate);
              return (
                <div
                  key={d.toISOString()}
                  onClick={() => setSelectedDate(d)}
                  style={{
                    borderRadius: "16px",
                    padding: "16px 0",
                    textAlign: "center",
                    cursor: "pointer",
                    border: `1px solid ${active ? "transparent" : "#EEF2F7"}`,
                    background: active ? "linear-gradient(135deg,#2563EB,#4F8EF7)" : "#fff",
                    color: active ? "#fff" : "#111827",
                  }}
                >
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>{DAY_NAMES[d.getDay()]}</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, marginTop: "4px" }}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>

          <h3 style={{ margin: "26px 0 14px", color: "#111827" }}>Available slots</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {SLOTS.map((s) => {
              const active = slot === s;
              return (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  style={{
                    border: `1px solid ${active ? "#2563EB" : "#E2E8F0"}`,
                    background: active ? "#EEF4FF" : "#fff",
                    color: active ? "#2563EB" : "#334155",
                    borderRadius: "12px",
                    padding: "12px 22px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: details + summary */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "30px" }}>
          <h2 style={{ margin: 0, color: "#111827" }}>Your details</h2>
          <p style={{ margin: "6px 0 18px", color: "#64748B" }}>So we can confirm your slot</p>

          <label>Full name</label>
          <input style={detailInput} value={details.fullName} onChange={set("fullName")} />
          <label style={{ display: "block", marginTop: "16px" }}>Email</label>
          <input style={detailInput} value={details.email} onChange={set("email")} placeholder="you@email.com" />
          <label style={{ display: "block", marginTop: "16px" }}>Phone</label>
          <input style={detailInput} value={details.phone} onChange={set("phone")} placeholder="+91 90000 00000" />
          <label style={{ display: "block", marginTop: "16px" }}>Program of interest</label>
          <select style={detailInput} value={details.program} onChange={set("program")}>
            <option value="">Select a program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <div style={{ border: "1px solid #EEF2F7", borderRadius: "16px", padding: "18px", marginTop: "20px" }}>
            <div style={{ fontSize: "12px", color: "#94A3B8", letterSpacing: "1px", fontWeight: 700 }}>SUMMARY</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", color: "#111827" }}>
              {selectedMode.icon} {selectedMode.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", color: "#111827" }}>
              <FiCalendar /> {selectedDate ? `${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()}` : "—"} {slot ? `· ${slot}` : ""}
            </div>
          </div>

          <button onClick={confirm} disabled={saving} style={{ width: "100%", marginTop: "20px", background: "linear-gradient(135deg,#2563EB,#4F8EF7)", color: "#fff", border: "none", borderRadius: "14px", padding: "15px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Confirming..." : "Confirm appointment"}
          </button>
        </div>
      </div>
    </ApplicantPage>
  );
}

const detailInput = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid #DDE5F0",
  marginTop: "6px",
  fontSize: "15px",
};
