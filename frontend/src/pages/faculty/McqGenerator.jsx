import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiLayers,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import McqGrid from "../../components/faculty/mcq/McqGrid";
import GenerateMcqModal from "../../components/faculty/mcq/GenerateMcqModal";

import { getMcqSets } from "../../services/mcq.service";

export default function McqGenerator() {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const loadMcqs = async () => {
    try {
      setLoading(true);

      const data = await getMcqSets();

      setMcqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMcqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMcqs();
  }, []);

  const stats = useMemo(() => {
    return {
      total: mcqs.length,
      published: mcqs.filter(
        (m) => m.status === "published"
      ).length,
      drafts: mcqs.filter(
        (m) => m.status !== "published"
      ).length,
    };
  }, [mcqs]);

  return (
    <div
      style={{
        display: "flex",
        background: "#F6F8FC",
        height: "100vh",
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
          {/* HERO */}

          <div
            style={{
              borderRadius: "30px",
              padding: "40px",
              color: "#fff",
              background:
                "linear-gradient(135deg,#2563eb,#60a5fa)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,.15)",
                padding: "8px 18px",
                borderRadius: "30px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              Faculty • MCQ Sets
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "42px",
              }}
            >
              MCQ Generator
            </h1>

            <p
              style={{
                opacity: .9,
                marginTop: "12px",
                fontSize: "17px",
              }}
            >
              Generate AI-powered MCQ sets from your
              question bank, uploaded PDFs and study
              material.
            </p>

            {/* Search */}

            <div
              style={{
                marginTop: "35px",
                display: "flex",
                gap: "15px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "16px",
                  padding: "0 18px",
                }}
              >
                <FiSearch color="#64748B" />

                <input
                  placeholder="Search MCQ Sets..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    padding: "16px",
                    fontSize: "15px",
                  }}
                />
              </div>

              <button
                onClick={() =>
                  setOpenModal(true)
                }
                style={{
                  border: "none",
                  background: "#fff",
                  color: "#2563eb",
                  padding: "0 26px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FiPlus />
                New MCQ Set
              </button>
            </div>
          </div>

          {/* STATS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3,1fr)",
              gap: "20px",
              marginTop: "28px",
            }}
          >
            <StatCard
              icon={<FiLayers />}
              value={stats.total}
              title="Total MCQ Sets"
            />

            <StatCard
              icon={<FiCheckCircle />}
              value={stats.published}
              title="Published"
            />

            <StatCard
              icon={<FiClock />}
              value={stats.drafts}
              title="Drafts"
            />
          </div>

          {/* GRID */}

          {loading ? (
            <h2
              style={{
                marginTop: "40px",
              }}
            >
              Loading MCQ Sets...
            </h2>
          ) : (
            <McqGrid
              mcqs={mcqs}
              search={search}
              onNewClick={() =>
                setOpenModal(true)
              }
            />
          )}
        </div>
      </div>

      <GenerateMcqModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        onSuccess={loadMcqs}
      />
    </div>
  );
}

function StatCard({
  icon,
  value,
  title,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "22px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow:
          "0 10px 25px rgba(15,23,42,.05)",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background:
         "linear-gradient(135deg,#EEF2FF,#DDD6FE)",
          color:"#2563eb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        {icon}
      </div>

      <div>
        <h2
          style={{
            margin: 0,
          }}
        >
          {value}
        </h2>

        <div
          style={{
            color: "#64748B",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}