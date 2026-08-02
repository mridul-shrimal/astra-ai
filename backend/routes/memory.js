const express = require("express");
const router = express.Router();

const {
  getRecentMemories,
  clearMemories,
  getMemoryCount,
} = require("../services/memoryService");

// Total memory count
router.get("/count/all", async (req, res) => {
  try {
    const count = await getMemoryCount();

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get memory count.",
    });
  }
});

// Get memories of ONE chat
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const memories = await getRecentMemories(sessionId, 50);

    res.json({
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

// Delete ONE chat memory
router.delete("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    await clearMemories(sessionId);

    res.json({
      success: true,
      message: "Chat memory cleared.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear memory.",
    });
  }
});

module.exports = router;