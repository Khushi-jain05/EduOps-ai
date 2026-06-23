import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  Search,
  Filter,
  Download,
  Sparkles,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Award,
} from "lucide-react";

import { getAssignments } from "../../services/assignment.service";

import "../../styles/assignments.css";

export default function Assignments() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
const [showFilterModal, setShowFilterModal] = useState(false);
const [selectedSubject, setSelectedSubject] = useState("All");
const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("All");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data =
        await getAssignments();

      console.log(
        "Assignments:",
        data
      );

      setAssignments(data || []);
    } catch (error) {
      console.error(
        "Failed to load assignments",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments =
    assignments.filter((item) => {
      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.subject
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        selectedStatus === "All"
          ? true
          : item.status
              ?.trim()
              .toLowerCase() ===
            selectedStatus
              .trim()
              .toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const handleExport = () => {
    const rows =
      filteredAssignments.map(
        (item) => ({
          Title: item.title,
          Subject: item.subject,
          Faculty: item.faculty,
          Status: item.status,
          DueDate: item.dueDate,
        })
      );

    const header =
      Object.keys(rows[0] || {})
        .join(",");

    const csv = [
      header,
      ...rows.map((row) =>
        Object.values(row).join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "assignments.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  const pendingCount =
    assignments.filter(
      (a) =>
        a.status?.toLowerCase() ===
        "pending"
    ).length;

  const submittedCount =
    assignments.filter(
      (a) =>
        a.status?.toLowerCase() ===
        "submitted"
    ).length;

  const gradedCount =
    assignments.filter(
      (a) =>
        a.status?.toLowerCase() ===
        "graded"
    ).length;

  const overdueCount =
    assignments.filter(
      (a) =>
        a.status?.toLowerCase() ===
        "overdue"
    ).length;

  const getCardClass = (
    subject
  ) => {
    const value =
      subject?.toLowerCase();

    if (
      value?.includes("math")
    )
      return "math";

    if (
      value?.includes(
        "computer"
      )
    )
      return "cs";

    if (
      value?.includes(
        "physics"
      )
    )
      return "physics";

    return "history";
  };

  return (
    <div className="assignment-layout">
      <Sidebar />

      <div className="assignment-content">
        <Navbar />

        <div className="assignment-wrapper">

          <div className="assignment-header">
            <div>
              <span className="assignment-label">
                ASSIGNMENTS
              </span>

              <h1>
                Assignments
              </h1>

              <p>
                Track what's due,
                what's submitted
                and what's graded.
              </p>
            </div>

            <div className="assignment-actions">
              <button
                onClick={() =>
                  navigate(
                    "/support-ai"
                  )
                }
              >
                <Sparkles
                  size={16}
                />
                Ask AI
              </button>

              <button onClick={() => setShowFilterModal(true)}>
  <Filter size={16} />
  Filter
</button>

              <button
                onClick={
                  handleExport
                }
              >
                <Download
                  size={16}
                />
                Export
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <Clock3 className="stat-icon blue" />
              <h2>
                {pendingCount}
              </h2>
              <p>Pending</p>
            </div>

            <div className="stat-card">
              <AlertTriangle className="stat-icon red" />
              <h2>
                {overdueCount}
              </h2>
              <p>Overdue</p>
            </div>

            <div className="stat-card">
              <CheckCircle2 className="stat-icon green" />
              <h2>
                {
                  submittedCount
                }
              </h2>
              <p>
                Submitted
              </p>
            </div>

            <div className="stat-card">
              <Award className="stat-icon purple" />
              <h2>
                {gradedCount}
              </h2>
              <p>Graded</p>
            </div>
          </div>

          <div className="assignment-filters">

            <div className="search-box">
              <Search
                size={16}
              />

              <input
                value={
                  searchTerm
                }
                onChange={(
                  e
                ) =>
                  setSearchTerm(
                    e.target
                      .value
                  )
                }
                placeholder="Search assignment..."
              />
            </div>

            {[
              "All",
              "Pending",
              "Submitted",
              "Graded",
              "Overdue",
            ].map(
              (status) => (
                <button
                  key={
                    status
                  }
                  className={
                    selectedStatus ===
                    status
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedStatus(
                      status
                    )
                  }
                >
                  {status}
                </button>
              )
            )}
          </div>
{showFilterModal && (
  <div className="filter-modal-overlay">
    <div className="filter-modal">
      <h3>Filter Assignments</h3>

      <div className="filter-group">
        <label>Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) =>
            setSelectedSubject(e.target.value)
          }
        >
          <option>All</option>
          <option>Mathematics</option>
          <option>Computer Science</option>
          <option>Physics</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Faculty</label>
        <select
          value={selectedFaculty}
          onChange={(e) =>
            setSelectedFaculty(e.target.value)
          }
        >
          <option>All</option>
          <option>Dr. R. Mehta</option>
          <option>Prof. Sharma</option>
          <option>Dr. Verma</option>
        </select>
      </div>

      <div className="filter-actions">
        <button
          onClick={() => {
            setSelectedSubject("All");
            setSelectedFaculty("All");
          }}
        >
          Clear
        </button>

        <button
          className="apply-btn"
          onClick={() =>
            setShowFilterModal(false)
          }
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}
          {loading ? (
            <div
              style={{
                padding:
                  "40px",
                textAlign:
                  "center",
              }}
            >
              Loading...
            </div>
          ) : filteredAssignments.length ===
            0 ? (
            <div
              style={{
                background:
                  "white",
                padding:
                  "40px",
                borderRadius:
                  "24px",
                textAlign:
                  "center",
              }}
            >
              No matching
              assignments found
            </div>
          ) : (
            <div className="assignment-grid">

              {filteredAssignments.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className={`assignment-card ${getCardClass(
                      item.subject
                    )}`}
                  >
                    <span
                      className={`assignment-status ${item.status?.toLowerCase()}`}
                    >
                      {
                        item.status
                      }
                    </span>

                    <div>
                      <span className="course-code">
                        {
                          item.subject
                        }
                      </span>

                      <h3>
                        {
                          item.title
                        }
                      </h3>

                      <div className="due-info">
                        Due:{" "}
                        {item.dueDate
                          ? new Date(
                              item.dueDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>

                      <div className="faculty-text">
                        Faculty ·{" "}
                        {item.faculty ||
                          "Not Assigned"}
                      </div>
                    </div>

                    <div className="assignment-footer">
                      <button className="open-link">
                        Open
                        assignment
                        ↗
                      </button>
                    </div>
                  </div>
                )
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}