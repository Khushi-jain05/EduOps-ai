import { useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useEffect } from "react";
import { getQuestionPapers } from "../../services/questionPaper.service";
import QuestionPaperStats from "../../components/faculty/questionPaper/QuestionPaperStats";
import QuestionPaperSearch from "../../components/faculty/questionPaper/QuestionPaperSearch";
import QuestionPaperGrid from "../../components/faculty/questionPaper/QuestionPaperGrid";
import GeneratePaperModal from "../../components/faculty/questionPaper/GeneratePaperModal";

export default function QuestionPaper() {
  const [papers, setPapers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("30");
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const data = await getQuestionPapers();
      setPapers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterSubjects = useMemo(() => {
    const byId = new Map();

    papers.forEach((paper) => {
      if (paper.Subject?.id) {
        byId.set(paper.Subject.id, paper.Subject);
      }
    });

    return Array.from(byId.values());
  }, [papers]);

  const filterTypes = useMemo(
    () =>
      Array.from(
        new Set(
          papers
            .map((paper) => paper.exam_type)
            .filter(Boolean)
        )
      ),
    [papers]
  );

  const filteredPapers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = Date.now();

    return papers.filter((paper) => {
      const searchable = [
        paper.title,
        paper.exam_type,
        paper.Subject?.code,
        paper.Subject?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) {
        return false;
      }

      if (
        subjectFilter !== "all" &&
        paper.subject_id !== subjectFilter
      ) {
        return false;
      }

      if (
        typeFilter !== "all" &&
        paper.exam_type !== typeFilter
      ) {
        return false;
      }

      if (dateFilter !== "all") {
        const updatedAt = new Date(
          paper.updated_at || paper.created_at
        ).getTime();
        const days = Number(dateFilter);
        const cutoff = now - days * 24 * 60 * 60 * 1000;

        if (Number.isFinite(updatedAt) && updatedAt < cutoff) {
          return false;
        }
      }

      return true;
    });
  }, [papers, search, subjectFilter, typeFilter, dateFilter]);

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
          <QuestionPaperStats papers={papers} />

          <QuestionPaperSearch
            search={search}
            onSearchChange={setSearch}
            subjectFilter={subjectFilter}
            onSubjectFilterChange={setSubjectFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            subjects={filterSubjects}
            types={filterTypes}
          />

          <QuestionPaperGrid
            papers={filteredPapers}
            onNewPaperClick={() => setOpenModal(true)}
            onOpenPaper={setSelectedPaper}
          />
        </div>
      </div>

      <GeneratePaperModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadPapers}
      />

      {selectedPaper && (
        <GeneratedPaperPreview
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
}

function GeneratedPaperPreview({ paper, onClose }) {
  const content = paper.generated_content || {};
  const sections = content.sections || [];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "760px",
          maxHeight: "88vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 24px 80px rgba(15,23,42,.22)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              {content.title || paper.title}
            </h2>
            <p style={{ color: "#64748B", marginTop: "8px" }}>
              {paper.Subject?.code} - {paper.Subject?.name} •{" "}
              {paper.exam_type} • {paper.total_marks} marks
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#F1F5F9",
              borderRadius: "10px",
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>

        {content.instructions?.length > 0 && (
          <div style={{ marginTop: "18px" }}>
            <strong>Instructions</strong>
            <ul>
              {content.instructions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {sections.length === 0 ? (
          <pre
            style={{
              marginTop: "20px",
              background: "#F8FAFC",
              borderRadius: "12px",
              padding: "16px",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(content, null, 2)}
          </pre>
        ) : (
          sections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{ marginTop: "24px" }}>
              <h3>{section.name}</h3>
              <p style={{ color: "#64748B" }}>
                {section.instructions}
              </p>

              {(section.questions || []).map((question) => (
                <div
                  key={question.number}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    padding: "14px",
                    marginTop: "12px",
                  }}
                >
                  <strong>
                    Q{question.number}. {question.question}
                  </strong>
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    {question.marks} marks • Unit {question.unit || "-"} •{" "}
                    {question.difficulty} • {question.bloomLevel}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
