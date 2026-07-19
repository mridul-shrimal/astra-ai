require("dotenv").config();

const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Astra AI Backend is running!",
  });
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    server: "Astra AI Backend",
    timestamp: new Date(),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Astra Backend running on http://localhost:${PORT}`);
});