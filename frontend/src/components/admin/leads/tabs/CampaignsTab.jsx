import { useState } from "react";
import { createCampaign, updateCampaign, deleteCampaign } from "../../../../services/campaigns.service";
import { card, input, primaryButton, secondaryButton, modalOverlay, modalCard } from "../leadsStyles";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const CHANNELS = ["whatsapp", "call", "email", "sms"];
const STATUSES = ["draft", "active", "paused", "completed"];

function NewCampaignModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", channel: "whatsapp", audience_count: 0 });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    if (!form.name) {
      alert("Campaign name is required.");
      return;
    }
    await createCampaign(form);
    await onCreated();
    onClose();
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>New Campaign</h2>

        <label>Name</label>
        <input style={input} value={form.name} onChange={set("name")} />

        <label>Channel</label>
        <select style={input} value={form.channel} onChange={set("channel")}>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Audience size</label>
        <input type="number" style={input} value={form.audience_count} onChange={set("audience_count")} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button style={secondaryButton} onClick={onClose}>Cancel</button>
          <button style={primaryButton} onClick={handleSave}>Create Campaign</button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsTab({ campaigns, onChanged }) {
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = async (campaign, status) => {
    await updateCampaign(campaign.id, { status });
    onChanged();
  };

  const handleDelete = async (campaign) => {
    if (!confirm(`Delete campaign "${campaign.name}"?`)) return;
    await deleteCampaign(campaign.id);
    onChanged();
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, color: "#172554" }}>Campaigns</h2>
        <button
          style={{ ...primaryButton, display: "flex", alignItems: "center", gap: "8px" }}
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> New Campaign
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Channel</th>
            <th style={{ padding: "10px" }}>Audience</th>
            <th style={{ padding: "10px" }}>Sent</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }} />
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} style={{ borderTop: "1px solid #F1F5F9" }}>
              <td style={{ padding: "10px", fontWeight: 600 }}>{c.name}</td>
              <td style={{ padding: "10px", textTransform: "capitalize" }}>{c.channel}</td>
              <td style={{ padding: "10px" }}>{c.audience_count}</td>
              <td style={{ padding: "10px" }}>{c.sent_count}</td>
              <td style={{ padding: "10px" }}>
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c, e.target.value)}
                  style={{ borderRadius: "10px", border: "1px solid #DDE5F0", padding: "6px 10px" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                <button
                  onClick={() => handleDelete(c)}
                  style={{ border: "none", background: "transparent", color: "#dc2626", cursor: "pointer" }}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}

          {campaigns.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>
                No campaigns yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <NewCampaignModal onClose={() => setShowModal(false)} onCreated={onChanged} />
      )}
    </div>
  );
}
