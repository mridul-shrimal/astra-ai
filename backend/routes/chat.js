const express = require("express");
const router = express.Router();

const { generateResponse } = require("../services/geminiService");
const { saveMemory } = require("../services/memoryService");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        reply: "Message is required.",
      });
    }

    // Generate AI response
    const aiReply = await generateResponse(message);

    // Save conversation to memory
    await saveMemory(message, aiReply);

    res.json({
      success: true,
      reply: aiReply,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      reply: "Sorry, something went wrong.",
    });
  }
});

module.exports = router;