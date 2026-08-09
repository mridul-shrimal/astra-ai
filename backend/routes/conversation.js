const requireAuth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.use(requireAuth);

const {
  getAllConversations,
  getConversation,
  renameConversation,
  deleteConversation,
} = require("../services/conversationService");
const {
  getMessages,
} = require("../services/messageService");

/**
 * Get all conversations
 */
router.get("/", async (req, res) => {
  try {
    const conversations = await getAllConversations();

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "❌ Get Conversations Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      conversations: [],
    });
  }
});

/**
 * Get one conversation
 */
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await getConversation(sessionId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "❌ Get Conversation Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to get conversation.",
    });
  }
});

/**
 * Create new conversation
 */
router.post("/", async (req, res) => {
  try {
    const { randomUUID } = require("crypto");

    const { createConversation } = require("../services/conversationService");

    const sessionId = randomUUID();

    await createConversation(sessionId);

    res.status(201).json({
      success: true,
      conversation: {
        session_id: sessionId,
        title: "New Chat",
      },
    });
  } catch (error) {
    console.error(
      "❌ Create Conversation Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create conversation.",
    });
  }
});

/**
 * Get all messages for a conversation
 */
router.get("/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await getMessages(sessionId);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "❌ Get Messages Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      messages: [],
    });
  }
});

/**
 * Rename conversation
 */
router.put("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation title is required.",
      });
    }

    await renameConversation(
      sessionId,
      title.trim()
    );

    res.json({
      success: true,
      message: "Conversation renamed.",
    });
  } catch (error) {
    console.error(
      "❌ Rename Conversation Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to rename conversation.",
    });
  }
});

/**
 * Delete conversation
 */
router.delete("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    await deleteConversation(sessionId);

    res.json({
      success: true,
      message: "Conversation deleted.",
    });
  } catch (error) {
    console.error(
      "❌ Delete Conversation Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation.",
    });
  }
});

module.exports = router;