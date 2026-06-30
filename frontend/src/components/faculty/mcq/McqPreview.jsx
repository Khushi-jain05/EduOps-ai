import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";

import { getMcqById } from "../../../services/mcq.service";

export default function McqPreview() {
  const { id } = useParams();

  const [mcq, setMcq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMcq();
  }, [id]);

  const loadMcq = async () => {
    try {
      const data = await getMcqById(id);
      setMcq(data);
    } catch (err) {
      console.error("Failed to load MCQ", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading...</h2>;
  }

  if (!mcq) {
    return <h2 style={{ padding: "30px" }}>MCQ Set Not Found</h2>;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#EEF6FF",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "35px",
          }}
        >
          <h1>{mcq.title}</h1>

          <h3>
            {mcq.Subject?.code} • {mcq.Subject?.name}
          </h3>

          <p>
            Total Questions : {mcq.mcq_questions?.length || 0}
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {mcq.mcq_questions?.length > 0 ? (
              mcq.mcq_questions.map((q, index) => (
                <div
                  key={q.id}
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "18px",
                    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
                  }}
                >
                  <h3>
                    Q{index + 1}. {q.question}
                  </h3>

                  <p>A. {q.options?.A}</p>
                  <p>B. {q.options?.B}</p>
                  <p>C. {q.options?.C}</p>
                  <p>D. {q.options?.D}</p>

                  <hr />

                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {q.correct_answer}
                  </p>

                  <p>
                    <strong>Explanation:</strong>{" "}
                    {q.explanation || "No explanation available"}
                  </p>

                  <p>
                    <strong>Difficulty:</strong>{" "}
                    {q.difficulty}
                  </p>

                  <p>
                    <strong>Bloom Level:</strong>{" "}
                    {q.bloom_level}
                  </p>

                  <p>
                    <strong>Marks:</strong>{" "}
                    {q.marks}
                  </p>
                </div>
              ))
            ) : (
              <h3>No MCQs Found</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}