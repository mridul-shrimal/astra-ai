const axios = require("axios");
const { getMemoryContext } = require("./memoryService");

async function generateResponse(sessionId, prompt) {
  try {
    // Get memory only for this session
    const memory = await getMemoryContext(sessionId);

    console.log("Memory for session:");
    console.log(memory);

    const fullPrompt = `
You are Astra, a modern AI assistant similar to ChatGPT.

Rules:
- Give clear, well-structured answers.
- Use headings whenever appropriate.
- Use bullet points for lists.
- Use numbered steps when explaining.
- Keep paragraphs short.
- Use proper markdown formatting.
- Highlight important words using **bold**.
- Never invent previous conversations.
- Only use previous conversation if it is provided below.

${
  memory
    ? `Previous Conversation:
${memory}`
    : `There is NO previous conversation.
Treat this as the user's first conversation.
Do NOT mention previous chats.
Do NOT invent previous memories.`
}

Current User Message:
${prompt}

Answer:
`;

    console.log("\n================ PROMPT SENT TO OPENROUTER ================\n");
    console.log(fullPrompt);
    console.log("\n===========================================================\n");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {
  generateResponse,
};