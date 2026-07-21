const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const extractText = require("../utils/extractText");
const { generateResponse } = require("../services/geminiService");
const { saveMemory } = require("../services/memoryService");

  router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { message, sessionId } = req.body;
let finalPrompt = message || "Summarize this document.";

if (req.file) {
  const extractedText = await extractText(req.file);
console.log("========== EXTRACTED TEXT ==========");
console.log(extractedText);
console.log("====================================");
  finalPrompt = `
You are Astra AI.

Use ONLY the uploaded document as your source.

Answer in detail using headings and bullet points.

================ DOCUMENT ================

${extractedText}

==========================================

User Question:

${message || "Summarize this document."}
`;
}
    if (!message && !req.file) {
  return res.status(400).json({
    success: false,
    reply: "Message or file is required.",
  });
}

    // Default session if none is provided
    const currentSession = sessionId || "default";
console.log("Incoming Session:", currentSession);
    // Generate AI response
  const aiReply = await generateResponse(
  currentSession,
  finalPrompt,
  !req.file
);

    // Save only normal conversations
if (!req.file) {
  await saveMemory(currentSession, message, aiReply);
}
res.json({
  success: true,
  reply: aiReply,
  file: req.file
    ? {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      }
    : null,
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