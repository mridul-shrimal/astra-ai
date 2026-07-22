import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Settings,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Memory",
    path: "/memory",
    icon: Brain,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  const { theme } = useTheme();

  return (
    <aside
      className={`w-64 flex flex-col border-r transition-colors duration-300 ${
        theme === "light"
          ? "bg-white border-slate-200"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      {/* Logo */}
      <div
        className={`p-6 border-b ${
          theme === "light"
            ? "border-slate-200"
            : "border-slate-800"
        }`}
      >
        <h1 className="text-2xl font-bold text-cyan-400">
          🚀 Astra AI
        </h1>

        <p
          className={`mt-1 text-sm ${
            theme === "light"
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          Personal AI Assistant
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg"
                    : theme === "light"
                    ? "text-slate-700 hover:bg-slate-100 hover:text-cyan-600"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={`border-t p-4 ${
          theme === "light"
            ? "border-slate-200"
            : "border-slate-800"
        }`}
      >
        <p className="text-center text-xs text-slate-500">
          Astra AI v0.1
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;