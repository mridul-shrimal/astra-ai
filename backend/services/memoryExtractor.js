const axios = require("axios");

async function extractMemory(userMessage, aiResponse) {
  try {
const prompt = `
You are an AI memory extractor.

Your job is to extract ONLY explicit long-term memories from the user's message.

Extract memories about:

- Name
- Age
- Gender (if explicitly stated)
- Location
- Occupation
- Education
- Skills
- Programming languages
- Long-term projects
- Goals
- Hobbies
- Preferences
  - Favorite game
  - Favorite food
  - Favorite drink
  - Favorite movie
  - Favorite music
  - Favorite book
  - Favorite sport
  - Favorite programming language
  - General likes and dislikes
- Important personal facts

Do NOT extract:

- Greetings
- Small talk
- Questions
- Temporary requests
- One-time tasks
- Casual conversation
- Assistant responses
- Information that is implied but not explicitly stated
- Duplicate memories

Return ONLY valid JSON.

If memories exist, return:

{
  "memories": [
    "Memory 1",
    "Memory 2"
  ]
}

If nothing should be remembered, return:

{
  "memories": []
}

Rules:

- Output ONLY JSON.
- Do NOT explain.
- Do NOT use Markdown.
- Do NOT wrap the JSON inside \`\`\`.
- Output must begin with { and end with }.
- Each memory must be a short factual sentence.
- Preserve the user's wording whenever possible.
- Save explicit preferences even if they seem simple.
- If multiple memories are present, return all of them.
- Never invent information.
- Never output "NONE".

Examples:

User:
My name is Sarah.

Output:
{
  "memories": [
    "User's name is Sarah."
  ]
}

User:
I am 25 years old.

Output:
{
  "memories": [
    "User is 25 years old."
  ]
}

User:
I now live in New York.

Output:
{
  "memories": [
    "User lives in New York."
  ]
}

User:
I work as a software engineer.

Output:
{
  "memories": [
    "User works as a software engineer."
  ]
}

User:
I studied Computer Science.

Output:
{
  "memories": [
    "User studied Computer Science."
  ]
}

User:
I know Python and Java.

Output:
{
  "memories": [
    "User knows Python.",
    "User knows Java."
  ]
}

User:
I like coffee.

Output:
{
  "memories": [
    "User likes coffee."
  ]
}

User:
My favorite game is BGMI.

Output:
{
  "memories": [
    "User's favorite game is BGMI."
  ]
}

User:
My favorite game is Valorant.

Output:
{
  "memories": [
    "User's favorite game is Valorant."
  ]
}

User:
I enjoy hiking.

Output:
{
  "memories": [
    "User enjoys hiking."
  ]
}

User:
Hello, how are you?

Output:
{
  "memories": []
}

CURRENT USER MESSAGE

${userMessage}
`;

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

// Remove Markdown code fences if present
responseText = responseText
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/, "")
  .trim();

let data;

try {
  data = JSON.parse(responseText);
} catch (err) {
  console.log("❌ Invalid JSON from Memory Extractor");
  console.log(responseText);

  return {
    shouldSave: false,
    memories: [],
  };
}

return {
  shouldSave: data.memories.length > 0,
  memories: data.memories,
};

  } catch (error) {
    console.error(
      "Memory Extractor Error:",
      error.response?.data || error.message
    );

    return {
      shouldSave: false,
    };
  }
}

module.exports = {
  extractMemory,
};