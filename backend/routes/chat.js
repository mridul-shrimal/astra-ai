const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");

router.use(requireAuth);

const upload = require("../middleware/uploadMiddleware");
const multer = require("multer");
const extractText = require("../utils/extractText");
const {
  findMemoryToUpdate,
} = require("../services/memoryMatcher");
const {
  generateResponse,
  generateResponseStream,
} = require("../services/geminiService");
const {
  saveMemory,
  memoryExists,
  updateMemory,
  getRecentMemories,
} = require("../services/memoryService");
const {
  getOrCreateConversation,
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

router.post(
  "/stream",
  upload.array("files", 10),
  async (req, res) => {
    try {
      const {
        message,
        sessionId,
        model,
        temperature,
        useMemory,
      } = req.body;

      const currentUser = req.user.id;

      let currentSession;

try {
  ({ sessionId: currentSession } =
    await getOrCreateConversation(
      sessionId,
      currentUser
    ));
} catch (error) {
  if (error.status === 404) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found.",
    });
  }

  throw error;
}
      // Extract uploaded files
      let documentText = "";

      if (req.files && req.files.length > 0) {
        const extractedTexts = await Promise.all(
          req.files.map(async (file) => {
            const text = await extractText(file);

            return `
DOCUMENT: ${file.originalname}

${text}
`;
          })
        );

        documentText =
          extractedTexts.join("\n\n");
      }

      // Build final prompt
      const finalPrompt =
        documentText.trim()
          ? `
Use the uploaded documents as your source.

${documentText}

USER REQUEST:

${message || "Summarize all uploaded documents."}
`
          : message;

      // Tell browser this is an SSE stream
      res.setHeader(
        "Content-Type",
        "text/event-stream"
      );

      res.setHeader(
        "Cache-Control",
        "no-cache, no-transform"
      );

      res.setHeader(
        "Connection",
        "keep-alive"
      );

      if (res.flushHeaders) {
        res.flushHeaders();
      }

      let fullResponse = "";

      const aiResult =
        await generateResponseStream(
          currentSession,
          finalPrompt,
          (chunk) => {
            fullResponse += chunk;

            res.write(
              `data: ${JSON.stringify({
                type: "chunk",
                content: chunk,
              })}\n\n`
            );
          },
          useMemory === "true" &&
            !(req.files && req.files.length),
          model,
          Number(temperature),
          currentUser
        );

      // Save messages AFTER streaming completes
      await saveMessage(
        currentSession,
        "user",
        message
      );

      await saveMessage(
        currentSession,
        "ai",
        fullResponse
      );

      // Tell frontend streaming is complete
      res.write(
        `data: ${JSON.stringify({
          type: "done",
          sessionId: currentSession,
          modelUsed: aiResult.modelUsed,
          files: req.files
            ? req.files.map((file) => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
              }))
            : [],
        })}\n\n`
      );

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error(
        "Streaming Chat Error:",
        error
      );

      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message:
            "Streaming response failed.",
        });
      }

      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message:
            "Streaming response failed.",
        })}\n\n`
      );

      res.end();
    }
  }
);

  router.post("/", (req, res) => {
  upload.array("files", 10)(req, res, async (uploadError) => {
    if (uploadError) {
      console.error("❌ Upload Error:", uploadError);

      if (uploadError instanceof multer.MulterError) {
        if (uploadError.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            reply:
              "⚠️ File is too large. Maximum file size is 20 MB.",
            errorCode: "FILE_TOO_LARGE",
          });
        }

        return res.status(400).json({
          success: false,
          reply:
            "⚠️ File upload failed. Please check the selected file.",
          errorCode: "FILE_UPLOAD_ERROR",
        });
      }

      if (uploadError.message === "Unsupported file type") {
        return res.status(400).json({
          success: false,
          reply:
            "⚠️ Unsupported file type. Please upload PDF, DOCX, TXT, CSV, JPG, PNG, WEBP, GIF, BMP, or SVG.",
          errorCode: "UNSUPPORTED_FILE",
        });
      }

      return res.status(400).json({
        success: false,
        reply:
          "⚠️ Unable to upload the selected file.",
        errorCode: "FILE_UPLOAD_ERROR",
      });
    }

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

const currentUser = req.user.id;

let currentSession;

try {
  ({ sessionId: currentSession } =
    await getOrCreateConversation(
      sessionId,
      currentUser
    ));
} catch (error) {
  if (error.status === 404) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found.",
    });
  }

  throw error;
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
  Number(temperature),
  currentUser
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
  console.error("❌ Chat Error:", error);

  let statusCode = 500;
  let message = "Sorry, something went wrong.";

  switch (error.code) {
    case "AI_AUTH_ERROR":
      statusCode = 500;
      message =
        "⚠️ Astra could not connect to the AI service because the API configuration is invalid.";
      break;

    case "AI_RATE_LIMIT":
      statusCode = 429;
      message =
        "⚠️ The AI models are currently busy. Please try again in a moment.";
      break;

    case "AI_UNAVAILABLE":
      statusCode = 503;
      message =
        "⚠️ The AI service is temporarily unavailable. Please try again later.";
      break;

    case "AI_NETWORK_ERROR":
      statusCode = 503;
      message =
        "⚠️ Astra could not reach the AI service. Please check your internet connection.";
      break;

    case "AI_REQUEST_ERROR":
      statusCode = 502;
      message =
        "⚠️ The AI service returned an unexpected error. Please try again.";
      break;

    default:
      message = "❌ Astra encountered an unexpected error.";
  }

  res.status(statusCode).json({
    success: false,
    reply: message,
    errorCode: error.code || "UNKNOWN_ERROR",
  });
}
});
});
module.exports = router;