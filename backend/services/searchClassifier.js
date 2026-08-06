function shouldUseWebSearch(userMessage) {
  if (!userMessage) {
    return false;
  }

  const message = userMessage.toLowerCase();

  const keywords = [
    "latest",
    "today",
    "current",
    "news",
    "weather",
    "temperature",
    "forecast",
    "rain",
    "snow",
    "storm",
    "live",
    "score",
    "scores",
    "match",
    "result",
    "results",
    "stock",
    "share price",
    "market",
    "crypto",
    "bitcoin",
    "ethereum",
    "price",
    "exchange rate",
    "prime minister",
    "president",
    "government",
    "election",
    "breaking",
    "release",
    "released",
    "version",
    "documentation",
    "docs",
    "github",
    "website",
    "official site"
  ];

  return keywords.some((keyword) =>
    message.includes(keyword)
  );
}

module.exports = {
  shouldUseWebSearch,
};