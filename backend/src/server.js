require("dotenv").config();

const app = require("./app");

const assignmentRoutes = require("./routes/assignment.routes");
const examRoutes = require("./routes/exam.routes");
const subjectRoutes = require("./routes/subject.routes");
const studentRoutes = require("./routes/student.routes");
const questionPaperRoutes = require("./routes/questionPaper.routes");
const uploadRoutes = require("./routes/upload.routes");

const PORT = process.env.PORT || 8000;

app.use("/api/upload", uploadRoutes);
app.use("/api/question-paper", questionPaperRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/student", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});