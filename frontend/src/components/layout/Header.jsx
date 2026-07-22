import { Bell, Mic, Search, UserCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

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

        <button
  className={`p-2 rounded-lg transition ${
    theme === "light"
      ? "bg-slate-100 hover:bg-slate-200"
      : "bg-slate-800 hover:bg-slate-700"
  }`}
>
          <Mic size={18} className="text-cyan-400" />
        </button>

        <button
  className={`p-2 rounded-lg transition ${
    theme === "light"
      ? "bg-slate-100 hover:bg-slate-200"
      : "bg-slate-800 hover:bg-slate-700"
  }`}
>
          <Bell size={18} className="text-slate-300" />
        </button>

        <div
  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
    theme === "light"
      ? "bg-slate-100"
      : "bg-slate-800"
  }`}
>
          <UserCircle size={22} className="text-cyan-400" />
          <span
  className={`text-sm ${
    theme === "light"
      ? "text-slate-900"
      : "text-white"
  }`}
>
    Mridul
  </span>
</div>

</div>

</header>
  );
}

export default Header;