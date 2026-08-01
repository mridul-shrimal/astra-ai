import { Search } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

function SearchBar({
  searchQuery,
  onSearchChange,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`border-b p-4 ${
        isLight
          ? "border-slate-200"
          : "border-slate-800"
      }`}
    >
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={searchQuery}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search chats..."
          className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none ${
            isLight
              ? "border-slate-300 bg-white"
              : "border-slate-700 bg-slate-900 text-white"
          }`}
        />
      </div>
    </div>
  );
}

export default SearchBar;