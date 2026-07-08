import { useState } from "react";
import { syncSheetNow, updateSheetUrl } from "../../../../services/googleSheets.service";
import { card, input, primaryButton } from "../leadsStyles";
import { FiFileText, FiRefreshCw } from "react-icons/fi";

export default function GoogleSheetsTab({ status, onChanged }) {
  const [sheetUrl, setSheetUrl] = useState(status.sheet_url || "");
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncSheetNow();
      await onChanged();
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveUrl = async () => {
    await updateSheetUrl(sheetUrl);
    await onChanged();
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "#e8fbf6",
            color: "#0891b2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
          }}
        >
          <FiFileText />
        </div>
        <div>
          <h2 style={{ margin: 0, color: "#172554" }}>Google Sheets Sync</h2>
          <span
            style={{
              display: "inline-block",
              marginTop: "4px",
              padding: "2px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              textTransform: "capitalize",
              background: status.status === "connected" ? "#e8fbf6" : "#f3f4f6",
              color: status.status === "connected" ? "#0891b2" : "#6b7280",
            }}
          >
            {status.status}
          </span>
        </div>
      </div>

      <label>Sheet URL</label>
      <input
        style={input}
        value={sheetUrl}
        onChange={(e) => setSheetUrl(e.target.value)}
        onBlur={handleSaveUrl}
        placeholder="https://docs.google.com/spreadsheets/d/..."
      />

      <div style={{ display: "flex", gap: "24px", marginBottom: "20px", color: "#64748B" }}>
        <div>
          <strong style={{ display: "block", color: "#172554", fontSize: "20px" }}>
            {status.synced_rows}
          </strong>
          Rows synced
        </div>
        <div>
          <strong style={{ display: "block", color: "#172554", fontSize: "20px" }}>
            {status.last_synced_at
              ? new Date(status.last_synced_at).toLocaleString()
              : "Never"}
          </strong>
          Last synced
        </div>
      </div>

      <button
        onClick={handleSync}
        disabled={syncing}
        style={{ ...primaryButton, display: "flex", alignItems: "center", gap: "8px" }}
      >
        <FiRefreshCw /> {syncing ? "Syncing..." : "Sync now"}
      </button>
    </div>
  );
}
