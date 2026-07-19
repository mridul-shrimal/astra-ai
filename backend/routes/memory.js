const express = require("express");
const router = express.Router();

const {
  getRecentMemories,
  clearMemories,
} = require("../services/memoryService");

// Get recent memories
router.get("/", async (req, res) => {
  try {
    const memories = await getRecentMemories(50);

    res.status(200).json({
    success: true,
    count: memories.length,
    memories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load memories.",
    });
  }
});

// Delete all memories
router.delete("/", async (req, res) => {
  try {
    await clearMemories();

    res.json({
      success: true,
      message: "All memories cleared.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear memories.",
    });
  }
});

module.exports = router;