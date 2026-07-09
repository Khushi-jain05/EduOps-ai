const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const app = require("./app");
const unitRoutes = require("./routes/unit.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const examRoutes = require("./routes/exam.routes");
const subjectRoutes = require("./routes/subject.routes");
const studentRoutes = require("./routes/student.routes");
const questionPaperRoutes = require("./routes/questionPaper.routes");
const uploadRoutes = require("./routes/upload.routes");
const mcqRoutes = require("./routes/mcq.routes");
const authRoutes = require("./routes/auth.routes");
const lessonPlanRoutes = require("./routes/lessonPlan.routes");
const facultyRoutes = require("./routes/faculty.routes");
const notificationRoutes = require("./routes/notification.routes");
const applicantRoutes = require("./routes/applicant.routes");
const leadRoutes = require("./routes/lead.routes");
const callAgentRoutes = require("./routes/callAgent.routes");
const campaignRoutes = require("./routes/campaign.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const googleSheetRoutes = require("./routes/googleSheet.routes");
const adminChatRoutes = require("./routes/adminChat.routes");
const PORT = process.env.PORT || 8000;
app.use("/api/auth", authRoutes);
app.use("/api/question-paper", questionPaperRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/unit", unitRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/question-paper", questionPaperRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/lesson-plans", lessonPlanRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/applicant", applicantRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/call-agents", callAgentRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/google-sheets", googleSheetRoutes);
app.use("/api/admin-chat", adminChatRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
