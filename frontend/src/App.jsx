import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupportAI from "./pages/student/SupportAI";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/student/StudentDashboard";
import Timetable from "./pages/student/Timetable";
import Assignments from "./pages/student/Assignments";


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

<Route
  path="/timetable"
  element={<Timetable />}
/>
<Route
  path="/assignments"
  element={<Assignments />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;