import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Memory() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
const { theme } = useTheme();
const isLight = theme === "light";
  const loadMemories = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/memory");
      const data = await response.json();

      if (data.success) {
        setMemories(data.memories || []);
      }
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleClearMemory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all memories?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost:5000/api/memory", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setMemories([]);
        alert("🧠 Memory cleared successfully.");
      }
    } catch (error) {
      console.error("Failed to clear memory:", error);
    }
  };

  const filteredMemories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (keyword === "") {
      return memories;
    }

    return memories.filter((memory) => {
      const userMessage = String(memory.user_message || "").toLowerCase();

      return userMessage.includes(keyword);
    });
  }, [memories, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1
  className={`text-4xl font-bold ${
    isLight ? "text-slate-900" : "text-white"
  }`}
>
            Memory
          </h1>

          <p
  className={`mt-2 ${
    isLight ? "text-slate-600" : "text-slate-400"
  }`}
>
            Astra's conversation history
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search memories..."
            className={`mt-5 w-full max-w-md rounded-lg border px-4 py-3 transition focus:border-cyan-500 focus:outline-none ${
  isLight
     ? "border-slate-200 bg-white shadow-sm text-slate-900 placeholder-slate-400"
  : "border-slate-700 bg-slate-800 text-white placeholder-slate-400"
}`}
          />

          <p
  className={`mt-3 text-sm ${
    isLight ? "text-slate-600" : "text-slate-500"
  }`}
>
            Showing {filteredMemories.length} of {memories.length} memories
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadMemories}
            className="rounded-lg bg-cyan-600 px-5 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-cyan-700"
          >
            🔄 Refresh
          </button>

          <button
            onClick={handleClearMemory}
            className="rounded-lg bg-red-600 px-5 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-red-700"
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div
  className={`py-20 text-center ${
    isLight ? "text-slate-600" : "text-slate-400"
  }`}
>
          Loading memories...
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className={`rounded-xl border p-10 text-center ${
  isLight
    ? "border-slate-200 bg-white text-slate-600"
    : "border-slate-700 bg-slate-800 text-slate-400"
}`}>
          No memories found.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className={`rounded-2xl border p-6 shadow-lg transition-all duration-300 ${
  isLight
    ? "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl"
    : "border-slate-700 bg-slate-800/70"
}`}
            >
              <p className={`font-semibold ${
  isLight ? "text-cyan-700" : "text-cyan-400"
}`}>
                👤 You
              </p>

              <p className={`mt-2 ${
  isLight ? "text-slate-900" : "text-white"
}`}>
                {memory.user_message}
              </p>

              <hr className={`my-4 ${
  isLight ? "border-slate-200" : "border-slate-700"
}`} />

              <p className={`font-semibold ${
  isLight ? "text-violet-700" : "text-purple-400"
}`}>
                🤖 Astra
              </p>

              <p className={`mt-2 whitespace-pre-wrap ${
  isLight ? "text-slate-700" : "text-slate-300"
}`}>
                {memory.ai_response}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className={`text-xs ${
  isLight ? "text-slate-500" : "text-slate-500"
}`}>
                  {new Date(memory.created_at).toLocaleString()}
                </p>

                <span className={`rounded-full px-3 py-1 text-xs ${
  isLight
    ? "bg-cyan-100 text-cyan-700"
    : "bg-cyan-900/40 text-cyan-300"
}`}>
                  #{memory.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Memory;