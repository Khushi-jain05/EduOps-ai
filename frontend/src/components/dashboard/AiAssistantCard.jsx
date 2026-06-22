import { Sparkles } from "lucide-react";

export default function AiAssistantCard() {
  return (
    <div className="white-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2>AI Study Assistant</h2>
          <p>
            Ask anything about your subjects,
            schedule or assignments
          </p>
        </div>

        <button className="chat-btn">
          Open Chat
        </button>
      </div>

      <div
        style={{
          border: "2px dashed #dbeafe",
          borderRadius: "20px",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <Sparkles size={35} />

        <p>
          Try:
          <strong>
            {" "}
            "Explain B-Trees with an example"
          </strong>
        </p>
      </div>
    </div>
  );
}