import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useState } from "react";
// import QuestionPaperHeader from "../../components/faculty/questionPaper/QuestionPaperHeader";
import QuestionPaperStats from "../../components/faculty/questionPaper/QuestionPaperStats";
// import SearchFilter from "../../components/faculty/questionPaper/SearchFilter";
// import PaperGrid from "../../components/faculty/questionPaper/PaperGrid";
import QuestionPaperSearch from "../../components/faculty/questionPaper/QuestionPaperSearch";
import QuestionPaperGrid from "../../components/faculty/questionPaper/QuestionPaperGrid";

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
          {/* <QuestionPaperHeader /> */}

          <QuestionPaperStats />
          <QuestionPaperSearch />
          <QuestionPaperGrid />
        </div>
      </div>
    </div>
  );
}