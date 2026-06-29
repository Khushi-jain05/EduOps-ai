import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupportAI from "./pages/student/SupportAI";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/student/StudentDashboard";
import Timetable from "./pages/student/Timetable";
import Assignments from "./pages/student/Assignments";
import Exams from "./pages/student/Exams";
import Subjects from './pages/student/SubjectAssistant';
import Profile from "./pages/student/Profile";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import QuestionPaper from "./pages/faculty/QuestionPaper";


import Assignments1 from "./pages/faculty/Assignments1";
import Analytics from "./pages/faculty/Analytics";
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
  path="/faculty"
  element={<FacultyDashboard />}
/>
        <Route
  path="/support-ai"
  element={<SupportAI />}
/>
<Route
  path="/faculty/question-paper"
  element={<QuestionPaper />}
/>
<Route
  path="/subject-assistant"
  element={<Subjects />}
/>  

<Route
  path="/faculty/assignments"
  element={<Assignments1 />}
/>
<Route
  path="/faculty/analytics"
  element={<Analytics />}
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