const requireAuth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.use(requireAuth);

const {
  getAllConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  duplicateConversation,
} = require("../services/conversationService");

const {
  getMessages,
} = require("../services/messageService");

/**
 * Get all conversations
 */
router.get("/", async (req, res) => {
  try {
    console.log("📥 GET /api/conversations reached");
    console.log("🔐 Authenticated user:", req.user?.id);

    const conversations = await getAllConversations(
      req.user.id
    );

    console.log(
      "💬 Conversations found:",
      conversations.length
    );

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "❌ Get Conversations Error:",
      error
    );

    res.status(500).json({
      success: false,
      conversations: [],
    });
  }
});

/**
 * Create new conversation
 */
router.post("/", async (req, res) => {
  try {
    const { randomUUID } = require("crypto");
    const {
      createConversation,
    } = require("../services/conversationService");

    const sessionId = randomUUID();
    const userId = req.user.id;

    await createConversation(
      sessionId,
      "New Chat",
      userId
    );

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
 * Duplicate conversation
 */
router.post(
  "/:sessionId/duplicate",
  async (req, res) => {
    try {
      const { sessionId } =
        req.params;

      const userId =
        req.user.id;

      const conversation =
        await duplicateConversation(
          sessionId,
          userId
        );

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error(
        "❌ Duplicate Conversation Error:",
        error.message
      );

      if (
        error.message ===
        "Conversation not found or access denied."
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation not found.",
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to duplicate conversation.",
      });
    }
  }
);
/**
 * Get all messages for a conversation
 */
router.get("/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // First verify that this conversation belongs to the user
    const conversation = await getConversation(
      sessionId,
      userId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
        messages: [],
      });
    }

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
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation title is required.",
      });
    }

    await renameConversation(
      sessionId,
      title.trim(),
      userId
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

    if (
      error.message ===
      "Conversation not found or access denied."
    ) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

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
    const userId = req.user.id;

    await deleteConversation(
      sessionId,
      userId
    );

    res.json({
      success: true,
      message: "Conversation deleted.",
    });
  } catch (error) {
    console.error(
      "❌ Delete Conversation Error:",
      error.message
    );

    if (
      error.message ===
      "Conversation not found or access denied."
    ) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation.",
    });
  }
});
/**
 * Duplicate conversation
 */
router.post(
  "/:sessionId/duplicate",
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      const {
        duplicateConversation,
      } = require("../services/conversationService");

      const duplicatedConversation =
        await duplicateConversation(
          sessionId,
          userId
        );

      res.status(201).json({
        success: true,
        conversation:
          duplicatedConversation,
      });
    } catch (error) {
      console.error(
        "❌ Duplicate Conversation Error:",
        error.message
      );

      if (
        error.message ===
        "Conversation not found or access denied."
      ) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to duplicate conversation.",
      });
    }
  }
);
module.exports = router;