import { useEffect, useState } from "react";

import { getSubjects } from "../../../services/subject.service";
import { getUnitsBySubject } from "../../../services/unit.service";
import { createLessonPlan } from "../../../services/lessonPlan.service";

export default function GenerateLessonModal({
  open,
  onClose,
  onSuccess
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
    meetingLink: "",
    semester: "",
    section: "",
    branch: "",
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
  const handleSave = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (
      !form.title ||
      !form.subject ||
      !form.lessonDate ||
      !form.startTime ||
      !form.endTime
    ) {
      alert("Please fill title, subject, date, start time and end time.");
      return;
    }

    const duration =
      form.startTime && form.endTime
        ? Math.max(
            1,
            Math.round(
              (new Date(`1970-01-01T${form.endTime}:00`) -
                new Date(`1970-01-01T${form.startTime}:00`)) /
                60000
            )
          )
        : 60;

    await createLessonPlan({
      title: form.title,
      topic: form.topic,

      subject_id: form.subject,

      faculty_id: user.id,

      lesson_date: form.lessonDate,

      day: new Date(form.lessonDate).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
        }
      ),

      start_time: form.startTime,

      end_time: form.endTime,

      duration,

      room: form.room,

      meeting_link: form.meetingLink,

      semester: form.semester,

      section: form.section,

      branch: form.branch,

      sessions: 1,

      weeks: Number(form.week) || 1,

      objectives: form.objectives
        ? form.objectives.split("\n")
        : [],

      outcomes: selectedUnits,

      notes: [form.description, form.homework]
        .filter(Boolean)
        .join("\n\nHomework:\n"),
    });

    alert("Lesson Plan Created Successfully");

    if (onSuccess) {
      await onSuccess();
    }

    onClose();
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
        "Unable to save lesson."
    );
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
              <option value="">
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
value={form.lessonDate}
onChange={(e)=>
setForm({
...form,
lessonDate:e.target.value
})
}
/>
            <label>Start Time</label>

            <input
type="time"
style={input}
value={form.startTime}
onChange={(e)=>
setForm({
...form,
startTime:e.target.value
})
}
/>

            <label>End Time</label>

            <input
              type="time"
              style={input}
              value={form.endTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  endTime: e.target.value,
                })
              }
            />

            <label>Room</label>

            <input
style={input}
value={form.room}
onChange={(e)=>
setForm({
...form,
room:e.target.value
})
}
/>

            <label>Meeting Link</label>

            <input
style={input}
value={form.meetingLink}
onChange={(e)=>
setForm({
...form,
meetingLink:e.target.value
})
}
/>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label>Semester</label>

                <input
style={input}
value={form.semester}
onChange={(e)=>
setForm({
...form,
semester:e.target.value
})
}
/>
              </div>

              <div>
                <label>Section</label>

                <input
style={input}
value={form.section}
onChange={(e)=>
setForm({
...form,
section:e.target.value
})
}
/>
              </div>

              <div>
                <label>Branch</label>

                <input
style={input}
value={form.branch}
onChange={(e)=>
setForm({
...form,
branch:e.target.value
})
}
/>
              </div>
            </div>

            <label>Homework</label>

            <textarea
rows={3}
style={input}
value={form.homework}
onChange={(e)=>
setForm({
...form,
homework:e.target.value
})
}
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
          onClick={handleSave}
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
