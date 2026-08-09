
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import EditMemoryModal from "../components/memory/EditMemoryModal";
import api from "../services/api";
import { Edit } from "lucide-react";

function Memory() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
  useState("All");

  const [editOpen, setEditOpen] = useState(false);
const [selectedMemory, setSelectedMemory] = useState(null);
  const [search, setSearch] = useState("");
const { theme } = useTheme();
const {
  memoryEnabled,
  memoryAutoSave,
} = useSettings();

const isLight = theme === "light";

const loadMemories = async () => {
  try {
    setLoading(true);

    const response = await api.get("/memory");
    const data = response.data;

    if (data.success) {
      setMemories(data.memories || []);
    }
  } catch (error) {
    console.error(
      "Failed to load memories:",
      error
    );
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
     const response = await api.delete("/memory");

const data = response.data;

      if (data.success) {
  setMemories([]);
  await loadMemories();
  alert("🧠 All memories cleared successfully.");
}
    } catch (error) {
      console.error("Failed to clear memory:", error);
    }
  };

const getCategory = (text) => {
  const value = text.toLowerCase();

  if (
    value.includes("react") ||
    value.includes("javascript") ||
    value.includes("python") ||
    value.includes("java") ||
    value.includes("code") ||
    value.includes("program")
  )
    return "Programming";

  if (
    value.includes("college") ||
    value.includes("study") ||
    value.includes("school") ||
    value.includes("exam")
  )
    return "Education";

  if (
    value.includes("project") ||
    value.includes("office") ||
    value.includes("meeting") ||
    value.includes("client")
  )
    return "Work";

  if (
    value.includes("like") ||
    value.includes("prefer") ||
    value.includes("favorite")
  )
    return "Preference";

  if (
    value.includes("goal") ||
    value.includes("plan") ||
    value.includes("dream")
  )
    return "Goal";

  return "Personal";
};

  const filteredMemories = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  return memories.filter((memory) => {
    const userMessage = String(
      memory.user_message || ""
    ).toLowerCase();

    const aiResponse = String(
      memory.ai_response || ""
    ).toLowerCase();

    const matchesSearch =
      keyword === "" ||
      userMessage.includes(keyword) ||
      aiResponse.includes(keyword);

    const matchesCategory =
      selectedCategory === "All" ||
      getCategory(memory.user_message) ===
        selectedCategory;

    return matchesSearch && matchesCategory;
  });
}, [memories, search, selectedCategory]);

const copyMemory = async (memory) => {
  const text = `User:\n${memory.user_message}\n\nAstra:\n${memory.ai_response}`;

  try {
    await navigator.clipboard.writeText(text);
    toast.success("Memory copied!");
  } catch {
    toast.error("Failed to copy memory.");
  }
};

const handleSaveMemory = async (updatedMemory) => {
  try {
    const response = await api.put(
      `/memory/item/${updatedMemory.id}`,
      {
        user_message: updatedMemory.user_message,
        ai_response: updatedMemory.ai_response,
      }
    );

    const data = response.data;

    if (data.success) {
      toast.success("Memory updated!");

      setEditOpen(false);
      setSelectedMemory(null);

      await loadMemories();
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update memory.");
  }
};

const groupedMemories = filteredMemories.reduce((groups, memory) => {
  const date = new Date(memory.created_at);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  let label = "Older";

  if (date.toDateString() === today.toDateString()) {
    label = "Today";
  } else if (
    date.toDateString() === yesterday.toDateString()
  ) {
    label = "Yesterday";
  } else {
    const diffDays = Math.floor(
      (today - date) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 7) {
      label = "Last 7 Days";
    } else if (diffDays <= 30) {
      label = "Last Month";
    }
  }

  if (!groups[label]) groups[label] = [];

  groups[label].push(memory);

  return groups;
}, {});

const timelineOrder = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last Month",
  "Older",
];



const categories = [
  "All",
  "Personal",
  "Programming",
  "Education",
  "Work",
  "Preference",
  "Goal",
];

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
<div className="mt-4 mb-6 flex flex-wrap gap-2">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        selectedCategory === category
          ? "bg-cyan-500 text-white"
          : isLight
          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {category}
    </button>
  ))}
</div>
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
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  <div
    className={`rounded-2xl border p-5 ${
      isLight
        ? "border-slate-200 bg-white"
        : "border-slate-800 bg-slate-900"
    }`}
  >
    <p className="text-sm text-slate-400">
      Total Memories
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      🧠 {memories.length}
    </h2>
  </div>

  <div
    className={`rounded-2xl border p-5 ${
      isLight
        ? "border-slate-200 bg-white"
        : "border-slate-800 bg-slate-900"
    }`}
  >
    <p className="text-sm text-slate-400">
      Today's Memories
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      📅 {
        memories.filter(
          m =>
            new Date(m.created_at).toDateString() ===
            new Date().toDateString()
        ).length
      }
    </h2>
  </div>

  <div
    className={`rounded-2xl border p-5 ${
      isLight
        ? "border-slate-200 bg-white"
        : "border-slate-800 bg-slate-900"
    }`}
  >
    <p className="text-sm text-slate-400">
      Memory Status
    </p>

    <h2
  className={`mt-2 text-2xl font-bold ${
    memoryEnabled
      ? "text-green-500"
      : "text-red-500"
  }`}
>
  {memoryEnabled ? "✅ Enabled" : "❌ Disabled"}
</h2>
  </div>

  <div
    className={`rounded-2xl border p-5 ${
      isLight
        ? "border-slate-200 bg-white"
        : "border-slate-800 bg-slate-900"
    }`}
  >
    <p className="text-sm text-slate-400">
      Auto Save
    </p>

    <h2
  className={`mt-2 text-2xl font-bold ${
    memoryAutoSave
      ? "text-cyan-500"
      : "text-orange-500"
  }`}
>
  {memoryAutoSave ? "🤖 Active" : "⏸ Disabled"}
</h2>
  </div>
</div>
<div
  className={`rounded-2xl border p-6 ${
    isLight
      ? "border-slate-200 bg-white"
      : "border-slate-800 bg-slate-900"
  }`}
>
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold">
      🕒 Recent Activity
    </h2>

    <span className="text-sm text-slate-400">
      Last 5 memories
    </span>
  </div>

  {memories.length === 0 ? (
    <p className="text-slate-400">
      No recent memories.
    </p>
  ) : (
    <div className="space-y-3">
      {memories
        .slice(0, 5)
        .map((memory) => (
          <div
            key={memory.id}
            className={`rounded-xl border p-3 ${
              isLight
                ? "border-slate-200 bg-slate-50"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <p className="truncate font-medium">
              {memory.user_message}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {new Date(
                memory.created_at
              ).toLocaleString()}
            </p>
          </div>
        ))}
    </div>
  )}
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
  <div className="space-y-8">
  {timelineOrder
    .filter((group) => groupedMemories[group])
    .map((group) => (
      <div key={group}>
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`h-px flex-1 ${
              isLight
                ? "bg-slate-300"
                : "bg-slate-700"
            }`}
          />

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              isLight
                ? "bg-cyan-100 text-cyan-700"
                : "bg-cyan-500/10 text-cyan-300"
            }`}
          >
            📅 {group}
          </span>

          <div
            className={`h-px flex-1 ${
              isLight
                ? "bg-slate-300"
                : "bg-slate-700"
            }`}
          />
        </div>

        <div className="space-y-5">
          {groupedMemories[group].map((memory) => (
            <div
              key={memory.id}
              className={`rounded-2xl border p-6 shadow-lg transition-all duration-300 ${
  isLight
    ? "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl"
    : "border-slate-700 bg-slate-800/70"
}`}>
            
                <div className="mb-3">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      isLight
        ? "bg-cyan-100 text-cyan-700"
        : "bg-cyan-500/10 text-cyan-300"
    }`}
  >
    🏷️ {getCategory(memory.user_message)}
  </span>
</div>
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
  <p
    className={`text-xs ${
      isLight ? "text-slate-500" : "text-slate-500"
    }`}
  >
    {new Date(memory.created_at).toLocaleString()}
  </p>

  <div className="flex items-center gap-2">
    <button
      onClick={async () => {
        const confirmDelete = window.confirm(
          "Delete this memory?"
        );

        if (!confirmDelete) return;

        try {
          const response = await api.delete(
  `/memory/item/${memory.id}`
);

const data = response.data;

if (data.success) {
  await loadMemories();
}
        } catch (error) {
          console.error(error);
        }
      }}
      className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700"
    >
      🗑 Delete
    </button>
<button

  onClick={() => {
    setSelectedMemory(memory);
    setEditOpen(true);
  }}
  className="rounded-lg bg-amber-500 p-2 text-white transition hover:bg-amber-600"
>
  <Edit size={16} />
</button>

<button
  onClick={() => copyMemory(memory)}
  className="rounded-lg bg-cyan-600 p-2 text-white transition hover:bg-cyan-700"
>
  <Copy size={16} />
</button>

    <span
      className={`rounded-full px-3 py-1 text-xs ${
        isLight
          ? "bg-cyan-100 text-cyan-700"
          : "bg-cyan-900/40 text-cyan-300"
      }`}
    >
      #{memory.id}
    </span>
  </div>
</div>
            </div>
                   ))}
        </div>
      </div>
    )
  )}
</div>
      )}
       <EditMemoryModal
        open={editOpen}
        memory={selectedMemory}
        onClose={() => {
          setEditOpen(false);
          setSelectedMemory(null);
        }}
        onSave={handleSaveMemory}
      />
    </div>
  );
}

export default Memory;
