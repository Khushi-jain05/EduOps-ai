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
import ProtectedRoute from "./components/common/ProtectedRoute";
import McqGenerator from "./pages/faculty/McqGenerator";
import McqPreview from "./components/faculty/mcq/McqPreview";
import Assignments1 from "./pages/faculty/Assignments1";
import Analytics from "./pages/faculty/Analytics";
import LessonPlans from "./pages/faculty/LessonPlans";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
<Route

path="/faculty/mcq/:id"

element={
  <ProtectedRoute allowedRoles={["faculty"]}>
    <McqPreview/>
  </ProtectedRoute>
}

/>
<Route
  path="/faculty/mcq"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <McqGenerator />
    </ProtectedRoute>
  }
/>
<Route path="/faculty/lesson-plans" element={
  <ProtectedRoute allowedRoles={["faculty"]}>
    <LessonPlans />
  </ProtectedRoute>
}
/>
<Route
  path="/mcq/share/:token"
  element={<McqPreview shared />}
/>
        <Route
  path="/faculty"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <FacultyDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/support-ai"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <SupportAI />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty/question-paper"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <QuestionPaper />
    </ProtectedRoute>
  }
/>
<Route
  path="/subject-assistant"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Subjects />
    </ProtectedRoute>
  }
/>  

<Route
  path="/faculty/assignments"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <Assignments1 />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty/analytics"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <Analytics />
    </ProtectedRoute>
  }
/>  
<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/timetable"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Timetable />
    </ProtectedRoute>
  }
/>
<Route
  path="/assignments"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Assignments />
    </ProtectedRoute>
  }
/>
<Route
  path="/exams"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Exams />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
