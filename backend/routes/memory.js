
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");

router.use(requireAuth);

const {
  getRecentMemories,
  getAllMemories,
  clearMemories,
  clearAllMemories,
  deleteMemory,
  updateMemory,
  getMemoryCount,
} = require("../services/memoryService");



// Get ALL memories
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const memories = await getAllMemories(
      userId
    );

    res.json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    console.error(
      "❌ Get Memories Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load memories.",
    });
  }
});

// Total memory count
router.get("/count/all", async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await getMemoryCount(
      userId
    );

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "❌ Get Memory Count Error:",
      error
    );

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
    const userId = req.user.id;

    const memories = await getRecentMemories(
      userId,
      50
    );

    res.json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    console.error(
      "❌ Get Chat Memories Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load memories.",
    });
  }
});
  
// Update ONE memory
router.put("/item/:id", async (req, res) => {
  try {
    const { user_message, ai_response } = req.body;
    const userId = req.user.id;

    await updateMemory(
      req.params.id,
      userId,
      user_message,
      ai_response
    );

    res.json({
      success: true,
      message: "Memory updated.",
    });
  } catch (error) {
    console.error(
      "❌ Update Memory Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update memory.",
    });
  }
});

// Delete ONE memory
router.delete("/item/:id", async (req, res) => {
  try {
    const userId = req.user.id;

    await deleteMemory(
      req.params.id,
      userId
    );

    res.json({
      success: true,
      message: "Memory deleted.",
    });
  } catch (error) {
    console.error(
      "❌ Delete Memory Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete memory.",
    });
  }
});

// Delete ALL memories
router.delete("/", async (req, res) => {
  try {
    const userId = req.user.id;

    await clearAllMemories(userId);

    res.json({
      success: true,
      message: "All memories cleared.",
    });
  } catch (error) {
    console.error(
      "❌ Clear All Memories Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to clear memories.",
    });
  }
});

// Delete ONE chat memory
router.delete("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    await clearMemories(userId);

    res.json({
      success: true,
      message: "Chat memory cleared.",
    });
  } catch (error) {
    console.error(
      "❌ Clear Chat Memory Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to clear memory.",
    });
  }
});

module.exports = router;
