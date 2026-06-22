const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");

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

app.get("/", (req, res) => {
  res.send("EduOps Backend Running 🚀");
});

module.exports = app;