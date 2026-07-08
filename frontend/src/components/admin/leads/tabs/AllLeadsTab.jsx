import { useState } from "react";
import { updateLead, deleteLead } from "../../../../services/leads.service";
import { card, badge } from "../leadsStyles";
import { FiTrash2 } from "react-icons/fi";

const STATUSES = ["new", "contacted", "hot", "enrolled", "lost"];

export default function AllLeadsTab({ leads, search, onChanged }) {
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = leads.filter((lead) => {
    if (statusFilter && lead.status !== statusFilter) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = `${lead.name} ${lead.phone} ${lead.email || ""} ${lead.course || ""} ${lead.city || ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const handleStatusChange = async (lead, status) => {
    await updateLead(lead.id, { status });
    onChanged();
  };

  const handleDelete = async (lead) => {
    if (!confirm(`Delete lead "${lead.name}"?`)) {
      return;
    }
    await deleteLead(lead.id);
    onChanged();
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, color: "#172554" }}>All Leads ({filtered.length})</h2>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ borderRadius: "10px", border: "1px solid #DDE5F0", padding: "8px 12px" }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Contact</th>
              <th style={{ padding: "10px" }}>Course</th>
              <th style={{ padding: "10px" }}>City</th>
              <th style={{ padding: "10px" }}>Score</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                <td style={{ padding: "10px", fontWeight: 600 }}>{lead.name}</td>
                <td style={{ padding: "10px", color: "#64748B" }}>
                  {lead.phone}
                  {lead.email ? <div>{lead.email}</div> : null}
                </td>
                <td style={{ padding: "10px" }}>{lead.course || "—"}</td>
                <td style={{ padding: "10px" }}>{lead.city || "—"}</td>
                <td style={{ padding: "10px" }}>{lead.score}</td>
                <td style={{ padding: "10px" }}>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead, e.target.value)}
                    style={{
                      ...badge(lead.status),
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  <button
                    onClick={() => handleDelete(lead)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#dc2626",
                      cursor: "pointer",
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
