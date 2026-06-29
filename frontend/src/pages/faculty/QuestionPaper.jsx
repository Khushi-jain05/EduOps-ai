import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import QuestionPaperHeader from "../../components/faculty/questionPaper/QuestionPaperHeader";
import QuestionPaperStats from "../../components/faculty/questionPaper/QuestionPaperStats";
import SearchFilter from "../../components/faculty/questionPaper/SearchFilter";
import PaperGrid from "../../components/faculty/questionPaper/PaperGrid";

export default function QuestionPaper() {
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
          <QuestionPaperHeader />

          <QuestionPaperStats />

          <SearchFilter />

          <PaperGrid />
        </div>
      </div>
    </div>
  );
}