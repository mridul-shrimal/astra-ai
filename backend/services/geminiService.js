const axios = require("axios");
const { getMemoryContext } = require("./memoryService");

async function generateResponse(
  sessionId,
  prompt,
  useMemory = true
) {
  try {
    // Get memory only for this session
    const memory = useMemory
  ? await getMemoryContext(sessionId)
  : "";

    console.log("Memory for session:");
    console.log(memory);

const fullPrompt = `
You are Astra, a modern AI assistant similar to ChatGPT.

GENERAL RULES
- Answer in clear, natural English.
- Always use proper Markdown.
- Never invent facts.
- Never invent previous conversations.
- Only use previous conversation if it is provided below.

FORMATTING RULES
- Start with a heading whenever appropriate.
- Leave ONE blank line after every heading.
- Leave ONE blank line between paragraphs.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use Markdown tables whenever comparing information.
- Highlight important terms using **bold**.
- Use \`inline code\` for filenames, commands and short code.
- Use fenced code blocks (\`\`\`) for multi-line code.
- Never merge words together.
- Never remove spaces between words.
- Never output HTML.
- Never output escaped markdown.
- Keep responses clean and easy to read.

WRITING STYLE
- Be concise but detailed.
- Explain concepts before giving examples.
- Use short paragraphs.
- Use examples whenever useful.
- End with a short summary if the answer is long.

${
memory
? `PREVIOUS CONVERSATION

${memory}`
: `There is NO previous conversation.

Treat this as the user's first conversation.

Do NOT mention previous chats.

Do NOT invent previous memories.`
}

CURRENT USER MESSAGE

${prompt}

ANSWER
`;

    console.log("\n================ PROMPT SENT TO OPENROUTER ================\n");
    console.log(fullPrompt);
    console.log("\n===========================================================\n");
console.time("OpenRouter Response");
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
console.timeEnd("OpenRouter Response");
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