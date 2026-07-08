import { useState } from "react";
import { createTemplate, toggleTemplate, deleteTemplate, sendTestMessage } from "../../../../services/whatsapp.service";
import { card, input, primaryButton, secondaryButton, modalOverlay, modalCard } from "../leadsStyles";
import { FiPlus, FiTrash2, FiPlay } from "react-icons/fi";

function NewTemplateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", trigger: "", message: "" });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.trigger || !form.message) {
      alert("Name, trigger and message are required.");
      return;
    }
    await createTemplate(form);
    await onCreated();
    onClose();
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>New WhatsApp Automation</h2>

        <label>Name</label>
        <input style={input} value={form.name} onChange={set("name")} placeholder="Welcome message" />

        <label>Trigger</label>
        <input style={input} value={form.trigger} onChange={set("trigger")} placeholder="new_lead or status:hot" />
        <p style={{ marginTop: "-10px", marginBottom: "16px", color: "#94a3b8", fontSize: "12px" }}>
          Use <code>new_lead</code> to fire on lead capture, or <code>status:hot</code> /{" "}
          <code>status:enrolled</code> etc. to fire when a lead moves to that status.
        </p>

        <label>Message</label>
        <textarea rows={4} style={input} value={form.message} onChange={set("message")} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button style={secondaryButton} onClick={onClose}>Cancel</button>
          <button style={primaryButton} onClick={handleSave}>Save Automation</button>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppAutomationTab({ templates, onChanged }) {
  const [showModal, setShowModal] = useState(false);

  const handleToggle = async (template) => {
    await toggleTemplate(template.id);
    onChanged();
  };

  const handleDelete = async (template) => {
    if (!confirm(`Delete automation "${template.name}"?`)) return;
    await deleteTemplate(template.id);
    onChanged();
  };

  const handleTest = async (template) => {
    const phone = prompt(
      "Send a test WhatsApp message to (include country code, e.g. +919876543210):"
    );

    if (!phone) return;

    try {
      await sendTestMessage(template.id, phone);
      alert("Test message sent.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send test message.");
    }
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, color: "#172554" }}>WhatsApp Automation</h2>
        <button
          style={{ ...primaryButton, display: "flex", alignItems: "center", gap: "8px" }}
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> New Automation
        </button>
      </div>

      {templates.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No automations configured yet.</p>
      ) : (
        templates.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
              borderTop: "1px solid #F1F5F9",
            }}
          >
            <div style={{ flex: 1 }}>
              <strong>{t.name}</strong>
              <p style={{ margin: "4px 0 0", color: "#64748B" }}>
                Trigger: <code>{t.trigger}</code> • Sent {t.sent_count}
              </p>
              <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" }}>{t.message}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={t.is_active} onChange={() => handleToggle(t)} />
                Active
              </label>
              <button
                onClick={() => handleTest(t)}
                style={{ ...secondaryButton, display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px" }}
              >
                <FiPlay /> Test
              </button>
              <button
                onClick={() => handleDelete(t)}
                style={{ border: "none", background: "transparent", color: "#dc2626", cursor: "pointer" }}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <NewTemplateModal onClose={() => setShowModal(false)} onCreated={onChanged} />
      )}
    </div>
  );
}
