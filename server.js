const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorMiddleware");
require("dotenv").config();

// 👇 Import DB connection here
require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const lectureRoutes = require("./routes/lectureRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS setup
const allowedOrigins = ["http://localhost:5174", process.env.FRONTEND_URL];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(errorHandler);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Online Lecture Management System" });
});

// Routes
app.use("/api/admins", adminRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/course", courseRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
