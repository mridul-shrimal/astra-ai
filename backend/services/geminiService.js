const { GoogleGenAI } = require("@google/genai");
const { getMemoryContext } = require("./memoryService");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(sessionId, prompt) {
  try {
    // Get memory only for this session
    const memory = await getMemoryContext(sessionId);

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

    console.log("\n================ PROMPT SENT TO GEMINI ================\n");
    console.log(fullPrompt);
    console.log("\n=======================================================\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};