import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import LessonHero from "../../components/faculty/lessonPlan/LessonHero";
import LessonStats from "../../components/faculty/lessonPlan/LessonStats";
import LessonSearch from "../../components/faculty/lessonPlan/LessonSearch";
import LessonGrid from "../../components/faculty/lessonPlan/LessonGrid";
import GenerateLessonModal from "../../components/faculty/lessonPlan/GenerateLessonModal";

import {
  deleteLessonPlan,
  getLessonPlans,
} from "../../services/lessonPlan.service";

export default function LessonPlans() {
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const loadPlans = async () => {
    try {
      setLoading(true);

      const data = await getLessonPlans();

      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this lesson plan? It will also be removed from student timetables."
    );

    if (!confirmDelete) return;

    try {
      await deleteLessonPlan(id);
      await loadPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lesson plan");
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const query = search.toLowerCase();

      const matchesSearch =
        plan.title
          ?.toLowerCase()
          .includes(query) ||
        plan.Subject?.name
          ?.toLowerCase()
          .includes(query) ||
        plan.Subject?.code
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        plan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [plans, search, statusFilter]);

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
          <LessonHero
            onNewClick={() =>
              setOpenModal(true)
            }
          />

          <LessonStats
            plans={plans}
          />

          <LessonSearch
            search={search}
            onSearchChange={
              setSearch
            }
            statusFilter={
              statusFilter
            }
            onStatusFilterChange={
              setStatusFilter
            }
          />

          {loading ? (
            <h2
              style={{
                marginTop: "40px",
              }}
            >
              Loading Lesson Plans...
            </h2>
          ) : (
            <LessonGrid
              plans={filteredPlans}
              onNewClick={() =>
                setOpenModal(true)
              }
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <GenerateLessonModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSuccess={loadPlans}
/>
    </div>
  );
}
