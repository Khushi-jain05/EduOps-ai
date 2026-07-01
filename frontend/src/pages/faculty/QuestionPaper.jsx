import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import QuestionPaperStats from "../../components/faculty/questionPaper/QuestionPaperStats";
import QuestionPaperSearch from "../../components/faculty/questionPaper/QuestionPaperSearch";
import QuestionPaperGrid from "../../components/faculty/questionPaper/QuestionPaperGrid";
import GeneratePaperModal from "../../components/faculty/questionPaper/GeneratePaperModal";

import { getQuestionPapers } from "../../services/questionPaper.service";

export default function QuestionPaper() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);

      const data = await getQuestionPapers();

      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const value = (
        paper.title +
        " " +
        paper.Subject?.name +
        " " +
        paper.Subject?.code
      )
        .toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [papers, search]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#F4F8FF",
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
          <QuestionPaperStats
            papers={papers}
            search={search}
            onSearchChange={setSearch}
            onNewPaper={() => setOpenModal(true)}
          />

          {loading ? (
            <h2
              style={{
                marginTop: 40,
              }}
            >
              Loading Question Papers...
            </h2>
          ) : (
            <>
              <QuestionPaperSearch />

              <QuestionPaperGrid
                papers={filteredPapers}
                onNewPaperClick={() =>
                  setOpenModal(true)
                }
                onOpenPaper={setSelectedPaper}
              />
            </>
          )}
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
          onClose={() =>
            setSelectedPaper(null)
          }
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
        background: "rgba(15,23,42,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "900px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "24px",
          padding: "45px",
          boxShadow:
            "0 25px 70px rgba(15,23,42,.25)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid #E2E8F0",
            paddingBottom: "20px",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            {content.title || paper.title}
          </h1>

          <p
            style={{
              color: "#64748B",
              marginTop: "12px",
            }}
          >
            {paper.Subject?.code} •{" "}
            {paper.Subject?.name}
          </p>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>
              Exam Type : {paper.exam_type}
            </span>

            <span>
              Duration : {paper.duration}
            </span>

            <span>
              Marks : {paper.total_marks}
            </span>
          </div>
        </div>

        {/* Instructions */}

        {content.instructions &&
          content.instructions.length > 0 && (
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "30px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                }}
              >
                Instructions
              </h3>

              <ul>
                {content.instructions.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

        {/* QUESTIONS */}

        {sections.map(
          (section, sectionIndex) => (
            <div
              key={sectionIndex}
              style={{
                marginBottom: "40px",
              }}
            >
              <h2
                style={{
                  color: "#2563EB",
                }}
              >
                {section.name}
              </h2>

              <p
                style={{
                  color: "#64748B",
                }}
              >
                {section.instructions}
              </p>

              {(section.questions || []).map(
                (question) => (
                  <div
                    key={question.number}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "16px",
                      padding: "20px",
                      marginTop: "18px",
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0,
                      }}
                    >
                      Q{question.number}.{" "}
                      {question.question}
                    </h3>

                    <div
                      style={{
                        marginTop: "14px",
                        display: "flex",
                        gap: "18px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Badge>
                        {question.marks} Marks
                      </Badge>

                      <Badge>
                        Unit {question.unit}
                      </Badge>

                      <Badge>
                        {question.difficulty}
                      </Badge>

                      <Badge>
                        {question.bloomLevel}
                      </Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          )
        )}

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <button
            onClick={() => window.print()}
            style={{
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              cursor: "pointer",
            }}
          >
            Print Paper
          </button>

          <button
            onClick={onClose}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      style={{
        background: "#EEF4FF",
        color: "#2563EB",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}