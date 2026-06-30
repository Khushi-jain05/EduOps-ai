const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin:[ "http://localhost:5174","http://localhost:5173" ],
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

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/support-ai", supportRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("EduOps Backend Running 🚀");
});

module.exports = app;