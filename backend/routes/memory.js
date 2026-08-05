const express = require("express");
const router = express.Router();

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
    const memories = await getAllMemories();

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
  
// Update ONE memory
router.put("/item/:id", async (req, res) => {
  try {
    const { user_message, ai_response } = req.body;

    await updateMemory(
      req.params.id,
      user_message,
      ai_response
    );

    res.json({
      success: true,
      message: "Memory updated.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update memory.",
    });
  }
});

// Delete ONE memory
router.delete("/item/:id", async (req, res) => {
  try {
    await deleteMemory(req.params.id);

    res.json({
      success: true,
      message: "Memory deleted.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete memory.",
    });
  }
});

// Delete ALL memories
router.delete("/", async (req, res) => {
  try {
    await clearAllMemories();

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