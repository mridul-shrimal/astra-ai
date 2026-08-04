import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const SearchBar = forwardRef(
  (
    {
      searchQuery,
      onSearchChange,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
      <div>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            ref={ref}
            value={searchQuery}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search chats..."
            className={`w-full rounded-xl border py-3 pl-10 pr-10 outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ${
              isLight
                ? "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                : "border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
            }`}
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-700/20 hover:text-cyan-400"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;