const axios = require("axios");

async function extractMemory(userMessage, aiResponse) {
  try {
    const prompt = `
You are an AI memory extractor.

Your task is to determine whether the user's message contains long-term information worth remembering.

Remember ONLY:
- Name
- Age
- Location
- Occupation
- Education
- Skills
- Programming languages
- Long-term projects
- Goals
- Preferences
- Hobbies
- Important personal facts

Do NOT remember:
- Greetings
- Small talk
- Questions
- Temporary requests
- One-time tasks
- Casual conversation
- Repeated statements

If nothing should be remembered, reply with exactly:

NONE

Otherwise reply with ONE short factual sentence.

Examples:

User: My name is Mridul.
Output:
User's name is Mridul.

User: I love BGMI.
Output:
User enjoys playing BGMI.

User: Hello
Output:
NONE

User: What's the weather?
Output:
NONE

User:
${userMessage}

Assistant:
${aiResponse}
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

    const memory =
      response.data.choices[0].message.content.trim();

    if (memory === "NONE") {
      return {
        shouldSave: false,
      };
    }

    return {
      shouldSave: true,
      memory,
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