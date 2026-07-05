import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilePlus,
  FiCheckSquare,
  FiPercent,
  FiCheckCircle,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import CreateAssignmentModal from "../../components/faculty/assignment/CreateAssignmentModal";
import AssignmentSubmissionsModal from "../../components/faculty/assignment/AssignmentSubmissionsModal";

import { deleteAssignment, getAssignments } from "../../services/assignment.service";

export default function Assignments1() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("live");
  const [openModal, setOpenModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingAssignmentId, setViewingAssignmentId] = useState(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAssignments();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load assignments", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleNew = () => {
    setEditingAssignment(null);
    setOpenModal(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this assignment? It will be removed from every student's portal."
    );

    if (!confirmDelete) return;

    try {
      await deleteAssignment(id);
      await loadAssignments();
    } catch (err) {
      console.error("Failed to delete assignment", err);
      alert(err.response?.data?.message || "Failed to delete assignment");
    }
  };

  const stats = useMemo(() => {
    const active = assignments.filter((a) => a.status === "active").length;

    const toGrade = assignments.reduce(
      (sum, a) => sum + Math.max(0, (a.submitted_count || 0) - (a.graded_count || 0)),
      0
    );

    const submissionRates = assignments
      .filter((a) => a.total_students > 0)
      .map((a) => (a.submitted_count / a.total_students) * 100);

    const avgSubmission = submissionRates.length
      ? Math.round(submissionRates.reduce((s, v) => s + v, 0) / submissionRates.length)
      : 0;

    const scores = assignments.filter((a) => a.avg_score_pct !== null).map((a) => a.avg_score_pct);

    const classAverage = scores.length
      ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
      : 0;

    return { active, toGrade, avgSubmission, classAverage };
  }, [assignments]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.Subject?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.Subject?.code?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (tab === "live") return a.status === "active";
      if (tab === "drafts") return a.status === "draft";
      if (tab === "graded") return a.total_students > 0 && a.graded_count === a.total_students;

      return true;
    });
  }, [assignments, search, tab]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          <div
            style={{
              background: "linear-gradient(135deg,#2563EB,#4F8EF7)",
              borderRadius: "34px",
              padding: "38px",
              color: "#fff",
              marginBottom: "28px",
              boxShadow: "0 18px 45px rgba(37,99,235,.25)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,.15)",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Faculty • Assignments
            </div>

            <h1 style={{ margin: 0, fontSize: "45px", fontWeight: 600 }}>Assignments</h1>

            <p style={{ marginTop: "12px", maxWidth: "700px", color: "rgba(255,255,255,.92)" }}>
              Create, distribute and grade student work — assignments sync to the student
              portal the moment they're posted.
            </p>

            <div style={{ display: "flex", gap: "18px", marginTop: "30px" }}>
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: "18px",
                  height: "55px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 22px",
                }}
              >
                <FiSearch size={20} color="#94A3B8" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Assignments..."
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    marginLeft: "15px",
                    fontSize: "16px",
                  }}
                />
              </div>

              <button
                onClick={handleNew}
                style={{
                  height: "55px",
                  padding: "0 24px",
                  borderRadius: "18px",
                  border: "none",
                  background: "#fff",
                  color: "#2563EB",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                <FiPlus />
                New Assignment
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "22px",
              marginBottom: "28px",
            }}
          >
            <StatCard icon={<FiFilePlus />} value={stats.active} label="Active" />
            <StatCard icon={<FiCheckSquare />} value={stats.toGrade} label="To grade" />
            <StatCard
              icon={<FiPercent />}
              value={`${stats.avgSubmission}%`}
              label="Avg. submission"
            />
            <StatCard
              icon={<FiCheckCircle />}
              value={`${stats.classAverage}/100`}
              label="Class average"
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {[
              { key: "live", label: "Live" },
              { key: "drafts", label: "Drafts" },
              { key: "graded", label: "Graded" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "10px 22px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  background: tab === t.key ? "#2563EB" : "#fff",
                  color: tab === t.key ? "#fff" : "#334155",
                  boxShadow: "0 4px 12px rgba(15,23,42,.05)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <h2 style={{ marginTop: "40px" }}>Loading assignments...</h2>
          ) : filtered.length === 0 ? (
            <div
              style={{
                background: "#fff",
                padding: "80px",
                borderRadius: "24px",
                textAlign: "center",
                color: "#64748B",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              No assignments found
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((a) => {
                const progress =
                  a.total_students > 0
                    ? Math.round((a.submitted_count / a.total_students) * 100)
                    : 0;

                return (
                  <div
                    key={a.id}
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      padding: "22px 26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "24px",
                      boxShadow: "0 8px 20px rgba(15,23,42,.05)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#64748B", fontSize: "13px", fontWeight: 600 }}>
                        {a.Subject?.name} · {a.Subject?.code}
                      </div>

                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#172554" }}>
                        {a.title}
                      </div>

                      <div style={{ color: "#64748B", fontSize: "13px", marginTop: "4px" }}>
                        Due {new Date(a.due_date).toLocaleString(undefined, {
                          weekday: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <Metric label="Submitted" value={`${a.submitted_count}/${a.total_students}`} />
                    <Metric label="Graded" value={a.graded_count} />

                    <div style={{ width: "140px" }}>
                      <div style={{ color: "#64748B", fontSize: "13px", marginBottom: "6px" }}>
                        Progress
                      </div>
                      <div
                        style={{
                          height: "8px",
                          background: "#E2E8F0",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg,#2563EB,#60A5FA)",
                          }}
                        />
                      </div>
                      <div style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>
                        {progress}%
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => setViewingAssignmentId(a.id)}
                        style={{
                          border: "none",
                          borderRadius: "14px",
                          background: "#172554",
                          color: "#fff",
                          padding: "12px 18px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Open ↗
                      </button>

                      <button
                        title="Edit assignment"
                        onClick={() => handleEdit(a)}
                        style={{
                          border: "1px solid #DDE5F0",
                          borderRadius: "14px",
                          background: "#fff",
                          color: "#334155",
                          padding: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        title="Delete assignment"
                        onClick={() => handleDelete(a.id)}
                        style={{
                          border: "1px solid #FECACA",
                          borderRadius: "14px",
                          background: "#FEF2F2",
                          color: "#DC2626",
                          padding: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CreateAssignmentModal
        open={openModal}
        assignment={editingAssignment}
        onClose={() => setOpenModal(false)}
        onSuccess={loadAssignments}
      />

      <AssignmentSubmissionsModal
        open={Boolean(viewingAssignmentId)}
        assignmentId={viewingAssignmentId}
        onClose={() => setViewingAssignmentId(null)}
        onChange={loadAssignments}
      />
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "26px",
        padding: "26px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 10px 30px rgba(15,23,42,.06)",
        border: "1px solid #EDF2F7",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#EEF4FF,#DCEBFF)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          color: "#2563EB",
        }}
      >
        {icon}
      </div>

      <div>
        <div style={{ fontSize: "24px", fontWeight: 700, color: "#172554", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ marginTop: "6px", color: "#64748B", fontSize: "15px" }}>{label}</div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ textAlign: "center", minWidth: "70px" }}>
      <div style={{ color: "#64748B", fontSize: "13px" }}>{label}</div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#172554" }}>{value}</div>
    </div>
  );
}
