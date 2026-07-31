import { Bell, Mic, Search } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ProfileMenu from "../profile/ProfileMenu";

function Header() {
  const { theme } = useTheme();

  return (
    <header
      className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-300 ${
        theme === "light"
          ? "bg-white border-slate-200"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      {/* Left Section */}
      <div>
        <h2
          className={`text-xl font-semibold ${
            theme === "light"
              ? "text-slate-900"
              : "text-white"
          }`}
        >
          Welcome to Astra AI
        </h2>

        <p
          className={`text-sm ${
            theme === "light"
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          Your Personal AI Assistant
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button
          className={`p-2 rounded-lg transition ${
            theme === "light"
              ? "bg-slate-100 hover:bg-slate-200"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          <Search
            size={18}
            className={
              theme === "light"
                ? "text-slate-700"
                : "text-slate-300"
            }
          />
        </button>

        {/* Voice */}
        <button
          className={`p-2 rounded-lg transition ${
            theme === "light"
              ? "bg-slate-100 hover:bg-slate-200"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          <Mic size={18} className="text-cyan-400" />
        </button>

        {/* Notifications */}
        <button
          className={`p-2 rounded-lg transition ${
            theme === "light"
              ? "bg-slate-100 hover:bg-slate-200"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          <Bell
            size={18}
            className={
              theme === "light"
                ? "text-slate-700"
                : "text-slate-300"
            }
          />
        </button>

        {/* Profile */}
        <ProfileMenu />
      </div>
    </header>
  );
}

export default Header;