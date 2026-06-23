require('dotenv').config();

const app = require('./app');
const assignmentRoutes =require("./routes/assignment.routes");

const PORT = process.env.PORT || 8000;
const studentRoutes = require("./routes/student.routes");
app.use(
  "/api/assignments",
  assignmentRoutes
);
app.use("/api/student", studentRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});