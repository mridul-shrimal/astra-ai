const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const extractText = require("../utils/extractText");
const {
  findMemoryToUpdate,
} = require("../services/memoryMatcher");
const { generateResponse } = require("../services/geminiService");
const {
  saveMemory,
  memoryExists,
  updateMemory,
  getRecentMemories,
} = require("../services/memoryService");
const {
  createConversation,
  getConversation,
  touchConversation,
} = require("../services/conversationService");
const {
  saveMessage,
} = require("../services/messageService");
const {
  shouldUseWebSearch,
} = require("../services/searchClassifier");
const { webSearch } = require("../services/webSearch");
const {
  extractMemory,
} = require("../services/memoryExtractor");

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
const currentUser = "default_user";

// Create conversation if it does not exist
const existingConversation = await getConversation(
  currentSession
);

if (!existingConversation) {
  await createConversation(
    currentSession,
    "New Chat"
  );

  console.log(
    `💬 Created conversation: ${currentSession}`
  );
} else {
  await touchConversation(currentSession);
} 

let useWebSearch = false;
let webSearchResults = [];

if (!req.files || req.files.length === 0) {
  useWebSearch = await shouldUseWebSearch(message);

  console.log("🌐 Web Search:", useWebSearch);

  if (useWebSearch) {
    webSearchResults = await webSearch(message);

    console.log(
      `🔎 Tavily Results: ${webSearchResults.length}`
    );
  }
}
if (useWebSearch && webSearchResults.length > 0) {
  const searchContext = webSearchResults
    .map(
      (result, index) =>
        `Source ${index + 1}:
Title: ${result.title}
URL: ${result.url}
Content: ${result.content}`
    )
    .join("\n\n");

  finalPrompt = `
Use the following live web search results to answer the user's question.

# LIVE WEB SEARCH RESULTS

${searchContext}

=======================

USER QUESTION

${finalPrompt}

Important:

- Use the search results for current information.
- Do not invent information that is not supported by the results.
- If the results do not contain enough information, say so.
`;
}

// Generate AI response
const aiResult = await generateResponse(
  currentSession,
  finalPrompt,
  useMemory === "true" &&
    !(req.files && req.files.length),
  model,
  Number(temperature)
);

const aiReply = aiResult.content;
console.log("💾 Saving USER message...");
await saveMessage(
  currentSession,
  "user",
  message
);
console.log("💾 Saving AI message...");
await saveMessage(
  currentSession,
  "ai",
  aiReply
);
// Save only normal conversations when Auto Save is enabled
if (
  autoSaveMemory === "true" &&
  (!req.files || req.files.length === 0)
) {
  const extracted = await extractMemory(
    message,
    aiReply
  );

  if (extracted.shouldSave) {
    // Load existing memories once
    const existingMemories = await getRecentMemories(
  currentUser,
  100
);

    // Process every extracted memory
    for (const memory of extracted.memories) {
      // Skip exact duplicates
      const exists = await memoryExists(
  currentUser,
  memory
);

      if (exists) {
        console.log(
          `🧠 Memory already exists: ${memory}`
        );
        continue;
      }

      // Check whether this memory should replace an old one
      const memoryId = await findMemoryToUpdate(
        existingMemories,
        memory
      );

      if (memoryId) {
        await updateMemory(
          memoryId,
          memory,
          aiReply
        );

        console.log(
          `♻️ Updated memory: ${memory}`
        );

        // Keep local copy in sync
        const index = existingMemories.findIndex(
          (m) => m.id === memoryId
        );

        if (index !== -1) {
          existingMemories[index].user_message = memory;
        }
      } else {
        await saveMemory(
  currentUser,
  memory,
  aiReply
);

        console.log(
          `🧠 Saved memory: ${memory}`
        );

        // Keep local list updated
        existingMemories.push({
          id: -Date.now(),
          user_message: memory,
        });
      }
    }
  }
}
res.json({
  success: true,
  reply: aiReply,
  modelUsed: aiResult.modelUsed,
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