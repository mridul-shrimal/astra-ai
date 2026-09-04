const STOP_WORDS = [
  "can", "could", "would", "should", "please", "help", "me",
  "you", "the", "a", "an", "to", "for", "with", "about", "how",
  "what", "why", "is", "are", "do", "does", "did", "explain",
  "create", "write", "make", "tell", "show", "give", "generate", "need",
];

const TOPIC_PATTERNS = [
  [["javascript"], "JavaScript"], [["typescript"], "TypeScript"],
  [["python"], "Python"], [["java"], "Java"], [["c++"], "C++"],
  [["c#"], "C#"], [["go"], "Go"], [["rust"], "Rust"], [["php"], "PHP"],
  [["kotlin"], "Kotlin"], [["swift"], "Swift"],
  [["react", "context"], "React Context API"], [["react"], "React"],
  [["next"], "Next.js"], [["vue"], "Vue"], [["angular"], "Angular"],
  [["html"], "HTML"], [["css"], "CSS"], [["tailwind"], "Tailwind CSS"],
  [["bootstrap"], "Bootstrap"], [["vite"], "Vite"],
  [["node"], "Node.js"], [["express"], "Express API"],
  [["django"], "Django"], [["flask"], "Flask"], [["spring"], "Spring Boot"],
  [["laravel"], "Laravel"], [["fastapi"], "FastAPI"], [["nestjs"], "NestJS"],
  [["mongodb"], "MongoDB"], [["mysql"], "MySQL"],
  [["postgresql"], "PostgreSQL"], [["firebase"], "Firebase"],
  [["supabase"], "Supabase"], [["redis"], "Redis"], [["sqlite"], "SQLite"],
  [["gemini"], "Gemini AI"], [["openai"], "OpenAI"], [["chatgpt"], "ChatGPT"],
  [["claude"], "Claude AI"], [["ollama"], "Ollama"], [["langchain"], "LangChain"],
  [["huggingface"], "Hugging Face"], [["prompt"], "Prompt Engineering"],
  [["marketing"], "Marketing Strategy"], [["resume"], "Resume"], [["cv"], "Resume"],
  [["interview"], "Interview Preparation"], [["finance"], "Finance"],
  [["investment"], "Investment"], [["excel"], "Microsoft Excel"],
  [["power", "bi"], "Power BI"], [["tableau"], "Tableau"],
  [["clash", "of", "clans"], "Clash of Clans"],
  [["clash", "royale"], "Clash Royale"], [["minecraft"], "Minecraft"],
  [["valorant"], "Valorant"], [["pubg"], "PUBG"], [["bgmi"], "BGMI"],
  [["free", "fire"], "Free Fire"],
];

export function generateChatTitle(text) {
  if (!text?.trim()) {
    return "New Chat";
  }

  const lower = text.toLowerCase();

  for (const [keywords, title] of TOPIC_PATTERNS) {
    if (keywords.every((keyword) => lower.includes(keyword))) {
      return title;
    }
  }

  const words = text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) => word && !STOP_WORDS.includes(word.toLowerCase())
    );

  if (!words.length) {
    return "New Chat";
  }

  return words
    .slice(0, 4)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}
