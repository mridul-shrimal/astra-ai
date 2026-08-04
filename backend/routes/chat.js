const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const extractText = require("../utils/extractText");
const { generateResponse } = require("../services/geminiService");
const { saveMemory } = require("../services/memoryService");

  router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const {
  message,
  sessionId,
  model,
  temperature,
  useMemory,
  autoSaveMemory,
} = req.body;

let finalPrompt = message || "Summarize this document.";

let documentText = "";

if (req.files && req.files.length > 0) {

  for (const file of req.files) {

    const extractedText = await extractText(file);

    documentText += `

==============================
Document: ${file.originalname}
==============================

${extractedText}

`;
  }


  finalPrompt = `
You are Astra AI.

Use ONLY the uploaded documents as your source.

If there are multiple documents,
compare them when necessary.

Answer in detail using headings,
bullet points and tables whenever useful.

================ DOCUMENTS ================

${documentText}

==========================================

User Question:

${message || "Summarize all uploaded documents."}
`;
}
    if (!message && (!req.files || req.files.length === 0)) {
  return res.status(400).json({
    success: false,
    reply: "Message or file is required.",
  });
}

    // Default session if none is provided
    const currentSession = sessionId || "default";

    // Generate AI response
 const aiReply = await generateResponse(
  currentSession,
  finalPrompt,
  useMemory === "true" &&
    !(req.files && req.files.length),
  model,
  Number(temperature)
);
// Save only normal conversations when Auto Save is enabled
if (
  autoSaveMemory === "true" &&
  (!req.files || req.files.length === 0)
) {
  await saveMemory(currentSession, message, aiReply);
}
res.json({
  success: true,
  reply: aiReply,
  files: req.files
  ? req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }))
  : [],
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