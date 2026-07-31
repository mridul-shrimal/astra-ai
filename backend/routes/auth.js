const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// Health Check
router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working ✅",
  });
});

// Signup
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;