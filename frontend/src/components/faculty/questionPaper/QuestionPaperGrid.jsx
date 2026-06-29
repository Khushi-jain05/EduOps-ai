import React, { useState } from "react";
import QuestionPaperCard from "./QuestionPaperCard";
import NewPaperCard from "./NewPaperCard";

const papers = [
  {
    id: 1,
    code: "CS301 • DATABASE SYSTEMS",
    title: "DBMS — Mid Semester",
    type: "Mid Sem",
    duration: "90 min",
    marks: 50,
    updated: "Updated 2h ago",
    status: "Published",
    color: "blue",
    border: "#7CC5FF",
  },
  {
    id: 2,
    code: "CS305 • OPERATING SYSTEMS",
    title: "Operating Systems — Quiz 3",
    type: "Quiz",
    duration: "20 min",
    marks: 20,
    updated: "Updated Yesterday",
    status: "Published",
    color: "purple",
    border: "#C5A8FF",
  },
  {
    id: 3,
    code: "CS210 • DATA STRUCTURES",
    title: "DSA — End Sem Draft",
    type: "End Sem",
    duration: "180 min",
    marks: 100,
    updated: "Updated 2d ago",
    status: "Draft",
    color: "green",
    border: "#8AE6D1",
  },
  {
    id: 4,
    code: "CS320 • COMPUTER NETWORKS",
    title: "Networks — Practice Set",
    type: "Practice",
    duration: "60 min",
    marks: 40,
    updated: "Updated 5d ago",
    status: "Draft",
    color: "orange",
    border: "#F8C97D",
  },
];

export default function QuestionPaperGrid() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
        gap: "22px",
        marginTop: "30px",
        marginBottom: "40px",
      }}
    >
      {papers.map((paper) => (
        <QuestionPaperCard
          key={paper.id}
          paper={paper}
        />
      ))}

      <NewPaperCard
  onClick={() => setOpenModal(true)}
/>
    </div>
  );
}