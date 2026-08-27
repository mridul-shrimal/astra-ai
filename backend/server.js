const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Database
require("./database/database");

// Routes
const chatRoutes = require("./routes/chat");
const memoryRoutes = require("./routes/memory");
const uploadRoutes = require("./routes/upload");
const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversation");
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

  // Routes
  app.use("/api/chat", chatRoutes);
  app.use("/api/conversations", conversationRoutes);
  app.use("/api/memory", memoryRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/auth", authRoutes);

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
  console.log(`🚀 Astra Backend running on http://0.0.0.0:${PORT}`);

});