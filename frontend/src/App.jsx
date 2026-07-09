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
import LessonDetails from "./pages/faculty/LessonDetails";
import FacultyProfile from "./pages/faculty/Profile";
import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import CoursesFees from "./pages/applicant/CoursesFees";
import Faqs from "./pages/applicant/Faqs";
import ApplyNow from "./pages/applicant/ApplyNow";
import BookAppointment from "./pages/applicant/BookAppointment";
import AdmissionsAI from "./pages/applicant/AdmissionsAI";
import ApplicantProfile from "./pages/applicant/ApplicantProfile";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Leads from "./pages/admin/Leads";
import AiAdmissionAssist from "./pages/admin/AiAdmissionAssist";
import LeadScoringPage from "./pages/admin/LeadScoringPage";
import SmartFollowUps from "./pages/admin/SmartFollowUps";
import AiCallingPage from "./pages/admin/AiCallingPage";
import CounselorPerformance from "./pages/admin/CounselorPerformance";
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
<Route path="/faculty/lesson-plan" element={
  <ProtectedRoute allowedRoles={["faculty"]}>
    <LessonPlans />
  </ProtectedRoute>
}
/>
<Route
  path="/faculty/lesson-plan/:id"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <LessonDetails />
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
  path="/notifications"
  element={
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty/notifications"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty/profile"
  element={
    <ProtectedRoute allowedRoles={["faculty"]}>
      <FacultyProfile />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <ApplicantDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant/courses"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <CoursesFees />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant/faqs"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <Faqs />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant/apply"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <ApplyNow />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant/appointment"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <BookAppointment />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant/admissions-ai"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <AdmissionsAI />
    </ProtectedRoute>
  }
/>
<Route
  path="/applicant/profile"
  element={
    <ProtectedRoute allowedRoles={["applicant"]}>
      <ApplicantProfile />
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
    <ProtectedRoute allowedRoles={["student", "admin"]}>
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
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/leads"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Leads />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/ai-admission-assist"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AiAdmissionAssist />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/lead-scoring"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <LeadScoringPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/follow-ups"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <SmartFollowUps />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/ai-calling"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AiCallingPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/counselor-performance"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CounselorPerformance />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
