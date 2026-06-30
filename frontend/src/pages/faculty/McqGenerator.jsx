import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import McqGrid from "../../components/faculty/mcq/McqGrid";
import GenerateMcqModal from "../../components/faculty/mcq/GenerateMcqModal";

import { getMcqSets } from "../../services/mcq.service";

export default function McqGenerator() {
  const [mcqs, setMcqs] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const loadMcqs = async () => {
    try {
      const data = await getMcqSets();

      setMcqs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMcqs();
  }, []);

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
          <McqGrid
            mcqs={mcqs}
            onNewClick={() => setOpenModal(true)}
          />
        </div>
      </div>

      <GenerateMcqModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadMcqs}
      />
    </div>
  );
}