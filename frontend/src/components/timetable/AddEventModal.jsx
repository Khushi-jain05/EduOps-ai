import { useState } from "react";
import { createTimetable } from "../../services/timetable.service";

export default function AddEventModal({
  open,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    subject: "",
    faculty: "",
    room: "",
    day: "Monday",
    category: "Mathematics",
    startTime: "08:00",
    duration: 1,
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.subject.trim() ||
      !form.faculty.trim() ||
      !form.room.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await createTimetable({
        ...form,
        duration: Number(form.duration),
      });

      alert("Event added successfully");

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Add Event</h2>

        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
        />

        <input
          name="faculty"
          placeholder="Faculty"
          value={form.faculty}
          onChange={handleChange}
        />

        <input
          name="room"
          placeholder="Room"
          value={form.room}
          onChange={handleChange}
        />

        <select
          name="day"
          value={form.day}
          onChange={handleChange}
        >
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Mathematics</option>
          <option>Computer Science</option>
          <option>Physics</option>
          <option>Labs</option>
          <option>Languages</option>
          <option>Other</option>
        </select>

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
        />

        <input
          type="number"
          min="1"
          name="duration"
          value={form.duration}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button onClick={onClose}>
            Cancel
          </button>

          <button
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}