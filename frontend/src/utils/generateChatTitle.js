import { STOP_WORDS } from "../constants/stopWords";
import { TOPIC_PATTERNS } from "../constants/chatTitlePatterns";

export function generateChatTitle(text) {
  if (!text?.trim()) {
    return "New Chat";
  }

  const lower = text.toLowerCase();

  // Check predefined topic patterns
  for (const topic of TOPIC_PATTERNS) {
    const matched = topic.keywords.every((keyword) =>
      lower.includes(keyword.toLowerCase())
    );

    if (matched) {
      return topic.title;
    }
  }

  // Fallback keyword extraction
  const words = text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word &&
        !STOP_WORDS.includes(word.toLowerCase())
    );

  if (!words.length) {
    return "New Chat";
  }

  return words
    .slice(0, 4)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}