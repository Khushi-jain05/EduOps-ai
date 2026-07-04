const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const chatRoutes = require("./routes/chat.routes");
const supportRoutes = require("./routes/supportAI.routes");
const timetableRoutes = require("./routes/timetable.routes");
const profileRoutes = require("./routes/profile.routes");
const lessonPlanRoutes = require("./routes/lessonPlan.routes");
const facultyRoutes = require("./routes/faculty.routes");
const notificationRoutes = require("./routes/notification.routes");
const lectureRoutes = require("./routes/lecture.routes");

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/support-ai", supportRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lesson-plans", lessonPlanRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/lectures", lectureRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("EduOps Backend Running 🚀");
});

module.exports = app;
