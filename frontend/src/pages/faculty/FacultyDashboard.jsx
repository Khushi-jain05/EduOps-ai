import Sidebar from "../../components/layout/Sidebar";

export default function FacultyDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <h1>Faculty Dashboard</h1>
      </div>
    </div>
  );
}