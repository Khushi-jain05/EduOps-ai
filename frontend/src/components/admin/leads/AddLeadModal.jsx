import { useState } from "react";
import { createLead } from "../../../services/leads.service";
import { modalOverlay, modalCard, input, primaryButton, secondaryButton } from "./leadsStyles";

export default function AddLeadModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    city: "",
    source: "Website",
  });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      alert("Name and phone are required.");
      return;
    }

    setSaving(true);

    try {
      await createLead(form);
      await onCreated();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>Add Lead</h2>

        <label>Name</label>
        <input style={input} value={form.name} onChange={set("name")} />

        <label>Phone</label>
        <input style={input} value={form.phone} onChange={set("phone")} />

        <label>Email</label>
        <input style={input} value={form.email} onChange={set("email")} />

        <label>Course</label>
        <input style={input} value={form.course} onChange={set("course")} />

        <label>City</label>
        <input style={input} value={form.city} onChange={set("city")} />

        <label>Source</label>
        <input style={input} value={form.source} onChange={set("source")} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button style={secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button style={primaryButton} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
