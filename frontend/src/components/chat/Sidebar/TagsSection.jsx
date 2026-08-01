import { useTheme } from "../../../context/ThemeContext";

function TagsSection({
  tags,
  selectedTag,
  setSelectedTag,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (tags.length === 0) return null;

  return (
    <div
      className={`border-b p-4 ${
        isLight
          ? "border-slate-200"
          : "border-slate-800"
      }`}
    >
      <p
        className={`mb-2 text-xs font-bold uppercase ${
          isLight
            ? "text-slate-500"
            : "text-slate-400"
        }`}
      >
        🏷 Tags
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag("All")}
          className={`rounded-full px-3 py-1 text-xs transition ${
            selectedTag === "All"
              ? "bg-cyan-500 text-white"
              : isLight
              ? "bg-slate-100 hover:bg-slate-200"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          All
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              selectedTag === tag
                ? "bg-cyan-500 text-white"
                : isLight
                ? "bg-slate-100 hover:bg-slate-200"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TagsSection;