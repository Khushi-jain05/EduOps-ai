import { useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import QuestionPaperStats from "../../components/faculty/questionPaper/QuestionPaperStats";
import QuestionPaperSearch from "../../components/faculty/questionPaper/QuestionPaperSearch";
import QuestionPaperGrid from "../../components/faculty/questionPaper/QuestionPaperGrid";
import GeneratePaperModal from "../../components/faculty/questionPaper/GeneratePaperModal";

export default function QuestionPaper() {

  const [openModal, setOpenModal] = useState(false);

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
          overflow: "hidden",
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
          <QuestionPaperStats />

          <QuestionPaperSearch />

          <QuestionPaperGrid
            onNewPaperClick={() => setOpenModal(true)}
          />
        </div>
      </div>

      <GeneratePaperModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}