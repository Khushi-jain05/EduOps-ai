export default function AssignmentDetailsModal({ open, assignment, onClose, onSubmitClick }) {
  if (!open || !assignment) return null;

  const canSubmit = assignment.status === "Pending" || assignment.status === "Overdue";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "560px",
          background: "#fff",
          borderRadius: "26px",
          padding: "32px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "#EEF4FF",
            color: "#2563EB",
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "14px",
          }}
        >
          {assignment.subject_code || assignment.subject}
        </span>

        <h1 style={{ margin: 0, color: "#172554", fontSize: "26px" }}>
          {assignment.title}
        </h1>

        <div style={{ color: "#64748B", marginTop: "6px", fontSize: "14px" }}>
          Faculty · {assignment.faculty || "Not assigned"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "22px",
            marginBottom: "22px",
          }}
        >
          <Field label="Status" value={assignment.status} />
          <Field
            label="Due date"
            value={
              assignment.due_date
                ? new Date(assignment.due_date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A"
            }
          />
          <Field label="Total marks" value={assignment.total_marks} />
          {assignment.status === "Graded" && (
            <Field label="Your score" value={`${assignment.score}/${assignment.total_marks}`} />
          )}
        </div>

        <div style={{ marginBottom: "10px", fontWeight: 700, color: "#172554" }}>
          Instructions
        </div>

        <p style={{ color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {assignment.description || "No additional instructions provided."}
        </p>

        {assignment.file_url && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontWeight: 700, color: "#172554", marginBottom: "6px" }}>
              Your submission
            </div>
            <a href={assignment.file_url} target="_blank" rel="noreferrer">
              {assignment.file_url}
            </a>
          </div>
        )}

        {assignment.feedback && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontWeight: 700, color: "#172554", marginBottom: "6px" }}>
              Faculty feedback
            </div>
            <p style={{ color: "#334155" }}>{assignment.feedback}</p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: "1px solid #DDE5F0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>

          {canSubmit && (
            <button
              onClick={() => onSubmitClick?.(assignment)}
              style={{
                padding: "12px 22px",
                borderRadius: "12px",
                border: "none",
                background: "#2563EB",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Submit Assignment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ color: "#64748B", fontSize: "13px" }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#172554", marginTop: "2px" }}>{value}</div>
    </div>
  );
}
