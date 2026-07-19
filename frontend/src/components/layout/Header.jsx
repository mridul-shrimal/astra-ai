import { Bell, Mic, Search, UserCircle } from "lucide-react";

function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
      {/* Left Section */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Welcome to Astra AI
        </h2>
        <p className="text-sm text-slate-400">
          Your Personal AI Assistant
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
          <Search size={18} className="text-slate-300" />
        </button>

        <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
          <Mic size={18} className="text-cyan-400" />
        </button>

        <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
          <Bell size={18} className="text-slate-300" />
        </button>

        <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg">
          <UserCircle size={22} className="text-cyan-400" />
          <span className="text-sm text-white">Mridul</span>
        </div>
      </div>
    </header>
  );
}

export default Header;