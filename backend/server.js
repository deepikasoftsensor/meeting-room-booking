require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// ======================
// Middleware
// ======================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Make socket available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ======================
// Health Check
// ======================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ======================
// Routes
// ======================
app.use('/api/users', require('./routes/users'));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/company", require("./routes/company"));

// ======================
// 404
// ======================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ======================
// Start Server
// ======================

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
  