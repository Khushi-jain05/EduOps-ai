import { useEffect, useState } from "react";
import { getSubjects } from "../../../services/subject.service";

export default function SubjectSelector({
  value,
  onChange,
}) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.select}
    >
      <option value="">
        Select Subject
      </option>

      {subjects.map((subject) => (
        <option
          key={subject.id}
          value={subject.id}
        >
          {subject.name}
        </option>
      ))}
    </select>
  );
}

const styles = {
  select: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
  },
};