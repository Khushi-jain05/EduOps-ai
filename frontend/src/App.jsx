import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupportAI from "./pages/student/SupportAI";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/student"
          element={<StudentDashboard />}
        />
        <Route
  path="/support-ai"
  element={<SupportAI />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;