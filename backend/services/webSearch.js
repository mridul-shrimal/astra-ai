const axios = require("axios");

async function webSearch(query) {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,
        query: query.trim(),
        search_depth: "basic",
        max_results: 5,
        include_answer: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data.results || [];

    return results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    }));
  } catch (error) {
    console.error(
      "❌ Tavily Search Error:",
      error.response?.data || error.message
    );

    return [];
  }
}

module.exports = {
  webSearch,
};
