const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const chatRoutes = require("./routes/chat.routes");
const supportRoutes = require("./routes/supportAI.routes");
const timetableRoutes = require("./routes/timetable.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/support-ai", supportRoutes);
app.use("/api/timetable", timetableRoutes);

app.get("/", (req, res) => {
  res.send("EduOps Backend Running 🚀");
});

module.exports = app;