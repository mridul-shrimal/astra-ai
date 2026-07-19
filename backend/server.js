const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Database
require("./database/database");

// Routes
const chatRoutes = require("./routes/chat");
const memoryRoutes = require("./routes/memory");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/memory", memoryRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Astra Backend is Running",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Astra Backend running on http://localhost:${PORT}`);
});