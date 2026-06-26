import React from "react";

export default function Assignments1() {
  return (
    <div
      style={{
        padding: "30px",
        background: "#f8fbff",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#1E293B",
          marginBottom: "10px",
        }}
      >
        📄 Assignment Generator
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "30px",
        }}
      >
        Create AI-powered assignments for your students.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          maxWidth: "700px",
        }}
      >
        <h3>Create New Assignment</h3>

        <br />

        <label>Subject</label>
        <br />
        <input
          type="text"
          placeholder="e.g. Data Structures"
          style={inputStyle}
        />

        <br />
        <br />

        <label>Topic</label>
        <br />
        <input
          type="text"
          placeholder="e.g. Binary Trees"
          style={inputStyle}
        />

        <br />
        <br />

        <label>Difficulty</label>
        <br />
        <select style={inputStyle}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <br />
        <br />

        <button style={buttonStyle}>
          Generate Assignment
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  marginTop: "8px",
};

const buttonStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};