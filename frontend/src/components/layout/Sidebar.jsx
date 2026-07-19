import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Settings,
} from "lucide-react";

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
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          🚀 Astra AI
        </h1>

        <p className="text-slate-400 text-sm mt-1">
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
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg"
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
      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-500 text-center">
          Astra AI v0.1
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;