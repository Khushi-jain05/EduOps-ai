const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
    res.send("EduOps Backend Running 🚀");
  });
module.exports = app;