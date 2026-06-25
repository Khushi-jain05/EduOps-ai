import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupportAI from "./pages/student/SupportAI";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/student/StudentDashboard";
import Timetable from "./pages/student/Timetable";
import Assignments from "./pages/student/Assignments";
import Exams from "./pages/student/Exams";
import Subjects from './pages/student/SubjectAssistant';
import Profile from "./pages/student/Profile";


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
  path="/subject-assistant"
  element={<Subjects />}
/>  
<Route
  path="/profile"
  element={<Profile />}
/>

<Route
  path="/timetable"
  element={<Timetable />}
/>
<Route
  path="/assignments"
  element={<Assignments />}
/>
<Route
  path="/exams"
  element={<Exams />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;