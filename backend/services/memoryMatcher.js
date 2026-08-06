const axios = require("axios");

async function findMemoryToUpdate(existingMemories, newMemory) {
  if (!existingMemories.length) {
    return null;
  }

const prompt = `
You are an AI memory manager.

Your task is to determine whether a newly extracted memory should replace an existing memory.

Existing memories:

${existingMemories
  .map((m) => `${m.id}: ${m.user_message}`)
  .join("\n")}

New memory:

${newMemory}

Return ONLY valid JSON.

If the new memory replaces an existing memory:

{
  "memoryId": 12
}

If it does not replace anything:

{
  "memoryId": null
}

Rules:
- Do NOT explain.
- Do NOT add extra text.
- Do NOT use Markdown.
- Do NOT wrap the JSON in \`\`\`.
- Output must start with { and end with }.
- Replace memories only when they describe the same attribute.

Examples:
- "User lives in London." → "User lives in New York." → replace
- "User is 25 years old." → "User is 26 years old." → replace
- "User likes BGMI." → "User likes Valorant." → replace
- "User knows Python." → "User knows Java." → do NOT replace
- "User enjoys hiking." → "User enjoys football." → replace
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-27b-it",
        temperature: 0,
        messages: [
          {
            role: "user",
            content: prompt,
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

   let responseText =
  response.data.choices[0].message.content.trim();

console.log("\n========== MEMORY MATCHER ==========\n");
console.log(responseText);
console.log("\n====================================\n");

// Remove Markdown code fences if present
responseText = responseText
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/, "")
  .trim();

let data;

try {
  data = JSON.parse(responseText);
} catch {
  console.log("❌ Invalid JSON from Memory Matcher");
  return null;
}

console.log("🧠 Memory Matcher:", data.memoryId);

return data.memoryId;

  } catch (error) {
    console.error(
      "Memory Matcher Error:",
      error.response?.data || error.message
    );

    return null;
  }
}

module.exports = {
  findMemoryToUpdate,
};