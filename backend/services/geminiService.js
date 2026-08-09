const axios = require("axios");
const { getMemoryContext } = require("./memoryService");

async function generateResponse(
  sessionId,
  prompt,
  useMemory = true,
  model = process.env.OPENROUTER_MODEL,
  temperature = 0.7,
  currentUser = null
) {
  try {
    const memory =
      useMemory && currentUser
        ? await getMemoryContext(currentUser)
        : "";

    const fullPrompt = `
You are Astra, a modern AI assistant similar to Claude.

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
- Use sarcastic humor everytime the grammar is not most perfect , like even a small punctuation mistake or a typo, or if the user is not following the rules above.

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

const fallbackModels = [
  model,
  "google/gemma-3-27b-it",
  "qwen/qwen-2.5-72b-instruct",
  "deepseek/deepseek-chat-v3-0324",
];
console.time("OpenRouter Response");

let response;

for (const currentModel of fallbackModels) {
  try {
    response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: currentModel,
        temperature,
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
  timeout: 60000,
}
    );

    console.log(`✅ Using model: ${currentModel}`);

    break;
  } catch (err) {
  const status = err.response?.status;

  console.warn(
    `❌ ${currentModel} failed (${status || "Unknown"})`
  );

  // API authentication/configuration error
  if (status === 401) {
    const error = new Error(
      "AI service authentication failed. Please check the OpenRouter API key."
    );
    error.code = "AI_AUTH_ERROR";
    error.status = 401;
    throw error;
  }

  // Rate limit — try the next model
  if (status === 429) {
    console.warn(
      `⚠️ ${currentModel} is rate limited. Trying fallback model...`
    );

    if (currentModel === fallbackModels.at(-1)) {
      const error = new Error(
        "All available AI models are currently rate limited."
      );
      error.code = "AI_RATE_LIMIT";
      error.status = 429;
      throw error;
    }

    continue;
  }

  // Provider/model temporarily unavailable
  if (status === 502 || status === 503) {
    console.warn(
      `⚠️ ${currentModel} is temporarily unavailable. Trying fallback model...`
    );

    if (currentModel === fallbackModels.at(-1)) {
      const error = new Error(
        "AI service is temporarily unavailable. Please try again later."
      );
      error.code = "AI_UNAVAILABLE";
      error.status = status;
      throw error;
    }

    continue;
  }

  // Network / timeout / unknown errors
  if (
    err.code === "ECONNABORTED" ||
    err.code === "ETIMEDOUT" ||
    !err.response
  ) {
    const error = new Error(
      "Unable to connect to the AI service. Please check your network connection."
    );
    error.code = "AI_NETWORK_ERROR";
    throw error;
  }

  // Other API errors
  const error = new Error(
    err.response?.data?.error?.message ||
      "The AI service returned an unexpected error."
  );

  error.code = "AI_REQUEST_ERROR";
  error.status = status;

  throw error;
}
}

console.timeEnd("OpenRouter Response");

return {
  content: response.data.choices[0].message.content,
  modelUsed: response.data.model,
};
  } catch (error) {
    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}


async function generateResponseStream(
  sessionId,
  prompt,
  onChunk,
  useMemory = true,
  model = process.env.OPENROUTER_MODEL,
  temperature = 0.7,
  currentUser = null
) {
  try {
    const memory =
      useMemory && currentUser
        ? await getMemoryContext(currentUser)
        : "";

    const fullPrompt = `
You are Astra, a modern AI assistant similar to Claude.

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
- Use sarcastic humor everytime the grammar is not most perfect, like even a small punctuation mistake or a typo, or if the user is not following the rules above.

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

    const fallbackModels = [
      model,
      "google/gemma-3-27b-it",
      "qwen/qwen-2.5-72b-instruct",
      "deepseek/deepseek-chat-v3-0324",
    ];

    let response;

    for (const currentModel of fallbackModels) {
      try {
        response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: currentModel,
            temperature,
            stream: true,
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
            responseType: "stream",
          }
        );

        console.log(
          `✅ Streaming with model: ${currentModel}`
        );

        let fullResponse = "";

        response.data.on("data", (chunk) => {
          const lines = chunk
            .toString()
            .split("\n")
            .filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (!line.startsWith("data:")) {
              continue;
            }

            const data = line
              .replace(/^data:\s*/, "")
              .trim();

            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data);

              const content =
                parsed.choices?.[0]?.delta?.content;

              if (content) {
                fullResponse += content;
                onChunk(content);
              }
            } catch {
              // Ignore incomplete SSE chunks
            }
          }
        });

        await new Promise((resolve, reject) => {
          response.data.on("end", resolve);
          response.data.on("error", reject);
        });

        return {
          content: fullResponse,
          modelUsed: currentModel,
        };
      } catch (err) {
        const status = err.response?.status;

        console.warn(
          `❌ ${currentModel} streaming failed (${status || "Unknown"})`
        );

        if (![429, 502, 503].includes(status)) {
          throw err;
        }

        if (currentModel === fallbackModels.at(-1)) {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error(
      "OpenRouter Streaming Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}
module.exports = {
  generateResponse,
  generateResponseStream,
};