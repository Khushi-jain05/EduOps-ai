import { useEffect, useState } from "react";

import { getSubjects } from "../../../services/subject.service";
import { getUnitsBySubject } from "../../../services/unit.service";

export default function GenerateLessonModal({
  open,
  onClose,
}) {
  const [subjects, setSubjects] = useState([]);

  const [units, setUnits] = useState([]);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    week: "",
    topic: "",
    objectives: "",
    description: "",
    lessonDate: "",
    startTime: "",
    endTime: "",
    room: "",
    homework: "",
    resources: "",
  });

  const [selectedUnits, setSelectedUnits] =
    useState([]);

  useEffect(() => {
    if (open) {
      loadSubjects();
    }
  }, [open]);

  useEffect(() => {
    if (form.subject) {
      loadUnits(form.subject);
    }
  }, [form.subject]);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUnits = async (subjectId) => {
    try {
      const data =
        await getUnitsBySubject(subjectId);

      setUnits(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  const input = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #DDE5F0",
    marginTop: "8px",
    marginBottom: "18px",
    fontSize: "15px",
  };

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
    >
      <div
        style={{
          width: "920px",
          background: "#fff",
          borderRadius: "26px",
          padding: "35px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            color: "#172554",
          }}
        >
          Create Lesson Plan
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "35px",
          }}
        >
          Plan your lesson and automatically
          sync it with the student timetable.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* LEFT */}

          <div>
            <label>Lesson Title</label>

            <input
              style={input}
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <label>Subject</label>

            <select
              style={input}
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject: e.target.value,
                })
              }
            >
              <option>
                Select Subject
              </option>

              {subjects.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                >
                  {s.code} - {s.name}
                </option>
              ))}
            </select>

            <label>Week</label>

            <input
              style={input}
              placeholder="Week 1"
              value={form.week}
              onChange={(e) =>
                setForm({
                  ...form,
                  week: e.target.value,
                })
              }
            />

            <label>Topic</label>

            <input
              style={input}
              value={form.topic}
              onChange={(e) =>
                setForm({
                  ...form,
                  topic: e.target.value,
                })
              }
            />

            <label>Description</label>

            <textarea
              rows={5}
              style={input}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />
          </div>

          {/* RIGHT */}

          <div>
            <label>
              Learning Objectives
            </label>

            <textarea
              rows={4}
              style={input}
              value={form.objectives}
              onChange={(e) =>
                setForm({
                  ...form,
                  objectives:
                    e.target.value,
                })
              }
            />

            <label>Select Units</label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              {units.map((unit) => (
                <label
                  key={unit.id}
                  style={{
                    border:
                      "1px solid #E2E8F0",
                    borderRadius:
                      "12px",
                    padding: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedUnits.includes(
                      unit.unit_number
                    )}
                    onChange={(e) => {
                      if (
                        e.target.checked
                      ) {
                        setSelectedUnits(
                          (prev) => [
                            ...prev,
                            unit.unit_number,
                          ]
                        );
                      } else {
                        setSelectedUnits(
                          (prev) =>
                            prev.filter(
                              (u) =>
                                u !==
                                unit.unit_number
                            )
                        );
                      }
                    }}
                  />

                  {" "}Unit{" "}
                  {unit.unit_number}
                </label>
              ))}
            </div>

            <label>Lesson Date</label>

            <input
              type="date"
              style={input}
            />

            <label>Start Time</label>

            <input
              type="time"
              style={input}
            />

            <label>End Time</label>

            <input
              type="time"
              style={input}
            />

            <label>Room</label>

            <input style={input} />

            <label>Homework</label>

            <textarea
              rows={3}
              style={input}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding:
                "12px 24px",
              borderRadius:
                "12px",
            }}
          >
            Cancel
          </button>

          <button
            style={{
              background:
                "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius:
                "12px",
              padding:
                "12px 26px",
            }}
          >
            Save Lesson
          </button>
        </div>
      </div>
    </div>
  );
}