require('dotenv').config();

const app = require('./app');
const assignmentRoutes =require("./routes/assignment.routes");
const examRoutes =require("./routes/exam.routes");
const subjectRoutes =
require("./routes/subject.routes");
import questionPaperRoutes from "./routes/questionPaper.routes.js";

app.use("/api/question-paper", questionPaperRoutes);


const PORT = process.env.PORT || 8000;
const studentRoutes = require("./routes/student.routes");
app.use("/api/assignments",assignmentRoutes);
app.use("/api/exams",examRoutes);
app.use(
"/api/subjects",
subjectRoutes
);

app.use("/api/student", studentRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


