import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiFileText, FiSend, FiClock, FiShield } from "react-icons/fi";
import { PiGraduationCapBold, PiSparkleFill } from "react-icons/pi";

import { ApplicantPage, ApplicantHero, StatRow } from "../../components/applicant/ApplicantShell";
import { heroWhiteBtn } from "../../components/applicant/styles";
import { getApplication, getPrograms, saveApplication } from "../../services/applicant.service";

const STEPS = [
  { key: "personal", label: "Personal", icon: <FiUser /> },
  { key: "academic", label: "Academic", icon: <PiGraduationCapBold /> },
  { key: "program", label: "Program", icon: <FiFileText /> },
  { key: "review", label: "Review & submit", icon: <FiSend /> },
];

const input = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid #DDE5F0",
  marginTop: "6px",
  fontSize: "15px",
};

export default function ApplyNow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([getPrograms(), getApplication()])
      .then(([progs, app]) => {
        setPrograms(progs);
        setForm(app.data || {});
      })
      .catch((err) => console.error(err));
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const persist = async (extra = {}) => {
    setSaving(true);
    try {
      await saveApplication({ data: form, step: step + 1, ...extra });
    } catch (err) {
      console.error("Failed to save application", err);
      alert(err.response?.data?.message || "Failed to save. Try again.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    if (step === 0 && (!form.fullName || !form.email)) {
      alert("Please fill your name and email.");
      return;
    }
    try {
      await persist();
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    } catch {
      /* handled */
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    try {
      await persist({ submitted: true });
      setSubmitted(true);
    } catch {
      /* handled */
    }
  };

  return (
    <ApplicantPage>
      <ApplicantHero
        tag="Applicant • Apply Now"
        title="Start your application"
        subtitle="Takes about 4 minutes. Save and resume anytime — our counselors will contact you within 24 hours."
      >
        <button style={heroWhiteBtn} onClick={() => navigate("/applicant/admissions-ai")}>
          <PiSparkleFill /> Get AI Help
        </button>
      </ApplicantHero>

      <StatRow
        items={[
          { icon: <FiFileText />, value: "4", label: "Steps" },
          { icon: <FiClock />, value: "4 min", label: "Avg. time" },
          { icon: <FiShield />, value: "AES-256", label: "Data secured" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", marginTop: "24px" }}>
        {/* Progress */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "26px" }}>
          <h3 style={{ margin: 0, color: "#111827" }}>Progress</h3>
          <p style={{ margin: "6px 0 18px", color: "#64748B" }}>Step {step + 1} of {STEPS.length}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {STEPS.map((s, i) => {
              const state = submitted || i < step ? "DONE" : i === step ? "IN PROGRESS" : "PENDING";
              const active = i === step;
              return (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "14px", border: `1px solid ${active ? "#BFD3FF" : "#EEF2F7"}`, borderRadius: "14px", padding: "14px", background: active ? "#F5F9FF" : "#fff" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: state === "DONE" ? "#2563EB" : "#EEF2F7", color: state === "DONE" ? "#fff" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{s.label}</div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", letterSpacing: "0.5px" }}>{state}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "30px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", margin: "0 auto 18px" }}>✓</div>
              <h2 style={{ margin: 0, color: "#111827" }}>Application submitted!</h2>
              <p style={{ color: "#64748B", marginTop: "8px" }}>Our counselors will contact you within 24 hours. Track progress on your dashboard.</p>
              <button onClick={() => navigate("/applicant")} style={{ marginTop: "20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: "14px", padding: "14px 28px", fontWeight: 600, cursor: "pointer" }}>
                Go to dashboard
              </button>
            </div>
          ) : (
            <>
              {step === 0 && (
                <>
                  <h2 style={{ marginTop: 0, color: "#111827" }}>Personal</h2>
                  <p style={{ color: "#64748B", marginTop: "-6px" }}>All fields are required</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                    <div><label>Full name</label><input style={input} value={form.fullName || ""} onChange={set("fullName")} placeholder="Aarav Sharma" /></div>
                    <div><label>Date of birth</label><input type="date" style={input} value={form.dob || ""} onChange={set("dob")} /></div>
                    <div><label>Email</label><input style={input} value={form.email || ""} onChange={set("email")} placeholder="you@email.com" /></div>
                    <div><label>Phone</label><input style={input} value={form.phone || ""} onChange={set("phone")} placeholder="+91 90000 00000" /></div>
                    <div><label>City</label><input style={input} value={form.city || ""} onChange={set("city")} placeholder="Bengaluru" /></div>
                    <div><label>State</label><input style={input} value={form.state || ""} onChange={set("state")} placeholder="Karnataka" /></div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 style={{ marginTop: 0, color: "#111827" }}>Academic</h2>
                  <p style={{ color: "#64748B", marginTop: "-6px" }}>Your recent academic record</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                    <div><label>10th %</label><input style={input} value={form.tenth || ""} onChange={set("tenth")} placeholder="92%" /></div>
                    <div><label>12th %</label><input style={input} value={form.twelfth || ""} onChange={set("twelfth")} placeholder="88%" /></div>
                    <div><label>Board / University</label><input style={input} value={form.board || ""} onChange={set("board")} placeholder="CBSE" /></div>
                    <div><label>Entrance score (JEE/CAT/…)</label><input style={input} value={form.entrance || ""} onChange={set("entrance")} placeholder="JEE Main 96.5%ile" /></div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 style={{ marginTop: 0, color: "#111827" }}>Program</h2>
                  <p style={{ color: "#64748B", marginTop: "-6px" }}>Which program are you applying for?</p>
                  <label>Program of interest</label>
                  <select style={input} value={form.program || ""} onChange={set("program")}>
                    <option value="">Select a program</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.name}>{p.name} — {p.fee}</option>
                    ))}
                  </select>
                  <label style={{ display: "block", marginTop: "18px" }}>Why this program? (optional)</label>
                  <textarea rows={4} style={input} value={form.motivation || ""} onChange={set("motivation")} placeholder="Tell us briefly about your interest..." />
                </>
              )}

              {step === 3 && (
                <>
                  <h2 style={{ marginTop: 0, color: "#111827" }}>Review & submit</h2>
                  <p style={{ color: "#64748B", marginTop: "-6px" }}>Confirm your details before submitting</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "10px" }}>
                    <Review label="Full name" value={form.fullName} />
                    <Review label="Email" value={form.email} />
                    <Review label="Phone" value={form.phone} />
                    <Review label="City / State" value={[form.city, form.state].filter(Boolean).join(", ")} />
                    <Review label="10th / 12th" value={[form.tenth, form.twelfth].filter(Boolean).join(" / ")} />
                    <Review label="Entrance" value={form.entrance} />
                    <Review label="Program" value={form.program} />
                  </div>
                </>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
                <button onClick={back} disabled={step === 0} style={{ border: "1px solid #DDE5F0", background: "#fff", borderRadius: "12px", padding: "12px 24px", fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.5 : 1 }}>
                  Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button onClick={next} disabled={saving} style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 28px", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Saving..." : "Next"}
                  </button>
                ) : (
                  <button onClick={submit} disabled={saving} style={{ background: "#16A34A", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 28px", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Submitting..." : "Submit application"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ApplicantPage>
  );
}

function Review({ label, value }) {
  return (
    <div style={{ border: "1px solid #EEF2F7", borderRadius: "12px", padding: "14px 16px" }}>
      <div style={{ color: "#94A3B8", fontSize: "12px" }}>{label}</div>
      <div style={{ fontWeight: 600, color: "#111827", marginTop: "3px" }}>{value || "—"}</div>
    </div>
  );
}
